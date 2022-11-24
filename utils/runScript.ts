const run = async (asyncFunc: Function, asyncFuncArgs: any[]) => {
    try {
        await asyncFunc(...asyncFuncArgs);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default run;
