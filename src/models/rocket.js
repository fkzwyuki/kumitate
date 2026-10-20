// No.3 ロケット（12部品、★、そと、できたとき＝煙を出して浮き上がる。だいは動かない）
import '../config.js?v=6250ca2';

const WHITE = '#f4f6f8', RED = '#e5483f', BLUE = '#3f7fe0', GRAY = '#8a9099', DARK = '#454a52';

// まど（2つとも同じ形：kind 'window'）。丸い窓のふちと、ふくらんだガラス
const win = (id, y) => ({
  id, kind: 'window', on: ['body'],
  shapes: [
    { type: 'torus', size: [0.27, 0.07], pos: [0, y, 0.8], color: '#c8ccd2', mat: 'metal' },
    { type: 'sphere', half: true, size: [0.25], pos: [0, y, 0.78], rot: [90, 0, 0], color: '#7cc8f0', mat: 'glass' },
  ],
});
// おび（2本とも同じ形：kind 'band'）
const band = (id, y) => ({
  id, kind: 'band', on: ['body'],
  shapes: [{ type: 'torus', size: [0.8, 0.1], pos: [0, y, 0], rot: [90, 0, 0], color: BLUE }],
});
// よこのはね（左右とも同じ形：kind 'fin'）。ひし形
const fin = (id, x) => ({
  id, kind: 'fin', on: ['body'],
  shapes: [{ type: 'rbox', size: [0.8, 0.8, 0.14], pos: [x, 1.65, 0], rot: [0, 0, 45], color: RED, r: 0.05 }],
});

KP.models.push({
  id: 'rocket', no: 3, name: 'ロケット', room: 'soto',
  parts: [
    // 最初に付けられるのは「だい」だけ
    { id: 'stand', on: [],
      shapes: [
        { type: 'rbox', size: [2.6, 0.28, 2.6], pos: [0, 0.14, 0], color: GRAY, r: 0.06 },
        { type: 'cyl', size: [0.85, 0.12], pos: [0, 0.34, 0], color: '#5b616a' },
      ] },
    // ふんしゃこう（広がった筒）
    { id: 'nozzle', on: ['stand'],
      shapes: [{ type: 'cone', size: [0.6, 0.65], pos: [0, 0.725, 0], color: DARK }] },
    // どう（先に付けると、したのふんしゃこうはもう入らない）
    { id: 'body', on: ['stand'], closes: ['nozzle'],
      shapes: [{ type: 'cyl', size: [0.8, 3.0], pos: [0, 2.5, 0], color: WHITE }] },
    // さき（先に付けると、どうに通すおびはもう入らない）
    { id: 'nose', on: ['body'], closes: ['band1', 'band2'],
      shapes: [{ type: 'cone', size: [0.8, 1.3], pos: [0, 4.65, 0], color: RED }] },
    { id: 'antenna', on: ['nose'],
      shapes: [
        { type: 'cyl', size: [0.03, 0.6], pos: [0, 5.55, 0], color: '#c8ccd2' },
        { type: 'sphere', size: [0.1], pos: [0, 5.9, 0], color: '#ffd23f' },
      ] },
    fin('finL', -1.05), fin('finR', 1.05),
    // 正面のはね（ほかの2枚とは向きがちがうので、別の部品。色もちがう）
    { id: 'finFront', on: ['body'],
      shapes: [{ type: 'rbox', size: [0.14, 0.8, 0.8], pos: [0, 1.65, 1.05], rot: [45, 0, 0], color: '#ffd23f', r: 0.05 }] },
    win('win1', 3.25), win('win2', 2.45),
    band('band1', 1.3), band('band2', 3.85),
  ],
  finale: { type: 'launch', stay: ['stand'] },   // だい以外が浮き上がる
});
