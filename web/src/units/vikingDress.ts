import { Scene, Color3, Mesh, MeshBuilder, Node, Quaternion, TransformNode, Vector3 } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { limbBox, limbShell } from "./medievalDress";

/*
 * Viking dress (units/viking.*): cloth, hair and ornaments built per unit id by unitFactory, sized off the body's own metrics and joints.
 * Pieces worn on the head are parented to the head mesh (+z his front, +y up, its origin its middle); pieces on the trunk to the torso joint.
 */

/** The head block's half extents in its own frame. */
function headExtents(body: ArticulatedBody): Vector3 {
  body.headMesh.computeWorldMatrix(true);
  return body.headMesh.getBoundingInfo().boundingBox.extendSize.clone();
}

/*
 * [S] the Headbutter's spiked cap (392; viking.headbutter.red.png, card Appearance "a helmet with one single spike"; critic 391: a blue dome with
 * two grey horns and a grey nose strip instead). A team-colour cap over the crown, its rim just over the eyes, a dark studded brow band round it,
 * leather ear flaps down each side of the face, and one tall grey spike off the crown with a dark stud at its foot. No horns, nasal strip or beard:
 * those came from the shared viking_helmet, which the Brawler still wears.
 *   dome: a sliced sphere .dome of the head across and .tall of it high, its middle .rise of the head up so its rim sits over the eyes;
 *   band: a dark ring .band of the head tall round the head .bandProud out, studs .stud of the head across round its front;
 *   flaps: dark boxes .flapDrop of the head down from the band at each side, .flapWide across and .flapDeep deep (the head's own depth);
 *   spike: a four-sided grey cone .spike of the head tall off the crown, its foot .spikeBase of the head across, with a stud at its foot.
 */
const HEADBUTTER_CAP = {
  dome: 1.16, tall: 1.04, rise: 0.16, band: 0.15, bandProud: 1.05, studs: 5, stud: 0.11,
  flapDrop: 0.62, flapWide: 0.2, flapDeep: 0.66, spike: 0.9, spikeBase: 0.2, spikeRise: 0.02, glow: 0.08, darkGlow: 0.06,
};

/** The Headbutter's spiked team cap (spec at HEADBUTTER_CAP). */
export function headbutterCap(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const C = HEADBUTTER_CAP;
  const mf = getMaterialFactory();
  const e = headExtents(body);
  const cap = mf.get("cloth", teamColor.scale(0.92), { emissiveIntensity: C.glow });
  const leather = mf.get("cloth", new Color3(0.2, 0.13, 0.1), { emissiveIntensity: C.darkGlow });
  const steel = mf.get("cloth", new Color3(0.45, 0.46, 0.5), { emissiveIntensity: 0.1 });
  const out: Mesh[] = [];
  const put = (m: Mesh, material: typeof cap): Mesh => {
    m.material = material;
    m.convertToFlatShadedMesh();
    m.parent = body.headMesh;
    out.push(m);
    return m;
  };
  const top = e.y * C.rise;
  const dome = put(MeshBuilder.CreateSphere("headbutterCap", {
    diameterX: 2 * e.x * C.dome, diameterY: 2 * e.y * C.tall, diameterZ: 2 * e.z * C.dome, segments: 10, slice: 0.56,
  }, scene), cap);
  dome.position.y = top;
  // the brow band: a dark ring round the head, its middle a touch under the cap's rim
  const bandY = e.y * (C.rise - C.band * 0.35);
  const band = put(MeshBuilder.CreateBox("headbutterBand", {
    width: 2 * e.x * C.bandProud, height: e.y * C.band, depth: 2 * e.z * C.bandProud,
  }, scene), leather);
  band.position.y = bandY;
  // studs across the band's front, a bead proud of it
  for (let i = 0; i < C.studs; i++) {
    const t = C.studs === 1 ? 0 : i / (C.studs - 1) - 0.5;
    const stud = put(MeshBuilder.CreateIcoSphere("headbutterStud", {
      radius: e.x * C.stud * 0.5, subdivisions: 1, flat: true,
    }, scene), steel);
    stud.position.set(t * 2 * e.x * C.bandProud * 0.82, bandY, e.z * C.bandProud + e.x * C.stud * 0.18);
  }
  // the ear flaps: a dark panel down each side of the face, from the band to under the jaw
  for (const side of [-1, 1]) {
    const flap = put(MeshBuilder.CreateBox("headbutterFlap", {
      width: e.x * C.flapWide, height: e.y * C.flapDrop, depth: 2 * e.z * C.flapDeep,
    }, scene), leather);
    flap.position.set(side * (e.x * C.bandProud + e.x * C.flapWide * 0.28), bandY - e.y * C.flapDrop * 0.35, -e.z * 0.06);
    flap.rotation.z = side * 0.07;
  }
  // the single spike: a tall grey cone off the crown, with its stud at the foot
  const crown = e.y * (C.rise + C.tall) - e.y * 0.03;
  const spike = put(MeshBuilder.CreateCylinder("headbutterSpike", {
    height: e.y * C.spike, diameterTop: 0, diameterBottom: 2 * e.x * C.spikeBase, tessellation: 4,
  }, scene), steel);
  spike.position.y = crown + e.y * C.spike * 0.5;
  const foot = put(MeshBuilder.CreateIcoSphere("headbutterSpikeStud", {
    radius: e.x * C.stud * 0.4, subdivisions: 1, flat: true,
  }, scene), leather);
  foot.position.set(0, crown + e.x * C.stud * 0.2, e.z * C.bandProud * 0.75);
  return out;
}

