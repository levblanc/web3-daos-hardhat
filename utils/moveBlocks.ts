import { network } from "hardhat";

const moveBlocks = async (blocks: number, interval: number = 0) => {
    console.log(">>>>>> Moving blocks...");

    for (let index = 0; index < blocks; index++) {
        setInterval(async () => {
            return await network.provider.request({
                method: "evm_mine",
                params: [],
            });
        }, interval);
    }

    console.log(`>>>>>> Moved ${blocks} blocks`);
};

export default moveBlocks;
