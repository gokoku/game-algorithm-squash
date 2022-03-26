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
        //ブラウザのサイズが変化したか？（スマホなら持ち方を変えたか　縦持ち⇔横持ち）
        if (this.canvas.bakW != window.innerWidth || this.canvas.bakH != window.innerHeight) {
            this.canvas.initCanvas();
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
        if (winH < (winW * exports.CHEIGHT / exports.CWIDTH)) {
            //winW を比率に合わせて調整
            winW = (0, Utility_1.int)(winH * exports.CWIDTH / exports.CHEIGHT);
        }
        else {
            //winH を比率に合わせて調整
            winH = (0, Utility_1.int)(winW * exports.CHEIGHT / exports.CWIDTH);
        }
        this.cvs.width = winW;
        this.cvs.height = winH;
        exports.SCALE = winW / exports.CWIDTH;
        if (this.bg == null)
            return;
        this.bg.scale(exports.SCALE, exports.SCALE);
        this.bg.textAlign = "center";
        this.bg.textBaseline = "middle";
        (0, Utility_1.log)(`width: ${winW} height:${winH} scale:${exports.SCALE}`);
        (0, Utility_1.log)(`inner width: ${window.innerWidth} inner height:${window.innerHeight}`);
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
        //log("画像" + n + " " + filename + "読み込み開始")
        this.img_loaded[n] = false;
        this.img[n] = new Image();
        this.img[n].src = filename;
        this.img[n].onload = () => {
            //log("画像" + n + " " + filename + "読み込み完了")
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
const Canvas_1 = __webpack_require__(/*! ./Canvas */ "./src/WWSlib/Canvas.ts");
const Device_1 = __webpack_require__(/*! ./Device */ "./src/WWSlib/Device.ts");
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
        this.inkey = 0;
        this.key = new Array(256);
        this._se = se;
    }
    clr() {
        this.inkey = 0;
        for (var i = 0; i < 256; i++)
            this.key[i] = 0;
    }
    on(e) {
        //log( `${e.key} : ${e.code} : ${e.keyCode} : ${codeToStr(e.code)}` )
        if (this._se.snd_init == 0)
            this._se.loadSoundSPhone(); //【重要】サウンドの読み込み
        this.inkey = (0, Utility_1.codeToStr)(e.code);
        this.key[(0, Utility_1.codeToStr)(e.code)]++;
    }
    off(e) {
        this.inkey = 0;
        this.key[(0, Utility_1.codeToStr)(e.code)] = 0;
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
exports.KEY_NAME = exports.codeToStr = exports.abs = exports.rnd = exports.str = exports.int = exports.log = void 0;
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
// ---------- キー入力キーのマッピング(keyCode が非推奨のため) ----------
function codeToStr(code) {
    let charCode = 0;
    switch (code) {
        case "KeyA":
            charCode = 65;
            break;
        case "KeyB":
            charCode = 66;
            break;
        case "KeyC":
            charCode = 67;
            break;
        case "KeyD":
            charCode = 68;
            break;
        case "KeyE":
            charCode = 69;
            break;
        case "KeyF":
            charCode = 70;
            break;
        case "KeyG":
            charCode = 71;
            break;
        case "KeyH":
            charCode = 72;
            break;
        case "KeyI":
            charCode = 73;
            break;
        case "KeyJ":
            charCode = 74;
            break;
        case "KeyK":
            charCode = 75;
            break;
        case "KeyL":
            charCode = 76;
            break;
        case "KeyM":
            charCode = 77;
            break;
        case "KeyN":
            charCode = 78;
            break;
        case "KeyO":
            charCode = 79;
            break;
        case "KeyP":
            charCode = 80;
            break;
        case "KeyQ":
            charCode = 81;
            break;
        case "KeyR":
            charCode = 82;
            break;
        case "KeyS":
            charCode = 83;
            break;
        case "KeyT":
            charCode = 84;
            break;
        case "KeyU":
            charCode = 85;
            break;
        case "KeyV":
            charCode = 86;
            break;
        case "KeyW":
            charCode = 87;
            break;
        case "KeyX":
            charCode = 88;
            break;
        case "KeyY":
            charCode = 89;
            break;
        case "KeyZ":
            charCode = 90;
            break;
        case "Space":
            charCode = 32;
            break;
        case "ArrowLeft":
            charCode = 37;
            break;
        case "ArrowUp":
            charCode = 38;
            break;
        case "ArrowRight":
            charCode = 39;
            break;
        case "ArrowDown":
            charCode = 40;
            break;
    }
    return charCode;
}
exports.codeToStr = codeToStr;
exports.KEY_NAME = {
    "ENTER": 13,
    "SPACE": 32,
    "LEFT": 37,
    "UP": 38,
    "RIGHT": 39,
    "DOWN": 40,
    "a": 65,
    "z": 90
};


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
class MyGame extends WWS_1.MMS {
    constructor() {
        super();
        this.bgX = 0;
        this.ssX = 0;
        this.ssY = 0;
    }
    clrKey() { }
    setup() {
        this.canvas.canvasSize(1200, 720);
        this.draw.loadImg(0, "image2/bg.png");
        this.draw.loadImg(1, "image2/spaceship.png");
        this.initSShip();
    }
    mainloop() {
        this.drawBG(1);
        this.moveSShip();
    }
    drawBG(speed) {
        this.bgX = (this.bgX + speed) % 1200;
        this.draw.drawImg(0, -this.bgX, 0);
        this.draw.drawImg(0, 1200 - this.bgX, 0);
    }
    initSShip() {
        this.ssX = 400;
        this.ssY = 360;
    }
    moveSShip() {
        if (this.key.key[Utility_1.KEY_NAME.LEFT] > 0 && this.ssX > 60)
            this.ssX -= 20;
        if (this.key.key[Utility_1.KEY_NAME.RIGHT] > 0 && this.ssX < 1000)
            this.ssX += 20;
        if (this.key.key[Utility_1.KEY_NAME.UP] > 0 && this.ssY > 40)
            this.ssY -= 20;
        if (this.key.key[Utility_1.KEY_NAME.DOWN] > 0 && this.ssY < 680)
            this.ssY += 20;
        this.draw.drawImgC(1, this.ssX, this.ssY);
    }
}
new MyGame();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxR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QUMsR0FBRyxJQUFJLEVBQUU7UUFDdEUsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUU7WUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7UUFDakUsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUc7WUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7UUFFcEUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUMzQyxDQUFDO0NBQ0Y7QUFJRCxJQUFJLE1BQU0sRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9XV1MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9DYW52YXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9EZXZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9EcmF3LnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvRXZlbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9Tb3VuZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV1dTbGliL1V0aWxpdHkudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuSmF2YVNjcmlwdCZIVE1MNSDjgrLjg7zjg6DplovnmbrnlKjjgrfjgrnjg4bjg6BcbumWi+eZuiDjg6/jg7zjg6vjg4njg6/jgqTjg4njgr3jg5Xjg4jjgqbjgqfjgqLmnInpmZDkvJrnpL5cblxu77yI5L2/55So5p2h5Lu277yJXG7mnKzjgr3jg7zjgrnjgrPjg7zjg4njga7okZfkvZzmqKnjga/plovnmbrlhYPjgavjgYLjgorjgb7jgZnjgIJcbuWIqeeUqOOBleOCjOOBn+OBhOaWueOBr+ODoeODvOODq+OBq+OBpuOBiuWVj+OBhOWQiOOCj+OBm+S4i+OBleOBhOOAglxudGhAd3dzZnQuY29tIOODr+ODvOODq+ODieODr+OCpOODieOCveODleODiOOCpuOCp+OCoiDlu6PngKxcbiovXG5cbmltcG9ydCB7IGludCwgbG9nIH0gZnJvbSAnLi9XV1NsaWIvVXRpbGl0eSdcbmltcG9ydCB7IFRvdWNoLCBNb3VzZSwgS2V5IH0gZnJvbSBcIi4vV1dTbGliL0V2ZW50XCJcbmltcG9ydCB7IENXSURUSCwgQ0hFSUdIVCwgQ2FudmFzIH0gZnJvbSBcIi4vV1dTbGliL0NhbnZhc1wiXG5pbXBvcnQgeyBEcmF3IH0gZnJvbSBcIi4vV1dTbGliL0RyYXdcIlxuaW1wb3J0IHsgU0UgfSBmcm9tICcuL1dXU2xpYi9Tb3VuZCdcbmltcG9ydCB7IERldmljZSwgUFRfQW5kcm9pZCwgUFRfaU9TLCBQVF9LaW5kbGUgfSBmcm9tICcuL1dXU2xpYi9EZXZpY2UnXG4vLyAtLS0tLS0tLS0tLS0t5aSJ5pWwLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGNvbnN0ICBTWVNfVkVSID0gXCJWZXIuMjAyMDExMTFcIlxuZXhwb3J0IGxldCAgREVCVUcgPSBmYWxzZVxuXG5cbi8v5Yem55CG44Gu6YCy6KGM44KS566h55CG44GZ44KLXG4vLyBtYWluX2lkeCDjga7lgKRcbi8vICAgMDog5Yid5pyf5YyWXG4vLyAgIDE6IOOCu+ODvOODluOBp+OBjeOBquOBhOitpuWRilxuLy8gICAyOiDjg6HjgqTjg7Plh6bnkIZcbmxldCBtYWluX2lkeCA9IDBcbmxldCBtYWluX3RtciA9IDBcbmxldCBzdG9wX2ZsZyA9IDAgLy8g44Oh44Kk44Oz5Yem55CG44Gu5LiA5pmC5YGc5q2iXG5jb25zdCBOVUEgPSBuYXZpZ2F0b3IudXNlckFnZW50Oy8v5qmf56iu5Yik5a6aXG5jb25zdCBzdXBwb3J0VG91Y2ggPSAnb250b3VjaGVuZCcgaW4gZG9jdW1lbnQ7Ly/jgr/jg4Pjg4HjgqTjg5njg7Pjg4jjgYzkvb/jgYjjgovjgYvvvJ9cblxuLy8g44OV44Os44O844Og44Os44O844OIIGZyYW1lcyAvIHNlY29uZFxubGV0ICBGUFMgPSAzMFxuLy/jg63jg7zjgqvjg6vjgrnjg4jjg6zjg7zjgrhcbmNvbnN0IExTX0tFWU5BTUUgPSBcIlNBVkVEQVRBXCI7Ly9rZXlOYW1lIOS7u+aEj+OBq+WkieabtOWPr1xuLy/kv53lrZjjgafjgY3jgovjgYvliKTlrprjgZfjgIHjgafjgY3jgarjgYTloLTlkIjjgavorablkYrjgpLlh7rjgZnjgIDlhbfkvZPnmoTjgavjga8gaU9TIFNhZmFyaSDjg5fjg6njgqTjg5njg7zjg4jjg5bjg6njgqbjgrrjgYxPTu+8iOS/neWtmOOBp+OBjeOBquOBhO+8ieeKtuaFi+OBq+itpuWRiuOCkuWHuuOBmVxubGV0IENIRUNLX0xTID0gZmFsc2U7XG5cbi8vIC0tLS0tLS0tLS0tLS3jg6rjgqLjg6vjgr/jgqTjg6Dlh6bnkIYtLS0tLS0tLS0tLS0tXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTU1TIHtcbiAgYWJzdHJhY3Qgc2V0dXAoKTogdm9pZFxuICBhYnN0cmFjdCBjbHJLZXkoKTogdm9pZFxuICBhYnN0cmFjdCBtYWlubG9vcCgpOiB2b2lkXG5cbiAgcHVibGljIGNhbnZhczogQ2FudmFzXG4gIHB1YmxpYyBkcmF3OiBEcmF3XG4gIHB1YmxpYyBtb3VzZTogTW91c2VcbiAgcHVibGljIHRvdWNoOiBUb3VjaFxuICBwdWJsaWMga2V5OiBLZXlcbiAgcHVibGljIHNlOiBTRVxuICBwdWJsaWMgZGV2aWNlOiBEZXZpY2VcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgdGhpcy53d3NTeXNJbml0LmJpbmQodGhpcykpXG4gICAgdGhpcy5jYW52YXMgPSBuZXcgQ2FudmFzKClcbiAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpXG4gICAgdGhpcy5zZSA9IG5ldyBTRSgpXG4gICAgdGhpcy5tb3VzZSA9IG5ldyBNb3VzZSh0aGlzLnNlKVxuICAgIHRoaXMudG91Y2ggPSBuZXcgVG91Y2godGhpcy5zZSlcbiAgICB0aGlzLmtleSA9IG5ldyBLZXkodGhpcy5zZSlcbiAgICB0aGlzLmRldmljZSA9IG5ldyBEZXZpY2UoKVxuICB9XG5cbiAgd3dzU3lzTWFpbigpOiB2b2lkIHtcblxuICAgIGxldCBzdGltZSA9IERhdGUubm93KClcbiAgICAvL+ODluODqeOCpuOCtuOBruOCteOCpOOCuuOBjOWkieWMluOBl+OBn+OBi++8n++8iOOCueODnuODm+OBquOCieaMgeOBoeaWueOCkuWkieOBiOOBn+OBi+OAgOe4puaMgeOBoeKHlOaoquaMgeOBoe+8iVxuICAgIGlmKHRoaXMuY2FudmFzLmJha1cgIT0gd2luZG93LmlubmVyV2lkdGggfHwgdGhpcy5jYW52YXMuYmFrSCAhPSB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIHRoaXMuY2FudmFzLmluaXRDYW52YXMoKVxuICAgICAgbG9nKFwiY2FudmFzIHNpemUgY2hhbmdlZCBcIiArIHRoaXMuY2FudmFzLmJha1cgKyBcInhcIiArIHRoaXMuY2FudmFzLmJha0gpO1xuICAgIH1cblxuICAgIG1haW5fdG1yICsrXG5cbiAgICBzd2l0Y2gobWFpbl9pZHgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgdGhpcy5zZXR1cCgpXG4gICAgICAgIG1haW5faWR4ID0gMlxuICAgICAgICBpZihDSEVDS19MUyA9PSB0cnVlKSB7XG4gICAgICAgICAgdHJ5IHtsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIl9zYXZlX3Rlc3RcIiwgXCJ0ZXN0ZGF0YVwiKX0gY2F0Y2goZSkgeyBtYWluX2lkeCA9IDEgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IHggPSBpbnQoQ1dJRFRIIC8gMilcbiAgICAgICAgbGV0IHkgPSBpbnQoQ0hFSUdIVCAvIDYpXG4gICAgICAgIGxldCBmcyA9IGludChDSEVJR0hUIC8gMTYpXG4gICAgICAgIHRoaXMuZHJhdy5maWxsKFwiYmxhY2tcIilcbiAgICAgICAgdGhpcy5kcmF3LmZUZXh0KFwi4oC744K744O844OW44OH44O844K/44GM5L+d5a2Y44GV44KM44G+44Gb44KT4oC7XCIsIHgsIHkvMiwgZnMsIFwieWVsbG93XCIpO1xuICAgICAgICB0aGlzLmRyYXcuZlRleHROKFwiaU9T56uv5pyr44KS44GK5L2/44GE44Gu5aC05ZCI44GvXFxuU2FmYXJp44Gu44OX44Op44Kk44OZ44O844OI44OW44Op44Km44K6XFxu44KS44Kq44OV44Gr44GX44Gm6LW35YuV44GX44Gm5LiL44GV44GE44CCXCIsIHgsIHkqMiwgeSwgZnMsIFwieWVsbG93XCIpO1xuICAgICAgICB0aGlzLmRyYXcuZlRleHROKFwi44Gd44Gu5LuW44Gu5qmf56iu77yI44OW44Op44Km44K277yJ44Gn44GvXFxu44Ot44O844Kr44Or44K544OI44Os44O844K444G444Gu5L+d5a2Y44KSXFxu6Kix5Y+v44GZ44KL6Kit5a6a44Gr44GX44Gm5LiL44GV44GE44CCXCIsIHgsIHkqNCwgeSwgZnMsIFwieWVsbG93XCIpO1xuICAgICAgICB0aGlzLmRyYXcuZlRleHQoXCLjgZPjga7jgb7jgb7ntprjgZHjgovjgavjga/nlLvpnaLjgpLjgr/jg4Pjg5dcIiwgeCwgeSo1LjUsIGZzLCBcImxpbWVcIik7XG4gICAgICAgIGlmKHRoaXMubW91c2UudGFwQyAhPSAwKSBtYWluX2lkeCA9IDI7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDI6IC8v44Oh44Kk44Oz5Yem55CGXG4gICAgICAgIGlmKHN0b3BfZmxnID09IDApIHtcbiAgICAgICAgICB0aGlzLm1haW5sb29wKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNscktleSgpXG4gICAgICAgICAgbWFpbl90bXItLVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuc2Uud2FpdF9zZSA+IDApIHRoaXMuc2Uud2FpdF9zZS0tXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OiBicmVha1xuICAgIH1cbiAgICB2YXIgcHRpbWUgPSBEYXRlLm5vdygpIC0gc3RpbWU7XG4gICAgaWYocHRpbWUgPCAwKSBwdGltZSA9IDA7XG4gICAgaWYocHRpbWUgPiBpbnQoMTAwMC9GUFMpKSBwdGltZSA9IGludCgxMDAwL0ZQUyk7XG5cbiAgICBzZXRUaW1lb3V0KHRoaXMud3dzU3lzTWFpbi5iaW5kKHRoaXMpLCBpbnQoMTAwMC9GUFMpLXB0aW1lKTtcbiAgfVxuXG4gIHd3c1N5c0luaXQoKSB7XG4gICAgdGhpcy5jYW52YXMuaW5pdENhbnZhcygpXG4gICAgaWYoIE5VQS5pbmRleE9mKCdBbmRyb2lkJykgPiAwICkge1xuICAgICAgdGhpcy5kZXZpY2UudHlwZSA9IFBUX0FuZHJvaWQ7XG4gICAgfVxuICAgIGVsc2UgaWYoIE5VQS5pbmRleE9mKCdpUGhvbmUnKSA+IDAgfHwgTlVBLmluZGV4T2YoJ2lQb2QnKSA+IDAgfHwgTlVBLmluZGV4T2YoJ2lQYWQnKSA+IDAgKSB7XG4gICAgICB0aGlzLmRldmljZS50eXBlID0gUFRfaU9TO1xuICAgICAgd2luZG93LnNjcm9sbFRvKDAsMSk7Ly9pUGhvbmXjga5VUkzjg5Djg7zjgpLmtojjgZnkvY3nva7jgatcbiAgICB9XG4gICAgZWxzZSBpZiggTlVBLmluZGV4T2YoJ1NpbGsnKSA+IDAgKSB7XG4gICAgICB0aGlzLmRldmljZS50eXBlID0gUFRfS2luZGxlO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmtleS5vbi5iaW5kKHRoaXMua2V5KSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMua2V5Lm9mZi5iaW5kKHRoaXMua2V5KSlcblxuICAgIGlmKHN1cHBvcnRUb3VjaCA9PSB0cnVlKSB7XG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy50b3VjaC5zdGFydC5iaW5kKHRoaXMudG91Y2gpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy50b3VjaC5tb3ZlLmJpbmQodGhpcy50b3VjaCkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMudG91Y2guZW5kLmJpbmQodGhpcy50b3VjaCkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsIHRoaXMudG91Y2guY2FuY2VsLmJpbmQodGhpcy50b3VjaCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMubW91c2UuZG93bi5iaW5kKHRoaXMubW91c2UpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5tb3VzZS5tb3ZlLmJpbmQodGhpcy5tb3VzZSkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5tb3VzZS51cC5iaW5kKHRoaXMubW91c2UpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCB0aGlzLm1vdXNlLm91dC5iaW5kKHRoaXMubW91c2UpKVxuICAgIH1cbiAgICB0aGlzLnd3c1N5c01haW4oKVxuICB9XG59XG4iLCJpbXBvcnQge2ludCwgbG9nfSBmcm9tIFwiLi9VdGlsaXR5XCJcblxuLy8gLS0tLS0tLS0tLS0tLeaPj+eUu+mdoijjgq3jg6Pjg7Pjg5DjgrkpLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGxldCBDV0lEVEggPSA4MDBcbmV4cG9ydCBsZXQgQ0hFSUdIVCA9IDYwMFxuZXhwb3J0IGxldCBTQ0FMRSA9IDEuMCAvLyDjgrnjgrHjg7zjg6vlgKToqK3lrpor44K/44OD44OX5L2N572u6KiI566X55SoXG5leHBvcnQgY2xhc3MgQ2FudmFzIHtcblxuICBwdWJsaWMgY3ZzOiBIVE1MQ2FudmFzRWxlbWVudFxuICBwdWJsaWMgYmc6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGxcbiAgcHVibGljIGJha1c6IG51bWJlclxuICBwdWJsaWMgYmFrSDogbnVtYmVyXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jdnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuICAgIHRoaXMuYmcgPSB0aGlzLmN2cy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICB0aGlzLmJha1cgPSAwXG4gICAgdGhpcy5iYWtIID0gMFxuICB9XG4gIGluaXRDYW52YXMoKSB7XG4gICAgbGV0IHdpblcgPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIGxldCB3aW5IID0gd2luZG93LmlubmVySGVpZ2h0XG4gICAgdGhpcy5iYWtXID0gd2luV1xuICAgIHRoaXMuYmFrSCA9IHdpbkhcblxuICAgIGlmKCB3aW5IIDwgKHdpblcgKiBDSEVJR0hUIC8gQ1dJRFRIKSApIHtcbiAgICAgIC8vd2luVyDjgpLmr5TnjofjgavlkIjjgo/jgZvjgaboqr/mlbRcbiAgICAgIHdpblcgPSBpbnQod2luSCAqIENXSURUSCAvIENIRUlHSFQpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vd2luSCDjgpLmr5TnjofjgavlkIjjgo/jgZvjgaboqr/mlbRcbiAgICAgIHdpbkggPSBpbnQod2luVyAqIENIRUlHSFQgLyBDV0lEVEgpXG4gICAgfVxuXG4gICAgdGhpcy5jdnMud2lkdGggPSB3aW5XXG4gICAgdGhpcy5jdnMuaGVpZ2h0ID0gd2luSFxuICAgIFNDQUxFID0gd2luVyAvIENXSURUSFxuXG4gICAgaWYodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLnNjYWxlKFNDQUxFLCBTQ0FMRSlcbiAgICB0aGlzLmJnLnRleHRBbGlnbiA9IFwiY2VudGVyXCJcbiAgICB0aGlzLmJnLnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCJcblxuICAgIGxvZyhgd2lkdGg6ICR7d2luV30gaGVpZ2h0OiR7d2luSH0gc2NhbGU6JHtTQ0FMRX1gKVxuICAgIGxvZyhgaW5uZXIgd2lkdGg6ICR7d2luZG93LmlubmVyV2lkdGh9IGlubmVyIGhlaWdodDoke3dpbmRvdy5pbm5lckhlaWdodH1gKVxuICB9XG5cbiAgY2FudmFzU2l6ZSh3OiBudW1iZXIsIGg6IG51bWJlcikge1xuICAgIENXSURUSCA9IHdcbiAgICBDSEVJR0hUID0gaFxuICAgIHRoaXMuaW5pdENhbnZhcygpXG4gIH1cbn1cbiIsIi8v56uv5pyr44Gu56iu6aGeXG5leHBvcnQgbGV0IFBUX1BDXHRcdD0gMDtcbmV4cG9ydCBsZXQgUFRfaU9TXHRcdD0gMTtcbmV4cG9ydCBsZXQgUFRfQW5kcm9pZFx0PSAyO1xuZXhwb3J0IGxldCBQVF9LaW5kbGVcdD0gMztcblxuZXhwb3J0IGNsYXNzIERldmljZSB7XG4gIHByaXZhdGUgX3R5cGU6IG51bWJlclxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl90eXBlID0gUFRfUENcbiAgfVxuICBnZXQgdHlwZSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fdHlwZSB9XG4gIHNldCB0eXBlKHR5cGU6IG51bWJlcikgeyB0aGlzLl90eXBlID0gdHlwZSB9XG59XG4iLCJpbXBvcnQgeyBpbnQsIGxvZyB9IGZyb20gXCIuL1V0aWxpdHlcIlxuaW1wb3J0IHsgQ1dJRFRILCBDSEVJR0hULCBDYW52YXMgfSBmcm9tICcuL0NhbnZhcydcblxuZXhwb3J0IGNsYXNzIERyYXcgZXh0ZW5kcyBDYW52YXN7XG4vLyAtLS0tLS0tLS0tLS0t55S75YOP44Gu6Kqt44G/6L6844G/LS0tLS0tLS0tLS0tLVxuICBpbWc6IEhUTUxJbWFnZUVsZW1lbnRbXVxuICBpbWdfbG9hZGVkOiBCb29sZWFuW11cbiAgbGluZV93aWR0aDogbnVtYmVyXG5cbiAgY29uc3RydWN0b3IoKXtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5pbWcgPSBuZXcgQXJyYXkoMjU2KVxuICAgIHRoaXMuaW1nX2xvYWRlZCA9IG5ldyBBcnJheSgyNTYpXG4gICAgdGhpcy5saW5lX3dpZHRoID0gMVxuICB9XG5cbiAgbG9hZEltZyhuOiBudW1iZXIsIGZpbGVuYW1lOiBzdHJpbmcpIHtcbiAgICAvL2xvZyhcIueUu+WDj1wiICsgbiArIFwiIFwiICsgZmlsZW5hbWUgKyBcIuiqreOBv+i+vOOBv+mWi+Wni1wiKVxuICAgIHRoaXMuaW1nX2xvYWRlZFtuXSA9IGZhbHNlXG4gICAgdGhpcy5pbWdbbl0gPSBuZXcgSW1hZ2UoKVxuICAgIHRoaXMuaW1nW25dLnNyYyA9IGZpbGVuYW1lXG4gICAgdGhpcy5pbWdbbl0ub25sb2FkID0gKCkgPT57XG4gICAgICAvL2xvZyhcIueUu+WDj1wiICsgbiArIFwiIFwiICsgZmlsZW5hbWUgKyBcIuiqreOBv+i+vOOBv+WujOS6hlwiKVxuICAgICAgdGhpcy5pbWdfbG9hZGVkW25dID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS3mj4/nlLsxIOWbs+W9oi0tLS0tLS0tLS0tLS1cbiAgc2V0QWxwKHBhcjogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuYmcpIHRoaXMuYmcuZ2xvYmFsQWxwaGEgPSBwYXIvMTAwXG4gIH1cblxuICBjb2xvclJHQihjcjogbnVtYmVyLCBjZzogbnVtYmVyLCBjYjogbnVtYmVyKSB7XG4gICAgY3IgPSBpbnQoY3IpXG4gICAgY2cgPSBpbnQoY2cpXG4gICAgY2IgPSBpbnQoY2IpXG4gICAgcmV0dXJuIChcInJnYihcIiArIGNyICsgXCIsXCIgKyBjZyArIFwiLFwiICsgY2IgKyBcIilcIilcbiAgfVxuXG4gIGxpbmVXKHdpZDogbnVtYmVyKSB7IC8v57ea44Gu5aSq44GV5oyH5a6aXG4gICAgdGhpcy5saW5lX3dpZHRoID0gd2lkIC8v44OQ44OD44Kv44Ki44OD44OXXG4gICAgaWYodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLmxpbmVXaWR0aCA9IHdpZFxuICAgIHRoaXMuYmcubGluZUNhcCA9IFwicm91bmRcIlxuICAgIHRoaXMuYmcubGluZUpvaW4gPSBcInJvdW5kXCJcbiAgfVxuXG4gIGxpbmUoeDA6IG51bWJlciwgeTA6IG51bWJlciwgeDE6IG51bWJlciwgeTE6IG51bWJlciwgY29sOiBzdHJpbmcpIHtcbiAgICBpZih0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuc3Ryb2tlU3R5bGUgPSBjb2xcbiAgICB0aGlzLmJnLmJlZ2luUGF0aCgpXG4gICAgdGhpcy5iZy5tb3ZlVG8oeDAsIHkwKVxuICAgIHRoaXMuYmcubGluZVRvKHgxLCB5MSlcbiAgICB0aGlzLmJnLnN0cm9rZSgpXG4gIH1cblxuICBmaWxsKGNvbDogc3RyaW5nKSB7XG4gICAgaWYodGhpcy5iZykgdGhpcy5iZy5maWxsU3R5bGUgPSBjb2xcbiAgICBpZih0aGlzLmJnKSB0aGlzLmJnLmZpbGxSZWN0KDAsIDAsIENXSURUSCwgQ0hFSUdIVClcbiAgfVxuXG4gIGZSZWN0KHg6bnVtYmVyLCB5Om51bWJlciwgdzpudW1iZXIsIGg6bnVtYmVyLGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5maWxsU3R5bGUgPSBjb2xcbiAgICB0aGlzLmJnLmZpbGxSZWN0KHgsIHksIHcsIGgpXG4gIH1cblxuICBzUmVjdCh4Om51bWJlciwgeTpudW1iZXIsIHc6bnVtYmVyLCBoOm51bWJlcixjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuc3Ryb2tlU3R5bGUgPSBjb2xcbiAgICB0aGlzLmJnLnN0cm9rZVJlY3QoeCwgeSwgdywgaClcbiAgfVxuXG4gIGZDaXIoeDpudW1iZXIsIHk6bnVtYmVyLCByOm51bWJlcixjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5iZWdpblBhdGgoKVxuICAgIHRoaXMuYmcuYXJjKHgsIHksIHIsIDAsIE1hdGguUEkqMiwgZmFsc2UpXG4gICAgdGhpcy5iZy5jbG9zZVBhdGgoKVxuICAgIHRoaXMuYmcuZmlsbCgpXG4gIH1cblxuICBzQ2lyKHg6bnVtYmVyLCB5Om51bWJlciwgcjpudW1iZXIsY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLnN0cm9rZVN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5iZWdpblBhdGgoKVxuICAgIHRoaXMuYmcuYXJjKHgsIHksIHIsIDAsIE1hdGguUEkqMiwgZmFsc2UpXG4gICAgdGhpcy5iZy5jbG9zZVBhdGgoKVxuICAgIHRoaXMuYmcuc3Ryb2tlKClcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS3mj4/nlLsyIOeUu+WDjy0tLS0tLS0tLS0tLS1cbiAgZHJhd0ltZyhuOiBudW1iZXIsIHg6IG51bWJlciwgeTpudW1iZXIpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICBpZih0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCB4LCB5KVxuICB9XG5cbiAgZHJhd0ltZ0xSKG46IG51bWJlciwgeDogbnVtYmVyLCB5Om51bWJlcikgeyAvLyDlt6blj7Plj43ou6JcbiAgICBpZih0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIGNvbnN0IHcgPSB0aGlzLmltZ1tuXS53aWR0aFxuICAgIGNvbnN0IGggPSB0aGlzLmltZ1tuXS5oZWlnaHRcbiAgICBpZih0aGlzLmJnKSB7XG4gICAgICB0aGlzLmJnLnNhdmUoKVxuICAgICAgdGhpcy5iZy50cmFuc2xhdGUoeCt3LzIsIHkraC8yKVxuICAgICAgdGhpcy5iZy5zY2FsZSgtMSwgMSlcbiAgICAgIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCAtdy8yLCAtaC8yKVxuICAgICAgdGhpcy5iZy5yZXN0b3JlKClcbiAgICB9XG4gIH1cblxuICAvL+OCu+ODs+OCv+ODquODs+OCsOihqOekulxuICBkcmF3SW1nQyhuOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgaWYodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBpZiAodGhpcy5iZylcbiAgICAgIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCB4IC0gaW50KHRoaXMuaW1nW25dLndpZHRoLzIpLCB5IC0gaW50KHRoaXMuaW1nW25dLmhlaWdodC8yKSlcbiAgfVxuXG4gIC8v5ouh5aSn57iu5bCPXG4gIGRyYXdJbWdTKG46IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XG4gICAgaWYodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBpZiAodGhpcy5iZykgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIHgsIHksIHcsIGgpXG4gIH1cbiAgLy/liIfjgorlh7rjgZcgKyDmi6HlpKfnuK7lsI9cbiAgZHJhd0ltZ1RTKG46IG51bWJlciwgc3g6IG51bWJlciwgc3k6IG51bWJlciwgc3c6IG51bWJlciwgc2g6IG51bWJlciwgY3g6IG51bWJlciwgY3k6IG51bWJlciwgY3c6IG51bWJlciwgY2g6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIGlmICh0aGlzLmJnKSB7XG4gICAgICB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgc3gsIHN5LCBzdywgc2gsIGN4LCBjeSwgY3csIGNoKVxuICAgIH1cbiAgfVxuICAvL+Wbnui7olxuICBkcmF3SW1nUihuIDpudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCBhcmc6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIGNvbnN0IHcgPSB0aGlzLmltZ1tuXS53aWR0aFxuICAgIGNvbnN0IGggPSB0aGlzLmltZ1tuXS5oZWlnaHRcbiAgICBpZih0aGlzLmJnKSB7XG4gICAgICB0aGlzLmJnLnNhdmUoKVxuICAgICAgdGhpcy5iZy50cmFuc2xhdGUoeCt3LzIsIHkraC8yKVxuICAgICAgdGhpcy5iZy5yb3RhdGUoYXJnKVxuICAgICAgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIC13LzIsIC1oLzIpXG4gICAgICB0aGlzLmJnLnJlc3RvcmUoKVxuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS3mj4/nlLszIOaWh+Wtly0tLS0tLS0tLS0tLS1cbiAgZlRleHQoc3RyOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyLCBzaXo6IG51bWJlciwgY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZykge1xuICAgICAgdGhpcy5iZy5mb250ID0gaW50KHNpeikgKyBcInB4IGJvbGQgbW9ub3NwYWNlXCJcbiAgICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgICB0aGlzLmJnLmZpbGxUZXh0KHN0ciwgeCsxLCB5KzEpXG4gICAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IGNvbFxuICAgICAgdGhpcy5iZy5maWxsVGV4dChzdHIsIHgsIHkpXG4gICAgfVxuICB9XG5cbiAgZlRleHROKHN0cjogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlciwgaDogbnVtYmVyLCBzaXo6IG51bWJlciwgY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICBjb25zdCBzbiA9IHN0ci5zcGxpdChcIlxcblwiKVxuICAgIHRoaXMuYmcuZm9udCA9IGludChzaXopICsgXCJweCBib2xkIG1vbm9zcGFjZVwiXG4gICAgaWYoc24ubGVuZ3RoID09IDEpIHtcbiAgICAgIGggPSAwXG4gICAgfSBlbHNlIHtcbiAgICAgIHkgPSB5IC0gaW50KGgvMilcbiAgICAgIGggPSBpbnQoaCAvIChzbi5sZW5ndGggLSAxKSlcbiAgICB9XG4gICAgZm9yKCBsZXQgaSA9IDA7IGkgPCBzbi5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5iZy5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgIHRoaXMuYmcuZmlsbFRleHQoc3RyLCB4KzEsIHkrMSlcbiAgICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gY29sXG4gICAgICB0aGlzLmJnLmZpbGxUZXh0KHN0ciwgeCwgeSlcbiAgICB9XG4gIH1cbiAgbVRleHRXaWR0aChzdHI6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHJldHVybiB0aGlzLmJnLm1lYXN1cmVUZXh0KHN0cikud2lkdGhcbiAgfVxufVxuIiwiaW1wb3J0IHsgaW50LCBsb2csIGNvZGVUb1N0ciB9IGZyb20gXCIuL1V0aWxpdHlcIlxuaW1wb3J0IHsgU0UgfSBmcm9tIFwiLi9Tb3VuZFwiXG5pbXBvcnQgeyBTQ0FMRSB9IGZyb20gXCIuL0NhbnZhc1wiXG5pbXBvcnQgeyBEZXZpY2UsIFBUX0FuZHJvaWQgfSBmcm9tIFwiLi9EZXZpY2VcIlxuXG4vLyAtLS0tLS0tLS0tIOOCv+ODg+ODl+WFpeWKmyAtLS0tLS0tLS0tXG5leHBvcnQgY2xhc3MgVG91Y2gge1xuXHRwdWJsaWMgdGFwWDogbnVtYmVyXG5cdHB1YmxpYyB0YXBZOiBudW1iZXJcblx0cHVibGljIHRhcEM6IG51bWJlclxuXHRwcml2YXRlIF9zZTogU0VcblxuXHRjb25zdHJ1Y3RvcihzZTogU0UpIHtcblx0XHR0aGlzLl9zZSA9IHNlO1xuXHRcdHRoaXMudGFwWCA9IDA7XG5cdFx0dGhpcy50YXBZID0gMDtcblx0XHR0aGlzLnRhcEMgPSAwO1xuXHR9XG5cdHN0YXJ0KGU6IFRvdWNoRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7Ly/jgq3jg6Pjg7Pjg5Djgrnjga7pgbjmip7vvI/jgrnjgq/jg63jg7zjg6vnrYnjgpLmipHliLbjgZnjgotcblx0XHRjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuXHRcdGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0dGhpcy50YXBYID0gZS50b3VjaGVzWzBdLmNsaWVudFgtcmVjdC5sZWZ0O1xuXHRcdHRoaXMudGFwWSA9IGUudG91Y2hlc1swXS5jbGllbnRZLXJlY3QudG9wO1xuXHRcdHRoaXMudGFwQyA9IDE7XG5cdFx0dGhpcy50cmFuc2Zvcm1YWSgpO1xuXHRcdGlmKHRoaXMuX3NlLnNuZF9pbml0ID09IDApIHRoaXMuX3NlLmxvYWRTb3VuZFNQaG9uZSgpOy8v44CQ6YeN6KaB44CR44K144Km44Oz44OJ44Gu6Kqt44G/6L6844G/XG5cdH1cblxuXHRtb3ZlKGU6IFRvdWNoRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblx0XHRjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdHRoaXMudGFwWCA9IGUudG91Y2hlc1swXS5jbGllbnRYLXJlY3QubGVmdDtcblx0XHR0aGlzLnRhcFkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WS1yZWN0LnRvcDtcblx0XHR0aGlzLnRyYW5zZm9ybVhZKCk7XG5cdH1cblxuXHRlbmQoZTogVG91Y2hFdmVudCkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR0aGlzLnRhcEMgPSAwOy8v4oC744Oe44Km44K55pON5L2c44Gn44GvbW91c2VPdXTjgYzjgZPjgozjgavjgarjgotcblx0fVxuXG5cdGNhbmNlbChlOiBUb3VjaEV2ZW50KSB7XG5cdFx0dGhpcy50YXBYID0gLTE7XG5cdFx0dGhpcy50YXBZID0gLTE7XG5cdFx0dGhpcy50YXBDID0gMDtcblx0fVxuXG5cdHRyYW5zZm9ybVhZKCkgey8v5a6f5bqn5qiZ4oaS5Luu5oOz5bqn5qiZ44G444Gu5aSJ5o+bXG5cdFx0dGhpcy50YXBYID0gaW50KHRoaXMudGFwWCAvIFNDQUxFKTtcblx0XHR0aGlzLnRhcFkgPSBpbnQodGhpcy50YXBZIC8gU0NBTEUpO1xuXHR9XG59XG5cblxuLy8gLS0tLS0tLS0tLS0tLeODnuOCpuOCueWFpeWKmy0tLS0tLS0tLS0tLS1cbmV4cG9ydCBjbGFzcyBNb3VzZSB7XG5cdHB1YmxpYyB0YXBYOm51bWJlclxuXHRwdWJsaWMgdGFwWTpudW1iZXJcblx0cHVibGljIHRhcEM6bnVtYmVyXG5cdHByaXZhdGUgX3NlOiBTRVxuXG5cdGNvbnN0cnVjdG9yKHNlOiBTRSkge1xuXHRcdHRoaXMuX3NlID0gc2Vcblx0XHR0aGlzLnRhcEMgPSAwXG5cdFx0dGhpcy50YXBYID0gMFxuXHRcdHRoaXMudGFwWSA9IDBcblx0fVxuXG5cdGRvd24oZTogTW91c2VFdmVudCkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTsvL+OCreODo+ODs+ODkOOCueOBrumBuOaKnu+8j+OCueOCr+ODreODvOODq+etieOCkuaKkeWItuOBmeOCi1xuXHRcdGlmKCEgZS50YXJnZXQpIHJldHVyblxuXHRcdGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG5cdFx0dmFyIHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHR0aGlzLnRhcFggPSBlLmNsaWVudFgtcmVjdC5sZWZ0O1xuXHRcdHRoaXMudGFwWSA9IGUuY2xpZW50WS1yZWN0LnRvcDtcblx0XHR0aGlzLnRhcEMgPSAxO1xuXHRcdHRoaXMudHJhbnNmb3JtWFkoKVxuXHRcdGlmKHRoaXMuX3NlLnNuZF9pbml0ID09IDApIHRoaXMuX3NlLmxvYWRTb3VuZFNQaG9uZSgpOy8v44CQ6YeN6KaB44CR44K144Km44Oz44OJ44Gu6Kqt44G/6L6844G/XG5cdH1cblxuXHRtb3ZlKGU6IE1vdXNlRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0aWYoISBlLnRhcmdldCkgcmV0dXJuXG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblx0XHRjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0dGhpcy50YXBYID0gZS5jbGllbnRYLXJlY3QubGVmdDtcblx0XHR0aGlzLnRhcFkgPSBlLmNsaWVudFktcmVjdC50b3A7XG5cdFx0dGhpcy50cmFuc2Zvcm1YWSgpXG5cdH1cblxuXHR1cChlOiBNb3VzZUV2ZW50KSB7IHRoaXMudGFwQyA9IDA7IH1cblx0b3V0KGU6IE1vdXNlRXZlbnQpIHsgdGhpcy50YXBDID0gMDsgfVxuXG5cdHRyYW5zZm9ybVhZKCkgey8v5a6f5bqn5qiZ4oaS5Luu5oOz5bqn5qiZ44G444Gu5aSJ5o+bXG5cdFx0dGhpcy50YXBYID0gaW50KHRoaXMudGFwWCAvIFNDQUxFKTtcblx0XHR0aGlzLnRhcFkgPSBpbnQodGhpcy50YXBZIC8gU0NBTEUpO1xuXHR9XG59XG5cbi8vIC0tLS0tLS0tLS0g5Yqg6YCf5bqm44K744Oz44K144O8IC0tLS0tLS0tLS1cbmV4cG9ydCBjbGFzcyBBY2Mge1xuXHRfYWNYID0gMFxuXHRfYWNZID0gMFxuXHRfYWNaID0gMDtcblx0X2RldmljZTogRGV2aWNlXG5cblx0Y29uc3RydWN0b3IoZGV2aWNlOiBEZXZpY2UpIHtcblx0XHQvL3dpbmRvdy5vbmRldmljZW1vdGlvbiA9IGRldmljZU1vdGlvbjsvL+KYheKYheKYheaXp1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlbW90aW9uXCIsIHRoaXMuZGV2aWNlTW90aW9uKTtcblx0XHR0aGlzLl9kZXZpY2UgPSBkZXZpY2Vcblx0fVxuXG5cdGRldmljZU1vdGlvbihlOiBEZXZpY2VNb3Rpb25FdmVudCkge1xuXHRcdHZhciBhSUc6IERldmljZU1vdGlvbkV2ZW50QWNjZWxlcmF0aW9uIHwgbnVsbCA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eTtcblx0XHRpZiAoYUlHID09IG51bGwpIHJldHVybjtcblx0XHRpZihhSUcueCkgdGhpcy5fYWNYID0gaW50KGFJRy54KTtcblx0XHRpZihhSUcueSkgdGhpcy5fYWNZID0gaW50KGFJRy55KTtcblx0XHRpZihhSUcueikgdGhpcy5fYWNaID0gaW50KGFJRy56KTtcblx0XHRpZih0aGlzLl9kZXZpY2UudHlwZSA9PSBQVF9BbmRyb2lkKSB7Ly9BbmRyb2lkIOOBqCBpT1Mg44Gn5q2j6LKg44GM6YCG44Gr44Gq44KLXG5cdFx0XHR0aGlzLl9hY1ggPSAtdGhpcy5fYWNYO1xuXHRcdFx0dGhpcy5fYWNZID0gLXRoaXMuX2FjWTtcblx0XHRcdHRoaXMuX2FjWiA9IC10aGlzLl9hY1o7XG5cdFx0fVxuXHR9XG59XG5cbi8v44Kt44O85YWl5Yqb55SoXG5leHBvcnQgY2xhc3MgS2V5IHtcblx0cHVibGljIF9zZTogU0Vcblx0cHVibGljIGlua2V5OiBudW1iZXJcblx0cHVibGljIGtleTogbnVtYmVyW11cblxuXHRjb25zdHJ1Y3RvcihzZTogU0UpIHtcblx0XHR0aGlzLmlua2V5ID0gMFxuXHRcdHRoaXMua2V5ID0gbmV3IEFycmF5KDI1Nik7XG5cdFx0dGhpcy5fc2UgPSBzZVxuXHR9XG5cblx0Y2xyKCkge1xuXHRcdHRoaXMuaW5rZXkgPSAwO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykgdGhpcy5rZXlbaV0gPSAwO1xuXHR9XG5cblx0b24oZTogS2V5Ym9hcmRFdmVudCkge1xuXHRcdC8vbG9nKCBgJHtlLmtleX0gOiAke2UuY29kZX0gOiAke2Uua2V5Q29kZX0gOiAke2NvZGVUb1N0cihlLmNvZGUpfWAgKVxuXG5cdFx0aWYodGhpcy5fc2Uuc25kX2luaXQgPT0gMCkgdGhpcy5fc2UubG9hZFNvdW5kU1Bob25lKCk7Ly/jgJDph43opoHjgJHjgrXjgqbjg7Pjg4njga7oqq3jgb/ovrzjgb9cblx0XHR0aGlzLmlua2V5ID0gY29kZVRvU3RyKGUuY29kZSlcblx0XHR0aGlzLmtleVtjb2RlVG9TdHIoZS5jb2RlKV0rK1xuXHR9XG5cblx0b2ZmKGU6IEtleWJvYXJkRXZlbnQpIHtcblx0XHR0aGlzLmlua2V5ID0gMDtcblx0XHR0aGlzLmtleVtjb2RlVG9TdHIoZS5jb2RlKV0gPSAwO1xuXHR9XG59XG4iLCIvLyAtLS0tLS0tLS0tLS0t44K144Km44Oz44OJ5Yi25b6hLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGxldCAgU09VTkRfT04gPSB0cnVlXG5leHBvcnQgY2xhc3MgU0Uge1xuICBwdWJsaWMgd2FpdF9zZTogbnVtYmVyID0gMFxuICBwdWJsaWMgc25kX2luaXQ6IG51bWJlciA9IDBcbiAgc291bmRGaWxlOiBIVE1MQXVkaW9FbGVtZW50W11cbiAgaXNCZ206IG51bWJlclxuICBiZ21ObzogbnVtYmVyXG4gIHNlTm86bnVtYmVyXG5cbiAgc291bmRsb2FkZWQ6IG51bWJlclxuICBzZl9uYW1lOiBzdHJpbmdbXVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8v44K144Km44Oz44OJ44OV44Kh44Kk44Or44KS6Kqt44G/6L6844KT44Gg44GLKOOCueODnuODm+WvvuetlilcbiAgICB0aGlzLndhaXRfc2UgPSAwXG4gICAgdGhpcy5zbmRfaW5pdCA9IDBcbiAgICB0aGlzLnNvdW5kRmlsZSA9IG5ldyBBcnJheSgyNTYpXG4gICAgdGhpcy5pc0JnbSA9IC0xXG4gICAgdGhpcy5iZ21ObyA9IDBcbiAgICB0aGlzLnNlTm8gPSAtMVxuICAgIHRoaXMuc291bmRsb2FkZWQgPSAwIC8v44GE44GP44Gk44OV44Kh44Kk44Or44KS6Kqt44G/6L6844KT44Gg44GLXG4gICAgdGhpcy5zZl9uYW1lID0gbmV3IEFycmF5KDI1NilcbiAgfVxuXG4gIGxvYWRTb3VuZFNQaG9uZSgpIHsvL+OCueODnuODm+OBp+ODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCgFxuICAgIHRyeSB7XG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5zb3VuZGxvYWRlZDsgaSsrKSB7XG4gICAgICAgIHRoaXMuc291bmRGaWxlW2ldID0gbmV3IEF1ZGlvKHRoaXMuc2ZfbmFtZVtpXSlcbiAgICAgICAgdGhpcy5zb3VuZEZpbGVbaV0ubG9hZCgpXG4gICAgICB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgfVxuICAgIHRoaXMuc25kX2luaXQgPSAyIC8v44K544Oe44Ob44Gn44OV44Kh44Kk44Or44KS6Kqt44G/6L6844KT44GgXG4gIH1cblxuICBsb2FkU291bmQobjogbnVtYmVyLCBmaWxlbmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zZl9uYW1lW25dID0gZmlsZW5hbWVcbiAgICB0aGlzLnNvdW5kbG9hZGVkKytcbiAgfVxuXG4gIHBsYXlTRShuOiBudW1iZXIpIHtcbiAgICBpZihTT1VORF9PTiA9PSBmYWxzZSkgcmV0dXJuXG4gICAgaWYodGhpcy5pc0JnbSA9PSAyKSByZXR1cm5cbiAgICBpZih0aGlzLndhaXRfc2UgPT0gMCkge1xuICAgICAgdGhpcy5zZU5vID0gblxuICAgICAgdGhpcy5zb3VuZEZpbGVbbl0uY3VycmVudFRpbWUgPSAwXG4gICAgICB0aGlzLnNvdW5kRmlsZVtuXS5sb29wID0gZmFsc2VcbiAgICAgIHRoaXMuc291bmRGaWxlW25dLnBsYXkoKVxuICAgICAgdGhpcy53YWl0X3NlID0gMyAvL+ODluODqeOCpuOCtuOBq+iyoOiNt+OCkuOBi+OBkeOBquOBhOOCiOOBhuOBq+mAo+e2muOBl+OBpua1geOBleOBquOBhOOCiOOBhuOBq+OBmeOCi1xuICAgIH1cbiAgfVxufSIsIi8vIC0tLS0tLS0tLS0tLS3lkITnqK7jga7plqLmlbAtLS0tLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gbG9nKG1zZzogc3RyaW5nKSB7XG4gIGNvbnNvbGUubG9nKG1zZylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludCh2YWw6IG51bWJlcik6IG51bWJlciB7XG4gIGxldCBudW0gPSBTdHJpbmcodmFsKVxuICByZXR1cm4gcGFyc2VJbnQobnVtKSAvL+ODl+ODqeOCueODnuOCpOODiuOCueOBqeOBoeOCieOCguWwj+aVsOmDqOWIhuOCkuWIh+OCiuaNqOOBplxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyKHZhbDogbnVtYmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIFN0cmluZyh2YWwpXG59XG5leHBvcnQgZnVuY3Rpb24gcm5kKG1heDogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSptYXgpXG59XG5leHBvcnQgZnVuY3Rpb24gYWJzKHZhbDogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguYWJzKHZhbClcbn1cblxuLy8gLS0tLS0tLS0tLSDjgq3jg7zlhaXlipvjgq3jg7zjga7jg57jg4Pjg5Tjg7PjgrAoa2V5Q29kZSDjgYzpnZ7mjqjlpajjga7jgZ/jgoEpIC0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiBjb2RlVG9TdHIoY29kZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgbGV0IGNoYXJDb2RlOiBudW1iZXIgPSAwXG4gIHN3aXRjaChjb2RlKSB7XG4gICAgY2FzZSBcIktleUFcIjogY2hhckNvZGUgPSA2NTsgYnJlYWs7XG4gICAgY2FzZSBcIktleUJcIjogY2hhckNvZGUgPSA2NjsgYnJlYWs7XG4gICAgY2FzZSBcIktleUNcIjogY2hhckNvZGUgPSA2NzsgYnJlYWs7XG4gICAgY2FzZSBcIktleURcIjogY2hhckNvZGUgPSA2ODsgYnJlYWs7XG4gICAgY2FzZSBcIktleUVcIjogY2hhckNvZGUgPSA2OTsgYnJlYWs7XG4gICAgY2FzZSBcIktleUZcIjogY2hhckNvZGUgPSA3MDsgYnJlYWs7XG4gICAgY2FzZSBcIktleUdcIjogY2hhckNvZGUgPSA3MTsgYnJlYWs7XG4gICAgY2FzZSBcIktleUhcIjogY2hhckNvZGUgPSA3MjsgYnJlYWs7XG4gICAgY2FzZSBcIktleUlcIjogY2hhckNvZGUgPSA3MzsgYnJlYWs7XG4gICAgY2FzZSBcIktleUpcIjogY2hhckNvZGUgPSA3NDsgYnJlYWs7XG4gICAgY2FzZSBcIktleUtcIjogY2hhckNvZGUgPSA3NTsgYnJlYWs7XG4gICAgY2FzZSBcIktleUxcIjogY2hhckNvZGUgPSA3NjsgYnJlYWs7XG4gICAgY2FzZSBcIktleU1cIjogY2hhckNvZGUgPSA3NzsgYnJlYWs7XG4gICAgY2FzZSBcIktleU5cIjogY2hhckNvZGUgPSA3ODsgYnJlYWs7XG4gICAgY2FzZSBcIktleU9cIjogY2hhckNvZGUgPSA3OTsgYnJlYWs7XG4gICAgY2FzZSBcIktleVBcIjogY2hhckNvZGUgPSA4MDsgYnJlYWs7XG4gICAgY2FzZSBcIktleVFcIjogY2hhckNvZGUgPSA4MTsgYnJlYWs7XG4gICAgY2FzZSBcIktleVJcIjogY2hhckNvZGUgPSA4MjsgYnJlYWs7XG4gICAgY2FzZSBcIktleVNcIjogY2hhckNvZGUgPSA4MzsgYnJlYWs7XG4gICAgY2FzZSBcIktleVRcIjogY2hhckNvZGUgPSA4NDsgYnJlYWs7XG4gICAgY2FzZSBcIktleVVcIjogY2hhckNvZGUgPSA4NTsgYnJlYWs7XG4gICAgY2FzZSBcIktleVZcIjogY2hhckNvZGUgPSA4NjsgYnJlYWs7XG4gICAgY2FzZSBcIktleVdcIjogY2hhckNvZGUgPSA4NzsgYnJlYWs7XG4gICAgY2FzZSBcIktleVhcIjogY2hhckNvZGUgPSA4ODsgYnJlYWs7XG4gICAgY2FzZSBcIktleVlcIjogY2hhckNvZGUgPSA4OTsgYnJlYWs7XG4gICAgY2FzZSBcIktleVpcIjogY2hhckNvZGUgPSA5MDsgYnJlYWs7XG5cbiAgICBjYXNlIFwiU3BhY2VcIjogY2hhckNvZGUgPSAzMjsgYnJlYWs7XG4gICAgY2FzZSBcIkFycm93TGVmdFwiOiBjaGFyQ29kZSA9IDM3OyBicmVhaztcbiAgICBjYXNlIFwiQXJyb3dVcFwiOiBjaGFyQ29kZSA9IDM4OyBicmVhaztcbiAgICBjYXNlIFwiQXJyb3dSaWdodFwiOiBjaGFyQ29kZSA9IDM5OyBicmVhaztcbiAgICBjYXNlIFwiQXJyb3dEb3duXCI6IGNoYXJDb2RlID0gNDA7IGJyZWFrO1xuICB9XG4gIHJldHVybiBjaGFyQ29kZVxufVxuXG5leHBvcnQgY29uc3QgS0VZX05BTUUgPSB7XG5cdFwiRU5URVJcIiA6IDEzLFxuXHRcIlNQQUNFXCIgOiAzMixcblx0XCJMRUZUXCIgIDogMzcsXG5cdFwiVVBcIiAgICA6IDM4LFxuXHRcIlJJR0hUXCIgOiAzOSxcblx0XCJET1dOXCIgIDogNDAsXG5cdFwiYVwiICAgICA6IDY1LFxuXHRcInpcIiAgICAgOiA5MFxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IE1NUyB9IGZyb20gJy4vV1dTJ1xuaW1wb3J0IHsgS0VZX05BTUUgfSBmcm9tICcuL1dXU2xpYi9VdGlsaXR5J1xuXG5cbmNsYXNzIE15R2FtZSBleHRlbmRzIE1NUyB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgc3VwZXIoKVxuICB9XG4gIGNscktleSgpOiB2b2lkIHt9XG4gIHNldHVwKCk6IHZvaWQge1xuICAgIHRoaXMuY2FudmFzLmNhbnZhc1NpemUoMTIwMCwgNzIwKVxuICAgIHRoaXMuZHJhdy5sb2FkSW1nKDAsIFwiaW1hZ2UyL2JnLnBuZ1wiKVxuICAgIHRoaXMuZHJhdy5sb2FkSW1nKDEsIFwiaW1hZ2UyL3NwYWNlc2hpcC5wbmdcIilcbiAgICB0aGlzLmluaXRTU2hpcCgpXG4gIH1cbiAgbWFpbmxvb3AoKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3QkcoMSlcbiAgICB0aGlzLm1vdmVTU2hpcCgpXG4gIH1cblxuICBiZ1g6IG51bWJlciA9IDBcbiAgc3NYOiBudW1iZXIgPSAwXG4gIHNzWTogbnVtYmVyID0gMFxuXG4gIGRyYXdCRyhzcGVlZDogbnVtYmVyKSB7XG4gICAgdGhpcy5iZ1ggPSAodGhpcy5iZ1ggKyBzcGVlZCkgJSAxMjAwXG4gICAgdGhpcy5kcmF3LmRyYXdJbWcoMCwgLXRoaXMuYmdYLCAwKVxuICAgIHRoaXMuZHJhdy5kcmF3SW1nKDAsIDEyMDAgLSB0aGlzLmJnWCwgMClcbiAgfVxuXG4gIGluaXRTU2hpcCgpIHtcbiAgICB0aGlzLnNzWCA9IDQwMFxuICAgIHRoaXMuc3NZID0gMzYwXG4gIH1cblxuICBtb3ZlU1NoaXAoKSB7XG4gICAgaWYodGhpcy5rZXkua2V5W0tFWV9OQU1FLkxFRlRdID4gMCAmJiB0aGlzLnNzWCA+IDYwKSB0aGlzLnNzWCAtPSAyMFxuICAgIGlmKHRoaXMua2V5LmtleVtLRVlfTkFNRS5SSUdIVF0gPiAwICYmIHRoaXMuc3NYIDwgMTAwMCkgdGhpcy5zc1ggKz0gMjBcbiAgICBpZih0aGlzLmtleS5rZXlbS0VZX05BTUUuVVBdID4gMCAmJiB0aGlzLnNzWSA+IDQwKSB0aGlzLnNzWSAtPSAyMFxuICAgIGlmKHRoaXMua2V5LmtleVtLRVlfTkFNRS5ET1dOXSA+IDAgJiYgdGhpcy5zc1kgPCA2ODApIHRoaXMuc3NZICs9IDIwXG5cbiAgICB0aGlzLmRyYXcuZHJhd0ltZ0MoMSwgdGhpcy5zc1gsIHRoaXMuc3NZKVxuICB9XG59XG5cblxuXG5uZXcgTXlHYW1lKClcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==