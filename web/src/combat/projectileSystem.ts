import {
  Scene, Vector3, MeshBuilder, Color3, Mesh, TransformNode,
  PBRMetallicRoughnessMaterial, ParticleSystem,
} from "@babylonjs/core";
import type { RuntimeUnit } from "../units/runtimeUnit";
import type { VisualEffects } from "./visualEffects";
import type { ImpactPresentation } from "./impactPresentation";
import { getMaterialFactory } from "../units/materialFactory";
import { TEAM_COLORS } from "../data/factionColors";
import { createTrail } from "./particleFactory";

export type ProjectileShape = "arrow" | "bolt" | "spear" | "bomb" | "stone" | "firework" | "shuriken" | "rocket_arrow" | "crow" | "fireball" | "shell";

interface ActiveProjectile {
  mesh: TransformNode;
  origin: Vector3;
  target: RuntimeUnit;
  targetPos: Vector3;       // snapshot in case target dies mid-flight
  speed: number;
  damage: number;
  knockback: Vector3;
  splashRadius: number;
  attackerTeam: number;
  elapsed: number;
  flightTime: number;
  arcHeight: number;        // parabolic arc peak (0 = flat)
  allUnits: readonly RuntimeUnit[];
  shape: ProjectileShape;
  targetLift: number;
  trailSystem?: ParticleSystem;
  trailStarted?: boolean;
}

interface MuzzleFlash {
  mesh: Mesh;
  remaining: number;
  /** Smoke blobs only: total life, used to swell, rise and hold opaque before fading. */
  smokeLife?: number;
  ownsMaterial?: boolean;
}

interface ProjectileSpawnOptions {
  originLift?: number;
  targetLift?: number;
}

interface MuzzleFlashOptions {
  originLift?: number;
}

function brighten(color: Color3, amount: number): Color3 {
  return Color3.Lerp(color, new Color3(0.95, 0.95, 0.98), amount);
}

function darken(color: Color3, amount: number): Color3 {
  return Color3.Lerp(color, new Color3(0.12, 0.12, 0.14), amount);
}

// Arrow, bolt and spear shafts are dark wood for both teams; only the head and the fletching carry the team colour.
const WOOD_SHAFT_COLOR = new Color3(0.3, 0.2, 0.11);

export class ProjectileSystem {
  private _scene: Scene;
  private _active: ActiveProjectile[] = [];
  private _flashes: MuzzleFlash[] = [];
  /** Spent arrows, bolts and spears left standing in the bodies they hit or in the ground, oldest first. */
  private _litter: { mesh: TransformNode; owner: RuntimeUnit | null }[] = [];
  private _matCache = new Map<string, PBRMetallicRoughnessMaterial>();
  onShake?: (intensity: number) => void;
  visualEffects?: VisualEffects;
  impactPresentation?: ImpactPresentation;

  constructor(scene: Scene) {
    this._scene = scene;
  }

  get activeCount(): number { return this._active.length; }

  private _getTeamProjectilePalette(team: number): { primary: Color3; bright: Color3; dark: Color3 } {
    const primary = (TEAM_COLORS[team] ?? new Color3(0.7, 0.7, 0.7)).clone();
    return {
      primary,
      bright: brighten(primary, 0.24),
      dark: darken(primary, 0.32),
    };
  }

