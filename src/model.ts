// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Stub = Record<string, any>;

export type Renderer = Stub;

export type Texture = Stub;

export type IStats = Stub;

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