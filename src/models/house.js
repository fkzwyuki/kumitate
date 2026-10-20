// No.5 おうち（14部品、★★、そと、できたとき＝まどが光る）
// ゆかの上に、かべ4まい・ドア・まど3つ・やね2まい・えんとつ・おうちのなかのかぐ（つくえ・ベッド）。
// やねは、かべがあればいつでものせられるが、のせてしまうと なかのかぐ（つくえ・ベッド）はもう入らない（入れ忘れのわな）
import '../config.js?v=6250ca2';

const FLOOR = '#d9d4c7', WALL = '#fff1d6', WALL2 = '#f6e2bd', ROOF1 = '#c9553d', ROOF2 = '#bd4a34', WOOD = '#c98a4b', WOOD_DK = '#8a5a3c';

// ---- 大きさ ----
const FY = 0.2;                       // ゆかの上の面の高さ
const WH = 1.7, WT = 0.16;            // かべの高さ・厚さ
const HW = 1.88, ZF = 1.42;           // かべの横はば（半分）、前後のかべの中心 z
const EAVE = FY + WH;                 // かべの上のふち（1.9）
const GABLE = 1.2;                    // 前後のかべのとがりの高さ
const FRONT_FACE = ZF + WT / 2;       // 前のかべの外がわの面（1.5）

// やね（左右2まい）の計算：かたむきの角度と、板の中心・長さ
const th = Math.atan2(GABLE, HW), d = [Math.cos(th), Math.sin(th)], nrm = [-Math.sin(th), Math.cos(th)];
const OVER = 0.28, RT = 0.14;         // ひさしの長さ、やねの板の厚さ
const p0 = [-HW - OVER * d[0], EAVE - OVER * d[1]], p1 = [0.04 * d[0], EAVE + GABLE + 0.04 * d[1]];
const roofLen = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
const roofC = [(p0[0] + p1[0]) / 2 + nrm[0] * RT / 2, (p0[1] + p1[1]) / 2 + nrm[1] * RT / 2];   // 左のやねの中心（右は左右反転）
const roofDeg = th * 180 / Math.PI;
const roof = (id, side, color, on) => ({
  id, on, closes: ['table', 'bed'],
  shapes: [{ type: 'rbox', size: [roofLen, RT, 3.3], pos: [side * roofC[0], roofC[1], 0], rot: [0, 0, side * roofDeg], color, r: 0.05 }],
});

// まど（3つとも同じ形：kind 'window'）。左右はどちらから見ても同じ形。ガラスは光る色
const win = (id, x, y) => ({
  id, kind: 'window', on: ['wallFront'],
  shapes: [
    { type: 'rbox', size: [0.7, 0.7, 0.1], pos: [x, y, FRONT_FACE], color: '#ffffff', r: 0.04 },
    { type: 'rbox', size: [0.52, 0.52, 0.14], pos: [x, y, FRONT_FACE], color: '#ffe9a0', mat: 'glass', r: 0.02 },
    { type: 'rbox', size: [0.54, 0.04, 0.16], pos: [x, y, FRONT_FACE], color: '#ffffff', r: 0.01 },
  ],
});

