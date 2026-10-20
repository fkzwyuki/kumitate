// No.11 でんしレンジ（12部品、★、へや、できたとき＝回る台とお皿が回る＋中のあかりが光る）
// ドアを付けると、回る台とお皿はもう入らない（入れ忘れのわな）。左がドア、右がボタンのパネル。商品名・マークは描かない
import '../config.js?v=6250ca2';

const BODY = '#e9ecef', DARK = '#3a3e44', LINER = '#2c3036', SILVER = '#c8ccd2', FOOTC = '#2b2d30';

// 中の回る台の中心（箱の中のまんなか）。回る台もお皿も、この軸の上に中心がある形にして、その場で回す
const CX = -0.365, CZ = 0.075;

// あし（4本とも同じ形：kind 'foot'）
const foot = (id, x, z) => ({
  id, kind: 'foot', on: ['base'],
  shapes: [{ type: 'cyl', size: [0.12, 0.1], pos: [x, 0.05, z], color: FOOTC }],
});

// 回る台のふちの目印（回ったのが見える。3つ、おなじ半径にならべる）
const mark = deg => ({ type: 'sphere', size: [0.07], pos: [CX + 0.82 * Math.cos(deg * Math.PI / 180), 0.47, CZ + 0.82 * Math.sin(deg * Math.PI / 180)], color: '#e0524a' });

