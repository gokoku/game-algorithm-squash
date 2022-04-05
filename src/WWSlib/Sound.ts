import { log } from './Utility'

// -------------サウンド制御-------------
export let  SOUND_ON = true
export class SE {
  public wait_se: number = 0
  public snd_init: number = 0
  soundFile: HTMLAudioElement[]
  isBgm: number
  bgmNo: number
  seNo:number

  soundloaded: number
  sf_name: string[]

  constructor() {
    //サウンドファイルを読み込んだか(スマホ対策)
    this.wait_se = 0
    this.snd_init = 0
    this.soundFile = new Array(256)
    this.isBgm = -1
    this.bgmNo = 0
    this.seNo = -1
    this.soundloaded = 0 //いくつファイルを読み込んだか
    this.sf_name = new Array(256)
  }

  loadSoundSPhone() {//スマホでファイルを読み込む
    try {
      for(let i = 0; i < this.soundloaded; i++) {
        this.soundFile[i] = new Audio(this.sf_name[i])
        this.soundFile[i].load()
      }
    } catch(e) {
    }
    this.snd_init = 2 //スマホでファイルを読み込んだ
  }

  loadSound(n: number, filename: string) {
    this.sf_name[n] = filename
    this.soundloaded++
  }

  playSE(n: number) {
    if(SOUND_ON == false) return
    if(this.isBgm == 2) return
    if(this.wait_se == 0) {
      this.seNo = n
      this.soundFile[n].currentTime = 0
      this.soundFile[n].loop = false
      this.soundFile[n].play()
      this.wait_se = 3 //ブラウザに負荷をかけないように連続して流さないようにする
    }
  }

  playBgm(n: number) {
    if(SOUND_ON == false) return
    log(`ＢＧＭ ${n} 出力`)
    this.bgmNo = n
    this.soundFile[n].loop = true
    this.soundFile[n].play()
    this.isBgm = 1 //BGM再生中
  }

  pauseBgm() {
    this.soundFile[this.bgmNo].pause()
    this.isBgm = 0 //BGM停止中
  }

  stopBgm() {
    this.soundFile[this.bgmNo].pause()
    this.soundFile[this.bgmNo].currentTime = 0
    this.isBgm = 0 //BGM停止
  }

  rateSnd(rate: number) {
    this.soundFile[this.bgmNo].volume = rate
  }
}