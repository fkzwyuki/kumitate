// No.27 しんかんせん（18部品、★★★、どうろ、できたとき＝しゃりんが回って少し走って、もどる）
// 前は +x（drive の dir:1・axis:'z'）。しゃりんの軸は z。白い車体に青い線、とがった先頭。文字は描かない。
// ドアと まどは +z 側（見える側）に付く。
// 入れ忘れのわな: やね→ざせき×4、ドア×2→ざせき×4（やねやドアを先に付けると、中のざせきはもう入らない）
import '../config.js?v=6250ca2';

const WHITE = '#f4f6f8', BLUE = '#2f6bd6', NAVY = '#243a6b', DARK = '#4b5563', GLASS = '#8fd3f5', SILVER = '#c8ccd2', RED = '#d9473f', YELLOW = '#ffd23f';

// しゃりん（4つとも同じ形：kind 'wheel'）。軸は z。黒い棒が回って見える
const wheel = (id, x, z) => ({
  id, kind: 'wheel', on: ['chassis'],
  shapes: [
    { type: 'cyl', size: [0.34, 0.14], pos: [x, 0.34, z], rot: [90, 0, 0], color: '#3a3f47' },
    { type: 'cyl', size: [0.18, 0.18], pos: [x, 0.34, z], rot: [90, 0, 0], color: SILVER, mat: 'metal' },
    { type: 'rbox', size: [0.4, 0.08, 0.2], pos: [x, 0.34, z], color: '#2b2d30', r: 0.02 },
  ],
});
// ざせき（4つとも同じ形：kind 'seat'）。すわるところ・せもたれ・あたまのカバー
const seat = (id, x) => ({
  id, kind: 'seat', on: ['body'],
  shapes: [
    { type: 'rbox', size: [0.5, 0.22, 1.1], pos: [x, 0.88, 0], color: RED, r: 0.04 },
    { type: 'rbox', size: [0.1, 0.55, 1.1], pos: [x - 0.2, 1.27, 0], color: RED, r: 0.04 },
    { type: 'rbox', size: [0.1, 0.2, 0.6], pos: [x - 0.2, 1.64, 0], color: '#e0e5ee', r: 0.03 },
  ],
});
const SEATS = ['seat1', 'seat2', 'seat3', 'seat4'];
// まど（2つとも同じ形：kind 'window'）。ながいガラスと、上のわく
const win = (id, x) => ({
  id, kind: 'window', on: ['body'],
  shapes: [
    { type: 'rbox', size: [1.4, 0.64, 0.06], pos: [x, 1.6, 0.77], color: GLASS, mat: 'glass', r: 0.02 },
    { type: 'rbox', size: [1.46, 0.05, 0.08], pos: [x, 1.925, 0.77], color: WHITE, r: 0.01 },
  ],
});
// ドア（2つとも同じ形：kind 'door'）。いたと、小さな窓。付けると、中のざせきはもう入らない
const door = (id, x) => ({
  id, kind: 'door', on: ['body'], closes: SEATS,
  shapes: [
    { type: 'rbox', size: [0.7, 1.1, 0.06], pos: [x, 1.33, 0.83], color: BLUE, r: 0.03 },
    { type: 'rbox', size: [0.4, 0.45, 0.08], pos: [x, 1.55, 0.84], color: GLASS, mat: 'glass', r: 0.02 },
  ],
});

