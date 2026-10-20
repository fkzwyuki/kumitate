// 外す・引っぱる・吸い付く・順番・ヒント（DESIGN.md §5）
import * as THREE from 'three';
import { CFG } from './config.js?v=6250ca2';
import { buildParts, modelBounds, makeGhost, disposeGroup } from './shapes.js?v=6250ca2';
import { createRunner, shuffled } from './runner.js?v=6250ca2';
import { createFinale } from './finale.js?v=6250ca2';
import { anim, cancel, after, ease, dirty } from './anim.js?v=6250ca2';
import { SND, buzz, unlock } from './sound.js?v=6250ca2';

const lerp = (a, b, k) => a + (b - a) * k;

// =====================================================================
// ルール（画面がなくても動く部分。tools/check.html も同じものを使う）
// =====================================================================

/** 置き場所（スロット）の一覧。部品1つにつき置き場所1つ（id は部品の id）*/
export function makeSlots(parts) {
  return new Map(parts.map(p => [p.id, { id: p.id, kind: p.kind, on: p.on, closes: p.closes, part: p, filled: false, piece: null }]));
}

/** この置き場所は、もう閉じられているか（これを closes に書いた部品が、もう付いている）*/
export function isClosed(slots, slot) {
  for (const t of slots.values()) if (t.filled && t.closes.includes(slot.id)) return true;
  return false;
}

/**
 * この部品を今付けられる置き場所の一覧（§5.2・§5.3）。
 * kind がある部品は、同じ kind の空いている場所ならどこでもよい。kind がなければ自分の場所だけ。
 * 条件：その場所の on（土台）が全部うまっている／まだ閉じられていない（closes）。
 */
export function eligibleSlots(slots, piece) {
  const out = [];
  for (const s of slots.values()) {
    if (s.filled) continue;
    if (piece.kind ? s.kind !== piece.kind : s.id !== piece.id) continue;
    if (!s.on.every(id => slots.get(id) && slots.get(id).filled)) continue;
    if (isClosed(slots, s)) continue;
    out.push(s);
  }
  return out;
}

/** 入れ忘れ：閉じられてしまって、もう入らない置き場所の一覧（閉じる部品は付いているのに、中の部品が付いていない）*/
export function forgottenSlots(slots) {
  return [...slots.values()].filter(s => !s.filled && isClosed(slots, s));
}

/** この場所に付けても入れ忘れにならないか（閉じる相手が、全部もう付いている）*/
export const isSafeSlot = (slots, slot) => slot.closes.every(id => slots.get(id) && slots.get(id).filled);

/** 付けても入れ忘れにならない置き場所（ヒントはこちらだけを選ぶ）*/
export const safeSlots = (slots, piece) => eligibleSlots(slots, piece).filter(s => isSafeSlot(slots, s));

export const canPlace = (slots, piece) => eligibleSlots(slots, piece).length > 0;

// =====================================================================
// 組み立ての1回ぶん
// =====================================================================

/**
 * ui … { canvas, thumb, view(部屋と下の矩形), setCount(n,total), toast(text), nudge(on), showDone(on), showForgot(on)（入れ忘れの吹き出し）,
 *        undoHint()（「はずす」ボタンを強く光らせる）, onDone(model)（できたとき）}
 * stage … 部屋（stage.js）
 */
