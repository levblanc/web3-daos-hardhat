import { ethers } from "hardhat";

export const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
    },
    1: {
        name: "mainnet",
    },
    5: {
        name: "goerli",
    },
};

export const developmentChains = ["hardhat", "localhost"];
export const LOCAL_BLOCK_CONFIRMATIONS = 1;
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
export const MIN_DELAY = 3600; // 1 hour
export const VOTING_PERIOD = 5; // 5 blocks
export const VOTING_DELAY = 1; // 1 blocks
// 4% of voters need to vote for a vote to pass
export const QUORUM_PERCENTAGE = 4;
export const ADDRESS_ZERO = ethers.constants.AddressZero;

export const NEW_STORE_VALUE = 77;
export const FUNCTION_TO_CALL = "store";
export const PROPOSAL_DESCRIPTION = "Proposal #1: Store 77 in the Box.";
export const proposalsFile = "proposals.json";
