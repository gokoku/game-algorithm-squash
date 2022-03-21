//端末の種類
export let PT_PC		= 0;
export let PT_iOS		= 1;
export let PT_Android	= 2;
export let PT_Kindle	= 3;

export class Device {
  private _type: number
  constructor() {
    this._type = PT_PC
  }
  get type(): number { return this._type }
  set type(type: number) { this._type = type }
}
