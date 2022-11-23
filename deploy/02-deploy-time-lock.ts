import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import {
    developmentChains,
    LOCAL_BLOCK_CONFIRMATIONS,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    MIN_DELAY,
} from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployTimeLock: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const {
        getNamedAccounts,
        deployments: { deploy, log },
        network,
    } = hre;
    const { deployer } = await getNamedAccounts();
    const isLocalNetwork = developmentChains.includes(network.name);

    log("-----------------------------------------");

    const args = [MIN_DELAY, [], []];
    const waitConfirmations: number = isLocalNetwork
        ? LOCAL_BLOCK_CONFIRMATIONS
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const timeLock = await deploy("TimeLock", {
        from: deployer,
        args,
        log: true,
        waitConfirmations,
    });

    if (!isLocalNetwork && process.env.ETHERSCAN_API_KEY) {
        await verify(timeLock.address, args);
    }
};

export default deployTimeLock;

deployTimeLock.tags = ["all", "timeLock"];
