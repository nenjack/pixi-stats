import { PIXIHooks } from './pixi-hooks';
import { RenderPanel } from './stats-panel';
import { StatStorage } from './stat-storage';
import { Renderer } from './model';
import { StatsJSAdapter } from './stats-adapter';
import { DOM_ELEMENT_ID } from './stats-constants';

export type PanelConfig = {
  name: string;
  fg: string;
  bg: string;
  statStorage: StatStorage;
};

export class Stats {
  mode = -1;
  frames = 0;

  beginTime: number;
  prevTime: number;
  domElement: HTMLDivElement | null = null;
  containerElement: HTMLElement | null = null;
  pixiHooks: PIXIHooks;
  adapter: StatsJSAdapter;

  fpsStat: StatStorage;
  msStat: StatStorage;
  memStat?: StatStorage;

  panels: PanelConfig[] = [];
  renderPanel: RenderPanel | null = null;
  wasInitDomElement: boolean = false;

  constructor(
    renderer: Renderer,
    containerElement: HTMLElement,
    ticker?: { add: (fn: () => void) => void }
  ) {
    this.beginTime = (performance || Date).now();
    this.prevTime = this.beginTime;

    this.fpsStat = this.createStat('FPS', '#3ff', '#002');
    this.msStat = this.createStat('MS', '#0f0', '#020');

    if ('memory' in performance) {
      this.memStat = this.createStat('MB', '#f08', '#200');
    }

    this.pixiHooks = new PIXIHooks(renderer);
    this.adapter = new StatsJSAdapter(this.pixiHooks, this);

    if (containerElement) {
      this.containerElement = containerElement;
    }

    if ('animations' in renderer) {
      renderer.animations.push(() => {
        this.adapter.update();
      });
    } else {
      if (ticker) {
        ticker.add(() => {
          this.adapter.update();
        });
      } else {
        const frame = () => {
          this.adapter.update();
          requestAnimationFrame(frame);
        };

        frame();
      }
    }
  }

  initDomElement(): void {
    if (this.containerElement && !this.wasInitDomElement) {
      this.domElement = document.createElement('div');
      this.domElement.id = DOM_ELEMENT_ID;
      this.domElement.addEventListener('click', this.handleClickPanel, false);
      this.containerElement.appendChild(this.domElement);
      this.wasInitDomElement = true;
    }
  }

  handleClickPanel = (event: MouseEvent): void => {
    event.preventDefault();
    this.showPanel(++this.mode % this.panels.length);
  };

  createStat(name: string, fg: string, bg: string): StatStorage {
    const statStorage = new StatStorage();
    this.panels.push({ name, fg, bg, statStorage });
    return statStorage;
  }

  showPanel(id: number) {
    const panel = this.panels[id];

    if (panel) {
      this.initDomElement();
      this.removeDomRenderPanel();
      this.createRenderPanel(panel);
      this.mode = id;
    } else {
      this.hidePanel();
    }
  }

  hidePanel() {
    this.removeDomRenderPanel();
    this.removeDomElement();
    this.mode = -1;
  }

  createRenderPanel({ name, fg, bg, statStorage }: PanelConfig): void {
    if (this.domElement) {
      this.renderPanel = new RenderPanel(name, fg, bg, statStorage);
      if (this.renderPanel.dom) {
        this.domElement.appendChild(this.renderPanel.dom);
      }
    }
  }

  removeDomRenderPanel(): void {
    if (this.domElement && this.renderPanel && this.renderPanel.dom) {
      this.domElement.removeChild(this.renderPanel.dom);
      this.renderPanel.destroy();
      this.renderPanel = null;
    }
  }

  removeDomElement(): void {
    if (this.containerElement && this.domElement) {
      this.containerElement.removeChild(this.domElement);
      this.domElement.removeEventListener(
        'click',
        this.handleClickPanel,
        false
      );
      this.domElement = null;
      this.wasInitDomElement = false;
    }
  }

  begin(): void {
    this.beginTime = (performance || Date).now();
  }

  end(): number {
    this.frames++;

    const time: number = (performance || Date).now();

    this.msStat.update(time - this.beginTime, 200);

    if (time > this.prevTime + 1000) {
      this.fpsStat.update((this.frames * 1000) / (time - this.prevTime), 100);

      this.prevTime = time;
      this.frames = 0;

      if (this.memStat && 'memory' in performance) {
        const memory = performance.memory as {
          usedJSHeapSize: number;
          jsHeapSizeLimit: number;
        };

        this.memStat.update(
          memory.usedJSHeapSize / 1048576,
          memory.jsHeapSizeLimit / 1048576
        );
      }
    }

    return time;
  }

  update(): void {
    this.beginTime = this.end();
  }
}
