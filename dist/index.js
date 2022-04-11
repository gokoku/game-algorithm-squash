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
//ローカルストレージ
const LS_KEYNAME = "SAVEDATA"; //keyName 任意に変更可
//保存できるか判定し、できない場合に警告を出す　具体的には iOS Safari プライベートブラウズがON（保存できない）状態に警告を出す
let CHECK_LS = false;
// -------------リアルタイム処理-------------
class MMS {
    constructor() {
        // フレームレート frames / second
        this.FPS = 30;
        document.addEventListener("visibilitychange", this.vcProc.bind(this));
        window.addEventListener("load", this.wwsSysInit.bind(this));
        this.canvas = new Canvas_1.Canvas();
        this.draw = new Draw_1.Draw();
        this.se = new Sound_1.SE();
        this.touch = new Event_1.Touch(this.se);
        this.key = new Event_1.Key(this.se);
        this.device = new Device_1.Device();
        this.acc = new Event_1.Acc(this.device);
        this.frameSec = (0, Utility_1.int)(1000 / this.FPS);
    }
    setFPS(fps) {
        this.FPS = fps;
        this.frameSec = (0, Utility_1.int)(1000 / this.FPS);
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
            this.bg.fillText(sn[i], x + 1, y + h * i + 1);
            this.bg.fillStyle = col;
            this.bg.fillText(sn[i], x, y + h * i);
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
    "A": 65,
    "Z": 90,
    "R": 82,
    "C": 67
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
        this.masu = new Array(13);
        this.kesu = new Array(13);
        this.idx = 0; //モードのインデックス
        this.tmr = 0; //タイマー
        this.block = [0, 0, 0, 1, 2, 3]; //プレイヤーが動かす3つのブロックの番号+次のブロックの番号
        this.myBlockX = 0; //処理の流れを管理
        this.myBlockY = 0; //時間の進行を管理
        this.dropSpd = 0; //落下速度
        this.gameProc = 0; //処理の流れを管理
        this.gameTime = 0; //時間の進行を管理
        this.hisco = 5000; //ハイスコア
        this.score = 0; //スコア
        this.rensa = 0; //連鎖回数
        this.points = 0; //ブロックを消したときの得点
        this.eftime = 0; //ブロックを消す演出時間
        this.extend = 0; //エクステンドタイム
        this.tapKey = [0, 0, 0, 0]; //ボタンのアイコンをタップしているか
        this.RAINBOW = ["#ff0000", "#e08000", "#c0e000", "#00ff00", "#00c0e0", "#0040ff", "#8000e0"];
        this.EFF_MAX = 100;
        this.effX = new Array(this.EFF_MAX);
        this.effY = new Array(this.EFF_MAX);
        this.effT = new Array(this.EFF_MAX);
        this.effN = 0;
        for (let y = 0; y < 13; y++) {
            for (let x = 0; x < 8; x++) {
                this.masu[y] = new Array(9);
                this.kesu[y] = new Array(9);
            }
        }
    }
    setup() {
        this.clrBlock();
        this.canvas.canvasSize(960, 1200);
        this.draw.loadImg(0, 'image3/bg.png');
        const BLOCK = ["tako", "wakame", "kurage", "sakana", "uni", "ika"];
        for (let i = 0; i < 6; i++) {
            this.draw.loadImg(i + 1, `image3/${BLOCK[i]}.png`);
        }
        this.draw.loadImg(7, 'image3/title.png');
        this.se.loadSound(0, 'sound3/bgm.m4a');
        this.se.loadSound(1, 'sound3/se.m4a');
        this.initVar();
    }
    mainloop() {
        this.tmr += 1;
        this.drawPzl();
        this.drawEffect();
        switch (this.idx) {
            case 0: //タイトル画面
                this.draw.drawImgC(7, 480, 400); //タイトル
                if (this.tmr % 40 < 20)
                    this.draw.fText("TAP TO START.", 480, 680, 80, "pink");
                if (this.key.key[Utility_1.KEY_NAME.SPACE]) {
                    this.clrBlock();
                    this.initVar();
                    this.se.playBgm(0);
                    this.idx = 1;
                    this.tmr = 0;
                }
                break;
            case 1: //ゲーム中
                if (this.procPzl() == 0) {
                    this.se.stopBgm();
                    this.idx = 2;
                    this.tmr = 0;
                }
                break;
            case 2: //ゲームオーバー
                this.draw.fText("GAME OVER", 480, 420, 100, "violet");
                if (this.tmr > 30 * 5)
                    this.idx = 0;
                break;
        }
    }
    clrBlock() {
        for (let y = 0; y <= 12; y++) {
            for (let x = 0; x <= 8; x++) {
                this.masu[y][x] = -1;
            }
        }
        for (let y = 1; y <= 11; y++) {
            for (let x = 1; x <= 7; x++) {
                this.masu[y][x] = 0;
                this.kesu[y][x] = 0;
            }
        }
    }
    initVar() {
        this.myBlockX = 4;
        this.myBlockY = 1;
        this.dropSpd = 90;
        this.block[0] = 1; //現在のブロック
        this.block[1] = 2;
        this.block[2] = 3;
        this.block[0] = 2; //次のブロック
        this.block[1] = 3;
        this.block[2] = 4;
        this.gameProc = 0; //処理の流れを管理
        this.gameTime = 30 * 60 * 3; //時間の進行を管理 約3分
        this.score = 0; //スコア
        for (let i = 0; i < this.EFF_MAX; i++) {
            this.effT[i] = 0;
        }
    }
    drawPzl() {
        this.draw.drawImg(0, 0, 0);
        for (let x = 0; x < 3; x++)
            this.draw.drawImg(this.block[3 + x], 672 + 80 * x, 50);
        this.draw.fTextN(`TIME\n${this.gameTime}`, 800, 280, 70, 60, "white");
        this.draw.fTextN(`SCORE\n${this.score}`, 800, 560, 70, 60, "white");
        for (let y = 1; y <= 11; y++) {
            for (let x = 1; x <= 7; x++) {
                if (this.masu[y][x] > 0) {
                    this.draw.drawImgC(this.masu[y][x], x * 80, y * 80);
                }
            }
        }
        if (this.gameProc == 0) { //ブロックの移動
            for (let x = -1; x <= 1; x++) {
                this.draw.drawImgC(this.block[1 + x], (this.myBlockX + x) * 80, 80 * this.myBlockY - 2);
            }
        }
        if (this.gameProc == 3) { //消す処理
            this.draw.fText(`${this.points}pts`, 320, 120, 50, this.RAINBOW[this.tmr % 8]); //得点表示
            if (this.extend > 0)
                this.draw.fText(`TIME ${this.extend}!`, 320, 240, 50, this.RAINBOW[this.tmr % 8]); //エクステンド表示
        }
    }
    procPzl() {
        if (this.touch.tapC > 0 && 960 < this.touch.tapY && this.touch.tapY < 1200) { //タップ操作
            const c = (0, Utility_1.int)(this.touch.tapX / 240);
            (0, Utility_1.log)(`${c}`);
            if (0 <= c && c <= 3) {
                this.tapKey[c] += 1;
            }
        }
        else {
            for (let i = 0; i < 4; i++) {
                this.tapKey[i] = 0;
            }
        }
        switch (this.gameProc) {
            case 0:
                if (this.tmr < 10)
                    break; //下キー押しでブロックがどんどん落ちないようにする
                //キーでの操作
                if (this.key.key[Utility_1.KEY_NAME.LEFT] == 1 || this.key.key[Utility_1.KEY_NAME.LEFT] > 4) {
                    this.key.key[Utility_1.KEY_NAME.LEFT] += 1;
                    if (this.masu[this.myBlockY][this.myBlockX - 2] == 0)
                        this.myBlockX -= 1;
                }
                if (this.key.key[Utility_1.KEY_NAME.RIGHT] == 1 || this.key.key[Utility_1.KEY_NAME.RIGHT] > 4) {
                    this.key.key[Utility_1.KEY_NAME.RIGHT] += 1;
                    if (this.masu[this.myBlockY][this.myBlockX + 2] == 0)
                        this.myBlockX += 1;
                }
                if (this.key.key[Utility_1.KEY_NAME.SPACE] == 1 || this.key.key[Utility_1.KEY_NAME.SPACE] > 4) {
                    this.key.key[Utility_1.KEY_NAME.SPACE] += 1;
                    const i = this.block[2];
                    this.block[2] = this.block[1];
                    this.block[1] = this.block[0];
                    this.block[0] = i;
                }
                //タップでの操作
                if (this.tapKey[0] == 1 || this.tapKey[0] > 8) {
                    if (this.masu[this.myBlockY][this.myBlockX - 2] == 0)
                        this.myBlockX -= 1;
                }
                if (this.tapKey[2] == 1 || this.tapKey[2] > 8) {
                    if (this.masu[this.myBlockY][this.myBlockX + 2] == 0)
                        this.myBlockX += 1;
                }
                if (this.tapKey[3] == 1 || this.tapKey[3] > 8) { //ブロックの入れ替え
                    const i = this.block[2];
                    this.block[2] = this.block[1];
                    this.block[1] = this.block[0];
                    this.block[0] = i;
                }
                if (this.gameTime % this.dropSpd == 0 || this.key.key[Utility_1.KEY_NAME.DOWN] > 0 || this.tapKey[1] > 1) {
                    if (this.masu[this.myBlockY + 1][this.myBlockX - 1] +
                        this.masu[this.myBlockY + 1][this.myBlockX] +
                        this.masu[this.myBlockY + 1][this.myBlockX + 1] == 0) {
                        this.myBlockY += 1; //下に何もなければ落とす
                    }
                    else {
                        //動かなくなったらmasu配列に書き込んで次のフェーズへ
                        this.masu[this.myBlockY][this.myBlockX - 1] = this.block[0];
                        this.masu[this.myBlockY][this.myBlockX] = this.block[1];
                        this.masu[this.myBlockY][this.myBlockX + 1] = this.block[2];
                        this.rensa = 1;
                        this.gameProc = 1;
                    }
                }
                break;
            case 1: //プロックの落下処理
                let c = 0; //落としたブロックがあるかどうか　チェック用
                for (let y = 10; y >= 1; y--) { //【重要】下から上に向かって調べること
                    for (let x = 1; x <= 7; x++) {
                        if (this.masu[y][x] > 0 && this.masu[y + 1][x] == 0) {
                            this.masu[y + 1][x] = this.masu[y][x];
                            this.masu[y][x] = 0;
                            c = 1;
                        }
                    }
                }
                if (c == 0)
                    this.gameProc = 2; //全て落としたら次のフェーズへ
                break;
            case 2: //ブロックが揃ったかの判定
                for (let y = 1; y <= 11; y++) {
                    for (let x = 1; x <= 7; x++) {
                        const c = this.masu[y][x];
                        if (c > 0) {
                            if (c == this.masu[y - 1][x] && c == this.masu[y + 1][x]) {
                                this.kesu[y][x] = 1;
                                this.kesu[y - 1][x] = 1;
                                this.kesu[y + 1][x] = 1;
                            }
                            if (c == this.masu[y][x - 1] && c == this.masu[y][x + 1]) {
                                this.kesu[y][x] = 1;
                                this.kesu[y][x - 1] = 1;
                                this.kesu[y][x + 1] = 1;
                            }
                            if (c == this.masu[y - 1][x + 1] && c == this.masu[y + 1][x - 1]) {
                                this.kesu[y][x] = 1;
                                this.kesu[y - 1][x + 1] = 1;
                                this.kesu[y + 1][x - 1] = 1;
                            }
                            if (c == this.masu[y - 1][x - 1] && c == this.masu[y + 1][x + 1]) {
                                this.kesu[y][x] = 1;
                                this.kesu[y - 1][x - 1] = 1;
                                this.kesu[y + 1][x + 1] = 1;
                            }
                        }
                    }
                }
                let n = 0; // そろったブロックの数をカウント
                for (let y = 1; y <= 11; y++) {
                    for (let x = 1; x <= 7; x++) {
                        if (this.kesu[y][x] == 1) {
                            n += 1;
                            this.setEffect(80 * x, 80 * y); //エフェクト
                        }
                    }
                }
                if (n > 0) {
                    this.se.playSE(1);
                    if (this.rensa == 1 && this.dropSpd > 5)
                        this.dropSpd -= 1; //消すごとに落下スピードを上げる
                    this.points = 50 * n * this.rensa; //基本点数は消した数 x 50
                    this.score += this.points;
                    if (this.score > this.hisco)
                        this.hisco = this.score;
                    this.extend = 0;
                    if (n % 5 == 0)
                        this.extend = 300; //5の倍数の個数を消すとタイムが増える
                    this.gameProc = this.extend;
                    this.rensa = this.rensa * 2; //連鎖した時、得点が倍々に増える
                    this.eftime = 0;
                    this.gameProc = 3; //消す処理へ
                }
                else {
                    this.myBlockX = 4; //x座標
                    this.myBlockY = 1; //y座標
                    if (this.masu[this.myBlockY][this.myBlockX - 1] +
                        this.masu[this.myBlockY][this.myBlockX] +
                        this.masu[this.myBlockY][this.myBlockX + 1] > 0) {
                        return 0; //ブロックが最上段にある
                    }
                    //次のブロックをセット
                    this.block[0] = this.block[3];
                    this.block[1] = this.block[4];
                    this.block[2] = this.block[5];
                    let c = 4; //ブロックの種類を決める
                    if (this.score > 10000)
                        c = 5;
                    if (this.score > 20000)
                        c = 6;
                    this.block[3] = 1 + (0, Utility_1.rnd)(c);
                    this.block[4] = 1 + (0, Utility_1.rnd)(c);
                    this.block[5] = 1 + (0, Utility_1.rnd)(c);
                    this.gameProc = 0; //再びプロックの移動へ
                    this.tmr = 0;
                }
                break;
            case 3:
                this.eftime += 1;
                if (this.eftime == 20) {
                    for (let y = 1; y <= 11; y++) {
                        for (let x = 1; x <= 7; x++) {
                            if (this.kesu[y][x] == 1) {
                                this.masu[y][x] = 0;
                                this.kesu[y][x] = 0;
                            }
                        }
                    }
                    this.gameProc = 1; //消したら再びプロックの落下処理へ
                }
                break;
        }
        this.gameTime--; //ゲーム時間を1つ減らす
        return this.gameTime;
    }
    setEffect(x, y) {
        this.effX[this.effN] = x;
        this.effY[this.effN] = y;
        this.effT[this.effN] = 20;
        this.effN = (this.effN + 1) % this.EFF_MAX;
    }
    drawEffect() {
        this.draw.lineW(20);
        for (let i = 0; i < this.EFF_MAX; i++) {
            if (this.effT[i] > 0) {
                this.draw.setAlp(this.effT[i] * 5);
                this.draw.sCir(this.effX[i], this.effY[i], 110 - this.effT[i] * 5, this.RAINBOW[(this.effT[i] + 0) % 8]);
                this.draw.sCir(this.effX[i], this.effY[i], 90 - this.effT[i] * 4, this.RAINBOW[(this.effT[i] + 1) % 8]);
                this.draw.sCir(this.effX[i], this.effY[i], 70 - this.effT[i] * 3, this.RAINBOW[(this.effT[i] + 2) % 8]);
                this.effT[i] -= 1;
            }
        }
        this.draw.setAlp(100);
        this.draw.lineW(1);
    }
}
new MyGame();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMzRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsTUFBTSxRQUFRLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFDM0gsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQy9GLEtBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN2QixDQUFDLEdBQUcsQ0FBQyxHQUFDLEVBQUU7Z0JBQ1IsQ0FBQyxHQUFHLGlCQUFHLEVBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUMsRUFBRSxHQUFDLENBQUMsRUFBRSxFQUFFLEdBQUMsRUFBRSxHQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDO2FBQ3JFO1NBQ0Y7UUFDRCxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDL0QsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLENBQUMsTUFBTSxDQUFD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LHdCQUVDO0FBR0Qsc0RBQXNEO0FBQ3RELFNBQWdCLFNBQVMsQ0FBQyxJQUFZO0lBQ3BDLElBQUksUUFBUSxHQUFXLENBQUM7SUFDeEIsUUFBTyxJQUFJLEVBQUU7UUFDWCxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lB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QUUsR0FBRyxDQUFDOzZCQUN2Qjs0QkFDRCxJQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQ0FDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQ0FDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQzs2QkFDdEI7NEJBQ0QsSUFBRyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQ3ZELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQ0FDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0NBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDOzZCQUN4Qjs0QkFDRCxJQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJ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QUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN0RyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNyRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNyRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7YUFDbEI7U0FDRjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDcEIsQ0FBQztDQUNGO0FBRUQsSUFBSSxNQUFNLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvV1dTLnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvQ2FudmFzLnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvRGV2aWNlLnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvRHJhdy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV1dTbGliL0V2ZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvU291bmQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9VdGlsaXR5LnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbkphdmFTY3JpcHQmSFRNTDUg44Ky44O844Og6ZaL55m655So44K344K544OG44OgXG7plovnmbog44Ov44O844Or44OJ44Ov44Kk44OJ44K944OV44OI44Km44Kn44Ki5pyJ6ZmQ5Lya56S+XG5cbu+8iOS9v+eUqOadoeS7tu+8iVxu5pys44K944O844K544Kz44O844OJ44Gu6JGX5L2c5qip44Gv6ZaL55m65YWD44Gr44GC44KK44G+44GZ44CCXG7liKnnlKjjgZXjgozjgZ/jgYTmlrnjga/jg6Hjg7zjg6vjgavjgabjgYrllY/jgYTlkIjjgo/jgZvkuIvjgZXjgYTjgIJcbnRoQHd3c2Z0LmNvbSDjg6/jg7zjg6vjg4njg6/jgqTjg4njgr3jg5Xjg4jjgqbjgqfjgqIg5buj54CsXG4qL1xuXG5pbXBvcnQgeyBpbnQsIGxvZyB9IGZyb20gJy4vV1dTbGliL1V0aWxpdHknXG5pbXBvcnQgeyBUb3VjaCwgS2V5LCBBY2N9IGZyb20gXCIuL1dXU2xpYi9FdmVudFwiXG5pbXBvcnQgeyBDV0lEVEgsIENIRUlHSFQsIENhbnZhcywgU0NBTEUgfSBmcm9tIFwiLi9XV1NsaWIvQ2FudmFzXCJcbmltcG9ydCB7IERyYXcgfSBmcm9tIFwiLi9XV1NsaWIvRHJhd1wiXG5pbXBvcnQgeyBTRSB9IGZyb20gJy4vV1dTbGliL1NvdW5kJ1xuaW1wb3J0IHsgRGV2aWNlLCBQVF9BbmRyb2lkLCBQVF9pT1MsIFBUX0tpbmRsZSB9IGZyb20gJy4vV1dTbGliL0RldmljZSdcbi8vIC0tLS0tLS0tLS0tLS3lpInmlbAtLS0tLS0tLS0tLS0tXG5leHBvcnQgY29uc3QgIFNZU19WRVIgPSBcIlZlci4yMDIwMTExMVwiXG5leHBvcnQgbGV0ICBERUJVRyA9IGZhbHNlXG5cblxuLy/lh6bnkIbjga7pgLLooYzjgpLnrqHnkIbjgZnjgotcbi8vIG1haW5faWR4IOOBruWApFxuLy8gICAwOiDliJ3mnJ/ljJZcbi8vICAgMTog44K744O844OW44Gn44GN44Gq44GE6K2m5ZGKXG4vLyAgIDI6IOODoeOCpOODs+WHpueQhlxubGV0IG1haW5faWR4ID0gMFxubGV0IG1haW5fdG1yID0gMFxubGV0IHN0b3BfZmxnID0gMCAvLyDjg6HjgqTjg7Plh6bnkIbjga7kuIDmmYLlgZzmraJcbmNvbnN0IE5VQSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7Ly/mqZ/nqK7liKTlrppcbmNvbnN0IHN1cHBvcnRUb3VjaCA9ICdvbnRvdWNoZW5kJyBpbiBkb2N1bWVudDsvL+OCv+ODg+ODgeOCpOODmeODs+ODiOOBjOS9v+OBiOOCi+OBi++8n1xuXG4vL+ODreODvOOCq+ODq+OCueODiOODrOODvOOCuFxuY29uc3QgTFNfS0VZTkFNRSA9IFwiU0FWRURBVEFcIjsvL2tleU5hbWUg5Lu75oSP44Gr5aSJ5pu05Y+vXG4vL+S/neWtmOOBp+OBjeOCi+OBi+WIpOWumuOBl+OAgeOBp+OBjeOBquOBhOWgtOWQiOOBq+itpuWRiuOCkuWHuuOBmeOAgOWFt+S9k+eahOOBq+OBryBpT1MgU2FmYXJpIOODl+ODqeOCpOODmeODvOODiOODluODqeOCpuOCuuOBjE9O77yI5L+d5a2Y44Gn44GN44Gq44GE77yJ54q25oWL44Gr6K2m5ZGK44KS5Ye644GZXG5sZXQgQ0hFQ0tfTFMgPSBmYWxzZTtcblxuLy8gLS0tLS0tLS0tLS0tLeODquOCouODq+OCv+OCpOODoOWHpueQhi0tLS0tLS0tLS0tLS1cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNTVMge1xuICBhYnN0cmFjdCBzZXR1cCgpOiB2b2lkXG4gIGFic3RyYWN0IG1haW5sb29wKCk6IHZvaWRcblxuICBwdWJsaWMgY2FudmFzOiBDYW52YXNcbiAgcHVibGljIGRyYXc6IERyYXdcbiAgcHVibGljIHRvdWNoOiBUb3VjaFxuICBwdWJsaWMga2V5OiBLZXlcbiAgcHVibGljIHNlOiBTRVxuICBwdWJsaWMgZGV2aWNlOiBEZXZpY2VcbiAgcHVibGljIGFjYzogQWNjXG4gIHB1YmxpYyBmcmFtZVNlYzogbnVtYmVyXG4gIC8vIOODleODrOODvOODoOODrOODvOODiCBmcmFtZXMgLyBzZWNvbmRcbiAgcHJpdmF0ZSBGUFMgPSAzMFxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsIHRoaXMudmNQcm9jLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIHRoaXMud3dzU3lzSW5pdC5iaW5kKHRoaXMpKVxuICAgIHRoaXMuY2FudmFzID0gbmV3IENhbnZhcygpXG4gICAgdGhpcy5kcmF3ID0gbmV3IERyYXcoKVxuICAgIHRoaXMuc2UgPSBuZXcgU0UoKVxuICAgIHRoaXMudG91Y2ggPSBuZXcgVG91Y2godGhpcy5zZSlcbiAgICB0aGlzLmtleSA9IG5ldyBLZXkodGhpcy5zZSlcbiAgICB0aGlzLmRldmljZSA9IG5ldyBEZXZpY2UoKVxuICAgIHRoaXMuYWNjID0gbmV3IEFjYyh0aGlzLmRldmljZSlcbiAgICB0aGlzLmZyYW1lU2VjID0gaW50KDEwMDAgLyB0aGlzLkZQUylcbiAgfVxuXG4gIHNldEZQUyhmcHM6IG51bWJlcikge1xuICAgIHRoaXMuRlBTID0gZnBzXG4gICAgdGhpcy5mcmFtZVNlYyA9IGludCgxMDAwIC8gdGhpcy5GUFMpXG4gIH1cblxuICB3d3NTeXNNYWluKCk6IHZvaWQge1xuXG4gICAgbGV0IHN0aW1lID0gRGF0ZS5ub3coKVxuICAgIC8v44OW44Op44Km44K244Gu44K144Kk44K644GM5aSJ5YyW44GX44Gf44GL77yf77yI44K544Oe44Ob44Gq44KJ5oyB44Gh5pa544KS5aSJ44GI44Gf44GL44CA57im5oyB44Gh4oeU5qiq5oyB44Gh77yJXG4gICAgaWYodGhpcy5jYW52YXMuYmFrVyAhPSB3aW5kb3cuaW5uZXJXaWR0aCB8fCB0aGlzLmNhbnZhcy5iYWtIICE9IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgdGhpcy5jYW52YXMuaW5pdENhbnZhcygpXG4gICAgICBsb2coXCJjYW52YXMgc2l6ZSBjaGFuZ2VkIFwiICsgdGhpcy5jYW52YXMuYmFrVyArIFwieFwiICsgdGhpcy5jYW52YXMuYmFrSCk7XG4gICAgfVxuXG4gICAgbWFpbl90bXIgKytcblxuICAgIHN3aXRjaChtYWluX2lkeCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICB0aGlzLnNldHVwKClcbiAgICAgICAgdGhpcy5rZXkuY2xyKClcbiAgICAgICAgbWFpbl9pZHggPSAyXG4gICAgICAgIGlmKENIRUNLX0xTID09IHRydWUpIHtcbiAgICAgICAgICB0cnkge2xvY2FsU3RvcmFnZS5zZXRJdGVtKFwiX3NhdmVfdGVzdFwiLCBcInRlc3RkYXRhXCIpfSBjYXRjaChlKSB7IG1haW5faWR4ID0gMSB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgeCA9IGludChDV0lEVEggLyAyKVxuICAgICAgICBsZXQgeSA9IGludChDSEVJR0hUIC8gNilcbiAgICAgICAgbGV0IGZzID0gaW50KENIRUlHSFQgLyAxNilcbiAgICAgICAgdGhpcy5kcmF3LmZpbGwoXCJibGFja1wiKVxuICAgICAgICB0aGlzLmRyYXcuZlRleHQoXCLigLvjgrvjg7zjg5bjg4fjg7zjgr/jgYzkv53lrZjjgZXjgozjgb7jgZvjgpPigLtcIiwgeCwgeS8yLCBmcywgXCJ5ZWxsb3dcIik7XG4gICAgICAgIHRoaXMuZHJhdy5mVGV4dE4oXCJpT1Pnq6/mnKvjgpLjgYrkvb/jgYTjga7loLTlkIjjga9cXG5TYWZhcmnjga7jg5fjg6njgqTjg5njg7zjg4jjg5bjg6njgqbjgrpcXG7jgpLjgqrjg5XjgavjgZfjgabotbfli5XjgZfjgabkuIvjgZXjgYTjgIJcIiwgeCwgeSoyLCB5LCBmcywgXCJ5ZWxsb3dcIik7XG4gICAgICAgIHRoaXMuZHJhdy5mVGV4dE4oXCLjgZ3jga7ku5bjga7mqZ/nqK7vvIjjg5bjg6njgqbjgrbvvInjgafjga9cXG7jg63jg7zjgqvjg6vjgrnjg4jjg6zjg7zjgrjjgbjjga7kv53lrZjjgpJcXG7oqLHlj6/jgZnjgovoqK3lrprjgavjgZfjgabkuIvjgZXjgYTjgIJcIiwgeCwgeSo0LCB5LCBmcywgXCJ5ZWxsb3dcIik7XG4gICAgICAgIHRoaXMuZHJhdy5mVGV4dChcIuOBk+OBruOBvuOBvue2muOBkeOCi+OBq+OBr+eUu+mdouOCkuOCv+ODg+ODl1wiLCB4LCB5KjUuNSwgZnMsIFwibGltZVwiKTtcbiAgICAgICAgaWYodGhpcy50b3VjaC50YXBDICE9IDApIG1haW5faWR4ID0gMjtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMjogLy/jg6HjgqTjg7Plh6bnkIZcbiAgICAgICAgaWYoc3RvcF9mbGcgPT0gMCkge1xuICAgICAgICAgIHRoaXMubWFpbmxvb3AoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMua2V5LmNscigpXG4gICAgICAgICAgbWFpbl90bXItLVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuc2Uud2FpdF9zZSA+IDApIHRoaXMuc2Uud2FpdF9zZS0tXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OiBicmVha1xuICAgIH1cbiAgICB2YXIgcHRpbWUgPSBEYXRlLm5vdygpIC0gc3RpbWVcbiAgICBpZihwdGltZSA8IDApIHB0aW1lID0gMFxuICAgIGlmKHB0aW1lID4gdGhpcy5mcmFtZVNlYykgcHRpbWUgPSBpbnQocHRpbWUgLyB0aGlzLmZyYW1lU2VjKSAqIHRoaXMuZnJhbWVTZWNcblxuICAgIGlmKERFQlVHKSB7Ly/imIXimIXimIXjg4fjg5Djg4PjgrBcbiAgICAgIGxldCBpOiBudW1iZXJcbiAgICAgIGxldCB4OiBudW1iZXIgPSAyNDBcbiAgICAgIGxldCB5OiBudW1iZXJcbiAgICAgIHRoaXMuZHJhdy5mVGV4dChcIuWHpueQhuaZgumWkz1cIisocHRpbWUpLCB4LCA1MCwgMTYsIFwibGltZVwiKTtcbiAgICAgIHRoaXMuZHJhdy5mVGV4dChgZGV2aWNlVHlwZT0gJHt0aGlzLmRldmljZS50eXBlfWAsIHgsIDEwMCwgMTYsIFwieWVsbG93XCIpO1xuICAgICAgLy90aGlzLmRyYXcuZlRleHQoYGlzQmdtPSAke2lzQmdtfSAoJHtiZ21Ob30pYCwgeCwgMTUwLCAxNiwgXCJ5ZWxsb3dcIik7XG4gICAgICB0aGlzLmRyYXcuZlRleHQoYHdpblc9JHt0aGlzLmNhbnZhcy53aW5XfSB3aW5IPSR7dGhpcy5jYW52YXMud2luSH0gU0NBTEU9ICR7U0NBTEV9YCwgeCwgMjAwLCAxNiwgXCJ5ZWxsb3dcIik7XG4gICAgICB0aGlzLmRyYXcuZlRleHQoYCR7bWFpbl9pZHh9IDogJHttYWluX3Rtcn0gKCR7dGhpcy50b3VjaC50YXBYfSAke3RoaXMudG91Y2gudGFwWX0pICR7dGhpcy50b3VjaC50YXBDfWAsIHgsIDI1MCwgMTYsIFwiY3lhblwiKVxuICAgICAgdGhpcy5kcmF3LmZUZXh0KGDliqDpgJ/luqYgJHt0aGlzLmFjYy5hY1h9IDogJHt0aGlzLmFjYy5hY1l9IDogJHt0aGlzLmFjYy5hY1p9YCwgeCwgMzAwLCAxNiwgXCJwaW5rXCIpO1xuICAgICAgZm9yKGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICAgICAgeCA9IGklMTZcbiAgICAgICAgeSA9IGludChpLzE2KTtcbiAgICAgICAgdGhpcy5kcmF3LmZUZXh0KGAke3RoaXMua2V5LmtleVtpXX1gLCAxNSszMCp4LCAxNSszMCp5LCAxMiwgXCJ3aGl0ZVwiKVxuICAgICAgfVxuICAgIH1cbiAgICBzZXRUaW1lb3V0KHRoaXMud3dzU3lzTWFpbi5iaW5kKHRoaXMpLCB0aGlzLmZyYW1lU2VjIC0gcHRpbWUpXG4gIH1cblxuICB3d3NTeXNJbml0KCkge1xuICAgIHRoaXMuY2FudmFzLmluaXRDYW52YXMoKVxuICAgIGlmKCBOVUEuaW5kZXhPZignQW5kcm9pZCcpID4gMCApIHtcbiAgICAgIHRoaXMuZGV2aWNlLnR5cGUgPSBQVF9BbmRyb2lkO1xuICAgIH1cbiAgICBlbHNlIGlmKCBOVUEuaW5kZXhPZignaVBob25lJykgPiAwIHx8IE5VQS5pbmRleE9mKCdpUG9kJykgPiAwIHx8IE5VQS5pbmRleE9mKCdpUGFkJykgPiAwICkge1xuICAgICAgdGhpcy5kZXZpY2UudHlwZSA9IFBUX2lPUztcbiAgICAgIHdpbmRvdy5zY3JvbGxUbygwLDEpOy8vaVBob25l44GuVVJM44OQ44O844KS5raI44GZ5L2N572u44GrXG4gICAgfVxuICAgIGVsc2UgaWYoIE5VQS5pbmRleE9mKCdTaWxrJykgPiAwICkge1xuICAgICAgdGhpcy5kZXZpY2UudHlwZSA9IFBUX0tpbmRsZTtcbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5rZXkub24uYmluZCh0aGlzLmtleSkpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLmtleS5vZmYuYmluZCh0aGlzLmtleSkpXG5cbiAgICBpZihzdXBwb3J0VG91Y2ggPT0gdHJ1ZSkge1xuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMudG91Y2guc3RhcnQuYmluZCh0aGlzLnRvdWNoKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMudG91Y2gudG91Y2hNb3ZlLmJpbmQodGhpcy50b3VjaCkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMudG91Y2guZW5kLmJpbmQodGhpcy50b3VjaCkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsIHRoaXMudG91Y2guY2FuY2VsLmJpbmQodGhpcy50b3VjaCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMudG91Y2guZG93bi5iaW5kKHRoaXMudG91Y2gpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy50b3VjaC5tb3VzZU1vdmUuYmluZCh0aGlzLnRvdWNoKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLnRvdWNoLnVwLmJpbmQodGhpcy50b3VjaCkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIHRoaXMudG91Y2gub3V0LmJpbmQodGhpcy50b3VjaCkpXG4gICAgfVxuICAgIHRoaXMud3dzU3lzTWFpbigpXG4gIH1cblxuICB2Y1Byb2MoKSB7XG4gICAgaWYoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09IFwiaGlkZGVuXCIpIHtcbiAgICAgIHN0b3BfZmxnID0gMVxuICAgICAgaWYodGhpcy5zZS5pc0JnbSA9PSAxKSB7XG4gICAgICAgIHRoaXMuc2UucGF1c2VCZ20oKVxuICAgICAgICB0aGlzLnNlLmlzQmdtID0gMlxuICAgICAgfVxuICAgIH0gZWxzZSBpZihkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT0gXCJ2aXNpYmxlXCIpIHtcbiAgICAgIHN0b3BfZmxnID0gMFxuICAgICAgaWYodGhpcy5zZS5pc0JnbSA9PSAyKSB7XG4gICAgICAgIHRoaXMuc2UucGxheUJnbSh0aGlzLnNlLmJnbU5vKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtpbnQsIGxvZ30gZnJvbSBcIi4vVXRpbGl0eVwiXG5cbi8vIC0tLS0tLS0tLS0tLS3mj4/nlLvpnaIo44Kt44Oj44Oz44OQ44K5KS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBsZXQgQ1dJRFRIID0gODAwXG5leHBvcnQgbGV0IENIRUlHSFQgPSA2MDBcbmV4cG9ydCBsZXQgU0NBTEUgPSAxLjAgLy8g44K544Kx44O844Or5YCk6Kit5a6aK+OCv+ODg+ODl+S9jee9ruioiOeul+eUqFxuZXhwb3J0IGNsYXNzIENhbnZhcyB7XG5cbiAgcHVibGljIGN2czogSFRNTENhbnZhc0VsZW1lbnRcbiAgcHVibGljIGJnOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsXG4gIHB1YmxpYyB3aW5XOiBudW1iZXJcbiAgcHVibGljIHdpbkg6IG51bWJlclxuICBwdWJsaWMgYmFrVzogbnVtYmVyXG4gIHB1YmxpYyBiYWtIOiBudW1iZXJcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmN2cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50XG4gICAgdGhpcy5iZyA9IHRoaXMuY3ZzLmdldENvbnRleHQoXCIyZFwiKVxuICAgIHRoaXMud2luVyA9IDBcbiAgICB0aGlzLndpbkggPSAwXG4gICAgdGhpcy5iYWtXID0gMFxuICAgIHRoaXMuYmFrSCA9IDBcbiAgfVxuICBpbml0Q2FudmFzKCkge1xuICAgIHRoaXMud2luVyA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgdGhpcy53aW5IID0gd2luZG93LmlubmVySGVpZ2h0XG4gICAgdGhpcy5iYWtXID0gdGhpcy53aW5XXG4gICAgdGhpcy5iYWtIID0gdGhpcy53aW5IXG5cbiAgICBpZiggdGhpcy53aW5IIDwgKHRoaXMud2luVyAqIENIRUlHSFQgLyBDV0lEVEgpICkge1xuICAgICAgLy93aW5XIOOCkuavlOeOh+OBq+WQiOOCj+OBm+OBpuiqv+aVtFxuICAgICAgdGhpcy53aW5XID0gaW50KHRoaXMud2luSCAqIENXSURUSCAvIENIRUlHSFQpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vd2luSCDjgpLmr5TnjofjgavlkIjjgo/jgZvjgaboqr/mlbRcbiAgICAgIHRoaXMud2luSCA9IGludCh0aGlzLndpblcgKiBDSEVJR0hUIC8gQ1dJRFRIKVxuICAgIH1cblxuICAgIHRoaXMuY3ZzLndpZHRoID0gdGhpcy53aW5XXG4gICAgdGhpcy5jdnMuaGVpZ2h0ID0gdGhpcy53aW5IXG4gICAgU0NBTEUgPSB0aGlzLndpblcgLyBDV0lEVEhcblxuICAgIGlmKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5zY2FsZShTQ0FMRSwgU0NBTEUpXG4gICAgdGhpcy5iZy50ZXh0QWxpZ24gPSBcImNlbnRlclwiXG4gICAgdGhpcy5iZy50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiXG5cbiAgICAvL2xvZyhgd2lkdGg6ICR7dGhpcy53aW5XfSBoZWlnaHQ6JHt0aGlzLndpbkh9IHNjYWxlOiR7U0NBTEV9YClcbiAgICAvL2xvZyhgaW5uZXIgd2lkdGg6ICR7d2luZG93LmlubmVyV2lkdGh9IGlubmVyIGhlaWdodDoke3dpbmRvdy5pbm5lckhlaWdodH1gKVxuICB9XG5cbiAgY2FudmFzU2l6ZSh3OiBudW1iZXIsIGg6IG51bWJlcikge1xuICAgIENXSURUSCA9IHdcbiAgICBDSEVJR0hUID0gaFxuICAgIHRoaXMuaW5pdENhbnZhcygpXG4gIH1cbn1cbiIsIi8v56uv5pyr44Gu56iu6aGeXG5leHBvcnQgbGV0IFBUX1BDXHRcdD0gMDtcbmV4cG9ydCBsZXQgUFRfaU9TXHRcdD0gMTtcbmV4cG9ydCBsZXQgUFRfQW5kcm9pZFx0PSAyO1xuZXhwb3J0IGxldCBQVF9LaW5kbGVcdD0gMztcblxuZXhwb3J0IGNsYXNzIERldmljZSB7XG4gIHByaXZhdGUgX3R5cGU6IG51bWJlclxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl90eXBlID0gUFRfUENcbiAgfVxuICBnZXQgdHlwZSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fdHlwZSB9XG4gIHNldCB0eXBlKHR5cGU6IG51bWJlcikgeyB0aGlzLl90eXBlID0gdHlwZSB9XG59XG4iLCJpbXBvcnQgeyBpbnQsIGxvZyB9IGZyb20gXCIuL1V0aWxpdHlcIlxuaW1wb3J0IHsgQ1dJRFRILCBDSEVJR0hULCBDYW52YXMgfSBmcm9tICcuL0NhbnZhcydcblxuZXhwb3J0IGNsYXNzIERyYXcgZXh0ZW5kcyBDYW52YXN7XG4vLyAtLS0tLS0tLS0tLS0t55S75YOP44Gu6Kqt44G/6L6844G/LS0tLS0tLS0tLS0tLVxuICBpbWc6IEhUTUxJbWFnZUVsZW1lbnRbXVxuICBpbWdfbG9hZGVkOiBCb29sZWFuW11cbiAgbGluZV93aWR0aDogbnVtYmVyXG5cbiAgY29uc3RydWN0b3IoKXtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5pbWcgPSBuZXcgQXJyYXkoMjU2KVxuICAgIHRoaXMuaW1nX2xvYWRlZCA9IG5ldyBBcnJheSgyNTYpXG4gICAgdGhpcy5saW5lX3dpZHRoID0gMVxuICB9XG5cbiAgbG9hZEltZyhuOiBudW1iZXIsIGZpbGVuYW1lOiBzdHJpbmcpIHtcbiAgICAvL2xvZyhcIueUu+WDj1wiICsgbiArIFwiIFwiICsgZmlsZW5hbWUgKyBcIuiqreOBv+i+vOOBv+mWi+Wni1wiKVxuICAgIHRoaXMuaW1nX2xvYWRlZFtuXSA9IGZhbHNlXG4gICAgdGhpcy5pbWdbbl0gPSBuZXcgSW1hZ2UoKVxuICAgIHRoaXMuaW1nW25dLnNyYyA9IGZpbGVuYW1lXG4gICAgdGhpcy5pbWdbbl0ub25sb2FkID0gKCkgPT57XG4gICAgICAvL2xvZyhcIueUu+WDj1wiICsgbiArIFwiIFwiICsgZmlsZW5hbWUgKyBcIuiqreOBv+i+vOOBv+WujOS6hlwiKVxuICAgICAgdGhpcy5pbWdfbG9hZGVkW25dID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS3mj4/nlLsxIOWbs+W9oi0tLS0tLS0tLS0tLS1cbiAgc2V0QWxwKHBhcjogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuYmcpIHRoaXMuYmcuZ2xvYmFsQWxwaGEgPSBwYXIvMTAwXG4gIH1cblxuICBjb2xvclJHQihjcjogbnVtYmVyLCBjZzogbnVtYmVyLCBjYjogbnVtYmVyKSB7XG4gICAgY3IgPSBpbnQoY3IpXG4gICAgY2cgPSBpbnQoY2cpXG4gICAgY2IgPSBpbnQoY2IpXG4gICAgcmV0dXJuIChcInJnYihcIiArIGNyICsgXCIsXCIgKyBjZyArIFwiLFwiICsgY2IgKyBcIilcIilcbiAgfVxuXG4gIGxpbmVXKHdpZDogbnVtYmVyKSB7IC8v57ea44Gu5aSq44GV5oyH5a6aXG4gICAgdGhpcy5saW5lX3dpZHRoID0gd2lkIC8v44OQ44OD44Kv44Ki44OD44OXXG4gICAgaWYodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLmxpbmVXaWR0aCA9IHdpZFxuICAgIHRoaXMuYmcubGluZUNhcCA9IFwicm91bmRcIlxuICAgIHRoaXMuYmcubGluZUpvaW4gPSBcInJvdW5kXCJcbiAgfVxuXG4gIGxpbmUoeDA6IG51bWJlciwgeTA6IG51bWJlciwgeDE6IG51bWJlciwgeTE6IG51bWJlciwgY29sOiBzdHJpbmcpIHtcbiAgICBpZih0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuc3Ryb2tlU3R5bGUgPSBjb2xcbiAgICB0aGlzLmJnLmJlZ2luUGF0aCgpXG4gICAgdGhpcy5iZy5tb3ZlVG8oeDAsIHkwKVxuICAgIHRoaXMuYmcubGluZVRvKHgxLCB5MSlcbiAgICB0aGlzLmJnLnN0cm9rZSgpXG4gIH1cblxuICBmaWxsKGNvbDogc3RyaW5nKSB7XG4gICAgaWYodGhpcy5iZykgdGhpcy5iZy5maWxsU3R5bGUgPSBjb2xcbiAgICBpZih0aGlzLmJnKSB0aGlzLmJnLmZpbGxSZWN0KDAsIDAsIENXSURUSCwgQ0hFSUdIVClcbiAgfVxuXG4gIGZSZWN0KHg6bnVtYmVyLCB5Om51bWJlciwgdzpudW1iZXIsIGg6bnVtYmVyLGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5maWxsU3R5bGUgPSBjb2xcbiAgICB0aGlzLmJnLmZpbGxSZWN0KHgsIHksIHcsIGgpXG4gIH1cblxuICBzUmVjdCh4Om51bWJlciwgeTpudW1iZXIsIHc6bnVtYmVyLCBoOm51bWJlcixjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuc3Ryb2tlU3R5bGUgPSBjb2xcbiAgICB0aGlzLmJnLnN0cm9rZVJlY3QoeCwgeSwgdywgaClcbiAgfVxuXG4gIGZDaXIoeDpudW1iZXIsIHk6bnVtYmVyLCByOm51bWJlcixjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5iZWdpblBhdGgoKVxuICAgIHRoaXMuYmcuYXJjKHgsIHksIHIsIDAsIE1hdGguUEkqMiwgZmFsc2UpXG4gICAgdGhpcy5iZy5jbG9zZVBhdGgoKVxuICAgIHRoaXMuYmcuZmlsbCgpXG4gIH1cblxuICBzQ2lyKHg6bnVtYmVyLCB5Om51bWJlciwgcjpudW1iZXIsY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLnN0cm9rZVN0eWxlID0gY29sXG4gICAgdGhpcy5iZy5iZWdpblBhdGgoKVxuICAgIHRoaXMuYmcuYXJjKHgsIHksIHIsIDAsIE1hdGguUEkqMiwgZmFsc2UpXG4gICAgdGhpcy5iZy5jbG9zZVBhdGgoKVxuICAgIHRoaXMuYmcuc3Ryb2tlKClcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS3mj4/nlLsyIOeUu+WDjy0tLS0tLS0tLS0tLS1cbiAgZHJhd0ltZyhuOiBudW1iZXIsIHg6IG51bWJlciwgeTpudW1iZXIpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICBpZih0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCB4LCB5KVxuICB9XG5cbiAgZHJhd0ltZ0xSKG46IG51bWJlciwgeDogbnVtYmVyLCB5Om51bWJlcikgeyAvLyDlt6blj7Plj43ou6JcbiAgICBpZih0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIGNvbnN0IHcgPSB0aGlzLmltZ1tuXS53aWR0aFxuICAgIGNvbnN0IGggPSB0aGlzLmltZ1tuXS5oZWlnaHRcbiAgICBpZih0aGlzLmJnKSB7XG4gICAgICB0aGlzLmJnLnNhdmUoKVxuICAgICAgdGhpcy5iZy50cmFuc2xhdGUoeCt3LzIsIHkraC8yKVxuICAgICAgdGhpcy5iZy5zY2FsZSgtMSwgMSlcbiAgICAgIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCAtdy8yLCAtaC8yKVxuICAgICAgdGhpcy5iZy5yZXN0b3JlKClcbiAgICB9XG4gIH1cblxuICAvL+OCu+ODs+OCv+ODquODs+OCsOihqOekulxuICBkcmF3SW1nQyhuOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgaWYodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBpZiAodGhpcy5iZylcbiAgICAgIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCB4IC0gaW50KHRoaXMuaW1nW25dLndpZHRoLzIpLCB5IC0gaW50KHRoaXMuaW1nW25dLmhlaWdodC8yKSlcbiAgfVxuXG4gIC8v5ouh5aSn57iu5bCPXG4gIGRyYXdJbWdTKG46IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XG4gICAgaWYodGhpcy5pbWdfbG9hZGVkW25dID09IGZhbHNlKSByZXR1cm5cbiAgICBpZiAodGhpcy5iZykgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIHgsIHksIHcsIGgpXG4gIH1cbiAgLy/liIfjgorlh7rjgZcgKyDmi6HlpKfnuK7lsI9cbiAgZHJhd0ltZ1RTKG46IG51bWJlciwgc3g6IG51bWJlciwgc3k6IG51bWJlciwgc3c6IG51bWJlciwgc2g6IG51bWJlciwgY3g6IG51bWJlciwgY3k6IG51bWJlciwgY3c6IG51bWJlciwgY2g6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIGlmICh0aGlzLmJnKSB7XG4gICAgICB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgc3gsIHN5LCBzdywgc2gsIGN4LCBjeSwgY3csIGNoKVxuICAgIH1cbiAgfVxuICAvL+Wbnui7olxuICBkcmF3SW1nUihuIDpudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCBhcmc6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIGNvbnN0IHcgPSB0aGlzLmltZ1tuXS53aWR0aFxuICAgIGNvbnN0IGggPSB0aGlzLmltZ1tuXS5oZWlnaHRcbiAgICBpZih0aGlzLmJnKSB7XG4gICAgICB0aGlzLmJnLnNhdmUoKVxuICAgICAgdGhpcy5iZy50cmFuc2xhdGUoeCt3LzIsIHkraC8yKVxuICAgICAgdGhpcy5iZy5yb3RhdGUoYXJnKVxuICAgICAgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIC13LzIsIC1oLzIpXG4gICAgICB0aGlzLmJnLnJlc3RvcmUoKVxuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS3mj4/nlLszIOaWh+Wtly0tLS0tLS0tLS0tLS1cbiAgZlRleHQoc3RyOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyLCBzaXo6IG51bWJlciwgY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZykge1xuICAgICAgdGhpcy5iZy5mb250ID0gaW50KHNpeikgKyBcInB4IGJvbGQgbW9ub3NwYWNlXCJcbiAgICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgICB0aGlzLmJnLmZpbGxUZXh0KHN0ciwgeCsxLCB5KzEpXG4gICAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IGNvbFxuICAgICAgdGhpcy5iZy5maWxsVGV4dChzdHIsIHgsIHkpXG4gICAgfVxuICB9XG5cbiAgZlRleHROKHN0cjogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlciwgaDogbnVtYmVyLCBzaXo6IG51bWJlciwgY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICBjb25zdCBzbiA9IHN0ci5zcGxpdChcIlxcblwiKVxuICAgIHRoaXMuYmcuZm9udCA9IGludChzaXopICsgXCJweCBib2xkIG1vbm9zcGFjZVwiXG4gICAgaWYoc24ubGVuZ3RoID09IDEpIHtcbiAgICAgIGggPSAwXG4gICAgfSBlbHNlIHtcbiAgICAgIHkgPSB5IC0gaW50KGgvMilcbiAgICAgIGggPSBpbnQoaCAvIChzbi5sZW5ndGggLSAxKSlcbiAgICB9XG4gICAgZm9yKCBsZXQgaSA9IDA7IGkgPCBzbi5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5iZy5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgIHRoaXMuYmcuZmlsbFRleHQoc25baV0sIHgrMSwgeSArIGgqaSArIDEpXG4gICAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IGNvbFxuICAgICAgdGhpcy5iZy5maWxsVGV4dChzbltpXSwgeCwgeSArIGgqaSlcbiAgICB9XG4gIH1cbiAgbVRleHRXaWR0aChzdHI6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHJldHVybiB0aGlzLmJnLm1lYXN1cmVUZXh0KHN0cikud2lkdGhcbiAgfVxufVxuIiwiaW1wb3J0IHsgaW50LCBsb2csIGNvZGVUb1N0ciB9IGZyb20gXCIuL1V0aWxpdHlcIlxuaW1wb3J0IHsgU0UgfSBmcm9tIFwiLi9Tb3VuZFwiXG5pbXBvcnQgeyBTQ0FMRSB9IGZyb20gXCIuL0NhbnZhc1wiXG5pbXBvcnQgeyBEZXZpY2UsIFBUX0FuZHJvaWQgfSBmcm9tIFwiLi9EZXZpY2VcIlxuXG4vLyAtLS0tLS0tLS0tIOOCv+ODg+ODl+WFpeWKmyAtLS0tLS0tLS0tXG5leHBvcnQgY2xhc3MgVG91Y2gge1xuXHRwdWJsaWMgdGFwWDogbnVtYmVyXG5cdHB1YmxpYyB0YXBZOiBudW1iZXJcblx0cHVibGljIHRhcEM6IG51bWJlclxuXHRwcml2YXRlIF9zZTogU0VcblxuXHRjb25zdHJ1Y3RvcihzZTogU0UpIHtcblx0XHR0aGlzLl9zZSA9IHNlO1xuXHRcdHRoaXMudGFwWCA9IDA7XG5cdFx0dGhpcy50YXBZID0gMDtcblx0XHR0aGlzLnRhcEMgPSAwO1xuXHR9XG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS3jg57jgqbjgrnlhaXlipvns7stLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGRvd24oZTogTW91c2VFdmVudCkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTsvL+OCreODo+ODs+ODkOOCueOBrumBuOaKnu+8j+OCueOCr+ODreODvOODq+etieOCkuaKkeWItuOBmeOCi1xuXHRcdGlmKCEgZS50YXJnZXQpIHJldHVyblxuXHRcdGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG5cdFx0dmFyIHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHR0aGlzLnRhcFggPSBlLmNsaWVudFgtcmVjdC5sZWZ0O1xuXHRcdHRoaXMudGFwWSA9IGUuY2xpZW50WS1yZWN0LnRvcDtcblx0XHR0aGlzLnRhcEMgPSAxO1xuXHRcdHRoaXMudHJhbnNmb3JtWFkoKVxuXHRcdGlmKHRoaXMuX3NlLnNuZF9pbml0ID09IDApIHRoaXMuX3NlLmxvYWRTb3VuZFNQaG9uZSgpOy8v44CQ6YeN6KaB44CR44K144Km44Oz44OJ44Gu6Kqt44G/6L6844G/XG5cdH1cblxuXHRtb3VzZU1vdmUoZTogTW91c2VFdmVudCkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRpZighIGUudGFyZ2V0KSByZXR1cm5cblx0XHRjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuXHRcdGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHR0aGlzLnRhcFggPSBlLmNsaWVudFgtcmVjdC5sZWZ0O1xuXHRcdHRoaXMudGFwWSA9IGUuY2xpZW50WS1yZWN0LnRvcDtcblx0XHR0aGlzLnRyYW5zZm9ybVhZKClcblx0fVxuXG5cdHVwKGU6IE1vdXNlRXZlbnQpIHsgdGhpcy50YXBDID0gMDsgfVxuXHRvdXQoZTogTW91c2VFdmVudCkgeyB0aGlzLnRhcEMgPSAwOyB9XG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLeOCv+ODg+ODl+WFpeWKm+ezuy0tLS0tLS0tLS0tLS0tLS0tLS1cblx0c3RhcnQoZTogVG91Y2hFdmVudCkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTsvL+OCreODo+ODs+ODkOOCueOBrumBuOaKnu+8j+OCueOCr+ODreODvOODq+etieOCkuaKkeWItuOBmeOCi1xuXHRcdGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG5cdFx0Y29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHR0aGlzLnRhcFggPSBlLnRvdWNoZXNbMF0uY2xpZW50WC1yZWN0LmxlZnQ7XG5cdFx0dGhpcy50YXBZID0gZS50b3VjaGVzWzBdLmNsaWVudFktcmVjdC50b3A7XG5cdFx0dGhpcy50YXBDID0gMTtcblx0XHR0aGlzLnRyYW5zZm9ybVhZKCk7XG5cdFx0aWYodGhpcy5fc2Uuc25kX2luaXQgPT0gMCkgdGhpcy5fc2UubG9hZFNvdW5kU1Bob25lKCk7Ly/jgJDph43opoHjgJHjgrXjgqbjg7Pjg4njga7oqq3jgb/ovrzjgb9cblx0fVxuXG5cdHRvdWNoTW92ZShlOiBUb3VjaEV2ZW50KSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG5cdFx0Y29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHR0aGlzLnRhcFggPSBlLnRvdWNoZXNbMF0uY2xpZW50WC1yZWN0LmxlZnQ7XG5cdFx0dGhpcy50YXBZID0gZS50b3VjaGVzWzBdLmNsaWVudFktcmVjdC50b3A7XG5cdFx0dGhpcy50cmFuc2Zvcm1YWSgpO1xuXHR9XG5cblx0ZW5kKGU6IFRvdWNoRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy50YXBDID0gMDsvL+KAu+ODnuOCpuOCueaTjeS9nOOBp+OBr21vdXNlT3V044GM44GT44KM44Gr44Gq44KLXG5cdH1cblxuXHRjYW5jZWwoZTogVG91Y2hFdmVudCkge1xuXHRcdHRoaXMudGFwWCA9IC0xO1xuXHRcdHRoaXMudGFwWSA9IC0xO1xuXHRcdHRoaXMudGFwQyA9IDA7XG5cdH1cblxuXHR0cmFuc2Zvcm1YWSgpIHsvL+Wun+W6p+aomeKGkuS7ruaDs+W6p+aomeOBuOOBruWkieaPm1xuXHRcdHRoaXMudGFwWCA9IGludCh0aGlzLnRhcFggLyBTQ0FMRSk7XG5cdFx0dGhpcy50YXBZID0gaW50KHRoaXMudGFwWSAvIFNDQUxFKTtcblx0fVxufVxuXG5cbi8vIC0tLS0tLS0tLS0tLS3jg57jgqbjgrnlhaXlipstLS0tLS0tLS0tLS0tXG5leHBvcnQgY2xhc3MgTW91c2Uge1xuXHRwdWJsaWMgdGFwWDpudW1iZXJcblx0cHVibGljIHRhcFk6bnVtYmVyXG5cdHB1YmxpYyB0YXBDOm51bWJlclxuXHRwcml2YXRlIF9zZTogU0VcblxuXHRjb25zdHJ1Y3RvcihzZTogU0UpIHtcblx0XHR0aGlzLl9zZSA9IHNlXG5cdFx0dGhpcy50YXBDID0gMFxuXHRcdHRoaXMudGFwWCA9IDBcblx0XHR0aGlzLnRhcFkgPSAwXG5cdH1cblxufVxuXG4vLyAtLS0tLS0tLS0tIOWKoOmAn+W6puOCu+ODs+OCteODvCAtLS0tLS0tLS0tXG5leHBvcnQgY2xhc3MgQWNjIHtcblx0cHVibGljIGFjWCA9IDBcblx0cHVibGljIGFjWSA9IDBcblx0cHVibGljIGFjWiA9IDA7XG5cdHB1YmxpYyBkZXZpY2U6IERldmljZVxuXG5cdGNvbnN0cnVjdG9yKGRldmljZTogRGV2aWNlKSB7XG5cdFx0Ly93aW5kb3cub25kZXZpY2Vtb3Rpb24gPSBkZXZpY2VNb3Rpb247Ly/imIXimIXimIXml6dcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZW1vdGlvblwiLCB0aGlzLmRldmljZU1vdGlvbik7XG5cdFx0dGhpcy5kZXZpY2UgPSBkZXZpY2Vcblx0fVxuXG5cdGRldmljZU1vdGlvbihlOiBEZXZpY2VNb3Rpb25FdmVudCkge1xuXHRcdHZhciBhSUc6IERldmljZU1vdGlvbkV2ZW50QWNjZWxlcmF0aW9uIHwgbnVsbCA9IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eTtcblx0XHRpZiAoYUlHID09IG51bGwpIHJldHVybjtcblx0XHRpZihhSUcueCkgdGhpcy5hY1ggPSBpbnQoYUlHLngpO1xuXHRcdGlmKGFJRy55KSB0aGlzLmFjWSA9IGludChhSUcueSk7XG5cdFx0aWYoYUlHLnopIHRoaXMuYWNaID0gaW50KGFJRy56KTtcblx0XHRpZih0aGlzLmRldmljZS50eXBlID09IFBUX0FuZHJvaWQpIHsvL0FuZHJvaWQg44GoIGlPUyDjgafmraPosqDjgYzpgIbjgavjgarjgotcblx0XHRcdHRoaXMuYWNYID0gLXRoaXMuYWNYO1xuXHRcdFx0dGhpcy5hY1kgPSAtdGhpcy5hY1k7XG5cdFx0XHR0aGlzLmFjWiA9IC10aGlzLmFjWjtcblx0XHR9XG5cdH1cbn1cblxuLy/jgq3jg7zlhaXlipvnlKhcbmV4cG9ydCBjbGFzcyBLZXkge1xuXHRwdWJsaWMgX3NlOiBTRVxuXHRwdWJsaWMgaW5rZXk6IG51bWJlclxuXHRwdWJsaWMga2V5OiBudW1iZXJbXVxuXG5cdGNvbnN0cnVjdG9yKHNlOiBTRSkge1xuXHRcdHRoaXMuaW5rZXkgPSAwXG5cdFx0dGhpcy5rZXkgPSBuZXcgQXJyYXkoMjU2KTtcblx0XHR0aGlzLl9zZSA9IHNlXG5cdH1cblxuXHRjbHIoKSB7XG5cdFx0dGhpcy5pbmtleSA9IDA7XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB0aGlzLmtleVtpXSA9IDA7XG5cdH1cblxuXHRvbihlOiBLZXlib2FyZEV2ZW50KSB7XG5cdFx0Ly9sb2coIGAke2Uua2V5fSA6ICR7ZS5jb2RlfSA6ICR7ZS5rZXlDb2RlfSA6ICR7Y29kZVRvU3RyKGUuY29kZSl9YCApXG5cblx0XHRpZih0aGlzLl9zZS5zbmRfaW5pdCA9PSAwKSB0aGlzLl9zZS5sb2FkU291bmRTUGhvbmUoKTsvL+OAkOmHjeimgeOAkeOCteOCpuODs+ODieOBruiqreOBv+i+vOOBv1xuXHRcdHRoaXMuaW5rZXkgPSBjb2RlVG9TdHIoZS5jb2RlKVxuXHRcdHRoaXMua2V5W2NvZGVUb1N0cihlLmNvZGUpXSsrXG5cdH1cblxuXHRvZmYoZTogS2V5Ym9hcmRFdmVudCkge1xuXHRcdHRoaXMuaW5rZXkgPSAwO1xuXHRcdHRoaXMua2V5W2NvZGVUb1N0cihlLmNvZGUpXSA9IDA7XG5cdH1cbn1cbiIsImltcG9ydCB7IGxvZyB9IGZyb20gJy4vVXRpbGl0eSdcblxuLy8gLS0tLS0tLS0tLS0tLeOCteOCpuODs+ODieWItuW+oS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBsZXQgIFNPVU5EX09OID0gdHJ1ZVxuZXhwb3J0IGNsYXNzIFNFIHtcbiAgcHVibGljIHdhaXRfc2U6IG51bWJlciA9IDBcbiAgcHVibGljIHNuZF9pbml0OiBudW1iZXIgPSAwXG4gIHNvdW5kRmlsZTogSFRNTEF1ZGlvRWxlbWVudFtdXG4gIGlzQmdtOiBudW1iZXJcbiAgYmdtTm86IG51bWJlclxuICBzZU5vOm51bWJlclxuXG4gIHNvdW5kbG9hZGVkOiBudW1iZXJcbiAgc2ZfbmFtZTogc3RyaW5nW11cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvL+OCteOCpuODs+ODieODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCk+OBoOOBiyjjgrnjg57jg5vlr77nrZYpXG4gICAgdGhpcy53YWl0X3NlID0gMFxuICAgIHRoaXMuc25kX2luaXQgPSAwXG4gICAgdGhpcy5zb3VuZEZpbGUgPSBuZXcgQXJyYXkoMjU2KVxuICAgIHRoaXMuaXNCZ20gPSAtMVxuICAgIHRoaXMuYmdtTm8gPSAwXG4gICAgdGhpcy5zZU5vID0gLTFcbiAgICB0aGlzLnNvdW5kbG9hZGVkID0gMCAvL+OBhOOBj+OBpOODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCk+OBoOOBi1xuICAgIHRoaXMuc2ZfbmFtZSA9IG5ldyBBcnJheSgyNTYpXG4gIH1cblxuICBsb2FkU291bmRTUGhvbmUoKSB7Ly/jgrnjg57jg5vjgafjg5XjgqHjgqTjg6vjgpLoqq3jgb/ovrzjgoBcbiAgICB0cnkge1xuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuc291bmRsb2FkZWQ7IGkrKykge1xuICAgICAgICB0aGlzLnNvdW5kRmlsZVtpXSA9IG5ldyBBdWRpbyh0aGlzLnNmX25hbWVbaV0pXG4gICAgICAgIHRoaXMuc291bmRGaWxlW2ldLmxvYWQoKVxuICAgICAgfVxuICAgIH0gY2F0Y2goZSkge1xuICAgIH1cbiAgICB0aGlzLnNuZF9pbml0ID0gMiAvL+OCueODnuODm+OBp+ODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCk+OBoFxuICB9XG5cbiAgbG9hZFNvdW5kKG46IG51bWJlciwgZmlsZW5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuc2ZfbmFtZVtuXSA9IGZpbGVuYW1lXG4gICAgdGhpcy5zb3VuZGxvYWRlZCsrXG4gIH1cblxuICBwbGF5U0UobjogbnVtYmVyKSB7XG4gICAgaWYoU09VTkRfT04gPT0gZmFsc2UpIHJldHVyblxuICAgIGlmKHRoaXMuaXNCZ20gPT0gMikgcmV0dXJuXG4gICAgaWYodGhpcy53YWl0X3NlID09IDApIHtcbiAgICAgIHRoaXMuc2VObyA9IG5cbiAgICAgIHRoaXMuc291bmRGaWxlW25dLmN1cnJlbnRUaW1lID0gMFxuICAgICAgdGhpcy5zb3VuZEZpbGVbbl0ubG9vcCA9IGZhbHNlXG4gICAgICB0aGlzLnNvdW5kRmlsZVtuXS5wbGF5KClcbiAgICAgIHRoaXMud2FpdF9zZSA9IDMgLy/jg5bjg6njgqbjgrbjgavosqDojbfjgpLjgYvjgZHjgarjgYTjgojjgYbjgavpgKPntprjgZfjgabmtYHjgZXjgarjgYTjgojjgYbjgavjgZnjgotcbiAgICB9XG4gIH1cblxuICBwbGF5QmdtKG46IG51bWJlcikge1xuICAgIGlmKFNPVU5EX09OID09IGZhbHNlKSByZXR1cm5cbiAgICBsb2coYO+8ou+8p++8rSAke259IOWHuuWKm2ApXG4gICAgdGhpcy5iZ21ObyA9IG5cbiAgICB0aGlzLnNvdW5kRmlsZVtuXS5sb29wID0gdHJ1ZVxuICAgIHRoaXMuc291bmRGaWxlW25dLnBsYXkoKVxuICAgIHRoaXMuaXNCZ20gPSAxIC8vQkdN5YaN55Sf5LitXG4gIH1cblxuICBwYXVzZUJnbSgpIHtcbiAgICB0aGlzLnNvdW5kRmlsZVt0aGlzLmJnbU5vXS5wYXVzZSgpXG4gICAgdGhpcy5pc0JnbSA9IDAgLy9CR03lgZzmraLkuK1cbiAgfVxuXG4gIHN0b3BCZ20oKSB7XG4gICAgdGhpcy5zb3VuZEZpbGVbdGhpcy5iZ21Ob10ucGF1c2UoKVxuICAgIHRoaXMuc291bmRGaWxlW3RoaXMuYmdtTm9dLmN1cnJlbnRUaW1lID0gMFxuICAgIHRoaXMuaXNCZ20gPSAwIC8vQkdN5YGc5q2iXG4gIH1cblxuICByYXRlU25kKHJhdGU6IG51bWJlcikge1xuICAgIHRoaXMuc291bmRGaWxlW3RoaXMuYmdtTm9dLnZvbHVtZSA9IHJhdGVcbiAgfVxufSIsIi8vIC0tLS0tLS0tLS0tLS3lkITnqK7jga7plqLmlbAtLS0tLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gbG9nKG1zZzogc3RyaW5nKSB7XG4gIGNvbnNvbGUubG9nKG1zZylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludCh2YWw6IG51bWJlcik6IG51bWJlciB7XG4gIGxldCBudW0gPSBTdHJpbmcodmFsKVxuICByZXR1cm4gcGFyc2VJbnQobnVtKSAvL+ODl+ODqeOCueODnuOCpOODiuOCueOBqeOBoeOCieOCguWwj+aVsOmDqOWIhuOCkuWIh+OCiuaNqOOBplxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyKHZhbDogbnVtYmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIFN0cmluZyh2YWwpXG59XG5leHBvcnQgZnVuY3Rpb24gcm5kKG1heDogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIGludChNYXRoLnJhbmRvbSgpICogbWF4KVxufVxuZXhwb3J0IGZ1bmN0aW9uIGFicyh2YWw6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmFicyh2YWwpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3MoYTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguY29zKE1hdGguUEkgKiAyICogYSAvIDM2MClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpbihhOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5zaW4oTWF0aC5QSSAqIDIgKiBhIC8gMzYwKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGlzKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHgyIC0geDEsIDIpICsgTWF0aC5wb3coeTIgLSB5MSwgMikpXG59XG5cblxuLy8gLS0tLS0tLS0tLSDjgq3jg7zlhaXlipvjgq3jg7zjga7jg57jg4Pjg5Tjg7PjgrAoa2V5Q29kZSDjgYzpnZ7mjqjlpajjga7jgZ/jgoEpIC0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiBjb2RlVG9TdHIoY29kZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgbGV0IGNoYXJDb2RlOiBudW1iZXIgPSAwXG4gIHN3aXRjaChjb2RlKSB7XG4gICAgY2FzZSBcIktleUFcIjogY2hhckNvZGUgPSA2NTsgYnJlYWs7XG4gICAgY2FzZSBcIktleUJcIjogY2hhckNvZGUgPSA2NjsgYnJlYWs7XG4gICAgY2FzZSBcIktleUNcIjogY2hhckNvZGUgPSA2NzsgYnJlYWs7XG4gICAgY2FzZSBcIktleURcIjogY2hhckNvZGUgPSA2ODsgYnJlYWs7XG4gICAgY2FzZSBcIktleUVcIjogY2hhckNvZGUgPSA2OTsgYnJlYWs7XG4gICAgY2FzZSBcIktleUZcIjogY2hhckNvZGUgPSA3MDsgYnJlYWs7XG4gICAgY2FzZSBcIktleUdcIjogY2hhckNvZGUgPSA3MTsgYnJlYWs7XG4gICAgY2FzZSBcIktleUhcIjogY2hhckNvZGUgPSA3MjsgYnJlYWs7XG4gICAgY2FzZSBcIktleUlcIjogY2hhckNvZGUgPSA3MzsgYnJlYWs7XG4gICAgY2FzZSBcIktleUpcIjogY2hhckNvZGUgPSA3NDsgYnJlYWs7XG4gICAgY2FzZSBcIktleUtcIjogY2hhckNvZGUgPSA3NTsgYnJlYWs7XG4gICAgY2FzZSBcIktleUxcIjogY2hhckNvZGUgPSA3NjsgYnJlYWs7XG4gICAgY2FzZSBcIktleU1cIjogY2hhckNvZGUgPSA3NzsgYnJlYWs7XG4gICAgY2FzZSBcIktleU5cIjogY2hhckNvZGUgPSA3ODsgYnJlYWs7XG4gICAgY2FzZSBcIktleU9cIjogY2hhckNvZGUgPSA3OTsgYnJlYWs7XG4gICAgY2FzZSBcIktleVBcIjogY2hhckNvZGUgPSA4MDsgYnJlYWs7XG4gICAgY2FzZSBcIktleVFcIjogY2hhckNvZGUgPSA4MTsgYnJlYWs7XG4gICAgY2FzZSBcIktleVJcIjogY2hhckNvZGUgPSA4MjsgYnJlYWs7XG4gICAgY2FzZSBcIktleVNcIjogY2hhckNvZGUgPSA4MzsgYnJlYWs7XG4gICAgY2FzZSBcIktleVRcIjogY2hhckNvZGUgPSA4NDsgYnJlYWs7XG4gICAgY2FzZSBcIktleVVcIjogY2hhckNvZGUgPSA4NTsgYnJlYWs7XG4gICAgY2FzZSBcIktleVZcIjogY2hhckNvZGUgPSA4NjsgYnJlYWs7XG4gICAgY2FzZSBcIktleVdcIjogY2hhckNvZGUgPSA4NzsgYnJlYWs7XG4gICAgY2FzZSBcIktleVhcIjogY2hhckNvZGUgPSA4ODsgYnJlYWs7XG4gICAgY2FzZSBcIktleVlcIjogY2hhckNvZGUgPSA4OTsgYnJlYWs7XG4gICAgY2FzZSBcIktleVpcIjogY2hhckNvZGUgPSA5MDsgYnJlYWs7XG5cbiAgICBjYXNlIFwiU3BhY2VcIjogY2hhckNvZGUgPSAzMjsgYnJlYWs7XG4gICAgY2FzZSBcIkFycm93TGVmdFwiOiBjaGFyQ29kZSA9IDM3OyBicmVhaztcbiAgICBjYXNlIFwiQXJyb3dVcFwiOiBjaGFyQ29kZSA9IDM4OyBicmVhaztcbiAgICBjYXNlIFwiQXJyb3dSaWdodFwiOiBjaGFyQ29kZSA9IDM5OyBicmVhaztcbiAgICBjYXNlIFwiQXJyb3dEb3duXCI6IGNoYXJDb2RlID0gNDA7IGJyZWFrO1xuICB9XG4gIHJldHVybiBjaGFyQ29kZVxufVxuXG5leHBvcnQgY29uc3QgS0VZX05BTUUgPSB7XG5cdFwiRU5URVJcIiA6IDEzLFxuXHRcIlNQQUNFXCIgOiAzMixcblx0XCJMRUZUXCIgIDogMzcsXG5cdFwiVVBcIiAgICA6IDM4LFxuXHRcIlJJR0hUXCIgOiAzOSxcblx0XCJET1dOXCIgIDogNDAsXG5cdFwiQVwiICAgICA6IDY1LFxuXHRcIlpcIiAgICAgOiA5MCxcbiAgXCJSXCIgICAgIDogODIsXG4gIFwiQ1wiICAgICA6IDY3XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgTU1TIH0gZnJvbSAnLi9XV1MnXG5pbXBvcnQgeyBnZXREaXMsIEtFWV9OQU1FLCBsb2csIHJuZCwgaW50IH0gZnJvbSAnLi9XV1NsaWIvVXRpbGl0eSdcblxuXG5jbGFzcyBNeUdhbWUgZXh0ZW5kcyBNTVMge1xuICBtYXN1ID0gbmV3IEFycmF5KDEzKVxuICBrZXN1ID0gbmV3IEFycmF5KDEzKVxuXG4gIGlkeDogbnVtYmVyID0gMCAvL+ODouODvOODieOBruOCpOODs+ODh+ODg+OCr+OCuVxuICB0bXI6IG51bWJlciA9IDAgLy/jgr/jgqTjg57jg7xcbiAgYmxvY2sgPSBbMCwgMCwgMCwgMSwgMiwgM10gLy/jg5fjg6zjgqTjg6Tjg7zjgYzli5XjgYvjgZkz44Gk44Gu44OW44Ot44OD44Kv44Gu55Wq5Y+3K+asoeOBruODluODreODg+OCr+OBrueVquWPt1xuICBteUJsb2NrWDogbnVtYmVyID0gMCAvL+WHpueQhuOBrua1geOCjOOCkueuoeeQhlxuICBteUJsb2NrWTogbnVtYmVyID0gMCAvL+aZgumWk+OBrumAsuihjOOCkueuoeeQhlxuICBkcm9wU3BkOiBudW1iZXIgPSAwIC8v6JC95LiL6YCf5bqmXG5cbiAgZ2FtZVByb2M6IG51bWJlciA9IDAgLy/lh6bnkIbjga7mtYHjgozjgpLnrqHnkIZcbiAgZ2FtZVRpbWU6IG51bWJlciA9IDAgLy/mmYLplpPjga7pgLLooYzjgpLnrqHnkIZcbiAgaGlzY286ICBudW1iZXIgPSA1MDAwIC8v44OP44Kk44K544Kz44KiXG4gIHNjb3JlID0gMCAvL+OCueOCs+OColxuICByZW5zYSA9IDAgLy/pgKPpjpblm57mlbBcbiAgcG9pbnRzID0gMCAvL+ODluODreODg+OCr+OCkua2iOOBl+OBn+OBqOOBjeOBruW+l+eCuVxuICBlZnRpbWUgPSAwIC8v44OW44Ot44OD44Kv44KS5raI44GZ5ryU5Ye65pmC6ZaTXG4gIGV4dGVuZCA9IDAgLy/jgqjjgq/jgrnjg4bjg7Pjg4njgr/jgqTjg6BcbiAgdGFwS2V5ID0gWzAsIDAsIDAsIDBdIC8v44Oc44K/44Oz44Gu44Ki44Kk44Kz44Oz44KS44K/44OD44OX44GX44Gm44GE44KL44GLXG5cbiAgUkFJTkJPVyA9IFtcIiNmZjAwMDBcIiwgXCIjZTA4MDAwXCIsIFwiI2MwZTAwMFwiLCBcIiMwMGZmMDBcIiwgXCIjMDBjMGUwXCIsIFwiIzAwNDBmZlwiLCBcIiM4MDAwZTBcIl1cbiAgRUZGX01BWCA9IDEwMFxuICBlZmZYID0gbmV3IEFycmF5KHRoaXMuRUZGX01BWClcbiAgZWZmWSA9IG5ldyBBcnJheSh0aGlzLkVGRl9NQVgpXG4gIGVmZlQgPSBuZXcgQXJyYXkodGhpcy5FRkZfTUFYKVxuICBlZmZOID0gMFxuXG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgc3VwZXIoKVxuICAgIGZvciggbGV0IHkgPSAwOyB5IDwgMTM7IHkrKykge1xuICAgICAgZm9yKCBsZXQgeCA9IDA7IHggPCA4OyB4KyspIHtcbiAgICAgICAgdGhpcy5tYXN1W3ldID0gbmV3IEFycmF5KDkpXG4gICAgICAgIHRoaXMua2VzdVt5XSA9IG5ldyBBcnJheSg5KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldHVwKCk6IHZvaWQge1xuICAgIHRoaXMuY2xyQmxvY2soKVxuICAgIHRoaXMuY2FudmFzLmNhbnZhc1NpemUoOTYwLCAxMjAwKVxuICAgIHRoaXMuZHJhdy5sb2FkSW1nKDAsICdpbWFnZTMvYmcucG5nJylcbiAgICBjb25zdCBCTE9DSyA9IFtcInRha29cIiwgXCJ3YWthbWVcIiwgXCJrdXJhZ2VcIiwgXCJzYWthbmFcIiwgXCJ1bmlcIiwgXCJpa2FcIl1cbiAgICBmb3IobGV0IGk9MDsgaTw2OyBpKyspIHtcbiAgICAgIHRoaXMuZHJhdy5sb2FkSW1nKGkrMSwgYGltYWdlMy8ke0JMT0NLW2ldfS5wbmdgKVxuICAgIH1cbiAgICB0aGlzLmRyYXcubG9hZEltZyg3LCAnaW1hZ2UzL3RpdGxlLnBuZycpXG4gICAgdGhpcy5zZS5sb2FkU291bmQoMCwgJ3NvdW5kMy9iZ20ubTRhJylcbiAgICB0aGlzLnNlLmxvYWRTb3VuZCgxLCAnc291bmQzL3NlLm00YScpXG4gICAgdGhpcy5pbml0VmFyKClcbiAgfVxuXG4gIG1haW5sb29wKCk6IHZvaWQge1xuICAgIHRoaXMudG1yICs9IDFcbiAgICB0aGlzLmRyYXdQemwoKVxuICAgIHRoaXMuZHJhd0VmZmVjdCgpXG4gICAgc3dpdGNoKHRoaXMuaWR4KSB7XG4gICAgICBjYXNlIDA6IC8v44K/44Kk44OI44Or55S76Z2iXG4gICAgICAgIHRoaXMuZHJhdy5kcmF3SW1nQyg3LCA0ODAsIDQwMCkgLy/jgr/jgqTjg4jjg6tcbiAgICAgICAgaWYodGhpcy50bXIgJSA0MCA8IDIwKSB0aGlzLmRyYXcuZlRleHQoXCJUQVAgVE8gU1RBUlQuXCIsIDQ4MCwgNjgwLCA4MCwgXCJwaW5rXCIpXG4gICAgICAgIGlmKHRoaXMua2V5LmtleVtLRVlfTkFNRS5TUEFDRV0pIHtcbiAgICAgICAgICB0aGlzLmNsckJsb2NrKClcbiAgICAgICAgICB0aGlzLmluaXRWYXIoKVxuICAgICAgICAgIHRoaXMuc2UucGxheUJnbSgwKVxuICAgICAgICAgIHRoaXMuaWR4ID0gMVxuICAgICAgICAgIHRoaXMudG1yID0gMFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgMTogLy/jgrLjg7zjg6DkuK1cbiAgICAgICAgaWYodGhpcy5wcm9jUHpsKCkgPT0gMCkge1xuICAgICAgICAgIHRoaXMuc2Uuc3RvcEJnbSgpXG4gICAgICAgICAgdGhpcy5pZHggPSAyXG4gICAgICAgICAgdGhpcy50bXIgPSAwXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAyOiAvL+OCsuODvOODoOOCquODvOODkOODvFxuICAgICAgICB0aGlzLmRyYXcuZlRleHQoXCJHQU1FIE9WRVJcIiwgNDgwLCA0MjAsIDEwMCwgXCJ2aW9sZXRcIilcbiAgICAgICAgaWYodGhpcy50bXIgPiAzMCAqIDUpIHRoaXMuaWR4ID0gMFxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGNsckJsb2NrKCkgey8v44Oe44K555uu44KS5Yid5pyf5YyWXG4gICAgZm9yKGxldCB5ID0gMDsgeSA8PSAxMjsgeSsrKSB7XG4gICAgICBmb3IobGV0IHggPSAwOyB4IDw9IDg7IHgrKykge1xuICAgICAgICB0aGlzLm1hc3VbeV1beF0gPSAtMVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IobGV0IHkgPSAxOyB5IDw9IDExOyB5KyspIHtcbiAgICAgIGZvcihsZXQgeCA9IDE7IHggPD0gNzsgeCsrKSB7XG4gICAgICAgIHRoaXMubWFzdVt5XVt4XSA9IDBcbiAgICAgICAgdGhpcy5rZXN1W3ldW3hdID0gMFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGluaXRWYXIoKSB7XG4gICAgdGhpcy5teUJsb2NrWCA9IDRcbiAgICB0aGlzLm15QmxvY2tZID0gMVxuICAgIHRoaXMuZHJvcFNwZCA9IDkwXG5cbiAgICB0aGlzLmJsb2NrWzBdID0gMSAvL+ePvuWcqOOBruODluODreODg+OCr1xuICAgIHRoaXMuYmxvY2tbMV0gPSAyXG4gICAgdGhpcy5ibG9ja1syXSA9IDNcblxuICAgIHRoaXMuYmxvY2tbMF0gPSAyIC8v5qyh44Gu44OW44Ot44OD44KvXG4gICAgdGhpcy5ibG9ja1sxXSA9IDNcbiAgICB0aGlzLmJsb2NrWzJdID0gNFxuXG4gICAgdGhpcy5nYW1lUHJvYyA9IDAgLy/lh6bnkIbjga7mtYHjgozjgpLnrqHnkIZcbiAgICB0aGlzLmdhbWVUaW1lID0gMzAgKiA2MCAqIDMgLy/mmYLplpPjga7pgLLooYzjgpLnrqHnkIYg57SEM+WIhlxuICAgIHRoaXMuc2NvcmUgPSAwIC8v44K544Kz44KiXG5cbiAgICBmb3IobGV0IGk9MDsgaTx0aGlzLkVGRl9NQVg7IGkrKykge1xuICAgICAgdGhpcy5lZmZUW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIGRyYXdQemwoKSB7XG4gICAgdGhpcy5kcmF3LmRyYXdJbWcoMCwgMCwgMClcbiAgICBmb3IobGV0IHggPSAwOyB4IDwgMzsgeCsrKSB0aGlzLmRyYXcuZHJhd0ltZyh0aGlzLmJsb2NrWzMreF0sIDY3Mis4MCp4LCA1MClcbiAgICB0aGlzLmRyYXcuZlRleHROKGBUSU1FXFxuJHt0aGlzLmdhbWVUaW1lfWAsIDgwMCwgMjgwLCA3MCwgNjAsIFwid2hpdGVcIilcbiAgICB0aGlzLmRyYXcuZlRleHROKGBTQ09SRVxcbiR7dGhpcy5zY29yZX1gLCA4MDAsIDU2MCwgNzAsIDYwLCBcIndoaXRlXCIpXG5cbiAgICBmb3IobGV0IHk9MTsgeTw9MTE7IHkrKykge1xuICAgICAgZm9yKGxldCB4PTE7IHg8PTc7IHgrKykge1xuICAgICAgICBpZiggdGhpcy5tYXN1W3ldW3hdID4gMCApIHtcbiAgICAgICAgICB0aGlzLmRyYXcuZHJhd0ltZ0ModGhpcy5tYXN1W3ldW3hdLCB4KjgwLCB5KjgwKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmKHRoaXMuZ2FtZVByb2MgPT0gMCkgeyAvL+ODluODreODg+OCr+OBruenu+WLlVxuICAgICAgZm9yKGxldCB4PS0xOyB4PD0xOyB4KyspIHtcbiAgICAgICAgdGhpcy5kcmF3LmRyYXdJbWdDKHRoaXMuYmxvY2tbMSt4XSwgKHRoaXMubXlCbG9ja1greCkqODAsIDgwKnRoaXMubXlCbG9ja1ktMilcbiAgICAgIH1cbiAgICB9XG4gICAgaWYodGhpcy5nYW1lUHJvYyA9PSAzKSB7Ly/mtojjgZnlh6bnkIZcbiAgICAgIHRoaXMuZHJhdy5mVGV4dChgJHt0aGlzLnBvaW50c31wdHNgLCAzMjAsIDEyMCwgNTAsIHRoaXMuUkFJTkJPV1t0aGlzLnRtciAlIDhdKSAvL+W+l+eCueihqOekulxuICAgICAgaWYodGhpcy5leHRlbmQgPiAwKSB0aGlzLmRyYXcuZlRleHQoYFRJTUUgJHt0aGlzLmV4dGVuZH0hYCwgMzIwLCAyNDAsIDUwLCB0aGlzLlJBSU5CT1dbdGhpcy50bXIgJSA4XSkgLy/jgqjjgq/jgrnjg4bjg7Pjg4nooajnpLpcbiAgICB9XG4gIH1cblxuICBwcm9jUHpsKCkge1xuICAgIGlmKHRoaXMudG91Y2gudGFwQyA+IDAgJiYgOTYwIDwgdGhpcy50b3VjaC50YXBZICYmIHRoaXMudG91Y2gudGFwWSA8IDEyMDApIHsgLy/jgr/jg4Pjg5fmk43kvZxcbiAgICAgIGNvbnN0IGMgPSBpbnQodGhpcy50b3VjaC50YXBYIC8gMjQwKVxuICAgICAgbG9nKGAke2N9YClcbiAgICAgIGlmKDAgPD0gYyAmJiBjIDw9IDMpIHtcbiAgICAgICAgdGhpcy50YXBLZXlbY10gKz0gMVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IobGV0IGk9MDsgaSA8IDQ7IGkrKykge1xuICAgICAgICB0aGlzLnRhcEtleVtpXSA9IDBcbiAgICAgIH1cbiAgICB9XG4gICAgc3dpdGNoKHRoaXMuZ2FtZVByb2MpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgaWYodGhpcy50bXIgPCAxMCkgYnJlYWsgLy/kuIvjgq3jg7zmirzjgZfjgafjg5bjg63jg4Pjgq/jgYzjganjgpPjganjgpPokL3jgaHjgarjgYTjgojjgYbjgavjgZnjgotcbiAgICAgICAgLy/jgq3jg7zjgafjga7mk43kvZxcbiAgICAgICAgaWYoIHRoaXMua2V5LmtleVtLRVlfTkFNRS5MRUZUXSA9PSAxIHx8IHRoaXMua2V5LmtleVtLRVlfTkFNRS5MRUZUXSA+IDQpIHtcbiAgICAgICAgICB0aGlzLmtleS5rZXlbS0VZX05BTUUuTEVGVF0gKz0gMVxuICAgICAgICAgIGlmKCB0aGlzLm1hc3VbdGhpcy5teUJsb2NrWV1bdGhpcy5teUJsb2NrWC0yXSA9PSAwICkgdGhpcy5teUJsb2NrWCAtPSAxXG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMua2V5LmtleVtLRVlfTkFNRS5SSUdIVF0gPT0gMSB8fCB0aGlzLmtleS5rZXlbS0VZX05BTUUuUklHSFRdID4gNCkge1xuICAgICAgICAgIHRoaXMua2V5LmtleVtLRVlfTkFNRS5SSUdIVF0gKz0gMVxuICAgICAgICAgIGlmKCB0aGlzLm1hc3VbdGhpcy5teUJsb2NrWV1bdGhpcy5teUJsb2NrWCsyXSA9PSAwICkgdGhpcy5teUJsb2NrWCArPSAxXG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMua2V5LmtleVtLRVlfTkFNRS5TUEFDRV0gPT0gMSB8fCB0aGlzLmtleS5rZXlbS0VZX05BTUUuU1BBQ0VdID4gNCkge1xuICAgICAgICAgIHRoaXMua2V5LmtleVtLRVlfTkFNRS5TUEFDRV0gKz0gMVxuICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLmJsb2NrWzJdXG4gICAgICAgICAgdGhpcy5ibG9ja1syXSA9IHRoaXMuYmxvY2tbMV1cbiAgICAgICAgICB0aGlzLmJsb2NrWzFdID0gdGhpcy5ibG9ja1swXVxuICAgICAgICAgIHRoaXMuYmxvY2tbMF0gPSBpXG4gICAgICAgIH1cbiAgICAgICAgLy/jgr/jg4Pjg5fjgafjga7mk43kvZxcbiAgICAgICAgaWYodGhpcy50YXBLZXlbMF0gPT0gMSB8fCB0aGlzLnRhcEtleVswXSA+IDgpIHtcbiAgICAgICAgICBpZih0aGlzLm1hc3VbdGhpcy5teUJsb2NrWV1bdGhpcy5teUJsb2NrWC0yXSA9PSAwKSB0aGlzLm15QmxvY2tYIC09IDFcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLnRhcEtleVsyXSA9PSAxIHx8IHRoaXMudGFwS2V5WzJdID4gOCkge1xuICAgICAgICAgIGlmKHRoaXMubWFzdVt0aGlzLm15QmxvY2tZXVt0aGlzLm15QmxvY2tYKzJdID09IDApIHRoaXMubXlCbG9ja1ggKz0gMVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMudGFwS2V5WzNdID09IDEgfHwgdGhpcy50YXBLZXlbM10gPiA4KSB7IC8v44OW44Ot44OD44Kv44Gu5YWl44KM5pu/44GIXG4gICAgICAgICAgY29uc3QgaSA9IHRoaXMuYmxvY2tbMl1cbiAgICAgICAgICB0aGlzLmJsb2NrWzJdID0gdGhpcy5ibG9ja1sxXVxuICAgICAgICAgIHRoaXMuYmxvY2tbMV0gPSB0aGlzLmJsb2NrWzBdXG4gICAgICAgICAgdGhpcy5ibG9ja1swXSA9IGlcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYoIHRoaXMuZ2FtZVRpbWUgJSB0aGlzLmRyb3BTcGQgPT0gMCB8fCB0aGlzLmtleS5rZXlbS0VZX05BTUUuRE9XTl0gPiAwIHx8IHRoaXMudGFwS2V5WzFdID4gMSApIHtcbiAgICAgICAgICBpZiggdGhpcy5tYXN1W3RoaXMubXlCbG9ja1krMV1bdGhpcy5teUJsb2NrWC0xXSArXG4gICAgICAgICAgICAgIHRoaXMubWFzdVt0aGlzLm15QmxvY2tZKzFdW3RoaXMubXlCbG9ja1hdICtcbiAgICAgICAgICAgICAgdGhpcy5tYXN1W3RoaXMubXlCbG9ja1krMV1bdGhpcy5teUJsb2NrWCsxXSA9PSAwICkge1xuICAgICAgICAgICAgICAgIHRoaXMubXlCbG9ja1kgKz0gMSAvL+S4i+OBq+S9leOCguOBquOBkeOCjOOBsOiQveOBqOOBmVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+WLleOBi+OBquOBj+OBquOBo+OBn+OCiW1hc3XphY3liJfjgavmm7jjgY3ovrzjgpPjgafmrKHjga7jg5Xjgqfjg7zjgrrjgbhcbiAgICAgICAgICAgIHRoaXMubWFzdVt0aGlzLm15QmxvY2tZXVt0aGlzLm15QmxvY2tYLTFdID0gdGhpcy5ibG9ja1swXVxuICAgICAgICAgICAgdGhpcy5tYXN1W3RoaXMubXlCbG9ja1ldW3RoaXMubXlCbG9ja1hdID0gdGhpcy5ibG9ja1sxXVxuICAgICAgICAgICAgdGhpcy5tYXN1W3RoaXMubXlCbG9ja1ldW3RoaXMubXlCbG9ja1grMV0gPSB0aGlzLmJsb2NrWzJdXG4gICAgICAgICAgICB0aGlzLnJlbnNhID0gMVxuICAgICAgICAgICAgdGhpcy5nYW1lUHJvYyA9IDFcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTogLy/jg5fjg63jg4Pjgq/jga7okL3kuIvlh6bnkIZcbiAgICAgICAgbGV0IGMgPSAwIC8v6JC944Go44GX44Gf44OW44Ot44OD44Kv44GM44GC44KL44GL44Gp44GG44GL44CA44OB44Kn44OD44Kv55SoXG4gICAgICAgIGZvcihsZXQgeT0xMDsgeT49MTsgeS0tKSB7IC8v44CQ6YeN6KaB44CR5LiL44GL44KJ5LiK44Gr5ZCR44GL44Gj44Gm6Kq/44G544KL44GT44GoXG4gICAgICAgICAgZm9yKGxldCB4PTE7IHg8PTc7IHgrKykge1xuICAgICAgICAgICAgaWYoIHRoaXMubWFzdVt5XVt4XSA+IDAgJiYgdGhpcy5tYXN1W3krMV1beF0gPT0gMCApIHtcbiAgICAgICAgICAgICAgdGhpcy5tYXN1W3krMV1beF0gPSB0aGlzLm1hc3VbeV1beF1cbiAgICAgICAgICAgICAgdGhpcy5tYXN1W3ldW3hdID0gMFxuICAgICAgICAgICAgICBjID0gMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZihjID09IDApIHRoaXMuZ2FtZVByb2MgPSAyIC8v5YWo44Gm6JC944Go44GX44Gf44KJ5qyh44Gu44OV44Kn44O844K644G4XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6IC8v44OW44Ot44OD44Kv44GM5o+D44Gj44Gf44GL44Gu5Yik5a6aXG4gICAgICAgIGZvcihsZXQgeT0xOyB5PD0xMTsgeSsrKSB7XG4gICAgICAgICAgZm9yKGxldCB4PTE7IHg8PTc7IHgrKykge1xuICAgICAgICAgICAgY29uc3QgYyA9IHRoaXMubWFzdVt5XVt4XVxuICAgICAgICAgICAgaWYoYyA+IDApIHtcbiAgICAgICAgICAgICAgaWYoYyA9PSB0aGlzLm1hc3VbeS0xXVt4IF0gJiYgYyA9PSB0aGlzLm1hc3VbeSsxXVt4IF0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtlc3VbeV1beF0gPSAxXG4gICAgICAgICAgICAgICAgdGhpcy5rZXN1W3ktMV1beCBdID0gMVxuICAgICAgICAgICAgICAgIHRoaXMua2VzdVt5KzFdW3ggXSA9IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZihjID09IHRoaXMubWFzdVt5IF1beC0xXSAmJiBjID09IHRoaXMubWFzdVt5IF1beCsxXSkge1xuICAgICAgICAgICAgICAgIHRoaXMua2VzdVt5XVt4XSA9IDFcbiAgICAgICAgICAgICAgICB0aGlzLmtlc3VbeV1beC0xXSA9IDFcbiAgICAgICAgICAgICAgICB0aGlzLmtlc3VbeV1beCsxXSA9IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZihjID09IHRoaXMubWFzdVt5LTFdW3grMV0gJiYgYyA9PSB0aGlzLm1hc3VbeSsxXVt4LTFdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXN1W3ldW3hdID0gMVxuICAgICAgICAgICAgICAgIHRoaXMua2VzdVt5LTFdW3grMV0gPSAxXG4gICAgICAgICAgICAgICAgdGhpcy5rZXN1W3krMV1beC0xXSA9IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZihjID09IHRoaXMubWFzdVt5LTFdW3gtMV0gJiYgYyA9PSB0aGlzLm1hc3VbeSsxXVt4KzFdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXN1W3ldW3hdID0gMVxuICAgICAgICAgICAgICAgIHRoaXMua2VzdVt5LTFdW3gtMV0gPSAxXG4gICAgICAgICAgICAgICAgdGhpcy5rZXN1W3krMV1beCsxXSA9IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgbiA9IDAgLy8g44Gd44KN44Gj44Gf44OW44Ot44OD44Kv44Gu5pWw44KS44Kr44Km44Oz44OIXG4gICAgICAgIGZvcihsZXQgeT0xOyB5PD0xMTsgeSsrKSB7XG4gICAgICAgICAgZm9yKGxldCB4PTE7IHg8PTc7IHgrKykge1xuICAgICAgICAgICAgaWYodGhpcy5rZXN1W3ldW3hdID09IDEpIHtcbiAgICAgICAgICAgICAgbiArPSAxXG4gICAgICAgICAgICAgIHRoaXMuc2V0RWZmZWN0KDgwKngsIDgwKnkpIC8v44Ko44OV44Kn44Kv44OIXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmKG4gPiAwKXtcbiAgICAgICAgICB0aGlzLnNlLnBsYXlTRSgxKVxuICAgICAgICAgIGlmKCB0aGlzLnJlbnNhID09IDEgJiYgdGhpcy5kcm9wU3BkID4gNSApIHRoaXMuZHJvcFNwZCAtPSAxIC8v5raI44GZ44GU44Go44Gr6JC95LiL44K544OU44O844OJ44KS5LiK44GS44KLXG4gICAgICAgICAgdGhpcy5wb2ludHMgPSA1MCAqIG4gKiB0aGlzLnJlbnNhIC8v5Z+65pys54K55pWw44Gv5raI44GX44Gf5pWwIHggNTBcbiAgICAgICAgICB0aGlzLnNjb3JlICs9IHRoaXMucG9pbnRzXG4gICAgICAgICAgaWYodGhpcy5zY29yZSA+IHRoaXMuaGlzY28pIHRoaXMuaGlzY28gPSB0aGlzLnNjb3JlXG4gICAgICAgICAgdGhpcy5leHRlbmQgPSAwXG4gICAgICAgICAgaWYobiAlIDUgPT0gMCkgdGhpcy5leHRlbmQgPSAzMDAgLy8144Gu5YCN5pWw44Gu5YCL5pWw44KS5raI44GZ44Go44K/44Kk44Og44GM5aKX44GI44KLXG4gICAgICAgICAgdGhpcy5nYW1lUHJvYyA9IHRoaXMuZXh0ZW5kXG4gICAgICAgICAgdGhpcy5yZW5zYSA9IHRoaXMucmVuc2EgKiAyIC8v6YCj6Y6W44GX44Gf5pmC44CB5b6X54K544GM5YCN44CF44Gr5aKX44GI44KLXG4gICAgICAgICAgdGhpcy5lZnRpbWUgPSAwXG4gICAgICAgICAgdGhpcy5nYW1lUHJvYyA9IDMgLy/mtojjgZnlh6bnkIbjgbhcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm15QmxvY2tYID0gNCAvL3jluqfmqJlcbiAgICAgICAgICB0aGlzLm15QmxvY2tZID0gMSAvL3nluqfmqJlcbiAgICAgICAgICBpZih0aGlzLm1hc3VbdGhpcy5teUJsb2NrWV1bdGhpcy5teUJsb2NrWC0xXSArXG4gICAgICAgICAgICB0aGlzLm1hc3VbdGhpcy5teUJsb2NrWV1bdGhpcy5teUJsb2NrWF0gK1xuICAgICAgICAgICAgdGhpcy5tYXN1W3RoaXMubXlCbG9ja1ldW3RoaXMubXlCbG9ja1grMV0gPiAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiAwIC8v44OW44Ot44OD44Kv44GM5pyA5LiK5q6144Gr44GC44KLXG4gICAgICAgICAgfVxuICAgICAgICAgIC8v5qyh44Gu44OW44Ot44OD44Kv44KS44K744OD44OIXG4gICAgICAgICAgdGhpcy5ibG9ja1swXSA9IHRoaXMuYmxvY2tbM11cbiAgICAgICAgICB0aGlzLmJsb2NrWzFdID0gdGhpcy5ibG9ja1s0XVxuICAgICAgICAgIHRoaXMuYmxvY2tbMl0gPSB0aGlzLmJsb2NrWzVdXG4gICAgICAgICAgbGV0IGMgPSA0IC8v44OW44Ot44OD44Kv44Gu56iu6aGe44KS5rG644KB44KLXG4gICAgICAgICAgaWYodGhpcy5zY29yZSA+IDEwMDAwKSBjID0gNVxuICAgICAgICAgIGlmKHRoaXMuc2NvcmUgPiAyMDAwMCkgYyA9IDZcbiAgICAgICAgICB0aGlzLmJsb2NrWzNdID0gMSArIHJuZChjKVxuICAgICAgICAgIHRoaXMuYmxvY2tbNF0gPSAxICsgcm5kKGMpXG4gICAgICAgICAgdGhpcy5ibG9ja1s1XSA9IDEgKyBybmQoYylcbiAgICAgICAgICB0aGlzLmdhbWVQcm9jID0gMCAvL+WGjeOBs+ODl+ODreODg+OCr+OBruenu+WLleOBuFxuICAgICAgICAgIHRoaXMudG1yID0gMFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDM6XG4gICAgICAgIHRoaXMuZWZ0aW1lICs9IDFcbiAgICAgICAgaWYodGhpcy5lZnRpbWUgPT0gMjApIHtcbiAgICAgICAgICBmb3IobGV0IHk9MTsgeTw9MTE7IHkrKykge1xuICAgICAgICAgICAgZm9yKGxldCB4PTE7IHg8PTc7IHgrKykge1xuICAgICAgICAgICAgICBpZih0aGlzLmtlc3VbeV1beF0gPT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWFzdVt5XVt4XSA9IDBcbiAgICAgICAgICAgICAgICB0aGlzLmtlc3VbeV1beF0gPSAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5nYW1lUHJvYyA9IDEgLy/mtojjgZfjgZ/jgonlho3jgbPjg5fjg63jg4Pjgq/jga7okL3kuIvlh6bnkIbjgbhcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICB0aGlzLmdhbWVUaW1lLS0gLy/jgrLjg7zjg6DmmYLplpPjgpIx44Gk5rib44KJ44GZXG4gICAgcmV0dXJuIHRoaXMuZ2FtZVRpbWVcbiAgfVxuXG4gIHNldEVmZmVjdCh4OiBudW1iZXIsIHk6IG51bWJlcikgey8v44Ko44OV44Kn44Kv44OI44KS44K744OD44OIXG4gICAgdGhpcy5lZmZYW3RoaXMuZWZmTl0gPSB4XG4gICAgdGhpcy5lZmZZW3RoaXMuZWZmTl0gPSB5XG4gICAgdGhpcy5lZmZUW3RoaXMuZWZmTl0gPSAyMFxuICAgIHRoaXMuZWZmTiA9ICh0aGlzLmVmZk4gKyAxKSAlIHRoaXMuRUZGX01BWFxuICB9XG5cbiAgZHJhd0VmZmVjdCgpIHsvL+OCqOODleOCp+OCr+ODiOOCkuaPj+eUu1xuICAgIHRoaXMuZHJhdy5saW5lVygyMClcbiAgICBmb3IobGV0IGk9MDsgaTx0aGlzLkVGRl9NQVg7IGkrKykge1xuICAgICAgaWYodGhpcy5lZmZUW2ldID4gMCkge1xuICAgICAgICB0aGlzLmRyYXcuc2V0QWxwKHRoaXMuZWZmVFtpXSAqIDUpXG4gICAgICAgIHRoaXMuZHJhdy5zQ2lyKHRoaXMuZWZmWFtpXSwgdGhpcy5lZmZZW2ldLCAxMTAgLSB0aGlzLmVmZlRbaV0gKiA1LCB0aGlzLlJBSU5CT1dbKHRoaXMuZWZmVFtpXSswKSAlIDhdKVxuICAgICAgICB0aGlzLmRyYXcuc0Npcih0aGlzLmVmZlhbaV0sIHRoaXMuZWZmWVtpXSwgOTAgLSB0aGlzLmVmZlRbaV0gKiA0LCB0aGlzLlJBSU5CT1dbKHRoaXMuZWZmVFtpXSsxKSAlIDhdKVxuICAgICAgICB0aGlzLmRyYXcuc0Npcih0aGlzLmVmZlhbaV0sIHRoaXMuZWZmWVtpXSwgNzAgLSB0aGlzLmVmZlRbaV0gKiAzLCB0aGlzLlJBSU5CT1dbKHRoaXMuZWZmVFtpXSsyKSAlIDhdKVxuICAgICAgICB0aGlzLmVmZlRbaV0gLT0gMVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmRyYXcuc2V0QWxwKDEwMClcbiAgICB0aGlzLmRyYXcubGluZVcoMSlcbiAgfVxufVxuXG5uZXcgTXlHYW1lKClcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==