"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsJSAdapter = void 0;
class StatsJSAdapter {
    constructor(hook, stats) {
        this.hook = hook;
        this.stats = stats;
        if (this.hook.hooked) {
            this.dcStat = this.stats.createStat('DC', '#f60', '#300');
            this.tcStat = this.stats.createStat('TC', '#0c6', '#033');
        }
    }
    update() {
        var _a, _b;
        if (!this.stats) {
            return;
        }
        if (this.hook) {
            (_a = this.dcStat) === null || _a === void 0 ? void 0 : _a.update(this.hook.deltaDrawCalls, Math.max(50, this.hook.maxDeltaDrawCalls));
            (_b = this.tcStat) === null || _b === void 0 ? void 0 : _b.update(this.hook.texturesCount, Math.max(20, this.hook.maxTextureCount));
        }
        this.stats.update();
    }
    reset() {
        if (this.hook) {
            this.hook.reset();
        }
    }
}
exports.StatsJSAdapter = StatsJSAdapter;
//# sourceMappingURL=stats-adapter.js.map