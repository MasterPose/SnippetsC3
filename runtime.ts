export let runtime: IRuntime;

export let realRuntime: any;

type TickCallback = (runtime: IRuntime) => void;

const tickCallbacks = new Set<TickCallback>();

export function exportRuntime(passedRuntime: IRuntime) {
    if (runtime) throw new Error("Can't register runtime twice!");

    runtime = passedRuntime;

    runtime.addEventListener('tick', () => {
        if (!tickCallbacks.size) return;

        for (const callback of tickCallbacks) callback(runtime);

        tickCallbacks.clear();
    });
}

export function exportRealRuntime(passedRealRuntime: any) {
    if (realRuntime) throw new Error("Can't register runtime twice!");

    realRuntime = passedRealRuntime;
}

export function nextTick(callback: TickCallback) {
    tickCallbacks.add(callback);
}
