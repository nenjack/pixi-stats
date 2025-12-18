/* eslint-disable @typescript-eslint/no-explicit-any */

export default class GLHook {
  public drawPasses: number = 0

  public isInit: boolean = false

  private realGLDrawElements: (...args: any[]) => void = function () {}

  private gl: any

  constructor(_gl?: any) {
    if (!_gl) {
      console.warn("[GLHook] GL can't be NULL")
    } else if (_gl.__proto__.drawElements) {
      this.gl = _gl
      this.realGLDrawElements = this.gl.__proto__.drawElements

      // replace with new function
      this.gl.__proto__.drawElements = this.fakeGLdrawElements.bind(this)
      this.isInit = true

      console.info('[GLHook] GL was Hooked!')
    }
  }

  private fakeGLdrawElements(
    mode: any,
    count: any,
    type: any,
    offset: any
  ): void {
    this.drawPasses++
    this.realGLDrawElements.call(this.gl, mode, count, type, offset)
  }

  public reset(): void {
    this.drawPasses = 0
  }

  public release(): void {
    if (this.isInit) {
      this.gl.__proto__.drawElements = this.realGLDrawElements

      console.info('[GLHook] Hook was removed!')
    }

    this.isInit = false
  }
}
