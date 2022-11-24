const run = async (asyncFunc: Function, asyncFuncArgs?: any[]) => {
    try {
        asyncFuncArgs ? await asyncFunc(...asyncFuncArgs) : await asyncFunc();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default run;
