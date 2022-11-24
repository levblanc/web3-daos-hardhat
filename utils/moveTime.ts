import { network } from "hardhat";

const moveTime = async (amount: number) => {
    console.log(">>>>>> Moving time...");

    await network.provider.send("evm_increaseTime", [amount]);

    console.log(">>>>>> Fast forward in time for", amount, "seconds.");
};

export default moveTime;
