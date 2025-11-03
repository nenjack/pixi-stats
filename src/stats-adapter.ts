import { IStats } from './model';
import { PIXIHooks } from './pixi-hooks';
import { StatStorage } from './stat-storage';

export class StatsJSAdapter {
  hook: PIXIHooks;
  stats: IStats;

  dcStat?: StatStorage;
  tcStat?: StatStorage;

  constructor(hook: PIXIHooks, stats: IStats) {
    this.hook = hook;
    this.stats = stats;

    if (this.hook.hooked) {
      this.dcStat = this.stats.createStat('DC', '#f60', '#300');
      this.tcStat = this.stats.createStat('TC', '#0c6', '#033');
    }
  }

  update(): void {
    if (!this.stats) {
      return;
    }

    if (this.hook) {
      this.dcStat?.update(
        this.hook.deltaDrawCalls,
        Math.max(50, this.hook.maxDeltaDrawCalls)
      );

      this.tcStat?.update(
        this.hook.texturesCount,
        Math.max(20, this.hook.maxTextureCount)
      );
    }

    this.stats.update();
  }

  reset(): void {
    if (this.hook) {
      this.hook.reset();
    }
  }
}
