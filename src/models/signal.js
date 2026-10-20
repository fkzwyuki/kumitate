// No.20 しんごうき（12部品、★、どうろ、できたとき＝ライトが 青→黄→赤 の順に光る）
// ひさしを付けると、その下のライトは もう入らない（入れ忘れのわな。ひさし3つが それぞれ ライト3つを閉じる）。
// 車用の横長のしんごうき（ポール＋うで＋ほんたい）。ライトは色がちがうので、それぞれ別の kind（kind なし）
import '../config.js?v=6250ca2';

const DARK = '#3a3f47', RING = '#1d2024', POLE = '#aeb6bd', YEL = '#f2c230';
const BLUE = '#27b6e0', YELLOW = '#f7c531', RED = '#e0443a';

// ライトの よこの位置と高さ（ほんたいの まんなかが x=0.5、y=3.1）
const LX = [-0.3, 0.5, 1.3], LY = 3.1;

// ライト（レンズ）1つ。色がちがうので、色ごとに別の部品
const light = (id, x, color) => ({
  id, on: ['body'],
  shapes: [
    { type: 'cyl', size: [0.28, 0.14], pos: [x, LY, 0.37], rot: [90, 0, 0], color },
  ],
});

// ひさし（3つとも同じ形：kind 'visor'）。ライトのまわりの筒＋上の ひさし板。x だけがちがう
const visor = (id, x, lightId) => ({
  id, kind: 'visor', on: ['body'], closes: [lightId],
  shapes: [
    { type: 'tube', size: [0.38, 0.34], pos: [x, LY, 0.47], rot: [90, 0, 0], color: '#8d96a0' },
    { type: 'rbox', size: [0.8, 0.05, 0.44], pos: [x, LY + 0.405, 0.52], color: '#8d96a0', r: 0.02 },
  ],
});

KP.models.push({
  id: 'signal', no: 20, name: 'しんごうき', room: 'douro',
  parts: [
    // 最初に付けられるのは「だい」だけ
    { id: 'base', on: [],
      shapes: [
        { type: 'rbox', size: [4.0, 0.2, 1.6], pos: [0.2, 0.1, 0], color: '#7a8088', r: 0.05 },
        { type: 'rbox', size: [3.7, 0.04, 1.3], pos: [0.2, 0.22, 0], color: '#9aa1a8', r: 0.02 },
      ] },
    // ポール
    { id: 'pole', on: ['base'],
      shapes: [
        { type: 'cyl', size: [0.16, 3.8], pos: [-1.4, 2.14, 0], color: POLE, mat: 'metal' },
        { type: 'cyl', size: [0.26, 0.2], pos: [-1.4, 0.34, 0], color: '#8d949b', mat: 'metal' },
      ] },
    // うで（ポールの上から よこへ のびる）
    { id: 'arm', on: ['pole'],
      shapes: [
        { type: 'cyl', size: [0.09, 2.9], pos: [0.05, 3.85, 0], rot: [0, 0, 90], color: POLE, mat: 'metal' },
        { type: 'sphere', size: [0.18], pos: [-1.4, 4.0, 0], color: POLE, mat: 'metal' },
      ] },
    // ほんたい（よこながの はこ。うらの かべと、うでから つるす フックつき）。レンズの わくの輪も ここ
    { id: 'body', on: ['arm'],
      shapes: [
        { type: 'rbox', size: [2.7, 0.9, 0.6], pos: [0.5, LY, 0], color: DARK, r: 0.1 },
        { type: 'cyl', size: [0.07, 0.35], pos: [-0.2, 3.675, 0], color: POLE, mat: 'metal' },
        { type: 'cyl', size: [0.07, 0.35], pos: [1.2, 3.675, 0], color: POLE, mat: 'metal' },
        { type: 'cyl', size: [0.34, 0.04], pos: [LX[0], LY, 0.32], rot: [90, 0, 0], color: RING },
        { type: 'cyl', size: [0.34, 0.04], pos: [LX[1], LY, 0.32], rot: [90, 0, 0], color: RING },
        { type: 'cyl', size: [0.34, 0.04], pos: [LX[2], LY, 0.32], rot: [90, 0, 0], color: RING },
      ] },
    // ライト3つ（青・黄・赤）。ひさしを先に付けると、もう入らない
    light('lightB', LX[0], BLUE), light('lightY', LX[1], YELLOW), light('lightR', LX[2], RED),
    // ひさし3つ。先に付けると、その下のライトは もう入らない
    visor('visor1', LX[0], 'lightB'), visor('visor2', LX[1], 'lightY'), visor('visor3', LX[2], 'lightR'),
    // うらいた（ほんたいの うしろの黄色い板。よこから見える）
    { id: 'backboard', on: ['body'],
      shapes: [
        { type: 'rbox', size: [3.0, 1.2, 0.05], pos: [0.5, LY, -0.36], color: YEL, r: 0.04 },
      ] },
    // おしボタン（ポールの まえの小さな はこ）
    { id: 'pushbox', on: ['pole'],
      shapes: [
        { type: 'rbox', size: [0.3, 0.5, 0.28], pos: [-1.4, 1.5, 0.22], color: YEL, r: 0.05 },
        { type: 'sphere', size: [0.09], pos: [-1.4, 1.58, 0.4], color: RED },
      ] },
  ],
  finale: { type: 'light', parts: ['lightB', 'lightY', 'lightR'], seq: true },   // 青→黄→赤 と順に光る
});
