import { PIXIHooks } from './pixi-hooks';
import { Panel, RenderPanel } from './stats-panel';
import { Renderer } from './model';
import { StatsJSAdapter } from './stats-adapter';
export declare class Stats {
    mode: number;
    frames: number;
    beginTime: number;
    prevTime: number;
    domElement: HTMLDivElement | null;
    containerElement: HTMLElement | null;
    pixiHooks: PIXIHooks;
    adapter: StatsJSAdapter;
    fpsPanel: Panel;
    msPanel: Panel;
    memPanel?: Panel;
    panels: Panel[];
    renderPanel: RenderPanel | null;
    wasInitDomElement: boolean;
    constructor(renderer: Renderer, ticker?: {
        add: (fn: () => void) => void;
    }, containerElement?: HTMLElement);
    initDomElement(): void;
    handleClickPanel: (event: MouseEvent) => void;
    addPanel(panel: Panel): Panel;
    showPanel(id: number): void;
    createRenderPanel(panel: Panel): void;
    removeDomRenderPanel(): void;
    removeDomElement(): void;
    begin(): void;
    end(): number;
    update(): void;
}
//# sourceMappingURL=stats.d.ts.map