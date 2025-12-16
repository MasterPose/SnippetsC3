async function searchRealRuntime(runtime: IRuntime): Promise<any> {
    return new Promise((resolve) => {
        runtime.addEventListener('beforeprojectstart', () => {
            const objs = Object.values(runtime.objects as ISDKObjectTypeBase_<IInstance>[]);
            // @ts-ignore
            const realRuntime = objs.find((v) => v.plugin.id === 'MasterPose_JailBreak')?.realRuntime ?? (globalThis as any)['C3_RealRuntime'];

            if (!realRuntime) {
                if (runtime.platformInfo.exportType === 'preview') alert("JailBreak plugin is needed.");
                throw new Error("JailBreak plugin is needed.")
            };

            resolve(realRuntime);
        })
    });
}
