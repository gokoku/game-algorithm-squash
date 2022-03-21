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
            Device_1.device.type = Device_1.device.PT_Android;
        }
        else if (NUA.indexOf('iPhone') > 0 || NUA.indexOf('iPod') > 0 || NUA.indexOf('iPad') > 0) {
            Device_1.device.type = Device_1.device.PT_iOS;
            window.scrollTo(0, 1); //iPhoneのURLバーを消す位置に
        }
        else if (NUA.indexOf('Silk') > 0) {
            Device_1.device.type = Device_1.device.PT_Kindle;
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


//端末の種類
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.device = void 0;
class Device {
    constructor(_type) {
        this._type = _type;
        this.PT_PC = 0;
        this.PT_iOS = 1;
        this.PT_Android = 2;
        this.PT_Kindle = 3;
    }
    get type() { return this._type; }
    set type(type) { this._type = type; }
}
exports.device = new Device(0);


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
exports.Key = exports.Acc = exports.Mouse = exports.Touch = void 0;
const Utility_1 = __webpack_require__(/*! ./Utility */ "./src/WWSlib/Utility.ts");
const Device_1 = __webpack_require__(/*! ./Device */ "./src/WWSlib/Device.ts");
const Canvas_1 = __webpack_require__(/*! ./Canvas */ "./src/WWSlib/Canvas.ts");
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
    constructor() {
        this._acX = 0;
        this._acY = 0;
        this._acZ = 0;
        //window.ondevicemotion = deviceMotion;//★★★旧
        window.addEventListener("devicemotion", this.deviceMotion);
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
        if (Device_1.device.type == Device_1.device.PT_Android) { //Android と iOS で正負が逆になる
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
        this.K_ENTER = 13;
        this.K_SPACE = 32;
        this.K_LEFT = 37;
        this.K_UP = 38;
        this.K_RIGHT = 39;
        this.K_DOWN = 40;
        this.K_a = 65;
        this.K_z = 90;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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R0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07UUFDNUIsSUFBRyxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUU7WUFDZCxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1NBQ2xCO0lBQ0gsQ0FBQztJQUVELFVBQVU7SUFDVixRQUFRLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ3RDLElBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLO1lBQUUsT0FBTTtRQUN0QyxJQUFJLElBQUksQ0FBQyxFQUFFO1lBQ1QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQUcsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQUcsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQsTUFBTTtJQUNOLFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUM1RCxJQUFHLElBQUksQ0FBQyxVQUFV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QyxDQUFDO1lBQ25DLElBQUcsS0FBSyxJQUFJLEdBQUc7Z0JBQUUsS0FBSyxHQUFHLENBQUM7WUFDMUIsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtZQUN0QixJQUFHLElBQUksR0FBRyxHQUFHO2dCQUFFLElBQUksR0FBRyxHQUFHO1lBQ3pCLElBQUcsSUFBSSxHQUFHLEdBQUc7Z0JBQUUsSUFBSSxHQUFHLEdBQUc7WUFDekIsSUFBRyxJQUFJLEdBQUMsRUFBRSxHQUFHLEtBQUssSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFDLEVBQUUsSUFBSSxJQUFJLEdBQUMsRUFBRSxHQUFHLEtBQUssSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFDLEVBQUUsRUFBRTtnQkFDM0UsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFDLGlCQUFHLEVBQUMsQ0FBQyxDQUFDO2dCQUNsQixLQUFLLElBQUksR0FBRztnQkFDWixJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7YUFDbEI7U0FDRjthQUFNLElBQUcsS0FBSyxJQUFJLENBQUMsRUFBRSxFQUFDLFFBQVE7WUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQztZQUNqRCxJQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBQztnQkFDdEIsS0FBSyxHQUFHLENBQUM7Z0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQzthQUNwQjtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBRUQsSUFBSSxNQUFNLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvV1dTLnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvQ2FudmFzLnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvRGV2aWNlLnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvRHJhdy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV1dTbGliL0V2ZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvU291bmQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9VdGlsaXR5LnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbkphdmFTY3JpcHQmSFRNTDUg44Ky44O844Og6ZaL55m655So44K344K544OG44OgXG7plovnmbog44Ov44O844Or44OJ44Ov44Kk44OJ44K944OV44OI44Km44Kn44Ki5pyJ6ZmQ5Lya56S+XG5cbu+8iOS9v+eUqOadoeS7tu+8iVxu5pys44K944O844K544Kz44O844OJ44Gu6JGX5L2c5qip44Gv6ZaL55m65YWD44Gr44GC44KK44G+44GZ44CCXG7liKnnlKjjgZXjgozjgZ/jgYTmlrnjga/jg6Hjg7zjg6vjgavjgabjgYrllY/jgYTlkIjjgo/jgZvkuIvjgZXjgYTjgIJcbnRoQHd3c2Z0LmNvbSDjg6/jg7zjg6vjg4njg6/jgqTjg4njgr3jg5Xjg4jjgqbjgqfjgqIg5buj54CsXG4qL1xuXG5pbXBvcnQgeyBpbnQsIGxvZyB9IGZyb20gJy4vV1dTbGliL1V0aWxpdHknXG5pbXBvcnQgeyBUb3VjaCwgTW91c2UsIEtleSB9IGZyb20gXCIuL1dXU2xpYi9FdmVudFwiXG5pbXBvcnQgeyBDV0lEVEgsIENIRUlHSFQsIENhbnZhcyB9IGZyb20gXCIuL1dXU2xpYi9DYW52YXNcIlxuaW1wb3J0IHsgRHJhdyB9IGZyb20gXCIuL1dXU2xpYi9EcmF3XCJcbmltcG9ydCB7IFNFIH0gZnJvbSAnLi9XV1NsaWIvU291bmQnXG5pbXBvcnQgeyBkZXZpY2UgfSBmcm9tICcuL1dXU2xpYi9EZXZpY2UnXG4vLyAtLS0tLS0tLS0tLS0t5aSJ5pWwLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGNvbnN0ICBTWVNfVkVSID0gXCJWZXIuMjAyMDExMTFcIlxuZXhwb3J0IGxldCAgREVCVUcgPSBmYWxzZVxuXG5cbi8v5Yem55CG44Gu6YCy6KGM44KS566h55CG44GZ44KLXG4vLyBtYWluX2lkeCDjga7lgKRcbi8vICAgMDog5Yid5pyf5YyWXG4vLyAgIDE6IOOCu+ODvOODluOBp+OBjeOBquOBhOitpuWRilxuLy8gICAyOiDjg6HjgqTjg7Plh6bnkIZcbmxldCBtYWluX2lkeCA9IDBcbmxldCBtYWluX3RtciA9IDBcbmxldCBzdG9wX2ZsZyA9IDAgLy8g44Oh44Kk44Oz5Yem55CG44Gu5LiA5pmC5YGc5q2iXG5jb25zdCBOVUEgPSBuYXZpZ2F0b3IudXNlckFnZW50Oy8v5qmf56iu5Yik5a6aXG5jb25zdCBzdXBwb3J0VG91Y2ggPSAnb250b3VjaGVuZCcgaW4gZG9jdW1lbnQ7Ly/jgr/jg4Pjg4HjgqTjg5njg7Pjg4jjgYzkvb/jgYjjgovjgYvvvJ9cblxuLy8g44OV44Os44O844Og44Os44O844OIIGZyYW1lcyAvIHNlY29uZFxubGV0ICBGUFMgPSAzMFxuLy/jg63jg7zjgqvjg6vjgrnjg4jjg6zjg7zjgrhcbmNvbnN0IExTX0tFWU5BTUUgPSBcIlNBVkVEQVRBXCI7Ly9rZXlOYW1lIOS7u+aEj+OBq+WkieabtOWPr1xuLy/kv53lrZjjgafjgY3jgovjgYvliKTlrprjgZfjgIHjgafjgY3jgarjgYTloLTlkIjjgavorablkYrjgpLlh7rjgZnjgIDlhbfkvZPnmoTjgavjga8gaU9TIFNhZmFyaSDjg5fjg6njgqTjg5njg7zjg4jjg5bjg6njgqbjgrrjgYxPTu+8iOS/neWtmOOBp+OBjeOBquOBhO+8ieeKtuaFi+OBq+itpuWRiuOCkuWHuuOBmVxubGV0IENIRUNLX0xTID0gZmFsc2U7XG5cbi8vIC0tLS0tLS0tLS0tLS3jg6rjgqLjg6vjgr/jgqTjg6Dlh6bnkIYtLS0tLS0tLS0tLS0tXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTU1TIHtcbiAgYWJzdHJhY3Qgc2V0dXAoKTogdm9pZFxuICBhYnN0cmFjdCBjbHJLZXkoKTogdm9pZFxuICBhYnN0cmFjdCBtYWlubG9vcCgpOiB2b2lkXG5cbiAgcHVibGljIGNhbnZhczogQ2FudmFzXG4gIHB1YmxpYyBkcmF3OiBEcmF3XG4gIHB1YmxpYyBtb3VzZTogTW91c2VcbiAgcHVibGljIHRvdWNoOiBUb3VjaFxuICBwdWJsaWMga2V5OiBLZXlcbiAgcHVibGljIHNlOiBTRVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCB0aGlzLnd3c1N5c0luaXQuYmluZCh0aGlzKSlcbiAgICB0aGlzLmNhbnZhcyA9IG5ldyBDYW52YXMoKVxuICAgIHRoaXMuZHJhdyA9IG5ldyBEcmF3KClcbiAgICB0aGlzLnNlID0gbmV3IFNFKClcbiAgICB0aGlzLm1vdXNlID0gbmV3IE1vdXNlKHRoaXMuc2UpXG4gICAgdGhpcy50b3VjaCA9IG5ldyBUb3VjaCh0aGlzLnNlKVxuICAgIHRoaXMua2V5ID0gbmV3IEtleSh0aGlzLnNlKVxuICB9XG5cbiAgd3dzU3lzTWFpbigpOiB2b2lkIHtcblxuICAgIGxldCBzdGltZSA9IERhdGUubm93KClcblxuICAgIGlmKHRoaXMuY2FudmFzLmJha1cgIT0gd2luZG93LmlubmVyV2lkdGggfHwgdGhpcy5jYW52YXMuYmFrSCAhPSB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIHRoaXMuY2FudmFzLmluaXRDYW52YXMoKVxuICAgICAgdGhpcy5kcmF3LmxpbmVXKHRoaXMuZHJhdy5saW5lX3dpZHRoKVxuICAgICAgbG9nKFwiY2FudmFzIHNpemUgY2hhbmdlZCBcIiArIHRoaXMuY2FudmFzLmJha1cgKyBcInhcIiArIHRoaXMuY2FudmFzLmJha0gpO1xuXG4gICAgfVxuXG4gICAgbWFpbl90bXIgKytcblxuICAgIHN3aXRjaChtYWluX2lkeCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICB0aGlzLnNldHVwKClcbiAgICAgICAgbWFpbl9pZHggPSAyXG4gICAgICAgIGlmKENIRUNLX0xTID09IHRydWUpIHtcbiAgICAgICAgICB0cnkge2xvY2FsU3RvcmFnZS5zZXRJdGVtKFwiX3NhdmVfdGVzdFwiLCBcInRlc3RkYXRhXCIpfSBjYXRjaChlKSB7IG1haW5faWR4ID0gMSB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgeCA9IGludChDV0lEVEggLyAyKVxuICAgICAgICBsZXQgeSA9IGludChDSEVJR0hUIC8gNilcbiAgICAgICAgbGV0IGZzID0gaW50KENIRUlHSFQgLyAxNilcbiAgICAgICAgdGhpcy5kcmF3LmZpbGwoXCJibGFja1wiKVxuICAgICAgICB0aGlzLmRyYXcuZlRleHQoXCLigLvjgrvjg7zjg5bjg4fjg7zjgr/jgYzkv53lrZjjgZXjgozjgb7jgZvjgpPigLtcIiwgeCwgeS8yLCBmcywgXCJ5ZWxsb3dcIik7XG4gICAgICAgIHRoaXMuZHJhdy5mVGV4dE4oXCJpT1Pnq6/mnKvjgpLjgYrkvb/jgYTjga7loLTlkIjjga9cXG5TYWZhcmnjga7jg5fjg6njgqTjg5njg7zjg4jjg5bjg6njgqbjgrpcXG7jgpLjgqrjg5XjgavjgZfjgabotbfli5XjgZfjgabkuIvjgZXjgYTjgIJcIiwgeCwgeSoyLCB5LCBmcywgXCJ5ZWxsb3dcIik7XG4gICAgICAgIHRoaXMuZHJhdy5mVGV4dE4oXCLjgZ3jga7ku5bjga7mqZ/nqK7vvIjjg5bjg6njgqbjgrbvvInjgafjga9cXG7jg63jg7zjgqvjg6vjgrnjg4jjg6zjg7zjgrjjgbjjga7kv53lrZjjgpJcXG7oqLHlj6/jgZnjgovoqK3lrprjgavjgZfjgabkuIvjgZXjgYTjgIJcIiwgeCwgeSo0LCB5LCBmcywgXCJ5ZWxsb3dcIik7XG4gICAgICAgIHRoaXMuZHJhdy5mVGV4dChcIuOBk+OBruOBvuOBvue2muOBkeOCi+OBq+OBr+eUu+mdouOCkuOCv+ODg+ODl1wiLCB4LCB5KjUuNSwgZnMsIFwibGltZVwiKTtcbiAgICAgICAgaWYodGhpcy5tb3VzZS50YXBDICE9IDApIG1haW5faWR4ID0gMjtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMjogLy/jg6HjgqTjg7Plh6bnkIZcbiAgICAgICAgaWYoc3RvcF9mbGcgPT0gMCkge1xuICAgICAgICAgIHRoaXMubWFpbmxvb3AoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY2xyS2V5KClcbiAgICAgICAgICBtYWluX3Rtci0tXG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5zZS53YWl0X3NlID4gMCkgdGhpcy5zZS53YWl0X3NlLS1cbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6IGJyZWFrXG4gICAgfVxuICAgIHZhciBwdGltZSA9IERhdGUubm93KCkgLSBzdGltZTtcbiAgICBpZihwdGltZSA8IDApIHB0aW1lID0gMDtcbiAgICBpZihwdGltZSA+IGludCgxMDAwL0ZQUykpIHB0aW1lID0gaW50KDEwMDAvRlBTKTtcblxuICAgIHNldFRpbWVvdXQodGhpcy53d3NTeXNNYWluLmJpbmQodGhpcyksIGludCgxMDAwL0ZQUyktcHRpbWUpO1xuICB9XG5cbiAgd3dzU3lzSW5pdCgpIHtcbiAgICB0aGlzLmNhbnZhcy5pbml0Q2FudmFzKClcbiAgICBpZiggTlVBLmluZGV4T2YoJ0FuZHJvaWQnKSA+IDAgKSB7XG4gICAgICBkZXZpY2UudHlwZSA9IGRldmljZS5QVF9BbmRyb2lkO1xuICAgIH1cbiAgICBlbHNlIGlmKCBOVUEuaW5kZXhPZignaVBob25lJykgPiAwIHx8IE5VQS5pbmRleE9mKCdpUG9kJykgPiAwIHx8IE5VQS5pbmRleE9mKCdpUGFkJykgPiAwICkge1xuICAgICAgZGV2aWNlLnR5cGUgPSBkZXZpY2UuUFRfaU9TO1xuICAgICAgd2luZG93LnNjcm9sbFRvKDAsMSk7Ly9pUGhvbmXjga5VUkzjg5Djg7zjgpLmtojjgZnkvY3nva7jgatcbiAgICB9XG4gICAgZWxzZSBpZiggTlVBLmluZGV4T2YoJ1NpbGsnKSA+IDAgKSB7XG4gICAgICBkZXZpY2UudHlwZSA9IGRldmljZS5QVF9LaW5kbGU7XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMua2V5Lm9uLmJpbmQodGhpcy5rZXkpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5rZXkub2ZmLmJpbmQodGhpcy5rZXkpKVxuXG4gICAgaWYoc3VwcG9ydFRvdWNoID09IHRydWUpIHtcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLnRvdWNoLnN0YXJ0LmJpbmQodGhpcy50b3VjaCkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLnRvdWNoLm1vdmUuYmluZCh0aGlzLnRvdWNoKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy50b3VjaC5lbmQuYmluZCh0aGlzLnRvdWNoKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hjYW5jZWxcIiwgdGhpcy50b3VjaC5jYW5jZWwuYmluZCh0aGlzLnRvdWNoKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5tb3VzZS5kb3duLmJpbmQodGhpcy5tb3VzZSkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm1vdXNlLm1vdmUuYmluZCh0aGlzLm1vdXNlKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLm1vdXNlLnVwLmJpbmQodGhpcy5tb3VzZSkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIHRoaXMubW91c2Uub3V0LmJpbmQodGhpcy5tb3VzZSkpXG4gICAgfVxuICAgIHRoaXMud3dzU3lzTWFpbigpXG4gIH1cbn1cbiIsImltcG9ydCB7aW50LCBsb2d9IGZyb20gXCIuL1V0aWxpdHlcIlxuXG4vLyAtLS0tLS0tLS0tLS0t5o+P55S76Z2iKOOCreODo+ODs+ODkOOCuSktLS0tLS0tLS0tLS0tXG5leHBvcnQgbGV0IENXSURUSCA9IDgwMFxuZXhwb3J0IGxldCBDSEVJR0hUID0gNjAwXG5leHBvcnQgbGV0IFNDQUxFID0gMS4wIC8vIOOCueOCseODvOODq+WApOioreWumivjgr/jg4Pjg5fkvY3nva7oqIjnrpfnlKhcbmV4cG9ydCBjbGFzcyBDYW52YXMge1xuXG4gIHB1YmxpYyBjdnM6IEhUTUxDYW52YXNFbGVtZW50XG4gIHB1YmxpYyBiZzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbFxuICBwdWJsaWMgYmFrVzogbnVtYmVyXG4gIHB1YmxpYyBiYWtIOiBudW1iZXJcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmN2cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50XG4gICAgdGhpcy5iZyA9IHRoaXMuY3ZzLmdldENvbnRleHQoXCIyZFwiKVxuICAgIHRoaXMuYmFrVyA9IDBcbiAgICB0aGlzLmJha0ggPSAwXG4gIH1cbiAgaW5pdENhbnZhcygpIHtcbiAgICBsZXQgd2luVyA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgbGV0IHdpbkggPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICB0aGlzLmJha1cgPSB3aW5XXG4gICAgdGhpcy5iYWtIID0gd2luSFxuXG4gICAgaWYoIHdpbkggPCB3aW5XICogKENIRUlHSFQgLyBDV0lEVEgpICkge1xuICAgICAgLy93aW5XIOOCkuavlOeOh+OBq+WQiOOCj+OBm+OBpuiqv+aVtFxuICAgICAgd2luVyA9IGludCh3aW5IICogKENXSURUSCAvIENIRUlHSFQpKVxuICAgICAgbG9nKFwiMSB3aWR0aDogXCIgKyB3aW5XICsgXCIgaGVpZ2h0OiBcIiArIHdpbkgpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vd2luSCDjgpLmr5TnjofjgavlkIjjgo/jgZvjgaboqr/mlbRcbiAgICAgIHdpbkggPSBpbnQoQ0hFSUdIVCAqIHdpblcgLyBDV0lEVEgpXG4gICAgICBsb2coXCIyIHdpZHRoOiBcIiArIHdpblcgKyBcIiBoZWlnaHQ6IFwiICsgd2luSClcbiAgICB9XG5cbiAgICB0aGlzLmN2cy53aWR0aCA9IHdpbldcbiAgICB0aGlzLmN2cy5oZWlnaHQgPSB3aW5IXG4gICAgU0NBTEUgPSB3aW5XIC8gQ1dJRFRIXG5cbiAgICBpZih0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuc2NhbGUoU0NBTEUsIFNDQUxFKVxuICAgIHRoaXMuYmcudGV4dEFsaWduID0gXCJjZW50ZXJcIlxuICAgIHRoaXMuYmcudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIlxuXG4gICAgLy9sb2coXCJ3aWR0aDogXCIgKyB3aW5XICsgXCIgaGVpZ2h0OiBcIiArIHdpbkgpXG4gIH1cblxuICBjYW52YXNTaXplKHc6IG51bWJlciwgaDogbnVtYmVyKSB7XG4gICAgQ1dJRFRIID0gd1xuICAgIENIRUlHSFQgPSBoXG4gICAgdGhpcy5pbml0Q2FudmFzKClcbiAgfVxufVxuIiwiLy/nq6/mnKvjga7nqK7poZ5cblxuY2xhc3MgRGV2aWNlIHtcbiAgcHVibGljIFBUX1BDXHRcdD0gMDtcbiAgcHVibGljIFBUX2lPU1x0XHQ9IDE7XG4gIHB1YmxpYyBQVF9BbmRyb2lkXHQ9IDI7XG4gIHB1YmxpYyBQVF9LaW5kbGVcdD0gMztcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdHlwZTogbnVtYmVyKSB7fVxuICBnZXQgdHlwZSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fdHlwZTsgfVxuICBzZXQgdHlwZSh0eXBlOiBudW1iZXIpIHsgdGhpcy5fdHlwZSA9IHR5cGU7IH1cbn1cblxuZXhwb3J0ICBjb25zdCBkZXZpY2VcdD0gbmV3IERldmljZSgwKTtcbiIsImltcG9ydCB7IGludCwgbG9nIH0gZnJvbSBcIi4vVXRpbGl0eVwiXG5pbXBvcnQgeyBDV0lEVEgsIENIRUlHSFQsIENhbnZhcyB9IGZyb20gJy4vQ2FudmFzJ1xuXG5leHBvcnQgY2xhc3MgRHJhdyBleHRlbmRzIENhbnZhc3tcbi8vIC0tLS0tLS0tLS0tLS3nlLvlg4/jga7oqq3jgb/ovrzjgb8tLS0tLS0tLS0tLS0tXG4gIGltZzogSFRNTEltYWdlRWxlbWVudFtdXG4gIGltZ19sb2FkZWQ6IEJvb2xlYW5bXVxuICBsaW5lX3dpZHRoOiBudW1iZXJcblxuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHN1cGVyKClcbiAgICB0aGlzLmltZyA9IG5ldyBBcnJheSgyNTYpXG4gICAgdGhpcy5pbWdfbG9hZGVkID0gbmV3IEFycmF5KDI1NilcbiAgICB0aGlzLmxpbmVfd2lkdGggPSAxXG4gIH1cblxuICBsb2FkSW1nKG46IG51bWJlciwgZmlsZW5hbWU6IHN0cmluZykge1xuICAgIGxvZyhcIueUu+WDj1wiICsgbiArIFwiIFwiICsgZmlsZW5hbWUgKyBcIuiqreOBv+i+vOOBv+mWi+Wni1wiKVxuICAgIHRoaXMuaW1nX2xvYWRlZFtuXSA9IGZhbHNlXG4gICAgdGhpcy5pbWdbbl0gPSBuZXcgSW1hZ2UoKVxuICAgIHRoaXMuaW1nW25dLnNyYyA9IGZpbGVuYW1lXG4gICAgdGhpcy5pbWdbbl0ub25sb2FkID0gKCkgPT57XG4gICAgICBsb2coXCLnlLvlg49cIiArIG4gKyBcIiBcIiArIGZpbGVuYW1lICsgXCLoqq3jgb/ovrzjgb/lrozkuoZcIilcbiAgICAgIHRoaXMuaW1nX2xvYWRlZFtuXSA9IHRydWVcbiAgICB9XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0t5o+P55S7MSDlm7PlvaItLS0tLS0tLS0tLS0tXG4gIHNldEFscChwYXI6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmJnKSB0aGlzLmJnLmdsb2JhbEFscGhhID0gcGFyLzEwMFxuICB9XG5cbiAgY29sb3JSR0IoY3I6IG51bWJlciwgY2c6IG51bWJlciwgY2I6IG51bWJlcikge1xuICAgIGNyID0gaW50KGNyKVxuICAgIGNnID0gaW50KGNnKVxuICAgIGNiID0gaW50KGNiKVxuICAgIHJldHVybiAoXCJyZ2IoXCIgKyBjciArIFwiLFwiICsgY2cgKyBcIixcIiArIGNiICsgXCIpXCIpXG4gIH1cblxuICBsaW5lVyh3aWQ6IG51bWJlcikgeyAvL+e3muOBruWkquOBleaMh+WumlxuICAgIHRoaXMubGluZV93aWR0aCA9IHdpZCAvL+ODkOODg+OCr+OCouODg+ODl1xuICAgIGlmKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5saW5lV2lkdGggPSB3aWRcbiAgICB0aGlzLmJnLmxpbmVDYXAgPSBcInJvdW5kXCJcbiAgICB0aGlzLmJnLmxpbmVKb2luID0gXCJyb3VuZFwiXG4gIH1cblxuICBsaW5lKHgwOiBudW1iZXIsIHkwOiBudW1iZXIsIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIGNvbDogc3RyaW5nKSB7XG4gICAgaWYodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLnN0cm9rZVN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5iZWdpblBhdGgoKVxuICAgIHRoaXMuYmcubW92ZVRvKHgwLCB5MClcbiAgICB0aGlzLmJnLmxpbmVUbyh4MSwgeTEpXG4gICAgdGhpcy5iZy5zdHJva2UoKVxuICB9XG5cbiAgZmlsbChjb2w6IHN0cmluZykge1xuICAgIGlmKHRoaXMuYmcpIHRoaXMuYmcuZmlsbFN0eWxlID0gY29sXG4gICAgaWYodGhpcy5iZykgdGhpcy5iZy5maWxsUmVjdCgwLCAwLCBDV0lEVEgsIENIRUlHSFQpXG4gIH1cblxuICBmUmVjdCh4Om51bWJlciwgeTpudW1iZXIsIHc6bnVtYmVyLCBoOm51bWJlcixjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5maWxsUmVjdCh4LCB5LCB3LCBoKVxuICB9XG5cbiAgc1JlY3QoeDpudW1iZXIsIHk6bnVtYmVyLCB3Om51bWJlciwgaDpudW1iZXIsY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLnN0cm9rZVN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5zdHJva2VSZWN0KHgsIHksIHcsIGgpXG4gIH1cblxuICBmQ2lyKHg6bnVtYmVyLCB5Om51bWJlciwgcjpudW1iZXIsY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IGNvbFxuICAgIHRoaXMuYmcuYmVnaW5QYXRoKClcbiAgICB0aGlzLmJnLmFyYyh4LCB5LCByLCAwLCBNYXRoLlBJKjIsIGZhbHNlKVxuICAgIHRoaXMuYmcuY2xvc2VQYXRoKClcbiAgICB0aGlzLmJnLmZpbGwoKVxuICB9XG5cbiAgc0Npcih4Om51bWJlciwgeTpudW1iZXIsIHI6bnVtYmVyLGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5zdHJva2VTdHlsZSA9IGNvbFxuICAgIHRoaXMuYmcuYmVnaW5QYXRoKClcbiAgICB0aGlzLmJnLmFyYyh4LCB5LCByLCAwLCBNYXRoLlBJKjIsIGZhbHNlKVxuICAgIHRoaXMuYmcuY2xvc2VQYXRoKClcbiAgICB0aGlzLmJnLnN0cm9rZSgpXG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0t5o+P55S7MiDnlLvlg48tLS0tLS0tLS0tLS0tXG4gIGRyYXdJbWcobjogbnVtYmVyLCB4OiBudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgaWYodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgeCwgeSlcbiAgfVxuXG4gIGRyYXdJbWdMUihuOiBudW1iZXIsIHg6IG51bWJlciwgeTpudW1iZXIpIHsgLy8g5bem5Y+z5Y+N6LuiXG4gICAgaWYodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBjb25zdCB3ID0gdGhpcy5pbWdbbl0ud2lkdGhcbiAgICBjb25zdCBoID0gdGhpcy5pbWdbbl0uaGVpZ2h0XG4gICAgaWYodGhpcy5iZykge1xuICAgICAgdGhpcy5iZy5zYXZlKClcbiAgICAgIHRoaXMuYmcudHJhbnNsYXRlKHgrdy8yLCB5K2gvMilcbiAgICAgIHRoaXMuYmcuc2NhbGUoLTEsIDEpXG4gICAgICB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgLXcvMiwgLWgvMilcbiAgICAgIHRoaXMuYmcucmVzdG9yZSgpXG4gICAgfVxuICB9XG5cbiAgLy/jgrvjg7Pjgr/jg6rjg7PjgrDooajnpLpcbiAgZHJhd0ltZ0MobjogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIGlmKHRoaXMuaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gICAgaWYgKHRoaXMuYmcpXG4gICAgICB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgeCAtIGludCh0aGlzLmltZ1tuXS53aWR0aC8yKSwgeSAtIGludCh0aGlzLmltZ1tuXS5oZWlnaHQvMikpXG4gIH1cblxuICAvL+aLoeWkp+e4ruWwj1xuICBkcmF3SW1nUyhuOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcikge1xuICAgIGlmKHRoaXMuaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gICAgaWYgKHRoaXMuYmcpIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCB4LCB5LCB3LCBoKVxuICB9XG4gIC8v5YiH44KK5Ye644GXICsg5ouh5aSn57iu5bCPXG4gIGRyYXdJbWdUUyhuOiBudW1iZXIsIHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIHN3OiBudW1iZXIsIHNoOiBudW1iZXIsIGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIGN3OiBudW1iZXIsIGNoOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBpZiAodGhpcy5iZykge1xuICAgICAgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIHN4LCBzeSwgc3csIHNoLCBjeCwgY3ksIGN3LCBjaClcbiAgICB9XG4gIH1cbiAgLy/lm57ou6JcbiAgZHJhd0ltZ1IobiA6bnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgYXJnOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBjb25zdCB3ID0gdGhpcy5pbWdbbl0ud2lkdGhcbiAgICBjb25zdCBoID0gdGhpcy5pbWdbbl0uaGVpZ2h0XG4gICAgaWYodGhpcy5iZykge1xuICAgICAgdGhpcy5iZy5zYXZlKClcbiAgICAgIHRoaXMuYmcudHJhbnNsYXRlKHgrdy8yLCB5K2gvMilcbiAgICAgIHRoaXMuYmcucm90YXRlKGFyZylcbiAgICAgIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCAtdy8yLCAtaC8yKVxuICAgICAgdGhpcy5iZy5yZXN0b3JlKClcbiAgICB9XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0t5o+P55S7MyDmloflrZctLS0tLS0tLS0tLS0tXG4gIGZUZXh0KHN0cjogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlciwgc2l6OiBudW1iZXIsIGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcpIHtcbiAgICAgIHRoaXMuYmcuZm9udCA9IGludChzaXopICsgXCJweCBib2xkIG1vbm9zcGFjZVwiXG4gICAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgdGhpcy5iZy5maWxsVGV4dChzdHIsIHgrMSwgeSsxKVxuICAgICAgdGhpcy5iZy5maWxsU3R5bGUgPSBjb2xcbiAgICAgIHRoaXMuYmcuZmlsbFRleHQoc3RyLCB4LCB5KVxuICAgIH1cbiAgfVxuXG4gIGZUZXh0TihzdHI6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIsIGg6IG51bWJlciwgc2l6OiBudW1iZXIsIGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgY29uc3Qgc24gPSBzdHIuc3BsaXQoXCJcXG5cIilcbiAgICB0aGlzLmJnLmZvbnQgPSBpbnQoc2l6KSArIFwicHggYm9sZCBtb25vc3BhY2VcIlxuICAgIGlmKHNuLmxlbmd0aCA9PSAxKSB7XG4gICAgICBoID0gMFxuICAgIH0gZWxzZSB7XG4gICAgICB5ID0geSAtIGludChoLzIpXG4gICAgICBoID0gaW50KGggLyAoc24ubGVuZ3RoIC0gMSkpXG4gICAgfVxuICAgIGZvciggbGV0IGkgPSAwOyBpIDwgc24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgICB0aGlzLmJnLmZpbGxUZXh0KHN0ciwgeCsxLCB5KzEpXG4gICAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IGNvbFxuICAgICAgdGhpcy5iZy5maWxsVGV4dChzdHIsIHgsIHkpXG4gICAgfVxuICB9XG4gIG1UZXh0V2lkdGgoc3RyOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICByZXR1cm4gdGhpcy5iZy5tZWFzdXJlVGV4dChzdHIpLndpZHRoXG4gIH1cbn1cbiIsImltcG9ydCB7IGludCwgbG9nIH0gZnJvbSBcIi4vVXRpbGl0eVwiXG5pbXBvcnQgeyBkZXZpY2UgfSBmcm9tIFwiLi9EZXZpY2VcIlxuaW1wb3J0IHsgU0UgfSBmcm9tIFwiLi9Tb3VuZFwiXG5pbXBvcnQgeyBTQ0FMRSB9IGZyb20gXCIuL0NhbnZhc1wiXG4vLyAtLS0tLS0tLS0tIOOCv+ODg+ODl+WFpeWKmyAtLS0tLS0tLS0tXG5leHBvcnQgY2xhc3MgVG91Y2gge1xuXHRwdWJsaWMgdGFwWDogbnVtYmVyXG5cdHB1YmxpYyB0YXBZOiBudW1iZXJcblx0cHVibGljIHRhcEM6IG51bWJlclxuXHRwcml2YXRlIF9zZTogU0VcblxuXHRjb25zdHJ1Y3RvcihzZTogU0UpIHtcblx0XHR0aGlzLl9zZSA9IHNlO1xuXHRcdHRoaXMudGFwWCA9IDA7XG5cdFx0dGhpcy50YXBZID0gMDtcblx0XHR0aGlzLnRhcEMgPSAwO1xuXHR9XG5cdHN0YXJ0KGU6IFRvdWNoRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7Ly/jgq3jg6Pjg7Pjg5Djgrnjga7pgbjmip7vvI/jgrnjgq/jg63jg7zjg6vnrYnjgpLmipHliLbjgZnjgotcblx0XHRjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuXHRcdGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0dGhpcy50YXBYID0gZS50b3VjaGVzWzBdLmNsaWVudFgtcmVjdC5sZWZ0O1xuXHRcdHRoaXMudGFwWSA9IGUudG91Y2hlc1swXS5jbGllbnRZLXJlY3QudG9wO1xuXHRcdHRoaXMudGFwQyA9IDE7XG5cdFx0dGhpcy50cmFuc2Zvcm1YWSgpO1xuXHRcdGlmKHRoaXMuX3NlLnNuZF9pbml0ID09IDApIHRoaXMuX3NlLmxvYWRTb3VuZFNQaG9uZSgpOy8v44CQ6YeN6KaB44CR44K144Km44Oz44OJ44Gu6Kqt44G/6L6844G/XG5cdH1cblxuXHRtb3ZlKGU6IFRvdWNoRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblx0XHRjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdHRoaXMudGFwWCA9IGUudG91Y2hlc1swXS5jbGllbnRYLXJlY3QubGVmdDtcblx0XHR0aGlzLnRhcFkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WS1yZWN0LnRvcDtcblx0XHR0aGlzLnRyYW5zZm9ybVhZKCk7XG5cdH1cblxuXHRlbmQoZTogVG91Y2hFdmVudCkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR0aGlzLnRhcEMgPSAwOy8v4oC744Oe44Km44K55pON5L2c44Gn44GvbW91c2VPdXTjgYzjgZPjgozjgavjgarjgotcblx0fVxuXG5cdGNhbmNlbChlOiBUb3VjaEV2ZW50KSB7XG5cdFx0dGhpcy50YXBYID0gLTE7XG5cdFx0dGhpcy50YXBZID0gLTE7XG5cdFx0dGhpcy50YXBDID0gMDtcblx0fVxuXG5cdHRyYW5zZm9ybVhZKCkgey8v5a6f5bqn5qiZ4oaS5Luu5oOz5bqn5qiZ44G444Gu5aSJ5o+bXG5cdFx0dGhpcy50YXBYID0gaW50KHRoaXMudGFwWCAvIFNDQUxFKTtcblx0XHR0aGlzLnRhcFkgPSBpbnQodGhpcy50YXBZIC8gU0NBTEUpO1xuXHR9XG59XG5cblxuLy8gLS0tLS0tLS0tLS0tLeODnuOCpuOCueWFpeWKmy0tLS0tLS0tLS0tLS1cbmV4cG9ydCBjbGFzcyBNb3VzZSB7XG5cdHB1YmxpYyB0YXBYOm51bWJlclxuXHRwdWJsaWMgdGFwWTpudW1iZXJcblx0cHVibGljIHRhcEM6bnVtYmVyXG5cdHByaXZhdGUgX3NlOiBTRVxuXG5cdGNvbnN0cnVjdG9yKHNlOiBTRSkge1xuXHRcdHRoaXMuX3NlID0gc2Vcblx0XHR0aGlzLnRhcEMgPSAwXG5cdFx0dGhpcy50YXBYID0gMFxuXHRcdHRoaXMudGFwWSA9IDBcblx0fVxuXG5cdGRvd24oZTogTW91c2VFdmVudCkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTsvL+OCreODo+ODs+ODkOOCueOBrumBuOaKnu+8j+OCueOCr+ODreODvOODq+etieOCkuaKkeWItuOBmeOCi1xuXHRcdGlmKCEgZS50YXJnZXQpIHJldHVyblxuXHRcdGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG5cdFx0dmFyIHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHR0aGlzLnRhcFggPSBlLmNsaWVudFgtcmVjdC5sZWZ0O1xuXHRcdHRoaXMudGFwWSA9IGUuY2xpZW50WS1yZWN0LnRvcDtcblx0XHR0aGlzLnRhcEMgPSAxO1xuXHRcdHRoaXMudHJhbnNmb3JtWFkoKVxuXHRcdGlmKHRoaXMuX3NlLnNuZF9pbml0ID09IDApIHRoaXMuX3NlLmxvYWRTb3VuZFNQaG9uZSgpOy8v44CQ6YeN6KaB44CR44K144Km44Oz44OJ44Gu6Kqt44G/6L6844G/XG5cdH1cblxuXHRtb3ZlKGU6IE1vdXNlRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0aWYoISBlLnRhcmdldCkgcmV0dXJuXG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblx0XHRjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0dGhpcy50YXBYID0gZS5jbGllbnRYLXJlY3QubGVmdDtcblx0XHR0aGlzLnRhcFkgPSBlLmNsaWVudFktcmVjdC50b3A7XG5cdFx0dGhpcy50cmFuc2Zvcm1YWSgpXG5cdH1cblxuXHR1cChlOiBNb3VzZUV2ZW50KSB7IHRoaXMudGFwQyA9IDA7IH1cblx0b3V0KGU6IE1vdXNlRXZlbnQpIHsgdGhpcy50YXBDID0gMDsgfVxuXG5cdHRyYW5zZm9ybVhZKCkgey8v5a6f5bqn5qiZ4oaS5Luu5oOz5bqn5qiZ44G444Gu5aSJ5o+bXG5cdFx0dGhpcy50YXBYID0gaW50KHRoaXMudGFwWCAvIFNDQUxFKTtcblx0XHR0aGlzLnRhcFkgPSBpbnQodGhpcy50YXBZIC8gU0NBTEUpO1xuXHR9XG59XG5cbi8vIC0tLS0tLS0tLS0g5Yqg6YCf5bqm44K744Oz44K144O8IC0tLS0tLS0tLS1cbmV4cG9ydCBjbGFzcyBBY2Mge1xuXHRfYWNYID0gMFxuXHRfYWNZID0gMFxuXHRfYWNaID0gMDtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHQvL3dpbmRvdy5vbmRldmljZW1vdGlvbiA9IGRldmljZU1vdGlvbjsvL+KYheKYheKYheaXp1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlbW90aW9uXCIsIHRoaXMuZGV2aWNlTW90aW9uKTtcblx0fVxuXG5cdGRldmljZU1vdGlvbihlOiBEZXZpY2VNb3Rpb25FdmVudCkge1xuXHRcdHZhciBhSUc6IERldmljZU1vdGlvbkV2ZW50QWNjZWxlcmF0aW9uIHwgbnVsbCA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eTtcblx0XHRpZiAoYUlHID09IG51bGwpIHJldHVybjtcblx0XHRpZihhSUcueCkgdGhpcy5fYWNYID0gaW50KGFJRy54KTtcblx0XHRpZihhSUcueSkgdGhpcy5fYWNZID0gaW50KGFJRy55KTtcblx0XHRpZihhSUcueikgdGhpcy5fYWNaID0gaW50KGFJRy56KTtcblx0XHRpZihkZXZpY2UudHlwZSA9PSBkZXZpY2UuUFRfQW5kcm9pZCkgey8vQW5kcm9pZCDjgaggaU9TIOOBp+ato+iyoOOBjOmAhuOBq+OBquOCi1xuXHRcdFx0dGhpcy5fYWNYID0gLXRoaXMuX2FjWDtcblx0XHRcdHRoaXMuX2FjWSA9IC10aGlzLl9hY1k7XG5cdFx0XHR0aGlzLl9hY1ogPSAtdGhpcy5fYWNaO1xuXHRcdH1cblx0fVxufVxuXG4vL+OCreODvOWFpeWKm+eUqFxuXG5leHBvcnQgY2xhc3MgS2V5IHtcblx0S19FTlRFUiA9IDEzXG5cdEtfU1BBQ0UgPSAzMlxuXHRLX0xFRlQgID0gMzdcblx0S19VUCAgICA9IDM4XG5cdEtfUklHSFQgPSAzOVxuXHRLX0RPV04gID0gNDBcblx0S19hICAgICA9IDY1XG5cdEtfeiAgICAgPSA5MFxuXHRwcml2YXRlIF9zZTogU0VcblxuXHRfaW5rZXk6IG51bWJlclxuXHRfa2V5OiBudW1iZXJbXVxuXG5cdGNvbnN0cnVjdG9yKHNlOiBTRSkge1xuXHRcdHRoaXMuX2lua2V5ID0gMFxuXHRcdHRoaXMuX2tleSA9IG5ldyBBcnJheSgyNTYpO1xuXHRcdHRoaXMuX3NlID0gc2Vcblx0fVxuXG5cdGNscigpIHtcblx0XHR0aGlzLl9pbmtleSA9IDA7XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB0aGlzLl9rZXlbaV0gPSAwO1xuXHR9XG5cblx0b24oZTogS2V5Ym9hcmRFdmVudCkge1xuXHRcdGlmKHRoaXMuX3NlLnNuZF9pbml0ID09IDApIHRoaXMuX3NlLmxvYWRTb3VuZFNQaG9uZSgpOy8v44CQ6YeN6KaB44CR44K144Km44Oz44OJ44Gu6Kqt44G/6L6844G/XG5cdFx0dGhpcy5faW5rZXkgPSBlLmtleUNvZGU7XG5cdFx0dGhpcy5fa2V5W2Uua2V5Q29kZV0rKztcblx0Ly9sb2coaW5rZXkpO1xuXHR9XG5cblx0b2ZmKGU6IEtleWJvYXJkRXZlbnQpIHtcblx0XHR0aGlzLl9pbmtleSA9IDA7XG5cdFx0dGhpcy5fa2V5W2Uua2V5Q29kZV0gPSAwO1xuXHR9XG59XG4iLCIvLyAtLS0tLS0tLS0tLS0t44K144Km44Oz44OJ5Yi25b6hLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGxldCAgU09VTkRfT04gPSB0cnVlXG5leHBvcnQgY2xhc3MgU0Uge1xuICBwdWJsaWMgd2FpdF9zZTogbnVtYmVyID0gMFxuICBwdWJsaWMgc25kX2luaXQ6IG51bWJlciA9IDBcbiAgc291bmRGaWxlOiBIVE1MQXVkaW9FbGVtZW50W11cbiAgaXNCZ206IG51bWJlclxuICBiZ21ObzogbnVtYmVyXG4gIHNlTm86bnVtYmVyXG5cbiAgc291bmRsb2FkZWQ6IG51bWJlclxuICBzZl9uYW1lOiBzdHJpbmdbXVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8v44K144Km44Oz44OJ44OV44Kh44Kk44Or44KS6Kqt44G/6L6844KT44Gg44GLKOOCueODnuODm+WvvuetlilcbiAgICB0aGlzLndhaXRfc2UgPSAwXG4gICAgdGhpcy5zbmRfaW5pdCA9IDBcbiAgICB0aGlzLnNvdW5kRmlsZSA9IG5ldyBBcnJheSgyNTYpXG4gICAgdGhpcy5pc0JnbSA9IC0xXG4gICAgdGhpcy5iZ21ObyA9IDBcbiAgICB0aGlzLnNlTm8gPSAtMVxuICAgIHRoaXMuc291bmRsb2FkZWQgPSAwIC8v44GE44GP44Gk44OV44Kh44Kk44Or44KS6Kqt44G/6L6844KT44Gg44GLXG4gICAgdGhpcy5zZl9uYW1lID0gbmV3IEFycmF5KDI1NilcbiAgfVxuXG4gIGxvYWRTb3VuZFNQaG9uZSgpIHsvL+OCueODnuODm+OBp+ODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCgFxuICAgIHRyeSB7XG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5zb3VuZGxvYWRlZDsgaSsrKSB7XG4gICAgICAgIHRoaXMuc291bmRGaWxlW2ldID0gbmV3IEF1ZGlvKHRoaXMuc2ZfbmFtZVtpXSlcbiAgICAgICAgdGhpcy5zb3VuZEZpbGVbaV0ubG9hZCgpXG4gICAgICB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgfVxuICAgIHRoaXMuc25kX2luaXQgPSAyIC8v44K544Oe44Ob44Gn44OV44Kh44Kk44Or44KS6Kqt44G/6L6844KT44GgXG4gIH1cblxuICBsb2FkU291bmQobjogbnVtYmVyLCBmaWxlbmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zZl9uYW1lW25dID0gZmlsZW5hbWVcbiAgICB0aGlzLnNvdW5kbG9hZGVkKytcbiAgfVxuXG4gIHBsYXlTRShuOiBudW1iZXIpIHtcbiAgICBpZihTT1VORF9PTiA9PSBmYWxzZSkgcmV0dXJuXG4gICAgaWYodGhpcy5pc0JnbSA9PSAyKSByZXR1cm5cbiAgICBpZih0aGlzLndhaXRfc2UgPT0gMCkge1xuICAgICAgdGhpcy5zZU5vID0gblxuICAgICAgdGhpcy5zb3VuZEZpbGVbbl0uY3VycmVudFRpbWUgPSAwXG4gICAgICB0aGlzLnNvdW5kRmlsZVtuXS5sb29wID0gZmFsc2VcbiAgICAgIHRoaXMuc291bmRGaWxlW25dLnBsYXkoKVxuICAgICAgdGhpcy53YWl0X3NlID0gMyAvL+ODluODqeOCpuOCtuOBq+iyoOiNt+OCkuOBi+OBkeOBquOBhOOCiOOBhuOBq+mAo+e2muOBl+OBpua1geOBleOBquOBhOOCiOOBhuOBq+OBmeOCi1xuICAgIH1cbiAgfVxufSIsIi8vIC0tLS0tLS0tLS0tLS3lkITnqK7jga7plqLmlbAtLS0tLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gbG9nKG1zZzogc3RyaW5nKSB7XG4gIGNvbnNvbGUubG9nKG1zZylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludCh2YWw6IG51bWJlcik6IG51bWJlciB7XG4gIGxldCBudW0gPSBTdHJpbmcodmFsKVxuICByZXR1cm4gcGFyc2VJbnQobnVtKSAvL+ODl+ODqeOCueODnuOCpOODiuOCueOBqeOBoeOCieOCguWwj+aVsOmDqOWIhuOCkuWIh+OCiuaNqOOBplxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyKHZhbDogbnVtYmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIFN0cmluZyh2YWwpXG59XG5leHBvcnQgZnVuY3Rpb24gcm5kKG1heDogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSptYXgpXG59XG5leHBvcnQgZnVuY3Rpb24gYWJzKHZhbDogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguYWJzKHZhbClcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBNTVMgfSBmcm9tICcuL1dXUydcbmltcG9ydCB7IHJuZCwgbG9nLCBpbnQsIHN0ciwgYWJzfSBmcm9tICcuL1dXU2xpYi9VdGlsaXR5J1xuXG5cbmxldCBiYWxsWDogbnVtYmVyID0gNjAwXG5sZXQgYmFsbFk6IG51bWJlciA9IDMwMFxubGV0IGJhbGxYcDogbnVtYmVyID0gMTBcbmxldCBiYWxsWXA6IG51bWJlciA9IDNcbmxldCBiYXJYOiBudW1iZXIgPSA2MDBcbmxldCBiYXJZOiBudW1iZXIgPSA3MDBcbmxldCBzY29yZTogbnVtYmVyID0gMFxubGV0IHNjZW5lOiBudW1iZXIgPSAwXG5cbmNsYXNzIE15R2FtZSBleHRlbmRzIE1NUyB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgc3VwZXIoKVxuICB9XG5cbiAgY2xyS2V5KCk6IHZvaWQge31cbiAgc2V0dXAoKTogdm9pZCB7XG4gICAgdGhpcy5jYW52YXMuY2FudmFzU2l6ZSgxMjAwLCA4MDApXG4gICAgdGhpcy5kcmF3LmxpbmVXKDMpXG4gICAgdGhpcy5kcmF3LmxvYWRJbWcoMCwgJ2ltYWdlL2JnLnBuZycpXG4gICAgdGhpcy5zZS5sb2FkU291bmQoMCwgXCJzb3VuZC9zZS5tNGFcIilcbiAgfVxuICBtYWlubG9vcCgpOiB2b2lkIHtcbiAgICB0aGlzLmRyYXcuZHJhd0ltZygwLCAwLCAwKVxuICAgIHRoaXMuZHJhdy5zZXRBbHAoNTApXG4gICAgdGhpcy5kcmF3LmZSZWN0KDI1MCwgNTAsIDcwMCwgNzUwLCBcImJsYWNrXCIpXG4gICAgdGhpcy5kcmF3LnNldEFscCgxMDApXG4gICAgdGhpcy5kcmF3LnNSZWN0KDI1MCwgNTAsIDcwMCwgNzYwLCBcInNpbHZlclwiKVxuICAgIHRoaXMuZHJhdy5mVGV4dChcIlNDT1JFIFwiICsgc2NvcmUsIDYwMCwgMjUsIDM2LCBcIndoaXRlXCIpXG4gICAgdGhpcy5kcmF3LnNDaXIoYmFsbFgsIGJhbGxZLCAxMCwgXCJsaW1lXCIpXG4gICAgdGhpcy5kcmF3LnNSZWN0KGJhclgtNTAsIGJhclktMTAsIDEwMCwgMjAsIFwidmlvbGV0XCIpXG4gICAgaWYoc2NlbmUgPT0gMCkgeyAvLyDjgrLjg7zjg6Dplovlp4vliY1cbiAgICAgIHRoaXMuZHJhdy5mVGV4dChcIlNxdWFzaCBHYW1lXCIsIDYwMCwgMjAwLCA0OCwgXCJjeWFuXCIpXG4gICAgICB0aGlzLmRyYXcuZlRleHQoXCJDbGljayB0byBzdGFydCFcIiwgNjAwLCA2MDAsIDM2LCBcImdvbGRcIilcbiAgICAgIGlmKHRoaXMubW91c2UudGFwQyA9PSAxKSB7XG4gICAgICAgIGJhbGxYID0gNjAwXG4gICAgICAgIGJhbGxZID0gMzAwXG4gICAgICAgIGJhbGxYcCA9IDEyXG4gICAgICAgIGJhbGxZcCA9IDhcbiAgICAgICAgc2NvcmUgPSAwXG4gICAgICAgIHNjZW5lID0gMVxuICAgICAgfVxuICAgIH0gZWxzZSBpZihzY2VuZSA9PSAxKSB7Ly8g44Ky44O844Og5LitXG4gICAgICBiYWxsWCA9IGJhbGxYICsgYmFsbFhwXG4gICAgICBiYWxsWSA9IGJhbGxZICsgYmFsbFlwXG4gICAgICBpZihiYWxsWCA8PSAyNjAgfHwgYmFsbFggPj0gOTQwKSBiYWxsWHAgPSAtYmFsbFhwXG4gICAgICBpZihiYWxsWSA8PSA2MCkgYmFsbFlwID0gOCArIHJuZCg4KVxuICAgICAgaWYoYmFsbFkgPj0gODAwKSBzY2VuZSA9IDJcbiAgICAgIGJhclggPSB0aGlzLm1vdXNlLnRhcFhcbiAgICAgIGlmKGJhclggPCAzMDApIGJhclggPSAzMDBcbiAgICAgIGlmKGJhclggPiA5MDApIGJhclggPSA5MDBcbiAgICAgIGlmKGJhclgtNjAgPCBiYWxsWCAmJiBiYWxsWCA8IGJhclgrNjAgJiYgYmFyWS0zMCA8IGJhbGxZICYmIGJhbGxZIDwgYmFyWS0xMCkge1xuICAgICAgICBiYWxsWXAgPSAtOC1ybmQoOClcbiAgICAgICAgc2NvcmUgKz0gMTAwXG4gICAgICAgIHRoaXMuc2UucGxheVNFKDApXG4gICAgICB9XG4gICAgfSBlbHNlIGlmKHNjZW5lID09IDIpIHsvLyDjgrLjg7zjg6DntYLkuoZcbiAgICAgIHRoaXMuZHJhdy5mVGV4dChcIkdhbWUgT3ZlclwiLCA2MDAsIDQwMCwgMzYsIFwicmVkXCIpXG4gICAgICBpZih0aGlzLm1vdXNlLnRhcEMgPT0gMSl7XG4gICAgICAgIHNjZW5lID0gMFxuICAgICAgICB0aGlzLm1vdXNlLnRhcEMgPSAwXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm5ldyBNeUdhbWUoKVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9