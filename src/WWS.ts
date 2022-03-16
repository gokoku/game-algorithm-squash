/*
JavaScript&HTML5 ゲーム開発用システム
開発 ワールドワイドソフトウェア有限会社

（使用条件）
本ソースコードの著作権は開発元にあります。
利用されたい方はメールにてお問い合わせ下さい。
th@wwsft.com ワールドワイドソフトウェア 廣瀬
*/

import { rnd, log, int, str, abs} from './WWSlib/Utility'
import { touchStart, touchMove, touchEnd, touchCancel,
        mouseDown, mouseMove, mouseUp, mouseOut, tapC,
        onKey, offKey } from "./WWSlib/Event"
import { cvs, initCanvas, CHEIGHT, CWIDTH, fill, fText, fTextN, lineW, bakH, bakW, line_width } from "./WWSlib/Canvas"
import { se } from './WWSlib/Sound'
import { device } from './WWSlib/Device'
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
  abstract clrKey(): void
  abstract mainloop(): void

  constructor() {
    window.addEventListener("load", this.wwsSysInit.bind(this))
  }

  wwsSysMain(): void {

    let stime = Date.now()

    if(bakW != window.innerWidth || bakH != window.innerHeight) {
      initCanvas()
      lineW(line_width)
    }

    main_tmr ++

    switch(main_idx) {
      case 0:
        this.setup()
        main_idx = 2
        if(CHECK_LS == true) {
          try {localStorage.setItem("_save_test", "testdata")} catch(e) { main_idx = 1 }
        }
        break

      case 1:
        let x = int(CWIDTH / 2)
        let y = int(CHEIGHT / 6)
        let fs = int(CHEIGHT / 16)
        fill("black")
        fText("※セーブデータが保存されません※", x, y/2, fs, "yellow");
        fTextN("iOS端末をお使いの場合は\nSafariのプライベートブラウズ\nをオフにして起動して下さい。", x, y*2, y, fs, "yellow");
        fTextN("その他の機種（ブラウザ）では\nローカルストレージへの保存を\n許可する設定にして下さい。", x, y*4, y, fs, "yellow");
        fText("このまま続けるには画面をタップ", x, y*5.5, fs, "lime");
        if(tapC != 0) main_idx = 2;
        break;

      case 2: //メイン処理
        if(stop_flg == 0) {
          this.mainloop()
        } else {
          this.clrKey()
          main_tmr--
        }
        if(se.wait_se > 0) se.wait_se--
        break
      default: break
    }
    var ptime = Date.now() - stime;
    if(ptime < 0) ptime = 0;
    if(ptime > int(1000/FPS)) ptime = int(1000/FPS);

    setTimeout(this.wwsSysMain.bind(this), int(1000/FPS)-ptime);
  }

  wwsSysInit() {
    initCanvas()
    if( NUA.indexOf('Android') > 0 ) {
      device.type = device.PT_Android;
    }
    else if( NUA.indexOf('iPhone') > 0 || NUA.indexOf('iPod') > 0 || NUA.indexOf('iPad') > 0 ) {
      device.type = device.PT_iOS;
      window.scrollTo(0,1);//iPhoneのURLバーを消す位置に
    }
    else if( NUA.indexOf('Silk') > 0 ) {
      device.type = device.PT_Kindle;
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", offKey);

    if(supportTouch == true) {
      cvs.addEventListener("touchstart", touchStart)
      cvs.addEventListener("touchmove", touchMove)
      cvs.addEventListener("touchend", touchEnd)
      cvs.addEventListener("touchcancel", touchCancel)
    } else {
      cvs.addEventListener("mousedown", mouseDown)
      cvs.addEventListener("mousemove", mouseMove)
      cvs.addEventListener("mouseup", mouseUp)
      cvs.addEventListener("mouseout", mouseOut)
    }
    this.wwsSysMain()
  }
}
