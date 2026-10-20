// No.26 ショベルカー（17部品、★★★、どうろ、できたとき＝アーム（ブーム・アーム・バケット・シリンダー）が根もとを中心に上下に動く）
// 車の前は +x。アームは z 軸のまわりに動く（カメラから見て上下）。バケットは地面に付けたまま、上へ振れる（swing の oneway）。
// 入れ忘れのわな: やね→うんてんしゅ、ボンネット→エンジン、タンクのカバー→タンク（カバーを先にのせると、中の部品はもう入らない）
import '../config.js?v=6250ca2';

const YEL = '#f5b700', DARK = '#3b3f46', GRAY = '#5b6068', SILVER = '#c8ccd2', GLASS = '#8fd3f5', BLACK = '#2a2c30';

// キャタピラ（2つとも同じ形：kind 'track'）。長い黒いベルトと、両はしの車輪
const track = (id, z) => ({
  id, kind: 'track', on: ['chassis'],
  shapes: [
    { type: 'rbox', size: [3.0, 0.7, 0.7], pos: [0, 0.35, z], color: DARK, r: 0.3 },
    { type: 'cyl', size: [0.35, 0.72], pos: [1.5, 0.35, z], rot: [90, 0, 0], color: BLACK },
    { type: 'cyl', size: [0.35, 0.72], pos: [-1.5, 0.35, z], rot: [90, 0, 0], color: BLACK },
    { type: 'cyl', size: [0.18, 0.78], pos: [1.5, 0.35, z], rot: [90, 0, 0], color: SILVER, mat: 'metal' },
    { type: 'cyl', size: [0.18, 0.78], pos: [-1.5, 0.35, z], rot: [90, 0, 0], color: SILVER, mat: 'metal' },
  ],
});

