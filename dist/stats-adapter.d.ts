import { IStats } from './model';
import { PIXIHooks } from './pixi-hooks';
import { StatStorage } from './stat-storage';
export declare class StatsJSAdapter {
    hook: PIXIHooks;
    stats: IStats;
    dcStat?: StatStorage;
    tcStat?: StatStorage;
    constructor(hook: PIXIHooks, stats: IStats);
    update(): void;
    reset(): void;
}
//# sourceMappingURL=stats-adapter.d.ts.map