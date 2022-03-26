import {int, log} from "./Utility"

// -------------描画面(キャンバス)-------------
export let CWIDTH = 800
export let CHEIGHT = 600
export let SCALE = 1.0 // スケール値設定+タップ位置計算用
export class Canvas {

  public cvs: HTMLCanvasElement
  public bg: CanvasRenderingContext2D | null
  public bakW: number
  public bakH: number

  constructor() {
    this.cvs = document.getElementById("canvas") as HTMLCanvasElement
    this.bg = this.cvs.getContext("2d")
    this.bakW = 0
    this.bakH = 0
  }
  initCanvas() {
    let winW = window.innerWidth
    let winH = window.innerHeight
    this.bakW = winW
    this.bakH = winH

    if( winH < (winW * CHEIGHT / CWIDTH) ) {
      //winW を比率に合わせて調整
      winW = int(winH * CWIDTH / CHEIGHT)
    } else {
      //winH を比率に合わせて調整
      winH = int(winW * CHEIGHT / CWIDTH)
    }

    this.cvs.width = winW
    this.cvs.height = winH
    SCALE = winW / CWIDTH

    if(this.bg == null) return
    this.bg.scale(SCALE, SCALE)
    this.bg.textAlign = "center"
    this.bg.textBaseline = "middle"

    log(`width: ${winW} height:${winH} scale:${SCALE}`)
    log(`inner width: ${window.innerWidth} inner height:${window.innerHeight}`)
  }

  canvasSize(w: number, h: number) {
    CWIDTH = w
    CHEIGHT = h
    this.initCanvas()
  }
}
