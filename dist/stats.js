"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stats = void 0;
const pixi_hooks_1 = require("./pixi-hooks");
const stats_panel_1 = require("./stats-panel");
const stat_storage_1 = require("./stat-storage");
const stats_adapter_1 = require("./stats-adapter");
const stats_constants_1 = require("./stats-constants");
class Stats {
    constructor(renderer, containerElement, ticker) {
        this.mode = -1;
        this.frames = 0;
        this.domElement = null;
        this.containerElement = null;
        this.panels = [];
        this.renderPanel = null;
        this.wasInitDomElement = false;
        this.handleClickPanel = (event) => {
            event.preventDefault();
            this.showPanel(++this.mode % this.panels.length);
        };
        this.beginTime = (performance || Date).now();
        this.prevTime = this.beginTime;
        this.fpsStat = this.createStat('FPS', '#3ff', '#002');
        this.msStat = this.createStat('MS', '#0f0', '#020');
        if ('memory' in performance) {
            this.memStat = this.createStat('MB', '#f08', '#200');
        }
        this.pixiHooks = new pixi_hooks_1.PIXIHooks(renderer);
        this.adapter = new stats_adapter_1.StatsJSAdapter(this.pixiHooks, this);
        if (containerElement) {
            this.containerElement = containerElement;
        }
        if ('animations' in renderer) {
            renderer.animations.push(() => {
                this.adapter.update();
            });
        }
        else {
            if (ticker) {
                ticker.add(() => {
                    this.adapter.update();
                });
            }
            else {
                const frame = () => {
                    this.adapter.update();
                    requestAnimationFrame(frame);
                };
                frame();
            }
        }
    }
    initDomElement() {
        if (this.containerElement && !this.wasInitDomElement) {
            this.domElement = document.createElement('div');
            this.domElement.id = stats_constants_1.DOM_ELEMENT_ID;
            this.domElement.addEventListener('click', this.handleClickPanel, false);
            this.containerElement.appendChild(this.domElement);
            this.wasInitDomElement = true;
        }
    }
    createStat(name, fg, bg) {
        const statStorage = new stat_storage_1.StatStorage();
        this.panels.push({ name, fg, bg, statStorage });
        return statStorage;
    }
    showPanel(id) {
        const panel = this.panels[id];
        if (panel) {
            this.initDomElement();
            this.removeDomRenderPanel();
            this.createRenderPanel(panel);
            this.mode = id;
        }
        else {
            this.hidePanel();
        }
    }
    hidePanel() {
        this.removeDomRenderPanel();
        this.removeDomElement();
        this.mode = -1;
    }
    createRenderPanel({ name, fg, bg, statStorage }) {
        if (this.domElement) {
            this.renderPanel = new stats_panel_1.RenderPanel(name, fg, bg, statStorage);
            if (this.renderPanel.dom) {
                this.domElement.appendChild(this.renderPanel.dom);
            }
        }
    }
    removeDomRenderPanel() {
        if (this.domElement && this.renderPanel && this.renderPanel.dom) {
            this.domElement.removeChild(this.renderPanel.dom);
            this.renderPanel.destroy();
            this.renderPanel = null;
        }
    }
    removeDomElement() {
        if (this.containerElement && this.domElement) {
            this.containerElement.removeChild(this.domElement);
            this.domElement.removeEventListener('click', this.handleClickPanel, false);
            this.domElement = null;
            this.wasInitDomElement = false;
        }
    }
    begin() {
        this.beginTime = (performance || Date).now();
    }
    end() {
        this.frames++;
        const time = (performance || Date).now();
        this.msStat.update(time - this.beginTime, 200);
        if (time > this.prevTime + 1000) {
            this.fpsStat.update((this.frames * 1000) / (time - this.prevTime), 100);
            this.prevTime = time;
            this.frames = 0;
            if (this.memStat && 'memory' in performance) {
                const memory = performance.memory;
                this.memStat.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
            }
        }
        return time;
    }
    update() {
        this.beginTime = this.end();
    }
}
exports.Stats = Stats;
//# sourceMappingURL=stats.js.map