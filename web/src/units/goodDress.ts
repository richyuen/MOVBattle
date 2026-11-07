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

/** Arbiter's tall rounded team mitre, a broad gold forehead panel and inset
 * diamond; the crown rises about one head height above the brow. */
export function arbiterMitre(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const b=body.headMesh.getBoundingInfo().boundingBox,W=b.extendSize.x*2,H=b.extendSize.y*2,D=b.extendSize.z*2;
  const cloth=getMaterialFactory().get("cloth",team,{emissive:team.scale(.12)});
  const c=new Color3(1,.7,.18),gold=getMaterialFactory().get("unlit",c,{emissive:c});
  const hat=MeshBuilder.CreateCylinder("arbiterMitre",{height:H*1.05,diameterTop:W*.76,diameterBottom:W*1.15,tessellation:8},scene);
  hat.parent=body.headMesh;hat.position.copyFrom(b.center);hat.position.y+=H*.92;hat.scaling.z=D/W;hat.material=cloth;
  const cap=MeshBuilder.CreateSphere("arbiterMitreCrown",{diameterX:W*.77,diameterY:H*.36,diameterZ:D*.77,segments:6},scene);
  cap.parent=body.headMesh;cap.position.copyFrom(hat.position);cap.position.y+=H*.52;cap.material=cloth;
  const panel=ornament(scene,"arbiterMitreForehead",[[-W*.39,0],[-W*.36,H*.55],[-W*.24,H*.77],[0,H*.88],[W*.24,H*.77],[W*.36,H*.55],[W*.39,0]],D*.12,body.headMesh,gold);
  panel.position.set(b.center.x,b.center.y+H*.31,b.center.z+D*.6);
  const jewel=ornament(scene,"arbiterMitreDiamond",[[0,H*.12],[-W*.1,0],[0,-H*.12],[W*.1,0]],D*.07,body.headMesh,cloth);
  jewel.position.copyFrom(panel.position);jewel.position.y+=H*.38;jewel.position.z+=D*.08;
  for(const m of [hat,cap,panel,jewel]) { m.convertToFlatShadedMesh();scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return [hat,cap,panel,jewel];
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

/** [S] 483, good.divine_arbiter.blue.png: a broad gold flower collar cups
 * the neck. Its low front forms a V under the chin; side/back petals lift to
 * the cheeks. Ten closed pentagonal slabs flare from .35 head widths at the
 * throat to 1.3 at the rim (2.6 widths across), with pointed raised tips. */
export function arbiterPetalCollar(scene: Scene, body: ArticulatedBody): Mesh[] {
  const box = body.headMesh.getBoundingInfo().boundingBox;
  const W = box.extendSize.x * 2, H = box.extendSize.y * 2;
  const goldColor = new Color3(0.85, 0.55, 0.12);
  const gold = getMaterialFactory().get("unlit", goldColor, { emissive: goldColor });
  const out: Mesh[] = [], count = 10, step = Math.PI * 2 / count;
  const point = (a: number, r: number, y: number): number[] => [Math.sin(a) * r, y, Math.cos(a) * r];
  for (let k = 0; k < count; k++) {
    const a = k * step, left = a - step * 0.51, right = a + step * 0.51;
    const lift = H * (0.13 + 0.48 * (1 - Math.cos(a)));
    const rim = W * (1.2 + 0.1 * (1 - Math.cos(a)) / 2);
    const polygon = [point(left, W * 0.35, -H * 0.07), point(left, rim * 0.92, lift - H * 0.12),
      point(a, rim, lift + H * 0.05), point(right, rim * 0.92, lift - H * 0.12), point(right, W * 0.35, -H * 0.07)];
    const positions: number[] = [], indices: number[] = [];
    for (const offset of [H * 0.03, -H * 0.03]) for (const p of polygon) positions.push(p[0], p[1] + offset, p[2]);
    // The upper and lower faces are separate, outward-facing solid surfaces,
    // rather than a double-sided ribbon that produces SSAO cloth darkening.
    for (let j = 1; j < 4; j++) indices.push(0, j, j + 1, 5, j + 6, j + 5);
    for (let j = 0; j < 5; j++) {
      const next = (j + 1) % 5;
      indices.push(j, next + 5, next, j, j + 5, next + 5);
    }
    const normals: number[] = [];
    VertexData.ComputeNormals(positions, indices, normals);
    const data = new VertexData(); data.positions = positions; data.indices = indices; data.normals = normals;
    const petal = new Mesh("arbiterGoldCollarPetal", scene); data.applyToMesh(petal);
    petal.parent = body.neck; petal.material = gold; petal.convertToFlatShadedMesh();
    scene.getGlowLayerByName("glow")?.addExcludedMesh(petal); out.push(petal);
  }
  return out;
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
 * 2.5W across, tube .07W, centred .1H over the torso top and .75D behind its
 * centre; 12 small outward spikes .18W, a tall top spike .55W; at 3 and 9
 * o'clock a .35W spike with two white winglets beyond it. The node
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
  const R = W * 1.25, out: Mesh[] = [];
  const ring = MeshBuilder.CreateTorus("chronoRingBand", { diameter: R * 2, thickness: W * 0.07, tessellation: 28 }, scene);
  ring.parent = spin; ring.rotation.x = Math.PI / 2; ring.material = gold; out.push(ring);
  const spike = (a: number, len: number, base: number): void => {
    const m = MeshBuilder.CreateCylinder("chronoRingSpike", { height: len, diameterBottom: base, diameterTop: 0, tessellation: 4 }, scene);
    m.parent = spin; m.position.set(Math.sin(a) * (R + len * 0.45), Math.cos(a) * (R + len * 0.45), 0); m.rotation.z = -a; m.material = gold; out.push(m);
  };
  for (let k = 0; k < 12; k++) if (k % 3 !== 0) spike((k / 12) * Math.PI * 2, W * 0.18, W * 0.09);
  spike(0, W * 0.55, W * 0.2); spike(Math.PI, W * 0.18, W * 0.09);
  for (const side of [-1, 1]) {
    spike(side * Math.PI / 2, W * 0.35, W * 0.16);
    for (const tilt of [0.35, -0.35]) {
      const wing = ornament(scene, "chronoRingWinglet", [[0, 0], [side * W * 0.3, W * 0.12], [side * W * 0.42, W * 0.02], [side * W * 0.3, -W * 0.07]], W * 0.05, spin, white);
      wing.position.set(side * (R + W * 0.36), 0, 0); wing.rotation.z = tilt; out.push(wing);
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
  add(MeshBuilder.CreateBox("aegisHoodieShell", { width: W * 1.05, height: top - hem, depth: D * 1.07 }, scene), (hem + top) / 2, cz, cloth);
  add(MeshBuilder.CreateBox("aegisHoodieLip", { width: W * 1.1, height: H * 0.07, depth: D * 1.12 }, scene), hem + H * 0.02, cz, cloth);
  const hood = add(MeshBuilder.CreateTorus("aegisRolledHood", { diameter: W * 0.62, thickness: H * 0.2, tessellation: 8 }, scene), cy + H * 0.52, cz - D * 0.05, cloth);
  hood.scaling.z = D / W * 1.3;
  add(MeshBuilder.CreateBox("aegisHoodBack", { width: W * 0.55, height: H * 0.3, depth: D * 0.2 }, scene), cy + H * 0.36, cz - D * 0.6, cloth).rotation.x = -0.2;
  add(MeshBuilder.CreateBox("aegisHoodieStrip", { width: W * 0.06, height: H * 0.3, depth: D * 0.06 }, scene), cy + H * 0.29, cz + D * 0.56, gold);
  add(MeshBuilder.CreateCylinder("aegisHoodieToggle", { height: D * 0.08, diameter: W * 0.12, tessellation: 6 }, scene), cy + H * 0.42, cz + D * 0.6, gold).rotation.x = Math.PI / 2;
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
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
    for (const m of knee.getChildMeshes(true)) if (/_[lr]FootM$/.test(m.name)) m.material = white;
  }
  for (const m of out) { m.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(m); }
  return out;
}

/** [S] 487, good.radiant_glaive card Appearance ("a cape") and .jpg: a team
 * cape with a gold bottom line hangs from the shoulders behind the vest.
 * Spec (torso widths W, heights H, depths D): a closed trapezoid slab 1.15W
 * across at the shoulders flaring to 2W, 1.9H long (to mid-thigh), .06D
 * thick, hung .07D behind the back and tilted .16 rad out at the hem, so
 * its flared edges show past the hips from the front; a gold hem band .1H
 * tall across its foot; a gold clasp .14W on the front of each shoulder. */
export function radiantCape(scene: Scene, body: ArticulatedBody, team: Color3): Mesh[] {
  const tm = body.torsoMesh, tb = tm.getBoundingInfo().boundingBox, s = tm.scaling;
  const W = tb.extendSize.x * 2 * s.x, H = tb.extendSize.y * 2 * s.y, D = tb.extendSize.z * 2 * s.z;
  const cy = tm.position.y + tb.center.y * s.y, cz = tm.position.z + tb.center.z * s.z;
  const mf = getMaterialFactory();
  const deep = team.scale(0.75), cloth = mf.get("cloth", deep, { emissive: deep.scale(0.15) });
  const goldC = new Color3(1, 0.7, 0.18), gold = mf.get("unlit", goldC, { emissive: goldC });
  const len = H * 1.9, top = cy + H * 0.48, back = cz - D * 0.5 - D * 0.07, t = D * 0.06;
  const at = (y: number) => W * (1.15 + 0.85 * y / len);
  const out: Mesh[] = [];
  const cape = ornament(scene, "radiantCape", [[-at(0) / 2, 0], [at(0) / 2, 0], [at(len) / 2, -len], [-at(len) / 2, -len]], t, body.torso, cloth);
  cape.position.set(0, top, back); cape.rotation.x = 0.16; out.push(cape);
  const h0 = len - H * 0.1;
  const hem = ornament(scene, "radiantCapeHem", [[-at(h0) / 2, -h0], [at(h0) / 2, -h0], [at(len) / 2 * 1.01, -len], [-at(len) / 2 * 1.01, -len]], t * 1.6, body.torso, gold);
  hem.position.set(0, top, back); hem.rotation.x = 0.16; out.push(hem);
  for (const side of [-1, 1]) {
    const clasp = MeshBuilder.CreateCylinder("radiantCapeClasp", { height: D * 0.08, diameter: W * 0.14, tessellation: 6 }, scene);
    clasp.parent = body.torso; clasp.position.set(side * W * 0.36, cy + H * 0.42, cz + D * 0.54); clasp.rotation.x = Math.PI / 2; clasp.material = gold;
    clasp.convertToFlatShadedMesh(); scene.getGlowLayerByName("glow")?.addExcludedMesh(clasp); out.push(clasp);
  }
  return out;
}
