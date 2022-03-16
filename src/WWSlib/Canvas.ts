import {int, log} from "./Utility"

// -------------描画面(キャンバス)-------------
export let  SOUND_ON = true

export let  CWIDTH = 800
export let  CHEIGHT = 600
export let SCALE = 1.0 // スケール値設定+タップ位置計算用

export const cvs = document.getElementById("canvas") as HTMLCanvasElement
export const bg: CanvasRenderingContext2D | null  = cvs.getContext("2d")

let winW: number, winH: number
export let bakW: number, bakH: number

export function initCanvas() {
  winW = window.innerWidth
  winH = window.innerHeight
  bakW = winW
  bakH = winH

  if( winH < winW*(CHEIGHT/CWIDTH) ) {
    winW = winW*(CHEIGHT/CWIDTH)
  } else {
    winH = int(CHEIGHT * winW/CWIDTH)
  }
  cvs.width = winW
  cvs.height = winH
  SCALE = winW / CWIDTH
  bg?.scale(SCALE, SCALE)
  if(bg) bg.textAlign = "center"
  if(bg) bg.textBaseline = "middle"
}

export function canvasSize(w: number, h: number) {
  CWIDTH = w
  CHEIGHT = h
  initCanvas()
}



// -------------画像の読み込み-------------
const img = new Array(256)
const img_loaded = new Array(256)

export function loadImg(n: number, filename: string) {
  log("画像" + n + " " + filename + "読み込み開始")
  img_loaded[n] = false
  img[n] = new Image()
  img[n].src = filename
  img[n].onload = function() {
    log("画像" + n + " " + filename + "読み込み完了")
    img_loaded[n] = true
  }
}



// -------------描画1 図形-------------
export function setAlp(par: number) {
  if (bg) bg.globalAlpha = par/100
}

export function colorRGB(cr: number, cg: number, cb: number) {
  cr = int(cr)
  cg = int(cg)
  cb = int(cb)
  return ("rgb(" + cr + "," + cg + "," + cb + ")")
}

export let line_width = 1

export function lineW(wid: number) { //線の太さ指定
  line_width = wid //バックアップ
  if(bg) bg.lineWidth = wid
  if(bg) bg.lineCap = "round"
  if(bg) bg.lineJoin = "round"
}

export function line(x0: number, y0: number, x1: number, y1: number, col: string) {
  if(bg) bg.strokeStyle = col
  if(bg) bg.beginPath()
  if(bg) bg.moveTo(x0, y0)
  if(bg) bg.lineTo(x1, y1)
  if(bg) bg.stroke()
}

export function fill(col: string) {
  if(bg) bg.fillStyle = col
  if(bg) bg.fillRect(0, 0, CWIDTH, CHEIGHT)
}

export function fRect(x:number, y:number, w:number, h:number,col: string) {
  if (bg == null) return
  bg.strokeStyle = col
  bg.fillRect(x, y, w, h)
}

export function sRect(x:number, y:number, w:number, h:number,col: string) {
  if (bg == null) return
  bg.strokeStyle = col
  bg.strokeRect(x, y, w, h)
}

export function fCir(x:number, y:number, r:number,col: string) {
  if (bg == null) return
  bg.fillStyle = col
  bg.beginPath()
  bg.arc(x, y, r, 0, Math.PI*2, false)
  bg.closePath()
  bg.fill()
}

export function sCir(x:number, y:number, r:number,col: string) {
  if (bg == null) return
  bg.strokeStyle = col
  bg.beginPath()
  bg.arc(x, y, r, 0, Math.PI*2, false)
  bg.closePath()
  bg.stroke()
}

// -------------描画2 画像-------------
export function drawImg(n: number, x: number, y:number) {
  if (bg == null) return
  if(img_loaded[n] == false) return
  bg.drawImage(img[n], x, y)
}

// -------------描画3 文字-------------
export function fText(str: string, x: number, y: number, siz: number, col: string) {
  if (bg == null) return
  bg.font = int(siz) + "px bold monospace"
  bg.fillStyle = "black"
  bg.fillText(str, x+1, y+1)
  bg.fillStyle = col
  bg.fillText(str, x, y)
}

export function fTextN(str: string, x: number, y: number, h: number, siz: number, col: string) {
  if (bg == null) return
  let i
  const sn = str.split("\n")
  bg.font = int(siz) + "px bold monospace"
  if(sn.length == 1) {
    h = 0
  } else {
    y = y - int(h/2)
    h = int(h / (sn.length - 1))
  }
  for( let i = 0; i < sn.length; i++) {
    bg.fillStyle = "black"
    bg.fillText(str, x+1, y+1)
    bg.fillStyle = col
    bg.fillText(str, x, y)
  }
}

function mTextWidth(str: string) {
  if (bg == null) return
  return bg.measureText(str).width
}
