import { Color3, Mesh, MeshBuilder, Scene, Vector3, VertexData, TransformNode, type Material } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { limbBox, limbShell } from "./medievalDress";

/** Closed faceted ornament in its parent's XY plane, with a real back face. */
function ornament(scene: Scene, name: string, points: number[][], depth: number, parent: TransformNode, material: Material): Mesh {
  const positions: number[] = [], indices: number[] = [];
  for (const z of [-depth / 2, depth / 2]) for (const [x, y] of points) positions.push(x, y, z);
  const n = points.length;
  for (let j = 1; j < n - 1; j++) indices.push(0, j + 1, j, n, n + j, n + j + 1);
  for (let j = 0; j < n; j++) { const k = (j + 1) % n; indices.push(j, k, k + n, j, k + n, j + n); }
  const normals: number[] = []; VertexData.ComputeNormals(positions, indices, normals);
  const data = new VertexData(); Object.assign(data, { positions, indices, normals });
  const mesh = new Mesh(name, scene); data.applyToMesh(mesh); mesh.parent = parent; mesh.material = material;
  mesh.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(mesh); return mesh;
}

/** Devout's gold brow hoop rises into one triangular front, with an ivory gem.
 * Ref red render: bare scalp, tip ~.6 head heights above the crown. */
export function devoutCirclet(scene: Scene, body: ArticulatedBody): Mesh[] {
  const b = body.headMesh.getBoundingInfo().boundingBox, W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const color = new Color3(1, 0.7, 0.18), gold = getMaterialFactory().get("unlit", color, { emissive: color });
  const band = MeshBuilder.CreateTorus("devoutCircletBand", { diameter: W * 1.12, thickness: H * 0.11, tessellation: 8 }, scene);
  band.parent = body.headMesh; band.position.copyFrom(b.center); band.position.y += H * 0.3; band.scaling.z = D / W;
  band.material = gold; scene.getGlowLayerByName("glow")?.addExcludedMesh(band);
  const front = ornament(scene, "devoutCircletFront", [[-W*.58,0], [0,H*.85], [W*.58,0], [0,H*.12]], D*.12, body.headMesh, gold);
  front.position.set(b.center.x, b.center.y + H*.29, b.center.z + D*.56);
  const ivory = new Color3(1.2,1.1,.65), gemMat = getMaterialFactory().get("unlit", ivory, { emissive: ivory });
  const gem = MeshBuilder.CreateSphere("devoutCircletGem", { diameterX: W*.22, diameterY:H*.38, diameterZ:D*.16, segments:4 }, scene);
  gem.parent = body.headMesh; gem.position.copyFrom(front.position); gem.position.y += H*.43; gem.position.z += D*.1; gem.material = gemMat;
  return [band, front, gem];
}

/** [S] 488 (CONFIRM 487 a.2; good.divine_arbiter.red.png, .jpg): a pope's
 * rounded team mitre, not a straight cylinder. Spec (head widths W, heights H,
 * depths D): an egg-topped dome, the upper half of an ellipsoid 1.12W x 2H x
 * 1.12D, its rim at .36H over the head's centre so it rises about one head
 * height over the crown; a gold band round the rim 1.16W across, .16H tall; on
 * the front a gold crown point .6W wide at the band rising .55H to a peak,
 * tilted back to the dome, with a team diamond .24W x .32H in a gold frame. */
