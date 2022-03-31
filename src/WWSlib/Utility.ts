// -------------各種の関数-------------
export function log(msg: string) {
  console.log(msg)
}

export function int(val: number): number {
  let num = String(val)
  return parseInt(num) //プラスマイナスどちらも小数部分を切り捨て
}

export function str(val: number): string {
  return String(val)
}
export function rnd(max: number): number {
  return int(Math.random() * max)
}
export function abs(val: number): number {
  return Math.abs(val)
}

export function cos(a: number): number {
  return Math.cos(Math.PI * 2 * a / 360)
}

export function sin(a: number): number {
  return Math.sin(Math.PI * 2 * a / 360)
}

export function getDis(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}


// ---------- キー入力キーのマッピング(keyCode が非推奨のため) ----------
export function codeToStr(code: string): number {
  let charCode: number = 0
  switch(code) {
    case "KeyA": charCode = 65; break;
    case "KeyB": charCode = 66; break;
    case "KeyC": charCode = 67; break;
    case "KeyD": charCode = 68; break;
    case "KeyE": charCode = 69; break;
    case "KeyF": charCode = 70; break;
    case "KeyG": charCode = 71; break;
    case "KeyH": charCode = 72; break;
    case "KeyI": charCode = 73; break;
    case "KeyJ": charCode = 74; break;
    case "KeyK": charCode = 75; break;
    case "KeyL": charCode = 76; break;
    case "KeyM": charCode = 77; break;
    case "KeyN": charCode = 78; break;
    case "KeyO": charCode = 79; break;
    case "KeyP": charCode = 80; break;
    case "KeyQ": charCode = 81; break;
    case "KeyR": charCode = 82; break;
    case "KeyS": charCode = 83; break;
    case "KeyT": charCode = 84; break;
    case "KeyU": charCode = 85; break;
    case "KeyV": charCode = 86; break;
    case "KeyW": charCode = 87; break;
    case "KeyX": charCode = 88; break;
    case "KeyY": charCode = 89; break;
    case "KeyZ": charCode = 90; break;

    case "Space": charCode = 32; break;
    case "ArrowLeft": charCode = 37; break;
    case "ArrowUp": charCode = 38; break;
    case "ArrowRight": charCode = 39; break;
    case "ArrowDown": charCode = 40; break;
  }
  return charCode
}

export const KEY_NAME = {
	"ENTER" : 13,
	"SPACE" : 32,
	"LEFT"  : 37,
	"UP"    : 38,
	"RIGHT" : 39,
	"DOWN"  : 40,
	"a"     : 65,
	"z"     : 90
}
