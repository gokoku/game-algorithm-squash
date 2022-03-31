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
                this.key.clr();
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
                    this.key.clr();
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
exports.KEY_NAME = exports.codeToStr = exports.getDis = exports.sin = exports.cos = exports.abs = exports.rnd = exports.str = exports.int = exports.log = void 0;
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
    return int(Math.random() * max);
}
exports.rnd = rnd;
function abs(val) {
    return Math.abs(val);
}
exports.abs = abs;
function cos(a) {
    return Math.cos(Math.PI * 2 * a / 360);
}
exports.cos = cos;
function sin(a) {
    return Math.sin(Math.PI * 2 * a / 360);
}
exports.sin = sin;
function getDis(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
exports.getDis = getDis;
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
const MSL_MAX = 100;
const OBJ_MAX = 100;
const EFCT_MAX = 100;
class MyGame extends WWS_1.MMS {
    constructor() {
        super();
        //自機の管理
        this.bgX = 0;
        this.ssX = 0;
        this.ssY = 0;
        //自機が打つ弾の管理
        this.mslNum = 0;
        this.mslX = new Array(MSL_MAX);
        this.mslY = new Array(MSL_MAX);
        this.mslXp = new Array(MSL_MAX);
        this.mslYp = new Array(MSL_MAX);
        this.mslF = new Array(MSL_MAX);
        this.automa = 0; //弾の自動発射
        this.tmr = 0; //タイマー
        this.energy = 0; //エネルギー
        this.muteki = 0; //無敵状態
        //物体の管理　敵機、敵の弾を管理
        this.objType = new Array(OBJ_MAX); //objType: 0:敵機　1:敵の弾
        this.objImg = new Array(OBJ_MAX);
        this.objX = new Array(OBJ_MAX);
        this.objY = new Array(OBJ_MAX);
        this.objXp = new Array(OBJ_MAX);
        this.objYp = new Array(OBJ_MAX);
        this.objF = new Array(OBJ_MAX);
        this.objNum = 0;
        //エフェクトの管理
        this.efctX = new Array(OBJ_MAX);
        this.efctY = new Array(OBJ_MAX);
        this.efctN = new Array(OBJ_MAX);
        this.efctNum = 0;
    }
    clrKey() { }
    setup() {
        this.canvas.canvasSize(1200, 720);
        this.draw.loadImg(0, "image2/bg.png");
        this.draw.loadImg(1, "image2/spaceship.png");
        this.draw.loadImg(2, "image2/missile.png");
        this.draw.loadImg(3, 'image2/explode.png');
        this.draw.loadImg(4, 'image2/enemy0.png');
        this.draw.loadImg(5, 'image2/enemy1.png');
        this.initSShip();
        this.initMissile();
        this.initOject();
        this.initEffect();
    }
    mainloop() {
        this.tmr++;
        this.drawBG(1);
        this.moveSShip();
        this.moveMissile();
        if (this.tmr % 30 == 0) {
            this.setOject(1, 5, 1200, (0, Utility_1.rnd)(700), -12, 0);
        }
        this.moveOject();
        this.drawEffect();
        for (let i = 0; i < 10; i++)
            this.draw.fRect(20 + i * 30, 660, 20, 40, "#c00000");
        for (let i = 0; i < this.energy; i++)
            this.draw.fRect(20 + i * 30, 660, 20, 40, this.draw.colorRGB(160 - 16 * i, 240 - 12 * i, 24 * i));
    }
    drawBG(speed) {
        this.bgX = (this.bgX + speed) % 1200;
        this.draw.drawImg(0, -this.bgX, 0);
        this.draw.drawImg(0, 1200 - this.bgX, 0);
    }
    initSShip() {
        this.ssX = 400;
        this.ssY = 360;
        this.energy = 10;
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
        if (this.key.key[Utility_1.KEY_NAME.a] == 1) {
            this.key.key[Utility_1.KEY_NAME.a] += 1;
            this.automa = 1 - this.automa;
        }
        if (this.automa == 0 && this.key.key[Utility_1.KEY_NAME.SPACE] == 1) {
            this.key.key[Utility_1.KEY_NAME.SPACE] += 1;
            this.setMissile(this.ssX + 40, this.ssY, 40, 0);
        }
        if (this.automa == 1 && this.tmr % 8 == 0)
            this.setMissile(this.ssX + 40, this.ssY, 40, 0);
        let col = "black";
        if (this.automa == 1)
            col = "white";
        this.draw.fRect(900, 20, 280, 60, "blue");
        this.draw.fText("[A]uto Missile", 1040, 50, 36, col);
        if (this.muteki % 2 == 0)
            this.draw.drawImgC(1, this.ssX, this.ssY);
        if (this.muteki > 0)
            this.muteki--;
    }
    initMissile() {
        for (let i = 0; i < MSL_MAX; i++)
            this.mslF[i] = false;
        this.mslNum = 0;
    }
    setMissile(x, y, xp, yp) {
        this.mslX[this.mslNum] = x;
        this.mslY[this.mslNum] = y;
        this.mslXp[this.mslNum] = xp;
        this.mslYp[this.mslNum] = yp;
        this.mslF[this.mslNum] = true;
        this.mslNum = (this.mslNum + 1) % MSL_MAX;
    }
    moveMissile() {
        for (let i = 0; i < MSL_MAX; i++) {
            if (this.mslF[i] == true) {
                this.mslX[i] += this.mslXp[i];
                this.mslY[i] += this.mslYp[i];
                this.draw.drawImgC(2, this.mslX[i], this.mslY[i]);
                if (this.mslX[i] > 1200)
                    this.mslF[i] = false;
            }
        }
    }
    initOject() {
        for (let i = 0; i < OBJ_MAX; i++) {
            this.objF[i] = false;
        }
        this.objNum = 0;
    }
    setOject(typ, png, x, y, xp, yp) {
        this.objType[this.objNum] = typ;
        this.objImg[this.objNum] = png;
        this.objX[this.objNum] = x;
        this.objY[this.objNum] = y;
        this.objXp[this.objNum] = xp;
        this.objYp[this.objNum] = yp;
        this.objF[this.objNum] = true;
        this.objNum = (this.objNum + 1) % OBJ_MAX;
    }
    moveOject() {
        for (let i = 0; i < OBJ_MAX; i++) {
            if (this.objF[i] == true) {
                this.objX[i] += this.objXp[i];
                this.objY[i] += this.objYp[i];
                this.draw.drawImgC(this.objImg[i], this.objX[i], this.objY[i]);
                if (this.objType[i] == 1 && (0, Utility_1.rnd)(100) < 3) {
                    this.setOject(0, 4, this.objX[i], this.objY[i], -24, 0);
                }
                if (this.objX[i] < 0)
                    this.objF[i] = false;
                //自機が撃った弾とヒットチェック
                if (this.objType[i] == 1) {
                    const r = 12 + (this.draw.img[this.objImg[i]].width + this.draw.img[this.objImg[i]].height) / 4;
                    for (let n = 0; n < MSL_MAX; n++) {
                        if (this.mslF[n] == true) {
                            if ((0, Utility_1.getDis)(this.objX[i], this.objY[i], this.mslX[n], this.mslY[n]) < r) {
                                this.setEffect(this.objX[i], this.objY[i], 9);
                                this.objF[i] = false;
                            }
                        }
                    }
                }
                //自機とのヒットチェック
                const r = 30 + (this.draw.img[this.objImg[i]].width + this.draw.img[this.objImg[i]].height) / 4;
                if ((0, Utility_1.getDis)(this.objX[i], this.objY[i], this.ssX, this.ssY) < r) {
                    if (this.objType[i] <= 1 && this.muteki == 0) { //敵の弾と敵機
                        this.objF[i] = false;
                        this.energy -= 1;
                        this.muteki = 30;
                    }
                }
            }
        }
    }
    initEffect() {
        for (let i = 0; i < EFCT_MAX; i++) {
            this.efctN[i] = 0;
        }
        this.efctNum = 0;
    }
    setEffect(x, y, n) {
        this.efctX[this.efctNum] = x;
        this.efctY[this.efctNum] = y;
        this.efctN[this.efctNum] = n;
        this.efctNum = (this.efctNum + 1) % EFCT_MAX;
    }
    drawEffect() {
        for (let i = 0; i < EFCT_MAX; i++) {
            if (this.efctN[i] > 0) {
                this.draw.drawImgTS(3, (9 - this.efctN[i]) * 128, 0, 128, 128, this.efctX[i] - 64, this.efctY[i] - 64, 128, 128);
                this.efctN[i]--;
            }
        }
    }
}
new MyGame();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1NBQ2xCO0lBQ0gsQ0FBQztJQUVELFVBQVU7SUFDVixRQUFRLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ3RDLElBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLO1lBQUUsT0FBTTtRQUN0QyxJQUFJLElBQUksQ0FBQyxFQUFFO1lBQ1QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQUcsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQUcsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQsTUFBTTtJQUNOLFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUM1RCxJQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSztZQUFFLE9BQU07UUFDdEMsSUFBSSxJQUFJLENBQUMsRUFBRTtZQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVB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LElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUZELHdCQUVDO0FBR0Qsc0RBQXNEO0FBQ3RELFNBQWdCLFNBQVMsQ0FBQyxJQUFZO0lBQ3BDLElBQUksUUFBUSxHQUFXLENBQUM7SUFDeEIsUUFBTyxJQUFJLEVBQUU7UUFDWCxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUVsQyxLQUFLLE9BQU87WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNuQyxLQUFLLFdBQVc7WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUN2QyxLQUFLLFNBQVM7WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNyQyxLQUFLLFlBQVk7WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUN4QyxLQUFLLFdBQVc7WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtLQUN4QztJQUNELE9BQU8sUUFBUTtBQUNqQixDQUFDO0FBckNELDhCQXFDQztBQUVZLGdCQUFRLEdBQUc7SUFDdkIsT0FBTyxFQUFHLEVBQUU7SUFDWixPQUFPLEVBQUcsRUFBRTtJQUNaLE1BQU0sRUFBSSxFQUFFO0lBQ1osSUFBSSxFQUFNLEVBQUU7SUFDWixPQUFPLEVBQUcsRUFBRTtJQUNaLE1BQU0sRUFBSSxFQUFFO0lBQ1osR0FBRyxFQUFPLEVBQUU7SUFDWixHQUFHLEVBQU8sRUFBRTtDQUNaOzs7Ozs7O1VDbEZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ3RCQSwrREFBMkI7QUFDM0IseUZBQTZEO0FBRTdELE1BQU0sT0FBTyxHQUFHLEdBQUc7QUFDbkIsTUFBTSxPQUFPLEdBQUcsR0FBRztBQUNuQixNQUFNLFFBQVEsR0FBRyxHQUFHO0FBQ3BCLE1BQU0sTUFBTyxTQUFRLFNBQUc7SUFpQ3RCO1FBQ0UsS0FBSyxFQUFFO1FBakNULE9BQU87UUFDUCxRQUFHLEdBQVcsQ0FBQztRQUNmLFFBQUcsR0FBVyxDQUFDO1FBQ2YsUUFBRyxHQUFXLENBQUM7UUFDZixXQUFXO1FBQ1gsV0FBTSxHQUFXLENBQUM7UUFDbEIsU0FBSSxHQUFhLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNuQyxTQUFJLEdBQWEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ25DLFVBQUssR0FBYSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDcEMsVUFBSyxHQUFhLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNwQyxTQUFJLEdBQWMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3BDLFdBQU0sR0FBVyxDQUFDLEVBQUMsUUFBUTtRQUMzQixRQUFHLEdBQVcsQ0FBQyxFQUFDLE1BQU07UUFDdEIsV0FBTSxHQUFXLENBQUMsRUFBQyxPQUFPO1FBQzFCLFdBQU0sR0FBVyxDQUFDLEVBQUMsTUFBTTtRQUV6QixpQkFBaUI7UUFDakIsWUFBTyxHQUFhLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFDLHFCQUFxQjtRQUM1RCxXQUFNLEdBQWEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3JDLFNBQUksR0FBYSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDbkMsU0FBSSxHQUFhLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNuQyxVQUFLLEdBQWEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3BDLFVBQUssR0FBYSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDcEMsU0FBSSxHQUFjLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNwQyxXQUFNLEdBQVcsQ0FBQztRQUVsQixVQUFVO1FBQ1YsVUFBSyxHQUFhLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNwQyxVQUFLLEdBQWEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3BDLFVBQUssR0FBYSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDcEMsWUFBTyxHQUFXLENBQUM7SUFJbkIsQ0FBQztJQUNELE1BQU0sS0FBVSxDQUFDO0lBQ2pCLEtBQUs7UUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUM7UUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLHNCQUFzQixDQUFDO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxvQkFBb0IsQ0FBQztRQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsb0JBQW9CLENBQUM7UUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLG1CQUFtQixDQUFDO1FBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxtQkFBbUIsQ0FBQztRQUN6QyxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2hCLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDbEIsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNoQixJQUFJLENBQUMsVUFBVSxFQUFFO0lBQ25CLENBQUM7SUFDRCxRQUFRO1FBQ04sSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNoQixJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ2xCLElBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFDO1lBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsaUJBQUcsRUFBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDNUM7UUFDRCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2hCLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDakIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUM7UUFDMUUsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBQyxFQUFFLEdBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBQyxFQUFFLEdBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RixDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQWE7UUFDbEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsSUFBSTtRQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHO1FBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHO1FBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFO0lBQ2xCLENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUU7WUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7UUFDbkUsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUk7WUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7UUFDdEUsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUU7WUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7UUFDakUsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUc7WUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7UUFDcEUsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU07U0FDOUI7UUFDRCxJQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGtCQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3hELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGtCQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNqQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNoRDtRQUNELElBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUN0QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqRCxJQUFJLEdBQUcsR0FBRyxPQUFPO1FBQ2pCLElBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDO1lBQUUsR0FBRyxHQUFHLE9BQU87UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQztRQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7UUFDcEQsSUFBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDM0MsSUFBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7WUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFO0lBQ25DLENBQUM7SUFFRCxXQUFXO1FBQ1QsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUU7WUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUs7UUFDckQsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDO0lBRWpCLENBQUM7SUFDRCxVQUFVLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxFQUFVLEVBQUUsRUFBVTtRQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO1FBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUk7UUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTztJQUMzQyxDQUFDO0lBRUQsV0FBVztRQUNULEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0IsSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTtnQkFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakQsSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUk7b0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLO2FBQzdDO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsU0FBUztRQUNQLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLO1NBQ3JCO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxRQUFRLENBQUMsR0FBVyxFQUFFLEdBQVcsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLEVBQVUsRUFBRSxFQUFVO1FBQzdFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUc7UUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRztRQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO1FBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUk7UUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTztJQUMzQyxDQUFDO0lBRUQsU0FBUztRQUNQLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0IsSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTtnQkFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlELElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQUcsRUFBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUN4RDtnQkFDRCxJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztvQkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUs7Z0JBQ3pDLGlCQUFpQjtnQkFDakIsSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDdkIsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztvQkFDL0YsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDL0IsSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTs0QkFDdkIsSUFBRyxvQkFBTSxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0NBQ3JFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQ0FDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLOzZCQUNyQjt5QkFDRjtxQkFDRjtpQkFDRjtnQkFDRCxhQUFhO2dCQUNiLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQy9GLElBQUcsb0JBQU0sRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUM3RCxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLEVBQUMsUUFBUTt3QkFDcEQsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLO3dCQUNwQixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUM7d0JBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRTtxQkFDakI7aUJBQ0Y7YUFDRjtTQUNGO0lBQ0gsQ0FBQztJQUVELFVBQVU7UUFDUixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztTQUNsQjtRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQztJQUNsQixDQUFDO0lBRUQsU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUTtRQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRO0lBQzlDLENBQUM7SUFFRCxVQUFVO1FBQ1IsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNoQyxJQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO2dCQUMxRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO2FBQ2hCO1NBQ0Y7SUFDSCxDQUFDO0NBQ0Y7QUFJRCxJQUFJLE1BQU0sRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9XV1MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9DYW52YXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9EZXZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9EcmF3LnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvRXZlbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9Tb3VuZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV1dTbGliL1V0aWxpdHkudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuSmF2YVNjcmlwdCZIVE1MNSDjgrLjg7zjg6DplovnmbrnlKjjgrfjgrnjg4bjg6BcbumWi+eZuiDjg6/jg7zjg6vjg4njg6/jgqTjg4njgr3jg5Xjg4jjgqbjgqfjgqLmnInpmZDkvJrnpL5cblxu77yI5L2/55So5p2h5Lu277yJXG7mnKzjgr3jg7zjgrnjgrPjg7zjg4njga7okZfkvZzmqKnjga/plovnmbrlhYPjgavjgYLjgorjgb7jgZnjgIJcbuWIqeeUqOOBleOCjOOBn+OBhOaWueOBr+ODoeODvOODq+OBq+OBpuOBiuWVj+OBhOWQiOOCj+OBm+S4i+OBleOBhOOAglxudGhAd3dzZnQuY29tIOODr+ODvOODq+ODieODr+OCpOODieOCveODleODiOOCpuOCp+OCoiDlu6PngKxcbiovXG5cbmltcG9ydCB7IGludCwgbG9nIH0gZnJvbSAnLi9XV1NsaWIvVXRpbGl0eSdcbmltcG9ydCB7IFRvdWNoLCBNb3VzZSwgS2V5IH0gZnJvbSBcIi4vV1dTbGliL0V2ZW50XCJcbmltcG9ydCB7IENXSURUSCwgQ0hFSUdIVCwgQ2FudmFzIH0gZnJvbSBcIi4vV1dTbGliL0NhbnZhc1wiXG5pbXBvcnQgeyBEcmF3IH0gZnJvbSBcIi4vV1dTbGliL0RyYXdcIlxuaW1wb3J0IHsgU0UgfSBmcm9tICcuL1dXU2xpYi9Tb3VuZCdcbmltcG9ydCB7IERldmljZSwgUFRfQW5kcm9pZCwgUFRfaU9TLCBQVF9LaW5kbGUgfSBmcm9tICcuL1dXU2xpYi9EZXZpY2UnXG4vLyAtLS0tLS0tLS0tLS0t5aSJ5pWwLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGNvbnN0ICBTWVNfVkVSID0gXCJWZXIuMjAyMDExMTFcIlxuZXhwb3J0IGxldCAgREVCVUcgPSBmYWxzZVxuXG5cbi8v5Yem55CG44Gu6YCy6KGM44KS566h55CG44GZ44KLXG4vLyBtYWluX2lkeCDjga7lgKRcbi8vICAgMDog5Yid5pyf5YyWXG4vLyAgIDE6IOOCu+ODvOODluOBp+OBjeOBquOBhOitpuWRilxuLy8gICAyOiDjg6HjgqTjg7Plh6bnkIZcbmxldCBtYWluX2lkeCA9IDBcbmxldCBtYWluX3RtciA9IDBcbmxldCBzdG9wX2ZsZyA9IDAgLy8g44Oh44Kk44Oz5Yem55CG44Gu5LiA5pmC5YGc5q2iXG5jb25zdCBOVUEgPSBuYXZpZ2F0b3IudXNlckFnZW50Oy8v5qmf56iu5Yik5a6aXG5jb25zdCBzdXBwb3J0VG91Y2ggPSAnb250b3VjaGVuZCcgaW4gZG9jdW1lbnQ7Ly/jgr/jg4Pjg4HjgqTjg5njg7Pjg4jjgYzkvb/jgYjjgovjgYvvvJ9cblxuLy8g44OV44Os44O844Og44Os44O844OIIGZyYW1lcyAvIHNlY29uZFxubGV0ICBGUFMgPSAzMFxuLy/jg63jg7zjgqvjg6vjgrnjg4jjg6zjg7zjgrhcbmNvbnN0IExTX0tFWU5BTUUgPSBcIlNBVkVEQVRBXCI7Ly9rZXlOYW1lIOS7u+aEj+OBq+WkieabtOWPr1xuLy/kv53lrZjjgafjgY3jgovjgYvliKTlrprjgZfjgIHjgafjgY3jgarjgYTloLTlkIjjgavorablkYrjgpLlh7rjgZnjgIDlhbfkvZPnmoTjgavjga8gaU9TIFNhZmFyaSDjg5fjg6njgqTjg5njg7zjg4jjg5bjg6njgqbjgrrjgYxPTu+8iOS/neWtmOOBp+OBjeOBquOBhO+8ieeKtuaFi+OBq+itpuWRiuOCkuWHuuOBmVxubGV0IENIRUNLX0xTID0gZmFsc2U7XG5cbi8vIC0tLS0tLS0tLS0tLS3jg6rjgqLjg6vjgr/jgqTjg6Dlh6bnkIYtLS0tLS0tLS0tLS0tXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTU1TIHtcbiAgYWJzdHJhY3Qgc2V0dXAoKTogdm9pZFxuICBhYnN0cmFjdCBtYWlubG9vcCgpOiB2b2lkXG5cbiAgcHVibGljIGNhbnZhczogQ2FudmFzXG4gIHB1YmxpYyBkcmF3OiBEcmF3XG4gIHB1YmxpYyBtb3VzZTogTW91c2VcbiAgcHVibGljIHRvdWNoOiBUb3VjaFxuICBwdWJsaWMga2V5OiBLZXlcbiAgcHVibGljIHNlOiBTRVxuICBwdWJsaWMgZGV2aWNlOiBEZXZpY2VcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgdGhpcy53d3NTeXNJbml0LmJpbmQodGhpcykpXG4gICAgdGhpcy5jYW52YXMgPSBuZXcgQ2FudmFzKClcbiAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpXG4gICAgdGhpcy5zZSA9IG5ldyBTRSgpXG4gICAgdGhpcy5tb3VzZSA9IG5ldyBNb3VzZSh0aGlzLnNlKVxuICAgIHRoaXMudG91Y2ggPSBuZXcgVG91Y2godGhpcy5zZSlcbiAgICB0aGlzLmtleSA9IG5ldyBLZXkodGhpcy5zZSlcbiAgICB0aGlzLmRldmljZSA9IG5ldyBEZXZpY2UoKVxuICB9XG5cbiAgd3dzU3lzTWFpbigpOiB2b2lkIHtcblxuICAgIGxldCBzdGltZSA9IERhdGUubm93KClcbiAgICAvL+ODluODqeOCpuOCtuOBruOCteOCpOOCuuOBjOWkieWMluOBl+OBn+OBi++8n++8iOOCueODnuODm+OBquOCieaMgeOBoeaWueOCkuWkieOBiOOBn+OBi+OAgOe4puaMgeOBoeKHlOaoquaMgeOBoe+8iVxuICAgIGlmKHRoaXMuY2FudmFzLmJha1cgIT0gd2luZG93LmlubmVyV2lkdGggfHwgdGhpcy5jYW52YXMuYmFrSCAhPSB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIHRoaXMuY2FudmFzLmluaXRDYW52YXMoKVxuICAgICAgbG9nKFwiY2FudmFzIHNpemUgY2hhbmdlZCBcIiArIHRoaXMuY2FudmFzLmJha1cgKyBcInhcIiArIHRoaXMuY2FudmFzLmJha0gpO1xuICAgIH1cblxuICAgIG1haW5fdG1yICsrXG5cbiAgICBzd2l0Y2gobWFpbl9pZHgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgdGhpcy5zZXR1cCgpXG4gICAgICAgIHRoaXMua2V5LmNscigpXG4gICAgICAgIG1haW5faWR4ID0gMlxuICAgICAgICBpZihDSEVDS19MUyA9PSB0cnVlKSB7XG4gICAgICAgICAgdHJ5IHtsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIl9zYXZlX3Rlc3RcIiwgXCJ0ZXN0ZGF0YVwiKX0gY2F0Y2goZSkgeyBtYWluX2lkeCA9IDEgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IHggPSBpbnQoQ1dJRFRIIC8gMilcbiAgICAgICAgbGV0IHkgPSBpbnQoQ0hFSUdIVCAvIDYpXG4gICAgICAgIGxldCBmcyA9IGludChDSEVJR0hUIC8gMTYpXG4gICAgICAgIHRoaXMuZHJhdy5maWxsKFwiYmxhY2tcIilcbiAgICAgICAgdGhpcy5kcmF3LmZUZXh0KFwi4oC744K744O844OW44OH44O844K/44GM5L+d5a2Y44GV44KM44G+44Gb44KT4oC7XCIsIHgsIHkvMiwgZnMsIFwieWVsbG93XCIpO1xuICAgICAgICB0aGlzLmRyYXcuZlRleHROKFwiaU9T56uv5pyr44KS44GK5L2/44GE44Gu5aC05ZCI44GvXFxuU2FmYXJp44Gu44OX44Op44Kk44OZ44O844OI44OW44Op44Km44K6XFxu44KS44Kq44OV44Gr44GX44Gm6LW35YuV44GX44Gm5LiL44GV44GE44CCXCIsIHgsIHkqMiwgeSwgZnMsIFwieWVsbG93XCIpO1xuICAgICAgICB0aGlzLmRyYXcuZlRleHROKFwi44Gd44Gu5LuW44Gu5qmf56iu77yI44OW44Op44Km44K277yJ44Gn44GvXFxu44Ot44O844Kr44Or44K544OI44Os44O844K444G444Gu5L+d5a2Y44KSXFxu6Kix5Y+v44GZ44KL6Kit5a6a44Gr44GX44Gm5LiL44GV44GE44CCXCIsIHgsIHkqNCwgeSwgZnMsIFwieWVsbG93XCIpO1xuICAgICAgICB0aGlzLmRyYXcuZlRleHQoXCLjgZPjga7jgb7jgb7ntprjgZHjgovjgavjga/nlLvpnaLjgpLjgr/jg4Pjg5dcIiwgeCwgeSo1LjUsIGZzLCBcImxpbWVcIik7XG4gICAgICAgIGlmKHRoaXMubW91c2UudGFwQyAhPSAwKSBtYWluX2lkeCA9IDI7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDI6IC8v44Oh44Kk44Oz5Yem55CGXG4gICAgICAgIGlmKHN0b3BfZmxnID09IDApIHtcbiAgICAgICAgICB0aGlzLm1haW5sb29wKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmtleS5jbHIoKVxuICAgICAgICAgIG1haW5fdG1yLS1cbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLnNlLndhaXRfc2UgPiAwKSB0aGlzLnNlLndhaXRfc2UtLVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDogYnJlYWtcbiAgICB9XG4gICAgdmFyIHB0aW1lID0gRGF0ZS5ub3coKSAtIHN0aW1lO1xuICAgIGlmKHB0aW1lIDwgMCkgcHRpbWUgPSAwO1xuICAgIGlmKHB0aW1lID4gaW50KDEwMDAvRlBTKSkgcHRpbWUgPSBpbnQoMTAwMC9GUFMpO1xuXG4gICAgc2V0VGltZW91dCh0aGlzLnd3c1N5c01haW4uYmluZCh0aGlzKSwgaW50KDEwMDAvRlBTKS1wdGltZSk7XG4gIH1cblxuICB3d3NTeXNJbml0KCkge1xuICAgIHRoaXMuY2FudmFzLmluaXRDYW52YXMoKVxuICAgIGlmKCBOVUEuaW5kZXhPZignQW5kcm9pZCcpID4gMCApIHtcbiAgICAgIHRoaXMuZGV2aWNlLnR5cGUgPSBQVF9BbmRyb2lkO1xuICAgIH1cbiAgICBlbHNlIGlmKCBOVUEuaW5kZXhPZignaVBob25lJykgPiAwIHx8IE5VQS5pbmRleE9mKCdpUG9kJykgPiAwIHx8IE5VQS5pbmRleE9mKCdpUGFkJykgPiAwICkge1xuICAgICAgdGhpcy5kZXZpY2UudHlwZSA9IFBUX2lPUztcbiAgICAgIHdpbmRvdy5zY3JvbGxUbygwLDEpOy8vaVBob25l44GuVVJM44OQ44O844KS5raI44GZ5L2N572u44GrXG4gICAgfVxuICAgIGVsc2UgaWYoIE5VQS5pbmRleE9mKCdTaWxrJykgPiAwICkge1xuICAgICAgdGhpcy5kZXZpY2UudHlwZSA9IFBUX0tpbmRsZTtcbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5rZXkub24uYmluZCh0aGlzLmtleSkpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLmtleS5vZmYuYmluZCh0aGlzLmtleSkpXG5cbiAgICBpZihzdXBwb3J0VG91Y2ggPT0gdHJ1ZSkge1xuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMudG91Y2guc3RhcnQuYmluZCh0aGlzLnRvdWNoKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMudG91Y2gubW92ZS5iaW5kKHRoaXMudG91Y2gpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLnRvdWNoLmVuZC5iaW5kKHRoaXMudG91Y2gpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCB0aGlzLnRvdWNoLmNhbmNlbC5iaW5kKHRoaXMudG91Y2gpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLm1vdXNlLmRvd24uYmluZCh0aGlzLm1vdXNlKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMubW91c2UubW92ZS5iaW5kKHRoaXMubW91c2UpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMubW91c2UudXAuYmluZCh0aGlzLm1vdXNlKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgdGhpcy5tb3VzZS5vdXQuYmluZCh0aGlzLm1vdXNlKSlcbiAgICB9XG4gICAgdGhpcy53d3NTeXNNYWluKClcbiAgfVxufVxuIiwiaW1wb3J0IHtpbnQsIGxvZ30gZnJvbSBcIi4vVXRpbGl0eVwiXG5cbi8vIC0tLS0tLS0tLS0tLS3mj4/nlLvpnaIo44Kt44Oj44Oz44OQ44K5KS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBsZXQgQ1dJRFRIID0gODAwXG5leHBvcnQgbGV0IENIRUlHSFQgPSA2MDBcbmV4cG9ydCBsZXQgU0NBTEUgPSAxLjAgLy8g44K544Kx44O844Or5YCk6Kit5a6aK+OCv+ODg+ODl+S9jee9ruioiOeul+eUqFxuZXhwb3J0IGNsYXNzIENhbnZhcyB7XG5cbiAgcHVibGljIGN2czogSFRNTENhbnZhc0VsZW1lbnRcbiAgcHVibGljIGJnOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsXG4gIHB1YmxpYyBiYWtXOiBudW1iZXJcbiAgcHVibGljIGJha0g6IG51bWJlclxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY3ZzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnRcbiAgICB0aGlzLmJnID0gdGhpcy5jdnMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgdGhpcy5iYWtXID0gMFxuICAgIHRoaXMuYmFrSCA9IDBcbiAgfVxuICBpbml0Q2FudmFzKCkge1xuICAgIGxldCB3aW5XID0gd2luZG93LmlubmVyV2lkdGhcbiAgICBsZXQgd2luSCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIHRoaXMuYmFrVyA9IHdpbldcbiAgICB0aGlzLmJha0ggPSB3aW5IXG5cbiAgICBpZiggd2luSCA8ICh3aW5XICogQ0hFSUdIVCAvIENXSURUSCkgKSB7XG4gICAgICAvL3dpblcg44KS5q+U546H44Gr5ZCI44KP44Gb44Gm6Kq/5pW0XG4gICAgICB3aW5XID0gaW50KHdpbkggKiBDV0lEVEggLyBDSEVJR0hUKVxuICAgIH0gZWxzZSB7XG4gICAgICAvL3dpbkgg44KS5q+U546H44Gr5ZCI44KP44Gb44Gm6Kq/5pW0XG4gICAgICB3aW5IID0gaW50KHdpblcgKiBDSEVJR0hUIC8gQ1dJRFRIKVxuICAgIH1cblxuICAgIHRoaXMuY3ZzLndpZHRoID0gd2luV1xuICAgIHRoaXMuY3ZzLmhlaWdodCA9IHdpbkhcbiAgICBTQ0FMRSA9IHdpblcgLyBDV0lEVEhcblxuICAgIGlmKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5zY2FsZShTQ0FMRSwgU0NBTEUpXG4gICAgdGhpcy5iZy50ZXh0QWxpZ24gPSBcImNlbnRlclwiXG4gICAgdGhpcy5iZy50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiXG5cbiAgICBsb2coYHdpZHRoOiAke3dpbld9IGhlaWdodDoke3dpbkh9IHNjYWxlOiR7U0NBTEV9YClcbiAgICBsb2coYGlubmVyIHdpZHRoOiAke3dpbmRvdy5pbm5lcldpZHRofSBpbm5lciBoZWlnaHQ6JHt3aW5kb3cuaW5uZXJIZWlnaHR9YClcbiAgfVxuXG4gIGNhbnZhc1NpemUodzogbnVtYmVyLCBoOiBudW1iZXIpIHtcbiAgICBDV0lEVEggPSB3XG4gICAgQ0hFSUdIVCA9IGhcbiAgICB0aGlzLmluaXRDYW52YXMoKVxuICB9XG59XG4iLCIvL+err+acq+OBrueorumhnlxuZXhwb3J0IGxldCBQVF9QQ1x0XHQ9IDA7XG5leHBvcnQgbGV0IFBUX2lPU1x0XHQ9IDE7XG5leHBvcnQgbGV0IFBUX0FuZHJvaWRcdD0gMjtcbmV4cG9ydCBsZXQgUFRfS2luZGxlXHQ9IDM7XG5cbmV4cG9ydCBjbGFzcyBEZXZpY2Uge1xuICBwcml2YXRlIF90eXBlOiBudW1iZXJcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fdHlwZSA9IFBUX1BDXG4gIH1cbiAgZ2V0IHR5cGUoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3R5cGUgfVxuICBzZXQgdHlwZSh0eXBlOiBudW1iZXIpIHsgdGhpcy5fdHlwZSA9IHR5cGUgfVxufVxuIiwiaW1wb3J0IHsgaW50LCBsb2cgfSBmcm9tIFwiLi9VdGlsaXR5XCJcbmltcG9ydCB7IENXSURUSCwgQ0hFSUdIVCwgQ2FudmFzIH0gZnJvbSAnLi9DYW52YXMnXG5cbmV4cG9ydCBjbGFzcyBEcmF3IGV4dGVuZHMgQ2FudmFze1xuLy8gLS0tLS0tLS0tLS0tLeeUu+WDj+OBruiqreOBv+i+vOOBvy0tLS0tLS0tLS0tLS1cbiAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50W11cbiAgaW1nX2xvYWRlZDogQm9vbGVhbltdXG4gIGxpbmVfd2lkdGg6IG51bWJlclxuXG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuaW1nID0gbmV3IEFycmF5KDI1NilcbiAgICB0aGlzLmltZ19sb2FkZWQgPSBuZXcgQXJyYXkoMjU2KVxuICAgIHRoaXMubGluZV93aWR0aCA9IDFcbiAgfVxuXG4gIGxvYWRJbWcobjogbnVtYmVyLCBmaWxlbmFtZTogc3RyaW5nKSB7XG4gICAgLy9sb2coXCLnlLvlg49cIiArIG4gKyBcIiBcIiArIGZpbGVuYW1lICsgXCLoqq3jgb/ovrzjgb/plovlp4tcIilcbiAgICB0aGlzLmltZ19sb2FkZWRbbl0gPSBmYWxzZVxuICAgIHRoaXMuaW1nW25dID0gbmV3IEltYWdlKClcbiAgICB0aGlzLmltZ1tuXS5zcmMgPSBmaWxlbmFtZVxuICAgIHRoaXMuaW1nW25dLm9ubG9hZCA9ICgpID0+e1xuICAgICAgLy9sb2coXCLnlLvlg49cIiArIG4gKyBcIiBcIiArIGZpbGVuYW1lICsgXCLoqq3jgb/ovrzjgb/lrozkuoZcIilcbiAgICAgIHRoaXMuaW1nX2xvYWRlZFtuXSA9IHRydWVcbiAgICB9XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0t5o+P55S7MSDlm7PlvaItLS0tLS0tLS0tLS0tXG4gIHNldEFscChwYXI6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmJnKSB0aGlzLmJnLmdsb2JhbEFscGhhID0gcGFyLzEwMFxuICB9XG5cbiAgY29sb3JSR0IoY3I6IG51bWJlciwgY2c6IG51bWJlciwgY2I6IG51bWJlcikge1xuICAgIGNyID0gaW50KGNyKVxuICAgIGNnID0gaW50KGNnKVxuICAgIGNiID0gaW50KGNiKVxuICAgIHJldHVybiAoXCJyZ2IoXCIgKyBjciArIFwiLFwiICsgY2cgKyBcIixcIiArIGNiICsgXCIpXCIpXG4gIH1cblxuICBsaW5lVyh3aWQ6IG51bWJlcikgeyAvL+e3muOBruWkquOBleaMh+WumlxuICAgIHRoaXMubGluZV93aWR0aCA9IHdpZCAvL+ODkOODg+OCr+OCouODg+ODl1xuICAgIGlmKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5saW5lV2lkdGggPSB3aWRcbiAgICB0aGlzLmJnLmxpbmVDYXAgPSBcInJvdW5kXCJcbiAgICB0aGlzLmJnLmxpbmVKb2luID0gXCJyb3VuZFwiXG4gIH1cblxuICBsaW5lKHgwOiBudW1iZXIsIHkwOiBudW1iZXIsIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIGNvbDogc3RyaW5nKSB7XG4gICAgaWYodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLnN0cm9rZVN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5iZWdpblBhdGgoKVxuICAgIHRoaXMuYmcubW92ZVRvKHgwLCB5MClcbiAgICB0aGlzLmJnLmxpbmVUbyh4MSwgeTEpXG4gICAgdGhpcy5iZy5zdHJva2UoKVxuICB9XG5cbiAgZmlsbChjb2w6IHN0cmluZykge1xuICAgIGlmKHRoaXMuYmcpIHRoaXMuYmcuZmlsbFN0eWxlID0gY29sXG4gICAgaWYodGhpcy5iZykgdGhpcy5iZy5maWxsUmVjdCgwLCAwLCBDV0lEVEgsIENIRUlHSFQpXG4gIH1cblxuICBmUmVjdCh4Om51bWJlciwgeTpudW1iZXIsIHc6bnVtYmVyLCBoOm51bWJlcixjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5maWxsUmVjdCh4LCB5LCB3LCBoKVxuICB9XG5cbiAgc1JlY3QoeDpudW1iZXIsIHk6bnVtYmVyLCB3Om51bWJlciwgaDpudW1iZXIsY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLnN0cm9rZVN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5zdHJva2VSZWN0KHgsIHksIHcsIGgpXG4gIH1cblxuICBmQ2lyKHg6bnVtYmVyLCB5Om51bWJlciwgcjpudW1iZXIsY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IGNvbFxuICAgIHRoaXMuYmcuYmVnaW5QYXRoKClcbiAgICB0aGlzLmJnLmFyYyh4LCB5LCByLCAwLCBNYXRoLlBJKjIsIGZhbHNlKVxuICAgIHRoaXMuYmcuY2xvc2VQYXRoKClcbiAgICB0aGlzLmJnLmZpbGwoKVxuICB9XG5cbiAgc0Npcih4Om51bWJlciwgeTpudW1iZXIsIHI6bnVtYmVyLGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5zdHJva2VTdHlsZSA9IGNvbFxuICAgIHRoaXMuYmcuYmVnaW5QYXRoKClcbiAgICB0aGlzLmJnLmFyYyh4LCB5LCByLCAwLCBNYXRoLlBJKjIsIGZhbHNlKVxuICAgIHRoaXMuYmcuY2xvc2VQYXRoKClcbiAgICB0aGlzLmJnLnN0cm9rZSgpXG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0t5o+P55S7MiDnlLvlg48tLS0tLS0tLS0tLS0tXG4gIGRyYXdJbWcobjogbnVtYmVyLCB4OiBudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgaWYodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgeCwgeSlcbiAgfVxuXG4gIGRyYXdJbWdMUihuOiBudW1iZXIsIHg6IG51bWJlciwgeTpudW1iZXIpIHsgLy8g5bem5Y+z5Y+N6LuiXG4gICAgaWYodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBjb25zdCB3ID0gdGhpcy5pbWdbbl0ud2lkdGhcbiAgICBjb25zdCBoID0gdGhpcy5pbWdbbl0uaGVpZ2h0XG4gICAgaWYodGhpcy5iZykge1xuICAgICAgdGhpcy5iZy5zYXZlKClcbiAgICAgIHRoaXMuYmcudHJhbnNsYXRlKHgrdy8yLCB5K2gvMilcbiAgICAgIHRoaXMuYmcuc2NhbGUoLTEsIDEpXG4gICAgICB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgLXcvMiwgLWgvMilcbiAgICAgIHRoaXMuYmcucmVzdG9yZSgpXG4gICAgfVxuICB9XG5cbiAgLy/jgrvjg7Pjgr/jg6rjg7PjgrDooajnpLpcbiAgZHJhd0ltZ0MobjogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIGlmKHRoaXMuaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gICAgaWYgKHRoaXMuYmcpXG4gICAgICB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgeCAtIGludCh0aGlzLmltZ1tuXS53aWR0aC8yKSwgeSAtIGludCh0aGlzLmltZ1tuXS5oZWlnaHQvMikpXG4gIH1cblxuICAvL+aLoeWkp+e4ruWwj1xuICBkcmF3SW1nUyhuOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcikge1xuICAgIGlmKHRoaXMuaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gICAgaWYgKHRoaXMuYmcpIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCB4LCB5LCB3LCBoKVxuICB9XG4gIC8v5YiH44KK5Ye644GXICsg5ouh5aSn57iu5bCPXG4gIGRyYXdJbWdUUyhuOiBudW1iZXIsIHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIHN3OiBudW1iZXIsIHNoOiBudW1iZXIsIGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIGN3OiBudW1iZXIsIGNoOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBpZiAodGhpcy5iZykge1xuICAgICAgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIHN4LCBzeSwgc3csIHNoLCBjeCwgY3ksIGN3LCBjaClcbiAgICB9XG4gIH1cbiAgLy/lm57ou6JcbiAgZHJhd0ltZ1IobiA6bnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgYXJnOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBjb25zdCB3ID0gdGhpcy5pbWdbbl0ud2lkdGhcbiAgICBjb25zdCBoID0gdGhpcy5pbWdbbl0uaGVpZ2h0XG4gICAgaWYodGhpcy5iZykge1xuICAgICAgdGhpcy5iZy5zYXZlKClcbiAgICAgIHRoaXMuYmcudHJhbnNsYXRlKHgrdy8yLCB5K2gvMilcbiAgICAgIHRoaXMuYmcucm90YXRlKGFyZylcbiAgICAgIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCAtdy8yLCAtaC8yKVxuICAgICAgdGhpcy5iZy5yZXN0b3JlKClcbiAgICB9XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0t5o+P55S7MyDmloflrZctLS0tLS0tLS0tLS0tXG4gIGZUZXh0KHN0cjogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlciwgc2l6OiBudW1iZXIsIGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcpIHtcbiAgICAgIHRoaXMuYmcuZm9udCA9IGludChzaXopICsgXCJweCBib2xkIG1vbm9zcGFjZVwiXG4gICAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgdGhpcy5iZy5maWxsVGV4dChzdHIsIHgrMSwgeSsxKVxuICAgICAgdGhpcy5iZy5maWxsU3R5bGUgPSBjb2xcbiAgICAgIHRoaXMuYmcuZmlsbFRleHQoc3RyLCB4LCB5KVxuICAgIH1cbiAgfVxuXG4gIGZUZXh0TihzdHI6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIsIGg6IG51bWJlciwgc2l6OiBudW1iZXIsIGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgY29uc3Qgc24gPSBzdHIuc3BsaXQoXCJcXG5cIilcbiAgICB0aGlzLmJnLmZvbnQgPSBpbnQoc2l6KSArIFwicHggYm9sZCBtb25vc3BhY2VcIlxuICAgIGlmKHNuLmxlbmd0aCA9PSAxKSB7XG4gICAgICBoID0gMFxuICAgIH0gZWxzZSB7XG4gICAgICB5ID0geSAtIGludChoLzIpXG4gICAgICBoID0gaW50KGggLyAoc24ubGVuZ3RoIC0gMSkpXG4gICAgfVxuICAgIGZvciggbGV0IGkgPSAwOyBpIDwgc24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgICB0aGlzLmJnLmZpbGxUZXh0KHN0ciwgeCsxLCB5KzEpXG4gICAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IGNvbFxuICAgICAgdGhpcy5iZy5maWxsVGV4dChzdHIsIHgsIHkpXG4gICAgfVxuICB9XG4gIG1UZXh0V2lkdGgoc3RyOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICByZXR1cm4gdGhpcy5iZy5tZWFzdXJlVGV4dChzdHIpLndpZHRoXG4gIH1cbn1cbiIsImltcG9ydCB7IGludCwgbG9nLCBjb2RlVG9TdHIgfSBmcm9tIFwiLi9VdGlsaXR5XCJcbmltcG9ydCB7IFNFIH0gZnJvbSBcIi4vU291bmRcIlxuaW1wb3J0IHsgU0NBTEUgfSBmcm9tIFwiLi9DYW52YXNcIlxuaW1wb3J0IHsgRGV2aWNlLCBQVF9BbmRyb2lkIH0gZnJvbSBcIi4vRGV2aWNlXCJcblxuLy8gLS0tLS0tLS0tLSDjgr/jg4Pjg5flhaXlipsgLS0tLS0tLS0tLVxuZXhwb3J0IGNsYXNzIFRvdWNoIHtcblx0cHVibGljIHRhcFg6IG51bWJlclxuXHRwdWJsaWMgdGFwWTogbnVtYmVyXG5cdHB1YmxpYyB0YXBDOiBudW1iZXJcblx0cHJpdmF0ZSBfc2U6IFNFXG5cblx0Y29uc3RydWN0b3Ioc2U6IFNFKSB7XG5cdFx0dGhpcy5fc2UgPSBzZTtcblx0XHR0aGlzLnRhcFggPSAwO1xuXHRcdHRoaXMudGFwWSA9IDA7XG5cdFx0dGhpcy50YXBDID0gMDtcblx0fVxuXHRzdGFydChlOiBUb3VjaEV2ZW50KSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOy8v44Kt44Oj44Oz44OQ44K544Gu6YG45oqe77yP44K544Kv44Ot44O844Or562J44KS5oqR5Yi244GZ44KLXG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblx0XHRjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdHRoaXMudGFwWCA9IGUudG91Y2hlc1swXS5jbGllbnRYLXJlY3QubGVmdDtcblx0XHR0aGlzLnRhcFkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WS1yZWN0LnRvcDtcblx0XHR0aGlzLnRhcEMgPSAxO1xuXHRcdHRoaXMudHJhbnNmb3JtWFkoKTtcblx0XHRpZih0aGlzLl9zZS5zbmRfaW5pdCA9PSAwKSB0aGlzLl9zZS5sb2FkU291bmRTUGhvbmUoKTsvL+OAkOmHjeimgeOAkeOCteOCpuODs+ODieOBruiqreOBv+i+vOOBv1xuXHR9XG5cblx0bW92ZShlOiBUb3VjaEV2ZW50KSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG5cdFx0Y29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHR0aGlzLnRhcFggPSBlLnRvdWNoZXNbMF0uY2xpZW50WC1yZWN0LmxlZnQ7XG5cdFx0dGhpcy50YXBZID0gZS50b3VjaGVzWzBdLmNsaWVudFktcmVjdC50b3A7XG5cdFx0dGhpcy50cmFuc2Zvcm1YWSgpO1xuXHR9XG5cblx0ZW5kKGU6IFRvdWNoRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy50YXBDID0gMDsvL+KAu+ODnuOCpuOCueaTjeS9nOOBp+OBr21vdXNlT3V044GM44GT44KM44Gr44Gq44KLXG5cdH1cblxuXHRjYW5jZWwoZTogVG91Y2hFdmVudCkge1xuXHRcdHRoaXMudGFwWCA9IC0xO1xuXHRcdHRoaXMudGFwWSA9IC0xO1xuXHRcdHRoaXMudGFwQyA9IDA7XG5cdH1cblxuXHR0cmFuc2Zvcm1YWSgpIHsvL+Wun+W6p+aomeKGkuS7ruaDs+W6p+aomeOBuOOBruWkieaPm1xuXHRcdHRoaXMudGFwWCA9IGludCh0aGlzLnRhcFggLyBTQ0FMRSk7XG5cdFx0dGhpcy50YXBZID0gaW50KHRoaXMudGFwWSAvIFNDQUxFKTtcblx0fVxufVxuXG5cbi8vIC0tLS0tLS0tLS0tLS3jg57jgqbjgrnlhaXlipstLS0tLS0tLS0tLS0tXG5leHBvcnQgY2xhc3MgTW91c2Uge1xuXHRwdWJsaWMgdGFwWDpudW1iZXJcblx0cHVibGljIHRhcFk6bnVtYmVyXG5cdHB1YmxpYyB0YXBDOm51bWJlclxuXHRwcml2YXRlIF9zZTogU0VcblxuXHRjb25zdHJ1Y3RvcihzZTogU0UpIHtcblx0XHR0aGlzLl9zZSA9IHNlXG5cdFx0dGhpcy50YXBDID0gMFxuXHRcdHRoaXMudGFwWCA9IDBcblx0XHR0aGlzLnRhcFkgPSAwXG5cdH1cblxuXHRkb3duKGU6IE1vdXNlRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7Ly/jgq3jg6Pjg7Pjg5Djgrnjga7pgbjmip7vvI/jgrnjgq/jg63jg7zjg6vnrYnjgpLmipHliLbjgZnjgotcblx0XHRpZighIGUudGFyZ2V0KSByZXR1cm5cblx0XHRjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuXHRcdHZhciByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0dGhpcy50YXBYID0gZS5jbGllbnRYLXJlY3QubGVmdDtcblx0XHR0aGlzLnRhcFkgPSBlLmNsaWVudFktcmVjdC50b3A7XG5cdFx0dGhpcy50YXBDID0gMTtcblx0XHR0aGlzLnRyYW5zZm9ybVhZKClcblx0XHRpZih0aGlzLl9zZS5zbmRfaW5pdCA9PSAwKSB0aGlzLl9zZS5sb2FkU291bmRTUGhvbmUoKTsvL+OAkOmHjeimgeOAkeOCteOCpuODs+ODieOBruiqreOBv+i+vOOBv1xuXHR9XG5cblx0bW92ZShlOiBNb3VzZUV2ZW50KSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGlmKCEgZS50YXJnZXQpIHJldHVyblxuXHRcdGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG5cdFx0Y29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHRcdHRoaXMudGFwWCA9IGUuY2xpZW50WC1yZWN0LmxlZnQ7XG5cdFx0dGhpcy50YXBZID0gZS5jbGllbnRZLXJlY3QudG9wO1xuXHRcdHRoaXMudHJhbnNmb3JtWFkoKVxuXHR9XG5cblx0dXAoZTogTW91c2VFdmVudCkgeyB0aGlzLnRhcEMgPSAwOyB9XG5cdG91dChlOiBNb3VzZUV2ZW50KSB7IHRoaXMudGFwQyA9IDA7IH1cblxuXHR0cmFuc2Zvcm1YWSgpIHsvL+Wun+W6p+aomeKGkuS7ruaDs+W6p+aomeOBuOOBruWkieaPm1xuXHRcdHRoaXMudGFwWCA9IGludCh0aGlzLnRhcFggLyBTQ0FMRSk7XG5cdFx0dGhpcy50YXBZID0gaW50KHRoaXMudGFwWSAvIFNDQUxFKTtcblx0fVxufVxuXG4vLyAtLS0tLS0tLS0tIOWKoOmAn+W6puOCu+ODs+OCteODvCAtLS0tLS0tLS0tXG5leHBvcnQgY2xhc3MgQWNjIHtcblx0X2FjWCA9IDBcblx0X2FjWSA9IDBcblx0X2FjWiA9IDA7XG5cdF9kZXZpY2U6IERldmljZVxuXG5cdGNvbnN0cnVjdG9yKGRldmljZTogRGV2aWNlKSB7XG5cdFx0Ly93aW5kb3cub25kZXZpY2Vtb3Rpb24gPSBkZXZpY2VNb3Rpb247Ly/imIXimIXimIXml6dcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZW1vdGlvblwiLCB0aGlzLmRldmljZU1vdGlvbik7XG5cdFx0dGhpcy5fZGV2aWNlID0gZGV2aWNlXG5cdH1cblxuXHRkZXZpY2VNb3Rpb24oZTogRGV2aWNlTW90aW9uRXZlbnQpIHtcblx0XHR2YXIgYUlHOiBEZXZpY2VNb3Rpb25FdmVudEFjY2VsZXJhdGlvbiB8IG51bGwgPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHk7XG5cdFx0aWYgKGFJRyA9PSBudWxsKSByZXR1cm47XG5cdFx0aWYoYUlHLngpIHRoaXMuX2FjWCA9IGludChhSUcueCk7XG5cdFx0aWYoYUlHLnkpIHRoaXMuX2FjWSA9IGludChhSUcueSk7XG5cdFx0aWYoYUlHLnopIHRoaXMuX2FjWiA9IGludChhSUcueik7XG5cdFx0aWYodGhpcy5fZGV2aWNlLnR5cGUgPT0gUFRfQW5kcm9pZCkgey8vQW5kcm9pZCDjgaggaU9TIOOBp+ato+iyoOOBjOmAhuOBq+OBquOCi1xuXHRcdFx0dGhpcy5fYWNYID0gLXRoaXMuX2FjWDtcblx0XHRcdHRoaXMuX2FjWSA9IC10aGlzLl9hY1k7XG5cdFx0XHR0aGlzLl9hY1ogPSAtdGhpcy5fYWNaO1xuXHRcdH1cblx0fVxufVxuXG4vL+OCreODvOWFpeWKm+eUqFxuZXhwb3J0IGNsYXNzIEtleSB7XG5cdHB1YmxpYyBfc2U6IFNFXG5cdHB1YmxpYyBpbmtleTogbnVtYmVyXG5cdHB1YmxpYyBrZXk6IG51bWJlcltdXG5cblx0Y29uc3RydWN0b3Ioc2U6IFNFKSB7XG5cdFx0dGhpcy5pbmtleSA9IDBcblx0XHR0aGlzLmtleSA9IG5ldyBBcnJheSgyNTYpO1xuXHRcdHRoaXMuX3NlID0gc2Vcblx0fVxuXG5cdGNscigpIHtcblx0XHR0aGlzLmlua2V5ID0gMDtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHRoaXMua2V5W2ldID0gMDtcblx0fVxuXG5cdG9uKGU6IEtleWJvYXJkRXZlbnQpIHtcblx0XHQvL2xvZyggYCR7ZS5rZXl9IDogJHtlLmNvZGV9IDogJHtlLmtleUNvZGV9IDogJHtjb2RlVG9TdHIoZS5jb2RlKX1gIClcblxuXHRcdGlmKHRoaXMuX3NlLnNuZF9pbml0ID09IDApIHRoaXMuX3NlLmxvYWRTb3VuZFNQaG9uZSgpOy8v44CQ6YeN6KaB44CR44K144Km44Oz44OJ44Gu6Kqt44G/6L6844G/XG5cdFx0dGhpcy5pbmtleSA9IGNvZGVUb1N0cihlLmNvZGUpXG5cdFx0dGhpcy5rZXlbY29kZVRvU3RyKGUuY29kZSldKytcblx0fVxuXG5cdG9mZihlOiBLZXlib2FyZEV2ZW50KSB7XG5cdFx0dGhpcy5pbmtleSA9IDA7XG5cdFx0dGhpcy5rZXlbY29kZVRvU3RyKGUuY29kZSldID0gMDtcblx0fVxufVxuIiwiLy8gLS0tLS0tLS0tLS0tLeOCteOCpuODs+ODieWItuW+oS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBsZXQgIFNPVU5EX09OID0gdHJ1ZVxuZXhwb3J0IGNsYXNzIFNFIHtcbiAgcHVibGljIHdhaXRfc2U6IG51bWJlciA9IDBcbiAgcHVibGljIHNuZF9pbml0OiBudW1iZXIgPSAwXG4gIHNvdW5kRmlsZTogSFRNTEF1ZGlvRWxlbWVudFtdXG4gIGlzQmdtOiBudW1iZXJcbiAgYmdtTm86IG51bWJlclxuICBzZU5vOm51bWJlclxuXG4gIHNvdW5kbG9hZGVkOiBudW1iZXJcbiAgc2ZfbmFtZTogc3RyaW5nW11cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvL+OCteOCpuODs+ODieODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCk+OBoOOBiyjjgrnjg57jg5vlr77nrZYpXG4gICAgdGhpcy53YWl0X3NlID0gMFxuICAgIHRoaXMuc25kX2luaXQgPSAwXG4gICAgdGhpcy5zb3VuZEZpbGUgPSBuZXcgQXJyYXkoMjU2KVxuICAgIHRoaXMuaXNCZ20gPSAtMVxuICAgIHRoaXMuYmdtTm8gPSAwXG4gICAgdGhpcy5zZU5vID0gLTFcbiAgICB0aGlzLnNvdW5kbG9hZGVkID0gMCAvL+OBhOOBj+OBpOODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCk+OBoOOBi1xuICAgIHRoaXMuc2ZfbmFtZSA9IG5ldyBBcnJheSgyNTYpXG4gIH1cblxuICBsb2FkU291bmRTUGhvbmUoKSB7Ly/jgrnjg57jg5vjgafjg5XjgqHjgqTjg6vjgpLoqq3jgb/ovrzjgoBcbiAgICB0cnkge1xuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuc291bmRsb2FkZWQ7IGkrKykge1xuICAgICAgICB0aGlzLnNvdW5kRmlsZVtpXSA9IG5ldyBBdWRpbyh0aGlzLnNmX25hbWVbaV0pXG4gICAgICAgIHRoaXMuc291bmRGaWxlW2ldLmxvYWQoKVxuICAgICAgfVxuICAgIH0gY2F0Y2goZSkge1xuICAgIH1cbiAgICB0aGlzLnNuZF9pbml0ID0gMiAvL+OCueODnuODm+OBp+ODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCk+OBoFxuICB9XG5cbiAgbG9hZFNvdW5kKG46IG51bWJlciwgZmlsZW5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuc2ZfbmFtZVtuXSA9IGZpbGVuYW1lXG4gICAgdGhpcy5zb3VuZGxvYWRlZCsrXG4gIH1cblxuICBwbGF5U0UobjogbnVtYmVyKSB7XG4gICAgaWYoU09VTkRfT04gPT0gZmFsc2UpIHJldHVyblxuICAgIGlmKHRoaXMuaXNCZ20gPT0gMikgcmV0dXJuXG4gICAgaWYodGhpcy53YWl0X3NlID09IDApIHtcbiAgICAgIHRoaXMuc2VObyA9IG5cbiAgICAgIHRoaXMuc291bmRGaWxlW25dLmN1cnJlbnRUaW1lID0gMFxuICAgICAgdGhpcy5zb3VuZEZpbGVbbl0ubG9vcCA9IGZhbHNlXG4gICAgICB0aGlzLnNvdW5kRmlsZVtuXS5wbGF5KClcbiAgICAgIHRoaXMud2FpdF9zZSA9IDMgLy/jg5bjg6njgqbjgrbjgavosqDojbfjgpLjgYvjgZHjgarjgYTjgojjgYbjgavpgKPntprjgZfjgabmtYHjgZXjgarjgYTjgojjgYbjgavjgZnjgotcbiAgICB9XG4gIH1cbn0iLCIvLyAtLS0tLS0tLS0tLS0t5ZCE56iu44Gu6Zai5pWwLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhtc2c6IHN0cmluZykge1xuICBjb25zb2xlLmxvZyhtc2cpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnQodmFsOiBudW1iZXIpOiBudW1iZXIge1xuICBsZXQgbnVtID0gU3RyaW5nKHZhbClcbiAgcmV0dXJuIHBhcnNlSW50KG51bSkgLy/jg5fjg6njgrnjg57jgqTjg4rjgrnjganjgaHjgonjgoLlsI/mlbDpg6jliIbjgpLliIfjgormjajjgaZcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cih2YWw6IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBTdHJpbmcodmFsKVxufVxuZXhwb3J0IGZ1bmN0aW9uIHJuZChtYXg6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBpbnQoTWF0aC5yYW5kb20oKSAqIG1heClcbn1cbmV4cG9ydCBmdW5jdGlvbiBhYnModmFsOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5hYnModmFsKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29zKGE6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmNvcyhNYXRoLlBJICogMiAqIGEgLyAzNjApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaW4oYTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguc2luKE1hdGguUEkgKiAyICogYSAvIDM2MClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERpcyh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh4MiAtIHgxLCAyKSArIE1hdGgucG93KHkyIC0geTEsIDIpKVxufVxuXG5cbi8vIC0tLS0tLS0tLS0g44Kt44O85YWl5Yqb44Kt44O844Gu44Oe44OD44OU44Oz44KwKGtleUNvZGUg44GM6Z2e5o6o5aWo44Gu44Gf44KBKSAtLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gY29kZVRvU3RyKGNvZGU6IHN0cmluZyk6IG51bWJlciB7XG4gIGxldCBjaGFyQ29kZTogbnVtYmVyID0gMFxuICBzd2l0Y2goY29kZSkge1xuICAgIGNhc2UgXCJLZXlBXCI6IGNoYXJDb2RlID0gNjU7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlCXCI6IGNoYXJDb2RlID0gNjY7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlDXCI6IGNoYXJDb2RlID0gNjc7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlEXCI6IGNoYXJDb2RlID0gNjg7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlFXCI6IGNoYXJDb2RlID0gNjk7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlGXCI6IGNoYXJDb2RlID0gNzA7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlHXCI6IGNoYXJDb2RlID0gNzE7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlIXCI6IGNoYXJDb2RlID0gNzI7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlJXCI6IGNoYXJDb2RlID0gNzM7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlKXCI6IGNoYXJDb2RlID0gNzQ7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlLXCI6IGNoYXJDb2RlID0gNzU7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlMXCI6IGNoYXJDb2RlID0gNzY7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlNXCI6IGNoYXJDb2RlID0gNzc7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlOXCI6IGNoYXJDb2RlID0gNzg7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlPXCI6IGNoYXJDb2RlID0gNzk7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlQXCI6IGNoYXJDb2RlID0gODA7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlRXCI6IGNoYXJDb2RlID0gODE7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlSXCI6IGNoYXJDb2RlID0gODI7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlTXCI6IGNoYXJDb2RlID0gODM7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlUXCI6IGNoYXJDb2RlID0gODQ7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlVXCI6IGNoYXJDb2RlID0gODU7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlWXCI6IGNoYXJDb2RlID0gODY7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlXXCI6IGNoYXJDb2RlID0gODc7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlYXCI6IGNoYXJDb2RlID0gODg7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlZXCI6IGNoYXJDb2RlID0gODk7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlaXCI6IGNoYXJDb2RlID0gOTA7IGJyZWFrO1xuXG4gICAgY2FzZSBcIlNwYWNlXCI6IGNoYXJDb2RlID0gMzI7IGJyZWFrO1xuICAgIGNhc2UgXCJBcnJvd0xlZnRcIjogY2hhckNvZGUgPSAzNzsgYnJlYWs7XG4gICAgY2FzZSBcIkFycm93VXBcIjogY2hhckNvZGUgPSAzODsgYnJlYWs7XG4gICAgY2FzZSBcIkFycm93UmlnaHRcIjogY2hhckNvZGUgPSAzOTsgYnJlYWs7XG4gICAgY2FzZSBcIkFycm93RG93blwiOiBjaGFyQ29kZSA9IDQwOyBicmVhaztcbiAgfVxuICByZXR1cm4gY2hhckNvZGVcbn1cblxuZXhwb3J0IGNvbnN0IEtFWV9OQU1FID0ge1xuXHRcIkVOVEVSXCIgOiAxMyxcblx0XCJTUEFDRVwiIDogMzIsXG5cdFwiTEVGVFwiICA6IDM3LFxuXHRcIlVQXCIgICAgOiAzOCxcblx0XCJSSUdIVFwiIDogMzksXG5cdFwiRE9XTlwiICA6IDQwLFxuXHRcImFcIiAgICAgOiA2NSxcblx0XCJ6XCIgICAgIDogOTBcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBNTVMgfSBmcm9tICcuL1dXUydcbmltcG9ydCB7IGdldERpcywgS0VZX05BTUUsIGxvZywgcm5kIH0gZnJvbSAnLi9XV1NsaWIvVXRpbGl0eSdcblxuY29uc3QgTVNMX01BWCA9IDEwMFxuY29uc3QgT0JKX01BWCA9IDEwMFxuY29uc3QgRUZDVF9NQVggPSAxMDBcbmNsYXNzIE15R2FtZSBleHRlbmRzIE1NUyB7XG4gIC8v6Ieq5qmf44Gu566h55CGXG4gIGJnWDogbnVtYmVyID0gMFxuICBzc1g6IG51bWJlciA9IDBcbiAgc3NZOiBudW1iZXIgPSAwXG4gIC8v6Ieq5qmf44GM5omT44Gk5by+44Gu566h55CGXG4gIG1zbE51bTogbnVtYmVyID0gMFxuICBtc2xYOiBudW1iZXJbXSA9IG5ldyBBcnJheShNU0xfTUFYKVxuICBtc2xZOiBudW1iZXJbXSA9IG5ldyBBcnJheShNU0xfTUFYKVxuICBtc2xYcDogbnVtYmVyW10gPSBuZXcgQXJyYXkoTVNMX01BWClcbiAgbXNsWXA6IG51bWJlcltdID0gbmV3IEFycmF5KE1TTF9NQVgpXG4gIG1zbEY6IGJvb2xlYW5bXSA9IG5ldyBBcnJheShNU0xfTUFYKVxuICBhdXRvbWE6IG51bWJlciA9IDAgLy/lvL7jga7oh6rli5XnmbrlsIRcbiAgdG1yOiBudW1iZXIgPSAwIC8v44K/44Kk44Oe44O8XG4gIGVuZXJneTogbnVtYmVyID0gMCAvL+OCqOODjeODq+OCruODvFxuICBtdXRla2k6IG51bWJlciA9IDAgLy/nhKHmlbXnirbmhYtcblxuICAvL+eJqeS9k+OBrueuoeeQhuOAgOaVteapn+OAgeaVteOBruW8vuOCkueuoeeQhlxuICBvYmpUeXBlOiBudW1iZXJbXSA9IG5ldyBBcnJheShPQkpfTUFYKSAvL29ialR5cGU6IDA65pW15qmf44CAMTrmlbXjga7lvL5cbiAgb2JqSW1nOiBudW1iZXJbXSA9IG5ldyBBcnJheShPQkpfTUFYKVxuICBvYmpYOiBudW1iZXJbXSA9IG5ldyBBcnJheShPQkpfTUFYKVxuICBvYmpZOiBudW1iZXJbXSA9IG5ldyBBcnJheShPQkpfTUFYKVxuICBvYmpYcDogbnVtYmVyW10gPSBuZXcgQXJyYXkoT0JKX01BWClcbiAgb2JqWXA6IG51bWJlcltdID0gbmV3IEFycmF5KE9CSl9NQVgpXG4gIG9iakY6IGJvb2xlYW5bXSA9IG5ldyBBcnJheShPQkpfTUFYKVxuICBvYmpOdW06IG51bWJlciA9IDBcblxuICAvL+OCqOODleOCp+OCr+ODiOOBrueuoeeQhlxuICBlZmN0WDogbnVtYmVyW10gPSBuZXcgQXJyYXkoT0JKX01BWClcbiAgZWZjdFk6IG51bWJlcltdID0gbmV3IEFycmF5KE9CSl9NQVgpXG4gIGVmY3ROOiBudW1iZXJbXSA9IG5ldyBBcnJheShPQkpfTUFYKVxuICBlZmN0TnVtOiBudW1iZXIgPSAwXG5cbiAgY29uc3RydWN0b3IoKXtcbiAgICBzdXBlcigpXG4gIH1cbiAgY2xyS2V5KCk6IHZvaWQge31cbiAgc2V0dXAoKTogdm9pZCB7XG4gICAgdGhpcy5jYW52YXMuY2FudmFzU2l6ZSgxMjAwLCA3MjApXG4gICAgdGhpcy5kcmF3LmxvYWRJbWcoMCwgXCJpbWFnZTIvYmcucG5nXCIpXG4gICAgdGhpcy5kcmF3LmxvYWRJbWcoMSwgXCJpbWFnZTIvc3BhY2VzaGlwLnBuZ1wiKVxuICAgIHRoaXMuZHJhdy5sb2FkSW1nKDIsIFwiaW1hZ2UyL21pc3NpbGUucG5nXCIpXG4gICAgdGhpcy5kcmF3LmxvYWRJbWcoMywgJ2ltYWdlMi9leHBsb2RlLnBuZycpXG4gICAgdGhpcy5kcmF3LmxvYWRJbWcoNCwgJ2ltYWdlMi9lbmVteTAucG5nJylcbiAgICB0aGlzLmRyYXcubG9hZEltZyg1LCAnaW1hZ2UyL2VuZW15MS5wbmcnKVxuICAgIHRoaXMuaW5pdFNTaGlwKClcbiAgICB0aGlzLmluaXRNaXNzaWxlKClcbiAgICB0aGlzLmluaXRPamVjdCgpXG4gICAgdGhpcy5pbml0RWZmZWN0KClcbiAgfVxuICBtYWlubG9vcCgpOiB2b2lkIHtcbiAgICB0aGlzLnRtcisrXG4gICAgdGhpcy5kcmF3QkcoMSlcbiAgICB0aGlzLm1vdmVTU2hpcCgpXG4gICAgdGhpcy5tb3ZlTWlzc2lsZSgpXG4gICAgaWYodGhpcy50bXIgJSAzMCA9PSAwKXtcbiAgICAgIHRoaXMuc2V0T2plY3QoMSwgNSwgMTIwMCwgcm5kKDcwMCksIC0xMiwgMClcbiAgICB9XG4gICAgdGhpcy5tb3ZlT2plY3QoKVxuICAgIHRoaXMuZHJhd0VmZmVjdCgpXG4gICAgZm9yKGxldCBpPTA7IGk8MTA7IGkrKykgdGhpcy5kcmF3LmZSZWN0KDIwICsgaSozMCwgNjYwLCAyMCwgNDAsIFwiI2MwMDAwMFwiKVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmVuZXJneTsgaSsrKVxuICAgICAgdGhpcy5kcmF3LmZSZWN0KDIwICsgaSozMCwgNjYwLCAyMCwgNDAsIHRoaXMuZHJhdy5jb2xvclJHQigxNjAtMTYqaSwgMjQwLTEyKmksIDI0KmkpKVxuICB9XG5cbiAgZHJhd0JHKHNwZWVkOiBudW1iZXIpIHtcbiAgICB0aGlzLmJnWCA9ICh0aGlzLmJnWCArIHNwZWVkKSAlIDEyMDBcbiAgICB0aGlzLmRyYXcuZHJhd0ltZygwLCAtdGhpcy5iZ1gsIDApXG4gICAgdGhpcy5kcmF3LmRyYXdJbWcoMCwgMTIwMCAtIHRoaXMuYmdYLCAwKVxuICB9XG5cbiAgaW5pdFNTaGlwKCkge1xuICAgIHRoaXMuc3NYID0gNDAwXG4gICAgdGhpcy5zc1kgPSAzNjBcbiAgICB0aGlzLmVuZXJneSA9IDEwXG4gIH1cblxuICBtb3ZlU1NoaXAoKSB7XG4gICAgaWYodGhpcy5rZXkua2V5W0tFWV9OQU1FLkxFRlRdID4gMCAmJiB0aGlzLnNzWCA+IDYwKSB0aGlzLnNzWCAtPSAyMFxuICAgIGlmKHRoaXMua2V5LmtleVtLRVlfTkFNRS5SSUdIVF0gPiAwICYmIHRoaXMuc3NYIDwgMTAwMCkgdGhpcy5zc1ggKz0gMjBcbiAgICBpZih0aGlzLmtleS5rZXlbS0VZX05BTUUuVVBdID4gMCAmJiB0aGlzLnNzWSA+IDQwKSB0aGlzLnNzWSAtPSAyMFxuICAgIGlmKHRoaXMua2V5LmtleVtLRVlfTkFNRS5ET1dOXSA+IDAgJiYgdGhpcy5zc1kgPCA2ODApIHRoaXMuc3NZICs9IDIwXG4gICAgaWYodGhpcy5rZXkua2V5W0tFWV9OQU1FLmFdID09IDEpIHtcbiAgICAgIHRoaXMua2V5LmtleVtLRVlfTkFNRS5hXSArPSAxXG4gICAgICB0aGlzLmF1dG9tYSA9IDEgLSB0aGlzLmF1dG9tYVxuICAgIH1cbiAgICBpZih0aGlzLmF1dG9tYSA9PSAwICYmIHRoaXMua2V5LmtleVtLRVlfTkFNRS5TUEFDRV0gPT0gMSkge1xuICAgICAgdGhpcy5rZXkua2V5W0tFWV9OQU1FLlNQQUNFXSArPSAxXG4gICAgICB0aGlzLnNldE1pc3NpbGUodGhpcy5zc1ggKyA0MCwgdGhpcy5zc1ksIDQwLCAwKVxuICAgIH1cbiAgICBpZih0aGlzLmF1dG9tYSA9PSAxICYmIHRoaXMudG1yICUgOCA9PSAwKVxuICAgICAgdGhpcy5zZXRNaXNzaWxlKHRoaXMuc3NYICsgNDAsIHRoaXMuc3NZLCA0MCwgMClcbiAgICBsZXQgY29sID0gXCJibGFja1wiXG4gICAgaWYodGhpcy5hdXRvbWEgPT0gMSkgY29sID0gXCJ3aGl0ZVwiXG4gICAgdGhpcy5kcmF3LmZSZWN0KDkwMCwgMjAsIDI4MCwgNjAsIFwiYmx1ZVwiKVxuICAgIHRoaXMuZHJhdy5mVGV4dChcIltBXXV0byBNaXNzaWxlXCIsIDEwNDAsIDUwLCAzNiwgY29sKVxuICAgIGlmKHRoaXMubXV0ZWtpICUgMiA9PSAwKVxuICAgICAgdGhpcy5kcmF3LmRyYXdJbWdDKDEsIHRoaXMuc3NYLCB0aGlzLnNzWSlcbiAgICBpZih0aGlzLm11dGVraSA+IDApIHRoaXMubXV0ZWtpLS1cbiAgfVxuXG4gIGluaXRNaXNzaWxlKCkge1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBNU0xfTUFYOyBpKyspIHRoaXMubXNsRltpXSA9IGZhbHNlXG4gICAgdGhpcy5tc2xOdW0gPSAwXG5cbiAgfVxuICBzZXRNaXNzaWxlKHg6IG51bWJlciwgeTogbnVtYmVyLCB4cDogbnVtYmVyLCB5cDogbnVtYmVyKSB7XG4gICAgdGhpcy5tc2xYW3RoaXMubXNsTnVtXSA9IHhcbiAgICB0aGlzLm1zbFlbdGhpcy5tc2xOdW1dID0geVxuICAgIHRoaXMubXNsWHBbdGhpcy5tc2xOdW1dID0geHBcbiAgICB0aGlzLm1zbFlwW3RoaXMubXNsTnVtXSA9IHlwXG4gICAgdGhpcy5tc2xGW3RoaXMubXNsTnVtXSA9IHRydWVcbiAgICB0aGlzLm1zbE51bSA9ICh0aGlzLm1zbE51bSArIDEpICUgTVNMX01BWFxuICB9XG5cbiAgbW92ZU1pc3NpbGUoKSB7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IE1TTF9NQVg7IGkrKykge1xuICAgICAgaWYodGhpcy5tc2xGW2ldID09IHRydWUpIHtcbiAgICAgICAgdGhpcy5tc2xYW2ldICs9IHRoaXMubXNsWHBbaV1cbiAgICAgICAgdGhpcy5tc2xZW2ldICs9IHRoaXMubXNsWXBbaV1cbiAgICAgICAgdGhpcy5kcmF3LmRyYXdJbWdDKDIsIHRoaXMubXNsWFtpXSwgdGhpcy5tc2xZW2ldKVxuICAgICAgICBpZih0aGlzLm1zbFhbaV0gPiAxMjAwKSB0aGlzLm1zbEZbaV0gPSBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGluaXRPamVjdCgpIHtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgT0JKX01BWDsgaSsrKSB7XG4gICAgICB0aGlzLm9iakZbaV0gPSBmYWxzZVxuICAgIH1cbiAgICB0aGlzLm9iak51bSA9IDBcbiAgfVxuXG4gIHNldE9qZWN0KHR5cDogbnVtYmVyLCBwbmc6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHhwOiBudW1iZXIsIHlwOiBudW1iZXIpIHtcbiAgICB0aGlzLm9ialR5cGVbdGhpcy5vYmpOdW1dID0gdHlwXG4gICAgdGhpcy5vYmpJbWdbdGhpcy5vYmpOdW1dID0gcG5nXG4gICAgdGhpcy5vYmpYW3RoaXMub2JqTnVtXSA9IHhcbiAgICB0aGlzLm9iallbdGhpcy5vYmpOdW1dID0geVxuICAgIHRoaXMub2JqWHBbdGhpcy5vYmpOdW1dID0geHBcbiAgICB0aGlzLm9iallwW3RoaXMub2JqTnVtXSA9IHlwXG4gICAgdGhpcy5vYmpGW3RoaXMub2JqTnVtXSA9IHRydWVcbiAgICB0aGlzLm9iak51bSA9ICh0aGlzLm9iak51bSArIDEpICUgT0JKX01BWFxuICB9XG5cbiAgbW92ZU9qZWN0KCkge1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBPQkpfTUFYOyBpKyspIHtcbiAgICAgIGlmKHRoaXMub2JqRltpXSA9PSB0cnVlKSB7XG4gICAgICAgIHRoaXMub2JqWFtpXSArPSB0aGlzLm9ialhwW2ldXG4gICAgICAgIHRoaXMub2JqWVtpXSArPSB0aGlzLm9iallwW2ldXG4gICAgICAgIHRoaXMuZHJhdy5kcmF3SW1nQyh0aGlzLm9iakltZ1tpXSwgdGhpcy5vYmpYW2ldLCB0aGlzLm9iallbaV0pXG4gICAgICAgIGlmKHRoaXMub2JqVHlwZVtpXSA9PSAxICYmIHJuZCgxMDApIDwgMykge1xuICAgICAgICAgIHRoaXMuc2V0T2plY3QoMCwgNCwgdGhpcy5vYmpYW2ldLCB0aGlzLm9iallbaV0sIC0yNCwgMClcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLm9ialhbaV0gPCAwKSB0aGlzLm9iakZbaV0gPSBmYWxzZVxuICAgICAgICAvL+iHquapn+OBjOaSg+OBo+OBn+W8vuOBqOODkuODg+ODiOODgeOCp+ODg+OCr1xuICAgICAgICBpZih0aGlzLm9ialR5cGVbaV0gPT0gMSkge1xuICAgICAgICAgIGNvbnN0IHIgPSAxMiArICh0aGlzLmRyYXcuaW1nW3RoaXMub2JqSW1nW2ldXS53aWR0aCArIHRoaXMuZHJhdy5pbWdbdGhpcy5vYmpJbWdbaV1dLmhlaWdodCkgLyA0XG4gICAgICAgICAgZm9yKGxldCBuID0gMDsgbiA8IE1TTF9NQVg7IG4rKykge1xuICAgICAgICAgICAgaWYodGhpcy5tc2xGW25dID09IHRydWUpIHtcbiAgICAgICAgICAgICAgaWYoZ2V0RGlzKHRoaXMub2JqWFtpXSwgdGhpcy5vYmpZW2ldLCB0aGlzLm1zbFhbbl0sIHRoaXMubXNsWVtuXSkgPCByKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZmZlY3QodGhpcy5vYmpYW2ldLCB0aGlzLm9iallbaV0sIDkpXG4gICAgICAgICAgICAgICAgdGhpcy5vYmpGW2ldID0gZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL+iHquapn+OBqOOBruODkuODg+ODiOODgeOCp+ODg+OCr1xuICAgICAgICBjb25zdCByID0gMzAgKyAodGhpcy5kcmF3LmltZ1t0aGlzLm9iakltZ1tpXV0ud2lkdGggKyB0aGlzLmRyYXcuaW1nW3RoaXMub2JqSW1nW2ldXS5oZWlnaHQpIC8gNFxuICAgICAgICBpZihnZXREaXModGhpcy5vYmpYW2ldLCB0aGlzLm9iallbaV0sIHRoaXMuc3NYLCB0aGlzLnNzWSkgPCByKSB7XG4gICAgICAgICAgaWYodGhpcy5vYmpUeXBlW2ldIDw9IDEgJiYgdGhpcy5tdXRla2kgPT0gMCkgey8v5pW144Gu5by+44Go5pW15qmfXG4gICAgICAgICAgICB0aGlzLm9iakZbaV0gPSBmYWxzZVxuICAgICAgICAgICAgdGhpcy5lbmVyZ3kgLT0gMVxuICAgICAgICAgICAgdGhpcy5tdXRla2kgPSAzMFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGluaXRFZmZlY3QoKSB7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IEVGQ1RfTUFYOyBpKyspIHtcbiAgICAgIHRoaXMuZWZjdE5baV0gPSAwXG4gICAgfVxuICAgIHRoaXMuZWZjdE51bSA9IDBcbiAgfVxuXG4gIHNldEVmZmVjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgbjpudW1iZXIpIHtcbiAgICB0aGlzLmVmY3RYW3RoaXMuZWZjdE51bV0gPSB4XG4gICAgdGhpcy5lZmN0WVt0aGlzLmVmY3ROdW1dID0geVxuICAgIHRoaXMuZWZjdE5bdGhpcy5lZmN0TnVtXSA9IG5cbiAgICB0aGlzLmVmY3ROdW0gPSAodGhpcy5lZmN0TnVtICsgMSkgJSBFRkNUX01BWFxuICB9XG5cbiAgZHJhd0VmZmVjdCgpIHtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgRUZDVF9NQVg7IGkrKykge1xuICAgICAgaWYodGhpcy5lZmN0TltpXSA+IDApIHtcbiAgICAgICAgdGhpcy5kcmF3LmRyYXdJbWdUUygzLCAoOS10aGlzLmVmY3ROW2ldKSAqIDEyOCwgMCwgMTI4LCAxMjgsIHRoaXMuZWZjdFhbaV0tNjQsIHRoaXMuZWZjdFlbaV0tNjQsIDEyOCwgMTI4KVxuICAgICAgICB0aGlzLmVmY3ROW2ldLS1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXG5cbm5ldyBNeUdhbWUoKVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9