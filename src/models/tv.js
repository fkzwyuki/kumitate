// No.15 テレビ（台つき）（15部品、★★、へや、できたとき＝画面が光る）
// 左右のガラスの戸を付けると、台の中のもの（ゲームき・ゲームのケース・本）はもう入らない（入れ忘れのわな2か所）。
// 商品名・マークは描かない
import '../config.js?v=6250ca2';

const WOOD = '#c98f5a', WOOD_D = '#a97545', LEG = '#6b4a2b', BLACK = '#2b2d30', GLASS = '#bfe6ef', GOLD = '#e0b04a';

// ゲームのケース（2つとも同じ形：kind 'case'）。立ててならべる
const gcase = (id, x) => ({
  id, kind: 'case', on: ['cab'],
  shapes: [
    { type: 'rbox', size: [0.28, 0.42, 0.07], pos: [x, 0.43, 0.15], color: '#3d7de0', r: 0.02 },
    { type: 'rbox', size: [0.2, 0.14, 0.09], pos: [x, 0.5, 0.15], color: '#ffffff', r: 0.02 },
  ],
});

// スピーカー（左右おなじ形：kind 'speaker'）
const speaker = (id, x) => ({
  id, kind: 'speaker', on: ['cab'],
  shapes: [
    { type: 'rbox', size: [0.4, 0.8, 0.4], pos: [x, 1.62, 0], color: '#4a4f57', r: 0.04 },
    { type: 'cyl', size: [0.13, 0.04], pos: [x, 1.45, 0.21], rot: [90, 0, 0], color: BLACK },
    { type: 'cyl', size: [0.06, 0.04], pos: [x, 1.85, 0.21], rot: [90, 0, 0], color: BLACK },
  ],
});

// ガラスの戸。x0〜x1 がはば。ふちの木のわく＋ガラス
const glassDoor = (id, x0, x1, closes) => {
  const w = x1 - x0, cx = (x0 + x1) / 2, iw = w - 0.2;
  return {
    id, on: ['cab'], closes,
    shapes: [
      { type: 'rbox', size: [0.1, 0.9, 0.05], pos: [x0 + 0.05, 0.67, 0.58], color: WOOD, r: 0.02 },
      { type: 'rbox', size: [0.1, 0.9, 0.05], pos: [x1 - 0.05, 0.67, 0.58], color: WOOD, r: 0.02 },
      { type: 'rbox', size: [iw, 0.1, 0.05], pos: [cx, 1.07, 0.58], color: WOOD, r: 0.02 },
      { type: 'rbox', size: [iw, 0.1, 0.05], pos: [cx, 0.27, 0.58], color: WOOD, r: 0.02 },
      { type: 'rbox', size: [iw, 0.7, 0.03], pos: [cx, 0.67, 0.58], color: GLASS, mat: 'glass', r: 0.01 },
    ],
  };
};

// とって（2つとも同じ形：kind 'knob'）。戸のまんなか側のわくに付く
const knob = (id, doorId, x) => ({
  id, kind: 'knob', on: [doorId],
  shapes: [{ type: 'cyl', size: [0.07, 0.06], pos: [x, 0.67, 0.635], rot: [90, 0, 0], color: GOLD, mat: 'metal' }],
});

