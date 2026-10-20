// No.13 トースター（11部品、★、へや、できたとき＝パンがぽんと飛び出す）
// うえのふたを付けると、パンはもう入らない（入れ忘れのわな）。商品名・マークは描かない
import '../config.js?v=6250ca2';

const RED = '#e0524a', SILVER = '#cfd3d8', DARK = '#2b2d30', CRUST = '#c98a3c', CRUMB = '#f7dfa5';

// あし（4本とも同じ形：kind 'foot'）
const foot = (id, x, z) => ({
  id, kind: 'foot', on: ['base'],
  shapes: [{ type: 'cyl', size: [0.12, 0.1], pos: [x, 0.05, z], color: DARK }],
});

// パン1まい（2まいとも同じ形：kind 'bread'）。上がまるいトーストの形。ふちが茶色、まんなかが うすい黄色
const bread = (id, z) => ({
  id, kind: 'bread', on: ['body'],
  shapes: [
    { type: 'rbox', size: [1.1, 1.0, 0.26], pos: [0, 1.2, z], color: CRUST, r: 0.08 },
    { type: 'cyl', size: [0.32, 0.26], pos: [-0.28, 1.7, z], rot: [90, 0, 0], color: CRUST },
    { type: 'cyl', size: [0.32, 0.26], pos: [0.28, 1.7, z], rot: [90, 0, 0], color: CRUST },
    { type: 'rbox', size: [0.96, 0.86, 0.29], pos: [0, 1.2, z], color: CRUMB, r: 0.06 },
    { type: 'cyl', size: [0.26, 0.29], pos: [-0.28, 1.7, z], rot: [90, 0, 0], color: CRUMB },
    { type: 'cyl', size: [0.26, 0.29], pos: [0.28, 1.7, z], rot: [90, 0, 0], color: CRUMB },
  ],
});

KP.models.push({
  id: 'toaster', no: 13, name: 'トースター', room: 'heya',
  parts: [
    // 最初に付けられるのは「だい」だけ
    { id: 'base', on: [],
      shapes: [
        { type: 'rbox', size: [3.0, 0.15, 1.7], pos: [0, 0.175, 0], color: '#3a3d42', r: 0.04 },
      ] },
    foot('foot1', -1.3, 0.65), foot('foot2', 1.3, 0.65), foot('foot3', -1.3, -0.65), foot('foot4', 1.3, -0.65),
    // ほんたい（赤い かべ4まい。上があいている）
    { id: 'body', on: ['base'],
      shapes: [
        { type: 'rbox', size: [3.0, 1.2, 0.14], pos: [0, 0.85, 0.78], color: RED, r: 0.05 },
        { type: 'rbox', size: [3.0, 1.2, 0.14], pos: [0, 0.85, -0.78], color: RED, r: 0.05 },
        { type: 'rbox', size: [0.14, 1.2, 1.42], pos: [-1.43, 0.85, 0], color: RED, r: 0.05 },
        { type: 'rbox', size: [0.14, 1.2, 1.42], pos: [1.43, 0.85, 0], color: RED, r: 0.05 },
      ] },
    // パン（上が すきまから出る）。ふたを先に付けると、もう入らない
    bread('bread1', 0.33), bread('bread2', -0.33),
    // うえのふた（パンの入る すきまが2本あいた銀の板）。先に付けると、パンはもう入らない
    { id: 'lid', on: ['body'], closes: ['bread1', 'bread2'],
      shapes: [
        { type: 'rbox', size: [0.75, 0.15, 1.7], pos: [-1.125, 1.525, 0], color: SILVER, mat: 'metal', r: 0.04 },
        { type: 'rbox', size: [0.75, 0.15, 1.7], pos: [1.125, 1.525, 0], color: SILVER, mat: 'metal', r: 0.04 },
        { type: 'rbox', size: [1.5, 0.15, 0.34], pos: [0, 1.525, 0.68], color: SILVER, mat: 'metal', r: 0.04 },
        { type: 'rbox', size: [1.5, 0.15, 0.3], pos: [0, 1.525, 0], color: SILVER, mat: 'metal', r: 0.04 },
        { type: 'rbox', size: [1.5, 0.15, 0.34], pos: [0, 1.525, -0.68], color: SILVER, mat: 'metal', r: 0.04 },
      ] },
    // レバー（みぎのよこ）
    { id: 'lever', on: ['body'],
      shapes: [
        { type: 'rbox', size: [0.05, 0.9, 0.14], pos: [1.525, 0.85, 0.1], color: DARK, r: 0.02 },
        { type: 'rbox', size: [0.2, 0.18, 0.34], pos: [1.62, 1.15, 0.1], color: DARK, r: 0.05 },
        { type: 'rbox', size: [0.04, 0.1, 0.2], pos: [1.73, 1.15, 0.1], color: SILVER, mat: 'metal', r: 0.015 },
      ] },
    // ダイヤル（まえ）
    { id: 'dial', on: ['body'],
      shapes: [
        { type: 'cyl', size: [0.22, 0.14], pos: [-0.9, 0.8, 0.92], rot: [90, 0, 0], color: DARK },
        { type: 'torus', size: [0.27, 0.03], pos: [-0.9, 0.8, 0.86], color: SILVER, mat: 'metal' },
        { type: 'rbox', size: [0.05, 0.14, 0.03], pos: [-0.9, 0.88, 1.0], color: '#ffffff', r: 0.015 },
      ] },
  ],
  finale: { type: 'pop', part: ['bread1', 'bread2'] },   // パンがぽんと飛び出す
});
