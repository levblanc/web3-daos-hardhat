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
export const MIN_DELAY = 3600;
