async function searchRealRuntime(runtime) {
    return new Promise((resolve) => {
        runtime.addEventListener('beforeprojectstart', () => {
            const objs = Object.values(runtime.objects);
            const realRuntime = objs.find((v) => v.plugin.id === 'MasterPose_JailBreak')?.realRuntime ?? (globalThis)['C3_RealRuntime'];

            if (!realRuntime) {
                if (runtime.platformInfo.exportType === 'preview') alert("JailBreak plugin is needed.");
                throw new Error("JailBreak plugin is needed.")
            };

            resolve(realRuntime);
        })
    });
}
