// できたときの動き（DESIGN.md §6.3）と紙吹雪、「できた！」（§4.3）
// type: spin / bounce / launch / light（seq で順に光る）/ drive / steam / pop / shake / swing（finale は配列にして、2つ同時に出してもよい）
import * as THREE from 'three';
import { CFG } from './config.js?v=6250ca2';
import { SND, buzz } from './sound.js?v=6250ca2';

const AXES = { x: 'x', y: 'y', z: 'z' };
const smooth = k => k * k * (3 - 2 * k);          // なめらかに始まってなめらかに終わる 0→1
const clamp01 = k => Math.max(0, Math.min(1, k));

/**
 * stage … 部屋、model … 題材、slots … 置き場所の一覧（slot.piece が付いた部品）、
 * bounds … 題材の箱、ui … { showDone(on) }
 */
export function createFinale({ stage, model, slots, bounds, ui }) {
  const confetti = [];
  const confGeo = new THREE.PlaneGeometry(0.12, 0.2);
  const confMats = CFG.CONFETTI_COLORS.map(c => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
  let running = false, t = 0, lastTouch = -1e9, phase = 0, sweeping = false;
  const motions = [];        // 毎フレーム呼ぶ動き（type ごとに作る）
  const extraMats = [];      // light で作った材質（片づけるときに捨てる）

  const groupOf = id => { const s = slots.get(id); return s && s.piece ? s.piece.group : null; };

  // ---- 全体を動かす動き（bounce・launch・drive）のための「台」----
  // 動かす部品を1つの入れ物（pivot）にまとめて、足もとを原点にする。つぶれる・浮く・走るがまとめて動かせる
  let pivot = null, movingBox = null;
  function makePivot(stay = []) {
    if (pivot) return pivot;
    movingBox = new THREE.Box3();
    const moving = [...slots.values()].filter(s => !stay.includes(s.id) && s.piece);
    moving.forEach(s => movingBox.union(s.part.box));
    const P = new THREE.Vector3((movingBox.min.x + movingBox.max.x) / 2, movingBox.min.y, (movingBox.min.z + movingBox.max.z) / 2);
    pivot = new THREE.Group(); pivot.position.copy(P); stage.scene.add(pivot);
    moving.forEach(s => { const g = s.piece.group; g.position.sub(P); pivot.add(g); });
    return pivot;
  }
  const movingSize = () => movingBox.getSize(new THREE.Vector3());

  // ---- 煙の玉（launch）と湯気の玉（steam）。同じ作りで、濃さ・大きさ・消えるまでの時間だけがちがう ----
  const smoke = [];
  const smokeGeo = new THREE.SphereGeometry(1, 12, 8);
  // 玉を1つ出す。o … { color, opacity, life, grow, drag, sway, fadeIn }（sway＝横ゆれの大きさ、fadeIn＝はじめにだんだん濃くなる割合）
  function addBall(x, y, z, size, v, o, max) {
    if (smoke.length >= max) return;
    const mat = new THREE.MeshBasicMaterial({ color: o.color, transparent: true, opacity: o.opacity, depthWrite: false });
    const m = new THREE.Mesh(smokeGeo, mat);
    m.position.set(x, y, z);
    m.userData = { age: 0, size, v, o, phase: Math.random() * 6.28 };
    m.scale.setScalar(size * 0.4);
    stage.scene.add(m); smoke.push(m);
  }
  function puff(x, y, z, size) {
    const a = Math.random() * Math.PI * 2, sp = 0.5 + Math.random() * 1.1;
    addBall(x + Math.cos(a) * size * 0.8, y + size * 0.4, z + Math.sin(a) * size * 0.8, size * (0.7 + Math.random() * 0.6),
      new THREE.Vector3(Math.cos(a) * sp, 0.25 + Math.random() * 0.4, Math.sin(a) * sp),
      { color: CFG.SMOKE_COLOR, opacity: CFG.SMOKE_OPACITY, life: CFG.SMOKE_LIFE_SEC, grow: CFG.SMOKE_GROW, drag: 1.6, sway: 0, fadeIn: 0 }, CFG.SMOKE_MAX);
  }
  function updateSmoke(dt) {
    for (let i = smoke.length - 1; i >= 0; i--) {
      const m = smoke[i], u = m.userData, o = u.o;
      u.age += dt;
      const k = u.age / o.life;
      if (k >= 1) { stage.scene.remove(m); m.material.dispose(); smoke.splice(i, 1); continue; }
      m.position.addScaledVector(u.v, dt); u.v.multiplyScalar(Math.max(0, 1 - dt * o.drag));
      if (o.sway) m.position.x += Math.sin(u.age * 3.2 + u.phase) * o.sway * dt;
      m.scale.setScalar(u.size * (0.4 + (o.grow - 0.4) * Math.sqrt(k)));
      m.material.opacity = o.opacity * (1 - k) * (1 - k * 0.3) * (o.fadeIn ? Math.min(1, k / o.fadeIn) : 1);
    }
  }

  // ---- type ごとの動き。(dt, t) を受け取る関数を返す ----
  const types = {
    // spin：part（置き場所の id。配列なら全部）の部品を、それぞれの中心で axis のまわりに回す
    // （回る台とお皿のように2つを回すときは、どちらも同じ軸の上に中心がある形にする）
    spin(f) {
      const axis = AXES[f.axis || 'y'], gs = [].concat(f.part).map(groupOf).filter(Boolean);
      if (!gs.length) return null;
      return dt => { for (const g of gs) g.rotation[axis] += dt * CFG.SPIN_SPEED; };
    },

    // bounce：全体がぽんぽん跳ねる（着地でぷるっとつぶれる）
    bounce() {
      const piv = makePivot(), base = piv.position.clone(), H = movingSize().y * CFG.BOUNCE_HEIGHT_RATIO;
      return (dt, tt) => {
        const u = (tt % CFG.BOUNCE_PERIOD_SEC) / CFG.BOUNCE_PERIOD_SEC, air = CFG.BOUNCE_AIR_RATIO;
        if (u < air) {      // 空中：のびながら上がって、おりる
          const s = Math.sin(u / air * Math.PI);
          piv.position.y = base.y + H * s;
          piv.scale.set(1 - 0.03 * s, 1 + 0.05 * s, 1 - 0.03 * s);
        } else {            // 着地：ぷるっとつぶれて戻る
          const s = Math.sin((u - air) / (1 - air) * Math.PI);
          piv.position.y = base.y;
          piv.scale.set(1 + CFG.BOUNCE_SQUASH * 0.6 * s, 1 - CFG.BOUNCE_SQUASH * s, 1 + CFG.BOUNCE_SQUASH * 0.6 * s);
        }
      };
    },

    // launch：ぶるぶるして、煙を出して浮き上がり、おりてくる。stay の部品（だい）は動かない
    launch(f) {
      const piv = makePivot(f.stay || []), base = piv.position.clone(), sz = movingSize();
      const rise = sz.y * CFG.LAUNCH_RISE_RATIO, puffSize = sz.x * CFG.SMOKE_SIZE_RATIO;
      const T = [CFG.LAUNCH_SHAKE_SEC, CFG.LAUNCH_UP_SEC, CFG.LAUNCH_HOVER_SEC, CFG.LAUNCH_DOWN_SEC, CFG.LAUNCH_REST_SEC];
      const cycle = T.reduce((a, b) => a + b, 0);
      let acc = 0;
      return (dt, tt) => {
        let u = tt % cycle, y = 0, dx = 0, rate = 0;
        if (u < T[0]) { dx = Math.sin(u * 70) * CFG.LAUNCH_SHAKE_AMP * (0.4 + u / T[0]); rate = CFG.SMOKE_RATE * 0.5 * (u / T[0]); }   // ぶるぶる
        else if ((u -= T[0]) < T[1]) { const k = u / T[1]; y = rise * smooth(k); dx = Math.sin(tt * 60) * CFG.LAUNCH_SHAKE_AMP * (1 - k); rate = CFG.SMOKE_RATE * (1 - 0.5 * k); }   // 上がる
        else if ((u -= T[1]) < T[2]) { y = rise + Math.sin(u / T[2] * Math.PI * 2) * 0.04 * sz.y; }   // 上でゆらゆら
        else if ((u -= T[2]) < T[3]) { const k = u / T[3]; y = rise * (1 - smooth(k)); rate = CFG.SMOKE_RATE * 0.6 * smooth(clamp01((k - 0.5) * 2)); }   // おりる（地面が近づくと煙）
        piv.position.set(base.x + dx, base.y + y, base.z);
        acc += dt * rate;
        while (acc >= 1) { acc -= 1; puff(base.x, base.y, base.z, puffSize); }
      };
    },

    // light：parts（置き場所の id の一覧）の色を明るくして点滅させる。
    // seq: true なら点滅ではなく、parts を並べた順に1つずつ光らせる（しんごうきの 青→黄→赤）
    light(f) {
      const list = [];
      (f.parts || []).forEach((id, n) => {
        const g = groupOf(id); if (!g) return;
        g.traverse(o => {
          if (!o.isMesh || !o.material || !o.material.emissive) return;
          o.material = o.material.clone(); extraMats.push(o.material);     // 材質は共有なので、複製してから光らせる
          o.material.emissive.copy(o.material.color).lerp(new THREE.Color(1, 1, 1), CFG.LIGHT_WHITEN);
          list.push({ mat: o.material, phase: n * CFG.LIGHT_PHASE_STEP, n });
        });
      });
      if (!list.length) return null;
      if (f.seq) {        // 順に光る：1つの持ち時間は LIGHT_SEQ_STEP_SEC、ぜんぶ光ったら LIGHT_SEQ_REST_SEC 休む
        const N = f.parts.length, step = CFG.LIGHT_SEQ_STEP_SEC, cycle = N * step + CFG.LIGHT_SEQ_REST_SEC;
        return (dt, tt) => {
          const u = tt % cycle;
          for (const l of list) {
            const d = u - l.n * step;                                    // 自分の番が始まってからの秒数
            const on = d >= 0 && d < step ? smooth(clamp01(Math.min(d, step - d) / CFG.LIGHT_SEQ_FADE_SEC)) : 0;   // 番の間だけ、ふわっと点いて消える
            l.mat.emissiveIntensity = CFG.LIGHT_SEQ_OFF + (CFG.LIGHT_MAX - CFG.LIGHT_SEQ_OFF) * on;
          }
        };
      }
      return (dt, tt) => {
        for (const l of list) {
          const k = 0.5 + 0.5 * Math.sin(tt / CFG.LIGHT_PERIOD_SEC * Math.PI * 2 + l.phase);
          l.mat.emissiveIntensity = CFG.LIGHT_MIN + (CFG.LIGHT_MAX - CFG.LIGHT_MIN) * k;
        }
      };
    },

    // drive：wheels（kind）のタイヤを回しながら少し走って、もどる。axis はタイヤの軸（z なら x の向きに走る）。
    // 車の前は、dir が 1 のとき +x（axis が z のとき）／+z（axis が x のとき）
    drive(f) {
      const axle = f.axis || 'z', travel = axle === 'z' ? 'x' : 'z', dir = f.dir === -1 ? -1 : 1;
      const piv = makePivot(), base = piv.position.clone(), sz = movingSize();
      const dist = (travel === 'x' ? sz.x : sz.z) * CFG.DRIVE_DIST_RATIO;
      const wheels = [...slots.values()].filter(s => s.kind === f.wheels && s.piece).map(s => {
        const b = s.piece.size, r = axle === 'z' ? Math.max(b.x, b.y) / 2 : Math.max(b.y, b.z) / 2;
        return { g: s.piece.group, r };
      });
      if (!wheels.length) return null;
      const sign = axle === 'z' ? -1 : 1;                 // 前へ転がる向きに回す
      const T = [CFG.DRIVE_GO_SEC, CFG.DRIVE_PAUSE_SEC, CFG.DRIVE_BACK_SEC, CFG.DRIVE_PAUSE_SEC], cycle = T.reduce((a, b) => a + b, 0);
      return (dt, tt) => {
        let u = tt % cycle, off;
        if (u < T[0]) off = dist * smooth(u / T[0]);
        else if ((u -= T[0]) < T[1]) off = dist;
        else if ((u -= T[1]) < T[2]) off = dist * (1 - smooth(u / T[2]));
        else off = 0;
        piv.position[travel] = base[travel] + dir * off;
        for (const w of wheels) w.g.rotation[axle] = sign * dir * off / w.r;
      };
    },

    // steam：at（置き場所の id。配列なら全部）の部品の上から、湯気の玉が上へ立ちのぼる。
    // offset: [x,y,z] で出る場所をずらし、spread（部品の横幅に対する割合）で横にばらけさせる
    steam(f) {
      const srcs = [].concat(f.at).map(id => slots.get(id)).filter(s => s && s.piece);
      if (!srcs.length) return null;
      const H = bounds.getSize(new THREE.Vector3()).y, size = H * CFG.STEAM_SIZE_RATIO, up = H * CFG.STEAM_RISE_RATIO, sway = H * CFG.STEAM_SWAY_RATIO;
      const off = f.offset || [0, 0, 0], spread = f.spread || 0, wp = new THREE.Vector3();
      let acc = 0, n = 0;
      const o = { color: CFG.STEAM_COLOR, opacity: CFG.STEAM_OPACITY, life: CFG.STEAM_LIFE_SEC, grow: CFG.STEAM_GROW, drag: 0, sway, fadeIn: 0.2 };
      return dt => {
        acc += dt * CFG.STEAM_RATE * srcs.length;
        while (acc >= 1) {
          acc -= 1;
          const s = srcs[n++ % srcs.length], g = s.piece.group;
          g.getWorldPosition(wp);        // 部品の中心。そこから上のふちまで上げた所が出口
          const jx = (Math.random() - 0.5) * spread * s.piece.size.x, jz = (Math.random() - 0.5) * spread * s.piece.size.z;
          addBall(wp.x + off[0] + jx, wp.y + s.piece.size.y / 2 + off[1], wp.z + off[2] + jz, size * (0.8 + Math.random() * 0.4),
            new THREE.Vector3(0, up * (0.85 + Math.random() * 0.3), 0), o, CFG.STEAM_MAX);
        }
      };
    },

    // pop：part（置き場所の id。配列なら全部）の部品が、ぽんと上へ飛び出して、もどる。2つ以上は少しずらして
    pop(f) {
      const list = [].concat(f.part).map(id => { const s = slots.get(id); return s && s.piece ? { g: s.piece.group, y0: s.piece.group.position.y, rise: s.piece.size.y * CFG.POP_HEIGHT_RATIO } : null; }).filter(Boolean);
      if (!list.length) return null;
      const T = [CFG.POP_UP_SEC, CFG.POP_HOLD_SEC, CFG.POP_DOWN_SEC, CFG.POP_REST_SEC], cycle = T.reduce((a, b) => a + b, 0);
      return (dt, tt) => {
        list.forEach((p, i) => {
          let u = tt - i * CFG.POP_STAGGER_SEC, y = 0;
          if (u > 0) {
            u %= cycle;
            if (u < T[0]) y = p.rise * (1 - Math.pow(1 - u / T[0], 3));                                       // ぽんと上がる（はじめ速く、おわりゆっくり）
            else if ((u -= T[0]) < T[1]) y = p.rise + Math.sin(u / T[1] * Math.PI * 4) * p.rise * CFG.POP_WOBBLE;   // 上でちょっとゆれる
            else if ((u -= T[1]) < T[2]) y = p.rise * (1 - smooth(u / T[2]));                                 // すっともどる
          }
          p.g.position.y = p.y0 + y;
        });
      };
    },

    // swing：part（置き場所の id。配列なら全部）の部品が、pivot（完成位置の点 [x,y,z]）を中心に axis のまわりを行ったり来たりする。
    // 全部いっしょに、かたまりのまま動く（ショベルカーのアーム）。pivot を書かなければ各部品の中心。
    // oneway: true なら、付けた形をいちばん下（はじ）にして、dir の向きだけに振れる（アームが地面にめり込まない）。
    // deg … 振れ幅（度、省略すると SWING_DEG）。dir: -1 で逆向き
    swing(f) {
      const axis = AXES[f.axis || 'z'], dir = f.dir === -1 ? -1 : 1, deg = (f.deg ?? CFG.SWING_DEG) * Math.PI / 180;
      const axisVec = new THREE.Vector3(axis === 'x' ? 1 : 0, axis === 'y' ? 1 : 0, axis === 'z' ? 1 : 0);
      const list = [].concat(f.part).map(groupOf).filter(Boolean).map(g => {
        const p0 = g.position.clone();
        return { g, p0, c: f.pivot ? new THREE.Vector3(...f.pivot) : p0 };
      });
      if (!list.length) return null;
      const w = Math.PI * 2 / CFG.SWING_PERIOD_SEC, v = new THREE.Vector3();
      return (dt, tt) => {
        const a = dir * deg * (f.oneway ? 0.5 - 0.5 * Math.cos(tt * w) : Math.sin(tt * w));
        for (const s of list) {
          v.copy(s.p0).sub(s.c).applyAxisAngle(axisVec, a);          // 中心から見た位置を、軸のまわりに回す
          s.g.position.copy(s.c).add(v); s.g.rotation[axis] = a;
        }
      };
    },

    // shake：全体が小刻みにゆれる（でんわのベルが鳴っているよう）。ゆれる→とまる をくり返す
    shake() {
      const piv = makePivot(), base = piv.position.clone(), H = movingSize().y;
      const T = [CFG.SHAKE_ON_SEC, CFG.SHAKE_REST_SEC], cycle = T[0] + T[1];
      return (dt, tt) => {
        const u = tt % cycle;
        let dx = 0, rz = 0;
        if (u < T[0]) {
          const env = Math.sin(u / T[0] * Math.PI), w = Math.sin(u * CFG.SHAKE_FREQ);   // はじめと終わりは小さく、まんなかが大きい
          dx = w * H * CFG.SHAKE_AMP_RATIO * env;
          rz = w * CFG.SHAKE_TILT_DEG * Math.PI / 180 * env;
        }
        piv.position.set(base.x + dx, base.y, base.z); piv.rotation.z = rz;
      };
    },
  };

  function spawnConfetti() {
    const c = bounds.getCenter(new THREE.Vector3()), s = bounds.getSize(new THREE.Vector3());
    const spreadX = Math.max(3.5, s.x * 1.6), spreadZ = Math.max(3, s.z * 1.6), top = bounds.max.y + 2.5;
    for (let i = 0; i < CFG.CONFETTI_COUNT; i++) {
      const m = new THREE.Mesh(confGeo, confMats[i % confMats.length]);
      m.position.set(c.x + (Math.random() - 0.5) * spreadX, top + Math.random() * 4, c.z + (Math.random() - 0.5) * spreadZ);
      m.userData.v = new THREE.Vector3((Math.random() - 0.5) * 0.6, -1.2 - Math.random() * 1.2, (Math.random() - 0.5) * 0.6);
      m.userData.w = new THREE.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      stage.scene.add(m); confetti.push(m);
    }
  }

  return {
    get running() { return running; },
    start() {
      running = true; t = 0; sweeping = false; lastTouch = -1e9;
      SND.fanfare(); buzz(CFG.VIBRATE_FINISH);
      ui.showDone(true);
      spawnConfetti();
      for (const f of [].concat(model.finale || [])) {        // finale は1つでも配列でもよい（2つ同時）
        const make = types[f.type];
        if (make) { const m = make(f); if (m) motions.push(m); }
        else if (f.type) console.info('[finale] 知らない動き:', f.type);
      }
    },
    /** 指で部屋を回したとき（しばらくゆっくり回すのを止める）*/
    touch(now) { lastTouch = now; sweeping = false; },
    /** 毎フレーム。描き直しが要るなら true */
    update(dt, now) {
      if (!running) return false;
      t += dt;
      motions.forEach(m => m(dt, t));
      updateSmoke(dt);
      // 少し待つと、左右にゆっくり回して全体を見せる
      if (t > CFG.FINALE_TURN_DELAY_SEC && now - lastTouch > CFG.FINALE_TURN_RESUME_SEC * 1000) {
        if (!sweeping) {   // 今の向きから続けて回す
          sweeping = true; phase = Math.asin(Math.max(-1, Math.min(1, stage.yawTarget / CFG.FINALE_TURN_AMP)));
        }
        phase += dt * Math.PI * 2 / CFG.FINALE_TURN_PERIOD_SEC;
        stage.setYawTarget(Math.sin(phase) * CFG.FINALE_TURN_AMP);
      }
      for (const m of confetti) {
        m.position.addScaledVector(m.userData.v, dt);
        m.rotation.x += m.userData.w.x * dt; m.rotation.y += m.userData.w.y * dt;
        if (m.position.y < 0.02) m.position.y = 0.02;
      }
      return true;
    },
    /** 紙吹雪・煙を片づけて、動きを止める */
    reset() {
      running = false; motions.length = 0;
      confetti.splice(0).forEach(m => stage.scene.remove(m));
      smoke.splice(0).forEach(m => { stage.scene.remove(m); m.material.dispose(); });
      if (pivot) { stage.scene.remove(pivot); pivot = null; }    // 部品は入れ物ごと外す（部屋に残さない）
      extraMats.splice(0).forEach(m => m.dispose());
      ui.showDone(false);
    },
    dispose() {
      this.reset(); confGeo.dispose(); confMats.forEach(m => m.dispose()); smokeGeo.dispose();
    },
  };
}

KP.finale = { createFinale };
