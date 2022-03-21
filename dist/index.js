/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/WWS.ts":
/*!********************!*\
  !*** ./src/WWS.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
JavaScript&HTML5 ゲーム開発用システム
開発 ワールドワイドソフトウェア有限会社

（使用条件）
本ソースコードの著作権は開発元にあります。
利用されたい方はメールにてお問い合わせ下さい。
th@wwsft.com ワールドワイドソフトウェア 廣瀬
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MMS = exports.DEBUG = exports.SYS_VER = void 0;
const Utility_1 = __webpack_require__(/*! ./WWSlib/Utility */ "./src/WWSlib/Utility.ts");
const Event_1 = __webpack_require__(/*! ./WWSlib/Event */ "./src/WWSlib/Event.ts");
const Canvas_1 = __webpack_require__(/*! ./WWSlib/Canvas */ "./src/WWSlib/Canvas.ts");
const Draw_1 = __webpack_require__(/*! ./WWSlib/Draw */ "./src/WWSlib/Draw.ts");
const Sound_1 = __webpack_require__(/*! ./WWSlib/Sound */ "./src/WWSlib/Sound.ts");
const Device_1 = __webpack_require__(/*! ./WWSlib/Device */ "./src/WWSlib/Device.ts");
// -------------変数-------------
exports.SYS_VER = "Ver.20201111";
exports.DEBUG = false;
//処理の進行を管理する
// main_idx の値
//   0: 初期化
//   1: セーブできない警告
//   2: メイン処理
let main_idx = 0;
let main_tmr = 0;
let stop_flg = 0; // メイン処理の一時停止
const NUA = navigator.userAgent; //機種判定
const supportTouch = 'ontouchend' in document; //タッチイベントが使えるか？
// フレームレート frames / second
let FPS = 30;
//ローカルストレージ
const LS_KEYNAME = "SAVEDATA"; //keyName 任意に変更可
//保存できるか判定し、できない場合に警告を出す　具体的には iOS Safari プライベートブラウズがON（保存できない）状態に警告を出す
let CHECK_LS = false;
// -------------リアルタイム処理-------------
class MMS {
    constructor() {
        window.addEventListener("load", this.wwsSysInit.bind(this));
        this.canvas = new Canvas_1.Canvas();
        this.draw = new Draw_1.Draw();
        this.se = new Sound_1.SE();
        this.mouse = new Event_1.Mouse(this.se);
        this.touch = new Event_1.Touch(this.se);
        this.key = new Event_1.Key(this.se);
        this.device = new Device_1.Device();
    }
    wwsSysMain() {
        let stime = Date.now();
        if (this.canvas.bakW != window.innerWidth || this.canvas.bakH != window.innerHeight) {
            this.canvas.initCanvas();
            this.draw.lineW(this.draw.line_width);
            (0, Utility_1.log)("canvas size changed " + this.canvas.bakW + "x" + this.canvas.bakH);
        }
        main_tmr++;
        switch (main_idx) {
            case 0:
                this.setup();
                main_idx = 2;
                if (CHECK_LS == true) {
                    try {
                        localStorage.setItem("_save_test", "testdata");
                    }
                    catch (e) {
                        main_idx = 1;
                    }
                }
                break;
            case 1:
                let x = (0, Utility_1.int)(Canvas_1.CWIDTH / 2);
                let y = (0, Utility_1.int)(Canvas_1.CHEIGHT / 6);
                let fs = (0, Utility_1.int)(Canvas_1.CHEIGHT / 16);
                this.draw.fill("black");
                this.draw.fText("※セーブデータが保存されません※", x, y / 2, fs, "yellow");
                this.draw.fTextN("iOS端末をお使いの場合は\nSafariのプライベートブラウズ\nをオフにして起動して下さい。", x, y * 2, y, fs, "yellow");
                this.draw.fTextN("その他の機種（ブラウザ）では\nローカルストレージへの保存を\n許可する設定にして下さい。", x, y * 4, y, fs, "yellow");
                this.draw.fText("このまま続けるには画面をタップ", x, y * 5.5, fs, "lime");
                if (this.mouse.tapC != 0)
                    main_idx = 2;
                break;
            case 2: //メイン処理
                if (stop_flg == 0) {
                    this.mainloop();
                }
                else {
                    this.clrKey();
                    main_tmr--;
                }
                if (this.se.wait_se > 0)
                    this.se.wait_se--;
                break;
            default: break;
        }
        var ptime = Date.now() - stime;
        if (ptime < 0)
            ptime = 0;
        if (ptime > (0, Utility_1.int)(1000 / FPS))
            ptime = (0, Utility_1.int)(1000 / FPS);
        setTimeout(this.wwsSysMain.bind(this), (0, Utility_1.int)(1000 / FPS) - ptime);
    }
    wwsSysInit() {
        this.canvas.initCanvas();
        if (NUA.indexOf('Android') > 0) {
            this.device.type = Device_1.PT_Android;
        }
        else if (NUA.indexOf('iPhone') > 0 || NUA.indexOf('iPod') > 0 || NUA.indexOf('iPad') > 0) {
            this.device.type = Device_1.PT_iOS;
            window.scrollTo(0, 1); //iPhoneのURLバーを消す位置に
        }
        else if (NUA.indexOf('Silk') > 0) {
            this.device.type = Device_1.PT_Kindle;
        }
        window.addEventListener("keydown", this.key.on.bind(this.key));
        window.addEventListener("keyup", this.key.off.bind(this.key));
        if (supportTouch == true) {
            this.canvas.cvs.addEventListener("touchstart", this.touch.start.bind(this.touch));
            this.canvas.cvs.addEventListener("touchmove", this.touch.move.bind(this.touch));
            this.canvas.cvs.addEventListener("touchend", this.touch.end.bind(this.touch));
            this.canvas.cvs.addEventListener("touchcancel", this.touch.cancel.bind(this.touch));
        }
        else {
            this.canvas.cvs.addEventListener("mousedown", this.mouse.down.bind(this.mouse));
            this.canvas.cvs.addEventListener("mousemove", this.mouse.move.bind(this.mouse));
            this.canvas.cvs.addEventListener("mouseup", this.mouse.up.bind(this.mouse));
            this.canvas.cvs.addEventListener("mouseout", this.mouse.out.bind(this.mouse));
        }
        this.wwsSysMain();
    }
}
exports.MMS = MMS;


/***/ }),

/***/ "./src/WWSlib/Canvas.ts":
/*!******************************!*\
  !*** ./src/WWSlib/Canvas.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Canvas = exports.SCALE = exports.CHEIGHT = exports.CWIDTH = void 0;
const Utility_1 = __webpack_require__(/*! ./Utility */ "./src/WWSlib/Utility.ts");
// -------------描画面(キャンバス)-------------
exports.CWIDTH = 800;
exports.CHEIGHT = 600;
exports.SCALE = 1.0; // スケール値設定+タップ位置計算用
class Canvas {
    constructor() {
        this.cvs = document.getElementById("canvas");
        this.bg = this.cvs.getContext("2d");
        this.bakW = 0;
        this.bakH = 0;
    }
    initCanvas() {
        let winW = window.innerWidth;
        let winH = window.innerHeight;
        this.bakW = winW;
        this.bakH = winH;
        if (winH < winW * (exports.CHEIGHT / exports.CWIDTH)) {
            //winW を比率に合わせて調整
            winW = (0, Utility_1.int)(winH * (exports.CWIDTH / exports.CHEIGHT));
            (0, Utility_1.log)("1 width: " + winW + " height: " + winH);
        }
        else {
            //winH を比率に合わせて調整
            winH = (0, Utility_1.int)(exports.CHEIGHT * winW / exports.CWIDTH);
            (0, Utility_1.log)("2 width: " + winW + " height: " + winH);
        }
        this.cvs.width = winW;
        this.cvs.height = winH;
        exports.SCALE = winW / exports.CWIDTH;
        if (this.bg == null)
            return;
        this.bg.scale(exports.SCALE, exports.SCALE);
        this.bg.textAlign = "center";
        this.bg.textBaseline = "middle";
        //log("width: " + winW + " height: " + winH)
    }
    canvasSize(w, h) {
        exports.CWIDTH = w;
        exports.CHEIGHT = h;
        this.initCanvas();
    }
}
exports.Canvas = Canvas;


/***/ }),

/***/ "./src/WWSlib/Device.ts":
/*!******************************!*\
  !*** ./src/WWSlib/Device.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Device = exports.PT_Kindle = exports.PT_Android = exports.PT_iOS = exports.PT_PC = void 0;
//端末の種類
exports.PT_PC = 0;
exports.PT_iOS = 1;
exports.PT_Android = 2;
exports.PT_Kindle = 3;
class Device {
    constructor() {
        this._type = exports.PT_PC;
    }
    get type() { return this._type; }
    set type(type) { this._type = type; }
}
exports.Device = Device;


/***/ }),

