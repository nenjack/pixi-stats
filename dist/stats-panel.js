"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderPanel = exports.Panel = void 0;
const stats_constants_1 = require("./stats-constants");
class Panel {
    constructor(name, fg, bg) {
        this.values = [];
        this.snapshotSize = 30; // min~max of X frames total
        this.updateCallback = null;
        this.addCallback = (cb) => {
            this.updateCallback = cb;
        };
        this.name = name;
        this.fg = fg;
        this.bg = bg;
    }
    get min() {
        return this.values
            .reduce((min, value) => Math.min(min, value), Infinity)
            .toFixed();
    }
    get max() {
        return this.values
            .reduce((max, value) => Math.max(max, value), 0)
            .toFixed();
    }
    get averageValue() {
        return (this.values.reduce((sum, value) => sum + value, 0) /
            this.values.length).toFixed(1);
    }
    pushValue(value) {
        this.values.push(value);
        if (this.values.length > this.snapshotSize) {
            this.values = this.values.slice(-this.snapshotSize);
        }
    }
    update(value, maxValue) {
        this.pushValue(value);
        if (typeof this.updateCallback === 'function') {
            this.updateCallback(value, maxValue);
        }
    }
}
exports.Panel = Panel;
class RenderPanel {
    constructor(panel) {
        this.panel = panel;
        this.panel.addCallback(this.update.bind(this));
        const canvas = document.createElement('canvas');
        canvas.width = stats_constants_1.WIDTH;
        canvas.height = stats_constants_1.HEIGHT;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Cant get context on canvas');
        }
        context.font = `bold ${stats_constants_1.FONT_SIZE}px ${getComputedStyle(document.body).fontFamily}`;
        context.textBaseline = 'top';
        context.fillStyle = panel.bg;
        context.fillRect(0, 0, stats_constants_1.WIDTH, stats_constants_1.HEIGHT);
        context.fillStyle = panel.fg;
        context.fillText(panel.name, stats_constants_1.TEXT_X, stats_constants_1.TEXT_Y);
        context.fillRect(stats_constants_1.GRAPH_X, stats_constants_1.GRAPH_Y, stats_constants_1.GRAPH_WIDTH, stats_constants_1.GRAPH_HEIGHT);
        context.fillStyle = panel.bg;
        context.globalAlpha = 0.8;
        context.fillRect(stats_constants_1.GRAPH_X, stats_constants_1.GRAPH_Y, stats_constants_1.GRAPH_WIDTH, stats_constants_1.GRAPH_HEIGHT);
        this.dom = canvas;
        this.context = context;
    }
    update(value, maxValue) {
        if (!this.context || !this.panel || !this.dom) {
            return;
        }
        const context = this.context;
        context.fillStyle = this.panel.bg;
        context.globalAlpha = 1;
        context.fillRect(0, 0, stats_constants_1.WIDTH, stats_constants_1.GRAPH_Y);
        context.fillStyle = this.panel.fg;
        context.font = `bold ${stats_constants_1.FONT_SIZE}px ${getComputedStyle(document.body).fontFamily}`;
        context.fillText(`${this.panel.averageValue} ${this.panel.name} (${this.panel.min}-${this.panel.max})`, stats_constants_1.TEXT_X, stats_constants_1.TEXT_Y);
        context.drawImage(this.dom, stats_constants_1.GRAPH_X + stats_constants_1.PR, stats_constants_1.GRAPH_Y, stats_constants_1.GRAPH_WIDTH - stats_constants_1.PR, stats_constants_1.GRAPH_HEIGHT, stats_constants_1.GRAPH_X, stats_constants_1.GRAPH_Y, stats_constants_1.GRAPH_WIDTH - stats_constants_1.PR, stats_constants_1.GRAPH_HEIGHT);
        context.fillRect(stats_constants_1.GRAPH_X + stats_constants_1.GRAPH_WIDTH - stats_constants_1.PR, stats_constants_1.GRAPH_Y, stats_constants_1.PR, stats_constants_1.GRAPH_HEIGHT);
        context.fillStyle = this.panel.bg;
        context.globalAlpha = 0.8;
        context.fillRect(stats_constants_1.GRAPH_X + stats_constants_1.GRAPH_WIDTH - stats_constants_1.PR, stats_constants_1.GRAPH_Y, 2 * stats_constants_1.PR, Math.round((1 - value / maxValue) * stats_constants_1.GRAPH_HEIGHT));
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
exports.RenderPanel = RenderPanel;
//# sourceMappingURL=stats-panel.js.map