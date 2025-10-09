"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stats = void 0;
const pixi_hooks_1 = require("./pixi-hooks");
const stats_panel_1 = require("./stats-panel");
const stats_adapter_1 = require("./stats-adapter");
const stats_constants_1 = require("./stats-constants");
class Stats {
    constructor(renderer, ticker, containerElement) {
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
        this.fpsPanel = this.addPanel(new stats_panel_1.Panel('FPS', '#3ff', '#002'));
        this.msPanel = this.addPanel(new stats_panel_1.Panel('MS', '#0f0', '#020'));
        if ('memory' in performance) {
            this.memPanel = this.addPanel(new stats_panel_1.Panel('MB', '#f08', '#200'));
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
    addPanel(panel) {
        this.panels.push(panel);
        return panel;
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
            this.removeDomRenderPanel();
            this.removeDomElement();
            this.mode = -1;
        }
    }
    createRenderPanel(panel) {
        if (this.domElement && panel) {
            this.renderPanel = new stats_panel_1.RenderPanel(panel);
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
        this.msPanel.update(time - this.beginTime, 200);
        if (time > this.prevTime + 1000) {
            this.fpsPanel.update((this.frames * 1000) / (time - this.prevTime), 100);
            this.prevTime = time;
            this.frames = 0;
            if (this.memPanel && 'memory' in performance) {
                const memory = performance.memory;
                this.memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
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