import { network } from "hardhat";

const moveBlocks = async (blocks: number) => {
    console.log(">>>>>> Moving blocks...");

    for (let index = 0; index < blocks; index++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        });
    }

    console.log(`>>>>>> Moved ${blocks} blocks`);
};

export default moveBlocks;
