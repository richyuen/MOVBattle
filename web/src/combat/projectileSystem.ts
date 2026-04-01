import {
  Scene, Vector3, MeshBuilder, StandardMaterial, Color3, Mesh, TransformNode,
} from "@babylonjs/core";
import type { RuntimeUnit } from "../units/runtimeUnit";

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
}

interface MuzzleFlash {
  mesh: Mesh;
  remaining: number;
}

interface ProjectileSpawnOptions {
  originLift?: number;
  targetLift?: number;
}

interface MuzzleFlashOptions {
  originLift?: number;
}

export class ProjectileSystem {
  private _scene: Scene;
  private _active: ActiveProjectile[] = [];
  private _flashes: MuzzleFlash[] = [];
  private _matCache = new Map<string, StandardMaterial>();
  onShake?: (intensity: number) => void;

  constructor(scene: Scene) {
    this._scene = scene;
  }

  get activeCount(): number { return this._active.length; }

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
    const mesh = this._buildProjectileMesh(shape);
    mesh.position = launchOrigin.clone();
    mesh.position.y += options.originLift ?? 1.0;

    this._active.push({
      mesh, origin: mesh.position.clone(), target, targetPos,
      speed, damage, knockback, splashRadius, attackerTeam,
      elapsed: -delay, flightTime, arcHeight, allUnits, shape,
      targetLift: options.targetLift ?? 0.5,
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

    // Smoke puff
    const smoke = MeshBuilder.CreateSphere("smoke", { diameter: 0.6 * scale, segments: 6 }, this._scene);
    smoke.position = flash.position.clone();
    smoke.position.addInPlace(direction.scale(0.15 * scale));
    const sm = new StandardMaterial("smoke_mat", this._scene);
    sm.diffuseColor = new Color3(0.6, 0.6, 0.6);
    sm.emissiveColor = new Color3(0.3, 0.3, 0.3);
    sm.alpha = 0.5;
    sm.disableLighting = true;
    smoke.material = sm;

    this._flashes.push({ mesh: flash, remaining: 0.12 + 0.04 * Math.max(0, scale - 1) });
    this._flashes.push({ mesh: smoke, remaining: 0.35 + 0.1 * Math.max(0, scale - 1) });
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
        this._onImpact(p);
        p.mesh.dispose();
        this._active.splice(i, 1);
      }
    }

