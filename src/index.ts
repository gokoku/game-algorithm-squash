import { MMS } from './WWS'
import { KEY_NAME } from './WWSlib/Utility'


class MyGame extends MMS {
  constructor(){
    super()
  }
  clrKey(): void {}
  setup(): void {
    this.canvas.canvasSize(1200, 720)
    this.draw.loadImg(0, "image2/bg.png")
    this.draw.loadImg(1, "image2/spaceship.png")
    this.initSShip()
  }
  mainloop(): void {
    this.drawBG(1)
    this.moveSShip()
  }

  bgX: number = 0
  ssX: number = 0
  ssY: number = 0

  drawBG(speed: number) {
    this.bgX = (this.bgX + speed) % 1200
    this.draw.drawImg(0, -this.bgX, 0)
    this.draw.drawImg(0, 1200 - this.bgX, 0)
  }

  initSShip() {
    this.ssX = 400
    this.ssY = 360
  }

  moveSShip() {
    if(this.key.key[KEY_NAME.LEFT] > 0 && this.ssX > 60) this.ssX -= 20
    if(this.key.key[KEY_NAME.RIGHT] > 0 && this.ssX < 1000) this.ssX += 20
    if(this.key.key[KEY_NAME.UP] > 0 && this.ssY > 40) this.ssY -= 20
    if(this.key.key[KEY_NAME.DOWN] > 0 && this.ssY < 680) this.ssY += 20

    this.draw.drawImgC(1, this.ssX, this.ssY)
  }
}



new MyGame()
