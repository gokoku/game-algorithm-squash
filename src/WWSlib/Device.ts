//端末の種類

class Device {
  public PT_PC		= 0;
  public PT_iOS		= 1;
  public PT_Android	= 2;
  public PT_Kindle	= 3;
  constructor(private _type: number) {}
  get type(): number { return this._type; }
  set type(type: number) { this._type = type; }
}

export  const device	= new Device(0);
