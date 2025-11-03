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
import { StatStorage } from './stat-storage';
export class RenderPanel {
  dom: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  fg: string;
  bg: string;
  name: string;
  statStorage: StatStorage | null;

  constructor(name: string, fg: string, bg: string, statStorage: StatStorage) {
    this.fg = fg;
    this.bg = bg;
    this.name = name;
    this.statStorage = statStorage;
    this.statStorage.addCallback(this.update);
    const canvas: HTMLCanvasElement = document.createElement('canvas');

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!context) {
      throw new Error('Cant get context on canvas');
    }

    context.font = `bold ${FONT_SIZE}px ${getComputedStyle(document.body).fontFamily}`;
    context.textBaseline = 'top';

    context.fillStyle = this.bg;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    context.fillStyle = this.fg;
    context.fillText(this.name, TEXT_X, TEXT_Y);
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    context.fillStyle = this.bg;
    context.globalAlpha = 0.8;
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    this.dom = canvas;
    this.context = context;
  }

  update = (value: number, maxValue: number) => {
    if (!this.context || !this.statStorage || !this.dom) {
      return;
    }
    const context: CanvasRenderingContext2D = this.context;

    context.fillStyle = this.bg;
    context.globalAlpha = 1;
    context.fillRect(0, 0, WIDTH, GRAPH_Y);
    context.fillStyle = this.fg;
    context.font = `bold ${FONT_SIZE}px ${getComputedStyle(document.body).fontFamily}`;
    context.fillText(
      `${this.statStorage.averageValue} ${this.name} (${this.statStorage.min}-${this.statStorage.max})`,
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

    context.fillStyle = this.bg;
    context.globalAlpha = 0.8;
    context.fillRect(
      GRAPH_X + GRAPH_WIDTH - PR,
      GRAPH_Y,
      2 * PR,
      Math.round((1 - value / maxValue) * GRAPH_HEIGHT)
    );
  }

  destroy() {
    if (!this.statStorage) {
      return;
    }
    this.statStorage.removeCallback(this.update);
    this.statStorage = null;
    this.context = null;
    if (this.dom) {
      this.dom.remove();
      this.dom = null;
    }
  }
}