  /**
   * Spawn a visible projectile that flies from origin to target.
   */
  spawnProjectile(
    shape: ProjectileShape,
    origin: Vector3,
    target: RuntimeUnit,
    damage: number,
    knockback: Vector3,
    splashRadius: number,
    attackerTeam: number,
    allUnits: readonly RuntimeUnit[],
    originOffset?: Vector3,
    delay = 0,
    options: ProjectileSpawnOptions = {},
  ): void {
    const targetPos = target.position.clone();
    const launchOrigin = originOffset ? origin.add(originOffset) : origin;
    const dist = Vector3.Distance(launchOrigin, targetPos);

    // Speed and arc vary by projectile type
    let speed: number;
    let arcHeight: number;
    switch (shape) {
      case "arrow":   speed = 35; arcHeight = dist * 0.08; break;
      case "bolt":    speed = 30; arcHeight = dist * 0.06; break;
      case "spear":   speed = 18; arcHeight = dist * 0.15; break;
      case "bomb":    speed = 12; arcHeight = dist * 0.35; break;
      case "shell":   speed = 46; arcHeight = dist * 0.015; break;
      case "stone":   speed = 10; arcHeight = dist * 0.4;  break;
      case "firework": speed = 22; arcHeight = dist * 0.25; break;
      case "shuriken": speed = 28; arcHeight = dist * 0.05; break;
      case "rocket_arrow": speed = 30; arcHeight = dist * 0.03; break;
      case "crow": speed = 18; arcHeight = dist * 0.15; break;
      case "fireball": speed = 20; arcHeight = dist * 0.1; break;
    }

    const flightTime = Math.max(0.1, dist / speed);
    const palette = this._getTeamProjectilePalette(attackerTeam);
    const mesh = this._buildProjectileMesh(shape, palette, attackerTeam);
    mesh.position = launchOrigin.clone();
    mesh.position.y += options.originLift ?? 1.0;

    // Add particle trail for specific projectile types
    let trailSystem: ParticleSystem | undefined;
    let trailStarted = false;
    const trailMesh = mesh.getChildMeshes()[0] as Mesh | undefined;
    if (trailMesh) {
      switch (shape) {
        case "fireball":
          trailSystem = createTrail(this._scene, trailMesh, palette.primary, 10);
          break;
        case "rocket_arrow":
          trailSystem = createTrail(this._scene, trailMesh, palette.primary, 15);
          trailSystem.minSize = 0.03;
          trailSystem.maxSize = 0.08;
          break;
        case "firework":
          trailSystem = createTrail(this._scene, trailMesh, palette.primary, 10);
          break;
        case "bomb":
          trailSystem = createTrail(this._scene, trailMesh, palette.primary, 5);
          trailSystem.minSize = 0.01;
          trailSystem.maxSize = 0.03;
          break;
      }
    }
    if (trailSystem && delay <= 0) {
      trailSystem.start();
      trailStarted = true;
    }

    this._active.push({
      mesh, origin: mesh.position.clone(), target, targetPos,
      speed, damage, knockback, splashRadius, attackerTeam,
      elapsed: -delay, flightTime, arcHeight, allUnits, shape,
      targetLift: options.targetLift ?? 0.5,
      trailSystem, trailStarted,
    });
  }

  /**
   * Spawn a muzzle flash at the given position (for guns).
   */
  spawnMuzzleFlash(origin: Vector3, direction: Vector3, scale = 1, options: MuzzleFlashOptions = {}): void {
    const flash = MeshBuilder.CreateSphere("flash", { diameter: 0.4 * scale, segments: 6 }, this._scene);
    flash.position = origin.clone();
    flash.position.y += options.originLift ?? 1.0;
    flash.position.addInPlace(direction.scale(0.3 * scale));

    const m = this._getMat("flash", new Color3(1, 0.85, 0.3), 0.8);
    flash.material = m;

    this._flashes.push({ mesh: flash, remaining: 0.12 + 0.04 * Math.max(0, scale - 1) });

    // Smoke puff: a head-sized clump of faceted off-white lobes thrown out of the muzzle that hangs and drifts up.
    // Lit matte material: a fully emissive one trips the bloom threshold and washes out to a glowing ball.
    const sm = getMaterialFactory().createUnique("cloth", new Color3(0.86, 0.85, 0.82));
    sm.emissiveColor = new Color3(0.14, 0.14, 0.13);
    sm.transparencyMode = 2;
    const smokeLife = 1.5 + 0.5 * Math.max(0, scale - 1);
    // Each lobe is about three quarters the size of the one behind it and stands 0.4 further out along the barrel,
    // so the puff is a ragged string of lumps tapering away from the muzzle and not one ball sitting on it.
    for (let i = 0; i < 4; i++) {
      const diameter = (0.3 + Math.random() * 0.1) * [1, 0.72, 0.52, 0.38][i] * scale;
      const smoke = MeshBuilder.CreateSphere("smoke", { diameter, segments: 2 }, this._scene);
      smoke.position = flash.position.add(direction.scale((0.08 + 0.4 * i) * scale));
      smoke.position.x += (Math.random() - 0.5) * 0.14 * scale;
      smoke.position.y += (Math.random() - 0.3) * 0.14 * scale;
      smoke.position.z += (Math.random() - 0.5) * 0.14 * scale;
      smoke.material = sm;
      this._flashes.push({ mesh: smoke, remaining: smokeLife, smokeLife, ownsMaterial: i === 0 });
    }
  }

