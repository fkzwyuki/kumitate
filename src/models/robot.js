// No.10 ロボット（18部品、★★★、へや、できたとき＝跳ねる）
// 正面は +z。くつ→あし→どう（むね・おなかの2つの小部屋がある）→…
// 入れ忘れのわな: むねのふた→ハート、おなかのふた→でんち、バイザー（かおのガラス）→め×2
import '../config.js?v=6250ca2';

const RED = '#e5483f', BLUE = '#3f7fe0', YELLOW = '#ffd23f', GRAY = '#9aa0a8', DARK = '#454a52', GLASS = '#8fd3f5', PINK = '#ff4f7a', GREEN = '#4caf50';

// くつ（2つとも同じ形：kind 'shoe'）。つま先は +z
const shoe = (id, x) => ({
  id, kind: 'shoe', on: [],
  shapes: [
    { type: 'rbox', size: [0.85, 0.3, 1.2], pos: [x, 0.15, 0.15], color: BLUE, r: 0.08 },
    { type: 'rbox', size: [0.87, 0.08, 1.22], pos: [x, 0.04, 0.15], color: DARK, r: 0.03 },
  ],
});
// あし（2本とも同じ形：kind 'leg'）。それぞれ、自分のがわのくつの上
const leg = (id, x, on) => ({
  id, kind: 'leg', on: [on],
  shapes: [
    { type: 'cyl', size: [0.2, 1.2], pos: [x, 0.9, 0], color: GRAY, mat: 'metal' },
    { type: 'torus', size: [0.2, 0.05], pos: [x, 0.95, 0], rot: [90, 0, 0], color: DARK },
  ],
});
// うで（2本とも同じ形：kind 'arm'）。かたの玉と、まっすぐな腕
const arm = (id, x) => ({
  id, kind: 'arm', on: ['body'],
  shapes: [
    { type: 'sphere', size: [0.27], pos: [x, 2.95, 0], color: RED },
    { type: 'cyl', size: [0.16, 1.0], pos: [x, 2.35, 0], color: GRAY, mat: 'metal' },
  ],
});
// て（2つとも同じ形：kind 'hand'）。手首と、まるい手
const hand = (id, x, on) => ({
  id, kind: 'hand', on: [on],
  shapes: [
    { type: 'cyl', size: [0.12, 0.15], pos: [x, 1.8, 0], color: DARK },
    { type: 'sphere', size: [0.24], pos: [x, 1.62, 0], color: YELLOW },
  ],
});
// め（2つとも同じ形：kind 'eye'）。あたまの中に入る。白目と黒目
const eye = (id, x) => ({
  id, kind: 'eye', on: ['head'],
  shapes: [
    { type: 'sphere', size: [0.2], pos: [x, 4.15, 0.12], color: '#ffffff' },
    { type: 'sphere', size: [0.1], pos: [x, 4.15, 0.3], color: '#2b2d30' },
  ],
});

