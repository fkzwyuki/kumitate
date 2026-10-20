// 部屋とカメラ（DESIGN.md §6.4、§8.2）。部屋は heya／douro／soto の3つ、どれにも白い置き台
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { CFG } from './config.js?v=6250ca2';
import { fitView } from './camfit.js?v=6250ca2';

const D2R = Math.PI / 180;

// ---------- 部屋の中身を作る小さな道具 ----------
const mats = new Map();
const mat = c => { if (!mats.has(c)) mats.set(c, new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 })); return mats.get(c); };

function box(parent, w, h, d, color, x, y, z, { shadow = false, cast = false } = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.position.set(x, y, z); m.receiveShadow = shadow; m.castShadow = cast; parent.add(m); return m;
}
function rbox(parent, w, h, d, r, color, x, y, z, { shadow = false, cast = false } = {}) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), mat(color));
  m.position.set(x, y, z); m.receiveShadow = shadow; m.castShadow = cast; parent.add(m); return m;
}
function ground(parent, color, size = 40) {
  const f = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat(color));
  f.rotation.x = -Math.PI / 2; f.receiveShadow = true; parent.add(f); return f;
}
function pad(parent) {   // どの部屋にも置く白い置き台
  const [w, h, d] = CFG.PAD_SIZE;
  const m = rbox(parent, w, h, d, 0.08, '#f1f1ef', ...CFG.PAD_POS, { shadow: true, cast: true });
  return m;
}
function sph(parent, r, color, x, y, z, sy = 1) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), mat(color));
  m.position.set(x, y, z); m.scale.y = sy; m.castShadow = true; parent.add(m); return m;
}
function cyl(parent, r1, r2, h, color, x, y, z, seg = 12) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat(color));
  m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m;
}
function cone(parent, r, h, color, x, y, z) {
  const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 14), mat(color));
  m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m;
}

// 置き台（x -1.9〜2.3、z -1.6〜2.0）にかぶるか
const onPad = (x, z, margin = 0.4) => {
  const [w, , d] = CFG.PAD_SIZE, [px, , pz] = CFG.PAD_POS;
  return Math.abs(x - px) < w / 2 + margin && Math.abs(z - pz) < d / 2 + margin;
};