export function arbiterMitre(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const b=body.headMesh.getBoundingInfo().boundingBox,W=b.extendSize.x*2,H=b.extendSize.y*2,D=b.extendSize.z*2;
  const cloth=getMaterialFactory().get("cloth",team,{emissive:team.scale(.12)});
  const c=new Color3(1,.7,.18),gold=getMaterialFactory().get("unlit",c,{emissive:c});
  const rim=b.center.y+H*.36;
  const hat=MeshBuilder.CreateSphere("arbiterMitre",{diameterX:W*1.12,diameterY:H*2,diameterZ:D*1.12,segments:5,slice:.5},scene);
  hat.parent=body.headMesh;hat.position.set(b.center.x,rim,b.center.z);hat.material=cloth;
  const band=MeshBuilder.CreateCylinder("arbiterMitreBand",{height:H*.16,diameter:W*1.16,tessellation:10},scene);
  band.parent=body.headMesh;band.position.set(b.center.x,rim+H*.05,b.center.z);band.scaling.z=D/W;band.material=gold;
  const front=b.center.z+D*.56;
  const panel=ornament(scene,"arbiterMitreForehead",[[-W*.3,0],[W*.3,0],[W*.3,H*.26],[0,H*.55],[-W*.3,H*.26]],D*.1,body.headMesh,gold);
  panel.position.set(b.center.x,rim-H*.03,front+D*.04);panel.rotation.x=-.28;
  const frame=ornament(scene,"arbiterMitreDiamondFrame",[[0,H*.2],[-W*.15,0],[0,-H*.2],[W*.15,0]],D*.06,panel,gold);
  frame.position.set(0,H*.26,D*.06);
  const jewel=ornament(scene,"arbiterMitreDiamond",[[0,H*.16],[-W*.12,0],[0,-H*.16],[W*.12,0]],D*.06,panel,cloth);
  jewel.position.set(0,H*.26,D*.1);
  for(const m of [hat,band]) { m.convertToFlatShadedMesh();scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return [hat,band,panel,frame,jewel];
}

/** Paladin's open face has a center part, long grey side locks, a tied
 * ponytail, and three lighter outward-pointing wing locks on each temple. */
export function paladinHair(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const b=body.headMesh.getBoundingInfo().boundingBox,W=b.extendSize.x*2,H=b.extendSize.y*2,D=b.extendSize.z*2;
  const grey=new Color3(.48,.52,.55), pale=new Color3(.8,.83,.83);
  const hair=getMaterialFactory().get("unlit",grey,{emissive:grey}), wing=getMaterialFactory().get("unlit",pale,{emissive:pale});
  const out:Mesh[]=[];
  for(const side of [-1,1]) {
    const crown=ornament(scene,"paladinPartedHair",[[0,H*.55],[side*W*.14,H*.76],[side*W*.58,H*.4],[side*W*.53,-H*.66],[side*W*.36,-H*.75],[side*W*.38,H*.29],[side*W*.04,H*.37]],D*.94,body.headMesh,hair);
    crown.position.copyFrom(b.center); crown.position.z-=D*.05; out.push(crown);
    for(let k=0;k<3;k++) {
      const feather=ornament(scene,"paladinWingLock",[[side*W*.42,H*(.19-k*.22)],[side*W*(.9-k*.07),H*(.58-k*.35)],[side*W*.62,H*(-.06-k*.2)],[side*W*.43,H*(-.13-k*.2)]],D*.25,body.headMesh,wing);
      feather.position.copyFrom(b.center); feather.position.z-=D*.15; out.push(feather);
    }
  }
  const tail=MeshBuilder.CreateSphere("paladinPonytail",{diameterX:W*.5,diameterY:H*1.3,diameterZ:D*.45,segments:5},scene);
  tail.parent=body.headMesh;tail.position.copyFrom(b.center);tail.position.addInPlace(new Vector3(0,-H*.32,-D*.65));tail.material=hair;out.push(tail);
  const tie=MeshBuilder.CreateBox("paladinHairTie",{width:W*.51,height:H*.12,depth:D*.46},scene);
  tie.parent=body.headMesh;tie.position.copyFrom(tail.position);tie.position.y+=H*.31;tie.material=getMaterialFactory().get("cloth",team);out.push(tie);
  for(const m of out) scene.getGlowLayerByName("glow")?.addExcludedMesh(m);
  return out;
}

/** Two pale yellow moustache wings curl up at their outer tips below the eyes. */
export function devoutMoustache(scene: Scene, body: ArticulatedBody): Mesh[] {
  const b=body.headMesh.getBoundingInfo().boundingBox, W=b.extendSize.x*2,H=b.extendSize.y*2,D=b.extendSize.z*2;
  const c=new Color3(1,.9,.3), mat=getMaterialFactory().get("unlit",c,{emissive:c});
  return [-1,1].map(side=>{
    const points=[[0,.03],[.15,.07],[.35,.01],[.49,.03],[.56,.14],[.55,-.02],[.43,-.11],[.2,-.09],[0,-.04]].map(([x,y])=>[side*x*W,y*H]);
    if(side<0) points.reverse();
    const m=ornament(scene,"devoutCurledMoustache",points,D*.15,body.headMesh,mat);
    m.position.set(b.center.x,b.center.y-H*.15,b.center.z+D*.59); return m;
  });
}

/** Devout shoulder plates sweep sideways, then curl upward; a narrow gold
 * band crosses the collarbones. Ref: horn span ~2.6 torso widths, solid facets. */
export function devoutShoulders(scene: Scene, body: ArticulatedBody): Mesh[] {
  const b = body.torsoMesh.getBoundingInfo().boundingBox, W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const c = new Color3(1,.7,.18), gold = getMaterialFactory().get("unlit", c, { emissive:c });
  const out: Mesh[] = [];
  for (const side of [-1,1]) {
    const points = [[.33,.02],[.56,.13],[.9,.07],[1.16,.23],[1.27,.55],[1.34,.58],[1.32,.29],[1.19,.08],[.85,-.06],[.44,-.08]].map(([x,y])=>[side*x*W,y*W]);
    if (side < 0) points.reverse();
    const horn = ornament(scene,"devoutShoulderHorn",points,D*.85,body.torso,gold);
    horn.position.set(0,body.neck.position.y-H*.08,0); out.push(horn);
  }
  const band = MeshBuilder.CreateTube("devoutChestBand", { path:[new Vector3(-W*.49,body.neck.position.y-H*.08,D*.53),new Vector3(0,body.neck.position.y-H*.02,D*.62),new Vector3(W*.49,body.neck.position.y-H*.08,D*.53)],radius:H*.035,tessellation:5,cap:Mesh.CAP_ALL },scene);
  band.parent=body.torso; band.material=gold; scene.getGlowLayerByName("glow")?.addExcludedMesh(band); out.push(band);
  return out;
}

/** [S] 483, good.celestial_aegis.red.png: white hair frames the temples,
 * with a short tied braid behind. The team butterfly has two upright oval
 * wings (~1.4 head heights) and two smaller horizontal lower wings; its full
 * span is about 2.8 head widths. All four are solid flattened faceted lobes. */
export function aegisButterflyHair(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const head = body.headMesh, box = head.getBoundingInfo().boundingBox;
  const W = box.extendSize.x * 2, H = box.extendSize.y * 2, D = box.extendSize.z * 2, c = box.center;
  const white = new Color3(0.85, 0.88, 0.95);
  const hair = getMaterialFactory().get("unlit", white, { emissive: white });
  const wing = getMaterialFactory().get("cloth", team, { emissive: team.scale(0.12) });
  const out: Mesh[] = [];
  const put = (mesh: Mesh, material: Material, x: number, y: number, z: number): Mesh => {
    mesh.parent = head; mesh.position.set(c.x + x, c.y + y, c.z + z); mesh.material = material;
    mesh.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(mesh);
    out.push(mesh); return mesh;
  };
  put(MeshBuilder.CreateSphere("aegisWhiteCrown", { diameterX: W * 1.12, diameterY: H * 0.4, diameterZ: D * 1.1, segments: 6 }, scene), hair, 0, H * 0.47, 0);
  for (const side of [-1, 1]) {
    put(MeshBuilder.CreateBox("aegisWhiteTemple", { width: W * 0.17, height: H * 0.6, depth: D * 0.8 }, scene), hair, side * W * 0.49, H * 0.13, -D * 0.1);
    const upper = put(MeshBuilder.CreateSphere("aegisButterflyUpperWing", {
      diameterX: W * 0.78, diameterY: H * 1.32, diameterZ: W * 0.13, segments: 6,
    }, scene), wing, side * W * 0.79, H * 0.95, -D * 0.44);
    upper.rotation.z = side * -0.6;
    const lower = put(MeshBuilder.CreateSphere("aegisButterflyLowerWing", {
      diameterX: W * 1.03, diameterY: H * 0.4, diameterZ: W * 0.14, segments: 6,
    }, scene), wing, side * W * 0.9, H * 0.18, -D * 0.43);
    lower.rotation.z = side * 0.16;
    const antenna = put(MeshBuilder.CreateCylinder("aegisButterflyAntenna", {
      height: H * 0.65, diameterTop: W * 0.025, diameterBottom: W * 0.045, tessellation: 5,
    }, scene), wing, side * W * 0.13, H * 1.02, -D * 0.42);
    antenna.rotation.z = side * -0.2;
  }
  for (let k = 0; k < 4; k++) {
    put(MeshBuilder.CreateSphere("aegisWhiteBraid", { diameterX: W * (0.24 - k * 0.025), diameterY: H * 0.22, diameterZ: D * 0.24, segments: 4 }, scene), hair,
      k % 2 ? W * 0.025 : -W * 0.025, -H * (0.05 + k * 0.16), -D * 0.55);
  }
  put(MeshBuilder.CreateBox("aegisBraidTie", { width: W * 0.22, height: H * 0.08, depth: D * 0.25 }, scene), wing, 0, -H * 0.4, -D * 0.55);
  return out;
}

/** Closed solid from quads given as [inner, outer] vertex rings; each triangle is wound so its
 * Babylon face normal ((a-b)x(c-b)) points along `out(centroid)`, so the shell has no back faces. */
function solidFromTris(scene: Scene, name: string, tris: number[][][], out: (c: number[]) => number[]): Mesh {
  const positions: number[] = [], indices: number[] = [];
  for (const [a, b, c] of tris) {
    const u = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], v = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const o = out([(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3]);
    const flip = n[0] * o[0] + n[1] * o[1] + n[2] * o[2] < 0;
    const base = positions.length / 3;
    for (const p of flip ? [a, c, b] : [a, b, c]) positions.push(p[0], p[1], p[2]);
    indices.push(base, base + 1, base + 2);
  }
  const normals: number[] = []; VertexData.ComputeNormals(positions, indices, normals);
  const data = new VertexData(); Object.assign(data, { positions, indices, normals });
  const mesh = new Mesh(name, scene); data.applyToMesh(mesh); return mesh;
}

/** [R] 490 good.divine_arbiter.a (robe rebuild, blockers 1-3; CONFIRM 487/488 lists).
 * Spec read off good.divine_arbiter.red.png/.blue.png (front view, ~945 px tall):
 * - Collar: one smooth gold Medici collar, not separate petals. It closes in a V under the chin
 *   and rises round the head into two broad wings whose outer corners stand at eye level about
 *   1.6 head widths out each side (collar ~3.2 head widths across, wider than the shoulders); the
 *   back rim reaches the top of the head. Spec (head widths W, heights H, neck frame, angle a from
 *   the front): throat ring .45W at -.05H; rim radius W*(.8 + .8*exp(-((|a|-95deg)/40deg)^2));
 *   rim height H*min(1, ((|a|-30deg)/65deg)^.8), 0 inside 30deg of the chin (the V), so the wings
 *   rise beside the face, not over it; 30 facets, .07W thick, closed.
 * - Sleeves: a faceted balloon on each upper arm, ~4.6 arm radii across at its widest, from the
 *   shoulder to just above the elbow, so the shoulders stand past the torso; the forearm a team
 *   sleeve 1.7r to .45 of its length, then the flared yellow glove cuff (unchanged).
 * - Coat: the skirt stops at the knee (the hem anchored to the knee joint, not a share of the
 *   thigh mesh, which runs past it), wide open at the front from the belt so the grey legs show
 *   between the panels; panels flare to an A-line: back 1.15P -> 2.1P, fronts .1P->.55P inner,
 *   .62P->1.2P outer, tilted out; gold bands on every hem and the split. Grey legs, skin feet. */
export function arbiterPetalCollar(scene: Scene, body: ArticulatedBody): Mesh[] {
  const box = body.headMesh.getBoundingInfo().boundingBox;
  const W = box.extendSize.x * 2, H = box.extendSize.y * 2;
  const goldColor = new Color3(0.85, 0.55, 0.12);
  const gold = getMaterialFactory().get("unlit", goldColor, { emissive: goldColor });
  const N = 30, t = W * 0.07, deg = Math.PI / 180;
  const ring = (a: number, r: number, y: number): number[] => [Math.sin(a) * r, y, Math.cos(a) * r];
  const rimR = (a: number) => W * (0.8 + 0.8 * Math.exp(-(((Math.abs(a) - 95 * deg) / (40 * deg)) ** 2)));
  const rimH = (a: number) => H * Math.min(1, Math.max(0, (Math.abs(a) - 30 * deg) / (65 * deg)) ** 0.8) - H * 0.05;
  const r0 = W * 0.45, y0 = -H * 0.05;
  const tris: number[][][] = [];
  for (let k = 0; k < N; k++) {
    const a0 = -Math.PI + k * 2 * Math.PI / N, a1 = a0 + 2 * Math.PI / N;
    const ib0 = ring(a0, r0, y0), ib1 = ring(a1, r0, y0), ir0 = ring(a0, rimR(a0), rimH(a0)), ir1 = ring(a1, rimR(a1), rimH(a1));
    const ob0 = ring(a0, r0 + t, y0 - t * 0.3), ob1 = ring(a1, r0 + t, y0 - t * 0.3), or0 = ring(a0, rimR(a0) + t, rimH(a0) - t * 0.6), or1 = ring(a1, rimR(a1) + t, rimH(a1) - t * 0.6);
    tris.push([ib0, ir0, ir1], [ib0, ir1, ib1], [ob0, or0, or1], [ob0, or1, ob1], [ir0, or0, or1], [ir0, or1, ir1], [ib0, ob0, ob1], [ib0, ob1, ib1]);
  }
  // Outward: the outer layer faces away from the axis, the inner layer toward it, the rim up, the throat down.
  const outer = (c: number[]) => {
    const a = Math.atan2(c[0], c[2]), rc = Math.hypot(c[0], c[2]), ri = r0 + (rimR(a) - r0) * Math.max(0, Math.min(1, (c[1] - y0) / Math.max(1e-4, rimH(a) - y0)));
    if (c[1] > rimH(a) - t * 0.9) return [0, 1, 0];
    if (c[1] < y0 + t * 0.05 && rc < r0 + t * 1.1) return [0, -1, 0];
    return rc > ri + t * 0.5 ? [c[0], 0, c[2]] : [-c[0], 0, -c[2]];
  };
  const collar = solidFromTris(scene, "arbiterGoldCollar", tris, outer);
  collar.parent = body.neck; collar.material = gold; collar.convertToFlatShadedMesh();
  scene.getGlowLayerByName("glow")?.addExcludedMesh(collar);
  return [collar];
}

/** [S] 485, good.devout_gauntlet.blue.png: pale grey cloth wraps cover the
 * lower two thirds of each arm, from mid upper arm to the gold fist. Spec:
 * upper-arm shell .45->1 of the bone at 1.45 bone widths, forearm shell
 * 0->.94 at 1.7 widths, three proud wrap ridges a
 * shade darker. Six-sided, closed, out of the glow layer. */
export function devoutArmWraps(scene: Scene, body: ArticulatedBody): Mesh[] {
  const pale = new Color3(0.62, 0.64, 0.68), dark = new Color3(0.46, 0.48, 0.52);
  const wrap = getMaterialFactory().get("unlit", pale, { emissive: pale });
  const ridge = getMaterialFactory().get("unlit", dark, { emissive: dark });
  const out: Mesh[] = [];
  for (const [upperArm, lowerArm] of [[body.leftUpperArm, body.leftLowerArm], [body.rightUpperArm, body.rightLowerArm]] as const) {
    const upper = limbShell(scene, "devoutUpperArmWrap", upperArm, 0.45, 1, 1.45, wrap);
    const fore = limbShell(scene, "devoutForearmWrap", lowerArm, 0, 0.94, 1.7, wrap);
    fore.scaling.z = Math.max(fore.scaling.z, 0.9);
    out.push(upper, fore);
    const L = limbBox(lowerArm), r = Math.max(L.wide, L.deep) * 1.86;
    for (const at of [0.22, 0.5, 0.78]) {
      const band = MeshBuilder.CreateCylinder("devoutWrapRidge", { height: L.half * 0.12, diameter: r * 2 * (1 - at * 0.1), tessellation: 6 }, scene);
      band.parent = lowerArm.parent; band.position.y = L.mid + L.half - at * L.half * 2; band.scaling.z = fore.scaling.z;
      band.rotation.z = 0.12; band.material = ridge; band.convertToFlatShadedMesh(); out.push(band);
    }
  }
  for (const m of out) scene.getGlowLayerByName("glow")?.addExcludedMesh(m);
  return out;
}

/** [S] 483, good.devout_gauntlet.red.png: each beige trouser leg expands
 * continuously from the hip to a broad ankle hem, with a slim team border.
 * Two articulated six-sided frusta meet at the knee; ankle width is 2.2 thigh
 * widths, knee 1.55, waistband 1.06 pelvis widths, bare team toes below it.
 * The waist cloth folds upward in two points above its team securing band. */
export function devoutTrousers(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const beige = new Color3(0.8, 0.72, 0.56);
  const cloth = getMaterialFactory().get("unlit", beige, { emissive: beige });
  const trim = getMaterialFactory().get("cloth", team, { emissive: team.scale(0.12) });
  const out: Mesh[] = [];
  const put = (mesh: Mesh, parent: TransformNode, mat: Material, y: number): Mesh => {
    mesh.parent = parent; mesh.position.y = y; mesh.material = mat;
    mesh.convertToFlatShadedMesh();
    scene.getGlowLayerByName("glow")?.addExcludedMesh(mesh);
    out.push(mesh); return mesh;
  };
  for (const [hip, thigh, knee, shin] of [
    [body.leftHip, body.leftUpperLeg, body.leftKnee, body.leftLowerLeg],
    [body.rightHip, body.rightUpperLeg, body.rightKnee, body.rightLowerLeg],
  ] as const) {
    const T = limbBox(thigh), S = limbBox(shin);
    const width = T.wide * 2.15;
    const upperH = -knee.position.y;
    const lowerH = S.half * 1.7;
    const upper = put(MeshBuilder.CreateCylinder("devoutTrouserThigh", {
      height: upperH, diameterTop: width * 1.08, diameterBottom: width * 1.55, tessellation: 6,
    }, scene), hip, cloth, -upperH * 0.5);
    upper.scaling.z = 0.83;
    const lower = put(MeshBuilder.CreateCylinder("devoutTrouserFlare", {
      height: lowerH, diameterTop: width * 1.55, diameterBottom: width * 2.2, tessellation: 6,
    }, scene), knee, cloth, -lowerH * 0.5 + 0.015);
    lower.scaling.z = 0.83;
    const hemH = lowerH * 0.055;
    const hem = put(MeshBuilder.CreateCylinder("devoutTrouserTeamHem", {
      height: hemH, diameterTop: width * 2.18, diameterBottom: width * 2.22, tessellation: 6,
    }, scene), knee, trim, -lowerH + hemH * 0.5 + 0.015);
    hem.scaling.z = 0.83;
    for (const mesh of knee.getChildMeshes(true)) {
      if (/_[lr]FootM$/.test(mesh.name)) mesh.material = body.skinMaterial;
    }
  }
  const pelvis = body.hip.getChildMeshes(true).find(m => m.name.endsWith("_pelvis"));
  if (pelvis instanceof Mesh) {
    // The emissive beige pelvis bloomed white over the band unless kept out of the glow.
    pelvis.material = cloth; scene.getGlowLayerByName("glow")?.addExcludedMesh(pelvis);
    const P = limbBox(pelvis), W = P.wide * 2.12, D = P.deep * 2.18;
    const bandH = P.half * 0.38, bandY = P.mid + P.half * 0.65;
    put(MeshBuilder.CreateBox("devoutTrouserWaistband", { width: W * 1.04, height: bandH, depth: D * 1.06 }, scene), body.hip, trim, bandY);
    out.push(...devoutWaistCollar(scene, body, cloth, W, D, bandY + bandH * 0.5));
  }
  return out;
}

/** [S] 485, good.devout_gauntlet.blue.png/.red.png: above the team band the
 * trouser cloth rises as an open collar round the bare torso. Spec: front
 * plate's outer points reach .48 torso heights over the band (elbow height),
 * its edge falling in straight lines to a V that touches the band at centre;
 * the side plates stand as tall; the back rises .3. The collar's half-width is
 * 1.18 torso half-widths, so the torso shows inside it. Closed slabs. */
function devoutWaistCollar(scene: Scene, body: ArticulatedBody, cloth: Material, W: number, D: number, y0: number): Mesh[] {
  const tb = body.torsoMesh.getBoundingInfo().boundingBox, ts = body.torsoMesh.scaling;
  const Ht = tb.extendSize.y * 2 * ts.y, hw = Math.max(W * 0.54, tb.extendSize.x * ts.x * 1.18), hd = Math.max(D * 0.54, tb.extendSize.z * ts.z * 1.2);
  const h = Ht * 0.48, t = hd * 0.12;
  const front = ornament(scene, "devoutTrouserTopFront", [[-hw, 0], [-hw * 1.08, h], [-hw * 0.72, h * 0.62], [0, h * 0.04], [hw * 0.72, h * 0.62], [hw * 1.08, h], [hw, 0]], t, body.hip, cloth);
  front.position.set(0, y0, hd);
  const back = ornament(scene, "devoutTrouserTopBack", [[-hw, 0], [-hw * 1.06, h * 0.62], [0, h * 0.3], [hw * 1.06, h * 0.62], [hw, 0]], t, body.hip, cloth);
  back.position.set(0, y0, -hd);
  const out = [front, back];
  for (const side of [-1, 1]) {
    const flank = ornament(scene, "devoutTrouserTopSide", [[-hd, 0], [-hd, h * 0.62], [hd * 0.2, h * 0.75], [hd * 1.02, h], [hd, 0]], t, body.hip, cloth);
    flank.rotation.y = -Math.PI / 2; flank.position.set(side * hw * 1.04, y0, 0); out.push(flank);
  }
  return out;
}

/** [S] 485, good.radiant_glaive.blue.png: a square gold helmet boxes the
 * crown, temples and back of the head, leaving the face open. Spec (head
 * widths W, heights H): crown slab 1.16W x .3H; side and back plates reach
 * from the crown to .55H under the head's centre; a gold diamond 1H tall
 * stands on the brow with a team diamond (.8 of it) proud of its face; a team
 * strand trails out of the back plate, falling .9H behind the neck. */
export function radiantHelmet(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const goldC = new Color3(1, 0.7, 0.18), gold = getMaterialFactory().get("unlit", goldC, { emissive: goldC });
  const deep = team.scale(0.6), cloth = getMaterialFactory().get("unlit", deep, { emissive: deep });
  const out: Mesh[] = [];
  const slab = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, mat: Material): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.parent = head; m.position.set(c.x + x, c.y + y, c.z + z); m.material = mat; out.push(m); return m;
  };
  slab("radiantHelmCrown", W * 1.16, H * 0.3, D * 1.14, 0, H * 0.5, -D * 0.02, gold);
  for (const side of [-1, 1]) slab("radiantHelmSide", W * 0.1, H * 1.05, D * 1.05, side * W * 0.58, -H * 0.05, -D * 0.04, gold);
  slab("radiantHelmBack", W * 1.16, H * 1.05, D * 0.1, 0, -H * 0.05, -D * 0.58, gold);
  const plate = ornament(scene, "radiantHelmDiamond", [[0, H], [-W * 0.3, H * 0.45], [0, 0], [W * 0.3, H * 0.45]], D * 0.1, head, gold);
  plate.position.set(c.x, c.y + H * 0.3, c.z + D * 0.5); out.push(plate);
  const gem = ornament(scene, "radiantHelmTeamDiamond", [[0, H * 0.8], [-W * 0.2, H * 0.4], [0, H * 0.05], [W * 0.2, H * 0.4]], D * 0.1, head, cloth);
  gem.position.set(c.x, c.y + H * 0.38, c.z + D * 0.58); out.push(gem);
  const strand = MeshBuilder.CreateCylinder("radiantHelmStrand", { height: H * 1.1, diameterTop: W * 0.2, diameterBottom: W * 0.05, tessellation: 5 }, scene);
  strand.parent = head; strand.position.set(c.x, c.y + H * 0.05, c.z - D * 0.85); strand.rotation.x = -0.55; strand.material = cloth; out.push(strand);
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/** [S] 485, good.chronomancer.blue.png: a gold crown sits on the bare head
 * above the eyes. Spec (head widths W, heights H): an 8-sided band 1.12W
 * across, .2H tall; nine small spikes .22H round its rim; one tall front
 * diamond .95H; ear guards .45H tall standing proud of each temple. */
