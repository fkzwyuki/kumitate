// No.28 ゲームき（12部品、★、へや、できたとき＝がめんと ランプが光る）
// 手に持つ形のゲーム機を、小さなだいに立ててかざった形。正面は +z。ロゴ・文字・会社のマークは描かない。
// 入れ忘れのわな: うらぶた→でんち×2（うらぶたは うしろの板と うえのふた。先にのせると、でんちはもう入らない）
// でんちは うえがあいたところから見える（うらぶたの うえのふたが、かぶさる）
import '../config.js?v=6250ca2';

const TEAL = '#2ec4b6', DTEAL = '#1f9d90', INK = '#2b2f3a', GRAYB = '#3a3f4d', PINK = '#ff6b9d', WOOD = '#b08968';

// でんち（2つとも同じ形：kind 'battery'）。うえがあいた ほんたいの中に立てる
const battery = (id, x) => ({
  id, kind: 'battery', on: ['shell'],
  shapes: [
    { type: 'cyl', size: [0.17, 0.9], pos: [x, 1.95, -0.07], color: '#e8b43a' },
    { type: 'cyl', size: [0.175, 0.3], pos: [x, 1.7, -0.07], color: '#2b2d30' },
    { type: 'cyl', size: [0.08, 0.1], pos: [x, 2.45, -0.07], color: '#c8ccd2', mat: 'metal' },
  ],
});
// A・Bボタン（2つとも同じ形：kind 'btn'）。ふちのわと、まるいボタン
const button = (id, x, y) => ({
  id, kind: 'btn', on: ['shell'],
  shapes: [
    { type: 'cyl', size: [0.25, 0.04], pos: [x, y, 0.37], rot: [90, 0, 0], color: INK },
    { type: 'cyl', size: [0.2, 0.1], pos: [x, y, 0.43], rot: [90, 0, 0], color: PINK },
  ],
});

