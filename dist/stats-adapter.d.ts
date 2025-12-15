import { StatsI, StatsJSAdapterI } from './model';
import { PIXIHooks } from './pixi-hooks';
import { StatStorage } from './stat-storage';
export declare class StatsJSAdapter implements StatsJSAdapterI {
    hook: PIXIHooks;
    stats: StatsI;
    dcStat?: StatStorage;
    tcStat?: StatStorage;
    constructor(hook: PIXIHooks, stats: StatsI);
    update(): void;
    reset(): void;
}
//# sourceMappingURL=stats-adapter.d.ts.map