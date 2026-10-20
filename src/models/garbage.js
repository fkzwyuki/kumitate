// No.25 ごみしゅうしゅうしゃ（16部品、★★★、どうろ、できたとき＝タイヤが回って少し走って、もどる）
// 車の前は +x（drive の dir:1・axis:'z'）。タイヤの軸は z。みどりの車体（会社のマーク・文字は描かない）。
// 入れ忘れのわな: うんてんせきのやね→うんてんしゅ、うしろのふた→ごみぶくろ×3、うえのふた→ごみぶくろ×3
import '../config.js?v=6250ca2';

const GREEN = '#35a35b', GREEN2 = '#2b8a4b', WHITE = '#f4f6f8', DARK = '#3a3f47', GLASS = '#8fd3f5', SILVER = '#c8ccd2', YELLOW = '#ffd23f', BLUE = '#3b5ba5', SKIN = '#f2c9a0';

// タイヤ（4本とも同じ形：kind 'tire'）。軸は z。ホイールの黄色い棒が回って見える
const tire = (id, x, z) => ({
  id, kind: 'tire', on: ['chassis'],
  shapes: [
    { type: 'cyl', size: [0.42, 0.3], pos: [x, 0.42, z], rot: [90, 0, 0], color: '#2b2d30' },
    { type: 'cyl', size: [0.22, 0.34], pos: [x, 0.42, z], rot: [90, 0, 0], color: SILVER, mat: 'metal' },
    { type: 'rbox', size: [0.34, 0.09, 0.38], pos: [x, 0.42, z], color: YELLOW, r: 0.02 },
  ],
});
// ごみぶくろ（3つとも同じ形：kind 'bag'）。ふくらんだ袋と、上のむすびめ
const bag = (id, x, z) => ({
  id, kind: 'bag', on: ['box'],
  shapes: [
    { type: 'rbox', size: [0.6, 0.6, 0.55], pos: [x, 1.19, z], color: '#2f3b46', r: 0.25 },
    { type: 'sphere', size: [0.1], pos: [x, 1.55, z], color: '#2f3b46' },
    { type: 'torus', size: [0.07, 0.025], pos: [x, 1.47, z], rot: [90, 0, 0], color: YELLOW },
  ],
});