// 部屋ごとの作り方。clear は背景の色
const ROOMS = {
  // plain：tools/check.html の「ばらばら」の絵だけに使う、何もない床（題材の room には使わない）
  plain: { clear: '#eef0f2', build(g) { ground(g, '#dfe3e7', 60); } },
  // へや：木の床、壁2面、マット、いす
  heya: {
    clear: '#f3dcc2',
    build(g) {
      ground(g, '#e2b892', 30);
      pad(g);
      box(g, 30, 8, 0.3, '#f7e6cf', 0, 4, -3.6, { shadow: true });
      box(g, 0.3, 8, 30, '#efd8bd', -4.2, 4, 0, { shadow: true });
      box(g, 1.4, 0.06, 2.2, '#e8ea72', 3.2, 0.03, 0.4, { shadow: true });   // マット
      const stool = new THREE.Group();                                       // いす
      const st = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.18, 0.7, 3, 0.07), mat('#5cb8c4')); st.position.y = 0.62; stool.add(st);
      for (const x of [-0.42, 0.42]) {
        const l = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.55, 0.7, 3, 0.06), mat('#5cb8c4')); l.position.set(x, 0.27, 0); stool.add(l);
      }
      stool.position.set(-2.6, 0, -2.3); stool.traverse(o => { o.castShadow = true; }); g.add(stool);
    },
  },
  // どうろ：灰色の道路と白線、歩道、木
  douro: {
    clear: '#cfe8f5',
    build(g) {
      ground(g, '#6c7179', 40);                                                    // 道路
      box(g, 40, 0.14, 4, '#d9d4c7', 0, 0.07, -6.2, { shadow: true });             // 奥の歩道
      box(g, 40, 0.16, 0.25, '#b9b3a6', 0, 0.08, -4.1, { shadow: true });          // ふち石
      box(g, 40, 0.14, 4, '#d9d4c7', 0, 0.07, 7.4, { shadow: true });              // 手前の歩道
      for (let x = -18; x <= 18; x += 2) {                                         // 白線（置き台の下は避ける）
        if (onPad(x, 0.2, 0.9) || onPad(x + 1.2, 0.2, 0.9)) continue;
        box(g, 1.2, 0.012, 0.16, '#ffffff', x, 0.006, 0.2, { shadow: true });
      }
      pad(g);
      for (const x of [-9, -4.5, 5.5, 10]) {                                       // 木
        cyl(g, 0.14, 0.18, 1.2, '#8b5e3c', x, 0.74, -6.0);
        sph(g, 0.95, '#4fae5a', x, 2.0, -6.0, 1.1);
      }
      cyl(g, 0.14, 0.18, 1.2, '#8b5e3c', -7, 0.74, 7.6); sph(g, 0.95, '#5cbd63', -7, 2.0, 7.6, 1.1);
    },
  },
  // そと：芝生、空色の背景、雲、花
  soto: {
    clear: '#bfe6ff',
    build(g) {
      ground(g, '#8fd16a', 40);
      pad(g);
      const patch = (x, z, r) => {                                                 // 芝のもよう
        const m = new THREE.Mesh(new THREE.CircleGeometry(r, 24), mat('#82c55e'));
        m.rotation.x = -Math.PI / 2; m.position.set(x, 0.01, z); m.receiveShadow = true; g.add(m);
      };
      patch(-5, 3, 1.6); patch(6, -3, 2.2); patch(-3, -5, 1.3); patch(5.5, 5, 1.5);
      const cloud = (x, y, z, s) => {                                              // 雲
        for (const [dx, dy, r] of [[-0.9, 0, 0.8], [0, 0.35, 1.1], [1, 0, 0.85], [0.4, -0.1, 0.8]]) {
          sph(g, r * s, '#ffffff', x + dx * s, y + dy * s, z, 0.8).castShadow = false;
        }
      };
      cloud(-8, 9, -12, 1.2); cloud(6, 11, -14, 1.5); cloud(14, 8, -8, 1.0);
      const flower = (x, z, c) => {                                                // 花
        cyl(g, 0.02, 0.02, 0.35, '#4c9a45', x, 0.18, z, 6);
        sph(g, 0.1, c, x, 0.4, z).castShadow = false;
        sph(g, 0.05, '#ffe14d', x, 0.46, z).castShadow = false;
      };
      [[-3.4, 2.8, '#ff7aa8'], [-3.0, 3.3, '#ffffff'], [3.8, 3.2, '#ff9f45'], [4.3, 2.6, '#ff7aa8'],
       [-3.8, -2.4, '#b48ef0'], [3.6, -2.6, '#ffffff'], [-2.2, 4.2, '#ff9f45'], [2.4, 4.6, '#ff7aa8']].forEach(f => flower(...f));
    },
  },
};

