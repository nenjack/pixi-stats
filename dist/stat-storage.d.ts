import { UpdateCallbackType } from "./model";
export declare class StatStorage {
    values: number[];
    snapshotSize: number;
    updateCallbacksSet: Set<UpdateCallbackType>;
    get min(): string;
    get max(): string;
    get averageValue(): string;
    pushValue(value: number): void;
    update(value: number, maxValue: number): void;
    addCallback(cb: UpdateCallbackType): void;
    removeCallback(cb: UpdateCallbackType): void;
    clearCallbacks(): void;
}
//# sourceMappingURL=stat-storage.d.ts.map