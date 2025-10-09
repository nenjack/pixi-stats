import {
  FONT_SIZE,
  GRAPH_HEIGHT,
  GRAPH_WIDTH,
  GRAPH_X,
  GRAPH_Y,
  HEIGHT,
  PR,
  TEXT_X,
  TEXT_Y,
  WIDTH
} from './stats-constants';

type UpdateCallbackType = (value: number, maxValue: number) => void;
export class Panel {
  values: number[] = [];
  snapshotSize: number = 30; // min~max of X frames total
  name: string;
  fg: string;
  bg: string;

  updateCallback: UpdateCallbackType | null = null;

  constructor(name: string, fg: string, bg: string) {
    this.name = name;
    this.fg = fg;
    this.bg = bg;
  }

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

  addCallback = (cb: UpdateCallbackType | null) => {
    this.updateCallback = cb;
  };

  pushValue(value: number) {
    this.values.push(value);

    if (this.values.length > this.snapshotSize) {
      this.values = this.values.slice(-this.snapshotSize);
    }
  }

  update(value: number, maxValue: number) {
    this.pushValue(value);
    if (typeof this.updateCallback === 'function') {
      this.updateCallback(value, maxValue);
    }
  }
}

export class RenderPanel {
  dom: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  panel: Panel | null;

  constructor(panel: Panel) {
    this.panel = panel;
    this.panel.addCallback(this.update.bind(this));
    const canvas: HTMLCanvasElement = document.createElement('canvas');

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!context) {
      throw new Error('Cant get context on canvas');
    }

    context.font = `bold ${FONT_SIZE}px ${getComputedStyle(document.body).fontFamily}`;
    context.textBaseline = 'top';

    context.fillStyle = panel.bg;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    context.fillStyle = panel.fg;
    context.fillText(panel.name, TEXT_X, TEXT_Y);
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    context.fillStyle = panel.bg;
    context.globalAlpha = 0.8;
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    this.dom = canvas;
    this.context = context;
  }

  update(value: number, maxValue: number) {
    if (!this.context || !this.panel || !this.dom) {
      return;
    }
    const context: CanvasRenderingContext2D = this.context;

    context.fillStyle = this.panel.bg;
    context.globalAlpha = 1;
    context.fillRect(0, 0, WIDTH, GRAPH_Y);
    context.fillStyle = this.panel.fg;
    context.font = `bold ${FONT_SIZE}px ${getComputedStyle(document.body).fontFamily}`;
    context.fillText(
      `${this.panel.averageValue} ${this.panel.name} (${this.panel.min}-${this.panel.max})`,
      TEXT_X,
      TEXT_Y
    );

    context.drawImage(
      this.dom,
      GRAPH_X + PR,
      GRAPH_Y,
      GRAPH_WIDTH - PR,
      GRAPH_HEIGHT,
      GRAPH_X,
      GRAPH_Y,
      GRAPH_WIDTH - PR,
      GRAPH_HEIGHT
    );

    context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

    context.fillStyle = this.panel.bg;
    context.globalAlpha = 0.8;
    context.fillRect(
      GRAPH_X + GRAPH_WIDTH - PR,
      GRAPH_Y,
      2 * PR,
      Math.round((1 - value / maxValue) * GRAPH_HEIGHT)
    );
  }

  destroy() {
    if (!this.panel) {
      return;
    }
    this.panel.addCallback(null);
    this.panel = null;
    this.context = null;
    if (this.dom) {
      this.dom.remove();
      this.dom = null;
    }
  }
}