KP.models.push({
  id: 'garbage', no: 25, name: 'ごみしゅうしゅうしゃ', room: 'douro',
  parts: [
    // 最初に付けられるのは「だい」だけ（バンパーも入っている）
    { id: 'chassis', on: [],
      shapes: [
        { type: 'rbox', size: [5.0, 0.3, 1.6], pos: [0, 0.62, 0], color: DARK, r: 0.06 },
        { type: 'rbox', size: [0.22, 0.28, 1.8], pos: [2.6, 0.6, 0], color: SILVER, mat: 'metal', r: 0.05 },
        { type: 'rbox', size: [0.14, 0.2, 1.6], pos: [-2.57, 0.6, 0], color: DARK, r: 0.04 },
      ] },
    tire('tire1', 1.7, 0.93), tire('tire2', 1.7, -0.93), tire('tire3', -1.3, 0.93), tire('tire4', -1.3, -0.93),
    // うんてんせき（ひくいかべ・うしろのかべ・ダッシュボード・ハンドル・ライト）。なかは、やねをのせるまで見える
    { id: 'cab', on: ['chassis'],
      shapes: [
        { type: 'rbox', size: [1.5, 0.65, 1.6], pos: [1.7, 1.095, 0], color: GREEN, r: 0.06 },
        { type: 'rbox', size: [0.12, 0.93, 1.6], pos: [0.99, 1.885, 0], color: GREEN, r: 0.04 },
        { type: 'rbox', size: [0.14, 0.2, 1.5], pos: [2.25, 1.52, 0], color: DARK, r: 0.04 },
        { type: 'cyl', size: [0.04, 0.4], pos: [1.98, 1.62, 0], color: DARK },
        { type: 'torus', size: [0.17, 0.04], pos: [1.98, 1.8, 0], rot: [0, 90, 0], color: DARK },
        { type: 'sphere', size: [0.11], pos: [2.47, 1.0, 0.55], color: '#ffe066' },
        { type: 'sphere', size: [0.11], pos: [2.47, 1.0, -0.55], color: '#ffe066' },
      ] },
    // うんてんしゅ（ヘルメットをかぶっている）
    { id: 'driver', on: ['cab'],
      shapes: [
        { type: 'cyl', size: [0.22, 0.4], pos: [1.55, 1.62, 0], color: BLUE },
        { type: 'sphere', size: [0.2], pos: [1.55, 1.98, 0], color: SKIN },
        { type: 'sphere', half: true, size: [0.23], pos: [1.55, 2.0, 0], color: YELLOW },
      ] },
    // うんてんせきの やね（先にのせると、うんてんしゅは もう入らない）。まえのはしら・フロントガラスつき
    { id: 'cabRoof', on: ['cab'], closes: ['driver'],
      shapes: [
        { type: 'rbox', size: [1.6, 0.12, 1.8], pos: [1.75, 2.36, 0], color: WHITE, r: 0.05 },
        { type: 'rbox', size: [0.1, 0.93, 0.1], pos: [2.4, 1.885, 0.75], color: WHITE, r: 0.02 },
        { type: 'rbox', size: [0.1, 0.93, 0.1], pos: [2.4, 1.885, -0.75], color: WHITE, r: 0.02 },
        { type: 'rbox', size: [0.05, 0.82, 1.4], pos: [2.42, 1.85, 0], color: GLASS, mat: 'glass', r: 0.02 },
      ] },
    // かいてんとう（きいろ）。うんてんせきのやねの上
    { id: 'beacon', on: ['cabRoof'],
      shapes: [
        { type: 'cyl', size: [0.13, 0.07], pos: [1.5, 2.455, 0], color: DARK },
        { type: 'sphere', half: true, size: [0.16], pos: [1.5, 2.49, 0], color: '#ffb020' },
      ] },
    // はいきかん（うんてんせきのうしろ。ぎんいろのぼう）
    { id: 'exhaust', on: ['chassis'],
      shapes: [
        { type: 'cyl', size: [0.07, 1.73], pos: [0.78, 1.635, -0.62], color: SILVER, mat: 'metal' },
        { type: 'cyl', size: [0.09, 0.08], pos: [0.78, 2.54, -0.62], color: DARK },
        { type: 'rbox', size: [0.2, 0.12, 0.2], pos: [0.78, 0.83, -0.62], color: DARK, r: 0.03 },
      ] },
    // ごみばこ（ゆか・まえのかべ・むこうがわのかべ・手前のひくいかべ）。うしろと上はあいている。白い線つき
    { id: 'box', on: ['chassis'],
      shapes: [
        { type: 'rbox', size: [3.2, 0.12, 1.6], pos: [-0.95, 0.83, 0], color: GREEN2, r: 0.03 },
        { type: 'rbox', size: [0.1, 1.5, 1.6], pos: [0.6, 1.64, 0], color: GREEN, r: 0.03 },
        { type: 'rbox', size: [3.2, 1.5, 0.1], pos: [-0.95, 1.64, -0.75], color: GREEN, r: 0.03 },
        { type: 'rbox', size: [3.2, 0.6, 0.1], pos: [-0.95, 1.19, 0.75], color: GREEN, r: 0.03 },
        { type: 'rbox', size: [3.2, 0.12, 0.03], pos: [-0.95, 1.19, 0.815], color: WHITE, r: 0.01 },
        { type: 'rbox', size: [3.2, 0.12, 0.03], pos: [-0.95, 1.4, -0.815], color: WHITE, r: 0.01 },
      ] },
    bag('bag1', -2.0, -0.15), bag('bag2', -1.2, 0.2), bag('bag3', -0.4, -0.2),
    // うしろのふた（先に付けると、ごみぶくろは もう入らない）。きいろいランプと、とって
    { id: 'rearLid', on: ['box'], closes: ['bag1', 'bag2', 'bag3'],
      shapes: [
        { type: 'rbox', size: [0.1, 1.5, 1.6], pos: [-2.6, 1.64, 0], color: GREEN, r: 0.03 },
        { type: 'rbox', size: [0.04, 0.12, 1.4], pos: [-2.67, 1.0, 0], color: YELLOW, r: 0.01 },
        { type: 'rbox', size: [0.06, 0.2, 0.2], pos: [-2.68, 2.1, 0.55], color: '#d9302a', r: 0.02 },
        { type: 'rbox', size: [0.06, 0.2, 0.2], pos: [-2.68, 2.1, -0.55], color: '#d9302a', r: 0.02 },
        { type: 'rbox', size: [0.08, 0.1, 0.5], pos: [-2.68, 1.64, 0], color: SILVER, mat: 'metal', r: 0.02 },
      ] },
    // うえのふた（先に付けると、ごみぶくろは もう入らない）。手前のよこがわもおおう
    { id: 'topLid', on: ['box'], closes: ['bag1', 'bag2', 'bag3'],
      shapes: [
        { type: 'rbox', size: [3.3, 0.12, 1.75], pos: [-0.95, 2.45, 0], color: GREEN, r: 0.05 },
        { type: 'rbox', size: [3.2, 0.9, 0.06], pos: [-0.95, 1.94, 0.78], color: GREEN, r: 0.02 },
        { type: 'rbox', size: [3.0, 0.1, 0.12], pos: [-0.95, 2.56, 0], color: GREEN2, r: 0.03 },
      ] },
  ],
  finale: { type: 'drive', wheels: 'tire', axis: 'z', dir: 1 },   // タイヤが回って、前（+x）へ少し走って、もどる
});
