// No.24 パトカー（16部品、★★★、どうろ、できたとき＝タイヤが回って少し走って、もどる＋赤と青のランプが光る）
// 車の前は +x（drive の dir:1・axis:'z'）。タイヤの軸は z。白黒の車体（文字・マークは描かない）。
// 入れ忘れのわな: やね→シート・ハンドル、ボンネット→エンジン、トランクのふた→コーン
import '../config.js?v=6250ca2';

const WHITE = '#f4f6f8', BLACK = '#2b2d33', DARK = '#3a3f47', GLASS = '#8fd3f5', SILVER = '#c8ccd2', NAVY = '#2f4f9a', ORANGE = '#ff8a2b';

// タイヤ（4本とも同じ形：kind 'tire'）。軸は z。ホイールの黄色い棒が回って見える
const tire = (id, x, z) => ({
  id, kind: 'tire', on: ['chassis'],
  shapes: [
    { type: 'cyl', size: [0.42, 0.3], pos: [x, 0.42, z], rot: [90, 0, 0], color: '#1f2124' },
    { type: 'cyl', size: [0.22, 0.34], pos: [x, 0.42, z], rot: [90, 0, 0], color: SILVER, mat: 'metal' },
    { type: 'rbox', size: [0.34, 0.09, 0.38], pos: [x, 0.42, z], color: '#ffd23f', r: 0.02 },
  ],
});

