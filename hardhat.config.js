require("@nomicfoundation/hardhat-toolbox")
require('hardhat-deploy')
require("dotenv").config()

const {
    LOCAL_BLOCK_CONFIRMATIONS,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    ENABLE_GAS_REPORTER
} = require("./helper-hardhat-config");

const { GOERLI_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.17",
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: LOCAL_BLOCK_CONFIRMATIONS,
        },
        localhost: {
            chainId: 31337,
            blockConfirmations: LOCAL_BLOCK_CONFIRMATIONS,
            url: "http://127.0.0.1:8545",
        },
        goerli: {
            chainId: 5,
            url: GOERLI_RPC_URL,
            blockConfirmations: VERIFICATION_BLOCK_CONFIRMATIONS,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
        customChains: [
            {
                network: "goerli",
                chainId: 5,
                urls: {
                    apiURL: "http://api-goerli.etherscan.io/api",
                    browserURL: "https://goerli.etherscan.io",
                },
            },
        ],
    },
    gasReporter: {
        enabled: ENABLE_GAS_REPORTER,
        outputFile: "gas-report.md",
        noColors: true,
    },
    contractSizer: {
        runOnCompile: false,
    },
    mocha: {
        timeout: 200000, // maximum time for running tests, in ms
    },
}
