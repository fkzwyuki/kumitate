// No.19 じどうはんばいき（16部品、★★★、どうろ、できたとき＝ジュースがぽんと飛び出して、中のあかりが光る）
// まえのガラスを付けると、たな・ジュース×6は もう入らない／やねを付けると、あかりは もう入らない／
// ボタンのパネルを付けると、コインのはこは もう入らない（入れ忘れのわな3か所）。
// ジュースは色と形だけ（商品名・マークは描かない）。色がちがえば別の kind
import '../config.js?v=6250ca2';

const BODY = '#e8ecef', BLUE = '#3c7fd0', DARK = '#2b2d30', SILVER = '#cfd3d8', GLASS = '#d4eef5';

// ジュース1本（ペットボトルの形）。色ちがいは別の kind。x はよこの位置、y は たなの上の高さ
const juice = (id, kind, color, shelfId, x, shelfY) => {
  const y0 = shelfY + 0.025;                            // たなの上の面
  return {
    id, kind, on: [shelfId],
    shapes: [
      { type: 'cyl', size: [0.12, 0.3], pos: [x, y0 + 0.15, 0], color },
      { type: 'torus', size: [0.125, 0.02], pos: [x, y0 + 0.15, 0], rot: [90, 0, 0], color: '#ffffff' },
      { type: 'cone', size: [0.12, 0.1], pos: [x, y0 + 0.35, 0], color },
      { type: 'cyl', size: [0.045, 0.07], pos: [x, y0 + 0.435, 0], color: '#e9f2f6' },
      { type: 'cyl', size: [0.055, 0.05], pos: [x, y0 + 0.495, 0], color: '#ffffff' },
    ],
  };
};

// たな（2まいとも同じ形：kind 'shelf'。高さだけちがう）
const shelf = (id, y) => ({
  id, kind: 'shelf', on: ['body'],
  shapes: [
    { type: 'rbox', size: [1.3, 0.05, 0.9], pos: [-0.25, y, -0.025], color: '#b9c1c8', mat: 'metal', r: 0.015 },
  ],
});

const R = '#e0443a', B = '#3c9be0', G = '#4cc76a';

