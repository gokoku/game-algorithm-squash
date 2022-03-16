
// -------------サウンド制御-------------
export let  SOUND_ON = true

class SE {
  _wait_se: number = 0
  _snd_init: number = 0
  get wait_se() { return this._wait_se }
  set wait_se(wait_se: number) { this._wait_se = wait_se }

  //サウンドファイルを読み込んだか(スマホ対策)
  get snd_init(): number { return this._snd_init }
  set snd_init(val: number) { this._snd_init = val }

}

export const se = new SE()

const soundFile = new Array(256)
let isBgm = -1
let bgmNo = 0
let seNo = -1

let soundloaded = 0 //いくつファイルを読み込んだか
export const sf_name = new Array(256)

export function loadSoundSPhone() {//スマホでファイルを読み込む
  try {
    for(let i = 0; i < soundloaded; i++) {
      soundFile[i] = new Audio(sf_name[i])
      soundFile[i].load()
    }
  } catch(e) {
  }
  se.snd_init = 2 //スマホでファイルを読み込んだ
}

export function loadSound(n: number, filename: string) {
  sf_name[n] = filename
  soundloaded++
}

export function playSE(n: number) {
  if(SOUND_ON == false) return
  if(isBgm == 2) return
  if(se.wait_se == 0) {
    seNo = n
    soundFile[n].currentTime = 0
    soundFile[n].loop = false
    soundFile[n].play()
    se.wait_se = 3 //ブラウザに負荷をかけないように連続して流さないようにする
  }
}
