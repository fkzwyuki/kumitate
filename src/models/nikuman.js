// No.22 にくまんケース（15部品、★★、へや、できたとき＝あたたかい湯気が立ちのぼる）
// ガラスの戸を付けると、にくまん・あんまん×6は もう入らない／てんじょうを付けると、あかりは もう入らない（入れ忘れのわな2か所）。
// ガラス張りの せいろ風のケース。店の名前・マークは描かない
import '../config.js?v=6250ca2';

const BAMBOO = '#d9b36c', WOOD = '#8a5a35', GLASS = '#d4eef5', FRAME = '#6b3f26';

// たな（2まいとも同じ形：kind 'shelf'。高さだけちがう）
const shelf = (id, y) => ({
  id, kind: 'shelf', on: ['body'],
  shapes: [
    { type: 'rbox', size: [2.16, 0.08, 1.1], pos: [0, y, 0.05], color: BAMBOO, r: 0.02 },
    { type: 'rbox', size: [2.16, 0.14, 0.06], pos: [0, y + 0.03, 0.6], color: '#b88a4a', r: 0.02 },
  ],
});

// まんじゅう1こ（ドームの形）。kind は にくまん(niku)・あんまん(an)。にくまんは白くて てっぺんにひだ、あんまんは うすい茶色でごま
const bun = (id, kind, shelfId, x, shelfY) => {
  const y0 = shelfY + 0.04, niku = kind === 'niku';
  return {
    id, kind, on: [shelfId],
    shapes: [
      { type: 'cyl', size: [0.3, 0.12], pos: [x, y0 + 0.06, 0.05], color: niku ? '#fbf4e6' : '#e6bf86' },
      { type: 'sphere', size: [0.3], pos: [x, y0 + 0.12, 0.05], half: true, color: niku ? '#fbf4e6' : '#e6bf86' },
      niku ? { type: 'sphere', size: [0.06], pos: [x, y0 + 0.42, 0.05], color: '#efe2c8' }
           : { type: 'sphere', size: [0.045], pos: [x, y0 + 0.42, 0.05], color: '#3a2a22' },
    ],
  };
};

KP.models.push({
  id: 'nikuman', no: 22, name: 'にくまんケース', room: 'heya',
  parts: [
    // 最初に付けられるのは「だい」だけ
    { id: 'base', on: [],
      shapes: [
        { type: 'rbox', size: [2.8, 0.3, 1.7], pos: [0, 0.15, 0], color: '#5b3a24', r: 0.05 },
      ] },
    // ほんたい（うしろ・ひだり・みぎ・ゆか。まえと うえは あいている）
    { id: 'body', on: ['base'],
      shapes: [
        { type: 'rbox', size: [2.4, 2.0, 0.1], pos: [0, 1.3, -0.6], color: WOOD, r: 0.03 },
        { type: 'rbox', size: [0.1, 2.0, 1.2], pos: [-1.15, 1.3, 0.05], color: WOOD, r: 0.03 },
        { type: 'rbox', size: [0.1, 2.0, 1.2], pos: [1.15, 1.3, 0.05], color: WOOD, r: 0.03 },
        { type: 'rbox', size: [2.2, 0.1, 1.2], pos: [0, 0.35, 0.05], color: '#a8723e', r: 0.02 },
      ] },
    // たな×2（せいろの たな）
    shelf('shelf1', 0.55), shelf('shelf2', 1.4),
    // にくまん×3（したの たな）・あんまん×3（うえの たな）。ガラスの戸を先に付けると、もう入らない
    bun('niku1', 'niku', 'shelf1', -0.65, 0.55), bun('niku2', 'niku', 'shelf1', 0, 0.55), bun('niku3', 'niku', 'shelf1', 0.65, 0.55),
    bun('an1', 'an', 'shelf2', -0.65, 1.4), bun('an2', 'an', 'shelf2', 0, 1.4), bun('an3', 'an', 'shelf2', 0.65, 1.4),
    // あかり（うえの オレンジ色の ヒーターランプ2本）。てんじょうを先に付けると、もう入らない
    { id: 'lamp', on: ['body'],
      shapes: [
        { type: 'rbox', size: [1.9, 0.08, 0.3], pos: [0, 2.2, -0.2], color: '#ffb347', r: 0.03 },
        { type: 'rbox', size: [1.9, 0.08, 0.3], pos: [0, 2.2, 0.35], color: '#ffb347', r: 0.03 },
      ] },
    // てんじょう（ケースの ふた。まんなかに ゆげの でぐち）。先に付けると、あかりは もう入らない
    { id: 'roof', on: ['body'], closes: ['lamp'],
      shapes: [
        { type: 'rbox', size: [2.5, 0.14, 1.4], pos: [0, 2.37, 0.05], color: FRAME, r: 0.05 },
        { type: 'cyl', size: [0.12, 0.2], pos: [0, 2.54, 0.05], color: '#8d949b', mat: 'metal' },
      ] },
    // ガラスの戸（まえ。ガラス＋わく）。先に付けると、にくまん・あんまんは もう入らない
    { id: 'door', on: ['body'], closes: ['niku1', 'niku2', 'niku3', 'an1', 'an2', 'an3'],
      shapes: [
        { type: 'rbox', size: [2.2, 1.78, 0.03], pos: [0, 1.4, 0.7], color: GLASS, mat: 'glass', r: 0.01 },
        { type: 'rbox', size: [2.4, 0.1, 0.08], pos: [0, 2.29, 0.7], color: FRAME, r: 0.03 },
        { type: 'rbox', size: [2.4, 0.1, 0.08], pos: [0, 0.51, 0.7], color: FRAME, r: 0.03 },
        { type: 'rbox', size: [0.1, 1.9, 0.08], pos: [-1.15, 1.4, 0.7], color: FRAME, r: 0.03 },
        { type: 'rbox', size: [0.1, 1.9, 0.08], pos: [1.15, 1.4, 0.7], color: FRAME, r: 0.03 },
      ] },
    // とって（ガラスの戸の みぎ）
    { id: 'handle', on: ['door'],
      shapes: [
        { type: 'rbox', size: [0.07, 0.5, 0.07], pos: [0.9, 1.4, 0.82], color: '#b9c1c8', mat: 'metal', r: 0.025 },
        { type: 'cyl', size: [0.03, 0.1], pos: [0.9, 1.6, 0.76], rot: [90, 0, 0], color: '#b9c1c8', mat: 'metal' },
        { type: 'cyl', size: [0.03, 0.1], pos: [0.9, 1.2, 0.76], rot: [90, 0, 0], color: '#b9c1c8', mat: 'metal' },
      ] },
    // おんどのダイヤル（だいの まえ）
    { id: 'dial', on: ['base'],
      shapes: [
        { type: 'rbox', size: [0.5, 0.2, 0.04], pos: [0.9, 0.15, 0.87], color: '#2b2d30', r: 0.02 },
        { type: 'cyl', size: [0.08, 0.08], pos: [0.9, 0.15, 0.91], rot: [90, 0, 0], color: '#e0443a' },
      ] },
  ],
  finale: { type: 'steam', at: 'roof', spread: 0.2 },    // てんじょうの でぐちから湯気
});
