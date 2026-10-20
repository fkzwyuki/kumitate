// No.1 ゆきだるま（10部品、★、そと、できたとき＝ぽんぽん跳ねる）
// 部品は完成したときの位置で書く。中心はプログラムが計算する（DESIGN.md §6.1）
import '../config.js?v=6250ca2';

const SNOW = '#f7fbff', COAL = '#26282c', HAT = '#2f3238', RED = '#e5483f', BROWN = '#8b5a2b';

// め（2つとも同じ形：kind 'eye'）。顔の表面にのせる
const eye = (id, x) => ({
  id, kind: 'eye', on: ['head'],
  shapes: [{ type: 'sphere', size: [0.09], pos: [x, 2.52, 0.66], color: COAL }],
});
// うで（2本とも同じ形：kind 'arm'）。横にのびた枝に、小さな枝がもう1本
const arm = (id, x) => ({
  id, kind: 'arm', on: ['body'],
  shapes: [
    { type: 'cyl', size: [0.055, 1.0], pos: [x, 1.4, 0], rot: [0, 0, 90], color: BROWN },
    { type: 'cyl', size: [0.04, 0.34], pos: [x, 1.55, 0], color: BROWN },
  ],
});

KP.models.push({
  id: 'snowman', no: 1, name: 'ゆきだるま', room: 'soto',
  parts: [
    // 最初に付けられるのは「からだ」だけ
    { id: 'body', on: [],
      shapes: [
        { type: 'sphere', size: [1.0], pos: [0, 1.0, 0], color: SNOW },
        { type: 'sphere', size: [0.075], pos: [0, 1.32, 0.96], color: COAL },   // ボタン
        { type: 'sphere', size: [0.075], pos: [0, 0.98, 1.0], color: COAL },
        { type: 'sphere', size: [0.075], pos: [0, 0.64, 0.97], color: COAL },
      ] },
    // あたま（先に付けると、首にまくマフラーはもう通せない）
    { id: 'head', on: ['body'], closes: ['scarf'],
      shapes: [{ type: 'sphere', size: [0.68], pos: [0, 2.4, 0], color: SNOW }] },
    // マフラー（首にまく輪と、前にたれる先）
    { id: 'scarf', on: ['body'],
      shapes: [
        { type: 'torus', size: [0.56, 0.17], pos: [0, 1.9, 0], rot: [90, 0, 0], color: RED },
        { type: 'rbox', size: [0.3, 0.62, 0.1], pos: [0.3, 1.5, 0.78], rot: [-22, 0, 0], color: RED, r: 0.04 },
      ] },
    arm('arm1', -1.1), arm('arm2', 1.1),
    eye('eye1', -0.22), eye('eye2', 0.22),
    { id: 'nose', on: ['head'],
      shapes: [{ type: 'cone', size: [0.1, 0.5], pos: [0, 2.35, 0.88], rot: [90, 0, 0], color: '#ff8a2b' }] },
    // ぼうし：つば → つつ
    { id: 'brim', on: ['head'],
      shapes: [{ type: 'cyl', size: [0.78, 0.1], pos: [0, 3.05, 0], color: HAT }] },
    { id: 'hat', on: ['brim'],
      shapes: [
        { type: 'cyl', size: [0.46, 0.72], pos: [0, 3.42, 0], color: HAT },
        { type: 'cyl', size: [0.475, 0.14], pos: [0, 3.2, 0], color: RED },   // 赤いおび
      ] },
  ],
  finale: { type: 'bounce' },   // 全体がぽんぽん跳ねる
});
