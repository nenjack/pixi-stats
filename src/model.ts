import { PIXIHooks } from './pixi-hooks';
import { StatStorage } from './stat-storage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Stub = Record<string, any>;

export type Renderer = Stub;

export type Texture = Stub;

export interface IStats {
  pixiHooks: PIXIHooks;
  adapter: StatsJSAdapterI;
  fpsStat: StatStorage;
  msStat: StatStorage;
  memStat?: StatStorage;
  createStat(name: string, fg: string, bg: string): StatStorage;
  showPanel(id: number): void;
  hidePanel(): void;
  update(): void;
}

export interface StatsJSAdapterI {
  hook: PIXIHooks;
  stats: IStats;
  dcStat?: StatStorage;
  tcStat?: StatStorage;
  update(): void;
  reset(): void;
}

export type PanelConfig = {
  name: string;
  fg: string;
  bg: string;
  statStorage: StatStorage;
};
export interface PIXIGlTexture {
  gl: WebGLRenderingContext;
  texture: Texture;
}

export type PIXIGlTextureArray = PIXIGlTexture[];

export type PIXIGlTextureRecord = Record<string, PIXIGlTexture>;

export interface PIXIRendererGlTexture {
  // pixi v6
  managedTextures?: PIXIGlTextureArray;
  // pixi v8
  _glTextures?: PIXIGlTextureRecord;
}

export type UpdateCallbackType = (value: number, maxValue: number) => void;
