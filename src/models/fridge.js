// No.14 れいぞうこ（15部品、★★、へや、できたとき＝中のあかりが光る）
// ふたつのドア（上＝れいとうこ、下＝れいぞうこ）を付けると、中の たな・たべものは もう入らない（入れ忘れのわな2か所）。
// ドアは すきとおった まどつき（中の食べものとあかりが見えるように）。商品名・マークは描かない
import '../config.js?v=6250ca2';

const MINT = '#a9dcc7', MINT_D = '#6aa892', FRAME = '#c5eadb', GLASS = '#cfe9f2', GRAY = '#59616a';

// たな（2まいとも同じ形：kind 'shelf'。高さだけちがう）
const shelf = (id, y) => ({
  id, kind: 'shelf', on: ['body'],
  shapes: [
    { type: 'rbox', size: [1.7, 0.05, 1.12], pos: [0, y, 0.02], color: '#7fc4d8', mat: 'glass', r: 0.015 },
    { type: 'rbox', size: [1.7, 0.1, 0.04], pos: [0, y, 0.56], color: '#ffffff', r: 0.015 },
  ],
});

// りんご（2こ とも同じ形：kind 'apple'）。下のたなの上
const apple = (id, x, z) => ({
  id, kind: 'apple', on: ['shelf1'],
  shapes: [
    { type: 'sphere', size: [0.17], pos: [x, 0.945, z], color: '#e0443a' },
    { type: 'cyl', size: [0.02, 0.1], pos: [x, 1.135, z], color: '#7a4a2a' },
  ],
});

// ドアのわく（4本）とまど。y0〜y1 がドアの高さ
const door = (id, y0, y1, glassColor, closes) => {
  const h = y1 - y0, cy = (y0 + y1) / 2, bar = h > 1.5 ? 0.2 : 0.18, gh = h - bar * 2;
  return {
    id, on: ['body'], closes,
    shapes: [
      { type: 'rbox', size: [0.2, h, 0.1], pos: [-0.85, cy, 0.78], color: FRAME, r: 0.04 },
      { type: 'rbox', size: [0.2, h, 0.1], pos: [0.85, cy, 0.78], color: FRAME, r: 0.04 },
      { type: 'rbox', size: [1.5, bar, 0.1], pos: [0, y1 - bar / 2, 0.78], color: FRAME, r: 0.04 },
      { type: 'rbox', size: [1.5, bar, 0.1], pos: [0, y0 + bar / 2, 0.78], color: FRAME, r: 0.04 },
      { type: 'rbox', size: [1.5, gh, 0.04], pos: [0, cy, 0.78], color: glassColor, mat: 'glass', r: 0.015 },
    ],
  };
};

// とって（2つとも同じ形：kind 'handle'）。ドアの右のわくに付く
const handle = (id, doorId, y) => ({
  id, kind: 'handle', on: [doorId],
  shapes: [
    { type: 'rbox', size: [0.07, 0.4, 0.07], pos: [0.85, y, 0.965], color: GRAY, mat: 'metal', r: 0.025 },
    { type: 'cyl', size: [0.03, 0.1], pos: [0.85, y + 0.14, 0.88], rot: [90, 0, 0], color: GRAY, mat: 'metal' },
    { type: 'cyl', size: [0.03, 0.1], pos: [0.85, y - 0.14, 0.88], rot: [90, 0, 0], color: GRAY, mat: 'metal' },
  ],
});

