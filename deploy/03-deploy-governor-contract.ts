import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import {
    developmentChains,
    LOCAL_BLOCK_CONFIRMATIONS,
    QUORUM_PERCENTAGE,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    VOTING_DELAY,
    VOTING_PERIOD,
} from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployGovernorContract: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const {
        getNamedAccounts,
        deployments: { deploy, log, get },
        network,
    } = hre;
    const { deployer } = await getNamedAccounts();
    const isLocalNetwork = developmentChains.includes(network.name);

    log("-----------------------------------------");

    const governanceToken = await get("GovernanceToken");
    const timeLock = await get("TimeLock");
    const args = [
        governanceToken.address,
        timeLock.address,
        VOTING_DELAY,
        VOTING_PERIOD,
        QUORUM_PERCENTAGE,
    ];

    const waitConfirmations: number = isLocalNetwork
        ? LOCAL_BLOCK_CONFIRMATIONS
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args,
        log: true,
        waitConfirmations,
    });

    if (!isLocalNetwork && process.env.ETHERSCAN_API_KEY) {
        await verify(governorContract.address, args);
    }
};

export default deployGovernorContract;

deployGovernorContract.tags = ["all", "governorContract"];
