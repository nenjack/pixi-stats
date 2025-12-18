/* eslint-disable @typescript-eslint/no-explicit-any */

export default class TextureHook {
  public createdTextures: Array<any> = new Array<any>()

  public maxTexturesCount: number = 0

  public isInit: boolean = false

  private realGLCreateTexture: (...args: any[]) => void = function () {}

  private realGLDeleteTexture: (...args: any[]) => void = function () {}

  private gl: any

  constructor(_gl?: any) {
    if (!_gl) {
      console.warn("[TextureHook] GL can't be NULL")
    } else if (_gl.__proto__.createTexture) {
      this.gl = _gl
      this.realGLCreateTexture = this.gl.__proto__.createTexture
      this.realGLDeleteTexture = this.gl.__proto__.deleteTexture

      // replace with new function
      this.gl.__proto__.createTexture = this.fakeGLCreateTexture.bind(this)
      this.gl.__proto__.deleteTexture = this.fakeGLDeleteTexture.bind(this)
      this.isInit = true

      console.info('[TextureHook] GL was Hooked!')
    }
  }

  public get currentTextureCount(): number {
    return this.createdTextures.length
  }

  public registerTexture(texture: any): void {
    this.createdTextures.push(texture) // ++;
    this.maxTexturesCount = Math.max(
      this.createdTextures.length,
      this.maxTexturesCount
    )
  }

  private fakeGLCreateTexture(): any {
    const texture = this.realGLCreateTexture.call(this.gl)
    this.registerTexture(texture)
    return texture
  }

  private fakeGLDeleteTexture(texture: any): void {
    const index: number = this.createdTextures.indexOf(texture)
    if (index > -1) {
      this.createdTextures.splice(index, 1)
    }
    this.realGLDeleteTexture.call(this.gl, texture)
  }

  public reset(): void {
    this.createdTextures = new Array<any>()
    this.maxTexturesCount = 0
  }

  public release(): void {
    if (this.isInit) {
      this.gl.__proto__.createTexture = this.realGLCreateTexture
      this.gl.__proto__.deleteTexture = this.realGLDeleteTexture

      console.info('[TextureHook] Hook was removed!')
    }

    this.isInit = false
  }
}
