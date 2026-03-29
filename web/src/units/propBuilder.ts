import {
  Scene, Mesh, MeshBuilder, StandardMaterial, Color3, Vector3, TransformNode,
} from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import type { UnitVisualConfig, WeaponType, HatType, ShieldType, SpecialType } from "./unitVisuals";

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

  const shield = buildShield(scene, config.shield, scale, accent);
  if (shield) {
    shield.parent = body.leftHand;
    props.push(shield);
  }

  const special = buildSpecial(scene, config.special, scale, accent, body);
  if (special) {
    props.push(special);
  }

  return props;
}

function mat(scene: Scene, color: Color3, emissive = 0): StandardMaterial {
  const m = new StandardMaterial("prop", scene);
  m.diffuseColor = color;
  if (emissive > 0) m.emissiveColor = color.scale(emissive);
  m.specularColor = new Color3(0.2, 0.2, 0.2);
  return m;
}

// ─── Weapons ───
function buildWeapon(scene: Scene, type: WeaponType, s: number, accent: Color3): Mesh | null {
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
    case "scythe": {
      const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.8 * s, diameter: 0.025 * s }, scene);
      shaft.material = mat(scene, new Color3(0.45, 0.3, 0.15));
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
    default:
      return null;
  }
}

// ─── Hats ───
function buildHat(scene: Scene, type: HatType, s: number, accent: Color3): Mesh | null {
  switch (type) {
    case "none": return null;
    case "crown": {
      const crown = MeshBuilder.CreateTorus("crown", { diameter: 0.2 * s, thickness: 0.04 * s, tessellation: 16 }, scene);
      crown.material = mat(scene, new Color3(1, 0.84, 0), 0.15);
      // Points
      for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 2 / 5;
        const pt = MeshBuilder.CreateCylinder("crpt", { height: 0.06 * s, diameterTop: 0, diameterBottom: 0.03 * s, tessellation: 4 }, scene);
        pt.position.set(Math.cos(a) * 0.08 * s, 0.03 * s, Math.sin(a) * 0.08 * s);
        pt.parent = crown;
        pt.material = mat(scene, new Color3(1, 0.84, 0), 0.15);
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
      return helm;
    }
    case "horned_helmet": {
      const helm = MeshBuilder.CreateSphere("hhelm", { diameter: 0.26 * s, segments: 8, slice: 0.55 }, scene);
      helm.material = mat(scene, new Color3(0.5, 0.5, 0.55));
      helm.rotation.x = Math.PI;
      helm.position.y = 0.05 * s;
      for (const side of [-1, 1]) {
        const horn = MeshBuilder.CreateCylinder("horn", { height: 0.18 * s, diameterTop: 0, diameterBottom: 0.04 * s, tessellation: 6 }, scene);
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
    case "samurai_helmet": {
      const helm = MeshBuilder.CreateSphere("shelm", { diameter: 0.26 * s, segments: 8, slice: 0.55 }, scene);
      helm.material = mat(scene, accent.scale(0.7));
      helm.rotation.x = Math.PI;
      helm.position.y = 0.05 * s;
      const crest = MeshBuilder.CreateBox("crest", { width: 0.2 * s, height: 0.1 * s, depth: 0.01 * s }, scene);
      crest.position.y = 0.1 * s;
      crest.parent = helm;
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
      return head;
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
      const shield = MeshBuilder.CreateCylinder("rshield", { height: 0.025 * s, diameter: 0.28 * s, tessellation: 16 }, scene);
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
      return shield;
    }
    case "tower": {
      const shield = MeshBuilder.CreateBox("tshield", { width: 0.22 * s, height: 0.4 * s, depth: 0.03 * s }, scene);
      shield.material = mat(scene, accent);
      return shield;
    }
    case "buckler": {
      const shield = MeshBuilder.CreateCylinder("buckler", { height: 0.02 * s, diameter: 0.18 * s, tessellation: 12 }, scene);
      shield.rotation.x = Math.PI / 2;
      shield.material = mat(scene, new Color3(0.5, 0.5, 0.55));
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
    case "cart":
    case "barrel_body":
      return null;
    default:
      return null;
  }
}
