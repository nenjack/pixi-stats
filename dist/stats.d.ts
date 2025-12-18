import { PIXIHooks } from './pixi-hooks';
import { RenderPanel } from './stats-panel';
import { StatStorage } from './stat-storage';
import { IStats, IPanelConfig, IStatsJSAdapter, Renderer, PIXITicker } from './model';
export declare class Stats implements IStats {
    mode: number;
    frames: number;
    beginTime: number;
    prevTime: number;
    pixiHooks: PIXIHooks;
    adapter: IStatsJSAdapter;
    fpsStat: StatStorage;
    msStat: StatStorage;
    memStat?: StatStorage;
    panels: IPanelConfig[];
    domElement: HTMLDivElement | null;
    containerElement: HTMLElement | null;
    renderPanel: RenderPanel | null;
    /**
     * in document/html/dom context returns document's body
     */
    static getContainerElement(): HTMLElement | undefined;
    constructor(renderer: Renderer, ticker?: PIXITicker, containerElement?: HTMLElement | undefined, autoStart?: boolean);
    initDomElement(): void;
    handleClickPanel: (event: MouseEvent) => void;
    createStat(name: string, fg: string, bg: string): StatStorage;
    showPanel(id?: number): void;
    hidePanel(): void;
    createRenderPanel({ name, fg, bg, statStorage }: IPanelConfig): void;
    removeDomRenderPanel(): void;
    removeDomElement(): void;
    begin(): void;
    end(): number;
    update(): void;
}
//# sourceMappingURL=stats.d.ts.map