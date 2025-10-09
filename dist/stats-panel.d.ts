type UpdateCallbackType = (value: number, maxValue: number) => void;
export declare class Panel {
    values: number[];
    snapshotSize: number;
    name: string;
    fg: string;
    bg: string;
    updateCallback: UpdateCallbackType | null;
    constructor(name: string, fg: string, bg: string);
    get min(): string;
    get max(): string;
    get averageValue(): string;
    addCallback: (cb: UpdateCallbackType | null) => void;
    pushValue(value: number): void;
    update(value: number, maxValue: number): void;
}
export declare class RenderPanel {
    dom: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
    panel: Panel | null;
    constructor(panel: Panel);
    update(value: number, maxValue: number): void;
    destroy(): void;
}
export {};
//# sourceMappingURL=stats-panel.d.ts.map