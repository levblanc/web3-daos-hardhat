import { ethers, network } from "hardhat";
import path from "path";
import fs from "fs-extra";
import {
    developmentChains,
    FUNC,
    NEW_STORE_VALUE,
    PROPOSAL_DESCRIPTION,
    VOTING_DELAY,
    proposalsFile,
} from "../helper-hardhat-config";
import run from "../utils/runScript";
import moveBlocks from "../utils/moveBlocks";

const propose = async (
    functionName: string,
    functionArgs: any[],
    proposalDescription: string
) => {
    const isLocalNetwork = developmentChains.includes(network.name);

    const governor = await ethers.getContract("GovernorContract");
    const box = await ethers.getContract("Box");
    const encodedFunctionCall = box.interface.encodeFunctionData(
        functionName,
        functionArgs
    );

    console.log(
        ">>>>>> Proposing",
        functionName,
        "on",
        box.address,
        "with ",
        functionArgs
    );
    console.log(">>>>>> Proposal description:", proposalDescription);

    const proposeTx = await governor.propose(
        [box.address], // target contract
        [0], // value
        [encodedFunctionCall], // calldata in bytes
        proposalDescription
    );

    const proposeReceipt = await proposeTx.wait(1);

    if (isLocalNetwork) {
        await moveBlocks(VOTING_DELAY + 1);
    }

    const { proposalId } = proposeReceipt.events[0].args;
    console.log(">>>>>> Proposed with proposal ID:", proposalId.toString());

    // See {ProposalState} at @openzeppelin/contracts/governance/IGovernor.sol
    // 0: Pending, 1: Active
    const proposalState = await governor.state(proposalId);
    console.log(">>>>>> Proposal State:", proposalState);

    // See {proposalSnapshot} at @openzeppelin/contracts/governance/Governor.sol
    // Block number used to retrieve user's votes and quorum.
    const proposalSnapshot = await governor.proposalSnapshot(proposalId);
    console.log(">>>>>> Proposal Snapshot:", proposalSnapshot.toString());

    // See {proposalDeadline} at @openzeppelin/contracts/governance/Governor.sol
    // Block number at which votes close.
    const proposalDeadline = await governor.proposalDeadline(proposalId);
    console.log(">>>>>> Proposal Deadline:", proposalDeadline.toString());

    // Store proposal ID
    storeProposalId(proposalId.toString());
};

const storeProposalId = (proposalId: string) => {
    console.log(">>>>>> Storing proposal ID...");

    const proposalFilePath = path.resolve(__dirname, "../", proposalsFile);
    const chainId = network.config.chainId!.toString();
    let proposalsData;

    if (!fs.pathExistsSync(proposalFilePath)) {
        try {
            fs.createFileSync(proposalFilePath);
            proposalsData = {};
            proposalsData[chainId] = [];
        } catch (error) {
            console.log(">>>>>> fs.createFileSync ERROR", error);
        }
    } else {
        const currentData = fs.readFileSync(proposalFilePath, "utf8");
        proposalsData = JSON.parse(currentData);
    }

    if (proposalsData[chainId].includes(proposalId)) {
        console.log(">>>>>> Proposal ID already exist! Aborting update.");

        return;
    }

    proposalsData[chainId].push(proposalId);

    try {
        fs.writeFileSync(
            proposalFilePath,
            JSON.stringify(proposalsData, null, 2),
            {
                encoding: "utf-8",
            }
        );
        console.log(
            ">>>>>> Proposals file",
            proposalFilePath,
            "update success!"
        );
    } catch (error) {
        console.log(">>>>>> fs.writeFileSync ERROR", error);
    }
};

const proposeArgs = [FUNC, [NEW_STORE_VALUE], PROPOSAL_DESCRIPTION];

run(propose, proposeArgs);