KP.models.push({
  id: 'tv', no: 15, name: 'テレビ', room: 'heya',
  parts: [
    // 最初に付けられるのは「だいのゆか」だけ
    { id: 'floor', on: [],
      shapes: [
        { type: 'rbox', size: [3.6, 0.1, 1.1], pos: [0, 0.17, 0], color: WOOD_D, r: 0.03 },
        { type: 'cyl', size: [0.07, 0.12], pos: [-1.6, 0.06, 0.4], color: LEG },
        { type: 'cyl', size: [0.07, 0.12], pos: [1.6, 0.06, 0.4], color: LEG },
        { type: 'cyl', size: [0.07, 0.12], pos: [-1.6, 0.06, -0.4], color: LEG },
        { type: 'cyl', size: [0.07, 0.12], pos: [1.6, 0.06, -0.4], color: LEG },
      ] },
    // テレビだいの はこ（うしろ・ひだり・みぎ・うえ・まんなかのしきり。まえはあいている）
    { id: 'cab', on: ['floor'],
      shapes: [
        { type: 'rbox', size: [3.4, 0.9, 0.08], pos: [0, 0.67, -0.51], color: WOOD, r: 0.02 },
        { type: 'rbox', size: [0.1, 0.9, 1.1], pos: [-1.75, 0.67, 0], color: WOOD, r: 0.03 },
        { type: 'rbox', size: [0.1, 0.9, 1.1], pos: [1.75, 0.67, 0], color: WOOD, r: 0.03 },
        { type: 'rbox', size: [3.6, 0.1, 1.1], pos: [0, 1.17, 0], color: WOOD, r: 0.03 },
        { type: 'rbox', size: [0.08, 0.9, 1.02], pos: [0.5, 0.67, 0.04], color: WOOD, r: 0.02 },
      ] },
    // ゲームき（本体・みどりのランプ・コントローラ）。戸を先に付けると、もう入らない
    { id: 'console', on: ['cab'],
      shapes: [
        { type: 'rbox', size: [0.9, 0.16, 0.6], pos: [-1.1, 0.3, -0.15], color: '#3b4048', r: 0.03 },
        { type: 'rbox', size: [0.6, 0.02, 0.05], pos: [-1.1, 0.385, 0.05], color: '#5fd27a', r: 0.008 },
        { type: 'rbox', size: [0.35, 0.06, 0.2], pos: [-1.1, 0.25, 0.3], color: '#f2f2f2', r: 0.025 },
        { type: 'cyl', size: [0.04, 0.04], pos: [-1.2, 0.3, 0.3], color: '#2b2d30' },
        { type: 'cyl', size: [0.04, 0.04], pos: [-1.0, 0.3, 0.3], color: '#2b2d30' },
      ] },
    gcase('case1', -0.3), gcase('case2', 0.05),
    // 本（ならべた4さつ と ペンたて）。戸を先に付けると、もう入らない
    { id: 'books', on: ['cab'],
      shapes: [
        { type: 'rbox', size: [0.12, 0.5, 0.34], pos: [0.7, 0.47, 0.05], color: '#e0524a', r: 0.03 },
        { type: 'rbox', size: [0.12, 0.44, 0.34], pos: [0.85, 0.44, 0.05], color: '#4aa3df', r: 0.03 },
        { type: 'rbox', size: [0.12, 0.52, 0.34], pos: [1.0, 0.48, 0.05], color: '#f5c542', r: 0.03 },
        { type: 'rbox', size: [0.12, 0.46, 0.34], pos: [1.15, 0.45, 0.05], color: '#5fd27a', r: 0.03 },
        { type: 'cyl', size: [0.13, 0.3], pos: [1.45, 0.37, 0.05], color: '#8fd0a8' },
      ] },
    // ガラスの戸（左は ゲームきとケースを、右は 本を閉じる）
    glassDoor('doorL', -1.7, 0.46, ['console', 'case1', 'case2']),
    glassDoor('doorR', 0.54, 1.7, ['books']),
    knob('knobL', 'doorL', 0.41), knob('knobR', 'doorR', 0.59),
    // スピーカー（だいの上、テレビの左右）
    speaker('speaker1', -1.5), speaker('speaker2', 1.5),
    // テレビのあし（さら と くび）
    { id: 'neck', on: ['cab'],
      shapes: [
        { type: 'rbox', size: [1.0, 0.08, 0.5], pos: [0, 1.26, 0], color: BLACK, r: 0.03 },
        { type: 'rbox', size: [0.3, 0.32, 0.15], pos: [0, 1.46, 0], color: BLACK, r: 0.03 },
      ] },
    // テレビのわく（まわりの4本と、うしろのでっぱり）
    { id: 'tv', on: ['neck'],
      shapes: [
        { type: 'rbox', size: [0.12, 1.4, 0.14], pos: [-1.14, 2.3, 0], color: BLACK, r: 0.04 },
        { type: 'rbox', size: [0.12, 1.4, 0.14], pos: [1.14, 2.3, 0], color: BLACK, r: 0.04 },
        { type: 'rbox', size: [2.16, 0.12, 0.14], pos: [0, 2.94, 0], color: BLACK, r: 0.04 },
        { type: 'rbox', size: [2.16, 0.18, 0.14], pos: [0, 1.69, 0], color: BLACK, r: 0.04 },
        { type: 'rbox', size: [2.0, 1.0, 0.12], pos: [0, 2.3, -0.13], color: '#3a3e44', r: 0.04 },
      ] },
    // がめん（できたとき光る。山と太陽の絵）
    { id: 'screen', on: ['tv'],
      shapes: [
        { type: 'rbox', size: [2.16, 1.1, 0.04], pos: [0, 2.33, 0], color: '#27405e', r: 0.01 },
        { type: 'rbox', size: [2.16, 0.3, 0.045], pos: [0, 1.93, 0], color: '#2f7a4a', r: 0.01 },
        { type: 'sphere', size: [0.14], pos: [-0.6, 2.65, 0.03], color: '#f7d34a' },
      ] },
  ],
  finale: { type: 'light', parts: ['screen'] },   // 画面が光る
});