/** The head's box in the torso joint's frame: its lowest point, its middle's height and depth, its width, height and depth. */
function headInTorso(body: ArticulatedBody): { chin: number; midY: number; midZ: number; wide: number; tall: number; deep: number } {
  for (let n: Node | null = body.headMesh; n; n = n.parent) if (n instanceof TransformNode) n.computeWorldMatrix(true);
  body.torso.computeWorldMatrix(true);
  const box = body.headMesh.getBoundingInfo().boundingBox;
  const toTorso = body.torso.getWorldMatrix().clone().invert();
  const pts = box.vectorsWorld.map((v) => Vector3.TransformCoordinates(v, toTorso));
  const ys = pts.map((p) => p.y), zs = pts.map((p) => p.z), xs = pts.map((p) => p.x);
  return {
    chin: Math.min(...ys),
    midY: (Math.min(...ys) + Math.max(...ys)) / 2,
    midZ: (Math.min(...zs) + Math.max(...zs)) / 2,
    wide: Math.max(...xs) - Math.min(...xs),
    tall: Math.max(...ys) - Math.min(...ys),
    deep: Math.max(...zs) - Math.min(...zs),
  };
}

/*
 * [S] the Headbutter's two braids (393; viking.headbutter.red.png, viking.headbutter.png, card "long, braided hair"; critic 392: none, a bare blue head).
 * Two thick tan plaits hang from under the cap's ear flaps beside each cheek, down the front of the shoulders and over the chest, ending about a third
 * of the way to the belt in a dark ring tie and a short tuft. Hung from the torso, not the head, so they lie on the chest whatever the neck does. In the
 * head's own size (head heights H, head widths W), torso frame:
 *   root HEADBUTTER_BRAID.apart W out from the middle, .rootUp H above the chin (under the flap), .rootAhead of the head's depth ahead of its middle;
 *   foot .footOut W out, .footDrop H below the chin, laid .standOff W ahead of the chest's front; the path bows forward .bow W over the shoulder line;
 *   .plaits lobes .thick W across on a hair core .core of that, overlapping .overlap of a step, tipped alternately; a tie .band H tall and .bandWide
 *   of the braid round, then a tuft .tuft H long. Tan hair self-lit .glow.
 */
const HEADBUTTER_BRAID = {
  apart: 0.52, rootUp: 0.1, rootAhead: 0.3, footOut: 0.64, footDrop: 1.02, standOff: 0.16, bow: 0.16,
  plaits: 5, thick: 0.34, core: 0.6, overlap: 1.55, band: 0.13, bandWide: 1.35, tuft: 0.22, glow: 0.22,
};
const HEADBUTTER_HAIR = new Color3(0.6, 0.38, 0.2);
const HEADBUTTER_TIE = new Color3(0.34, 0.1, 0.08);

