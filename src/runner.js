// ランナー（プラモデルの枠）。2段・横スクロール・平行投影（DESIGN.md §4.2、§8.2）
// 並びは呼び出し側がばらばらにして渡す。各区画の上に番号（A1、A2…）を小さく出す。
import * as THREE from 'three';
import { CFG } from './config.js?v=6250ca2';
import { dirty } from './anim.js?v=6250ca2';

const ease = k => 1 - Math.pow(1 - k, 3);

// 区画の番号の札（文字を絵にして貼る）
function labelMesh(text) {
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 64;
  const g = cv.getContext('2d');
  g.font = '700 42px system-ui, "Hiragino Maru Gothic ProN", "Noto Sans JP", sans-serif';
  g.textBaseline = 'middle'; g.fillStyle = CFG.LABEL_COLOR; g.fillText(text, 5, 34);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;   // 斜めから見ても文字がにじまないように
  const w = CFG.LABEL_SIZE;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w / 2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
  return m;
}

// ヒントで光る、区画の下の色板（W×H はランナー内の単位での区画の大きさ）
function glowMesh(W, H) {
  const w = W * 0.94, h = H * 0.94, r = 0.14, sh = new THREE.Shape();
  sh.moveTo(-w / 2 + r, -h / 2); sh.lineTo(w / 2 - r, -h / 2); sh.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  sh.lineTo(w / 2, h / 2 - r); sh.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  sh.lineTo(-w / 2 + r, h / 2); sh.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  sh.lineTo(-w / 2, -h / 2 + r); sh.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color: CFG.GLOW_COLOR, transparent: true, opacity: 0.5, depthWrite: false }));
  m.visible = false; return m;
}

/**
 * ランナーを作る。pieces は部品オブジェクト（shapes.js の buildPart）を、ランナーに並べる順に（呼び出し側がばらばらにして渡す）。
 * 部品の大きさは本物の比べ方に合わせる（DESIGN.md §4.2）：題材ぜんぶに同じ倍率をかけ、
 * 1マスに入らない部品は 横2マス／縦2段／2×2 の区画に置く。区画は並び順に、2段のランナーへ左から詰める。
 */
