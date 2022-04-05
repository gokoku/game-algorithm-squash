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
        document.addEventListener("visibilitychange", this.vcProc.bind(this));
        window.addEventListener("load", this.wwsSysInit.bind(this));
        this.canvas = new Canvas_1.Canvas();
        this.draw = new Draw_1.Draw();
        this.se = new Sound_1.SE();
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
                if (this.touch.tapC != 0)
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
            this.canvas.cvs.addEventListener("touchmove", this.touch.touchMove.bind(this.touch));
            this.canvas.cvs.addEventListener("touchend", this.touch.end.bind(this.touch));
            this.canvas.cvs.addEventListener("touchcancel", this.touch.cancel.bind(this.touch));
        }
        else {
            this.canvas.cvs.addEventListener("mousedown", this.touch.down.bind(this.touch));
            this.canvas.cvs.addEventListener("mousemove", this.touch.mouseMove.bind(this.touch));
            this.canvas.cvs.addEventListener("mouseup", this.touch.up.bind(this.touch));
            this.canvas.cvs.addEventListener("mouseout", this.touch.out.bind(this.touch));
        }
        this.wwsSysMain();
    }
    vcProc() {
        if (document.visibilityState == "hidden") {
            stop_flg = 1;
            if (this.se.isBgm == 1) {
                this.se.pauseBgm();
                this.se.isBgm = 2;
            }
        }
        else if (document.visibilityState == "visible") {
            stop_flg = 0;
            if (this.se.isBgm == 2) {
                this.se.playBgm(this.se.bgmNo);
            }
        }
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
    // -------------------マウス入力系-------------------
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
    mouseMove(e) {
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
    // -------------------タップ入力系-------------------
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
    touchMove(e) {
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SE = exports.SOUND_ON = void 0;
const Utility_1 = __webpack_require__(/*! ./Utility */ "./src/WWSlib/Utility.ts");
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
    playBgm(n) {
        if (exports.SOUND_ON == false)
            return;
        (0, Utility_1.log)(`ＢＧＭ ${n} 出力`);
        this.bgmNo = n;
        this.soundFile[n].loop = true;
        this.soundFile[n].play();
        this.isBgm = 1; //BGM再生中
    }
    pauseBgm() {
        this.soundFile[this.bgmNo].pause();
        this.isBgm = 0; //BGM停止中
    }
    stopBgm() {
        this.soundFile[this.bgmNo].pause();
        this.soundFile[this.bgmNo].currentTime = 0;
        this.isBgm = 0; //BGM停止
    }
    rateSnd(rate) {
        this.soundFile[this.bgmNo].volume = rate;
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
        //ゲームの進行を管理する変数
        this.idx = 0;
        this.tmr = 0;
        //スコア
        this.score = 0;
        this.hisco = 1000; //ハイスコア
        this.stage = 0; //ステージ数
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
        this.mslImg = new Array(MSL_MAX);
        this.automa = 0; //弾の自動発射
        this.energy = 0; //エネルギー
        this.muteki = 0; //無敵状態
        this.weapon = 0; //武器のパワーアップ
        this.laser = 0; //レーザーの使用回数
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
        for (let i = 0; i <= 2; i++)
            this.draw.loadImg(9 + i, `image2/item${i}.png`);
        this.draw.loadImg(12, "image2/laser.png");
        this.draw.loadImg(13, "image2/title_ss.png");
        this.initSShip();
        this.initOject();
        this.initMissile();
        this.initEffect();
        this.se.loadSound(0, "sound/bgm.m4a");
        this.se.loadSound(1, "sound/explosion.mp3");
        this.se.loadSound(2, "sound/explosion02.mp3");
        this.se.loadSound(3, "sound/shot.mp3");
    }
    mainloop() {
        this.tmr++;
        this.drawBG(1);
        switch (this.idx) {
            case 0: //タイトル画面
                this.draw.drawImg(13, 200, 200);
                if (this.tmr % 40 < 20)
                    this.draw.fText("Press [SPC] or Click to start.", 600, 540, 40, "cyan");
                if (this.key.key[Utility_1.KEY_NAME.SPACE] > 0 || this.touch.tapC > 0) {
                    this.initSShip();
                    this.initOject();
                    this.score = 0;
                    this.stage = 1;
                    this.idx = 1;
                    this.tmr = 0;
                    this.se.playBgm(0);
                }
                break;
            case 1: //ゲーム中
                this.setEnemy();
                this.setItem();
                this.moveSShip();
                this.moveMissile();
                this.moveOject();
                this.drawEffect();
                //エネルギーの表示
                for (let i = 0; i < 10; i++)
                    this.draw.fRect(20 + i * 30, 660, 20, 40, "#c00000");
                for (let i = 0; i < this.energy; i++)
                    this.draw.fRect(20 + i * 30, 660, 20, 40, this.draw.colorRGB(160 - 16 * i, 240 - 12 * i, 24 * i));
                if (this.tmr < 30 * 4)
                    this.draw.fText("Stage " + this.stage, 600, 300, 50, "cyan");
                if (30 * 114 < this.tmr && this.tmr < 30 * 118)
                    this.draw.fText("STAGE CLEAR", 600, 300, 50, "cyan");
                if (this.tmr == 30 * 120) {
                    this.stage += 1;
                    this.tmr = 0;
                }
                break;
            case 2: //ゲームオーバー
                if (this.tmr < 30 * 2 && this.tmr % 5 == 1)
                    this.setEffect(this.ssX + (0, Utility_1.rnd)(120) - 60, this.ssY + (0, Utility_1.rnd)(80) - 40, 9);
                this.moveMissile();
                this.moveOject();
                this.drawEffect();
                this.draw.fText("GAME OVER", 600, 300, 50, "red");
                if (this.tmr > 30 * 5)
                    this.idx = 0;
                break;
        }
        //スコアの表示
        this.draw.fText(`SCORE ${this.score}`, 200, 50, 40, "white");
        this.draw.fText(`HISCORE ${this.hisco}`, 600, 50, 40, "yellow");
    }
    drawBG(speed) {
        this.bgX = (this.bgX + speed) % 1200;
        this.draw.drawImg(0, -this.bgX, 0);
        this.draw.drawImg(0, 1200 - this.bgX, 0);
        let hy = 580; //地面の地平線のY座標
        let ofsx = this.bgX % 40; //縦のラインを移動させるためのオフセット
        this.draw.lineW(2);
        for (let i = 1; i <= 30; i++) {
            const tx = i * 40 - ofsx;
            const bx = i * 240 - ofsx * 6 - 3000;
            this.draw.line(tx, hy, bx, 720, "silver");
        }
        for (let i = 1; i <= 30; i++) {
            this.draw.lineW(1 + (0, Utility_1.int)(i / 3));
            this.draw.line(0, hy, 1200, hy, "gray");
            hy = hy + i * 2;
        }
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
            this.setWeapon();
        }
        if (this.automa == 1 && this.tmr % 8 == 0)
            this.setWeapon();
        let col = "black";
        //オートマチック表示部
        if (this.automa == 1)
            col = "white";
        this.draw.fRect(900, 20, 280, 60, "blue");
        this.draw.fText("[A]uto Missile", 1040, 50, 36, col);
        //Tap 操作
        if (this.touch.tapC > 0) {
            if (900 < this.touch.tapX && this.touch.tapX < 1180
                && 20 < this.touch.tapY && this.touch.tapY < 80) {
                this.automa = 1 - this.automa;
                this.touch.tapC = 0;
            }
            else {
                this.ssX = this.ssX + (0, Utility_1.int)((this.touch.tapX - this.ssX) / 6);
                this.ssY = this.ssY + (0, Utility_1.int)((this.touch.tapY - this.ssY) / 6);
            }
        }
        //無敵モードのエフェクト
        if (this.muteki % 2 == 0)
            this.draw.drawImgC(1, this.ssX, this.ssY);
        if (this.muteki > 0)
            this.muteki--;
    }
    setWeapon() {
        let n = this.weapon;
        this.se.playSE(3);
        if (n > 8)
            n = 8;
        for (let i = 0; i <= n; i++) {
            this.setMissile(this.ssX + 40, this.ssY - n * 6 + i * 12, 40, (0, Utility_1.int)((i - n / 2) * 2));
        }
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
        this.mslImg[this.mslNum] = 2;
        if (this.laser > 0) { //レーザー
            this.laser -= 1;
            this.mslImg[this.mslNum] = 12;
        }
        this.mslNum = (this.mslNum + 1) % MSL_MAX;
    }
    moveMissile() {
        for (let i = 0; i < MSL_MAX; i++) {
            if (this.mslF[i] == true) {
                this.mslX[i] += this.mslXp[i];
                this.mslY[i] += this.mslYp[i];
                this.draw.drawImgC(this.mslImg[i], this.mslX[i], this.mslY[i]);
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
                    const r = 12 + (this.draw.img[this.objImg[i]].width + this.draw.img[this.objImg[i]].height) / 4; //ヒットチェック半径
                    for (let n = 0; n < MSL_MAX; n++) { //全弾の判定チェック
                        if (this.mslF[n] == true) {
                            if ((0, Utility_1.getDis)(this.objX[i], this.objY[i], this.mslX[n], this.mslY[n]) < r) {
                                if (this.mslImg[n] == 2)
                                    this.mslF[n] = false; //通常弾と貫通弾の違い
                                this.objLife[i] -= 1;
                                if (this.objLife[i] == 0) {
                                    this.objF[i] = false;
                                    this.score = this.score + 100;
                                    this.se.playSE(1);
                                    if (this.score > this.hisco)
                                        this.hisco = this.score;
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
                if (this.idx == 1) {
                    const r = 30 + (this.draw.img[this.objImg[i]].width + this.draw.img[this.objImg[i]].height) / 4;
                    if ((0, Utility_1.getDis)(this.objX[i], this.objY[i], this.ssX, this.ssY) < r) {
                        if (this.objType[i] <= 1 && this.muteki == 0) { //敵の弾と敵機
                            this.objF[i] = false;
                            this.se.playSE(2);
                            this.setEffect(this.objX[i], this.objY[i], 9);
                            this.energy -= 1;
                            this.muteki = 30;
                            if (this.energy == 0) {
                                this.idx = 2;
                                this.tmr = 0;
                                this.se.stopBgm();
                            }
                        }
                        if (this.objType[i] == 2) { //アイテム
                            this.objF[i] = false;
                            if (this.objImg[i] == 9 && this.energy < 10)
                                this.energy += 1;
                            if (this.objImg[i] == 10)
                                this.weapon += 1;
                            if (this.objImg[i] == 11)
                                this.laser += 100;
                        }
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
        const sec = (0, Utility_1.int)(this.tmr / 30);
        if (4 <= sec && sec < 10) {
            if (this.tmr % 20 == 0)
                this.setObject(1, 5, 1300, 60 + (0, Utility_1.rnd)(600), -16, 0, 1 * this.stage); //敵1
        }
        if (14 <= sec && sec < 20) {
            if (this.tmr % 20 == 0)
                this.setObject(1, 6, 1300, 60 + (0, Utility_1.rnd)(600), -12, 8, 3 * this.stage); //敵2
        }
        if (24 <= sec && sec < 30) {
            if (this.tmr % 20 == 0)
                this.setObject(1, 7, 1300, 360 + (0, Utility_1.rnd)(300), -48, -10, 5 * this.stage); //敵3
        }
        if (34 <= sec && sec < 50) {
            if (this.tmr % 60 == 0)
                this.setObject(1, 8, 1300, (0, Utility_1.rnd)(720 - 192), -6, 0, 0); //障害物
        }
        if (54 <= sec && sec < 70) {
            if (this.tmr % 20 == 0) {
                if (this.tmr % 20 == 0)
                    this.setObject(1, 5, 1300, (0, Utility_1.rnd)(300), -16, 4, 1 * this.stage); //敵1
                if (this.tmr % 20 == 0)
                    this.setObject(1, 5, 1300, (0, Utility_1.rnd)(300), -16, 4, 1 * this.stage); //敵1
            }
        }
        if (74 <= sec && sec < 90) {
            if (this.tmr % 20 == 0)
                this.setObject(1, 6, 1300, (0, Utility_1.rnd)(600), -12, 8, 3 * this.stage); //敵2
            if (this.tmr % 45 == 0)
                this.setObject(1, 8, 1300, (0, Utility_1.rnd)(720 - 192), -8, 0, 0); //障害物
        }
        if (94 <= sec && sec < 110) {
            if (this.tmr % 10 == 0)
                this.setObject(1, 5, 1300, 360, -24, (0, Utility_1.rnd)(11) - 5, 1 * this.stage); //敵1
            if (this.tmr % 20 == 0)
                this.setObject(1, 7, 1300, (0, Utility_1.rnd)(300), -56, 4 + (0, Utility_1.rnd)(12), 5 * this.stage); //敵3
        }
    }
    setItem() {
        if (this.tmr % 90 == 0)
            this.setObject(2, 9, 1300, 60 + (0, Utility_1.rnd)(600), -10, 0, 0); //Energy
        if (this.tmr % 90 == 30)
            this.setObject(2, 10, 1300, 60 + (0, Utility_1.rnd)(600), -10, 0, 0); //Missile
        if (this.tmr % 90 == 60)
            this.setObject(2, 11, 1300, 60 + (0, Utility_1.rnd)(600), -10, 0, 0); //Laser
    }
}
new MyGame();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1NBQ2xCO0lBQ0gsQ0FBQztJQUVELFVBQVU7SUFDVixRQUFRLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ3RDLElBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLO1lBQUUsT0FBTTtRQUN0QyxJQUFJLElBQUksQ0FBQyxFQUFFO1lBQ1QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQUcsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQUcsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQsTUFBTTtJQUNOLFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUM1RCxJQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSztZQUFFLE9BQU07UUFDdEMsSUFBSSxJQUFJLENBQUMsRUFBRTtZQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FB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SyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUFDLE1BQU07UUFDbEMsS0FBSyxNQUFNO1lBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztZ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QyxFQUFFLENBQUMsSUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJO1lBQ3hCLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJO1lBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUM7U0FDMUM7UUFDRCxLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLElBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxpQkFBRyxFQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDO1lBQ3ZDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUM7U0FDaEI7SUFDSCxDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRztRQUNkLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRztRQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRTtJQUNsQixDQUFDO0lBRUQsU0FBUztRQUNQLElBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFO1lBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO1FBQ25FLElBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJO1lBQUUs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Q0gsQ0FBQztJQUVELFNBQVM7UUFDUCxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSztTQUNyQjtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQztJQUNqQixDQUFDO0lBRUQsU0FBUyxDQUFDLEdBQVcsRUFBRSxHQUFXLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxFQUFVLEVBQUUsRUFBVSxFQUFFLEdBQVc7UUFDM0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRztRQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHO1FBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO1FBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRztRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJO1FBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU87SUFDM0MsQ0FBQztJQUVELFNBQVM7UUFDUCxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9CLElBQUcsSUFBSSxDQUFDLElBQUksQ0FB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c3JjL1dXU2xpYi9DYW52YXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9EZXZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9EcmF3LnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvRXZlbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9Tb3VuZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV1dTbGliL1V0aWxpdHkudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuSmF2YVNjcmlwdCZIVE1MNSDjgrLjg7zjg6DplovnmbrnlKjjgrfjgrnjg4bjg6BcbumWi+eZuiDjg6/jg7zjg6vjg4njg6/jgqTjg4njgr3jg5Xjg4jjgqbjgqfjgqLmnInpmZDkvJrnpL5cblxu77yI5L2/55So5p2h5Lu277yJXG7mnKzjgr3jg7zjgrnjgrPjg7zjg4njga7okZfkvZzmqKnjga/plovnmbrlhYPjgavjgYLjgorjgb7jgZnjgIJcbuWIqeeUqOOBleOCjOOBn+OBhOaWueOBr+ODoeODvOODq+OBq+OBpuOBiuWVj+OBhOWQiOOCj+OBm+S4i+OBleOBhOOAglxudGhAd3dzZnQuY29tIOODr+ODvOODq+ODieODr+OCpOODieOCveODleODiOOCpuOCp+OCoiDlu6PngKxcbiovXG5cbmltcG9ydCB7IGludCwgbG9nIH0gZnJvbSAnLi9XV1NsaWIvVXRpbGl0eSdcbmltcG9ydCB7IFRvdWNoLCBLZXksIEFjY30gZnJvbSBcIi4vV1dTbGliL0V2ZW50XCJcbmltcG9ydCB7IENXSURUSCwgQ0hFSUdIVCwgQ2FudmFzLCBTQ0FMRSB9IGZyb20gXCIuL1dXU2xpYi9DYW52YXNcIlxuaW1wb3J0IHsgRHJhdyB9IGZyb20gXCIuL1dXU2xpYi9EcmF3XCJcbmltcG9ydCB7IFNFIH0gZnJvbSAnLi9XV1NsaWIvU291bmQnXG5pbXBvcnQgeyBEZXZpY2UsIFBUX0FuZHJvaWQsIFBUX2lPUywgUFRfS2luZGxlIH0gZnJvbSAnLi9XV1NsaWIvRGV2aWNlJ1xuLy8gLS0tLS0tLS0tLS0tLeWkieaVsC0tLS0tLS0tLS0tLS1cbmV4cG9ydCBjb25zdCAgU1lTX1ZFUiA9IFwiVmVyLjIwMjAxMTExXCJcbmV4cG9ydCBsZXQgIERFQlVHID0gZmFsc2VcblxuXG4vL+WHpueQhuOBrumAsuihjOOCkueuoeeQhuOBmeOCi1xuLy8gbWFpbl9pZHgg44Gu5YCkXG4vLyAgIDA6IOWIneacn+WMllxuLy8gICAxOiDjgrvjg7zjg5bjgafjgY3jgarjgYTorablkYpcbi8vICAgMjog44Oh44Kk44Oz5Yem55CGXG5sZXQgbWFpbl9pZHggPSAwXG5sZXQgbWFpbl90bXIgPSAwXG5sZXQgc3RvcF9mbGcgPSAwIC8vIOODoeOCpOODs+WHpueQhuOBruS4gOaZguWBnOatolxuY29uc3QgTlVBID0gbmF2aWdhdG9yLnVzZXJBZ2VudDsvL+apn+eoruWIpOWumlxuY29uc3Qgc3VwcG9ydFRvdWNoID0gJ29udG91Y2hlbmQnIGluIGRvY3VtZW50Oy8v44K/44OD44OB44Kk44OZ44Oz44OI44GM5L2/44GI44KL44GL77yfXG5cbi8vIOODleODrOODvOODoOODrOODvOODiCBmcmFtZXMgLyBzZWNvbmRcbmxldCAgRlBTID0gMzBcbi8v44Ot44O844Kr44Or44K544OI44Os44O844K4XG5jb25zdCBMU19LRVlOQU1FID0gXCJTQVZFREFUQVwiOy8va2V5TmFtZSDku7vmhI/jgavlpInmm7Tlj69cbi8v5L+d5a2Y44Gn44GN44KL44GL5Yik5a6a44GX44CB44Gn44GN44Gq44GE5aC05ZCI44Gr6K2m5ZGK44KS5Ye644GZ44CA5YW35L2T55qE44Gr44GvIGlPUyBTYWZhcmkg44OX44Op44Kk44OZ44O844OI44OW44Op44Km44K644GMT07vvIjkv53lrZjjgafjgY3jgarjgYTvvInnirbmhYvjgavorablkYrjgpLlh7rjgZlcbmxldCBDSEVDS19MUyA9IGZhbHNlO1xuXG4vLyAtLS0tLS0tLS0tLS0t44Oq44Ki44Or44K/44Kk44Og5Yem55CGLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1NUyB7XG4gIGFic3RyYWN0IHNldHVwKCk6IHZvaWRcbiAgYWJzdHJhY3QgbWFpbmxvb3AoKTogdm9pZFxuXG4gIHB1YmxpYyBjYW52YXM6IENhbnZhc1xuICBwdWJsaWMgZHJhdzogRHJhd1xuICBwdWJsaWMgdG91Y2g6IFRvdWNoXG4gIHB1YmxpYyBrZXk6IEtleVxuICBwdWJsaWMgc2U6IFNFXG4gIHB1YmxpYyBkZXZpY2U6IERldmljZVxuICBwdWJsaWMgYWNjOiBBY2NcbiAgcHVibGljIGZyYW1lU2VjOiBudW1iZXJcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCB0aGlzLnZjUHJvYy5iaW5kKHRoaXMpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCB0aGlzLnd3c1N5c0luaXQuYmluZCh0aGlzKSlcbiAgICB0aGlzLmNhbnZhcyA9IG5ldyBDYW52YXMoKVxuICAgIHRoaXMuZHJhdyA9IG5ldyBEcmF3KClcbiAgICB0aGlzLnNlID0gbmV3IFNFKClcbiAgICB0aGlzLnRvdWNoID0gbmV3IFRvdWNoKHRoaXMuc2UpXG4gICAgdGhpcy5rZXkgPSBuZXcgS2V5KHRoaXMuc2UpXG4gICAgdGhpcy5kZXZpY2UgPSBuZXcgRGV2aWNlKClcbiAgICB0aGlzLmFjYyA9IG5ldyBBY2ModGhpcy5kZXZpY2UpXG4gICAgdGhpcy5mcmFtZVNlYyA9IGludCgxMDAwIC8gRlBTKVxuICB9XG5cbiAgd3dzU3lzTWFpbigpOiB2b2lkIHtcblxuICAgIGxldCBzdGltZSA9IERhdGUubm93KClcbiAgICAvL+ODluODqeOCpuOCtuOBruOCteOCpOOCuuOBjOWkieWMluOBl+OBn+OBi++8n++8iOOCueODnuODm+OBquOCieaMgeOBoeaWueOCkuWkieOBiOOBn+OBi+OAgOe4puaMgeOBoeKHlOaoquaMgeOBoe+8iVxuICAgIGlmKHRoaXMuY2FudmFzLmJha1cgIT0gd2luZG93LmlubmVyV2lkdGggfHwgdGhpcy5jYW52YXMuYmFrSCAhPSB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIHRoaXMuY2FudmFzLmluaXRDYW52YXMoKVxuICAgICAgbG9nKFwiY2FudmFzIHNpemUgY2hhbmdlZCBcIiArIHRoaXMuY2FudmFzLmJha1cgKyBcInhcIiArIHRoaXMuY2FudmFzLmJha0gpO1xuICAgIH1cblxuICAgIG1haW5fdG1yICsrXG5cbiAgICBzd2l0Y2gobWFpbl9pZHgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgdGhpcy5zZXR1cCgpXG4gICAgICAgIHRoaXMua2V5LmNscigpXG4gICAgICAgIG1haW5faWR4ID0gMlxuICAgICAgICBpZihDSEVDS19MUyA9PSB0cnVlKSB7XG4gICAgICAgICAgdHJ5IHtsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIl9zYXZlX3Rlc3RcIiwgXCJ0ZXN0ZGF0YVwiKX0gY2F0Y2goZSkgeyBtYWluX2lkeCA9IDEgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IHggPSBpbnQoQ1dJRFRIIC8gMilcbiAgICAgICAgbGV0IHkgPSBpbnQoQ0hFSUdIVCAvIDYpXG4gICAgICAgIGxldCBmcyA9IGludChDSEVJR0hUIC8gMTYpXG4gICAgICAgIHRoaXMuZHJhdy5maWxsKFwiYmxhY2tcIilcbiAgICAgICAgdGhpcy5kcmF3LmZUZXh0KFwi4oC744K744O844OW44OH44O844K/44GM5L+d5a2Y44GV44KM44G+44Gb44KT4oC7XCIsIHgsIHkvMiwgZnMsIFwieWVsbG93XCIpO1xuICAgICAgICB0aGlzLmRyYXcuZlRleHROKFwiaU9T56uv5pyr44KS44GK5L2/44GE44Gu5aC05ZCI44GvXFxuU2FmYXJp44Gu44OX44Op44Kk44OZ44O844OI44OW44Op44Km44K6XFxu44KS44Kq44OV44Gr44GX44Gm6LW35YuV44GX44Gm5LiL44GV44GE44CCXCIsIHgsIHkqMiwgeSwgZnMsIFwieWVsbG93XCIpO1xuICAgICAgICB0aGlzLmRyYXcuZlRleHROKFwi44Gd44Gu5LuW44Gu5qmf56iu77yI44OW44Op44Km44K277yJ44Gn44GvXFxu44Ot44O844Kr44Or44K544OI44Os44O844K444G444Gu5L+d5a2Y44KSXFxu6Kix5Y+v44GZ44KL6Kit5a6a44Gr44GX44Gm5LiL44GV44GE44CCXCIsIHgsIHkqNCwgeSwgZnMsIFwieWVsbG93XCIpO1xuICAgICAgICB0aGlzLmRyYXcuZlRleHQoXCLjgZPjga7jgb7jgb7ntprjgZHjgovjgavjga/nlLvpnaLjgpLjgr/jg4Pjg5dcIiwgeCwgeSo1LjUsIGZzLCBcImxpbWVcIik7XG4gICAgICAgIGlmKHRoaXMudG91Y2gudGFwQyAhPSAwKSBtYWluX2lkeCA9IDI7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDI6IC8v44Oh44Kk44Oz5Yem55CGXG4gICAgICAgIGlmKHN0b3BfZmxnID09IDApIHtcbiAgICAgICAgICB0aGlzLm1haW5sb29wKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmtleS5jbHIoKVxuICAgICAgICAgIG1haW5fdG1yLS1cbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLnNlLndhaXRfc2UgPiAwKSB0aGlzLnNlLndhaXRfc2UtLVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDogYnJlYWtcbiAgICB9XG4gICAgdmFyIHB0aW1lID0gRGF0ZS5ub3coKSAtIHN0aW1lXG4gICAgaWYocHRpbWUgPCAwKSBwdGltZSA9IDBcbiAgICBpZihwdGltZSA+IHRoaXMuZnJhbWVTZWMpIHB0aW1lID0gaW50KHB0aW1lIC8gdGhpcy5mcmFtZVNlYykgKiB0aGlzLmZyYW1lU2VjXG5cbiAgICBpZihERUJVRykgey8v4piF4piF4piF44OH44OQ44OD44KwXG4gICAgICBsZXQgaTogbnVtYmVyXG4gICAgICBsZXQgeDogbnVtYmVyID0gMjQwXG4gICAgICBsZXQgeTogbnVtYmVyXG4gICAgICB0aGlzLmRyYXcuZlRleHQoXCLlh6bnkIbmmYLplpM9XCIrKHB0aW1lKSwgeCwgNTAsIDE2LCBcImxpbWVcIik7XG4gICAgICB0aGlzLmRyYXcuZlRleHQoYGRldmljZVR5cGU9ICR7dGhpcy5kZXZpY2UudHlwZX1gLCB4LCAxMDAsIDE2LCBcInllbGxvd1wiKTtcbiAgICAgIC8vdGhpcy5kcmF3LmZUZXh0KGBpc0JnbT0gJHtpc0JnbX0gKCR7YmdtTm99KWAsIHgsIDE1MCwgMTYsIFwieWVsbG93XCIpO1xuICAgICAgdGhpcy5kcmF3LmZUZXh0KGB3aW5XPSR7dGhpcy5jYW52YXMud2luV30gd2luSD0ke3RoaXMuY2FudmFzLndpbkh9IFNDQUxFPSAke1NDQUxFfWAsIHgsIDIwMCwgMTYsIFwieWVsbG93XCIpO1xuICAgICAgdGhpcy5kcmF3LmZUZXh0KGAke21haW5faWR4fSA6ICR7bWFpbl90bXJ9ICgke3RoaXMudG91Y2gudGFwWH0gJHt0aGlzLnRvdWNoLnRhcFl9KSAke3RoaXMudG91Y2gudGFwQ31gLCB4LCAyNTAsIDE2LCBcImN5YW5cIilcbiAgICAgIHRoaXMuZHJhdy5mVGV4dChg5Yqg6YCf5bqmICR7dGhpcy5hY2MuYWNYfSA6ICR7dGhpcy5hY2MuYWNZfSA6ICR7dGhpcy5hY2MuYWNafWAsIHgsIDMwMCwgMTYsIFwicGlua1wiKTtcbiAgICAgIGZvcihpID0gMDsgaSA8IDI1NjsgaSsrKSB7XG4gICAgICAgIHggPSBpJTE2XG4gICAgICAgIHkgPSBpbnQoaS8xNik7XG4gICAgICAgIHRoaXMuZHJhdy5mVGV4dChgJHt0aGlzLmtleS5rZXlbaV19YCwgMTUrMzAqeCwgMTUrMzAqeSwgMTIsIFwid2hpdGVcIilcbiAgICAgIH1cbiAgICB9XG4gICAgc2V0VGltZW91dCh0aGlzLnd3c1N5c01haW4uYmluZCh0aGlzKSwgdGhpcy5mcmFtZVNlYyAtIHB0aW1lKVxuICB9XG5cbiAgd3dzU3lzSW5pdCgpIHtcbiAgICB0aGlzLmNhbnZhcy5pbml0Q2FudmFzKClcbiAgICBpZiggTlVBLmluZGV4T2YoJ0FuZHJvaWQnKSA+IDAgKSB7XG4gICAgICB0aGlzLmRldmljZS50eXBlID0gUFRfQW5kcm9pZDtcbiAgICB9XG4gICAgZWxzZSBpZiggTlVBLmluZGV4T2YoJ2lQaG9uZScpID4gMCB8fCBOVUEuaW5kZXhPZignaVBvZCcpID4gMCB8fCBOVUEuaW5kZXhPZignaVBhZCcpID4gMCApIHtcbiAgICAgIHRoaXMuZGV2aWNlLnR5cGUgPSBQVF9pT1M7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwxKTsvL2lQaG9uZeOBrlVSTOODkOODvOOCkua2iOOBmeS9jee9ruOBq1xuICAgIH1cbiAgICBlbHNlIGlmKCBOVUEuaW5kZXhPZignU2lsaycpID4gMCApIHtcbiAgICAgIHRoaXMuZGV2aWNlLnR5cGUgPSBQVF9LaW5kbGU7XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMua2V5Lm9uLmJpbmQodGhpcy5rZXkpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5rZXkub2ZmLmJpbmQodGhpcy5rZXkpKVxuXG4gICAgaWYoc3VwcG9ydFRvdWNoID09IHRydWUpIHtcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCB0aGlzLnRvdWNoLnN0YXJ0LmJpbmQodGhpcy50b3VjaCkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLnRvdWNoLnRvdWNoTW92ZS5iaW5kKHRoaXMudG91Y2gpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLnRvdWNoLmVuZC5iaW5kKHRoaXMudG91Y2gpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCB0aGlzLnRvdWNoLmNhbmNlbC5iaW5kKHRoaXMudG91Y2gpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLnRvdWNoLmRvd24uYmluZCh0aGlzLnRvdWNoKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMudG91Y2gubW91c2VNb3ZlLmJpbmQodGhpcy50b3VjaCkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy50b3VjaC51cC5iaW5kKHRoaXMudG91Y2gpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCB0aGlzLnRvdWNoLm91dC5iaW5kKHRoaXMudG91Y2gpKVxuICAgIH1cbiAgICB0aGlzLnd3c1N5c01haW4oKVxuICB9XG5cbiAgdmNQcm9jKCkge1xuICAgIGlmKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PSBcImhpZGRlblwiKSB7XG4gICAgICBzdG9wX2ZsZyA9IDFcbiAgICAgIGlmKHRoaXMuc2UuaXNCZ20gPT0gMSkge1xuICAgICAgICB0aGlzLnNlLnBhdXNlQmdtKClcbiAgICAgICAgdGhpcy5zZS5pc0JnbSA9IDJcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09IFwidmlzaWJsZVwiKSB7XG4gICAgICBzdG9wX2ZsZyA9IDBcbiAgICAgIGlmKHRoaXMuc2UuaXNCZ20gPT0gMikge1xuICAgICAgICB0aGlzLnNlLnBsYXlCZ20odGhpcy5zZS5iZ21ObylcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7aW50LCBsb2d9IGZyb20gXCIuL1V0aWxpdHlcIlxuXG4vLyAtLS0tLS0tLS0tLS0t5o+P55S76Z2iKOOCreODo+ODs+ODkOOCuSktLS0tLS0tLS0tLS0tXG5leHBvcnQgbGV0IENXSURUSCA9IDgwMFxuZXhwb3J0IGxldCBDSEVJR0hUID0gNjAwXG5leHBvcnQgbGV0IFNDQUxFID0gMS4wIC8vIOOCueOCseODvOODq+WApOioreWumivjgr/jg4Pjg5fkvY3nva7oqIjnrpfnlKhcbmV4cG9ydCBjbGFzcyBDYW52YXMge1xuXG4gIHB1YmxpYyBjdnM6IEhUTUxDYW52YXNFbGVtZW50XG4gIHB1YmxpYyBiZzogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbFxuICBwdWJsaWMgd2luVzogbnVtYmVyXG4gIHB1YmxpYyB3aW5IOiBudW1iZXJcbiAgcHVibGljIGJha1c6IG51bWJlclxuICBwdWJsaWMgYmFrSDogbnVtYmVyXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jdnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuICAgIHRoaXMuYmcgPSB0aGlzLmN2cy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICB0aGlzLndpblcgPSAwXG4gICAgdGhpcy53aW5IID0gMFxuICAgIHRoaXMuYmFrVyA9IDBcbiAgICB0aGlzLmJha0ggPSAwXG4gIH1cbiAgaW5pdENhbnZhcygpIHtcbiAgICB0aGlzLndpblcgPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIHRoaXMud2luSCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIHRoaXMuYmFrVyA9IHRoaXMud2luV1xuICAgIHRoaXMuYmFrSCA9IHRoaXMud2luSFxuXG4gICAgaWYoIHRoaXMud2luSCA8ICh0aGlzLndpblcgKiBDSEVJR0hUIC8gQ1dJRFRIKSApIHtcbiAgICAgIC8vd2luVyDjgpLmr5TnjofjgavlkIjjgo/jgZvjgaboqr/mlbRcbiAgICAgIHRoaXMud2luVyA9IGludCh0aGlzLndpbkggKiBDV0lEVEggLyBDSEVJR0hUKVxuICAgIH0gZWxzZSB7XG4gICAgICAvL3dpbkgg44KS5q+U546H44Gr5ZCI44KP44Gb44Gm6Kq/5pW0XG4gICAgICB0aGlzLndpbkggPSBpbnQodGhpcy53aW5XICogQ0hFSUdIVCAvIENXSURUSClcbiAgICB9XG5cbiAgICB0aGlzLmN2cy53aWR0aCA9IHRoaXMud2luV1xuICAgIHRoaXMuY3ZzLmhlaWdodCA9IHRoaXMud2luSFxuICAgIFNDQUxFID0gdGhpcy53aW5XIC8gQ1dJRFRIXG5cbiAgICBpZih0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuc2NhbGUoU0NBTEUsIFNDQUxFKVxuICAgIHRoaXMuYmcudGV4dEFsaWduID0gXCJjZW50ZXJcIlxuICAgIHRoaXMuYmcudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIlxuXG4gICAgLy9sb2coYHdpZHRoOiAke3RoaXMud2luV30gaGVpZ2h0OiR7dGhpcy53aW5IfSBzY2FsZToke1NDQUxFfWApXG4gICAgLy9sb2coYGlubmVyIHdpZHRoOiAke3dpbmRvdy5pbm5lcldpZHRofSBpbm5lciBoZWlnaHQ6JHt3aW5kb3cuaW5uZXJIZWlnaHR9YClcbiAgfVxuXG4gIGNhbnZhc1NpemUodzogbnVtYmVyLCBoOiBudW1iZXIpIHtcbiAgICBDV0lEVEggPSB3XG4gICAgQ0hFSUdIVCA9IGhcbiAgICB0aGlzLmluaXRDYW52YXMoKVxuICB9XG59XG4iLCIvL+err+acq+OBrueorumhnlxuZXhwb3J0IGxldCBQVF9QQ1x0XHQ9IDA7XG5leHBvcnQgbGV0IFBUX2lPU1x0XHQ9IDE7XG5leHBvcnQgbGV0IFBUX0FuZHJvaWRcdD0gMjtcbmV4cG9ydCBsZXQgUFRfS2luZGxlXHQ9IDM7XG5cbmV4cG9ydCBjbGFzcyBEZXZpY2Uge1xuICBwcml2YXRlIF90eXBlOiBudW1iZXJcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fdHlwZSA9IFBUX1BDXG4gIH1cbiAgZ2V0IHR5cGUoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3R5cGUgfVxuICBzZXQgdHlwZSh0eXBlOiBudW1iZXIpIHsgdGhpcy5fdHlwZSA9IHR5cGUgfVxufVxuIiwiaW1wb3J0IHsgaW50LCBsb2cgfSBmcm9tIFwiLi9VdGlsaXR5XCJcbmltcG9ydCB7IENXSURUSCwgQ0hFSUdIVCwgQ2FudmFzIH0gZnJvbSAnLi9DYW52YXMnXG5cbmV4cG9ydCBjbGFzcyBEcmF3IGV4dGVuZHMgQ2FudmFze1xuLy8gLS0tLS0tLS0tLS0tLeeUu+WDj+OBruiqreOBv+i+vOOBvy0tLS0tLS0tLS0tLS1cbiAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50W11cbiAgaW1nX2xvYWRlZDogQm9vbGVhbltdXG4gIGxpbmVfd2lkdGg6IG51bWJlclxuXG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuaW1nID0gbmV3IEFycmF5KDI1NilcbiAgICB0aGlzLmltZ19sb2FkZWQgPSBuZXcgQXJyYXkoMjU2KVxuICAgIHRoaXMubGluZV93aWR0aCA9IDFcbiAgfVxuXG4gIGxvYWRJbWcobjogbnVtYmVyLCBmaWxlbmFtZTogc3RyaW5nKSB7XG4gICAgLy9sb2coXCLnlLvlg49cIiArIG4gKyBcIiBcIiArIGZpbGVuYW1lICsgXCLoqq3jgb/ovrzjgb/plovlp4tcIilcbiAgICB0aGlzLmltZ19sb2FkZWRbbl0gPSBmYWxzZVxuICAgIHRoaXMuaW1nW25dID0gbmV3IEltYWdlKClcbiAgICB0aGlzLmltZ1tuXS5zcmMgPSBmaWxlbmFtZVxuICAgIHRoaXMuaW1nW25dLm9ubG9hZCA9ICgpID0+e1xuICAgICAgLy9sb2coXCLnlLvlg49cIiArIG4gKyBcIiBcIiArIGZpbGVuYW1lICsgXCLoqq3jgb/ovrzjgb/lrozkuoZcIilcbiAgICAgIHRoaXMuaW1nX2xvYWRlZFtuXSA9IHRydWVcbiAgICB9XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0t5o+P55S7MSDlm7PlvaItLS0tLS0tLS0tLS0tXG4gIHNldEFscChwYXI6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmJnKSB0aGlzLmJnLmdsb2JhbEFscGhhID0gcGFyLzEwMFxuICB9XG5cbiAgY29sb3JSR0IoY3I6IG51bWJlciwgY2c6IG51bWJlciwgY2I6IG51bWJlcikge1xuICAgIGNyID0gaW50KGNyKVxuICAgIGNnID0gaW50KGNnKVxuICAgIGNiID0gaW50KGNiKVxuICAgIHJldHVybiAoXCJyZ2IoXCIgKyBjciArIFwiLFwiICsgY2cgKyBcIixcIiArIGNiICsgXCIpXCIpXG4gIH1cblxuICBsaW5lVyh3aWQ6IG51bWJlcikgeyAvL+e3muOBruWkquOBleaMh+WumlxuICAgIHRoaXMubGluZV93aWR0aCA9IHdpZCAvL+ODkOODg+OCr+OCouODg+ODl1xuICAgIGlmKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5saW5lV2lkdGggPSB3aWRcbiAgICB0aGlzLmJnLmxpbmVDYXAgPSBcInJvdW5kXCJcbiAgICB0aGlzLmJnLmxpbmVKb2luID0gXCJyb3VuZFwiXG4gIH1cblxuICBsaW5lKHgwOiBudW1iZXIsIHkwOiBudW1iZXIsIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIGNvbDogc3RyaW5nKSB7XG4gICAgaWYodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLnN0cm9rZVN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5iZWdpblBhdGgoKVxuICAgIHRoaXMuYmcubW92ZVRvKHgwLCB5MClcbiAgICB0aGlzLmJnLmxpbmVUbyh4MSwgeTEpXG4gICAgdGhpcy5iZy5zdHJva2UoKVxuICB9XG5cbiAgZmlsbChjb2w6IHN0cmluZykge1xuICAgIGlmKHRoaXMuYmcpIHRoaXMuYmcuZmlsbFN0eWxlID0gY29sXG4gICAgaWYodGhpcy5iZykgdGhpcy5iZy5maWxsUmVjdCgwLCAwLCBDV0lEVEgsIENIRUlHSFQpXG4gIH1cblxuICBmUmVjdCh4Om51bWJlciwgeTpudW1iZXIsIHc6bnVtYmVyLCBoOm51bWJlcixjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5maWxsUmVjdCh4LCB5LCB3LCBoKVxuICB9XG5cbiAgc1JlY3QoeDpudW1iZXIsIHk6bnVtYmVyLCB3Om51bWJlciwgaDpudW1iZXIsY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLnN0cm9rZVN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5zdHJva2VSZWN0KHgsIHksIHcsIGgpXG4gIH1cblxuICBmQ2lyKHg6bnVtYmVyLCB5Om51bWJlciwgcjpudW1iZXIsY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IGNvbFxuICAgIHRoaXMuYmcuYmVnaW5QYXRoKClcbiAgICB0aGlzLmJnLmFyYyh4LCB5LCByLCAwLCBNYXRoLlBJKjIsIGZhbHNlKVxuICAgIHRoaXMuYmcuY2xvc2VQYXRoKClcbiAgICB0aGlzLmJnLmZpbGwoKVxuICB9XG5cbiAgc0Npcih4Om51bWJlciwgeTpudW1iZXIsIHI6bnVtYmVyLGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5zdHJva2VTdHlsZSA9IGNvbFxuICAgIHRoaXMuYmcuYmVnaW5QYXRoKClcbiAgICB0aGlzLmJnLmFyYyh4LCB5LCByLCAwLCBNYXRoLlBJKjIsIGZhbHNlKVxuICAgIHRoaXMuYmcuY2xvc2VQYXRoKClcbiAgICB0aGlzLmJnLnN0cm9rZSgpXG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0t5o+P55S7MiDnlLvlg48tLS0tLS0tLS0tLS0tXG4gIGRyYXdJbWcobjogbnVtYmVyLCB4OiBudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgaWYodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgeCwgeSlcbiAgfVxuXG4gIGRyYXdJbWdMUihuOiBudW1iZXIsIHg6IG51bWJlciwgeTpudW1iZXIpIHsgLy8g5bem5Y+z5Y+N6LuiXG4gICAgaWYodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBjb25zdCB3ID0gdGhpcy5pbWdbbl0ud2lkdGhcbiAgICBjb25zdCBoID0gdGhpcy5pbWdbbl0uaGVpZ2h0XG4gICAgaWYodGhpcy5iZykge1xuICAgICAgdGhpcy5iZy5zYXZlKClcbiAgICAgIHRoaXMuYmcudHJhbnNsYXRlKHgrdy8yLCB5K2gvMilcbiAgICAgIHRoaXMuYmcuc2NhbGUoLTEsIDEpXG4gICAgICB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgLXcvMiwgLWgvMilcbiAgICAgIHRoaXMuYmcucmVzdG9yZSgpXG4gICAgfVxuICB9XG5cbiAgLy/jgrvjg7Pjgr/jg6rjg7PjgrDooajnpLpcbiAgZHJhd0ltZ0MobjogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIGlmKHRoaXMuaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gICAgaWYgKHRoaXMuYmcpXG4gICAgICB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgeCAtIGludCh0aGlzLmltZ1tuXS53aWR0aC8yKSwgeSAtIGludCh0aGlzLmltZ1tuXS5oZWlnaHQvMikpXG4gIH1cblxuICAvL+aLoeWkp+e4ruWwj1xuICBkcmF3SW1nUyhuOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcikge1xuICAgIGlmKHRoaXMuaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gICAgaWYgKHRoaXMuYmcpIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCB4LCB5LCB3LCBoKVxuICB9XG4gIC8v5YiH44KK5Ye644GXICsg5ouh5aSn57iu5bCPXG4gIGRyYXdJbWdUUyhuOiBudW1iZXIsIHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIHN3OiBudW1iZXIsIHNoOiBudW1iZXIsIGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIGN3OiBudW1iZXIsIGNoOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBpZiAodGhpcy5iZykge1xuICAgICAgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIHN4LCBzeSwgc3csIHNoLCBjeCwgY3ksIGN3LCBjaClcbiAgICB9XG4gIH1cbiAgLy/lm57ou6JcbiAgZHJhd0ltZ1IobiA6bnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgYXJnOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBjb25zdCB3ID0gdGhpcy5pbWdbbl0ud2lkdGhcbiAgICBjb25zdCBoID0gdGhpcy5pbWdbbl0uaGVpZ2h0XG4gICAgaWYodGhpcy5iZykge1xuICAgICAgdGhpcy5iZy5zYXZlKClcbiAgICAgIHRoaXMuYmcudHJhbnNsYXRlKHgrdy8yLCB5K2gvMilcbiAgICAgIHRoaXMuYmcucm90YXRlKGFyZylcbiAgICAgIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCAtdy8yLCAtaC8yKVxuICAgICAgdGhpcy5iZy5yZXN0b3JlKClcbiAgICB9XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0t5o+P55S7MyDmloflrZctLS0tLS0tLS0tLS0tXG4gIGZUZXh0KHN0cjogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlciwgc2l6OiBudW1iZXIsIGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcpIHtcbiAgICAgIHRoaXMuYmcuZm9udCA9IGludChzaXopICsgXCJweCBib2xkIG1vbm9zcGFjZVwiXG4gICAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgdGhpcy5iZy5maWxsVGV4dChzdHIsIHgrMSwgeSsxKVxuICAgICAgdGhpcy5iZy5maWxsU3R5bGUgPSBjb2xcbiAgICAgIHRoaXMuYmcuZmlsbFRleHQoc3RyLCB4LCB5KVxuICAgIH1cbiAgfVxuXG4gIGZUZXh0TihzdHI6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIsIGg6IG51bWJlciwgc2l6OiBudW1iZXIsIGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgY29uc3Qgc24gPSBzdHIuc3BsaXQoXCJcXG5cIilcbiAgICB0aGlzLmJnLmZvbnQgPSBpbnQoc2l6KSArIFwicHggYm9sZCBtb25vc3BhY2VcIlxuICAgIGlmKHNuLmxlbmd0aCA9PSAxKSB7XG4gICAgICBoID0gMFxuICAgIH0gZWxzZSB7XG4gICAgICB5ID0geSAtIGludChoLzIpXG4gICAgICBoID0gaW50KGggLyAoc24ubGVuZ3RoIC0gMSkpXG4gICAgfVxuICAgIGZvciggbGV0IGkgPSAwOyBpIDwgc24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgICB0aGlzLmJnLmZpbGxUZXh0KHN0ciwgeCsxLCB5KzEpXG4gICAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IGNvbFxuICAgICAgdGhpcy5iZy5maWxsVGV4dChzdHIsIHgsIHkpXG4gICAgfVxuICB9XG4gIG1UZXh0V2lkdGgoc3RyOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICByZXR1cm4gdGhpcy5iZy5tZWFzdXJlVGV4dChzdHIpLndpZHRoXG4gIH1cbn1cbiIsImltcG9ydCB7IGludCwgbG9nLCBjb2RlVG9TdHIgfSBmcm9tIFwiLi9VdGlsaXR5XCJcbmltcG9ydCB7IFNFIH0gZnJvbSBcIi4vU291bmRcIlxuaW1wb3J0IHsgU0NBTEUgfSBmcm9tIFwiLi9DYW52YXNcIlxuaW1wb3J0IHsgRGV2aWNlLCBQVF9BbmRyb2lkIH0gZnJvbSBcIi4vRGV2aWNlXCJcblxuLy8gLS0tLS0tLS0tLSDjgr/jg4Pjg5flhaXlipsgLS0tLS0tLS0tLVxuZXhwb3J0IGNsYXNzIFRvdWNoIHtcblx0cHVibGljIHRhcFg6IG51bWJlclxuXHRwdWJsaWMgdGFwWTogbnVtYmVyXG5cdHB1YmxpYyB0YXBDOiBudW1iZXJcblx0cHJpdmF0ZSBfc2U6IFNFXG5cblx0Y29uc3RydWN0b3Ioc2U6IFNFKSB7XG5cdFx0dGhpcy5fc2UgPSBzZTtcblx0XHR0aGlzLnRhcFggPSAwO1xuXHRcdHRoaXMudGFwWSA9IDA7XG5cdFx0dGhpcy50YXBDID0gMDtcblx0fVxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0t44Oe44Km44K55YWl5Yqb57O7LS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRkb3duKGU6IE1vdXNlRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7Ly/jgq3jg6Pjg7Pjg5Djgrnjga7pgbjmip7vvI/jgrnjgq/jg63jg7zjg6vnrYnjgpLmipHliLbjgZnjgotcblx0XHRpZighIGUudGFyZ2V0KSByZXR1cm5cblx0XHRjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuXHRcdHZhciByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0dGhpcy50YXBYID0gZS5jbGllbnRYLXJlY3QubGVmdDtcblx0XHR0aGlzLnRhcFkgPSBlLmNsaWVudFktcmVjdC50b3A7XG5cdFx0dGhpcy50YXBDID0gMTtcblx0XHR0aGlzLnRyYW5zZm9ybVhZKClcblx0XHRpZih0aGlzLl9zZS5zbmRfaW5pdCA9PSAwKSB0aGlzLl9zZS5sb2FkU291bmRTUGhvbmUoKTsvL+OAkOmHjeimgeOAkeOCteOCpuODs+ODieOBruiqreOBv+i+vOOBv1xuXHR9XG5cblx0bW91c2VNb3ZlKGU6IE1vdXNlRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0aWYoISBlLnRhcmdldCkgcmV0dXJuXG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblx0XHRjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0dGhpcy50YXBYID0gZS5jbGllbnRYLXJlY3QubGVmdDtcblx0XHR0aGlzLnRhcFkgPSBlLmNsaWVudFktcmVjdC50b3A7XG5cdFx0dGhpcy50cmFuc2Zvcm1YWSgpXG5cdH1cblxuXHR1cChlOiBNb3VzZUV2ZW50KSB7IHRoaXMudGFwQyA9IDA7IH1cblx0b3V0KGU6IE1vdXNlRXZlbnQpIHsgdGhpcy50YXBDID0gMDsgfVxuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS3jgr/jg4Pjg5flhaXlipvns7stLS0tLS0tLS0tLS0tLS0tLS0tXG5cdHN0YXJ0KGU6IFRvdWNoRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7Ly/jgq3jg6Pjg7Pjg5Djgrnjga7pgbjmip7vvI/jgrnjgq/jg63jg7zjg6vnrYnjgpLmipHliLbjgZnjgotcblx0XHRjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuXHRcdGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0dGhpcy50YXBYID0gZS50b3VjaGVzWzBdLmNsaWVudFgtcmVjdC5sZWZ0O1xuXHRcdHRoaXMudGFwWSA9IGUudG91Y2hlc1swXS5jbGllbnRZLXJlY3QudG9wO1xuXHRcdHRoaXMudGFwQyA9IDE7XG5cdFx0dGhpcy50cmFuc2Zvcm1YWSgpO1xuXHRcdGlmKHRoaXMuX3NlLnNuZF9pbml0ID09IDApIHRoaXMuX3NlLmxvYWRTb3VuZFNQaG9uZSgpOy8v44CQ6YeN6KaB44CR44K144Km44Oz44OJ44Gu6Kqt44G/6L6844G/XG5cdH1cblxuXHR0b3VjaE1vdmUoZTogVG91Y2hFdmVudCkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuXHRcdGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0dGhpcy50YXBYID0gZS50b3VjaGVzWzBdLmNsaWVudFgtcmVjdC5sZWZ0O1xuXHRcdHRoaXMudGFwWSA9IGUudG91Y2hlc1swXS5jbGllbnRZLXJlY3QudG9wO1xuXHRcdHRoaXMudHJhbnNmb3JtWFkoKTtcblx0fVxuXG5cdGVuZChlOiBUb3VjaEV2ZW50KSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRoaXMudGFwQyA9IDA7Ly/igLvjg57jgqbjgrnmk43kvZzjgafjga9tb3VzZU91dOOBjOOBk+OCjOOBq+OBquOCi1xuXHR9XG5cblx0Y2FuY2VsKGU6IFRvdWNoRXZlbnQpIHtcblx0XHR0aGlzLnRhcFggPSAtMTtcblx0XHR0aGlzLnRhcFkgPSAtMTtcblx0XHR0aGlzLnRhcEMgPSAwO1xuXHR9XG5cblx0dHJhbnNmb3JtWFkoKSB7Ly/lrp/luqfmqJnihpLku67mg7PluqfmqJnjgbjjga7lpInmj5tcblx0XHR0aGlzLnRhcFggPSBpbnQodGhpcy50YXBYIC8gU0NBTEUpO1xuXHRcdHRoaXMudGFwWSA9IGludCh0aGlzLnRhcFkgLyBTQ0FMRSk7XG5cdH1cbn1cblxuXG4vLyAtLS0tLS0tLS0tLS0t44Oe44Km44K55YWl5YqbLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGNsYXNzIE1vdXNlIHtcblx0cHVibGljIHRhcFg6bnVtYmVyXG5cdHB1YmxpYyB0YXBZOm51bWJlclxuXHRwdWJsaWMgdGFwQzpudW1iZXJcblx0cHJpdmF0ZSBfc2U6IFNFXG5cblx0Y29uc3RydWN0b3Ioc2U6IFNFKSB7XG5cdFx0dGhpcy5fc2UgPSBzZVxuXHRcdHRoaXMudGFwQyA9IDBcblx0XHR0aGlzLnRhcFggPSAwXG5cdFx0dGhpcy50YXBZID0gMFxuXHR9XG5cbn1cblxuLy8gLS0tLS0tLS0tLSDliqDpgJ/luqbjgrvjg7PjgrXjg7wgLS0tLS0tLS0tLVxuZXhwb3J0IGNsYXNzIEFjYyB7XG5cdHB1YmxpYyBhY1ggPSAwXG5cdHB1YmxpYyBhY1kgPSAwXG5cdHB1YmxpYyBhY1ogPSAwO1xuXHRwdWJsaWMgZGV2aWNlOiBEZXZpY2VcblxuXHRjb25zdHJ1Y3RvcihkZXZpY2U6IERldmljZSkge1xuXHRcdC8vd2luZG93Lm9uZGV2aWNlbW90aW9uID0gZGV2aWNlTW90aW9uOy8v4piF4piF4piF5penXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2Vtb3Rpb25cIiwgdGhpcy5kZXZpY2VNb3Rpb24pO1xuXHRcdHRoaXMuZGV2aWNlID0gZGV2aWNlXG5cdH1cblxuXHRkZXZpY2VNb3Rpb24oZTogRGV2aWNlTW90aW9uRXZlbnQpIHtcblx0XHR2YXIgYUlHOiBEZXZpY2VNb3Rpb25FdmVudEFjY2VsZXJhdGlvbiB8IG51bGwgPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHk7XG5cdFx0aWYgKGFJRyA9PSBudWxsKSByZXR1cm47XG5cdFx0aWYoYUlHLngpIHRoaXMuYWNYID0gaW50KGFJRy54KTtcblx0XHRpZihhSUcueSkgdGhpcy5hY1kgPSBpbnQoYUlHLnkpO1xuXHRcdGlmKGFJRy56KSB0aGlzLmFjWiA9IGludChhSUcueik7XG5cdFx0aWYodGhpcy5kZXZpY2UudHlwZSA9PSBQVF9BbmRyb2lkKSB7Ly9BbmRyb2lkIOOBqCBpT1Mg44Gn5q2j6LKg44GM6YCG44Gr44Gq44KLXG5cdFx0XHR0aGlzLmFjWCA9IC10aGlzLmFjWDtcblx0XHRcdHRoaXMuYWNZID0gLXRoaXMuYWNZO1xuXHRcdFx0dGhpcy5hY1ogPSAtdGhpcy5hY1o7XG5cdFx0fVxuXHR9XG59XG5cbi8v44Kt44O85YWl5Yqb55SoXG5leHBvcnQgY2xhc3MgS2V5IHtcblx0cHVibGljIF9zZTogU0Vcblx0cHVibGljIGlua2V5OiBudW1iZXJcblx0cHVibGljIGtleTogbnVtYmVyW11cblxuXHRjb25zdHJ1Y3RvcihzZTogU0UpIHtcblx0XHR0aGlzLmlua2V5ID0gMFxuXHRcdHRoaXMua2V5ID0gbmV3IEFycmF5KDI1Nik7XG5cdFx0dGhpcy5fc2UgPSBzZVxuXHR9XG5cblx0Y2xyKCkge1xuXHRcdHRoaXMuaW5rZXkgPSAwO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykgdGhpcy5rZXlbaV0gPSAwO1xuXHR9XG5cblx0b24oZTogS2V5Ym9hcmRFdmVudCkge1xuXHRcdC8vbG9nKCBgJHtlLmtleX0gOiAke2UuY29kZX0gOiAke2Uua2V5Q29kZX0gOiAke2NvZGVUb1N0cihlLmNvZGUpfWAgKVxuXG5cdFx0aWYodGhpcy5fc2Uuc25kX2luaXQgPT0gMCkgdGhpcy5fc2UubG9hZFNvdW5kU1Bob25lKCk7Ly/jgJDph43opoHjgJHjgrXjgqbjg7Pjg4njga7oqq3jgb/ovrzjgb9cblx0XHR0aGlzLmlua2V5ID0gY29kZVRvU3RyKGUuY29kZSlcblx0XHR0aGlzLmtleVtjb2RlVG9TdHIoZS5jb2RlKV0rK1xuXHR9XG5cblx0b2ZmKGU6IEtleWJvYXJkRXZlbnQpIHtcblx0XHR0aGlzLmlua2V5ID0gMDtcblx0XHR0aGlzLmtleVtjb2RlVG9TdHIoZS5jb2RlKV0gPSAwO1xuXHR9XG59XG4iLCJpbXBvcnQgeyBsb2cgfSBmcm9tICcuL1V0aWxpdHknXG5cbi8vIC0tLS0tLS0tLS0tLS3jgrXjgqbjg7Pjg4nliLblvqEtLS0tLS0tLS0tLS0tXG5leHBvcnQgbGV0ICBTT1VORF9PTiA9IHRydWVcbmV4cG9ydCBjbGFzcyBTRSB7XG4gIHB1YmxpYyB3YWl0X3NlOiBudW1iZXIgPSAwXG4gIHB1YmxpYyBzbmRfaW5pdDogbnVtYmVyID0gMFxuICBzb3VuZEZpbGU6IEhUTUxBdWRpb0VsZW1lbnRbXVxuICBpc0JnbTogbnVtYmVyXG4gIGJnbU5vOiBudW1iZXJcbiAgc2VObzpudW1iZXJcblxuICBzb3VuZGxvYWRlZDogbnVtYmVyXG4gIHNmX25hbWU6IHN0cmluZ1tdXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy/jgrXjgqbjg7Pjg4njg5XjgqHjgqTjg6vjgpLoqq3jgb/ovrzjgpPjgaDjgYso44K544Oe44Ob5a++562WKVxuICAgIHRoaXMud2FpdF9zZSA9IDBcbiAgICB0aGlzLnNuZF9pbml0ID0gMFxuICAgIHRoaXMuc291bmRGaWxlID0gbmV3IEFycmF5KDI1NilcbiAgICB0aGlzLmlzQmdtID0gLTFcbiAgICB0aGlzLmJnbU5vID0gMFxuICAgIHRoaXMuc2VObyA9IC0xXG4gICAgdGhpcy5zb3VuZGxvYWRlZCA9IDAgLy/jgYTjgY/jgaTjg5XjgqHjgqTjg6vjgpLoqq3jgb/ovrzjgpPjgaDjgYtcbiAgICB0aGlzLnNmX25hbWUgPSBuZXcgQXJyYXkoMjU2KVxuICB9XG5cbiAgbG9hZFNvdW5kU1Bob25lKCkgey8v44K544Oe44Ob44Gn44OV44Kh44Kk44Or44KS6Kqt44G/6L6844KAXG4gICAgdHJ5IHtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnNvdW5kbG9hZGVkOyBpKyspIHtcbiAgICAgICAgdGhpcy5zb3VuZEZpbGVbaV0gPSBuZXcgQXVkaW8odGhpcy5zZl9uYW1lW2ldKVxuICAgICAgICB0aGlzLnNvdW5kRmlsZVtpXS5sb2FkKClcbiAgICAgIH1cbiAgICB9IGNhdGNoKGUpIHtcbiAgICB9XG4gICAgdGhpcy5zbmRfaW5pdCA9IDIgLy/jgrnjg57jg5vjgafjg5XjgqHjgqTjg6vjgpLoqq3jgb/ovrzjgpPjgaBcbiAgfVxuXG4gIGxvYWRTb3VuZChuOiBudW1iZXIsIGZpbGVuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNmX25hbWVbbl0gPSBmaWxlbmFtZVxuICAgIHRoaXMuc291bmRsb2FkZWQrK1xuICB9XG5cbiAgcGxheVNFKG46IG51bWJlcikge1xuICAgIGlmKFNPVU5EX09OID09IGZhbHNlKSByZXR1cm5cbiAgICBpZih0aGlzLmlzQmdtID09IDIpIHJldHVyblxuICAgIGlmKHRoaXMud2FpdF9zZSA9PSAwKSB7XG4gICAgICB0aGlzLnNlTm8gPSBuXG4gICAgICB0aGlzLnNvdW5kRmlsZVtuXS5jdXJyZW50VGltZSA9IDBcbiAgICAgIHRoaXMuc291bmRGaWxlW25dLmxvb3AgPSBmYWxzZVxuICAgICAgdGhpcy5zb3VuZEZpbGVbbl0ucGxheSgpXG4gICAgICB0aGlzLndhaXRfc2UgPSAzIC8v44OW44Op44Km44K244Gr6LKg6I2344KS44GL44GR44Gq44GE44KI44GG44Gr6YCj57aa44GX44Gm5rWB44GV44Gq44GE44KI44GG44Gr44GZ44KLXG4gICAgfVxuICB9XG5cbiAgcGxheUJnbShuOiBudW1iZXIpIHtcbiAgICBpZihTT1VORF9PTiA9PSBmYWxzZSkgcmV0dXJuXG4gICAgbG9nKGDvvKLvvKfvvK0gJHtufSDlh7rliptgKVxuICAgIHRoaXMuYmdtTm8gPSBuXG4gICAgdGhpcy5zb3VuZEZpbGVbbl0ubG9vcCA9IHRydWVcbiAgICB0aGlzLnNvdW5kRmlsZVtuXS5wbGF5KClcbiAgICB0aGlzLmlzQmdtID0gMSAvL0JHTeWGjeeUn+S4rVxuICB9XG5cbiAgcGF1c2VCZ20oKSB7XG4gICAgdGhpcy5zb3VuZEZpbGVbdGhpcy5iZ21Ob10ucGF1c2UoKVxuICAgIHRoaXMuaXNCZ20gPSAwIC8vQkdN5YGc5q2i5LitXG4gIH1cblxuICBzdG9wQmdtKCkge1xuICAgIHRoaXMuc291bmRGaWxlW3RoaXMuYmdtTm9dLnBhdXNlKClcbiAgICB0aGlzLnNvdW5kRmlsZVt0aGlzLmJnbU5vXS5jdXJyZW50VGltZSA9IDBcbiAgICB0aGlzLmlzQmdtID0gMCAvL0JHTeWBnOatolxuICB9XG5cbiAgcmF0ZVNuZChyYXRlOiBudW1iZXIpIHtcbiAgICB0aGlzLnNvdW5kRmlsZVt0aGlzLmJnbU5vXS52b2x1bWUgPSByYXRlXG4gIH1cbn0iLCIvLyAtLS0tLS0tLS0tLS0t5ZCE56iu44Gu6Zai5pWwLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhtc2c6IHN0cmluZykge1xuICBjb25zb2xlLmxvZyhtc2cpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnQodmFsOiBudW1iZXIpOiBudW1iZXIge1xuICBsZXQgbnVtID0gU3RyaW5nKHZhbClcbiAgcmV0dXJuIHBhcnNlSW50KG51bSkgLy/jg5fjg6njgrnjg57jgqTjg4rjgrnjganjgaHjgonjgoLlsI/mlbDpg6jliIbjgpLliIfjgormjajjgaZcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cih2YWw6IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBTdHJpbmcodmFsKVxufVxuZXhwb3J0IGZ1bmN0aW9uIHJuZChtYXg6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBpbnQoTWF0aC5yYW5kb20oKSAqIG1heClcbn1cbmV4cG9ydCBmdW5jdGlvbiBhYnModmFsOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5hYnModmFsKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29zKGE6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmNvcyhNYXRoLlBJICogMiAqIGEgLyAzNjApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaW4oYTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguc2luKE1hdGguUEkgKiAyICogYSAvIDM2MClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERpcyh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh4MiAtIHgxLCAyKSArIE1hdGgucG93KHkyIC0geTEsIDIpKVxufVxuXG5cbi8vIC0tLS0tLS0tLS0g44Kt44O85YWl5Yqb44Kt44O844Gu44Oe44OD44OU44Oz44KwKGtleUNvZGUg44GM6Z2e5o6o5aWo44Gu44Gf44KBKSAtLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gY29kZVRvU3RyKGNvZGU6IHN0cmluZyk6IG51bWJlciB7XG4gIGxldCBjaGFyQ29kZTogbnVtYmVyID0gMFxuICBzd2l0Y2goY29kZSkge1xuICAgIGNhc2UgXCJLZXlBXCI6IGNoYXJDb2RlID0gNjU7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlCXCI6IGNoYXJDb2RlID0gNjY7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlDXCI6IGNoYXJDb2RlID0gNjc7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlEXCI6IGNoYXJDb2RlID0gNjg7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlFXCI6IGNoYXJDb2RlID0gNjk7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlGXCI6IGNoYXJDb2RlID0gNzA7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlHXCI6IGNoYXJDb2RlID0gNzE7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlIXCI6IGNoYXJDb2RlID0gNzI7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlJXCI6IGNoYXJDb2RlID0gNzM7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlKXCI6IGNoYXJDb2RlID0gNzQ7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlLXCI6IGNoYXJDb2RlID0gNzU7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlMXCI6IGNoYXJDb2RlID0gNzY7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlNXCI6IGNoYXJDb2RlID0gNzc7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlOXCI6IGNoYXJDb2RlID0gNzg7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlPXCI6IGNoYXJDb2RlID0gNzk7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlQXCI6IGNoYXJDb2RlID0gODA7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlRXCI6IGNoYXJDb2RlID0gODE7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlSXCI6IGNoYXJDb2RlID0gODI7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlTXCI6IGNoYXJDb2RlID0gODM7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlUXCI6IGNoYXJDb2RlID0gODQ7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlVXCI6IGNoYXJDb2RlID0gODU7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlWXCI6IGNoYXJDb2RlID0gODY7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlXXCI6IGNoYXJDb2RlID0gODc7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlYXCI6IGNoYXJDb2RlID0gODg7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlZXCI6IGNoYXJDb2RlID0gODk7IGJyZWFrO1xuICAgIGNhc2UgXCJLZXlaXCI6IGNoYXJDb2RlID0gOTA7IGJyZWFrO1xuXG4gICAgY2FzZSBcIlNwYWNlXCI6IGNoYXJDb2RlID0gMzI7IGJyZWFrO1xuICAgIGNhc2UgXCJBcnJvd0xlZnRcIjogY2hhckNvZGUgPSAzNzsgYnJlYWs7XG4gICAgY2FzZSBcIkFycm93VXBcIjogY2hhckNvZGUgPSAzODsgYnJlYWs7XG4gICAgY2FzZSBcIkFycm93UmlnaHRcIjogY2hhckNvZGUgPSAzOTsgYnJlYWs7XG4gICAgY2FzZSBcIkFycm93RG93blwiOiBjaGFyQ29kZSA9IDQwOyBicmVhaztcbiAgfVxuICByZXR1cm4gY2hhckNvZGVcbn1cblxuZXhwb3J0IGNvbnN0IEtFWV9OQU1FID0ge1xuXHRcIkVOVEVSXCIgOiAxMyxcblx0XCJTUEFDRVwiIDogMzIsXG5cdFwiTEVGVFwiICA6IDM3LFxuXHRcIlVQXCIgICAgOiAzOCxcblx0XCJSSUdIVFwiIDogMzksXG5cdFwiRE9XTlwiICA6IDQwLFxuXHRcImFcIiAgICAgOiA2NSxcblx0XCJ6XCIgICAgIDogOTBcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBNTVMgfSBmcm9tICcuL1dXUydcbmltcG9ydCB7IGdldERpcywgS0VZX05BTUUsIGxvZywgcm5kLCBpbnQgfSBmcm9tICcuL1dXU2xpYi9VdGlsaXR5J1xuXG5jb25zdCBNU0xfTUFYID0gMTAwXG5jb25zdCBPQkpfTUFYID0gMTAwXG5jb25zdCBFRkNUX01BWCA9IDEwMFxuY2xhc3MgTXlHYW1lIGV4dGVuZHMgTU1TIHtcbiAgLy/jgrLjg7zjg6Djga7pgLLooYzjgpLnrqHnkIbjgZnjgovlpInmlbBcbiAgaWR4OiBudW1iZXIgPSAwXG4gIHRtcjogbnVtYmVyID0gMFxuICAvL+OCueOCs+OColxuICBzY29yZTogbnVtYmVyID0gMFxuICBoaXNjbzogbnVtYmVyID0gMTAwMCAvL+ODj+OCpOOCueOCs+OColxuICBzdGFnZTogbnVtYmVyID0gMCAvL+OCueODhuODvOOCuOaVsFxuICAvL+iHquapn+OBrueuoeeQhlxuICBiZ1g6IG51bWJlciA9IDBcbiAgc3NYOiBudW1iZXIgPSAwXG4gIHNzWTogbnVtYmVyID0gMFxuICAvL+iHquapn+OBjOaJk+OBpOW8vuOBrueuoeeQhlxuICBtc2xOdW06IG51bWJlciA9IDBcbiAgbXNsWDogbnVtYmVyW10gPSBuZXcgQXJyYXkoTVNMX01BWClcbiAgbXNsWTogbnVtYmVyW10gPSBuZXcgQXJyYXkoTVNMX01BWClcbiAgbXNsWHA6IG51bWJlcltdID0gbmV3IEFycmF5KE1TTF9NQVgpXG4gIG1zbFlwOiBudW1iZXJbXSA9IG5ldyBBcnJheShNU0xfTUFYKVxuICBtc2xGOiBib29sZWFuW10gPSBuZXcgQXJyYXkoTVNMX01BWClcbiAgbXNsSW1nOiBudW1iZXJbXSA9IG5ldyBBcnJheShNU0xfTUFYKVxuICBhdXRvbWE6IG51bWJlciA9IDAgLy/lvL7jga7oh6rli5XnmbrlsIRcbiAgZW5lcmd5OiBudW1iZXIgPSAwIC8v44Ko44ON44Or44Ku44O8XG4gIG11dGVraTogbnVtYmVyID0gMCAvL+eEoeaVteeKtuaFi1xuICB3ZWFwb246IG51bWJlciA9IDAgLy/mrablmajjga7jg5Hjg6/jg7zjgqLjg4Pjg5dcbiAgbGFzZXI6IG51bWJlciA9IDAgLy/jg6zjg7zjgrbjg7zjga7kvb/nlKjlm57mlbBcblxuICAvL+eJqeS9k+OBrueuoeeQhuOAgOaVteapn+OAgeaVteOBruW8vuOCkueuoeeQhlxuICBvYmpUeXBlOiBudW1iZXJbXSA9IG5ldyBBcnJheShPQkpfTUFYKSAvL29ialR5cGU6IDA65pW15qmf44CAMTrmlbXjga7lvL5cbiAgb2JqSW1nOiBudW1iZXJbXSA9IG5ldyBBcnJheShPQkpfTUFYKVxuICBvYmpYOiBudW1iZXJbXSA9IG5ldyBBcnJheShPQkpfTUFYKVxuICBvYmpZOiBudW1iZXJbXSA9IG5ldyBBcnJheShPQkpfTUFYKVxuICBvYmpYcDogbnVtYmVyW10gPSBuZXcgQXJyYXkoT0JKX01BWClcbiAgb2JqWXA6IG51bWJlcltdID0gbmV3IEFycmF5KE9CSl9NQVgpXG4gIG9iakxpZmU6IG51bWJlcltdID0gbmV3IEFycmF5KE9CSl9NQVgpXG4gIG9iakY6IGJvb2xlYW5bXSA9IG5ldyBBcnJheShPQkpfTUFYKVxuICBvYmpOdW06IG51bWJlciA9IDBcblxuICAvL+OCqOODleOCp+OCr+ODiOOBrueuoeeQhlxuICBlZmN0WDogbnVtYmVyW10gPSBuZXcgQXJyYXkoT0JKX01BWClcbiAgZWZjdFk6IG51bWJlcltdID0gbmV3IEFycmF5KE9CSl9NQVgpXG4gIGVmY3ROOiBudW1iZXJbXSA9IG5ldyBBcnJheShPQkpfTUFYKVxuICBlZmN0TnVtOiBudW1iZXIgPSAwXG5cbiAgY29uc3RydWN0b3IoKXtcbiAgICBzdXBlcigpXG4gIH1cbiAgY2xyS2V5KCk6IHZvaWQge31cbiAgc2V0dXAoKTogdm9pZCB7XG4gICAgdGhpcy5jYW52YXMuY2FudmFzU2l6ZSgxMjAwLCA3MjApXG4gICAgdGhpcy5kcmF3LmxvYWRJbWcoMCwgXCJpbWFnZTIvYmcucG5nXCIpXG4gICAgdGhpcy5kcmF3LmxvYWRJbWcoMSwgXCJpbWFnZTIvc3BhY2VzaGlwLnBuZ1wiKVxuICAgIHRoaXMuZHJhdy5sb2FkSW1nKDIsIFwiaW1hZ2UyL21pc3NpbGUucG5nXCIpXG4gICAgdGhpcy5kcmF3LmxvYWRJbWcoMywgJ2ltYWdlMi9leHBsb2RlLnBuZycpXG4gICAgZm9yKGxldCBpPTA7IGk8PTQ7IGkrKykgdGhpcy5kcmF3LmxvYWRJbWcoNCtpLCBgaW1hZ2UyL2VuZW15JHtpfS5wbmdgKVxuICAgIGZvcihsZXQgaT0wOyBpPD0yOyBpKyspIHRoaXMuZHJhdy5sb2FkSW1nKDkraSwgYGltYWdlMi9pdGVtJHtpfS5wbmdgKVxuICAgIHRoaXMuZHJhdy5sb2FkSW1nKDEyLCBcImltYWdlMi9sYXNlci5wbmdcIilcbiAgICB0aGlzLmRyYXcubG9hZEltZygxMywgXCJpbWFnZTIvdGl0bGVfc3MucG5nXCIpXG4gICAgdGhpcy5pbml0U1NoaXAoKVxuICAgIHRoaXMuaW5pdE9qZWN0KClcbiAgICB0aGlzLmluaXRNaXNzaWxlKClcbiAgICB0aGlzLmluaXRFZmZlY3QoKVxuICAgIHRoaXMuc2UubG9hZFNvdW5kKDAsIFwic291bmQvYmdtLm00YVwiKVxuICAgIHRoaXMuc2UubG9hZFNvdW5kKDEsIFwic291bmQvZXhwbG9zaW9uLm1wM1wiKVxuICAgIHRoaXMuc2UubG9hZFNvdW5kKDIsIFwic291bmQvZXhwbG9zaW9uMDIubXAzXCIpXG4gICAgdGhpcy5zZS5sb2FkU291bmQoMywgXCJzb3VuZC9zaG90Lm1wM1wiKVxuICB9XG4gIG1haW5sb29wKCk6IHZvaWQge1xuICAgIHRoaXMudG1yKytcbiAgICB0aGlzLmRyYXdCRygxKVxuICAgIHN3aXRjaCh0aGlzLmlkeCkge1xuICAgICAgY2FzZSAwOi8v44K/44Kk44OI44Or55S76Z2iXG4gICAgICAgIHRoaXMuZHJhdy5kcmF3SW1nKDEzLCAyMDAsIDIwMClcbiAgICAgICAgaWYodGhpcy50bXIgJSA0MCA8IDIwICkgdGhpcy5kcmF3LmZUZXh0KFwiUHJlc3MgW1NQQ10gb3IgQ2xpY2sgdG8gc3RhcnQuXCIsIDYwMCwgNTQwLCA0MCwgXCJjeWFuXCIpXG4gICAgICAgIGlmKHRoaXMua2V5LmtleVtLRVlfTkFNRS5TUEFDRV0gPiAwIHx8IHRoaXMudG91Y2gudGFwQyA+IDApIHtcbiAgICAgICAgICB0aGlzLmluaXRTU2hpcCgpXG4gICAgICAgICAgdGhpcy5pbml0T2plY3QoKVxuICAgICAgICAgIHRoaXMuc2NvcmUgPSAwXG4gICAgICAgICAgdGhpcy5zdGFnZSA9IDFcbiAgICAgICAgICB0aGlzLmlkeCA9IDFcbiAgICAgICAgICB0aGlzLnRtciA9IDBcbiAgICAgICAgICB0aGlzLnNlLnBsYXlCZ20oMClcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOi8v44Ky44O844Og5LitXG4gICAgICAgIHRoaXMuc2V0RW5lbXkoKVxuICAgICAgICB0aGlzLnNldEl0ZW0oKVxuICAgICAgICB0aGlzLm1vdmVTU2hpcCgpXG4gICAgICAgIHRoaXMubW92ZU1pc3NpbGUoKVxuICAgICAgICB0aGlzLm1vdmVPamVjdCgpXG4gICAgICAgIHRoaXMuZHJhd0VmZmVjdCgpXG4gICAgICAgIC8v44Ko44ON44Or44Ku44O844Gu6KGo56S6XG4gICAgICAgIGZvcihsZXQgaT0wOyBpPDEwOyBpKyspXG4gICAgICAgICAgdGhpcy5kcmF3LmZSZWN0KDIwICsgaSozMCwgNjYwLCAyMCwgNDAsIFwiI2MwMDAwMFwiKVxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5lbmVyZ3k7IGkrKylcbiAgICAgICAgICB0aGlzLmRyYXcuZlJlY3QoMjAgKyBpKjMwLCA2NjAsIDIwLCA0MCwgdGhpcy5kcmF3LmNvbG9yUkdCKDE2MC0xNippLCAyNDAtMTIqaSwgMjQqaSkpXG5cbiAgICAgICAgaWYodGhpcy50bXIgPCAzMCAqIDQpXG4gICAgICAgICAgdGhpcy5kcmF3LmZUZXh0KFwiU3RhZ2UgXCIgKyB0aGlzLnN0YWdlLCA2MDAsIDMwMCwgNTAsIFwiY3lhblwiKVxuICAgICAgICBpZigzMCAqIDExNCA8IHRoaXMudG1yICYmIHRoaXMudG1yIDwgMzAgKiAxMTgpXG4gICAgICAgICAgdGhpcy5kcmF3LmZUZXh0KFwiU1RBR0UgQ0xFQVJcIiwgNjAwLCAzMDAsIDUwLCBcImN5YW5cIilcbiAgICAgICAgaWYodGhpcy50bXIgPT0gMzAgKiAxMjApIHtcbiAgICAgICAgICB0aGlzLnN0YWdlICs9IDFcbiAgICAgICAgICB0aGlzLnRtciA9IDBcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOi8v44Ky44O844Og44Kq44O844OQ44O8XG4gICAgICAgIGlmKHRoaXMudG1yIDwgMzAgKiAyICYmIHRoaXMudG1yICUgNSA9PSAxKVxuICAgICAgICAgIHRoaXMuc2V0RWZmZWN0KHRoaXMuc3NYICsgcm5kKDEyMCkgLSA2MCwgdGhpcy5zc1kgKyBybmQoODApIC0gNDAsIDkpXG4gICAgICAgIHRoaXMubW92ZU1pc3NpbGUoKVxuICAgICAgICB0aGlzLm1vdmVPamVjdCgpXG4gICAgICAgIHRoaXMuZHJhd0VmZmVjdCgpXG4gICAgICAgIHRoaXMuZHJhdy5mVGV4dChcIkdBTUUgT1ZFUlwiLCA2MDAsIDMwMCwgNTAsIFwicmVkXCIpXG4gICAgICAgIGlmKHRoaXMudG1yID4gMzAgKiA1KSB0aGlzLmlkeCA9IDBcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgLy/jgrnjgrPjgqLjga7ooajnpLpcbiAgICB0aGlzLmRyYXcuZlRleHQoYFNDT1JFICR7dGhpcy5zY29yZX1gLCAyMDAsIDUwLCA0MCwgXCJ3aGl0ZVwiKVxuICAgIHRoaXMuZHJhdy5mVGV4dChgSElTQ09SRSAke3RoaXMuaGlzY299YCwgNjAwLCA1MCwgNDAsIFwieWVsbG93XCIpXG4gIH1cblxuICBkcmF3Qkcoc3BlZWQ6IG51bWJlcikge1xuICAgIHRoaXMuYmdYID0gKHRoaXMuYmdYICsgc3BlZWQpICUgMTIwMFxuICAgIHRoaXMuZHJhdy5kcmF3SW1nKDAsIC10aGlzLmJnWCwgMClcbiAgICB0aGlzLmRyYXcuZHJhd0ltZygwLCAxMjAwIC0gdGhpcy5iZ1gsIDApXG4gICAgbGV0IGh5ID0gNTgwIC8v5Zyw6Z2i44Gu5Zyw5bmz57ea44GuWeW6p+aomVxuICAgIGxldCBvZnN4ID0gdGhpcy5iZ1ggJSA0MCAvL+e4puOBruODqeOCpOODs+OCkuenu+WLleOBleOBm+OCi+OBn+OCgeOBruOCquODleOCu+ODg+ODiFxuICAgIHRoaXMuZHJhdy5saW5lVygyKVxuICAgIGZvcihsZXQgaT0xOyBpPD0zMDsgaSsrKSB7XG4gICAgICBjb25zdCB0eCA9IGkgKiA0MCAtIG9mc3hcbiAgICAgIGNvbnN0IGJ4ID0gaSAqIDI0MCAtIG9mc3ggKiA2IC0gMzAwMFxuICAgICAgdGhpcy5kcmF3LmxpbmUodHgsIGh5LCBieCwgNzIwLCBcInNpbHZlclwiKVxuICAgIH1cbiAgICBmb3IobGV0IGk9MTsgaTw9MzA7IGkrKykge1xuICAgICAgdGhpcy5kcmF3LmxpbmVXKDEgKyBpbnQoaS8zKSlcbiAgICAgIHRoaXMuZHJhdy5saW5lKDAsIGh5LCAxMjAwLCBoeSwgXCJncmF5XCIpXG4gICAgICBoeSA9IGh5ICsgaSAqIDJcbiAgICB9XG4gIH1cblxuICBpbml0U1NoaXAoKSB7XG4gICAgdGhpcy5zc1ggPSA0MDBcbiAgICB0aGlzLnNzWSA9IDM2MFxuICAgIHRoaXMuZW5lcmd5ID0gMTBcbiAgfVxuXG4gIG1vdmVTU2hpcCgpIHtcbiAgICBpZih0aGlzLmtleS5rZXlbS0VZX05BTUUuTEVGVF0gPiAwICYmIHRoaXMuc3NYID4gNjApIHRoaXMuc3NYIC09IDIwXG4gICAgaWYodGhpcy5rZXkua2V5W0tFWV9OQU1FLlJJR0hUXSA+IDAgJiYgdGhpcy5zc1ggPCAxMDAwKSB0aGlzLnNzWCArPSAyMFxuICAgIGlmKHRoaXMua2V5LmtleVtLRVlfTkFNRS5VUF0gPiAwICYmIHRoaXMuc3NZID4gNDApIHRoaXMuc3NZIC09IDIwXG4gICAgaWYodGhpcy5rZXkua2V5W0tFWV9OQU1FLkRPV05dID4gMCAmJiB0aGlzLnNzWSA8IDY4MCkgdGhpcy5zc1kgKz0gMjBcbiAgICBpZih0aGlzLmtleS5rZXlbS0VZX05BTUUuYV0gPT0gMSkge1xuICAgICAgdGhpcy5rZXkua2V5W0tFWV9OQU1FLmFdICs9IDFcbiAgICAgIHRoaXMuYXV0b21hID0gMSAtIHRoaXMuYXV0b21hXG4gICAgfVxuICAgIGlmKHRoaXMuYXV0b21hID09IDAgJiYgdGhpcy5rZXkua2V5W0tFWV9OQU1FLlNQQUNFXSA9PSAxKSB7XG4gICAgICB0aGlzLmtleS5rZXlbS0VZX05BTUUuU1BBQ0VdICs9IDFcbiAgICAgIHRoaXMuc2V0V2VhcG9uKClcbiAgICB9XG4gICAgaWYodGhpcy5hdXRvbWEgPT0gMSAmJiB0aGlzLnRtciAlIDggPT0gMCkgdGhpcy5zZXRXZWFwb24oKVxuXG4gICAgbGV0IGNvbCA9IFwiYmxhY2tcIlxuICAgIC8v44Kq44O844OI44Oe44OB44OD44Kv6KGo56S66YOoXG4gICAgaWYodGhpcy5hdXRvbWEgPT0gMSkgY29sID0gXCJ3aGl0ZVwiXG4gICAgdGhpcy5kcmF3LmZSZWN0KDkwMCwgMjAsIDI4MCwgNjAsIFwiYmx1ZVwiKVxuICAgIHRoaXMuZHJhdy5mVGV4dChcIltBXXV0byBNaXNzaWxlXCIsIDEwNDAsIDUwLCAzNiwgY29sKVxuXG4gICAgLy9UYXAg5pON5L2cXG4gICAgaWYodGhpcy50b3VjaC50YXBDID4gMCApIHtcbiAgICAgIGlmKDkwMCA8IHRoaXMudG91Y2gudGFwWCAmJiB0aGlzLnRvdWNoLnRhcFggPCAxMTgwXG4gICAgICAgICYmIDIwIDwgdGhpcy50b3VjaC50YXBZICYmIHRoaXMudG91Y2gudGFwWSA8IDgwKSB7XG4gICAgICAgIHRoaXMuYXV0b21hID0gMSAtIHRoaXMuYXV0b21hXG4gICAgICAgIHRoaXMudG91Y2gudGFwQyA9IDBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3NYID0gdGhpcy5zc1ggKyBpbnQoKHRoaXMudG91Y2gudGFwWCAtIHRoaXMuc3NYKSAvIDYpXG4gICAgICAgIHRoaXMuc3NZID0gdGhpcy5zc1kgKyBpbnQoKHRoaXMudG91Y2gudGFwWSAtIHRoaXMuc3NZKSAvIDYpXG4gICAgICB9XG4gICAgfVxuICAgIC8v54Sh5pW144Oi44O844OJ44Gu44Ko44OV44Kn44Kv44OIXG4gICAgaWYodGhpcy5tdXRla2kgJSAyID09IDApXG4gICAgICB0aGlzLmRyYXcuZHJhd0ltZ0MoMSwgdGhpcy5zc1gsIHRoaXMuc3NZKVxuICAgIGlmKHRoaXMubXV0ZWtpID4gMCkgdGhpcy5tdXRla2ktLVxuICB9XG5cbiAgc2V0V2VhcG9uKCkge1xuICAgIGxldCBuID0gdGhpcy53ZWFwb25cbiAgICB0aGlzLnNlLnBsYXlTRSgzKVxuICAgIGlmKG4gPiA4KSBuID0gOFxuICAgIGZvcihsZXQgaT0wOyBpPD1uOyBpKyspIHtcbiAgICAgIHRoaXMuc2V0TWlzc2lsZSh0aGlzLnNzWCArIDQwLCB0aGlzLnNzWSAtIG4qNiArIGkqMTIsIDQwLCBpbnQoKGktbi8yKSAqIDIpKVxuICAgIH1cbiAgfVxuXG4gIGluaXRNaXNzaWxlKCkge1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBNU0xfTUFYOyBpKyspIHRoaXMubXNsRltpXSA9IGZhbHNlXG4gICAgdGhpcy5tc2xOdW0gPSAwXG5cbiAgfVxuXG4gIHNldE1pc3NpbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHhwOiBudW1iZXIsIHlwOiBudW1iZXIpIHtcbiAgICB0aGlzLm1zbFhbdGhpcy5tc2xOdW1dID0geFxuICAgIHRoaXMubXNsWVt0aGlzLm1zbE51bV0gPSB5XG4gICAgdGhpcy5tc2xYcFt0aGlzLm1zbE51bV0gPSB4cFxuICAgIHRoaXMubXNsWXBbdGhpcy5tc2xOdW1dID0geXBcbiAgICB0aGlzLm1zbEZbdGhpcy5tc2xOdW1dID0gdHJ1ZVxuICAgIHRoaXMubXNsSW1nW3RoaXMubXNsTnVtXSA9IDJcbiAgICBpZih0aGlzLmxhc2VyID4gMCkgey8v44Os44O844K244O8XG4gICAgICB0aGlzLmxhc2VyIC09IDFcbiAgICAgIHRoaXMubXNsSW1nW3RoaXMubXNsTnVtXSA9IDEyXG4gICAgfVxuICAgIHRoaXMubXNsTnVtID0gKHRoaXMubXNsTnVtICsgMSkgJSBNU0xfTUFYXG4gIH1cblxuICBtb3ZlTWlzc2lsZSgpIHtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgTVNMX01BWDsgaSsrKSB7XG4gICAgICBpZih0aGlzLm1zbEZbaV0gPT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLm1zbFhbaV0gKz0gdGhpcy5tc2xYcFtpXVxuICAgICAgICB0aGlzLm1zbFlbaV0gKz0gdGhpcy5tc2xZcFtpXVxuICAgICAgICB0aGlzLmRyYXcuZHJhd0ltZ0ModGhpcy5tc2xJbWdbaV0sIHRoaXMubXNsWFtpXSwgdGhpcy5tc2xZW2ldKVxuICAgICAgICBpZih0aGlzLm1zbFhbaV0gPiAxMjAwKSB0aGlzLm1zbEZbaV0gPSBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGluaXRPamVjdCgpIHtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgT0JKX01BWDsgaSsrKSB7XG4gICAgICB0aGlzLm9iakZbaV0gPSBmYWxzZVxuICAgIH1cbiAgICB0aGlzLm9iak51bSA9IDBcbiAgfVxuXG4gIHNldE9iamVjdCh0eXA6IG51bWJlciwgcG5nOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB4cDogbnVtYmVyLCB5cDogbnVtYmVyLCBsaWY6IG51bWJlcikge1xuICAgIHRoaXMub2JqVHlwZVt0aGlzLm9iak51bV0gPSB0eXBcbiAgICB0aGlzLm9iakltZ1t0aGlzLm9iak51bV0gPSBwbmdcbiAgICB0aGlzLm9ialhbdGhpcy5vYmpOdW1dID0geFxuICAgIHRoaXMub2JqWVt0aGlzLm9iak51bV0gPSB5XG4gICAgdGhpcy5vYmpYcFt0aGlzLm9iak51bV0gPSB4cFxuICAgIHRoaXMub2JqWXBbdGhpcy5vYmpOdW1dID0geXBcbiAgICB0aGlzLm9iakxpZmVbdGhpcy5vYmpOdW1dID0gbGlmXG4gICAgdGhpcy5vYmpGW3RoaXMub2JqTnVtXSA9IHRydWVcbiAgICB0aGlzLm9iak51bSA9ICh0aGlzLm9iak51bSArIDEpICUgT0JKX01BWFxuICB9XG5cbiAgbW92ZU9qZWN0KCkge1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBPQkpfTUFYOyBpKyspIHtcbiAgICAgIGlmKHRoaXMub2JqRltpXSA9PSB0cnVlKSB7XG4gICAgICAgIHRoaXMub2JqWFtpXSArPSB0aGlzLm9ialhwW2ldXG4gICAgICAgIHRoaXMub2JqWVtpXSArPSB0aGlzLm9iallwW2ldXG4gICAgICAgIGlmKHRoaXMub2JqSW1nW2ldID09IDYpIHsgLy/mlbUy44Gu54m55q6K44Gq5YuV44GNXG4gICAgICAgICAgaWYodGhpcy5vYmpZW2ldIDwgNjApIHRoaXMub2JqWXBbaV0gPSA4XG4gICAgICAgICAgaWYodGhpcy5vYmpZW2ldID4gNjYwKSB0aGlzLm9iallwW2ldID0gLThcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLm9iakltZ1tpXSA9PSA3KSB7IC8v5pW1M+OBrueJueauiuOBquWLleOBjVxuICAgICAgICAgIGlmKHRoaXMub2JqWHBbaV0gPCAwKSB7XG4gICAgICAgICAgICB0aGlzLm9ialhwW2ldID0gaW50KHRoaXMub2JqWHBbaV0gKiAwLjk1KVxuICAgICAgICAgICAgaWYodGhpcy5vYmpYcFtpXSA9PSAwKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0T2JqZWN0KDAsIDQsIHRoaXMub2JqWFtpXSwgdGhpcy5vYmpZW2ldLCAtMjAsIDAsIDApIC8v5by+44KS5pKD44GkXG4gICAgICAgICAgICAgIHRoaXMub2JqWHBbaV0gPSAyMFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyYXcuZHJhd0ltZ0ModGhpcy5vYmpJbWdbaV0sIHRoaXMub2JqWFtpXSwgdGhpcy5vYmpZW2ldKSAvL+eJqeS9k+OBruihqOekulxuXG4gICAgICAgIC8v6Ieq5qmf44GM5pKD44Gj44Gf5by+44Go44OS44OD44OI44OB44Kn44OD44KvXG4gICAgICAgIGlmKHRoaXMub2JqVHlwZVtpXSA9PSAxKSB7Ly/mlbXmqZ9cbiAgICAgICAgICBjb25zdCByID0gMTIgKyAodGhpcy5kcmF3LmltZ1t0aGlzLm9iakltZ1tpXV0ud2lkdGggKyB0aGlzLmRyYXcuaW1nW3RoaXMub2JqSW1nW2ldXS5oZWlnaHQpIC8gNCAvL+ODkuODg+ODiOODgeOCp+ODg+OCr+WNiuW+hFxuICAgICAgICAgIGZvcihsZXQgbiA9IDA7IG4gPCBNU0xfTUFYOyBuKyspIHsgLy/lhajlvL7jga7liKTlrprjg4Hjgqfjg4Pjgq9cbiAgICAgICAgICAgIGlmKHRoaXMubXNsRltuXSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgIGlmKGdldERpcyh0aGlzLm9ialhbaV0sIHRoaXMub2JqWVtpXSwgdGhpcy5tc2xYW25dLCB0aGlzLm1zbFlbbl0pIDwgcikge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMubXNsSW1nW25dID09IDIpIHRoaXMubXNsRltuXSA9IGZhbHNlIC8v6YCa5bi45by+44Go6LKr6YCa5by+44Gu6YGV44GEXG4gICAgICAgICAgICAgICAgdGhpcy5vYmpMaWZlW2ldIC09IDFcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9iakxpZmVbaV0gPT0gMCkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5vYmpGW2ldID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUgPSB0aGlzLnNjb3JlICsgMTAwXG4gICAgICAgICAgICAgICAgICB0aGlzLnNlLnBsYXlTRSgxKVxuICAgICAgICAgICAgICAgICAgaWYodGhpcy5zY29yZSA+IHRoaXMuaGlzY28pIHRoaXMuaGlzY28gPSB0aGlzLnNjb3JlXG4gICAgICAgICAgICAgICAgICB0aGlzLnNldEVmZmVjdCh0aGlzLm9ialhbaV0sIHRoaXMub2JqWVtpXSwgOSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFZmZlY3QodGhpcy5vYmpYW2ldLCB0aGlzLm9iallbaV0sIDMpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8v6Ieq5qmf44Go44Gu44OS44OD44OI44OB44Kn44OD44KvXG4gICAgICAgIGlmKHRoaXMuaWR4ID09IDEpIHtcbiAgICAgICAgICBjb25zdCByID0gMzAgKyAodGhpcy5kcmF3LmltZ1t0aGlzLm9iakltZ1tpXV0ud2lkdGggKyB0aGlzLmRyYXcuaW1nW3RoaXMub2JqSW1nW2ldXS5oZWlnaHQpIC8gNFxuICAgICAgICAgIGlmKGdldERpcyh0aGlzLm9ialhbaV0sIHRoaXMub2JqWVtpXSwgdGhpcy5zc1gsIHRoaXMuc3NZKSA8IHIpIHtcbiAgICAgICAgICAgIGlmKHRoaXMub2JqVHlwZVtpXSA8PSAxICYmIHRoaXMubXV0ZWtpID09IDApIHsvL+aVteOBruW8vuOBqOaVteapn1xuICAgICAgICAgICAgICB0aGlzLm9iakZbaV0gPSBmYWxzZVxuICAgICAgICAgICAgICB0aGlzLnNlLnBsYXlTRSgyKVxuICAgICAgICAgICAgICB0aGlzLnNldEVmZmVjdCh0aGlzLm9ialhbaV0sIHRoaXMub2JqWVtpXSwgOSlcbiAgICAgICAgICAgICAgdGhpcy5lbmVyZ3kgLT0gMVxuICAgICAgICAgICAgICB0aGlzLm11dGVraSA9IDMwXG4gICAgICAgICAgICAgIGlmKHRoaXMuZW5lcmd5ID09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlkeCA9IDJcbiAgICAgICAgICAgICAgICB0aGlzLnRtciA9IDBcbiAgICAgICAgICAgICAgICB0aGlzLnNlLnN0b3BCZ20oKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLm9ialR5cGVbaV0gPT0gMikgey8v44Ki44Kk44OG44OgXG4gICAgICAgICAgICAgIHRoaXMub2JqRltpXSA9IGZhbHNlXG4gICAgICAgICAgICAgIGlmKHRoaXMub2JqSW1nW2ldID09IDkgJiYgdGhpcy5lbmVyZ3kgPCAxMCkgdGhpcy5lbmVyZ3kgKz0gMVxuICAgICAgICAgICAgICBpZih0aGlzLm9iakltZ1tpXSA9PSAxMCkgdGhpcy53ZWFwb24gKz0gMVxuICAgICAgICAgICAgICBpZih0aGlzLm9iakltZ1tpXSA9PSAxMSkgdGhpcy5sYXNlciArPSAxMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5vYmpYW2ldIDwgLTEwMCB8fCB0aGlzLm9ialhbaV0gPiAxMzAwIHx8IHRoaXMub2JqWVtpXSA8IC0xMDAgfHwgdGhpcy5vYmpZW2ldID4gODIwKSB7XG4gICAgICAgICAgdGhpcy5vYmpGW2ldID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGluaXRFZmZlY3QoKSB7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IEVGQ1RfTUFYOyBpKyspIHtcbiAgICAgIHRoaXMuZWZjdE5baV0gPSAwXG4gICAgfVxuICAgIHRoaXMuZWZjdE51bSA9IDBcbiAgfVxuXG4gIHNldEVmZmVjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgbjpudW1iZXIpIHtcbiAgICB0aGlzLmVmY3RYW3RoaXMuZWZjdE51bV0gPSB4XG4gICAgdGhpcy5lZmN0WVt0aGlzLmVmY3ROdW1dID0geVxuICAgIHRoaXMuZWZjdE5bdGhpcy5lZmN0TnVtXSA9IG5cbiAgICB0aGlzLmVmY3ROdW0gPSAodGhpcy5lZmN0TnVtICsgMSkgJSBFRkNUX01BWFxuICB9XG5cbiAgZHJhd0VmZmVjdCgpIHtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgRUZDVF9NQVg7IGkrKykge1xuICAgICAgaWYodGhpcy5lZmN0TltpXSA+IDApIHtcbiAgICAgICAgdGhpcy5kcmF3LmRyYXdJbWdUUygzLCAoOS10aGlzLmVmY3ROW2ldKSAqIDEyOCwgMCwgMTI4LCAxMjgsIHRoaXMuZWZjdFhbaV0tNjQsIHRoaXMuZWZjdFlbaV0tNjQsIDEyOCwgMTI4KVxuICAgICAgICB0aGlzLmVmY3ROW2ldLS1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRFbmVteSgpIHtcbiAgICBjb25zdCBzZWMgPSBpbnQodGhpcy50bXIgLyAzMClcbiAgICBpZig0IDw9IHNlYyAmJiBzZWMgPCAxMCkge1xuICAgICAgaWYodGhpcy50bXIgJSAyMCA9PSAwKSB0aGlzLnNldE9iamVjdCgxLCA1LCAxMzAwLCA2MCArIHJuZCg2MDApLCAtMTYsIDAsIDEgKiB0aGlzLnN0YWdlKSAvL+aVtTFcbiAgICB9XG4gICAgaWYoMTQgPD0gc2VjICYmIHNlYyA8IDIwKSB7XG4gICAgICBpZih0aGlzLnRtciAlIDIwID09IDApIHRoaXMuc2V0T2JqZWN0KDEsIDYsIDEzMDAsIDYwICsgcm5kKDYwMCksIC0xMiwgOCwgMyAqIHRoaXMuc3RhZ2UpIC8v5pW1MlxuICAgIH1cbiAgICBpZigyNCA8PSBzZWMgJiYgc2VjIDwgMzApIHtcbiAgICAgIGlmKHRoaXMudG1yICUgMjAgPT0gMCkgdGhpcy5zZXRPYmplY3QoMSwgNywgMTMwMCwgMzYwICsgcm5kKDMwMCksIC00OCwgLTEwLCA1ICogdGhpcy5zdGFnZSkgLy/mlbUzXG4gICAgfVxuICAgIGlmKDM0IDw9IHNlYyAmJiBzZWMgPCA1MCkge1xuICAgICAgaWYodGhpcy50bXIgJSA2MCA9PSAwKSB0aGlzLnNldE9iamVjdCgxLCA4LCAxMzAwLCBybmQoNzIwLTE5MiksIC02LCAwLCAwKSAvL+manOWus+eJqVxuICAgIH1cbiAgICBpZig1NCA8PSBzZWMgJiYgc2VjIDwgNzApIHtcbiAgICAgIGlmKHRoaXMudG1yICUgMjAgPT0gMCkge1xuICAgICAgICBpZih0aGlzLnRtciAlIDIwID09IDApIHRoaXMuc2V0T2JqZWN0KDEsIDUsIDEzMDAsIHJuZCgzMDApLCAtMTYsIDQsIDEgKiB0aGlzLnN0YWdlKSAvL+aVtTFcbiAgICAgICAgaWYodGhpcy50bXIgJSAyMCA9PSAwKSB0aGlzLnNldE9iamVjdCgxLCA1LCAxMzAwLCBybmQoMzAwKSwgLTE2LCA0LCAxICogdGhpcy5zdGFnZSkgLy/mlbUxXG4gICAgICB9XG4gICAgfVxuICAgIGlmKDc0IDw9IHNlYyAmJiBzZWMgPCA5MCkge1xuICAgICAgaWYodGhpcy50bXIgJSAyMCA9PSAwKSB0aGlzLnNldE9iamVjdCgxLCA2LCAxMzAwLCBybmQoNjAwKSwgLTEyLCA4LCAzICogdGhpcy5zdGFnZSkgLy/mlbUyXG4gICAgICBpZih0aGlzLnRtciAlIDQ1ID09IDApIHRoaXMuc2V0T2JqZWN0KDEsIDgsIDEzMDAsIHJuZCg3MjAtMTkyKSwgLTgsIDAsIDApIC8v6Zqc5a6z54mpXG4gICAgfVxuICAgIGlmKDk0IDw9IHNlYyAmJiBzZWMgPCAxMTApIHtcbiAgICAgIGlmKHRoaXMudG1yICUgMTAgPT0gMCkgdGhpcy5zZXRPYmplY3QoMSwgNSwgMTMwMCwgMzYwLCAtMjQsIHJuZCgxMSktNSwgMSAqIHRoaXMuc3RhZ2UpIC8v5pW1MVxuICAgICAgaWYodGhpcy50bXIgJSAyMCA9PSAwKSB0aGlzLnNldE9iamVjdCgxLCA3LCAxMzAwLCBybmQoMzAwKSwgLTU2LCA0ICsgcm5kKDEyKSwgNSAqIHRoaXMuc3RhZ2UpIC8v5pW1M1xuICAgIH1cbiAgfVxuXG4gIHNldEl0ZW0oKSB7XG4gICAgaWYodGhpcy50bXIgJSA5MCA9PSAgMCkgdGhpcy5zZXRPYmplY3QoMiwgIDksIDEzMDAsIDYwICsgcm5kKDYwMCksIC0xMCwgMCwgMCkgLy9FbmVyZ3lcbiAgICBpZih0aGlzLnRtciAlIDkwID09IDMwKSB0aGlzLnNldE9iamVjdCgyLCAxMCwgMTMwMCwgNjAgKyBybmQoNjAwKSwgLTEwLCAwLCAwKSAvL01pc3NpbGVcbiAgICBpZih0aGlzLnRtciAlIDkwID09IDYwKSB0aGlzLnNldE9iamVjdCgyLCAxMSwgMTMwMCwgNjAgKyBybmQoNjAwKSwgLTEwLCAwLCAwKSAvL0xhc2VyXG4gIH1cbn1cblxuXG5cbm5ldyBNeUdhbWUoKVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9