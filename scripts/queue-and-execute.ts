import { ethers, network } from "hardhat";
import {
    FUNCTION_TO_CALL,
    NEW_STORE_VALUE,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    MIN_DELAY,
} from "../helper-hardhat-config";
import moveBlocks from "../utils/moveBlocks";
import moveTime from "../utils/moveTime";
import run from "../utils/runScript";

export async function queueAndExecute() {
    const functionArgs = [NEW_STORE_VALUE];
    const functionName = FUNCTION_TO_CALL;

    const box = await ethers.getContract("Box");
    const encodedFunctionCall = box.interface.encodeFunctionData(
        functionName,
        functionArgs
    );
    const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
    );

    const governor = await ethers.getContract("GovernorContract");

    console.log(">>>>>> Queueing...");

    // See {queue} in:
    // @openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol
    // Queue a proposal to the timelock
    const queueTx = await governor.queue(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );

    await queueTx.wait(1);

    const isLocalNetwork = developmentChains.includes(network.name);
    if (isLocalNetwork) {
        await moveTime(MIN_DELAY + 1);
        await moveBlocks(1);
    }

    console.log(">>>>>> Proposal queued!");
    console.log("-----------------------------------------");
    console.log(">>>>>> Executing proposal...");

    // See {execute} in:
    // Interface: @openzeppelin/contracts/governance/IGovernor.sol
    // Implementation: @openzeppelin/contracts/governance/Governor.sol
    const executeTx = await governor.execute(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );
    await executeTx.wait(1);

    console.log(">>>>>> Proposal executed!");

    const boxNewValue = await box.retrieve();
    console.log(
        ">>>>>> Box value after proposal execution:",
        boxNewValue.toString()
    );
}

run(queueAndExecute);
