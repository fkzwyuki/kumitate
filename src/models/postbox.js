// No.18 ポスト（11部品、★、どうろ、できたとき＝ぽんぽん跳ねる）
// 赤くて丸いポスト。やねを付けると、中の てがみ×3 は もう入らない（入れ忘れのわな）。マークや文字は描かない
import '../config.js?v=6250ca2';

const RED = '#e0392e', RED_D = '#b02a22', GRAY = '#8a8f96';

// てがみ（3つとも同じ形：kind 'letter'）。トレーの上に、たててならべる
const letter = (id, z) => ({
  id, kind: 'letter', on: ['tray'],
  shapes: [{ type: 'rbox', size: [0.5, 0.36, 0.04], pos: [0, 1.81, z], color: '#fff6dc', r: 0.012 }],
});

KP.models.push({
  id: 'postbox', no: 18, name: 'ポスト', room: 'douro',
  parts: [
    // 最初に付けられるのは「だい」だけ
    { id: 'base', on: [],
      shapes: [
        { type: 'cyl', size: [0.85, 0.2], pos: [0, 0.1, 0], color: '#8d939a' },
      ] },
    // ほんたい（上があいた赤い筒。下のおびと、上のふち）
    { id: 'body', on: ['base'],
      shapes: [
        { type: 'tube', size: [0.62, 1.9], pos: [0, 1.15, 0], color: RED },
        { type: 'cyl', size: [0.66, 0.14], pos: [0, 0.27, 0], color: RED_D },
        { type: 'torus', size: [0.62, 0.04], pos: [0, 2.1, 0], rot: [90, 0, 0], color: RED_D },
      ] },
    // トレー（筒の中の 丸い板）
    { id: 'tray', on: ['body'],
      shapes: [
        { type: 'cyl', size: [0.58, 0.06], pos: [0, 1.6, 0], color: GRAY, mat: 'metal' },
      ] },
    // てがみ×3（やねを先に付けると、もう入らない）
    letter('letter1', -0.22), letter('letter2', 0), letter('letter3', 0.22),
    // やね（まるい屋根）。先に付けると、てがみは もう入らない
    { id: 'roof', on: ['body'], closes: ['letter1', 'letter2', 'letter3'],
      shapes: [
        { type: 'cyl', size: [0.72, 0.1], pos: [0, 2.15, 0], color: RED_D },
        { type: 'sphere', size: [0.7], half: true, pos: [0, 2.2, 0], color: RED },
      ] },
    // いれぐち（まえの すきまと、ひさし）
    { id: 'slot', on: ['body'],
      shapes: [
        { type: 'rbox', size: [0.5, 0.12, 0.1], pos: [0, 1.78, 0.6], color: '#1b1f24', r: 0.02 },
        { type: 'rbox', size: [0.6, 0.08, 0.18], pos: [0, 1.88, 0.62], color: RED_D, r: 0.03 },
      ] },
    // とりだしぐちの とびら（まえの下）
    { id: 'door', on: ['body'],
      shapes: [
        { type: 'rbox', size: [0.5, 0.6, 0.06], pos: [0, 0.85, 0.6], color: RED_D, r: 0.03 },
        { type: 'cyl', size: [0.04, 0.05], pos: [0.15, 0.85, 0.66], rot: [90, 0, 0], color: '#cfd3d8', mat: 'metal' },
      ] },
    // しろい おび（ほんたいに巻く）
    { id: 'band', on: ['body'],
      shapes: [
        { type: 'torus', size: [0.63, 0.04], pos: [0, 1.25, 0], rot: [90, 0, 0], color: '#ffffff' },
      ] },
    // てっぺんの たま
    { id: 'knob', on: ['roof'],
      shapes: [
        { type: 'cyl', size: [0.05, 0.12], pos: [0, 2.94, 0], color: '#cfd3d8', mat: 'metal' },
        { type: 'sphere', size: [0.11], pos: [0, 3.05, 0], color: RED_D },
      ] },
  ],
  finale: { type: 'bounce' },   // ぽんぽん跳ねる
});
