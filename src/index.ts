import { MMS } from './WWS'
import { getDis, KEY_NAME, log, rnd, int } from './WWSlib/Utility'

const MSL_MAX = 100
const OBJ_MAX = 100
const EFCT_MAX = 100
class MyGame extends MMS {
  //自機の管理
  bgX: number = 0
  ssX: number = 0
  ssY: number = 0
  //自機が打つ弾の管理
  mslNum: number = 0
  mslX: number[] = new Array(MSL_MAX)
  mslY: number[] = new Array(MSL_MAX)
  mslXp: number[] = new Array(MSL_MAX)
  mslYp: number[] = new Array(MSL_MAX)
  mslF: boolean[] = new Array(MSL_MAX)
  automa: number = 0 //弾の自動発射
  tmr: number = 0 //タイマー
  energy: number = 0 //エネルギー
  muteki: number = 0 //無敵状態

  //物体の管理　敵機、敵の弾を管理
  objType: number[] = new Array(OBJ_MAX) //objType: 0:敵機　1:敵の弾
  objImg: number[] = new Array(OBJ_MAX)
  objX: number[] = new Array(OBJ_MAX)
  objY: number[] = new Array(OBJ_MAX)
  objXp: number[] = new Array(OBJ_MAX)
  objYp: number[] = new Array(OBJ_MAX)
  objLife: number[] = new Array(OBJ_MAX)
  objF: boolean[] = new Array(OBJ_MAX)
  objNum: number = 0

  //エフェクトの管理
  efctX: number[] = new Array(OBJ_MAX)
  efctY: number[] = new Array(OBJ_MAX)
  efctN: number[] = new Array(OBJ_MAX)
  efctNum: number = 0

  constructor(){
    super()
  }
  clrKey(): void {}
  setup(): void {
    this.canvas.canvasSize(1200, 720)
    this.draw.loadImg(0, "image2/bg.png")
    this.draw.loadImg(1, "image2/spaceship.png")
    this.draw.loadImg(2, "image2/missile.png")
    this.draw.loadImg(3, 'image2/explode.png')
    for(let i=0; i<=4; i++) this.draw.loadImg(4+i, `image2/enemy${i}.png`)
    this.initSShip()
    this.initMissile()
    this.initOject()
    this.initEffect()
  }
  mainloop(): void {
    this.tmr++
    this.drawBG(1)
    this.setEnemy()
    this.moveSShip()
    this.moveMissile()
    this.moveOject()
    this.drawEffect()
    //エネルギーの表示
    for(let i=0; i<10; i++) this.draw.fRect(20 + i*30, 660, 20, 40, "#c00000")
    for(let i = 0; i < this.energy; i++)
      this.draw.fRect(20 + i*30, 660, 20, 40, this.draw.colorRGB(160-16*i, 240-12*i, 24*i))
  }

  drawBG(speed: number) {
    this.bgX = (this.bgX + speed) % 1200
    this.draw.drawImg(0, -this.bgX, 0)
    this.draw.drawImg(0, 1200 - this.bgX, 0)
  }

  initSShip() {
    this.ssX = 400
    this.ssY = 360
    this.energy = 10
  }

  moveSShip() {
    if(this.key.key[KEY_NAME.LEFT] > 0 && this.ssX > 60) this.ssX -= 20
    if(this.key.key[KEY_NAME.RIGHT] > 0 && this.ssX < 1000) this.ssX += 20
    if(this.key.key[KEY_NAME.UP] > 0 && this.ssY > 40) this.ssY -= 20
    if(this.key.key[KEY_NAME.DOWN] > 0 && this.ssY < 680) this.ssY += 20
    if(this.key.key[KEY_NAME.a] == 1) {
      this.key.key[KEY_NAME.a] += 1
      this.automa = 1 - this.automa
    }
    if(this.automa == 0 && this.key.key[KEY_NAME.SPACE] == 1) {
      this.key.key[KEY_NAME.SPACE] += 1
      this.setMissile(this.ssX + 40, this.ssY, 40, 0)
    }
    if(this.automa == 1 && this.tmr % 8 == 0)
      this.setMissile(this.ssX + 40, this.ssY, 40, 0)
    let col = "black"
    //オートマチック表示部
    if(this.automa == 1) col = "white"
    this.draw.fRect(900, 20, 280, 60, "blue")
    this.draw.fText("[A]uto Missile", 1040, 50, 36, col)
    //無敵モードのエフェクト
    if(this.muteki % 2 == 0)
      this.draw.drawImgC(1, this.ssX, this.ssY)
    if(this.muteki > 0) this.muteki--
  }

  initMissile() {
    for(let i = 0; i < MSL_MAX; i++) this.mslF[i] = false
    this.mslNum = 0

  }
  setMissile(x: number, y: number, xp: number, yp: number) {
    this.mslX[this.mslNum] = x
    this.mslY[this.mslNum] = y
    this.mslXp[this.mslNum] = xp
    this.mslYp[this.mslNum] = yp
    this.mslF[this.mslNum] = true
    this.mslNum = (this.mslNum + 1) % MSL_MAX
  }