/** The Headbutter's two tan braids from under the ear flaps down onto the chest, a dark tie and tuft at each end (spec at HEADBUTTER_BRAID). */
export function headbutterBraids(scene: Scene, body: ArticulatedBody): Mesh[] {
  const B = HEADBUTTER_BRAID;
  const mf = getMaterialFactory();
  const hair = mf.get("cloth", HEADBUTTER_HAIR, { emissiveIntensity: B.glow });
  const tieMat = mf.get("cloth", HEADBUTTER_TIE, { emissiveIntensity: 0.1 });
  const head = headInTorso(body);
  const H = head.tall, W = head.wide;
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const front = chest.position.z + ext.z * chest.scaling.z;
  const thick = B.thick * W;
  const added: Mesh[] = [];
  const put = (m: Mesh, material: typeof hair): Mesh => {
    m.material = material;
    m.parent = body.torso;
    added.push(m);
    return m;
  };
  for (const side of [-1, 1]) {
    const root = new Vector3(side * B.apart * W, head.chin + B.rootUp * H, head.midZ + head.deep * B.rootAhead);
    const foot = new Vector3(side * B.footOut * W, head.chin - B.footDrop * H, front + B.standOff * W + thick * 0.5);
    // a quadratic from the root to the foot, bowed forward over the shoulder line so it lies on the collar and chest, not through them
    const mid = Vector3.Lerp(root, foot, 0.5);
    mid.z = Math.max(mid.z, foot.z) + B.bow * W;
    const along = (t: number): Vector3 => root.scale((1 - t) ** 2).add(mid.scale(2 * t * (1 - t))).add(foot.scale(t * t));
    const tangent = (t: number): Vector3 => mid.subtract(root).scale(2 * (1 - t)).add(foot.subtract(mid).scale(2 * t)).normalize();
    const lean = (t: number): number => Math.atan2(-tangent(t).z, -tangent(t).y);
    const path: Vector3[] = [];
    for (let k = 0; k <= 10; k++) path.push(along(k / 10));
    put(MeshBuilder.CreateTube("headbutterBraidCore", { path, radius: thick * 0.5 * B.core, tessellation: 6 }, scene), hair);
    const step = 1 / B.plaits;
    const len = Vector3.Distance(root, foot) * 1.05;
    for (let k = 0; k < B.plaits; k++) {
      const t = (k + 0.5) * step * 0.92;
      const lobe = put(MeshBuilder.CreateIcoSphere("headbutterBraid", {
        radiusX: thick * 0.5, radiusY: len * step * 0.5 * B.overlap, radiusZ: thick * 0.42, subdivisions: 1, flat: true,
      }, scene), hair);
      lobe.position.copyFrom(along(t));
      lobe.position.x += (k % 2 ? 1 : -1) * thick * 0.08;
      lobe.rotation.set(lean(t), 0, (k % 2 ? 1 : -1) * 0.35);
    }
    const tie = put(MeshBuilder.CreateCylinder("headbutterBraidTie", { height: B.band * H, diameter: thick * B.bandWide, tessellation: 7 }, scene), tieMat);
    tie.position.copyFrom(foot);
    tie.rotation.x = lean(1);
    const tuft = put(MeshBuilder.CreateCylinder("headbutterBraidTuft", {
      height: B.tuft * H, diameterTop: thick * 0.7, diameterBottom: thick * 0.25, tessellation: 5,
    }, scene), hair);
    tuft.convertToFlatShadedMesh();
    tuft.position.copyFrom(foot.add(tangent(1).scale((B.band + B.tuft) * H * 0.5)));
    tuft.rotation.x = lean(1);
  }
  return added;
}

/*
 * [S] the vikings' own beard (395; viking.berserker.red.png, viking.brawler.red.png, card berserker "It has a beard", brawler "the stereotypical Viking
 * beard"; critic 394/391: no beard on either, only the thin dark cone the shared helm used to carry). A full faceted beard hung off the jaw and chin, in
 * the head's own half extents (W across, H high, D deep; +z his front):
 *   sideburns: a tapered column each side from the temple (.burnTop H up) down the cheek to the jaw;
 *   jaw mass: a faceted ball .jaw (x, y, z) of the half extents at .jawY H down and .jawZ D ahead, wider than the head so it reads past its silhouette;
 *   bib: a wedge under the jaw down .down H and .wide W across at its root, narrowing to .tip of that, leaning .lean rad forward off the chest;
 *   locks: .locks pointed locks off the bib's foot, the middle ones longest;
 *   moustache: a drooping faceted bar over the upper lip, .stache W across, its ends hanging into the beard;
 *   braid: two ties and a tuft at the bib's foot (a plaited point), when the cut wears one.
 * Self-lit .glow so the dark hair stays warm in the shade.
 */