KP.models.push({
  id: 'fridge', no: 14, name: 'れいぞうこ', room: 'heya',
  parts: [
    // 最初に付けられるのは「だい」だけ
    { id: 'base', on: [],
      shapes: [
        { type: 'rbox', size: [1.9, 0.2, 1.4], pos: [0, 0.1, 0], color: MINT_D, r: 0.04 },
      ] },
    // ほんたい（うしろ・ひだり・みぎ・うえ と、れいとうこの しきり。まえはあいている）
    { id: 'body', on: ['base'],
      shapes: [
        { type: 'rbox', size: [1.9, 3.1, 0.1], pos: [0, 1.75, -0.65], color: MINT, r: 0.04 },
        { type: 'rbox', size: [0.1, 3.1, 1.4], pos: [-0.9, 1.75, 0], color: MINT, r: 0.04 },
        { type: 'rbox', size: [0.1, 3.1, 1.4], pos: [0.9, 1.75, 0], color: MINT, r: 0.04 },
        { type: 'rbox', size: [1.9, 0.1, 1.4], pos: [0, 3.25, 0], color: MINT, r: 0.04 },
        { type: 'rbox', size: [1.7, 0.08, 1.2], pos: [0, 2.3, 0.03], color: MINT_D, r: 0.03 },
      ] },
    // なかのあかり（うしろの かべの白いパネル。できたとき光る）
    { id: 'lamp', on: ['body'],
      shapes: [
        { type: 'rbox', size: [1.7, 2.06, 0.03], pos: [0, 1.23, -0.585], color: '#e6f7ff', r: 0.01 },
        { type: 'rbox', size: [1.7, 0.86, 0.03], pos: [0, 2.77, -0.585], color: '#e6f7ff', r: 0.01 },
      ] },
    // たな（ガラスの板）。ドアを先に付けると、もう入らない
    shelf('shelf1', 0.75), shelf('shelf2', 1.6),
    // たべもの。ドアを先に付けると、もう入らない
    apple('apple1', -0.5, 0.15), apple('apple2', -0.1, 0.2),
    { id: 'juice', on: ['shelf1'],
      shapes: [
        { type: 'cyl', size: [0.15, 0.5], pos: [0.45, 1.025, 0.1], color: '#f2a33a' },
        { type: 'cyl', size: [0.07, 0.12], pos: [0.45, 1.335, 0.1], color: '#f2a33a' },
        { type: 'cyl', size: [0.085, 0.06], pos: [0.45, 1.425, 0.1], color: '#ffffff' },
      ] },
    // たまご（4こ。トレーつき）
    { id: 'eggs', on: ['shelf2'],
      shapes: [
        { type: 'rbox', size: [0.7, 0.06, 0.3], pos: [-0.45, 1.655, 0.05], color: '#d9c7a0', r: 0.02 },
        { type: 'sphere', size: [0.09], pos: [-0.63, 1.735, 0.05], color: '#f4e6c8' },
        { type: 'sphere', size: [0.09], pos: [-0.54, 1.735, 0.05], color: '#f4e6c8' },
        { type: 'sphere', size: [0.09], pos: [-0.36, 1.735, 0.05], color: '#f4e6c8' },
        { type: 'sphere', size: [0.09], pos: [-0.27, 1.735, 0.05], color: '#f4e6c8' },
      ] },
    // ぎゅうにゅう（パック）
    { id: 'milk', on: ['shelf2'],
      shapes: [
        { type: 'rbox', size: [0.26, 0.46, 0.26], pos: [0.4, 1.855, 0.05], color: '#fafafa', r: 0.02 },
        { type: 'rbox', size: [0.265, 0.14, 0.265], pos: [0.4, 1.8, 0.05], color: '#4aa3df', r: 0.02 },
        { type: 'prism', size: [0.26, 0.12, 0.26], pos: [0.4, 2.145, 0.05], color: '#4aa3df' },
      ] },
    // アイスクリーム（れいとうこの中。ふたつのカップ）
    { id: 'icecream', on: ['body'],
      shapes: [
        { type: 'rbox', size: [0.55, 0.3, 0.42], pos: [-0.3, 2.49, 0.05], color: '#f4a6c0', r: 0.04 },
        { type: 'rbox', size: [0.57, 0.06, 0.44], pos: [-0.3, 2.67, 0.05], color: '#ffffff', r: 0.02 },
        { type: 'rbox', size: [0.3, 0.25, 0.3], pos: [0.35, 2.465, 0.05], color: '#6fb7e8', r: 0.04 },
        { type: 'rbox', size: [0.32, 0.06, 0.32], pos: [0.35, 2.62, 0.05], color: '#ffffff', r: 0.02 },
      ] },
    // ドア。上（れいとうこ）は アイスを、下（れいぞうこ）は たな・たべものを閉じる
    door('doorTop', 2.36, 3.28, '#bfe0f2', ['icecream']),
    door('doorBottom', 0.22, 2.3, GLASS, ['shelf1', 'shelf2', 'apple1', 'apple2', 'juice', 'eggs', 'milk']),
    handle('handleTop', 'doorTop', 2.82), handle('handleBottom', 'doorBottom', 1.7),
  ],
  finale: { type: 'light', parts: ['lamp'] },   // 中のあかりが光る
});
