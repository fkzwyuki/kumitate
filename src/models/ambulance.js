// No.23 きゅうきゅうしゃ（17部品、★★★、どうろ、できたとき＝タイヤが回って少し走って、もどる＋赤いランプが光る）
// 車の前は +x（drive の dir:1・axis:'z'）。タイヤの軸は z。白い車体に赤い線（文字・マークは描かない）。
// 入れ忘れのわな: うんてんせきのやね→うんてんしゅ、にだいのやね→ベッド・ボンベ、うしろのドア→ベッド・ボンベ
import '../config.js?v=6250ca2';

const WHITE = '#f4f6f8', RED = '#e0403a', DARK = '#3a3f47', GLASS = '#8fd3f5', SILVER = '#c8ccd2', NAVY = '#2f4f9a', SKIN = '#f2c9a0', GREEN = '#3fae6a';

// タイヤ（4本とも同じ形：kind 'tire'）。軸は z。ホイールの黄色い棒が回って見える
const tire = (id, x, z) => ({
  id, kind: 'tire', on: ['chassis'],
  shapes: [
    { type: 'cyl', size: [0.42, 0.3], pos: [x, 0.42, z], rot: [90, 0, 0], color: '#2b2d30' },
    { type: 'cyl', size: [0.22, 0.34], pos: [x, 0.42, z], rot: [90, 0, 0], color: SILVER, mat: 'metal' },
    { type: 'rbox', size: [0.34, 0.09, 0.38], pos: [x, 0.42, z], color: '#ffd23f', r: 0.02 },
  ],
});
// まど（2つとも同じ形：kind 'window'）。にだいの よこ（+z がわ）のガラス
const win = (id, x) => ({
  id, kind: 'window', on: ['cargo'],
  shapes: [
    { type: 'rbox', size: [0.9, 1.0, 0.05], pos: [x, 1.87, 0.78], color: GLASS, mat: 'glass', r: 0.02 },
    { type: 'rbox', size: [0.9, 0.06, 0.07], pos: [x, 1.87, 0.78], color: WHITE, r: 0.01 },
  ],
});
// ランプ（2つとも同じ形：kind 'lamp'）。にだいのやねの上。赤く光る
const lamp = (id, z) => ({
  id, kind: 'lamp', on: ['roof'],
  shapes: [
    { type: 'cyl', size: [0.15, 0.07], pos: [-0.15, 2.525, z], color: DARK },
    { type: 'sphere', half: true, size: [0.18], pos: [-0.15, 2.56, z], color: '#ff3b30' },
  ],
});