interface VikingBeardCut { color: Color3; glow: number; down: number; wide: number; tip: number; braid: boolean; stache: boolean }
const VIKING_BEARD = {
  burnTop: 0.2, burn: 0.22, jaw: [1.2, 0.6, 0.62] as const, jawY: 0.66, jawZ: 0.6,
  locks: 5, lockLong: 0.26, braidLong: 0.3, band: 0.09, tuft: 0.16,
};
function vikingBeard(scene: Scene, body: ArticulatedBody, cut: VikingBeardCut): Mesh[] {
  const B = VIKING_BEARD;
  const mf = getMaterialFactory();
  const hair = mf.get("cloth", cut.color, { emissiveIntensity: cut.glow });
  const tie = mf.get("cloth", cut.color.scale(0.45), { emissiveIntensity: cut.glow * 0.6 });
  const e = headExtents(body);
  const halfX = e.x, halfY = e.y, halfZ = e.z;
  const W = halfX * 2, H = halfY * 2;
  const added: Mesh[] = [];
  const put = (m: Mesh): Mesh => {
    m.material = hair;
    m.parent = body.headMesh;
    m.convertToFlatShadedMesh();
    added.push(m);
    return m;
  };
  // a tapered four-sided length from `from` to `to`, its wide end at `from`
  const column = (name: string, from: Vector3, to: Vector3, root: number, tipWide: number): Mesh => {
    const d = to.subtract(from);
    const m = MeshBuilder.CreateCylinder(name, { height: d.length(), diameterTop: root, diameterBottom: tipWide, tessellation: 5 }, scene);
    m.rotationQuaternion = Quaternion.Identity();
    Quaternion.FromUnitVectorsToRef(new Vector3(0, -1, 0), d.normalize(), m.rotationQuaternion);
    m.position = Vector3.Center(from, to);
    return put(m);
  };
  for (const side of [-1, 1]) {
    column("vikingBeardBurn", new Vector3(side * halfX * 1.0, halfY * B.burnTop, halfZ * 0.12), new Vector3(side * halfX * 0.96, -halfY * 0.6, halfZ * 0.5),
      W * B.burn, W * B.burn * 1.05);
  }
  const jaw = MeshBuilder.CreateIcoSphere("vikingBeardJaw", { radius: 1, subdivisions: 1, flat: true }, scene);
  jaw.scaling.set(halfX * B.jaw[0], halfY * B.jaw[1], halfZ * B.jaw[2]);
  jaw.position.set(0, -halfY * B.jawY, halfZ * B.jawZ);
  put(jaw);
  // the bib: from under the chin down onto the chest, leaning forward off it
  const bibTop = new Vector3(0, -halfY * (B.jawY + B.jaw[1] * 0.55), halfZ * B.jawZ);
  const lean = 0.12;
  const bibFoot = bibTop.add(new Vector3(0, -Math.cos(lean) * H * cut.down, Math.sin(lean) * H * cut.down));
  const bib = column("vikingBeardBib", bibTop, bibFoot, W * cut.wide, W * cut.wide * cut.tip);
  bib.scaling.z = 0.6;
  for (let i = 0; i < B.locks; i++) {
    const u = (i + 0.5) / B.locks - 0.5;
    const long = H * B.lockLong * (1 - Math.abs(u) * 0.85) * (0.85 + 0.3 * ((i * 7) % 5) / 5);
    const from = Vector3.Lerp(bibTop, bibFoot, 0.72).add(new Vector3(u * W * cut.wide * 0.62, 0, 0));
    column("vikingBeardLock", from, from.add(new Vector3(u * W * 0.28, -long, long * 0.25)), W * 0.15, W * 0.02);
  }
  if (cut.stache) {
    for (const side of [-1, 1]) {
      column("vikingBeardStache", new Vector3(0, -halfY * 0.2, halfZ * 1.08), new Vector3(side * W * 0.38, -halfY * 0.46, halfZ * 0.96), W * 0.14, W * 0.07);
    }
  }
  if (cut.braid) {
    // the braid at the end of the beard: a plaited length, two dark ties, a short tuft
    const end = bibFoot.add(new Vector3(0, H * B.tuft * 0.35, halfZ * 0.12));
    const foot = end.add(new Vector3(0, -H * B.braidLong, halfZ * 0.16));
    const plait = column("vikingBeardBraid", end, foot, W * 0.21, W * 0.16);
    plait.scaling.z = 0.8;
    for (let k = 0; k < 3; k++) {
      const at = Vector3.Lerp(end, foot, (k + 0.5) / 3);
      const band = MeshBuilder.CreateCylinder("vikingBeardBraidBand", { height: H * B.band, diameter: W * (0.23 - k * 0.02), tessellation: 6 }, scene);
      band.rotationQuaternion = Quaternion.Identity();
      band.rotation.x = 0.12;
      band.position.copyFrom(at);
      band.material = tie;
      band.parent = body.headMesh;
      added.push(band);
    }
    const tuft = MeshBuilder.CreateCylinder("vikingBeardBraidTuft", { height: H * B.tuft * 2, diameterTop: W * 0.16, diameterBottom: 0, tessellation: 5 }, scene);
    tuft.position.copyFrom(foot.add(new Vector3(0, -H * B.tuft, 0)));
    tuft.material = hair;
    tuft.parent = body.headMesh;
    tuft.convertToFlatShadedMesh();
    added.push(tuft);
  }
  return added;
}

/** The Berserker's big dark beard and moustache, ending in a tied braid (spec at VIKING_BEARD). */
export function berserkerBeard(scene: Scene, body: ArticulatedBody): Mesh[] {
  return vikingBeard(scene, body, { color: new Color3(0.3, 0.12, 0.1), glow: 0.2, down: 0.9, wide: 1.12, tip: 0.48, braid: true, stache: true });
}

/** The Brawler's dark beard, hung from under his full-face helm's mask onto the chest (spec at VIKING_BEARD). */
export function brawlerBeard(scene: Scene, body: ArticulatedBody): Mesh[] {
  return vikingBeard(scene, body, { color: new Color3(0.24, 0.12, 0.1), glow: 0.18, down: 0.55, wide: 0.94, tip: 0.42, braid: false, stache: false });
}

/*
 * [S] the Headbutter's kit (395; viking.headbutter.red.png, viking.headbutter.png, card Appearance "thick furry boots"; critic 391: "a plain blue tunic,
 * bare hands and boots, no belt"). In the trunk's and the limbs' own frames:
 *   belt: a brown band round the hips .tall of the trunk's height at .at up, .proud of it, a dark buckle box on its front;
 *   bracers: a dark leather shell .out of the forearm's half-width from .from to .to down it, a puffy cream fur roll round its top;
 *   boots: a brown shell .out of the shin from .bootFrom down to the foot, the foot mesh itself in the boot's leather, a wide cream fur roll .cuffOut of
 *   it from .cuffFrom to .cuffTo round its top, and a dark sole under the boot.
 * Fur and leather self-lit so the cream reads cream and the brown stays warm in the shade.
 */
