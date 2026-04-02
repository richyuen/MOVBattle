import {
  Scene, Mesh, MeshBuilder, StandardMaterial, Color3, Vector3, TransformNode,
} from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import type { AttachmentPreset, UnitVisualConfig, WeaponType, HatType, ShieldType, SpecialType } from "./unitVisuals";

export function attachProps(
  scene: Scene,
  body: ArticulatedBody,
  config: UnitVisualConfig,
  scale: number,
): Mesh[] {
  const props: Mesh[] = [];
  const accent = config.accentColor ? Color3.FromHexString(config.accentColor) : new Color3(0.5, 0.5, 0.5);

  const weapon = buildWeapon(scene, config.weapon, scale, accent);
  if (weapon) {
    weapon.parent = body.rightHand;
    if (config.attachmentPreset === "fan_bearer") {
      tagVisualState(weapon, "fan_closed");
    }
    props.push(weapon);
  }

  if (config.offhandWeapon) {
    const offhand = buildWeapon(scene, config.offhandWeapon, scale, accent);
    if (offhand) {
      offhand.parent = body.leftHand;
      props.push(offhand);
    }
  }

  const hat = buildHat(scene, config.hat, scale, accent);
  if (hat) {
    hat.parent = body.headTop;
    props.push(hat);
  }

  // Hide eyes behind face-covering headgear
  const faceCoveringHats: (HatType | undefined)[] = ["great_helm", "ninja_mask", "bone_mask"];
  if (faceCoveringHats.includes(config.hat)) {
    body.leftEye?.setEnabled(false);
    body.rightEye?.setEnabled(false);
    body.leftPupil?.setEnabled(false);
    body.rightPupil?.setEnabled(false);
  }

  const shield = buildShield(scene, config.shield, scale, accent);
  if (shield) {
    shield.parent = body.leftHand;
    props.push(shield);
  }

  const special = buildSpecial(scene, config.special, scale, accent, body);
  if (special) {
    props.push(special);
  }

  const extraAttachments = buildAttachmentPreset(scene, body, config.attachmentPreset ?? "none", scale, accent);
  props.push(...extraAttachments);

  return props;
}

function tagVisualState(mesh: Mesh, key: string): void {
  mesh.metadata = { ...(mesh.metadata ?? {}), visualKey: key };
}

function setTaggedVisibility(meshes: Mesh[], visible: boolean): void {
  for (const mesh of meshes) {
    mesh.isVisible = visible;
  }
}

function mat(scene: Scene, color: Color3, emissive = 0): StandardMaterial {
  const m = new StandardMaterial("prop", scene);
  m.diffuseColor = color;
  if (emissive > 0) m.emissiveColor = color.scale(emissive);
  m.specularColor = new Color3(0.06, 0.06, 0.06);
  return m;
}

function addGripWraps(
  scene: Scene,
  parent: Mesh,
  positions: number[],
  diameter: number,
): void {
  for (const posY of positions) {
    const wrap = MeshBuilder.CreateTorus("gripWrap", {
      diameter,
      thickness: diameter * 0.23,
      tessellation: 12,
    }, scene);
    wrap.position.y = posY;
    wrap.parent = parent;
    wrap.material = mat(scene, new Color3(0.3, 0.18, 0.08));
  }
}

function buildAttachmentPreset(
  scene: Scene,
  body: ArticulatedBody,
  preset: AttachmentPreset,
  s: number,
  accent: Color3,
): Mesh[] {
  const meshes: Mesh[] = [];
  const makeGlow = (name: string, diameter: number, color: Color3, parent: TransformNode, pos: Vector3, key: string): Mesh => {
    const glow = MeshBuilder.CreateSphere(name, { diameter, segments: 6 }, scene);
    glow.parent = parent;
    glow.position.copyFrom(pos);
    glow.material = mat(scene, color, 0.25);
    tagVisualState(glow, key);
    glow.isVisible = false;
    meshes.push(glow);
    return glow;
  };

  switch (preset) {
    case "none":
      return meshes;
    case "storm_halo": {
      const crown = MeshBuilder.CreateTorus("stormHalo", { diameter: 0.42 * s, thickness: 0.028 * s, tessellation: 26 }, scene);
      crown.parent = body.headTop;
      crown.position.y = 0.18 * s;
      crown.material = mat(scene, accent, 0.45);
      tagVisualState(crown, "storm_flare");
      crown.isVisible = false;
      meshes.push(crown);

      for (const side of [-1, 1]) {
        const spark = MeshBuilder.CreateBox("stormSpark", { width: 0.04 * s, height: 0.12 * s, depth: 0.04 * s }, scene);
        spark.parent = body.headTop;
        spark.position.set(side * 0.12 * s, 0.18 * s, 0.04 * s);
        spark.rotation.z = side * 0.45;
        spark.material = mat(scene, new Color3(0.9, 0.95, 1.0), 0.55);
        tagVisualState(spark, "storm_flare");
        spark.isVisible = false;
        meshes.push(spark);
      }
      return meshes;
    }
    case "crow_swarm": {
      for (const side of [-1, 1]) {
        const wing = MeshBuilder.CreatePlane("crowWing", { width: 0.18 * s, height: 0.1 * s }, scene);
        wing.parent = body.headTop;
        wing.position.set(side * 0.16 * s, 0.12 * s, 0.04 * s);
        wing.rotation.z = side * 0.55;
        wing.material = mat(scene, new Color3(0.12, 0.12, 0.14), 0.18);
        tagVisualState(wing, "crow_swarm");
        wing.isVisible = false;
        meshes.push(wing);
      }
      return meshes;
    }
    case "chrono_ring": {
      const ring = MeshBuilder.CreateTorus("chronoRing", { diameter: 0.55 * s, thickness: 0.022 * s, tessellation: 30 }, scene);
      ring.parent = body.torso;
      ring.position.set(0, 0.28 * s, 0.14 * s);
      ring.rotation.y = Math.PI / 2;
      ring.material = mat(scene, accent, 0.45);
      tagVisualState(ring, "chrono_ring");
      ring.isVisible = false;
      meshes.push(ring);
      return meshes;
    }
    case "shadow_orbit": {
      for (const side of [-1, 1]) {
        const shard = MeshBuilder.CreatePlane("shadowOrbit", { width: 0.16 * s, height: 0.2 * s }, scene);
        shard.parent = body.torso;
        shard.position.set(side * 0.24 * s, 0.2 * s, -0.06 * s);
        shard.rotation.y = side * 0.45;
        shard.material = mat(scene, new Color3(0.35, 0.28, 0.55), 0.38);
        tagVisualState(shard, "shadow_orbit");
        shard.isVisible = false;
        meshes.push(shard);
      }
      return meshes;
    }
    case "quickdraw_smoke": {
      const puff = MeshBuilder.CreateSphere("quickdrawSmoke", { diameter: 0.12 * s, segments: 6 }, scene);
      puff.parent = body.rightHand;
      puff.position.set(0.03 * s, 0.18 * s, 0.02 * s);
      puff.material = mat(scene, new Color3(0.88, 0.78, 0.52), 0.3);
      tagVisualState(puff, "quickdraw_smoke");
      puff.isVisible = false;
      meshes.push(puff);
      return meshes;
    }
    case "reaper_aura": {
      const arc = MeshBuilder.CreateDisc("reaperArc", { radius: 0.34 * s, tessellation: 24, arc: 0.45 }, scene);
      arc.parent = body.rightHand;
      arc.position.set(0.02 * s, 0.18 * s, 0.12 * s);
      arc.rotation.x = Math.PI / 2;
      arc.rotation.z = Math.PI * 0.55;
      arc.material = mat(scene, accent, 0.42);
      tagVisualState(arc, "reaper_arc");
      arc.isVisible = false;
      meshes.push(arc);

      for (const side of [-1, 1]) {
        const trail = MeshBuilder.CreatePlane("reaperTrail", { width: 0.18 * s, height: 0.28 * s }, scene);
        trail.parent = body.torso;
        trail.position.set(side * 0.22 * s, 0.18 * s, -0.12 * s);
        trail.rotation.y = side * 0.28;
        trail.material = mat(scene, accent, 0.22);
        tagVisualState(trail, "reaper_trail");
        trail.isVisible = false;
        meshes.push(trail);
      }
      return meshes;
    }
    case "super_aura": {
      const aura = MeshBuilder.CreateTorus("superAura", { diameter: 0.5 * s, thickness: 0.04 * s, tessellation: 28 }, scene);
      aura.parent = body.torso;
      aura.position.set(0, 0.26 * s, 0.06 * s);
      aura.rotation.y = Math.PI / 2;
      aura.material = mat(scene, accent, 0.5);
      tagVisualState(aura, "super_aura");
      aura.isVisible = false;
      meshes.push(aura);
      return meshes;
    }
    case "fan_bearer": {
      const openFan = MeshBuilder.CreateDisc("openFan", { radius: 0.22 * s, tessellation: 18, arc: 0.55 }, scene);
      openFan.parent = body.rightHand;
      openFan.rotation.z = Math.PI * 0.5;
      openFan.position.y = 0.12 * s;
      openFan.material = mat(scene, accent, 0.1);
      tagVisualState(openFan, "fan_open");
      openFan.isVisible = false;
      meshes.push(openFan);

      const gust = MeshBuilder.CreateTorus("gustRing", { diameter: 0.52 * s, thickness: 0.02 * s, tessellation: 24 }, scene);
      gust.parent = body.torso;
      gust.position.set(0, 0.26 * s, 0.28 * s);
      gust.rotation.y = Math.PI / 2;
      gust.material = mat(scene, accent, 0.3);
      tagVisualState(gust, "gust_ring");
      gust.isVisible = false;
      meshes.push(gust);
      return meshes;
    }
    case "bow_ready": {
      makeGlow("drawnArrow", 0.06 * s, accent.scale(1.05), body.rightHand, new Vector3(0, 0.18 * s, 0.04 * s), "drawn_arrow");
      return meshes;
    }
    case "crossbow_ready": {
      const bolt = MeshBuilder.CreateBox("readyBolt", { width: 0.018 * s, height: 0.18 * s, depth: 0.018 * s }, scene);
      bolt.parent = body.rightHand;
      bolt.position.set(0, 0.18 * s, 0.04 * s);
      bolt.rotation.z = Math.PI / 2;
      bolt.material = mat(scene, new Color3(0.82, 0.82, 0.88));
      tagVisualState(bolt, "crossbow_bolt");
      bolt.isVisible = false;
      meshes.push(bolt);
      return meshes;
    }
    case "shouter": {
      const ring = MeshBuilder.CreateTorus("shoutRing", { diameter: 0.7 * s, thickness: 0.025 * s, tessellation: 20 }, scene);
      ring.parent = body.neck;
      ring.position.set(0, 0.08 * s, 0.18 * s);
      ring.rotation.y = Math.PI / 2;
      ring.material = mat(scene, accent, 0.35);
      tagVisualState(ring, "shout_ring");
      ring.isVisible = false;
      meshes.push(ring);
      return meshes;
    }
    case "cheerleader": {
      for (const hand of [body.leftHand, body.rightHand]) {
        const ribbon = MeshBuilder.CreateBox("streamer", { width: 0.04 * s, height: 0.12 * s, depth: 0.02 * s }, scene);
        ribbon.parent = hand;
        ribbon.position.set(0, 0.08 * s, -0.05 * s);
        ribbon.material = mat(scene, accent, 0.2);
        tagVisualState(ribbon, "pom_streamers");
        ribbon.isVisible = false;
        meshes.push(ribbon);
      }
      return meshes;
    }
    case "summoner": {
      for (const side of [-1, 1]) {
        makeGlow("summonOrb", 0.09 * s, accent, body.torso, new Vector3(side * 0.18 * s, 0.24 * s, 0.08 * s), "summon_orbs");
      }
      return meshes;
    }
    case "infernal_whip": {
      const lash = MeshBuilder.CreateCylinder("flameLash", { height: 0.28 * s, diameterTop: 0.01 * s, diameterBottom: 0.05 * s, tessellation: 6 }, scene);
      lash.parent = body.rightHand;
      lash.position.set(0.08 * s, 0.22 * s, 0);
      lash.rotation.z = -0.7;
      lash.material = mat(scene, new Color3(1, 0.45, 0.12), 0.5);
      tagVisualState(lash, "flame_lash");
      lash.isVisible = false;
      meshes.push(lash);
      return meshes;
    }
    case "hero_halo": {
      const flare = MeshBuilder.CreateTorus("haloFlare", { diameter: 0.38 * s, thickness: 0.03 * s, tessellation: 28 }, scene);
      flare.parent = body.headTop;
      flare.position.y = 0.22 * s;
      flare.material = mat(scene, accent, 0.45);
      tagVisualState(flare, "halo_flare");
      flare.isVisible = false;
      meshes.push(flare);
      return meshes;
    }
    case "ghost_trail": {
      for (const side of [-1, 1]) {
        const trail = MeshBuilder.CreatePlane("ghostTrail", { width: 0.18 * s, height: 0.26 * s }, scene);
        trail.parent = body.torso;
        trail.position.set(side * 0.22 * s, 0.18 * s, -0.16 * s);
        trail.rotation.y = side * 0.3;
        trail.material = mat(scene, accent, 0.22);
        tagVisualState(trail, "ghost_stream");
        trail.isVisible = false;
        meshes.push(trail);
      }
      return meshes;
    }
    case "giant_aura": {
      for (const side of [-1, 1]) {
        const shard = MeshBuilder.CreateBox("giantShard", { width: 0.08 * s, height: 0.18 * s, depth: 0.05 * s }, scene);
        shard.parent = body.torso;
        shard.position.set(side * 0.28 * s, 0.24 * s, -0.04 * s);
        shard.rotation.z = side * 0.35;
        shard.material = mat(scene, accent, 0.2);
        tagVisualState(shard, "giant_shards");
        shard.isVisible = false;
        meshes.push(shard);
      }
      return meshes;
    }
    case "present_elf": {
      const sparkle = MeshBuilder.CreateSphere("presentSpark", { diameter: 0.08 * s, segments: 6 }, scene);
      sparkle.parent = body.rightHand;
      sparkle.position.set(0, 0.16 * s, 0);
      sparkle.material = mat(scene, new Color3(1, 1, 1), 0.4);
      tagVisualState(sparkle, "present_spark");
      sparkle.isVisible = false;
      meshes.push(sparkle);
      return meshes;
    }
    case "bank_robbers": {
      const loot = MeshBuilder.CreateBox("lootFlash", { width: 0.06 * s, height: 0.03 * s, depth: 0.1 * s }, scene);
      loot.parent = body.hip;
      loot.position.set(0.02 * s, 0.02 * s, -0.02 * s);
      loot.material = mat(scene, new Color3(1, 0.85, 0.35), 0.35);
      tagVisualState(loot, "loot_flash");
      loot.isVisible = false;
      meshes.push(loot);
      return meshes;
    }
    case "bomb_lit": {
      makeGlow("litFuse", 0.04 * s, new Color3(1, 0.75, 0.2), body.rightHand, new Vector3(0.02 * s, 0.18 * s, 0), "lit_fuse");
      return meshes;
    }
    case "dragon_cart_fx": {
      const glow = MeshBuilder.CreateSphere("dragonGlow", { diameter: 0.1 * s, segments: 6 }, scene);
      glow.parent = body.hip;
      glow.position.set(0, 0.02 * s, 0.28 * s);
      glow.material = mat(scene, accent, 0.35);
      tagVisualState(glow, "dragon_glow");
      glow.isVisible = false;
      meshes.push(glow);
      return meshes;
    }
    default:
      return meshes;
  }
}

