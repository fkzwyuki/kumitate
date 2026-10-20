// No.17 でんわボックス（13部品、★★、どうろ、できたとき＝ベルが鳴ってぶるぶるゆれる）
// 昔ながらの緑のでんわボックス（ガラス張り）。ドアを付けると、中の でんわ・ベル・でんわちょうは もう入らない／
// やねを付けると、中の あかりは もう入らない（入れ忘れのわな2か所）。マークや文字は描かない
import '../config.js?v=6250ca2';

const GREEN = '#2e9a5e', GREEN_D = '#1f6e43', GLASS = '#d4eef5', SILVER = '#cfd3d8', DARK = '#2b2d30';

// 横にならぶ かべ（うしろ・ひだり・みぎ）の中身。axis 'x' はうしろ（x に広い）、'z' はよこ（z に広い）。長さ 1.28、中心は c
// 下がみどりの板、上がガラス。まんなかに たて・よこの ぼう
function wall(axis, c) {
  const p = (along, y, across) => axis === 'x' ? [along, y, c] : [c, y, along];       // （かべの上の位置 along, 高さ y）→ 3Dの位置
  const sz = (along, h, thick) => axis === 'x' ? [along, h, thick] : [thick, h, along];
  return [
    { type: 'rbox', size: sz(1.28, 0.5, 0.08), pos: p(0, 0.45), color: GREEN, r: 0.02 },                       // した の板
    { type: 'rbox', size: sz(1.28, 1.9, 0.03), pos: p(0, 1.65), color: GLASS, mat: 'glass', r: 0.01 },          // ガラス
    { type: 'rbox', size: sz(0.06, 1.9, 0.06), pos: p(0, 1.65), color: GREEN, r: 0.02 },                         // たてぼう
    { type: 'rbox', size: sz(1.28, 0.06, 0.06), pos: p(0, 1.3), color: GREEN, r: 0.02 },                         // よこぼう（下）
    { type: 'rbox', size: sz(1.28, 0.06, 0.06), pos: p(0, 1.95), color: GREEN, r: 0.02 },                        // よこぼう（上）
    { type: 'rbox', size: sz(1.28, 0.1, 0.08), pos: p(0, 2.65), color: GREEN, r: 0.02 },                         // うえの わく
  ];
}