const HEADBUTTER_KIT = {
  beltTall: 0.26, beltAt: 0.1, beltOut: 1.24, buckle: 0.22,
  bracerFrom: 0.06, bracerTo: 0.78, bracerOut: 1.24, furFrom: -0.06, furTo: 0.24, furOut: 1.54, furThick: 0.22, furLumps: 6,
  bootFrom: 0.48, bootTo: 1.0, bootOut: 1.16, cuffFrom: 0.1, cuffTo: 0.46, cuffOut: 1.5, cuffThick: 0.28, cuffLumps: 7,
  sole: 0.06, soleOut: 1.06, glow: 0.14,
};
/** The kit's warm cream fur: the critic's (0.9, 0.7, 0.42) (the palette's tan row shows as cream, not the old pale grey). */
const HEADBUTTER_FUR = new Color3(0.9, 0.7, 0.42);
/** The Headbutter's brown belt and buckle, dark fur-cuffed bracers, and cream fur boot cuffs over brown boots (spec at HEADBUTTER_KIT). */
export function headbutterKit(scene: Scene, body: ArticulatedBody): Mesh[] {
  const K = HEADBUTTER_KIT;
  const mf = getMaterialFactory();
  const leather = mf.get("cloth", new Color3(0.3, 0.17, 0.09), { emissiveIntensity: K.glow * 0.5 });
  const boot = mf.get("cloth", new Color3(0.36, 0.21, 0.12), { emissiveIntensity: K.glow * 0.5 });
  const soleMat = mf.get("cloth", new Color3(0.2, 0.12, 0.07), { emissiveIntensity: K.glow * 0.35 });
  const fur = mf.get("cloth", HEADBUTTER_FUR, { emissiveIntensity: K.glow });
  const buckleMat = mf.get("cloth", new Color3(0.62, 0.5, 0.26), { emissiveIntensity: K.glow * 0.6 });
  const out: Mesh[] = [];
  // the belt round the hips, a buckle on its front
  const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
  const band = MeshBuilder.CreateCylinder("headbutterBelt", { height: chest.y * 2 * K.beltTall, diameter: Math.max(chest.x, chest.z) * 2 * K.beltOut, tessellation: 8 }, scene);
  band.position.y = chest.y * K.beltAt;
  band.scaling.z = body.torsoMesh.scaling.z * 0.98;
  band.parent = body.torso;
  band.material = leather;
  band.convertToFlatShadedMesh();
  out.push(band);
  const buckle = MeshBuilder.CreateBox("headbutterBuckle", {
    width: chest.x * K.buckle, height: chest.y * 2 * K.beltTall * 1.15, depth: chest.z * 0.14,
  }, scene);
  buckle.position.set(0, chest.y * K.beltAt, Math.max(chest.x, chest.z) * K.beltOut);
  buckle.parent = body.torso;
  buckle.material = buckleMat;
  buckle.convertToFlatShadedMesh();
  out.push(buckle);
  /**
   * A puffy roll of fur round a limb at `at` of the way down it: a faceted torus round the limb, its tube .thick of the limb's radius, and `lumps`
   * rounded clumps standing round its front so the roll reads as fur and not as a smooth band. (The old cut was a fringe of cones, which read grey and
   * spiky - critic 395.)
   */
  const furRoll = (limb: Mesh, at: number, outOf: number, thick: number, lumps: number): void => {
    const L = limbBox(limb);
    const r = Math.max(L.wide, L.deep) * outOf;
    const y = L.mid + L.half - at * L.half * 2;
    const flat = L.deep / Math.max(L.wide, L.deep);
    const ring = MeshBuilder.CreateTorus("headbutterFurRoll", { diameter: r * 2, thickness: r * 2 * thick, tessellation: 8 }, scene);
    ring.parent = limb.parent;
    ring.position.set(0, y, 0);
    ring.scaling.z = flat;
    ring.material = fur;
    ring.convertToFlatShadedMesh();
    out.push(ring);
    for (let i = 0; i < lumps; i++) {
      const a = (i / lumps) * Math.PI * 2 + (i % 2 ? 0.22 : 0);
      const lump = MeshBuilder.CreateIcoSphere("headbutterFurLump", { radius: r * thick * 0.92, subdivisions: 1, flat: true }, scene);
      lump.parent = limb.parent;
      lump.position.set(Math.cos(a) * r * 0.99, y + (i % 2 ? r * thick * 0.36 : -r * thick * 0.2), Math.sin(a) * r * flat * 0.99);
      lump.material = fur;
      out.push(lump);
    }
  };
  for (const [fore, shin] of [[body.leftLowerArm, body.leftLowerLeg], [body.rightLowerArm, body.rightLowerLeg]] as const) {
    out.push(limbShell(scene, "headbutterBracer", fore, K.bracerFrom, K.bracerTo, K.bracerOut, leather));
    furRoll(fore, K.furFrom, K.furOut, K.furThick, K.furLumps);
    out.push(limbShell(scene, "headbutterBoot", shin, K.bootFrom, K.bootTo, K.bootOut, boot));
    out.push(limbShell(scene, "headbutterCuff", shin, K.cuffFrom, K.cuffTo, K.cuffOut, fur));
    furRoll(shin, K.cuffFrom, K.cuffOut, K.cuffThick, K.cuffLumps);
  }
  // [S] the boots over the feet (395 a.4: the boot stopped at the ankle and the feet stayed team blue): the foot mesh itself in the boot's leather,
  // with a dark sole slab under it standing a hair proud all round, so the boot runs on over the toe (viking.headbutter.red.png: brown boots to the toes).
  for (const foot of body.root.getChildMeshes(false)) {
    if (!/_[lr]FootM$/.test(foot.name)) continue;
    foot.material = boot;
    const bb = foot.getBoundingInfo().boundingBox;
    const wide = (bb.maximum.x - bb.minimum.x) * K.soleOut;
    const deep = (bb.maximum.z - bb.minimum.z) * K.soleOut;
    const sole = MeshBuilder.CreateBox("headbutterSole", { width: wide, height: bb.extendSize.y * K.sole, depth: deep }, scene);
    sole.parent = foot.parent;
    sole.position.set(foot.position.x, bb.minimum.y + bb.extendSize.y * K.sole * 0.5, foot.position.z + bb.center.z);
    sole.material = soleMat;
    sole.convertToFlatShadedMesh();
    out.push(sole);
  }
  return out;
}

