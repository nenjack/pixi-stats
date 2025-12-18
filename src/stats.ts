import { PIXIHooks } from './pixi-hooks'
import { RenderPanel } from './stats-panel'
import { StatStorage } from './stat-storage'
import {
  IStats,
  IPanelConfig,
  IStatsJSAdapter,
  Renderer,
  PIXITicker
} from './model'
import { StatsJSAdapter } from './stats-adapter'
import { DOM_ELEMENT_ID } from './stats-constants'
export class Stats implements IStats {
  mode = -1
  frames = 0

  beginTime: number
  prevTime: number

  pixiHooks: PIXIHooks
  adapter: IStatsJSAdapter

  fpsStat: StatStorage
  msStat: StatStorage
  memStat?: StatStorage

  panels: IPanelConfig[] = []
  domElement: HTMLDivElement | null = null
  containerElement: HTMLElement | null = null
  renderPanel: RenderPanel | null = null

  /**
   * in document/html/dom context returns document's body
   */
  static getContainerElement(): HTMLElement | undefined {
    if (typeof document === 'undefined') {
      return undefined
    }

    return document?.body
  }

  constructor(
    renderer: Renderer,
    ticker: PIXITicker,
    containerElement = Stats.getContainerElement(),
    autoStart = true
  ) {
    this.beginTime = (performance || Date).now()
    this.prevTime = this.beginTime

    this.fpsStat = this.createStat('FPS', '#3ff', '#002')
    this.msStat = this.createStat('MS', '#0f0', '#020')

    if ('memory' in performance) {
      this.memStat = this.createStat('MB', '#f08', '#200')
    }

    this.pixiHooks = new PIXIHooks(renderer)
    this.adapter = new StatsJSAdapter(this.pixiHooks, this)

    if (typeof renderer?.animations !== 'undefined') {
      renderer.animations.push(() => {
        this.adapter.update()
      })
    } else if (typeof ticker !== 'undefined') {
      ticker.add(() => {
        this.adapter.update()
      })
    } else if (typeof requestAnimationFrame !== 'undefined') {
      const frame = () => {
        this.adapter.update()
        requestAnimationFrame(frame)
      }

      frame()
    }

    if (containerElement) {
      this.containerElement = containerElement
    }

    if (this.containerElement && autoStart) {
      this.showPanel()
    }
  }

  initDomElement(): void {
    if (this.containerElement && !this.domElement) {
      this.domElement = document.createElement('div')
      this.domElement.id = DOM_ELEMENT_ID
      this.domElement.addEventListener('click', this.handleClickPanel, false)
      this.containerElement.appendChild(this.domElement)
    }
  }

  handleClickPanel = (event: MouseEvent): void => {
    event.preventDefault()
    this.showPanel(++this.mode % this.panels.length)
  }

  createStat(name: string, fg: string, bg: string): StatStorage {
    const statStorage = new StatStorage()
    this.panels.push({ name, fg, bg, statStorage })
    return statStorage
  }

  showPanel(id = 0) {
    const panel = this.panels[id]
    if (panel) {
      this.initDomElement()
      this.removeDomRenderPanel()
      this.createRenderPanel(panel)
      this.mode = id
    } else {
      this.hidePanel()
    }
  }

  hidePanel() {
    this.removeDomRenderPanel()
    this.removeDomElement()
    this.mode = -1
  }

  createRenderPanel({ name, fg, bg, statStorage }: IPanelConfig): void {
    if (!this.domElement) {
      return
    }

    this.renderPanel = new RenderPanel(name, fg, bg, statStorage)
    if (this.renderPanel.dom) {
      this.domElement.appendChild(this.renderPanel.dom)
    }
  }

  removeDomRenderPanel(): void {
    if (!this.domElement) {
      return
    }

    if (this.renderPanel?.dom) {
      this.domElement.removeChild(this.renderPanel.dom)
      this.renderPanel.destroy()
      this.renderPanel = null
    }
  }

  removeDomElement(): void {
    if (!this.domElement || !this.containerElement) {
      return
    }

    this.containerElement.removeChild(this.domElement)
    this.domElement.removeEventListener('click', this.handleClickPanel, false)
    this.domElement = null
  }

  begin(): void {
    this.beginTime = (performance || Date).now()
  }

  end(): number {
    const time: number = (performance || Date).now()

    this.frames++
    this.msStat.update(time - this.beginTime, 200)

    if (time > this.prevTime + 1000) {
      this.fpsStat.update((this.frames * 1000) / (time - this.prevTime), 100)

      this.prevTime = time
      this.frames = 0

      if ('memory' in performance && this.memStat) {
        const memory = performance.memory as {
          usedJSHeapSize: number
          jsHeapSizeLimit: number
        }

        this.memStat.update(
          memory.usedJSHeapSize / 1048576,
          memory.jsHeapSizeLimit / 1048576
        )
      }
    }

    return time
  }

  update(): void {
    this.beginTime = this.end()
  }
}
