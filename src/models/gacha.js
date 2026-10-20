// No.21 ガチャガチャ（13部品、★★、へや、できたとき＝カプセルがぴょんと跳ねて、ハンドルが回る）
// 透明カバーを付けると、カプセル×5は もう入らない／コインのパネルを付けると、コインばこは もう入らない（入れ忘れのわな2か所）。
// マーク・文字は描かない。カプセルは色ちがいなら別の kind（ピンク2・青2・黄1）
import '../config.js?v=6250ca2';

const RED = '#e0443a', GRAY = '#cfd3d8', DARK = '#2b2d30';
const PINK = '#f27bb0', CBLUE = '#4aa3e8', CYEL = '#f7c531';

// カプセル1つ（上がカラー、下が白の まるい入れもの）。色ちがいは別の kind
const capsule = (id, kind, color, x, y, z) => ({
  id, ...(kind ? { kind } : {}), on: ['body'],
  shapes: [
    { type: 'sphere', size: [0.22], pos: [x, y, z], half: true, color },
    { type: 'sphere', size: [0.22], pos: [x, y, z], half: true, rot: [180, 0, 0], color: '#f5f5f5' },
  ],
});

KP.models.push({
  id: 'gacha', no: 21, name: 'ガチャガチャ', room: 'heya',
  parts: [
    // 最初に付けられるのは「だい」だけ
    { id: 'base', on: [],
      shapes: [
        { type: 'rbox', size: [2.3, 0.25, 1.8], pos: [0, 0.125, 0], color: '#4a4d52', r: 0.05 },
      ] },
    // ほんたい（赤い はこ。うしろ・ひだり・みぎ・うえ・した。まえはあいている。うえの わも ここ）
    { id: 'body', on: ['base'],
      shapes: [
        { type: 'rbox', size: [1.9, 1.4, 0.1], pos: [0, 0.95, -0.7], color: RED, r: 0.03 },
        { type: 'rbox', size: [0.1, 1.4, 1.4], pos: [-0.9, 0.95, 0.05], color: RED, r: 0.03 },
        { type: 'rbox', size: [0.1, 1.4, 1.4], pos: [0.9, 0.95, 0.05], color: RED, r: 0.03 },
        { type: 'rbox', size: [1.9, 0.1, 1.5], pos: [0, 1.6, 0], color: RED, r: 0.03 },
        { type: 'rbox', size: [1.7, 0.1, 1.3], pos: [0, 0.3, 0], color: '#a8302a', r: 0.02 },
        { type: 'torus', size: [0.75, 0.07], pos: [0, 1.67, 0], rot: [90, 0, 0], color: GRAY, mat: 'metal' },
      ] },
    // コインばこ（はこの中）。パネルを先に付けると、もう入らない
    { id: 'coinbox', on: ['body'],
      shapes: [
        { type: 'rbox', size: [0.8, 0.5, 0.5], pos: [0.3, 1.0, 0.1], color: '#e8a53a', r: 0.04 },
        { type: 'cyl', size: [0.05, 0.4], pos: [0.3, 0.55, 0.1], color: '#b9c1c8', mat: 'metal' },
      ] },
    // コインのパネル（まえの上のほう。コインを入れる すきま）。先に付けると、コインばこは もう入らない
    { id: 'panel', on: ['body'], closes: ['coinbox'],
      shapes: [
        { type: 'rbox', size: [1.7, 0.7, 0.06], pos: [0, 1.25, 0.78], color: GRAY, r: 0.03 },
        { type: 'rbox', size: [0.1, 0.3, 0.04], pos: [-0.5, 1.25, 0.82], color: DARK, r: 0.02 },
      ] },
    // ハンドル（まるい ぼたん＋よこぼう。できたとき、くるくる回る。中心が回る軸の上にある形）
    { id: 'handle', on: ['panel'],
      shapes: [
        { type: 'cyl', size: [0.28, 0.08], pos: [0.3, 1.25, 0.85], rot: [90, 0, 0], color: '#f7c531' },
        { type: 'rbox', size: [0.66, 0.14, 0.1], pos: [0.3, 1.25, 0.92], color: '#c98a1a', r: 0.04 },
        { type: 'cyl', size: [0.07, 0.16], pos: [0.3, 1.25, 0.9], rot: [90, 0, 0], color: '#8d6a1a' },
      ] },
    // とりだしぐち（まえの下のほう。くらい穴＋すきとおった ふた）
    { id: 'outlet', on: ['body'],
      shapes: [
        { type: 'rbox', size: [1.0, 0.45, 0.06], pos: [0, 0.65, 0.78], color: DARK, r: 0.03 },
        { type: 'rbox', size: [0.88, 0.32, 0.05], pos: [0, 0.65, 0.84], color: '#cfe9f2', mat: 'glass', r: 0.02 },
      ] },
    // カプセル×5（ピンク2・青2・黄1）。透明カバーを先に付けると、もう入らない
    capsule('cap1', 'capP', PINK, -0.4, 1.87, 0.1), capsule('cap2', 'capP', PINK, 0.4, 1.87, -0.05),
    capsule('cap3', 'capB', CBLUE, 0.05, 1.87, 0.4), capsule('cap4', 'capB', CBLUE, -0.15, 2.25, -0.15),
    capsule('cap5', null, CYEL, 0.25, 2.2, 0.15),
    // 透明カバー（まるいガラスの玉）。先に付けると、カプセルは もう入らない
    { id: 'globe', on: ['body'], closes: ['cap1', 'cap2', 'cap3', 'cap4', 'cap5'],
      shapes: [
        { type: 'sphere', size: [0.92], pos: [0, 2.55, 0], half: true, color: '#d4eef5', mat: 'glass' },
        { type: 'sphere', size: [0.92], pos: [0, 2.55, 0], half: true, rot: [180, 0, 0], color: '#d4eef5', mat: 'glass' },
      ] },
    // てっぺんのふた
    { id: 'lid', on: ['globe'],
      shapes: [
        { type: 'cyl', size: [0.3, 0.18], pos: [0, 3.56, 0], color: RED },
        { type: 'sphere', size: [0.09], pos: [0, 3.7, 0], color: GRAY, mat: 'metal' },
      ] },
  ],
  finale: [
    { type: 'pop', part: ['cap1', 'cap3', 'cap5', 'cap2', 'cap4'] },   // カプセルがぴょんと跳ねる
    { type: 'spin', part: 'handle', axis: 'z' },                         // ハンドルが回る
  ],
});