KP.models.push({
  id: 'house', no: 5, name: 'おうち', room: 'soto',
  parts: [
    // 最初に付けられるのは「ゆか」だけ
    { id: 'floor', on: [],
      shapes: [{ type: 'rbox', size: [4.0, FY, 3.5], pos: [0, FY / 2, 0], color: FLOOR, r: 0.06 }] },
    // うしろのかべ（上はとがった形）
    { id: 'wallBack', on: ['floor'],
      shapes: [
        { type: 'rbox', size: [HW * 2, WH, WT], pos: [0, FY + WH / 2, -ZF], color: WALL2, r: 0.03 },
        { type: 'prism', size: [HW * 2, GABLE, WT], pos: [0, EAVE + GABLE / 2, -ZF], color: WALL2 },
      ] },
    { id: 'wallLeft', on: ['floor'],
      shapes: [{ type: 'rbox', size: [WT, WH, 2 * (ZF - WT / 2)], pos: [-(HW - WT / 2), FY + WH / 2, 0], color: WALL, r: 0.03 }] },
    { id: 'wallRight', on: ['floor'],
      shapes: [{ type: 'rbox', size: [WT, WH, 2 * (ZF - WT / 2)], pos: [HW - WT / 2, FY + WH / 2, 0], color: WALL, r: 0.03 }] },
    // 前のかべ（上はとがった形。ドアとまどが付く）
    { id: 'wallFront', on: ['floor'],
      shapes: [
        { type: 'rbox', size: [HW * 2, WH, WT], pos: [0, FY + WH / 2, ZF], color: WALL, r: 0.03 },
        { type: 'prism', size: [HW * 2, GABLE, WT], pos: [0, EAVE + GABLE / 2, ZF], color: WALL },
      ] },
    // ドア（かいだんつき）
    { id: 'door', on: ['wallFront'],
      shapes: [
        { type: 'rbox', size: [0.85, 1.3, 0.1], pos: [0, FY + 0.65, FRONT_FACE], color: '#b5651d', r: 0.04 },
        { type: 'sphere', size: [0.05], pos: [0.27, FY + 0.65, FRONT_FACE + 0.07], color: '#ffd23f' },
        { type: 'rbox', size: [0.6, 0.5, 0.12], pos: [0, FY + 0.8, FRONT_FACE], color: '#9a5316', r: 0.03 },
        { type: 'rbox', size: [1.25, 0.14, 0.36], pos: [0, FY + 0.07, FRONT_FACE + 0.18], color: '#b8b3a6', r: 0.04 },
      ] },
    // まど×3（まえの下に2つ、とがりの下に1つ）
    win('win1', -1.3, FY + 0.9), win('win2', 1.3, FY + 0.9), win('win3', 0, EAVE + 0.35),
    // やね（のせると、なかのかぐは もう入らない）
    roof('roofL', 1, ROOF1, ['wallLeft', 'wallFront', 'wallBack']),
    roof('roofR', -1, ROOF2, ['wallRight', 'wallFront', 'wallBack']),
    { id: 'chimney', on: ['roofR'],
      shapes: [
        { type: 'rbox', size: [0.38, 1.1, 0.38], pos: [0.95, 2.97, -0.5], color: '#b0573c', r: 0.03 },
        { type: 'rbox', size: [0.5, 0.1, 0.5], pos: [0.95, 3.57, -0.5], color: '#6b4a3a', r: 0.03 },
      ] },
    // おうちのなか：つくえ（上にはなびん）
    { id: 'table', on: ['floor'],
      shapes: [
        { type: 'rbox', size: [1.0, 0.08, 0.7], pos: [0.7, FY + 0.54, 0.2], color: WOOD, r: 0.03 },
        { type: 'cyl', size: [0.05, 0.5], pos: [0.28, FY + 0.25, -0.1], color: WOOD_DK },
        { type: 'cyl', size: [0.05, 0.5], pos: [1.12, FY + 0.25, -0.1], color: WOOD_DK },
        { type: 'cyl', size: [0.05, 0.5], pos: [0.28, FY + 0.25, 0.5], color: WOOD_DK },
        { type: 'cyl', size: [0.05, 0.5], pos: [1.12, FY + 0.25, 0.5], color: WOOD_DK },
        { type: 'cyl', size: [0.1, 0.3], pos: [0.7, FY + 0.73, 0.2], color: '#5aa9e6' },
      ] },
    // おうちのなか：ベッド
    { id: 'bed', on: ['floor'],
      shapes: [
        { type: 'rbox', size: [1.0, 0.28, 1.7], pos: [-1.0, FY + 0.14, -0.4], color: WOOD_DK, r: 0.05 },
        { type: 'rbox', size: [0.96, 0.12, 1.1], pos: [-1.0, FY + 0.34, -0.1], color: '#6fa8e8', r: 0.05 },
        { type: 'rbox', size: [0.7, 0.1, 0.35], pos: [-1.0, FY + 0.33, -1.0], color: '#ffffff', r: 0.05 },
      ] },
  ],
  finale: { type: 'light', parts: ['win1', 'win2', 'win3'] },   // まどが光る
});