KP.models.push({
  id: 'ambulance', no: 23, name: 'きゅうきゅうしゃ', room: 'douro',
  parts: [
    // 最初に付けられるのは「だい」だけ（バンパーも入っている）
    { id: 'chassis', on: [],
      shapes: [
        { type: 'rbox', size: [4.7, 0.3, 1.6], pos: [0, 0.62, 0], color: DARK, r: 0.06 },
        { type: 'rbox', size: [0.22, 0.28, 1.8], pos: [2.4, 0.6, 0], color: SILVER, mat: 'metal', r: 0.05 },
        { type: 'rbox', size: [0.14, 0.2, 1.6], pos: [-2.4, 0.6, 0], color: DARK, r: 0.04 },
      ] },
    tire('tire1', 1.55, 0.93), tire('tire2', 1.55, -0.93), tire('tire3', -1.3, 0.93), tire('tire4', -1.3, -0.93),
    // にだい（ゆか・まえのかべ・むこうがわのかべ・手前のひくいかべ）。うしろと上はあいている。赤い線つき
    { id: 'cargo', on: ['chassis'],
      shapes: [
        { type: 'rbox', size: [2.6, 0.1, 1.6], pos: [-1.0, 0.82, 0], color: WHITE, r: 0.03 },
        { type: 'rbox', size: [2.6, 1.5, 0.1], pos: [-1.0, 1.62, -0.75], color: WHITE, r: 0.03 },
        { type: 'rbox', size: [2.6, 0.5, 0.1], pos: [-1.0, 1.12, 0.75], color: WHITE, r: 0.03 },
        { type: 'rbox', size: [0.1, 1.5, 1.6], pos: [0.25, 1.62, 0], color: WHITE, r: 0.03 },
        { type: 'rbox', size: [2.6, 0.14, 0.03], pos: [-1.0, 1.12, 0.815], color: RED, r: 0.01 },
        { type: 'rbox', size: [2.6, 0.14, 0.03], pos: [-1.0, 1.3, -0.815], color: RED, r: 0.01 },
      ] },
    // うんてんせき（ひくいかべ・ダッシュボード・ハンドル・ライト）。なかは、やねをのせるまで見える。赤い線つき
    { id: 'cab', on: ['chassis'],
      shapes: [
        { type: 'rbox', size: [2.0, 0.68, 1.6], pos: [1.3, 1.11, 0], color: WHITE, r: 0.06 },
        { type: 'rbox', size: [0.14, 0.3, 1.5], pos: [1.9, 1.6, 0], color: DARK, r: 0.04 },
        { type: 'cyl', size: [0.04, 0.3], pos: [1.6, 1.6, 0], color: DARK },
        { type: 'torus', size: [0.17, 0.04], pos: [1.6, 1.82, 0], rot: [0, 90, 0], color: DARK },
        { type: 'sphere', size: [0.11], pos: [2.32, 1.0, 0.55], color: '#ffe066' },
        { type: 'sphere', size: [0.11], pos: [2.32, 1.0, -0.55], color: '#ffe066' },
        { type: 'rbox', size: [1.9, 0.12, 0.03], pos: [1.3, 1.1, 0.815], color: RED, r: 0.01 },
        { type: 'rbox', size: [1.9, 0.12, 0.03], pos: [1.3, 1.1, -0.815], color: RED, r: 0.01 },
      ] },
    // うんてんしゅ（ぼうしをかぶっている）
    { id: 'driver', on: ['cab'],
      shapes: [
        { type: 'cyl', size: [0.22, 0.36], pos: [1.1, 1.63, 0], color: NAVY },
        { type: 'sphere', size: [0.19], pos: [1.1, 1.96, 0], color: SKIN },
        { type: 'sphere', half: true, size: [0.22], pos: [1.1, 1.99, 0], color: WHITE },
      ] },
    // うんてんせきの やね（先にのせると、うんてんしゅは もう入らない）。まえのはしら・フロントガラス・よこのガラスつき
    { id: 'cabRoof', on: ['cab'], closes: ['driver'],
      shapes: [
        { type: 'rbox', size: [1.9, 0.12, 1.7], pos: [1.25, 2.25, 0], color: WHITE, r: 0.05 },
        { type: 'rbox', size: [0.1, 0.74, 0.1], pos: [2.1, 1.82, 0.72], color: WHITE, r: 0.02 },
        { type: 'rbox', size: [0.1, 0.74, 0.1], pos: [2.1, 1.82, -0.72], color: WHITE, r: 0.02 },
        { type: 'rbox', size: [0.05, 0.7, 1.4], pos: [2.13, 1.82, 0], color: GLASS, mat: 'glass', r: 0.02 },
        { type: 'rbox', size: [1.4, 0.5, 0.04], pos: [1.1, 1.72, 0.78], color: GLASS, mat: 'glass', r: 0.02 },
        { type: 'rbox', size: [1.4, 0.5, 0.04], pos: [1.1, 1.72, -0.78], color: GLASS, mat: 'glass', r: 0.02 },
      ] },
    // ベッド（ストレッチャー）。にだいの なか
    { id: 'bed', on: ['cargo'],
      shapes: [
        { type: 'rbox', size: [1.6, 0.06, 0.55], pos: [-1.1, 1.18, 0], color: SILVER, mat: 'metal', r: 0.02 },
        { type: 'rbox', size: [1.5, 0.12, 0.5], pos: [-1.1, 1.27, 0], color: '#6ec1e4', r: 0.05 },
        { type: 'rbox', size: [0.3, 0.1, 0.36], pos: [-1.65, 1.38, 0], color: WHITE, r: 0.04 },
        { type: 'rbox', size: [0.08, 0.28, 0.5], pos: [-1.8, 1.01, 0], color: SILVER, mat: 'metal', r: 0.02 },
        { type: 'rbox', size: [0.08, 0.28, 0.5], pos: [-0.4, 1.01, 0], color: SILVER, mat: 'metal', r: 0.02 },
      ] },
    // さんそボンベ（にだいの まえの すみ）
    { id: 'tank', on: ['cargo'],
      shapes: [
        { type: 'cyl', size: [0.14, 0.8], pos: [0, 1.27, -0.5], color: GREEN },
        { type: 'sphere', half: true, size: [0.14], pos: [0, 1.67, -0.5], color: GREEN },
        { type: 'cyl', size: [0.05, 0.12], pos: [0, 1.79, -0.5], color: SILVER, mat: 'metal' },
        { type: 'cyl', size: [0.145, 0.1], pos: [0, 1.4, -0.5], color: WHITE },
      ] },
    // にだいの やね（先にのせると、ベッドとボンベは もう入らない）。よこのはしらつき
    { id: 'roof', on: ['cargo'], closes: ['bed', 'tank'],
      shapes: [
        { type: 'rbox', size: [2.75, 0.12, 1.75], pos: [-0.98, 2.43, 0], color: WHITE, r: 0.05 },
        { type: 'rbox', size: [0.1, 1.0, 0.1], pos: [-2.2, 1.87, 0.78], color: WHITE, r: 0.02 },
        { type: 'rbox', size: [0.1, 1.0, 0.1], pos: [-1.0, 1.87, 0.78], color: WHITE, r: 0.02 },
        { type: 'rbox', size: [0.1, 1.0, 0.1], pos: [0.15, 1.87, 0.78], color: WHITE, r: 0.02 },
        { type: 'rbox', size: [2.7, 0.12, 0.04], pos: [-1.0, 2.43, 0.89], color: RED, r: 0.01 },   // やねのふちの赤い線
      ] },
    // うしろのドア（先に付けると、ベッドとボンベは もう入らない）。赤い線と、小さな窓
    { id: 'rearDoor', on: ['cargo'], closes: ['bed', 'tank'],
      shapes: [
        { type: 'rbox', size: [0.08, 1.5, 1.6], pos: [-2.33, 1.62, 0], color: WHITE, r: 0.03 },
        { type: 'rbox', size: [0.03, 0.14, 1.6], pos: [-2.385, 1.3, 0], color: RED, r: 0.01 },
        { type: 'rbox', size: [0.09, 0.5, 1.1], pos: [-2.33, 2.0, 0], color: GLASS, mat: 'glass', r: 0.02 },
        { type: 'rbox', size: [0.06, 0.1, 0.3], pos: [-2.4, 1.6, 0], color: SILVER, mat: 'metal', r: 0.02 },
      ] },
    win('window1', -1.5), win('window2', -0.5),
    lamp('lamp1', 0.5), lamp('lamp2', -0.5),
  ],
  finale: [
    { type: 'drive', wheels: 'tire', axis: 'z', dir: 1 },        // タイヤが回って、前（+x）へ少し走って、もどる
    { type: 'light', parts: ['lamp1', 'lamp2'] },                  // 赤いランプが光る
  ],
});