/*
 * [S] the Jarl's bear pelt (393; viking.jarl.red.png, viking.jarl.jpg, card "most notable": a bear-head hood over his helm with two googly eyes and
 * teeth, the brown fur draping to the hips; critic 392: no pelt, a blue horned helm over a barrel torso). The horned helm is off and a bear's skin is on:
 *   skull: a wide flat fur block over the crown, .skull of the head across and .skullTall of it high, its middle .skullRise up;
 *   muzzle: a narrow lighter fur block out of the skull's front over his brow, .muzzle of the head across and .muzzleLong of its depth long, tipped down
 *   .muzzleDrop, a dark nose on its tip;
 *   eyes: two pale googly eyes .eye of the head across, set wide .eyeOut either side at the skull's front .eyeUp up, a black pupil .pupil of the eye;
 *   teeth: .teeth white teeth under the muzzle's tip;
 *   ears: two fur balls .ear of the head at the skull's top corners;
 *   side fur: a panel down each side of his own face from the skull past the jaw, .side of the head across;
 * and, hung from the torso: a fur mantle over both shoulders, a drape panel off each shoulder to the hips, a back panel over the spine, each ending in
 * jagged fur tufts. Fur self-lit .glow so the hood does not read grey under its own overhang.
 */
const JARL_PELT = {
  skull: 1.1, skullTall: 0.3, skullRise: 1.08, muzzle: 0.3, muzzleTall: 0.22, muzzleAhead: 1.34, muzzleLong: 1.8, muzzleDrop: 0.25,
  eye: 0.16, eyeUp: 1.3, eyeOut: 0.5, pupil: 0.42, teeth: 3, tooth: 0.14, ear: 0.22, earOut: 0.72, earUp: 0.32,
  side: 0.3, sideDrop: 1.3, sideOut: 0.92, sideAhead: 0.02,
  drape: 0.12, drapeOut: 0.56, drapeDrop: 0.78, drapeDeep: 0.55, back: 0.85, backDeep: 0.14, tufts: 3, tuft: 0.18, glow: 0.2,
};
const JARL_FUR = new Color3(0.42, 0.21, 0.14);
const JARL_FUR_DARK = new Color3(0.29, 0.14, 0.09);

