// 小さなアニメの管理（時間で動くもの）と「描き直しが要る」の旗。
// DESIGN.md §8.2「何も動いていないときは描き直さない」のための共有部品。
const list = [];
let needs = true;

export const ease = k => 1 - Math.pow(1 - k, 3);

/** 描き直しが必要だと知らせる */
export function dirty() { needs = true; }

/** 描き直しが必要だったか（読んだら旗を下ろす） */
export function takeDirty() { const n = needs; needs = false; return n; }

/** dur 秒かけて step(0→1) を呼ぶ。終わったら done() */
export function anim(dur, step, done) {
  const a = { t: 0, dur, step, done, dead: false };
  list.push(a);
  needs = true;
  return a;
}

/** 途中で止める（done は呼ばない） */
export function cancel(a) { if (a) a.dead = true; }

/** 全部止める */
export function clearAll() { list.length = 0; needs = true; }

/** 毎フレーム呼ぶ */
export function update(dt) {
  if (!list.length) return;
  for (let i = list.length - 1; i >= 0; i--) {
    const a = list[i];
    if (a.dead) { list.splice(i, 1); continue; }
    a.t += dt;
    const k = Math.min(1, a.t / a.dur);
    a.step(k);
    if (k >= 1) {
      const j = list.indexOf(a);
      if (j >= 0) list.splice(j, 1);
      if (a.done) a.done();
    }
  }
  needs = true;
}

/** 何秒か待ってから fn を呼ぶ（アニメと同じ時計で動く）*/
export function after(sec, fn) { return anim(sec, () => {}, fn); }