// ─── Weapons ───
function buildWeapon(scene: Scene, type: WeaponType, _s: number, accent: Color3): Mesh | null {
  const s = _s * 1.25; // TABS-style weapon exaggeration
  switch (type) {
    case "none": return null;

    case "club": {
      const m = MeshBuilder.CreateCylinder("club", { height: 0.5 * s, diameter: 0.06 * s, tessellation: 6 }, scene);
      const head = MeshBuilder.CreateSphere("clubHead", { diameter: 0.14 * s, segments: 6 }, scene);
      head.position.y = 0.25 * s;
      head.parent = m;
      head.material = mat(scene, accent);
      m.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      m.rotation.x = Math.PI * 0.1;
      return m;
    }
    case "sword":
    case "cutlass": {
      const blade = MeshBuilder.CreateBox("blade", { width: 0.03 * s, height: 0.5 * s, depth: 0.008 * s }, scene);
      blade.material = mat(scene, new Color3(0.8, 0.8, 0.85));
      const guard = MeshBuilder.CreateBox("guard", { width: 0.12 * s, height: 0.02 * s, depth: 0.02 * s }, scene);
      guard.position.y = -0.15 * s;
      guard.parent = blade;
      guard.material = mat(scene, accent);
      const grip = MeshBuilder.CreateCylinder("grip", { height: 0.1 * s, diameter: 0.025 * s }, scene);
      grip.position.y = -0.22 * s;
      grip.parent = blade;
      grip.material = mat(scene, new Color3(0.35, 0.2, 0.1));
      addGripWraps(scene, grip, [-0.03 * s, 0, 0.03 * s], 0.03 * s);
      blade.position.y = 0.15 * s;
      return blade;
    }
    case "greatsword": {
      const blade = MeshBuilder.CreateBox("gsblade", { width: 0.04 * s, height: 0.75 * s, depth: 0.01 * s }, scene);
      blade.material = mat(scene, new Color3(0.8, 0.8, 0.85));
      const guard = MeshBuilder.CreateBox("gsguard", { width: 0.16 * s, height: 0.025 * s, depth: 0.025 * s }, scene);
      guard.position.y = -0.22 * s;
      guard.parent = blade;
      guard.material = mat(scene, accent);
      blade.position.y = 0.2 * s;
      return blade;
    }
    case "rapier": {
      const blade = MeshBuilder.CreateCylinder("rapier", { height: 0.6 * s, diameter: 0.015 * s, tessellation: 6 }, scene);
      blade.material = mat(scene, new Color3(0.85, 0.85, 0.9));
      const guard = MeshBuilder.CreateTorus("rguard", { diameter: 0.08 * s, thickness: 0.01 * s, tessellation: 12 }, scene);
      guard.position.y = -0.2 * s;
      guard.rotation.x = Math.PI / 2;
      guard.parent = blade;
      guard.material = mat(scene, accent);
      blade.position.y = 0.15 * s;
      return blade;
    }
    case "katana": {
      const blade = MeshBuilder.CreateBox("katana", { width: 0.025 * s, height: 0.6 * s, depth: 0.006 * s }, scene);
      blade.material = mat(scene, new Color3(0.9, 0.9, 0.95));
      blade.position.y = 0.15 * s;
      blade.rotation.z = 0.05;
      return blade;
    }
    case "spear":
    case "javelin":
    case "harpoon": {
      const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.9 * s, diameter: 0.03 * s, tessellation: 6 }, scene);
      shaft.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      const tip = MeshBuilder.CreateCylinder("tip", { height: 0.12 * s, diameterTop: 0, diameterBottom: 0.05 * s, tessellation: 4 }, scene);
      tip.position.y = 0.5 * s;
      tip.parent = shaft;
      tip.material = mat(scene, type === "harpoon" ? new Color3(0.6, 0.6, 0.65) : accent);
      shaft.position.y = 0.2 * s;
      return shaft;
    }
    case "axe": {
      const handle = MeshBuilder.CreateCylinder("handle", { height: 0.5 * s, diameter: 0.03 * s }, scene);
      handle.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      addGripWraps(scene, handle, [-0.12 * s, -0.04 * s, 0.04 * s], 0.035 * s);
      const head = MeshBuilder.CreateBox("axehead", { width: 0.15 * s, height: 0.12 * s, depth: 0.02 * s }, scene);
      head.position.y = 0.22 * s;
      head.position.x = 0.04 * s;
      head.parent = handle;
      head.material = mat(scene, new Color3(0.6, 0.6, 0.65));
      handle.position.y = 0.1 * s;
      return handle;
    }
    case "hammer":
    case "mace": {
      const handle = MeshBuilder.CreateCylinder("handle", { height: 0.5 * s, diameter: 0.035 * s }, scene);
      handle.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      addGripWraps(scene, handle, [-0.12 * s, -0.04 * s, 0.04 * s], 0.04 * s);
      const head = MeshBuilder.CreateBox("hammerhead", { width: 0.14 * s, height: 0.1 * s, depth: 0.1 * s }, scene);
      head.position.y = 0.28 * s;
      head.parent = handle;
      head.material = mat(scene, accent);
      handle.position.y = 0.1 * s;
      return handle;
    }
    case "halberd": {
      const shaft = MeshBuilder.CreateCylinder("shaft", { height: 1.0 * s, diameter: 0.03 * s }, scene);
      shaft.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      addGripWraps(scene, shaft, [-0.26 * s, -0.14 * s, -0.02 * s], 0.035 * s);
      const blade = MeshBuilder.CreateBox("hblade", { width: 0.12 * s, height: 0.18 * s, depth: 0.01 * s }, scene);
      blade.position.y = 0.45 * s; blade.position.x = 0.04 * s;
      blade.parent = shaft;
      blade.material = mat(scene, new Color3(0.7, 0.7, 0.75));
      shaft.position.y = 0.2 * s;
      return shaft;
    }
    case "lance": {
      const shaft = MeshBuilder.CreateCylinder("lance", { height: 1.2 * s, diameter: 0.04 * s }, scene);
      shaft.material = mat(scene, accent);
      const tip = MeshBuilder.CreateCylinder("ltip", { height: 0.15 * s, diameterTop: 0, diameterBottom: 0.06 * s, tessellation: 4 }, scene);
      tip.position.y = 0.65 * s; tip.parent = shaft;
      tip.material = mat(scene, new Color3(0.8, 0.8, 0.85));
      shaft.position.y = 0.2 * s;
      shaft.rotation.x = -0.3;
      return shaft;
    }
    case "staff":
    case "bone_staff":
    case "bo_staff": {
      const color = type === "bone_staff" ? new Color3(0.9, 0.85, 0.75)
        : type === "bo_staff" ? new Color3(0.6, 0.35, 0.15)
        : new Color3(0.5, 0.35, 0.2);
      const shaft = MeshBuilder.CreateCylinder("staff", { height: 0.85 * s, diameter: 0.03 * s }, scene);
      shaft.material = mat(scene, color);
      if (type === "staff" || type === "bone_staff") {
        const orb = MeshBuilder.CreateSphere("orb", { diameter: 0.1 * s, segments: 8 }, scene);
        orb.position.y = 0.42 * s; orb.parent = shaft;
        orb.material = mat(scene, accent, 0.3);
      }
      shaft.position.y = 0.2 * s;
      return shaft;
    }
    case "bow":
    case "crossbow": {
      // Approximate bow with a curved cylinder
      const bowHeight = type === "crossbow" ? 0.25 : 0.4;
      const bowMesh = MeshBuilder.CreateCylinder("bow", {
        height: bowHeight * s, diameter: 0.025 * s, tessellation: 8,
      }, scene);
      bowMesh.material = mat(scene, new Color3(0.5, 0.35, 0.15));
      // String
      const string = MeshBuilder.CreateCylinder("string", {
        height: bowHeight * s * 0.9, diameter: 0.006 * s, tessellation: 4,
      }, scene);
      string.position.z = 0.04 * s;
      string.parent = bowMesh;
      string.material = mat(scene, new Color3(0.8, 0.75, 0.65));
      bowMesh.rotation.z = Math.PI / 2;
      bowMesh.position.y = 0.1 * s;
      return bowMesh;
    }
    case "blunderbuss": {
      // Short barrel with flared bell muzzle
      const barrel = MeshBuilder.CreateCylinder("barrel", { height: 0.35 * s, diameter: 0.04 * s, tessellation: 8 }, scene);
      barrel.material = mat(scene, new Color3(0.3, 0.3, 0.35));
      // Flared muzzle bell
      const bell = MeshBuilder.CreateCylinder("bell", {
        height: 0.1 * s, diameterTop: 0.12 * s, diameterBottom: 0.04 * s, tessellation: 10,
      }, scene);
      bell.position.y = 0.22 * s;
      bell.parent = barrel;
      bell.material = mat(scene, new Color3(0.35, 0.35, 0.4));
      // Wood stock
      const stock = MeshBuilder.CreateBox("stock", { width: 0.05 * s, height: 0.18 * s, depth: 0.035 * s }, scene);
      stock.position.y = -0.2 * s;
      stock.parent = barrel;
      stock.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      barrel.rotation.x = -0.2;
      barrel.position.y = 0.12 * s;
      return barrel;
    }
    case "musket":
    case "flintlock":
    case "cannon_hand": {
      const len = type === "cannon_hand" ? 0.7 : type === "musket" ? 0.65 : 0.35;
      const diam = type === "cannon_hand" ? 0.08 : 0.03;
      const barrel = MeshBuilder.CreateCylinder("barrel", { height: len * s, diameter: diam * s, tessellation: 8 }, scene);
      barrel.material = mat(scene, new Color3(0.3, 0.3, 0.35));
      const stock = MeshBuilder.CreateBox("stock", { width: 0.04 * s, height: 0.15 * s, depth: 0.03 * s }, scene);
      stock.position.y = -len * s * 0.45;
      stock.parent = barrel;
      stock.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      barrel.rotation.x = -0.2;
      barrel.position.y = 0.12 * s;
      return barrel;
    }
    case "bomb": {
      const bomb = MeshBuilder.CreateSphere("bomb", { diameter: 0.15 * s, segments: 8 }, scene);
      bomb.material = mat(scene, new Color3(0.2, 0.2, 0.2));
      const fuse = MeshBuilder.CreateCylinder("fuse", { height: 0.08 * s, diameter: 0.01 * s }, scene);
      fuse.position.y = 0.08 * s; fuse.parent = bomb;
      fuse.material = mat(scene, new Color3(0.8, 0.6, 0.2), 0.3);
      return bomb;
    }
    case "torch": {
      const handle = MeshBuilder.CreateCylinder("torch", { height: 0.35 * s, diameter: 0.03 * s }, scene);
      handle.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      const flame = MeshBuilder.CreateSphere("flame", { diameter: 0.1 * s, segments: 6 }, scene);
      flame.position.y = 0.2 * s; flame.parent = handle;
      flame.material = mat(scene, new Color3(1, 0.6, 0.1), 0.5);
      handle.position.y = 0.05 * s;
      return handle;
    }
    case "dagger":
    case "shuriken_hand": {
      const blade = MeshBuilder.CreateBox("dagger", { width: 0.02 * s, height: 0.18 * s, depth: 0.005 * s }, scene);
      blade.material = mat(scene, new Color3(0.8, 0.8, 0.85));
      blade.position.y = 0.05 * s;
      return blade;
    }
    case "blowgun": {
      const tube = MeshBuilder.CreateCylinder("blowgun", { height: 0.38 * s, diameter: 0.026 * s, tessellation: 8 }, scene);
      tube.rotation.z = Math.PI / 2;
      tube.position.y = 0.14 * s;
      tube.material = mat(scene, new Color3(0.36, 0.22, 0.08));
      const dart = MeshBuilder.CreateCylinder("blowdart", { height: 0.1 * s, diameterTop: 0, diameterBottom: 0.016 * s, tessellation: 6 }, scene);
      dart.position.set(0.16 * s, 0.14 * s, 0);
      dart.rotation.z = -Math.PI / 2;
      dart.parent = tube;
      dart.material = mat(scene, new Color3(0.72, 0.82, 0.48));
      return tube;
    }
    case "scythe": {
      const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.8 * s, diameter: 0.025 * s }, scene);
      shaft.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      addGripWraps(scene, shaft, [-0.18 * s, -0.08 * s, 0.02 * s], 0.03 * s);
      const blade = MeshBuilder.CreateBox("scyblade", { width: 0.2 * s, height: 0.04 * s, depth: 0.005 * s }, scene);
      blade.position.y = 0.38 * s; blade.position.x = 0.08 * s;
      blade.rotation.z = -0.3;
      blade.parent = shaft;
      blade.material = mat(scene, new Color3(0.7, 0.7, 0.75));
      shaft.position.y = 0.2 * s;
      return shaft;
    }
    case "pitchfork": {
      const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.7 * s, diameter: 0.025 * s }, scene);
      shaft.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      for (let i = -1; i <= 1; i++) {
        const tine = MeshBuilder.CreateCylinder("tine", { height: 0.15 * s, diameter: 0.012 * s }, scene);
        tine.position.y = 0.4 * s; tine.position.x = i * 0.03 * s;
        tine.parent = shaft;
        tine.material = mat(scene, new Color3(0.6, 0.6, 0.65));
      }
      shaft.position.y = 0.15 * s;
      return shaft;
    }
    case "frying_pan": {
      const pan = MeshBuilder.CreateCylinder("pan", { height: 0.02 * s, diameter: 0.16 * s, tessellation: 12 }, scene);
      pan.material = mat(scene, new Color3(0.3, 0.3, 0.3));
      const handle = MeshBuilder.CreateCylinder("panhandle", { height: 0.15 * s, diameter: 0.02 * s }, scene);
      handle.position.y = -0.1 * s; handle.parent = pan;
      handle.material = mat(scene, new Color3(0.4, 0.25, 0.1));
      pan.position.y = 0.1 * s;
      return pan;
    }
    case "lute": {
      const body = MeshBuilder.CreateSphere("lute", { diameter: 0.14 * s, segments: 8 }, scene);
      body.scaling.z = 0.5;
      body.material = mat(scene, new Color3(0.6, 0.4, 0.2));
      const neck = MeshBuilder.CreateCylinder("luteneck", { height: 0.2 * s, diameter: 0.02 * s }, scene);
      neck.position.y = 0.12 * s; neck.parent = body;
      neck.material = mat(scene, new Color3(0.5, 0.35, 0.15));
      return body;
    }
    case "paintbrush": {
      const handle = MeshBuilder.CreateCylinder("brush", { height: 0.35 * s, diameter: 0.02 * s }, scene);
      handle.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      const tip = MeshBuilder.CreateBox("tip", { width: 0.04 * s, height: 0.06 * s, depth: 0.02 * s }, scene);
      tip.position.y = 0.2 * s; tip.parent = handle;
      tip.material = mat(scene, accent, 0.2);
      handle.position.y = 0.05 * s;
      return handle;
    }
    case "nunchaku": {
      const a = MeshBuilder.CreateCylinder("n1", { height: 0.18 * s, diameter: 0.025 * s }, scene);
      a.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      const b = MeshBuilder.CreateCylinder("n2", { height: 0.18 * s, diameter: 0.025 * s }, scene);
      b.position.y = 0.22 * s; b.rotation.z = 0.4; b.parent = a;
      b.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      a.position.y = 0.05 * s;
      return a;
    }
    case "broom":
    case "wheelbarrow_weapon":
    case "shield_sword":
      return buildWeapon(scene, "sword", s, accent);
    case "stone": {
      const rock = MeshBuilder.CreateSphere("stone", { diameter: 0.12 * s, segments: 6 }, scene);
      rock.material = mat(scene, new Color3(0.55, 0.55, 0.5));
      rock.position.y = 0.06 * s;
      return rock;
    }
    case "hay_bale": {
      const bale = MeshBuilder.CreateBox("bale", { width: 0.25 * s, height: 0.18 * s, depth: 0.2 * s }, scene);
      bale.material = mat(scene, new Color3(0.82, 0.72, 0.28));
      // Twine bands
      const band = MeshBuilder.CreateBox("band", { width: 0.26 * s, height: 0.015 * s, depth: 0.21 * s }, scene);
      band.position.y = 0.03 * s; band.parent = bale;
      band.material = mat(scene, new Color3(0.6, 0.45, 0.2));
      bale.position.y = 0.1 * s;
      return bale;
    }
    case "potion": {
      const flask = MeshBuilder.CreateCylinder("flask", { height: 0.12 * s, diameterTop: 0.04 * s, diameterBottom: 0.07 * s, tessellation: 8 }, scene);
      flask.material = mat(scene, accent, 0.2);
      const stopper = MeshBuilder.CreateSphere("stopper", { diameter: 0.04 * s, segments: 6 }, scene);
      stopper.position.y = 0.08 * s; stopper.parent = flask;
      stopper.material = mat(scene, new Color3(0.55, 0.3, 0.15));
      const neck = MeshBuilder.CreateCylinder("neck", { height: 0.04 * s, diameter: 0.025 * s, tessellation: 6 }, scene);
      neck.position.y = 0.06 * s; neck.parent = flask;
      neck.material = mat(scene, accent, 0.15);
      flask.position.y = 0.08 * s;
      return flask;
    }
    case "lightning_bolt": {
      const bolt = new TransformNode("bolt", scene) as unknown as Mesh;
      const yellow = new Color3(1, 0.9, 0.2);
      const seg1 = MeshBuilder.CreateBox("seg1", { width: 0.06 * s, height: 0.2 * s, depth: 0.02 * s }, scene);
      seg1.material = mat(scene, yellow, 0.6);
      seg1.position.set(0.02 * s, 0.3 * s, 0); seg1.rotation.z = 0.3; seg1.parent = bolt;
      const seg2 = MeshBuilder.CreateBox("seg2", { width: 0.06 * s, height: 0.2 * s, depth: 0.02 * s }, scene);
      seg2.material = mat(scene, yellow, 0.6);
      seg2.position.set(-0.02 * s, 0.12 * s, 0); seg2.rotation.z = -0.3; seg2.parent = bolt;
      const seg3 = MeshBuilder.CreateBox("seg3", { width: 0.05 * s, height: 0.15 * s, depth: 0.02 * s }, scene);
      seg3.material = mat(scene, yellow, 0.6);
      seg3.position.set(0.01 * s, -0.04 * s, 0); seg3.rotation.z = 0.2; seg3.parent = bolt;
      return bolt;
    }
    case "fan": {
      const root = new TransformNode("fan", scene) as unknown as Mesh;
      const handle = MeshBuilder.CreateCylinder("fanHandle", { height: 0.2 * s, diameter: 0.02 * s, tessellation: 6 }, scene);
      handle.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      handle.position.y = -0.04 * s;
      handle.parent = root;
      for (let i = -3; i <= 3; i++) {
        const rib = MeshBuilder.CreateBox("fanRib", { width: 0.018 * s, height: 0.22 * s, depth: 0.01 * s }, scene);
        rib.position.set(i * 0.03 * s, 0.1 * s, 0);
        rib.rotation.z = i * 0.18;
        rib.parent = root;
        rib.material = mat(scene, accent, 0.1);
      }
      return root;
    }
    case "flail": {
      const handle = MeshBuilder.CreateCylinder("flailHandle", { height: 0.35 * s, diameter: 0.03 * s, tessellation: 6 }, scene);
      handle.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      const chain = MeshBuilder.CreateCylinder("flailChain", { height: 0.18 * s, diameter: 0.01 * s, tessellation: 4 }, scene);
      chain.position.y = 0.18 * s;
      chain.parent = handle;
      chain.material = mat(scene, new Color3(0.45, 0.45, 0.5));
      const ball = MeshBuilder.CreateSphere("flailBall", { diameter: 0.12 * s, segments: 6 }, scene);
      ball.position.y = 0.3 * s;
      ball.parent = handle;
      ball.material = mat(scene, accent);
      handle.position.y = 0.08 * s;
      return handle;
    }
    case "whip": {
      const root = new TransformNode("whip", scene) as unknown as Mesh;
      const handle = MeshBuilder.CreateCylinder("whipHandle", { height: 0.18 * s, diameter: 0.025 * s, tessellation: 6 }, scene);
      handle.material = mat(scene, new Color3(0.25, 0.15, 0.1));
      handle.parent = root;
      for (let i = 0; i < 4; i++) {
        const seg = MeshBuilder.CreateCylinder("whipSeg", { height: 0.1 * s, diameter: Math.max(0.008, 0.018 - i * 0.002) * s, tessellation: 4 }, scene);
        seg.position.set(0.02 * s * i, 0.08 * s + i * 0.07 * s, 0);
        seg.rotation.z = 0.2 + i * 0.15;
        seg.parent = root;
        seg.material = mat(scene, accent, 0.08);
      }
      return root;
    }
    case "present_box": {
      const box = MeshBuilder.CreateBox("present", { width: 0.16 * s, height: 0.16 * s, depth: 0.16 * s }, scene);
      box.material = mat(scene, accent, 0.08);
      const ribbonA = MeshBuilder.CreateBox("ribbonA", { width: 0.03 * s, height: 0.17 * s, depth: 0.17 * s }, scene);
      ribbonA.parent = box;
      ribbonA.material = mat(scene, new Color3(0.95, 0.95, 0.95));
      const ribbonB = MeshBuilder.CreateBox("ribbonB", { width: 0.17 * s, height: 0.17 * s, depth: 0.03 * s }, scene);
      ribbonB.parent = box;
      ribbonB.material = mat(scene, new Color3(0.95, 0.95, 0.95));
      box.position.y = 0.08 * s;
      return box;
    }
    case "pom_pom": {
      const root = new TransformNode("pompom", scene) as unknown as Mesh;
      for (let i = 0; i < 6; i++) {
        const puff = MeshBuilder.CreateSphere("puff", { diameter: 0.07 * s, segments: 4 }, scene);
        const angle = (Math.PI * 2 * i) / 6;
        puff.position.set(Math.cos(angle) * 0.04 * s, Math.sin(angle) * 0.04 * s + 0.08 * s, 0);
        puff.parent = root;
        puff.material = mat(scene, accent, 0.15);
      }
      return root;
    }
    default:
      return null;
  }
}

