import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";
import { ADDRESS_ZERO } from "../helper-hardhat-config";

const setupContracts: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const {
        getNamedAccounts,
        deployments: { log },
        network,
    } = hre;
    const { deployer } = await getNamedAccounts();
    const timeLock = await ethers.getContract("TimeLock", deployer);
    const governor = await ethers.getContract("GovernorContract", deployer);

    log("-----------------------------------------");

    log(">>>>>> Setting up roles...");

    const proposerRole = await timeLock.PROPOSER_ROLE();
    const executorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

    const proposerSetupTx = await timeLock.grantRole(
        proposerRole,
        governor.address
    );
    await proposerSetupTx.wait(1);

    // Giving executor role to nobody, which means everybody
    const executorSetupTx = await timeLock.grantRole(
        executorRole,
        ADDRESS_ZERO
    );
    await executorSetupTx.wait(1);

    // After everything's setup, revoke `deployer`'s admin role
    const revokeAdminTx = await timeLock.revokeRole(adminRole, deployer);
    await revokeAdminTx.wait(1);

    log(">>>>>> Roles setup done!");
};

export default setupContracts;

setupContracts.tags = ["all", "setup"];
