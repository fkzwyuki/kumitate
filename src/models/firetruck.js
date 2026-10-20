// No.8 しょうぼうしゃ（16部品、★★★、どうろ、できたとき＝タイヤが回って少し走って、もどる）
// 車の前は +x（drive の dir:1・axis:'z'）。タイヤの軸は z。
// 入れ忘れのわな: うんてんせきのやね→うんてんしゅ・ハンドル、まどガラス→うんてんしゅ、はしご→ホース（はしごの下にホースをしまう）
import '../config.js?v=6250ca2';

const RED = '#e5483f', RED2 = '#c9443d', DARK = '#3a3f47', GLASS = '#8fd3f5', YELLOW = '#ffd23f', SILVER = '#c8ccd2', WHITE = '#f4f6f8', BLUE = '#3b5ba5', SKIN = '#f2c9a0';

// タイヤ（4本とも同じ形：kind 'tire'）。軸は z。ホイールの黄色い棒が回って見える
const tire = (id, x, z) => ({
  id, kind: 'tire', on: ['chassis'],
  shapes: [
    { type: 'cyl', size: [0.42, 0.3], pos: [x, 0.42, z], rot: [90, 0, 0], color: '#2b2d30' },
    { type: 'cyl', size: [0.22, 0.34], pos: [x, 0.42, z], rot: [90, 0, 0], color: SILVER, mat: 'metal' },
    { type: 'rbox', size: [0.34, 0.09, 0.38], pos: [x, 0.42, z], color: '#ffd23f', r: 0.02 },
  ],
});
// まど（左右とも同じ形：kind 'window'）。ガラスと、まんなかの横ぼう。付けると、うんてんしゅはもう入らない
const win = (id, z) => ({
  id, kind: 'window', on: ['cab'], closes: ['driver'],
  shapes: [
    { type: 'rbox', size: [0.95, 0.8, 0.05], pos: [1.45, 1.83, z], color: GLASS, mat: 'glass', r: 0.02 },
    { type: 'rbox', size: [0.95, 0.06, 0.07], pos: [1.45, 1.83, z], color: WHITE, r: 0.01 },
  ],
});
// ランプ（2つとも同じ形：kind 'lamp'）。やねの上
const lamp = (id, z) => ({
  id, kind: 'lamp', on: ['roof'],
  shapes: [
    { type: 'cyl', size: [0.13, 0.07], pos: [1.4, 2.455, z], color: DARK },
    { type: 'sphere', half: true, size: [0.15], pos: [1.4, 2.49, z], color: '#ff3b30' },
  ],
});

