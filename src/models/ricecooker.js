// No.12 すいはんき（11部品、★、へや、できたとき＝ふたの上から湯気が立ちのぼる）
// ふたを付けると、うちがまとごはんはもう入らない（入れ忘れのわな）。商品名・マークは描かない
import '../config.js?v=6250ca2';

const CREAM = '#f4f2ec', CREAM2 = '#e9e6dc', RED = '#e0524a', RED2 = '#c9443d', DARK = '#4a4d52', PANEL = '#2f3338';

// ボタン（2つとも同じ形：kind 'btn'）
const btn = (id, x) => ({
  id, kind: 'btn', on: ['panel'],
  shapes: [{ type: 'cyl', size: [0.1, 0.08], pos: [x, 0.68, 1.45], rot: [90, 0, 0], color: '#f08a3c' }],
});

KP.models.push({
  id: 'ricecooker', no: 12, name: 'すいはんき', room: 'heya',
  parts: [
    // 最初に付けられるのは「だい」だけ
    { id: 'base', on: [],
      shapes: [
        { type: 'cyl', size: [1.42, 0.22], pos: [0, 0.11, 0], color: DARK },
      ] },
    // ほんたい（上があいた まるい筒。赤い帯）
    { id: 'body', on: ['base'],
      shapes: [
        { type: 'tube', size: [1.3, 1.3], pos: [0, 0.87, 0], color: CREAM },
        { type: 'torus', size: [1.3, 0.06], pos: [0, 1.52, 0], rot: [90, 0, 0], color: '#dfdbd0' },
        { type: 'tube', size: [1.31, 0.2], pos: [0, 0.5, 0], color: RED },
      ] },
    // うちがま（ぎんいろのなべ）。ふたを先に付けると、もう入らない
    { id: 'pot', on: ['body'],
      shapes: [
        { type: 'tube', size: [1.15, 1.1], pos: [0, 0.9, 0], color: '#b9bfc7', mat: 'metal' },
        { type: 'cyl', size: [1.15, 0.05], pos: [0, 0.375, 0], color: '#b9bfc7', mat: 'metal' },
        { type: 'torus', size: [1.15, 0.05], pos: [0, 1.45, 0], rot: [90, 0, 0], color: '#d6dae0', mat: 'metal' },
      ] },
    // ごはん（なべの中）。ふたを先に付けると、もう入らない
    { id: 'rice', on: ['pot'],
      shapes: [
        { type: 'cyl', size: [1.08, 0.6], pos: [0, 0.7, 0], color: '#fbf7e6' },
        { type: 'sphere', size: [0.48], half: true, pos: [0, 1.0, 0], color: '#fffdf5' },
      ] },
    // ふた（だんだんの まるい形）。先に付けると、うちがまとごはんはもう入らない
    { id: 'lid', on: ['body'], closes: ['pot', 'rice'],
      shapes: [
        { type: 'cyl', size: [1.34, 0.22], pos: [0, 1.63, 0], color: CREAM },
        { type: 'cyl', size: [1.1, 0.16], pos: [0, 1.82, 0], color: CREAM2 },
        { type: 'cyl', size: [0.7, 0.1], pos: [0, 1.95, 0], color: CREAM },
        { type: 'torus', size: [1.34, 0.05], pos: [0, 1.52, 0], rot: [90, 0, 0], color: RED },
      ] },
    // ふたの上の ゆげのあな（できたとき、ここから湯気が出る）
    { id: 'vent', on: ['lid'],
      shapes: [
        { type: 'cyl', size: [0.16, 0.14], pos: [0, 2.07, 0], color: RED },
        { type: 'cyl', size: [0.09, 0.1], pos: [0, 2.19, 0], color: RED2 },
      ] },
    // ふたのとって（まえ）
    { id: 'handle', on: ['lid'],
      shapes: [
        { type: 'rbox', size: [0.8, 0.22, 0.32], pos: [0, 1.66, 1.52], color: RED, r: 0.06 },
      ] },
    // まえのパネル（ひょうじ と ランプ）
    { id: 'panel', on: ['body'],
      shapes: [
        { type: 'rbox', size: [1.1, 0.5, 0.22], pos: [0, 0.82, 1.3], color: PANEL, r: 0.05 },
        { type: 'rbox', size: [0.5, 0.12, 0.04], pos: [-0.2, 0.93, 1.42], color: '#7fe0a8', r: 0.015 },
        { type: 'sphere', size: [0.045], pos: [0.25, 0.93, 1.42], color: '#f2c84b' },
        { type: 'sphere', size: [0.045], pos: [0.4, 0.93, 1.42], color: '#5fd27a' },
      ] },
    btn('btn1', -0.25), btn('btn2', 0.25),
    // でんげんコード（みぎがわ）
    { id: 'cord', on: ['base'],
      shapes: [
        { type: 'cyl', size: [0.055, 0.5], pos: [1.65, 0.06, 0.15], rot: [0, 0, 90], color: '#2b2d30' },
        { type: 'rbox', size: [0.3, 0.16, 0.22], pos: [2.05, 0.08, 0.15], color: '#2b2d30', r: 0.04 },
      ] },
  ],
  finale: { type: 'steam', at: 'vent' },   // ゆげのあなから、湯気が立ちのぼる
});