/** The Jarl's bear-head hood and the pelt draping to his hips (spec at JARL_PELT). */
export function jarlPelt(scene: Scene, body: ArticulatedBody): Mesh[] {
  const P = JARL_PELT;
  const mf = getMaterialFactory();
  const fur = mf.get("cloth", JARL_FUR, { emissiveIntensity: P.glow });
  const darkFur = mf.get("cloth", JARL_FUR_DARK, { emissiveIntensity: P.glow * 0.8 });
  const muzzleMat = mf.get("cloth", new Color3(0.62, 0.46, 0.34), { emissiveIntensity: P.glow });
  const bone = mf.get("cloth", new Color3(0.9, 0.88, 0.8), { emissiveIntensity: 0.16 });
  const pupilMat = mf.get("cloth", new Color3(0.05, 0.05, 0.06), { emissiveIntensity: 0.05 });
  const added: Mesh[] = [];
  const e = headExtents(body);
  const put = (m: Mesh, material: typeof fur, parent: Node, flat = true): Mesh => {
    m.material = material;
    if (flat) m.convertToFlatShadedMesh();
    m.parent = parent;
    added.push(m);
    return m;
  };
  // the skull: a wide flat block over his crown
  const skull = put(MeshBuilder.CreateBox("jarlBearSkull", {
    width: e.x * 2 * P.skull, height: e.y * 2 * P.skullTall, depth: e.z * 2 * P.skull,
  }, scene), fur, body.headMesh);
  skull.position.set(0, e.y * P.skullRise, 0);
  // the muzzle: a narrow snout out of the skull's front, tipped down, with a dark nose on its tip
  const muzzle = put(MeshBuilder.CreateBox("jarlBearMuzzle", {
    width: e.x * 2 * P.muzzle, height: e.y * 2 * P.muzzleTall, depth: e.z * P.muzzleLong,
  }, scene), muzzleMat, body.headMesh);
  muzzle.position.set(0, e.y * (P.skullRise - 0.08), e.z * P.muzzleAhead);
  muzzle.rotation.x = P.muzzleDrop;
  const nose = put(MeshBuilder.CreateBox("jarlBearNose", {
    width: e.x * 2 * P.muzzle * 0.8, height: e.y * P.muzzleTall * 1.1, depth: e.z * 0.22,
  }, scene), pupilMat, body.headMesh);
  nose.position.set(0, e.y * (P.skullRise - 0.24), e.z * (P.muzzleAhead + P.muzzleLong * 0.48));
  // the googly eyes set wide on the skull's front, and the ears on its top corners
  for (const side of [-1, 1]) {
    const eye = put(MeshBuilder.CreateIcoSphere("jarlBearEye", { radius: e.x * P.eye, subdivisions: 2 }, scene), bone, body.headMesh, false);
    eye.position.set(side * e.x * P.eyeOut, e.y * P.eyeUp, e.z * 0.46);
    const pupil = put(MeshBuilder.CreateIcoSphere("jarlBearPupil", { radius: e.x * P.eye * P.pupil, subdivisions: 1 }, scene), pupilMat, body.headMesh, false);
    pupil.position.set(side * e.x * P.eyeOut, e.y * P.eyeUp, e.z * 0.46 + e.x * P.eye * 0.8);
    const ear = put(MeshBuilder.CreateIcoSphere("jarlBearEar", { radius: e.x * P.ear, subdivisions: 1, flat: true }, scene), darkFur, body.headMesh);
    ear.position.set(side * e.x * P.earOut, e.y * (P.skullRise + P.earUp), -e.z * 0.1);
    // a strip of fur down the side of his face, from the skull past the jaw
    const cheek = put(MeshBuilder.CreateBox("jarlBearCheek", {
      width: e.x * P.side, height: e.y * P.sideDrop, depth: e.z * 1.25,
    }, scene), fur, body.headMesh);
    cheek.position.set(side * e.x * P.sideOut, -e.y * 0.15, e.z * P.sideAhead);
    cheek.rotation.z = side * 0.05;
  }
  for (let i = 0; i < P.teeth; i++) {
    const tooth = put(MeshBuilder.CreateCylinder("jarlBearTooth", {
      height: e.y * P.tooth, diameterTop: 0, diameterBottom: e.x * 0.13, tessellation: 4,
    }, scene), bone, body.headMesh);
    tooth.position.set((i - (P.teeth - 1) / 2) * e.x * 0.3, e.y * (P.skullRise - 0.44), e.z * (P.muzzleAhead + P.muzzleLong * 0.3));
    tooth.rotation.z = Math.PI;
  }
  // the drape: a mantle over both shoulders, a panel off each shoulder to the hips, and one over the spine, ending in fur tufts
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const top = chest.position.y + H * 0.5;
  const shoulderW = body.metrics.shoulderWidth ?? W * 1.3;
  const drapeH = H * P.drapeDrop;
  for (const side of [-1, 1]) {
    const panel = put(MeshBuilder.CreateBox("jarlPeltSide", {
      width: shoulderW * P.drape, height: drapeH, depth: D * P.drapeDeep,
    }, scene), fur, body.torso);
    panel.position.set(side * shoulderW * P.drapeOut, top - drapeH * 0.5 - H * 0.02, chest.position.z + D * 0.2);
    for (let k = 0; k < P.tufts; k++) {
      const tuft = put(MeshBuilder.CreateCylinder("jarlPeltTuft", {
        height: H * P.tuft, diameterTop: shoulderW * P.drape * 0.6, diameterBottom: 0, tessellation: 4,
      }, scene), darkFur, body.torso);
      tuft.position.set(
        side * shoulderW * P.drapeOut + (k - (P.tufts - 1) / 2) * shoulderW * P.drape * 0.4,
        top - drapeH - H * 0.02 - H * P.tuft * 0.4,
        chest.position.z + D * 0.2,
      );
      tuft.rotation.z = Math.PI;
    }
  }
  const back = put(MeshBuilder.CreateBox("jarlPeltBack", {
    width: W * P.back, height: drapeH * 0.9, depth: D * P.backDeep,
  }, scene), fur, body.torso);
  back.position.set(0, top - drapeH * 0.47 - H * 0.12, chest.position.z - D * 0.48);
  return added;
}

