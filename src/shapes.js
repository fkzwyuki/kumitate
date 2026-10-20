// 図形（DESIGN.md §6.2）→ Three.js の形。部品の中心の計算もここ。
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { CFG } from './config.js?v=6250ca2';

const D2R = Math.PI / 180;

// ---------- 材質（ふつう／glass／metal の3つ）----------
const matCache = new Map();
export function material(color, kind = '', double = false) {
  const key = color + '|' + kind + '|' + double;
  let m = matCache.get(key);
  if (!m) {
    const side = double ? THREE.DoubleSide : THREE.FrontSide;
    m = kind === 'metal' ? new THREE.MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.35, side })
      : kind === 'glass' ? new THREE.MeshStandardMaterial({ color, roughness: 0.1, transparent: true, opacity: 0.75, side })
      : new THREE.MeshStandardMaterial({ color, roughness: 0.55, side });
    matCache.set(key, m);
  }
  return m;
}

// 中身がつまっている形か（めり込みチェックで「隠す側」になれるか）
const SOLID = new Set(['box', 'rbox', 'cyl', 'cone', 'sphere', 'prism']);
export const isSolid = s => SOLID.has(s.type) && !(s.type === 'sphere' && s.half);

// ---------- 図形 → ジオメトリ ----------
function roundedRectShape(w, h, r) {
  const sh = new THREE.Shape();
  r = Math.min(r, w / 2 - 0.001, h / 2 - 0.001);
  sh.moveTo(-w / 2 + r, -h / 2); sh.lineTo(w / 2 - r, -h / 2); sh.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  sh.lineTo(w / 2, h / 2 - r); sh.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  sh.lineTo(-w / 2 + r, h / 2); sh.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  sh.lineTo(-w / 2, -h / 2 + r); sh.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return sh;
}

export function geometryOf(s) {
  const z = s.size;
  switch (s.type) {
    case 'box': return new THREE.BoxGeometry(z[0], z[1], z[2]);
    case 'rbox': {
      const r = Math.min(s.r ?? 0.05, Math.min(z[0], z[1], z[2]) / 2 - 0.001);
      return new RoundedBoxGeometry(z[0], z[1], z[2], 3, r);
    }
    case 'cyl': return new THREE.CylinderGeometry(z[0], z[0], z[1], 28);
    case 'tube': return new THREE.CylinderGeometry(z[0], z[0], z[1], 32, 1, true);   // 両端があいた筒（内側も描く）
    case 'cone': return new THREE.ConeGeometry(z[0], z[1], 28);
    case 'sphere':
      return s.half ? new THREE.SphereGeometry(z[0], 20, 10, 0, Math.PI * 2, 0, Math.PI / 2)   // 半球（ふくらみが上）
                    : new THREE.SphereGeometry(z[0], 16, 12);
    case 'torus': return new THREE.TorusGeometry(z[0], z[1], 12, 40);
    case 'prism': {                     // 三角柱：断面は幅×高さの三角形（とがりが上）、奥行きぶん伸ばす
      const [w, h, d] = z, sh = new THREE.Shape();
      sh.moveTo(-w / 2, -h / 2); sh.lineTo(w / 2, -h / 2); sh.lineTo(0, h / 2); sh.closePath();
      const g = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false });
      g.translate(0, 0, -d / 2); return g;
    }
    case 'plate': {                     // 穴のあいた板（hole は無くてもよい）
      const [w, h, d] = z, sh = roundedRectShape(w, h, 0.08);
      if (s.hole) { const hole = new THREE.Path(); hole.absarc(s.hole.x, s.hole.y, s.hole.r, 0, Math.PI * 2, true); sh.holes.push(hole); }
      const g = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 32 });
      g.translate(0, 0, -d / 2); return g;
    }
  }
  throw new Error('知らない図形: ' + s.type);
}

const needsDouble = s => s.type === 'tube' || (s.type === 'sphere' && s.half);

// ---------- 部品 ----------
const r3 = n => Math.round(n * 1000) / 1000;

/**
 * 題材の部品1つ → 部品オブジェクト。
 * 部品は「完成位置」で書かれているので、図形全体の箱の中心を計算して target にし、
 * 図形の位置は中心からの差に直す（これでグループの原点が部品の中心になる）。
 */
export function buildPart(def) {
  const group = new THREE.Group();
  const shapeBoxes = [];
  for (const s of def.shapes) {
    const m = new THREE.Mesh(geometryOf(s), material(s.color, s.mat || '', needsDouble(s)));
    m.position.set(...s.pos);
    if (s.rot) m.rotation.set(s.rot[0] * D2R, s.rot[1] * D2R, s.rot[2] * D2R);
    m.castShadow = true;            // 影は床と台にだけ落とす（部品どうしでは落とさない）
    group.add(m);
    group.updateMatrixWorld(true);
    shapeBoxes.push({ type: s.type, solid: isSolid(s), box: new THREE.Box3().setFromObject(m),
      sph: s.type === 'sphere' && !s.half ? { c: new THREE.Vector3(...s.pos), r: s.size[0] } : null });   // 球は箱ではなく本物の丸で当たりを見る
  }
  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  group.children.forEach(m => m.position.sub(center));

  // 同じ形かどうかの見分け（kind が同じ部品は、これが一致していること）
  const sig = JSON.stringify(def.shapes.map((s, i) => [
    s.type, s.size.map(r3), s.color, s.mat || '', (s.rot || [0, 0, 0]).map(r3), s.r ?? null, !!s.half, s.hole || null,
    group.children[i].position.toArray().map(r3),
  ]));

  const part = {
    def, id: def.id, kind: def.kind || null, on: def.on || [], closes: def.closes || [],
    group, target: center.clone(), size, box, shapeBoxes, sig,
    shapeCount: def.shapes.length,
  };
  group.userData.partId = def.id;   // （userData に part を入れると clone で循環して壊れるので id だけ）
  return part;
}

/** 題材 → 部品の一覧（題材に書いた順）*/
export function buildParts(model) { return model.parts.map(buildPart); }

/** 全部品の完成位置をまとめた箱（カメラの合わせ方に使う）*/
export function modelBounds(parts) {
  const b = new THREE.Box3();
  parts.forEach(p => b.union(p.box));
  return b;
}

/** 題材の図形の数 */
export function countShapes(model) { return model.parts.reduce((n, p) => n + p.shapes.length, 0); }

/** 部品の数から ★ の数（1〜3）*/
export function starsOf(n) { return n <= CFG.STAR_LIMITS[0] ? 1 : n <= CFG.STAR_LIMITS[1] ? 2 : 3; }

/** 置き場所を示すゴースト（すけた水色の複製）。完成位置に置く */
export function makeGhost(part) {
  const gh = part.group.clone(true);
  const mat = new THREE.MeshBasicMaterial({ color: CFG.GHOST_COLOR, transparent: true, opacity: CFG.GHOST_OPACITY, depthWrite: false, depthTest: false });   // 奥に隠れる場所でも見えるように
  gh.traverse(o => { if (o.isMesh) { o.material = mat; o.castShadow = false; o.renderOrder = 10; } });
  gh.position.copy(part.target); gh.rotation.set(0, 0, 0); gh.scale.setScalar(1);
  gh.visible = false; gh.userData.ghostMat = mat;
  return gh;
}

/** 部品の入れ物を片づける（ジオメトリだけ。材質は共有なので残す）*/
export function disposeGroup(g) {
  g.traverse(o => { if (o.isMesh && o.geometry) o.geometry.dispose(); });
}

KP.shapes = { buildPart, buildParts, modelBounds, countShapes, starsOf };
