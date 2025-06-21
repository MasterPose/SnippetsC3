// @ts-nocheck
const setRealRuntime = (v) => globalThis["C3_RealRuntime"] = v;
const disposeRealRuntime = () => {
    if (!globalThis["C3_RealRuntimeShouldDispose"]) return;

    setInterval(() => {
        if (globalThis["C3_RealRuntime"]) delete globalThis["C3_RealRuntime"];
        if (globalThis["C3_RealRuntimeShouldDispose"] !== undefined) delete globalThis["C3_RealRuntimeShouldDispose"];
    }, 1);
}

/**
 * Synchronous way to get the real runtime. Run this only after being sure of running `resolveRuntime(false)` for the first time
 */
const getRealRuntime = () => globalThis["C3_RealRuntime"];

// Ensure it only gets replaced once
if (!globalThis["_C3_CreateRuntime"]) {
    globalThis["_C3_CreateRuntime"] = self["C3_CreateRuntime"];

    self["C3_CreateRuntime"] = function (...args) {
        const runtime = globalThis["_C3_CreateRuntime"](...args);

        self["C3_CreateRuntime"] = globalThis["_C3_CreateRuntime"]; // Restore original callback

        // @ts-ignore
        setTimeout(() => delete globalThis["_C3_CreateRuntime"], 1);// Dispose

        setRealRuntime(runtime);

        return runtime;
    };
}


/**
 * Resolves the real runtime for the first time. It's unknown if it is already resolved in the project, so it's asynchronous.
 * @param bool dispose Deletes the runtime reference from the global object to prevent hacking, this disables `getRealRuntime()`
 */
async function resolveRuntime(dispose = true) {
    const runtime = getRealRuntime();

    globalThis["C3_RealRuntimeShouldDispose"] = dispose;

    if (runtime && dispose) {
        disposeRealRuntime();
        return runtime;
    }

    return new Promise((resolve, reject) => {
        let interval;

        let tries = 0;

        interval = setInterval(() => {
            const runtime = getRealRuntime();

            if (tries > 100) return reject("Wasn't able to get runtime. Contact developer");

            if (!runtime) return tries++;

            globalThis["C3_RealRuntimeShouldDispose"] = dispose;

            if (dispose) disposeRealRuntime();

            clearInterval(interval);
            return resolve(runtime);
        }, 10);
    });
}

export { getRealRuntime, resolveRuntime };
