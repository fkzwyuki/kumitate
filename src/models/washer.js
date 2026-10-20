// No.7 せんたくき（14部品、★★、へや、できたとき＝ドラムが回る）
// 部品は完成したときの位置で書く。中心はプログラムが計算する（DESIGN.md §6.1）
import '../config.js?v=6250ca2';

const RED = '#e0524a', RED2 = '#c9443d', DARK = '#45484d', DARKER = '#2a2c30', STEEL = '#8d9299', SILVER = '#c8ccd2';

// あし（4本とも同じ形：kind 'foot'）。置き場所だけがちがう
const foot = (id, x, z) => ({
  id, kind: 'foot', on: ['base'],
  shapes: [{ type: 'cyl', size: [0.11, 0.16], pos: [x, 0.08, z], color: DARKER }],
});

KP.models.push({
  id: 'washer', no: 7, name: 'せんたくき', room: 'heya',
  parts: [
    // 最初に付けられるのは「だい」だけ
    { id: 'base', on: [],
      shapes: [
        { type: 'rbox', size: [2.2, 0.55, 2.0], pos: [0, 0.42, 0], color: DARK, r: 0.08 },
      ] },
    foot('foot1', -0.9, 0.8), foot('foot2', 0.9, 0.8), foot('foot3', -0.9, -0.8), foot('foot4', 0.9, -0.8),
    { id: 'hose', on: ['base'],
      shapes: [
        { type: 'cyl', size: [0.07, 0.4], pos: [0.55, 0.26, 1.18], rot: [90, 0, 0], color: SILVER, mat: 'metal' },
        { type: 'cyl', size: [0.07, 0.3], pos: [0.55, 0.1, 1.38], color: SILVER, mat: 'metal' },
      ] },
    // ドラムのだい（ドラムを乗せる）
    { id: 'stand', on: ['base'],
      shapes: [
        { type: 'rbox', size: [0.28, 0.46, 1.1], pos: [-0.45, 0.9, 0], color: DARKER, r: 0.06 },
        { type: 'rbox', size: [0.28, 0.46, 1.1], pos: [0.45, 0.9, 0], color: DARKER, r: 0.06 },
      ] },
    { id: 'drum', on: ['stand'],
      shapes: [
        { type: 'tube', size: [0.68, 1.35], pos: [0, 1.75, 0.05], rot: [90, 0, 0], color: STEEL, mat: 'metal' },
        { type: 'cyl', size: [0.66, 0.04], pos: [0, 1.75, -0.62], rot: [90, 0, 0], color: '#6f747b' },
        { type: 'rbox', size: [0.14, 0.24, 1.1], pos: [0.000, 2.250, 0.05], rot: [0, 0, 0], color: '#4fa3e0', r: 0.04 },   // ドラムのうちがわのでっぱり（回ったのが見える）
        { type: 'rbox', size: [0.14, 0.24, 1.1], pos: [-0.433, 1.500, 0.05], rot: [0, 0, 120], color: '#4fa3e0', r: 0.04 },   // ドラムのうちがわのでっぱり（回ったのが見える）
        { type: 'rbox', size: [0.14, 0.24, 1.1], pos: [0.433, 1.500, 0.05], rot: [0, 0, 240], color: '#4fa3e0', r: 0.04 },   // ドラムのうちがわのでっぱり（回ったのが見える）
      ] },
    // ほんたい（うしろとよこの壁）。先に付けると、なかのだい（ドラムのだい）はもう入らない
    { id: 'body', on: ['base'], closes: ['stand'],
      shapes: [
        { type: 'rbox', size: [2.2, 2.6, 0.16], pos: [0, 1.98, -0.92], color: RED2, r: 0.06 },
        { type: 'rbox', size: [0.16, 2.6, 1.84], pos: [-1.02, 1.98, 0], color: RED, r: 0.06 },
        { type: 'rbox', size: [0.16, 2.6, 1.84], pos: [1.02, 1.98, 0], color: RED, r: 0.06 },
      ] },
    // まえの いた（穴からドラムが見える）。先に付けると、ドラムはもう入らない
    { id: 'front', on: ['body'], closes: ['drum'],
      shapes: [
        { type: 'plate', size: [2.2, 2.6, 0.16], pos: [0, 1.98, 0.92], color: RED, hole: { x: 0, y: -0.23, r: 0.62 } },
      ] },
    { id: 'door', on: ['front'],
      shapes: [
        { type: 'torus', size: [0.62, 0.1], pos: [0, 1.75, 1.04], color: SILVER, mat: 'metal' },
        { type: 'cyl', size: [0.58, 0.05], pos: [0, 1.75, 1.03], rot: [90, 0, 0], color: '#7cc4ef', mat: 'glass' },
      ] },
    { id: 'lid', on: ['front'],
      shapes: [
        { type: 'rbox', size: [2.3, 0.2, 2.1], pos: [0, 3.38, 0], color: RED, r: 0.07 },
      ] },
    { id: 'panel', on: ['front'],
      shapes: [
        { type: 'rbox', size: [1.2, 0.26, 0.1], pos: [0.35, 3.0, 1.04], color: '#33373c', r: 0.04 },
        { type: 'sphere', size: [0.06], pos: [0.0, 3.0, 1.1], color: '#5fd27a' },
        { type: 'sphere', size: [0.06], pos: [0.22, 3.0, 1.1], color: '#f2c84b' },
        { type: 'rbox', size: [0.4, 0.12, 0.04], pos: [0.62, 3.0, 1.1], color: '#7ed0f0', r: 0.02 },
      ] },
    { id: 'bottle', on: ['lid'],
      shapes: [
        { type: 'cyl', size: [0.2, 0.62], pos: [-0.55, 3.8, 0.2], color: '#3fbf4a' },
        { type: 'cyl', size: [0.1, 0.18], pos: [-0.55, 4.2, 0.2], color: '#e9f3d6' },
        { type: 'cyl', size: [0.205, 0.22], pos: [-0.55, 3.75, 0.2], color: '#f4fbff' },
      ] },
  ],
  finale: { type: 'spin', part: 'drum', axis: 'z' },   // ドラムが回る
});