  update(dt: number): void {
    // Update projectiles
    for (let i = this._active.length - 1; i >= 0; i--) {
      const p = this._active[i];
      p.elapsed += dt;

      // Delayed projectile: hide until delay expires
      if (p.elapsed < 0) {
        if (p.mesh instanceof Mesh) p.mesh.isVisible = false;
        for (const child of p.mesh.getChildMeshes()) child.isVisible = false;
        continue;
      }
      if (p.trailSystem && !p.trailStarted) {
        p.trailSystem.start();
        p.trailStarted = true;
      }
      // Show on first frame after delay
      if (p.mesh instanceof Mesh) p.mesh.isVisible = true;
      for (const child of p.mesh.getChildMeshes()) child.isVisible = true;

      const t = Math.min(p.elapsed / p.flightTime, 1);

      // Update target position if target is alive (track moving targets)
      if (!p.target.isDead) {
        p.targetPos.copyFrom(p.target.position);
      }

      // Lerp position with parabolic arc
      const dest = p.targetPos.clone();
      dest.y += p.targetLift;
      Vector3.LerpToRef(p.origin, dest, t, p.mesh.position);
      // Add arc
      const arc = 4 * p.arcHeight * t * (1 - t);
      p.mesh.position.y += arc;

      // Face direction of travel
      if (t < 0.99) {
        const nextT = Math.min(t + 0.05, 1);
        const nextPos = Vector3.Lerp(p.origin, dest, nextT);
        nextPos.y += 4 * p.arcHeight * nextT * (1 - nextT);
        const dir = nextPos.subtract(p.mesh.position);
        if (dir.lengthSquared() > 0.001) {
          const yaw = Math.atan2(dir.x, dir.z);
          const pitch = -Math.atan2(dir.y, Math.sqrt(dir.x * dir.x + dir.z * dir.z));
          p.mesh.rotation.y = yaw;
          p.mesh.rotation.x = pitch;
        }
      }

      // Shuriken spin
      if (p.shape === "shuriken") {
        p.mesh.rotation.z += dt * 25;
      }
      // Crow wing flapping
      if (p.shape === "crow") {
        const flapAngle = Math.sin(p.elapsed * 15) * 0.5;
        const children = p.mesh.getChildren();
        for (const child of children) {
          if ((child as any).name?.startsWith("wing")) {
            const wing = child as Mesh;
            const side = wing.position.x > 0 ? 1 : -1;
            wing.rotation.z = side * (-0.3 + flapAngle);
          }
        }
      }

      // Collision-based early hit detection (check against enemy collision spheres)
      let earlyHit = false;
      if (t < 1 && t > 0.15) { // skip first 15% to avoid self-hit
        const projPos = p.mesh.position;
        for (const unit of p.allUnits) {
          if (unit.isDead || unit.team === p.attackerTeam) continue;
          const hitRadius = unit.definition.collisionRadius + 0.3;
          if (projPos.subtract(unit.position).lengthSquared() <= hitRadius * hitRadius) {
            // Override target to the unit we actually hit
            p.target = unit;
            p.targetPos.copyFrom(unit.position);
            earlyHit = true;
            break;
          }
        }
      }

      // Arrival
      if (t >= 1 || earlyHit) {
        const struck = !p.target.isDead;
        this._onImpact(p);
        if (p.trailSystem) { p.trailSystem.stop(); p.trailSystem.dispose(); }
        if (!this._leaveAsLitter(p, struck)) p.mesh.dispose();
        this._active.splice(i, 1);
      }
    }

    // A shaft goes when the corpse it stands in is cleared away, so none is left hanging in the air.
    for (let i = this._litter.length - 1; i >= 0; i--) {
      const { mesh, owner } = this._litter[i];
      if (mesh.isDisposed() || (owner && owner.body.allMeshes[0]?.isVisible === false)) {
        mesh.dispose();
        this._litter.splice(i, 1);
      }
    }

    // Update flashes
    for (let i = this._flashes.length - 1; i >= 0; i--) {
      const f = this._flashes[i];
      f.remaining -= dt;
      if (f.smokeLife) {
        // Pop out fast, keep swelling slowly, stay opaque for most of the life, then thin out
        const ratio = Math.max(0, f.remaining / f.smokeLife);
        f.mesh.scaling.setAll(0.55 + (1 - ratio * ratio * ratio) * 1.05);
        f.mesh.position.y += 0.3 * dt;
        (f.mesh.material as PBRMetallicRoughnessMaterial).alpha = Math.min(1, ratio * 2.5);
      } else {
        // Fade and expand
        const ratio = Math.max(0, f.remaining / 0.35);
        f.mesh.scaling.setAll(1 + (1 - ratio) * 1.5);
        if (f.mesh.material && "alpha" in f.mesh.material) {
          (f.mesh.material as PBRMetallicRoughnessMaterial).alpha = ratio * 0.7;
        }
      }
      if (f.remaining <= 0) {
        f.mesh.dispose(false, f.ownsMaterial === true);
        this._flashes.splice(i, 1);
      }
    }
  }