KP.models.push({
  id: 'robot', no: 10, name: 'ロボット', room: 'heya',
  parts: [
    // 最初に付けられるのは「くつ」2つ（どちらを持ってもよい）
    shoe('shoe1', -0.55), shoe('shoe2', 0.55),
    leg('leg1', -0.55, 'shoe1'), leg('leg2', 0.55, 'shoe2'),
    // どう（うしろ・よこ・した・うえの いた。まえは あいていて、むねとおなかの2つの小部屋になる）。くびも付いている
    { id: 'body', on: ['leg1', 'leg2'],
      shapes: [
        { type: 'rbox', size: [1.9, 1.5, 0.12], pos: [0, 2.45, -0.5], color: RED, r: 0.04 },
        { type: 'rbox', size: [0.12, 1.5, 1.1], pos: [-0.89, 2.45, 0.05], color: RED, r: 0.04 },
        { type: 'rbox', size: [0.12, 1.5, 1.1], pos: [0.89, 2.45, 0.05], color: RED, r: 0.04 },
        { type: 'rbox', size: [1.9, 0.2, 1.1], pos: [0, 1.6, 0.05], color: DARK, r: 0.04 },
        { type: 'rbox', size: [1.9, 0.14, 1.1], pos: [0, 3.2, 0.05], color: RED, r: 0.04 },
        { type: 'cyl', size: [0.28, 0.25], pos: [0, 3.395, 0], color: DARK },
      ] },
    // ハート（むねの中）。かたちは、まるが2つと ひし形
    { id: 'heart', on: ['body'],
      shapes: [
        { type: 'sphere', size: [0.2], pos: [-0.14, 2.9, 0], color: PINK },
        { type: 'sphere', size: [0.2], pos: [0.14, 2.9, 0], color: PINK },
        { type: 'rbox', size: [0.34, 0.34, 0.3], pos: [0, 2.72, 0], rot: [0, 0, 45], color: PINK, r: 0.06 },
      ] },
    // でんち（おなかの中）。まんなかに黄色いラベル、上に+-の出っぱり
    { id: 'battery', on: ['body'],
      shapes: [
        { type: 'rbox', size: [1.0, 0.45, 0.45], pos: [0, 2.0, 0], color: GREEN, r: 0.06 },
        { type: 'rbox', size: [0.5, 0.2, 0.47], pos: [0, 2.0, 0], color: YELLOW, r: 0.03 },
        { type: 'cyl', size: [0.07, 0.12], pos: [-0.3, 2.285, 0], color: GRAY },
        { type: 'cyl', size: [0.07, 0.12], pos: [0.3, 2.285, 0], color: GRAY },
      ] },
    // むねのふた（ボタン2つ付き）。先に付けると、中のハートはもう入らない
    { id: 'cover', on: ['body'], closes: ['heart'],
      shapes: [
        { type: 'rbox', size: [1.66, 0.7, 0.1], pos: [0, 2.78, 0.55], color: BLUE, r: 0.04 },
        { type: 'cyl', size: [0.11, 0.07], pos: [-0.35, 2.78, 0.63], rot: [90, 0, 0], color: YELLOW },
        { type: 'cyl', size: [0.11, 0.07], pos: [0.35, 2.78, 0.63], rot: [90, 0, 0], color: '#ff6b5a' },
      ] },
    // おなかのふた（バックルつき）。先に付けると、中のでんちはもう入らない
    { id: 'belt', on: ['body'], closes: ['battery'],
      shapes: [
        { type: 'rbox', size: [1.66, 0.7, 0.1], pos: [0, 2.05, 0.55], color: DARK, r: 0.04 },
        { type: 'rbox', size: [0.34, 0.34, 0.06], pos: [0, 2.05, 0.62], color: YELLOW, r: 0.03 },
      ] },
    arm('arm1', -1.22), arm('arm2', 1.22),
    hand('hand1', -1.22, 'arm1'), hand('hand2', 1.22, 'arm2'),
    // あたま（うしろ・よこ・した・うえ・みみ。まえは あいている）
    { id: 'head', on: ['body'],
      shapes: [
        { type: 'rbox', size: [1.5, 0.12, 1.0], pos: [0, 3.58, 0], color: GRAY, r: 0.04 },
        { type: 'rbox', size: [1.5, 1.2, 0.12], pos: [0, 4.12, -0.44], color: RED, r: 0.04 },
        { type: 'rbox', size: [0.12, 1.2, 1.0], pos: [-0.69, 4.12, 0], color: RED, r: 0.04 },
        { type: 'rbox', size: [0.12, 1.2, 1.0], pos: [0.69, 4.12, 0], color: RED, r: 0.04 },
        { type: 'rbox', size: [1.5, 0.12, 1.0], pos: [0, 4.72, 0], color: RED, r: 0.04 },
        { type: 'cyl', size: [0.18, 0.12], pos: [-0.82, 4.12, 0], rot: [0, 0, 90], color: BLUE },
        { type: 'cyl', size: [0.18, 0.12], pos: [0.82, 4.12, 0], rot: [0, 0, 90], color: BLUE },
      ] },
    eye('eye1', -0.32), eye('eye2', 0.32),
    // バイザー（かおの すきとおった いた）。先に付けると、め2つはもう入らない
    { id: 'visor', on: ['head'], closes: ['eye1', 'eye2'],
      shapes: [
        { type: 'rbox', size: [1.38, 0.9, 0.06], pos: [0, 4.12, 0.5], color: GLASS, mat: 'glass', r: 0.03 },
        { type: 'rbox', size: [0.5, 0.1, 0.08], pos: [0, 3.8, 0.52], color: DARK, r: 0.03 },
      ] },
    // アンテナ
    { id: 'antenna', on: ['head'],
      shapes: [
        { type: 'cyl', size: [0.1, 0.08], pos: [0, 4.82, 0], color: DARK },
        { type: 'cyl', size: [0.04, 0.5], pos: [0, 5.1, 0], color: DARK },
        { type: 'sphere', size: [0.13], pos: [0, 5.4, 0], color: '#ff3b30' },
      ] },
  ],
  finale: { type: 'bounce' },   // 全体が跳ねる
});
