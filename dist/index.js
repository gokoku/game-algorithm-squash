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
    }
    wwsSysMain() {
        let stime = Date.now();
        if (Canvas_1.bakW != window.innerWidth || Canvas_1.bakH != window.innerHeight) {
            (0, Canvas_1.initCanvas)();
            (0, Canvas_1.lineW)(Canvas_1.line_width);
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
                (0, Canvas_1.fill)("black");
                (0, Canvas_1.fText)("※セーブデータが保存されません※", x, y / 2, fs, "yellow");
                (0, Canvas_1.fTextN)("iOS端末をお使いの場合は\nSafariのプライベートブラウズ\nをオフにして起動して下さい。", x, y * 2, y, fs, "yellow");
                (0, Canvas_1.fTextN)("その他の機種（ブラウザ）では\nローカルストレージへの保存を\n許可する設定にして下さい。", x, y * 4, y, fs, "yellow");
                (0, Canvas_1.fText)("このまま続けるには画面をタップ", x, y * 5.5, fs, "lime");
                if (Event_1.tapC != 0)
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
                if (Sound_1.se.wait_se > 0)
                    Sound_1.se.wait_se--;
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
        (0, Canvas_1.initCanvas)();
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
        window.addEventListener("keydown", Event_1.onKey);
        window.addEventListener("keyup", Event_1.offKey);
        if (supportTouch == true) {
            Canvas_1.cvs.addEventListener("touchstart", Event_1.touchStart);
            Canvas_1.cvs.addEventListener("touchmove", Event_1.touchMove);
            Canvas_1.cvs.addEventListener("touchend", Event_1.touchEnd);
            Canvas_1.cvs.addEventListener("touchcancel", Event_1.touchCancel);
        }
        else {
            Canvas_1.cvs.addEventListener("mousedown", Event_1.mouseDown);
            Canvas_1.cvs.addEventListener("mousemove", Event_1.mouseMove);
            Canvas_1.cvs.addEventListener("mouseup", Event_1.mouseUp);
            Canvas_1.cvs.addEventListener("mouseout", Event_1.mouseOut);
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
exports.fTextN = exports.fText = exports.drawImg = exports.sCir = exports.fCir = exports.sRect = exports.fRect = exports.fill = exports.line = exports.lineW = exports.line_width = exports.colorRGB = exports.setAlp = exports.loadImg = exports.canvasSize = exports.initCanvas = exports.bakH = exports.bakW = exports.bg = exports.cvs = exports.SCALE = exports.CHEIGHT = exports.CWIDTH = exports.SOUND_ON = void 0;
const Utility_1 = __webpack_require__(/*! ./Utility */ "./src/WWSlib/Utility.ts");
// -------------描画面(キャンバス)-------------
exports.SOUND_ON = true;
exports.CWIDTH = 800;
exports.CHEIGHT = 600;
exports.SCALE = 1.0; // スケール値設定+タップ位置計算用
exports.cvs = document.getElementById("canvas");
exports.bg = exports.cvs.getContext("2d");
let winW, winH;
function initCanvas() {
    winW = window.innerWidth;
    winH = window.innerHeight;
    exports.bakW = winW;
    exports.bakH = winH;
    if (winH < winW * (exports.CHEIGHT / exports.CWIDTH)) {
        winW = winW * (exports.CHEIGHT / exports.CWIDTH);
    }
    else {
        winH = (0, Utility_1.int)(exports.CHEIGHT * winW / exports.CWIDTH);
    }
    exports.cvs.width = winW;
    exports.cvs.height = winH;
    exports.SCALE = winW / exports.CWIDTH;
    exports.bg === null || exports.bg === void 0 ? void 0 : exports.bg.scale(exports.SCALE, exports.SCALE);
    if (exports.bg)
        exports.bg.textAlign = "center";
    if (exports.bg)
        exports.bg.textBaseline = "middle";
}
exports.initCanvas = initCanvas;
function canvasSize(w, h) {
    exports.CWIDTH = w;
    exports.CHEIGHT = h;
    initCanvas();
}
exports.canvasSize = canvasSize;
// -------------画像の読み込み-------------
const img = new Array(256);
const img_loaded = new Array(256);
function loadImg(n, filename) {
    (0, Utility_1.log)("画像" + n + " " + filename + "読み込み開始");
    img_loaded[n] = false;
    img[n] = new Image();
    img[n].src = filename;
    img[n].onload = function () {
        (0, Utility_1.log)("画像" + n + " " + filename + "読み込み完了");
        img_loaded[n] = true;
    };
}
exports.loadImg = loadImg;
// -------------描画1 図形-------------
function setAlp(par) {
    if (exports.bg)
        exports.bg.globalAlpha = par / 100;
}
exports.setAlp = setAlp;
function colorRGB(cr, cg, cb) {
    cr = (0, Utility_1.int)(cr);
    cg = (0, Utility_1.int)(cg);
    cb = (0, Utility_1.int)(cb);
    return ("rgb(" + cr + "," + cg + "," + cb + ")");
}
exports.colorRGB = colorRGB;
exports.line_width = 1;
function lineW(wid) {
    exports.line_width = wid; //バックアップ
    if (exports.bg)
        exports.bg.lineWidth = wid;
    if (exports.bg)
        exports.bg.lineCap = "round";
    if (exports.bg)
        exports.bg.lineJoin = "round";
}
exports.lineW = lineW;
function line(x0, y0, x1, y1, col) {
    if (exports.bg)
        exports.bg.strokeStyle = col;
    if (exports.bg)
        exports.bg.beginPath();
    if (exports.bg)
        exports.bg.moveTo(x0, y0);
    if (exports.bg)
        exports.bg.lineTo(x1, y1);
    if (exports.bg)
        exports.bg.stroke();
}
exports.line = line;
function fill(col) {
    if (exports.bg)
        exports.bg.fillStyle = col;
    if (exports.bg)
        exports.bg.fillRect(0, 0, exports.CWIDTH, exports.CHEIGHT);
}
exports.fill = fill;
function fRect(x, y, w, h, col) {
    if (exports.bg == null)
        return;
    exports.bg.strokeStyle = col;
    exports.bg.fillRect(x, y, w, h);
}
exports.fRect = fRect;
function sRect(x, y, w, h, col) {
    if (exports.bg == null)
        return;
    exports.bg.strokeStyle = col;
    exports.bg.strokeRect(x, y, w, h);
}
exports.sRect = sRect;
function fCir(x, y, r, col) {
    if (exports.bg == null)
        return;
    exports.bg.fillStyle = col;
    exports.bg.beginPath();
    exports.bg.arc(x, y, r, 0, Math.PI * 2, false);
    exports.bg.closePath();
    exports.bg.fill();
}
exports.fCir = fCir;
function sCir(x, y, r, col) {
    if (exports.bg == null)
        return;
    exports.bg.strokeStyle = col;
    exports.bg.beginPath();
    exports.bg.arc(x, y, r, 0, Math.PI * 2, false);
    exports.bg.closePath();
    exports.bg.stroke();
}
exports.sCir = sCir;
// -------------描画2 画像-------------
function drawImg(n, x, y) {
    if (exports.bg == null)
        return;
    if (img_loaded[n] == false)
        return;
    exports.bg.drawImage(img[n], x, y);
}
exports.drawImg = drawImg;
// -------------描画3 文字-------------
function fText(str, x, y, siz, col) {
    if (exports.bg == null)
        return;
    exports.bg.font = (0, Utility_1.int)(siz) + "px bold monospace";
    exports.bg.fillStyle = "black";
    exports.bg.fillText(str, x + 1, y + 1);
    exports.bg.fillStyle = col;
    exports.bg.fillText(str, x, y);
}
exports.fText = fText;
function fTextN(str, x, y, h, siz, col) {
    if (exports.bg == null)
        return;
    let i;
    const sn = str.split("\n");
    exports.bg.font = (0, Utility_1.int)(siz) + "px bold monospace";
    if (sn.length == 1) {
        h = 0;
    }
    else {
        y = y - (0, Utility_1.int)(h / 2);
        h = (0, Utility_1.int)(h / (sn.length - 1));
    }
    for (let i = 0; i < sn.length; i++) {
        exports.bg.fillStyle = "black";
        exports.bg.fillText(str, x + 1, y + 1);
        exports.bg.fillStyle = col;
        exports.bg.fillText(str, x, y);
    }
}
exports.fTextN = fTextN;
function mTextWidth(str) {
    if (exports.bg == null)
        return;
    return exports.bg.measureText(str).width;
}


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

/***/ "./src/WWSlib/Event.ts":
/*!*****************************!*\
  !*** ./src/WWSlib/Event.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.offKey = exports.onKey = exports.clrKey = exports.K_z = exports.K_a = exports.K_DOWN = exports.K_RIGHT = exports.K_UP = exports.K_LEFT = exports.K_SPACE = exports.K_ENTER = exports.deviceMotion = exports.mouseOut = exports.mouseUp = exports.mouseMove = exports.mouseDown = exports.tapCClear = exports.tapC = exports.tapY = exports.tapX = exports.transformXY = exports.touchCancel = exports.touchEnd = exports.touchMove = exports.touchStart = void 0;
const Utility_1 = __webpack_require__(/*! ./Utility */ "./src/WWSlib/Utility.ts");
const Canvas_1 = __webpack_require__(/*! ./Canvas */ "./src/WWSlib/Canvas.ts");
const Device_1 = __webpack_require__(/*! ./Device */ "./src/WWSlib/Device.ts");
const Sound_1 = __webpack_require__(/*! ./Sound */ "./src/WWSlib/Sound.ts");
// ---------- タップ入力 ----------
function touchStart(e) {
    e.preventDefault(); //キャンバスの選択／スクロール等を抑制する
    const target = e.target;
    const rect = target.getBoundingClientRect();
    exports.tapX = e.touches[0].clientX - rect.left;
    exports.tapY = e.touches[0].clientY - rect.top;
    exports.tapC = 1;
    transformXY();
    if (Sound_1.se.snd_init == 0)
        (0, Sound_1.loadSoundSPhone)(); //【重要】サウンドの読み込み
}
exports.touchStart = touchStart;
function touchMove(e) {
    e.preventDefault();
    const target = e.target;
    const rect = target.getBoundingClientRect();
    exports.tapX = e.touches[0].clientX - rect.left;
    exports.tapY = e.touches[0].clientY - rect.top;
    transformXY();
}
exports.touchMove = touchMove;
function touchEnd(e) {
    e.preventDefault();
    exports.tapC = 0; //※マウス操作ではmouseOutがこれになる
}
exports.touchEnd = touchEnd;
function touchCancel(e) {
    exports.tapX = -1;
    exports.tapY = -1;
    exports.tapC = 0;
}
exports.touchCancel = touchCancel;
function transformXY() {
    exports.tapX = (0, Utility_1.int)(exports.tapX / Canvas_1.SCALE);
    exports.tapY = (0, Utility_1.int)(exports.tapY / Canvas_1.SCALE);
}
exports.transformXY = transformXY;
// -------------マウス入力-------------
exports.tapX = 0; // readonly
exports.tapY = 0; // readonly
exports.tapC = 0; // readonly
function tapCClear() { exports.tapC = 0; }
exports.tapCClear = tapCClear;
function mouseDown(e) {
    e.preventDefault(); //キャンバスの選択／スクロール等を抑制する
    if (!e.target)
        return;
    const target = e.target;
    var rect = target.getBoundingClientRect();
    exports.tapX = e.clientX - rect.left;
    exports.tapY = e.clientY - rect.top;
    exports.tapC = 1;
    transformXY();
    if (Sound_1.se.snd_init == 0)
        (0, Sound_1.loadSoundSPhone)(); //【重要】サウンドの読み込み
}
exports.mouseDown = mouseDown;
function mouseMove(e) {
    e.preventDefault();
    if (!e.target)
        return;
    const target = e.target;
    const rect = target.getBoundingClientRect();
    exports.tapX = e.clientX - rect.left;
    exports.tapY = e.clientY - rect.top;
    transformXY();
}
exports.mouseMove = mouseMove;
function mouseUp(e) { exports.tapC = 0; }
exports.mouseUp = mouseUp;
function mouseOut(e) { exports.tapC = 0; }
exports.mouseOut = mouseOut;
// ---------- 加速度センサー ----------
var acX = 0, acY = 0, acZ = 0;
//window.ondevicemotion = deviceMotion;//★★★旧
window.addEventListener("devicemotion", deviceMotion);
function deviceMotion(e) {
    var aIG = e.accelerationIncludingGravity;
    if (aIG == null)
        return;
    if (aIG.x)
        acX = (0, Utility_1.int)(aIG.x);
    if (aIG.y)
        acY = (0, Utility_1.int)(aIG.y);
    if (aIG.z)
        acZ = (0, Utility_1.int)(aIG.z);
    if (Device_1.device.type == Device_1.device.PT_Android) { //Android と iOS で正負が逆になる
        acX = -acX;
        acY = -acY;
        acZ = -acZ;
    }
}
exports.deviceMotion = deviceMotion;
//キー入力用
exports.K_ENTER = 13;
exports.K_SPACE = 32;
exports.K_LEFT = 37;
exports.K_UP = 38;
exports.K_RIGHT = 39;
exports.K_DOWN = 40;
exports.K_a = 65;
exports.K_z = 90;
// ---------- キー入力 ----------
var inkey = 0;
var key = new Array(256);
function clrKey() {
    inkey = 0;
    for (var i = 0; i < 256; i++)
        key[i] = 0;
}
exports.clrKey = clrKey;
function onKey(e) {
    if (Sound_1.se.snd_init == 0)
        (0, Sound_1.loadSoundSPhone)(); //【重要】サウンドの読み込み
    inkey = e.keyCode;
    key[e.keyCode]++;
    //log(inkey);
}
exports.onKey = onKey;
function offKey(e) {
    inkey = 0;
    key[e.keyCode] = 0;
}
exports.offKey = offKey;


/***/ }),

