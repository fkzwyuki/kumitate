// ずかん（はじめの画面、DESIGN.md §4.1）と、作った回数の記録
// カードの絵は、題材の完成形をその場で小さく描く（画像ファイルは使わない）。まだのものは黒いシルエット。
import * as THREE from 'three';
import { CFG } from './config.js?v=6250ca2';
import { buildParts, modelBounds, starsOf, disposeGroup } from './shapes.js?v=6250ca2';
import { fitView } from './camfit.js?v=6250ca2';

const $ = id => document.getElementById(id);

// =====================================================================
// 記録（localStorage の kumitate.done = { 題材のid: 作った回数 }）
// 読み書きは try/catch。使えなくても（消えても）メモリの中で遊べる
// =====================================================================
let done = {};

function readStorage() {
  try {
    const raw = localStorage.getItem(CFG.ALBUM_STORAGE_KEY);
    if (!raw) return {};
    const o = JSON.parse(raw), out = {};
    if (o && typeof o === 'object') for (const k of Object.keys(o)) { const n = Math.floor(Number(o[k])); if (n > 0 && Number.isFinite(n)) out[k] = n; }
    return out;
  } catch (e) { return null; }       // 読めなかった（null）ときは、今のメモリのまま
}
function writeStorage() {
  try { localStorage.setItem(CFG.ALBUM_STORAGE_KEY, JSON.stringify(done)); } catch (e) { /* 書けなくても遊べる */ }
}
function reload() { const o = readStorage(); if (o) done = o; }
reload();

export const record = {
  count: id => done[id] || 0,
  /** 作った回数を1つ増やす */
  add(id) { reload(); done[id] = (done[id] || 0) + 1; writeStorage(); },
  /** 全部消す */
  clear() { done = {}; try { localStorage.removeItem(CFG.ALBUM_STORAGE_KEY); } catch (e) { /* 何もしない */ } },
  all: () => ({ ...done }),
};

// =====================================================================
// カードの絵（題材ごとに1回だけ描いて、とっておく）
// =====================================================================
const artCache = new Map();     // 'id|color' / 'id|sil' → canvas
let rend = null;

function getRenderer() {
  if (!rend) {
    rend = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rend.setPixelRatio(1); rend.setSize(CFG.ALBUM_ART_PX, CFG.ALBUM_ART_PX, false);
    rend.outputColorSpace = THREE.SRGBColorSpace; rend.setClearColor(0x000000, 0);
  }
  return rend;
}
/** 絵を描くための WebGL を手放す（描き終わったら呼ぶ。ゲーム本体と2つ持ちつづけない）*/
function releaseRenderer() { if (rend) { rend.dispose(); try { rend.forceContextLoss(); } catch (e) { /* 何もしない */ } rend = null; } }

function artOf(model, silhouette) {
  const key = model.id + (silhouette ? '|sil' : '|color');
  if (artCache.has(key)) return artCache.get(key);
  let out = null;
  try {
    const r = getRenderer(), px = CFG.ALBUM_ART_PX;
    const parts = buildParts(model), scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb59a80, 2.1));
    const sun = new THREE.DirectionalLight(0xffffff, 2.4); sun.position.set(4, 9, 6); scene.add(sun);
    const sil = new THREE.MeshBasicMaterial({ color: CFG.ALBUM_SILHOUETTE });
    parts.forEach(p => {
      p.group.position.copy(p.target);
      if (silhouette) p.group.traverse(o => { if (o.isMesh) o.material = sil; });
      scene.add(p.group);
    });
    const cam = new THREE.PerspectiveCamera(CFG.ALBUM_ART_FOV, 1, 0.1, 300), s = CFG.ALBUM_ART_SAFE;
    const bb = modelBounds(parts), sz = bb.getSize(new THREE.Vector3());
    const fp = Math.min(1, Math.max(0.75, 1.03 * Math.max(sz.x, sz.z) / Math.hypot(sz.x, sz.z)));   // 横長（でんしゃなど）は、はしが切れないように足もとの円を広げる
    fitView(cam, bb, { yaw: CFG.ALBUM_ART_YAW, elev: CFG.ALBUM_ART_ELEV, safe: { l: s, r: s, t: s, b: s }, footprint: fp });
    r.render(scene, cam);
    out = document.createElement('canvas'); out.width = out.height = px;
    out.getContext('2d').drawImage(r.domElement, 0, 0);      // 描いた直後に写し取る
    parts.forEach(p => disposeGroup(p.group));
    sil.dispose();
  } catch (e) { console.warn('[album] 絵を描けなかった:', model.id, e); }
  artCache.set(key, out);
  return out;
}

