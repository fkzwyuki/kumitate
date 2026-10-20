// 画面の切り替え（はじめの画面 ⇄ 組み立て、DESIGN.md §3）と、描く・動かすの土台（§8.2）
import * as THREE from 'three';
import './config.js?v=6250ca2';
import './models/index.js?v=6250ca2';
import { CFG } from './config.js?v=6250ca2';
import { createStage } from './stage.js?v=6250ca2';
import { createGame } from './assemble.js?v=6250ca2';
import * as animMod from './anim.js?v=6250ca2';
import { unlock } from './sound.js?v=6250ca2';
import { createAlbum, record } from './album.js?v=6250ca2';

const $ = id => document.getElementById(id);
const cv = $('cv');

// ---------- 描画の準備（1枚の canvas を上下に分けて描く）----------
const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(CFG.MAX_DPR, window.devicePixelRatio || 1));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.autoClear = false;   // 上下で別々に消すので自動では消さない

const stage = createStage();
const view = { W: 0, H: 0, roomRect: { x: 0, y: 0, w: 1, h: 1 }, runRect: { x: 0, y: 0, w: 1, h: 1 } };

// 画面の下の安全な余白（ジェスチャーバーなど）を知るための見えない箱
const probe = document.createElement('div');
probe.style.cssText = 'position:fixed;left:0;bottom:0;width:0;height:0;visibility:hidden;padding-bottom:env(safe-area-inset-bottom,0px)';
document.body.appendChild(probe);

// ---------- 画面のわけかた ----------
function layout() {
  const W = window.innerWidth, H = window.innerHeight;
  view.W = W; view.H = H;
  renderer.setSize(W, H, false);
  const topH = Math.round(H * CFG.ROOM_RATIO);
  const safeBottom = parseFloat(getComputedStyle(probe).paddingBottom) || 0;
  view.roomRect = { x: 0, y: 0, w: W, h: topH };
  const runTop = topH + CFG.RUNNER_GAP_TOP_PX, runBot = H - CFG.RUNNER_GAP_BOTTOM_PX - safeBottom;
  view.runRect = { x: 0, y: runTop, w: W, h: Math.max(40, runBot - runTop) };
  stage.layout(W, topH, W >= H);
  if (game) game.layout();
  const root = document.documentElement.style;
  root.setProperty('--roomh', topH + 'px');
  root.setProperty('--undo-glow-sec', CFG.UNDO_GLOW_SEC + 's');
  root.setProperty('--forgot-shake-sec', CFG.FORGOT_SHAKE_SEC + 's');
  root.setProperty('--forgot-deg', CFG.FORGOT_SHAKE_DEG + 'deg');
  root.setProperty('--forgot-scale', CFG.FORGOT_BUBBLE_SCALE);
  $('paper').style.top = topH + 'px';
  $('bar').style.top = topH + 'px';
  $('scroll').style.top = (runBot + CFG.SCROLLBAR_GAP_PX) + 'px';
  $('toast').style.top = (topH - 70) + 'px';
  fitName();
  animMod.dirty();
}

/** 名前の札から名前がはみ出すとき（きゅうきゅうしゃ・ごみしゅうしゅうしゃ など長い名前）は、文字を小さくして収める */
function fitName() {
  const el = $('nameplate');
  el.style.fontSize = ''; el.style.letterSpacing = '';
  if (!el.clientWidth) return;                         // 画面が隠れているとき（はじめの画面）は測れない
  let fs = parseFloat(getComputedStyle(el).fontSize);
  while (el.scrollWidth > el.clientWidth + 1 && fs > CFG.NAME_MIN_PX) {
    fs -= 0.5; el.style.fontSize = fs + 'px'; el.style.letterSpacing = '.02em';
  }
}

// ---------- 画面の部品（HUD）----------
let toastTimer = 0, undoHintTimer = 0;
const ui = {
  canvas: cv, thumb: $('thumb'), view,
  setCount(n, total) { $('countNum').textContent = `${n}/${total}`; $('undoBtn').disabled = n === 0 || n === total; },
  toast(text) {
    const el = $('toast'); el.textContent = text; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), CFG.TOAST_SEC * 1000);
  },
  nudge(on) { $('hintBtn').classList.toggle('nudge', on); },
  showDone(on) { $('done').hidden = !on; $('undoArea').hidden = on; },
  /** 入れ忘れの吹き出し（出ているあいだ、「はずす」ボタンもゆっくり光る）*/
  showForgot(on) {
    $('forgot').classList.toggle('show', on); $('undoBtn').classList.toggle('glow', on);
    if (!on) { clearTimeout(undoHintTimer); $('undoBtn').classList.remove('hinted'); }
  },
  /** ヒント：「はずす」ボタンを強く光らせる */
  undoHint() {
    const b = $('undoBtn'); b.classList.add('hinted');
    clearTimeout(undoHintTimer); undoHintTimer = setTimeout(() => b.classList.remove('hinted'), CFG.UNDO_HINT_GLOW_SEC * 1000);
  },
  onDone(model) { record.add(model.id); },    // 最後の1個がはまったら、ずかんの回数を増やす
};

