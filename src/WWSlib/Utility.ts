// -------------各種の関数-------------
export function log(msg: string) {
  console.log(msg)
}

export function int(val: number): number {
  let num = String(val)
  return parseInt(num) //プラスマイナスどちらも小数部分を切り捨て
}

export function str(val: number): string {
  return String(val)
}
export function rnd(max: number): number {
  return Math.floor(Math.random()*max)
}
export function abs(val: number): number {
  return Math.abs(val)
}