KP.models.push({
  id: 'shinkansen', no: 27, name: 'しんかんせん', room: 'douro',
  parts: [
    // 最初に付けられるのは「だい」だけ（したのわくと、あおい帯）
    { id: 'chassis', on: [],
      shapes: [
        { type: 'rbox', size: [5.0, 0.3, 1.7], pos: [-0.55, 0.62, 0], color: DARK, r: 0.06 },
        { type: 'rbox', size: [4.8, 0.1, 1.78], pos: [-0.55, 0.52, 0], color: BLUE, r: 0.03 },
      ] },
    wheel('wheel1', 1.2, 0.93), wheel('wheel2', 1.2, -0.93), wheel('wheel3', -2.3, 0.93), wheel('wheel4', -2.3, -0.93),
    // からだ（うしろのかべ・まえのひくいかべ・まえとうしろの かべ）。うえは あいている
    { id: 'body', on: ['chassis'],
      shapes: [
        { type: 'rbox', size: [4.7, 1.2, 0.1], pos: [-0.5, 1.37, -0.75], color: WHITE, r: 0.03 },
        { type: 'rbox', size: [4.7, 0.5, 0.1], pos: [-0.5, 1.02, 0.75], color: BLUE, r: 0.03 },
        { type: 'rbox', size: [4.7, 0.14, 0.02], pos: [-0.5, 1.05, -0.81], color: BLUE, r: 0.008 },
        { type: 'rbox', size: [0.1, 1.2, 1.6], pos: [1.8, 1.37, 0], color: WHITE, r: 0.03 },
        { type: 'rbox', size: [0.1, 1.2, 1.6], pos: [-2.8, 1.37, 0], color: WHITE, r: 0.03 },
      ] },
    // とがった先頭（5だんにだんだん細く低くなる。先は あおい）。フロントガラスと あおい帯つき
    { id: 'nose', on: ['body'],
      shapes: [
        { type: 'rbox', size: [0.5, 1.3, 1.6], pos: [2.15, 1.43, 0], color: WHITE, r: 0.12 },
        { type: 'rbox', size: [0.5, 1.1, 1.35], pos: [2.6, 1.33, 0], color: WHITE, r: 0.12 },
        { type: 'rbox', size: [0.5, 0.9, 1.05], pos: [3.05, 1.23, 0], color: WHITE, r: 0.12 },
        { type: 'rbox', size: [0.5, 0.7, 0.7], pos: [3.5, 1.13, 0], color: WHITE, r: 0.12 },
        { type: 'rbox', size: [0.4, 0.5, 0.4], pos: [3.9, 1.03, 0], color: BLUE, r: 0.1 },
        { type: 'rbox', size: [0.7, 0.3, 1.0], pos: [2.45, 2.0, 0], rot: [0, 0, -20], color: NAVY, mat: 'glass', r: 0.06 },
        { type: 'rbox', size: [0.52, 0.14, 1.62], pos: [2.15, 0.9, 0], color: BLUE, r: 0.05 },
        { type: 'rbox', size: [0.52, 0.14, 1.37], pos: [2.6, 0.9, 0], color: BLUE, r: 0.05 },
      ] },
    // ヘッドライト（先頭のりょうがわ）
    { id: 'headlight', on: ['nose'],
      shapes: [
        { type: 'sphere', size: [0.1], pos: [3.28, 1.0, 0.5], color: YELLOW },
        { type: 'sphere', size: [0.1], pos: [3.28, 1.0, -0.5], color: YELLOW },
      ] },
    seat('seat1', -2.2), seat('seat2', -1.2), seat('seat3', -0.2), seat('seat4', 0.8),
    // やね（先にのせると、ざせき×4は もう入らない）。あおい線つき
    { id: 'roof', on: ['body'], closes: SEATS,
      shapes: [
        { type: 'rbox', size: [5.0, 0.14, 1.85], pos: [-0.45, 2.04, 0], color: WHITE, r: 0.06 },
        { type: 'rbox', size: [4.6, 0.03, 0.5], pos: [-0.45, 2.12, 0], color: BLUE, r: 0.01 },
      ] },
    win('window1', -1.15), win('window2', 1.1),
    door('door1', -2.35), door('door2', -0.05),
    // パンタグラフ（やねの上の、三角の形のもの）
    { id: 'pantograph', on: ['roof'],
      shapes: [
        { type: 'rbox', size: [0.5, 0.05, 0.2], pos: [-1.2, 2.165, 0], color: DARK, r: 0.015 },
        { type: 'rbox', size: [0.05, 0.55, 0.05], pos: [-1.325, 2.46, 0], rot: [0, 0, -23], color: DARK, r: 0.015 },
        { type: 'rbox', size: [0.05, 0.55, 0.05], pos: [-1.075, 2.46, 0], rot: [0, 0, 23], color: DARK, r: 0.015 },
        { type: 'rbox', size: [0.05, 0.04, 0.8], pos: [-1.2, 2.74, 0], color: DARK, r: 0.012 },
      ] },
  ],
  finale: { type: 'drive', wheels: 'wheel', axis: 'z', dir: 1 },   // しゃりんが回って、前（+x）へ少し走って、もどる
});
