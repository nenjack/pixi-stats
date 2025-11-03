"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatStorage = void 0;
class StatStorage {
    constructor() {
        this.values = [];
        this.snapshotSize = 30; // min~max of X frames total
        this.updateCallbacksSet = new Set();
    }
    get min() {
        return this.values
            .reduce((min, value) => Math.min(min, value), Infinity)
            .toFixed();
    }
    get max() {
        return this.values
            .reduce((max, value) => Math.max(max, value), 0)
            .toFixed();
    }
    get averageValue() {
        return (this.values.reduce((sum, value) => sum + value, 0) /
            this.values.length).toFixed(1);
    }
    pushValue(value) {
        this.values.push(value);
        if (this.values.length > this.snapshotSize) {
            this.values = this.values.slice(-this.snapshotSize);
        }
    }
    update(value, maxValue) {
        this.pushValue(value);
        if (this.updateCallbacksSet.size) {
            this.updateCallbacksSet.forEach((cb) => cb(value, maxValue));
        }
    }
    addCallback(cb) {
        if (typeof cb === 'function') {
            this.updateCallbacksSet.add(cb);
        }
    }
    removeCallback(cb) {
        this.updateCallbacksSet.delete(cb);
    }
    clearCallbacks() {
        this.updateCallbacksSet.clear();
    }
}
exports.StatStorage = StatStorage;
//# sourceMappingURL=stat-storage.js.map