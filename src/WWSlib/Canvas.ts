import {int, log} from "./Utility"

// -------------描画面(キャンバス)-------------
export let CWIDTH = 800
export let CHEIGHT = 600
export let SCALE = 1.0 // スケール値設定+タップ位置計算用
export class Canvas {

  public cvs: HTMLCanvasElement
  public bg: CanvasRenderingContext2D | null
  public winW: number
  public winH: number
  public bakW: number
  public bakH: number

  constructor() {
    this.cvs = document.getElementById("canvas") as HTMLCanvasElement
    this.bg = this.cvs.getContext("2d")
    this.winW = 0
    this.winH = 0
    this.bakW = 0
    this.bakH = 0
  }
  initCanvas() {
    this.winW = window.innerWidth
    this.winH = window.innerHeight
    this.bakW = this.winW
    this.bakH = this.winH

    if( this.winH < (this.winW * CHEIGHT / CWIDTH) ) {
      //winW を比率に合わせて調整
      this.winW = int(this.winH * CWIDTH / CHEIGHT)
    } else {
      //winH を比率に合わせて調整
      this.winH = int(this.winW * CHEIGHT / CWIDTH)
    }

    this.cvs.width = this.winW
    this.cvs.height = this.winH
    SCALE = this.winW / CWIDTH

    if(this.bg == null) return
    this.bg.scale(SCALE, SCALE)
    this.bg.textAlign = "center"
    this.bg.textBaseline = "middle"

    //log(`width: ${this.winW} height:${this.winH} scale:${SCALE}`)
    //log(`inner width: ${window.innerWidth} inner height:${window.innerHeight}`)
  }

  canvasSize(w: number, h: number) {
    CWIDTH = w
    CHEIGHT = h
    this.initCanvas()
  }
}
