import { Scene, Color3, Mesh, MeshBuilder, VertexBuffer } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";

// Renaissance faction hair, cloth and ornaments (loop v2: per-unit dress lives here, not in the builder monoliths).

/*
 * [S] the Painter's jabot (368; renaissance.painter.jpg, card Appearance "jabot": a broad tan ruffle in stacked tiers wrapping the throat, out past the neck
 * to the collar, the lowest tier just over the top of the chest; critic 367: a small tan triangle on the chest; the 333 jabot hung to mid-chest like a beard).
 * Three open ruffled collars stacked down the throat, each wider than the one above: tier i is (.across + i * .grow) head heights across at its foot,
 * .tall head heights tall, its top .lip of its foot; each sits .step head heights under the one above, the top one's top .over head heights above the
 * chest's top. Their foot rims are cut in .points ragged points (every other rim vertex dropped .ragged of the tier's height). Laid flatter front to back
 * (.flat of the chest's depth) and pushed .ahead of the chest's depth forward, so the ruffle bulges at the front. Self-lit tan cloth (.color, .glow).
 */
const PAINTER_JABOT = {
  tiers: 3, across: 1.05, grow: 0.22, tall: 0.2, lip: 0.62, step: 0.13, over: 0.3, points: 12, ragged: 0.35, flat: 1.35, ahead: 0.1,
  color: new Color3(0.8, 0.56, 0.28), glow: 0.3,
};

/** The Painter's stacked-tier jabot (spec at PAINTER_JABOT), parented to the torso. */
export function painterJabot(scene: Scene, body: ArticulatedBody): Mesh[] {
  const J = PAINTER_JABOT;
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const head = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2;
  const cloth = getMaterialFactory().get("cloth", J.color, { emissiveIntensity: J.glow });
  const top = chest.position.y + H * 0.5 + head * J.over;
  const added: Mesh[] = [];
  for (let i = 0; i < J.tiers; i++) {
    const across = head * (J.across + i * J.grow);
    const tall = head * J.tall;
    const tier = MeshBuilder.CreateCylinder(`${chest.name}_jabot${i}`, {
      height: tall, diameterTop: across * J.lip, diameterBottom: across, tessellation: J.points * 2, cap: Mesh.NO_CAP, sideOrientation: Mesh.DOUBLESIDE,
    }, scene);
    const at = tier.getVerticesData(VertexBuffer.PositionKind);
    if (at) {
      // the foot rim's every other vertex hangs lower: ragged ruffle points
      for (let v = 0; v < at.length; v += 3) {
        if (at[v + 1] > 0) continue;
        const k = Math.round(((Math.atan2(at[v + 2], at[v]) + Math.PI) / (2 * Math.PI)) * J.points * 2);
        if (k % 2 === 0) at[v + 1] -= tall * J.ragged;
      }
      tier.setVerticesData(VertexBuffer.PositionKind, at);
    }
    tier.convertToFlatShadedMesh();
    tier.scaling.z = Math.min(1, (D * J.flat) / across);
    tier.position.set(0, top - tall * 0.5 - head * J.step * i, D * J.ahead);
    tier.material = cloth;
    tier.parent = body.torso;
    added.push(tier);
  }
  return added;
}
