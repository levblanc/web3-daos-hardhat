import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";

const { GOERLI_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

const config: HardhatUserConfig = {
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
        },
        localhost: {
            chainId: 31337,
            url: "http://127.0.0.1:8545",
        },
        goerli: {
            chainId: 5,
            url: GOERLI_RPC_URL,
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
        enabled: false,
        outputFile: "gas-report.md",
        noColors: true,
    },
    mocha: {
        timeout: 200000, // maximum time for running tests, in ms
    },
};

export default config;