KP.models.push({
  id: 'firetruck', no: 8, name: 'しょうぼうしゃ', room: 'douro',
  parts: [
    // 最初に付けられるのは「だい」だけ（バンパーも入っている）
    { id: 'chassis', on: [],
      shapes: [
        { type: 'rbox', size: [4.4, 0.3, 1.6], pos: [0, 0.62, 0], color: RED, r: 0.06 },
        { type: 'rbox', size: [0.22, 0.28, 1.8], pos: [2.3, 0.6, 0], color: SILVER, mat: 'metal', r: 0.05 },
        { type: 'rbox', size: [0.14, 0.2, 1.6], pos: [-2.25, 0.6, 0], color: DARK, r: 0.04 },
      ] },
    tire('tire1', 1.45, 0.93), tire('tire2', 1.45, -0.93), tire('tire3', -1.45, 0.93), tire('tire4', -1.45, -0.93),
    // うんてんせき（ひくいかべ・うしろのかべ・ダッシュボード・ライト）。なかは、やねをのせるまで見える
    { id: 'cab', on: ['chassis'],
      shapes: [
        { type: 'rbox', size: [1.2, 0.6, 1.6], pos: [1.45, 1.07, 0], color: RED, r: 0.06 },
        { type: 'rbox', size: [0.12, 0.93, 1.6], pos: [0.91, 1.835, 0], color: RED, r: 0.04 },
        { type: 'rbox', size: [0.14, 0.2, 1.5], pos: [1.95, 1.47, 0], color: DARK, r: 0.04 },
        { type: 'sphere', size: [0.11], pos: [2.07, 1.0, 0.55], color: '#ffe066' },
        { type: 'sphere', size: [0.11], pos: [2.07, 1.0, -0.55], color: '#ffe066' },
      ] },
    // うんてんしゅ（ヘルメットをかぶっている）
    { id: 'driver', on: ['cab'],
      shapes: [
        { type: 'cyl', size: [0.22, 0.4], pos: [1.3, 1.57, 0], color: BLUE },
        { type: 'sphere', size: [0.2], pos: [1.3, 1.98, 0], color: SKIN },
        { type: 'sphere', half: true, size: [0.23], pos: [1.3, 2.0, 0], color: YELLOW },
      ] },
    // ハンドル（わっかと、ささえるぼう）
    { id: 'handle', on: ['cab'],
      shapes: [
        { type: 'cyl', size: [0.04, 0.4], pos: [1.72, 1.62, 0], color: DARK },
        { type: 'torus', size: [0.17, 0.04], pos: [1.72, 1.8, 0], rot: [0, 90, 0], color: DARK },
      ] },
    // うんてんせきの やね（先にのせると、うんてんしゅとハンドルは もう入らない）
    { id: 'roof', on: ['cab'], closes: ['driver', 'handle'],
      shapes: [
        { type: 'rbox', size: [1.5, 0.12, 1.8], pos: [1.4, 2.36, 0], color: RED2, r: 0.05 },
        { type: 'rbox', size: [0.1, 0.93, 0.1], pos: [2.0, 1.835, 0.75], color: RED2, r: 0.02 },
        { type: 'rbox', size: [0.1, 0.93, 0.1], pos: [2.0, 1.835, -0.75], color: RED2, r: 0.02 },
        { type: 'rbox', size: [0.05, 0.82, 1.4], pos: [2.02, 1.85, 0], color: GLASS, mat: 'glass', r: 0.02 },
      ] },
    win('window1', 0.8), win('window2', -0.8),
    lamp('lamp1', 0.5), lamp('lamp2', -0.5),
    // にだい（ひくいいたで かこった たな）と、はしごのだい
    { id: 'tray', on: ['chassis'],
      shapes: [
        { type: 'rbox', size: [2.8, 0.28, 0.08], pos: [-0.7, 0.91, 0.76], color: RED, r: 0.03 },
        { type: 'rbox', size: [2.8, 0.28, 0.08], pos: [-0.7, 0.91, -0.76], color: RED, r: 0.03 },
        { type: 'rbox', size: [0.08, 0.28, 1.6], pos: [-2.1, 0.91, 0], color: RED, r: 0.03 },
        { type: 'cyl', size: [0.32, 0.1], pos: [-1.55, 0.82, 0], color: DARK },
        { type: 'cyl', size: [0.14, 0.34], pos: [-1.55, 1.04, 0], color: DARK },
      ] },
    // ホース（くるくる巻いたもの）。たなの中
    { id: 'hose', on: ['tray'],
      shapes: [
        { type: 'torus', size: [0.3, 0.08], pos: [-0.3, 0.86, 0], rot: [90, 0, 0], color: YELLOW },
        { type: 'torus', size: [0.3, 0.08], pos: [-0.3, 0.98, 0], rot: [90, 0, 0], color: YELLOW },
        { type: 'cyl', size: [0.07, 0.34], pos: [0.2, 0.95, 0.4], rot: [0, 0, 90], color: SILVER, mat: 'metal' },
      ] },
    // はしご（たなの上にのせる。先にのせると、下のホースは もう入らない）
    { id: 'ladder', on: ['tray'], closes: ['hose'],
      shapes: [
        { type: 'rbox', size: [2.7, 0.1, 0.1], pos: [-0.7, 1.25, 0.33], color: SILVER, mat: 'metal', r: 0.02 },
        { type: 'rbox', size: [2.7, 0.1, 0.1], pos: [-0.7, 1.25, -0.33], color: SILVER, mat: 'metal', r: 0.02 },
        ...[-1.9, -1.4, -0.9, -0.4, 0.1, 0.55].map(x => ({ type: 'rbox', size: [0.07, 0.07, 0.76], pos: [x, 1.25, 0], color: SILVER, mat: 'metal', r: 0.02 })),
      ] },
  ],
  finale: { type: 'drive', wheels: 'tire', axis: 'z', dir: 1 },   // タイヤが回って、前（+x）へ少し走って、もどる
});
