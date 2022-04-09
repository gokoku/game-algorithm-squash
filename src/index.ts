import { MMS } from './WWS'
import { getDis, KEY_NAME, log, rnd, int } from './WWSlib/Utility'


class MyGame extends MMS {

  constructor(){
    super()
  }

  setup(): void {
    this.setFPS(15)
    this.canvas.canvasSize(960, 1200)
    this.draw.loadImg(0, 'image3/bg.png')
    const BLOCK = ["tako", "wakame", "kurage", "sakana", "uni", "ika"]
    for(let i=0; i<6; i++) {
      this.draw.loadImg(i+1, `image3/${BLOCK[i]}.png`)
    }
    this.draw.loadImg(7, 'image3/shirushi.png')
    this.initVar()
  }

  mainloop(): void {
    this.drawPzl()
    this.drawEffect()
    this.procPzl()
  }

  masu = [
    [-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0, 0,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1]
  ]
  kesu = [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]
  block = [1, 2, 3] //プレイヤーが動かす3つのブロックの番号
  myBlockX: number = 0 //処理の流れを管理
  myBlockY: number = 0 //時間の進行を管理
  dropSpd: number = 0 //落下速度

  gameProc: number = 0 //処理の流れを管理
  gameTime: number = 0 //時間の進行を管理
  score = 0 //スコア
  rensa = 0 //連鎖回数
  points = 0 //ブロックを消したときの得点
  eftime = 0 //ブロックを消す演出時間

  RAINBOW = ["#ff0000", "#e08000", "#c0e000", "#00ff00", "#00c0e0", "#0040ff", "#8000e0"]
  EFF_MAX = 100
  effX = new Array(this.EFF_MAX)
  effY = new Array(this.EFF_MAX)
  effT = new Array(this.EFF_MAX)
  effN = 0

  initVar() {
    this.myBlockX = 4
    this.myBlockY = 1
    this.dropSpd = 90
    for(let i=0; i<this.EFF_MAX; i++) {
      this.effT[i] = 0
    }
  }

  drawPzl() {
    this.draw.drawImg(0, 0, 0)
    for(let y=1; y<=11; y++) {
      for(let x=1; x<=7; x++) {
        if( this.masu[y][x] > 0 ) {
          this.draw.drawImgC(this.masu[y][x], x*80, y*80)
        }
        if( this.kesu[y][x] == 1 ) {
          this.draw.drawImgC(7, x*80, y*80)
        }
      }
    }
    this.draw.fTextN(`TIME\n${this.gameTime}`, 800, 280, 70, 60, "white")
    this.draw.fTextN(`SCORE\n${this.score}`, 800, 560, 70, 60, "white")
    if(this.gameProc == 0) {
      for(let x=-1; x<=1; x++) {
        this.draw.drawImgC(this.block[1+x], (this.myBlockX+x)*80, 80*this.myBlockY-2)
      }
    }
    if(this.gameProc == 3) {//消す処理
      this.draw.fText(`${this.points}pts`, 320, 120, 50, this.RAINBOW[this.gameTime%8]) //得点
    }
  }

  procPzl() {
    switch(this.gameProc) {

      case 0:
        if( this.key.key[KEY_NAME.LEFT] == 1 || this.key.key[KEY_NAME.LEFT] > 4) {
          this.key.key[KEY_NAME.LEFT] += 1
          if( this.masu[this.myBlockY][this.myBlockX-2] == 0 ) this.myBlockX -= 1
        }
        if( this.key.key[KEY_NAME.RIGHT] == 1 || this.key.key[KEY_NAME.RIGHT] > 4) {
          this.key.key[KEY_NAME.RIGHT] += 1
          if( this.masu[this.myBlockY][this.myBlockX+2] == 0 ) this.myBlockX += 1
        }
        if( this.gameTime % this.dropSpd == 0 || this.key.key[KEY_NAME.DOWN] > 0) {
          if( this.masu[this.myBlockY+1][this.myBlockX-1] +
              this.masu[this.myBlockY+1][this.myBlockX] +
              this.masu[this.myBlockY+1][this.myBlockX+1] == 0 ) {
                this.myBlockY += 1
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
        let c = 0
        for(let y=10; y>=1; y--) {
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
      case 2:
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
          if( this.rensa == 1 && this.dropSpd > 5 ) this.dropSpd -= 1 //消すごとに落下スピードを上げる
          this.points = 50 * n * this.rensa //基本点数は消した数 x 50
          this.score += this.points
          this.rensa = this.rensa * 2 //連鎖した時、得点が倍々に増える
          this.eftime = 0
          this.gameProc = 3 //消す処理へ
        } else {
          this.myBlockX = 4 //x座標
          this.myBlockY = 1 //y座標
          this.block[0] = 1 + rnd(6)
          this.block[1] = 1 + rnd(6)
          this.block[2] = 1 + rnd(6)
          this.gameProc = 0 //再びプロックの移動へ
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
    this.gameTime++
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
