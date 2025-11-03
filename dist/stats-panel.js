"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderPanel = void 0;
const stats_constants_1 = require("./stats-constants");
class RenderPanel {
    constructor(name, fg, bg, statStorage) {
        this.update = (value, maxValue) => {
            if (!this.context || !this.statStorage || !this.dom) {
                return;
            }
            const context = this.context;
            context.fillStyle = this.bg;
            context.globalAlpha = 1;
            context.fillRect(0, 0, stats_constants_1.WIDTH, stats_constants_1.GRAPH_Y);
            context.fillStyle = this.fg;
            context.font = `bold ${stats_constants_1.FONT_SIZE}px ${getComputedStyle(document.body).fontFamily}`;
            context.fillText(`${this.statStorage.averageValue} ${this.name} (${this.statStorage.min}-${this.statStorage.max})`, stats_constants_1.TEXT_X, stats_constants_1.TEXT_Y);
            context.drawImage(this.dom, stats_constants_1.GRAPH_X + stats_constants_1.PR, stats_constants_1.GRAPH_Y, stats_constants_1.GRAPH_WIDTH - stats_constants_1.PR, stats_constants_1.GRAPH_HEIGHT, stats_constants_1.GRAPH_X, stats_constants_1.GRAPH_Y, stats_constants_1.GRAPH_WIDTH - stats_constants_1.PR, stats_constants_1.GRAPH_HEIGHT);
            context.fillRect(stats_constants_1.GRAPH_X + stats_constants_1.GRAPH_WIDTH - stats_constants_1.PR, stats_constants_1.GRAPH_Y, stats_constants_1.PR, stats_constants_1.GRAPH_HEIGHT);
            context.fillStyle = this.bg;
            context.globalAlpha = 0.8;
            context.fillRect(stats_constants_1.GRAPH_X + stats_constants_1.GRAPH_WIDTH - stats_constants_1.PR, stats_constants_1.GRAPH_Y, 2 * stats_constants_1.PR, Math.round((1 - value / maxValue) * stats_constants_1.GRAPH_HEIGHT));
        };
        this.fg = fg;
        this.bg = bg;
        this.name = name;
        this.statStorage = statStorage;
        this.statStorage.addCallback(this.update);
        const canvas = document.createElement('canvas');
        canvas.width = stats_constants_1.WIDTH;
        canvas.height = stats_constants_1.HEIGHT;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Cant get context on canvas');
        }
        context.font = `bold ${stats_constants_1.FONT_SIZE}px ${getComputedStyle(document.body).fontFamily}`;
        context.textBaseline = 'top';
        context.fillStyle = this.bg;
        context.fillRect(0, 0, stats_constants_1.WIDTH, stats_constants_1.HEIGHT);
        context.fillStyle = this.fg;
        context.fillText(this.name, stats_constants_1.TEXT_X, stats_constants_1.TEXT_Y);
        context.fillRect(stats_constants_1.GRAPH_X, stats_constants_1.GRAPH_Y, stats_constants_1.GRAPH_WIDTH, stats_constants_1.GRAPH_HEIGHT);
        context.fillStyle = this.bg;
        context.globalAlpha = 0.8;
        context.fillRect(stats_constants_1.GRAPH_X, stats_constants_1.GRAPH_Y, stats_constants_1.GRAPH_WIDTH, stats_constants_1.GRAPH_HEIGHT);
        this.dom = canvas;
        this.context = context;
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
exports.RenderPanel = RenderPanel;
//# sourceMappingURL=stats-panel.js.map