/*
 * [S] the Brawler's full-face Norse helm (394; viking.brawler.red.png, card Appearance, critic 391: a blue dome with two grey horns and a thin nose strip).
 * The horns, nasal strip and beard cone of the shared viking_helmet are the Headbutter's old hat, not his: his helm covers the whole head but the eyes.
 * In the head's own size (W across, H high; the bead eyes sit on the face's plane .12 H above its middle and are .3 W across):
 *   dome: a team shell over the crown, .domeWide W across and .domeTall H deep (a sphere sliced .domeSlice), its middle .domeRise H up so its rim comes
 *   down onto the brow; a darker team brow band .band H tall round it .bandProud proud, its foot on the eye line (.eyeTop H up);
 *   mask: a team plate over the lower face from just under the eyes (.maskTop H) to the chin (.maskBottom H), .maskWide W wide and .maskDepth D deep, stood
 *   a hair proud of the face; a cheek guard down each side of it (.cheek W wide, .cheekTop H up) so the jaw is boxed in;
 *   nasal: a dark strip from the brow band down between the eyes to the mask's top, .nasal W wide, stood .nasalProud D proud, so the eye slots read as two
 *   holes either side of it. Team cloth self-lit .glow (LESSONS: metal reads near black under swiftshader).
 */
const BRAWLER_HELM = {
  domeWide: 1.14, domeTall: 0.7, domeRise: 0.5, domeSlice: 0.6,
  band: 0.14, bandProud: 1.08, eyeTop: 0.42,
  maskTop: -0.18, maskBottom: -1.02, maskWide: 1.03, maskDepth: 1.04, maskProud: 0.06,
  cheek: 0.16, cheekTop: 0.3, cheekDeep: 0.92, cheekOut: 1.0,
  nasal: 0.24, nasalLow: -0.2, nasalProud: 0.11,
  glow: 0.1, darkGlow: 0.06,
};

/** The Brawler's full-face Norse helm: dome, brow band, lower-face mask with cheek guards, and a nasal between the eye holes (spec at BRAWLER_HELM). */
export function brawlerHelm(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const B = BRAWLER_HELM;
  const mf = getMaterialFactory();
  const e = headExtents(body);
  const helm = mf.get("cloth", teamColor.scale(0.8), { emissiveIntensity: B.glow });
  const dark = mf.get("cloth", teamColor.scale(0.45), { emissiveIntensity: B.darkGlow });
  const leather = mf.get("cloth", new Color3(0.18, 0.12, 0.1), { emissiveIntensity: B.darkGlow });
  const out: Mesh[] = [];
  const put = (m: Mesh, material: typeof helm): Mesh => {
    m.material = material;
    m.convertToFlatShadedMesh();
    m.parent = body.headMesh;
    out.push(m);
    return m;
  };
  // the dome over the crown, its rim coming down onto the brow band
  const dome = put(MeshBuilder.CreateSphere("brawlerHelmDome", {
    diameterX: 2 * e.x * B.domeWide, diameterY: 2 * e.y * B.domeTall, diameterZ: 2 * e.z * B.domeWide, segments: 10, slice: B.domeSlice,
  }, scene), helm);
  dome.position.y = e.y * B.domeRise;
  // the brow band, its foot on the eye line
  const band = put(MeshBuilder.CreateBox("brawlerHelmBand", {
    width: 2 * e.x * B.bandProud, height: e.y * B.band, depth: 2 * e.z * B.bandProud,
  }, scene), dark);
  band.position.y = e.y * B.eyeTop + e.y * B.band * 0.5;
  // the lower-face mask, stood proud of the face
  const maskH = (B.maskTop - B.maskBottom) * e.y;
  const mask = put(MeshBuilder.CreateBox("brawlerHelmMask", {
    width: 2 * e.x * B.maskWide, height: maskH, depth: 2 * e.z * B.maskDepth,
  }, scene), helm);
  mask.position.set(0, e.y * (B.maskTop + B.maskBottom) * 0.5, e.z * B.maskProud);
  // a cheek guard down each side of the mask, boxing the jaw in
  for (const side of [-1, 1]) {
    const cheek = put(MeshBuilder.CreateBox("brawlerHelmCheek", {
      width: e.x * B.cheek, height: (B.cheekTop - B.maskBottom) * e.y, depth: 2 * e.z * B.cheekDeep,
    }, scene), dark);
    cheek.position.set(side * e.x * (B.maskWide + B.cheek * 0.35), e.y * (B.cheekTop + B.maskBottom) * 0.5, 0);
  }
  // the nasal: from the brow band down between the eyes onto the mask
  const nasal = put(MeshBuilder.CreateBox("brawlerHelmNasal", {
    width: 2 * e.x * B.nasal * 0.5, height: (B.eyeTop - B.nasalLow) * e.y, depth: e.z * B.nasalProud,
  }, scene), leather);
  nasal.position.set(0, e.y * (B.eyeTop + B.nasalLow) * 0.5, e.z * 0.98);
  return out;
}
