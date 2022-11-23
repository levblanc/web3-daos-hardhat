import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import {
    developmentChains,
    LOCAL_BLOCK_CONFIRMATIONS,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../helper-hardhat-config";
import { ethers } from "hardhat";
import verify from "../utils/verify";

const GOVERNANCE_TOKEN: string = "GovernanceToken";

const deployGovernanceToken: DeployFunction = async (
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

    const args = [];
    const waitConfirmations: number = isLocalNetwork
        ? LOCAL_BLOCK_CONFIRMATIONS
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const governanceToken = await deploy(GOVERNANCE_TOKEN, {
        from: deployer,
        args,
        log: true,
        waitConfirmations,
    });

    if (!isLocalNetwork && process.env.ETHERSCAN_API_KEY) {
        await verify(governanceToken.address, args);
    }

    log("-----------------------------------------");

    // Calls {delegate} to activate checkpoints and track voting power
    // See NOTE at the top of:
    // @openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol
    log(">>>>>> Delegating to", deployer);

    await delegate(governanceToken.address, deployer);

    log(">>>>>> Delegated!");
};

const delegate = async (
    governanceTokenAddress: string,
    delegatedAccount: string
) => {
    const governanceToken = await ethers.getContractAt(
        GOVERNANCE_TOKEN,
        governanceTokenAddress
    );
    const tx = await governanceToken.delegate(delegatedAccount);
    await tx.wait(1);

    console.log(
        ">>>>>> Num of Checkpoints",
        await governanceToken.numCheckpoints(delegatedAccount)
    );
};

export default deployGovernanceToken;

deployGovernanceToken.tags = ["all", "governanceToken"];
