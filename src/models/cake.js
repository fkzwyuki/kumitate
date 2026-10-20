// No.4 ケーキ（12部品、★、へや、できたとき＝ろうそくが光る）
// 下から おさら → スポンジ → クリーム → スポンジ → クリーム。うえのスポンジは、スポンジの上ならいつでものせられるが、
// のせてしまうと 中のクリームと、まんなかのいちご×2 はもう入らない（入れ忘れのわな）
import '../config.js?v=6250ca2';

const SPONGE = '#f3cf85', SPONGE2 = '#efc26c', CREAM = '#fffaf0', PINK = '#ffd3e0', BERRY = '#e5303c', LEAF = '#4caf50', CHOCO = '#6b3f24';

// 高さの決め方（下から）
const yPlate = 0.12, ySp1 = 0.12 + 0.35, ySp1Top = 0.82;          // スポンジ（した）は 0.12〜0.82
const yCr1 = ySp1Top + 0.14, yCr1Top = 1.1;                       // まんなかのクリームは 0.82〜1.1
const ySp2 = yCr1Top + 0.35, ySp2Top = 1.8;                       // スポンジ（うえ）は 1.1〜1.8
const yCr2 = ySp2Top + 0.125, yCr2Top = 2.05;                     // うえのクリームは 1.8〜2.05
const MID_R = 1.5;                                                // まんなかのいちごを置く半径（クリームのふちに少しはみ出す）

// いちご（4つとも同じ形：kind 'berry'）。赤い玉に、へたと、つぶつぶ（つぶつぶはチェックのため、右・手前がわだけ）
const berry = (id, x, y, z, on) => ({
  id, kind: 'berry', on,
  shapes: [
    { type: 'sphere', size: [0.2], pos: [x, y, z], color: BERRY },
    { type: 'cyl', size: [0.11, 0.04], pos: [x, y + 0.18, z], color: LEAF },
    { type: 'sphere', size: [0.022], pos: [x + 0.1, y + 0.14, z + 0.09], color: '#fff1c9' },
    { type: 'sphere', size: [0.022], pos: [x + 0.16, y + 0.02, z + 0.12], color: '#fff1c9' },
    { type: 'sphere', size: [0.022], pos: [x + 0.09, y + 0.1, z + 0.15], color: '#fff1c9' },
  ],
});

// まんなかのいちごの位置（右と手前のふちに1つずつ）
const mid = deg => [MID_R * Math.cos(deg * Math.PI / 180), yCr1, MID_R * Math.sin(deg * Math.PI / 180)];

// ろうそく（2本とも同じ形：kind 'candle'）。できたとき、この部品が光る
const candle = (id, x, z) => ({
  id, kind: 'candle', on: ['cream2'],
  shapes: [
    { type: 'cyl', size: [0.07, 0.6], pos: [x, yCr2Top + 0.3, z], color: '#ffd9ec' },
    { type: 'torus', size: [0.07, 0.025], pos: [x, yCr2Top + 0.2, z], rot: [90, 0, 0], color: '#ff8fbf' },
    { type: 'torus', size: [0.07, 0.025], pos: [x, yCr2Top + 0.42, z], rot: [90, 0, 0], color: '#ff8fbf' },
    { type: 'cone', size: [0.075, 0.24], pos: [x, yCr2Top + 0.72, z], color: '#ffa51f' },
    { type: 'sphere', size: [0.05], pos: [x, yCr2Top + 0.67, z], color: '#ffe066' },
  ],
});

KP.models.push({
  id: 'cake', no: 4, name: 'ケーキ', room: 'heya',
  parts: [
    // 最初に付けられるのは「おさら」だけ
    { id: 'plate', on: [],
      shapes: [
        { type: 'cyl', size: [1.75, yPlate], pos: [0, yPlate / 2, 0], color: '#fbfbfb' },
        { type: 'torus', size: [1.68, 0.06], pos: [0, yPlate, 0], rot: [90, 0, 0], color: '#dfe6ee' },
      ] },
    { id: 'sponge1', on: ['plate'],
      shapes: [{ type: 'cyl', size: [1.35, 0.7], pos: [0, ySp1, 0], color: SPONGE }] },
    // まんなかのクリーム（うえのスポンジを先にのせると、もう入らない）
    { id: 'cream1', on: ['sponge1'],
      shapes: [
        { type: 'cyl', size: [1.42, 0.28], pos: [0, yCr1, 0], color: CREAM },
        { type: 'torus', size: [1.42, 0.09], pos: [0, yCr1, 0], rot: [90, 0, 0], color: CREAM },
      ] },
    // まんなかのいちご（うえのスポンジを先にのせると、もう入らない）
    berry('berry1', ...mid(10), ['cream1']),
    berry('berry2', ...mid(80), ['cream1']),
    // うえのスポンジ（クリームといちごを入れずにのせると、宙にういて中が空のまま）
    { id: 'sponge2', on: ['sponge1'], closes: ['cream1', 'berry1', 'berry2'],
      shapes: [{ type: 'cyl', size: [1.35, 0.7], pos: [0, ySp2, 0], color: SPONGE2 }] },
    { id: 'cream2', on: ['sponge2'],
      shapes: [
        { type: 'cyl', size: [1.45, 0.25], pos: [0, yCr2, 0], color: PINK },
        { type: 'torus', size: [1.42, 0.1], pos: [0, yCr2Top, 0], rot: [90, 0, 0], color: '#ffb8cf' },
      ] },
    // うえのいちご（まんなかのいちごと同じ kind なので、どれを持っても空いている場所に入る）
    berry('berry3', -1.0, yCr2Top + 0.15, 0.15, ['cream2']),
    berry('berry4', 1.0, yCr2Top + 0.15, 0.15, ['cream2']),
    candle('candle1', -0.45, -0.45), candle('candle2', 0.45, -0.45),
    // チョコのプレート（白いおえかき）
    { id: 'sign', on: ['cream2'],
      shapes: [
        { type: 'rbox', size: [0.9, 0.08, 0.4], pos: [0, yCr2Top + 0.04, 0.5], color: CHOCO, r: 0.03 },
        { type: 'rbox', size: [0.6, 0.03, 0.07], pos: [0, yCr2Top + 0.095, 0.44], color: '#fff6e6', r: 0.012 },
        { type: 'rbox', size: [0.34, 0.03, 0.07], pos: [0, yCr2Top + 0.095, 0.58], color: '#fff6e6', r: 0.012 },
      ] },
  ],
  finale: { type: 'light', parts: ['candle1', 'candle2'] },   // ろうそくが光る
});