/***/ "./src/WWSlib/Sound.ts":
/*!*****************************!*\
  !*** ./src/WWSlib/Sound.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.playSE = exports.loadSound = exports.loadSoundSPhone = exports.sf_name = exports.se = exports.SOUND_ON = void 0;
// -------------サウンド制御-------------
exports.SOUND_ON = true;
class SE {
    constructor() {
        this._wait_se = 0;
        this._snd_init = 0;
    }
    get wait_se() { return this._wait_se; }
    set wait_se(wait_se) { this._wait_se = wait_se; }
    //サウンドファイルを読み込んだか(スマホ対策)
    get snd_init() { return this._snd_init; }
    set snd_init(val) { this._snd_init = val; }
}
exports.se = new SE();
const soundFile = new Array(256);
let isBgm = -1;
let bgmNo = 0;
let seNo = -1;
let soundloaded = 0; //いくつファイルを読み込んだか
exports.sf_name = new Array(256);
function loadSoundSPhone() {
    try {
        for (let i = 0; i < soundloaded; i++) {
            soundFile[i] = new Audio(exports.sf_name[i]);
            soundFile[i].load();
        }
    }
    catch (e) {
    }
    exports.se.snd_init = 2; //スマホでファイルを読み込んだ
}
exports.loadSoundSPhone = loadSoundSPhone;
function loadSound(n, filename) {
    exports.sf_name[n] = filename;
    soundloaded++;
}
exports.loadSound = loadSound;
function playSE(n) {
    if (exports.SOUND_ON == false)
        return;
    if (isBgm == 2)
        return;
    if (exports.se.wait_se == 0) {
        seNo = n;
        soundFile[n].currentTime = 0;
        soundFile[n].loop = false;
        soundFile[n].play();
        exports.se.wait_se = 3; //ブラウザに負荷をかけないように連続して流さないようにする
    }
}
exports.playSE = playSE;


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
const Canvas_1 = __webpack_require__(/*! ./WWSlib/Canvas */ "./src/WWSlib/Canvas.ts");
const Sound_1 = __webpack_require__(/*! ./WWSlib/Sound */ "./src/WWSlib/Sound.ts");
const Event_1 = __webpack_require__(/*! ./WWSlib/Event */ "./src/WWSlib/Event.ts");
let ballX = 600;
let ballY = 300;
let ballXp = 10;
let ballYp = 3;
let barX = 600;
let barY = 700;
let score = 0;
let scene = 0;
class MyGame extends WWS_1.MMS {
    clrKey() { }
    setup() {
        (0, Canvas_1.canvasSize)(1200, 800);
        (0, Canvas_1.loadImg)(0, 'image/bg.png');
        (0, Sound_1.loadSound)(0, "sound/se.m4a");
    }
    mainloop() {
        (0, Canvas_1.drawImg)(0, 0, 0);
        (0, Canvas_1.setAlp)(50);
        (0, Canvas_1.fRect)(250, 50, 700, 750, "black");
        (0, Canvas_1.setAlp)(100);
        (0, Canvas_1.sRect)(250, 50, 700, 760, "silver");
        (0, Canvas_1.sCir)(ballX, ballY, 10, "lime");
        (0, Canvas_1.sRect)(barX - 50, barY - 10, 100, 20, "violet");
        if (scene == 0) { // ゲーム開始前
            (0, Canvas_1.fText)("Squash Game", 600, 200, 48, "cyan");
            (0, Canvas_1.fText)("Click to start!", 600, 600, 36, "gold");
            if (Event_1.tapC == 1) {
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
            barX = Event_1.tapX;
            if (barX < 300)
                barX = 300;
            if (barX > 900)
                barX = 900;
            if (barX - 60 < ballX && ballX < barX + 60 && barY - 30 < ballY && ballY < barY - 10) {
                ballYp = -8 - (0, Utility_1.rnd)(8);
                score += 100;
                (0, Sound_1.playSE)(0);
            }
        }
        else if (scene == 2) { // ゲーム終了
            (0, Canvas_1.fText)("Game Over", 600, 400, 36, "red");
            if (Event_1.tapC == 1) {
                scene = 0;
                (0, Event_1.tapCClear)();
            }
        }
    }
}
new MyGame();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7RUFRRTs7O0FBRUYseUZBQXlEO0FBQ3pELG1GQUU2QztBQUM3QyxzRkFBc0g7QUFDdEgsbUZBQW1DO0FBQ25DLHNGQUF3QztBQUN4QywrQkFBK0I7QUFDakIsZUFBTyxHQUFHLGNBQWM7QUFDMUIsYUFBSyxHQUFHLEtBQUs7QUFHekIsWUFBWTtBQUNaLGNBQWM7QUFDZCxXQUFXO0FBQ1gsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixJQUFJLFFBQVEsR0FBRyxDQUFDO0FBQ2hCLElBQUksUUFBUSxHQUFHLENBQUM7QUFDaEIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFDLGFBQWE7QUFDOUIsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFNO0FBQ3RDLE1BQU0sWUFBWSxHQUFHLFlBQVksSUFBSSxRQUFRLENBQUMsZ0JBQWU7QUFFN0QsMEJBQTBCO0FBQzFCLElBQUssR0FBRyxHQUFHLEVBQUU7QUFDYixXQUFXO0FBQ1gsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLGlCQUFnQjtBQUM5Qyx1RUFBdUU7QUFDdkUsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBRXJCLHFDQUFxQztBQUNyQyxNQUFzQixHQUFHO0lBS3ZCO1FBQ0UsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsVUFBVTtRQUVSLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFFdEIsSUFBRyxhQUFJLElBQUksTUFBTSxDQUFDLFVBQVUsSUFBSSxhQUFJLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtZQUMxRCx1QkFBVSxHQUFFO1lBQ1osa0JBQUssRUFBQyxtQkFBVSxDQUFDO1NBQ2xCO1FBRUQsUUFBUSxFQUFHO1FBRVgsUUFBTyxRQUFRLEVBQUU7WUFDZixLQUFLLENBQUM7Z0JBQ0osSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDWixRQUFRLEdBQUcsQ0FBQztnQkFDWixJQUFHLFFBQVEsSUFBSSxJQUFJLEVBQUU7b0JBQ25CLElBQUk7d0JBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDO3FCQUFDO29CQUFDLE9BQU0sQ0FBQyxFQUFFO3dCQUFFLFFBQVEsR0FBRyxDQUFDO3FCQUFFO2lCQUMvRTtnQkFDRCxNQUFLO1lBRVAsS0FBSyxDQUFDO2dCQUNKLElBQUksQ0FBQyxHQUFHLGlCQUFHLEVBQUMsZUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLEdBQUcsaUJBQUcsRUFBQyxnQkFBTyxHQUFHLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxFQUFFLEdBQUcsaUJBQUcsRUFBQyxnQkFBTyxHQUFHLEVBQUUsQ0FBQztnQkFDMUIsaUJBQUksRUFBQyxPQUFPLENBQUM7Z0JBQ2Isa0JBQUssRUFBQyxrQkFBa0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ2hELG1CQUFNLEVBQUMsa0RBQWtELEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDcEYsbUJBQU0sRUFBQywrQ0FBK0MsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNqRixrQkFBSyxFQUFDLGlCQUFpQixFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDL0MsSUFBRyxZQUFJLElBQUksQ0FBQztvQkFBRSxRQUFRLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQixNQUFNO1lBRVIsS0FBSyxDQUFDLEVBQUUsT0FBTztnQkFDYixJQUFHLFFBQVEsSUFBSSxDQUFDLEVBQUU7b0JBQ2hCLElBQUksQ0FBQyxRQUFRLEVBQUU7aUJBQ2hCO3FCQUFNO29CQUNMLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ2IsUUFBUSxFQUFFO2lCQUNYO2dCQUNELElBQUcsVUFBRSxDQUFDLE9BQU8sR0FBRyxDQUFDO29CQUFFLFVBQUUsQ0FBQyxPQUFPLEVBQUU7Z0JBQy9CLE1BQUs7WUFDUCxPQUFPLENBQUMsQ0FBQyxNQUFLO1NBQ2Y7UUFDRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDO1FBQy9CLElBQUcsS0FBSyxHQUFHLENBQUM7WUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLElBQUcsS0FBSyxHQUFHLGlCQUFHLEVBQUMsSUFBSSxHQUFDLEdBQUcsQ0FBQztZQUFFLEtBQUssR0FBRyxpQkFBRyxFQUFDLElBQUksR0FBQyxHQUFHLENBQUMsQ0FBQztRQUVoRCxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsaUJBQUcsRUFBQyxJQUFJLEdBQUMsR0FBRyxDQUFDLEdBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELFVBQVU7UUFDUix1QkFBVSxHQUFFO1FBQ1osSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRztZQUMvQixlQUFNLENBQUMsSUFBSSxHQUFHLGVBQU0sQ0FBQyxVQUFVLENBQUM7U0FDakM7YUFDSSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFHO1lBQ3pGLGVBQU0sQ0FBQyxJQUFJLEdBQUcsZUFBTSxDQUFDLE1BQU0sQ0FBQztZQUM1QixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxxQkFBb0I7U0FDMUM7YUFDSSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFHO1lBQ2pDLGVBQU0sQ0FBQyxJQUFJLEdBQUcsZUFBTSxDQUFDLFNBQVMsQ0FBQztTQUNoQztRQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsYUFBSyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxjQUFNLENBQUMsQ0FBQztRQUV6QyxJQUFHLFlBQVksSUFBSSxJQUFJLEVBQUU7WUFDdkIsWUFBRyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxrQkFBVSxDQUFDO1lBQzlDLFlBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsaUJBQVMsQ0FBQztZQUM1QyxZQUFHLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLGdCQUFRLENBQUM7WUFDMUMsWUFBRyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxtQkFBVyxDQUFDO1NBQ2pEO2FBQU07WUFDTCxZQUFHLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLGlCQUFTLENBQUM7WUFDNUMsWUFBRyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxpQkFBUyxDQUFDO1lBQzVDLFlBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsZUFBTyxDQUFDO1lBQ3hDLFlBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsZ0JBQVEsQ0FBQztTQUMzQztRQUNELElBQUksQ0FBQyxVQUFVLEVBQUU7SUFDbkIsQ0FBQztDQUNGO0FBeEZELGtCQXdGQzs7Ozs7Ozs7Ozs7Ozs7QUNqSUQsa0ZBQWtDO0FBRWxDLHVDQUF1QztBQUMzQixnQkFBUSxHQUFHLElBQUk7QUFFZixjQUFNLEdBQUcsR0FBRztBQUNaLGVBQU8sR0FBRyxHQUFHO0FBQ2QsYUFBSyxHQUFHLEdBQUcsRUFBQyxtQkFBbUI7QUFFN0IsV0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFzQjtBQUM1RCxVQUFFLEdBQXFDLFdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0FBRXhFLElBQUksSUFBWSxFQUFFLElBQVk7QUFHOUIsU0FBZ0IsVUFBVTtJQUN4QixJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVU7SUFDeEIsSUFBSSxHQUFHLE1BQU0sQ0FBQyxXQUFXO0lBQ3pCLFlBQUksR0FBRyxJQUFJO0lBQ1gsWUFBSSxHQUFHLElBQUk7SUFFWCxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUMsQ0FBQyxlQUFPLEdBQUMsY0FBTSxDQUFDLEVBQUc7UUFDakMsSUFBSSxHQUFHLElBQUksR0FBQyxDQUFDLGVBQU8sR0FBQyxjQUFNLENBQUM7S0FDN0I7U0FBTTtRQUNMLElBQUksR0FBRyxpQkFBRyxFQUFDLGVBQU8sR0FBRyxJQUFJLEdBQUMsY0FBTSxDQUFDO0tBQ2xDO0lBQ0QsaUJBQVMsR0FBRyxJQUFJO0lBQ2hCLGtCQUFVLEdBQUcsSUFBSTtJQUNqQixhQUFLLEdBQUcsSUFBSSxHQUFHLGNBQU07SUFDckIsVUFBRSxhQUFGLFVBQUUsdUJBQUYsVUFBRSxDQUFFLEtBQUssQ0FBQyxhQUFLLEVBQUUsYUFBSyxDQUFDO0lBQ3ZCLElBQUcsVUFBRTtRQUFFLG9CQUFZLEdBQUcsUUFBUTtJQUM5QixJQUFHLFVBQUU7UUFBRSx1QkFBZSxHQUFHLFFBQVE7QUFDbkMsQ0FBQztBQWpCRCxnQ0FpQkM7QUFFRCxTQUFnQixVQUFVLENBQUMsQ0FBUyxFQUFFLENBQVM7SUFDN0MsY0FBTSxHQUFHLENBQUM7SUFDVixlQUFPLEdBQUcsQ0FBQztJQUNYLFVBQVUsRUFBRTtBQUNkLENBQUM7QUFKRCxnQ0FJQztBQUlELG9DQUFvQztBQUNwQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUM7QUFDMUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDO0FBRWpDLFNBQWdCLE9BQU8sQ0FBQyxDQUFTLEVBQUUsUUFBZ0I7SUFDakQsaUJBQUcsRUFBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQ3pDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLO0lBQ3JCLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssRUFBRTtJQUNwQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFFBQVE7SUFDckIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRztRQUNkLGlCQUFHLEVBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSTtJQUN0QixDQUFDO0FBQ0gsQ0FBQztBQVRELDBCQVNDO0FBSUQsbUNBQW1DO0FBQ25DLFNBQWdCLE1BQU0sQ0FBQyxHQUFXO0lBQ2hDLElBQUksVUFBRTtRQUFFLHNCQUFjLEdBQUcsR0FBRyxHQUFDLEdBQUc7QUFDbEMsQ0FBQztBQUZELHdCQUVDO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVTtJQUN6RCxFQUFFLEdBQUcsaUJBQUcsRUFBQyxFQUFFLENBQUM7SUFDWixFQUFFLEdBQUcsaUJBQUcsRUFBQyxFQUFFLENBQUM7SUFDWixFQUFFLEdBQUcsaUJBQUcsRUFBQyxFQUFFLENBQUM7SUFDWixPQUFPLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2xELENBQUM7QUFMRCw0QkFLQztBQUVVLGtCQUFVLEdBQUcsQ0FBQztBQUV6QixTQUFnQixLQUFLLENBQUMsR0FBVztJQUMvQixrQkFBVSxHQUFHLEdBQUcsRUFBQyxRQUFRO0lBQ3pCLElBQUcsVUFBRTtRQUFFLG9CQUFZLEdBQUcsR0FBRztJQUN6QixJQUFHLFVBQUU7UUFBRSxrQkFBVSxHQUFHLE9BQU87SUFDM0IsSUFBRyxVQUFFO1FBQUUsbUJBQVcsR0FBRyxPQUFPO0FBQzlCLENBQUM7QUFMRCxzQkFLQztBQUVELFNBQWdCLElBQUksQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsR0FBVztJQUM5RSxJQUFHLFVBQUU7UUFBRSxzQkFBYyxHQUFHLEdBQUc7SUFDM0IsSUFBRyxVQUFFO1FBQUUsVUFBRSxDQUFDLFNBQVMsRUFBRTtJQUNyQixJQUFHLFVBQUU7UUFBRSxVQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDeEIsSUFBRyxVQUFFO1FBQUUsVUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3hCLElBQUcsVUFBRTtRQUFFLFVBQUUsQ0FBQyxNQUFNLEVBQUU7QUFDcEIsQ0FBQztBQU5ELG9CQU1DO0FBRUQsU0FBZ0IsSUFBSSxDQUFDLEdBQVc7SUFDOUIsSUFBRyxVQUFFO1FBQUUsb0JBQVksR0FBRyxHQUFHO0lBQ3pCLElBQUcsVUFBRTtRQUFFLFVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxjQUFNLEVBQUUsZUFBTyxDQUFDO0FBQzNDLENBQUM7QUFIRCxvQkFHQztBQUVELFNBQWdCLEtBQUssQ0FBQyxDQUFRLEVBQUUsQ0FBUSxFQUFFLENBQVEsRUFBRSxDQUFRLEVBQUMsR0FBVztJQUN0RSxJQUFJLFVBQUUsSUFBSSxJQUFJO1FBQUUsT0FBTTtJQUN0QixzQkFBYyxHQUFHLEdBQUc7SUFDcEIsVUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUpELHNCQUlDO0FBRUQsU0FBZ0IsS0FBSyxDQUFDLENBQVEsRUFBRSxDQUFRLEVBQUUsQ0FBUSxFQUFFLENBQVEsRUFBQyxHQUFXO0lBQ3RFLElBQUksVUFBRSxJQUFJLElBQUk7UUFBRSxPQUFNO0lBQ3RCLHNCQUFjLEdBQUcsR0FBRztJQUNwQixVQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBSkQsc0JBSUM7QUFFRCxTQUFnQixJQUFJLENBQUMsQ0FBUSxFQUFFLENBQVEsRUFBRSxDQUFRLEVBQUMsR0FBVztJQUMzRCxJQUFJLFVBQUUsSUFBSSxJQUFJO1FBQUUsT0FBTTtJQUN0QixvQkFBWSxHQUFHLEdBQUc7SUFDbEIsVUFBRSxDQUFDLFNBQVMsRUFBRTtJQUNkLFVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQztJQUNwQyxVQUFFLENBQUMsU0FBUyxFQUFFO0lBQ2QsVUFBRSxDQUFDLElBQUksRUFBRTtBQUNYLENBQUM7QUFQRCxvQkFPQztBQUVELFNBQWdCLElBQUksQ0FBQyxDQUFRLEVBQUUsQ0FBUSxFQUFFLENBQVEsRUFBQyxHQUFXO0lBQzNELElBQUksVUFBRSxJQUFJLElBQUk7UUFBRSxPQUFNO0lBQ3RCLHNCQUFjLEdBQUcsR0FBRztJQUNwQixVQUFFLENBQUMsU0FBUyxFQUFFO0lBQ2QsVUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDO0lBQ3BDLFVBQUUsQ0FBQyxTQUFTLEVBQUU7SUFDZCxVQUFFLENBQUMsTUFBTSxFQUFFO0FBQ2IsQ0FBQztBQVBELG9CQU9DO0FBRUQsbUNBQW1DO0FBQ25DLFNBQWdCLE9BQU8sQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVE7SUFDcEQsSUFBSSxVQUFFLElBQUksSUFBSTtRQUFFLE9BQU07SUFDdEIsSUFBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSztRQUFFLE9BQU07SUFDakMsVUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBSkQsMEJBSUM7QUFFRCxtQ0FBbUM7QUFDbkMsU0FBZ0IsS0FBSyxDQUFDLEdBQVcsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLEdBQVcsRUFBRSxHQUFXO0lBQy9FLElBQUksVUFBRSxJQUFJLElBQUk7UUFBRSxPQUFNO0lBQ3RCLGVBQU8sR0FBRyxpQkFBRyxFQUFDLEdBQUcsQ0FBQyxHQUFHLG1CQUFtQjtJQUN4QyxvQkFBWSxHQUFHLE9BQU87SUFDdEIsVUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxDQUFDO0lBQzFCLG9CQUFZLEdBQUcsR0FBRztJQUNsQixVQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFQRCxzQkFPQztBQUVELFNBQWdCLE1BQU0sQ0FBQyxHQUFXLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsR0FBVyxFQUFFLEdBQVc7SUFDM0YsSUFBSSxVQUFFLElBQUksSUFBSTtRQUFFLE9BQU07SUFDdEIsSUFBSSxDQUFDO0lBQ0wsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDMUIsZUFBTyxHQUFHLGlCQUFHLEVBQUMsR0FBRyxDQUFDLEdBQUcsbUJBQW1CO0lBQ3hDLElBQUcsRUFBRSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDakIsQ0FBQyxHQUFHLENBQUM7S0FDTjtTQUFNO1FBQ0wsQ0FBQyxHQUFHLENBQUMsR0FBRyxpQkFBRyxFQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7UUFDaEIsQ0FBQyxHQUFHLGlCQUFHLEVBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztLQUM3QjtJQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xDLG9CQUFZLEdBQUcsT0FBTztRQUN0QixVQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLENBQUM7UUFDMUIsb0JBQVksR0FBRyxHQUFHO1FBQ2xCLFVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDdkI7QUFDSCxDQUFDO0FBakJELHdCQWlCQztBQUVELFNBQVMsVUFBVSxDQUFDLEdBQVc7SUFDN0IsSUFBSSxVQUFFLElBQUksSUFBSTtRQUFFLE9BQU07SUFDdEIsT0FBTyxVQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUs7QUFDbEMsQ0FBQzs7Ozs7Ozs7Ozs7O0FDbEtELE9BQU87OztBQUVQLE1BQU0sTUFBTTtJQUtWLFlBQW9CLEtBQWE7UUFBYixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBSjFCLFVBQUssR0FBSSxDQUFDLENBQUM7UUFDWCxXQUFNLEdBQUksQ0FBQyxDQUFDO1FBQ1osZUFBVSxHQUFHLENBQUMsQ0FBQztRQUNmLGNBQVMsR0FBRyxDQUFDLENBQUM7SUFDZSxDQUFDO0lBQ3JDLElBQUksSUFBSSxLQUFhLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekMsSUFBSSxJQUFJLENBQUMsSUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztDQUM5QztBQUVhLGNBQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNackMsa0ZBQWdDO0FBQ2hDLCtFQUFpQztBQUNqQywrRUFBaUM7QUFDakMsNEVBQThDO0FBRzlDLDhCQUE4QjtBQUM5QixTQUFnQixVQUFVLENBQUMsQ0FBYTtJQUN2QyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsdUJBQXNCO0lBQ3hDLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFxQjtJQUN2QyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUM1QyxZQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUN0QyxZQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNyQyxZQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ1QsV0FBVyxFQUFFLENBQUM7SUFDZCxJQUFHLFVBQUUsQ0FBQyxRQUFRLElBQUksQ0FBQztRQUFFLDJCQUFlLEdBQUUsQ0FBQyxnQkFBZTtBQUN2RCxDQUFDO0FBVEQsZ0NBU0M7QUFFRCxTQUFnQixTQUFTLENBQUMsQ0FBYTtJQUN0QyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDbEIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQXFCO0lBQ3ZDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQzVDLFlBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3RDLFlBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ3JDLFdBQVcsRUFBRSxDQUFDO0FBQ2YsQ0FBQztBQVBELDhCQU9DO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLENBQWE7SUFDckMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ25CLFlBQUksR0FBRyxDQUFDLENBQUMseUJBQXdCO0FBQ2xDLENBQUM7QUFIRCw0QkFHQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxDQUFhO0lBQ3hDLFlBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNWLFlBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNWLFlBQUksR0FBRyxDQUFDLENBQUM7QUFDVixDQUFDO0FBSkQsa0NBSUM7QUFFRCxTQUFnQixXQUFXO0lBQzFCLFlBQUksR0FBRyxpQkFBRyxFQUFDLFlBQUksR0FBQyxjQUFLLENBQUMsQ0FBQztJQUN2QixZQUFJLEdBQUcsaUJBQUcsRUFBQyxZQUFJLEdBQUMsY0FBSyxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUhELGtDQUdDO0FBRUQsa0NBQWtDO0FBQ3ZCLFlBQUksR0FBRyxDQUFDLEVBQUUsV0FBVztBQUNyQixZQUFJLEdBQUcsQ0FBQyxFQUFFLFdBQVc7QUFDckIsWUFBSSxHQUFHLENBQUMsRUFBRSxXQUFXO0FBRWhDLFNBQWdCLFNBQVMsS0FBSyxZQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUF6Qyw4QkFBeUM7QUFFekMsU0FBZ0IsU0FBUyxDQUFDLENBQWE7SUFDdEMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLHVCQUFzQjtJQUN4QyxJQUFHLENBQUUsQ0FBQyxDQUFDLE1BQU07UUFBRSxPQUFNO0lBQ3JCLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFxQjtJQUN2QyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUMxQyxZQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzNCLFlBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDMUIsWUFBSSxHQUFHLENBQUMsQ0FBQztJQUNULFdBQVcsRUFBRSxDQUFDO0lBQ2QsSUFBRyxVQUFFLENBQUMsUUFBUSxJQUFJLENBQUM7UUFBRSwyQkFBZSxHQUFFLENBQUMsZ0JBQWU7QUFDdkQsQ0FBQztBQVZELDhCQVVDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLENBQWE7SUFDdEMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ2xCLElBQUcsQ0FBRSxDQUFDLENBQUMsTUFBTTtRQUFFLE9BQU07SUFDckIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQXFCO0lBQ3ZDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQzVDLFlBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDM0IsWUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUMxQixXQUFXLEVBQUUsQ0FBQztBQUNmLENBQUM7QUFSRCw4QkFRQztBQUVELFNBQWdCLE9BQU8sQ0FBQyxDQUFhLElBQUksWUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFBcEQsMEJBQW9EO0FBQ3BELFNBQWdCLFFBQVEsQ0FBQyxDQUFhLElBQUksWUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFBckQsNEJBQXFEO0FBR3JELGdDQUFnQztBQUNoQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBRTlCLDZDQUE2QztBQUM3QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRXRELFNBQWdCLFlBQVksQ0FBQyxDQUFvQjtJQUNoRCxJQUFJLEdBQUcsR0FBeUMsQ0FBQyxDQUFDLDRCQUE0QixDQUFDO0lBQzlFLElBQUksR0FBRyxJQUFJLElBQUk7UUFBRSxPQUFPO0lBQ3pCLElBQUcsR0FBRyxDQUFDLENBQUM7UUFBRSxHQUFHLEdBQUcsaUJBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsSUFBRyxHQUFHLENBQUMsQ0FBQztRQUFFLEdBQUcsR0FBRyxpQkFBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixJQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQUUsR0FBRyxHQUFHLGlCQUFHLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLElBQUcsZUFBTSxDQUFDLElBQUksSUFBSSxlQUFNLENBQUMsVUFBVSxFQUFFLEVBQUMsd0JBQXdCO1FBQzdELEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUNYLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUNYLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztLQUNYO0FBQ0YsQ0FBQztBQVhELG9DQVdDO0FBSUQsT0FBTztBQUNPLGVBQU8sR0FBRyxFQUFFLENBQUM7QUFDYixlQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2IsY0FBTSxHQUFJLEVBQUUsQ0FBQztBQUNiLFlBQUksR0FBTSxFQUFFLENBQUM7QUFDYixlQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2IsY0FBTSxHQUFJLEVBQUUsQ0FBQztBQUNiLFdBQUcsR0FBTyxFQUFFLENBQUM7QUFDYixXQUFHLEdBQU8sRUFBRSxDQUFDO0FBRTNCLDZCQUE2QjtBQUM3QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxJQUFJLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV6QixTQUFnQixNQUFNO0lBQ3JCLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDVixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRTtRQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUhELHdCQUdDO0FBRUQsU0FBZ0IsS0FBSyxDQUFDLENBQWdCO0lBQ3JDLElBQUcsVUFBRSxDQUFDLFFBQVEsSUFBSSxDQUFDO1FBQUUsMkJBQWUsR0FBRSxDQUFDLGdCQUFlO0lBQ3RELEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ2xCLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUNsQixhQUFhO0FBQ2IsQ0FBQztBQUxELHNCQUtDO0FBRUQsU0FBZ0IsTUFBTSxDQUFDLENBQWdCO0lBQ3RDLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDVixHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQixDQUFDO0FBSEQsd0JBR0M7Ozs7Ozs7Ozs7Ozs7O0FDN0hELG1DQUFtQztBQUN2QixnQkFBUSxHQUFHLElBQUk7QUFFM0IsTUFBTSxFQUFFO0lBQVI7UUFDRSxhQUFRLEdBQVcsQ0FBQztRQUNwQixjQUFTLEdBQVcsQ0FBQztJQVF2QixDQUFDO0lBUEMsSUFBSSxPQUFPLEtBQUssT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFDLENBQUM7SUFDdEMsSUFBSSxPQUFPLENBQUMsT0FBZSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxFQUFDLENBQUM7SUFFeEQsd0JBQXdCO0lBQ3hCLElBQUksUUFBUSxLQUFhLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBQyxDQUFDO0lBQ2hELElBQUksUUFBUSxDQUFDLEdBQVcsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsRUFBQyxDQUFDO0NBRW5EO0FBRVksVUFBRSxHQUFHLElBQUksRUFBRSxFQUFFO0FBRTFCLE1BQU0sU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQztBQUNoQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxJQUFJLEtBQUssR0FBRyxDQUFDO0FBQ2IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBRWIsSUFBSSxXQUFXLEdBQUcsQ0FBQyxFQUFDLGdCQUFnQjtBQUN2QixlQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDO0FBRXJDLFNBQWdCLGVBQWU7SUFDN0IsSUFBSTtRQUNGLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLGVBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO1NBQ3BCO0tBQ0Y7SUFBQyxPQUFNLENBQUMsRUFBRTtLQUNWO0lBQ0QsbUJBQVcsR0FBRyxDQUFDLEVBQUMsZ0JBQWdCO0FBQ2xDLENBQUM7QUFURCwwQ0FTQztBQUVELFNBQWdCLFNBQVMsQ0FBQyxDQUFTLEVBQUUsUUFBZ0I7SUFDbkQsZUFBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVE7SUFDckIsV0FBVyxFQUFFO0FBQ2YsQ0FBQztBQUhELDhCQUdDO0FBRUQsU0FBZ0IsTUFBTSxDQUFDLENBQVM7SUFDOUIsSUFBRyxnQkFBUSxJQUFJLEtBQUs7UUFBRSxPQUFNO0lBQzVCLElBQUcsS0FBSyxJQUFJLENBQUM7UUFBRSxPQUFNO0lBQ3JCLElBQUcsVUFBRSxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUU7UUFDbEIsSUFBSSxHQUFHLENBQUM7UUFDUixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUM7UUFDNUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLO1FBQ3pCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7UUFDbkIsa0JBQVUsR0FBRyxDQUFDLEVBQUMsOEJBQThCO0tBQzlDO0FBQ0gsQ0FBQztBQVZELHdCQVVDOzs7Ozs7Ozs7Ozs7OztBQ3BERCxrQ0FBa0M7QUFDbEMsU0FBZ0IsR0FBRyxDQUFDLEdBQVc7SUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7QUFDbEIsQ0FBQztBQUZELGtCQUVDO0FBRUQsU0FBZ0IsR0FBRyxDQUFDLEdBQVc7SUFDN0IsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNyQixPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBQyxzQkFBc0I7QUFDN0MsQ0FBQztBQUhELGtCQUdDO0FBRUQsU0FBZ0IsR0FBRyxDQUFDLEdBQVc7SUFDN0IsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ3BCLENBQUM7QUFGRCxrQkFFQztBQUNELFNBQWdCLEdBQUcsQ0FBQyxHQUFXO0lBQzdCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsR0FBRyxDQUFDO0FBQ3RDLENBQUM7QUFGRCxrQkFFQztBQUNELFNBQWdCLEdBQUcsQ0FBQyxHQUFXO0lBQzdCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7QUFDdEIsQ0FBQztBQUZELGtCQUVDOzs7Ozs7O1VDbEJEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ3RCQSwrREFBMkI7QUFDM0IseUZBQXlEO0FBQ3pELHNGQUFpRztBQUNqRyxtRkFBbUQ7QUFDbkQsbUZBQXNEO0FBRXRELElBQUksS0FBSyxHQUFXLEdBQUc7QUFDdkIsSUFBSSxLQUFLLEdBQVcsR0FBRztBQUN2QixJQUFJLE1BQU0sR0FBVyxFQUFFO0FBQ3ZCLElBQUksTUFBTSxHQUFXLENBQUM7QUFDdEIsSUFBSSxJQUFJLEdBQVcsR0FBRztBQUN0QixJQUFJLElBQUksR0FBVyxHQUFHO0FBQ3RCLElBQUksS0FBSyxHQUFXLENBQUM7QUFDckIsSUFBSSxLQUFLLEdBQVcsQ0FBQztBQUVyQixNQUFNLE1BQU8sU0FBUSxTQUFHO0lBQ3RCLE1BQU0sS0FBVSxDQUFDO0lBQ2pCLEtBQUs7UUFDSCx1QkFBVSxFQUFDLElBQUksRUFBRSxHQUFHLENBQUM7UUFDckIsb0JBQU8sRUFBQyxDQUFDLEVBQUUsY0FBYyxDQUFDO1FBQzFCLHFCQUFTLEVBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQztJQUM5QixDQUFDO0lBQ0QsUUFBUTtRQUNOLG9CQUFPLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEIsbUJBQU0sRUFBQyxFQUFFLENBQUM7UUFDVixrQkFBSyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUM7UUFDakMsbUJBQU0sRUFBQyxHQUFHLENBQUM7UUFDWCxrQkFBSyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUM7UUFDbEMsaUJBQUksRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUM7UUFDOUIsa0JBQUssRUFBQyxJQUFJLEdBQUMsRUFBRSxFQUFFLElBQUksR0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUM7UUFDMUMsSUFBRyxLQUFLLElBQUksQ0FBQyxFQUFFLEVBQUUsU0FBUztZQUN4QixrQkFBSyxFQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFDMUMsa0JBQUssRUFBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFDOUMsSUFBRyxZQUFJLElBQUksQ0FBQyxFQUFFO2dCQUNaLEtBQUssR0FBRyxHQUFHO2dCQUNYLEtBQUssR0FBRyxHQUFHO2dCQUNYLE1BQU0sR0FBRyxFQUFFO2dCQUNYLE1BQU0sR0FBRyxDQUFDO2dCQUNWLEtBQUssR0FBRyxDQUFDO2dCQUNULEtBQUssR0FBRyxDQUFDO2FBQ1Y7U0FDRjthQUFNLElBQUcsS0FBSyxJQUFJLENBQUMsRUFBRSxFQUFDLE9BQU87WUFDNUIsS0FBSyxHQUFHLEtBQUssR0FBRyxNQUFNO1lBQ3RCLEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTTtZQUN0QixJQUFHLEtBQUssSUFBSSxHQUFHLElBQUksS0FBSyxJQUFJLEdBQUc7Z0JBQUUsTUFBTSxHQUFHLENBQUMsTUFBTTtZQUNqRCxJQUFHLEtBQUssSUFBSSxFQUFFO2dCQUFFLE1BQU0sR0FBRyxDQUFDLEdBQUcsaUJBQUcsRUFBQyxDQUFDLENBQUM7WUFDbkMsSUFBRyxLQUFLLElBQUksR0FBRztnQkFBRSxLQUFLLEdBQUcsQ0FBQztZQUMxQixJQUFJLEdBQUcsWUFBSTtZQUNYLElBQUcsSUFBSSxHQUFHLEdBQUc7Z0JBQUUsSUFBSSxHQUFHLEdBQUc7WUFDekIsSUFBRyxJQUFJLEdBQUcsR0FBRztnQkFBRSxJQUFJLEdBQUcsR0FBRztZQUN6QixJQUFHLElBQUksR0FBQyxFQUFFLEdBQUcsS0FBSyxJQUFJLEtBQUssR0FBRyxJQUFJLEdBQUMsRUFBRSxJQUFJLElBQUksR0FBQyxFQUFFLEdBQUcsS0FBSyxJQUFJLEtBQUssR0FBRyxJQUFJLEdBQUMsRUFBRSxFQUFFO2dCQUMzRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUMsaUJBQUcsRUFBQyxDQUFDLENBQUM7Z0JBQ2xCLEtBQUssSUFBSSxHQUFHO2dCQUNaLGtCQUFNLEVBQUMsQ0FBQyxDQUFDO2FBQ1Y7U0FDRjthQUFNLElBQUcsS0FBSyxJQUFJLENBQUMsRUFBRSxFQUFDLFFBQVE7WUFDN0Isa0JBQUssRUFBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDO1lBQ3ZDLElBQUcsWUFBSSxJQUFJLENBQUMsRUFBQztnQkFDWCxLQUFLLEdBQUcsQ0FBQztnQkFDVCxxQkFBUyxHQUFFO2FBQ1o7U0FDRjtJQUNILENBQUM7Q0FDRjtBQUVELElBQUksTUFBTSxFQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL1dXUy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV1dTbGliL0NhbnZhcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV1dTbGliL0RldmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV1dTbGliL0V2ZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvU291bmQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9VdGlsaXR5LnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbkphdmFTY3JpcHQmSFRNTDUg44Ky44O844Og6ZaL55m655So44K344K544OG44OgXG7plovnmbog44Ov44O844Or44OJ44Ov44Kk44OJ44K944OV44OI44Km44Kn44Ki5pyJ6ZmQ5Lya56S+XG5cbu+8iOS9v+eUqOadoeS7tu+8iVxu5pys44K944O844K544Kz44O844OJ44Gu6JGX5L2c5qip44Gv6ZaL55m65YWD44Gr44GC44KK44G+44GZ44CCXG7liKnnlKjjgZXjgozjgZ/jgYTmlrnjga/jg6Hjg7zjg6vjgavjgabjgYrllY/jgYTlkIjjgo/jgZvkuIvjgZXjgYTjgIJcbnRoQHd3c2Z0LmNvbSDjg6/jg7zjg6vjg4njg6/jgqTjg4njgr3jg5Xjg4jjgqbjgqfjgqIg5buj54CsXG4qL1xuXG5pbXBvcnQgeyBybmQsIGxvZywgaW50LCBzdHIsIGFic30gZnJvbSAnLi9XV1NsaWIvVXRpbGl0eSdcbmltcG9ydCB7IHRvdWNoU3RhcnQsIHRvdWNoTW92ZSwgdG91Y2hFbmQsIHRvdWNoQ2FuY2VsLFxuICAgICAgICBtb3VzZURvd24sIG1vdXNlTW92ZSwgbW91c2VVcCwgbW91c2VPdXQsIHRhcEMsXG4gICAgICAgIG9uS2V5LCBvZmZLZXkgfSBmcm9tIFwiLi9XV1NsaWIvRXZlbnRcIlxuaW1wb3J0IHsgY3ZzLCBpbml0Q2FudmFzLCBDSEVJR0hULCBDV0lEVEgsIGZpbGwsIGZUZXh0LCBmVGV4dE4sIGxpbmVXLCBiYWtILCBiYWtXLCBsaW5lX3dpZHRoIH0gZnJvbSBcIi4vV1dTbGliL0NhbnZhc1wiXG5pbXBvcnQgeyBzZSB9IGZyb20gJy4vV1dTbGliL1NvdW5kJ1xuaW1wb3J0IHsgZGV2aWNlIH0gZnJvbSAnLi9XV1NsaWIvRGV2aWNlJ1xuLy8gLS0tLS0tLS0tLS0tLeWkieaVsC0tLS0tLS0tLS0tLS1cbmV4cG9ydCBjb25zdCAgU1lTX1ZFUiA9IFwiVmVyLjIwMjAxMTExXCJcbmV4cG9ydCBsZXQgIERFQlVHID0gZmFsc2VcblxuXG4vL+WHpueQhuOBrumAsuihjOOCkueuoeeQhuOBmeOCi1xuLy8gbWFpbl9pZHgg44Gu5YCkXG4vLyAgIDA6IOWIneacn+WMllxuLy8gICAxOiDjgrvjg7zjg5bjgafjgY3jgarjgYTorablkYpcbi8vICAgMjog44Oh44Kk44Oz5Yem55CGXG5sZXQgbWFpbl9pZHggPSAwXG5sZXQgbWFpbl90bXIgPSAwXG5sZXQgc3RvcF9mbGcgPSAwIC8vIOODoeOCpOODs+WHpueQhuOBruS4gOaZguWBnOatolxuY29uc3QgTlVBID0gbmF2aWdhdG9yLnVzZXJBZ2VudDsvL+apn+eoruWIpOWumlxuY29uc3Qgc3VwcG9ydFRvdWNoID0gJ29udG91Y2hlbmQnIGluIGRvY3VtZW50Oy8v44K/44OD44OB44Kk44OZ44Oz44OI44GM5L2/44GI44KL44GL77yfXG5cbi8vIOODleODrOODvOODoOODrOODvOODiCBmcmFtZXMgLyBzZWNvbmRcbmxldCAgRlBTID0gMzBcbi8v44Ot44O844Kr44Or44K544OI44Os44O844K4XG5jb25zdCBMU19LRVlOQU1FID0gXCJTQVZFREFUQVwiOy8va2V5TmFtZSDku7vmhI/jgavlpInmm7Tlj69cbi8v5L+d5a2Y44Gn44GN44KL44GL5Yik5a6a44GX44CB44Gn44GN44Gq44GE5aC05ZCI44Gr6K2m5ZGK44KS5Ye644GZ44CA5YW35L2T55qE44Gr44GvIGlPUyBTYWZhcmkg44OX44Op44Kk44OZ44O844OI44OW44Op44Km44K644GMT07vvIjkv53lrZjjgafjgY3jgarjgYTvvInnirbmhYvjgavorablkYrjgpLlh7rjgZlcbmxldCBDSEVDS19MUyA9IGZhbHNlO1xuXG4vLyAtLS0tLS0tLS0tLS0t44Oq44Ki44Or44K/44Kk44Og5Yem55CGLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1NUyB7XG4gIGFic3RyYWN0IHNldHVwKCk6IHZvaWRcbiAgYWJzdHJhY3QgY2xyS2V5KCk6IHZvaWRcbiAgYWJzdHJhY3QgbWFpbmxvb3AoKTogdm9pZFxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCB0aGlzLnd3c1N5c0luaXQuYmluZCh0aGlzKSlcbiAgfVxuXG4gIHd3c1N5c01haW4oKTogdm9pZCB7XG5cbiAgICBsZXQgc3RpbWUgPSBEYXRlLm5vdygpXG5cbiAgICBpZihiYWtXICE9IHdpbmRvdy5pbm5lcldpZHRoIHx8IGJha0ggIT0gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICBpbml0Q2FudmFzKClcbiAgICAgIGxpbmVXKGxpbmVfd2lkdGgpXG4gICAgfVxuXG4gICAgbWFpbl90bXIgKytcblxuICAgIHN3aXRjaChtYWluX2lkeCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICB0aGlzLnNldHVwKClcbiAgICAgICAgbWFpbl9pZHggPSAyXG4gICAgICAgIGlmKENIRUNLX0xTID09IHRydWUpIHtcbiAgICAgICAgICB0cnkge2xvY2FsU3RvcmFnZS5zZXRJdGVtKFwiX3NhdmVfdGVzdFwiLCBcInRlc3RkYXRhXCIpfSBjYXRjaChlKSB7IG1haW5faWR4ID0gMSB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgeCA9IGludChDV0lEVEggLyAyKVxuICAgICAgICBsZXQgeSA9IGludChDSEVJR0hUIC8gNilcbiAgICAgICAgbGV0IGZzID0gaW50KENIRUlHSFQgLyAxNilcbiAgICAgICAgZmlsbChcImJsYWNrXCIpXG4gICAgICAgIGZUZXh0KFwi4oC744K744O844OW44OH44O844K/44GM5L+d5a2Y44GV44KM44G+44Gb44KT4oC7XCIsIHgsIHkvMiwgZnMsIFwieWVsbG93XCIpO1xuICAgICAgICBmVGV4dE4oXCJpT1Pnq6/mnKvjgpLjgYrkvb/jgYTjga7loLTlkIjjga9cXG5TYWZhcmnjga7jg5fjg6njgqTjg5njg7zjg4jjg5bjg6njgqbjgrpcXG7jgpLjgqrjg5XjgavjgZfjgabotbfli5XjgZfjgabkuIvjgZXjgYTjgIJcIiwgeCwgeSoyLCB5LCBmcywgXCJ5ZWxsb3dcIik7XG4gICAgICAgIGZUZXh0TihcIuOBneOBruS7luOBruapn+eoru+8iOODluODqeOCpuOCtu+8ieOBp+OBr1xcbuODreODvOOCq+ODq+OCueODiOODrOODvOOCuOOBuOOBruS/neWtmOOCklxcbuioseWPr+OBmeOCi+ioreWumuOBq+OBl+OBpuS4i+OBleOBhOOAglwiLCB4LCB5KjQsIHksIGZzLCBcInllbGxvd1wiKTtcbiAgICAgICAgZlRleHQoXCLjgZPjga7jgb7jgb7ntprjgZHjgovjgavjga/nlLvpnaLjgpLjgr/jg4Pjg5dcIiwgeCwgeSo1LjUsIGZzLCBcImxpbWVcIik7XG4gICAgICAgIGlmKHRhcEMgIT0gMCkgbWFpbl9pZHggPSAyO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAyOiAvL+ODoeOCpOODs+WHpueQhlxuICAgICAgICBpZihzdG9wX2ZsZyA9PSAwKSB7XG4gICAgICAgICAgdGhpcy5tYWlubG9vcCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jbHJLZXkoKVxuICAgICAgICAgIG1haW5fdG1yLS1cbiAgICAgICAgfVxuICAgICAgICBpZihzZS53YWl0X3NlID4gMCkgc2Uud2FpdF9zZS0tXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OiBicmVha1xuICAgIH1cbiAgICB2YXIgcHRpbWUgPSBEYXRlLm5vdygpIC0gc3RpbWU7XG4gICAgaWYocHRpbWUgPCAwKSBwdGltZSA9IDA7XG4gICAgaWYocHRpbWUgPiBpbnQoMTAwMC9GUFMpKSBwdGltZSA9IGludCgxMDAwL0ZQUyk7XG5cbiAgICBzZXRUaW1lb3V0KHRoaXMud3dzU3lzTWFpbi5iaW5kKHRoaXMpLCBpbnQoMTAwMC9GUFMpLXB0aW1lKTtcbiAgfVxuXG4gIHd3c1N5c0luaXQoKSB7XG4gICAgaW5pdENhbnZhcygpXG4gICAgaWYoIE5VQS5pbmRleE9mKCdBbmRyb2lkJykgPiAwICkge1xuICAgICAgZGV2aWNlLnR5cGUgPSBkZXZpY2UuUFRfQW5kcm9pZDtcbiAgICB9XG4gICAgZWxzZSBpZiggTlVBLmluZGV4T2YoJ2lQaG9uZScpID4gMCB8fCBOVUEuaW5kZXhPZignaVBvZCcpID4gMCB8fCBOVUEuaW5kZXhPZignaVBhZCcpID4gMCApIHtcbiAgICAgIGRldmljZS50eXBlID0gZGV2aWNlLlBUX2lPUztcbiAgICAgIHdpbmRvdy5zY3JvbGxUbygwLDEpOy8vaVBob25l44GuVVJM44OQ44O844KS5raI44GZ5L2N572u44GrXG4gICAgfVxuICAgIGVsc2UgaWYoIE5VQS5pbmRleE9mKCdTaWxrJykgPiAwICkge1xuICAgICAgZGV2aWNlLnR5cGUgPSBkZXZpY2UuUFRfS2luZGxlO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbktleSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBvZmZLZXkpO1xuXG4gICAgaWYoc3VwcG9ydFRvdWNoID09IHRydWUpIHtcbiAgICAgIGN2cy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0b3VjaFN0YXJ0KVxuICAgICAgY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdG91Y2hNb3ZlKVxuICAgICAgY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0b3VjaEVuZClcbiAgICAgIGN2cy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hjYW5jZWxcIiwgdG91Y2hDYW5jZWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIGN2cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlRG93bilcbiAgICAgIGN2cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlTW92ZSlcbiAgICAgIGN2cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZVVwKVxuICAgICAgY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCBtb3VzZU91dClcbiAgICB9XG4gICAgdGhpcy53d3NTeXNNYWluKClcbiAgfVxufVxuXG4iLCJpbXBvcnQge2ludCwgbG9nfSBmcm9tIFwiLi9VdGlsaXR5XCJcblxuLy8gLS0tLS0tLS0tLS0tLeaPj+eUu+mdoijjgq3jg6Pjg7Pjg5DjgrkpLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGxldCAgU09VTkRfT04gPSB0cnVlXG5cbmV4cG9ydCBsZXQgIENXSURUSCA9IDgwMFxuZXhwb3J0IGxldCAgQ0hFSUdIVCA9IDYwMFxuZXhwb3J0IGxldCBTQ0FMRSA9IDEuMCAvLyDjgrnjgrHjg7zjg6vlgKToqK3lrpor44K/44OD44OX5L2N572u6KiI566X55SoXG5cbmV4cG9ydCBjb25zdCBjdnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuZXhwb3J0IGNvbnN0IGJnOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsICA9IGN2cy5nZXRDb250ZXh0KFwiMmRcIilcblxubGV0IHdpblc6IG51bWJlciwgd2luSDogbnVtYmVyXG5leHBvcnQgbGV0IGJha1c6IG51bWJlciwgYmFrSDogbnVtYmVyXG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0Q2FudmFzKCkge1xuICB3aW5XID0gd2luZG93LmlubmVyV2lkdGhcbiAgd2luSCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICBiYWtXID0gd2luV1xuICBiYWtIID0gd2luSFxuXG4gIGlmKCB3aW5IIDwgd2luVyooQ0hFSUdIVC9DV0lEVEgpICkge1xuICAgIHdpblcgPSB3aW5XKihDSEVJR0hUL0NXSURUSClcbiAgfSBlbHNlIHtcbiAgICB3aW5IID0gaW50KENIRUlHSFQgKiB3aW5XL0NXSURUSClcbiAgfVxuICBjdnMud2lkdGggPSB3aW5XXG4gIGN2cy5oZWlnaHQgPSB3aW5IXG4gIFNDQUxFID0gd2luVyAvIENXSURUSFxuICBiZz8uc2NhbGUoU0NBTEUsIFNDQUxFKVxuICBpZihiZykgYmcudGV4dEFsaWduID0gXCJjZW50ZXJcIlxuICBpZihiZykgYmcudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIlxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FudmFzU2l6ZSh3OiBudW1iZXIsIGg6IG51bWJlcikge1xuICBDV0lEVEggPSB3XG4gIENIRUlHSFQgPSBoXG4gIGluaXRDYW52YXMoKVxufVxuXG5cblxuLy8gLS0tLS0tLS0tLS0tLeeUu+WDj+OBruiqreOBv+i+vOOBvy0tLS0tLS0tLS0tLS1cbmNvbnN0IGltZyA9IG5ldyBBcnJheSgyNTYpXG5jb25zdCBpbWdfbG9hZGVkID0gbmV3IEFycmF5KDI1NilcblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRJbWcobjogbnVtYmVyLCBmaWxlbmFtZTogc3RyaW5nKSB7XG4gIGxvZyhcIueUu+WDj1wiICsgbiArIFwiIFwiICsgZmlsZW5hbWUgKyBcIuiqreOBv+i+vOOBv+mWi+Wni1wiKVxuICBpbWdfbG9hZGVkW25dID0gZmFsc2VcbiAgaW1nW25dID0gbmV3IEltYWdlKClcbiAgaW1nW25dLnNyYyA9IGZpbGVuYW1lXG4gIGltZ1tuXS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBsb2coXCLnlLvlg49cIiArIG4gKyBcIiBcIiArIGZpbGVuYW1lICsgXCLoqq3jgb/ovrzjgb/lrozkuoZcIilcbiAgICBpbWdfbG9hZGVkW25dID0gdHJ1ZVxuICB9XG59XG5cblxuXG4vLyAtLS0tLS0tLS0tLS0t5o+P55S7MSDlm7PlvaItLS0tLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gc2V0QWxwKHBhcjogbnVtYmVyKSB7XG4gIGlmIChiZykgYmcuZ2xvYmFsQWxwaGEgPSBwYXIvMTAwXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb2xvclJHQihjcjogbnVtYmVyLCBjZzogbnVtYmVyLCBjYjogbnVtYmVyKSB7XG4gIGNyID0gaW50KGNyKVxuICBjZyA9IGludChjZylcbiAgY2IgPSBpbnQoY2IpXG4gIHJldHVybiAoXCJyZ2IoXCIgKyBjciArIFwiLFwiICsgY2cgKyBcIixcIiArIGNiICsgXCIpXCIpXG59XG5cbmV4cG9ydCBsZXQgbGluZV93aWR0aCA9IDFcblxuZXhwb3J0IGZ1bmN0aW9uIGxpbmVXKHdpZDogbnVtYmVyKSB7IC8v57ea44Gu5aSq44GV5oyH5a6aXG4gIGxpbmVfd2lkdGggPSB3aWQgLy/jg5Djg4Pjgq/jgqLjg4Pjg5dcbiAgaWYoYmcpIGJnLmxpbmVXaWR0aCA9IHdpZFxuICBpZihiZykgYmcubGluZUNhcCA9IFwicm91bmRcIlxuICBpZihiZykgYmcubGluZUpvaW4gPSBcInJvdW5kXCJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpbmUoeDA6IG51bWJlciwgeTA6IG51bWJlciwgeDE6IG51bWJlciwgeTE6IG51bWJlciwgY29sOiBzdHJpbmcpIHtcbiAgaWYoYmcpIGJnLnN0cm9rZVN0eWxlID0gY29sXG4gIGlmKGJnKSBiZy5iZWdpblBhdGgoKVxuICBpZihiZykgYmcubW92ZVRvKHgwLCB5MClcbiAgaWYoYmcpIGJnLmxpbmVUbyh4MSwgeTEpXG4gIGlmKGJnKSBiZy5zdHJva2UoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsbChjb2w6IHN0cmluZykge1xuICBpZihiZykgYmcuZmlsbFN0eWxlID0gY29sXG4gIGlmKGJnKSBiZy5maWxsUmVjdCgwLCAwLCBDV0lEVEgsIENIRUlHSFQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmUmVjdCh4Om51bWJlciwgeTpudW1iZXIsIHc6bnVtYmVyLCBoOm51bWJlcixjb2w6IHN0cmluZykge1xuICBpZiAoYmcgPT0gbnVsbCkgcmV0dXJuXG4gIGJnLnN0cm9rZVN0eWxlID0gY29sXG4gIGJnLmZpbGxSZWN0KHgsIHksIHcsIGgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzUmVjdCh4Om51bWJlciwgeTpudW1iZXIsIHc6bnVtYmVyLCBoOm51bWJlcixjb2w6IHN0cmluZykge1xuICBpZiAoYmcgPT0gbnVsbCkgcmV0dXJuXG4gIGJnLnN0cm9rZVN0eWxlID0gY29sXG4gIGJnLnN0cm9rZVJlY3QoeCwgeSwgdywgaClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZDaXIoeDpudW1iZXIsIHk6bnVtYmVyLCByOm51bWJlcixjb2w6IHN0cmluZykge1xuICBpZiAoYmcgPT0gbnVsbCkgcmV0dXJuXG4gIGJnLmZpbGxTdHlsZSA9IGNvbFxuICBiZy5iZWdpblBhdGgoKVxuICBiZy5hcmMoeCwgeSwgciwgMCwgTWF0aC5QSSoyLCBmYWxzZSlcbiAgYmcuY2xvc2VQYXRoKClcbiAgYmcuZmlsbCgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzQ2lyKHg6bnVtYmVyLCB5Om51bWJlciwgcjpudW1iZXIsY29sOiBzdHJpbmcpIHtcbiAgaWYgKGJnID09IG51bGwpIHJldHVyblxuICBiZy5zdHJva2VTdHlsZSA9IGNvbFxuICBiZy5iZWdpblBhdGgoKVxuICBiZy5hcmMoeCwgeSwgciwgMCwgTWF0aC5QSSoyLCBmYWxzZSlcbiAgYmcuY2xvc2VQYXRoKClcbiAgYmcuc3Ryb2tlKClcbn1cblxuLy8gLS0tLS0tLS0tLS0tLeaPj+eUuzIg55S75YOPLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdJbWcobjogbnVtYmVyLCB4OiBudW1iZXIsIHk6bnVtYmVyKSB7XG4gIGlmIChiZyA9PSBudWxsKSByZXR1cm5cbiAgaWYoaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gIGJnLmRyYXdJbWFnZShpbWdbbl0sIHgsIHkpXG59XG5cbi8vIC0tLS0tLS0tLS0tLS3mj4/nlLszIOaWh+Wtly0tLS0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiBmVGV4dChzdHI6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIsIHNpejogbnVtYmVyLCBjb2w6IHN0cmluZykge1xuICBpZiAoYmcgPT0gbnVsbCkgcmV0dXJuXG4gIGJnLmZvbnQgPSBpbnQoc2l6KSArIFwicHggYm9sZCBtb25vc3BhY2VcIlxuICBiZy5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgYmcuZmlsbFRleHQoc3RyLCB4KzEsIHkrMSlcbiAgYmcuZmlsbFN0eWxlID0gY29sXG4gIGJnLmZpbGxUZXh0KHN0ciwgeCwgeSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZUZXh0TihzdHI6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIsIGg6IG51bWJlciwgc2l6OiBudW1iZXIsIGNvbDogc3RyaW5nKSB7XG4gIGlmIChiZyA9PSBudWxsKSByZXR1cm5cbiAgbGV0IGlcbiAgY29uc3Qgc24gPSBzdHIuc3BsaXQoXCJcXG5cIilcbiAgYmcuZm9udCA9IGludChzaXopICsgXCJweCBib2xkIG1vbm9zcGFjZVwiXG4gIGlmKHNuLmxlbmd0aCA9PSAxKSB7XG4gICAgaCA9IDBcbiAgfSBlbHNlIHtcbiAgICB5ID0geSAtIGludChoLzIpXG4gICAgaCA9IGludChoIC8gKHNuLmxlbmd0aCAtIDEpKVxuICB9XG4gIGZvciggbGV0IGkgPSAwOyBpIDwgc24ubGVuZ3RoOyBpKyspIHtcbiAgICBiZy5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICBiZy5maWxsVGV4dChzdHIsIHgrMSwgeSsxKVxuICAgIGJnLmZpbGxTdHlsZSA9IGNvbFxuICAgIGJnLmZpbGxUZXh0KHN0ciwgeCwgeSlcbiAgfVxufVxuXG5mdW5jdGlvbiBtVGV4dFdpZHRoKHN0cjogc3RyaW5nKSB7XG4gIGlmIChiZyA9PSBudWxsKSByZXR1cm5cbiAgcmV0dXJuIGJnLm1lYXN1cmVUZXh0KHN0cikud2lkdGhcbn1cbiIsIi8v56uv5pyr44Gu56iu6aGeXG5cbmNsYXNzIERldmljZSB7XG4gIHB1YmxpYyBQVF9QQ1x0XHQ9IDA7XG4gIHB1YmxpYyBQVF9pT1NcdFx0PSAxO1xuICBwdWJsaWMgUFRfQW5kcm9pZFx0PSAyO1xuICBwdWJsaWMgUFRfS2luZGxlXHQ9IDM7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3R5cGU6IG51bWJlcikge31cbiAgZ2V0IHR5cGUoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3R5cGU7IH1cbiAgc2V0IHR5cGUodHlwZTogbnVtYmVyKSB7IHRoaXMuX3R5cGUgPSB0eXBlOyB9XG59XG5cbmV4cG9ydCAgY29uc3QgZGV2aWNlXHQ9IG5ldyBEZXZpY2UoMCk7XG4iLCJpbXBvcnQgeyBpbnQgfSBmcm9tIFwiLi9VdGlsaXR5XCI7XG5pbXBvcnQgeyBTQ0FMRSB9IGZyb20gXCIuL0NhbnZhc1wiO1xuaW1wb3J0IHsgZGV2aWNlIH0gZnJvbSBcIi4vRGV2aWNlXCJcbmltcG9ydCB7IGxvYWRTb3VuZFNQaG9uZSwgc2UgfSBmcm9tIFwiLi9Tb3VuZFwiO1xuXG5cbi8vIC0tLS0tLS0tLS0g44K/44OD44OX5YWl5YqbIC0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiB0b3VjaFN0YXJ0KGU6IFRvdWNoRXZlbnQpIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpOy8v44Kt44Oj44Oz44OQ44K544Gu6YG45oqe77yP44K544Kv44Ot44O844Or562J44KS5oqR5Yi244GZ44KLXG4gIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG5cdGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdHRhcFggPSBlLnRvdWNoZXNbMF0uY2xpZW50WC1yZWN0LmxlZnQ7XG5cdHRhcFkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WS1yZWN0LnRvcDtcblx0dGFwQyA9IDE7XG5cdHRyYW5zZm9ybVhZKCk7XG5cdGlmKHNlLnNuZF9pbml0ID09IDApIGxvYWRTb3VuZFNQaG9uZSgpOy8v44CQ6YeN6KaB44CR44K144Km44Oz44OJ44Gu6Kqt44G/6L6844G/XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b3VjaE1vdmUoZTogVG91Y2hFdmVudCkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG5cdGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdHRhcFggPSBlLnRvdWNoZXNbMF0uY2xpZW50WC1yZWN0LmxlZnQ7XG5cdHRhcFkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WS1yZWN0LnRvcDtcblx0dHJhbnNmb3JtWFkoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvdWNoRW5kKGU6IFRvdWNoRXZlbnQpIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR0YXBDID0gMDsvL+KAu+ODnuOCpuOCueaTjeS9nOOBp+OBr21vdXNlT3V044GM44GT44KM44Gr44Gq44KLXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b3VjaENhbmNlbChlOiBUb3VjaEV2ZW50KSB7XG5cdHRhcFggPSAtMTtcblx0dGFwWSA9IC0xO1xuXHR0YXBDID0gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybVhZKCkgey8v5a6f5bqn5qiZ4oaS5Luu5oOz5bqn5qiZ44G444Gu5aSJ5o+bXG5cdHRhcFggPSBpbnQodGFwWC9TQ0FMRSk7XG5cdHRhcFkgPSBpbnQodGFwWS9TQ0FMRSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS3jg57jgqbjgrnlhaXlipstLS0tLS0tLS0tLS0tXG5leHBvcnQgbGV0IHRhcFggPSAwICAvLyByZWFkb25seVxuZXhwb3J0IGxldCB0YXBZID0gMCAgLy8gcmVhZG9ubHlcbmV4cG9ydCBsZXQgdGFwQyA9IDAgIC8vIHJlYWRvbmx5XG5cbmV4cG9ydCBmdW5jdGlvbiB0YXBDQ2xlYXIoKSB7IHRhcEMgPSAwOyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZURvd24oZTogTW91c2VFdmVudCkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7Ly/jgq3jg6Pjg7Pjg5Djgrnjga7pgbjmip7vvI/jgrnjgq/jg63jg7zjg6vnrYnjgpLmipHliLbjgZnjgotcbiAgaWYoISBlLnRhcmdldCkgcmV0dXJuXG4gIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG5cdHZhciByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHR0YXBYID0gZS5jbGllbnRYLXJlY3QubGVmdDtcblx0dGFwWSA9IGUuY2xpZW50WS1yZWN0LnRvcDtcblx0dGFwQyA9IDE7XG5cdHRyYW5zZm9ybVhZKCk7XG5cdGlmKHNlLnNuZF9pbml0ID09IDApIGxvYWRTb3VuZFNQaG9uZSgpOy8v44CQ6YeN6KaB44CR44K144Km44Oz44OJ44Gu6Kqt44G/6L6844G/XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZU1vdmUoZTogTW91c2VFdmVudCkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG4gIGlmKCEgZS50YXJnZXQpIHJldHVyblxuICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuXHRjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHR0YXBYID0gZS5jbGllbnRYLXJlY3QubGVmdDtcblx0dGFwWSA9IGUuY2xpZW50WS1yZWN0LnRvcDtcblx0dHJhbnNmb3JtWFkoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlVXAoZTogTW91c2VFdmVudCkgeyB0YXBDID0gMDsgfVxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlT3V0KGU6IE1vdXNlRXZlbnQpIHsgdGFwQyA9IDA7IH1cblxuXG4vLyAtLS0tLS0tLS0tIOWKoOmAn+W6puOCu+ODs+OCteODvCAtLS0tLS0tLS0tXG52YXIgYWNYID0gMCwgYWNZID0gMCwgYWNaID0gMDtcblxuLy93aW5kb3cub25kZXZpY2Vtb3Rpb24gPSBkZXZpY2VNb3Rpb247Ly/imIXimIXimIXml6dcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlbW90aW9uXCIsIGRldmljZU1vdGlvbik7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXZpY2VNb3Rpb24oZTogRGV2aWNlTW90aW9uRXZlbnQpIHtcblx0dmFyIGFJRzogRGV2aWNlTW90aW9uRXZlbnRBY2NlbGVyYXRpb24gfCBudWxsID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5O1xuICBpZiAoYUlHID09IG51bGwpIHJldHVybjtcblx0aWYoYUlHLngpIGFjWCA9IGludChhSUcueCk7XG5cdGlmKGFJRy55KSBhY1kgPSBpbnQoYUlHLnkpO1xuXHRpZihhSUcueikgYWNaID0gaW50KGFJRy56KTtcblx0aWYoZGV2aWNlLnR5cGUgPT0gZGV2aWNlLlBUX0FuZHJvaWQpIHsvL0FuZHJvaWQg44GoIGlPUyDjgafmraPosqDjgYzpgIbjgavjgarjgotcblx0XHRhY1ggPSAtYWNYO1xuXHRcdGFjWSA9IC1hY1k7XG5cdFx0YWNaID0gLWFjWjtcblx0fVxufVxuXG5cblxuLy/jgq3jg7zlhaXlipvnlKhcbmV4cG9ydCBjb25zdCAgS19FTlRFUiA9IDEzO1xuZXhwb3J0IGNvbnN0ICBLX1NQQUNFID0gMzI7XG5leHBvcnQgY29uc3QgIEtfTEVGVCAgPSAzNztcbmV4cG9ydCBjb25zdCAgS19VUCAgICA9IDM4O1xuZXhwb3J0IGNvbnN0ICBLX1JJR0hUID0gMzk7XG5leHBvcnQgY29uc3QgIEtfRE9XTiAgPSA0MDtcbmV4cG9ydCBjb25zdCAgS19hICAgICA9IDY1O1xuZXhwb3J0IGNvbnN0ICBLX3ogICAgID0gOTA7XG5cbi8vIC0tLS0tLS0tLS0g44Kt44O85YWl5YqbIC0tLS0tLS0tLS1cbnZhciBpbmtleSA9IDA7XG52YXIga2V5ID0gbmV3IEFycmF5KDI1Nik7XG5cbmV4cG9ydCBmdW5jdGlvbiBjbHJLZXkoKSB7XG5cdGlua2V5ID0gMDtcblx0Zm9yKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSBrZXlbaV0gPSAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25LZXkoZTogS2V5Ym9hcmRFdmVudCkge1xuXHRpZihzZS5zbmRfaW5pdCA9PSAwKSBsb2FkU291bmRTUGhvbmUoKTsvL+OAkOmHjeimgeOAkeOCteOCpuODs+ODieOBruiqreOBv+i+vOOBv1xuXHRpbmtleSA9IGUua2V5Q29kZTtcblx0a2V5W2Uua2V5Q29kZV0rKztcbi8vbG9nKGlua2V5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9mZktleShlOiBLZXlib2FyZEV2ZW50KSB7XG5cdGlua2V5ID0gMDtcblx0a2V5W2Uua2V5Q29kZV0gPSAwO1xufVxuIiwiXG4vLyAtLS0tLS0tLS0tLS0t44K144Km44Oz44OJ5Yi25b6hLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGxldCAgU09VTkRfT04gPSB0cnVlXG5cbmNsYXNzIFNFIHtcbiAgX3dhaXRfc2U6IG51bWJlciA9IDBcbiAgX3NuZF9pbml0OiBudW1iZXIgPSAwXG4gIGdldCB3YWl0X3NlKCkgeyByZXR1cm4gdGhpcy5fd2FpdF9zZSB9XG4gIHNldCB3YWl0X3NlKHdhaXRfc2U6IG51bWJlcikgeyB0aGlzLl93YWl0X3NlID0gd2FpdF9zZSB9XG5cbiAgLy/jgrXjgqbjg7Pjg4njg5XjgqHjgqTjg6vjgpLoqq3jgb/ovrzjgpPjgaDjgYso44K544Oe44Ob5a++562WKVxuICBnZXQgc25kX2luaXQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3NuZF9pbml0IH1cbiAgc2V0IHNuZF9pbml0KHZhbDogbnVtYmVyKSB7IHRoaXMuX3NuZF9pbml0ID0gdmFsIH1cblxufVxuXG5leHBvcnQgY29uc3Qgc2UgPSBuZXcgU0UoKVxuXG5jb25zdCBzb3VuZEZpbGUgPSBuZXcgQXJyYXkoMjU2KVxubGV0IGlzQmdtID0gLTFcbmxldCBiZ21ObyA9IDBcbmxldCBzZU5vID0gLTFcblxubGV0IHNvdW5kbG9hZGVkID0gMCAvL+OBhOOBj+OBpOODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCk+OBoOOBi1xuZXhwb3J0IGNvbnN0IHNmX25hbWUgPSBuZXcgQXJyYXkoMjU2KVxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZFNvdW5kU1Bob25lKCkgey8v44K544Oe44Ob44Gn44OV44Kh44Kk44Or44KS6Kqt44G/6L6844KAXG4gIHRyeSB7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHNvdW5kbG9hZGVkOyBpKyspIHtcbiAgICAgIHNvdW5kRmlsZVtpXSA9IG5ldyBBdWRpbyhzZl9uYW1lW2ldKVxuICAgICAgc291bmRGaWxlW2ldLmxvYWQoKVxuICAgIH1cbiAgfSBjYXRjaChlKSB7XG4gIH1cbiAgc2Uuc25kX2luaXQgPSAyIC8v44K544Oe44Ob44Gn44OV44Kh44Kk44Or44KS6Kqt44G/6L6844KT44GgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkU291bmQobjogbnVtYmVyLCBmaWxlbmFtZTogc3RyaW5nKSB7XG4gIHNmX25hbWVbbl0gPSBmaWxlbmFtZVxuICBzb3VuZGxvYWRlZCsrXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGF5U0UobjogbnVtYmVyKSB7XG4gIGlmKFNPVU5EX09OID09IGZhbHNlKSByZXR1cm5cbiAgaWYoaXNCZ20gPT0gMikgcmV0dXJuXG4gIGlmKHNlLndhaXRfc2UgPT0gMCkge1xuICAgIHNlTm8gPSBuXG4gICAgc291bmRGaWxlW25dLmN1cnJlbnRUaW1lID0gMFxuICAgIHNvdW5kRmlsZVtuXS5sb29wID0gZmFsc2VcbiAgICBzb3VuZEZpbGVbbl0ucGxheSgpXG4gICAgc2Uud2FpdF9zZSA9IDMgLy/jg5bjg6njgqbjgrbjgavosqDojbfjgpLjgYvjgZHjgarjgYTjgojjgYbjgavpgKPntprjgZfjgabmtYHjgZXjgarjgYTjgojjgYbjgavjgZnjgotcbiAgfVxufVxuIiwiLy8gLS0tLS0tLS0tLS0tLeWQhOeoruOBrumWouaVsC0tLS0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiBsb2cobXNnOiBzdHJpbmcpIHtcbiAgY29uc29sZS5sb2cobXNnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW50KHZhbDogbnVtYmVyKTogbnVtYmVyIHtcbiAgbGV0IG51bSA9IFN0cmluZyh2YWwpXG4gIHJldHVybiBwYXJzZUludChudW0pIC8v44OX44Op44K544Oe44Kk44OK44K544Gp44Gh44KJ44KC5bCP5pWw6YOo5YiG44KS5YiH44KK5o2o44GmXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHIodmFsOiBudW1iZXIpOiBzdHJpbmcge1xuICByZXR1cm4gU3RyaW5nKHZhbClcbn1cbmV4cG9ydCBmdW5jdGlvbiBybmQobWF4OiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKm1heClcbn1cbmV4cG9ydCBmdW5jdGlvbiBhYnModmFsOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5hYnModmFsKVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IE1NUyB9IGZyb20gJy4vV1dTJ1xuaW1wb3J0IHsgcm5kLCBsb2csIGludCwgc3RyLCBhYnN9IGZyb20gJy4vV1dTbGliL1V0aWxpdHknXG5pbXBvcnQgeyBjYW52YXNTaXplLCBkcmF3SW1nLCBmUmVjdCwgbG9hZEltZywgc0Npciwgc2V0QWxwLCBzUmVjdCwgZlRleHQgfSBmcm9tICcuL1dXU2xpYi9DYW52YXMnXG5pbXBvcnQgeyBsb2FkU291bmQsIHBsYXlTRSB9IGZyb20gICcuL1dXU2xpYi9Tb3VuZCdcbmltcG9ydCB7IHRhcFgsIHRhcEMsIHRhcENDbGVhciB9IGZyb20gJy4vV1dTbGliL0V2ZW50J1xuXG5sZXQgYmFsbFg6IG51bWJlciA9IDYwMFxubGV0IGJhbGxZOiBudW1iZXIgPSAzMDBcbmxldCBiYWxsWHA6IG51bWJlciA9IDEwXG5sZXQgYmFsbFlwOiBudW1iZXIgPSAzXG5sZXQgYmFyWDogbnVtYmVyID0gNjAwXG5sZXQgYmFyWTogbnVtYmVyID0gNzAwXG5sZXQgc2NvcmU6IG51bWJlciA9IDBcbmxldCBzY2VuZTogbnVtYmVyID0gMFxuXG5jbGFzcyBNeUdhbWUgZXh0ZW5kcyBNTVMge1xuICBjbHJLZXkoKTogdm9pZCB7fVxuICBzZXR1cCgpOiB2b2lkIHtcbiAgICBjYW52YXNTaXplKDEyMDAsIDgwMClcbiAgICBsb2FkSW1nKDAsICdpbWFnZS9iZy5wbmcnKVxuICAgIGxvYWRTb3VuZCgwLCBcInNvdW5kL3NlLm00YVwiKVxuICB9XG4gIG1haW5sb29wKCk6IHZvaWQge1xuICAgIGRyYXdJbWcoMCwgMCwgMClcbiAgICBzZXRBbHAoNTApXG4gICAgZlJlY3QoMjUwLCA1MCwgNzAwLCA3NTAsIFwiYmxhY2tcIilcbiAgICBzZXRBbHAoMTAwKVxuICAgIHNSZWN0KDI1MCwgNTAsIDcwMCwgNzYwLCBcInNpbHZlclwiKVxuICAgIHNDaXIoYmFsbFgsIGJhbGxZLCAxMCwgXCJsaW1lXCIpXG4gICAgc1JlY3QoYmFyWC01MCwgYmFyWS0xMCwgMTAwLCAyMCwgXCJ2aW9sZXRcIilcbiAgICBpZihzY2VuZSA9PSAwKSB7IC8vIOOCsuODvOODoOmWi+Wni+WJjVxuICAgICAgZlRleHQoXCJTcXVhc2ggR2FtZVwiLCA2MDAsIDIwMCwgNDgsIFwiY3lhblwiKVxuICAgICAgZlRleHQoXCJDbGljayB0byBzdGFydCFcIiwgNjAwLCA2MDAsIDM2LCBcImdvbGRcIilcbiAgICAgIGlmKHRhcEMgPT0gMSkge1xuICAgICAgICBiYWxsWCA9IDYwMFxuICAgICAgICBiYWxsWSA9IDMwMFxuICAgICAgICBiYWxsWHAgPSAxMlxuICAgICAgICBiYWxsWXAgPSA4XG4gICAgICAgIHNjb3JlID0gMFxuICAgICAgICBzY2VuZSA9IDFcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoc2NlbmUgPT0gMSkgey8vIOOCsuODvOODoOS4rVxuICAgICAgYmFsbFggPSBiYWxsWCArIGJhbGxYcFxuICAgICAgYmFsbFkgPSBiYWxsWSArIGJhbGxZcFxuICAgICAgaWYoYmFsbFggPD0gMjYwIHx8IGJhbGxYID49IDk0MCkgYmFsbFhwID0gLWJhbGxYcFxuICAgICAgaWYoYmFsbFkgPD0gNjApIGJhbGxZcCA9IDggKyBybmQoOClcbiAgICAgIGlmKGJhbGxZID49IDgwMCkgc2NlbmUgPSAyXG4gICAgICBiYXJYID0gdGFwWFxuICAgICAgaWYoYmFyWCA8IDMwMCkgYmFyWCA9IDMwMFxuICAgICAgaWYoYmFyWCA+IDkwMCkgYmFyWCA9IDkwMFxuICAgICAgaWYoYmFyWC02MCA8IGJhbGxYICYmIGJhbGxYIDwgYmFyWCs2MCAmJiBiYXJZLTMwIDwgYmFsbFkgJiYgYmFsbFkgPCBiYXJZLTEwKSB7XG4gICAgICAgIGJhbGxZcCA9IC04LXJuZCg4KVxuICAgICAgICBzY29yZSArPSAxMDBcbiAgICAgICAgcGxheVNFKDApXG4gICAgICB9XG4gICAgfSBlbHNlIGlmKHNjZW5lID09IDIpIHsvLyDjgrLjg7zjg6DntYLkuoZcbiAgICAgIGZUZXh0KFwiR2FtZSBPdmVyXCIsIDYwMCwgNDAwLCAzNiwgXCJyZWRcIilcbiAgICAgIGlmKHRhcEMgPT0gMSl7XG4gICAgICAgIHNjZW5lID0gMFxuICAgICAgICB0YXBDQ2xlYXIoKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5uZXcgTXlHYW1lKClcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==