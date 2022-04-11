import { MMS } from './WWS'
import { getDis, KEY_NAME, log, rnd, int } from './WWSlib/Utility'


class MyGame extends MMS {
  masu = new Array(13)
  kesu = new Array(13)

  idx: number = 0 //モードのインデックス
  tmr: number = 0 //タイマー
  block = [0, 0, 0, 1, 2, 3] //プレイヤーが動かす3つのブロックの番号+次のブロックの番号
  myBlockX: number = 0 //処理の流れを管理
  myBlockY: number = 0 //時間の進行を管理
  dropSpd: number = 0 //落下速度

  gameProc: number = 0 //処理の流れを管理
  gameTime: number = 0 //時間の進行を管理
  hisco:  number = 5000 //ハイスコア
  score = 0 //スコア
  rensa = 0 //連鎖回数
  points = 0 //ブロックを消したときの得点
  eftime = 0 //ブロックを消す演出時間
  extend = 0 //エクステンドタイム
  tapKey = [0, 0, 0, 0] //ボタンのアイコンをタップしているか

  RAINBOW = ["#ff0000", "#e08000", "#c0e000", "#00ff00", "#00c0e0", "#0040ff", "#8000e0"]
  EFF_MAX = 100
  effX = new Array(this.EFF_MAX)
  effY = new Array(this.EFF_MAX)
  effT = new Array(this.EFF_MAX)
  effN = 0

  constructor(){
    super()
    for( let y = 0; y < 13; y++) {
      for( let x = 0; x < 8; x++) {
        this.masu[y] = new Array(9)
        this.kesu[y] = new Array(9)
      }
    }
  }

  setup(): void {
    this.clrBlock()
    this.canvas.canvasSize(960, 1200)
    this.draw.loadImg(0, 'image3/bg.png')
    const BLOCK = ["tako", "wakame", "kurage", "sakana", "uni", "ika"]
    for(let i=0; i<6; i++) {
      this.draw.loadImg(i+1, `image3/${BLOCK[i]}.png`)
    }
    this.draw.loadImg(7, 'image3/title.png')
    this.se.loadSound(0, 'sound3/bgm.m4a')
    this.se.loadSound(1, 'sound3/se.m4a')
    this.initVar()
  }

  mainloop(): void {
    this.tmr += 1
    this.drawPzl()
    this.drawEffect()
    switch(this.idx) {
      case 0: //タイトル画面
        this.draw.drawImgC(7, 480, 400) //タイトル
        if(this.tmr % 40 < 20) this.draw.fText("TAP TO START.", 480, 680, 80, "pink")
        if(this.key.key[KEY_NAME.SPACE]) {
          this.clrBlock()
          this.initVar()
          this.se.playBgm(0)
          this.idx = 1
          this.tmr = 0
        }
        break

      case 1: //ゲーム中
        if(this.procPzl() == 0) {
          this.se.stopBgm()
          this.idx = 2
          this.tmr = 0
        }
        break

      case 2: //ゲームオーバー
        this.draw.fText("GAME OVER", 480, 420, 100, "violet")
        if(this.tmr > 30 * 5) this.idx = 0
        break
    }
  }

  clrBlock() {//マス目を初期化
    for(let y = 0; y <= 12; y++) {
      for(let x = 0; x <= 8; x++) {
        this.masu[y][x] = -1
      }
    }
    for(let y = 1; y <= 11; y++) {
      for(let x = 1; x <= 7; x++) {
        this.masu[y][x] = 0
        this.kesu[y][x] = 0
      }
    }
  }

  initVar() {
    this.myBlockX = 4
    this.myBlockY = 1
    this.dropSpd = 90

    this.block[0] = 1 //現在のブロック
    this.block[1] = 2
    this.block[2] = 3

    this.block[0] = 2 //次のブロック
    this.block[1] = 3
    this.block[2] = 4

    this.gameProc = 0 //処理の流れを管理
    this.gameTime = 30 * 60 * 3 //時間の進行を管理 約3分
    this.score = 0 //スコア

    for(let i=0; i<this.EFF_MAX; i++) {
      this.effT[i] = 0
    }
  }