/***/ "./src/WWSlib/Draw.ts":
/*!****************************!*\
  !*** ./src/WWSlib/Draw.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Draw = void 0;
const Utility_1 = __webpack_require__(/*! ./Utility */ "./src/WWSlib/Utility.ts");
const Canvas_1 = __webpack_require__(/*! ./Canvas */ "./src/WWSlib/Canvas.ts");
class Draw extends Canvas_1.Canvas {
    constructor() {
        super();
        this.img = new Array(256);
        this.img_loaded = new Array(256);
        this.line_width = 1;
    }
    loadImg(n, filename) {
        (0, Utility_1.log)("画像" + n + " " + filename + "読み込み開始");
        this.img_loaded[n] = false;
        this.img[n] = new Image();
        this.img[n].src = filename;
        this.img[n].onload = () => {
            (0, Utility_1.log)("画像" + n + " " + filename + "読み込み完了");
            this.img_loaded[n] = true;
        };
    }
    // -------------描画1 図形-------------
    setAlp(par) {
        if (this.bg)
            this.bg.globalAlpha = par / 100;
    }
    colorRGB(cr, cg, cb) {
        cr = (0, Utility_1.int)(cr);
        cg = (0, Utility_1.int)(cg);
        cb = (0, Utility_1.int)(cb);
        return ("rgb(" + cr + "," + cg + "," + cb + ")");
    }
    lineW(wid) {
        this.line_width = wid; //バックアップ
        if (this.bg == null)
            return;
        this.bg.lineWidth = wid;
        this.bg.lineCap = "round";
        this.bg.lineJoin = "round";
    }
    line(x0, y0, x1, y1, col) {
        if (this.bg == null)
            return;
        this.bg.strokeStyle = col;
        this.bg.beginPath();
        this.bg.moveTo(x0, y0);
        this.bg.lineTo(x1, y1);
        this.bg.stroke();
    }
    fill(col) {
        if (this.bg)
            this.bg.fillStyle = col;
        if (this.bg)
            this.bg.fillRect(0, 0, Canvas_1.CWIDTH, Canvas_1.CHEIGHT);
    }
    fRect(x, y, w, h, col) {
        if (this.bg == null)
            return;
        this.bg.fillStyle = col;
        this.bg.fillRect(x, y, w, h);
    }
    sRect(x, y, w, h, col) {
        if (this.bg == null)
            return;
        this.bg.strokeStyle = col;
        this.bg.strokeRect(x, y, w, h);
    }
    fCir(x, y, r, col) {
        if (this.bg == null)
            return;
        this.bg.fillStyle = col;
        this.bg.beginPath();
        this.bg.arc(x, y, r, 0, Math.PI * 2, false);
        this.bg.closePath();
        this.bg.fill();
    }
    sCir(x, y, r, col) {
        if (this.bg == null)
            return;
        this.bg.strokeStyle = col;
        this.bg.beginPath();
        this.bg.arc(x, y, r, 0, Math.PI * 2, false);
        this.bg.closePath();
        this.bg.stroke();
    }
    // -------------描画2 画像-------------
    drawImg(n, x, y) {
        if (this.bg == null)
            return;
        if (this.img_loaded[n] == false)
            return;
        this.bg.drawImage(this.img[n], x, y);
    }
    drawImgLR(n, x, y) {
        if (this.img_loaded[n] == false)
            return;
        const w = this.img[n].width;
        const h = this.img[n].height;
        if (this.bg) {
            this.bg.save();
            this.bg.translate(x + w / 2, y + h / 2);
            this.bg.scale(-1, 1);
            this.bg.drawImage(this.img[n], -w / 2, -h / 2);
            this.bg.restore();
        }
    }
    //センタリング表示
    drawImgC(n, x, y) {
        if (this.img_loaded[n] == false)
            return;
        if (this.bg)
            this.bg.drawImage(this.img[n], x - (0, Utility_1.int)(this.img[n].width / 2), y - (0, Utility_1.int)(this.img[n].height / 2));
    }
    //拡大縮小
    drawImgS(n, x, y, w, h) {
        if (this.img_loaded[n] == false)
            return;
        if (this.bg)
            this.bg.drawImage(this.img[n], x, y, w, h);
    }
    //切り出し + 拡大縮小
    drawImgTS(n, sx, sy, sw, sh, cx, cy, cw, ch) {
        if (this.img_loaded[n] == false)
            return;
        if (this.bg) {
            this.bg.drawImage(this.img[n], sx, sy, sw, sh, cx, cy, cw, ch);
        }
    }
    //回転
    drawImgR(n, x, y, arg) {
        if (this.img_loaded[n] == false)
            return;
        const w = this.img[n].width;
        const h = this.img[n].height;
        if (this.bg) {
            this.bg.save();
            this.bg.translate(x + w / 2, y + h / 2);
            this.bg.rotate(arg);
            this.bg.drawImage(this.img[n], -w / 2, -h / 2);
            this.bg.restore();
        }
    }
    // -------------描画3 文字-------------
    fText(str, x, y, siz, col) {
        if (this.bg) {
            this.bg.font = (0, Utility_1.int)(siz) + "px bold monospace";
            this.bg.fillStyle = "black";
            this.bg.fillText(str, x + 1, y + 1);
            this.bg.fillStyle = col;
            this.bg.fillText(str, x, y);
        }
    }
    fTextN(str, x, y, h, siz, col) {
        if (this.bg == null)
            return;
        const sn = str.split("\n");
        this.bg.font = (0, Utility_1.int)(siz) + "px bold monospace";
        if (sn.length == 1) {
            h = 0;
        }
        else {
            y = y - (0, Utility_1.int)(h / 2);
            h = (0, Utility_1.int)(h / (sn.length - 1));
        }
        for (let i = 0; i < sn.length; i++) {
            this.bg.fillStyle = "black";
            this.bg.fillText(str, x + 1, y + 1);
            this.bg.fillStyle = col;
            this.bg.fillText(str, x, y);
        }
    }
    mTextWidth(str) {
        if (this.bg == null)
            return;
        return this.bg.measureText(str).width;
    }
}
exports.Draw = Draw;


/***/ }),

/***/ "./src/WWSlib/Event.ts":
/*!*****************************!*\
  !*** ./src/WWSlib/Event.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Key = exports.Acc = exports.Mouse = exports.Touch = exports.K_z = exports.K_a = exports.K_DOWN = exports.K_RIGHT = exports.K_UP = exports.K_LEFT = exports.K_SPACE = exports.K_ENTER = void 0;
const Utility_1 = __webpack_require__(/*! ./Utility */ "./src/WWSlib/Utility.ts");
const Canvas_1 = __webpack_require__(/*! ./Canvas */ "./src/WWSlib/Canvas.ts");
const Device_1 = __webpack_require__(/*! ./Device */ "./src/WWSlib/Device.ts");
exports.K_ENTER = 13;
exports.K_SPACE = 32;
exports.K_LEFT = 37;
exports.K_UP = 38;
exports.K_RIGHT = 39;
exports.K_DOWN = 40;
exports.K_a = 65;
exports.K_z = 90;
// ---------- タップ入力 ----------
class Touch {
    constructor(se) {
        this._se = se;
        this.tapX = 0;
        this.tapY = 0;
        this.tapC = 0;
    }
    start(e) {
        e.preventDefault(); //キャンバスの選択／スクロール等を抑制する
        const target = e.target;
        const rect = target.getBoundingClientRect();
        this.tapX = e.touches[0].clientX - rect.left;
        this.tapY = e.touches[0].clientY - rect.top;
        this.tapC = 1;
        this.transformXY();
        if (this._se.snd_init == 0)
            this._se.loadSoundSPhone(); //【重要】サウンドの読み込み
    }
    move(e) {
        e.preventDefault();
        const target = e.target;
        const rect = target.getBoundingClientRect();
        this.tapX = e.touches[0].clientX - rect.left;
        this.tapY = e.touches[0].clientY - rect.top;
        this.transformXY();
    }
    end(e) {
        e.preventDefault();
        this.tapC = 0; //※マウス操作ではmouseOutがこれになる
    }
    cancel(e) {
        this.tapX = -1;
        this.tapY = -1;
        this.tapC = 0;
    }
    transformXY() {
        this.tapX = (0, Utility_1.int)(this.tapX / Canvas_1.SCALE);
        this.tapY = (0, Utility_1.int)(this.tapY / Canvas_1.SCALE);
    }
}
exports.Touch = Touch;
// -------------マウス入力-------------
class Mouse {
    constructor(se) {
        this._se = se;
        this.tapC = 0;
        this.tapX = 0;
        this.tapY = 0;
    }
    down(e) {
        e.preventDefault(); //キャンバスの選択／スクロール等を抑制する
        if (!e.target)
            return;
        const target = e.target;
        var rect = target.getBoundingClientRect();
        this.tapX = e.clientX - rect.left;
        this.tapY = e.clientY - rect.top;
        this.tapC = 1;
        this.transformXY();
        if (this._se.snd_init == 0)
            this._se.loadSoundSPhone(); //【重要】サウンドの読み込み
    }
    move(e) {
        e.preventDefault();
        if (!e.target)
            return;
        const target = e.target;
        const rect = target.getBoundingClientRect();
        this.tapX = e.clientX - rect.left;
        this.tapY = e.clientY - rect.top;
        this.transformXY();
    }
    up(e) { this.tapC = 0; }
    out(e) { this.tapC = 0; }
    transformXY() {
        this.tapX = (0, Utility_1.int)(this.tapX / Canvas_1.SCALE);
        this.tapY = (0, Utility_1.int)(this.tapY / Canvas_1.SCALE);
    }
}
exports.Mouse = Mouse;
// ---------- 加速度センサー ----------
class Acc {
    constructor(device) {
        this._acX = 0;
        this._acY = 0;
        this._acZ = 0;
        //window.ondevicemotion = deviceMotion;//★★★旧
        window.addEventListener("devicemotion", this.deviceMotion);
        this._device = device;
    }
    deviceMotion(e) {
        var aIG = e.accelerationIncludingGravity;
        if (aIG == null)
            return;
        if (aIG.x)
            this._acX = (0, Utility_1.int)(aIG.x);
        if (aIG.y)
            this._acY = (0, Utility_1.int)(aIG.y);
        if (aIG.z)
            this._acZ = (0, Utility_1.int)(aIG.z);
        if (this._device.type == Device_1.PT_Android) { //Android と iOS で正負が逆になる
            this._acX = -this._acX;
            this._acY = -this._acY;
            this._acZ = -this._acZ;
        }
    }
}
exports.Acc = Acc;
//キー入力用
class Key {
    constructor(se) {
        this._inkey = 0;
        this._key = new Array(256);
        this._se = se;
    }
    clr() {
        this._inkey = 0;
        for (var i = 0; i < 256; i++)
            this._key[i] = 0;
    }
    on(e) {
        if (this._se.snd_init == 0)
            this._se.loadSoundSPhone(); //【重要】サウンドの読み込み
        this._inkey = e.keyCode;
        this._key[e.keyCode]++;
        //log(inkey);
    }
    off(e) {
        this._inkey = 0;
        this._key[e.keyCode] = 0;
    }
}
exports.Key = Key;


