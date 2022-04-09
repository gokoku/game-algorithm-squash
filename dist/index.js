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
        this.masu = [
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, 0, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, 0, 0, 0, 0, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1]
        ];
        this.kesu = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.block = [1, 2, 3];
        this.myBlockX = 0;
        this.myBlockY = 0;
        this.dropSpd = 0;
        this.gameProc = 0;
        this.gameTime = 0;
    }
    setup() {
        this.setFPS(15);
        this.canvas.canvasSize(960, 1200);
        this.draw.loadImg(0, 'image3/bg.png');
        const BLOCK = ["tako", "wakame", "kurage", "sakana", "uni", "ika"];
        for (let i = 0; i < 6; i++) {
            this.draw.loadImg(i + 1, `image3/${BLOCK[i]}.png`);
        }
        this.draw.loadImg(7, 'image3/shirushi.png');
        this.initVar();
    }
    mainloop() {
        this.drawPzl();
        this.procPzl();
    }
    initVar() {
        this.myBlockX = 4;
        this.myBlockY = 1;
        this.dropSpd = 90;
    }
    drawPzl() {
        this.draw.drawImg(0, 0, 0);
        for (let y = 1; y <= 11; y++) {
            for (let x = 1; x <= 7; x++) {
                if (this.masu[y][x] > 0) {
                    this.draw.drawImgC(this.masu[y][x], x * 80, y * 80);
                }
                if (this.kesu[y][x] == 1) {
                    this.draw.drawImgC(7, x * 80, y * 80);
                }
            }
        }
        this.draw.fTextN(`TIME\n${this.gameTime}`, 800, 280, 70, 60, "white");
        if (this.gameProc == 0) {
            for (let x = -1; x <= 1; x++) {
                this.draw.drawImgC(this.block[1 + x], (this.myBlockX + x) * 80, 80 * this.myBlockY - 2);
            }
        }
    }
    procPzl() {
        switch (this.gameProc) {
            case 0:
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
                if (this.gameTime % this.dropSpd == 0 || this.key.key[Utility_1.KEY_NAME.DOWN] > 0) {
                    if (this.masu[this.myBlockY + 1][this.myBlockX - 1] +
                        this.masu[this.myBlockY + 1][this.myBlockX] +
                        this.masu[this.myBlockY + 1][this.myBlockX + 1] == 0) {
                        this.myBlockY += 1;
                    }
                    else {
                        //動かなくなったらmasu配列に書き込んで次のフェーズへ
                        this.masu[this.myBlockY][this.myBlockX - 1] = this.block[0];
                        this.masu[this.myBlockY][this.myBlockX] = this.block[1];
                        this.masu[this.myBlockY][this.myBlockX + 1] = this.block[2];
                        this.gameProc = 1;
                    }
                }
                break;
            case 1: //プロックの落下処理
                let c = 0;
                for (let y = 10; y >= 1; y--) {
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
            case 2:
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
                        if (this.kesu[y][x] == 1)
                            n += 1;
                    }
                }
                if (n > 0) {
                    this.gameProc = 3; //消す処理へ
                }
                else {
                    this.myBlockX = 4;
                    this.myBlockY = 1;
                    this.block[0] = 1 + (0, Utility_1.rnd)(6);
                    this.block[1] = 1 + (0, Utility_1.rnd)(6);
                    this.block[2] = 1 + (0, Utility_1.rnd)(6);
                    this.gameProc = 0; //再びプロックの移動へ
                }
                break;
            case 3:
                for (let y = 1; y <= 11; y++) {
                    for (let x = 1; x <= 7; x++) {
                        if (this.kesu[y][x] == 1) {
                            this.masu[y][x] = 0;
                            this.kesu[y][x] = 0;
                        }
                    }
                }
                this.gameProc = 1; //消したら再びプロックの落下処理へ
                break;
        }
        this.gameTime++;
    }
}
new MyGame();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMzRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsTUFBTSxRQUFRLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFDM0gsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQy9GLEtBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN2QixDQUFDLEdBQUcsQ0FBQyxHQUFDLEVBQUU7Z0JBQ1IsQ0FBQyxHQUFHLGlCQUFHLEVBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUMsRUFBRSxHQUFDLENBQUMsRUFBRSxFQUFFLEdBQUMsRUFBRSxHQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDO2FBQ3JFO1NBQ0Y7UUFDRCxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDL0QsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLENBQUMsTUFBTSxDQUFD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LHdCQUVDO0FBR0Qsc0RBQXNEO0FBQ3RELFNBQWdCLFNBQVMsQ0FBQyxJQUFZO0lBQ3BDLElBQUksUUFBUSxHQUFXLENBQUM7SUFDeEIsUUFBTyxJQUFJLEVBQUU7UUFDWCxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQUMsTUFBTTtRQUNsQyxLQUFLLE1BQU07WUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lB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QUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztTQUM3QjtRQUNELFNBQUksR0FBRztZQUNMLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUIsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1QixDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVCLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUIsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1QixDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVCLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUIsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1QixDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVCLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUIsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1QixDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVCLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDN0I7UUFDRCxVQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqQixhQUFRLEdBQVcsQ0FBQztRQUNwQixhQUFRLEdBQVcsQ0FBQztRQUNwQixZQUFPLEdBQVcsQ0FBQztRQUVuQixhQUFRLEdBQVcsQ0FBQztRQUNwQixhQUFRLEdBQVcsQ0FBQztJQXZEcEIsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7UUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQztRQUNyQyxNQUFNLEtBQUssR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1FBQ2xFLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxVQUFVLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1NBQ2pEO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLHFCQUFxQixDQUFDO1FBQzNDLElBQUksQ0FBQyxPQUFPLEVBQUU7SUFDaEIsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRTtJQUNoQixDQUFDO0lBd0NELE9BQU87UUFDTCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRTtJQUNuQixDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsSUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdEIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRztvQkFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsRUFBRSxFQUFFLENBQUMsR0FBQyxFQUFFLENBQUM7aUJBQ2hEO2dCQUNELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUc7b0JBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsRUFBRSxFQUFFLENBQUMsR0FBQyxFQUFFLENBQUM7aUJBQ2xDO2FBQ0Y7U0FDRjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUM7UUFDckUsSUFBRyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsRUFBRTtZQUNyQixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBQyxDQUFDLENBQUMsR0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFDLElBQUksQ0FBQyxRQUFRLEdBQUMsQ0FBQyxDQUFDO2FBQzlFO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsT0FBTztRQUNMLFFBQU8sSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUVwQixLQUFLLENBQUM7Z0JBQ0osSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDdkUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUNoQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFBRyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUM7aUJBQ3hFO2dCQUNELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3pFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGtCQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFDakMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDO2lCQUN4RTtnQkFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3hFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUMsQ0FBQyxDQUFDO3dCQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzt3QkFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFHO3dCQUNqRCxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUM7cUJBQ3ZCO3lCQUFNO3dCQUNMLDZCQUE2Qjt3QkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDekQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUN6RCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUM7cUJBQ2xCO2lCQUNGO2dCQUNELE1BQUs7WUFDUCxLQUFLLENBQUMsRUFBRSxXQUFXO2dCQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUNULEtBQUksSUFBSSxDQUFDLEdBQUMsRUFBRSxFQUFFLENBQUMsSUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3ZCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsSUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ3RCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFHOzRCQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDOzRCQUNuQixDQUFDLEdBQUcsQ0FBQzt5QkFDTjtxQkFDRjtpQkFDRjtnQkFDRCxJQUFHLENBQUMsSUFBSSxDQUFDO29CQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFDLGdCQUFnQjtnQkFDN0MsTUFBSztZQUNQLEtBQUssQ0FBQztnQkFDSixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLElBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN2QixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLElBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUN0QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDekIsSUFBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFOzRCQUNSLElBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsRUFBRTtnQ0FDckQsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dDQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsR0FBRyxDQUFDO2dDQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsR0FBRyxDQUFDOzZCQUN2Qjs0QkFDRCxJQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQ0FDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQ0FDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQzs2QkFDdEI7NEJBQ0QsSUFBRyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQ3ZELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQ0FDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0NBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDOzZCQUN4Qjs0QkFDRCxJQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsRUFBRTtnQ0FDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dDQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQ0FDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7NkJBQ3hCO3lCQUNGO3FCQUNGO2lCQUNGO2dCQUNELElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxrQkFBa0I7Z0JBQzVCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsSUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3ZCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsSUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ3RCLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDOzRCQUFFLENBQUMsSUFBSSxDQUFDO3FCQUNoQztpQkFDRjtnQkFDRCxJQUFHLENBQUMsR0FBRyxDQUFDLEVBQUM7b0JBQ1AsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUMsT0FBTztpQkFDMUI7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDO29CQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGlCQUFHLEVBQUMsQ0FBQyxDQUFDO29CQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxpQkFBRyxFQUFDLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsaUJBQUcsRUFBQyxDQUFDLENBQUM7b0JBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFDLFlBQVk7aUJBQy9CO2dCQUNELE1BQUs7WUFDUCxLQUFLLENBQUM7Z0JBQ0osS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDdkIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDdEIsSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTs0QkFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDOzRCQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7eUJBQ3BCO3FCQUNGO2lCQUNGO2dCQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFDLGtCQUFrQjtnQkFDcEMsTUFBSztTQUNSO1FBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRTtJQUNqQixDQUFDO0NBQ0Y7QUFFRCxJQUFJLE1BQU0sRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9XV1MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9DYW52YXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9EZXZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9EcmF3LnRzIiwid2VicGFjazovLy8uL3NyYy9XV1NsaWIvRXZlbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dXU2xpYi9Tb3VuZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV1dTbGliL1V0aWxpdHkudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuSmF2YVNjcmlwdCZIVE1MNSDjgrLjg7zjg6DplovnmbrnlKjjgrfjgrnjg4bjg6BcbumWi+eZuiDjg6/jg7zjg6vjg4njg6/jgqTjg4njgr3jg5Xjg4jjgqbjgqfjgqLmnInpmZDkvJrnpL5cblxu77yI5L2/55So5p2h5Lu277yJXG7mnKzjgr3jg7zjgrnjgrPjg7zjg4njga7okZfkvZzmqKnjga/plovnmbrlhYPjgavjgYLjgorjgb7jgZnjgIJcbuWIqeeUqOOBleOCjOOBn+OBhOaWueOBr+ODoeODvOODq+OBq+OBpuOBiuWVj+OBhOWQiOOCj+OBm+S4i+OBleOBhOOAglxudGhAd3dzZnQuY29tIOODr+ODvOODq+ODieODr+OCpOODieOCveODleODiOOCpuOCp+OCoiDlu6PngKxcbiovXG5cbmltcG9ydCB7IGludCwgbG9nIH0gZnJvbSAnLi9XV1NsaWIvVXRpbGl0eSdcbmltcG9ydCB7IFRvdWNoLCBLZXksIEFjY30gZnJvbSBcIi4vV1dTbGliL0V2ZW50XCJcbmltcG9ydCB7IENXSURUSCwgQ0hFSUdIVCwgQ2FudmFzLCBTQ0FMRSB9IGZyb20gXCIuL1dXU2xpYi9DYW52YXNcIlxuaW1wb3J0IHsgRHJhdyB9IGZyb20gXCIuL1dXU2xpYi9EcmF3XCJcbmltcG9ydCB7IFNFIH0gZnJvbSAnLi9XV1NsaWIvU291bmQnXG5pbXBvcnQgeyBEZXZpY2UsIFBUX0FuZHJvaWQsIFBUX2lPUywgUFRfS2luZGxlIH0gZnJvbSAnLi9XV1NsaWIvRGV2aWNlJ1xuLy8gLS0tLS0tLS0tLS0tLeWkieaVsC0tLS0tLS0tLS0tLS1cbmV4cG9ydCBjb25zdCAgU1lTX1ZFUiA9IFwiVmVyLjIwMjAxMTExXCJcbmV4cG9ydCBsZXQgIERFQlVHID0gZmFsc2VcblxuXG4vL+WHpueQhuOBrumAsuihjOOCkueuoeeQhuOBmeOCi1xuLy8gbWFpbl9pZHgg44Gu5YCkXG4vLyAgIDA6IOWIneacn+WMllxuLy8gICAxOiDjgrvjg7zjg5bjgafjgY3jgarjgYTorablkYpcbi8vICAgMjog44Oh44Kk44Oz5Yem55CGXG5sZXQgbWFpbl9pZHggPSAwXG5sZXQgbWFpbl90bXIgPSAwXG5sZXQgc3RvcF9mbGcgPSAwIC8vIOODoeOCpOODs+WHpueQhuOBruS4gOaZguWBnOatolxuY29uc3QgTlVBID0gbmF2aWdhdG9yLnVzZXJBZ2VudDsvL+apn+eoruWIpOWumlxuY29uc3Qgc3VwcG9ydFRvdWNoID0gJ29udG91Y2hlbmQnIGluIGRvY3VtZW50Oy8v44K/44OD44OB44Kk44OZ44Oz44OI44GM5L2/44GI44KL44GL77yfXG5cbi8v44Ot44O844Kr44Or44K544OI44Os44O844K4XG5jb25zdCBMU19LRVlOQU1FID0gXCJTQVZFREFUQVwiOy8va2V5TmFtZSDku7vmhI/jgavlpInmm7Tlj69cbi8v5L+d5a2Y44Gn44GN44KL44GL5Yik5a6a44GX44CB44Gn44GN44Gq44GE5aC05ZCI44Gr6K2m5ZGK44KS5Ye644GZ44CA5YW35L2T55qE44Gr44GvIGlPUyBTYWZhcmkg44OX44Op44Kk44OZ44O844OI44OW44Op44Km44K644GMT07vvIjkv53lrZjjgafjgY3jgarjgYTvvInnirbmhYvjgavorablkYrjgpLlh7rjgZlcbmxldCBDSEVDS19MUyA9IGZhbHNlO1xuXG4vLyAtLS0tLS0tLS0tLS0t44Oq44Ki44Or44K/44Kk44Og5Yem55CGLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1NUyB7XG4gIGFic3RyYWN0IHNldHVwKCk6IHZvaWRcbiAgYWJzdHJhY3QgbWFpbmxvb3AoKTogdm9pZFxuXG4gIHB1YmxpYyBjYW52YXM6IENhbnZhc1xuICBwdWJsaWMgZHJhdzogRHJhd1xuICBwdWJsaWMgdG91Y2g6IFRvdWNoXG4gIHB1YmxpYyBrZXk6IEtleVxuICBwdWJsaWMgc2U6IFNFXG4gIHB1YmxpYyBkZXZpY2U6IERldmljZVxuICBwdWJsaWMgYWNjOiBBY2NcbiAgcHVibGljIGZyYW1lU2VjOiBudW1iZXJcbiAgLy8g44OV44Os44O844Og44Os44O844OIIGZyYW1lcyAvIHNlY29uZFxuICBwcml2YXRlIEZQUyA9IDMwXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInZpc2liaWxpdHljaGFuZ2VcIiwgdGhpcy52Y1Byb2MuYmluZCh0aGlzKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgdGhpcy53d3NTeXNJbml0LmJpbmQodGhpcykpXG4gICAgdGhpcy5jYW52YXMgPSBuZXcgQ2FudmFzKClcbiAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpXG4gICAgdGhpcy5zZSA9IG5ldyBTRSgpXG4gICAgdGhpcy50b3VjaCA9IG5ldyBUb3VjaCh0aGlzLnNlKVxuICAgIHRoaXMua2V5ID0gbmV3IEtleSh0aGlzLnNlKVxuICAgIHRoaXMuZGV2aWNlID0gbmV3IERldmljZSgpXG4gICAgdGhpcy5hY2MgPSBuZXcgQWNjKHRoaXMuZGV2aWNlKVxuICAgIHRoaXMuZnJhbWVTZWMgPSBpbnQoMTAwMCAvIHRoaXMuRlBTKVxuICB9XG5cbiAgc2V0RlBTKGZwczogbnVtYmVyKSB7XG4gICAgdGhpcy5GUFMgPSBmcHNcbiAgICB0aGlzLmZyYW1lU2VjID0gaW50KDEwMDAgLyB0aGlzLkZQUylcbiAgfVxuXG4gIHd3c1N5c01haW4oKTogdm9pZCB7XG5cbiAgICBsZXQgc3RpbWUgPSBEYXRlLm5vdygpXG4gICAgLy/jg5bjg6njgqbjgrbjga7jgrXjgqTjgrrjgYzlpInljJbjgZfjgZ/jgYvvvJ/vvIjjgrnjg57jg5vjgarjgonmjIHjgaHmlrnjgpLlpInjgYjjgZ/jgYvjgIDnuKbmjIHjgaHih5TmqKrmjIHjgaHvvIlcbiAgICBpZih0aGlzLmNhbnZhcy5iYWtXICE9IHdpbmRvdy5pbm5lcldpZHRoIHx8IHRoaXMuY2FudmFzLmJha0ggIT0gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICB0aGlzLmNhbnZhcy5pbml0Q2FudmFzKClcbiAgICAgIGxvZyhcImNhbnZhcyBzaXplIGNoYW5nZWQgXCIgKyB0aGlzLmNhbnZhcy5iYWtXICsgXCJ4XCIgKyB0aGlzLmNhbnZhcy5iYWtIKTtcbiAgICB9XG5cbiAgICBtYWluX3RtciArK1xuXG4gICAgc3dpdGNoKG1haW5faWR4KSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHRoaXMuc2V0dXAoKVxuICAgICAgICB0aGlzLmtleS5jbHIoKVxuICAgICAgICBtYWluX2lkeCA9IDJcbiAgICAgICAgaWYoQ0hFQ0tfTFMgPT0gdHJ1ZSkge1xuICAgICAgICAgIHRyeSB7bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJfc2F2ZV90ZXN0XCIsIFwidGVzdGRhdGFcIil9IGNhdGNoKGUpIHsgbWFpbl9pZHggPSAxIH1cbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCB4ID0gaW50KENXSURUSCAvIDIpXG4gICAgICAgIGxldCB5ID0gaW50KENIRUlHSFQgLyA2KVxuICAgICAgICBsZXQgZnMgPSBpbnQoQ0hFSUdIVCAvIDE2KVxuICAgICAgICB0aGlzLmRyYXcuZmlsbChcImJsYWNrXCIpXG4gICAgICAgIHRoaXMuZHJhdy5mVGV4dChcIuKAu+OCu+ODvOODluODh+ODvOOCv+OBjOS/neWtmOOBleOCjOOBvuOBm+OCk+KAu1wiLCB4LCB5LzIsIGZzLCBcInllbGxvd1wiKTtcbiAgICAgICAgdGhpcy5kcmF3LmZUZXh0TihcImlPU+err+acq+OCkuOBiuS9v+OBhOOBruWgtOWQiOOBr1xcblNhZmFyaeOBruODl+ODqeOCpOODmeODvOODiOODluODqeOCpuOCulxcbuOCkuOCquODleOBq+OBl+OBpui1t+WLleOBl+OBpuS4i+OBleOBhOOAglwiLCB4LCB5KjIsIHksIGZzLCBcInllbGxvd1wiKTtcbiAgICAgICAgdGhpcy5kcmF3LmZUZXh0TihcIuOBneOBruS7luOBruapn+eoru+8iOODluODqeOCpuOCtu+8ieOBp+OBr1xcbuODreODvOOCq+ODq+OCueODiOODrOODvOOCuOOBuOOBruS/neWtmOOCklxcbuioseWPr+OBmeOCi+ioreWumuOBq+OBl+OBpuS4i+OBleOBhOOAglwiLCB4LCB5KjQsIHksIGZzLCBcInllbGxvd1wiKTtcbiAgICAgICAgdGhpcy5kcmF3LmZUZXh0KFwi44GT44Gu44G+44G+57aa44GR44KL44Gr44Gv55S76Z2i44KS44K/44OD44OXXCIsIHgsIHkqNS41LCBmcywgXCJsaW1lXCIpO1xuICAgICAgICBpZih0aGlzLnRvdWNoLnRhcEMgIT0gMCkgbWFpbl9pZHggPSAyO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAyOiAvL+ODoeOCpOODs+WHpueQhlxuICAgICAgICBpZihzdG9wX2ZsZyA9PSAwKSB7XG4gICAgICAgICAgdGhpcy5tYWlubG9vcCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5rZXkuY2xyKClcbiAgICAgICAgICBtYWluX3Rtci0tXG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5zZS53YWl0X3NlID4gMCkgdGhpcy5zZS53YWl0X3NlLS1cbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6IGJyZWFrXG4gICAgfVxuICAgIHZhciBwdGltZSA9IERhdGUubm93KCkgLSBzdGltZVxuICAgIGlmKHB0aW1lIDwgMCkgcHRpbWUgPSAwXG4gICAgaWYocHRpbWUgPiB0aGlzLmZyYW1lU2VjKSBwdGltZSA9IGludChwdGltZSAvIHRoaXMuZnJhbWVTZWMpICogdGhpcy5mcmFtZVNlY1xuXG4gICAgaWYoREVCVUcpIHsvL+KYheKYheKYheODh+ODkOODg+OCsFxuICAgICAgbGV0IGk6IG51bWJlclxuICAgICAgbGV0IHg6IG51bWJlciA9IDI0MFxuICAgICAgbGV0IHk6IG51bWJlclxuICAgICAgdGhpcy5kcmF3LmZUZXh0KFwi5Yem55CG5pmC6ZaTPVwiKyhwdGltZSksIHgsIDUwLCAxNiwgXCJsaW1lXCIpO1xuICAgICAgdGhpcy5kcmF3LmZUZXh0KGBkZXZpY2VUeXBlPSAke3RoaXMuZGV2aWNlLnR5cGV9YCwgeCwgMTAwLCAxNiwgXCJ5ZWxsb3dcIik7XG4gICAgICAvL3RoaXMuZHJhdy5mVGV4dChgaXNCZ209ICR7aXNCZ219ICgke2JnbU5vfSlgLCB4LCAxNTAsIDE2LCBcInllbGxvd1wiKTtcbiAgICAgIHRoaXMuZHJhdy5mVGV4dChgd2luVz0ke3RoaXMuY2FudmFzLndpbld9IHdpbkg9JHt0aGlzLmNhbnZhcy53aW5IfSBTQ0FMRT0gJHtTQ0FMRX1gLCB4LCAyMDAsIDE2LCBcInllbGxvd1wiKTtcbiAgICAgIHRoaXMuZHJhdy5mVGV4dChgJHttYWluX2lkeH0gOiAke21haW5fdG1yfSAoJHt0aGlzLnRvdWNoLnRhcFh9ICR7dGhpcy50b3VjaC50YXBZfSkgJHt0aGlzLnRvdWNoLnRhcEN9YCwgeCwgMjUwLCAxNiwgXCJjeWFuXCIpXG4gICAgICB0aGlzLmRyYXcuZlRleHQoYOWKoOmAn+W6piAke3RoaXMuYWNjLmFjWH0gOiAke3RoaXMuYWNjLmFjWX0gOiAke3RoaXMuYWNjLmFjWn1gLCB4LCAzMDAsIDE2LCBcInBpbmtcIik7XG4gICAgICBmb3IoaSA9IDA7IGkgPCAyNTY7IGkrKykge1xuICAgICAgICB4ID0gaSUxNlxuICAgICAgICB5ID0gaW50KGkvMTYpO1xuICAgICAgICB0aGlzLmRyYXcuZlRleHQoYCR7dGhpcy5rZXkua2V5W2ldfWAsIDE1KzMwKngsIDE1KzMwKnksIDEyLCBcIndoaXRlXCIpXG4gICAgICB9XG4gICAgfVxuICAgIHNldFRpbWVvdXQodGhpcy53d3NTeXNNYWluLmJpbmQodGhpcyksIHRoaXMuZnJhbWVTZWMgLSBwdGltZSlcbiAgfVxuXG4gIHd3c1N5c0luaXQoKSB7XG4gICAgdGhpcy5jYW52YXMuaW5pdENhbnZhcygpXG4gICAgaWYoIE5VQS5pbmRleE9mKCdBbmRyb2lkJykgPiAwICkge1xuICAgICAgdGhpcy5kZXZpY2UudHlwZSA9IFBUX0FuZHJvaWQ7XG4gICAgfVxuICAgIGVsc2UgaWYoIE5VQS5pbmRleE9mKCdpUGhvbmUnKSA+IDAgfHwgTlVBLmluZGV4T2YoJ2lQb2QnKSA+IDAgfHwgTlVBLmluZGV4T2YoJ2lQYWQnKSA+IDAgKSB7XG4gICAgICB0aGlzLmRldmljZS50eXBlID0gUFRfaU9TO1xuICAgICAgd2luZG93LnNjcm9sbFRvKDAsMSk7Ly9pUGhvbmXjga5VUkzjg5Djg7zjgpLmtojjgZnkvY3nva7jgatcbiAgICB9XG4gICAgZWxzZSBpZiggTlVBLmluZGV4T2YoJ1NpbGsnKSA+IDAgKSB7XG4gICAgICB0aGlzLmRldmljZS50eXBlID0gUFRfS2luZGxlO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmtleS5vbi5iaW5kKHRoaXMua2V5KSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMua2V5Lm9mZi5iaW5kKHRoaXMua2V5KSlcblxuICAgIGlmKHN1cHBvcnRUb3VjaCA9PSB0cnVlKSB7XG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy50b3VjaC5zdGFydC5iaW5kKHRoaXMudG91Y2gpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy50b3VjaC50b3VjaE1vdmUuYmluZCh0aGlzLnRvdWNoKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy50b3VjaC5lbmQuYmluZCh0aGlzLnRvdWNoKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hjYW5jZWxcIiwgdGhpcy50b3VjaC5jYW5jZWwuYmluZCh0aGlzLnRvdWNoKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy50b3VjaC5kb3duLmJpbmQodGhpcy50b3VjaCkpXG4gICAgICB0aGlzLmNhbnZhcy5jdnMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLnRvdWNoLm1vdXNlTW92ZS5iaW5kKHRoaXMudG91Y2gpKVxuICAgICAgdGhpcy5jYW52YXMuY3ZzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMudG91Y2gudXAuYmluZCh0aGlzLnRvdWNoKSlcbiAgICAgIHRoaXMuY2FudmFzLmN2cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgdGhpcy50b3VjaC5vdXQuYmluZCh0aGlzLnRvdWNoKSlcbiAgICB9XG4gICAgdGhpcy53d3NTeXNNYWluKClcbiAgfVxuXG4gIHZjUHJvYygpIHtcbiAgICBpZihkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT0gXCJoaWRkZW5cIikge1xuICAgICAgc3RvcF9mbGcgPSAxXG4gICAgICBpZih0aGlzLnNlLmlzQmdtID09IDEpIHtcbiAgICAgICAgdGhpcy5zZS5wYXVzZUJnbSgpXG4gICAgICAgIHRoaXMuc2UuaXNCZ20gPSAyXG4gICAgICB9XG4gICAgfSBlbHNlIGlmKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PSBcInZpc2libGVcIikge1xuICAgICAgc3RvcF9mbGcgPSAwXG4gICAgICBpZih0aGlzLnNlLmlzQmdtID09IDIpIHtcbiAgICAgICAgdGhpcy5zZS5wbGF5QmdtKHRoaXMuc2UuYmdtTm8pXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge2ludCwgbG9nfSBmcm9tIFwiLi9VdGlsaXR5XCJcblxuLy8gLS0tLS0tLS0tLS0tLeaPj+eUu+mdoijjgq3jg6Pjg7Pjg5DjgrkpLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGxldCBDV0lEVEggPSA4MDBcbmV4cG9ydCBsZXQgQ0hFSUdIVCA9IDYwMFxuZXhwb3J0IGxldCBTQ0FMRSA9IDEuMCAvLyDjgrnjgrHjg7zjg6vlgKToqK3lrpor44K/44OD44OX5L2N572u6KiI566X55SoXG5leHBvcnQgY2xhc3MgQ2FudmFzIHtcblxuICBwdWJsaWMgY3ZzOiBIVE1MQ2FudmFzRWxlbWVudFxuICBwdWJsaWMgYmc6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGxcbiAgcHVibGljIHdpblc6IG51bWJlclxuICBwdWJsaWMgd2luSDogbnVtYmVyXG4gIHB1YmxpYyBiYWtXOiBudW1iZXJcbiAgcHVibGljIGJha0g6IG51bWJlclxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY3ZzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnRcbiAgICB0aGlzLmJnID0gdGhpcy5jdnMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgdGhpcy53aW5XID0gMFxuICAgIHRoaXMud2luSCA9IDBcbiAgICB0aGlzLmJha1cgPSAwXG4gICAgdGhpcy5iYWtIID0gMFxuICB9XG4gIGluaXRDYW52YXMoKSB7XG4gICAgdGhpcy53aW5XID0gd2luZG93LmlubmVyV2lkdGhcbiAgICB0aGlzLndpbkggPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICB0aGlzLmJha1cgPSB0aGlzLndpbldcbiAgICB0aGlzLmJha0ggPSB0aGlzLndpbkhcblxuICAgIGlmKCB0aGlzLndpbkggPCAodGhpcy53aW5XICogQ0hFSUdIVCAvIENXSURUSCkgKSB7XG4gICAgICAvL3dpblcg44KS5q+U546H44Gr5ZCI44KP44Gb44Gm6Kq/5pW0XG4gICAgICB0aGlzLndpblcgPSBpbnQodGhpcy53aW5IICogQ1dJRFRIIC8gQ0hFSUdIVClcbiAgICB9IGVsc2Uge1xuICAgICAgLy93aW5IIOOCkuavlOeOh+OBq+WQiOOCj+OBm+OBpuiqv+aVtFxuICAgICAgdGhpcy53aW5IID0gaW50KHRoaXMud2luVyAqIENIRUlHSFQgLyBDV0lEVEgpXG4gICAgfVxuXG4gICAgdGhpcy5jdnMud2lkdGggPSB0aGlzLndpbldcbiAgICB0aGlzLmN2cy5oZWlnaHQgPSB0aGlzLndpbkhcbiAgICBTQ0FMRSA9IHRoaXMud2luVyAvIENXSURUSFxuXG4gICAgaWYodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLnNjYWxlKFNDQUxFLCBTQ0FMRSlcbiAgICB0aGlzLmJnLnRleHRBbGlnbiA9IFwiY2VudGVyXCJcbiAgICB0aGlzLmJnLnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCJcblxuICAgIC8vbG9nKGB3aWR0aDogJHt0aGlzLndpbld9IGhlaWdodDoke3RoaXMud2luSH0gc2NhbGU6JHtTQ0FMRX1gKVxuICAgIC8vbG9nKGBpbm5lciB3aWR0aDogJHt3aW5kb3cuaW5uZXJXaWR0aH0gaW5uZXIgaGVpZ2h0OiR7d2luZG93LmlubmVySGVpZ2h0fWApXG4gIH1cblxuICBjYW52YXNTaXplKHc6IG51bWJlciwgaDogbnVtYmVyKSB7XG4gICAgQ1dJRFRIID0gd1xuICAgIENIRUlHSFQgPSBoXG4gICAgdGhpcy5pbml0Q2FudmFzKClcbiAgfVxufVxuIiwiLy/nq6/mnKvjga7nqK7poZ5cbmV4cG9ydCBsZXQgUFRfUENcdFx0PSAwO1xuZXhwb3J0IGxldCBQVF9pT1NcdFx0PSAxO1xuZXhwb3J0IGxldCBQVF9BbmRyb2lkXHQ9IDI7XG5leHBvcnQgbGV0IFBUX0tpbmRsZVx0PSAzO1xuXG5leHBvcnQgY2xhc3MgRGV2aWNlIHtcbiAgcHJpdmF0ZSBfdHlwZTogbnVtYmVyXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3R5cGUgPSBQVF9QQ1xuICB9XG4gIGdldCB0eXBlKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl90eXBlIH1cbiAgc2V0IHR5cGUodHlwZTogbnVtYmVyKSB7IHRoaXMuX3R5cGUgPSB0eXBlIH1cbn1cbiIsImltcG9ydCB7IGludCwgbG9nIH0gZnJvbSBcIi4vVXRpbGl0eVwiXG5pbXBvcnQgeyBDV0lEVEgsIENIRUlHSFQsIENhbnZhcyB9IGZyb20gJy4vQ2FudmFzJ1xuXG5leHBvcnQgY2xhc3MgRHJhdyBleHRlbmRzIENhbnZhc3tcbi8vIC0tLS0tLS0tLS0tLS3nlLvlg4/jga7oqq3jgb/ovrzjgb8tLS0tLS0tLS0tLS0tXG4gIGltZzogSFRNTEltYWdlRWxlbWVudFtdXG4gIGltZ19sb2FkZWQ6IEJvb2xlYW5bXVxuICBsaW5lX3dpZHRoOiBudW1iZXJcblxuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHN1cGVyKClcbiAgICB0aGlzLmltZyA9IG5ldyBBcnJheSgyNTYpXG4gICAgdGhpcy5pbWdfbG9hZGVkID0gbmV3IEFycmF5KDI1NilcbiAgICB0aGlzLmxpbmVfd2lkdGggPSAxXG4gIH1cblxuICBsb2FkSW1nKG46IG51bWJlciwgZmlsZW5hbWU6IHN0cmluZykge1xuICAgIC8vbG9nKFwi55S75YOPXCIgKyBuICsgXCIgXCIgKyBmaWxlbmFtZSArIFwi6Kqt44G/6L6844G/6ZaL5aeLXCIpXG4gICAgdGhpcy5pbWdfbG9hZGVkW25dID0gZmFsc2VcbiAgICB0aGlzLmltZ1tuXSA9IG5ldyBJbWFnZSgpXG4gICAgdGhpcy5pbWdbbl0uc3JjID0gZmlsZW5hbWVcbiAgICB0aGlzLmltZ1tuXS5vbmxvYWQgPSAoKSA9PntcbiAgICAgIC8vbG9nKFwi55S75YOPXCIgKyBuICsgXCIgXCIgKyBmaWxlbmFtZSArIFwi6Kqt44G/6L6844G/5a6M5LqGXCIpXG4gICAgICB0aGlzLmltZ19sb2FkZWRbbl0gPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLeaPj+eUuzEg5Zuz5b2iLS0tLS0tLS0tLS0tLVxuICBzZXRBbHAocGFyOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5iZykgdGhpcy5iZy5nbG9iYWxBbHBoYSA9IHBhci8xMDBcbiAgfVxuXG4gIGNvbG9yUkdCKGNyOiBudW1iZXIsIGNnOiBudW1iZXIsIGNiOiBudW1iZXIpIHtcbiAgICBjciA9IGludChjcilcbiAgICBjZyA9IGludChjZylcbiAgICBjYiA9IGludChjYilcbiAgICByZXR1cm4gKFwicmdiKFwiICsgY3IgKyBcIixcIiArIGNnICsgXCIsXCIgKyBjYiArIFwiKVwiKVxuICB9XG5cbiAgbGluZVcod2lkOiBudW1iZXIpIHsgLy/nt5rjga7lpKrjgZXmjIflrppcbiAgICB0aGlzLmxpbmVfd2lkdGggPSB3aWQgLy/jg5Djg4Pjgq/jgqLjg4Pjg5dcbiAgICBpZih0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcubGluZVdpZHRoID0gd2lkXG4gICAgdGhpcy5iZy5saW5lQ2FwID0gXCJyb3VuZFwiXG4gICAgdGhpcy5iZy5saW5lSm9pbiA9IFwicm91bmRcIlxuICB9XG5cbiAgbGluZSh4MDogbnVtYmVyLCB5MDogbnVtYmVyLCB4MTogbnVtYmVyLCB5MTogbnVtYmVyLCBjb2w6IHN0cmluZykge1xuICAgIGlmKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5zdHJva2VTdHlsZSA9IGNvbFxuICAgIHRoaXMuYmcuYmVnaW5QYXRoKClcbiAgICB0aGlzLmJnLm1vdmVUbyh4MCwgeTApXG4gICAgdGhpcy5iZy5saW5lVG8oeDEsIHkxKVxuICAgIHRoaXMuYmcuc3Ryb2tlKClcbiAgfVxuXG4gIGZpbGwoY29sOiBzdHJpbmcpIHtcbiAgICBpZih0aGlzLmJnKSB0aGlzLmJnLmZpbGxTdHlsZSA9IGNvbFxuICAgIGlmKHRoaXMuYmcpIHRoaXMuYmcuZmlsbFJlY3QoMCwgMCwgQ1dJRFRILCBDSEVJR0hUKVxuICB9XG5cbiAgZlJlY3QoeDpudW1iZXIsIHk6bnVtYmVyLCB3Om51bWJlciwgaDpudW1iZXIsY29sOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5iZyA9PSBudWxsKSByZXR1cm5cbiAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IGNvbFxuICAgIHRoaXMuYmcuZmlsbFJlY3QoeCwgeSwgdywgaClcbiAgfVxuXG4gIHNSZWN0KHg6bnVtYmVyLCB5Om51bWJlciwgdzpudW1iZXIsIGg6bnVtYmVyLGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5zdHJva2VTdHlsZSA9IGNvbFxuICAgIHRoaXMuYmcuc3Ryb2tlUmVjdCh4LCB5LCB3LCBoKVxuICB9XG5cbiAgZkNpcih4Om51bWJlciwgeTpudW1iZXIsIHI6bnVtYmVyLGNvbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgdGhpcy5iZy5maWxsU3R5bGUgPSBjb2xcbiAgICB0aGlzLmJnLmJlZ2luUGF0aCgpXG4gICAgdGhpcy5iZy5hcmMoeCwgeSwgciwgMCwgTWF0aC5QSSoyLCBmYWxzZSlcbiAgICB0aGlzLmJnLmNsb3NlUGF0aCgpXG4gICAgdGhpcy5iZy5maWxsKClcbiAgfVxuXG4gIHNDaXIoeDpudW1iZXIsIHk6bnVtYmVyLCByOm51bWJlcixjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIHRoaXMuYmcuc3Ryb2tlU3R5bGUgPSBjb2xcbiAgICB0aGlzLmJnLmJlZ2luUGF0aCgpXG4gICAgdGhpcy5iZy5hcmMoeCwgeSwgciwgMCwgTWF0aC5QSSoyLCBmYWxzZSlcbiAgICB0aGlzLmJnLmNsb3NlUGF0aCgpXG4gICAgdGhpcy5iZy5zdHJva2UoKVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLeaPj+eUuzIg55S75YOPLS0tLS0tLS0tLS0tLVxuICBkcmF3SW1nKG46IG51bWJlciwgeDogbnVtYmVyLCB5Om51bWJlcikge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIGlmKHRoaXMuaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gICAgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIHgsIHkpXG4gIH1cblxuICBkcmF3SW1nTFIobjogbnVtYmVyLCB4OiBudW1iZXIsIHk6bnVtYmVyKSB7IC8vIOW3puWPs+WPjei7olxuICAgIGlmKHRoaXMuaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gICAgY29uc3QgdyA9IHRoaXMuaW1nW25dLndpZHRoXG4gICAgY29uc3QgaCA9IHRoaXMuaW1nW25dLmhlaWdodFxuICAgIGlmKHRoaXMuYmcpIHtcbiAgICAgIHRoaXMuYmcuc2F2ZSgpXG4gICAgICB0aGlzLmJnLnRyYW5zbGF0ZSh4K3cvMiwgeStoLzIpXG4gICAgICB0aGlzLmJnLnNjYWxlKC0xLCAxKVxuICAgICAgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIC13LzIsIC1oLzIpXG4gICAgICB0aGlzLmJnLnJlc3RvcmUoKVxuICAgIH1cbiAgfVxuXG4gIC8v44K744Oz44K/44Oq44Oz44Kw6KGo56S6XG4gIGRyYXdJbWdDKG46IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICBpZih0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIGlmICh0aGlzLmJnKVxuICAgICAgdGhpcy5iZy5kcmF3SW1hZ2UodGhpcy5pbWdbbl0sIHggLSBpbnQodGhpcy5pbWdbbl0ud2lkdGgvMiksIHkgLSBpbnQodGhpcy5pbWdbbl0uaGVpZ2h0LzIpKVxuICB9XG5cbiAgLy/mi6HlpKfnuK7lsI9cbiAgZHJhd0ltZ1MobjogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpIHtcbiAgICBpZih0aGlzLmltZ19sb2FkZWRbbl0gPT0gZmFsc2UpIHJldHVyblxuICAgIGlmICh0aGlzLmJnKSB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgeCwgeSwgdywgaClcbiAgfVxuICAvL+WIh+OCiuWHuuOBlyArIOaLoeWkp+e4ruWwj1xuICBkcmF3SW1nVFMobjogbnVtYmVyLCBzeDogbnVtYmVyLCBzeTogbnVtYmVyLCBzdzogbnVtYmVyLCBzaDogbnVtYmVyLCBjeDogbnVtYmVyLCBjeTogbnVtYmVyLCBjdzogbnVtYmVyLCBjaDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gICAgaWYgKHRoaXMuYmcpIHtcbiAgICAgIHRoaXMuYmcuZHJhd0ltYWdlKHRoaXMuaW1nW25dLCBzeCwgc3ksIHN3LCBzaCwgY3gsIGN5LCBjdywgY2gpXG4gICAgfVxuICB9XG4gIC8v5Zue6LuiXG4gIGRyYXdJbWdSKG4gOm51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGFyZzogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuaW1nX2xvYWRlZFtuXSA9PSBmYWxzZSkgcmV0dXJuXG4gICAgY29uc3QgdyA9IHRoaXMuaW1nW25dLndpZHRoXG4gICAgY29uc3QgaCA9IHRoaXMuaW1nW25dLmhlaWdodFxuICAgIGlmKHRoaXMuYmcpIHtcbiAgICAgIHRoaXMuYmcuc2F2ZSgpXG4gICAgICB0aGlzLmJnLnRyYW5zbGF0ZSh4K3cvMiwgeStoLzIpXG4gICAgICB0aGlzLmJnLnJvdGF0ZShhcmcpXG4gICAgICB0aGlzLmJnLmRyYXdJbWFnZSh0aGlzLmltZ1tuXSwgLXcvMiwgLWgvMilcbiAgICAgIHRoaXMuYmcucmVzdG9yZSgpXG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLeaPj+eUuzMg5paH5a2XLS0tLS0tLS0tLS0tLVxuICBmVGV4dChzdHI6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIsIHNpejogbnVtYmVyLCBjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnKSB7XG4gICAgICB0aGlzLmJnLmZvbnQgPSBpbnQoc2l6KSArIFwicHggYm9sZCBtb25vc3BhY2VcIlxuICAgICAgdGhpcy5iZy5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgIHRoaXMuYmcuZmlsbFRleHQoc3RyLCB4KzEsIHkrMSlcbiAgICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gY29sXG4gICAgICB0aGlzLmJnLmZpbGxUZXh0KHN0ciwgeCwgeSlcbiAgICB9XG4gIH1cblxuICBmVGV4dE4oc3RyOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyLCBoOiBudW1iZXIsIHNpejogbnVtYmVyLCBjb2w6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmJnID09IG51bGwpIHJldHVyblxuICAgIGNvbnN0IHNuID0gc3RyLnNwbGl0KFwiXFxuXCIpXG4gICAgdGhpcy5iZy5mb250ID0gaW50KHNpeikgKyBcInB4IGJvbGQgbW9ub3NwYWNlXCJcbiAgICBpZihzbi5sZW5ndGggPT0gMSkge1xuICAgICAgaCA9IDBcbiAgICB9IGVsc2Uge1xuICAgICAgeSA9IHkgLSBpbnQoaC8yKVxuICAgICAgaCA9IGludChoIC8gKHNuLmxlbmd0aCAtIDEpKVxuICAgIH1cbiAgICBmb3IoIGxldCBpID0gMDsgaSA8IHNuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmJnLmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgdGhpcy5iZy5maWxsVGV4dChzbltpXSwgeCsxLCB5ICsgaCppICsgMSlcbiAgICAgIHRoaXMuYmcuZmlsbFN0eWxlID0gY29sXG4gICAgICB0aGlzLmJnLmZpbGxUZXh0KHNuW2ldLCB4LCB5ICsgaCppKVxuICAgIH1cbiAgfVxuICBtVGV4dFdpZHRoKHN0cjogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYmcgPT0gbnVsbCkgcmV0dXJuXG4gICAgcmV0dXJuIHRoaXMuYmcubWVhc3VyZVRleHQoc3RyKS53aWR0aFxuICB9XG59XG4iLCJpbXBvcnQgeyBpbnQsIGxvZywgY29kZVRvU3RyIH0gZnJvbSBcIi4vVXRpbGl0eVwiXG5pbXBvcnQgeyBTRSB9IGZyb20gXCIuL1NvdW5kXCJcbmltcG9ydCB7IFNDQUxFIH0gZnJvbSBcIi4vQ2FudmFzXCJcbmltcG9ydCB7IERldmljZSwgUFRfQW5kcm9pZCB9IGZyb20gXCIuL0RldmljZVwiXG5cbi8vIC0tLS0tLS0tLS0g44K/44OD44OX5YWl5YqbIC0tLS0tLS0tLS1cbmV4cG9ydCBjbGFzcyBUb3VjaCB7XG5cdHB1YmxpYyB0YXBYOiBudW1iZXJcblx0cHVibGljIHRhcFk6IG51bWJlclxuXHRwdWJsaWMgdGFwQzogbnVtYmVyXG5cdHByaXZhdGUgX3NlOiBTRVxuXG5cdGNvbnN0cnVjdG9yKHNlOiBTRSkge1xuXHRcdHRoaXMuX3NlID0gc2U7XG5cdFx0dGhpcy50YXBYID0gMDtcblx0XHR0aGlzLnRhcFkgPSAwO1xuXHRcdHRoaXMudGFwQyA9IDA7XG5cdH1cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLeODnuOCpuOCueWFpeWKm+ezuy0tLS0tLS0tLS0tLS0tLS0tLS1cblx0ZG93bihlOiBNb3VzZUV2ZW50KSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOy8v44Kt44Oj44Oz44OQ44K544Gu6YG45oqe77yP44K544Kv44Ot44O844Or562J44KS5oqR5Yi244GZ44KLXG5cdFx0aWYoISBlLnRhcmdldCkgcmV0dXJuXG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblx0XHR2YXIgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHRcdHRoaXMudGFwWCA9IGUuY2xpZW50WC1yZWN0LmxlZnQ7XG5cdFx0dGhpcy50YXBZID0gZS5jbGllbnRZLXJlY3QudG9wO1xuXHRcdHRoaXMudGFwQyA9IDE7XG5cdFx0dGhpcy50cmFuc2Zvcm1YWSgpXG5cdFx0aWYodGhpcy5fc2Uuc25kX2luaXQgPT0gMCkgdGhpcy5fc2UubG9hZFNvdW5kU1Bob25lKCk7Ly/jgJDph43opoHjgJHjgrXjgqbjg7Pjg4njga7oqq3jgb/ovrzjgb9cblx0fVxuXG5cdG1vdXNlTW92ZShlOiBNb3VzZUV2ZW50KSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGlmKCEgZS50YXJnZXQpIHJldHVyblxuXHRcdGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG5cdFx0Y29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHRcdHRoaXMudGFwWCA9IGUuY2xpZW50WC1yZWN0LmxlZnQ7XG5cdFx0dGhpcy50YXBZID0gZS5jbGllbnRZLXJlY3QudG9wO1xuXHRcdHRoaXMudHJhbnNmb3JtWFkoKVxuXHR9XG5cblx0dXAoZTogTW91c2VFdmVudCkgeyB0aGlzLnRhcEMgPSAwOyB9XG5cdG91dChlOiBNb3VzZUV2ZW50KSB7IHRoaXMudGFwQyA9IDA7IH1cblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0t44K/44OD44OX5YWl5Yqb57O7LS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRzdGFydChlOiBUb3VjaEV2ZW50KSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOy8v44Kt44Oj44Oz44OQ44K544Gu6YG45oqe77yP44K544Kv44Ot44O844Or562J44KS5oqR5Yi244GZ44KLXG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblx0XHRjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdHRoaXMudGFwWCA9IGUudG91Y2hlc1swXS5jbGllbnRYLXJlY3QubGVmdDtcblx0XHR0aGlzLnRhcFkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WS1yZWN0LnRvcDtcblx0XHR0aGlzLnRhcEMgPSAxO1xuXHRcdHRoaXMudHJhbnNmb3JtWFkoKTtcblx0XHRpZih0aGlzLl9zZS5zbmRfaW5pdCA9PSAwKSB0aGlzLl9zZS5sb2FkU291bmRTUGhvbmUoKTsvL+OAkOmHjeimgeOAkeOCteOCpuODs+ODieOBruiqreOBv+i+vOOBv1xuXHR9XG5cblx0dG91Y2hNb3ZlKGU6IFRvdWNoRXZlbnQpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblx0XHRjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdHRoaXMudGFwWCA9IGUudG91Y2hlc1swXS5jbGllbnRYLXJlY3QubGVmdDtcblx0XHR0aGlzLnRhcFkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WS1yZWN0LnRvcDtcblx0XHR0aGlzLnRyYW5zZm9ybVhZKCk7XG5cdH1cblxuXHRlbmQoZTogVG91Y2hFdmVudCkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR0aGlzLnRhcEMgPSAwOy8v4oC744Oe44Km44K55pON5L2c44Gn44GvbW91c2VPdXTjgYzjgZPjgozjgavjgarjgotcblx0fVxuXG5cdGNhbmNlbChlOiBUb3VjaEV2ZW50KSB7XG5cdFx0dGhpcy50YXBYID0gLTE7XG5cdFx0dGhpcy50YXBZID0gLTE7XG5cdFx0dGhpcy50YXBDID0gMDtcblx0fVxuXG5cdHRyYW5zZm9ybVhZKCkgey8v5a6f5bqn5qiZ4oaS5Luu5oOz5bqn5qiZ44G444Gu5aSJ5o+bXG5cdFx0dGhpcy50YXBYID0gaW50KHRoaXMudGFwWCAvIFNDQUxFKTtcblx0XHR0aGlzLnRhcFkgPSBpbnQodGhpcy50YXBZIC8gU0NBTEUpO1xuXHR9XG59XG5cblxuLy8gLS0tLS0tLS0tLS0tLeODnuOCpuOCueWFpeWKmy0tLS0tLS0tLS0tLS1cbmV4cG9ydCBjbGFzcyBNb3VzZSB7XG5cdHB1YmxpYyB0YXBYOm51bWJlclxuXHRwdWJsaWMgdGFwWTpudW1iZXJcblx0cHVibGljIHRhcEM6bnVtYmVyXG5cdHByaXZhdGUgX3NlOiBTRVxuXG5cdGNvbnN0cnVjdG9yKHNlOiBTRSkge1xuXHRcdHRoaXMuX3NlID0gc2Vcblx0XHR0aGlzLnRhcEMgPSAwXG5cdFx0dGhpcy50YXBYID0gMFxuXHRcdHRoaXMudGFwWSA9IDBcblx0fVxuXG59XG5cbi8vIC0tLS0tLS0tLS0g5Yqg6YCf5bqm44K744Oz44K144O8IC0tLS0tLS0tLS1cbmV4cG9ydCBjbGFzcyBBY2Mge1xuXHRwdWJsaWMgYWNYID0gMFxuXHRwdWJsaWMgYWNZID0gMFxuXHRwdWJsaWMgYWNaID0gMDtcblx0cHVibGljIGRldmljZTogRGV2aWNlXG5cblx0Y29uc3RydWN0b3IoZGV2aWNlOiBEZXZpY2UpIHtcblx0XHQvL3dpbmRvdy5vbmRldmljZW1vdGlvbiA9IGRldmljZU1vdGlvbjsvL+KYheKYheKYheaXp1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlbW90aW9uXCIsIHRoaXMuZGV2aWNlTW90aW9uKTtcblx0XHR0aGlzLmRldmljZSA9IGRldmljZVxuXHR9XG5cblx0ZGV2aWNlTW90aW9uKGU6IERldmljZU1vdGlvbkV2ZW50KSB7XG5cdFx0dmFyIGFJRzogRGV2aWNlTW90aW9uRXZlbnRBY2NlbGVyYXRpb24gfCBudWxsID0gZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5O1xuXHRcdGlmIChhSUcgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdGlmKGFJRy54KSB0aGlzLmFjWCA9IGludChhSUcueCk7XG5cdFx0aWYoYUlHLnkpIHRoaXMuYWNZID0gaW50KGFJRy55KTtcblx0XHRpZihhSUcueikgdGhpcy5hY1ogPSBpbnQoYUlHLnopO1xuXHRcdGlmKHRoaXMuZGV2aWNlLnR5cGUgPT0gUFRfQW5kcm9pZCkgey8vQW5kcm9pZCDjgaggaU9TIOOBp+ato+iyoOOBjOmAhuOBq+OBquOCi1xuXHRcdFx0dGhpcy5hY1ggPSAtdGhpcy5hY1g7XG5cdFx0XHR0aGlzLmFjWSA9IC10aGlzLmFjWTtcblx0XHRcdHRoaXMuYWNaID0gLXRoaXMuYWNaO1xuXHRcdH1cblx0fVxufVxuXG4vL+OCreODvOWFpeWKm+eUqFxuZXhwb3J0IGNsYXNzIEtleSB7XG5cdHB1YmxpYyBfc2U6IFNFXG5cdHB1YmxpYyBpbmtleTogbnVtYmVyXG5cdHB1YmxpYyBrZXk6IG51bWJlcltdXG5cblx0Y29uc3RydWN0b3Ioc2U6IFNFKSB7XG5cdFx0dGhpcy5pbmtleSA9IDBcblx0XHR0aGlzLmtleSA9IG5ldyBBcnJheSgyNTYpO1xuXHRcdHRoaXMuX3NlID0gc2Vcblx0fVxuXG5cdGNscigpIHtcblx0XHR0aGlzLmlua2V5ID0gMDtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHRoaXMua2V5W2ldID0gMDtcblx0fVxuXG5cdG9uKGU6IEtleWJvYXJkRXZlbnQpIHtcblx0XHQvL2xvZyggYCR7ZS5rZXl9IDogJHtlLmNvZGV9IDogJHtlLmtleUNvZGV9IDogJHtjb2RlVG9TdHIoZS5jb2RlKX1gIClcblxuXHRcdGlmKHRoaXMuX3NlLnNuZF9pbml0ID09IDApIHRoaXMuX3NlLmxvYWRTb3VuZFNQaG9uZSgpOy8v44CQ6YeN6KaB44CR44K144Km44Oz44OJ44Gu6Kqt44G/6L6844G/XG5cdFx0dGhpcy5pbmtleSA9IGNvZGVUb1N0cihlLmNvZGUpXG5cdFx0dGhpcy5rZXlbY29kZVRvU3RyKGUuY29kZSldKytcblx0fVxuXG5cdG9mZihlOiBLZXlib2FyZEV2ZW50KSB7XG5cdFx0dGhpcy5pbmtleSA9IDA7XG5cdFx0dGhpcy5rZXlbY29kZVRvU3RyKGUuY29kZSldID0gMDtcblx0fVxufVxuIiwiaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi9VdGlsaXR5J1xuXG4vLyAtLS0tLS0tLS0tLS0t44K144Km44Oz44OJ5Yi25b6hLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGxldCAgU09VTkRfT04gPSB0cnVlXG5leHBvcnQgY2xhc3MgU0Uge1xuICBwdWJsaWMgd2FpdF9zZTogbnVtYmVyID0gMFxuICBwdWJsaWMgc25kX2luaXQ6IG51bWJlciA9IDBcbiAgc291bmRGaWxlOiBIVE1MQXVkaW9FbGVtZW50W11cbiAgaXNCZ206IG51bWJlclxuICBiZ21ObzogbnVtYmVyXG4gIHNlTm86bnVtYmVyXG5cbiAgc291bmRsb2FkZWQ6IG51bWJlclxuICBzZl9uYW1lOiBzdHJpbmdbXVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8v44K144Km44Oz44OJ44OV44Kh44Kk44Or44KS6Kqt44G/6L6844KT44Gg44GLKOOCueODnuODm+WvvuetlilcbiAgICB0aGlzLndhaXRfc2UgPSAwXG4gICAgdGhpcy5zbmRfaW5pdCA9IDBcbiAgICB0aGlzLnNvdW5kRmlsZSA9IG5ldyBBcnJheSgyNTYpXG4gICAgdGhpcy5pc0JnbSA9IC0xXG4gICAgdGhpcy5iZ21ObyA9IDBcbiAgICB0aGlzLnNlTm8gPSAtMVxuICAgIHRoaXMuc291bmRsb2FkZWQgPSAwIC8v44GE44GP44Gk44OV44Kh44Kk44Or44KS6Kqt44G/6L6844KT44Gg44GLXG4gICAgdGhpcy5zZl9uYW1lID0gbmV3IEFycmF5KDI1NilcbiAgfVxuXG4gIGxvYWRTb3VuZFNQaG9uZSgpIHsvL+OCueODnuODm+OBp+ODleOCoeOCpOODq+OCkuiqreOBv+i+vOOCgFxuICAgIHRyeSB7XG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5zb3VuZGxvYWRlZDsgaSsrKSB7XG4gICAgICAgIHRoaXMuc291bmRGaWxlW2ldID0gbmV3IEF1ZGlvKHRoaXMuc2ZfbmFtZVtpXSlcbiAgICAgICAgdGhpcy5zb3VuZEZpbGVbaV0ubG9hZCgpXG4gICAgICB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgfVxuICAgIHRoaXMuc25kX2luaXQgPSAyIC8v44K544Oe44Ob44Gn44OV44Kh44Kk44Or44KS6Kqt44G/6L6844KT44GgXG4gIH1cblxuICBsb2FkU291bmQobjogbnVtYmVyLCBmaWxlbmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zZl9uYW1lW25dID0gZmlsZW5hbWVcbiAgICB0aGlzLnNvdW5kbG9hZGVkKytcbiAgfVxuXG4gIHBsYXlTRShuOiBudW1iZXIpIHtcbiAgICBpZihTT1VORF9PTiA9PSBmYWxzZSkgcmV0dXJuXG4gICAgaWYodGhpcy5pc0JnbSA9PSAyKSByZXR1cm5cbiAgICBpZih0aGlzLndhaXRfc2UgPT0gMCkge1xuICAgICAgdGhpcy5zZU5vID0gblxuICAgICAgdGhpcy5zb3VuZEZpbGVbbl0uY3VycmVudFRpbWUgPSAwXG4gICAgICB0aGlzLnNvdW5kRmlsZVtuXS5sb29wID0gZmFsc2VcbiAgICAgIHRoaXMuc291bmRGaWxlW25dLnBsYXkoKVxuICAgICAgdGhpcy53YWl0X3NlID0gMyAvL+ODluODqeOCpuOCtuOBq+iyoOiNt+OCkuOBi+OBkeOBquOBhOOCiOOBhuOBq+mAo+e2muOBl+OBpua1geOBleOBquOBhOOCiOOBhuOBq+OBmeOCi1xuICAgIH1cbiAgfVxuXG4gIHBsYXlCZ20objogbnVtYmVyKSB7XG4gICAgaWYoU09VTkRfT04gPT0gZmFsc2UpIHJldHVyblxuICAgIGxvZyhg77yi77yn77ytICR7bn0g5Ye65YqbYClcbiAgICB0aGlzLmJnbU5vID0gblxuICAgIHRoaXMuc291bmRGaWxlW25dLmxvb3AgPSB0cnVlXG4gICAgdGhpcy5zb3VuZEZpbGVbbl0ucGxheSgpXG4gICAgdGhpcy5pc0JnbSA9IDEgLy9CR03lho3nlJ/kuK1cbiAgfVxuXG4gIHBhdXNlQmdtKCkge1xuICAgIHRoaXMuc291bmRGaWxlW3RoaXMuYmdtTm9dLnBhdXNlKClcbiAgICB0aGlzLmlzQmdtID0gMCAvL0JHTeWBnOatouS4rVxuICB9XG5cbiAgc3RvcEJnbSgpIHtcbiAgICB0aGlzLnNvdW5kRmlsZVt0aGlzLmJnbU5vXS5wYXVzZSgpXG4gICAgdGhpcy5zb3VuZEZpbGVbdGhpcy5iZ21Ob10uY3VycmVudFRpbWUgPSAwXG4gICAgdGhpcy5pc0JnbSA9IDAgLy9CR03lgZzmraJcbiAgfVxuXG4gIHJhdGVTbmQocmF0ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5zb3VuZEZpbGVbdGhpcy5iZ21Ob10udm9sdW1lID0gcmF0ZVxuICB9XG59IiwiLy8gLS0tLS0tLS0tLS0tLeWQhOeoruOBrumWouaVsC0tLS0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiBsb2cobXNnOiBzdHJpbmcpIHtcbiAgY29uc29sZS5sb2cobXNnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW50KHZhbDogbnVtYmVyKTogbnVtYmVyIHtcbiAgbGV0IG51bSA9IFN0cmluZyh2YWwpXG4gIHJldHVybiBwYXJzZUludChudW0pIC8v44OX44Op44K544Oe44Kk44OK44K544Gp44Gh44KJ44KC5bCP5pWw6YOo5YiG44KS5YiH44KK5o2o44GmXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHIodmFsOiBudW1iZXIpOiBzdHJpbmcge1xuICByZXR1cm4gU3RyaW5nKHZhbClcbn1cbmV4cG9ydCBmdW5jdGlvbiBybmQobWF4OiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gaW50KE1hdGgucmFuZG9tKCkgKiBtYXgpXG59XG5leHBvcnQgZnVuY3Rpb24gYWJzKHZhbDogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguYWJzKHZhbClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcyhhOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5jb3MoTWF0aC5QSSAqIDIgKiBhIC8gMzYwKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2luKGE6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLnNpbihNYXRoLlBJICogMiAqIGEgLyAzNjApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREaXMoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coeDIgLSB4MSwgMikgKyBNYXRoLnBvdyh5MiAtIHkxLCAyKSlcbn1cblxuXG4vLyAtLS0tLS0tLS0tIOOCreODvOWFpeWKm+OCreODvOOBruODnuODg+ODlOODs+OCsChrZXlDb2RlIOOBjOmdnuaOqOWlqOOBruOBn+OCgSkgLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGNvZGVUb1N0cihjb2RlOiBzdHJpbmcpOiBudW1iZXIge1xuICBsZXQgY2hhckNvZGU6IG51bWJlciA9IDBcbiAgc3dpdGNoKGNvZGUpIHtcbiAgICBjYXNlIFwiS2V5QVwiOiBjaGFyQ29kZSA9IDY1OyBicmVhaztcbiAgICBjYXNlIFwiS2V5QlwiOiBjaGFyQ29kZSA9IDY2OyBicmVhaztcbiAgICBjYXNlIFwiS2V5Q1wiOiBjaGFyQ29kZSA9IDY3OyBicmVhaztcbiAgICBjYXNlIFwiS2V5RFwiOiBjaGFyQ29kZSA9IDY4OyBicmVhaztcbiAgICBjYXNlIFwiS2V5RVwiOiBjaGFyQ29kZSA9IDY5OyBicmVhaztcbiAgICBjYXNlIFwiS2V5RlwiOiBjaGFyQ29kZSA9IDcwOyBicmVhaztcbiAgICBjYXNlIFwiS2V5R1wiOiBjaGFyQ29kZSA9IDcxOyBicmVhaztcbiAgICBjYXNlIFwiS2V5SFwiOiBjaGFyQ29kZSA9IDcyOyBicmVhaztcbiAgICBjYXNlIFwiS2V5SVwiOiBjaGFyQ29kZSA9IDczOyBicmVhaztcbiAgICBjYXNlIFwiS2V5SlwiOiBjaGFyQ29kZSA9IDc0OyBicmVhaztcbiAgICBjYXNlIFwiS2V5S1wiOiBjaGFyQ29kZSA9IDc1OyBicmVhaztcbiAgICBjYXNlIFwiS2V5TFwiOiBjaGFyQ29kZSA9IDc2OyBicmVhaztcbiAgICBjYXNlIFwiS2V5TVwiOiBjaGFyQ29kZSA9IDc3OyBicmVhaztcbiAgICBjYXNlIFwiS2V5TlwiOiBjaGFyQ29kZSA9IDc4OyBicmVhaztcbiAgICBjYXNlIFwiS2V5T1wiOiBjaGFyQ29kZSA9IDc5OyBicmVhaztcbiAgICBjYXNlIFwiS2V5UFwiOiBjaGFyQ29kZSA9IDgwOyBicmVhaztcbiAgICBjYXNlIFwiS2V5UVwiOiBjaGFyQ29kZSA9IDgxOyBicmVhaztcbiAgICBjYXNlIFwiS2V5UlwiOiBjaGFyQ29kZSA9IDgyOyBicmVhaztcbiAgICBjYXNlIFwiS2V5U1wiOiBjaGFyQ29kZSA9IDgzOyBicmVhaztcbiAgICBjYXNlIFwiS2V5VFwiOiBjaGFyQ29kZSA9IDg0OyBicmVhaztcbiAgICBjYXNlIFwiS2V5VVwiOiBjaGFyQ29kZSA9IDg1OyBicmVhaztcbiAgICBjYXNlIFwiS2V5VlwiOiBjaGFyQ29kZSA9IDg2OyBicmVhaztcbiAgICBjYXNlIFwiS2V5V1wiOiBjaGFyQ29kZSA9IDg3OyBicmVhaztcbiAgICBjYXNlIFwiS2V5WFwiOiBjaGFyQ29kZSA9IDg4OyBicmVhaztcbiAgICBjYXNlIFwiS2V5WVwiOiBjaGFyQ29kZSA9IDg5OyBicmVhaztcbiAgICBjYXNlIFwiS2V5WlwiOiBjaGFyQ29kZSA9IDkwOyBicmVhaztcblxuICAgIGNhc2UgXCJTcGFjZVwiOiBjaGFyQ29kZSA9IDMyOyBicmVhaztcbiAgICBjYXNlIFwiQXJyb3dMZWZ0XCI6IGNoYXJDb2RlID0gMzc7IGJyZWFrO1xuICAgIGNhc2UgXCJBcnJvd1VwXCI6IGNoYXJDb2RlID0gMzg7IGJyZWFrO1xuICAgIGNhc2UgXCJBcnJvd1JpZ2h0XCI6IGNoYXJDb2RlID0gMzk7IGJyZWFrO1xuICAgIGNhc2UgXCJBcnJvd0Rvd25cIjogY2hhckNvZGUgPSA0MDsgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIGNoYXJDb2RlXG59XG5cbmV4cG9ydCBjb25zdCBLRVlfTkFNRSA9IHtcblx0XCJFTlRFUlwiIDogMTMsXG5cdFwiU1BBQ0VcIiA6IDMyLFxuXHRcIkxFRlRcIiAgOiAzNyxcblx0XCJVUFwiICAgIDogMzgsXG5cdFwiUklHSFRcIiA6IDM5LFxuXHRcIkRPV05cIiAgOiA0MCxcblx0XCJBXCIgICAgIDogNjUsXG5cdFwiWlwiICAgICA6IDkwLFxuICBcIlJcIiAgICAgOiA4MixcbiAgXCJDXCIgICAgIDogNjdcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBNTVMgfSBmcm9tICcuL1dXUydcbmltcG9ydCB7IGdldERpcywgS0VZX05BTUUsIGxvZywgcm5kLCBpbnQgfSBmcm9tICcuL1dXU2xpYi9VdGlsaXR5J1xuXG5cbmNsYXNzIE15R2FtZSBleHRlbmRzIE1NUyB7XG5cbiAgY29uc3RydWN0b3IoKXtcbiAgICBzdXBlcigpXG4gIH1cblxuICBzZXR1cCgpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZQUygxNSlcbiAgICB0aGlzLmNhbnZhcy5jYW52YXNTaXplKDk2MCwgMTIwMClcbiAgICB0aGlzLmRyYXcubG9hZEltZygwLCAnaW1hZ2UzL2JnLnBuZycpXG4gICAgY29uc3QgQkxPQ0sgPSBbXCJ0YWtvXCIsIFwid2FrYW1lXCIsIFwia3VyYWdlXCIsIFwic2FrYW5hXCIsIFwidW5pXCIsIFwiaWthXCJdXG4gICAgZm9yKGxldCBpPTA7IGk8NjsgaSsrKSB7XG4gICAgICB0aGlzLmRyYXcubG9hZEltZyhpKzEsIGBpbWFnZTMvJHtCTE9DS1tpXX0ucG5nYClcbiAgICB9XG4gICAgdGhpcy5kcmF3LmxvYWRJbWcoNywgJ2ltYWdlMy9zaGlydXNoaS5wbmcnKVxuICAgIHRoaXMuaW5pdFZhcigpXG4gIH1cblxuICBtYWlubG9vcCgpOiB2b2lkIHtcbiAgICB0aGlzLmRyYXdQemwoKVxuICAgIHRoaXMucHJvY1B6bCgpXG4gIH1cblxuICBtYXN1ID0gW1xuICAgIFstMSwtMSwtMSwtMSwtMSwtMSwtMSwtMSwtMV0sXG4gICAgWy0xLCAwLCAwLCAwLCAwLCAwLCAwLCAwLC0xXSxcbiAgICBbLTEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsLTFdLFxuICAgIFstMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwtMV0sXG4gICAgWy0xLCAwLCAwLCAwLCAwLCAwLCAwLCAwLC0xXSxcbiAgICBbLTEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsLTFdLFxuICAgIFstMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwtMV0sXG4gICAgWy0xLCAwLCAwLCAwLCAwLCAwLCAwLCAwLC0xXSxcbiAgICBbLTEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsLTFdLFxuICAgIFstMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwtMV0sXG4gICAgWy0xLCAwLCAwLCAwLCAwLCAwLCAwLCAwLC0xXSxcbiAgICBbLTEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsLTFdLFxuICAgIFstMSwtMSwtMSwtMSwtMSwtMSwtMSwtMSwtMV1cbiAgXVxuICBrZXN1ID0gW1xuICAgIFsgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgWyAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICBbIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgIFsgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgWyAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICBbIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgIFsgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgWyAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICBbIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgIFsgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgWyAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICBbIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgIFsgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1cbiAgXVxuICBibG9jayA9IFsxLCAyLCAzXVxuICBteUJsb2NrWDogbnVtYmVyID0gMFxuICBteUJsb2NrWTogbnVtYmVyID0gMFxuICBkcm9wU3BkOiBudW1iZXIgPSAwXG5cbiAgZ2FtZVByb2M6IG51bWJlciA9IDBcbiAgZ2FtZVRpbWU6IG51bWJlciA9IDBcblxuICBpbml0VmFyKCkge1xuICAgIHRoaXMubXlCbG9ja1ggPSA0XG4gICAgdGhpcy5teUJsb2NrWSA9IDFcbiAgICB0aGlzLmRyb3BTcGQgPSA5MFxuICB9XG5cbiAgZHJhd1B6bCgpIHtcbiAgICB0aGlzLmRyYXcuZHJhd0ltZygwLCAwLCAwKVxuICAgIGZvcihsZXQgeT0xOyB5PD0xMTsgeSsrKSB7XG4gICAgICBmb3IobGV0IHg9MTsgeDw9NzsgeCsrKSB7XG4gICAgICAgIGlmKCB0aGlzLm1hc3VbeV1beF0gPiAwICkge1xuICAgICAgICAgIHRoaXMuZHJhdy5kcmF3SW1nQyh0aGlzLm1hc3VbeV1beF0sIHgqODAsIHkqODApXG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMua2VzdVt5XVt4XSA9PSAxICkge1xuICAgICAgICAgIHRoaXMuZHJhdy5kcmF3SW1nQyg3LCB4KjgwLCB5KjgwKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZHJhdy5mVGV4dE4oYFRJTUVcXG4ke3RoaXMuZ2FtZVRpbWV9YCwgODAwLCAyODAsIDcwLCA2MCwgXCJ3aGl0ZVwiKVxuICAgIGlmKHRoaXMuZ2FtZVByb2MgPT0gMCkge1xuICAgICAgZm9yKGxldCB4PS0xOyB4PD0xOyB4KyspIHtcbiAgICAgICAgdGhpcy5kcmF3LmRyYXdJbWdDKHRoaXMuYmxvY2tbMSt4XSwgKHRoaXMubXlCbG9ja1greCkqODAsIDgwKnRoaXMubXlCbG9ja1ktMilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm9jUHpsKCkge1xuICAgIHN3aXRjaCh0aGlzLmdhbWVQcm9jKSB7XG5cbiAgICAgIGNhc2UgMDpcbiAgICAgICAgaWYoIHRoaXMua2V5LmtleVtLRVlfTkFNRS5MRUZUXSA9PSAxIHx8IHRoaXMua2V5LmtleVtLRVlfTkFNRS5MRUZUXSA+IDQpIHtcbiAgICAgICAgICB0aGlzLmtleS5rZXlbS0VZX05BTUUuTEVGVF0gKz0gMVxuICAgICAgICAgIGlmKCB0aGlzLm1hc3VbdGhpcy5teUJsb2NrWV1bdGhpcy5teUJsb2NrWC0yXSA9PSAwICkgdGhpcy5teUJsb2NrWCAtPSAxXG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMua2V5LmtleVtLRVlfTkFNRS5SSUdIVF0gPT0gMSB8fCB0aGlzLmtleS5rZXlbS0VZX05BTUUuUklHSFRdID4gNCkge1xuICAgICAgICAgIHRoaXMua2V5LmtleVtLRVlfTkFNRS5SSUdIVF0gKz0gMVxuICAgICAgICAgIGlmKCB0aGlzLm1hc3VbdGhpcy5teUJsb2NrWV1bdGhpcy5teUJsb2NrWCsyXSA9PSAwICkgdGhpcy5teUJsb2NrWCArPSAxXG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMuZ2FtZVRpbWUgJSB0aGlzLmRyb3BTcGQgPT0gMCB8fCB0aGlzLmtleS5rZXlbS0VZX05BTUUuRE9XTl0gPiAwKSB7XG4gICAgICAgICAgaWYoIHRoaXMubWFzdVt0aGlzLm15QmxvY2tZKzFdW3RoaXMubXlCbG9ja1gtMV0gK1xuICAgICAgICAgICAgICB0aGlzLm1hc3VbdGhpcy5teUJsb2NrWSsxXVt0aGlzLm15QmxvY2tYXSArXG4gICAgICAgICAgICAgIHRoaXMubWFzdVt0aGlzLm15QmxvY2tZKzFdW3RoaXMubXlCbG9ja1grMV0gPT0gMCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm15QmxvY2tZICs9IDFcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/li5XjgYvjgarjgY/jgarjgaPjgZ/jgoltYXN16YWN5YiX44Gr5pu444GN6L6844KT44Gn5qyh44Gu44OV44Kn44O844K644G4XG4gICAgICAgICAgICB0aGlzLm1hc3VbdGhpcy5teUJsb2NrWV1bdGhpcy5teUJsb2NrWC0xXSA9IHRoaXMuYmxvY2tbMF1cbiAgICAgICAgICAgIHRoaXMubWFzdVt0aGlzLm15QmxvY2tZXVt0aGlzLm15QmxvY2tYXSA9IHRoaXMuYmxvY2tbMV1cbiAgICAgICAgICAgIHRoaXMubWFzdVt0aGlzLm15QmxvY2tZXVt0aGlzLm15QmxvY2tYKzFdID0gdGhpcy5ibG9ja1syXVxuICAgICAgICAgICAgdGhpcy5nYW1lUHJvYyA9IDFcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTogLy/jg5fjg63jg4Pjgq/jga7okL3kuIvlh6bnkIZcbiAgICAgICAgbGV0IGMgPSAwXG4gICAgICAgIGZvcihsZXQgeT0xMDsgeT49MTsgeS0tKSB7XG4gICAgICAgICAgZm9yKGxldCB4PTE7IHg8PTc7IHgrKykge1xuICAgICAgICAgICAgaWYoIHRoaXMubWFzdVt5XVt4XSA+IDAgJiYgdGhpcy5tYXN1W3krMV1beF0gPT0gMCApIHtcbiAgICAgICAgICAgICAgdGhpcy5tYXN1W3krMV1beF0gPSB0aGlzLm1hc3VbeV1beF1cbiAgICAgICAgICAgICAgdGhpcy5tYXN1W3ldW3hdID0gMFxuICAgICAgICAgICAgICBjID0gMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZihjID09IDApIHRoaXMuZ2FtZVByb2MgPSAyIC8v5YWo44Gm6JC944Go44GX44Gf44KJ5qyh44Gu44OV44Kn44O844K644G4XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIGZvcihsZXQgeT0xOyB5PD0xMTsgeSsrKSB7XG4gICAgICAgICAgZm9yKGxldCB4PTE7IHg8PTc7IHgrKykge1xuICAgICAgICAgICAgY29uc3QgYyA9IHRoaXMubWFzdVt5XVt4XVxuICAgICAgICAgICAgaWYoYyA+IDApIHtcbiAgICAgICAgICAgICAgaWYoYyA9PSB0aGlzLm1hc3VbeS0xXVt4IF0gJiYgYyA9PSB0aGlzLm1hc3VbeSsxXVt4IF0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtlc3VbeV1beF0gPSAxXG4gICAgICAgICAgICAgICAgdGhpcy5rZXN1W3ktMV1beCBdID0gMVxuICAgICAgICAgICAgICAgIHRoaXMua2VzdVt5KzFdW3ggXSA9IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZihjID09IHRoaXMubWFzdVt5IF1beC0xXSAmJiBjID09IHRoaXMubWFzdVt5IF1beCsxXSkge1xuICAgICAgICAgICAgICAgIHRoaXMua2VzdVt5XVt4XSA9IDFcbiAgICAgICAgICAgICAgICB0aGlzLmtlc3VbeV1beC0xXSA9IDFcbiAgICAgICAgICAgICAgICB0aGlzLmtlc3VbeV1beCsxXSA9IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZihjID09IHRoaXMubWFzdVt5LTFdW3grMV0gJiYgYyA9PSB0aGlzLm1hc3VbeSsxXVt4LTFdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXN1W3ldW3hdID0gMVxuICAgICAgICAgICAgICAgIHRoaXMua2VzdVt5LTFdW3grMV0gPSAxXG4gICAgICAgICAgICAgICAgdGhpcy5rZXN1W3krMV1beC0xXSA9IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZihjID09IHRoaXMubWFzdVt5LTFdW3gtMV0gJiYgYyA9PSB0aGlzLm1hc3VbeSsxXVt4KzFdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXN1W3ldW3hdID0gMVxuICAgICAgICAgICAgICAgIHRoaXMua2VzdVt5LTFdW3gtMV0gPSAxXG4gICAgICAgICAgICAgICAgdGhpcy5rZXN1W3krMV1beCsxXSA9IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgbiA9IDAgLy8g44Gd44KN44Gj44Gf44OW44Ot44OD44Kv44Gu5pWw44KS44Kr44Km44Oz44OIXG4gICAgICAgIGZvcihsZXQgeT0xOyB5PD0xMTsgeSsrKSB7XG4gICAgICAgICAgZm9yKGxldCB4PTE7IHg8PTc7IHgrKykge1xuICAgICAgICAgICAgaWYodGhpcy5rZXN1W3ldW3hdID09IDEpIG4gKz0gMVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZihuID4gMCl7XG4gICAgICAgICAgdGhpcy5nYW1lUHJvYyA9IDMgLy/mtojjgZnlh6bnkIbjgbhcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm15QmxvY2tYID0gNFxuICAgICAgICAgIHRoaXMubXlCbG9ja1kgPSAxXG4gICAgICAgICAgdGhpcy5ibG9ja1swXSA9IDEgKyBybmQoNilcbiAgICAgICAgICB0aGlzLmJsb2NrWzFdID0gMSArIHJuZCg2KVxuICAgICAgICAgIHRoaXMuYmxvY2tbMl0gPSAxICsgcm5kKDYpXG4gICAgICAgICAgdGhpcy5nYW1lUHJvYyA9IDAgLy/lho3jgbPjg5fjg63jg4Pjgq/jga7np7vli5XjgbhcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAzOlxuICAgICAgICBmb3IobGV0IHk9MTsgeTw9MTE7IHkrKykge1xuICAgICAgICAgIGZvcihsZXQgeD0xOyB4PD03OyB4KyspIHtcbiAgICAgICAgICAgIGlmKHRoaXMua2VzdVt5XVt4XSA9PSAxKSB7XG4gICAgICAgICAgICAgIHRoaXMubWFzdVt5XVt4XSA9IDBcbiAgICAgICAgICAgICAgdGhpcy5rZXN1W3ldW3hdID0gMFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdhbWVQcm9jID0gMSAvL+a2iOOBl+OBn+OCieWGjeOBs+ODl+ODreODg+OCr+OBruiQveS4i+WHpueQhuOBuFxuICAgICAgICBicmVha1xuICAgIH1cbiAgICB0aGlzLmdhbWVUaW1lKytcbiAgfVxufVxuXG5uZXcgTXlHYW1lKClcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==