  drawPzl() {
    this.draw.drawImg(0, 0, 0)
    for(let x = 0; x < 3; x++) this.draw.drawImg(this.block[3+x], 672+80*x, 50)
    this.draw.fTextN(`TIME\n${this.gameTime}`, 800, 280, 70, 60, "white")
    this.draw.fTextN(`SCORE\n${this.score}`, 800, 560, 70, 60, "white")

    for(let y=1; y<=11; y++) {
      for(let x=1; x<=7; x++) {
        if( this.masu[y][x] > 0 ) {
          this.draw.drawImgC(this.masu[y][x], x*80, y*80)
        }
      }
    }
    if(this.gameProc == 0) { //ブロックの移動
      for(let x=-1; x<=1; x++) {
        this.draw.drawImgC(this.block[1+x], (this.myBlockX+x)*80, 80*this.myBlockY-2)
      }
    }
    if(this.gameProc == 3) {//消す処理
      this.draw.fText(`${this.points}pts`, 320, 120, 50, this.RAINBOW[this.tmr % 8]) //得点表示
      if(this.extend > 0) this.draw.fText(`TIME ${this.extend}!`, 320, 240, 50, this.RAINBOW[this.tmr % 8]) //エクステンド表示
    }
  }

  procPzl() {
    if(this.touch.tapC > 0 && 960 < this.touch.tapY && this.touch.tapY < 1200) { //タップ操作
      const c = int(this.touch.tapX / 240)
      log(`${c}`)
      if(0 <= c && c <= 3) {
        this.tapKey[c] += 1
      }
    } else {
      for(let i=0; i < 4; i++) {
        this.tapKey[i] = 0
      }
    }
    switch(this.gameProc) {
      case 0:
        if(this.tmr < 10) break //下キー押しでブロックがどんどん落ちないようにする
        //キーでの操作
        if( this.key.key[KEY_NAME.LEFT] == 1 || this.key.key[KEY_NAME.LEFT] > 4) {
          this.key.key[KEY_NAME.LEFT] += 1
          if( this.masu[this.myBlockY][this.myBlockX-2] == 0 ) this.myBlockX -= 1
        }
        if( this.key.key[KEY_NAME.RIGHT] == 1 || this.key.key[KEY_NAME.RIGHT] > 4) {
          this.key.key[KEY_NAME.RIGHT] += 1
          if( this.masu[this.myBlockY][this.myBlockX+2] == 0 ) this.myBlockX += 1
        }
        if( this.key.key[KEY_NAME.SPACE] == 1 || this.key.key[KEY_NAME.SPACE] > 4) {
          this.key.key[KEY_NAME.SPACE] += 1
          const i = this.block[2]
          this.block[2] = this.block[1]
          this.block[1] = this.block[0]
          this.block[0] = i
        }
        //タップでの操作
        if(this.tapKey[0] == 1 || this.tapKey[0] > 8) {
          if(this.masu[this.myBlockY][this.myBlockX-2] == 0) this.myBlockX -= 1
        }
        if(this.tapKey[2] == 1 || this.tapKey[2] > 8) {
          if(this.masu[this.myBlockY][this.myBlockX+2] == 0) this.myBlockX += 1
        }
        if(this.tapKey[3] == 1 || this.tapKey[3] > 8) { //ブロックの入れ替え
          const i = this.block[2]
          this.block[2] = this.block[1]
          this.block[1] = this.block[0]
          this.block[0] = i
        }


        if( this.gameTime % this.dropSpd == 0 || this.key.key[KEY_NAME.DOWN] > 0 || this.tapKey[1] > 1 ) {
          if( this.masu[this.myBlockY+1][this.myBlockX-1] +
              this.masu[this.myBlockY+1][this.myBlockX] +
              this.masu[this.myBlockY+1][this.myBlockX+1] == 0 ) {
                this.myBlockY += 1 //下に何もなければ落とす
          } else {
            //動かなくなったらmasu配列に書き込んで次のフェーズへ
            this.masu[this.myBlockY][this.myBlockX-1] = this.block[0]
            this.masu[this.myBlockY][this.myBlockX] = this.block[1]
            this.masu[this.myBlockY][this.myBlockX+1] = this.block[2]
            this.rensa = 1
            this.gameProc = 1
          }
        }
        break
      case 1: //プロックの落下処理
        let c = 0 //落としたブロックがあるかどうか　チェック用
        for(let y=10; y>=1; y--) { //【重要】下から上に向かって調べること
          for(let x=1; x<=7; x++) {
            if( this.masu[y][x] > 0 && this.masu[y+1][x] == 0 ) {
              this.masu[y+1][x] = this.masu[y][x]
              this.masu[y][x] = 0
              c = 1
            }
          }
        }
        if(c == 0) this.gameProc = 2 //全て落としたら次のフェーズへ
        break
      case 2: //ブロックが揃ったかの判定
        for(let y=1; y<=11; y++) {
          for(let x=1; x<=7; x++) {
            const c = this.masu[y][x]
            if(c > 0) {
              if(c == this.masu[y-1][x ] && c == this.masu[y+1][x ]) {
                this.kesu[y][x] = 1
                this.kesu[y-1][x ] = 1
                this.kesu[y+1][x ] = 1
              }
              if(c == this.masu[y ][x-1] && c == this.masu[y ][x+1]) {
                this.kesu[y][x] = 1
                this.kesu[y][x-1] = 1
                this.kesu[y][x+1] = 1
              }
              if(c == this.masu[y-1][x+1] && c == this.masu[y+1][x-1]) {
                this.kesu[y][x] = 1
                this.kesu[y-1][x+1] = 1
                this.kesu[y+1][x-1] = 1
              }
              if(c == this.masu[y-1][x-1] && c == this.masu[y+1][x+1]) {
                this.kesu[y][x] = 1
                this.kesu[y-1][x-1] = 1
                this.kesu[y+1][x+1] = 1
              }
            }
          }
        }
        let n = 0 // そろったブロックの数をカウント
        for(let y=1; y<=11; y++) {
          for(let x=1; x<=7; x++) {
            if(this.kesu[y][x] == 1) {
              n += 1
              this.setEffect(80*x, 80*y) //エフェクト
            }
          }
        }
        if(n > 0){
          this.se.playSE(1)
          if( this.rensa == 1 && this.dropSpd > 5 ) this.dropSpd -= 1 //消すごとに落下スピードを上げる
          this.points = 50 * n * this.rensa //基本点数は消した数 x 50
          this.score += this.points
          if(this.score > this.hisco) this.hisco = this.score
          this.extend = 0
          if(n % 5 == 0) this.extend = 300 //5の倍数の個数を消すとタイムが増える
          this.gameProc = this.extend
          this.rensa = this.rensa * 2 //連鎖した時、得点が倍々に増える
          this.eftime = 0
          this.gameProc = 3 //消す処理へ
        } else {
          this.myBlockX = 4 //x座標
          this.myBlockY = 1 //y座標
          if(this.masu[this.myBlockY][this.myBlockX-1] +
            this.masu[this.myBlockY][this.myBlockX] +
            this.masu[this.myBlockY][this.myBlockX+1] > 0) {
              return 0 //ブロックが最上段にある
          }
          //次のブロックをセット
          this.block[0] = this.block[3]
          this.block[1] = this.block[4]
          this.block[2] = this.block[5]
          let c = 4 //ブロックの種類を決める
          if(this.score > 10000) c = 5
          if(this.score > 20000) c = 6
          this.block[3] = 1 + rnd(c)
          this.block[4] = 1 + rnd(c)
          this.block[5] = 1 + rnd(c)
          this.gameProc = 0 //再びプロックの移動へ
          this.tmr = 0
        }
        break
      case 3:
        this.eftime += 1
        if(this.eftime == 20) {
          for(let y=1; y<=11; y++) {
            for(let x=1; x<=7; x++) {
              if(this.kesu[y][x] == 1) {
                this.masu[y][x] = 0
                this.kesu[y][x] = 0
              }
            }
          }
          this.gameProc = 1 //消したら再びプロックの落下処理へ
        }
        break
    }
    this.gameTime-- //ゲーム時間を1つ減らす
    return this.gameTime
  }

  setEffect(x: number, y: number) {//エフェクトをセット
    this.effX[this.effN] = x
    this.effY[this.effN] = y
    this.effT[this.effN] = 20
    this.effN = (this.effN + 1) % this.EFF_MAX
  }

  drawEffect() {//エフェクトを描画
    this.draw.lineW(20)
    for(let i=0; i<this.EFF_MAX; i++) {
      if(this.effT[i] > 0) {
        this.draw.setAlp(this.effT[i] * 5)
        this.draw.sCir(this.effX[i], this.effY[i], 110 - this.effT[i] * 5, this.RAINBOW[(this.effT[i]+0) % 8])
        this.draw.sCir(this.effX[i], this.effY[i], 90 - this.effT[i] * 4, this.RAINBOW[(this.effT[i]+1) % 8])
        this.draw.sCir(this.effX[i], this.effY[i], 70 - this.effT[i] * 3, this.RAINBOW[(this.effT[i]+2) % 8])
        this.effT[i] -= 1
      }
    }
    this.draw.setAlp(100)
    this.draw.lineW(1)
  }
}

new MyGame()
