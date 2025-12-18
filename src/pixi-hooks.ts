import BaseHooks from './hooks/BaseHooks'
import { PIXIGlTextureRecord, PIXIRendererGlTexture, Renderer } from './model'

export class PIXIHooks extends BaseHooks {
  get hooked() {
    return !!this.glhook
  }

  constructor(renderer: Renderer) {
    super()

    if (!renderer) {
      console.warn('[PIXI Hooks] renderer in constructor undefined')
      return
    }

    if (!renderer.gl) {
      console.warn('[PIXI Hooks] gl in renderer not found')
      return
    }

    this.attach(renderer.gl)

    if (!this.texturehook) {
      console.warn('[PIXI Hooks] attach hook to gl in renderer failed')
      return
    }

    const texture = renderer.texture as unknown as PIXIRendererGlTexture

    // pixi v6 compatibility
    const glTextures = texture._glTextures || texture.managedTextures

    // pixi v6 compatibility
    const glTexturesArray = Array.isArray(glTextures)
      ? glTextures
      : Object.values(glTextures as PIXIGlTextureRecord)

    if (!glTexturesArray) {
      console.warn('[PIXI Hooks] no gl textures found')
      return
    }

    console.info('[PIXI Hooks] Collect used textures:', glTexturesArray.length)

    glTexturesArray.forEach((glTexture) => {
      if (glTexture.gl === renderer.gl && glTexture.texture) {
        this.texturehook!.registerTexture(glTexture.texture)
      }
    })
  }
}