KP.models.push({
  id: 'microwave', no: 11, name: 'でんしレンジ', room: 'heya',
  parts: [
    // 最初に付けられるのは「だい」だけ
    { id: 'base', on: [],
      shapes: [
        { type: 'rbox', size: [3.0, 0.2, 2.1], pos: [0, 0.2, 0], color: DARK, r: 0.05 },
      ] },
    foot('foot1', -1.25, 0.8), foot('foot2', 1.25, 0.8), foot('foot3', -1.25, -0.8), foot('foot4', 1.25, -0.8),
    // はこ（うしろ・ひだり・うえ・みぎのかたまり。中は黒っぽい）
    { id: 'shell', on: ['base'],
      shapes: [
        { type: 'rbox', size: [3.0, 1.45, 0.15], pos: [0, 1.025, -0.975], color: BODY, r: 0.05 },
        { type: 'rbox', size: [0.12, 1.45, 1.95], pos: [-1.44, 1.025, 0.075], color: BODY, r: 0.05 },
        { type: 'rbox', size: [3.0, 0.15, 2.1], pos: [0, 1.825, 0], color: BODY, r: 0.05 },
        { type: 'rbox', size: [0.85, 1.45, 1.95], pos: [1.075, 1.025, 0.075], color: BODY, r: 0.05 },
        { type: 'rbox', size: [2.03, 1.45, 0.04], pos: [-0.365, 1.025, -0.88], color: LINER, r: 0.01 },
        { type: 'rbox', size: [0.04, 1.45, 1.91], pos: [-1.36, 1.025, 0.095], color: LINER, r: 0.01 },
      ] },
    // 中のあかり（できたとき光る）
    { id: 'lamp', on: ['shell'],
      shapes: [
        { type: 'rbox', size: [1.2, 0.6, 0.04], pos: [-0.45, 1.3, -0.84], color: '#fff0a8', r: 0.015 },
        { type: 'rbox', size: [0.04, 0.6, 0.9], pos: [-1.32, 1.3, 0.2], color: '#fff0a8', r: 0.015 },
      ] },
    // まわるだい（ガラスの板。ふちに目印の赤い玉）。ドアを先に付けると、もう入らない
    { id: 'turn', on: ['base'],
      shapes: [
        { type: 'torus', size: [0.5, 0.05], pos: [CX, 0.36, CZ], rot: [90, 0, 0], color: '#8a9097' },
        { type: 'cyl', size: [0.12, 0.08], pos: [CX, 0.34, CZ], color: '#8a9097' },
        { type: 'cyl', size: [0.95, 0.05], pos: [CX, 0.435, CZ], color: '#bfe3f2', mat: 'glass' },
        mark(30), mark(150), mark(270),
      ] },
    // おさら（まわるだいの上。コップとクッキー）。ドアを先に付けると、もう入らない
    { id: 'dish', on: ['turn'],
      shapes: [
        { type: 'cyl', size: [0.62, 0.05], pos: [CX, 0.485, CZ], color: '#fafafa' },
        { type: 'torus', size: [0.6, 0.03], pos: [CX, 0.51, CZ], rot: [90, 0, 0], color: '#dfe6ee' },
        { type: 'cyl', size: [0.17, 0.3], pos: [CX + 0.2, 0.66, CZ - 0.05], color: '#e0524a' },
        { type: 'torus', size: [0.1, 0.03], pos: [CX + 0.42, 0.66, CZ - 0.05], color: '#e0524a' },
        { type: 'cyl', size: [0.14, 0.05], pos: [CX - 0.3, 0.535, CZ + 0.12], color: '#c98a3c' },
        { type: 'cyl', size: [0.14, 0.05], pos: [CX - 0.18, 0.535, CZ - 0.25], color: '#c98a3c' },
      ] },
    // ドア（わく＋ガラスの まど＋とって）。先に付けると、回る台とお皿はもう入らない
    { id: 'door', on: ['shell'], closes: ['turn', 'dish'],
      shapes: [
        { type: 'rbox', size: [0.18, 1.45, 0.14], pos: [-1.31, 1.075, 1.12], color: BODY, r: 0.04 },
        { type: 'rbox', size: [0.18, 1.45, 0.14], pos: [0.51, 1.075, 1.12], color: BODY, r: 0.04 },
        { type: 'rbox', size: [2.0, 0.2, 0.14], pos: [-0.4, 1.7, 1.12], color: BODY, r: 0.04 },
        { type: 'rbox', size: [2.0, 0.2, 0.14], pos: [-0.4, 0.45, 1.12], color: BODY, r: 0.04 },
        { type: 'rbox', size: [1.64, 1.05, 0.04], pos: [-0.4, 1.075, 1.12], color: '#8fb8d0', mat: 'glass', r: 0.015 },
        { type: 'rbox', size: [0.1, 0.8, 0.1], pos: [0.51, 1.075, 1.24], color: SILVER, mat: 'metal', r: 0.035 },
      ] },
    // ボタンのパネル（ひょうじ・ボタン3つ）
    { id: 'panel', on: ['shell'],
      shapes: [
        { type: 'rbox', size: [0.7, 1.3, 0.06], pos: [1.075, 1.025, 1.08], color: '#2f3338', r: 0.025 },
        { type: 'rbox', size: [0.5, 0.2, 0.03], pos: [1.075, 1.45, 1.125], color: '#7fe0a8', r: 0.012 },
        { type: 'rbox', size: [0.4, 0.1, 0.03], pos: [1.075, 1.2, 1.125], color: '#9aa1a9', r: 0.012 },
        { type: 'rbox', size: [0.4, 0.1, 0.03], pos: [1.075, 1.05, 1.125], color: '#9aa1a9', r: 0.012 },
        { type: 'rbox', size: [0.4, 0.1, 0.03], pos: [1.075, 0.9, 1.125], color: '#5fd27a', r: 0.012 },
      ] },
    { id: 'knob', on: ['panel'],
      shapes: [
        { type: 'cyl', size: [0.2, 0.12], pos: [1.075, 0.62, 1.17], rot: [90, 0, 0], color: SILVER, mat: 'metal' },
        { type: 'rbox', size: [0.05, 0.16, 0.03], pos: [1.075, 0.68, 1.245], color: '#e0524a', r: 0.015 },
      ] },
  ],
  // 回る台とお皿が回り、中のあかりが光る（2つ同時）
  finale: [
    { type: 'spin', part: ['turn', 'dish'], axis: 'y' },
    { type: 'light', parts: ['lamp'] },
  ],
});