export function chronoCrown(scene: Scene, body: ArticulatedBody): Mesh[] {
  const head = body.headMesh, b = head.getBoundingInfo().boundingBox, c = b.center;
  const W = b.extendSize.x * 2, H = b.extendSize.y * 2, D = b.extendSize.z * 2;
  const goldC = new Color3(0.85, 0.55, 0.12), gold = getMaterialFactory().get("unlit", goldC, { emissive: goldC });
  const out: Mesh[] = [];
  const at = (m: Mesh, x: number, y: number, z: number): Mesh => { m.parent = head; m.position.set(c.x + x, c.y + y, c.z + z); m.material = gold; out.push(m); return m; };
  const bandY = H * 0.42;
  const band = at(MeshBuilder.CreateCylinder("chronoCrownBand", { height: H * 0.2, diameter: W * 1.12, tessellation: 8 }, scene), 0, bandY, 0);
  band.scaling.z = D / W;
  for (let k = 0; k < 9; k++) {
    const a = (k / 9) * Math.PI * 2;
    at(MeshBuilder.CreateCylinder("chronoCrownSpike", { height: H * 0.22, diameterBottom: W * 0.12, diameterTop: 0, tessellation: 4 }, scene),
      Math.sin(a) * W * 0.54, bandY + H * 0.2, Math.cos(a) * D * 0.54);
  }
  const front = ornament(scene, "chronoCrownPoint", [[0, H * 0.95], [-W * 0.17, H * 0.3], [0, 0], [W * 0.17, H * 0.3]], D * 0.1, head, gold);
  front.position.set(c.x, c.y + bandY, c.z + D * 0.58); out.push(front);
  for (const side of [-1, 1]) at(MeshBuilder.CreateBox("chronoEarGuard", { width: W * 0.1, height: H * 0.45, depth: D * 0.4 }, scene), side * W * 0.58, H * 0.08, -D * 0.05);
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/** [S] 486, good.righteous_paladin.red.png/.blue.png: pale grey plate front
 * and back over a team short-sleeve shirt. Spec (torso widths W, heights H,
 * depths D): each plate is a slab .58D deep, 1.16W across at the waist, with
 * sloped shoulder tops and a neck notch; the two leave a .04D slot over each
 * shoulder, bridged by a brown band. On the front a gold device like the
 * shield's: a hexagon ring round a hex boss with chevrons above and below.
 * Team sleeves cover the upper arm to .55 of its length. */
export function paladinCuirass(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, s = tm.scaling;
  const W = tb.extendSize.x * 2 * s.x, H = tb.extendSize.y * 2 * s.y, D = tb.extendSize.z * 2 * s.z;
  const cy = tm.position.y + tb.center.y * s.y, cz = tm.position.z + tb.center.z * s.z;
  const mf = getMaterialFactory();
  const greyC = new Color3(0.8, 0.82, 0.84), plate = mf.get("unlit", greyC, { emissive: greyC });
  const brownC = new Color3(0.43, 0.21, 0.14), strap = mf.get("unlit", brownC, { emissive: brownC });
  const goldC = new Color3(1, 0.7, 0.18), gold = mf.get("unlit", goldC, { emissive: goldC });
  const shirt = mf.get("cloth", team, { emissive: team.scale(0.12) });
  tm.material = shirt;
  for (const m of body.torso.getChildMeshes(true)) if (m.name.endsWith("_yoke")) m.material = shirt;
  const out: Mesh[] = [];
  const outline = [[-0.56, -0.5], [-0.58, 0.3], [-0.47, 0.5], [-0.17, 0.53], [0, 0.45], [0.17, 0.53], [0.47, 0.5], [0.58, 0.3], [0.56, -0.5]].map(([x, y]) => [x * W, y * H]);
  for (const side of [1, -1]) {
    const slab = ornament(scene, "paladinCuirassPlate", outline, D * 0.58, body.torso, plate);
    slab.position.set(0, cy, cz + side * D * 0.31); out.push(slab);
  }
  for (const side of [-1, 1]) {
    const band = MeshBuilder.CreateBox("paladinShoulderStrap", { width: W * 0.2, height: H * 0.08, depth: D * 0.3 }, scene);
    band.parent = body.torso; band.position.set(side * W * 0.32, cy + H * 0.52, cz); band.material = strap; out.push(band);
  }
  const face = cz + D * 0.6 + D * 0.02, t = D * 0.04;
  const piece = (name: string, pts: number[][], y: number, mat: Material, z = face): void => {
    const m = ornament(scene, name, pts.map(([x, py]) => [x * W, py * H]), t, body.torso, mat);
    m.position.set(0, cy + y * H, z); out.push(m);
  };
  const hex = (r: number) => Array.from({ length: 6 }, (_, k) => [Math.cos(k * Math.PI / 3 + Math.PI / 6) * r, Math.sin(k * Math.PI / 3 + Math.PI / 6) * r * 0.9]);
  piece("paladinCuirassRing", hex(0.2), 0.08, gold);
  piece("paladinCuirassRingInset", hex(0.13), 0.08, plate, face + t);
  piece("paladinCuirassBoss", hex(0.07), 0.08, gold, face + t * 2);
  for (const [y, dir] of [[0.3, 1], [-0.16, -1]] as const) {
    piece("paladinCuirassChevron", [[-0.32, 0], [0, dir * 0.13], [0.32, 0], [0.32, -dir * 0.07], [0, dir * 0.06], [-0.32, -dir * 0.07]], y, gold);
  }
  for (const upper of [body.leftUpperArm, body.rightUpperArm]) {
    const sleeve = limbShell(scene, "paladinShortSleeve", upper, 0, 0.55, 1.35, shirt);
    out.push(sleeve);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/** [S] 486, good.righteous_paladin.blue.png: puffed team trousers under three
 * pale plates down the front of each leg. Spec (limb half-widths w, depths d,
 * lengths L): thigh plate from mid-thigh, 1.7w across with a
 * gold top band; a knee cop 1.8w across with a gold V and top bar; the shin
 * plate, the longest, from the knee to .95 of the shin, 1.75w across. Team
 * shorts blouse out above the thigh plate (below), cloth behind the knee; brown
 * straps cross the back of the thigh once and the shin twice. */
export function paladinLegArmour(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const mf = getMaterialFactory();
  const greyC = new Color3(0.8, 0.82, 0.84), plate = mf.get("unlit", greyC, { emissive: greyC });
  const brownC = new Color3(0.43, 0.21, 0.14), strap = mf.get("unlit", brownC, { emissive: brownC });
  const goldC = new Color3(1, 0.7, 0.18), gold = mf.get("unlit", goldC, { emissive: goldC });
  const pants = mf.get("cloth", team, { emissive: team.scale(0.12) });
  const out: Mesh[] = [];
  const box = (name: string, parent: TransformNode, mat: Material, w: number, h: number, d: number, y: number, z: number, rz = 0): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.parent = parent; m.position.set(0, y, z); m.rotation.z = rz; m.material = mat; out.push(m); return m;
  };
  const pelvis = body.hip.getChildMeshes(true).find(m => m.name.endsWith("_pelvis"));
  // [S] 487 (CONFIRM 486 a.1, red.png "pants ... baggy and puffs out"): big
  // bloused team shorts from the waist to mid-thigh. Spec (pelvis widths P,
  // limb radii r): a pelvis puff 8-sided, 1.08P at the belt flaring to 1.3P;
  // each leg a bloused pair of 8-sided frusta from the hip, 3.2r -> 4.1r at
  // a quarter down the thigh, gathered back to 3r at its hem .48 down, just
  // over the thigh plate's gold top band.
  if (pelvis instanceof Mesh) {
    pelvis.material = pants;
    const P = limbBox(pelvis), PW = P.wide * 2;
    const puff = MeshBuilder.CreateCylinder("paladinShortsSeat", { height: P.half * 2, diameterTop: PW * 1.08, diameterBottom: PW * 1.3, tessellation: 8 }, scene);
    puff.parent = body.hip; puff.position.y = P.mid; puff.rotation.y = Math.PI / 8; puff.scaling.z = P.deep / P.wide * 1.2;
    puff.material = pants; puff.convertToFlatShadedMesh(); out.push(puff);
  }
  for (const [hip, thigh, knee, shin] of [
    [body.leftHip, body.leftUpperLeg, body.leftKnee, body.leftLowerLeg],
    [body.rightHip, body.rightUpperLeg, body.rightKnee, body.rightLowerLeg],
  ] as const) {
    thigh.material = pants; shin.material = pants;
    const T = limbBox(thigh), S = limbBox(shin);
    const r = Math.max(T.wide, T.deep), top = T.mid + T.half, bulge = top - T.half * 2 * 0.25, hem = top - T.half * 2 * 0.48;
    for (const [name, y0, y1, d0, d1] of [["paladinShortsUpper", bulge, top, 4.1, 3.2], ["paladinShortsHem", hem, bulge, 3, 4.1]] as const) {
      const leg = MeshBuilder.CreateCylinder(name, { height: y1 - y0, diameterBottom: r * d0, diameterTop: r * d1, tessellation: 8 }, scene);
      leg.parent = hip; leg.position.y = (y0 + y1) / 2; leg.rotation.y = Math.PI / 8; leg.scaling.z = T.deep / r * 1.1;
      leg.material = pants; leg.convertToFlatShadedMesh(); out.push(leg);
    }
    out.push(limbShell(scene, "paladinPuffedKnee", shin, 0, 0.2, 1.3, pants));
    // [S] 487 (CONFIRM 486 a.2, red.png knees): every plate is narrower than
    // its limb's spacing (thigh 1.7w, shin 1.75w), so the legs part; the thigh
    // plate stops .2 of the thigh over the knee, leaving team cloth; each knee
    // carries its own cop, a six-sided cap 1.8w across standing .9d proud,
    // with two gold bars meeting in a V across its face under a gold top rim.
    const tTop = T.mid + T.half - T.half * 2 * 0.5, tBot = T.mid - T.half * 0.6, tH = tTop - tBot;
    box("paladinThighPlate", hip, plate, T.wide * 1.7, tH, T.deep * 1.3, (tTop + tBot) / 2, T.deep * 0.5);
    box("paladinThighGold", hip, gold, T.wide * 1.8, tH * 0.12, T.deep * 1.36, tTop - tH * 0.06, T.deep * 0.5);
    box("paladinThighStrap", hip, strap, T.wide * 1.85, tH * 0.1, T.deep * 0.5, tBot + tH * 0.4, -T.deep * 0.75);
    const kTop = S.mid + S.half, kw = S.wide * 1.8, kz = S.deep * 0.75, kLen = S.deep * 0.9;
    const cop = MeshBuilder.CreateCylinder("paladinKneeCop", { height: kLen, diameterBottom: kw, diameterTop: kw * 0.5, tessellation: 6 }, scene);
    cop.parent = knee; cop.rotation.x = Math.PI / 2; cop.position.set(0, kTop - kw * 0.2, kz); cop.material = plate;
    cop.convertToFlatShadedMesh(); out.push(cop);
    const face = kz + kLen * 0.5;
    for (const side of [-1, 1]) box("paladinKneeGoldV", knee, gold, kw * 0.55, kw * 0.12, S.deep * 0.25, kTop - kw * 0.12, face - S.deep * 0.12, side * 0.6).position.x = side * kw * 0.2;
    box("paladinKneeGoldBar", knee, gold, kw * 1.02, kw * 0.1, kLen * 0.9, kTop + kw * 0.28, kz);
    const sTop = kTop - kw * 0.55, sBot = S.mid - S.half * 0.95, sH = sTop - sBot;
    box("paladinShinPlate", knee, plate, S.wide * 1.75, sH, S.deep * 1.4, (sTop + sBot) / 2, S.deep * 0.4);
    for (const at of [0.3, 0.7]) box("paladinShinStrap", knee, strap, S.wide * 1.85, sH * 0.07, S.deep * 0.5, sTop - sH * at, -S.deep * 0.65);
  }
  for (const m of out) scene.getGlowLayerByName("glow")?.addExcludedMesh(m);
  return out;
}

/** [S] 486, good.chronomancer.red.png: a huge vertical gold clock ring stands
 * behind the shoulders. Spec (torso widths W, heights H, depths D): ring
 * 3.2W across, a bold faceted band .17W thick (490: the 2.5W ring of a .07W
 * wire barely showed at lineup distance), centred .1H over the torso top and
 * .75D behind its centre; 8 outward spikes .3W, a tall top spike .85W; at 3
 * and 9 o'clock a .5W spike with two big white winglets beyond it. The node
 * "chronoBackRing" (torso child) holds a "chronoRingSpin" node with every
 * piece, so the transformation can move, tilt, spin and light it. */
export function chronoBackRing(scene: Scene, body: ArticulatedBody): Mesh[] {
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, s = tm.scaling;
  const W = tb.extendSize.x * 2 * s.x, H = tb.extendSize.y * 2 * s.y, D = tb.extendSize.z * 2 * s.z;
  const cy = tm.position.y + tb.center.y * s.y, cz = tm.position.z + tb.center.z * s.z;
  const goldC = new Color3(0.85, 0.55, 0.12), gold = getMaterialFactory().get("unlit", goldC, { emissive: goldC });
  const whiteC = new Color3(0.95, 0.95, 0.95), white = getMaterialFactory().get("unlit", whiteC, { emissive: whiteC });
  const root = new TransformNode("chronoBackRing", scene);
  root.parent = body.torso; root.position.set(0, cy + H * 0.6, cz - D * 0.75);
  const spin = new TransformNode("chronoRingSpin", scene); spin.parent = root;
  const R = W * 1.6, out: Mesh[] = [];
  const ring = MeshBuilder.CreateTorus("chronoRingBand", { diameter: R * 2, thickness: W * 0.17, tessellation: 24 }, scene);
  ring.parent = spin; ring.rotation.x = Math.PI / 2; ring.material = gold; out.push(ring);
  const spike = (a: number, len: number, base: number): void => {
    const m = MeshBuilder.CreateCylinder("chronoRingSpike", { height: len, diameterBottom: base, diameterTop: 0, tessellation: 4 }, scene);
    m.parent = spin; m.position.set(Math.sin(a) * (R + len * 0.45), Math.cos(a) * (R + len * 0.45), 0); m.rotation.z = -a; m.material = gold; out.push(m);
  };
  for (let k = 0; k < 12; k++) if (k % 3 !== 0) spike((k / 12) * Math.PI * 2, W * 0.3, W * 0.16);
  spike(0, W * 0.85, W * 0.32); spike(Math.PI, W * 0.3, W * 0.16);
  for (const side of [-1, 1]) {
    spike(side * Math.PI / 2, W * 0.5, W * 0.26);
    for (const tilt of [0.35, -0.35]) {
      const wing = ornament(scene, "chronoRingWinglet", [[0, 0], [side * W * 0.42, W * 0.17], [side * W * 0.6, W * 0.03], [side * W * 0.42, -W * 0.1]], W * 0.07, spin, white);
      wing.position.set(side * (R + W * 0.5), 0, 0); wing.rotation.z = tilt; out.push(wing);
    }
  }
  for (const m of out) { if (m.name !== "chronoRingWinglet") m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/** [S] 486, good.radiant_glaive.red.png: a team vest trimmed in gold over a
 * baggy white undershirt with uneven sleeves. Spec (torso widths W, heights
 * H, depths D): the vest is the torso in team cloth with a gold hem .1H; a
 * white shirt V .5W wide falls .55H from the neck, edged by gold lines .05W;
 * the right sleeve runs shoulder to wrist (upper 1.7, fore 1.9 limb
 * half-widths, flaring), the left stops half down the forearm; gold cuffs
 * close each sleeve. */
export function radiantVest(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, s = tm.scaling;
  const W = tb.extendSize.x * 2 * s.x, H = tb.extendSize.y * 2 * s.y, D = tb.extendSize.z * 2 * s.z;
  const cy = tm.position.y + tb.center.y * s.y, cz = tm.position.z + tb.center.z * s.z;
  const mf = getMaterialFactory();
  const vest = mf.get("cloth", team, { emissive: team.scale(0.12) });
  const whiteC = new Color3(0.86, 0.87, 0.88), shirt = mf.get("unlit", whiteC, { emissive: whiteC });
  const goldC = new Color3(1, 0.7, 0.18), gold = mf.get("unlit", goldC, { emissive: goldC });
  tm.material = vest;
  for (const m of body.torso.getChildMeshes(true)) if (m.name.endsWith("_yoke")) m.material = vest;
  const out: Mesh[] = [];
  const front = cz + D * 0.5 + D * 0.03, top = cy + H * 0.5;
  const v = ornament(scene, "radiantShirtV", [[-W * 0.25, 0], [0, -H * 0.55], [W * 0.25, 0]], D * 0.05, body.torso, shirt);
  v.position.set(0, top, front); out.push(v);
  for (const side of [-1, 1]) {
    const len = Math.hypot(W * 0.25, H * 0.55);
    const edge = MeshBuilder.CreateBox("radiantVestTrim", { width: W * 0.05, height: len, depth: D * 0.06 }, scene);
    edge.parent = body.torso; edge.position.set(side * W * 0.13, top - H * 0.275, front + D * 0.01);
    edge.rotation.z = -side * Math.atan2(W * 0.25, H * 0.55); edge.material = gold; out.push(edge);
  }
  const hem = MeshBuilder.CreateBox("radiantVestHem", { width: W * 1.06, height: H * 0.1, depth: D * 1.08 }, scene);
  hem.parent = body.torso; hem.position.set(0, cy - H * 0.45, cz); hem.material = gold; out.push(hem);
  const arms = [[body.rightUpperArm, body.rightLowerArm, 1], [body.leftUpperArm, body.leftLowerArm, 0.45]] as const;
  for (const [upper, lower, reach] of arms) {
    out.push(limbShell(scene, "radiantSleeveUpper", upper, 0, 1, 1.7, shirt));
    const fore = limbShell(scene, "radiantSleeveFore", lower, 0, reach * 0.9, 1.9, shirt);
    fore.scaling.x = 1.15; out.push(fore);
    const L = limbBox(lower), r = Math.max(L.wide, L.deep) * 2.05;
    const cuff = MeshBuilder.CreateCylinder("radiantSleeveCuff", { height: L.half * 0.22, diameter: r * 2, tessellation: 6 }, scene);
    cuff.parent = lower.parent; cuff.position.y = L.mid + L.half - reach * 0.9 * L.half * 2 + L.half * 0.1; cuff.material = gold; out.push(cuff);
  }
  for (const m of out) { if (!m.name.startsWith("radiantShirtV")) m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/** [S] 486/487, good.celestial_aegis.red.png: a cropped sleeveless team hoodie
 * over a bare waist, with a gold front toggle. The torso itself is bare skin
 * (the arms' own material, so it reads as the arms do); the hoodie is a cloth
 * shell over the upper torso only. Spec (torso widths W, heights H, depths D):
 * shell 1.05W x 1.07D from .1H over the torso's centre to its top, so the
 * skin shows from the skirt's waistband (about .2H under the centre) up to
 * the hem; a hem lip 1.1W, .07H tall; a hood rolled round the neck .62W
 * across, .2H tall, hanging .3H down the back; a gold strip .06W wide runs
 * .3H down the front from a gold toggle .12W across under the chin. */
export function aegisHoodie(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, s = tm.scaling;
  const W = tb.extendSize.x * 2 * s.x, H = tb.extendSize.y * 2 * s.y, D = tb.extendSize.z * 2 * s.z;
  const cy = tm.position.y + tb.center.y * s.y, cz = tm.position.z + tb.center.z * s.z;
  const mf = getMaterialFactory();
  // 487: a flat deeper team than the glowing skin (blue.png: the hoodie reads darker than the bare waist and arms).
  const deep = team.scale(0.4), cloth = mf.get("unlit", deep, { emissive: deep });
  const goldC = new Color3(1, 0.7, 0.18), gold = mf.get("unlit", goldC, { emissive: goldC });
  tm.material = body.leftUpperArm.material ?? body.skinMaterial;
  // The _yoke hull spans the whole trunk: it is bare skin too, so only the shell below reads as cloth.
  for (const m of body.torso.getChildMeshes(true)) if (m.name.endsWith("_yoke")) m.material = tm.material;
  const out: Mesh[] = [];
  const add = (m: Mesh, y: number, z: number, mat: Material): Mesh => { m.parent = body.torso; m.position.set(0, y, z); m.material = mat; out.push(m); return m; };
  const hem = cy + H * 0.1, top = cy + H * 0.5;
  // The shell must also cover the yoke hull, which outgrows the torso on a slim build (487).
  const yoke = body.torso.getChildMeshes(true).find(m => m.name.endsWith("_yoke"));
  const yb = yoke?.getBoundingInfo().boundingBox, ys = yoke?.scaling;
  const SW = Math.max(W * 1.05, yb && ys ? yb.extendSize.x * 2 * ys.x * 1.04 : 0), SD = Math.max(D * 1.07, yb && ys ? yb.extendSize.z * 2 * ys.z * 1.04 : 0);
  add(MeshBuilder.CreateBox("aegisHoodieShell", { width: SW, height: top - hem, depth: SD }, scene), (hem + top) / 2, cz, cloth);
  add(MeshBuilder.CreateBox("aegisHoodieLip", { width: SW * 1.05, height: H * 0.07, depth: SD * 1.05 }, scene), hem + H * 0.02, cz, cloth);
  const hood = add(MeshBuilder.CreateTorus("aegisRolledHood", { diameter: W * 0.62, thickness: H * 0.2, tessellation: 8 }, scene), cy + H * 0.52, cz - D * 0.05, cloth);
  hood.scaling.z = D / W * 1.3;
  add(MeshBuilder.CreateBox("aegisHoodBack", { width: W * 0.55, height: H * 0.3, depth: D * 0.2 }, scene), cy + H * 0.36, cz - D * 0.6, cloth).rotation.x = -0.2;
  add(MeshBuilder.CreateBox("aegisHoodieStrip", { width: W * 0.06, height: H * 0.3, depth: D * 0.06 }, scene), cy + H * 0.29, cz + SD * 0.53, gold);
  add(MeshBuilder.CreateCylinder("aegisHoodieToggle", { height: D * 0.08, diameter: W * 0.12, tessellation: 6 }, scene), cy + H * 0.42, cz + SD * 0.56, gold).rotation.x = Math.PI / 2;
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  // [S] 488 (CONFIRM 487 a.2, red.png: the hoodie ends over a slim bare waist):
  // the bare trunk under the shell narrows to .76 of the shell's width and .8
  // of its depth, so the hoodie's hem stands out over it as a step all round
  // and the skin band between hem and waistband reads as a waist, not more top.
  tm.scaling.x *= SW * 0.76 / W; tm.scaling.z *= SD * 0.8 / D;
  if (yoke && yb && ys) { ys.x *= SW * 0.76 / (yb.extendSize.x * 2 * ys.x); ys.z *= SD * 0.8 / (yb.extendSize.z * 2 * ys.z); }
  return out;
}

/** [S] 486, good.celestial_aegis.red.png: a flared team skirt to mid-thigh
 * over bare team legs and tall team boots. Spec (pelvis widths P, thigh
 * lengths T): 8-sided frustum 1.1P at the waist to 1.85P at the hem, .62T
 * below the hip joints; black waistband .12 of the skirt; gold hem .09; a
 * gold trapezoid .5P to .26P across the front, .8 of the skirt long, inside
 * a black border .06P; the thighs are bare skin, the shins boot cloth. */
export function aegisSkirt(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const pelvis = body.hip.getChildMeshes(true).find(m => m.name.endsWith("_pelvis"));
  if (!(pelvis instanceof Mesh)) return [];
  const mf = getMaterialFactory();
  const cloth = mf.get("cloth", team, { emissive: team.scale(0.12) });
  const blackC = new Color3(0.08, 0.08, 0.1), black = mf.get("unlit", blackC, { emissive: blackC });
  const goldC = new Color3(1, 0.7, 0.18), gold = mf.get("unlit", goldC, { emissive: goldC });
  const P = limbBox(pelvis), PW = P.wide * 2, PD = P.deep * 2;
  const thigh = limbBox(body.leftUpperLeg), top = P.mid + P.half, bottom = body.leftHip.position.y - thigh.half * 2 * 0.62;
  const h = top - bottom, out: Mesh[] = [];
  const ring = (name: string, y0: number, y1: number, d0: number, d1: number, mat: Material): Mesh => {
    const m = MeshBuilder.CreateCylinder(name, { height: y1 - y0, diameterTop: d1, diameterBottom: d0, tessellation: 8 }, scene);
    m.parent = body.hip; m.position.y = (y0 + y1) / 2; m.scaling.z = PD / PW * 1.15; m.rotation.y = Math.PI / 8; m.material = mat; out.push(m); return m;
  };
  const at = (y: number) => PW * (1.85 - 0.75 * (y - bottom) / h);
  ring("aegisSkirt", bottom, top, at(bottom), at(top), cloth);
  ring("aegisSkirtWaist", top - h * 0.12, top + h * 0.02, at(top - h * 0.12) * 1.03, at(top) * 1.03, black);
  ring("aegisSkirtHem", bottom - h * 0.01, bottom + h * 0.09, at(bottom) * 1.03, at(bottom + h * 0.09) * 1.03, gold);
  const panelTop = top - h * 0.12, len = h * 0.8, front = (y: number) => at(y) * 0.5 * PD / PW * 1.15 * 0.93;
  const trap = (w0: number, w1: number) => [[-w0 / 2, 0], [w0 / 2, 0], [w1 / 2, -len], [-w1 / 2, -len]];
  const border = ornament(scene, "aegisSkirtPanelBorder", trap(PW * 0.62, PW * 0.38).map(([x, y]) => [x, y + PW * 0.03]), PD * 0.04, body.hip, black);
  border.position.set(0, panelTop, front(panelTop - len / 2) + PD * 0.02); border.rotation.x = -Math.atan2(PW * 0.375 * PD / PW, h); out.push(border);
  const panel = ornament(scene, "aegisSkirtPanel", trap(PW * 0.5, PW * 0.26), PD * 0.04, body.hip, gold);
  panel.position.set(0, panelTop, border.position.z + PD * 0.03); panel.rotation.x = border.rotation.x; out.push(panel);
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  body.leftUpperLeg.material = body.skinMaterial; body.rightUpperLeg.material = body.skinMaterial;
  body.leftLowerLeg.material = cloth; body.rightLowerLeg.material = cloth;
  for (const knee of [body.leftKnee, body.rightKnee]) for (const m of knee.getChildMeshes(true)) if (/_[lr]FootM$/.test(m.name)) m.material = cloth;
  pelvis.material = cloth;
  return out;
}

/** Closed slab between two matching vertex grids [i][j] (outer and inner faces), every triangle
 * wound to face out: the faces along outer-inner, the four rims away from the grid. */
function gridSlab(scene: Scene, name: string, outer: number[][][], inner: number[][][]): Mesh {
  const tris: number[][][] = [], hints: number[][] = [];
  const sub = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const I = outer.length, J = outer[0].length;
  for (let i = 0; i + 1 < I; i++) for (let j = 0; j + 1 < J; j++) {
    const n = sub(outer[i][j], inner[i][j]);
    for (const [g, h] of [[outer, n], [inner, [-n[0], -n[1], -n[2]]]] as [number[][][], number[]][]) {
      tris.push([g[i][j], g[i + 1][j], g[i + 1][j + 1]], [g[i][j], g[i + 1][j + 1], g[i][j + 1]]); hints.push(h, h);
    }
  }
  const rim = (a: number[], b: number[], c: number[], d: number[], h: number[]) => { tris.push([a, b, c], [a, c, d]); hints.push(h, h); };
  for (let i = 0; i + 1 < I; i++) {
    rim(outer[i][0], outer[i + 1][0], inner[i + 1][0], inner[i][0], sub(outer[i][0], outer[i][1]));
    rim(outer[i][J - 1], outer[i + 1][J - 1], inner[i + 1][J - 1], inner[i][J - 1], sub(outer[i][J - 1], outer[i][J - 2]));
  }
  for (let j = 0; j + 1 < J; j++) {
    rim(outer[0][j], outer[0][j + 1], inner[0][j + 1], inner[0][j], sub(outer[0][j], outer[1][j]));
    rim(outer[I - 1][j], outer[I - 1][j + 1], inner[I - 1][j + 1], inner[I - 1][j], sub(outer[I - 1][j], outer[I - 2][j]));
  }
  let k = 0;
  return solidFromTris(scene, name, tris, () => hints[k++]);
}

/** [S] 490 good.sacred_elephant.a blocker 6 (good.sacred_elephant.jpg): a large team blanket draped
 * over the back from behind the throne to the rump, hanging down both flanks below the body's
 * middle, edged in gold with a row of angular gold teeth along each flank hem and a gold band at
 * each end, a team tassel with a gold cap hanging from each of its four lower corners.
 * Spec (torso frame of the 1.8-scaled rig; the hull an ellipsoid rx .85, ry .68 about y .12,
 * rz 1.16 about z -.05): the drape follows the hull .05 proud over the top quarter-arcs, then
 * hangs straight down .42 below the middle; z from -1.0 to .15; .035 thick; gold hem .1 tall,
 * teeth .2 wide x .17 tall every .25; end bands .07 wide; tassels .26 long. */
export function elephantBlanket(scene: Scene, torso: TransformNode, team: Color3): Mesh[] {
  const mf = getMaterialFactory();
  const cloth = mf.get("cloth", team, { emissive: team.scale(0.12) });
  const goldC = new Color3(0.95, 0.66, 0.16), gold = mf.get("cloth", goldC, { emissive: goldC.scale(0.22) });
  const rx = 0.85, ry = 0.68, yc = 0.12, rz = 1.16, zc = -0.05, a = 0.62, hang = 0.42, z0 = -1.0, z1 = 0.15, th = 0.035;
  const P = (s: number, z: number, off: number): number[] => {
    const k = Math.sqrt(Math.max(0.2, 1 - ((z - zc) / rz) ** 2)), sg = Math.sign(s) || 1, u = Math.abs(s);
    if (u <= a) { const f = (u / a) * Math.PI / 2; return [sg * Math.sin(f) * (rx * k + off), yc + Math.cos(f) * (ry * k + off), z]; }
    return [sg * (rx * k + off), yc - ((u - a) / (1 - a)) * hang, z];
  };
  const out: Mesh[] = [];
  const drape = (name: string, s0: number, s1: number, za: number, zb: number, off: number, mat: Material, ns = 24, nz = 8): void => {
    const grid = (o: number) => Array.from({ length: ns + 1 }, (_, i) => Array.from({ length: nz + 1 }, (_, j) => P(s0 + (s1 - s0) * i / ns, za + (zb - za) * j / nz, o)));
    const m = gridSlab(scene, name, grid(off + th), grid(off)); m.parent = torso; m.material = mat; out.push(m);
  };
  drape("elephantBlanket", -1, 1, z0, z1, 0.05, cloth, 32, 10);
  for (const sg of [-1, 1]) {
    // Flank hem: the lowest .1 of each hanging side, a shade proud of the cloth
    const sHem = 1 - 0.1 / hang * (1 - a);
    drape("elephantBlanketHem", sg * sHem, sg * 1, z0, z1, 0.05 + th, gold, 2, 10);
    // Angular gold teeth standing up from the hem on the flank's face
    for (let z = z0 + 0.14; z < z1 - 0.08; z += 0.25) {
      const base = P(sg, z, 0.05 + th * 2.2), yb = yc - hang + 0.1;
      const tooth = ornament(scene, "elephantBlanketTooth", [[-0.1, 0], [0.1, 0], [0, 0.17]], 0.02, torso, gold);
      tooth.position.set(base[0], yb, z); tooth.rotation.y = sg * Math.PI / 2; out.push(tooth);
    }
  }
  // Gold bands across both ends, over the top and down the sides
  drape("elephantBlanketBand", -1, 1, z0, z0 + 0.07, 0.05 + th, gold, 32, 1);
  drape("elephantBlanketBand", -1, 1, z1 - 0.07, z1, 0.05 + th, gold, 32, 1);
  for (const sg of [-1, 1]) for (const z of [z0 + 0.04, z1 - 0.04]) {
    const corner = P(sg, z, 0.05 + th);
    const cap = MeshBuilder.CreateCylinder("elephantTasselCap", { height: 0.07, diameterTop: 0.05, diameterBottom: 0.09, tessellation: 6 }, scene);
    cap.parent = torso; cap.position.set(corner[0], corner[1] - 0.04, z); cap.material = gold; out.push(cap);
    const tassel = MeshBuilder.CreateCylinder("elephantTassel", { height: 0.26, diameterTop: 0.07, diameterBottom: 0.15, tessellation: 6 }, scene);
    tassel.parent = torso; tassel.position.set(corner[0], corner[1] - 0.2, z); tassel.material = cloth; out.push(tassel);
  }
  for (const m of out) if (m.name !== "elephantBlanketTooth") m.convertToFlatShadedMesh();
  return out;
}

/** [S] 486, good.sacred_elephant.red.png: the seated rider in white. Spec
 * (head widths W, heights H, depths D; torso likewise): white hair falls
 * .7H at the sides and back; a team cap 1.1W tied with a band, a gold oval
 * crystal .3W x .4H on its front; a white tank top over the torso with gold
 * bands .08H at its top and hem and team arms left bare; baggy white shorts
 * flare 1.6 thigh half-widths over the upper .7 of each thigh. */
export function elephantRiderDress(scene: Scene, rider: ArticulatedBody, team: Color3): Mesh[] {
  const mf = getMaterialFactory();
  const whiteC = new Color3(0.88, 0.88, 0.9), white = mf.get("unlit", whiteC, { emissive: whiteC });
  const hairC = new Color3(0.95, 0.95, 0.95), hair = mf.get("unlit", hairC, { emissive: hairC });
  const goldC = new Color3(1, 0.7, 0.18), gold = mf.get("unlit", goldC, { emissive: goldC });
  const cloth = mf.get("cloth", team, { emissive: team.scale(0.12) });
  const out: Mesh[] = [];
  const head = rider.headMesh, hb = head.getBoundingInfo().boundingBox, c = hb.center;
  const W = hb.extendSize.x * 2, H = hb.extendSize.y * 2, D = hb.extendSize.z * 2;
  const onHead = (m: Mesh, x: number, y: number, z: number, mat: Material): Mesh => { m.parent = head; m.position.set(c.x + x, c.y + y, c.z + z); m.material = mat; out.push(m); return m; };
  for (const side of [-1, 1]) onHead(MeshBuilder.CreateBox("elephantRiderHairSide", { width: W * 0.14, height: H * 0.75, depth: D * 0.8 }, scene), side * W * 0.55, -H * 0.12, -D * 0.08, hair);
  onHead(MeshBuilder.CreateBox("elephantRiderHairBack", { width: W * 1.08, height: H * 0.8, depth: D * 0.14 }, scene), 0, -H * 0.12, -D * 0.55, hair);
  const cap = onHead(MeshBuilder.CreateCylinder("elephantRiderCap", { height: H * 0.42, diameterBottom: W * 1.12, diameterTop: W * 0.9, tessellation: 8 }, scene), 0, H * 0.42, -D * 0.02, cloth);
  cap.scaling.z = D / W;
  const tie = onHead(MeshBuilder.CreateBox("elephantRiderCapTie", { width: W * 0.22, height: H * 0.3, depth: D * 0.1 }, scene), 0, H * 0.2, -D * 0.62, cloth);
  tie.rotation.x = 0.4;
  onHead(MeshBuilder.CreateSphere("elephantRiderCrystal", { diameterX: W * 0.3, diameterY: H * 0.4, diameterZ: D * 0.14, segments: 4 }, scene), 0, H * 0.42, D * 0.56, gold);
  const tm = rider.torsoMesh, tb = tm.getBoundingInfo().boundingBox, s = tm.scaling;
  const TW = tb.extendSize.x * 2 * s.x, TH = tb.extendSize.y * 2 * s.y, TD = tb.extendSize.z * 2 * s.z;
  const cy = tm.position.y + tb.center.y * s.y, cz = tm.position.z + tb.center.z * s.z;
  tm.material = white;
  for (const m of rider.torso.getChildMeshes(true)) if (m.name.endsWith("_yoke")) m.material = white;
  for (const y of [0.42, -0.45]) {
    const band = MeshBuilder.CreateBox("elephantRiderTopBand", { width: TW * 1.06, height: TH * 0.08, depth: TD * 1.08 }, scene);
    band.parent = rider.torso; band.position.set(0, cy + y * TH, cz); band.material = gold; out.push(band);
  }
  const pelvis = rider.hip.getChildMeshes(true).find(m => m.name.endsWith("_pelvis"));
  if (pelvis) pelvis.material = white;
  for (const thigh of [rider.leftUpperLeg, rider.rightUpperLeg]) out.push(limbShell(scene, "elephantRiderShorts", thigh, 0, 0.7, 1.6, white));
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/** [S] 487, good.radiant_glaive.red.png: team trousers with gold inlays over
 * short white shoes. Spec (pelvis widths P, limb half-widths w, lengths L):
 * the pelvis, thighs and shins in team cloth; a gold half-diamond 1.1P across
 * at the belt falls point-down to .55 of the thigh between the legs; a gold
 * triangle .6L tall on the outside of each upper thigh; a gold band 2.4w at
 * each knee with a small gold fin on its front, another at .78 of the shin;
 * the feet white, closed by a gold band 2.5w at the ankle. */
export function radiantTrousers(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const mf = getMaterialFactory();
  const cloth = mf.get("cloth", team, { emissive: team.scale(0.12) });
  const goldC = new Color3(1, 0.7, 0.18), gold = mf.get("unlit", goldC, { emissive: goldC });
  const whiteC = new Color3(0.9, 0.9, 0.92), white = mf.get("unlit", whiteC, { emissive: whiteC });
  const out: Mesh[] = [];
  const pelvis = body.hip.getChildMeshes(true).find(m => m.name.endsWith("_pelvis"));
  const T0 = limbBox(body.leftUpperLeg), thighLen = T0.half * 2;
  if (pelvis instanceof Mesh) {
    pelvis.material = cloth;
    const P = limbBox(pelvis), PW = P.wide * 2, top = P.mid + P.half * 0.7;
    const drop = top - (body.leftHip.position.y - thighLen * 0.55);
    const diamond = ornament(scene, "radiantTrouserDiamond", [[-PW * 0.55, 0], [PW * 0.55, 0], [0, -drop]], P.deep * 0.12, body.hip, gold);
    diamond.position.set(0, top, P.deep * 1.08); out.push(diamond);
  }
  for (const [hip, thigh, knee, shin, side] of [
    [body.leftHip, body.leftUpperLeg, body.leftKnee, body.leftLowerLeg, -1],
    [body.rightHip, body.rightUpperLeg, body.rightKnee, body.rightLowerLeg, 1],
  ] as const) {
    thigh.material = cloth; shin.material = cloth;
    const T = limbBox(thigh), S = limbBox(shin), tw = Math.max(T.wide, T.deep), sw = Math.max(S.wide, S.deep);
    const flank = ornament(scene, "radiantTrouserFlank", [[0, 0], [0, -T.half * 1.2], [side * tw * 0.9, 0]], T.deep * 0.5, hip, gold);
    flank.rotation.y = side * Math.PI / 2; flank.position.set(side * T.wide * 1.02, T.mid + T.half * 0.95, 0); out.push(flank);
    const ring = (name: string, y: number, h: number, d: number, mat: Material): Mesh => {
      const m = MeshBuilder.CreateCylinder(name, { height: h, diameter: d, tessellation: 6 }, scene);
      m.parent = knee; m.position.y = y; m.scaling.z = S.deep / sw * 1.1; m.material = mat; out.push(m); return m;
    };
    const kTop = S.mid + S.half;
    ring("radiantKneeBand", kTop - S.half * 0.06, S.half * 0.14, sw * 2.4, gold);
    const fin = ornament(scene, "radiantKneeFin", [[-sw * 0.5, 0], [sw * 0.5, 0], [0, -S.half * 0.3]], S.deep * 0.2, knee, gold);
    fin.position.set(0, kTop - S.half * 0.1, S.deep * 1.15); out.push(fin);
    ring("radiantShinBand", S.mid + S.half - S.half * 2 * 0.78, S.half * 0.12, sw * 2.3, gold);
    ring("radiantAnkleBand", S.mid - S.half * 0.97, S.half * 0.1, sw * 2.5, gold);
    for (const m of knee.getChildMeshes(true)) if (/_[lr]FootM$/.test(m.name)) { m.material = white; scene.getGlowLayerByName("glow")?.addExcludedMesh(m as Mesh); }
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/** [S] 487, good.radiant_glaive card Appearance ("a cape") and .jpg: a team
 * cape with a gold bottom line hangs from the shoulders behind the vest.
 * Spec (torso widths W, heights H, depths D): a closed trapezoid slab 1.1W
 * across at the shoulders flaring to 1.4W, 1.9H long (to mid-thigh), .06D
 * thick, hung .07D behind the back and tilted .1 rad out at the hem, so
 * it hangs behind the body, not round the hips like a skirt; a gold hem band .1H
 * tall across its foot; a gold clasp .14W on the front of each shoulder. */
export function radiantCape(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, s = tm.scaling;
  const W = tb.extendSize.x * 2 * s.x, H = tb.extendSize.y * 2 * s.y, D = tb.extendSize.z * 2 * s.z;
  const cy = tm.position.y + tb.center.y * s.y, cz = tm.position.z + tb.center.z * s.z;
  const mf = getMaterialFactory();
  const deep = team.scale(0.75), cloth = mf.get("cloth", deep, { emissive: deep.scale(0.15) });
  const goldC = new Color3(1, 0.7, 0.18), gold = mf.get("unlit", goldC, { emissive: goldC });
  const len = H * 1.9, top = cy + H * 0.48, back = cz - D * 0.5 - D * 0.07, t = D * 0.06;
  const at = (y: number) => W * (1.1 + 0.3 * y / len);
  const out: Mesh[] = [];
  const cape = ornament(scene, "radiantCape", [[-at(0) / 2, 0], [at(0) / 2, 0], [at(len) / 2, -len], [-at(len) / 2, -len]], t, body.torso, cloth);
  cape.position.set(0, top, back); cape.rotation.x = 0.1; out.push(cape);
  const h0 = len - H * 0.1;
  const hem = ornament(scene, "radiantCapeHem", [[-at(h0) / 2, -h0], [at(h0) / 2, -h0], [at(len) / 2 * 1.01, -len], [-at(len) / 2 * 1.01, -len]], t * 1.6, body.torso, gold);
  hem.position.set(0, top, back); hem.rotation.x = 0.1; out.push(hem);
  for (const side of [-1, 1]) {
    const clasp = MeshBuilder.CreateCylinder("radiantCapeClasp", { height: D * 0.08, diameter: W * 0.14, tessellation: 6 }, scene);
    clasp.parent = body.torso; clasp.position.set(side * W * 0.36, cy + H * 0.42, cz + D * 0.54); clasp.rotation.x = Math.PI / 2; clasp.material = gold;
    clasp.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(clasp); out.push(clasp);
  }
  return out;
}

/** [S] 487, good.divine_arbiter.blue.png/.red.png: a team robe with big puffed
 * sleeves and yellow gloves. Spec (limb radii r): the torso and yoke in team
 * cloth (no vest); each upper arm a team sleeve 1.75r; at the elbow a puff of
 * two 8-sided frusta swelling to 2.5r over the lower .3 of the upper arm and
 * the top .25 of the forearm; the rest of the forearm a team sleeve 1.5r to
 * .45 of its length, then a flared yellow glove cuff 1.7r -> 2.2r to the
 * wrist; the hands yellow. */
export function arbiterRobe(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const mf = getMaterialFactory();
  const robe = mf.get("cloth", team, { emissive: team.scale(0.12) });
  const yellowC = new Color3(1, 0.62, 0.12), glove = mf.get("unlit", yellowC, { emissive: yellowC });
  body.torsoMesh.material = robe;
  for (const m of body.torso.getChildMeshes(true)) if (m.name.endsWith("_yoke")) m.material = robe;
  const out: Mesh[] = [];
  for (const [upperArm, lowerArm, hand] of [[body.leftUpperArm, body.leftLowerArm, body.leftHand], [body.rightUpperArm, body.rightLowerArm, body.rightHand]] as const) {
    // [R] 490: the balloon puff sits on the upper arm (shoulder to just above the elbow), where the
    // idle camera sees it past the book, instead of elbow puffs hidden behind the book.
    const U = limbBox(upperArm), L = limbBox(lowerArm), r = Math.max(U.wide, U.deep, L.wide, L.deep);
    const uTop = U.mid + U.half + U.half * 2 * 0.08, uBot = U.mid + U.half - U.half * 2 * 0.88;
    const balloon = MeshBuilder.CreateSphere("arbiterSleeveBalloon", { diameterX: r * 5.2, diameterZ: r * 4.6, diameterY: uTop - uBot, segments: 3 }, scene);
    balloon.parent = upperArm.parent; balloon.position.y = (uTop + uBot) / 2; balloon.material = robe; out.push(balloon);
    const L0 = L.mid + L.half;
    out.push(limbShell(scene, "arbiterSleeveFore", lowerArm, 0, 0.45, 1.7, robe));
    const gTop = L0 - L.half * 2 * 0.45, gBot = L.mid - L.half;
    const cuff = MeshBuilder.CreateCylinder("arbiterGloveCuff", { height: gTop - gBot, diameterTop: r * 3.4, diameterBottom: r * 4.4, tessellation: 6 }, scene);
    cuff.parent = lowerArm.parent; cuff.position.y = (gTop + gBot) / 2; cuff.material = glove; out.push(cuff);
    for (const m of hand.getChildMeshes(true)) if (/_[lr]HandM$/.test(m.name)) { m.material = glove; scene.getGlowLayerByName("glow")?.addExcludedMesh(m as Mesh); }
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/** [S] 487, good.divine_arbiter.red.png/.blue.png: the robe's skirt is short,
 * split up the front over tight grey trousers, flaring out with gold hems;
 * the feet are bare. Spec (pelvis widths P, depths Q, thigh lengths T): from
 * the belt to .85T under the hips; a back panel 1.15P -> 1.9P tilted .2 rad
 * back; two front panels from .12P -> .35P (the split) out to .6P -> 1P,
 * tilted .2 rad forward; side panels 1.1Q -> 1.7Q leaning out .25 rad; gold
 * bands .07 of the skirt along every hem and up both edges of the split.
 * Thighs and shins pale grey (flat), feet the arms' bare skin. */
export function arbiterCoatSkirt(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const pelvis = body.hip.getChildMeshes(true).find(m => m.name.endsWith("_pelvis"));
  if (!(pelvis instanceof Mesh)) return [];
  const mf = getMaterialFactory();
  const robe = mf.get("cloth", team, { emissive: team.scale(0.12) });
  const goldC = new Color3(1, 0.7, 0.18), gold = mf.get("unlit", goldC, { emissive: goldC });
  const greyC = new Color3(0.62, 0.64, 0.68), grey = mf.get("unlit", greyC, { emissive: greyC });
  const P = limbBox(pelvis), PW = P.wide * 2, PD = P.deep * 2;
  // [R] 490: the hem sits just above the knee joint (hip frame), not at a share of the thigh mesh.
  const kneeY = body.leftHip.position.y + body.leftKnee.position.y * body.leftHip.scaling.y;
  const top = P.mid + P.half, len = top - (kneeY + PD * 0.25), band = len * 0.07, t = PD * 0.06;
  pelvis.material = robe;
  const out: Mesh[] = [];
  const panel = (name: string, pts: number[][], mat: Material, x: number, z: number, rx: number, ry = 0, rz = 0, depth = t): Mesh => {
    const m = ornament(scene, name, pts, depth, body.hip, mat);
    m.position.set(x, top, z); m.rotation.set(rx, ry, rz); out.push(m); return m;
  };
  const trap = (a0: number, a1: number, b0: number, b1: number, y0 = 0, y1 = -len) => [[a0, y0], [b0, y0], [b1, y1], [a1, y1]];
  const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
  const k = 1 - band / len;
  const back = -PD * 0.56;
  panel("arbiterSkirtBack", trap(-PW * 0.575, -PW * 1.05, PW * 0.575, PW * 1.05), robe, 0, back, 0.28);
  panel("arbiterSkirtBackHem", trap(-PW * lerp(0.575, 1.05, k), -PW * 1.06, PW * lerp(0.575, 1.05, k), PW * 1.06, -len * k), gold, 0, back - t, 0.28, 0, 0, t * 1.2);
  const front = PD * 0.56;
  for (const side of [-1, 1]) {
    const inner = (y: number) => side * PW * lerp(0.1, 0.55, y), outer = (y: number) => side * PW * lerp(0.62, 1.2, y);
    panel("arbiterSkirtFront", trap(inner(0), inner(1), outer(0), outer(1)), robe, 0, front, -0.24);
    panel("arbiterSkirtFrontHem", trap(inner(k), inner(1), outer(k), outer(1) * 1.01, -len * k), gold, 0, front + t, -0.24, 0, 0, t * 1.2);
    const w = PW * 0.07;
    panel("arbiterSkirtSplitHem", trap(inner(0), inner(1), inner(0) + side * w, inner(1) + side * w), gold, 0, front + t, -0.24, 0, 0, t * 1.2);
    panel("arbiterSkirtSide", trap(-PD * 0.55, -PD * 0.95, PD * 0.55, PD * 0.95), robe, side * PW * 0.58, 0, 0, side * Math.PI / 2, side * 0.32);
  }
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) thigh.material = grey;
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) shin.material = grey;
  const skin = body.leftUpperArm.material ?? body.skinMaterial;
  for (const knee of [body.leftKnee, body.rightKnee]) for (const m of knee.getChildMeshes(true)) if (/_[lr]FootM$/.test(m.name)) m.material = skin;
  for (const m of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) scene.getGlowLayerByName("glow")?.addExcludedMesh(m);
  return out;
}

/** [S] 488, good.chronomancer.blue.png/.red.png: a white sleeveless crop top
 * with gold trim over a bare team midriff. Spec (torso widths W, heights H,
 * depths D): the trunk and its yoke hull are bare team skin (the head's); a
 * flat white shell from .15H under the torso's centre to its top, 1.06W (or
 * the yoke's width) x 1.08D; a gold hem band .07H tall standing 4% proud; a
 * gold neck ring .5W across at the top; gold armhole bands .08W x .26H down
 * each shoulder edge. All flat (unlit) and out of the glow. */
export function chronoCropTop(scene: Scene, body: ArticulatedBody): Mesh[] {
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, s = tm.scaling;
  const W = tb.extendSize.x * 2 * s.x, H = tb.extendSize.y * 2 * s.y, D = tb.extendSize.z * 2 * s.z;
  const cy = tm.position.y + tb.center.y * s.y, cz = tm.position.z + tb.center.z * s.z;
  const mf = getMaterialFactory();
  const whiteC = new Color3(1, 1, 1), white = mf.get("unlit", whiteC, { emissive: whiteC });
  const goldC = new Color3(1, 0.7, 0.18), gold = mf.get("unlit", goldC, { emissive: goldC });
  const skin = body.headMesh.material ?? body.skinMaterial;
  tm.material = skin;
  const yoke = body.torso.getChildMeshes(true).find(m => m.name.endsWith("_yoke"));
  if (yoke) yoke.material = skin;
  const yb = yoke?.getBoundingInfo().boundingBox, ys = yoke?.scaling;
  const SW = Math.max(W * 1.06, yb && ys ? yb.extendSize.x * 2 * ys.x * 1.04 : 0), SD = Math.max(D * 1.08, yb && ys ? yb.extendSize.z * 2 * ys.z * 1.04 : 0);
  const out: Mesh[] = [];
  const add = (m: Mesh, y: number, z: number, mat: Material): Mesh => { m.parent = body.torso; m.position.set(0, y, z); m.material = mat; out.push(m); return m; };
  const hem = cy - H * 0.15, top = cy + H * 0.5;
  add(MeshBuilder.CreateBox("chronoCropTop", { width: SW, height: top - hem, depth: SD }, scene), (hem + top) / 2, cz, white);
  add(MeshBuilder.CreateBox("chronoCropHem", { width: SW * 1.04, height: H * 0.07, depth: SD * 1.04 }, scene), hem + H * 0.03, cz, gold);
  const neck = add(MeshBuilder.CreateTorus("chronoCropNeck", { diameter: W * 0.5, thickness: H * 0.07, tessellation: 10 }, scene), top, cz, gold);
  neck.scaling.z = D / W * 1.2;
  for (const side of [-1, 1]) add(MeshBuilder.CreateBox("chronoCropArmhole", { width: W * 0.08, height: H * 0.26, depth: SD * 1.02 }, scene), top - H * 0.15, cz, gold).position.x = side * SW * 0.49;
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  scene.getGlowLayerByName("glow")?.addExcludedMesh(tm);
  return out;
}

/** [S] 488, good.chronomancer.red.png: baggy white knee breeches, a broad
 * white belt with a gold buckle and white ring, tall white boots under a gold
 * band. Spec (limb radii r, pelvis widths P, depths Q): each thigh in a white
 * shell 1.5r from the hip to the knee, gathered by a 1.55r puff over the top
 * .2 of the shin; a gold band 1.45r from .24 to .34 down the shin; the boot a
 * white 1.22r shell to the ankle, feet white; the belt an 8-sided pale-grey
 * band 1.15P x 1.15Q, .45 of the pelvis half-height tall at its top; a gold
 * buckle .3P across with a white ring .16P on its face. All flat. */
export function chronoBreeches(scene: Scene, body: ArticulatedBody): Mesh[] {
  const mf = getMaterialFactory();
  const whiteC = new Color3(1, 1, 1), white = mf.get("unlit", whiteC, { emissive: whiteC });
  const goldC = new Color3(1, 0.7, 0.18), gold = mf.get("unlit", goldC, { emissive: goldC });
  const beltC = new Color3(0.78, 0.8, 0.84), belt = mf.get("unlit", beltC, { emissive: beltC });
  const out: Mesh[] = [];
  for (const [thigh, shin, knee] of [[body.leftUpperLeg, body.leftLowerLeg, body.leftKnee], [body.rightUpperLeg, body.rightLowerLeg, body.rightKnee]] as const) {
    thigh.material = white; shin.material = white;
    out.push(limbShell(scene, "chronoBreechThigh", thigh, 0, 1, 1.5, white));
    out.push(limbShell(scene, "chronoBreechKnee", shin, 0, 0.2, 1.55, white));
    out.push(limbShell(scene, "chronoBootBand", shin, 0.24, 0.34, 1.45, gold));
    out.push(limbShell(scene, "chronoBootTop", shin, 0.34, 1, 1.22, white));
    for (const m of knee.getChildMeshes(true)) if (/_[lr]FootM$/.test(m.name)) { m.material = white; scene.getGlowLayerByName("glow")?.addExcludedMesh(m as Mesh); }
  }
  const pelvis = body.hip.getChildMeshes(true).find(m => m.name.endsWith("_pelvis"));
  if (pelvis instanceof Mesh) {
    pelvis.material = white;
    const P = limbBox(pelvis), PW = P.wide * 2, h = P.half * 0.9, y = P.mid + P.half - h / 2;
    const band = MeshBuilder.CreateCylinder("chronoBelt", { height: h, diameter: PW * 1.15, tessellation: 8 }, scene);
    band.parent = body.hip; band.position.y = y; band.rotation.y = Math.PI / 8; band.scaling.z = P.deep / P.wide * 1.15; band.material = belt; out.push(band);
    const front = P.deep * 1.15 * 1.02;
    const buckle = MeshBuilder.CreateBox("chronoBeltBuckle", { width: PW * 0.3, height: h * 1.15, depth: P.deep * 0.14 }, scene);
    buckle.parent = body.hip; buckle.position.set(0, y, front); buckle.material = gold; out.push(buckle);
    const ring = MeshBuilder.CreateTorus("chronoBeltRing", { diameter: PW * 0.16, thickness: PW * 0.04, tessellation: 10 }, scene);
    ring.parent = body.hip; ring.position.set(0, y, front + P.deep * 0.08); ring.rotation.x = Math.PI / 2; ring.material = white; out.push(ring);
    scene.getGlowLayerByName("glow")?.addExcludedMesh(pelvis);
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  for (const m of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) scene.getGlowLayerByName("glow")?.addExcludedMesh(m);
  return out;
}

/** [S] 488, good.chronomancer.blue.png: gold bands stacked down each bare
 * arm, the upper ones carrying small white winglets. Spec (limb radii r,
 * upper-arm length U): upper arm bands 1.4r at .18-.3 and .5-.62 down, a
 * forearm band 1.35r at .1-.22; from the outer face of each upper band a
 * closed white feather wing .5U long, .2U tall at its tip, swept up and back
 * .5 rad. All flat. */
export function chronoArmBands(scene: Scene, body: ArticulatedBody): Mesh[] {
  const mf = getMaterialFactory();
  const goldC = new Color3(1, 0.7, 0.18), gold = mf.get("unlit", goldC, { emissive: goldC });
  const whiteC = new Color3(1, 1, 1), white = mf.get("unlit", whiteC, { emissive: whiteC });
  const out: Mesh[] = [];
  for (const [side, upper, lower] of [[-1, body.leftUpperArm, body.leftLowerArm], [1, body.rightUpperArm, body.rightLowerArm]] as const) {
    const U = limbBox(upper), r = Math.max(U.wide, U.deep), len = U.half * 2;
    for (const [a, b] of [[0.18, 0.3], [0.5, 0.62]]) {
      out.push(limbShell(scene, "chronoArmBand", upper, a, b, 1.4, gold));
      const y = U.mid + U.half - (a + b) / 2 * len;
      const wing = ornament(scene, "chronoArmWinglet", [[0, -len * 0.04], [len * 0.22, len * 0.02], [len * 0.5, len * 0.2], [len * 0.3, len * 0.08], [len * 0.36, len * 0.16], [0, len * 0.05]].map(([x, yy]) => [side * x, yy]), r * 0.25, upper.parent as TransformNode, white);
      wing.position.set(side * r * 1.3, y, -r * 0.4); wing.rotation.set(0, side * 0.5, side * 0.25); out.push(wing);
    }
    out.push(limbShell(scene, "chronoForearmBand", lower, 0.1, 0.22, 1.35, gold));
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}
