setTimeout(() => {
    if (globalThis._C3_InitRuntime !== undefined) {
        return;
    }

    globalThis._C3_InitRuntime = self.C3_InitRuntime;

    self.C3_InitRuntime = async function (...args) {
        const promise = globalThis._C3_InitRuntime(...args);
        promise.then(v => {
            globalThis._C3_RealRuntime = v;
            return v;
        });
        return promise;
    }
}, 0);

async function getRuntime() {
    if (globalThis._C3_RealRuntime !== undefined) {
        return globalThis._C3_RealRuntime;
    }

    return new Promise(resolve => {
        let interval;

        interval = setInterval(() => {
            if (globalThis._C3_RealRuntime !== undefined) {
                clearInterval(interval);
                resolve(globalThis._C3_RealRuntime);
            }
        }, 100);
    });
}

globalThis.getRuntime = getRuntime;