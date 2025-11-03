import { UpdateCallbackType } from "./model";


export class StatStorage {
  values: number[] = [];
  snapshotSize: number = 30; // min~max of X frames total
  updateCallbacksSet: Set<UpdateCallbackType> = new Set();

  get min(): string {
    return this.values
      .reduce((min: number, value: number) => Math.min(min, value), Infinity)
      .toFixed();
  }

  get max(): string {
    return this.values
      .reduce((max: number, value: number) => Math.max(max, value), 0)
      .toFixed();
  }

  get averageValue(): string {
    return (
      this.values.reduce((sum: number, value: number) => sum + value, 0) /
      this.values.length
    ).toFixed(1);
  }

  pushValue(value: number) {
    this.values.push(value);

    if (this.values.length > this.snapshotSize) {
      this.values = this.values.slice(-this.snapshotSize);
    }
  }

  update(value: number, maxValue: number) {
    this.pushValue(value);
    if (this.updateCallbacksSet.size) {
      this.updateCallbacksSet.forEach((cb) => cb(value, maxValue));
    }
  }

  addCallback(cb: UpdateCallbackType) {
    if (typeof cb === 'function') {
      this.updateCallbacksSet.add(cb);
    }
  }

  removeCallback(cb: UpdateCallbackType) {
    this.updateCallbacksSet.delete(cb);
  }

  clearCallbacks() {
    this.updateCallbacksSet.clear();
  }
}
