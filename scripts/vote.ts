import fs from "fs-extra";
import { ethers, network } from "hardhat";
import path from "path";
import {
    developmentChains,
    proposalsFile,
    VOTING_PERIOD,
} from "../helper-hardhat-config";
import moveBlocks from "../utils/moveBlocks";
import run from "../utils/runScript";

const main = async () => {
    const proposalFilePath = path.resolve(__dirname, "../", proposalsFile);

    try {
        const proposals = JSON.parse(
            fs.readFileSync(proposalFilePath, "utf-8")
        );
        const proposalId = proposals[network.config.chainId!].at(-1);

        if (!proposalId) {
            console.error(">>>>>> Error: `proposalId` is", proposalId);
            return;
        }

        // See {VoteType} in
        // @openzeppelin/contracts/governance/compatibility/GovernorCompatibilityBravo.sol
        // 0 = Against, 1 = For, 2 = Abstain
        const voteWay = 1;
        const reason = "I agree with this proposal!";

        await vote(proposalId, voteWay, reason);
    } catch (error) {
        console.log(">>>>>> Vote error", error);
    }
};

export async function vote(
    proposalId: string,
    voteWay: number,
    reason: string
) {
    console.log(">>>>>> Voting...");
    const isLocalNetwork = developmentChains.includes(network.name);
    let proposalState;

    const governor = await ethers.getContract("GovernorContract");
    proposalState = await governor.state(proposalId);

    if (proposalState !== 1) {
        console.log(
            ">>>>>> Vote is not active. Proposal State:",
            proposalState
        );
        return;
    }

    const voteTx = await governor.castVoteWithReason(
        proposalId,
        voteWay,
        reason
    );
    const voteTxReceipt = await voteTx.wait(1);

    if (isLocalNetwork) {
        await moveBlocks(VOTING_PERIOD + 1);
    }

    proposalState = await governor.state(proposalId);
    console.log(">>>>>> Proposal State:", proposalState);

    if (proposalState === 4) {
        console.log(
            ">>>>>> Vote succeeded with reason",
            voteTxReceipt.events[0].args.reason
        );
    }
}

run(main);
