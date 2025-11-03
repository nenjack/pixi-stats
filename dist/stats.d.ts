import { PIXIHooks } from './pixi-hooks';
import { RenderPanel } from './stats-panel';
import { StatStorage } from './stat-storage';
import { Renderer } from './model';
import { StatsJSAdapter } from './stats-adapter';
export type PanelConfig = {
    name: string;
    fg: string;
    bg: string;
    statStorage: StatStorage;
};
export declare class Stats {
    mode: number;
    frames: number;
    beginTime: number;
    prevTime: number;
    domElement: HTMLDivElement | null;
    containerElement: HTMLElement | null;
    pixiHooks: PIXIHooks;
    adapter: StatsJSAdapter;
    fpsStat: StatStorage;
    msStat: StatStorage;
    memStat?: StatStorage;
    panels: PanelConfig[];
    renderPanel: RenderPanel | null;
    wasInitDomElement: boolean;
    constructor(renderer: Renderer, containerElement: HTMLElement, ticker?: {
        add: (fn: () => void) => void;
    });
    initDomElement(): void;
    handleClickPanel: (event: MouseEvent) => void;
    createStat(name: string, fg: string, bg: string): StatStorage;
    showPanel(id: number): void;
    hidePanel(): void;
    createRenderPanel({ name, fg, bg, statStorage }: PanelConfig): void;
    removeDomRenderPanel(): void;
    removeDomElement(): void;
    begin(): void;
    end(): number;
    update(): void;
}
//# sourceMappingURL=stats.d.ts.map