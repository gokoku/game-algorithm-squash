/*
JavaScript&HTML5 ゲーム開発用システム
開発 ワールドワイドソフトウェア有限会社

（使用条件）
本ソースコードの著作権は開発元にあります。
利用されたい方はメールにてお問い合わせ下さい。
th@wwsft.com ワールドワイドソフトウェア 廣瀬
*/

import { int, log } from './WWSlib/Utility'
import { Touch, Mouse, Key } from "./WWSlib/Event"
import { CWIDTH, CHEIGHT, Canvas } from "./WWSlib/Canvas"
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

// フレームレート frames / second
let  FPS = 30
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
  public mouse: Mouse
  public touch: Touch
  public key: Key
  public se: SE
  public device: Device

  constructor() {
    window.addEventListener("load", this.wwsSysInit.bind(this))
    this.canvas = new Canvas()
    this.draw = new Draw()
    this.se = new SE()
    this.mouse = new Mouse(this.se)
    this.touch = new Touch(this.se)
    this.key = new Key(this.se)
    this.device = new Device()
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
        if(this.mouse.tapC != 0) main_idx = 2;
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
    var ptime = Date.now() - stime;
    if(ptime < 0) ptime = 0;
    if(ptime > int(1000/FPS)) ptime = int(1000/FPS);

    setTimeout(this.wwsSysMain.bind(this), int(1000/FPS)-ptime);
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
      this.canvas.cvs.addEventListener("touchmove", this.touch.move.bind(this.touch))
      this.canvas.cvs.addEventListener("touchend", this.touch.end.bind(this.touch))
      this.canvas.cvs.addEventListener("touchcancel", this.touch.cancel.bind(this.touch))
    } else {
      this.canvas.cvs.addEventListener("mousedown", this.mouse.down.bind(this.mouse))
      this.canvas.cvs.addEventListener("mousemove", this.mouse.move.bind(this.mouse))
      this.canvas.cvs.addEventListener("mouseup", this.mouse.up.bind(this.mouse))
      this.canvas.cvs.addEventListener("mouseout", this.mouse.out.bind(this.mouse))
    }
    this.wwsSysMain()
  }
}