// ─── Hats ───
function buildHat(scene: Scene, type: HatType, _s: number, accent: Color3): Mesh | null {
  const s = _s * 1.1; // TABS-style hat exaggeration
  switch (type) {
    case "none": return null;
    case "crown": {
      const crown = MeshBuilder.CreateTorus("crown", { diameter: 0.2 * s, thickness: 0.04 * s, tessellation: 16 }, scene);
      crown.material = mat(scene, new Color3(1, 0.84, 0), 0.15);
      // Points
      for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 2 / 5;
        const pt = MeshBuilder.CreateCylinder("crpt", { height: 0.12 * s, diameterTop: 0, diameterBottom: 0.04 * s, tessellation: 4 }, scene);
        pt.position.set(Math.cos(a) * 0.08 * s, 0.03 * s, Math.sin(a) * 0.08 * s);
        pt.parent = crown;
        pt.material = mat(scene, new Color3(1, 0.84, 0), 0.15);
        const jewel = MeshBuilder.CreateSphere("crjewel", { diameter: 0.025 * s, segments: 4 }, scene);
        jewel.position.y = 0.06 * s;
        jewel.parent = pt;
        jewel.material = mat(scene, new Color3(0.8, 0.1, 0.1), 0.3);
      }
      crown.position.y = 0.02 * s;
      return crown;
    }
    case "helmet":
    case "plume_helmet": {
      const helm = MeshBuilder.CreateSphere("helm", { diameter: 0.26 * s, segments: 8, slice: 0.55 }, scene);
      helm.material = mat(scene, new Color3(0.6, 0.6, 0.65));
      helm.rotation.x = Math.PI;
      helm.position.y = 0.05 * s;
      if (type === "plume_helmet") {
        const plume = MeshBuilder.CreateBox("plume", { width: 0.03 * s, height: 0.15 * s, depth: 0.12 * s }, scene);
        plume.position.y = 0.1 * s;
        plume.parent = helm;
        plume.material = mat(scene, accent, 0.1);
      }
      return helm;
    }
    case "viking_helmet": {
      const helm = MeshBuilder.CreateSphere("vhelm", { diameter: 0.26 * s, segments: 8, slice: 0.55 }, scene);
      helm.material = mat(scene, new Color3(0.5, 0.5, 0.55));
      helm.rotation.x = Math.PI;
      helm.position.y = 0.05 * s;
      const noseGuard = MeshBuilder.CreateBox("nose", { width: 0.015 * s, height: 0.1 * s, depth: 0.01 * s }, scene);
      noseGuard.position.set(0, -0.02 * s, 0.1 * s);
      noseGuard.parent = helm;
      noseGuard.material = mat(scene, new Color3(0.5, 0.5, 0.55));
      // Iconic viking horns
      for (const side of [-1, 1]) {
        const horn = MeshBuilder.CreateCylinder("vhorn", { height: 0.22 * s, diameterTop: 0, diameterBottom: 0.055 * s, tessellation: 6 }, scene);
        horn.position.set(side * 0.1 * s, 0.08 * s, 0);
        horn.rotation.z = -side * 0.4;
        horn.parent = helm;
        horn.material = mat(scene, new Color3(0.9, 0.85, 0.7));
      }
      return helm;
    }
    case "horned_helmet": {
      const helm = MeshBuilder.CreateSphere("hhelm", { diameter: 0.26 * s, segments: 8, slice: 0.55 }, scene);
      helm.material = mat(scene, new Color3(0.5, 0.5, 0.55));
      helm.rotation.x = Math.PI;
      helm.position.y = 0.05 * s;
      for (const side of [-1, 1]) {
        const horn = MeshBuilder.CreateCylinder("horn", { height: 0.28 * s, diameterTop: 0, diameterBottom: 0.07 * s, tessellation: 6 }, scene);
        horn.position.set(side * 0.1 * s, 0.08 * s, 0);
        horn.rotation.z = -side * 0.5;
        horn.parent = helm;
        horn.material = mat(scene, new Color3(0.9, 0.85, 0.7));
      }
      return helm;
    }
    case "hood": {
      const hood = MeshBuilder.CreateCylinder("hood", { height: 0.18 * s, diameterTop: 0.04 * s, diameterBottom: 0.24 * s, tessellation: 8 }, scene);
      hood.material = mat(scene, accent.scale(0.6));
      hood.position.y = 0.05 * s;
      return hood;
    }
    case "turban": {
      const turban = MeshBuilder.CreateSphere("turban", { diameter: 0.24 * s, segments: 8 }, scene);
      turban.scaling.y = 0.7;
      turban.material = mat(scene, new Color3(0.9, 0.9, 0.85));
      turban.position.y = 0.04 * s;
      return turban;
    }
    case "conical_hat": {
      const hat = MeshBuilder.CreateCylinder("conehat", { height: 0.25 * s, diameterTop: 0, diameterBottom: 0.3 * s, tessellation: 12 }, scene);
      hat.material = mat(scene, accent.scale(0.5));
      hat.position.y = 0.08 * s;
      return hat;
    }
    case "witch_hat": {
      const brim = MeshBuilder.CreateCylinder("witchBrim", { height: 0.02 * s, diameter: 0.34 * s, tessellation: 18 }, scene);
      brim.material = mat(scene, new Color3(0.14, 0.12, 0.18));
      brim.position.y = 0.04 * s;
      const cone = MeshBuilder.CreateCylinder("witchCone", { height: 0.24 * s, diameterTop: 0.02 * s, diameterBottom: 0.18 * s, tessellation: 12 }, scene);
      cone.parent = brim;
      cone.position.set(-0.03 * s, 0.14 * s, 0);
      cone.rotation.z = 0.08;
      cone.material = mat(scene, new Color3(0.15, 0.13, 0.2));
      const band = MeshBuilder.CreateTorus("witchBand", { diameter: 0.16 * s, thickness: 0.012 * s, tessellation: 18 }, scene);
      band.parent = cone;
      band.position.y = -0.04 * s;
      band.material = mat(scene, accent, 0.08);
      return brim;
    }
    case "samurai_helmet": {
      const helm = MeshBuilder.CreateSphere("shelm", { diameter: 0.26 * s, segments: 8, slice: 0.55 }, scene);
      helm.material = mat(scene, accent.scale(0.7));
      helm.rotation.x = Math.PI;
      helm.position.y = 0.05 * s;
      const neckGuard = MeshBuilder.CreateBox("samuraiNeckGuard", { width: 0.24 * s, height: 0.08 * s, depth: 0.03 * s }, scene);
      neckGuard.position.set(0, -0.04 * s, -0.1 * s);
      neckGuard.parent = helm;
      neckGuard.material = mat(scene, accent.scale(0.55));
      const faceGuard = MeshBuilder.CreateBox("samuraiFaceGuard", { width: 0.08 * s, height: 0.07 * s, depth: 0.03 * s }, scene);
      faceGuard.position.set(0, -0.03 * s, 0.11 * s);
      faceGuard.parent = helm;
      faceGuard.material = mat(scene, accent.scale(0.6));
      const crest = MeshBuilder.CreateDisc("crest", { radius: 0.14 * s, tessellation: 18, arc: 0.5 }, scene);
      crest.position.y = 0.13 * s;
      crest.parent = helm;
      crest.rotation.z = Math.PI;
      crest.material = mat(scene, new Color3(1, 0.84, 0), 0.1);
      return helm;
    }
    case "ninja_mask": {
      // Hood covering head
      const hood = MeshBuilder.CreateSphere("hood", { diameter: 0.27 * s, segments: 8 }, scene);
      hood.material = mat(scene, new Color3(0.15, 0.15, 0.18));
      hood.position.y = 0.02 * s;
      // Metal headband/plate
      const plate = MeshBuilder.CreateBox("plate", { width: 0.2 * s, height: 0.035 * s, depth: 0.01 * s }, scene);
      plate.position.set(0, 0.02 * s, 0.12 * s);
      plate.parent = hood;
      plate.material = mat(scene, new Color3(0.55, 0.55, 0.6), 0.15);
      // Face wrap (covers lower face)
      const wrap = MeshBuilder.CreateBox("wrap", { width: 0.18 * s, height: 0.08 * s, depth: 0.14 * s }, scene);
      wrap.position.set(0, -0.06 * s, 0.04 * s);
      wrap.parent = hood;
      wrap.material = mat(scene, new Color3(0.15, 0.15, 0.18));
      // Trailing cloth (bandana tail)
      const trail = MeshBuilder.CreateBox("trail", { width: 0.06 * s, height: 0.04 * s, depth: 0.18 * s }, scene);
      trail.position.set(0, 0.0, -0.16 * s);
      trail.parent = hood;
      trail.material = mat(scene, new Color3(0.15, 0.15, 0.18));
      return hood;
    }
    case "monk_headband": {
      const band = MeshBuilder.CreateTorus("band", { diameter: 0.22 * s, thickness: 0.025 * s, tessellation: 16 }, scene);
      band.material = mat(scene, accent);
      band.position.y = 0.02 * s;
      return band;
    }
    case "tricorn": {
      const brim = MeshBuilder.CreateCylinder("brim", { height: 0.02 * s, diameter: 0.32 * s, tessellation: 3 }, scene);
      brim.material = mat(scene, new Color3(0.15, 0.15, 0.15));
      brim.position.y = 0.03 * s;
      const top = MeshBuilder.CreateBox("trictop", { width: 0.14 * s, height: 0.1 * s, depth: 0.14 * s }, scene);
      top.position.y = 0.06 * s; top.parent = brim;
      top.material = mat(scene, new Color3(0.15, 0.15, 0.15));
      return brim;
    }
    case "pirate_hat":
    case "captain_hat": {
      const brim = MeshBuilder.CreateCylinder("pbrim", { height: 0.02 * s, diameter: 0.3 * s, tessellation: 16 }, scene);
      brim.material = mat(scene, new Color3(0.12, 0.12, 0.12));
      brim.position.y = 0.03 * s;
      const top = MeshBuilder.CreateBox("ptop", { width: 0.2 * s, height: 0.12 * s, depth: 0.16 * s }, scene);
      top.position.y = 0.07 * s; top.parent = brim;
      top.material = mat(scene, new Color3(0.12, 0.12, 0.12));
      if (type === "captain_hat") {
        const badge = MeshBuilder.CreateSphere("badge", { diameter: 0.04 * s }, scene);
        badge.position.set(0, 0.06 * s, 0.09 * s); badge.parent = brim;
        badge.material = mat(scene, new Color3(1, 0.84, 0), 0.2);
      }
      return brim;
    }
    case "bandana": {
      const band = MeshBuilder.CreateTorus("bandana", { diameter: 0.22 * s, thickness: 0.03 * s, tessellation: 16 }, scene);
      band.material = mat(scene, accent);
      band.position.y = 0.01 * s;
      return band;
    }
    case "cowboy_hat": {
      const brim = MeshBuilder.CreateCylinder("cowboyBrim", { height: 0.02 * s, diameter: 0.34 * s, tessellation: 18 }, scene);
      brim.material = mat(scene, new Color3(0.22, 0.15, 0.1));
      brim.position.y = 0.04 * s;
      const crown = MeshBuilder.CreateCylinder("cowboyCrown", { height: 0.12 * s, diameterTop: 0.14 * s, diameterBottom: 0.18 * s, tessellation: 14 }, scene);
      crown.position.y = 0.08 * s;
      crown.parent = brim;
      crown.material = mat(scene, new Color3(0.24, 0.17, 0.11));
      const band = MeshBuilder.CreateTorus("cowboyBand", { diameter: 0.17 * s, thickness: 0.012 * s, tessellation: 16 }, scene);
      band.position.y = 0.01 * s;
      band.parent = crown;
      band.material = mat(scene, accent, 0.05);
      return brim;
    }
    case "straw_hat": {
      const brim = MeshBuilder.CreateCylinder("sbrim", { height: 0.015 * s, diameter: 0.35 * s, tessellation: 16 }, scene);
      brim.material = mat(scene, new Color3(0.85, 0.78, 0.45));
      brim.position.y = 0.04 * s;
      const top = MeshBuilder.CreateCylinder("stop", { height: 0.08 * s, diameter: 0.16 * s, tessellation: 12 }, scene);
      top.position.y = 0.04 * s; top.parent = brim;
      top.material = mat(scene, new Color3(0.85, 0.78, 0.45));
      return brim;
    }
    case "beret": {
      const beret = MeshBuilder.CreateSphere("beret", { diameter: 0.22 * s, segments: 8 }, scene);
      beret.scaling.y = 0.4;
      beret.material = mat(scene, accent);
      beret.position.y = 0.06 * s;
      return beret;
    }
    case "laurel": {
      const laurel = MeshBuilder.CreateTorus("laurel", { diameter: 0.2 * s, thickness: 0.02 * s, tessellation: 16 }, scene);
      laurel.material = mat(scene, new Color3(0.3, 0.6, 0.15), 0.1);
      laurel.position.y = 0.02 * s;
      return laurel;
    }
    case "feather_headdress": {
      const base = MeshBuilder.CreateTorus("fbase", { diameter: 0.22 * s, thickness: 0.025 * s, tessellation: 16 }, scene);
      base.material = mat(scene, accent);
      base.position.y = 0.02 * s;
      for (let i = 0; i < 5; i++) {
        const feather = MeshBuilder.CreateBox("feather", { width: 0.015 * s, height: 0.18 * s, depth: 0.005 * s }, scene);
        feather.position.y = 0.1 * s;
        feather.position.x = (i - 2) * 0.035 * s;
        feather.rotation.z = (i - 2) * 0.15;
        feather.parent = base;
        const c = i % 2 === 0 ? new Color3(0.9, 0.2, 0.1) : new Color3(0.2, 0.7, 0.2);
        feather.material = mat(scene, c);
      }
      return base;
    }
    case "bone_mask": {
      const mask = MeshBuilder.CreateSphere("bmask", { diameter: 0.24 * s, segments: 6 }, scene);
      mask.scaling.z = 0.6;
      mask.material = mat(scene, new Color3(0.92, 0.88, 0.8));
      mask.position.y = -0.02 * s;
      mask.position.z = 0.02 * s;
      return mask;
    }
    case "pharaoh": {
      const head = MeshBuilder.CreateBox("pharaoh", { width: 0.2 * s, height: 0.22 * s, depth: 0.15 * s }, scene);
      head.material = mat(scene, new Color3(0.8, 0.7, 0.3), 0.1);
      head.position.y = 0.06 * s;
      const flapColor = mat(scene, new Color3(0.1, 0.18, 0.45));
      for (const side of [-1, 1]) {
        const flap = MeshBuilder.CreateBox("pharaohFlap", { width: 0.06 * s, height: 0.2 * s, depth: 0.02 * s }, scene);
        flap.position.set(side * 0.12 * s, -0.01 * s, 0.03 * s);
        flap.rotation.z = -side * 0.15;
        flap.parent = head;
        flap.material = flapColor;
      }
      const cobra = MeshBuilder.CreateCylinder("pharaohCobra", { height: 0.08 * s, diameterTop: 0, diameterBottom: 0.04 * s, tessellation: 6 }, scene);
      cobra.position.set(0, 0.14 * s, 0.08 * s);
      cobra.parent = head;
      cobra.material = mat(scene, new Color3(0.9, 0.78, 0.28), 0.08);
      for (const stripeY of [0.04 * s, -0.03 * s]) {
        const stripe = MeshBuilder.CreateBox("pharaohStripe", { width: 0.18 * s, height: 0.018 * s, depth: 0.012 * s }, scene);
        stripe.position.set(0, stripeY, 0.082 * s);
        stripe.parent = head;
        stripe.material = flapColor;
      }
      return head;
    }
    case "great_helm": {
      // Flat-topped barrel helm with eye slit
      const helm = MeshBuilder.CreateCylinder("ghelm", { height: 0.22 * s, diameter: 0.22 * s, tessellation: 8 }, scene);
      helm.material = mat(scene, new Color3(0.78, 0.78, 0.80));
      helm.position.y = 0.04 * s;
      // Eye slit (dark horizontal bar)
      const slit = MeshBuilder.CreateBox("slit", { width: 0.18 * s, height: 0.015 * s, depth: 0.01 * s }, scene);
      slit.position.set(0, -0.01 * s, 0.11 * s); slit.parent = helm;
      slit.material = mat(scene, new Color3(0.08, 0.08, 0.08));
      return helm;
    }
    case "hood_liripipe": {
      // Cone hood with trailing cloth tail
      const hood = MeshBuilder.CreateCylinder("hood", {
        height: 0.18 * s, diameterTop: 0, diameterBottom: 0.22 * s, tessellation: 10,
      }, scene);
      hood.material = mat(scene, accent);
      hood.position.y = 0.06 * s;
      // Liripipe tail hanging behind
      const tail = MeshBuilder.CreateBox("liripipe", { width: 0.03 * s, height: 0.22 * s, depth: 0.02 * s }, scene);
      tail.position.set(0, -0.06 * s, -0.08 * s); tail.parent = hood;
      tail.rotation.x = 0.4;
      tail.material = mat(scene, accent);
      return hood;
    }
    case "jester_cap": {
      const base = MeshBuilder.CreateSphere("jesterCap", { diameter: 0.28 * s, segments: 6 }, scene);
      base.scaling.y = 0.55;
      base.material = mat(scene, accent, 0.05);
      base.position.y = 0.08 * s;
      for (const side of [-1, 1]) {
        const horn = MeshBuilder.CreateCylinder("jesterHorn", { height: 0.24 * s, diameterTop: 0.015 * s, diameterBottom: 0.06 * s, tessellation: 6 }, scene);
        horn.position.set(side * 0.08 * s, 0.1 * s, 0);
        horn.rotation.z = -side * 0.7;
        horn.parent = base;
        horn.material = mat(scene, accent.scale(0.8));
        const bell = MeshBuilder.CreateSphere("jesterBell", { diameter: 0.03 * s, segments: 4 }, scene);
        bell.position.y = 0.1 * s;
        bell.parent = horn;
        bell.material = mat(scene, new Color3(1, 0.84, 0), 0.2);
      }
      return base;
    }
    default:
      return null;
  }
}

