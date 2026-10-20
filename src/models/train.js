// No.9 でんしゃ（16部品、★★★、どうろ、できたとき＝しゃりんが回って少し走って、もどる）
// 電車の前は +x（drive の dir:1・axis:'z'）。しゃりんの軸は z。ドアと まどは +z 側（見える側）に付く
// 入れ忘れのわな: やね→ざせき・つりかわ、ドア（×2）→ざせき（ドアを付けると、中のざせきはもう入らない）
import '../config.js?v=6250ca2';

const WHITE = '#f4f6f8', BLUE = '#3f7fe0', NAVY = '#2f4f9a', DARK = '#4b5563', GLASS = '#8fd3f5', YELLOW = '#ffd23f', SILVER = '#c8ccd2', RED = '#d9473f';

// しゃりん（4つとも同じ形：kind 'wheel'）。軸は z。黄色いハブの黒い棒が回って見える
const wheel = (id, x, z) => ({
  id, kind: 'wheel', on: ['chassis'],
  shapes: [
    { type: 'cyl', size: [0.38, 0.14], pos: [x, 0.38, z], rot: [90, 0, 0], color: '#3a3f47' },
    { type: 'cyl', size: [0.2, 0.18], pos: [x, 0.38, z], rot: [90, 0, 0], color: YELLOW },
    { type: 'rbox', size: [0.44, 0.08, 0.2], pos: [x, 0.38, z], color: '#2b2d30', r: 0.02 },
  ],
});
// まど（4つとも同じ形：kind 'window'）。ガラスと、上のわく
const win = (id, x) => ({
  id, kind: 'window', on: ['body'],
  shapes: [
    { type: 'rbox', size: [0.6, 0.64, 0.06], pos: [x, 1.6, 0.77], color: GLASS, mat: 'glass', r: 0.02 },
    { type: 'rbox', size: [0.66, 0.05, 0.08], pos: [x, 1.925, 0.77], color: WHITE, r: 0.01 },
  ],
});
// ドア（2つとも同じ形：kind 'door'）。いたと、小さな窓。付けると、中のざせきはもう入らない
const door = (id, x) => ({
  id, kind: 'door', on: ['body'], closes: ['seat'],
  shapes: [
    { type: 'rbox', size: [0.72, 1.1, 0.06], pos: [x, 1.33, 0.83], color: BLUE, r: 0.03 },
    { type: 'rbox', size: [0.4, 0.45, 0.08], pos: [x, 1.55, 0.84], color: GLASS, mat: 'glass', r: 0.02 },
  ],
});