KP.models.push({
  id: 'phonebox', no: 17, name: 'でんわボックス', room: 'douro',
  parts: [
    // 最初に付けられるのは「だい」だけ
    { id: 'base', on: [],
      shapes: [
        { type: 'rbox', size: [1.8, 0.2, 1.8], pos: [0, 0.1, 0], color: '#8d939a', r: 0.04 },
      ] },
    // ほんたいの はしら4本
    { id: 'frame', on: ['base'],
      shapes: [
        { type: 'rbox', size: [0.12, 2.5, 0.12], pos: [-0.7, 1.45, -0.7], color: GREEN_D, r: 0.03 },
        { type: 'rbox', size: [0.12, 2.5, 0.12], pos: [0.7, 1.45, -0.7], color: GREEN_D, r: 0.03 },
        { type: 'rbox', size: [0.12, 2.5, 0.12], pos: [-0.7, 1.45, 0.7], color: GREEN_D, r: 0.03 },
        { type: 'rbox', size: [0.12, 2.5, 0.12], pos: [0.7, 1.45, 0.7], color: GREEN_D, r: 0.03 },
      ] },
    // うしろのかべ
    { id: 'back', on: ['frame'], shapes: wall('x', -0.7) },
    // ひだり・みぎのかべ（2まいとも同じ形：kind 'side'）
    { id: 'sideL', kind: 'side', on: ['frame'], shapes: wall('z', -0.7) },
    { id: 'sideR', kind: 'side', on: ['frame'], shapes: wall('z', 0.7) },
    // あかり（うしろの かべの上に とめる）。できたとき光る。やねを先に付けると、もう入らない
    { id: 'lamp', on: ['back'],
      shapes: [
        { type: 'rbox', size: [0.8, 0.12, 0.22], pos: [0, 2.5, -0.56], color: '#fff2b0', r: 0.04 },
        { type: 'rbox', size: [0.1, 0.12, 0.12], pos: [0, 2.58, -0.64], color: SILVER, mat: 'metal', r: 0.02 },
      ] },
    // やね（3だんの ふた）。先に付けると、あかりは もう入らない
    { id: 'roof', on: ['frame'], closes: ['lamp'],
      shapes: [
        { type: 'rbox', size: [1.8, 0.16, 1.8], pos: [0, 2.78, 0], color: GREEN, r: 0.04 },
        { type: 'rbox', size: [1.5, 0.12, 1.5], pos: [0, 2.92, 0], color: GREEN_D, r: 0.04 },
        { type: 'rbox', size: [1.1, 0.1, 1.1], pos: [0, 3.03, 0], color: GREEN, r: 0.04 },
      ] },
    // でんわ（うしろのかべに とりつける。みぎがわ）。ドアを先に付けると、もう入らない
    { id: 'phone', on: ['back'],
      shapes: [
        { type: 'rbox', size: [0.5, 0.7, 0.05], pos: [0.28, 1.5, -0.64], color: SILVER, mat: 'metal', r: 0.02 },
        { type: 'rbox', size: [0.38, 0.5, 0.16], pos: [0.28, 1.45, -0.52], color: '#6dbf86', r: 0.04 },
        { type: 'rbox', size: [0.1, 0.5, 0.1], pos: [0.02, 1.45, -0.5], color: DARK, r: 0.04 },
        { type: 'rbox', size: [0.16, 0.1, 0.12], pos: [0.02, 1.72, -0.5], color: DARK, r: 0.04 },
        { type: 'rbox', size: [0.16, 0.1, 0.12], pos: [0.02, 1.18, -0.5], color: DARK, r: 0.04 },
        { type: 'rbox', size: [0.26, 0.22, 0.04], pos: [0.28, 1.38, -0.42], color: '#f2f4f6', r: 0.02 },
        { type: 'rbox', size: [0.2, 0.06, 0.04], pos: [0.28, 1.6, -0.42], color: DARK, r: 0.02 },
      ] },
    // ベル（でんわの上。ふたつ）。できたとき、ベルが鳴って ぶるぶるゆれる。ドアを先に付けると、もう入らない
    { id: 'bell', on: ['phone'],
      shapes: [
        { type: 'sphere', size: [0.08], half: true, pos: [0.2, 1.7, -0.52], color: '#f2c14e', mat: 'metal' },
        { type: 'sphere', size: [0.08], half: true, pos: [0.36, 1.7, -0.52], color: '#f2c14e', mat: 'metal' },
        { type: 'cyl', size: [0.02, 0.14], pos: [0.28, 1.76, -0.52], color: SILVER, mat: 'metal' },
      ] },
    // でんわちょう（したの たなに のった3さつ）。ドアを先に付けると、もう入らない
    { id: 'book', on: ['back'],
      shapes: [
        { type: 'rbox', size: [0.64, 0.05, 0.34], pos: [-0.3, 1.1, -0.5], color: '#8a5a36', r: 0.015 },
        { type: 'rbox', size: [0.5, 0.1, 0.3], pos: [-0.3, 1.175, -0.5], color: '#f2c94c', r: 0.02 },
        { type: 'rbox', size: [0.46, 0.08, 0.28], pos: [-0.3, 1.265, -0.5], color: '#e0524a', r: 0.02 },
        { type: 'rbox', size: [0.42, 0.07, 0.26], pos: [-0.3, 1.34, -0.5], color: '#4aa3df', r: 0.02 },
      ] },
    // ドア（まえ。ガラスのとびら）。先に付けると、でんわ・ベル・でんわちょうは もう入らない
    { id: 'door', on: ['frame'], closes: ['phone', 'bell', 'book'],
      shapes: [
        { type: 'rbox', size: [1.0, 0.5, 0.08], pos: [0, 0.45, 0.7], color: GREEN, r: 0.02 },
        { type: 'rbox', size: [1.0, 1.7, 0.03], pos: [0, 1.55, 0.7], color: GLASS, mat: 'glass', r: 0.01 },
        { type: 'rbox', size: [0.1, 2.4, 0.08], pos: [-0.55, 1.4, 0.7], color: GREEN_D, r: 0.03 },
        { type: 'rbox', size: [0.1, 2.4, 0.08], pos: [0.55, 1.4, 0.7], color: GREEN_D, r: 0.03 },
        { type: 'rbox', size: [1.2, 0.1, 0.08], pos: [0, 2.65, 0.7], color: GREEN_D, r: 0.03 },
        { type: 'rbox', size: [1.0, 0.06, 0.06], pos: [0, 1.95, 0.7], color: GREEN, r: 0.02 },
        { type: 'rbox', size: [1.0, 0.06, 0.06], pos: [0, 1.3, 0.7], color: GREEN, r: 0.02 },
      ] },
    // とって（ドアのみぎ）
    { id: 'handle', on: ['door'],
      shapes: [
        { type: 'rbox', size: [0.06, 0.5, 0.06], pos: [0.5, 1.3, 0.84], color: SILVER, mat: 'metal', r: 0.025 },
        { type: 'cyl', size: [0.03, 0.1], pos: [0.5, 1.5, 0.79], rot: [90, 0, 0], color: SILVER, mat: 'metal' },
        { type: 'cyl', size: [0.03, 0.1], pos: [0.5, 1.1, 0.79], rot: [90, 0, 0], color: SILVER, mat: 'metal' },
      ] },
    // いりぐちの だんさ（まえ）
    { id: 'step', on: ['base'],
      shapes: [
        { type: 'rbox', size: [1.3, 0.12, 0.42], pos: [0, 0.06, 1.06], color: '#a7adb4', r: 0.03 },
        { type: 'rbox', size: [1.0, 0.04, 0.3], pos: [0, 0.14, 1.06], color: '#3a3d42', r: 0.015 },
      ] },
  ],
  finale: { type: 'shake' },   // ベルが鳴って、ぶるぶるゆれる
});
