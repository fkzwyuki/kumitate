// No.16 せんぷうき（13部品、★★、へや、できたとき＝はねが回る）
// うしろの カバーを先に付けると、モーターはもう入らない。まえの カバーを先に付けると、はねはもう入らない（入れ忘れのわな2か所）。
// はねは4まい（まわしたときに軸がずれないよう、まんなかに対して おなじ形にしてある）。商品名・マークは描かない
import '../config.js?v=6250ca2';

const BLUE = '#5aa9e6', BLUE_D = '#3f86c4', WHITE = '#e8eef2', WIRE = '#cfd6dd', ORANGE = '#f08a3c', YEL = '#f2c14e';
const HY = 2.65;   // ヘッドの高さ（まんなか）

// スイッチのボタン（3つとも同じ形：kind 'btn'）
const btn = (id, x) => ({
  id, kind: 'btn', on: ['base'],
  shapes: [{ type: 'cyl', size: [0.09, 0.08], pos: [x, 0.18, 0.5], color: '#ffffff' }],
});

// はね1まい（まんなかから外へ向かう。deg は向き）
const blade = deg => {
  const r = deg * Math.PI / 180;
  return { type: 'rbox', size: [0.3, 0.55, 0.04], pos: [-0.42 * Math.sin(r), HY + 0.42 * Math.cos(r), 0.38], rot: [0, 0, deg], color: YEL, r: 0.1 };
};

// ガードのわく（まるい線）。z は前後の場所
const ring = (rad, z, th) => ({ type: 'torus', size: [rad, th], pos: [0, HY, z], color: WIRE, mat: 'metal' });
// ガードのぼう（たて・よこ）
const spokes = z => [
  { type: 'rbox', size: [0.03, 1.64, 0.03], pos: [0, HY, z], color: WIRE, mat: 'metal', r: 0.01 },
  { type: 'rbox', size: [1.64, 0.03, 0.03], pos: [0, HY, z], color: WIRE, mat: 'metal', r: 0.01 },
];
// 前と後ろのガードをつなぐぼう（4本）
const rod = (x, y) => ({ type: 'cyl', size: [0.02, 0.52], pos: [x, y, 0.36], rot: [90, 0, 0], color: WIRE, mat: 'metal' });

KP.models.push({
  id: 'fan', no: 16, name: 'せんぷうき', room: 'heya',
  parts: [
    // 最初に付けられるのは「だい」だけ
    { id: 'base', on: [],
      shapes: [
        { type: 'cyl', size: [0.8, 0.14], pos: [0, 0.07, 0], color: BLUE },
      ] },
    // ささえの ぼう（下のつば と くびのところの金具つき）
    { id: 'pole', on: ['base'],
      shapes: [
        { type: 'cyl', size: [0.07, 2.11], pos: [0, 1.195, 0], color: WHITE, mat: 'metal' },
        { type: 'cyl', size: [0.2, 0.08], pos: [0, 0.18, 0], color: WHITE },
        { type: 'torus', size: [0.1, 0.03], pos: [0, 0.9, 0], rot: [90, 0, 0], color: BLUE_D },
        { type: 'rbox', size: [0.2, 0.2, 0.2], pos: [0, 2.3, 0], color: WHITE, r: 0.04 },
      ] },
    btn('btn1', -0.28), btn('btn2', 0), btn('btn3', 0.28),
    // コード（コンセントつき）
    { id: 'cord', on: ['base'],
      shapes: [
        { type: 'cyl', size: [0.03, 0.7], pos: [1.1, 0.1, 0.1], rot: [0, 0, 90], color: '#2b2d30' },
        { type: 'rbox', size: [0.22, 0.12, 0.14], pos: [1.55, 0.1, 0.1], color: '#2b2d30', r: 0.03 },
        { type: 'rbox', size: [0.1, 0.03, 0.02], pos: [1.71, 0.1, 0.06], color: WIRE, mat: 'metal', r: 0.008 },
        { type: 'rbox', size: [0.1, 0.03, 0.02], pos: [1.71, 0.1, 0.14], color: WIRE, mat: 'metal', r: 0.008 },
      ] },
    // モーター（ヘッドの中。あとからカバーを かぶせる）。カバーを先に付けると、もう入らない
    { id: 'motor', on: ['pole'],
      shapes: [
        { type: 'cyl', size: [0.28, 0.5], pos: [0, HY, 0], rot: [90, 0, 0], color: '#5a6068', mat: 'metal' },
        { type: 'cyl', size: [0.3, 0.08], pos: [0, HY, 0.2], rot: [90, 0, 0], color: '#c97b3c', mat: 'metal' },
        { type: 'cyl', size: [0.04, 0.15], pos: [0, HY, 0.325], rot: [90, 0, 0], color: '#dfe3e8', mat: 'metal' },
      ] },
    // うしろのカバー（モーターを おおう。まるい かたち）。先に付けると、モーターはもう入らない
    { id: 'headCover', on: ['pole'], closes: ['motor'],
      shapes: [
        { type: 'tube', size: [0.4, 0.35], pos: [0, HY, -0.1], rot: [90, 0, 0], color: BLUE },
        { type: 'sphere', size: [0.4], half: true, pos: [0, HY, -0.275], rot: [-90, 0, 0], color: BLUE },
        { type: 'torus', size: [0.4, 0.03], pos: [0, HY, 0.075], color: BLUE_D },
      ] },
    // かどを かえる つまみ（カバーの上）
    { id: 'knob', on: ['headCover'],
      shapes: [
        { type: 'cyl', size: [0.07, 0.1], pos: [0, 3.1, -0.1], color: ORANGE },
      ] },
    // はね（4まい。モーターの先に付く。回る）
    { id: 'blades', on: ['motor'],
      shapes: [
        { type: 'cyl', size: [0.1, 0.14], pos: [0, HY, 0.38], rot: [90, 0, 0], color: '#59616a', mat: 'metal' },
        blade(0), blade(90), blade(180), blade(270),
      ] },
    // うしろのガード（まるい わく2つ、ぼう2本、まえとつなぐぼう4本）
    { id: 'backGuard', on: ['headCover'],
      shapes: [
        ring(0.82, 0.1, 0.025), ring(0.4, 0.1, 0.02),
        ...spokes(0.1),
        rod(0.82, HY), rod(-0.82, HY), rod(0, HY + 0.82), rod(0, HY - 0.82),
      ] },
    // まえのカバー（まえのガード）。先に付けると、はねはもう入らない
    { id: 'frontGuard', on: ['backGuard'], closes: ['blades'],
      shapes: [
        ring(0.82, 0.62, 0.025), ring(0.55, 0.62, 0.02), ring(0.28, 0.62, 0.02),
        ...spokes(0.62),
      ] },
    // まんなかの かざり
    { id: 'cap', on: ['frontGuard'],
      shapes: [
        { type: 'cyl', size: [0.13, 0.06], pos: [0, HY, 0.67], rot: [90, 0, 0], color: ORANGE },
      ] },
  ],
  finale: { type: 'spin', part: 'blades', axis: 'z' },   // はねが回る
});
