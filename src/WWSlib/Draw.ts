import { int, log } from "./Utility"
import { CWIDTH, CHEIGHT, Canvas } from './Canvas'

export class Draw extends Canvas{
// -------------画像の読み込み-------------
  img: HTMLImageElement[]
  img_loaded: Boolean[]
  line_width: number

  constructor(){
    super()
    this.img = new Array(256)
    this.img_loaded = new Array(256)
    this.line_width = 1
  }

  loadImg(n: number, filename: string) {
    log("画像" + n + " " + filename + "読み込み開始")
    this.img_loaded[n] = false
    this.img[n] = new Image()
    this.img[n].src = filename
    this.img[n].onload = () =>{
      log("画像" + n + " " + filename + "読み込み完了")
      this.img_loaded[n] = true
    }
  }

  // -------------描画1 図形-------------
  setAlp(par: number) {
    if (this.bg) this.bg.globalAlpha = par/100
  }

  colorRGB(cr: number, cg: number, cb: number) {
    cr = int(cr)
    cg = int(cg)
    cb = int(cb)
    return ("rgb(" + cr + "," + cg + "," + cb + ")")
  }

  lineW(wid: number) { //線の太さ指定
    this.line_width = wid //バックアップ
    if(this.bg == null) return
    this.bg.lineWidth = wid
    this.bg.lineCap = "round"
    this.bg.lineJoin = "round"
  }

  line(x0: number, y0: number, x1: number, y1: number, col: string) {
    if(this.bg == null) return
    this.bg.strokeStyle = col
    this.bg.beginPath()
    this.bg.moveTo(x0, y0)
    this.bg.lineTo(x1, y1)
    this.bg.stroke()
  }

  fill(col: string) {
    if(this.bg) this.bg.fillStyle = col
    if(this.bg) this.bg.fillRect(0, 0, CWIDTH, CHEIGHT)
  }

  fRect(x:number, y:number, w:number, h:number,col: string) {
    if (this.bg == null) return
    this.bg.fillStyle = col
    this.bg.fillRect(x, y, w, h)
  }

  sRect(x:number, y:number, w:number, h:number,col: string) {
    if (this.bg == null) return
    this.bg.strokeStyle = col
    this.bg.strokeRect(x, y, w, h)
  }

  fCir(x:number, y:number, r:number,col: string) {
    if (this.bg == null) return
    this.bg.fillStyle = col
    this.bg.beginPath()
    this.bg.arc(x, y, r, 0, Math.PI*2, false)
    this.bg.closePath()
    this.bg.fill()
  }

  sCir(x:number, y:number, r:number,col: string) {
    if (this.bg == null) return
    this.bg.strokeStyle = col
    this.bg.beginPath()
    this.bg.arc(x, y, r, 0, Math.PI*2, false)
    this.bg.closePath()
    this.bg.stroke()
  }

  // -------------描画2 画像-------------
  drawImg(n: number, x: number, y:number) {
    if (this.bg == null) return
    if(this.img_loaded[n] == false) return
    this.bg.drawImage(this.img[n], x, y)
  }

  drawImgLR(n: number, x: number, y:number) { // 左右反転
    if(this.img_loaded[n] == false) return
    const w = this.img[n].width
    const h = this.img[n].height
    if(this.bg) {
      this.bg.save()
      this.bg.translate(x+w/2, y+h/2)
      this.bg.scale(-1, 1)
      this.bg.drawImage(this.img[n], -w/2, -h/2)
      this.bg.restore()
    }
  }

  //センタリング表示
  drawImgC(n: number, x: number, y: number) {
    if(this.img_loaded[n] == false) return
    if (this.bg)
      this.bg.drawImage(this.img[n], x - int(this.img[n].width/2), y - int(this.img[n].height/2))
  }

  //拡大縮小
  drawImgS(n: number, x: number, y: number, w: number, h: number) {
    if(this.img_loaded[n] == false) return
    if (this.bg) this.bg.drawImage(this.img[n], x, y, w, h)
  }
  //切り出し + 拡大縮小
  drawImgTS(n: number, sx: number, sy: number, sw: number, sh: number, cx: number, cy: number, cw: number, ch: number) {
    if (this.img_loaded[n] == false) return
    if (this.bg) {
      this.bg.drawImage(this.img[n], sx, sy, sw, sh, cx, cy, cw, ch)
    }
  }
  //回転
  drawImgR(n :number, x: number, y: number, arg: number) {
    if (this.img_loaded[n] == false) return
    const w = this.img[n].width
    const h = this.img[n].height
    if(this.bg) {
      this.bg.save()
      this.bg.translate(x+w/2, y+h/2)
      this.bg.rotate(arg)
      this.bg.drawImage(this.img[n], -w/2, -h/2)
      this.bg.restore()
    }
  }

  // -------------描画3 文字-------------
  fText(str: string, x: number, y: number, siz: number, col: string) {
    if (this.bg) {
      this.bg.font = int(siz) + "px bold monospace"
      this.bg.fillStyle = "black"
      this.bg.fillText(str, x+1, y+1)
      this.bg.fillStyle = col
      this.bg.fillText(str, x, y)
    }
  }

  fTextN(str: string, x: number, y: number, h: number, siz: number, col: string) {
    if (this.bg == null) return
    const sn = str.split("\n")
    this.bg.font = int(siz) + "px bold monospace"
    if(sn.length == 1) {
      h = 0
    } else {
      y = y - int(h/2)
      h = int(h / (sn.length - 1))
    }
    for( let i = 0; i < sn.length; i++) {
      this.bg.fillStyle = "black"
      this.bg.fillText(str, x+1, y+1)
      this.bg.fillStyle = col
      this.bg.fillText(str, x, y)
    }
  }
  mTextWidth(str: string) {
    if (this.bg == null) return
    return this.bg.measureText(str).width
  }
}