// ---------- 部屋とカメラ ----------
export function createStage() {
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const bg = new THREE.Color('#f3dcc2');

  // 光は「空の光」と「斜め上からの光」の2つ。影は床と台にだけ
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb59a80, 2.1));
  const sun = new THREE.DirectionalLight(0xffffff, 2.4);
  sun.position.set(4, 9, 6); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  const sc = sun.shadow.camera; sc.left = -5; sc.right = 5; sc.top = 6; sc.bottom = -4;
  sun.shadow.radius = 4; sun.shadow.bias = -0.002;
  scene.add(sun);

  let roomGroup = null, roomId = null;
  const look = new THREE.Vector3(0, 1.9, 0);
  let dist = 11.5, radius = 2.7, aspect = 1, fitScale = 1, landscape = false, fitBounds = null;
  const st = { yaw: 0, yawTarget: 0 };

  function setRoom(id) {
    if (roomGroup) {
      scene.remove(roomGroup);
      roomGroup.traverse(o => { if (o.isMesh && o.geometry) o.geometry.dispose(); });
    }
    const def = ROOMS[id] || ROOMS.heya; roomId = ROOMS[id] ? id : 'heya';
    roomGroup = new THREE.Group(); def.build(roomGroup); scene.add(roomGroup);
    bg.set(def.clear);
  }

  function placeCam() {
    const a = CFG.CAM_BASE_YAW + st.yaw, e = CFG.CAM_ELEV;
    cam.position.set(look.x + dist * Math.cos(e) * Math.sin(a), look.y + dist * Math.sin(e), look.z + dist * Math.cos(e) * Math.cos(a));
    cam.lookAt(look);
    cam.updateMatrixWorld();      // すぐ呼ぶ（呼ばないと、描く前のタップの当たり判定がずれる）
  }

  const api = {
    scene, cam, bg,
    get roomId() { return roomId; },
    get yaw() { return st.yaw; }, get yawTarget() { return st.yawTarget; },
    setRoom,
    /** 題材の大きさ（Box3）に合わせてカメラの向きと距離を決める（camfit.js）。distScale は絵用の微調整 */
    fit(bounds, distScale = 1) {
      fitScale = distScale; fitBounds = bounds.clone();
      radius = bounds.getSize(new THREE.Vector3()).length() / 2;
      api.refit();
    },
    refit() {
      if (!fitBounds) { placeCam(); return; }
      const safe = landscape ? CFG.CAM_SAFE_LANDSCAPE : CFG.CAM_SAFE_PORTRAIT;
      const r = fitView(cam, fitBounds, { yaw: CFG.CAM_BASE_YAW, elev: CFG.CAM_ELEV, safe });
      look.copy(r.look); dist = r.dist * fitScale;
      placeCam();
    },
    /** 部屋の矩形（px）に合わせる。wide は画面全体が横長か（「できた！」の文字の置き方が変わるので）*/
    layout(w, h, wide = w >= h) {
      aspect = w / h; landscape = wide;
      cam.aspect = aspect;
      cam.fov = aspect < CFG.CAM_ASPECT_SWITCH ? CFG.CAM_FOV_PORTRAIT : CFG.CAM_FOV_LANDSCAPE;
      cam.updateProjectionMatrix();
      api.refit();
    },
    setYawTarget(v) {
      const lim = CFG.VIEW_YAW_MAX * D2R;
      st.yawTarget = Math.max(-lim, Math.min(lim, v));
    },
    /** 毎フレーム：向きをなめらかに追いつかせる。変わったら true */
    update(dt) {
      if (Math.abs(st.yaw - st.yawTarget) > 0.0005) {
        st.yaw += (st.yawTarget - st.yaw) * Math.min(1, dt * CFG.YAW_EASE);
        placeCam(); return true;
      }
      return false;
    },
    resetYaw() { st.yaw = st.yawTarget = 0; placeCam(); },
    /** ワールドの点 → 部屋の矩形内の画面位置（px）*/
    toScreen(v, w, h) {
      const p = v.clone().project(cam);
      return { x: (p.x + 1) / 2 * w, y: (1 - p.y) / 2 * h };
    },
    /** 画面の点（部屋の矩形内の px）を、ref と同じ奥行きの場所に直す */
    pointAt(x, y, w, h, ref) {
      const z = ref.clone().project(cam).z;
      return new THREE.Vector3(x / w * 2 - 1, -(y / h) * 2 + 1, z).unproject(cam);
    },
    /** 引っぱっている部品の奥行きの基準（題材の中心より、手前に少し）*/
    dragRef(center) {
      const dir = cam.position.clone().sub(center).normalize();
      return center.clone().addScaledVector(dir, radius * CFG.DRAG_DEPTH_RATIO);
    },
  };
  setRoom('heya');
  placeCam();
  return api;
}

export const ROOM_IDS = ['heya', 'douro', 'soto'];   // 題材が選べる部屋
KP.stage = { createStage, ROOM_IDS };