// =====================================================================
// 画面
// =====================================================================
/**
 * models … 題材の一覧（no 順）、onSelect(model) … カードをタップしたとき
 */
export function createAlbum({ models, onSelect }) {
  const root = $('album'), grid = $('cards'), gear = $('gear'), dlg = $('erase');
  let holdTimer = 0, hintTimer = 0, justHeld = false;

  function refresh() {
    grid.textContent = '';
    for (const m of models) {
      const n = record.count(m.id), has = n > 0, stars = starsOf(m.parts.length);
      const card = document.createElement('button');
      card.className = 'card' + (has ? ' done' : ' todo'); card.type = 'button';
      const art = document.createElement('div'); art.className = 'art';
      const img = artOf(m, !has);
      if (img) {      // とっておいた絵を、そのカードの canvas に写す
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); art.appendChild(c);
      }
      const meta = document.createElement('div'); meta.className = 'meta';
      const no = document.createElement('span'); no.className = 'no'; no.textContent = 'No.' + m.no;
      const nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = m.name;
      if (m.name.length > CFG.CARD_NAME_FULL) nm.style.fontSize = `calc(clamp(16px,4.4vw,19px) * ${(CFG.CARD_NAME_FIT / m.name.length).toFixed(2)})`;   // 長い名前は文字を小さくして、カードに収める
      meta.append(no, nm);
      const foot = document.createElement('div'); foot.className = 'foot';
      const st = document.createElement('span'); st.className = 'stars'; st.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
      st.setAttribute('aria-label', `むずかしさ ${stars}`);
      foot.appendChild(st);
      if (has) {
        const medal = document.createElement('span'); medal.className = 'medal'; medal.textContent = `⭐ ${n}かい`; foot.appendChild(medal);
      }
      card.append(art, meta, foot);
      card.addEventListener('click', () => onSelect(m));
      grid.appendChild(card);
    }
    releaseRenderer();
  }

  // ---- ⚙ 長押しで「きろくを けす」（おとな用）----
  const stopHold = () => { clearTimeout(holdTimer); gear.classList.remove('holding'); };
  gear.addEventListener('pointerdown', () => {
    stopHold(); gear.classList.add('holding');
    holdTimer = setTimeout(() => { stopHold(); justHeld = true; dlg.hidden = false; $('eraseNo').focus(); }, CFG.ALBUM_HOLD_MS);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => gear.addEventListener(ev, stopHold));
  gear.addEventListener('contextmenu', e => e.preventDefault());
  gear.addEventListener('click', () => {      // 短くさわったときは、使いかたを少しだけ見せる
    if (justHeld) { justHeld = false; return; }  // 長押しのあとの指を離したときのクリックは無視
    const h = $('gearHint'); h.classList.add('show'); clearTimeout(hintTimer); hintTimer = setTimeout(() => h.classList.remove('show'), 1800);
  });
  $('eraseNo').addEventListener('click', () => { dlg.hidden = true; });
  $('eraseYes').addEventListener('click', () => { record.clear(); dlg.hidden = true; refresh(); });

  return {
    show() { root.hidden = false; dlg.hidden = true; reload(); refresh(); root.scrollTop = 0; },
    hide() { root.hidden = true; stopHold(); },
    refresh,
  };
}

KP.album = { record, createAlbum };
