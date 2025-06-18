// @ts-nocheck
const setRealRuntime = (v) => globalThis._C3_RealRuntime = v;
const disposeRealRuntime = () => {
    if (!globalThis._C3_RealRuntimeShouldDispose) return;

    setInterval(() => {
        if (globalThis._C3_RealRuntime) delete globalThis._C3_RealRuntime;
    }, 1);
}

/**
 * Synchronous way to get the real runtime. Run this only after being sure of running `resolveRuntime(false)` for the first time
 */
const getRealRuntime = () => globalThis._C3_RealRuntime;

globalThis._C3_CreateRuntime = self.C3_CreateRuntime;

self.C3_CreateRuntime = function (...args) {
    const runtime = globalThis._C3_CreateRuntime(...args);

    // @ts-ignore
    delete globalThis["_C3_CreateRuntime"]; // Dispose

    setRealRuntime(runtime);

    return runtime;
};

/**
 * Resolves the real runtime for the first time. It's unknown if it is already resolved in the project, so it's asynchronous.
 * @param bool dispose Deletes the runtime reference from the global object to prevent hacking, this disables `getRealRuntime()`
 */
async function resolveRuntime(dispose = true) {
    const runtime = getRealRuntime();

    globalThis._C3_RealRuntimeShouldDispose = dispose;

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

            globalThis._C3_RealRuntimeShouldDispose = dispose;

            if (dispose) disposeRealRuntime();

            clearInterval(interval);
            return resolve(runtime);
        }, 10);
    });
}

export { getRealRuntime, resolveRuntime };