/***/ }),

/***/ "./src/WWSlib/Sound.ts":
/*!*****************************!*\
  !*** ./src/WWSlib/Sound.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SE = exports.SOUND_ON = void 0;
// -------------サウンド制御-------------
exports.SOUND_ON = true;
class SE {
    constructor() {
        this.wait_se = 0;
        this.snd_init = 0;
        //サウンドファイルを読み込んだか(スマホ対策)
        this.wait_se = 0;
        this.snd_init = 0;
        this.soundFile = new Array(256);
        this.isBgm = -1;
        this.bgmNo = 0;
        this.seNo = -1;
        this.soundloaded = 0; //いくつファイルを読み込んだか
        this.sf_name = new Array(256);
    }
    loadSoundSPhone() {
        try {
            for (let i = 0; i < this.soundloaded; i++) {
                this.soundFile[i] = new Audio(this.sf_name[i]);
                this.soundFile[i].load();
            }
        }
        catch (e) {
        }
        this.snd_init = 2; //スマホでファイルを読み込んだ
    }
    loadSound(n, filename) {
        this.sf_name[n] = filename;
        this.soundloaded++;
    }
    playSE(n) {
        if (exports.SOUND_ON == false)
            return;
        if (this.isBgm == 2)
            return;
        if (this.wait_se == 0) {
            this.seNo = n;
            this.soundFile[n].currentTime = 0;
            this.soundFile[n].loop = false;
            this.soundFile[n].play();
            this.wait_se = 3; //ブラウザに負荷をかけないように連続して流さないようにする
        }
    }
}
exports.SE = SE;


/***/ }),