KP.models.push({
  id: 'train', no: 9, name: 'でんしゃ', room: 'douro',
  parts: [
    // 最初に付けられるのは「だい」だけ（したのわくと、れんけつ器）
    { id: 'chassis', on: [],
      shapes: [
        { type: 'rbox', size: [4.8, 0.3, 1.7], pos: [0, 0.62, 0], color: DARK, r: 0.06 },
        { type: 'cyl', size: [0.1, 0.25], pos: [2.5, 0.62, 0], rot: [0, 0, 90], color: '#2b2d30' },
        { type: 'cyl', size: [0.1, 0.25], pos: [-2.5, 0.62, 0], rot: [0, 0, 90], color: '#2b2d30' },
      ] },
    wheel('wheel1', 1.6, 0.93), wheel('wheel2', 1.6, -0.93), wheel('wheel3', -1.6, 0.93), wheel('wheel4', -1.6, -0.93),
    // からだ（うしろ・したの かべ・まえとうしろの かべ・フロントガラス・ライト）。上は あいている
    { id: 'body', on: ['chassis'],
      shapes: [
        { type: 'rbox', size: [4.7, 1.18, 0.1], pos: [0, 1.36, -0.75], color: WHITE, r: 0.03 },
        { type: 'rbox', size: [4.7, 0.5, 0.1], pos: [0, 1.02, 0.75], color: BLUE, r: 0.03 },
        { type: 'rbox', size: [0.1, 1.18, 1.6], pos: [2.3, 1.36, 0], color: WHITE, r: 0.03 },
        { type: 'rbox', size: [0.1, 1.18, 1.6], pos: [-2.3, 1.36, 0], color: WHITE, r: 0.03 },
        { type: 'rbox', size: [0.05, 0.7, 1.2], pos: [2.36, 1.6, 0], color: GLASS, mat: 'glass', r: 0.02 },
        { type: 'sphere', size: [0.1], pos: [2.37, 1.05, 0.55], color: '#ffe066' },
        { type: 'sphere', size: [0.1], pos: [2.37, 1.05, -0.55], color: '#ffe066' },
      ] },
    // ざせき（ながいいす2つ）
    { id: 'seat', on: ['body'],
      shapes: [
        { type: 'rbox', size: [4.0, 0.22, 0.42], pos: [0, 0.88, 0.42], color: RED, r: 0.04 },
        { type: 'rbox', size: [4.0, 0.22, 0.42], pos: [0, 0.88, -0.42], color: RED, r: 0.04 },
        { type: 'rbox', size: [4.0, 0.36, 0.07], pos: [0, 1.17, 0.655], color: RED, r: 0.03 },
        { type: 'rbox', size: [4.0, 0.36, 0.07], pos: [0, 1.17, -0.655], color: RED, r: 0.03 },
      ] },
    // つりかわ（てんじょうのぼう2本と、わっか6つ）
    { id: 'straps', on: ['body'],
      shapes: [
        { type: 'cyl', size: [0.03, 4.2], pos: [0, 1.9, 0.3], rot: [0, 0, 90], color: SILVER, mat: 'metal' },
        { type: 'cyl', size: [0.03, 4.2], pos: [0, 1.9, -0.3], rot: [0, 0, 90], color: SILVER, mat: 'metal' },
        ...[-1.3, 0, 1.3].flatMap(x => [0.3, -0.3].map(z => ({ type: 'torus', size: [0.08, 0.022], pos: [x, 1.77, z], color: YELLOW }))),
      ] },
    // やね（先にのせると、ざせきとつりかわは もう入らない）
    { id: 'roof', on: ['body'], closes: ['seat', 'straps'],
      shapes: [
        { type: 'rbox', size: [4.9, 0.14, 1.85], pos: [0, 2.02, 0], color: NAVY, r: 0.06 },
        { type: 'rbox', size: [0.9, 0.12, 0.7], pos: [-1.2, 2.15, 0], color: '#d7dbe0', r: 0.04 },
        { type: 'rbox', size: [0.9, 0.12, 0.7], pos: [1.2, 2.15, 0], color: '#d7dbe0', r: 0.04 },
      ] },
    win('window1', -1.87), win('window2', -0.35), win('window3', 0.35), win('window4', 1.87),
    door('door1', -1.11), door('door2', 1.11),
    // パンタグラフ（やねの上の、三角の形のもの）
    { id: 'pantograph', on: ['roof'],
      shapes: [
        { type: 'rbox', size: [0.5, 0.05, 0.2], pos: [0, 2.145, 0], color: DARK, r: 0.015 },
        { type: 'rbox', size: [0.05, 0.63, 0.05], pos: [-0.125, 2.46, 0], rot: [0, 0, -23], color: DARK, r: 0.015 },
        { type: 'rbox', size: [0.05, 0.63, 0.05], pos: [0.125, 2.46, 0], rot: [0, 0, 23], color: DARK, r: 0.015 },
        { type: 'rbox', size: [0.05, 0.04, 0.8], pos: [0, 2.77, 0], color: DARK, r: 0.012 },
      ] },
  ],
  finale: { type: 'drive', wheels: 'wheel', axis: 'z', dir: 1 },   // しゃりんが回って、前（+x）へ少し走って、もどる
});