// ─── Shields ───
function buildShield(scene: Scene, type: ShieldType, s: number, accent: Color3): Mesh | null {
  switch (type) {
    case "none": return null;
    case "round": {
      const shield = MeshBuilder.CreateSphere("rshield", { diameter: 0.28 * s, segments: 10 }, scene);
      shield.scaling.z = 0.15;
      shield.rotation.x = Math.PI / 2;
      shield.material = mat(scene, accent);
      const boss = MeshBuilder.CreateSphere("boss", { diameter: 0.06 * s }, scene);
      boss.position.z = -0.02 * s; boss.parent = shield;
      boss.material = mat(scene, new Color3(0.7, 0.7, 0.75));
      return shield;
    }
    case "kite": {
      const shield = MeshBuilder.CreateBox("kshield", { width: 0.18 * s, height: 0.32 * s, depth: 0.025 * s }, scene);
      shield.material = mat(scene, accent);
      const point = MeshBuilder.CreateCylinder("kpoint", { height: 0.08 * s, diameterTop: 0.18 * s, diameterBottom: 0, tessellation: 4 }, scene);
      point.position.y = -0.2 * s;
      point.parent = shield;
      point.material = mat(scene, accent);
      return shield;
    }
    case "tower": {
      const shield = MeshBuilder.CreateBox("tshield", { width: 0.22 * s, height: 0.4 * s, depth: 0.03 * s }, scene);
      shield.material = mat(scene, accent);
      const boss = MeshBuilder.CreateSphere("towerBoss", { diameter: 0.06 * s, segments: 6 }, scene);
      boss.position.z = -0.02 * s;
      boss.parent = shield;
      boss.material = mat(scene, new Color3(0.7, 0.7, 0.75));
      for (const bandY of [-0.09 * s, 0.09 * s]) {
        const band = MeshBuilder.CreateBox("towerBand", { width: 0.21 * s, height: 0.02 * s, depth: 0.01 * s }, scene);
        band.position.set(0, bandY, -0.016 * s);
        band.parent = shield;
        band.material = mat(scene, new Color3(0.56, 0.42, 0.22));
      }
      return shield;
    }
    case "buckler": {
      const shield = MeshBuilder.CreateCylinder("buckler", { height: 0.02 * s, diameter: 0.18 * s, tessellation: 12 }, scene);
      shield.rotation.x = Math.PI / 2;
      shield.material = mat(scene, new Color3(0.5, 0.5, 0.55));
      const boss = MeshBuilder.CreateSphere("bucklerBoss", { diameter: 0.05 * s, segments: 6 }, scene);
      boss.position.z = -0.015 * s;
      boss.parent = shield;
      boss.material = mat(scene, new Color3(0.7, 0.7, 0.75));
      const rim = MeshBuilder.CreateTorus("bucklerRim", { diameter: 0.18 * s, thickness: 0.012 * s, tessellation: 14 }, scene);
      rim.parent = shield;
      rim.material = mat(scene, new Color3(0.65, 0.65, 0.7));
      return shield;
    }
    default:
      return null;
  }
}