  /** Shafts stay where they land: in the body they struck, or slanted into the ground if it was already down. */
  private _leaveAsLitter(p: ActiveProjectile, struck: boolean): boolean {
    if (p.shape !== "arrow" && p.shape !== "bolt" && p.shape !== "spear") return false;
    const mesh = p.mesh;
    if (struck) {
      // Driven a quarter of the way in toward the point it was aimed at, each shaft at its own height and its own
      // step across the body and knocked off its line of flight, so a body hit many times bristles instead of carrying
      // one parallel bundle; then carried by the torso.
      const vary = (salt: number): number => {
        const v = Math.sin((p.origin.x + p.origin.z * 1.7 + this._litter.length) * 12.9898 + salt * 78.233) * 43758.5453;
        return v - Math.floor(v);
      };
      const aim = p.target.position.clone();
      aim.y += p.targetLift + (vary(1) - 0.5) * 0.35;
      const across = (vary(2) - 0.5) * 0.36;
      const flight = aim.subtract(p.origin);
      const span = Math.hypot(flight.x, flight.z) || 1;
      aim.x += (-flight.z / span) * across;
      aim.z += (flight.x / span) * across;
      Vector3.LerpToRef(mesh.position, aim, 0.25, mesh.position);
      mesh.position.y = aim.y;
      mesh.rotation.x += (vary(3) - 0.5) * 0.7;
      mesh.rotation.y += (vary(4) - 0.5) * 0.7;
      // A stuck shaft is half as thick as one in flight and stands back along its own line until only the head is
      // inside the body, so it juts out of the side it came in by and not out of both.
      mesh.scaling.x *= 0.5;
      mesh.scaling.y *= 0.5;
      const back = (p.shape === "spear" ? 0.5 : p.shape === "arrow" ? 0.28 : 0.24) - 0.07;
      const level = Math.cos(mesh.rotation.x);
      mesh.position.x -= Math.sin(mesh.rotation.y) * level * back;
      mesh.position.y += Math.sin(mesh.rotation.x) * back;
      mesh.position.z -= Math.cos(mesh.rotation.y) * level * back;
      mesh.setParent(p.target.body.torso ?? p.target.body.root);
    } else {
      const vary = Math.abs(p.origin.x * 7.31 + p.origin.z * 3.17) % 1;
      mesh.position.set(p.targetPos.x + (vary - 0.5) * 0.8, 0.14, p.targetPos.z + ((vary * 7) % 1 - 0.5) * 0.8);
      mesh.rotation.x = 0.35 + vary * 0.35;
    }
    this._litter.push({ mesh, owner: struck ? p.target : null });
    if (this._litter.length > 60) this._litter.shift()!.mesh.dispose();
    return true;
  }

  private _onImpact(p: ActiveProjectile): void {
    if (p.splashRadius > 0) {
      // Splash damage
      const radiusSq = p.splashRadius * p.splashRadius;
      for (const unit of p.allUnits) {
        if (unit.isDead || unit.team === p.attackerTeam) continue;
        const distanceSq = unit.position.subtract(p.targetPos).lengthSquared();
        if (distanceSq > radiusSq) continue;
        const distance = Math.sqrt(distanceSq);
        const falloff = p.splashRadius > 0 ? Math.max(0, 1 - distance / p.splashRadius) : 1;
        const delta = unit.applyDamage(p.damage, p.knockback);
        if (this.impactPresentation) {
          this.impactPresentation.recordImpact({
            source: "projectile",
            path: "projectile-splash",
            position: unit.position,
            target: unit,
            impactDelta: delta,
            damage: p.damage,
            impulse: p.knockback,
            radius: p.splashRadius,
            falloff,
            attackerTeam: p.attackerTeam,
          });
        }
      }
      this._flingFromBlast(p);
      // Spawn impact effect for explosive
      const explosionScale = p.shape === "shell" ? 1.8 : 1;
      if (this.impactPresentation) {
        this.impactPresentation.presentExplosion(p.targetPos, explosionScale);
      } else {
        this._spawnExplosion(p.targetPos, explosionScale);
      }
    } else {
      // Direct hit
      if (!p.target.isDead) {
        const delta = p.target.applyDamage(p.damage, p.knockback);
        if (this.impactPresentation) {
          this.impactPresentation.recordImpact({
            source: "projectile",
            path: "projectile-direct",
            position: p.target.position,
            target: p.target,
            impactDelta: delta,
            damage: p.damage,
            impulse: p.knockback,
            attackerTeam: p.attackerTeam,
          });
        } else {
          this.visualEffects?.spawnImpactDust(p.targetPos);
          this.visualEffects?.spawnHitDebris(p.targetPos);
        }
      }
    }
  }

