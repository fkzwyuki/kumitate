// 題材の大きさからカメラの距離と向きを決める（部屋と、ずかんのカードの絵で共用）
// 題材の足もと（上下の円）を画面に映して、指定の範囲（safe）にちょうど収まる距離を探す。
// 円で見ているので、部屋を左右に回しても大きさがあまり変わらない。
import * as THREE from 'three';
import { CFG } from './config.js?v=6250ca2';

const tmp = new THREE.Vector3();

/**
 * cam … PerspectiveCamera（aspect と fov は決めておく）。位置と向きもここで決めて返す
 * bounds … 題材の箱（Box3）
 * opt … { yaw, elev, safe:{l,r,t,b}（画面の大きさに対する余白の割合）, footprint }
 * 戻り値 … { look: 見る点, dist: 距離 }
 */
export function fitView(cam, bounds, { yaw, elev, safe, footprint = CFG.CAM_FIT_FOOTPRINT, iter = CFG.CAM_FIT_ITER }) {
  const c = bounds.getCenter(new THREE.Vector3()), s = bounds.getSize(new THREE.Vector3());
  const rH = Math.hypot(s.x, s.z) / 2 * footprint;
  const pts = [];
  for (const y of [bounds.min.y, bounds.max.y]) {
    for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; pts.push(new THREE.Vector3(c.x + rH * Math.cos(a), y, c.z + rH * Math.sin(a))); }
  }
  // 画面（NDC）の中で収めたい範囲
  const xlo = -1 + 2 * safe.l, xhi = 1 - 2 * safe.r, ylo = -1 + 2 * safe.b, yhi = 1 - 2 * safe.t;
  const wantW = xhi - xlo, wantH = yhi - ylo, wantCx = (xlo + xhi) / 2, wantCy = (ylo + yhi) / 2;
  const look = c.clone();
  const tanH = Math.tan(cam.fov * Math.PI / 360);
  let dist = Math.max(s.x, s.y, s.z) * 2.5 + 1;

  const place = () => {
    cam.position.set(look.x + dist * Math.cos(elev) * Math.sin(yaw), look.y + dist * Math.sin(elev), look.z + dist * Math.cos(elev) * Math.cos(yaw));
    cam.lookAt(look); cam.updateMatrixWorld();
  };
  for (let i = 0; i < iter; i++) {
    place();
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of pts) { tmp.copy(p).project(cam); x0 = Math.min(x0, tmp.x); x1 = Math.max(x1, tmp.x); y0 = Math.min(y0, tmp.y); y1 = Math.max(y1, tmp.y); }
    const k = Math.max((x1 - x0) / wantW, (y1 - y0) / wantH);
    dist = Math.max(0.5, dist * k);                              // はみ出していれば遠ざかり、余っていれば近づく
    // 映った中心が範囲の真ん中に来るよう、見る点を動かす
    const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
    const halfH = dist * tanH, halfW = halfH * cam.aspect;
    look.addScaledVector(right, ((x0 + x1) / 2 - wantCx) * halfW);
    look.addScaledVector(up, ((y0 + y1) / 2 - wantCy) * halfH);
  }
  place();
  return { look, dist };
}