KP.models.push({
  id: 'shovel', no: 26, name: 'ショベルカー', room: 'douro',
  parts: [
    // 最初に付けられるのは「だい」だけ（まんなかのわく・まわる台の輪・ドーザーのブレード）
    { id: 'chassis', on: [],
      shapes: [
        { type: 'rbox', size: [2.4, 0.35, 1.1], pos: [0, 0.5, 0], color: GRAY, r: 0.08 },
        { type: 'cyl', size: [0.75, 0.08], pos: [0, 0.68, 0], color: BLACK },
        { type: 'rbox', size: [1.0, 0.12, 0.12], pos: [1.6, 0.45, 0.5], color: GRAY, r: 0.03 },
        { type: 'rbox', size: [1.0, 0.12, 0.12], pos: [1.6, 0.45, -0.5], color: GRAY, r: 0.03 },
        { type: 'rbox', size: [0.16, 0.55, 2.6], pos: [2.1, 0.35, 0], color: YEL, r: 0.05 },
      ] },
    track('track1', 0.95), track('track2', -0.95),
    // まわる台（うわもの）。ブームの根もとのうけ金具つき
    { id: 'deck', on: ['chassis'],
      shapes: [
        { type: 'rbox', size: [3.0, 0.3, 1.8], pos: [0, 0.85, 0], color: YEL, r: 0.08 },
        { type: 'rbox', size: [3.06, 0.08, 1.86], pos: [0, 0.74, 0], color: DARK, r: 0.03 },
        { type: 'rbox', size: [0.4, 0.5, 0.1], pos: [0.85, 1.25, 0.28], color: YEL, r: 0.03 },
        { type: 'rbox', size: [0.4, 0.5, 0.1], pos: [0.85, 1.25, -0.28], color: YEL, r: 0.03 },
      ] },
    // おもり（うしろ）。テールランプつき
    { id: 'counterweight', on: ['deck'],
      shapes: [
        { type: 'rbox', size: [0.45, 0.85, 1.7], pos: [-1.275, 1.425, 0], color: GRAY, r: 0.1 },
        { type: 'sphere', size: [0.08], pos: [-1.5, 1.7, 0.6], color: '#d9302a' },
        { type: 'sphere', size: [0.08], pos: [-1.5, 1.7, -0.6], color: '#d9302a' },
      ] },
    // エンジン（ボンネットのなか）
    { id: 'engine', on: ['deck'],
      shapes: [
        { type: 'rbox', size: [0.6, 0.5, 1.0], pos: [-0.68, 1.25, 0], color: '#7b838c', mat: 'metal', r: 0.05 },
        { type: 'cyl', size: [0.12, 0.2], pos: [-0.8, 1.6, 0.25], color: '#d9302a' },
        { type: 'cyl', size: [0.06, 1.15], pos: [-0.55, 1.1, 0], rot: [90, 0, 0], color: BLACK },
      ] },
    // ボンネット（先にのせると、エンジンは もう入らない）。うえと両がわのかべ
    { id: 'hood', on: ['deck'], closes: ['engine'],
      shapes: [
        { type: 'rbox', size: [0.75, 0.1, 1.7], pos: [-0.675, 1.75, 0], color: YEL, r: 0.04 },
        { type: 'rbox', size: [0.75, 0.75, 0.08], pos: [-0.675, 1.375, 0.81], color: YEL, r: 0.03 },
        { type: 'rbox', size: [0.75, 0.75, 0.08], pos: [-0.675, 1.375, -0.81], color: YEL, r: 0.03 },
        { type: 'rbox', size: [0.5, 0.02, 0.07], pos: [-0.675, 1.81, 0.4], color: BLACK, r: 0.008 },
        { type: 'rbox', size: [0.5, 0.02, 0.07], pos: [-0.675, 1.81, 0], color: BLACK, r: 0.008 },
        { type: 'rbox', size: [0.5, 0.02, 0.07], pos: [-0.675, 1.81, -0.4], color: BLACK, r: 0.008 },
      ] },
    // タンク（がわの はこの なか）。バンドつき
    { id: 'tank', on: ['deck'],
      shapes: [
        { type: 'cyl', size: [0.2, 0.7], pos: [0.2, 1.25, 0.7], rot: [0, 0, 90], color: '#3f8fd0' },
        { type: 'cyl', size: [0.07, 0.12], pos: [0.2, 1.5, 0.7], color: SILVER, mat: 'metal' },
        { type: 'rbox', size: [0.06, 0.5, 0.46], pos: [0.0, 1.25, 0.7], color: DARK, r: 0.02 },
        { type: 'rbox', size: [0.06, 0.5, 0.46], pos: [0.4, 1.25, 0.7], color: DARK, r: 0.02 },
      ] },
    // タンクのカバー（先にのせると、タンクは もう入らない）。うえ・そと・りょうはし
    { id: 'tankcover', on: ['deck'], closes: ['tank'],
      shapes: [
        { type: 'rbox', size: [0.95, 0.07, 0.5], pos: [0.2, 1.72, 0.72], color: YEL, r: 0.03 },
        { type: 'rbox', size: [0.95, 0.62, 0.06], pos: [0.2, 1.38, 0.95], color: YEL, r: 0.03 },
        { type: 'rbox', size: [0.06, 0.62, 0.5], pos: [0.7, 1.38, 0.72], color: YEL, r: 0.03 },
        { type: 'rbox', size: [0.06, 0.62, 0.5], pos: [-0.3, 1.38, 0.72], color: YEL, r: 0.03 },
      ] },
    // うんてんせき（4本のはしらとガラス。うえと ゆかはあいている）
    { id: 'cab', on: ['deck'],
      shapes: [
        { type: 'rbox', size: [0.07, 0.9, 0.07], pos: [-0.22, 1.5, 0.43], color: YEL, r: 0.02 },
        { type: 'rbox', size: [0.07, 0.9, 0.07], pos: [-0.22, 1.5, -0.43], color: YEL, r: 0.02 },
        { type: 'rbox', size: [0.07, 0.9, 0.07], pos: [0.62, 1.5, 0.43], color: YEL, r: 0.02 },
        { type: 'rbox', size: [0.07, 0.9, 0.07], pos: [0.62, 1.5, -0.43], color: YEL, r: 0.02 },
        { type: 'rbox', size: [0.04, 0.8, 0.8], pos: [0.63, 1.5, 0], color: GLASS, mat: 'glass', r: 0.015 },
        { type: 'rbox', size: [0.8, 0.8, 0.04], pos: [0.2, 1.5, 0.43], color: GLASS, mat: 'glass', r: 0.015 },
        { type: 'rbox', size: [0.8, 0.8, 0.04], pos: [0.2, 1.5, -0.43], color: GLASS, mat: 'glass', r: 0.015 },
        { type: 'rbox', size: [0.04, 0.8, 0.8], pos: [-0.23, 1.5, 0], color: GLASS, mat: 'glass', r: 0.015 },
      ] },
    // うんてんしゅ（シート・からだ・ヘルメット）
    { id: 'driver', on: ['cab'],
      shapes: [
        { type: 'rbox', size: [0.4, 0.18, 0.45], pos: [0.0, 1.12, 0], color: DARK, r: 0.04 },
        { type: 'rbox', size: [0.08, 0.55, 0.45], pos: [-0.18, 1.4, 0], color: DARK, r: 0.03 },
        { type: 'rbox', size: [0.4, 0.14, 0.25], pos: [0.2, 1.27, 0], color: '#2f4f9a', r: 0.04 },
        { type: 'rbox', size: [0.28, 0.45, 0.32], pos: [0.0, 1.5, 0], color: '#ff8a2b', r: 0.05 },
        { type: 'sphere', size: [0.12], pos: [0.02, 1.82, 0], color: '#ffcfa3' },
        { type: 'sphere', half: true, size: [0.14], pos: [0.02, 1.81, 0], color: '#f4f6f8' },
        { type: 'rbox', size: [0.3, 0.12, 0.12], pos: [0.2, 1.55, 0.2], color: '#ff8a2b', r: 0.04 },
        { type: 'rbox', size: [0.3, 0.12, 0.12], pos: [0.2, 1.55, -0.2], color: '#ff8a2b', r: 0.04 },
      ] },
    // うんてんせきのやね（先にのせると、うんてんしゅは もう入らない）
    { id: 'cabroof', on: ['cab'], closes: ['driver'],
      shapes: [
        { type: 'rbox', size: [1.1, 0.1, 1.1], pos: [0.2, 2.0, 0], color: YEL, r: 0.04 },
        { type: 'rbox', size: [0.25, 0.06, 1.1], pos: [0.75, 1.98, 0], color: DARK, r: 0.02 },
      ] },
    // ライト（やねの上の、ちいさな作業灯）
    { id: 'worklight', on: ['cabroof'],
      shapes: [
        { type: 'rbox', size: [0.2, 0.1, 0.28], pos: [0.45, 2.1, 0.25], color: DARK, r: 0.02 },
        { type: 'sphere', size: [0.08], pos: [0.57, 2.1, 0.25], color: '#ffe066' },
      ] },
    // ブーム（根もとから、ななめ上にのびる大きなうで）
    { id: 'boom', on: ['deck'],
      shapes: [
        { type: 'cyl', size: [0.2, 0.44], pos: [0.85, 1.25, 0], rot: [90, 0, 0], color: YEL },
        { type: 'rbox', size: [1.75, 0.36, 0.4], pos: [1.425, 1.85, 0], rot: [0, 0, 46.2], color: YEL, r: 0.12 },
        { type: 'cyl', size: [0.22, 0.44], pos: [2.0, 2.45, 0], rot: [90, 0, 0], color: YEL },
      ] },
    // アーム（ブームの先から、ななめ下へ）
    { id: 'stick', on: ['boom'],
      shapes: [
        { type: 'rbox', size: [2.05, 0.3, 0.3], pos: [2.625, 1.725, 0], rot: [0, 0, -49.2], color: YEL, r: 0.1 },
        { type: 'rbox', size: [0.12, 0.34, 0.32], pos: [2.625, 1.725, 0], rot: [0, 0, -49.2], color: DARK, r: 0.02 },
      ] },
    // バケット（うしろの板・そこ・がわの板・つめ3本）
    { id: 'bucket', on: ['stick'],
      shapes: [
        { type: 'cyl', size: [0.14, 0.38], pos: [3.25, 1.0, 0], rot: [90, 0, 0], color: GRAY },
        { type: 'rbox', size: [0.1, 0.8, 0.8], pos: [3.12, 0.62, 0], color: GRAY, r: 0.03 },
        { type: 'rbox', size: [0.8, 0.1, 0.8], pos: [3.52, 0.27, 0], color: GRAY, r: 0.03 },
        { type: 'rbox', size: [0.8, 0.5, 0.08], pos: [3.52, 0.52, 0.36], color: GRAY, r: 0.03 },
        { type: 'rbox', size: [0.8, 0.5, 0.08], pos: [3.52, 0.52, -0.36], color: GRAY, r: 0.03 },
        { type: 'cone', size: [0.07, 0.2], pos: [4.0, 0.27, 0.26], rot: [0, 0, -90], color: SILVER, mat: 'metal' },
        { type: 'cone', size: [0.07, 0.2], pos: [4.0, 0.27, 0], rot: [0, 0, -90], color: SILVER, mat: 'metal' },
        { type: 'cone', size: [0.07, 0.2], pos: [4.0, 0.27, -0.26], rot: [0, 0, -90], color: SILVER, mat: 'metal' },
      ] },
    // ゆあつシリンダー（だいの上から、ブームのまんなかへ。ブームといっしょに動く）
    { id: 'piston', on: ['boom'],
      shapes: [
        { type: 'cyl', size: [0.1, 0.7], pos: [1.137, 1.346, 0.4], rot: [0, 0, -32.3], color: '#5b6068' },
        { type: 'cyl', size: [0.06, 0.55], pos: [1.404, 1.769, 0.4], rot: [0, 0, -32.3], color: SILVER, mat: 'metal' },
        { type: 'rbox', size: [0.18, 0.18, 0.14], pos: [1.548, 1.997, 0.33], color: DARK, r: 0.03 },
        { type: 'rbox', size: [0.22, 0.14, 0.14], pos: [0.95, 1.0, 0.4], color: DARK, r: 0.03 },
      ] },
  ],
  // アームが、根もと（ブームの付け根）を中心に上へ振れて、もどる。バケットは地面にあるときがいちばん下
  finale: { type: 'swing', part: ['boom', 'stick', 'bucket', 'piston'], axis: 'z', pivot: [0.85, 1.25, 0], oneway: true },
});
