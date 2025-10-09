import { PIXIHooks } from './pixi-hooks';
import { Panel, RenderPanel } from './stats-panel';
import { Renderer } from './model';
import { StatsJSAdapter } from './stats-adapter';
import { DOM_ELEMENT_ID } from './stats-constants';

export class Stats {
  mode = -1;
  frames = 0;

  beginTime: number;
  prevTime: number;
  domElement: HTMLDivElement | null = null;
  containerElement: HTMLElement | null = null;
  pixiHooks: PIXIHooks;
  adapter: StatsJSAdapter;

  fpsPanel: Panel;
  msPanel: Panel;
  memPanel?: Panel;

  panels: Panel[] = [];
  renderPanel: RenderPanel | null = null;
  wasInitDomElement: boolean = false;

  constructor(
    renderer: Renderer,
    ticker?: { add: (fn: () => void) => void },
    containerElement?: HTMLElement
  ) {
    this.beginTime = (performance || Date).now();
    this.prevTime = this.beginTime;

    this.fpsPanel = this.addPanel(new Panel('FPS', '#3ff', '#002'));
    this.msPanel = this.addPanel(new Panel('MS', '#0f0', '#020'));

    if ('memory' in performance) {
      this.memPanel = this.addPanel(new Panel('MB', '#f08', '#200'));
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
      this.domElement.addEventListener(
        'click',
        this.handleClickPanel,
        false
      );

      this.containerElement.appendChild(this.domElement);
      this.wasInitDomElement = true;
    }
  }

  handleClickPanel = (event: MouseEvent): void => {
    event.preventDefault();
    this.showPanel(++this.mode % this.panels.length);
  }

  addPanel(panel: Panel): Panel {
    this.panels.push(panel);
    return panel;
  }

  showPanel(id: number) {
    
    const panel = this.panels[id];

    if (panel) {
      this.initDomElement();
      this.removeDomRenderPanel();
      this.createRenderPanel(panel);
      this.mode = id;
    } else  {
      this.removeDomRenderPanel();
      this.removeDomElement();
      this.mode = -1;
    }
  }

  createRenderPanel(panel: Panel): void {
    if (this.domElement && panel) {
      this.renderPanel = new RenderPanel(panel);
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

  removeDomElement():void {
    if (this.containerElement && this.domElement) {
      this.containerElement.removeChild(this.domElement);
      this.domElement.removeEventListener('click', this.handleClickPanel, false);
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

    this.msPanel.update(time - this.beginTime, 200);

    if (time > this.prevTime + 1000) {
      this.fpsPanel.update((this.frames * 1000) / (time - this.prevTime), 100);

      this.prevTime = time;
      this.frames = 0;

      if (this.memPanel && 'memory' in performance) {
        const memory = performance.memory as {
          usedJSHeapSize: number;
          jsHeapSizeLimit: number;
        };

        this.memPanel.update(
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
