/*
JavaScript&HTML5 ゲーム開発用システム
開発 ワールドワイドソフトウェア有限会社

（使用条件）
本ソースコードの著作権は開発元にあります。
利用されたい方はメールにてお問い合わせ下さい。
th@wwsft.com ワールドワイドソフトウェア 廣瀬
*/

import { int, log } from './WWSlib/Utility'
import { Touch, Key, Acc} from "./WWSlib/Event"
import { CWIDTH, CHEIGHT, Canvas, SCALE } from "./WWSlib/Canvas"
import { Draw } from "./WWSlib/Draw"
import { SE } from './WWSlib/Sound'
import { Device, PT_Android, PT_iOS, PT_Kindle } from './WWSlib/Device'
// -------------変数-------------
export const  SYS_VER = "Ver.20201111"
export let  DEBUG = false


//処理の進行を管理する
// main_idx の値
//   0: 初期化
//   1: セーブできない警告
//   2: メイン処理
let main_idx = 0
let main_tmr = 0
let stop_flg = 0 // メイン処理の一時停止
const NUA = navigator.userAgent;//機種判定
const supportTouch = 'ontouchend' in document;//タッチイベントが使えるか？

//ローカルストレージ
const LS_KEYNAME = "SAVEDATA";//keyName 任意に変更可
//保存できるか判定し、できない場合に警告を出す　具体的には iOS Safari プライベートブラウズがON（保存できない）状態に警告を出す
let CHECK_LS = false;

// -------------リアルタイム処理-------------
export abstract class MMS {
  abstract setup(): void
  abstract mainloop(): void

  public canvas: Canvas
  public draw: Draw
  public touch: Touch
  public key: Key
  public se: SE
  public device: Device
  public acc: Acc
  public frameSec: number
  // フレームレート frames / second
  private FPS = 30

  constructor() {
    document.addEventListener("visibilitychange", this.vcProc.bind(this))
    window.addEventListener("load", this.wwsSysInit.bind(this))
    this.canvas = new Canvas()
    this.draw = new Draw()
    this.se = new SE()
    this.touch = new Touch(this.se)
    this.key = new Key(this.se)
    this.device = new Device()
    this.acc = new Acc(this.device)
    this.frameSec = int(1000 / this.FPS)
  }

  setFPS(fps: number) {
    this.FPS = fps
    this.frameSec = int(1000 / this.FPS)
  }

  wwsSysMain(): void {

    let stime = Date.now()
    //ブラウザのサイズが変化したか？（スマホなら持ち方を変えたか　縦持ち⇔横持ち）
    if(this.canvas.bakW != window.innerWidth || this.canvas.bakH != window.innerHeight) {
      this.canvas.initCanvas()
      log("canvas size changed " + this.canvas.bakW + "x" + this.canvas.bakH);
    }

    main_tmr ++

    switch(main_idx) {
      case 0:
        this.setup()
        this.key.clr()
        main_idx = 2
        if(CHECK_LS == true) {
          try {localStorage.setItem("_save_test", "testdata")} catch(e) { main_idx = 1 }
        }
        break

      case 1:
        let x = int(CWIDTH / 2)
        let y = int(CHEIGHT / 6)
        let fs = int(CHEIGHT / 16)
        this.draw.fill("black")
        this.draw.fText("※セーブデータが保存されません※", x, y/2, fs, "yellow");
        this.draw.fTextN("iOS端末をお使いの場合は\nSafariのプライベートブラウズ\nをオフにして起動して下さい。", x, y*2, y, fs, "yellow");
        this.draw.fTextN("その他の機種（ブラウザ）では\nローカルストレージへの保存を\n許可する設定にして下さい。", x, y*4, y, fs, "yellow");
        this.draw.fText("このまま続けるには画面をタップ", x, y*5.5, fs, "lime");
        if(this.touch.tapC != 0) main_idx = 2;
        break;

      case 2: //メイン処理
        if(stop_flg == 0) {
          this.mainloop()
        } else {
          this.key.clr()
          main_tmr--
        }
        if(this.se.wait_se > 0) this.se.wait_se--
        break
      default: break
    }
    var ptime = Date.now() - stime
    if(ptime < 0) ptime = 0
    if(ptime > this.frameSec) ptime = int(ptime / this.frameSec) * this.frameSec

    if(DEBUG) {//★★★デバッグ
      let i: number
      let x: number = 240
      let y: number
      this.draw.fText("処理時間="+(ptime), x, 50, 16, "lime");
      this.draw.fText(`deviceType= ${this.device.type}`, x, 100, 16, "yellow");
      //this.draw.fText(`isBgm= ${isBgm} (${bgmNo})`, x, 150, 16, "yellow");
      this.draw.fText(`winW=${this.canvas.winW} winH=${this.canvas.winH} SCALE= ${SCALE}`, x, 200, 16, "yellow");
      this.draw.fText(`${main_idx} : ${main_tmr} (${this.touch.tapX} ${this.touch.tapY}) ${this.touch.tapC}`, x, 250, 16, "cyan")
      this.draw.fText(`加速度 ${this.acc.acX} : ${this.acc.acY} : ${this.acc.acZ}`, x, 300, 16, "pink");
      for(i = 0; i < 256; i++) {
        x = i%16
        y = int(i/16);
        this.draw.fText(`${this.key.key[i]}`, 15+30*x, 15+30*y, 12, "white")
      }
    }
    setTimeout(this.wwsSysMain.bind(this), this.frameSec - ptime)
  }

  wwsSysInit() {
    this.canvas.initCanvas()
    if( NUA.indexOf('Android') > 0 ) {
      this.device.type = PT_Android;
    }
    else if( NUA.indexOf('iPhone') > 0 || NUA.indexOf('iPod') > 0 || NUA.indexOf('iPad') > 0 ) {
      this.device.type = PT_iOS;
      window.scrollTo(0,1);//iPhoneのURLバーを消す位置に
    }
    else if( NUA.indexOf('Silk') > 0 ) {
      this.device.type = PT_Kindle;
    }

    window.addEventListener("keydown", this.key.on.bind(this.key))
    window.addEventListener("keyup", this.key.off.bind(this.key))

    if(supportTouch == true) {
      this.canvas.cvs.addEventListener("touchstart", this.touch.start.bind(this.touch))
      this.canvas.cvs.addEventListener("touchmove", this.touch.touchMove.bind(this.touch))
      this.canvas.cvs.addEventListener("touchend", this.touch.end.bind(this.touch))
      this.canvas.cvs.addEventListener("touchcancel", this.touch.cancel.bind(this.touch))
    } else {
      this.canvas.cvs.addEventListener("mousedown", this.touch.down.bind(this.touch))
      this.canvas.cvs.addEventListener("mousemove", this.touch.mouseMove.bind(this.touch))
      this.canvas.cvs.addEventListener("mouseup", this.touch.up.bind(this.touch))
      this.canvas.cvs.addEventListener("mouseout", this.touch.out.bind(this.touch))
    }
    this.wwsSysMain()
  }

  vcProc() {
    if(document.visibilityState == "hidden") {
      stop_flg = 1
      if(this.se.isBgm == 1) {
        this.se.pauseBgm()
        this.se.isBgm = 2
      }
    } else if(document.visibilityState == "visible") {
      stop_flg = 0
      if(this.se.isBgm == 2) {
        this.se.playBgm(this.se.bgmNo)
      }
    }
  }
}