export function createRunner(pieces, { thumbEl } = {}) {
  const C = CFG.CELL, rows = CFG.RUNNER_ROWS, lim = CFG.RUNNER_MAX_FILL * C;
  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb59a80, 2.1));
  const sun = new THREE.DirectionalLight(0xffffff, 2.4); sun.position.set(4, 9, 6); scene.add(sun);
  const tilt = new THREE.Euler(...CFG.RUNNER_TILT);

  // ① 傾けた形の大きさをはかる（見えの幅・高さ）
  const items = pieces.map((p, i) => {
    p.group.position.set(0, 0, 0); p.group.rotation.copy(tilt); p.group.scale.setScalar(1); p.group.updateMatrixWorld(true);
    const tb = new THREE.Box3().setFromObject(p.group, true);   // 頂点まで見て正確にはかる（球が箱より大きく見えないように）
    return { p, i, tb, ts: tb.getSize(new THREE.Vector3()), tc: tb.getCenter(new THREE.Vector3()) };
  });

  // ② 題材ぜんぶに同じ倍率：大きさの中央値がマスの RUNNER_FILL になるように
  const sizes = items.map(it => Math.max(it.ts.x, it.ts.y)).sort((a, b) => a - b), mid = sizes.length >> 1;
  const median = Math.max(1e-6, sizes.length % 2 ? sizes[mid] : (sizes[mid - 1] + sizes[mid]) / 2);
  const baseScale = CFG.RUNNER_FILL * C / median;

  // ③ 部品ごとに、見えの大きさ（小さすぎる部品は RUNNER_MIN_FILL まで大きく）と区画の形を決める
  for (const it of items) {
    let s = Math.max(baseScale, CFG.RUNNER_MIN_FILL * C / Math.max(it.ts.x, it.ts.y, 1e-6));
    const fits = (w, h) => it.ts.x * s <= w * lim && it.ts.y * s <= h * lim;
    let bw = 1, bh = 1;
    if (fits(1, 1)) { /* 1マス */ }
    else if (fits(2, 1)) bw = 2;           // 横長 → 横2マス
    else if (fits(1, 2)) bh = 2;           // 縦長 → 縦2段
    else { bw = 2; bh = 2; if (!fits(2, 2)) s = Math.min(2 * lim / it.ts.x, 2 * lim / it.ts.y); }   // 大きい → 2×2（それでも入らなければ縮める）
    it.scale = s; it.bw = bw; it.bh = bh;
  }

  // ④ 区画を、並び順に、入る一番左（同じ列なら上）へ詰める
  const occ = new Array((items.length * 2 + 4) * rows).fill(false);
  const isFree = (c, r, w, h) => {
    if (r + h > rows) return false;
    for (let dc = 0; dc < w; dc++) for (let dr = 0; dr < h; dr++) if (occ[(c + dc) * rows + r + dr]) return false;
    return true;
  };
  let cols = 0;
  for (const it of items) {
    search: for (let c = 0; ; c++) {
      for (let r = 0; r + it.bh <= rows; r++) {
        if (!isFree(c, r, it.bw, it.bh)) continue;
        it.col = c; it.row = r;
        for (let dc = 0; dc < it.bw; dc++) for (let dr = 0; dr < it.bh; dr++) occ[(c + dc) * rows + r + dr] = true;
        break search;
      }
    }
    cols = Math.max(cols, it.col + it.bw);
  }
  const runW = cols * C, runH = rows * C;
  // 番号（A1…）は、左から順（同じ列なら上から）
  [...items].sort((a, b) => a.col - b.col || a.row - b.row).forEach((it, k) => { it.index = k; });

  // ⑤ 枠：区画の境目だけに線を引く（大きい区画の中に十字の線が通らない。空きマスは1マスずつ枠が残る）
  const owner = new Array(cols * rows).fill(0).map((_, k) => 1000 + k);   // 空きマスは、マスごとに別の持ち主
  for (const it of items) for (let dc = 0; dc < it.bw; dc++) for (let dr = 0; dr < it.bh; dr++) owner[(it.col + dc) * rows + it.row + dr] = it.i;
  const own = (c, r) => (c < 0 || c >= cols || r < 0 || r >= rows) ? -1 : owner[c * rows + r];
  const frame = new THREE.Group(); scene.add(frame);
  const frameMat = new THREE.MeshStandardMaterial({ color: CFG.RUNNER_FRAME_COLOR, roughness: 0.6 });
  const gateMat = new THREE.MeshStandardMaterial({ color: CFG.RUNNER_GATE_COLOR, roughness: 0.6 });
  const barGeo = new THREE.CylinderGeometry(0.035, 0.035, 1, 8), knotGeo = new THREE.SphereGeometry(0.035, 8, 6);
  const knots = new Set();
  function bar(c1, r1, c2, r2) {   // 格子の点 (c1,r1) から (c2,r2) までの線（ランナーの座標に直して引く）
    const x1 = c1 * C, y1 = -r1 * C, x2 = c2 * C, y2 = -r2 * C, len = Math.hypot(x2 - x1, y2 - y1);
    const m = new THREE.Mesh(barGeo, frameMat); m.scale.y = len;
    m.position.set((x1 + x2) / 2, (y1 + y2) / 2, -0.5); m.rotation.z = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2; frame.add(m);
    knots.add(c1 + ',' + r1); knots.add(c2 + ',' + r2);
  }
  for (let c = 0; c <= cols; c++) {          // たて線：となり合うマスの持ち主がちがうところ（続くところはつなげて1本）
    let start = -1;
    for (let r = 0; r <= rows; r++) {
      const has = r < rows && own(c - 1, r) !== own(c, r);
      if (has && start < 0) start = r;
      if (!has && start >= 0) { bar(c, start, c, r); start = -1; }
    }
  }
  for (let r = 0; r <= rows; r++) {          // よこ線
    let start = -1;
    for (let c = 0; c <= cols; c++) {
      const has = c < cols && own(c, r - 1) !== own(c, r);
      if (has && start < 0) start = c;
      if (!has && start >= 0) { bar(start, r, c, r); start = -1; }
    }
  }
  for (const k of knots) {                    // 線のつなぎ目をまるくする
    const [c, r] = k.split(',').map(Number), m = new THREE.Mesh(knotGeo, frameMat);
    m.position.set(c * C, -r * C, -0.5); frame.add(m);
  }

  // ⑥ 部品を区画に置く
  const grid = new Array(cols * rows).fill(null);   // マス → 部品（大きい区画は、そのマスぜんぶが同じ部品）
  items.forEach(it => {
    const { p, col, row, bw, bh, scale, tc, tb } = it, W = bw * C, H = bh * C;
    const x0 = col * C, cx = x0 + W / 2, cy = -row * C - H / 2;
    const pos = new THREE.Vector3(cx - tc.x * scale, cy - tc.y * scale - CFG.RUNNER_PART_DROP, 0);
    const label = labelMesh('A' + (it.index + 1));
    label.position.set(x0 + 0.06 + CFG.LABEL_SIZE / 2, -row * C - 0.07 - CFG.LABEL_SIZE / 4, -0.4);
    scene.add(label);
    // ゲート：枠の左の棒から部品までをつなぐ小さな棒
    const frameX = x0, partLeft = pos.x + tb.min.x * scale;
    const gateLen = Math.max(0.14, partLeft - frameX + 0.06);
    const gate = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 6), gateMat);
    gate.rotation.z = Math.PI / 2; gate.scale.y = gateLen; gate.position.set(frameX + gateLen / 2, pos.y, -0.45);
    frame.add(gate);
    const glow = glowMesh(W, H); glow.position.set(cx, cy, -0.6); scene.add(glow);

    p.cell = { index: it.index, col, row, cw: bw, ch: bh, width: W, height: H, x0, cx, cy, pos, scale, gate, gateLen, frameX, glow, label };
    for (let dc = 0; dc < bw; dc++) for (let dr = 0; dr < bh; dr++) grid[(col + dc) * rows + row + dr] = p;
    returnTo(p);
  });

  /** 部品を元の区画に戻す（見た目だけ。アニメは呼び出し側）*/
  function returnTo(p) {
    const c = p.cell;
    scene.add(p.group);
    p.group.position.copy(c.pos); p.group.scale.setScalar(c.scale); p.group.rotation.copy(tilt);
    dirty();
  }

  const view = { halfW: 1, halfH: 1, scroll: 0, scrollMax: 0, rect: { x: 0, y: 0, w: 1, h: 1 } };

  function placeCam() {
    cam.position.set(-0.15 + view.halfW + view.scroll, -runH / 2, 5);
    cam.lookAt(cam.position.x, -runH / 2, 0); cam.updateMatrixWorld();
  }
  function updateThumb() {
    if (!thumbEl) return;
    const total = runW + CFG.RUNNER_SCROLL_PAD, vis = Math.min(1, (2 * view.halfW) / total);
    const pos = view.scrollMax ? view.scroll / view.scrollMax : 0;
    thumbEl.style.width = (vis * 100) + '%'; thumbEl.style.left = (pos * (1 - vis) * 100) + '%';
  }

  const api = {
    scene, cam, pieces, cols, rows, runW, runH, view, tilt,
    /** 確認用：倍率の基準と、区画の形 */
    info: { median, baseScale, blocks: items.map(it => ({ id: it.p.id, w: it.bw, h: it.bh, fill: Math.max(it.ts.x, it.ts.y) * it.scale / C })) },
    /** 画面の矩形（px）が決まったら呼ぶ */
    layout(rect) {
      view.rect = rect;
      view.halfH = (runH + CFG.RUNNER_VIEW_PAD) / 2;
      view.halfW = view.halfH * rect.w / rect.h;
      cam.left = -view.halfW; cam.right = view.halfW; cam.top = view.halfH; cam.bottom = -view.halfH; cam.updateProjectionMatrix();
      view.scrollMax = Math.max(0, runW + CFG.RUNNER_SCROLL_PAD - 2 * view.halfW);
      view.scroll = Math.min(view.scroll, view.scrollMax);
      placeCam(); updateThumb(); dirty();
    },
    get scroll() { return view.scroll; },
    setScroll(v) { view.scroll = Math.min(view.scrollMax, Math.max(0, v)); placeCam(); updateThumb(); dirty(); },
    /** 1px あたりのスクロール量 */
    get unitsPerPx() { return (2 * view.halfW) / view.rect.w; },
    /** 部品の区画がちょうど見える（真ん中に寄る）スクロール位置 */
    scrollFor(p) { return Math.min(view.scrollMax, Math.max(0, p.cell.cx - view.halfW)); },
    /** 画面の点（px）→ ランナーの座標 */
    pointOf(x, y, z = 0.5) {
      const r = view.rect;
      return new THREE.Vector3((x - r.x) / r.w * 2 - 1, -((y - r.y) / r.h) * 2 + 1, 0).unproject(cam).setZ(z);
    },
    /** 画面の点にある（まだランナーにある）部品。区画の中ならどこを押してもよい */
    pieceAt(x, y) {
      const v = api.pointOf(x, y);
      const col = Math.floor(v.x / C), row = Math.floor(-v.y / C);
      if (col < 0 || col >= cols || row < 0 || row >= rows) return null;
      const p = grid[col * rows + row];
      return p && p.inRunner ? p : null;
    },
    /** 区画の中心の画面位置（px）*/
    cellScreen(p) {
      const v = new THREE.Vector3(p.cell.cx, p.cell.cy, 0).project(cam), r = view.rect;
      return { x: r.x + (v.x + 1) / 2 * r.w, y: r.y + (1 - v.y) / 2 * r.h };
    },
    returnTo,
    /** 外したあとのゲート：切り口だけ残す（cut=false で元に戻す）*/
    cutGate(p, cut) {
      const c = p.cell, len = cut ? c.gateLen * CFG.GATE_STUB_RATIO : c.gateLen;
      c.gate.scale.y = len; c.gate.position.x = c.frameX + len / 2; dirty();
    },
    /** ヒント：区画を光らせる */
    glow(p, on) { p.cell.glow.visible = on; if (!on && p.inRunner) p.group.scale.setScalar(p.cell.scale); dirty(); },
    /** 毎フレーム：光っている区画をふくらませる。光っていれば true */
    update(now) {
      let any = false;
      for (const p of pieces) {
        const c = p.cell;
        if (!c.glow.visible) continue;
        any = true;
        const k = 0.5 + 0.5 * Math.sin(now / 1000 / CFG.HINT_PULSE_SEC * Math.PI * 2);
        c.glow.material.opacity = 0.25 + 0.45 * k;
        if (p.inRunner) p.group.scale.setScalar(c.scale * (1 + CFG.HINT_PULSE_SCALE * k));
      }
      return any;
    },
    dispose() {
      pieces.forEach(p => { p.cell = null; });
      scene.traverse(o => {
        if (o.isMesh) { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.map) o.material.map.dispose(); }
      });
    },
  };
  api.ease = ease;
  return api;
}

/** 並びをばらばらにする（毎回ちがう）*/
export function shuffled(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

KP.runner = { createRunner, shuffled };