  /** Throw every enemy body near the blast up and away from its centre, the dead ones included. */
  private _flingFromBlast(p: ActiveProjectile): void {
    // Rocket arrows and tank bolts carry a token splash; only real explosions throw bodies.
    if (p.splashRadius < 1.5) return;
    const radius = p.splashRadius + 1.2;
    const shotDir = new Vector3(p.knockback.x, 0, p.knockback.z);
    if (shotDir.lengthSquared() < 0.0001) shotDir.set(1, 0, 0);
    shotDir.normalize();
    for (const unit of p.allUnits) {
      if (unit.team === p.attackerTeam) continue;
      const delta = unit.position.subtract(p.targetPos);
      delta.y = 0;
      const distance = delta.length();
      if (distance > radius) continue;
      const falloff = 1 - distance / radius;
      // A body standing on the centre goes the way the shot was travelling.
      const outward = distance > 0.05 ? delta.scale(1 / distance) : shotDir;
      // Lift of 4-6 m/s under 22 m/s2 gravity: bodies near the centre are tossed about a body height, not up to the clouds.
      unit.applyBlastLaunch(outward, 1.5 + 2.5 * falloff, 4 + 2 * falloff);
    }
  }

  private _spawnExplosion(pos: Vector3, scale = 1, includeShake = true): void {
    const boom = MeshBuilder.CreateSphere("boom", { diameter: 0.3 * scale, segments: 6 }, this._scene);
    boom.position = pos.clone();
    boom.position.y += 0.3;
    const m = getMaterialFactory().createUnique("unlit", new Color3(1, 0.6, 0.1));
    m.disableLighting = true;
    m.emissiveColor = new Color3(1, 0.5, 0.1);
    m.alpha = 0.8;
    m.transparencyMode = 2;
    boom.material = m;
    this._flashes.push({ mesh: boom, remaining: 0.4 + 0.12 * Math.max(0, scale - 1) });
    if (includeShake) this.onShake?.(0.12 * scale);
    this.visualEffects?.spawnPersistentSmoke(pos);
    this.visualEffects?.spawnGroundScorch(pos);
  }

