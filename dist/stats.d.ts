import { PIXIHooks } from './pixi-hooks';
import { RenderPanel } from './stats-panel';
import { StatStorage } from './stat-storage';
import { IStats, PanelConfig, Renderer, StatsJSAdapterI } from './model';
export declare class Stats implements IStats {
    mode: number;
    frames: number;
    beginTime: number;
    prevTime: number;
    pixiHooks: PIXIHooks;
    adapter: StatsJSAdapterI;
    fpsStat: StatStorage;
    msStat: StatStorage;
    memStat?: StatStorage;
    panels: PanelConfig[];
    domElement: HTMLDivElement | null;
    containerElement: HTMLElement | null;
    renderPanel: RenderPanel | null;
    /**
     * in document/html/dom context returns document's body
     */
    static getContainerElement(): HTMLElement | undefined;
    constructor(renderer: Renderer, ticker?: {
        add: (fn: () => void) => void;
    }, containerElement?: HTMLElement | null | undefined);
    initDomElement(): void;
    handleClickPanel: (event: MouseEvent) => void;
    createStat(name: string, fg: string, bg: string): StatStorage;
    showPanel(id?: number): void;
    hidePanel(): void;
    createRenderPanel({ name, fg, bg, statStorage }: PanelConfig): void;
    removeDomRenderPanel(): void;
    removeDomElement(): void;
    begin(): void;
    end(): number;
    update(): void;
}
//# sourceMappingURL=stats.d.ts.map