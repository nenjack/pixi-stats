import { StatStorage } from './stat-storage';
export declare class RenderPanel {
    dom: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
    fg: string;
    bg: string;
    name: string;
    statStorage: StatStorage | null;
    constructor(name: string, fg: string, bg: string, statStorage: StatStorage);
    update: (value: number, maxValue: number) => void;
    destroy(): void;
}
//# sourceMappingURL=stats-panel.d.ts.map