/***/ "./src/WWSlib/Utility.ts":
/*!*******************************!*\
  !*** ./src/WWSlib/Utility.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.abs = exports.rnd = exports.str = exports.int = exports.log = void 0;
// -------------各種の関数-------------
function log(msg) {
    console.log(msg);
}
exports.log = log;
function int(val) {
    let num = String(val);
    return parseInt(num); //プラスマイナスどちらも小数部分を切り捨て
}
exports.int = int;
function str(val) {
    return String(val);
}
exports.str = str;
function rnd(max) {
    return Math.floor(Math.random() * max);
}
exports.rnd = rnd;
function abs(val) {
    return Math.abs(val);
}
exports.abs = abs;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const WWS_1 = __webpack_require__(/*! ./WWS */ "./src/WWS.ts");
const Utility_1 = __webpack_require__(/*! ./WWSlib/Utility */ "./src/WWSlib/Utility.ts");
let ballX = 600;
let ballY = 300;
let ballXp = 10;
let ballYp = 3;
let barX = 600;
let barY = 700;
let score = 0;
let scene = 0;
class MyGame extends WWS_1.MMS {
    constructor() {
        super();
    }
    clrKey() { }
    setup() {
        this.canvas.canvasSize(1200, 800);
        this.draw.lineW(3);
        this.draw.loadImg(0, 'image/bg.png');
        this.se.loadSound(0, "sound/se.m4a");
    }
    mainloop() {
        this.draw.drawImg(0, 0, 0);
        this.draw.setAlp(50);
        this.draw.fRect(250, 50, 700, 750, "black");
        this.draw.setAlp(100);
        this.draw.sRect(250, 50, 700, 760, "silver");
        this.draw.fText("SCORE " + score, 600, 25, 36, "white");
        this.draw.sCir(ballX, ballY, 10, "lime");
        this.draw.sRect(barX - 50, barY - 10, 100, 20, "violet");
        if (scene == 0) { // ゲーム開始前
            this.draw.fText("Squash Game", 600, 200, 48, "cyan");
            this.draw.fText("Click to start!", 600, 600, 36, "gold");
            if (this.mouse.tapC == 1) {
                ballX = 600;
                ballY = 300;
                ballXp = 12;
                ballYp = 8;
                score = 0;
                scene = 1;
            }
        }
        else if (scene == 1) { // ゲーム中
            ballX = ballX + ballXp;
            ballY = ballY + ballYp;
            if (ballX <= 260 || ballX >= 940)
                ballXp = -ballXp;
            if (ballY <= 60)
                ballYp = 8 + (0, Utility_1.rnd)(8);
            if (ballY >= 800)
                scene = 2;
            barX = this.mouse.tapX;
            if (barX < 300)
                barX = 300;
            if (barX > 900)
                barX = 900;
            if (barX - 60 < ballX && ballX < barX + 60 && barY - 30 < ballY && ballY < barY - 10) {
                ballYp = -8 - (0, Utility_1.rnd)(8);
                score += 100;
                this.se.playSE(0);
            }
        }
        else if (scene == 2) { // ゲーム終了
            this.draw.fText("Game Over", 600, 400, 36, "red");
            if (this.mouse.tapC == 1) {
                scene = 0;
                this.mouse.tapC = 0;
            }
        }
    }
}
new MyGame();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QkFBRSxNQUFNLEdBQUcsQ0FBQyxHQUFHLGlCQUFHLEVBQUMsQ0FBQyxDQUFDO1lBQ25DLElBQUcsS0FBSyxJQUFJLEdBQUc7Z0JBQUUsS0FBSyxHQUFHLENBQUM7WUFDMUIsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtZQUN0QixJQUFHLElBQUksR0FBRyxHQUFHO2dCQUFFLElBQUksR0FBRyxHQUFHO1lBQ3pCLElBQUcsSUFBSSxHQUFHLEdBQUc7Z0JBQUUsSUFBSSxHQUFHLEdBQUc7WUFDekIsSUFBRyxJQUFJLEdBQUMsRUFBRSxHQUFHLEtBQUssSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFDLEVBQUUsSUFBSSxJQUFJLEdBQUMsRUFBRSxHQUFHLEtBQUssSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFDLEVBQUUsRUFBRTtnQkFDM0UsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFDLGlCQUFHLEVBQUMsQ0FBQyxDQUFDO2dCQUNsQixLQUFLLElBQUksR0FBRztnQkFDWixJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7YUFDbEI7U0FDRjthQUFNLElBQUcsS0FBSyxJQUFJLENBQUMsRUFBRSxFQUFDLFFBQVE7WUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQztZQUNqRCxJQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBQztnQkFDdEIsS0FBSyxHQUFHLENBQUM7Z0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQzthQUNwQjtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBRUQsSUFBSSxNQUFNLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvV1dTLnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvQ2FudmFzLnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvRGV2aWNlLnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvRHJhdy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV1dTbGliL0V2ZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvU291bmQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9VdGlsaXR5LnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbkphdmFTY3JpcHQmSFRNTDUg44Ky44O844Og6ZaL55m655So44K344K544OG44OgXG7plovnmbog44Ov44O844Or44OJ44Ov44Kk44OJ44K944OV44OI44Km44Kn44Ki5pyJ6ZmQ5Lya56S+XG5cbu+8iOS9v+eUqOadoeS7tu+8iVxu5pys44K944O844K544Kz44O844OJ44Gu6JGX5L2c5qip44Gv6ZaL55m65YWD44Gr44GC44KK44G+44GZ44CCXG7liKnnlKjjgZXjgozjgZ/jgYTmlrnjga/jg6Hjg7zjg6vjgavjgabjgYrllY/jgYTlkIjjgo/jgZvkuIvjgZXjgYTjgIJcbnRoQHd3c2Z0LmNvbSDjg6/jg7zjg6vjg4njg6/jgqTjg4njgr3jg5Xjg4jjgqbjgqfjgqIg5buj54CsXG4qL1xuXG5pbXBvcnQgeyBpbnQsIGxvZyB9IGZyb20gJy4vV1dTbGliL1V0aWxpdHknXG5pbXBvcnQgeyBUb3VjaCwgTW91c2UsIEtleSB9IGZyb20gXCIuL1dXU2xpYi9FdmVudFwiXG5pbXBvcnQgeyBDV0lEVEgsIENIRUlHSFQsIENhbnZhcyB9IGZyb20gXCIuL1dXU2xpYi9DYW52YXNcIlxuaW1wb3J0IHsgRHJhdyB9IGZyb20gXCIuL1dXU2xpYi9EcmF3XCJcbmltcG9ydCB7IFNFIH0gZnJvbSAnLi9XV1NsaWIvU291bmQnXG5pbXBvcnQgeyBEZXZpY2UsIFBUX0FuZHJvaWQsIFBUX2lPUywgUFRfS2luZGxlIH0gZnJvbSAnLi9XV1NsaWIvRGV2aWNlJ1xuLy8gLS0tLS0tLS0tLS0tLeWkieaVsC0tLS0tLS0tLS0tLS1cbmV4cG9ydCBjb25zdCAgU1lTX1ZFUiA9IFwiVmVyLjIwMjAxMTExXCJcbmV4cG9ydCBsZXQgIERFQlVHID0gZmFsc2VcblxuXG4vL+WHpueQhuOBrumAsuihjOOCkueuoeeQhuOBmeOCi1xuLy8gbWFpbl9pZHgg44Gu5YCkXG4vLyAgIDA6IOWIneacn+WMllxuLy8gICAxOiDjgrvjg7zjg5bjgafjgY3jgarjgYTorablkYpcbi8vICAgMjog44Oh44Kk44Oz5Yem55CGXG5sZXQgbWFpbl9pZHggPSAwXG5sZXQgbWFpbl90bXIgPSAwXG5sZXQgc3RvcF9mbGcgPSAwIC8vIOODoeOCpOODs+WHpueQhuOBruS4gOaZguWBnOatolxuY29uc3QgTlVBID0gbmF2aWdhdG9yLnVzZXJBZ2VudDsvL+apn+eoruWIpOWumlxuY29uc3Qgc3VwcG9ydFRvdWNoID0gJ29udG91Y2hlbmQnIGluIGRvY3VtZW50Oy8v44K/44OD44OB44Kk44OZ44Oz44OI44GM5L2/44GI44KL44GL77yfXG5cbi8vIOODleODrOODvOODoOODrOODvOODiCBmcmFtZXMgLyBzZWNvbmRcbmxldCAgRlBTID0gMzBcbi8v44Ot44O844Kr44Or44K544OI44Os44O844K4XG5jb25zdCBMU19LRVlOQU1FID0gXCJTQVZFREFUQVwiOy8va2V5TmFtZSDku7vmhI/jgavlpInmm7Tlj69cbi8v5L+d5a2Y44Gn44GN44KL44GL5Yik5a6a44GX44CB44Gn44GN44Gq44GE5aC05ZCI44Gr6K2m5ZGK44KS5Ye644GZ44CA5YW35L2T55qE44Gr44GvIGlPUyBTYWZhcmkg44OX44Op44Kk44OZ44O844OI44OW44Op44Km44K644GMT07vvIjkv53lrZjjgafjgY3jgarjgYTvvInnirbmhYvjgavorablkYrjgpLlh7rjgZlcbmxldCBDSEVDS19MUyA9IGZhbHNlO1xuXG4vLyAtLS0tLS0tLS0tLS0t44Oq44Ki44Or44K/44Kk44Og5Yem55CGLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1NUyB7XG4gIGFic3RyYWN0IHNldHVwKCk6IHZvaWRcbiAgYWJzdHJhY3QgY2xyS2V5KCk6IHZvaWRcbiAgYWJzdHJhY3QgbWFpbmxvb3AoKTogdm9pZFxuXG4gIHB1YmxpYyBjYW52YXM6IENhbnZhc1xuICBwdWJsaWMgZHJhdzogRHJhd1xuICBwdWJsaWMgbW91c2U6IE1vdXNlXG4gIHB1YmxpYyB0b3VjaDogVG91Y2hcbiAgcHVibGljIGtleTogS2V5XG4gIHB1YmxpYyBzZTogU0VcbiAgcHVibGljIGRldmljZTogRGV2aWNlXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIHRoaXMud3dzU3lzSW5pdC5iaW5kKHRoaXMpKVxuICAgIHRoaXMuY2FudmFzID0gbmV3IENhbnZhcygpXG4gICAgdGhpcy5kcmF3ID0gbmV3IERyYXcoKVxuICAgIHRoaXMuc2UgPSBuZXcgU0UoKVxuICAgIHRoaXMubW91c2UgPSBuZXcgTW91c2UodGhpcy5zZSlcbiAgICB0aGlzLnRvdWNoID0gbmV3IFRvdWNoKHRoaXMuc2UpXG4gICAgdGhpcy5rZXkgPSBuZXcgS2V5KHRoaXMuc2UpXG4gICAgdGhpcy5kZXZpY2UgPSBuZXcgRGV2aWNlKClcbiAgfVxuXG4gIHd3c1N5c01haW4oKTogdm9pZCB7XG5cbiAgICBsZXQgc3RpbWUgPSBEYXRlLm5vdygpXG5cbiAgICBpZih0aGlzLmNhbnZhcy5iYWtXICE9IHdpbmRvdy5pbm5lcldpZHRoIHx8IHRoaXMuY2FudmFzLmJha0ggIT0gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICB0aGlzLmNhbnZhcy5pbml0Q2FudmFzKClcbiAgICAgIHRoaXMuZHJhdy5saW5lVyh0aGlzLmRyYXcubGluZV93aWR0aClcbiAgICAgIGxvZyhcImNhbnZhcyBzaXplIGNoYW5nZWQgXCIgKyB0aGlzLmNhbnZhcy5iYWtXICsgXCJ4XCIgKyB0aGlzLmNhbnZhcy5iYWtIKTtcblxuICAgIH1cblxuICAgIG1haW5fdG1yICsrXG5cbiAgICBzd2l0Y2gobWFpbl9pZHgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgdGhpcy5zZXR1cCgpXG4gICAgICAgIG1haW5faWR4ID0gMlxuICAgICAgICBpZihDSEVDS19MUyA9PSB0cnVlKSB7XG4gICAgICAgICAgdHJ5IHtsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIl9zYXZlX3Rlc3RcIiwgXCJ0ZXN0ZGF0YVwiKX0gY2F0Y2goZSkgeyBtYWluX2lkeCA9IDEgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IHggPSBpbnQoQ1dJRFRIIC8gMilcbiAgICAgICAgbGV0IHkgPSBpbnQoQ0hFSUdIVCAvIDYpXG4gICAgICAgIGxldCBmcyA9IGludChDSEVJR0hUIC8gMTYpXG4gICAgICAgIHRoaXMuZHJhdy5maWxsKFwiYmxhY2tcIilcbiAgICAgICAgdGhpcy5kcmF3LmZUZXh0KFwi4oC744K744O844OW44OH44O844K/44GM5L+d5a2Y44GV44KM44G+44Gb44KT4oC7XCIsIHgsIHkvMiwgZnMsIFwieWVsbG93XCIpO1xuICAgICAgICB0aGlzLmRyYXcuZlRleHROKFwiaU9T56uv5pyr44KS44GK5L2/44GE44Gu5aC05ZCI44GvXFxuU2FmYXJp44Gu44OX44Op44Kk44OZ44O844OI44OW44Op44Km44K6XFxu44KS44Kq44OV44Gr44GX44Gm6LW35YuV44GX44Gm5LiL44GV44GE44CCXCIsIHgsIHkqMiwgeSwgZnMsIFwieWVsbG93XCIpO1xuICAgICAgICB0aGlzLmRyYXcuZlRleHROKFwi44Gd44Gu5LuW44Gu5qmf56iu77yI44OW44Op44Km44K277yJ44Gn44GvXFxu44Ot44O844Kr44Or44K544OI44Os44O844K444G444Gu5L+d5a2Y44KSXFxu6Kix5Y+v44GZ44KL6Kit5a6a44Gr44GX44Gm5LiL44GV44GE44CCXCIsIHgsIHkqNCwgeSwgZnMsIFwieWVsbG93XCIpO1xuICAgICAgICB0aGlzLmRyYXcuZlRleHQoXCLjgZPjga7jgb7jgb7ntprjgZHjgovjgavjga/nlLvpnaLjgpLjgr/jg4Pjg5dcIiwgeCwgeSo1LjUsIGZzLCBcImxpbWVcIik7XG4gICAgICAgIGlmKHRoaXMubW91c2UudGFwQyAhPSAwKSBtYWluX2lkeCA9IDI7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDI6IC8v44Oh44Kk44Oz5Yem55CGXG4gICAgICAgIGlmKHN0b3BfZmxnID09IDApIHtcbiAgICAgICAgICB0aGlzLm1haW5sb29wKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNscktleSgpXG4gICAgICAgICAgbWFpbl90bXItLVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuc2Uud2FpdF9zZSA+IDApIHRoaXMuc2Uud2FpdF9zZS0tXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OiBicmVha1xuICAgIH1cbiAgICB2YXIgcHRpbWUgPSBEYXRlLm5vdygpIC0gc3RpbWU7XG4gICAgaWYocHRpbWUgPCAwKSBwdGltZSA9IDA7XG4gICAgaWYocHRpbWUgPiBpbnQoMTAwMC9GUFMpKSBwdGltZSA9IGludCgxMDAwL0ZQUyk7XG5cbiAgICBzZXRUaW1lb3V0KHRoaXMud3dzU3lzTWFpbi5iaW5kKHRoaXMpLCBpbnQoMTAwMC9GUFMpLXB0aW1lKTtcbiAgfVxuXG4gIHd3c1N5c0luaXQoKSB7XG4gICAgdGhpcy5jYW52YXMuaW5pdENhbnZhcygpXG4gICAgaWYoIE5VQS5pbmRleE9mKCdBbmRyb2lkJykgPiAwICkge1xuICAgICAgdGhpcy5kZXZpY2UudHlwZSA9IFBUX0FuZHJvaWQ7XG4gICAgfVxuICAgIGVsc2UgaWYoIE5VQS5pbmRleE9mKCdpUGhvbmUnKSA+IDAgfHwgTlVBLmluZGV4T2YoJ2lQb2QnKSA+IDAgfHwgTlVBLmluZGV4T2YoJ2lQYWQnKSA+IDAgKSB7XG4gICAgICB0aGlzLmRldmljZS50eXBlID0gUFRfaU9TO1xuICAgICAgd2luZG93LnNjcm9sbFRvKDAsMSk7Ly9pUGhvbmXjga5VUkzjg5Djg7zjgpLmtojjgZnkvY3nva7jgatcbiAgICB9XG4gICAgZWxzZSBpZiggTlVBLmluZGV4T2YoJ1NpbGsnKSA+IDAgKSB7XG4gICAgICB0aGlzLmRldmljZS50eXBlID0gUFRfS2luZGxlO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmtleS5vbi5iaW5kKHRoaXMua2V5KSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMua2V5Lm9mZi5iaW5kKHRoaXMua2V5KSlcblxuICAgIGlmKHN1cHBvcnRUb3VjaCA9PSB0cnVlKSB7XG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy50b3VjaC5zdGFydC5iaW5kKHRoaXMudG91Y2gpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy50b3VjaC5tb3ZlLmJpbmQodGhpcy50b3VjaCkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMudG91Y2guZW5kLmJpbmQodGhpcy50b3VjaCkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsIHRoaXMudG91Y2guY2FuY2VsLmJpbmQodGhpcy50b3VjaCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMubW91c2UuZG93bi5iaW5kKHRoaXMubW91c2UpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5tb3VzZS5tb3ZlLmJpbmQodGhpcy5tb3VzZSkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5tb3VzZS51cC5iaW5kKHRoaXMubW91c2UpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCB0aGlzLm1vdXNlLm91dC5iaW5kKHRoaXMubW91c2UpKVxuICAgIH1cbiAgICB0aGlzLnd3c1N5c01haW4oKVxuICB9XG59XG4iLCJpbXBvcnQge2ludCwgbG9nfSBmcm9tIFwiLi9VdGlsaXR5XCJcblxuLy8gLS0tLS0tLS0tLS0tLeaPj+eUu+mdoijjgq3jg6Pjg7Pjg5DjgrkpLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGxldCBDV0lEVEggPSA4MDBcbmV4cG9ydCBsZXQgQ0hFSUdIVCA9IDYwMFxuZXhwb3J0IGxldCBTQ0FMRSA9IDEuMCAvLyDjgrnjgrHjg7zjg6vlgKToqK3lrpor44K/44OD44OX5L2N572u6KiI566X55SoXG5leHBvcnQgY2xhc3MgQ2FudmFzIHtcblxuICBwdWJsaWMgY3ZzOiBIVE1MQ2FudmFzRWxlbWVudFxuICBwdWJsaWMgYmc6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGxcbiAgcHVibGljIGJha1c6IG51bWJlclxuICBwdWJsaWMgYmFrSDogbnVtYmVyXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jdnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuICAgIHRoaXMuYmcgPSB0aGlzLmN2cy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICB0aGlzLmJha1cgPSAwXG4gICAgdGhpcy5iYWtIID0gMFxuICB9XG4gIGluaXRDYW52YXMoKSB7XG4gICAgbGV0IHdpblcgPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIGxldCB3aW5IID0gd2luZG93LmlubmVySGVpZ2h0XG4gICAgdGhpcy5iYWtXID0gd2luV1xuICAgIHRoaXMuYmFrSCA9IHdpbkhcblxuICAgIGlmKCB3aW5IIDwgd2luVyAqIChDSEVJR0hUIC8gQ1dJRFRIKSApIHtcbiAgICAgIC8vd2luVyDjgpLmr5TnjofjgavlkIjjgo/jgZvjgaboqr/mlbRcbiAgICAgIHdpblcgPSBpbnQod2luSCAqIChDV0lEVEggLyBDSEVJR0hUKSlcbiAgICAgIGxvZyhcIjEgd2lkdGg6IFwiICsgd2luVyArIFwiIGhlaWdodDogXCIgKyB3aW5IKVxuICAgIH0gZWxzZSB7XG4gICAgICAvL3dpbkgg44KS5q+U546H44Gr5ZCI44KP44Gb44Gm6Kq/5pW0XG4gICAgICB3aW5IID0gaW50KENIRUlHSFQgKiB3aW5XIC8gQ1dJRFRIKVxuICAgICAgbG9nKFwiMiB3aWR0aDogXCIgKyB3aW5XICsgXCIgaGVpZ2h0OiBcIiArIHdpbkgpXG4gICAgfVxuXG4gICAgdGhpcy5jdnMud2lkdGggPSB3aW5XXG4gICAgdGhpcy5jdnMuaGVpZ2h0ID0gd2luSFxuICAgIFNDQUxFID0gd2luVyAvIENXSURUSFxuXG4gICAgaWYodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLnNjYWxlKFNDQUxFLCBTQ0FMRSlcbiAgICB0aGlzLmJnLnRleHRBbGlnbiA9IFwiY2VudGVyXCJcbiAgICB0aGlzLmJnLnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCJcblxuICAgIC8vbG9nKFwid2lkdGg6IFwiICsgd2luVyArIFwiIGhlaWdodDogXCIgKyB3aW5IKVxuICB9XG5cbiAgY2FudmFzU2l6ZSh3OiBudW1iZXIsIGg6IG51bWJlcikge1xuICAgIENXSURUSCA9IHdcbiAgICBDSEVJR0hUID0gaFxuICAgIHRoaXMuaW5pdENhbnZhcygpXG4gIH1cbn1cbiIsIi8v56uv5pyr44Gu56iu6aGeXG5leHBvcnQgbGV0IFBUX1BDXHRcdD0gMDtcbmV4cG9ydCBsZXQgUFRfaU9TXHRcdD0gMTtcbmV4cG9ydCBsZXQgUFRfQW5kcm9pZFx0PSAyO1xuZXhwb3J0IGxldCBQVF9LaW5kbGVcdD0gMztcblxuZXhwb3J0IGNsYXNzIERldmljZSB7XG4gIHByaXZhdGUgX3R5cGU6IG51bWJlclxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl90eXBlID0gUFRfUENcbiAgfVxuICBnZXQgdHlwZSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fdHlwZSB9XG4gIHNldCB0eXBlKHR5cGU6IG51bWJlcikgeyB0aGlzLl90eXBlID0gdHlwZSB9XG59XG4iLCJpbXBvcnQgeyBpbnQsIGxvZyB9IGZyb20gXCIuL1V0aWxpdHlcIlxuaW1wb3J0IHsgQ1dJRFRILCBDSEVJR0hULCBDYW52YXMgfSBmcm9tICcuL0NhbnZhcydcblxuZXhwb3J0IGNsYXNzIERyYXcgZXh0ZW5kcyBDYW52YXN7XG4vLyAtLS0tLS0tLS0tLS0t55S75YOP44Gu6Kqt44G/6L6844G/LS0tLS0tLS0tLS0tLVxuICBpbWc6IEhUTUxJbWFnZUVsZW1lbnRbXVxuICBpbWdfbG9hZGVkOiBCb29sZWFuW11cbiAgbGluZV93aWR0aDogbnVtYmVyXG5cbiAgY29uc3RydWN0b3IoKXtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5pbWcgPSBuZXcgQXJyYXkoMjU2KVxuICAgIHRoaXMuaW1nX2xvYWRlZCA9IG5ldyBBcnJheSgyNTYpXG4gICAgdGhpcy5saW5lX3dpZHRoID0gMVxuICB9XG5cbiAgbG9hZEltZyhuOiBudW1iZXIsIGZpbGVuYW1lOiBzdHJpbmcpIHtcbiAgICBsb2coXCLnlLvlg49cIiArIG4gKyBcIiBcIiArIGZpbGVuYW1lICsgXCLoqq3jgb/ovrzjgb/plovlp4tcIilcbiAgICB0aGlzLmltZ19sb2FkZWRbbl0gPSBmYWxzZVxuICAgIHRoaXMuaW1nW25dID0gbmV3IEltYWdlKClcbiAgICB0aGlzLmltZ1tuXS5zcmMgPSBmaWxlbmFtZVxuICAgIHRoaXMuaW1nW25dLm9ubG9hZCA9ICgpID0+e1xuICAgICAgbG9nKFwi55S75YOPXCIgKyBuICsgXCIgXCIgKyBmaWxlbmFtZSArIFwi6Kqt44G/6L6844G/5a6M5LqGXCIpXG4gICAgICB0aGlzLmltZ19sb2FkZWRbbl0gPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLeaPj+eUuzEg5Zuz5b2iLS0tLS0tLS0tLS0tLVxuICBzZXRBbHAocGFyOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5iZykgdGhpcy5iZy5nbG9iYWxBbHBoYSA9IHBhci8xMDBcbiAgfVxuXG4gIGNvbG9yUkdCKGNyOiBudW1iZXIsIGNnOiBudW1iZXIsIGNiOiBudW1iZXIpIHtcbiAgICBjciA9IGludChjcilcbiAgICBjZyA9IGludChjZylcbiAgICBjYiA9IGludChjYilcbiAgICByZXR1cm4gKFwicmdiKFwiICsgY3IgKyBcIixcIiArIGNnICsgXCIsXCIgKyBjYiArIFwiKVwiKVxuICB9XG5cbiAgbGluZVcod2lkOiBudW1iZXIpIHsgLy/nt5rjga7lpKrjgZXmjIflrppcbiAgICB0aGlzLmxpbmVfd2lkdGggPSB3aWQgLy/jg5Djg4Pjgq/jgqLjg4Pjg5dcbiAgICBpZih0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcubGluZVdpZHRoID0gd2lkXG4gICAgdGhpcy5iZy5saW5lQ2FwID0gXCJyb3VuZFwiXG4gICAgdGhpcy5iZy5saW5lSm9pbiA9IFwicm91bmRcIlxuICB9XG5cbiAgbGluZSh4MDogbnVtYmVyLCB5MDogbnVtYmVyLCB4MTogbnVtYmVyLCB5MTogbnVtYmVyLCBjb2w6IHN0cmluZykge1xuICAgIGlmKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5zdHJva2VTdHlsZSA9IGNvbFxuICAgIHRoaXMuYmcuYmVnaW5QYXRoKClcbiAgICB0aGlzLmJnLm1vdmVUbyh4MCwgeTApXG4gICAgdGhpcy5iZy5saW5lVG8oeDEsIHkxKVxuICAgIHRoaXMuYmcuc3Ryb2tlKClcbiAgfVxuXG4gIGZpbGwoY29sOiBzdHJpbmcpIHtcbiAgICBpZih0aGlzLmJnKSB0aGlzLmJnLmZpbGxTdHlsZSA9IGNvbFxuICAgIGlmKHRoaXMuYmcpIHRoaXMuYmcuZmlsbFJlY3QoMCwgMCwgQ1dJRFRILCBDSEVJR0hUKVxuICB9XG5cbiAgZlJlY3QoeDpudW1iZXIsIHk6bnVtYmVyLCB3Om51bWJlciwgaDpudW1iZXIsY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IGNvbFxuICAgIHRoaXMuYmcuZmlsbFJlY3QoeCwgeSwgdywgaClcbiAgfVxuXG4gIHNSZWN0KHg6bnVtYmVyLCB5Om51bWJlciwgdzpudW1iZXIsIGg6bnVtYmVyLGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5zdHJva2VTdHlsZSA9IGNvbFxuICAgIHRoaXMuYmcuc3Ryb2tlUmVjdCh4LCB5LCB3LCBoKVxuICB9XG5cbiAgZkNpcih4Om51bWJlciwgeTpudW1iZXIsIHI6bnVtYmVyLGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5maWxsU3R5bGUgPSBjb2xcbiAgICB0aGlzLmJnLmJlZ2luUGF0aCgpXG4gICAgdGhpcy5iZy5hcmMoeCwgeSwgciwgMCwgTWF0aC5QSSoyLCBmYWxzZSlcbiAgICB0aGlzLmJnLmNsb3NlUGF0aCgpXG4gICAgdGhpcy5iZy5maWxsKClcbiAgfVxuXG4gIHNDaXIoeDpudW1iZXIsIHk6bnVtYmVyLCByOm51bWJlcixjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuc3Ryb2tlU3R5bGUgPSBjb2xcbiAgICB0aGlzLmJnLmJlZ2luUGF0aCgpXG4gICAgdGhpcy5iZy5hcmMoeCwgeSwgciwgMCwgTWF0aC5QSSoyLCBmYWxzZSlcbiAgICB0aGlzLmJnLmNsb3NlUGF0aCgpXG4gICAgdGhpcy5iZy5zdHJva2UoKVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLeaPj+eUuzIg55S75YOPLS0tLS0tLS0tLS0tLVxuICBkcmF3SW1nKG46IG51bWJlciwgeDogbnVtYmVyLCB5Om51bWJlcikge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIGlmKHRoaXMuaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gICAgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIHgsIHkpXG4gIH1cblxuICBkcmF3SW1nTFIobjogbnVtYmVyLCB4OiBudW1iZXIsIHk6bnVtYmVyKSB7IC8vIOW3puWPs+WPjei7olxuICAgIGlmKHRoaXMuaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gICAgY29uc3QgdyA9IHRoaXMuaW1nW25dLndpZHRoXG4gICAgY29uc3QgaCA9IHRoaXMuaW1nW25dLmhlaWdodFxuICAgIGlmKHRoaXMuYmcpIHtcbiAgICAgIHRoaXMuYmcuc2F2ZSgpXG4gICAgICB0aGlzLmJnLnRyYW5zbGF0ZSh4K3cvMiwgeStoLzIpXG4gICAgICB0aGlzLmJnLnNjYWxlKC0xLCAxKVxuICAgICAgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIC13LzIsIC1oLzIpXG4gICAgICB0aGlzLmJnLnJlc3RvcmUoKVxuICAgIH1cbiAgfVxuXG4gIC8v44K744Oz44K/44Oq44Oz44Kw6KGo56S6XG4gIGRyYXdJbWdDKG46IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICBpZih0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIGlmICh0aGlzLmJnKVxuICAgICAgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIHggLSBpbnQodGhpcy5pbWdbbl0ud2lkdGgvMiksIHkgLSBpbnQodGhpcy5pbWdbbl0uaGVpZ2h0LzIpKVxuICB9XG5cbiAgLy/mi6HlpKfnuK7lsI9cbiAgZHJhd0ltZ1MobjogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpIHtcbiAgICBpZih0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIGlmICh0aGlzLmJnKSB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgeCwgeSwgdywgaClcbiAgfVxuICAvL+WIh+OCiuWHuuOBlyArIOaLoeWkp+e4ruWwj1xuICBkcmF3SW1nVFMobjogbnVtYmVyLCBzeDogbnVtYmVyLCBzeTogbnVtYmVyLCBzdzogbnVtYmVyLCBzaDogbnVtYmVyLCBjeDogbnVtYmVyLCBjeTogbnVtYmVyLCBjdzogbnVtYmVyLCBjaDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gICAgaWYgKHRoaXMuYmcpIHtcbiAgICAgIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCBzeCwgc3ksIHN3LCBzaCwgY3gsIGN5LCBjdywgY2gpXG4gICAgfVxuICB9XG4gIC8v5Zue6LuiXG4gIGRyYXdJbWdSKG4gOm51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGFyZzogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gICAgY29uc3QgdyA9IHRoaXMuaW1nW25dLndpZHRoXG4gICAgY29uc3QgaCA9IHRoaXMuaW1nW25dLmhlaWdodFxuICAgIGlmKHRoaXMuYmcpIHtcbiAgICAgIHRoaXMuYmcuc2F2ZSgpXG4gICAgICB0aGlzLmJnLnRyYW5zbGF0ZSh4K3cvMiwgeStoLzIpXG4gICAgICB0aGlzLmJnLnJvdGF0ZShhcmcpXG4gICAgICB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgLXcvMiwgLWgvMilcbiAgICAgIHRoaXMuYmcucmVzdG9yZSgpXG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLeaPj+eUuzMg5paH5a2XLS0tLS0tLS0tLS0tLVxuICBmVGV4dChzdHI6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIsIHNpejogbnVtYmVyLCBjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnKSB7XG4gICAgICB0aGlzLmJnLmZvbnQgPSBpbnQoc2l6KSArIFwicHggYm9sZCBtb25vc3BhY2VcIlxuICAgICAgdGhpcy5iZy5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgIHRoaXMuYmcuZmlsbFRleHQoc3RyLCB4KzEsIHkrMSlcbiAgICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gY29sXG4gICAgICB0aGlzLmJnLmZpbGxUZXh0KHN0ciwgeCwgeSlcbiAgICB9XG4gIH1cblxuICBmVGV4dE4oc3RyOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyLCBoOiBudW1iZXIsIHNpejogbnVtYmVyLCBjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIGNvbnN0IHNuID0gc3RyLnNwbGl0KFwiXFxuXCIpXG4gICAgdGhpcy5iZy5mb250ID0gaW50KHNpeikgKyBcInB4IGJvbGQgbW9ub3NwYWNlXCJcbiAgICBpZihzbi5sZW5ndGggPT0gMSkge1xuICAgICAgaCA9IDBcbiAgICB9IGVsc2Uge1xuICAgICAgeSA9IHkgLSBpbnQoaC8yKVxuICAgICAgaCA9IGludChoIC8gKHNuLmxlbmd0aCAtIDEpKVxuICAgIH1cbiAgICBmb3IoIGxldCBpID0gMDsgaSA8IHNuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgdGhpcy5iZy5maWxsVGV4dChzdHIsIHgrMSwgeSsxKVxuICAgICAgdGhpcy5iZy5maWxsU3R5bGUgPSBjb2xcbiAgICAgIHRoaXMuYmcuZmlsbFRleHQoc3RyLCB4LCB5KVxuICAgIH1cbiAgfVxuICBtVGV4dFdpZHRoKHN0cjogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgcmV0dXJuIHRoaXMuYmcubWVhc3VyZVRleHQoc3RyKS53aWR0aFxuICB9XG59XG4iLCJpbXBvcnQgeyBpbnQsIGxvZyB9IGZyb20gXCIuL1V0aWxpdHlcIlxuaW1wb3J0IHsgU0UgfSBmcm9tIFwiLi9Tb3VuZFwiXG5pbXBvcnQgeyBTQ0FMRSB9IGZyb20gXCIuL0NhbnZhc1wiXG5pbXBvcnQgeyBEZXZpY2UsIFBUX0FuZHJvaWQgfSBmcm9tIFwiLi9EZXZpY2VcIlxuXG5leHBvcnQgY29uc3QgS19FTlRFUiA9IDEzXG5leHBvcnQgY29uc3QgS19TUEFDRSA9IDMyXG5leHBvcnQgY29uc3QgS19MRUZUICA9IDM3XG5leHBvcnQgY29uc3QgS19VUCAgICA9IDM4XG5leHBvcnQgY29uc3QgS19SSUdIVCA9IDM5XG5leHBvcnQgY29uc3QgS19ET1dOICA9IDQwXG5leHBvcnQgY29uc3QgS19hICAgICA9IDY1XG5leHBvcnQgY29uc3QgS196ICAgICA9IDkwXG5cbi8vIC0tLS0tLS0tLS0g44K/44OD44OX5YWl5YqbIC0tLS0tLS0tLS1cbmV4cG9ydCBjbGFzcyBUb3VjaCB7XG5cdHB1YmxpYyB0YXBYOiBudW1iZXJcblx0cHVibGljIHRhcFk6IG51bWJlclxuXHRwdWJsaWMgdGFwQzogbnVtYmVyXG5cdHByaXZhdGUgX3NlOiBTRVxuXG5cdGNvbnN0cnVjdG9yKHNlOiBTRSkge1xuXHRcdHRoaXMuX3NlID0gc2U7XG5cdFx0dGhpcy50YXBYID0gMDtcblx0XHR0aGlzLnRhcFkgPSAwO1xuXHRcdHRoaXMudGFwQyA9IDA7XG5cdH1cblx0c3RhcnQoZTogVG91Y2hFdmVudCkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTsvL+OCreODo+ODs+ODkOOCueOBrumBuOaKnu+8j+OCueOCr+ODreODvOODq+etieOCkuaKkeWItuOBmeOCi1xuXHRcdGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG5cdFx0Y29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHR0aGlzLnRhcFggPSBlLnRvdWNoZXNbMF0uY2xpZW50WC1yZWN0LmxlZnQ7XG5cdFx0dGhpcy50YXBZID0gZS50b3VjaGVzWzBdLmNsaWVudFktcmVjdC50b3A7XG5cdFx0dGhpcy50YXBDID0gMTtcblx0XHR0aGlzLnRyYW5zZm9ybVhZKCk7XG5cdFx0aWYodGhpcy5fc2Uuc25kX2luaXQgPT0gMCkgdGhpcy5fc2UubG9hZFNvdW5kU1Bob25lKCk7Ly/jgJDph43opoHjgJHjgrXjgqbjg7Pjg4njga7oqq3jgb/ovrzjgb9cblx0fVxuXG5cdG1vdmUoZTogVG91Y2hFdmVudCkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuXHRcdGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0dGhpcy50YXBYID0gZS50b3VjaGVzWzBdLmNsaWVudFgtcmVjdC5sZWZ0O1xuXHRcdHRoaXMudGFwWSA9IGUudG91Y2hlc1swXS5jbGllbnRZLXJlY3QudG9wO1xuXHRcdHRoaXMudHJhbnNmb3JtWFkoKTtcblx0fVxuXG5cdGVuZChlOiBUb3VjaEV2ZW50KSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRoaXMudGFwQyA9IDA7Ly/igLvjg57jgqbjgrnmk43kvZzjgafjga9tb3VzZU91dOOBjOOBk+OCjOOBq+OBquOCi1xuXHR9XG5cblx0Y2FuY2VsKGU6IFRvdWNoRXZlbnQpIHtcblx0XHR0aGlzLnRhcFggPSAtMTtcblx0XHR0aGlzLnRhcFkgPSAtMTtcblx0XHR0aGlzLnRhcEMgPSAwO1xuXHR9XG5cblx0dHJhbnNmb3JtWFkoKSB7Ly/lrp/luqfmqJnihpLku67mg7PluqfmqJnjgbjjga7lpInmj5tcblx0XHR0aGlzLnRhcFggPSBpbnQodGhpcy50YXBYIC8gU0NBTEUpO1xuXHRcdHRoaXMudGFwWSA9IGludCh0aGlzLnRhcFkgLyBTQ0FMRSk7XG5cdH1cbn1cblxuXG4vLyAtLS0tLS0tLS0tLS0t44Oe44Km44K55YWl5YqbLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGNsYXNzIE1vdXNlIHtcblx0cHVibGljIHRhcFg6bnVtYmVyXG5cdHB1YmxpYyB0YXBZOm51bWJlclxuXHRwdWJsaWMgdGFwQzpudW1iZXJcblx0cHJpdmF0ZSBfc2U6IFNFXG5cblx0Y29uc3RydWN0b3Ioc2U6IFNFKSB7XG5cdFx0dGhpcy5fc2UgPSBzZVxuXHRcdHRoaXMudGFwQyA9IDBcblx0XHR0aGlzLnRhcFggPSAwXG5cdFx0dGhpcy50YXBZID0gMFxuXHR9XG5cblx0ZG93bihlOiBNb3VzZUV2ZW50KSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOy8v44Kt44Oj44Oz44OQ44K544Gu6YG45oqe77yP44K544Kv44Ot44O844Or562J44KS5oqR5Yi244GZ44KLXG5cdFx0aWYoISBlLnRhcmdldCkgcmV0dXJuXG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblx0XHR2YXIgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHRcdHRoaXMudGFwWCA9IGUuY2xpZW50WC1yZWN0LmxlZnQ7XG5cdFx0dGhpcy50YXBZID0gZS5jbGllbnRZLXJlY3QudG9wO1xuXHRcdHRoaXMudGFwQyA9IDE7XG5cdFx0dGhpcy50cmFuc2Zvcm1YWSgpXG5cdFx0aWYodGhpcy5fc2Uuc25kX2luaXQgPT0gMCkgdGhpcy5fc2UubG9hZFNvdW5kU1Bob25lKCk7Ly/jgJDph43opoHjgJHjgrXjgqbjg7Pjg4njga7oqq3jgb/ovrzjgb9cblx0fVxuXG5cdG1vdmUoZTogTW91c2VFdmVudCkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRpZighIGUudGFyZ2V0KSByZXR1cm5cblx0XHRjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuXHRcdGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHR0aGlzLnRhcFggPSBlLmNsaWVudFgtcmVjdC5sZWZ0O1xuXHRcdHRoaXMudGFwWSA9IGUuY2xpZW50WS1yZWN0LnRvcDtcblx0XHR0aGlzLnRyYW5zZm9ybVhZKClcblx0fVxuXG5cdHVwKGU6IE1vdXNlRXZlbnQpIHsgdGhpcy50YXBDID0gMDsgfVxuXHRvdXQoZTogTW91c2VFdmVudCkgeyB0aGlzLnRhcEMgPSAwOyB9XG5cblx0dHJhbnNmb3JtWFkoKSB7Ly/lrp/luqfmqJnihpLku67mg7PluqfmqJnjgbjjga7lpInmj5tcblx0XHR0aGlzLnRhcFggPSBpbnQodGhpcy50YXBYIC8gU0NBTEUpO1xuXHRcdHRoaXMudGFwWSA9IGludCh0aGlzLnRhcFkgLyBTQ0FMRSk7XG5cdH1cbn1cblxuLy8gLS0tLS0tLS0tLSDliqDpgJ/luqbjgrvjg7PjgrXjg7wgLS0tLS0tLS0tLVxuZXhwb3J0IGNsYXNzIEFjYyB7XG5cdF9hY1ggPSAwXG5cdF9hY1kgPSAwXG5cdF9hY1ogPSAwO1xuXHRfZGV2aWNlOiBEZXZpY2VcblxuXHRjb25zdHJ1Y3RvcihkZXZpY2U6IERldmljZSkge1xuXHRcdC8vd2luZG93Lm9uZGV2aWNlbW90aW9uID0gZGV2aWNlTW90aW9uOy8v4piF4piF4piF5penXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2Vtb3Rpb25cIiwgdGhpcy5kZXZpY2VNb3Rpb24pO1xuXHRcdHRoaXMuX2RldmljZSA9IGRldmljZVxuXHR9XG5cblx0ZGV2aWNlTW90aW9uKGU6IERldmljZU1vdGlvbkV2ZW50KSB7XG5cdFx0dmFyIGFJRzogRGV2aWNlTW90aW9uRXZlbnRBY2NlbGVyYXRpb24gfCBudWxsID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5O1xuXHRcdGlmIChhSUcgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdGlmKGFJRy54KSB0aGlzLl9hY1ggPSBpbnQoYUlHLngpO1xuXHRcdGlmKGFJRy55KSB0aGlzLl9hY1kgPSBpbnQoYUlHLnkpO1xuXHRcdGlmKGFJRy56KSB0aGlzLl9hY1ogPSBpbnQoYUlHLnopO1xuXHRcdGlmKHRoaXMuX2RldmljZS50eXBlID09IFBUX0FuZHJvaWQpIHsvL0FuZHJvaWQg44GoIGlPUyDjgafmraPosqDjgYzpgIbjgavjgarjgotcblx0XHRcdHRoaXMuX2FjWCA9IC10aGlzLl9hY1g7XG5cdFx0XHR0aGlzLl9hY1kgPSAtdGhpcy5fYWNZO1xuXHRcdFx0dGhpcy5fYWNaID0gLXRoaXMuX2FjWjtcblx0XHR9XG5cdH1cbn1cblxuLy/jgq3jg7zlhaXlipvnlKhcblxuZXhwb3J0IGNsYXNzIEtleSB7XG5cdHByaXZhdGUgX3NlOiBTRVxuXHRwcml2YXRlIF9pbmtleTogbnVtYmVyXG5cdHByaXZhdGUgX2tleTogbnVtYmVyW11cblxuXHRjb25zdHJ1Y3RvcihzZTogU0UpIHtcblx0XHR0aGlzLl9pbmtleSA9IDBcblx0XHR0aGlzLl9rZXkgPSBuZXcgQXJyYXkoMjU2KTtcblx0XHR0aGlzLl9zZSA9IHNlXG5cdH1cblxuXHRjbHIoKSB7XG5cdFx0dGhpcy5faW5rZXkgPSAwO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykgdGhpcy5fa2V5W2ldID0gMDtcblx0fVxuXG5cdG9uKGU6IEtleWJvYXJkRXZlbnQpIHtcblx0XHRpZih0aGlzLl9zZS5zbmRfaW5pdCA9PSAwKSB0aGlzLl9zZS5sb2FkU291bmRTUGhvbmUoKTsvL+OAkOmHjeimgeOAkeOCteOCpuODs+ODieOBruiqreOBv+i+vOOBv1xuXHRcdHRoaXMuX2lua2V5ID0gZS5rZXlDb2RlO1xuXHRcdHRoaXMuX2tleVtlLmtleUNvZGVdKys7XG5cdC8vbG9nKGlua2V5KTtcblx0fVxuXG5cdG9mZihlOiBLZXlib2FyZEV2ZW50KSB7XG5cdFx0dGhpcy5faW5rZXkgPSAwO1xuXHRcdHRoaXMuX2tleVtlLmtleUNvZGVdID0gMDtcblx0fVxufVxuIiwiLy8gLS0tLS0tLS0tLS0tLeOCteOCpuODs+ODieWItuW+oS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBsZXQgIFNPVU5EX09OID0gdHJ1ZVxuZXhwb3J0IGNsYXNzIFNFIHtcbiAgcHVibGljIHdhaXRfc2U6IG51bWJlciA9IDBcbiAgcHVibGljIHNuZF9pbml0OiBudW1iZXIgPSAwXG4gIHNvdW5kRmlsZTogSFRNTEF1ZGlvRWxlbWVudFtdXG4gIGlzQmdtOiBudW1iZXJcbiAgYmdtTm86IG51bWJlclxuICBzZU5vOm51bWJlclxuXG4gIHNvdW5kbG9hZGVkOiBudW1iZXJcbiAgc2ZfbmFtZTogc3RyaW5nW11cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvL+OCteOCpuODs+ODieODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCk+OBoOOBiyjjgrnjg57jg5vlr77nrZYpXG4gICAgdGhpcy53YWl0X3NlID0gMFxuICAgIHRoaXMuc25kX2luaXQgPSAwXG4gICAgdGhpcy5zb3VuZEZpbGUgPSBuZXcgQXJyYXkoMjU2KVxuICAgIHRoaXMuaXNCZ20gPSAtMVxuICAgIHRoaXMuYmdtTm8gPSAwXG4gICAgdGhpcy5zZU5vID0gLTFcbiAgICB0aGlzLnNvdW5kbG9hZGVkID0gMCAvL+OBhOOBj+OBpOODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCk+OBoOOBi1xuICAgIHRoaXMuc2ZfbmFtZSA9IG5ldyBBcnJheSgyNTYpXG4gIH1cblxuICBsb2FkU291bmRTUGhvbmUoKSB7Ly/jgrnjg57jg5vjgafjg5XjgqHjgqTjg6vjgpLoqq3jgb/ovrzjgoBcbiAgICB0cnkge1xuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuc291bmRsb2FkZWQ7IGkrKykge1xuICAgICAgICB0aGlzLnNvdW5kRmlsZVtpXSA9IG5ldyBBdWRpbyh0aGlzLnNmX25hbWVbaV0pXG4gICAgICAgIHRoaXMuc291bmRGaWxlW2ldLmxvYWQoKVxuICAgICAgfVxuICAgIH0gY2F0Y2goZSkge1xuICAgIH1cbiAgICB0aGlzLnNuZF9pbml0ID0gMiAvL+OCueODnuODm+OBp+ODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCk+OBoFxuICB9XG5cbiAgbG9hZFNvdW5kKG46IG51bWJlciwgZmlsZW5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuc2ZfbmFtZVtuXSA9IGZpbGVuYW1lXG4gICAgdGhpcy5zb3VuZGxvYWRlZCsrXG4gIH1cblxuICBwbGF5U0UobjogbnVtYmVyKSB7XG4gICAgaWYoU09VTkRfT04gPT0gZmFsc2UpIHJldHVyblxuICAgIGlmKHRoaXMuaXNCZ20gPT0gMikgcmV0dXJuXG4gICAgaWYodGhpcy53YWl0X3NlID09IDApIHtcbiAgICAgIHRoaXMuc2VObyA9IG5cbiAgICAgIHRoaXMuc291bmRGaWxlW25dLmN1cnJlbnRUaW1lID0gMFxuICAgICAgdGhpcy5zb3VuZEZpbGVbbl0ubG9vcCA9IGZhbHNlXG4gICAgICB0aGlzLnNvdW5kRmlsZVtuXS5wbGF5KClcbiAgICAgIHRoaXMud2FpdF9zZSA9IDMgLy/jg5bjg6njgqbjgrbjgavosqDojbfjgpLjgYvjgZHjgarjgYTjgojjgYbjgavpgKPntprjgZfjgabmtYHjgZXjgarjgYTjgojjgYbjgavjgZnjgotcbiAgICB9XG4gIH1cbn0iLCIvLyAtLS0tLS0tLS0tLS0t5ZCE56iu44Gu6Zai5pWwLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhtc2c6IHN0cmluZykge1xuICBjb25zb2xlLmxvZyhtc2cpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnQodmFsOiBudW1iZXIpOiBudW1iZXIge1xuICBsZXQgbnVtID0gU3RyaW5nKHZhbClcbiAgcmV0dXJuIHBhcnNlSW50KG51bSkgLy/jg5fjg6njgrnjg57jgqTjg4rjgrnjganjgaHjgonjgoLlsI/mlbDpg6jliIbjgpLliIfjgormjajjgaZcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cih2YWw6IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBTdHJpbmcodmFsKVxufVxuZXhwb3J0IGZ1bmN0aW9uIHJuZChtYXg6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqbWF4KVxufVxuZXhwb3J0IGZ1bmN0aW9uIGFicyh2YWw6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmFicyh2YWwpXG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgTU1TIH0gZnJvbSAnLi9XV1MnXG5pbXBvcnQgeyBybmQsIGxvZywgaW50LCBzdHIsIGFic30gZnJvbSAnLi9XV1NsaWIvVXRpbGl0eSdcblxuXG5sZXQgYmFsbFg6IG51bWJlciA9IDYwMFxubGV0IGJhbGxZOiBudW1iZXIgPSAzMDBcbmxldCBiYWxsWHA6IG51bWJlciA9IDEwXG5sZXQgYmFsbFlwOiBudW1iZXIgPSAzXG5sZXQgYmFyWDogbnVtYmVyID0gNjAwXG5sZXQgYmFyWTogbnVtYmVyID0gNzAwXG5sZXQgc2NvcmU6IG51bWJlciA9IDBcbmxldCBzY2VuZTogbnVtYmVyID0gMFxuXG5jbGFzcyBNeUdhbWUgZXh0ZW5kcyBNTVMge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHN1cGVyKClcbiAgfVxuXG4gIGNscktleSgpOiB2b2lkIHt9XG4gIHNldHVwKCk6IHZvaWQge1xuICAgIHRoaXMuY2FudmFzLmNhbnZhc1NpemUoMTIwMCwgODAwKVxuICAgIHRoaXMuZHJhdy5saW5lVygzKVxuICAgIHRoaXMuZHJhdy5sb2FkSW1nKDAsICdpbWFnZS9iZy5wbmcnKVxuICAgIHRoaXMuc2UubG9hZFNvdW5kKDAsIFwic291bmQvc2UubTRhXCIpXG4gIH1cbiAgbWFpbmxvb3AoKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3LmRyYXdJbWcoMCwgMCwgMClcbiAgICB0aGlzLmRyYXcuc2V0QWxwKDUwKVxuICAgIHRoaXMuZHJhdy5mUmVjdCgyNTAsIDUwLCA3MDAsIDc1MCwgXCJibGFja1wiKVxuICAgIHRoaXMuZHJhdy5zZXRBbHAoMTAwKVxuICAgIHRoaXMuZHJhdy5zUmVjdCgyNTAsIDUwLCA3MDAsIDc2MCwgXCJzaWx2ZXJcIilcbiAgICB0aGlzLmRyYXcuZlRleHQoXCJTQ09SRSBcIiArIHNjb3JlLCA2MDAsIDI1LCAzNiwgXCJ3aGl0ZVwiKVxuICAgIHRoaXMuZHJhdy5zQ2lyKGJhbGxYLCBiYWxsWSwgMTAsIFwibGltZVwiKVxuICAgIHRoaXMuZHJhdy5zUmVjdChiYXJYLTUwLCBiYXJZLTEwLCAxMDAsIDIwLCBcInZpb2xldFwiKVxuICAgIGlmKHNjZW5lID09IDApIHsgLy8g44Ky44O844Og6ZaL5aeL5YmNXG4gICAgICB0aGlzLmRyYXcuZlRleHQoXCJTcXVhc2ggR2FtZVwiLCA2MDAsIDIwMCwgNDgsIFwiY3lhblwiKVxuICAgICAgdGhpcy5kcmF3LmZUZXh0KFwiQ2xpY2sgdG8gc3RhcnQhXCIsIDYwMCwgNjAwLCAzNiwgXCJnb2xkXCIpXG4gICAgICBpZih0aGlzLm1vdXNlLnRhcEMgPT0gMSkge1xuICAgICAgICBiYWxsWCA9IDYwMFxuICAgICAgICBiYWxsWSA9IDMwMFxuICAgICAgICBiYWxsWHAgPSAxMlxuICAgICAgICBiYWxsWXAgPSA4XG4gICAgICAgIHNjb3JlID0gMFxuICAgICAgICBzY2VuZSA9IDFcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoc2NlbmUgPT0gMSkgey8vIOOCsuODvOODoOS4rVxuICAgICAgYmFsbFggPSBiYWxsWCArIGJhbGxYcFxuICAgICAgYmFsbFkgPSBiYWxsWSArIGJhbGxZcFxuICAgICAgaWYoYmFsbFggPD0gMjYwIHx8IGJhbGxYID49IDk0MCkgYmFsbFhwID0gLWJhbGxYcFxuICAgICAgaWYoYmFsbFkgPD0gNjApIGJhbGxZcCA9IDggKyBybmQoOClcbiAgICAgIGlmKGJhbGxZID49IDgwMCkgc2NlbmUgPSAyXG4gICAgICBiYXJYID0gdGhpcy5tb3VzZS50YXBYXG4gICAgICBpZihiYXJYIDwgMzAwKSBiYXJYID0gMzAwXG4gICAgICBpZihiYXJYID4gOTAwKSBiYXJYID0gOTAwXG4gICAgICBpZihiYXJYLTYwIDwgYmFsbFggJiYgYmFsbFggPCBiYXJYKzYwICYmIGJhclktMzAgPCBiYWxsWSAmJiBiYWxsWSA8IGJhclktMTApIHtcbiAgICAgICAgYmFsbFlwID0gLTgtcm5kKDgpXG4gICAgICAgIHNjb3JlICs9IDEwMFxuICAgICAgICB0aGlzLnNlLnBsYXlTRSgwKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZihzY2VuZSA9PSAyKSB7Ly8g44Ky44O844Og57WC5LqGXG4gICAgICB0aGlzLmRyYXcuZlRleHQoXCJHYW1lIE92ZXJcIiwgNjAwLCA0MDAsIDM2LCBcInJlZFwiKVxuICAgICAgaWYodGhpcy5tb3VzZS50YXBDID09IDEpe1xuICAgICAgICBzY2VuZSA9IDBcbiAgICAgICAgdGhpcy5tb3VzZS50YXBDID0gMFxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5uZXcgTXlHYW1lKClcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==