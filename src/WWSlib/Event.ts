import { int, log, codeToStr } from "./Utility"
import { SE } from "./Sound"
import { SCALE } from "./Canvas"
import { Device, PT_Android } from "./Device"

// ---------- タップ入力 ----------
export class Touch {
	public tapX: number
	public tapY: number
	public tapC: number
	private _se: SE

	constructor(se: SE) {
		this._se = se;
		this.tapX = 0;
		this.tapY = 0;
		this.tapC = 0;
	}
	start(e: TouchEvent) {
		e.preventDefault();//キャンバスの選択／スクロール等を抑制する
		const target = e.target as HTMLElement
		const rect = target.getBoundingClientRect();
		this.tapX = e.touches[0].clientX-rect.left;
		this.tapY = e.touches[0].clientY-rect.top;
		this.tapC = 1;
		this.transformXY();
		if(this._se.snd_init == 0) this._se.loadSoundSPhone();//【重要】サウンドの読み込み
	}

	move(e: TouchEvent) {
		e.preventDefault();
		const target = e.target as HTMLElement
		const rect = target.getBoundingClientRect();
		this.tapX = e.touches[0].clientX-rect.left;
		this.tapY = e.touches[0].clientY-rect.top;
		this.transformXY();
	}

	end(e: TouchEvent) {
		e.preventDefault();
		this.tapC = 0;//※マウス操作ではmouseOutがこれになる
	}

	cancel(e: TouchEvent) {
		this.tapX = -1;
		this.tapY = -1;
		this.tapC = 0;
	}

	transformXY() {//実座標→仮想座標への変換
		this.tapX = int(this.tapX / SCALE);
		this.tapY = int(this.tapY / SCALE);
	}
}


// -------------マウス入力-------------
export class Mouse {
	public tapX:number
	public tapY:number
	public tapC:number
	private _se: SE

	constructor(se: SE) {
		this._se = se
		this.tapC = 0
		this.tapX = 0
		this.tapY = 0
	}

	down(e: MouseEvent) {
		e.preventDefault();//キャンバスの選択／スクロール等を抑制する
		if(! e.target) return
		const target = e.target as HTMLElement
		var rect = target.getBoundingClientRect()
		this.tapX = e.clientX-rect.left;
		this.tapY = e.clientY-rect.top;
		this.tapC = 1;
		this.transformXY()
		if(this._se.snd_init == 0) this._se.loadSoundSPhone();//【重要】サウンドの読み込み
	}

	move(e: MouseEvent) {
		e.preventDefault();
		if(! e.target) return
		const target = e.target as HTMLElement
		const rect = target.getBoundingClientRect()
		this.tapX = e.clientX-rect.left;
		this.tapY = e.clientY-rect.top;
		this.transformXY()
	}

	up(e: MouseEvent) { this.tapC = 0; }
	out(e: MouseEvent) { this.tapC = 0; }

	transformXY() {//実座標→仮想座標への変換
		this.tapX = int(this.tapX / SCALE);
		this.tapY = int(this.tapY / SCALE);
	}
}

// ---------- 加速度センサー ----------
export class Acc {
	_acX = 0
	_acY = 0
	_acZ = 0;
	_device: Device

	constructor(device: Device) {
		//window.ondevicemotion = deviceMotion;//★★★旧
		window.addEventListener("devicemotion", this.deviceMotion);
		this._device = device
	}

	deviceMotion(e: DeviceMotionEvent) {
		var aIG: DeviceMotionEventAcceleration | null = e.accelerationIncludingGravity;
		if (aIG == null) return;
		if(aIG.x) this._acX = int(aIG.x);
		if(aIG.y) this._acY = int(aIG.y);
		if(aIG.z) this._acZ = int(aIG.z);
		if(this._device.type == PT_Android) {//Android と iOS で正負が逆になる
			this._acX = -this._acX;
			this._acY = -this._acY;
			this._acZ = -this._acZ;
		}
	}
}

//キー入力用
export class Key {
	public _se: SE
	public inkey: number
	public key: number[]

	constructor(se: SE) {
		this.inkey = 0
		this.key = new Array(256);
		this._se = se
	}

	clr() {
		this.inkey = 0;
		for(var i = 0; i < 256; i++) this.key[i] = 0;
	}

	on(e: KeyboardEvent) {
		//log( `${e.key} : ${e.code} : ${e.keyCode} : ${codeToStr(e.code)}` )

		if(this._se.snd_init == 0) this._se.loadSoundSPhone();//【重要】サウンドの読み込み
		this.inkey = codeToStr(e.code)
		this.key[codeToStr(e.code)]++
	}

	off(e: KeyboardEvent) {
		this.inkey = 0;
		this.key[codeToStr(e.code)] = 0;
	}
}