KP.models.push({
  id: 'vending', no: 19, name: 'じどうはんばいき', room: 'douro',
  parts: [
    // 最初に付けられるのは「だい」だけ
    { id: 'base', on: [],
      shapes: [
        { type: 'rbox', size: [2.2, 0.3, 1.3], pos: [0, 0.15, 0], color: '#6b7078', r: 0.04 },
      ] },
    // ほんたい（うしろ・ひだり・みぎ・ゆか。まえはあいている）
    { id: 'body', on: ['base'],
      shapes: [
        { type: 'rbox', size: [2.0, 2.7, 0.1], pos: [0, 1.65, -0.5], color: BODY, r: 0.03 },
        { type: 'rbox', size: [0.1, 2.7, 1.1], pos: [-0.95, 1.65, 0], color: BODY, r: 0.03 },
        { type: 'rbox', size: [0.1, 2.7, 1.1], pos: [0.95, 1.65, 0], color: BODY, r: 0.03 },
        { type: 'rbox', size: [1.8, 0.1, 1.0], pos: [0, 0.35, 0], color: '#c9ced3', r: 0.02 },
      ] },
    // たな（2まい）。まえのガラスを先に付けると、もう入らない
    shelf('shelf1', 2.1), shelf('shelf2', 1.3),
    // ジュース×6（赤・青・みどり が2本ずつ。うえとしたの たなに1本ずつ）。まえのガラスを先に付けると、もう入らない
    juice('juiceR1', 'juiceR', R, 'shelf1', -0.7, 2.1), juice('juiceR2', 'juiceR', R, 'shelf2', -0.7, 1.3),
    juice('juiceB1', 'juiceB', B, 'shelf1', -0.35, 2.1), juice('juiceB2', 'juiceB', B, 'shelf2', -0.35, 1.3),
    juice('juiceG1', 'juiceG', G, 'shelf1', 0, 2.1), juice('juiceG2', 'juiceG', G, 'shelf2', 0, 1.3),
    // なかのあかり（うしろの かべの白いパネル。できたとき光る）。やねを先に付けると、もう入らない
    { id: 'lamp', on: ['body'],
      shapes: [
        { type: 'rbox', size: [1.3, 0.7, 0.03], pos: [-0.25, 2.5, -0.43], color: '#e6f7ff', r: 0.01 },
        { type: 'rbox', size: [1.3, 0.7, 0.03], pos: [-0.25, 1.7, -0.43], color: '#e6f7ff', r: 0.01 },
      ] },
    // やね（ひさしつき）。先に付けると、あかりは もう入らない
    { id: 'roof', on: ['body'], closes: ['lamp'],
      shapes: [
        { type: 'rbox', size: [2.2, 0.25, 1.3], pos: [0, 3.125, 0], color: BLUE, r: 0.05 },
        { type: 'rbox', size: [2.2, 0.1, 0.14], pos: [0, 3.0, 0.62], color: '#2f66aa', r: 0.03 },
      ] },
    // まえのガラス（わくつき）。先に付けると、たな・ジュースは もう入らない
    { id: 'glass', on: ['body'], closes: ['shelf1', 'shelf2', 'juiceR1', 'juiceR2', 'juiceB1', 'juiceB2', 'juiceG1', 'juiceG2'],
      shapes: [
        { type: 'rbox', size: [1.3, 1.7, 0.03], pos: [-0.25, 2.05, 0.5], color: GLASS, mat: 'glass', r: 0.01 },
        { type: 'rbox', size: [1.3, 0.1, 0.06], pos: [-0.25, 2.95, 0.5], color: '#2f66aa', r: 0.02 },
        { type: 'rbox', size: [1.3, 0.1, 0.06], pos: [-0.25, 1.15, 0.5], color: '#2f66aa', r: 0.02 },
        { type: 'rbox', size: [0.08, 1.9, 0.06], pos: [-0.86, 2.05, 0.5], color: '#2f66aa', r: 0.02 },
        { type: 'rbox', size: [0.08, 1.9, 0.06], pos: [0.36, 2.05, 0.5], color: '#2f66aa', r: 0.02 },
      ] },
    // コインのはこ（みぎの かべの中）。ボタンのパネルを先に付けると、もう入らない
    { id: 'coinbox', on: ['body'],
      shapes: [
        { type: 'rbox', size: [0.4, 0.55, 0.3], pos: [0.65, 1.9, 0.15], color: '#7a828a', mat: 'metal', r: 0.03 },
        { type: 'cyl', size: [0.06, 0.4], pos: [0.65, 1.45, 0.15], color: '#b9c1c8', mat: 'metal' },
      ] },
    // ボタンのパネル（みぎの たて長い板。ひょうじ・ボタン・コインのいれぐち）。先に付けると、コインのはこは もう入らない
    { id: 'panel', on: ['body'], closes: ['coinbox'],
      shapes: [
        { type: 'rbox', size: [0.5, 2.7, 0.06], pos: [0.65, 1.65, 0.5], color: '#f4f6f8', r: 0.03 },
        { type: 'rbox', size: [0.34, 0.2, 0.04], pos: [0.65, 2.7, 0.54], color: '#1d2b3a', r: 0.02 },
        { type: 'cyl', size: [0.05, 0.04], pos: [0.5, 2.3, 0.54], rot: [90, 0, 0], color: '#e0443a' },
        { type: 'cyl', size: [0.05, 0.04], pos: [0.65, 2.3, 0.54], rot: [90, 0, 0], color: '#3c9be0' },
        { type: 'cyl', size: [0.05, 0.04], pos: [0.8, 2.3, 0.54], rot: [90, 0, 0], color: '#4cc76a' },
        { type: 'rbox', size: [0.22, 0.06, 0.04], pos: [0.65, 1.9, 0.54], color: DARK, r: 0.02 },
        { type: 'rbox', size: [0.2, 0.2, 0.04], pos: [0.65, 1.4, 0.54], color: '#aeb6bd', r: 0.02 },
      ] },
    // とりだしぐち（まえの下）
    { id: 'outlet', on: ['body'],
      shapes: [
        { type: 'rbox', size: [1.3, 0.8, 0.06], pos: [-0.25, 0.7, 0.5], color: '#3c7fd0', r: 0.03 },
        { type: 'rbox', size: [1.0, 0.34, 0.09], pos: [-0.25, 0.6, 0.5], color: '#1b1f24', r: 0.03 },
      ] },
  ],
  finale: [
    { type: 'pop', part: ['juiceR1', 'juiceB1', 'juiceG1', 'juiceR2', 'juiceB2', 'juiceG2'] },   // ジュースがぽんと飛び出す
    { type: 'light', parts: ['lamp'] },                                                          // 中のあかりが光る
  ],
});