KP.models.push({
  id: 'gameboy', no: 28, name: 'ゲームき', room: 'heya',
  parts: [
    // 最初に付けられるのは「だい」だけ（木のだいと、りょうがわの うけ）
    { id: 'stand', on: [],
      shapes: [
        { type: 'rbox', size: [5.0, 0.3, 1.5], pos: [0, 0.15, 0], color: WOOD, r: 0.08 },
        { type: 'rbox', size: [0.2, 0.6, 1.0], pos: [2.35, 0.6, 0], color: WOOD, r: 0.05 },
        { type: 'rbox', size: [0.2, 0.6, 1.0], pos: [-2.35, 0.6, 0], color: WOOD, r: 0.05 },
      ] },
    // ほんたい（まえの板・りょうがわ・した・がめんのわく）。うしろとうえは あいている
    { id: 'shell', on: ['stand'],
      shapes: [
        { type: 'rbox', size: [4.4, 2.2, 0.14], pos: [0, 1.4, 0.28], color: TEAL, r: 0.12 },
        { type: 'rbox', size: [0.12, 2.2, 0.7], pos: [-2.14, 1.4, 0], color: TEAL, r: 0.04 },
        { type: 'rbox', size: [0.12, 2.2, 0.7], pos: [2.14, 1.4, 0], color: TEAL, r: 0.04 },
        { type: 'rbox', size: [4.2, 0.12, 0.7], pos: [0, 0.36, 0], color: TEAL, r: 0.04 },
        { type: 'rbox', size: [2.5, 1.65, 0.05], pos: [0, 1.55, 0.37], color: INK, r: 0.05 },
      ] },
    // がめん（空・草・おひさま・くも・ちいさなキャラ・コイン）。できたとき光る
    { id: 'screen', on: ['shell'],
      shapes: [
        { type: 'rbox', size: [2.1, 1.35, 0.04], pos: [0, 1.55, 0.405], color: '#7fd6ff', r: 0.03 },
        { type: 'rbox', size: [2.1, 0.38, 0.05], pos: [0, 1.065, 0.41], color: '#5fd27a', r: 0.02 },
        { type: 'sphere', size: [0.18], pos: [0.6, 2.0, 0.43], color: '#ffd23f' },
        { type: 'rbox', size: [0.5, 0.14, 0.05], pos: [-0.5, 2.0, 0.43], color: '#ffffff', r: 0.05 },
        { type: 'rbox', size: [0.22, 0.3, 0.06], pos: [-0.3, 1.38, 0.44], color: '#ff4d4d', r: 0.04 },
        { type: 'cyl', size: [0.12, 0.05], pos: [0.4, 1.5, 0.44], rot: [90, 0, 0], color: '#ffd23f' },
      ] },
    // 十字キー
    { id: 'dpad', on: ['shell'],
      shapes: [
        { type: 'cyl', size: [0.42, 0.05], pos: [-1.72, 1.45, 0.375], rot: [90, 0, 0], color: INK },
        { type: 'rbox', size: [0.8, 0.26, 0.12], pos: [-1.72, 1.45, 0.42], color: GRAYB, r: 0.04 },
        { type: 'rbox', size: [0.26, 0.8, 0.12], pos: [-1.72, 1.45, 0.42], color: GRAYB, r: 0.04 },
      ] },
    button('buttonA', 1.9, 1.62), button('buttonB', 1.55, 1.2),
    // スタート・セレクト（ななめの ちいさな2つのボタン）
    { id: 'startsel', on: ['shell'],
      shapes: [
        { type: 'rbox', size: [0.42, 0.1, 0.07], pos: [-0.35, 0.58, 0.4], rot: [0, 0, 25], color: '#9aa1b0', r: 0.03 },
        { type: 'rbox', size: [0.42, 0.1, 0.07], pos: [0.35, 0.58, 0.4], rot: [0, 0, 25], color: '#9aa1b0', r: 0.03 },
      ] },
    // スピーカー（ななめの ほそいあな4本）
    { id: 'speaker', on: ['shell'],
      shapes: [
        { type: 'rbox', size: [0.4, 0.07, 0.05], pos: [1.4, 0.62, 0.38], rot: [0, 0, 60], color: DTEAL, r: 0.02 },
        { type: 'rbox', size: [0.4, 0.07, 0.05], pos: [1.6, 0.62, 0.38], rot: [0, 0, 60], color: DTEAL, r: 0.02 },
        { type: 'rbox', size: [0.4, 0.07, 0.05], pos: [1.8, 0.62, 0.38], rot: [0, 0, 60], color: DTEAL, r: 0.02 },
        { type: 'rbox', size: [0.4, 0.07, 0.05], pos: [2.0, 0.62, 0.38], rot: [0, 0, 60], color: DTEAL, r: 0.02 },
      ] },
    // でんげんランプ（ひだりうえの ちいさな赤いランプ）。できたとき光る
    { id: 'lamp', on: ['shell'],
      shapes: [
        { type: 'cyl', size: [0.12, 0.03], pos: [-1.9, 2.2, 0.37], rot: [90, 0, 0], color: INK },
        { type: 'sphere', size: [0.08], pos: [-1.9, 2.2, 0.4], color: '#ff4d4d' },
      ] },
    battery('battery1', -1.2), battery('battery2', 1.2),
    // うらぶた（先にのせると、でんち×2は もう入らない）。うしろの板と、でんちの上にかぶさるふた2つ
    { id: 'backcover', on: ['shell'], closes: ['battery1', 'battery2'],
      shapes: [
        { type: 'rbox', size: [4.4, 2.2, 0.12], pos: [0, 1.4, -0.41], color: DTEAL, r: 0.1 },
        { type: 'rbox', size: [1.1, 0.12, 0.76], pos: [-1.2, 2.56, -0.02], color: DTEAL, r: 0.04 },
        { type: 'rbox', size: [1.1, 0.12, 0.76], pos: [1.2, 2.56, -0.02], color: DTEAL, r: 0.04 },
      ] },
  ],
  finale: { type: 'light', parts: ['screen', 'lamp'] },   // がめんが ぴかぴか光り、ランプも ずれて光る
});