  moveMissile() {
    for(let i = 0; i < MSL_MAX; i++) {
      if(this.mslF[i] == true) {
        this.mslX[i] += this.mslXp[i]
        this.mslY[i] += this.mslYp[i]
        this.draw.drawImgC(2, this.mslX[i], this.mslY[i])
        if(this.mslX[i] > 1200) this.mslF[i] = false
      }
    }
  }

  initOject() {
    for(let i = 0; i < OBJ_MAX; i++) {
      this.objF[i] = false
    }
    this.objNum = 0
  }

  setObject(typ: number, png: number, x: number, y: number, xp: number, yp: number, lif: number) {
    this.objType[this.objNum] = typ
    this.objImg[this.objNum] = png
    this.objX[this.objNum] = x
    this.objY[this.objNum] = y
    this.objXp[this.objNum] = xp
    this.objYp[this.objNum] = yp
    this.objLife[this.objNum] = lif
    this.objF[this.objNum] = true
    this.objNum = (this.objNum + 1) % OBJ_MAX
  }

  moveOject() {
    for(let i = 0; i < OBJ_MAX; i++) {
      if(this.objF[i] == true) {
        this.objX[i] += this.objXp[i]
        this.objY[i] += this.objYp[i]
        if(this.objImg[i] == 6) { //敵2の特殊な動き
          if(this.objY[i] < 60) this.objYp[i] = 8
          if(this.objY[i] > 660) this.objYp[i] = -8
        }
        if(this.objImg[i] == 7) { //敵3の特殊な動き
          if(this.objXp[i] < 0) {
            this.objXp[i] = int(this.objXp[i] * 0.95)
            if(this.objXp[i] == 0) {
              this.setObject(0, 4, this.objX[i], this.objY[i], -20, 0, 0) //弾を撃つ
              this.objXp[i] = 20
            }
          }
        }
        this.draw.drawImgC(this.objImg[i], this.objX[i], this.objY[i]) //物体の表示

        //自機が撃った弾とヒットチェック
        if(this.objType[i] == 1) {//敵機
          const r = 12 + (this.draw.img[this.objImg[i]].width + this.draw.img[this.objImg[i]].height) / 4
          for(let n = 0; n < MSL_MAX; n++) { //全弾の判定チェック
            if(this.mslF[n] == true) {
              if(getDis(this.objX[i], this.objY[i], this.mslX[n], this.mslY[n]) < r) {
                this.mslF[n] = false
                this.objLife[i] -= 1
                if(this.objLife[i] == 0) {
                  this.objF[i] = false
                  this.setEffect(this.objX[i], this.objY[i], 9)
                } else {
                  this.setEffect(this.objX[i], this.objY[i], 3)
                }
              }
            }
          }
        }
        //自機とのヒットチェック
        const r = 30 + (this.draw.img[this.objImg[i]].width + this.draw.img[this.objImg[i]].height) / 4
        if(getDis(this.objX[i], this.objY[i], this.ssX, this.ssY) < r) {
          if(this.objType[i] <= 1 && this.muteki == 0) {//敵の弾と敵機
            this.objF[i] = false
            this.energy -= 1
            this.muteki = 30
          }
        }
        if(this.objX[i] < -100 || this.objX[i] > 1300 || this.objY[i] < -100 || this.objY[i] > 820) {
          this.objF[i] = false
        }
      }
    }
  }

  initEffect() {
    for(let i = 0; i < EFCT_MAX; i++) {
      this.efctN[i] = 0
    }
    this.efctNum = 0
  }

  setEffect(x: number, y: number, n:number) {
    this.efctX[this.efctNum] = x
    this.efctY[this.efctNum] = y
    this.efctN[this.efctNum] = n
    this.efctNum = (this.efctNum + 1) % EFCT_MAX
  }

  drawEffect() {
    for(let i = 0; i < EFCT_MAX; i++) {
      if(this.efctN[i] > 0) {
        this.draw.drawImgTS(3, (9-this.efctN[i]) * 128, 0, 128, 128, this.efctX[i]-64, this.efctY[i]-64, 128, 128)
        this.efctN[i]--
      }
    }
  }

  setEnemy() {
    if(this.tmr % 60 == 0) this.setObject(1, 5, 1300, 60 + rnd(600), -16, 0, 1) //敵1
    if(this.tmr % 60 == 10)this.setObject(1, 6, 1300, 60 + rnd(600), -12, 8, 3) //敵2
    if(this.tmr % 60 == 20)this.setObject(1, 7, 1300, 360 + rnd(300), -48, -10, 5) //敵3
    if(this.tmr % 60 == 30)this.setObject(1, 8, 1300, rnd(720-192), -6, 0, 0) //障害物
  }
}



new MyGame()
