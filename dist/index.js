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
        this.acc = new Event_1.Acc(this.device);
        this.frameSec = (0, Utility_1.int)(1000 / FPS);
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
        if (ptime > this.frameSec)
            ptime = (0, Utility_1.int)(ptime / this.frameSec) * this.frameSec;
        if (exports.DEBUG) { //★★★デバッグ
            let i;
            let x = 240;
            let y;
            this.draw.fText("処理時間=" + (ptime), x, 50, 16, "lime");
            this.draw.fText(`deviceType= ${this.device.type}`, x, 100, 16, "yellow");
            //this.draw.fText(`isBgm= ${isBgm} (${bgmNo})`, x, 150, 16, "yellow");
            this.draw.fText(`winW=${this.canvas.winW} winH=${this.canvas.winH} SCALE= ${Canvas_1.SCALE}`, x, 200, 16, "yellow");
            this.draw.fText(`${main_idx} : ${main_tmr} (${this.touch.tapX} ${this.touch.tapY}) ${this.touch.tapC}`, x, 250, 16, "cyan");
            this.draw.fText(`加速度 ${this.acc.acX} : ${this.acc.acY} : ${this.acc.acZ}`, x, 300, 16, "pink");
            for (i = 0; i < 256; i++) {
                x = i % 16;
                y = (0, Utility_1.int)(i / 16);
                this.draw.fText(`${this.key.key[i]}`, 15 + 30 * x, 15 + 30 * y, 12, "white");
            }
        }
        console.log(`${ptime}`);
        setTimeout(this.wwsSysMain.bind(this), this.frameSec - ptime);
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
        this.winW = 0;
        this.winH = 0;
        this.bakW = 0;
        this.bakH = 0;
    }
    initCanvas() {
        this.winW = window.innerWidth;
        this.winH = window.innerHeight;
        this.bakW = this.winW;
        this.bakH = this.winH;
        if (this.winH < (this.winW * exports.CHEIGHT / exports.CWIDTH)) {
            //winW を比率に合わせて調整
            this.winW = (0, Utility_1.int)(this.winH * exports.CWIDTH / exports.CHEIGHT);
        }
        else {
            //winH を比率に合わせて調整
            this.winH = (0, Utility_1.int)(this.winW * exports.CHEIGHT / exports.CWIDTH);
        }
        this.cvs.width = this.winW;
        this.cvs.height = this.winH;
        exports.SCALE = this.winW / exports.CWIDTH;
        if (this.bg == null)
            return;
        this.bg.scale(exports.SCALE, exports.SCALE);
        this.bg.textAlign = "center";
        this.bg.textBaseline = "middle";
        //log(`width: ${this.winW} height:${this.winH} scale:${SCALE}`)
        //log(`inner width: ${window.innerWidth} inner height:${window.innerHeight}`)
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
        this.acX = 0;
        this.acY = 0;
        this.acZ = 0;
        //window.ondevicemotion = deviceMotion;//★★★旧
        window.addEventListener("devicemotion", this.deviceMotion);
        this.device = device;
    }
    deviceMotion(e) {
        var aIG = e.accelerationIncludingGravity;
        if (aIG == null)
            return;
        if (aIG.x)
            this.acX = (0, Utility_1.int)(aIG.x);
        if (aIG.y)
            this.acY = (0, Utility_1.int)(aIG.y);
        if (aIG.z)
            this.acZ = (0, Utility_1.int)(aIG.z);
        if (this.device.type == Device_1.PT_Android) { //Android と iOS で正負が逆になる
            this.acX = -this.acX;
            this.acY = -this.acY;
            this.acZ = -this.acZ;
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
        this.objLife = new Array(OBJ_MAX);
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
        for (let i = 0; i <= 4; i++)
            this.draw.loadImg(4 + i, `image2/enemy${i}.png`);
        this.initSShip();
        this.initMissile();
        this.initOject();
        this.initEffect();
    }
    mainloop() {
        this.tmr++;
        this.drawBG(1);
        this.setEnemy();
        this.moveSShip();
        this.moveMissile();
        this.moveOject();
        this.drawEffect();
        //エネルギーの表示
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
        //オートマチック表示部
        if (this.automa == 1)
            col = "white";
        this.draw.fRect(900, 20, 280, 60, "blue");
        this.draw.fText("[A]uto Missile", 1040, 50, 36, col);
        //無敵モードのエフェクト
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
    setObject(typ, png, x, y, xp, yp, lif) {
        this.objType[this.objNum] = typ;
        this.objImg[this.objNum] = png;
        this.objX[this.objNum] = x;
        this.objY[this.objNum] = y;
        this.objXp[this.objNum] = xp;
        this.objYp[this.objNum] = yp;
        this.objLife[this.objNum] = lif;
        this.objF[this.objNum] = true;
        this.objNum = (this.objNum + 1) % OBJ_MAX;
    }
    moveOject() {
        for (let i = 0; i < OBJ_MAX; i++) {
            if (this.objF[i] == true) {
                this.objX[i] += this.objXp[i];
                this.objY[i] += this.objYp[i];
                if (this.objImg[i] == 6) { //敵2の特殊な動き
                    if (this.objY[i] < 60)
                        this.objYp[i] = 8;
                    if (this.objY[i] > 660)
                        this.objYp[i] = -8;
                }
                if (this.objImg[i] == 7) { //敵3の特殊な動き
                    if (this.objXp[i] < 0) {
                        this.objXp[i] = (0, Utility_1.int)(this.objXp[i] * 0.95);
                        if (this.objXp[i] == 0) {
                            this.setObject(0, 4, this.objX[i], this.objY[i], -20, 0, 0); //弾を撃つ
                            this.objXp[i] = 20;
                        }
                    }
                }
                this.draw.drawImgC(this.objImg[i], this.objX[i], this.objY[i]); //物体の表示
                //自機が撃った弾とヒットチェック
                if (this.objType[i] == 1) { //敵機
                    const r = 12 + (this.draw.img[this.objImg[i]].width + this.draw.img[this.objImg[i]].height) / 4;
                    for (let n = 0; n < MSL_MAX; n++) { //全弾の判定チェック
                        if (this.mslF[n] == true) {
                            if ((0, Utility_1.getDis)(this.objX[i], this.objY[i], this.mslX[n], this.mslY[n]) < r) {
                                this.mslF[n] = false;
                                this.objLife[i] -= 1;
                                if (this.objLife[i] == 0) {
                                    this.objF[i] = false;
                                    this.setEffect(this.objX[i], this.objY[i], 9);
                                }
                                else {
                                    this.setEffect(this.objX[i], this.objY[i], 3);
                                }
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
                if (this.objX[i] < -100 || this.objX[i] > 1300 || this.objY[i] < -100 || this.objY[i] > 820) {
                    this.objF[i] = false;
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
    setEnemy() {
        if (this.tmr % 60 == 0)
            this.setObject(1, 5, 1300, 60 + (0, Utility_1.rnd)(600), -16, 0, 1); //敵1
        if (this.tmr % 60 == 10)
            this.setObject(1, 6, 1300, 60 + (0, Utility_1.rnd)(600), -12, 8, 3); //敵2
        if (this.tmr % 60 == 20)
            this.setObject(1, 7, 1300, 360 + (0, Utility_1.rnd)(300), -48, -10, 5); //敵3
        if (this.tmr % 60 == 30)
            this.setObject(1, 8, 1300, (0, Utility_1.rnd)(720 - 192), -6, 0, 0); //障害物
    }
}
new MyGame();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LElBQUksQ0FBQyxFQUFFLElBQUksSUFBSTtZQUFFLE9BQU07UUFDM0IsSUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUs7WUFBRSxPQUFNO1FBQ3RDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUTtRQUN0QyxJQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSztZQUFFLE9BQU07UUFDdEMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO1FBQzNCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTTtRQUM1QixJQUFHLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDVixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRTtZQUNkLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7U0FDbEI7SUFDSCxDQUFDO0lBRUQsVUFBVTtJQUNWLFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDdEMsSUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENB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QUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFBQyxNQUFNO1FBQ2xDLEtBQUssTUFBTTtZQUFFLFFBQVEsR0FBRyxFQUFFLENBQUM7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RyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUMsSUFBSTtRQUNuRixJQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxJQUFJLEVBQUU7WUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGlCQUFHLEVBQUMsR0FBRyxHQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxLQUFLO0lBQ2pGLENBQUM7Q0FDRjtBQUlELElBQUksTUFBTSxFQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL1dXUy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV1dTbGliL0NhbnZhcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV1dTbGliL0RldmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV1dTbGliL0RyYXcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9FdmVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV1dTbGliL1NvdW5kLnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvVXRpbGl0eS50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG5KYXZhU2NyaXB0JkhUTUw1IOOCsuODvOODoOmWi+eZuueUqOOCt+OCueODhuODoFxu6ZaL55m6IOODr+ODvOODq+ODieODr+OCpOODieOCveODleODiOOCpuOCp+OCouaciemZkOS8muekvlxuXG7vvIjkvb/nlKjmnaHku7bvvIlcbuacrOOCveODvOOCueOCs+ODvOODieOBruiRl+S9nOaoqeOBr+mWi+eZuuWFg+OBq+OBguOCiuOBvuOBmeOAglxu5Yip55So44GV44KM44Gf44GE5pa544Gv44Oh44O844Or44Gr44Gm44GK5ZWP44GE5ZCI44KP44Gb5LiL44GV44GE44CCXG50aEB3d3NmdC5jb20g44Ov44O844Or44OJ44Ov44Kk44OJ44K944OV44OI44Km44Kn44KiIOW7o+eArFxuKi9cblxuaW1wb3J0IHsgaW50LCBsb2cgfSBmcm9tICcuL1dXU2xpYi9VdGlsaXR5J1xuaW1wb3J0IHsgVG91Y2gsIE1vdXNlLCBLZXksIEFjY30gZnJvbSBcIi4vV1dTbGliL0V2ZW50XCJcbmltcG9ydCB7IENXSURUSCwgQ0hFSUdIVCwgQ2FudmFzLCBTQ0FMRSB9IGZyb20gXCIuL1dXU2xpYi9DYW52YXNcIlxuaW1wb3J0IHsgRHJhdyB9IGZyb20gXCIuL1dXU2xpYi9EcmF3XCJcbmltcG9ydCB7IFNFIH0gZnJvbSAnLi9XV1NsaWIvU291bmQnXG5pbXBvcnQgeyBEZXZpY2UsIFBUX0FuZHJvaWQsIFBUX2lPUywgUFRfS2luZGxlIH0gZnJvbSAnLi9XV1NsaWIvRGV2aWNlJ1xuLy8gLS0tLS0tLS0tLS0tLeWkieaVsC0tLS0tLS0tLS0tLS1cbmV4cG9ydCBjb25zdCAgU1lTX1ZFUiA9IFwiVmVyLjIwMjAxMTExXCJcbmV4cG9ydCBsZXQgIERFQlVHID0gZmFsc2VcblxuXG4vL+WHpueQhuOBrumAsuihjOOCkueuoeeQhuOBmeOCi1xuLy8gbWFpbl9pZHgg44Gu5YCkXG4vLyAgIDA6IOWIneacn+WMllxuLy8gICAxOiDjgrvjg7zjg5bjgafjgY3jgarjgYTorablkYpcbi8vICAgMjog44Oh44Kk44Oz5Yem55CGXG5sZXQgbWFpbl9pZHggPSAwXG5sZXQgbWFpbl90bXIgPSAwXG5sZXQgc3RvcF9mbGcgPSAwIC8vIOODoeOCpOODs+WHpueQhuOBruS4gOaZguWBnOatolxuY29uc3QgTlVBID0gbmF2aWdhdG9yLnVzZXJBZ2VudDsvL+apn+eoruWIpOWumlxuY29uc3Qgc3VwcG9ydFRvdWNoID0gJ29udG91Y2hlbmQnIGluIGRvY3VtZW50Oy8v44K/44OD44OB44Kk44OZ44Oz44OI44GM5L2/44GI44KL44GL77yfXG5cbi8vIOODleODrOODvOODoOODrOODvOODiCBmcmFtZXMgLyBzZWNvbmRcbmxldCAgRlBTID0gMzBcbi8v44Ot44O844Kr44Or44K544OI44Os44O844K4XG5jb25zdCBMU19LRVlOQU1FID0gXCJTQVZFREFUQVwiOy8va2V5TmFtZSDku7vmhI/jgavlpInmm7Tlj69cbi8v5L+d5a2Y44Gn44GN44KL44GL5Yik5a6a44GX44CB44Gn44GN44Gq44GE5aC05ZCI44Gr6K2m5ZGK44KS5Ye644GZ44CA5YW35L2T55qE44Gr44GvIGlPUyBTYWZhcmkg44OX44Op44Kk44OZ44O844OI44OW44Op44Km44K644GMT07vvIjkv53lrZjjgafjgY3jgarjgYTvvInnirbmhYvjgavorablkYrjgpLlh7rjgZlcbmxldCBDSEVDS19MUyA9IGZhbHNlO1xuXG4vLyAtLS0tLS0tLS0tLS0t44Oq44Ki44Or44K/44Kk44Og5Yem55CGLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1NUyB7XG4gIGFic3RyYWN0IHNldHVwKCk6IHZvaWRcbiAgYWJzdHJhY3QgbWFpbmxvb3AoKTogdm9pZFxuXG4gIHB1YmxpYyBjYW52YXM6IENhbnZhc1xuICBwdWJsaWMgZHJhdzogRHJhd1xuICBwdWJsaWMgbW91c2U6IE1vdXNlXG4gIHB1YmxpYyB0b3VjaDogVG91Y2hcbiAgcHVibGljIGtleTogS2V5XG4gIHB1YmxpYyBzZTogU0VcbiAgcHVibGljIGRldmljZTogRGV2aWNlXG4gIHB1YmxpYyBhY2M6IEFjY1xuICBwdWJsaWMgZnJhbWVTZWM6IG51bWJlclxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCB0aGlzLnd3c1N5c0luaXQuYmluZCh0aGlzKSlcbiAgICB0aGlzLmNhbnZhcyA9IG5ldyBDYW52YXMoKVxuICAgIHRoaXMuZHJhdyA9IG5ldyBEcmF3KClcbiAgICB0aGlzLnNlID0gbmV3IFNFKClcbiAgICB0aGlzLm1vdXNlID0gbmV3IE1vdXNlKHRoaXMuc2UpXG4gICAgdGhpcy50b3VjaCA9IG5ldyBUb3VjaCh0aGlzLnNlKVxuICAgIHRoaXMua2V5ID0gbmV3IEtleSh0aGlzLnNlKVxuICAgIHRoaXMuZGV2aWNlID0gbmV3IERldmljZSgpXG4gICAgdGhpcy5hY2MgPSBuZXcgQWNjKHRoaXMuZGV2aWNlKVxuICAgIHRoaXMuZnJhbWVTZWMgPSBpbnQoMTAwMCAvIEZQUylcbiAgfVxuXG4gIHd3c1N5c01haW4oKTogdm9pZCB7XG5cbiAgICBsZXQgc3RpbWUgPSBEYXRlLm5vdygpXG4gICAgLy/jg5bjg6njgqbjgrbjga7jgrXjgqTjgrrjgYzlpInljJbjgZfjgZ/jgYvvvJ/vvIjjgrnjg57jg5vjgarjgonmjIHjgaHmlrnjgpLlpInjgYjjgZ/jgYvjgIDnuKbmjIHjgaHih5TmqKrmjIHjgaHvvIlcbiAgICBpZih0aGlzLmNhbnZhcy5iYWtXICE9IHdpbmRvdy5pbm5lcldpZHRoIHx8IHRoaXMuY2FudmFzLmJha0ggIT0gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICB0aGlzLmNhbnZhcy5pbml0Q2FudmFzKClcbiAgICAgIGxvZyhcImNhbnZhcyBzaXplIGNoYW5nZWQgXCIgKyB0aGlzLmNhbnZhcy5iYWtXICsgXCJ4XCIgKyB0aGlzLmNhbnZhcy5iYWtIKTtcbiAgICB9XG5cbiAgICBtYWluX3RtciArK1xuXG4gICAgc3dpdGNoKG1haW5faWR4KSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHRoaXMuc2V0dXAoKVxuICAgICAgICB0aGlzLmtleS5jbHIoKVxuICAgICAgICBtYWluX2lkeCA9IDJcbiAgICAgICAgaWYoQ0hFQ0tfTFMgPT0gdHJ1ZSkge1xuICAgICAgICAgIHRyeSB7bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJfc2F2ZV90ZXN0XCIsIFwidGVzdGRhdGFcIil9IGNhdGNoKGUpIHsgbWFpbl9pZHggPSAxIH1cbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCB4ID0gaW50KENXSURUSCAvIDIpXG4gICAgICAgIGxldCB5ID0gaW50KENIRUlHSFQgLyA2KVxuICAgICAgICBsZXQgZnMgPSBpbnQoQ0hFSUdIVCAvIDE2KVxuICAgICAgICB0aGlzLmRyYXcuZmlsbChcImJsYWNrXCIpXG4gICAgICAgIHRoaXMuZHJhdy5mVGV4dChcIuKAu+OCu+ODvOODluODh+ODvOOCv+OBjOS/neWtmOOBleOCjOOBvuOBm+OCk+KAu1wiLCB4LCB5LzIsIGZzLCBcInllbGxvd1wiKTtcbiAgICAgICAgdGhpcy5kcmF3LmZUZXh0TihcImlPU+err+acq+OCkuOBiuS9v+OBhOOBruWgtOWQiOOBr1xcblNhZmFyaeOBruODl+ODqeOCpOODmeODvOODiOODluODqeOCpuOCulxcbuOCkuOCquODleOBq+OBl+OBpui1t+WLleOBl+OBpuS4i+OBleOBhOOAglwiLCB4LCB5KjIsIHksIGZzLCBcInllbGxvd1wiKTtcbiAgICAgICAgdGhpcy5kcmF3LmZUZXh0TihcIuOBneOBruS7luOBruapn+eoru+8iOODluODqeOCpuOCtu+8ieOBp+OBr1xcbuODreODvOOCq+ODq+OCueODiOODrOODvOOCuOOBuOOBruS/neWtmOOCklxcbuioseWPr+OBmeOCi+ioreWumuOBq+OBl+OBpuS4i+OBleOBhOOAglwiLCB4LCB5KjQsIHksIGZzLCBcInllbGxvd1wiKTtcbiAgICAgICAgdGhpcy5kcmF3LmZUZXh0KFwi44GT44Gu44G+44G+57aa44GR44KL44Gr44Gv55S76Z2i44KS44K/44OD44OXXCIsIHgsIHkqNS41LCBmcywgXCJsaW1lXCIpO1xuICAgICAgICBpZih0aGlzLm1vdXNlLnRhcEMgIT0gMCkgbWFpbl9pZHggPSAyO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAyOiAvL+ODoeOCpOODs+WHpueQhlxuICAgICAgICBpZihzdG9wX2ZsZyA9PSAwKSB7XG4gICAgICAgICAgdGhpcy5tYWlubG9vcCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5rZXkuY2xyKClcbiAgICAgICAgICBtYWluX3Rtci0tXG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5zZS53YWl0X3NlID4gMCkgdGhpcy5zZS53YWl0X3NlLS1cbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6IGJyZWFrXG4gICAgfVxuICAgIHZhciBwdGltZSA9IERhdGUubm93KCkgLSBzdGltZVxuICAgIGlmKHB0aW1lIDwgMCkgcHRpbWUgPSAwXG4gICAgaWYocHRpbWUgPiB0aGlzLmZyYW1lU2VjKSBwdGltZSA9IGludChwdGltZSAvIHRoaXMuZnJhbWVTZWMpICogdGhpcy5mcmFtZVNlY1xuXG4gICAgaWYoREVCVUcpIHsvL+KYheKYheKYheODh+ODkOODg+OCsFxuICAgICAgbGV0IGk6IG51bWJlclxuICAgICAgbGV0IHg6IG51bWJlciA9IDI0MFxuICAgICAgbGV0IHk6IG51bWJlclxuICAgICAgdGhpcy5kcmF3LmZUZXh0KFwi5Yem55CG5pmC6ZaTPVwiKyhwdGltZSksIHgsIDUwLCAxNiwgXCJsaW1lXCIpO1xuICAgICAgdGhpcy5kcmF3LmZUZXh0KGBkZXZpY2VUeXBlPSAke3RoaXMuZGV2aWNlLnR5cGV9YCwgeCwgMTAwLCAxNiwgXCJ5ZWxsb3dcIik7XG4gICAgICAvL3RoaXMuZHJhdy5mVGV4dChgaXNCZ209ICR7aXNCZ219ICgke2JnbU5vfSlgLCB4LCAxNTAsIDE2LCBcInllbGxvd1wiKTtcbiAgICAgIHRoaXMuZHJhdy5mVGV4dChgd2luVz0ke3RoaXMuY2FudmFzLndpbld9IHdpbkg9JHt0aGlzLmNhbnZhcy53aW5IfSBTQ0FMRT0gJHtTQ0FMRX1gLCB4LCAyMDAsIDE2LCBcInllbGxvd1wiKTtcbiAgICAgIHRoaXMuZHJhdy5mVGV4dChgJHttYWluX2lkeH0gOiAke21haW5fdG1yfSAoJHt0aGlzLnRvdWNoLnRhcFh9ICR7dGhpcy50b3VjaC50YXBZfSkgJHt0aGlzLnRvdWNoLnRhcEN9YCwgeCwgMjUwLCAxNiwgXCJjeWFuXCIpXG4gICAgICB0aGlzLmRyYXcuZlRleHQoYOWKoOmAn+W6piAke3RoaXMuYWNjLmFjWH0gOiAke3RoaXMuYWNjLmFjWX0gOiAke3RoaXMuYWNjLmFjWn1gLCB4LCAzMDAsIDE2LCBcInBpbmtcIik7XG4gICAgICBmb3IoaSA9IDA7IGkgPCAyNTY7IGkrKykge1xuICAgICAgICB4ID0gaSUxNlxuICAgICAgICB5ID0gaW50KGkvMTYpO1xuICAgICAgICB0aGlzLmRyYXcuZlRleHQoYCR7dGhpcy5rZXkua2V5W2ldfWAsIDE1KzMwKngsIDE1KzMwKnksIDEyLCBcIndoaXRlXCIpXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGAke3B0aW1lfWApXG4gICAgc2V0VGltZW91dCh0aGlzLnd3c1N5c01haW4uYmluZCh0aGlzKSwgdGhpcy5mcmFtZVNlYyAtIHB0aW1lKVxuXG4gIH1cblxuICB3d3NTeXNJbml0KCkge1xuICAgIHRoaXMuY2FudmFzLmluaXRDYW52YXMoKVxuICAgIGlmKCBOVUEuaW5kZXhPZignQW5kcm9pZCcpID4gMCApIHtcbiAgICAgIHRoaXMuZGV2aWNlLnR5cGUgPSBQVF9BbmRyb2lkO1xuICAgIH1cbiAgICBlbHNlIGlmKCBOVUEuaW5kZXhPZignaVBob25lJykgPiAwIHx8IE5VQS5pbmRleE9mKCdpUG9kJykgPiAwIHx8IE5VQS5pbmRleE9mKCdpUGFkJykgPiAwICkge1xuICAgICAgdGhpcy5kZXZpY2UudHlwZSA9IFBUX2lPUztcbiAgICAgIHdpbmRvdy5zY3JvbGxUbygwLDEpOy8vaVBob25l44GuVVJM44OQ44O844KS5raI44GZ5L2N572u44GrXG4gICAgfVxuICAgIGVsc2UgaWYoIE5VQS5pbmRleE9mKCdTaWxrJykgPiAwICkge1xuICAgICAgdGhpcy5kZXZpY2UudHlwZSA9IFBUX0tpbmRsZTtcbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5rZXkub24uYmluZCh0aGlzLmtleSkpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLmtleS5vZmYuYmluZCh0aGlzLmtleSkpXG5cbiAgICBpZihzdXBwb3J0VG91Y2ggPT0gdHJ1ZSkge1xuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMudG91Y2guc3RhcnQuYmluZCh0aGlzLnRvdWNoKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMudG91Y2gubW92ZS5iaW5kKHRoaXMudG91Y2gpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLnRvdWNoLmVuZC5iaW5kKHRoaXMudG91Y2gpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCB0aGlzLnRvdWNoLmNhbmNlbC5iaW5kKHRoaXMudG91Y2gpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLm1vdXNlLmRvd24uYmluZCh0aGlzLm1vdXNlKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMubW91c2UubW92ZS5iaW5kKHRoaXMubW91c2UpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMubW91c2UudXAuYmluZCh0aGlzLm1vdXNlKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgdGhpcy5tb3VzZS5vdXQuYmluZCh0aGlzLm1vdXNlKSlcbiAgICB9XG4gICAgdGhpcy53d3NTeXNNYWluKClcbiAgfVxufVxuIiwiaW1wb3J0IHtpbnQsIGxvZ30gZnJvbSBcIi4vVXRpbGl0eVwiXG5cbi8vIC0tLS0tLS0tLS0tLS3mj4/nlLvpnaIo44Kt44Oj44Oz44OQ44K5KS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBsZXQgQ1dJRFRIID0gODAwXG5leHBvcnQgbGV0IENIRUlHSFQgPSA2MDBcbmV4cG9ydCBsZXQgU0NBTEUgPSAxLjAgLy8g44K544Kx44O844Or5YCk6Kit5a6aK+OCv+ODg+ODl+S9jee9ruioiOeul+eUqFxuZXhwb3J0IGNsYXNzIENhbnZhcyB7XG5cbiAgcHVibGljIGN2czogSFRNTENhbnZhc0VsZW1lbnRcbiAgcHVibGljIGJnOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsXG4gIHB1YmxpYyB3aW5XOiBudW1iZXJcbiAgcHVibGljIHdpbkg6IG51bWJlclxuICBwdWJsaWMgYmFrVzogbnVtYmVyXG4gIHB1YmxpYyBiYWtIOiBudW1iZXJcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmN2cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50XG4gICAgdGhpcy5iZyA9IHRoaXMuY3ZzLmdldENvbnRleHQoXCIyZFwiKVxuICAgIHRoaXMud2luVyA9IDBcbiAgICB0aGlzLndpbkggPSAwXG4gICAgdGhpcy5iYWtXID0gMFxuICAgIHRoaXMuYmFrSCA9IDBcbiAgfVxuICBpbml0Q2FudmFzKCkge1xuICAgIHRoaXMud2luVyA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgdGhpcy53aW5IID0gd2luZG93LmlubmVySGVpZ2h0XG4gICAgdGhpcy5iYWtXID0gdGhpcy53aW5XXG4gICAgdGhpcy5iYWtIID0gdGhpcy53aW5IXG5cbiAgICBpZiggdGhpcy53aW5IIDwgKHRoaXMud2luVyAqIENIRUlHSFQgLyBDV0lEVEgpICkge1xuICAgICAgLy93aW5XIOOCkuavlOeOh+OBq+WQiOOCj+OBm+OBpuiqv+aVtFxuICAgICAgdGhpcy53aW5XID0gaW50KHRoaXMud2luSCAqIENXSURUSCAvIENIRUlHSFQpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vd2luSCDjgpLmr5TnjofjgavlkIjjgo/jgZvjgaboqr/mlbRcbiAgICAgIHRoaXMud2luSCA9IGludCh0aGlzLndpblcgKiBDSEVJR0hUIC8gQ1dJRFRIKVxuICAgIH1cblxuICAgIHRoaXMuY3ZzLndpZHRoID0gdGhpcy53aW5XXG4gICAgdGhpcy5jdnMuaGVpZ2h0ID0gdGhpcy53aW5IXG4gICAgU0NBTEUgPSB0aGlzLndpblcgLyBDV0lEVEhcblxuICAgIGlmKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5zY2FsZShTQ0FMRSwgU0NBTEUpXG4gICAgdGhpcy5iZy50ZXh0QWxpZ24gPSBcImNlbnRlclwiXG4gICAgdGhpcy5iZy50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiXG5cbiAgICAvL2xvZyhgd2lkdGg6ICR7dGhpcy53aW5XfSBoZWlnaHQ6JHt0aGlzLndpbkh9IHNjYWxlOiR7U0NBTEV9YClcbiAgICAvL2xvZyhgaW5uZXIgd2lkdGg6ICR7d2luZG93LmlubmVyV2lkdGh9IGlubmVyIGhlaWdodDoke3dpbmRvdy5pbm5lckhlaWdodH1gKVxuICB9XG5cbiAgY2FudmFzU2l6ZSh3OiBudW1iZXIsIGg6IG51bWJlcikge1xuICAgIENXSURUSCA9IHdcbiAgICBDSEVJR0hUID0gaFxuICAgIHRoaXMuaW5pdENhbnZhcygpXG4gIH1cbn1cbiIsIi8v56uv5pyr44Gu56iu6aGeXG5leHBvcnQgbGV0IFBUX1BDXHRcdD0gMDtcbmV4cG9ydCBsZXQgUFRfaU9TXHRcdD0gMTtcbmV4cG9ydCBsZXQgUFRfQW5kcm9pZFx0PSAyO1xuZXhwb3J0IGxldCBQVF9LaW5kbGVcdD0gMztcblxuZXhwb3J0IGNsYXNzIERldmljZSB7XG4gIHByaXZhdGUgX3R5cGU6IG51bWJlclxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl90eXBlID0gUFRfUENcbiAgfVxuICBnZXQgdHlwZSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fdHlwZSB9XG4gIHNldCB0eXBlKHR5cGU6IG51bWJlcikgeyB0aGlzLl90eXBlID0gdHlwZSB9XG59XG4iLCJpbXBvcnQgeyBpbnQsIGxvZyB9IGZyb20gXCIuL1V0aWxpdHlcIlxuaW1wb3J0IHsgQ1dJRFRILCBDSEVJR0hULCBDYW52YXMgfSBmcm9tICcuL0NhbnZhcydcblxuZXhwb3J0IGNsYXNzIERyYXcgZXh0ZW5kcyBDYW52YXN7XG4vLyAtLS0tLS0tLS0tLS0t55S75YOP44Gu6Kqt44G/6L6844G/LS0tLS0tLS0tLS0tLVxuICBpbWc6IEhUTUxJbWFnZUVsZW1lbnRbXVxuICBpbWdfbG9hZGVkOiBCb29sZWFuW11cbiAgbGluZV93aWR0aDogbnVtYmVyXG5cbiAgY29uc3RydWN0b3IoKXtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5pbWcgPSBuZXcgQXJyYXkoMjU2KVxuICAgIHRoaXMuaW1nX2xvYWRlZCA9IG5ldyBBcnJheSgyNTYpXG4gICAgdGhpcy5saW5lX3dpZHRoID0gMVxuICB9XG5cbiAgbG9hZEltZyhuOiBudW1iZXIsIGZpbGVuYW1lOiBzdHJpbmcpIHtcbiAgICAvL2xvZyhcIueUu+WDj1wiICsgbiArIFwiIFwiICsgZmlsZW5hbWUgKyBcIuiqreOBv+i+vOOBv+mWi+Wni1wiKVxuICAgIHRoaXMuaW1nX2xvYWRlZFtuXSA9IGZhbHNlXG4gICAgdGhpcy5pbWdbbl0gPSBuZXcgSW1hZ2UoKVxuICAgIHRoaXMuaW1nW25dLnNyYyA9IGZpbGVuYW1lXG4gICAgdGhpcy5pbWdbbl0ub25sb2FkID0gKCkgPT57XG4gICAgICAvL2xvZyhcIueUu+WDj1wiICsgbiArIFwiIFwiICsgZmlsZW5hbWUgKyBcIuiqreOBv+i+vOOBv+WujOS6hlwiKVxuICAgICAgdGhpcy5pbWdfbG9hZGVkW25dID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS3mj4/nlLsxIOWbs+W9oi0tLS0tLS0tLS0tLS1cbiAgc2V0QWxwKHBhcjogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuYmcpIHRoaXMuYmcuZ2xvYmFsQWxwaGEgPSBwYXIvMTAwXG4gIH1cblxuICBjb2xvclJHQihjcjogbnVtYmVyLCBjZzogbnVtYmVyLCBjYjogbnVtYmVyKSB7XG4gICAgY3IgPSBpbnQoY3IpXG4gICAgY2cgPSBpbnQoY2cpXG4gICAgY2IgPSBpbnQoY2IpXG4gICAgcmV0dXJuIChcInJnYihcIiArIGNyICsgXCIsXCIgKyBjZyArIFwiLFwiICsgY2IgKyBcIilcIilcbiAgfVxuXG4gIGxpbmVXKHdpZDogbnVtYmVyKSB7IC8v57ea44Gu5aSq44GV5oyH5a6aXG4gICAgdGhpcy5saW5lX3dpZHRoID0gd2lkIC8v44OQ44OD44Kv44Ki44OD44OXXG4gICAgaWYodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLmxpbmVXaWR0aCA9IHdpZFxuICAgIHRoaXMuYmcubGluZUNhcCA9IFwicm91bmRcIlxuICAgIHRoaXMuYmcubGluZUpvaW4gPSBcInJvdW5kXCJcbiAgfVxuXG4gIGxpbmUoeDA6IG51bWJlciwgeTA6IG51bWJlciwgeDE6IG51bWJlciwgeTE6IG51bWJlciwgY29sOiBzdHJpbmcpIHtcbiAgICBpZih0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuc3Ryb2tlU3R5bGUgPSBjb2xcbiAgICB0aGlzLmJnLmJlZ2luUGF0aCgpXG4gICAgdGhpcy5iZy5tb3ZlVG8oeDAsIHkwKVxuICAgIHRoaXMuYmcubGluZVRvKHgxLCB5MSlcbiAgICB0aGlzLmJnLnN0cm9rZSgpXG4gIH1cblxuICBmaWxsKGNvbDogc3RyaW5nKSB7XG4gICAgaWYodGhpcy5iZykgdGhpcy5iZy5maWxsU3R5bGUgPSBjb2xcbiAgICBpZih0aGlzLmJnKSB0aGlzLmJnLmZpbGxSZWN0KDAsIDAsIENXSURUSCwgQ0hFSUdIVClcbiAgfVxuXG4gIGZSZWN0KHg6bnVtYmVyLCB5Om51bWJlciwgdzpudW1iZXIsIGg6bnVtYmVyLGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5maWxsU3R5bGUgPSBjb2xcbiAgICB0aGlzLmJnLmZpbGxSZWN0KHgsIHksIHcsIGgpXG4gIH1cblxuICBzUmVjdCh4Om51bWJlciwgeTpudW1iZXIsIHc6bnVtYmVyLCBoOm51bWJlcixjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuc3Ryb2tlU3R5bGUgPSBjb2xcbiAgICB0aGlzLmJnLnN0cm9rZVJlY3QoeCwgeSwgdywgaClcbiAgfVxuXG4gIGZDaXIoeDpudW1iZXIsIHk6bnVtYmVyLCByOm51bWJlcixjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5iZWdpblBhdGgoKVxuICAgIHRoaXMuYmcuYXJjKHgsIHksIHIsIDAsIE1hdGguUEkqMiwgZmFsc2UpXG4gICAgdGhpcy5iZy5jbG9zZVBhdGgoKVxuICAgIHRoaXMuYmcuZmlsbCgpXG4gIH1cblxuICBzQ2lyKHg6bnVtYmVyLCB5Om51bWJlciwgcjpudW1iZXIsY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLnN0cm9rZVN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5iZWdpblBhdGgoKVxuICAgIHRoaXMuYmcuYXJjKHgsIHksIHIsIDAsIE1hdGguUEkqMiwgZmFsc2UpXG4gICAgdGhpcy5iZy5jbG9zZVBhdGgoKVxuICAgIHRoaXMuYmcuc3Ryb2tlKClcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS3mj4/nlLsyIOeUu+WDjy0tLS0tLS0tLS0tLS1cbiAgZHJhd0ltZyhuOiBudW1iZXIsIHg6IG51bWJlciwgeTpudW1iZXIpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICBpZih0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCB4LCB5KVxuICB9XG5cbiAgZHJhd0ltZ0xSKG46IG51bWJlciwgeDogbnVtYmVyLCB5Om51bWJlcikgeyAvLyDlt6blj7Plj43ou6JcbiAgICBpZih0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIGNvbnN0IHcgPSB0aGlzLmltZ1tuXS53aWR0aFxuICAgIGNvbnN0IGggPSB0aGlzLmltZ1tuXS5oZWlnaHRcbiAgICBpZih0aGlzLmJnKSB7XG4gICAgICB0aGlzLmJnLnNhdmUoKVxuICAgICAgdGhpcy5iZy50cmFuc2xhdGUoeCt3LzIsIHkraC8yKVxuICAgICAgdGhpcy5iZy5zY2FsZSgtMSwgMSlcbiAgICAgIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCAtdy8yLCAtaC8yKVxuICAgICAgdGhpcy5iZy5yZXN0b3JlKClcbiAgICB9XG4gIH1cblxuICAvL+OCu+ODs+OCv+ODquODs+OCsOihqOekulxuICBkcmF3SW1nQyhuOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgaWYodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBpZiAodGhpcy5iZylcbiAgICAgIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCB4IC0gaW50KHRoaXMuaW1nW25dLndpZHRoLzIpLCB5IC0gaW50KHRoaXMuaW1nW25dLmhlaWdodC8yKSlcbiAgfVxuXG4gIC8v5ouh5aSn57iu5bCPXG4gIGRyYXdJbWdTKG46IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XG4gICAgaWYodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBpZiAodGhpcy5iZykgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIHgsIHksIHcsIGgpXG4gIH1cbiAgLy/liIfjgorlh7rjgZcgKyDmi6HlpKfnuK7lsI9cbiAgZHJhd0ltZ1RTKG46IG51bWJlciwgc3g6IG51bWJlciwgc3k6IG51bWJlciwgc3c6IG51bWJlciwgc2g6IG51bWJlciwgY3g6IG51bWJlciwgY3k6IG51bWJlciwgY3c6IG51bWJlciwgY2g6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIGlmICh0aGlzLmJnKSB7XG4gICAgICB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgc3gsIHN5LCBzdywgc2gsIGN4LCBjeSwgY3csIGNoKVxuICAgIH1cbiAgfVxuICAvL+Wbnui7olxuICBkcmF3SW1nUihuIDpudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCBhcmc6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIGNvbnN0IHcgPSB0aGlzLmltZ1tuXS53aWR0aFxuICAgIGNvbnN0IGggPSB0aGlzLmltZ1tuXS5oZWlnaHRcbiAgICBpZih0aGlzLmJnKSB7XG4gICAgICB0aGlzLmJnLnNhdmUoKVxuICAgICAgdGhpcy5iZy50cmFuc2xhdGUoeCt3LzIsIHkraC8yKVxuICAgICAgdGhpcy5iZy5yb3RhdGUoYXJnKVxuICAgICAgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIC13LzIsIC1oLzIpXG4gICAgICB0aGlzLmJnLnJlc3RvcmUoKVxuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS3mj4/nlLszIOaWh+Wtly0tLS0tLS0tLS0tLS1cbiAgZlRleHQoc3RyOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyLCBzaXo6IG51bWJlciwgY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZykge1xuICAgICAgdGhpcy5iZy5mb250ID0gaW50KHNpeikgKyBcInB4IGJvbGQgbW9ub3NwYWNlXCJcbiAgICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgICB0aGlzLmJnLmZpbGxUZXh0KHN0ciwgeCsxLCB5KzEpXG4gICAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IGNvbFxuICAgICAgdGhpcy5iZy5maWxsVGV4dChzdHIsIHgsIHkpXG4gICAgfVxuICB9XG5cbiAgZlRleHROKHN0cjogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlciwgaDogbnVtYmVyLCBzaXo6IG51bWJlciwgY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICBjb25zdCBzbiA9IHN0ci5zcGxpdChcIlxcblwiKVxuICAgIHRoaXMuYmcuZm9udCA9IGludChzaXopICsgXCJweCBib2xkIG1vbm9zcGFjZVwiXG4gICAgaWYoc24ubGVuZ3RoID09IDEpIHtcbiAgICAgIGggPSAwXG4gICAgfSBlbHNlIHtcbiAgICAgIHkgPSB5IC0gaW50KGgvMilcbiAgICAgIGggPSBpbnQoaCAvIChzbi5sZW5ndGggLSAxKSlcbiAgICB9XG4gICAgZm9yKCBsZXQgaSA9IDA7IGkgPCBzbi5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5iZy5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgIHRoaXMuYmcuZmlsbFRleHQoc3RyLCB4KzEsIHkrMSlcbiAgICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gY29sXG4gICAgICB0aGlzLmJnLmZpbGxUZXh0KHN0ciwgeCwgeSlcbiAgICB9XG4gIH1cbiAgbVRleHRXaWR0aChzdHI6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHJldHVybiB0aGlzLmJnLm1lYXN1cmVUZXh0KHN0cikud2lkdGhcbiAgfVxufVxuIiwiaW1wb3J0IHsgaW50LCBsb2csIGNvZGVUb1N0ciB9IGZyb20gXCIuL1V0aWxpdHlcIlxuaW1wb3J0IHsgU0UgfSBmcm9tIFwiLi9Tb3VuZFwiXG5pbXBvcnQgeyBTQ0FMRSB9IGZyb20gXCIuL0NhbnZhc1wiXG5pbXBvcnQgeyBEZXZpY2UsIFBUX0FuZHJvaWQgfSBmcm9tIFwiLi9EZXZpY2VcIlxuXG4vLyAtLS0tLS0tLS0tIOOCv+ODg+ODl+WFpeWKmyAtLS0tLS0tLS0tXG5leHBvcnQgY2xhc3MgVG91Y2gge1xuXHRwdWJsaWMgdGFwWDogbnVtYmVyXG5cdHB1YmxpYyB0YXBZOiBudW1iZXJcblx0cHVibGljIHRhcEM6IG51bWJlclxuXHRwcml2YXRlIF9zZTogU0VcblxuXHRjb25zdHJ1Y3RvcihzZTogU0UpIHtcblx0XHR0aGlzLl9zZSA9IHNlO1xuXHRcdHRoaXMudGFwWCA9IDA7XG5cdFx0dGhpcy50YXBZID0gMDtcblx0XHR0aGlzLnRhcEMgPSAwO1xuXHR9XG5cdHN0YXJ0KGU6IFRvdWNoRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7Ly/jgq3jg6Pjg7Pjg5Djgrnjga7pgbjmip7vvI/jgrnjgq/jg63jg7zjg6vnrYnjgpLmipHliLbjgZnjgotcblx0XHRjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuXHRcdGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0dGhpcy50YXBYID0gZS50b3VjaGVzWzBdLmNsaWVudFgtcmVjdC5sZWZ0O1xuXHRcdHRoaXMudGFwWSA9IGUudG91Y2hlc1swXS5jbGllbnRZLXJlY3QudG9wO1xuXHRcdHRoaXMudGFwQyA9IDE7XG5cdFx0dGhpcy50cmFuc2Zvcm1YWSgpO1xuXHRcdGlmKHRoaXMuX3NlLnNuZF9pbml0ID09IDApIHRoaXMuX3NlLmxvYWRTb3VuZFNQaG9uZSgpOy8v44CQ6YeN6KaB44CR44K144Km44Oz44OJ44Gu6Kqt44G/6L6844G/XG5cdH1cblxuXHRtb3ZlKGU6IFRvdWNoRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblx0XHRjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdHRoaXMudGFwWCA9IGUudG91Y2hlc1swXS5jbGllbnRYLXJlY3QubGVmdDtcblx0XHR0aGlzLnRhcFkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WS1yZWN0LnRvcDtcblx0XHR0aGlzLnRyYW5zZm9ybVhZKCk7XG5cdH1cblxuXHRlbmQoZTogVG91Y2hFdmVudCkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR0aGlzLnRhcEMgPSAwOy8v4oC744Oe44Km44K55pON5L2c44Gn44GvbW91c2VPdXTjgYzjgZPjgozjgavjgarjgotcblx0fVxuXG5cdGNhbmNlbChlOiBUb3VjaEV2ZW50KSB7XG5cdFx0dGhpcy50YXBYID0gLTE7XG5cdFx0dGhpcy50YXBZID0gLTE7XG5cdFx0dGhpcy50YXBDID0gMDtcblx0fVxuXG5cdHRyYW5zZm9ybVhZKCkgey8v5a6f5bqn5qiZ4oaS5Luu5oOz5bqn5qiZ44G444Gu5aSJ5o+bXG5cdFx0dGhpcy50YXBYID0gaW50KHRoaXMudGFwWCAvIFNDQUxFKTtcblx0XHR0aGlzLnRhcFkgPSBpbnQodGhpcy50YXBZIC8gU0NBTEUpO1xuXHR9XG59XG5cblxuLy8gLS0tLS0tLS0tLS0tLeODnuOCpuOCueWFpeWKmy0tLS0tLS0tLS0tLS1cbmV4cG9ydCBjbGFzcyBNb3VzZSB7XG5cdHB1YmxpYyB0YXBYOm51bWJlclxuXHRwdWJsaWMgdGFwWTpudW1iZXJcblx0cHVibGljIHRhcEM6bnVtYmVyXG5cdHByaXZhdGUgX3NlOiBTRVxuXG5cdGNvbnN0cnVjdG9yKHNlOiBTRSkge1xuXHRcdHRoaXMuX3NlID0gc2Vcblx0XHR0aGlzLnRhcEMgPSAwXG5cdFx0dGhpcy50YXBYID0gMFxuXHRcdHRoaXMudGFwWSA9IDBcblx0fVxuXG5cdGRvd24oZTogTW91c2VFdmVudCkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTsvL+OCreODo+ODs+ODkOOCueOBrumBuOaKnu+8j+OCueOCr+ODreODvOODq+etieOCkuaKkeWItuOBmeOCi1xuXHRcdGlmKCEgZS50YXJnZXQpIHJldHVyblxuXHRcdGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG5cdFx0dmFyIHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHR0aGlzLnRhcFggPSBlLmNsaWVudFgtcmVjdC5sZWZ0O1xuXHRcdHRoaXMudGFwWSA9IGUuY2xpZW50WS1yZWN0LnRvcDtcblx0XHR0aGlzLnRhcEMgPSAxO1xuXHRcdHRoaXMudHJhbnNmb3JtWFkoKVxuXHRcdGlmKHRoaXMuX3NlLnNuZF9pbml0ID09IDApIHRoaXMuX3NlLmxvYWRTb3VuZFNQaG9uZSgpOy8v44CQ6YeN6KaB44CR44K144Km44Oz44OJ44Gu6Kqt44G/6L6844G/XG5cdH1cblxuXHRtb3ZlKGU6IE1vdXNlRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0aWYoISBlLnRhcmdldCkgcmV0dXJuXG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblx0XHRjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0dGhpcy50YXBYID0gZS5jbGllbnRYLXJlY3QubGVmdDtcblx0XHR0aGlzLnRhcFkgPSBlLmNsaWVudFktcmVjdC50b3A7XG5cdFx0dGhpcy50cmFuc2Zvcm1YWSgpXG5cdH1cblxuXHR1cChlOiBNb3VzZUV2ZW50KSB7IHRoaXMudGFwQyA9IDA7IH1cblx0b3V0KGU6IE1vdXNlRXZlbnQpIHsgdGhpcy50YXBDID0gMDsgfVxuXG5cdHRyYW5zZm9ybVhZKCkgey8v5a6f5bqn5qiZ4oaS5Luu5oOz5bqn5qiZ44G444Gu5aSJ5o+bXG5cdFx0dGhpcy50YXBYID0gaW50KHRoaXMudGFwWCAvIFNDQUxFKTtcblx0XHR0aGlzLnRhcFkgPSBpbnQodGhpcy50YXBZIC8gU0NBTEUpO1xuXHR9XG59XG5cbi8vIC0tLS0tLS0tLS0g5Yqg6YCf5bqm44K744Oz44K144O8IC0tLS0tLS0tLS1cbmV4cG9ydCBjbGFzcyBBY2Mge1xuXHRwdWJsaWMgYWNYID0gMFxuXHRwdWJsaWMgYWNZID0gMFxuXHRwdWJsaWMgYWNaID0gMDtcblx0cHVibGljIGRldmljZTogRGV2aWNlXG5cblx0Y29uc3RydWN0b3IoZGV2aWNlOiBEZXZpY2UpIHtcblx0XHQvL3dpbmRvdy5vbmRldmljZW1vdGlvbiA9IGRldmljZU1vdGlvbjsvL+KYheKYheKYheaXp1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlbW90aW9uXCIsIHRoaXMuZGV2aWNlTW90aW9uKTtcblx0XHR0aGlzLmRldmljZSA9IGRldmljZVxuXHR9XG5cblx0ZGV2aWNlTW90aW9uKGU6IERldmljZU1vdGlvbkV2ZW50KSB7XG5cdFx0dmFyIGFJRzogRGV2aWNlTW90aW9uRXZlbnRBY2NlbGVyYXRpb24gfCBudWxsID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5O1xuXHRcdGlmIChhSUcgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdGlmKGFJRy54KSB0aGlzLmFjWCA9IGludChhSUcueCk7XG5cdFx0aWYoYUlHLnkpIHRoaXMuYWNZID0gaW50KGFJRy55KTtcblx0XHRpZihhSUcueikgdGhpcy5hY1ogPSBpbnQoYUlHLnopO1xuXHRcdGlmKHRoaXMuZGV2aWNlLnR5cGUgPT0gUFRfQW5kcm9pZCkgey8vQW5kcm9pZCDjgaggaU9TIOOBp+ato+iyoOOBjOmAhuOBq+OBquOCi1xuXHRcdFx0dGhpcy5hY1ggPSAtdGhpcy5hY1g7XG5cdFx0XHR0aGlzLmFjWSA9IC10aGlzLmFjWTtcblx0XHRcdHRoaXMuYWNaID0gLXRoaXMuYWNaO1xuXHRcdH1cblx0fVxufVxuXG4vL+OCreODvOWFpeWKm+eUqFxuZXhwb3J0IGNsYXNzIEtleSB7XG5cdHB1YmxpYyBfc2U6IFNFXG5cdHB1YmxpYyBpbmtleTogbnVtYmVyXG5cdHB1YmxpYyBrZXk6IG51bWJlcltdXG5cblx0Y29uc3RydWN0b3Ioc2U6IFNFKSB7XG5cdFx0dGhpcy5pbmtleSA9IDBcblx0XHR0aGlzLmtleSA9IG5ldyBBcnJheSgyNTYpO1xuXHRcdHRoaXMuX3NlID0gc2Vcblx0fVxuXG5cdGNscigpIHtcblx0XHR0aGlzLmlua2V5ID0gMDtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHRoaXMua2V5W2ldID0gMDtcblx0fVxuXG5cdG9uKGU6IEtleWJvYXJkRXZlbnQpIHtcblx0XHQvL2xvZyggYCR7ZS5rZXl9IDogJHtlLmNvZGV9IDogJHtlLmtleUNvZGV9IDogJHtjb2RlVG9TdHIoZS5jb2RlKX1gIClcblxuXHRcdGlmKHRoaXMuX3NlLnNuZF9pbml0ID09IDApIHRoaXMuX3NlLmxvYWRTb3VuZFNQaG9uZSgpOy8v44CQ6YeN6KaB44CR44K144Km44Oz44OJ44Gu6Kqt44G/6L6844G/XG5cdFx0dGhpcy5pbmtleSA9IGNvZGVUb1N0cihlLmNvZGUpXG5cdFx0dGhpcy5rZXlbY29kZVRvU3RyKGUuY29kZSldKytcblx0fVxuXG5cdG9mZihlOiBLZXlib2FyZEV2ZW50KSB7XG5cdFx0dGhpcy5pbmtleSA9IDA7XG5cdFx0dGhpcy5rZXlbY29kZVRvU3RyKGUuY29kZSldID0gMDtcblx0fVxufVxuIiwiLy8gLS0tLS0tLS0tLS0tLeOCteOCpuODs+ODieWItuW+oS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBsZXQgIFNPVU5EX09OID0gdHJ1ZVxuZXhwb3J0IGNsYXNzIFNFIHtcbiAgcHVibGljIHdhaXRfc2U6IG51bWJlciA9IDBcbiAgcHVibGljIHNuZF9pbml0OiBudW1iZXIgPSAwXG4gIHNvdW5kRmlsZTogSFRNTEF1ZGlvRWxlbWVudFtdXG4gIGlzQmdtOiBudW1iZXJcbiAgYmdtTm86IG51bWJlclxuICBzZU5vOm51bWJlclxuXG4gIHNvdW5kbG9hZGVkOiBudW1iZXJcbiAgc2ZfbmFtZTogc3RyaW5nW11cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvL+OCteOCpuODs+ODieODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCk+OBoOOBiyjjgrnjg57jg5vlr77nrZYpXG4gICAgdGhpcy53YWl0X3NlID0gMFxuICAgIHRoaXMuc25kX2luaXQgPSAwXG4gICAgdGhpcy5zb3VuZEZpbGUgPSBuZXcgQXJyYXkoMjU2KVxuICAgIHRoaXMuaXNCZ20gPSAtMVxuICAgIHRoaXMuYmdtTm8gPSAwXG4gICAgdGhpcy5zZU5vID0gLTFcbiAgICB0aGlzLnNvdW5kbG9hZGVkID0gMCAvL+OBhOOBj+OBpOODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCk+OBoOOBi1xuICAgIHRoaXMuc2ZfbmFtZSA9IG5ldyBBcnJheSgyNTYpXG4gIH1cblxuICBsb2FkU291bmRTUGhvbmUoKSB7Ly/jgrnjg57jg5vjgafjg5XjgqHjgqTjg6vjgpLoqq3jgb/ovrzjgoBcbiAgICB0cnkge1xuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuc291bmRsb2FkZWQ7IGkrKykge1xuICAgICAgICB0aGlzLnNvdW5kRmlsZVtpXSA9IG5ldyBBdWRpbyh0aGlzLnNmX25hbWVbaV0pXG4gICAgICAgIHRoaXMuc291bmRGaWxlW2ldLmxvYWQoKVxuICAgICAgfVxuICAgIH0gY2F0Y2goZSkge1xuICAgIH1cbiAgICB0aGlzLnNuZF9pbml0ID0gMiAvL+OCueODnuODm+OBp+ODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCk+OBoFxuICB9XG5cbiAgbG9hZFNvdW5kKG46IG51bWJlciwgZmlsZW5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuc2ZfbmFtZVtuXSA9IGZpbGVuYW1lXG4gICAgdGhpcy5zb3VuZGxvYWRlZCsrXG4gIH1cblxuICBwbGF5U0UobjogbnVtYmVyKSB7XG4gICAgaWYoU09VTkRfT04gPT0gZmFsc2UpIHJldHVyblxuICAgIGlmKHRoaXMuaXNCZ20gPT0gMikgcmV0dXJuXG4gICAgaWYodGhpcy53YWl0X3NlID09IDApIHtcbiAgICAgIHRoaXMuc2VObyA9IG5cbiAgICAgIHRoaXMuc291bmRGaWxlW25dLmN1cnJlbnRUaW1lID0gMFxuICAgICAgdGhpcy5zb3VuZEZpbGVbbl0ubG9vcCA9IGZhbHNlXG4gICAgICB0aGlzLnNvdW5kRmlsZVtuXS5wbGF5KClcbiAgICAgIHRoaXMud2FpdF9zZSA9IDMgLy/jg5bjg6njgqbjgrbjgavosqDojbfjgpLjgYvjgZHjgarjgYTjgojjgYbjgavpgKPntprjgZfjgabmtYHjgZXjgarjgYTjgojjgYbjgavjgZnjgotcbiAgICB9XG4gIH1cbn0iLCIvLyAtLS0tLS0tLS0tLS0t5ZCE56iu44Gu6Zai5pWwLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhtc2c6IHN0cmluZykge1xuICBjb25zb2xlLmxvZyhtc2cpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnQodmFsOiBudW1iZXIpOiBudW1iZXIge1xuICBsZXQgbnVtID0gU3RyaW5nKHZhbClcbiAgcmV0dXJuIHBhcnNlSW50KG51bSkgLy/jg5fjg6njgrnjg57jgqTjg4rjgrnjganjgaHjgonjgoLlsI/mlbDpg6jliIbjgpLliIfjgormjajjgaZcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cih2YWw6IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBTdHJpbmcodmFsKVxufVxuZXhwb3J0IGZ1bmN0aW9uIHJuZChtYXg6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBpbnQoTWF0aC5yYW5kb20oKSAqIG1heClcbn1cbmV4cG9ydCBmdW5jdGlvbiBhYnModmFsOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5hYnModmFsKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29zKGE6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmNvcyhNYXRoLlBJICogMiAqIGEgLyAzNjApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaW4oYTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguc2luKE1hdGguUEkgKiAyICogYSAvIDM2MClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERpcyh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh4MiAtIHgxLCAyKSArIE1hdGgucG93KHkyIC0geTEsIDIpKVxufVxuXG5cbi8vIC0tLS0tLS0tLS0g44Kt44O85YWl5Yqb44Kt44O844Gu44Oe44OD44OU44Oz44KwKGtleUNvZGUg44GM6Z2e5o6o5aWo44Gu44Gf44KBKSAtLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gY29kZVRvU3RyKGNvZGU6IHN0cmluZyk6IG51bWJlciB7XG4gIGxldCBjaGFyQ29kZTogbnVtYmVyID0gMFxuICBzd2l0Y2goY29kZSkge1xuICAgIGNhc2UgXCJLZXlBXCI6IGNoYXJDb2RlID0gNjU7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlCXCI6IGNoYXJDb2RlID0gNjY7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlDXCI6IGNoYXJDb2RlID0gNjc7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlEXCI6IGNoYXJDb2RlID0gNjg7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlFXCI6IGNoYXJDb2RlID0gNjk7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlGXCI6IGNoYXJDb2RlID0gNzA7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlHXCI6IGNoYXJDb2RlID0gNzE7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlIXCI6IGNoYXJDb2RlID0gNzI7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlJXCI6IGNoYXJDb2RlID0gNzM7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlKXCI6IGNoYXJDb2RlID0gNzQ7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlLXCI6IGNoYXJDb2RlID0gNzU7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlMXCI6IGNoYXJDb2RlID0gNzY7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlNXCI6IGNoYXJDb2RlID0gNzc7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlOXCI6IGNoYXJDb2RlID0gNzg7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlPXCI6IGNoYXJDb2RlID0gNzk7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlQXCI6IGNoYXJDb2RlID0gODA7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlRXCI6IGNoYXJDb2RlID0gODE7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlSXCI6IGNoYXJDb2RlID0gODI7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlTXCI6IGNoYXJDb2RlID0gODM7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlUXCI6IGNoYXJDb2RlID0gODQ7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlVXCI6IGNoYXJDb2RlID0gODU7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlWXCI6IGNoYXJDb2RlID0gODY7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlXXCI6IGNoYXJDb2RlID0gODc7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlYXCI6IGNoYXJDb2RlID0gODg7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlZXCI6IGNoYXJDb2RlID0gODk7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlaXCI6IGNoYXJDb2RlID0gOTA7IGJyZWFrO1xuXG4gICAgY2FzZSBcIlNwYWNlXCI6IGNoYXJDb2RlID0gMzI7IGJyZWFrO1xuICAgIGNhc2UgXCJBcnJvd0xlZnRcIjogY2hhckNvZGUgPSAzNzsgYnJlYWs7XG4gICAgY2FzZSBcIkFycm93VXBcIjogY2hhckNvZGUgPSAzODsgYnJlYWs7XG4gICAgY2FzZSBcIkFycm93UmlnaHRcIjogY2hhckNvZGUgPSAzOTsgYnJlYWs7XG4gICAgY2FzZSBcIkFycm93RG93blwiOiBjaGFyQ29kZSA9IDQwOyBicmVhaztcbiAgfVxuICByZXR1cm4gY2hhckNvZGVcbn1cblxuZXhwb3J0IGNvbnN0IEtFWV9OQU1FID0ge1xuXHRcIkVOVEVSXCIgOiAxMyxcblx0XCJTUEFDRVwiIDogMzIsXG5cdFwiTEVGVFwiICA6IDM3LFxuXHRcIlVQXCIgICAgOiAzOCxcblx0XCJSSUdIVFwiIDogMzksXG5cdFwiRE9XTlwiICA6IDQwLFxuXHRcImFcIiAgICAgOiA2NSxcblx0XCJ6XCIgICAgIDogOTBcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBNTVMgfSBmcm9tICcuL1dXUydcbmltcG9ydCB7IGdldERpcywgS0VZX05BTUUsIGxvZywgcm5kLCBpbnQgfSBmcm9tICcuL1dXU2xpYi9VdGlsaXR5J1xuXG5jb25zdCBNU0xfTUFYID0gMTAwXG5jb25zdCBPQkpfTUFYID0gMTAwXG5jb25zdCBFRkNUX01BWCA9IDEwMFxuY2xhc3MgTXlHYW1lIGV4dGVuZHMgTU1TIHtcbiAgLy/oh6rmqZ/jga7nrqHnkIZcbiAgYmdYOiBudW1iZXIgPSAwXG4gIHNzWDogbnVtYmVyID0gMFxuICBzc1k6IG51bWJlciA9IDBcbiAgLy/oh6rmqZ/jgYzmiZPjgaTlvL7jga7nrqHnkIZcbiAgbXNsTnVtOiBudW1iZXIgPSAwXG4gIG1zbFg6IG51bWJlcltdID0gbmV3IEFycmF5KE1TTF9NQVgpXG4gIG1zbFk6IG51bWJlcltdID0gbmV3IEFycmF5KE1TTF9NQVgpXG4gIG1zbFhwOiBudW1iZXJbXSA9IG5ldyBBcnJheShNU0xfTUFYKVxuICBtc2xZcDogbnVtYmVyW10gPSBuZXcgQXJyYXkoTVNMX01BWClcbiAgbXNsRjogYm9vbGVhbltdID0gbmV3IEFycmF5KE1TTF9NQVgpXG4gIGF1dG9tYTogbnVtYmVyID0gMCAvL+W8vuOBruiHquWLleeZuuWwhFxuICB0bXI6IG51bWJlciA9IDAgLy/jgr/jgqTjg57jg7xcbiAgZW5lcmd5OiBudW1iZXIgPSAwIC8v44Ko44ON44Or44Ku44O8XG4gIG11dGVraTogbnVtYmVyID0gMCAvL+eEoeaVteeKtuaFi1xuXG4gIC8v54mp5L2T44Gu566h55CG44CA5pW15qmf44CB5pW144Gu5by+44KS566h55CGXG4gIG9ialR5cGU6IG51bWJlcltdID0gbmV3IEFycmF5KE9CSl9NQVgpIC8vb2JqVHlwZTogMDrmlbXmqZ/jgIAxOuaVteOBruW8vlxuICBvYmpJbWc6IG51bWJlcltdID0gbmV3IEFycmF5KE9CSl9NQVgpXG4gIG9ialg6IG51bWJlcltdID0gbmV3IEFycmF5KE9CSl9NQVgpXG4gIG9ialk6IG51bWJlcltdID0gbmV3IEFycmF5KE9CSl9NQVgpXG4gIG9ialhwOiBudW1iZXJbXSA9IG5ldyBBcnJheShPQkpfTUFYKVxuICBvYmpZcDogbnVtYmVyW10gPSBuZXcgQXJyYXkoT0JKX01BWClcbiAgb2JqTGlmZTogbnVtYmVyW10gPSBuZXcgQXJyYXkoT0JKX01BWClcbiAgb2JqRjogYm9vbGVhbltdID0gbmV3IEFycmF5KE9CSl9NQVgpXG4gIG9iak51bTogbnVtYmVyID0gMFxuXG4gIC8v44Ko44OV44Kn44Kv44OI44Gu566h55CGXG4gIGVmY3RYOiBudW1iZXJbXSA9IG5ldyBBcnJheShPQkpfTUFYKVxuICBlZmN0WTogbnVtYmVyW10gPSBuZXcgQXJyYXkoT0JKX01BWClcbiAgZWZjdE46IG51bWJlcltdID0gbmV3IEFycmF5KE9CSl9NQVgpXG4gIGVmY3ROdW06IG51bWJlciA9IDBcblxuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHN1cGVyKClcbiAgfVxuICBjbHJLZXkoKTogdm9pZCB7fVxuICBzZXR1cCgpOiB2b2lkIHtcbiAgICB0aGlzLmNhbnZhcy5jYW52YXNTaXplKDEyMDAsIDcyMClcbiAgICB0aGlzLmRyYXcubG9hZEltZygwLCBcImltYWdlMi9iZy5wbmdcIilcbiAgICB0aGlzLmRyYXcubG9hZEltZygxLCBcImltYWdlMi9zcGFjZXNoaXAucG5nXCIpXG4gICAgdGhpcy5kcmF3LmxvYWRJbWcoMiwgXCJpbWFnZTIvbWlzc2lsZS5wbmdcIilcbiAgICB0aGlzLmRyYXcubG9hZEltZygzLCAnaW1hZ2UyL2V4cGxvZGUucG5nJylcbiAgICBmb3IobGV0IGk9MDsgaTw9NDsgaSsrKSB0aGlzLmRyYXcubG9hZEltZyg0K2ksIGBpbWFnZTIvZW5lbXkke2l9LnBuZ2ApXG4gICAgdGhpcy5pbml0U1NoaXAoKVxuICAgIHRoaXMuaW5pdE1pc3NpbGUoKVxuICAgIHRoaXMuaW5pdE9qZWN0KClcbiAgICB0aGlzLmluaXRFZmZlY3QoKVxuICB9XG4gIG1haW5sb29wKCk6IHZvaWQge1xuICAgIHRoaXMudG1yKytcbiAgICB0aGlzLmRyYXdCRygxKVxuICAgIHRoaXMuc2V0RW5lbXkoKVxuICAgIHRoaXMubW92ZVNTaGlwKClcbiAgICB0aGlzLm1vdmVNaXNzaWxlKClcbiAgICB0aGlzLm1vdmVPamVjdCgpXG4gICAgdGhpcy5kcmF3RWZmZWN0KClcbiAgICAvL+OCqOODjeODq+OCruODvOOBruihqOekulxuICAgIGZvcihsZXQgaT0wOyBpPDEwOyBpKyspIHRoaXMuZHJhdy5mUmVjdCgyMCArIGkqMzAsIDY2MCwgMjAsIDQwLCBcIiNjMDAwMDBcIilcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5lbmVyZ3k7IGkrKylcbiAgICAgIHRoaXMuZHJhdy5mUmVjdCgyMCArIGkqMzAsIDY2MCwgMjAsIDQwLCB0aGlzLmRyYXcuY29sb3JSR0IoMTYwLTE2KmksIDI0MC0xMippLCAyNCppKSlcbiAgfVxuXG4gIGRyYXdCRyhzcGVlZDogbnVtYmVyKSB7XG4gICAgdGhpcy5iZ1ggPSAodGhpcy5iZ1ggKyBzcGVlZCkgJSAxMjAwXG4gICAgdGhpcy5kcmF3LmRyYXdJbWcoMCwgLXRoaXMuYmdYLCAwKVxuICAgIHRoaXMuZHJhdy5kcmF3SW1nKDAsIDEyMDAgLSB0aGlzLmJnWCwgMClcbiAgfVxuXG4gIGluaXRTU2hpcCgpIHtcbiAgICB0aGlzLnNzWCA9IDQwMFxuICAgIHRoaXMuc3NZID0gMzYwXG4gICAgdGhpcy5lbmVyZ3kgPSAxMFxuICB9XG5cbiAgbW92ZVNTaGlwKCkge1xuICAgIGlmKHRoaXMua2V5LmtleVtLRVlfTkFNRS5MRUZUXSA+IDAgJiYgdGhpcy5zc1ggPiA2MCkgdGhpcy5zc1ggLT0gMjBcbiAgICBpZih0aGlzLmtleS5rZXlbS0VZX05BTUUuUklHSFRdID4gMCAmJiB0aGlzLnNzWCA8IDEwMDApIHRoaXMuc3NYICs9IDIwXG4gICAgaWYodGhpcy5rZXkua2V5W0tFWV9OQU1FLlVQXSA+IDAgJiYgdGhpcy5zc1kgPiA0MCkgdGhpcy5zc1kgLT0gMjBcbiAgICBpZih0aGlzLmtleS5rZXlbS0VZX05BTUUuRE9XTl0gPiAwICYmIHRoaXMuc3NZIDwgNjgwKSB0aGlzLnNzWSArPSAyMFxuICAgIGlmKHRoaXMua2V5LmtleVtLRVlfTkFNRS5hXSA9PSAxKSB7XG4gICAgICB0aGlzLmtleS5rZXlbS0VZX05BTUUuYV0gKz0gMVxuICAgICAgdGhpcy5hdXRvbWEgPSAxIC0gdGhpcy5hdXRvbWFcbiAgICB9XG4gICAgaWYodGhpcy5hdXRvbWEgPT0gMCAmJiB0aGlzLmtleS5rZXlbS0VZX05BTUUuU1BBQ0VdID09IDEpIHtcbiAgICAgIHRoaXMua2V5LmtleVtLRVlfTkFNRS5TUEFDRV0gKz0gMVxuICAgICAgdGhpcy5zZXRNaXNzaWxlKHRoaXMuc3NYICsgNDAsIHRoaXMuc3NZLCA0MCwgMClcbiAgICB9XG4gICAgaWYodGhpcy5hdXRvbWEgPT0gMSAmJiB0aGlzLnRtciAlIDggPT0gMClcbiAgICAgIHRoaXMuc2V0TWlzc2lsZSh0aGlzLnNzWCArIDQwLCB0aGlzLnNzWSwgNDAsIDApXG4gICAgbGV0IGNvbCA9IFwiYmxhY2tcIlxuICAgIC8v44Kq44O844OI44Oe44OB44OD44Kv6KGo56S66YOoXG4gICAgaWYodGhpcy5hdXRvbWEgPT0gMSkgY29sID0gXCJ3aGl0ZVwiXG4gICAgdGhpcy5kcmF3LmZSZWN0KDkwMCwgMjAsIDI4MCwgNjAsIFwiYmx1ZVwiKVxuICAgIHRoaXMuZHJhdy5mVGV4dChcIltBXXV0byBNaXNzaWxlXCIsIDEwNDAsIDUwLCAzNiwgY29sKVxuICAgIC8v54Sh5pW144Oi44O844OJ44Gu44Ko44OV44Kn44Kv44OIXG4gICAgaWYodGhpcy5tdXRla2kgJSAyID09IDApXG4gICAgICB0aGlzLmRyYXcuZHJhd0ltZ0MoMSwgdGhpcy5zc1gsIHRoaXMuc3NZKVxuICAgIGlmKHRoaXMubXV0ZWtpID4gMCkgdGhpcy5tdXRla2ktLVxuICB9XG5cbiAgaW5pdE1pc3NpbGUoKSB7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IE1TTF9NQVg7IGkrKykgdGhpcy5tc2xGW2ldID0gZmFsc2VcbiAgICB0aGlzLm1zbE51bSA9IDBcblxuICB9XG4gIHNldE1pc3NpbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHhwOiBudW1iZXIsIHlwOiBudW1iZXIpIHtcbiAgICB0aGlzLm1zbFhbdGhpcy5tc2xOdW1dID0geFxuICAgIHRoaXMubXNsWVt0aGlzLm1zbE51bV0gPSB5XG4gICAgdGhpcy5tc2xYcFt0aGlzLm1zbE51bV0gPSB4cFxuICAgIHRoaXMubXNsWXBbdGhpcy5tc2xOdW1dID0geXBcbiAgICB0aGlzLm1zbEZbdGhpcy5tc2xOdW1dID0gdHJ1ZVxuICAgIHRoaXMubXNsTnVtID0gKHRoaXMubXNsTnVtICsgMSkgJSBNU0xfTUFYXG4gIH1cblxuICBtb3ZlTWlzc2lsZSgpIHtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgTVNMX01BWDsgaSsrKSB7XG4gICAgICBpZih0aGlzLm1zbEZbaV0gPT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLm1zbFhbaV0gKz0gdGhpcy5tc2xYcFtpXVxuICAgICAgICB0aGlzLm1zbFlbaV0gKz0gdGhpcy5tc2xZcFtpXVxuICAgICAgICB0aGlzLmRyYXcuZHJhd0ltZ0MoMiwgdGhpcy5tc2xYW2ldLCB0aGlzLm1zbFlbaV0pXG4gICAgICAgIGlmKHRoaXMubXNsWFtpXSA+IDEyMDApIHRoaXMubXNsRltpXSA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5pdE9qZWN0KCkge1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBPQkpfTUFYOyBpKyspIHtcbiAgICAgIHRoaXMub2JqRltpXSA9IGZhbHNlXG4gICAgfVxuICAgIHRoaXMub2JqTnVtID0gMFxuICB9XG5cbiAgc2V0T2JqZWN0KHR5cDogbnVtYmVyLCBwbmc6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHhwOiBudW1iZXIsIHlwOiBudW1iZXIsIGxpZjogbnVtYmVyKSB7XG4gICAgdGhpcy5vYmpUeXBlW3RoaXMub2JqTnVtXSA9IHR5cFxuICAgIHRoaXMub2JqSW1nW3RoaXMub2JqTnVtXSA9IHBuZ1xuICAgIHRoaXMub2JqWFt0aGlzLm9iak51bV0gPSB4XG4gICAgdGhpcy5vYmpZW3RoaXMub2JqTnVtXSA9IHlcbiAgICB0aGlzLm9ialhwW3RoaXMub2JqTnVtXSA9IHhwXG4gICAgdGhpcy5vYmpZcFt0aGlzLm9iak51bV0gPSB5cFxuICAgIHRoaXMub2JqTGlmZVt0aGlzLm9iak51bV0gPSBsaWZcbiAgICB0aGlzLm9iakZbdGhpcy5vYmpOdW1dID0gdHJ1ZVxuICAgIHRoaXMub2JqTnVtID0gKHRoaXMub2JqTnVtICsgMSkgJSBPQkpfTUFYXG4gIH1cblxuICBtb3ZlT2plY3QoKSB7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IE9CSl9NQVg7IGkrKykge1xuICAgICAgaWYodGhpcy5vYmpGW2ldID09IHRydWUpIHtcbiAgICAgICAgdGhpcy5vYmpYW2ldICs9IHRoaXMub2JqWHBbaV1cbiAgICAgICAgdGhpcy5vYmpZW2ldICs9IHRoaXMub2JqWXBbaV1cbiAgICAgICAgaWYodGhpcy5vYmpJbWdbaV0gPT0gNikgeyAvL+aVtTLjga7nibnmrorjgarli5XjgY1cbiAgICAgICAgICBpZih0aGlzLm9iallbaV0gPCA2MCkgdGhpcy5vYmpZcFtpXSA9IDhcbiAgICAgICAgICBpZih0aGlzLm9iallbaV0gPiA2NjApIHRoaXMub2JqWXBbaV0gPSAtOFxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMub2JqSW1nW2ldID09IDcpIHsgLy/mlbUz44Gu54m55q6K44Gq5YuV44GNXG4gICAgICAgICAgaWYodGhpcy5vYmpYcFtpXSA8IDApIHtcbiAgICAgICAgICAgIHRoaXMub2JqWHBbaV0gPSBpbnQodGhpcy5vYmpYcFtpXSAqIDAuOTUpXG4gICAgICAgICAgICBpZih0aGlzLm9ialhwW2ldID09IDApIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRPYmplY3QoMCwgNCwgdGhpcy5vYmpYW2ldLCB0aGlzLm9iallbaV0sIC0yMCwgMCwgMCkgLy/lvL7jgpLmkoPjgaRcbiAgICAgICAgICAgICAgdGhpcy5vYmpYcFtpXSA9IDIwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJhdy5kcmF3SW1nQyh0aGlzLm9iakltZ1tpXSwgdGhpcy5vYmpYW2ldLCB0aGlzLm9iallbaV0pIC8v54mp5L2T44Gu6KGo56S6XG5cbiAgICAgICAgLy/oh6rmqZ/jgYzmkoPjgaPjgZ/lvL7jgajjg5Ljg4Pjg4jjg4Hjgqfjg4Pjgq9cbiAgICAgICAgaWYodGhpcy5vYmpUeXBlW2ldID09IDEpIHsvL+aVteapn1xuICAgICAgICAgIGNvbnN0IHIgPSAxMiArICh0aGlzLmRyYXcuaW1nW3RoaXMub2JqSW1nW2ldXS53aWR0aCArIHRoaXMuZHJhdy5pbWdbdGhpcy5vYmpJbWdbaV1dLmhlaWdodCkgLyA0XG4gICAgICAgICAgZm9yKGxldCBuID0gMDsgbiA8IE1TTF9NQVg7IG4rKykgeyAvL+WFqOW8vuOBruWIpOWumuODgeOCp+ODg+OCr1xuICAgICAgICAgICAgaWYodGhpcy5tc2xGW25dID09IHRydWUpIHtcbiAgICAgICAgICAgICAgaWYoZ2V0RGlzKHRoaXMub2JqWFtpXSwgdGhpcy5vYmpZW2ldLCB0aGlzLm1zbFhbbl0sIHRoaXMubXNsWVtuXSkgPCByKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tc2xGW25dID0gZmFsc2VcbiAgICAgICAgICAgICAgICB0aGlzLm9iakxpZmVbaV0gLT0gMVxuICAgICAgICAgICAgICAgIGlmKHRoaXMub2JqTGlmZVtpXSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLm9iakZbaV0gPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFZmZlY3QodGhpcy5vYmpYW2ldLCB0aGlzLm9iallbaV0sIDkpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RWZmZWN0KHRoaXMub2JqWFtpXSwgdGhpcy5vYmpZW2ldLCAzKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL+iHquapn+OBqOOBruODkuODg+ODiOODgeOCp+ODg+OCr1xuICAgICAgICBjb25zdCByID0gMzAgKyAodGhpcy5kcmF3LmltZ1t0aGlzLm9iakltZ1tpXV0ud2lkdGggKyB0aGlzLmRyYXcuaW1nW3RoaXMub2JqSW1nW2ldXS5oZWlnaHQpIC8gNFxuICAgICAgICBpZihnZXREaXModGhpcy5vYmpYW2ldLCB0aGlzLm9iallbaV0sIHRoaXMuc3NYLCB0aGlzLnNzWSkgPCByKSB7XG4gICAgICAgICAgaWYodGhpcy5vYmpUeXBlW2ldIDw9IDEgJiYgdGhpcy5tdXRla2kgPT0gMCkgey8v5pW144Gu5by+44Go5pW15qmfXG4gICAgICAgICAgICB0aGlzLm9iakZbaV0gPSBmYWxzZVxuICAgICAgICAgICAgdGhpcy5lbmVyZ3kgLT0gMVxuICAgICAgICAgICAgdGhpcy5tdXRla2kgPSAzMFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLm9ialhbaV0gPCAtMTAwIHx8IHRoaXMub2JqWFtpXSA+IDEzMDAgfHwgdGhpcy5vYmpZW2ldIDwgLTEwMCB8fCB0aGlzLm9iallbaV0gPiA4MjApIHtcbiAgICAgICAgICB0aGlzLm9iakZbaV0gPSBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5pdEVmZmVjdCgpIHtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgRUZDVF9NQVg7IGkrKykge1xuICAgICAgdGhpcy5lZmN0TltpXSA9IDBcbiAgICB9XG4gICAgdGhpcy5lZmN0TnVtID0gMFxuICB9XG5cbiAgc2V0RWZmZWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCBuOm51bWJlcikge1xuICAgIHRoaXMuZWZjdFhbdGhpcy5lZmN0TnVtXSA9IHhcbiAgICB0aGlzLmVmY3RZW3RoaXMuZWZjdE51bV0gPSB5XG4gICAgdGhpcy5lZmN0Tlt0aGlzLmVmY3ROdW1dID0gblxuICAgIHRoaXMuZWZjdE51bSA9ICh0aGlzLmVmY3ROdW0gKyAxKSAlIEVGQ1RfTUFYXG4gIH1cblxuICBkcmF3RWZmZWN0KCkge1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBFRkNUX01BWDsgaSsrKSB7XG4gICAgICBpZih0aGlzLmVmY3ROW2ldID4gMCkge1xuICAgICAgICB0aGlzLmRyYXcuZHJhd0ltZ1RTKDMsICg5LXRoaXMuZWZjdE5baV0pICogMTI4LCAwLCAxMjgsIDEyOCwgdGhpcy5lZmN0WFtpXS02NCwgdGhpcy5lZmN0WVtpXS02NCwgMTI4LCAxMjgpXG4gICAgICAgIHRoaXMuZWZjdE5baV0tLVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldEVuZW15KCkge1xuICAgIGlmKHRoaXMudG1yICUgNjAgPT0gMCkgdGhpcy5zZXRPYmplY3QoMSwgNSwgMTMwMCwgNjAgKyBybmQoNjAwKSwgLTE2LCAwLCAxKSAvL+aVtTFcbiAgICBpZih0aGlzLnRtciAlIDYwID09IDEwKXRoaXMuc2V0T2JqZWN0KDEsIDYsIDEzMDAsIDYwICsgcm5kKDYwMCksIC0xMiwgOCwgMykgLy/mlbUyXG4gICAgaWYodGhpcy50bXIgJSA2MCA9PSAyMCl0aGlzLnNldE9iamVjdCgxLCA3LCAxMzAwLCAzNjAgKyBybmQoMzAwKSwgLTQ4LCAtMTAsIDUpIC8v5pW1M1xuICAgIGlmKHRoaXMudG1yICUgNjAgPT0gMzApdGhpcy5zZXRPYmplY3QoMSwgOCwgMTMwMCwgcm5kKDcyMC0xOTIpLCAtNiwgMCwgMCkgLy/pmpzlrrPnialcbiAgfVxufVxuXG5cblxubmV3IE15R2FtZSgpXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=