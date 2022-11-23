import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";
import { developmentChains, ADDRESS_ZERO } from "../helper-hardhat-config";

const setupContracts: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const {
        getNamedAccounts,
        deployments: { deploy, log },
        network,
    } = hre;
    const { deployer } = await getNamedAccounts();
    const isLocalNetwork = developmentChains.includes(network.name);
    const timeLock = await ethers.getContract("TimeLock", deployer);
    const governor = await ethers.getContract("GovernorContract", deployer);

    log("-----------------------------------------");

    log(">>>>>> Setting up roles...");

    const proposerRole = await timeLock.PROPOSER_ROLE();
    const executorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

    const proposerSetupTx = await timeLock.grandRole(
        proposerRole,
        governor.address
    );
    await proposerSetupTx.wait(1);

    // Giving executor role to nobody, which means everybody
    const executorSetupTx = await timeLock.grandRole(
        executorRole,
        ADDRESS_ZERO
    );
    await executorSetupTx.wait(1);

    // After everything's setup, revoke `deployer`'s admin role
    const revokeAdminTx = await timeLock.revokeRole(adminRole, deployer);
    await revokeAdminTx.wait(1);
};

export default setupContracts;

setupContracts.tags = ["all", "setup"];
