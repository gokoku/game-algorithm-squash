import { MMS } from './WWS'
import { rnd, log, int, str, abs} from './WWSlib/Utility'
import { canvasSize, drawImg, fRect, loadImg, sCir, setAlp, sRect, fText } from './WWSlib/Canvas'
import { loadSound, playSE } from  './WWSlib/Sound'
import { tapX, tapC, tapCClear } from './WWSlib/Event'

let ballX: number = 600
let ballY: number = 300
let ballXp: number = 10
let ballYp: number = 3
let barX: number = 600
let barY: number = 700
let score: number = 0
let scene: number = 0

class MyGame extends MMS {
  clrKey(): void {}
  setup(): void {
    canvasSize(1200, 800)
    loadImg(0, 'image/bg.png')
    loadSound(0, "sound/se.m4a")
  }
  mainloop(): void {
    drawImg(0, 0, 0)
    setAlp(50)
    fRect(250, 50, 700, 750, "black")
    setAlp(100)
    sRect(250, 50, 700, 760, "silver")
    sCir(ballX, ballY, 10, "lime")
    sRect(barX-50, barY-10, 100, 20, "violet")
    if(scene == 0) { // ゲーム開始前
      fText("Squash Game", 600, 200, 48, "cyan")
      fText("Click to start!", 600, 600, 36, "gold")
      if(tapC == 1) {
        ballX = 600
        ballY = 300
        ballXp = 12
        ballYp = 8
        score = 0
        scene = 1
      }
    } else if(scene == 1) {// ゲーム中
      ballX = ballX + ballXp
      ballY = ballY + ballYp
      if(ballX <= 260 || ballX >= 940) ballXp = -ballXp
      if(ballY <= 60) ballYp = 8 + rnd(8)
      if(ballY >= 800) scene = 2
      barX = tapX
      if(barX < 300) barX = 300
      if(barX > 900) barX = 900
      if(barX-60 < ballX && ballX < barX+60 && barY-30 < ballY && ballY < barY-10) {
        ballYp = -8-rnd(8)
        score += 100
        playSE(0)
      }
    } else if(scene == 2) {// ゲーム終了
      fText("Game Over", 600, 400, 36, "red")
      if(tapC == 1){
        scene = 0
        tapCClear()
      }
    }
  }
}

new MyGame()