    // Update flashes
    for (let i = this._flashes.length - 1; i >= 0; i--) {
      const f = this._flashes[i];
      f.remaining -= dt;
      // Fade and expand
      const ratio = Math.max(0, f.remaining / 0.35);
      f.mesh.scaling.setAll(1 + (1 - ratio) * 1.5);
      if (f.mesh.material && "alpha" in f.mesh.material) {
        (f.mesh.material as StandardMaterial).alpha = ratio * 0.7;
      }
      if (f.remaining <= 0) {
        f.mesh.dispose();
        this._flashes.splice(i, 1);
      }
    }
  }

  private _onImpact(p: ActiveProjectile): void {
    if (p.splashRadius > 0) {
      // Splash damage
      const radiusSq = p.splashRadius * p.splashRadius;
      for (const unit of p.allUnits) {
        if (unit.isDead || unit.team === p.attackerTeam) continue;
        if (unit.position.subtract(p.targetPos).lengthSquared() > radiusSq) continue;
        unit.applyDamage(p.damage, p.knockback);
      }
      // Spawn impact effect for explosive
      this._spawnExplosion(p.targetPos, p.shape === "shell" ? 1.8 : 1);
    } else {
      // Direct hit
      if (!p.target.isDead) {
        p.target.applyDamage(p.damage, p.knockback);
      }
    }
  }

  private _spawnExplosion(pos: Vector3, scale = 1): void {
    const boom = MeshBuilder.CreateSphere("boom", { diameter: 0.3 * scale, segments: 6 }, this._scene);
    boom.position = pos.clone();
    boom.position.y += 0.3;
    const m = new StandardMaterial("boom_mat", this._scene);
    m.diffuseColor = new Color3(1, 0.6, 0.1);
    m.emissiveColor = new Color3(1, 0.5, 0.1);
    m.alpha = 0.8;
    m.disableLighting = true;
    boom.material = m;
    this._flashes.push({ mesh: boom, remaining: 0.4 + 0.12 * Math.max(0, scale - 1) });
    this.onShake?.(0.12 * scale);
  }

  private _buildProjectileMesh(shape: ProjectileShape): TransformNode {
    const root = new TransformNode("proj", this._scene);

    switch (shape) {
      case "arrow": {
        const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.5, diameter: 0.025, tessellation: 4 }, this._scene);
        shaft.rotation.x = Math.PI / 2;
        shaft.material = this._getMat("arrow_shaft", new Color3(0.55, 0.35, 0.15));
        shaft.parent = root;
        const tip = MeshBuilder.CreateCylinder("tip", { height: 0.08, diameterTop: 0, diameterBottom: 0.04, tessellation: 4 }, this._scene);
        tip.rotation.x = Math.PI / 2;
        tip.position.z = 0.28;
        tip.material = this._getMat("arrow_tip", new Color3(0.6, 0.6, 0.65));
        tip.parent = root;
        // Fletching
        const fletch = MeshBuilder.CreateBox("fletch", { width: 0.08, height: 0.005, depth: 0.06 }, this._scene);
        fletch.position.z = -0.2;
        fletch.material = this._getMat("fletch", new Color3(0.8, 0.8, 0.8));
        fletch.parent = root;
        break;
      }
      case "bolt": {
        const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.4, diameter: 0.04, tessellation: 4 }, this._scene);
        shaft.rotation.x = Math.PI / 2;
        shaft.material = this._getMat("bolt_shaft", new Color3(0.4, 0.3, 0.15));
        shaft.parent = root;
        const tip = MeshBuilder.CreateCylinder("tip", { height: 0.1, diameterTop: 0, diameterBottom: 0.06, tessellation: 4 }, this._scene);
        tip.rotation.x = Math.PI / 2;
        tip.position.z = 0.24;
        tip.material = this._getMat("bolt_tip", new Color3(0.5, 0.5, 0.55));
        tip.parent = root;
        break;
      }
      case "spear": {
        const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.9, diameter: 0.03, tessellation: 6 }, this._scene);
        shaft.rotation.x = Math.PI / 2;
        shaft.material = this._getMat("spear_shaft", new Color3(0.55, 0.38, 0.2));
        shaft.parent = root;
        const tip = MeshBuilder.CreateCylinder("tip", { height: 0.14, diameterTop: 0, diameterBottom: 0.05, tessellation: 4 }, this._scene);
        tip.rotation.x = Math.PI / 2;
        tip.position.z = 0.5;
        tip.material = this._getMat("spear_tip", new Color3(0.7, 0.7, 0.75));
        tip.parent = root;
        break;
      }
      case "bomb": {
        const body = MeshBuilder.CreateSphere("bomb", { diameter: 0.2, segments: 8 }, this._scene);
        body.material = this._getMat("bomb_body", new Color3(0.15, 0.15, 0.15));
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
        shell.material = this._getMat("shell_body", new Color3(0.22, 0.22, 0.24), 0.04);
        shell.parent = root;
        const cap = MeshBuilder.CreateCylinder("shell_cap", { height: 0.18, diameterTop: 0, diameterBottom: 0.22, tessellation: 14 }, this._scene);
        cap.rotation.x = Math.PI / 2;
        cap.position.z = 0.28;
        cap.material = this._getMat("shell_cap_mat", new Color3(0.28, 0.28, 0.3), 0.06);
        cap.parent = root;
        break;
      }
      case "stone": {
        const stone = MeshBuilder.CreateSphere("stone", { diameter: 0.35, segments: 6 }, this._scene);
        stone.material = this._getMat("stone_body", new Color3(0.5, 0.48, 0.42));
        stone.parent = root;
        break;
      }
      case "firework": {
        const body = MeshBuilder.CreateCylinder("rocket", { height: 0.3, diameter: 0.04, tessellation: 6 }, this._scene);
        body.rotation.x = Math.PI / 2;
        body.material = this._getMat("rocket_body", new Color3(0.8, 0.15, 0.1));
        body.parent = root;
        // Trail spark
        const trail = MeshBuilder.CreateSphere("trail", { diameter: 0.08, segments: 4 }, this._scene);
        trail.position.z = -0.18;
        trail.material = this._getMat("trail", new Color3(1, 0.7, 0.2), 0.6);
        trail.parent = root;
        break;
      }
      case "shuriken": {
        // Flat 4-pointed star that spins
        const mat = this._getMat("shuriken_body", new Color3(0.5, 0.5, 0.55), 0.2);
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
        shaft.material = this._getMat("rocket_shaft", new Color3(0.5, 0.3, 0.15));
        shaft.parent = root;
        const tip = MeshBuilder.CreateCylinder("tip", { height: 0.08, diameterTop: 0, diameterBottom: 0.04, tessellation: 4 }, this._scene);
        tip.rotation.x = Math.PI / 2;
        tip.position.z = 0.22;
        tip.material = this._getMat("rocket_tip", new Color3(0.6, 0.6, 0.65));
        tip.parent = root;
        // Rocket flame at tail
        const flame = MeshBuilder.CreateSphere("flame", { diameter: 0.1, segments: 4 }, this._scene);
        flame.position.z = -0.22;
        flame.material = this._getMat("rocket_flame", new Color3(1, 0.5, 0.1), 0.7);
        flame.parent = root;
        // Smoke trail
        const smoke = MeshBuilder.CreateSphere("smoke", { diameter: 0.07, segments: 4 }, this._scene);
        smoke.position.z = -0.3;
        const smokeMat = new StandardMaterial("rsmoke", this._scene);
        smokeMat.diffuseColor = new Color3(0.6, 0.6, 0.6);
        smokeMat.alpha = 0.4;
        smokeMat.disableLighting = true;
        smoke.material = smokeMat;
        smoke.parent = root;
        break;
      }
      case "crow": {
        // Black crow shape - body + wings
        const body = MeshBuilder.CreateSphere("crowbody", { diameter: 0.15, segments: 6 }, this._scene);
        body.scaling.set(1, 0.7, 1.4);
        body.material = this._getMat("crow_body", new Color3(0.08, 0.08, 0.1));
        body.parent = root;
        // Wings (flapping handled by rotation update)
        for (const side of [-1, 1]) {
          const wing = MeshBuilder.CreateBox("wing", { width: 0.2, height: 0.01, depth: 0.1 }, this._scene);
          wing.position.set(side * 0.12, 0.02, 0);
          wing.rotation.z = side * -0.3;
          wing.material = this._getMat("crow_wing", new Color3(0.05, 0.05, 0.08));
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
        // Glowing orange fireball
        const ball = MeshBuilder.CreateSphere("fireball", { diameter: 0.25, segments: 8 }, this._scene);
        ball.material = this._getMat("fireball_body", new Color3(1, 0.4, 0.05), 0.6);
        ball.parent = root;
        // Outer glow
        const glow = MeshBuilder.CreateSphere("glow", { diameter: 0.4, segments: 6 }, this._scene);
        const glowMat = new StandardMaterial("fireball_glow", this._scene);
        glowMat.diffuseColor = new Color3(1, 0.3, 0);
        glowMat.emissiveColor = new Color3(1, 0.3, 0).scale(0.5);
        glowMat.alpha = 0.3;
        glowMat.disableLighting = true;
        glow.material = glowMat;
        glow.parent = root;
        break;
      }
    }

    return root;
  }

  private _getMat(key: string, color: Color3, emissive = 0): StandardMaterial {
    let m = this._matCache.get(key);
    if (m) return m;
    m = new StandardMaterial(key, this._scene);
    m.diffuseColor = color;
    if (emissive > 0) m.emissiveColor = color.scale(emissive);
    m.specularColor = new Color3(0.15, 0.15, 0.15);
    this._matCache.set(key, m);
    return m;
  }

  dispose(): void {
    for (const p of this._active) p.mesh.dispose();
    for (const f of this._flashes) f.mesh.dispose();
    this._active.length = 0;
    this._flashes.length = 0;
  }
}