KP.models.push({
  id: 'police', no: 24, name: 'パトカー', room: 'douro',
  parts: [
    // 最初に付けられるのは「だい」だけ（バンパー・フォグランプ・テールランプも入っている）
    { id: 'chassis', on: [],
      shapes: [
        { type: 'rbox', size: [4.4, 0.3, 1.6], pos: [0, 0.62, 0], color: BLACK, r: 0.06 },
        { type: 'rbox', size: [0.2, 0.26, 1.8], pos: [2.3, 0.6, 0], color: DARK, r: 0.05 },
        { type: 'rbox', size: [0.14, 0.2, 1.7], pos: [-2.27, 0.6, 0], color: DARK, r: 0.04 },
        { type: 'sphere', size: [0.1], pos: [2.4, 0.66, 0.6], color: '#ffe066' },
        { type: 'sphere', size: [0.1], pos: [2.4, 0.66, -0.6], color: '#ffe066' },
        { type: 'rbox', size: [0.05, 0.12, 0.3], pos: [-2.37, 0.64, 0.6], color: '#d9302a', r: 0.015 },
        { type: 'rbox', size: [0.05, 0.12, 0.3], pos: [-2.37, 0.64, -0.6], color: '#d9302a', r: 0.015 },
      ] },
    tire('tire1', 1.4, 0.93), tire('tire2', 1.4, -0.93), tire('tire3', -1.3, 0.93), tire('tire4', -1.3, -0.93),
    // くるまの からだ（よこのひくいかべ・まえとうしろのかべ・うんてんせきの前と後ろのしきり）。ドアは白。上はあいている
    { id: 'body', on: ['chassis'],
      shapes: [
        { type: 'rbox', size: [4.3, 0.53, 0.1], pos: [0, 1.035, 0.75], color: BLACK, r: 0.03 },
        { type: 'rbox', size: [4.3, 0.53, 0.1], pos: [0, 1.035, -0.75], color: BLACK, r: 0.03 },
        { type: 'rbox', size: [1.8, 0.53, 0.03], pos: [0.05, 1.035, 0.815], color: WHITE, r: 0.01 },
        { type: 'rbox', size: [1.8, 0.53, 0.03], pos: [0.05, 1.035, -0.815], color: WHITE, r: 0.01 },
        { type: 'rbox', size: [0.1, 0.53, 1.6], pos: [2.15, 1.035, 0], color: BLACK, r: 0.03 },
        { type: 'rbox', size: [0.1, 0.53, 1.6], pos: [-2.15, 1.035, 0], color: BLACK, r: 0.03 },
        { type: 'rbox', size: [0.12, 0.7, 1.5], pos: [0.95, 1.12, 0], color: DARK, r: 0.04 },
        { type: 'rbox', size: [0.1, 0.53, 1.5], pos: [-0.95, 1.035, 0], color: BLACK, r: 0.03 },
      ] },
    // シート（ベンチ。せもたれと、あたまのせつき）
    { id: 'seat', on: ['body'],
      shapes: [
        { type: 'rbox', size: [0.5, 0.22, 1.1], pos: [-0.1, 0.88, 0], color: NAVY, r: 0.04 },
        { type: 'rbox', size: [0.6, 0.14, 1.2], pos: [-0.1, 1.06, 0], color: NAVY, r: 0.05 },
        { type: 'rbox', size: [0.14, 0.6, 1.2], pos: [-0.4, 1.35, 0], color: NAVY, r: 0.05 },
        { type: 'rbox', size: [0.16, 0.2, 0.3], pos: [-0.4, 1.75, 0.3], color: NAVY, r: 0.05 },
        { type: 'rbox', size: [0.16, 0.2, 0.3], pos: [-0.4, 1.75, -0.3], color: NAVY, r: 0.05 },
      ] },
    // ハンドル（わっかと、ささえるぼう）
    { id: 'handle', on: ['body'],
      shapes: [
        { type: 'cyl', size: [0.04, 0.73], pos: [0.62, 1.135, 0], color: DARK },
        { type: 'torus', size: [0.17, 0.04], pos: [0.62, 1.6, 0], rot: [0, 90, 0], color: DARK },
      ] },
    // やね（先にのせると、シートとハンドルは もう入らない）。うしろのはしら・よこのガラス・うしろのガラス・ランプのだい
    { id: 'roof', on: ['body'], closes: ['seat', 'handle'],
      shapes: [
        { type: 'rbox', size: [2.05, 0.12, 1.7], pos: [0.08, 2.13, 0], color: WHITE, r: 0.05 },
        { type: 'rbox', size: [0.1, 0.77, 0.1], pos: [-0.9, 1.685, 0.72], color: WHITE, r: 0.02 },
        { type: 'rbox', size: [0.1, 0.77, 0.1], pos: [-0.9, 1.685, -0.72], color: WHITE, r: 0.02 },
        { type: 'rbox', size: [1.7, 0.7, 0.04], pos: [0.05, 1.7, 0.78], color: GLASS, mat: 'glass', r: 0.02 },
        { type: 'rbox', size: [1.7, 0.7, 0.04], pos: [0.05, 1.7, -0.78], color: GLASS, mat: 'glass', r: 0.02 },
        { type: 'rbox', size: [0.05, 0.7, 1.4], pos: [-0.92, 1.72, 0], color: GLASS, mat: 'glass', r: 0.02 },
        { type: 'rbox', size: [0.45, 0.08, 0.95], pos: [0.1, 2.23, 0], color: DARK, r: 0.03 },
      ] },
    // フロントガラス（ガラスと、まえのはしら2本）
    { id: 'windshield', on: ['body'],
      shapes: [
        { type: 'rbox', size: [0.05, 0.6, 1.4], pos: [1.02, 1.77, 0], color: GLASS, mat: 'glass', r: 0.02 },
        { type: 'rbox', size: [0.1, 0.62, 0.1], pos: [1.0, 1.78, 0.72], color: WHITE, r: 0.02 },
        { type: 'rbox', size: [0.1, 0.62, 0.1], pos: [1.0, 1.78, -0.72], color: WHITE, r: 0.02 },
      ] },
    // ランプ（赤と青。いろがちがうので kind なし）。やねの上のだいにのる
    { id: 'lampR', on: ['roof'],
      shapes: [
        { type: 'sphere', half: true, size: [0.2], pos: [0.1, 2.27, -0.27], color: '#ff3b30' },
      ] },
    { id: 'lampB', on: ['roof'],
      shapes: [
        { type: 'sphere', half: true, size: [0.2], pos: [0.1, 2.27, 0.27], color: '#2f6bff' },
      ] },
    // エンジン（ボンネットのなか）
    { id: 'engine', on: ['body'],
      shapes: [
        { type: 'rbox', size: [0.7, 0.36, 0.9], pos: [1.55, 0.98, 0], color: '#9aa1a9', mat: 'metal', r: 0.04 },
        { type: 'rbox', size: [0.5, 0.08, 0.6], pos: [1.55, 1.2, 0], color: DARK, r: 0.03 },
        { type: 'cyl', size: [0.12, 0.4], pos: [1.3, 0.99, -0.58], color: '#d9302a' },
        { type: 'cyl', size: [0.05, 0.4], pos: [1.97, 0.95, -0.4], rot: [90, 0, 0], color: SILVER, mat: 'metal' },
      ] },
    // ボンネット（先にのせると、エンジンは もう入らない）
    { id: 'hood', on: ['body'], closes: ['engine'],
      shapes: [
        { type: 'rbox', size: [1.12, 0.1, 1.6], pos: [1.55, 1.35, 0], color: BLACK, r: 0.04 },
        { type: 'rbox', size: [0.9, 0.02, 0.2], pos: [1.55, 1.41, 0], color: WHITE, r: 0.01 },
      ] },
    // コーン（トランクのなか）
    { id: 'cone', on: ['body'],
      shapes: [
        { type: 'rbox', size: [0.4, 0.05, 0.4], pos: [-1.55, 0.8, 0], color: ORANGE, r: 0.02 },
        { type: 'cone', size: [0.15, 0.4], pos: [-1.55, 1.025, 0], color: ORANGE },
        { type: 'torus', size: [0.08, 0.03], pos: [-1.55, 1.05, 0], rot: [90, 0, 0], color: WHITE },
      ] },
    // トランクのふた（先にのせると、コーンは もう入らない）
    { id: 'trunk', on: ['body'], closes: ['cone'],
      shapes: [
        { type: 'rbox', size: [1.05, 0.1, 1.6], pos: [-1.55, 1.35, 0], color: BLACK, r: 0.04 },
        { type: 'rbox', size: [0.8, 0.02, 0.2], pos: [-1.55, 1.41, 0], color: WHITE, r: 0.01 },
      ] },
  ],
  finale: [
    { type: 'drive', wheels: 'tire', axis: 'z', dir: 1 },          // タイヤが回って、前（+x）へ少し走って、もどる
    { type: 'light', parts: ['lampR', 'lampB'] },                    // 赤と青のランプが、ずれて光る
  ],
});