export function createGame({ model, stage, ui }) {
  const view = ui.view;
  const parts = buildParts(model);
  const slots = makeSlots(parts);
  const bounds = modelBounds(parts);
  const center = bounds.getCenter(new THREE.Vector3());
  const runner = createRunner(shuffled(parts), { thumbEl: ui.thumb });   // 並びは毎回ばらばら
  const finale = createFinale({ stage, model, slots, bounds, ui });

  stage.setRoom(model.room);
  stage.resetYaw();
  // drive のときは、走るぶんもカメラに入るように、進む向きへ広げた箱でカメラを決める（走ると画面の外へ出てしまうため）
  const fitBox = bounds.clone();
  const drv = [].concat(model.finale || []).find(f => f && f.type === 'drive');
  if (drv) {
    const axis = (drv.axis || 'z') === 'z' ? 'x' : 'z', d = (drv.dir === -1 ? -1 : 1) * bounds.getSize(new THREE.Vector3())[axis] * CFG.DRIVE_DIST_RATIO;
    if (d > 0) fitBox.max[axis] += d; else fitBox.min[axis] += d;
  }
  stage.fit(fitBox);

  // 置き場所のゴースト（ふだんは見えない）
  const ghosts = new Map();
  for (const p of parts) { const gh = makeGhost(p); stage.scene.add(gh); ghosts.set(p.id, gh); }

  let placedCount = 0, finished = false, disposed = false;
  let lastAction = performance.now(), drag = null, hintState = null, ghostTimer = null;
  const history = [];                    // 付けた順の記録 { piece, slot }（「はずす」で後ろから外す）
  let forgotTimer = null, forgotShown = false;

  // 部品ごとの状態。inRunner＝ランナーにいて、つまめる
  for (const p of parts) {
    p.placed = false; p.held = false; p.flying = false;
    Object.defineProperty(p, 'inRunner', { configurable: true, get() { return !this.placed && !this.held && !this.flying; } });
  }
  ui.setCount(0, parts.length);

  // ---------- ゴースト（置き場所の光）----------
  function showGhosts(list, on) {
    for (const s of list) ghosts.get(s.id).visible = on;
    dirty();
  }
  function hideAllGhosts() { for (const gh of ghosts.values()) gh.visible = false; cancel(ghostTimer); dirty(); }

  // ---------- 付ける ----------
  function attach(piece, slot) {
    const g = piece.group;
    slot.filled = true; slot.piece = piece; piece.placed = true; piece.held = false; piece.flying = true;   // 順番の判定はすぐ「付いた」扱い
    history.push({ piece, slot });
    clearHint(); hideAllGhosts();
    const start = g.position.clone(), tgt = slot.part.target;
    g.rotation.set(0, 0, 0);
    anim(CFG.SNAP_SEC, k => { g.position.lerpVectors(start, tgt, ease(k)); }, () => {
      g.position.copy(tgt); piece.flying = false;
      placedCount++; ui.setCount(placedCount, parts.length);
      SND.click(); buzz(CFG.VIBRATE_SNAP_MS);
      piece.settleAnim = anim(CFG.SETTLE_SEC, k => g.scale.setScalar(1 + CFG.SETTLE_SCALE * Math.sin(k * Math.PI)), () => g.scale.setScalar(1));   // ぷるっ
      updateForgot();                                                // 閉じる部品が付いたのに中が空なら、少したって吹き出し
      if (placedCount === parts.length) after(CFG.FINISH_DELAY_SEC, () => { if (!disposed) { finished = true; finale.start(); if (ui.onDone) ui.onDone(model); } });
    });
  }

  // ---------- ランナーに戻す ----------
  function sendBack(piece, x, sec = CFG.RETURN_SEC, quiet = false) {
    const g = piece.group, c = piece.cell;
    piece.held = false; piece.flying = true;
    let start, startScale;
    if (g.parent !== runner.scene) {      // 部屋から戻るときは、ランナーの上のふちから入ってくる
      runner.scene.add(g);
      start = runner.pointOf(Math.min(Math.max(x, 0), view.W), view.runRect.y + 4);
      startScale = c.scale * 1.15;
    } else { start = g.position.clone(); startScale = g.scale.x; }
    const tilt = runner.tilt;
    if (!quiet) SND.back();
    anim(sec, k => {
      const e = ease(k);
      g.position.lerpVectors(start, c.pos, e); g.scale.setScalar(lerp(startScale, c.scale, e));
      g.rotation.set(tilt.x * e, tilt.y * e, tilt.z * e);
    }, () => { piece.flying = false; runner.returnTo(piece); runner.cutGate(piece, false); });
  }

  // ---------- 入れ忘れの吹き出し（§5.3）----------
  // 閉じられて入らなくなった場所が残っているあいだ、吹き出しを出しておく（「はずす」で直る）
  function updateForgot() {
    if (!forgottenSlots(slots).length) {
      cancel(forgotTimer); forgotTimer = null;
      if (forgotShown) { forgotShown = false; ui.showForgot(false); }
      return;
    }
    if (forgotShown || forgotTimer) return;
    forgotTimer = after(CFG.FORGOT_DELAY_SEC, () => {
      forgotTimer = null;
      if (disposed || finished || !forgottenSlots(slots).length) return;
      forgotShown = true; ui.showForgot(true); SND.huh();
    });
  }

  // ---------- 「はずす」（§5.1）：最後に付けた部品から順に、ランナーの元のマスへ ----------
  function undo() {
    unlock(); lastAction = performance.now(); ui.nudge(false);
    if (disposed || finished || !history.length || placedCount === parts.length) return;
    if (drag && drag.kind === 'part') return;                 // 部品を持っているあいだは外さない
    const { piece, slot } = history[history.length - 1];
    if (piece.flying) return;                                 // はまる途中は待つ
    history.pop();
    clearHint(); hideAllGhosts(); cancel(piece.settleAnim);
    slot.filled = false; slot.piece = null; piece.placed = false;
    placedCount--; ui.setCount(placedCount, parts.length);
    SND.pop(); buzz(CFG.VIBRATE_UNDO_MS);
    runner.cutGate(piece, true);                              // 外れた直後なので、ゲートは切り口のまま
    sendBack(piece, stage.toScreen(slot.part.target, view.roomRect.w, view.roomRect.h).x, CFG.UNDO_SEC, true);
    updateForgot();
  }

  // ---------- ヒント（§5.4）----------
  function clearHint() {
    if (!hintState) return;
    hintState.anims.forEach(cancel);
    runner.glow(hintState.piece, false);
    hideAllGhosts();
    hintState = null;
  }
  function hint() {
    unlock(); lastAction = performance.now(); ui.nudge(false);
    if (finished) return;
    if (forgotShown || forgottenSlots(slots).length) { ui.undoHint(); return; }   // 入れ忘れのとき：「はずす」を光らせる
    const cand = parts.filter(p => p.inRunner && safeSlots(slots, p).length);     // 付けても入れ忘れにならない部品だけ
    if (!cand.length) return;
    const piece = hintState && cand.includes(hintState.piece) ? hintState.piece : cand[Math.floor(Math.random() * cand.length)];
    clearHint();
    const hs = hintState = { piece, anims: [] };
    runner.glow(piece, true);                          // ① ランナーで光る
    // ② その部品まで送る（もう見えているなら動かさない）
    const camX = -0.15 + runner.view.halfW + runner.scroll, c = piece.cell;
    const visible = c.cx - 0.5 * c.width > camX - runner.view.halfW && c.cx + 0.5 * c.width < camX + runner.view.halfW;
    const s0 = runner.scroll, want = visible ? s0 : runner.scrollFor(piece);
    hs.anims.push(anim(CFG.HINT_SCROLL_SEC, k => runner.setScroll(lerp(s0, want, ease(k))), () => {
      hs.anims.push(after(CFG.HINT_GLOW_DELAY_SEC, () => {
        showGhosts(safeSlots(slots, piece), true);   // ③ 置き場所が光る（入れ忘れにならない場所だけ）
        hs.anims.push(after(CFG.HINT_GLOW_SEC, clearHint));
      }));
    }));
  }

  // ---------- 指の操作 ----------
  const cv = ui.canvas;
  const inRoom = y => y < view.roomRect.h;

  function moveDragged(piece, x, y) {
    const g = piece.group, lifted = y - CFG.DRAG_LIFT_PX, r = view.roomRect;
    if (lifted < r.h) {                      // 部屋の中：実物の大きさで、題材の手前に
      if (g.parent !== stage.scene) stage.scene.add(g);
      g.scale.setScalar(1);
      g.position.copy(stage.pointAt(x, Math.max(0, Math.min(lifted, r.h - 4)), r.w, r.h, stage.dragRef(center)));
    } else {                                 // ランナーの中：少し大きめに
      if (g.parent !== runner.scene) runner.scene.add(g);
      g.scale.setScalar(piece.cell.scale * 1.15);
      g.position.copy(runner.pointOf(x, lifted));
    }
    dirty();
  }

  function grab(piece) {
    piece.held = true;
    SND.pop(); buzz(CFG.VIBRATE_GRAB_MS);
    runner.cutGate(piece, true);
    runner.glow(piece, false);
    piece.group.rotation.set(0, 0, 0);
    if (CFG.GHOST_ON_GRAB) showGhosts(eligibleSlots(slots, piece), true);
  }

  function onDown(e) {
    if (drag || disposed) return;
    unlock(); lastAction = performance.now(); ui.nudge(false);
    try { cv.setPointerCapture(e.pointerId); } catch (err) { /* 合成イベントでは失敗するので無視 */ }
    const x = e.clientX, y = e.clientY;
    if (inRoom(y)) { drag = { id: e.pointerId, kind: 'yaw', x0: x, yaw0: stage.yawTarget }; finale.touch(performance.now()); return; }
    if (finished) return;
    const piece = runner.pieceAt(x, y);
    drag = { id: e.pointerId, kind: piece ? 'maybe' : 'scroll', piece, x0: x, y0: y, s0: runner.scroll };
  }

  function onMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const x = e.clientX, y = e.clientY, dx = x - drag.x0, dy = y - drag.y0;
    if (drag.kind === 'maybe' && Math.hypot(dx, dy) > CFG.PICK_MOVE_PX) {
      if (Math.abs(dx) > Math.abs(dy) * 1.2 || dy > 0) drag.kind = 'scroll';       // 横に動いたら送る（つまむのは上に動いたとき）
      else { drag.kind = 'part'; grab(drag.piece); }                 // まだ付けられない部品も同じように持てる（離すと静かに戻る）
    }
    if (drag.kind === 'scroll') {
      runner.setScroll(drag.s0 - dx * runner.unitsPerPx);
    } else if (drag.kind === 'yaw') {
      stage.setYawTarget(drag.yaw0 + dx * CFG.YAW_PER_PX); finale.touch(performance.now()); dirty();
    } else if (drag.kind === 'part') {
      moveDragged(drag.piece, x, y);
    }
  }

  function onUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    const x = e.clientX, y = e.clientY;
    if (d.kind === 'maybe') {                                   // ただ押しただけ
      const p = d.piece;
      SND.pop(); buzz(CFG.VIBRATE_GRAB_MS); ui.toast('うえへ ひっぱってね');
      const y0 = p.cell.pos.y, g = p.group;
      p.flying = true;
      anim(CFG.TAP_HOP_SEC, k => { g.position.y = y0 + CFG.TAP_HOP_HEIGHT * Math.sin(k * Math.PI); }, () => { g.position.y = y0; p.flying = false; });
      if (CFG.GHOST_ON_GRAB) { showGhosts(eligibleSlots(slots, p), true); cancel(ghostTimer); ghostTimer = after(CFG.GHOST_TAP_SEC, hideAllGhosts); }
    } else if (d.kind === 'part') {
      const p = d.piece, lifted = y - CFG.DRAG_LIFT_PX;
      let best = null, bestD = Infinity;
      if (inRoom(lifted)) {
        for (const s of eligibleSlots(slots, p)) {                // 一番近い空き場所へ（kind が同じならどこでも）
          const ts = stage.toScreen(s.part.target, view.roomRect.w, view.roomRect.h);
          const dist = Math.hypot(ts.x - x, ts.y - lifted);
          if (dist < bestD) { bestD = dist; best = s; }
        }
      }
      if (best && bestD < CFG.SNAP_PX) attach(p, best);
      else { hideAllGhosts(); sendBack(p, x); }
    }
  }

  function onCancel(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (d.kind === 'part') { hideAllGhosts(); sendBack(d.piece, e.clientX); }
  }

  const noMenu = e => e.preventDefault();
  cv.addEventListener('pointerdown', onDown);
  cv.addEventListener('pointermove', onMove);
  cv.addEventListener('pointerup', onUp);
  cv.addEventListener('pointercancel', onCancel);
  cv.addEventListener('contextmenu', noMenu);

  // ---------- 外から使うもの ----------
  const game = {
    model, parts, slots, runner, bounds, hint, undo,
    get finished() { return finished; },
    get placedCount() { return placedCount; },
    get total() { return parts.length; },
    /** 画面の大きさが決まったら */
    layout() { runner.layout(view.runRect); },
    /** 毎フレーム。描き直しが要るなら true */
    update(dt, now) {
      let need = false;
      // 置き場所のゴーストを点滅させる
      for (const gh of ghosts.values()) {
        if (!gh.visible) continue;
        gh.userData.ghostMat.opacity = CFG.GHOST_OPACITY + CFG.GHOST_PULSE_AMP * Math.sin(now / CFG.GHOST_PULSE_MS); need = true;
      }
      if (runner.update(now)) need = true;
      // 20秒何もしないと、ヒントボタンが揺れて知らせる
      if (!finished && now - lastAction > CFG.HINT_NUDGE_SEC * 1000) ui.nudge(true);
      if (finale.update(dt, now)) need = true;
      return need;
    },
    dispose() {
      disposed = true;
      cv.removeEventListener('pointerdown', onDown); cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerup', onUp); cv.removeEventListener('pointercancel', onCancel);
      cv.removeEventListener('contextmenu', noMenu);
      clearHint(); cancel(forgotTimer); ui.showForgot(false); finale.dispose();
      ghosts.forEach(gh => stage.scene.remove(gh));
      parts.forEach(p => { stage.scene.remove(p.group); runner.scene.remove(p.group); disposeGroup(p.group); });
      runner.dispose();
      ui.nudge(false);
    },
    // ---- 開発・確認用 ----
    debug: {
      /** 置き場所（スロット）の画面位置 */
      slotScreen(id) { const s = stage.toScreen(slots.get(id).part.target, view.roomRect.w, view.roomRect.h); return { x: view.roomRect.x + s.x, y: view.roomRect.y + s.y }; },
      /** ランナーのマスの中心の画面位置 */
      cellScreen(id) { return runner.cellScreen(parts.find(p => p.id === id)); },
      /** 部品の状態の一覧 */
      state() { return parts.map(p => ({ id: p.id, kind: p.kind, cell: p.cell && 'A' + (p.cell.index + 1), placed: p.placed, held: p.held, canPlace: canPlace(slots, p) })); },
      forgotShown() { return forgotShown; },
      history() { return history.map(h => h.piece.id); },
      ghostsVisible() { return [...ghosts].filter(([, g]) => g.visible).map(([id]) => id); },
      /** 部品 id を、付けられる置き場所に付ける（確認用。本物の操作の代わりに使う）。付けられなければ false */
      place(id) { const p = parts.find(q => q.id === id), s = p && eligibleSlots(slots, p)[0]; if (!s || !p.inRunner) return false; runner.cutGate(p, true); stage.scene.add(p.group); p.group.scale.setScalar(1); p.group.position.copy(s.part.target).y += 1; attach(p, s); return true; },
    },
  };
  return game;
}

KP.assemble = { makeSlots, eligibleSlots, canPlace, isClosed, forgottenSlots, isSafeSlot, safeSlots, createGame };
