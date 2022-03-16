import { int } from "./Utility";
import { SCALE } from "./Canvas";
import { device } from "./Device"
import { loadSoundSPhone, se } from "./Sound";


// ---------- タップ入力 ----------
export function touchStart(e: TouchEvent) {
	e.preventDefault();//キャンバスの選択／スクロール等を抑制する
  const target = e.target as HTMLElement
	const rect = target.getBoundingClientRect();
	tapX = e.touches[0].clientX-rect.left;
	tapY = e.touches[0].clientY-rect.top;
	tapC = 1;
	transformXY();
	if(se.snd_init == 0) loadSoundSPhone();//【重要】サウンドの読み込み
}

export function touchMove(e: TouchEvent) {
	e.preventDefault();
  const target = e.target as HTMLElement
	const rect = target.getBoundingClientRect();
	tapX = e.touches[0].clientX-rect.left;
	tapY = e.touches[0].clientY-rect.top;
	transformXY();
}

export function touchEnd(e: TouchEvent) {
	e.preventDefault();
	tapC = 0;//※マウス操作ではmouseOutがこれになる
}

export function touchCancel(e: TouchEvent) {
	tapX = -1;
	tapY = -1;
	tapC = 0;
}

export function transformXY() {//実座標→仮想座標への変換
	tapX = int(tapX/SCALE);
	tapY = int(tapY/SCALE);
}

// -------------マウス入力-------------
export let tapX = 0  // readonly
export let tapY = 0  // readonly
export let tapC = 0  // readonly

export function tapCClear() { tapC = 0; }

export function mouseDown(e: MouseEvent) {
	e.preventDefault();//キャンバスの選択／スクロール等を抑制する
  if(! e.target) return
  const target = e.target as HTMLElement
	var rect = target.getBoundingClientRect();
	tapX = e.clientX-rect.left;
	tapY = e.clientY-rect.top;
	tapC = 1;
	transformXY();
	if(se.snd_init == 0) loadSoundSPhone();//【重要】サウンドの読み込み
}

export function mouseMove(e: MouseEvent) {
	e.preventDefault();
  if(! e.target) return
  const target = e.target as HTMLElement
	const rect = target.getBoundingClientRect();
	tapX = e.clientX-rect.left;
	tapY = e.clientY-rect.top;
	transformXY();
}

export function mouseUp(e: MouseEvent) { tapC = 0; }
export function mouseOut(e: MouseEvent) { tapC = 0; }


// ---------- 加速度センサー ----------
var acX = 0, acY = 0, acZ = 0;

//window.ondevicemotion = deviceMotion;//★★★旧
window.addEventListener("devicemotion", deviceMotion);

export function deviceMotion(e: DeviceMotionEvent) {
	var aIG: DeviceMotionEventAcceleration | null = e.accelerationIncludingGravity;
  if (aIG == null) return;
	if(aIG.x) acX = int(aIG.x);
	if(aIG.y) acY = int(aIG.y);
	if(aIG.z) acZ = int(aIG.z);
	if(device.type == device.PT_Android) {//Android と iOS で正負が逆になる
		acX = -acX;
		acY = -acY;
		acZ = -acZ;
	}
}



//キー入力用
export const  K_ENTER = 13;
export const  K_SPACE = 32;
export const  K_LEFT  = 37;
export const  K_UP    = 38;
export const  K_RIGHT = 39;
export const  K_DOWN  = 40;
export const  K_a     = 65;
export const  K_z     = 90;

// ---------- キー入力 ----------
var inkey = 0;
var key = new Array(256);

export function clrKey() {
	inkey = 0;
	for(var i = 0; i < 256; i++) key[i] = 0;
}

export function onKey(e: KeyboardEvent) {
	if(se.snd_init == 0) loadSoundSPhone();//【重要】サウンドの読み込み
	inkey = e.keyCode;
	key[e.keyCode]++;
//log(inkey);
}

export function offKey(e: KeyboardEvent) {
	inkey = 0;
	key[e.keyCode] = 0;
}