  private _buildProjectileMesh(
    shape: ProjectileShape,
    palette: { primary: Color3; bright: Color3; dark: Color3 },
    attackerTeam: number,
  ): TransformNode {
    const root = new TransformNode("proj", this._scene);

    switch (shape) {
      case "arrow": {
        const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.5, diameter: 0.025, tessellation: 4 }, this._scene);
        shaft.rotation.x = Math.PI / 2;
        shaft.material = this._getMat("wood_shaft", WOOD_SHAFT_COLOR);
        shaft.parent = root;
        const tip = MeshBuilder.CreateCylinder("tip", { height: 0.08, diameterTop: 0, diameterBottom: 0.04, tessellation: 4 }, this._scene);
        tip.rotation.x = Math.PI / 2;
        tip.position.z = 0.28;
        tip.material = this._getMat(`arrow_tip_${attackerTeam}`, palette.bright);
        tip.parent = root;
        // Fletching
        const fletch = MeshBuilder.CreateBox("fletch", { width: 0.08, height: 0.005, depth: 0.06 }, this._scene);
        fletch.position.z = -0.2;
        fletch.material = this._getMat(`fletch_${attackerTeam}`, palette.primary);
        fletch.parent = root;
        break;
      }
      case "bolt": {
        const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.4, diameter: 0.04, tessellation: 4 }, this._scene);
        shaft.rotation.x = Math.PI / 2;
        shaft.material = this._getMat("wood_shaft", WOOD_SHAFT_COLOR);
        shaft.parent = root;
        const tip = MeshBuilder.CreateCylinder("tip", { height: 0.1, diameterTop: 0, diameterBottom: 0.06, tessellation: 4 }, this._scene);
        tip.rotation.x = Math.PI / 2;
        tip.position.z = 0.24;
        tip.material = this._getMat(`bolt_tip_${attackerTeam}`, palette.primary);
        tip.parent = root;
        break;
      }
      case "spear": {
        const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.9, diameter: 0.03, tessellation: 6 }, this._scene);
        shaft.rotation.x = Math.PI / 2;
        shaft.material = this._getMat("wood_shaft", WOOD_SHAFT_COLOR);
        shaft.parent = root;
        const tip = MeshBuilder.CreateCylinder("tip", { height: 0.14, diameterTop: 0, diameterBottom: 0.05, tessellation: 4 }, this._scene);
        tip.rotation.x = Math.PI / 2;
        tip.position.z = 0.5;
        tip.material = this._getMat(`spear_tip_${attackerTeam}`, palette.primary);
        tip.parent = root;
        break;
      }
      case "bomb": {
        const body = MeshBuilder.CreateSphere("bomb", { diameter: 0.2, segments: 8 }, this._scene);
        body.material = this._getMat(`bomb_body_${attackerTeam}`, palette.dark);
        body.parent = root;
        const fuse = MeshBuilder.CreateCylinder("fuse", { height: 0.1, diameter: 0.015, tessellation: 4 }, this._scene);
        fuse.position.y = 0.12;
        fuse.material = this._getMat("fuse", new Color3(0.85, 0.6, 0.2), 0.4);
        fuse.parent = root;
        // Spark
        const spark = MeshBuilder.CreateSphere("spark", { diameter: 0.05, segments: 4 }, this._scene);
        spark.position.y = 0.18;
        spark.material = this._getMat("spark", new Color3(1, 0.8, 0.2), 0.7);
        spark.parent = root;
        break;
      }
      case "shell": {
        const shell = MeshBuilder.CreateCylinder("shell", { height: 0.46, diameter: 0.22, tessellation: 14 }, this._scene);
        shell.rotation.x = Math.PI / 2;
        shell.material = this._getMat(`shell_body_${attackerTeam}`, palette.dark, 0.04);
        shell.parent = root;
        const cap = MeshBuilder.CreateCylinder("shell_cap", { height: 0.18, diameterTop: 0, diameterBottom: 0.22, tessellation: 14 }, this._scene);
        cap.rotation.x = Math.PI / 2;
        cap.position.z = 0.28;
        cap.material = this._getMat(`shell_cap_mat_${attackerTeam}`, palette.primary, 0.06);
        cap.parent = root;
        break;
      }
      case "stone": {
        const stone = MeshBuilder.CreateSphere("stone", { diameter: 0.35, segments: 6 }, this._scene);
        stone.material = this._getMat(`stone_body_${attackerTeam}`, Color3.Lerp(palette.primary, new Color3(0.5, 0.48, 0.42), 0.4));
        stone.parent = root;
        break;
      }
      case "firework": {
        const body = MeshBuilder.CreateCylinder("rocket", { height: 0.3, diameter: 0.04, tessellation: 6 }, this._scene);
        body.rotation.x = Math.PI / 2;
        body.material = this._getMat(`rocket_body_${attackerTeam}`, palette.primary);
        body.parent = root;
        // Trail spark
        const trail = MeshBuilder.CreateSphere("trail", { diameter: 0.08, segments: 4 }, this._scene);
        trail.position.z = -0.18;
        trail.material = this._getMat(`trail_${attackerTeam}`, palette.bright, 0.6);
        trail.parent = root;
        break;
      }
      case "shuriken": {
        // Flat 4-pointed star that spins
        const mat = this._getMat(`shuriken_body_${attackerTeam}`, palette.primary, 0.2);
        for (let i = 0; i < 4; i++) {
          const blade = MeshBuilder.CreateBox("blade", { width: 0.18, height: 0.015, depth: 0.04 }, this._scene);
          blade.rotation.y = (Math.PI / 4) * i;
          blade.material = mat;
          blade.parent = root;
        }
        // Center hub
        const hub = MeshBuilder.CreateCylinder("hub", { height: 0.02, diameter: 0.06, tessellation: 8 }, this._scene);
        hub.rotation.x = Math.PI / 2;
        hub.material = mat;
        hub.parent = root;
        break;
      }
      case "rocket_arrow": {
        // Arrow shaft with rocket flame trail
        const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.4, diameter: 0.025, tessellation: 4 }, this._scene);
        shaft.rotation.x = Math.PI / 2;
        shaft.material = this._getMat(`rocket_shaft_${attackerTeam}`, palette.dark);
        shaft.parent = root;
        const tip = MeshBuilder.CreateCylinder("tip", { height: 0.08, diameterTop: 0, diameterBottom: 0.04, tessellation: 4 }, this._scene);
        tip.rotation.x = Math.PI / 2;
        tip.position.z = 0.22;
        tip.material = this._getMat(`rocket_tip_${attackerTeam}`, palette.primary);
        tip.parent = root;
        // Rocket flame at tail
        const flame = MeshBuilder.CreateSphere("flame", { diameter: 0.1, segments: 4 }, this._scene);
        flame.position.z = -0.22;
        flame.material = this._getMat(`rocket_flame_${attackerTeam}`, palette.bright, 0.7);
        flame.parent = root;
        // Smoke trail
        const smoke = MeshBuilder.CreateSphere("smoke", { diameter: 0.07, segments: 4 }, this._scene);
        smoke.position.z = -0.3;
        const smokeMat = getMaterialFactory().get("unlit", new Color3(0.6, 0.6, 0.6), { alpha: 0.4 });
        smoke.material = smokeMat;
        smoke.parent = root;
        break;
      }
      case "crow": {
        // Black crow shape - body + wings
        const body = MeshBuilder.CreateSphere("crowbody", { diameter: 0.15, segments: 6 }, this._scene);
        body.scaling.set(1, 0.7, 1.4);
        body.material = this._getMat(`crow_body_${attackerTeam}`, palette.dark);
        body.parent = root;
        // Wings (flapping handled by rotation update)
        for (const side of [-1, 1]) {
          const wing = MeshBuilder.CreateBox("wing", { width: 0.2, height: 0.01, depth: 0.1 }, this._scene);
          wing.position.set(side * 0.12, 0.02, 0);
          wing.rotation.z = side * -0.3;
          wing.material = this._getMat(`crow_wing_${attackerTeam}`, palette.primary);
          wing.parent = root;
        }
        // Beak
        const beak = MeshBuilder.CreateCylinder("beak", { height: 0.06, diameterTop: 0, diameterBottom: 0.03, tessellation: 4 }, this._scene);
        beak.rotation.x = Math.PI / 2;
        beak.position.z = 0.1;
        beak.material = this._getMat("crow_beak", new Color3(0.4, 0.35, 0.1));
        beak.parent = root;
        break;
      }
      case "fireball": {
        // Team-owned fireball; impact/explosion VFX remain unchanged elsewhere.
        const ball = MeshBuilder.CreateSphere("fireball", { diameter: 0.25, segments: 8 }, this._scene);
        ball.material = this._getMat(`fireball_body_${attackerTeam}`, palette.primary, 0.6);
        ball.parent = root;
        // Outer glow
        const glow = MeshBuilder.CreateSphere("glow", { diameter: 0.4, segments: 6 }, this._scene);
        glow.material = getMaterialFactory().get("unlit", palette.bright, {
          emissive: palette.primary.scale(0.5), alpha: 0.3,
        });
        glow.parent = root;
        break;
      }
    }

    return root;
  }

  private _getMat(key: string, color: Color3, emissive = 0): PBRMetallicRoughnessMaterial {
    let m = this._matCache.get(key);
    if (m) return m;
    const mf = getMaterialFactory();
    m = emissive > 0
      ? mf.get("wood", color, { emissiveIntensity: emissive })
      : mf.get("wood", color);
    this._matCache.set(key, m);
    return m;
  }

  dispose(): void {
    for (const p of this._active) {
      if (p.trailSystem) { p.trailSystem.stop(); p.trailSystem.dispose(); }
      p.mesh.dispose();
    }
    for (const f of this._flashes) f.mesh.dispose();
    for (const l of this._litter) l.mesh.dispose();
    this._litter.length = 0;
    this._active.length = 0;
    this._flashes.length = 0;
  }
}
