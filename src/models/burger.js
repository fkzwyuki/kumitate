// No.2 ハンバーガー（10部品、★、へや、できたとき＝ぽんぽん跳ねる）
// 下から順に積む（お皿 → パン → 肉 → チーズ → 肉 → レタス → トマト）。上のパンは、パンの上ならいつでものせられるが、
// のせてしまうと中身（肉・チーズ・レタス・トマト）はもう入らない（入れ忘れのわな）
import '../config.js?v=6250ca2';

const BUN = '#e9a948', BUN_DK = '#d9922e', MEAT = '#6b3f24', CHEESE = '#ffd23f', LETTUCE = '#6fcf4a', LETTUCE_DK = '#52b838', TOMATO = '#e53935', TOMATO_LT = '#ff7a6b';

// 下から順に高さを決める（layer は、いまの高さの上に厚さ h の層をのせて、その真ん中の高さを返す）
let top = 0;
const layer = h => { const c = top + h / 2; top += h; return c; };
const R = 1.35;                                   // パンの半径
const yPlate = layer(0.12), yBun = layer(0.42), yPatty1 = layer(0.36), yCheese = layer(0.08), yPatty2 = layer(0.36);
const yLettuce = layer(0.1), yTomato = layer(0.16), yBunBase = layer(0.12);
const domeY = top;                                // 上のパンの丸みが始まる高さ

// おにく（2枚とも同じ形：kind 'patty'）。置き場所の高さだけがちがう
const patty = (id, y, on) => ({
  id, kind: 'patty', on,
  shapes: [{ type: 'cyl', size: [1.42, 0.36], pos: [0, y, 0], color: MEAT }],
});
// トマト（2枚とも同じ形：kind 'tomato'）。レタスの上に2枚、パンからはみ出すようにならべる
const tomato = (id, x, z) => ({
  id, kind: 'tomato', on: ['lettuce'],
  shapes: [
    { type: 'cyl', size: [0.62, 0.16], pos: [x, yTomato, z], color: TOMATO },
    { type: 'cyl', size: [0.46, 0.18], pos: [x, yTomato, z], color: TOMATO_LT },
  ],
});

// 上のパンにのせるごま（ドームの表面に、高さを計算してのせる）
const seed = (x, z) => ({ type: 'sphere', size: [0.07], pos: [x, domeY + Math.sqrt(R * R - x * x - z * z) + 0.01, z], color: '#fff1c9' });

KP.models.push({
  id: 'burger', no: 2, name: 'ハンバーガー', room: 'heya',
  parts: [
    // 最初に付けられるのは「おさら」だけ
    { id: 'plate', on: [],
      shapes: [
        { type: 'cyl', size: [1.65, 0.12], pos: [0, yPlate, 0], color: '#fbfbfb' },
        { type: 'torus', size: [1.58, 0.07], pos: [0, yPlate + 0.08, 0], rot: [90, 0, 0], color: '#dfe6ee' },
      ] },
    { id: 'bunBottom', on: ['plate'],
      shapes: [{ type: 'cyl', size: [R, 0.35], pos: [0, yBun, 0], color: BUN }] },
    patty('patty1', yPatty1, ['bunBottom']),
    { id: 'cheese', on: ['patty1'],
      shapes: [{ type: 'rbox', size: [2.1, 0.08, 2.1], pos: [0, yCheese, 0], rot: [0, 45, 0], color: CHEESE, r: 0.03 }] },
    patty('patty2', yPatty2, ['cheese']),
    { id: 'lettuce', on: ['patty2'],
      shapes: [
        { type: 'cyl', size: [1.45, 0.1], pos: [0, yLettuce, 0], color: LETTUCE },
        { type: 'torus', size: [1.47, 0.1], pos: [0, yLettuce, 0], rot: [90, 0, 0], color: LETTUCE_DK },   // ひらひらのふち
      ] },
    tomato('tomato1', -0.9, 0.38), tomato('tomato2', 0.9, -0.38),
    { id: 'bunTop', on: ['bunBottom'], closes: ['patty1', 'cheese', 'patty2', 'lettuce', 'tomato1', 'tomato2'],
      shapes: [
        { type: 'cyl', size: [R, 0.12], pos: [0, yBunBase, 0], color: BUN_DK },
        { type: 'sphere', half: true, size: [R], pos: [0, domeY, 0], color: BUN },
        seed(0.5, 0.1), seed(-0.45, 0.45), seed(0.1, -0.6), seed(-0.75, -0.15), seed(0.8, -0.4), seed(-0.1, 0.85),
      ] },
    // はた（つま楊枝に小さな旗）
    { id: 'flag', on: ['bunTop'],
      shapes: [
        { type: 'cyl', size: [0.03, 1.2], pos: [0, domeY + R + 0.1, 0], color: '#e8d9b8' },
        { type: 'prism', size: [0.34, 0.5, 0.04], pos: [0.2, domeY + R + 0.45, 0], rot: [0, 0, -90], color: '#e5483f' },
      ] },
  ],
  finale: { type: 'bounce' },   // 全体がぽんぽん跳ねる
});
