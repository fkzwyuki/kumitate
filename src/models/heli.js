// No.6 ヘリコプター（14部品、★★、そと、できたとき＝プロペラが回る）
// はながたは +x（右）。そり×2 → ゆか → ざせき → からだ …の順。
// からだは、ざせき（まえ×2）を入れる前にのせると、もう入らない。ドアは、うしろのベンチを入れる前にのせると、もう入らない（入れ忘れのわな）
import '../config.js?v=6250ca2';

const BODY = '#e5483f', DARK = '#3a3f47', GRAY = '#6b727b', GLASS = '#8fd3f5', YELLOW = '#ffd23f', NAVY = '#3b5ba5', ORANGE = '#f2a33a', WHITE = '#f4f6f8';

// そり（2本とも同じ形：kind 'skid'）。長いパイプに、あしが2本
const skid = (id, z) => ({
  id, kind: 'skid', on: [],
  shapes: [
    { type: 'cyl', size: [0.065, 2.2], pos: [0, 0.09, z], rot: [0, 0, 90], color: DARK },
    { type: 'cyl', size: [0.045, 0.5], pos: [0.6, 0.34, z], color: DARK },
    { type: 'cyl', size: [0.045, 0.5], pos: [-0.6, 0.34, z], color: DARK },
    { type: 'sphere', size: [0.065], pos: [1.1, 0.09, z], color: DARK },
    { type: 'sphere', size: [0.065], pos: [-1.1, 0.09, z], color: DARK },
  ],
});
// ざせき（まえの2つは同じ形：kind 'seat'）。ゆかの上
const seat = (id, z) => ({
  id, kind: 'seat', on: ['floor'],
  shapes: [
    { type: 'rbox', size: [0.42, 0.12, 0.42], pos: [0.4, 0.79, z], color: NAVY, r: 0.04 },
    { type: 'rbox', size: [0.08, 0.5, 0.42], pos: [0.15, 0.98, z], color: NAVY, r: 0.03 },
  ],
});

KP.models.push({
  id: 'heli', no: 6, name: 'ヘリコプター', room: 'soto',
  parts: [
    // 最初に付けられるのは「そり」2本（どちらを持ってもよい）
    skid('skid1', -0.62), skid('skid2', 0.62),
    { id: 'floor', on: ['skid1', 'skid2'],
      shapes: [{ type: 'rbox', size: [2.0, 0.14, 1.36], pos: [0, 0.66, 0], color: GRAY, r: 0.05 }] },
    seat('seat1', -0.3), seat('seat2', 0.3),
    // うしろのベンチ
    { id: 'bench', on: ['floor'],
      shapes: [
        { type: 'rbox', size: [0.4, 0.12, 0.9], pos: [-0.4, 0.79, 0], color: ORANGE, r: 0.04 },
        { type: 'rbox', size: [0.08, 0.5, 0.9], pos: [-0.62, 0.98, 0], color: ORANGE, r: 0.03 },
      ] },
    // からだ（やね・うしろのかべ・よこのいた・はな）。先にのせると、まえのざせきはもう入らない
    { id: 'body', on: ['floor'], closes: ['seat1', 'seat2'],
      shapes: [
        { type: 'rbox', size: [2.0, 0.2, 1.4], pos: [0, 1.88, 0], color: BODY, r: 0.1 },
        { type: 'rbox', size: [0.14, 1.05, 1.4], pos: [-0.93, 1.255, 0], color: BODY, r: 0.04 },
        { type: 'rbox', size: [1.36, 0.35, 0.1], pos: [-0.18, 0.905, 0.65], color: BODY, r: 0.03 },
        { type: 'rbox', size: [1.36, 0.35, 0.1], pos: [-0.18, 0.905, -0.65], color: BODY, r: 0.03 },
        { type: 'rbox', size: [0.55, 0.55, 1.4], pos: [0.725, 1.0, 0], color: BODY, r: 0.22 },
        { type: 'rbox', size: [0.08, 0.7, 0.08], pos: [0.5, 1.43, 0.64], color: BODY, r: 0.02 },
        { type: 'rbox', size: [0.08, 0.7, 0.08], pos: [0.5, 1.43, -0.64], color: BODY, r: 0.02 },
      ] },
    // ドア（よこのスライドドア）。先にのせると、うしろのベンチはもう入らない
    { id: 'door', on: ['body'], closes: ['bench'],
      shapes: [
        { type: 'rbox', size: [0.8, 0.84, 0.06], pos: [-0.4, 1.2, 0.73], color: YELLOW, r: 0.03 },
        { type: 'rbox', size: [0.5, 0.34, 0.08], pos: [-0.4, 1.35, 0.73], color: GLASS, mat: 'glass', r: 0.02 },
        { type: 'rbox', size: [0.12, 0.05, 0.06], pos: [-0.12, 1.1, 0.77], color: DARK, r: 0.015 },
      ] },
    // まど（ガラス）。なかのざせきが すけて見える
    { id: 'window', on: ['body'],
      shapes: [{ type: 'rbox', size: [1.34, 0.62, 1.24], pos: [-0.18, 1.4, 0], color: GLASS, mat: 'glass', r: 0.04 }] },
    // しっぽ（とがった筒）
    { id: 'tail', on: ['body'],
      shapes: [{ type: 'cone', size: [0.3, 1.7], pos: [-1.85, 1.3, 0], rot: [0, 0, 90], color: BODY }] },
    // しっぽのはね（たてのはね・よこのはね・小さなプロペラ）
    { id: 'tailFin', on: ['tail'],
      shapes: [
        { type: 'rbox', size: [0.5, 0.75, 0.06], pos: [-2.55, 1.62, 0], rot: [0, 0, 20], color: BODY, r: 0.03 },
        { type: 'rbox', size: [0.4, 0.05, 0.8], pos: [-2.45, 1.3, 0], color: BODY, r: 0.02 },
        { type: 'cyl', size: [0.05, 0.1], pos: [-2.62, 1.85, 0.07], rot: [90, 0, 0], color: DARK },
        { type: 'rbox', size: [0.07, 0.55, 0.02], pos: [-2.62, 1.85, 0.12], rot: [0, 0, 30], color: DARK, r: 0.01 },
      ] },
    // プロペラのじく
    { id: 'mast', on: ['body'],
      shapes: [
        { type: 'cyl', size: [0.1, 0.32], pos: [0, 2.14, 0], color: DARK },
        { type: 'cyl', size: [0.2, 0.12], pos: [0, 2.36, 0], color: GRAY },
      ] },
    // プロペラ（2まいが十字。できたときに回る）
    { id: 'rotor', on: ['mast'],
      shapes: [
        { type: 'rbox', size: [3.6, 0.06, 0.28], pos: [0, 2.45, 0], color: '#4a4f57', r: 0.02 },
        { type: 'rbox', size: [0.28, 0.06, 3.6], pos: [0, 2.51, 0], color: '#4a4f57', r: 0.02 },
        { type: 'cyl', size: [0.13, 0.1], pos: [0, 2.54, 0], color: YELLOW },
      ] },
    // はなのライト
    { id: 'lamp', on: ['body'],
      shapes: [
        { type: 'cyl', size: [0.13, 0.1], pos: [1.05, 1.0, 0], rot: [0, 0, 90], color: WHITE },
        { type: 'sphere', size: [0.08], pos: [1.1, 1.0, 0], color: '#ffe066' },
      ] },
  ],
  finale: { type: 'spin', part: 'rotor', axis: 'y' },   // プロペラが回る
});