// ---------- 画面の切り替え ----------
let game = null, current = null;
const album = createAlbum({ models: KP.models, onSelect: model => startModel(model) });

/** 組み立てをはじめる（ずかんのカード・もういっかい・?m= から）*/
function startModel(model) {
  if (game) game.dispose();
  animMod.clearAll();
  album.hide(); $('play').hidden = false;
  current = model;
  $('nameplate').innerHTML = `<span class="no">No.${model.no}</span><span>${model.name}</span>`;
  ui.showDone(false);
  game = createGame({ model, stage, ui });
  layout();
  KP.game = game;
}
function restart() { startModel(current); }

/** はじめの画面へ（組み立て途中の状態は捨てる）*/
function showAlbum() {
  if (game) { game.dispose(); game = null; KP.game = null; }
  animMod.clearAll();
  clearTimeout(toastTimer); $('toast').classList.remove('show');
  $('play').hidden = true; ui.showDone(false);
  album.show();
}

$('hintBtn').addEventListener('click', () => { if (game) game.hint(); });
$('undoBtn').addEventListener('click', () => { if (game) game.undo(); });
$('backBtn').addEventListener('click', showAlbum);
$('toAlbumBtn').addEventListener('click', showAlbum);
$('againBtn').addEventListener('click', restart);
window.addEventListener('pointerdown', unlock, { once: true });
window.addEventListener('resize', layout);

// ---------- まわす ----------
let last = performance.now();
function step(dt, now) {
  animMod.update(dt);
  if (stage.update(dt)) animMod.dirty();
  if (game && game.update(dt, now)) animMod.dirty();
  if (animMod.takeDirty() && game) render();     // はじめの画面のときは描かない
}
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  step(dt, now);
  requestAnimationFrame(frame);
}

function render() {
  const H = view.H;
  renderer.setScissorTest(false); renderer.setClearColor(0x000000, 0); renderer.clear();
  renderer.setScissorTest(true);
  const r = view.roomRect;                                             // 上：部屋（遠近のあるカメラ）
  renderer.setViewport(r.x, H - r.y - r.h, r.w, r.h); renderer.setScissor(r.x, H - r.y - r.h, r.w, r.h);
  renderer.setClearColor(stage.bg, 1); renderer.clear();               // 背景は clear で塗る（autoClear=false だと scene.background は塗られない）
  renderer.render(stage.scene, stage.cam);
  if (game) {                                                          // 下：ランナー（平行投影）
    const q = view.runRect;
    renderer.setViewport(q.x, H - q.y - q.h, q.w, q.h); renderer.setScissor(q.x, H - q.y - q.h, q.w, q.h);
    renderer.clearDepth(); renderer.render(game.runner.scene, game.runner.cam);
  }
}

// ---------- はじめる ----------
const params = new URLSearchParams(location.search);
const direct = KP.models.find(m => m.id === params.get('m'));   // ?m=<id> でその題材を直接開く（開発用）
layout();
if (direct) startModel(direct); else album.show();
requestAnimationFrame(frame);

// 開発時の確認用の入口（部品一覧、ランナーのマスの画面位置など）
KP.view = view;
KP.stageObj = stage;
KP.debug = {
  get game() { return game; },
  restart, startModel, showAlbum, render, album,
  /** 隠れたブラウザでも時間を進める（開発用）。sec 秒ぶん、1/60秒ずつ進める */
  tick(sec) { for (let t = 0; t < sec; t += 1 / 60) step(1 / 60, performance.now()); },
  place: id => game.debug.place(id),
  slotScreen: id => game.debug.slotScreen(id),
  cellScreen: id => game.debug.cellScreen(id),
  state: () => game.debug.state(),
  ghostsVisible: () => game.debug.ghostsVisible(),
  forgotShown: () => game.debug.forgotShown(),
  history: () => game.debug.history(),
  undo: () => game.undo(),
};
