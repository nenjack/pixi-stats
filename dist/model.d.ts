import { PIXIHooks } from './pixi-hooks';
import { StatStorage } from './stat-storage';
export type Stub = Record<string, any>;
export type Renderer = Stub;
export type Texture = Stub;
export interface IStats {
    pixiHooks: PIXIHooks;
    adapter: IStatsJSAdapter;
    fpsStat: StatStorage;
    msStat: StatStorage;
    memStat?: StatStorage;
    createStat(name: string, fg: string, bg: string): StatStorage;
    showPanel(id?: number): void;
    hidePanel(): void;
    update(): void;
}
export interface IStatsJSAdapter {
    hook: PIXIHooks;
    stats: IStats;
    dcStat?: StatStorage;
    tcStat?: StatStorage;
    update(): void;
    reset(): void;
}
export interface IPanelConfig {
    name: string;
    fg: string;
    bg: string;
    statStorage: StatStorage;
}
export type UpdateCallbackType = (value: number, maxValue: number) => void;
export interface PIXIGlTexture {
    gl: WebGLRenderingContext;
    texture: Texture;
}
export type PIXIGlTextureArray = PIXIGlTexture[];
export type PIXIGlTextureRecord = Record<string, PIXIGlTexture>;
export interface PIXIRendererGlTexture {
    managedTextures?: PIXIGlTextureArray;
    _glTextures?: PIXIGlTextureRecord;
}
export interface PIXITicker {
    add: (fn: () => void) => void;
}
//# sourceMappingURL=model.d.ts.map