// ─── Special features ───
function buildSpecial(scene: Scene, type: SpecialType, s: number, accent: Color3, body: ArticulatedBody): Mesh | null {
  switch (type) {
    case "none": return null;

    case "cape": {
      const cape = MeshBuilder.CreateBox("cape", { width: 0.3 * s, height: 0.35 * s, depth: 0.02 * s }, scene);
      cape.position.set(0, 0.2 * s, -0.12 * s);
      cape.parent = body.torso;
      cape.material = mat(scene, accent, 0.05);
      return cape;
    }
    case "candle_flame": {
      const wick = MeshBuilder.CreateCylinder("candleWick", { height: 0.1 * s, diameter: 0.018 * s, tessellation: 6 }, scene);
      wick.parent = body.headTop;
      wick.position.y = 0.04 * s;
      wick.material = mat(scene, new Color3(0.18, 0.12, 0.08));
      const flame = MeshBuilder.CreateSphere("candleFlame", { diameter: 0.12 * s, segments: 6 }, scene);
      flame.parent = body.headTop;
      flame.position.y = 0.12 * s;
      flame.scaling.y = 1.4;
      flame.material = mat(scene, new Color3(1.0, 0.7, 0.18), 0.5);
      return flame;
    }
    case "cactus_body": {
      const trunk = MeshBuilder.CreateCylinder("cactusBody", { height: 0.7 * s, diameterTop: 0.26 * s, diameterBottom: 0.34 * s, tessellation: 10 }, scene);
      trunk.parent = body.torso;
      trunk.position.set(0, -0.02 * s, 0);
      trunk.material = mat(scene, new Color3(0.38, 0.62, 0.3), 0.04);
      for (const side of [-1, 1]) {
        const arm = MeshBuilder.CreateCylinder("cactusArm", { height: 0.26 * s, diameter: 0.09 * s, tessellation: 8 }, scene);
        arm.parent = trunk;
        arm.position.set(side * 0.19 * s, 0.12 * s, 0);
        arm.rotation.z = side * 1.1;
        arm.material = mat(scene, new Color3(0.38, 0.62, 0.3), 0.04);
        const forearm = MeshBuilder.CreateCylinder("cactusForearm", { height: 0.18 * s, diameter: 0.07 * s, tessellation: 8 }, scene);
        forearm.parent = trunk;
        forearm.position.set(side * 0.28 * s, 0.24 * s, 0);
        forearm.material = mat(scene, new Color3(0.38, 0.62, 0.3), 0.04);
      }
      for (let i = 0; i < 10; i++) {
        const spine = MeshBuilder.CreateCylinder("cactusSpine", { height: 0.05 * s, diameterTop: 0, diameterBottom: 0.01 * s, tessellation: 4 }, scene);
        const angle = (Math.PI * 2 * i) / 10;
        spine.parent = trunk;
        spine.position.set(Math.cos(angle) * 0.14 * s, -0.18 * s + (i % 5) * 0.09 * s, Math.sin(angle) * 0.14 * s);
        spine.rotation.x = Math.PI / 2;
        spine.rotation.z = angle;
        spine.material = mat(scene, new Color3(0.85, 0.9, 0.72));
      }
      return trunk;
    }
    case "wings":
    case "dragon_wings": {
      const color = type === "dragon_wings" ? new Color3(0.12, 0.12, 0.15) : new Color3(0.9, 0.9, 0.95);
      const wingS = type === "dragon_wings" ? 1.3 : 1.0;
      for (const side of [-1, 1]) {
        const wing = MeshBuilder.CreateBox("wing", { width: 0.35 * s * wingS, height: 0.25 * s * wingS, depth: 0.01 * s }, scene);
        wing.position.set(side * 0.25 * s, 0.3 * s, -0.1 * s);
        wing.rotation.y = side * 0.3;
        wing.parent = body.torso;
        wing.material = mat(scene, color, 0.05);
      }
      // Return a dummy mesh for disposal tracking
      const marker = MeshBuilder.CreateBox("wingMarker", { width: 0.01, height: 0.01, depth: 0.01 }, scene);
      marker.isVisible = false;
      marker.parent = body.torso;
      return marker;
    }
    case "mount_mammoth": {
      const mammoth = MeshBuilder.CreateBox("mammoth", { width: 1.2 * s, height: 0.8 * s, depth: 0.7 * s }, scene);
      mammoth.position.y = -0.2 * s;
      mammoth.parent = body.hip;
      mammoth.material = mat(scene, new Color3(0.5, 0.38, 0.25));
      // Tusks
      for (const side of [-1, 1]) {
        const tusk = MeshBuilder.CreateCylinder("tusk", { height: 0.4 * s, diameterTop: 0, diameterBottom: 0.06 * s, tessellation: 6 }, scene);
        tusk.position.set(side * 0.3 * s, -0.2 * s, 0.35 * s);
        tusk.rotation.x = 0.6;
        tusk.rotation.z = side * 0.3;
        tusk.parent = mammoth;
        tusk.material = mat(scene, new Color3(0.95, 0.92, 0.85));
      }
      return mammoth;
    }
    case "mount_horse": {
      const horse = MeshBuilder.CreateBox("horse", { width: 0.3 * s, height: 0.5 * s, depth: 0.8 * s }, scene);
      horse.position.y = -0.4 * s;
      horse.parent = body.hip;
      horse.material = mat(scene, new Color3(0.55, 0.35, 0.2));
      // Legs
      for (const xOff of [-0.12, 0.12]) {
        for (const zOff of [-0.25, 0.25]) {
          const leg = MeshBuilder.CreateCylinder("hleg", { height: 0.35 * s, diameter: 0.06 * s }, scene);
          leg.position.set(xOff * s, -0.4 * s, zOff * s);
          leg.parent = horse;
          leg.material = mat(scene, new Color3(0.55, 0.35, 0.2));
        }
      }
      return horse;
    }
    case "catapult_arm": {
      const base = MeshBuilder.CreateBox("catbase", { width: 0.6 * s, height: 0.2 * s, depth: 0.4 * s }, scene);
      base.position.set(0, -0.1 * s, 0.1 * s);
      base.parent = body.hip;
      base.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      const arm = MeshBuilder.CreateCylinder("catarm", { height: 0.6 * s, diameter: 0.05 * s }, scene);
      arm.position.y = 0.3 * s;
      arm.rotation.z = -0.3;
      arm.parent = base;
      arm.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      return base;
    }
    case "cannon_base": {
      const base = MeshBuilder.CreateBox("canbase", { width: 0.4 * s, height: 0.15 * s, depth: 0.3 * s }, scene);
      base.position.set(0, -0.1 * s, 0.2 * s);
      base.parent = body.hip;
      base.material = mat(scene, new Color3(0.4, 0.25, 0.12));
      const barrel = MeshBuilder.CreateCylinder("canbarrel", { height: 0.6 * s, diameter: 0.12 * s, tessellation: 12 }, scene);
      barrel.position.set(0, 0.1 * s, 0.15 * s);
      barrel.rotation.x = Math.PI / 2;
      barrel.parent = base;
      barrel.material = mat(scene, new Color3(0.25, 0.25, 0.3));
      return base;
    }
    case "ballista_frame": {
      const frame = MeshBuilder.CreateBox("bframe", { width: 0.5 * s, height: 0.3 * s, depth: 0.3 * s }, scene);
      frame.position.set(0, -0.05 * s, 0.15 * s);
      frame.parent = body.hip;
      frame.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      const bolt = MeshBuilder.CreateCylinder("bolt", { height: 0.5 * s, diameter: 0.03 * s }, scene);
      bolt.position.set(0, 0.15 * s, 0.1 * s);
      bolt.rotation.x = Math.PI / 2;
      bolt.parent = frame;
      bolt.material = mat(scene, new Color3(0.3, 0.3, 0.3));
      return frame;
    }
    case "hwacha_rack": {
      const rack = MeshBuilder.CreateBox("hrack", { width: 0.45 * s, height: 0.35 * s, depth: 0.3 * s }, scene);
      rack.position.set(0, 0, 0.2 * s);
      rack.parent = body.hip;
      rack.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      for (let i = 0; i < 6; i++) {
        const arrow = MeshBuilder.CreateCylinder("harrow", { height: 0.3 * s, diameter: 0.015 * s }, scene);
        arrow.position.set((i - 2.5) * 0.06 * s, 0.1 * s, 0);
        arrow.rotation.x = Math.PI / 2;
        arrow.parent = rack;
        arrow.material = mat(scene, new Color3(0.6, 0.35, 0.15));
      }
      return rack;
    }
    case "tank_body": {
      const hull = MeshBuilder.CreateCylinder("tank", { height: 0.6 * s, diameter: 1.0 * s, tessellation: 16 }, scene);
      hull.position.y = -0.2 * s;
      hull.parent = body.hip;
      hull.material = mat(scene, new Color3(0.55, 0.45, 0.3));
      return hull;
    }
    case "longship_body": {
      const hull = MeshBuilder.CreateBox("longship", { width: 0.9 * s, height: 0.25 * s, depth: 0.35 * s }, scene);
      hull.position.y = -0.35 * s;
      hull.parent = body.hip;
      hull.material = mat(scene, new Color3(0.55, 0.4, 0.2));
      // Prow
      const prow = MeshBuilder.CreateCylinder("prow", { height: 0.3 * s, diameterTop: 0, diameterBottom: 0.08 * s, tessellation: 6 }, scene);
      prow.position.set(0, 0.05 * s, 0.25 * s);
      prow.rotation.x = -0.5;
      prow.parent = hull;
      prow.material = mat(scene, new Color3(0.6, 0.45, 0.2));
      return hull;
    }
    case "balloon": {
      const balloon = MeshBuilder.CreateSphere("balloon", { diameter: 0.5 * s, segments: 10 }, scene);
      balloon.position.y = 0.7 * s;
      balloon.parent = body.torso;
      balloon.material = mat(scene, new Color3(1, 0.6, 0.65), 0.1);
      // String
      const str = MeshBuilder.CreateCylinder("string", { height: 0.3 * s, diameter: 0.008 * s }, scene);
      str.position.y = -0.2 * s;
      str.parent = balloon;
      str.material = mat(scene, new Color3(0.3, 0.3, 0.3));
      return balloon;
    }
    case "scarecrow_post": {
      const post = MeshBuilder.CreateCylinder("post", { height: 0.6 * s, diameter: 0.04 * s }, scene);
      post.position.set(0, -0.3 * s, -0.05 * s);
      post.parent = body.hip;
      post.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      return post;
    }
    case "monk_robe": {
      // Orange robe draped over left shoulder, wrapped around body
      const robe = MeshBuilder.CreateBox("robe", { width: 0.32 * s, height: 0.4 * s, depth: 0.22 * s }, scene);
      robe.position.set(0, 0.05 * s, 0);
      robe.parent = body.torso;
      robe.material = mat(scene, new Color3(0.9, 0.55, 0.1), 0.05);
      // Shoulder drape (over left shoulder diagonally)
      const drape = MeshBuilder.CreateBox("drape", { width: 0.08 * s, height: 0.35 * s, depth: 0.16 * s }, scene);
      drape.position.set(-0.12 * s, 0.2 * s, 0);
      drape.rotation.z = 0.3;
      drape.parent = body.torso;
      drape.material = mat(scene, new Color3(0.9, 0.55, 0.1), 0.05);
      return robe;
    }
    case "raptor_mount": {
      const bodyMesh = MeshBuilder.CreateBox("raptorBody", { width: 0.22 * s, height: 0.42 * s, depth: 0.85 * s }, scene);
      bodyMesh.position.y = -0.38 * s;
      bodyMesh.parent = body.hip;
      bodyMesh.material = mat(scene, new Color3(0.45, 0.55, 0.28));
      const neck = MeshBuilder.CreateCylinder("raptorNeck", { height: 0.28 * s, diameter: 0.08 * s, tessellation: 6 }, scene);
      neck.position.set(0, -0.08 * s, 0.38 * s);
      neck.rotation.x = -0.7;
      neck.parent = bodyMesh;
      neck.material = mat(scene, new Color3(0.45, 0.55, 0.28));
      const head = MeshBuilder.CreateSphere("raptorHead", { diameter: 0.16 * s, segments: 6 }, scene);
      head.position.set(0, 0.08 * s, 0.52 * s);
      head.parent = bodyMesh;
      head.material = mat(scene, new Color3(0.5, 0.62, 0.3));
      const tail = MeshBuilder.CreateCylinder("raptorTail", { height: 0.45 * s, diameterTop: 0, diameterBottom: 0.05 * s, tessellation: 6 }, scene);
      tail.position.set(0, -0.02 * s, -0.5 * s);
      tail.rotation.x = 1.05;
      tail.parent = bodyMesh;
      tail.material = mat(scene, new Color3(0.4, 0.5, 0.24));
      for (const side of [-1, 1]) {
        const leg = MeshBuilder.CreateCylinder("raptorLeg", { height: 0.32 * s, diameter: 0.05 * s, tessellation: 6 }, scene);
        leg.position.set(side * 0.12 * s, -0.32 * s, side > 0 ? -0.18 * s : 0.18 * s);
        leg.parent = bodyMesh;
        leg.material = mat(scene, new Color3(0.4, 0.5, 0.24));
      }
      const crest = MeshBuilder.CreateBox("raptorCrest", { width: 0.04 * s, height: 0.14 * s, depth: 0.03 * s }, scene);
      crest.position.set(0, 0.16 * s, 0.54 * s);
      crest.parent = bodyMesh;
      crest.material = mat(scene, accent, 0.1);
      return bodyMesh;
    }
    case "clam_shell": {
      const shell = MeshBuilder.CreateSphere("clamShell", { diameter: 0.7 * s, segments: 8 }, scene);
      shell.scaling.y = 0.45;
      shell.position.y = -0.15 * s;
      shell.parent = body.hip;
      shell.material = mat(scene, new Color3(0.5, 0.72, 0.78));
      const lowerShell = MeshBuilder.CreateSphere("lowerShell", { diameter: 0.68 * s, segments: 8 }, scene);
      lowerShell.scaling.y = 0.28;
      lowerShell.position.set(0, -0.08 * s, 0);
      lowerShell.parent = shell;
      lowerShell.material = mat(scene, new Color3(0.42, 0.62, 0.68));
      const pearl = MeshBuilder.CreateSphere("pearl", { diameter: 0.14 * s, segments: 6 }, scene);
      pearl.position.set(0, 0.08 * s, 0.08 * s);
      pearl.parent = shell;
      pearl.material = mat(scene, new Color3(0.95, 0.98, 1), 0.15);
      return shell;
    }
    case "safe_bundle": {
      const safe = MeshBuilder.CreateBox("safe", { width: 0.32 * s, height: 0.26 * s, depth: 0.22 * s }, scene);
      safe.position.set(0, -0.1 * s, -0.15 * s);
      safe.parent = body.hip;
      safe.material = mat(scene, new Color3(0.3, 0.32, 0.35));
      const dial = MeshBuilder.CreateCylinder("dial", { height: 0.03 * s, diameter: 0.08 * s, tessellation: 12 }, scene);
      dial.position.set(0, 0, 0.12 * s);
      dial.rotation.x = Math.PI / 2;
      dial.parent = safe;
      dial.material = mat(scene, new Color3(0.85, 0.75, 0.35));
      const handle = MeshBuilder.CreateBox("safeHandle", { width: 0.08 * s, height: 0.02 * s, depth: 0.02 * s }, scene);
      handle.position.set(0.08 * s, 0, 0.12 * s);
      handle.parent = safe;
      handle.material = mat(scene, new Color3(0.82, 0.72, 0.3));
      return safe;
    }
    case "dragon_cart": {
      const cart = MeshBuilder.CreateBox("dragonCart", { width: 0.4 * s, height: 0.2 * s, depth: 0.55 * s }, scene);
      cart.position.set(0, -0.18 * s, -0.08 * s);
      cart.parent = body.hip;
      cart.material = mat(scene, new Color3(0.5, 0.34, 0.2));
      const head = MeshBuilder.CreateBox("dragonHead", { width: 0.18 * s, height: 0.16 * s, depth: 0.18 * s }, scene);
      head.position.set(0, 0.08 * s, 0.34 * s);
      head.parent = cart;
      head.material = mat(scene, accent, 0.08);
      for (const side of [-1, 1]) {
        const wing = MeshBuilder.CreateBox("dragonWing", { width: 0.24 * s, height: 0.12 * s, depth: 0.01 * s }, scene);
        wing.position.set(side * 0.24 * s, 0.1 * s, 0.05 * s);
        wing.rotation.y = side * 0.55;
        wing.parent = cart;
        wing.material = mat(scene, accent.scale(0.9), 0.05);
      }
      const horn = MeshBuilder.CreateCylinder("dragonHorn", { height: 0.12 * s, diameterTop: 0, diameterBottom: 0.025 * s, tessellation: 6 }, scene);
      horn.position.set(0, 0.17 * s, 0.4 * s);
      horn.parent = cart;
      horn.material = mat(scene, new Color3(0.92, 0.85, 0.68));
      return cart;
    }
    case "giant_bones":
    case "giant_tree":
    case "giant_ice": {
      const color = type === "giant_bones"
        ? new Color3(0.88, 0.85, 0.78)
        : type === "giant_tree"
          ? new Color3(0.42, 0.58, 0.26)
          : new Color3(0.62, 0.9, 1.0);
      const shoulder = MeshBuilder.CreateBox("giantShoulder", { width: 0.55 * s, height: 0.22 * s, depth: 0.16 * s }, scene);
      shoulder.position.set(0, 0.18 * s, -0.06 * s);
      shoulder.parent = body.torso;
      shoulder.material = mat(scene, color, 0.06);
      const crown = MeshBuilder.CreateSphere("giantCrown", { diameter: 0.26 * s, segments: 6 }, scene);
      crown.position.y = 0.05 * s;
      crown.parent = body.headTop;
      crown.material = mat(scene, color, 0.08);
      for (const side of [-1, 1]) {
        const pauldron = MeshBuilder.CreateBox("giantPauldron", { width: 0.18 * s, height: 0.24 * s, depth: 0.14 * s }, scene);
        pauldron.position.set(side * 0.22 * s, 0.14 * s, 0);
        pauldron.rotation.z = side * 0.2;
        pauldron.parent = body.torso;
        pauldron.material = mat(scene, color, 0.08);
      }
      if (type === "giant_bones") {
        for (const side of [-1, 1]) {
          const horn = MeshBuilder.CreateCylinder("boneHorn", { height: 0.18 * s, diameterTop: 0, diameterBottom: 0.05 * s, tessellation: 6 }, scene);
          horn.position.set(side * 0.08 * s, 0.06 * s, 0);
          horn.rotation.z = -side * 0.45;
          horn.parent = crown;
          horn.material = mat(scene, new Color3(0.94, 0.9, 0.82));
        }
      } else if (type === "giant_tree") {
        for (const side of [-1, 1]) {
          const branch = MeshBuilder.CreateCylinder("branch", { height: 0.22 * s, diameter: 0.05 * s, tessellation: 6 }, scene);
          branch.position.set(side * 0.12 * s, 0.1 * s, 0);
          branch.rotation.z = -side * 0.65;
          branch.parent = crown;
          branch.material = mat(scene, new Color3(0.38, 0.24, 0.15));
          const leaf = MeshBuilder.CreateSphere("leaf", { diameter: 0.1 * s, segments: 6 }, scene);
          leaf.position.set(side * 0.09 * s, 0.18 * s, 0);
          leaf.parent = crown;
          leaf.material = mat(scene, new Color3(0.42, 0.62, 0.3), 0.08);
        }
      } else {
        for (const side of [-1, 1]) {
          const shard = MeshBuilder.CreateBox("iceHorn", { width: 0.04 * s, height: 0.18 * s, depth: 0.05 * s }, scene);
          shard.position.set(side * 0.08 * s, 0.12 * s, 0);
          shard.rotation.z = side * 0.35;
          shard.parent = crown;
          shard.material = mat(scene, new Color3(0.82, 0.98, 1), 0.18);
        }
      }
      return shoulder;
    }
    case "halo": {
      const halo = MeshBuilder.CreateTorus("halo", { diameter: 0.28 * s, thickness: 0.02 * s, tessellation: 20 }, scene);
      halo.position.y = 0.18 * s;
      halo.parent = body.headTop;
      halo.material = mat(scene, new Color3(1, 0.88, 0.35), 0.25);
      const gem = MeshBuilder.CreateSphere("haloGem", { diameter: 0.05 * s, segments: 6 }, scene);
      gem.position.set(0, 0.02 * s, 0.14 * s);
      gem.parent = halo;
      gem.material = mat(scene, accent, 0.22);
      return halo;
    }
    case "vampire_collar": {
      const collar = MeshBuilder.CreateDisc("vampireCollar", { radius: 0.24 * s, tessellation: 18, arc: 0.62 }, scene);
      collar.parent = body.neck;
      collar.position.set(0, -0.03 * s, -0.08 * s);
      collar.rotation.x = Math.PI * 0.62;
      collar.material = mat(scene, accent.scale(0.72), 0.04);
      for (const side of [-1, 1]) {
        const panel = MeshBuilder.CreatePlane("vampireCollarWing", { width: 0.18 * s, height: 0.22 * s }, scene);
        panel.parent = body.neck;
        panel.position.set(side * 0.16 * s, 0.06 * s, -0.02 * s);
        panel.rotation.y = side * 0.36;
        panel.rotation.z = -side * 0.18;
        panel.material = mat(scene, accent.scale(0.85), 0.05);
      }
      return collar;
    }
    case "quiver_back": {
      const quiver = MeshBuilder.CreateCylinder("quiver", { height: 0.3 * s, diameterTop: 0.08 * s, diameterBottom: 0.1 * s, tessellation: 10 }, scene);
      quiver.parent = body.torso;
      quiver.position.set(-0.16 * s, 0.12 * s, -0.12 * s);
      quiver.rotation.z = 0.34;
      quiver.rotation.x = 0.28;
      quiver.material = mat(scene, new Color3(0.34, 0.22, 0.12));
      const strap = MeshBuilder.CreateBox("quiverStrap", { width: 0.04 * s, height: 0.46 * s, depth: 0.03 * s }, scene);
      strap.parent = body.torso;
      strap.position.set(0.09 * s, 0.06 * s, 0.08 * s);
      strap.rotation.z = -0.72;
      strap.material = mat(scene, new Color3(0.24, 0.14, 0.08));
      for (const zOff of [-0.02, 0.02, 0.06]) {
        const shaft = MeshBuilder.CreateCylinder("quiverArrow", { height: 0.24 * s, diameter: 0.012 * s, tessellation: 6 }, scene);
        shaft.parent = quiver;
        shaft.position.set(0, 0.17 * s, zOff * s);
        shaft.material = mat(scene, new Color3(0.78, 0.72, 0.58));
        const fletch = MeshBuilder.CreateBox("quiverFletch", { width: 0.04 * s, height: 0.028 * s, depth: 0.012 * s }, scene);
        fletch.parent = shaft;
        fletch.position.y = 0.11 * s;
        fletch.material = mat(scene, accent, 0.06);
      }
      return quiver;
    }
    case "banner_back": {
      const pole = MeshBuilder.CreateCylinder("bannerPole", { height: 0.82 * s, diameter: 0.028 * s, tessellation: 6 }, scene);
      pole.parent = body.torso;
      pole.position.set(-0.05 * s, 0.34 * s, -0.08 * s);
      pole.rotation.z = -0.08;
      pole.material = mat(scene, new Color3(0.44, 0.28, 0.16));
      const crossbar = MeshBuilder.CreateCylinder("bannerCross", { height: 0.24 * s, diameter: 0.02 * s, tessellation: 6 }, scene);
      crossbar.parent = pole;
      crossbar.position.set(0.12 * s, 0.28 * s, 0);
      crossbar.rotation.z = Math.PI / 2;
      crossbar.material = mat(scene, new Color3(0.44, 0.28, 0.16));
      const cloth = MeshBuilder.CreatePlane("bannerCloth", { width: 0.2 * s, height: 0.28 * s }, scene);
      cloth.parent = pole;
      cloth.position.set(0.12 * s, 0.14 * s, 0.02 * s);
      cloth.material = mat(scene, accent, 0.08);
      return pole;
    }
    case "chariot_cart": {
      const cart = MeshBuilder.CreateBox("chariotBody", { width: 0.46 * s, height: 0.18 * s, depth: 0.34 * s }, scene);
      cart.parent = body.hip;
      cart.position.set(0, -0.18 * s, -0.14 * s);
      cart.material = mat(scene, new Color3(0.56, 0.39, 0.18));
      for (const side of [-1, 1]) {
        const wheel = MeshBuilder.CreateCylinder("chariotWheel", { height: 0.04 * s, diameter: 0.24 * s, tessellation: 12 }, scene);
        wheel.parent = cart;
        wheel.position.set(side * 0.24 * s, -0.02 * s, 0);
        wheel.rotation.z = Math.PI / 2;
        wheel.material = mat(scene, new Color3(0.44, 0.28, 0.16));
      }
      const yoke = MeshBuilder.CreateBox("chariotYoke", { width: 0.06 * s, height: 0.04 * s, depth: 0.46 * s }, scene);
      yoke.parent = cart;
      yoke.position.set(0, 0.02 * s, 0.28 * s);
      yoke.material = mat(scene, new Color3(0.44, 0.28, 0.16));
      for (const side of [-1, 1]) {
        const horse = MeshBuilder.CreateBox("chariotHorse", { width: 0.12 * s, height: 0.26 * s, depth: 0.42 * s }, scene);
        horse.parent = cart;
        horse.position.set(side * 0.12 * s, -0.02 * s, 0.56 * s);
        horse.material = mat(scene, new Color3(0.72, 0.66, 0.54));
      }
      return cart;
    }
    case "cart":
      return null;
    case "barrel_body": {
      const barrel = MeshBuilder.CreateCylinder("barrelBody", { height: 0.48 * s, diameter: 0.4 * s, tessellation: 12 }, scene);
      barrel.parent = body.hip;
      barrel.position.set(0, -0.12 * s, 0);
      barrel.rotation.z = Math.PI / 2;
      barrel.material = mat(scene, new Color3(0.44, 0.28, 0.16));
      for (const zOff of [-0.14, 0, 0.14]) {
        const hoop = MeshBuilder.CreateTorus("barrelHoop", { diameter: 0.34 * s, thickness: 0.02 * s, tessellation: 18 }, scene);
        hoop.parent = barrel;
        hoop.position.z = zOff * s;
        hoop.rotation.y = Math.PI / 2;
        hoop.material = mat(scene, new Color3(0.28, 0.28, 0.3));
      }
      return barrel;
    }
    default:
      return null;
  }
}
