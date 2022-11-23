import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import {
    developmentChains,
    LOCAL_BLOCK_CONFIRMATIONS,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../helper-hardhat-config";
import verify from "../utils/verify";
import { ethers } from "hardhat";

const deployBox: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {
        getNamedAccounts,
        deployments: { deploy, log },
        network,
    } = hre;
    const { deployer } = await getNamedAccounts();
    const isLocalNetwork = developmentChains.includes(network.name);

    log("-----------------------------------------");

    const args = [];
    const waitConfirmations: number = isLocalNetwork
        ? LOCAL_BLOCK_CONFIRMATIONS
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const box = await deploy("Box", {
        from: deployer,
        args,
        log: true,
        waitConfirmations,
    });

    if (!isLocalNetwork && process.env.ETHERSCAN_API_KEY) {
        await verify(box.address, args);
    }

    log("-----------------------------------------");
    log(">>>>>> Transfering ownership to TimeLock...");

    const timeLock = await ethers.getContract("TimeLock");
    const boxContract = await ethers.getContract("Box");

    const transferOwnershipTx = await boxContract.transferOwnership(
        timeLock.address
    );
    await transferOwnershipTx.wait(1);

    log(">>>>>> Box contract ownership transfered to TimeLock");
};

export default deployBox;

deployBox.tags = ["all", "box"];
