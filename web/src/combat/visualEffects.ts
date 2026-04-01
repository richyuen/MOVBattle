import {
  Scene, Vector3, MeshBuilder, StandardMaterial, Color3, Mesh, TransformNode,
} from "@babylonjs/core";

interface TimedEffect {
  root: TransformNode;
  remaining: number;
  update?: (dt: number, elapsed: number) => void;
}

/**
 * Manages transient visual effects: lightning, smoke puffs, impact sparks, etc.
 */
export class VisualEffects {
  private _scene: Scene;
  private _effects: TimedEffect[] = [];

  constructor(scene: Scene) {
    this._scene = scene;
  }

  update(dt: number): void {
    for (let i = this._effects.length - 1; i >= 0; i--) {
      const e = this._effects[i];
      e.remaining -= dt;
      if (e.update) e.update(dt, e.remaining);
      if (e.remaining <= 0) {
        e.root.dispose();
        this._effects.splice(i, 1);
      }
    }
  }

  // ══════════════════ LIGHTNING ══════════════════
  /**
   * Spawn a jagged lightning bolt from origin to target.
   * Made of multiple connected segments with random offsets.
   */
  spawnLightning(origin: Vector3, target: Vector3): void {
    const root = new TransformNode("lightning", this._scene);
    const segments = 10;
    const dir = target.subtract(origin);
    const len = dir.length();

    const boltMat = new StandardMaterial("bolt_mat", this._scene);
    boltMat.diffuseColor = new Color3(0.6, 0.8, 1.0);
    boltMat.emissiveColor = new Color3(0.5, 0.7, 1.0);
    boltMat.disableLighting = true;
    boltMat.alpha = 0.9;

    const coreMat = new StandardMaterial("core_mat", this._scene);
    coreMat.diffuseColor = new Color3(1, 1, 1);
    coreMat.emissiveColor = new Color3(1, 1, 1);
    coreMat.disableLighting = true;

    // Build jagged path
    const points: Vector3[] = [origin.clone()];
    points[0].y += 1.5; // start from head height
    const endPoint = target.clone();
    endPoint.y += 0.8;

    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const base = Vector3.Lerp(points[0], endPoint, t);
      // Random jag perpendicular to bolt direction
      const jag = len * 0.12 * (1 - Math.abs(t - 0.5) * 2); // most jag in middle
      base.x += (Math.random() - 0.5) * jag;
      base.y += (Math.random() - 0.5) * jag * 0.5;
      base.z += (Math.random() - 0.5) * jag;
      points.push(base);
    }
    points.push(endPoint);

    // Draw segments as thin boxes connecting each pair
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const mid = Vector3.Center(a, b);
      const segLen = Vector3.Distance(a, b);

      // Outer glow
      const glow = MeshBuilder.CreateBox("lseg", {
        width: 0.12, height: 0.12, depth: segLen,
      }, this._scene);
      glow.position = mid;
      glow.lookAt(b);
      glow.material = boltMat;
      glow.parent = root;

      // Inner bright core
      const core = MeshBuilder.CreateBox("lcore", {
        width: 0.04, height: 0.04, depth: segLen,
      }, this._scene);
      core.position = mid;
      core.lookAt(b);
      core.material = coreMat;
      core.parent = root;
    }

    // Branch bolt (smaller fork)
    const branchStart = Math.floor(segments * 0.4);
    if (branchStart < points.length - 1) {
      const forkOrigin = points[branchStart];
      const forkDir = new Vector3(
        (Math.random() - 0.5) * len * 0.4,
        (Math.random() - 0.3) * len * 0.2,
        (Math.random() - 0.5) * len * 0.4,
      );
      const forkEnd = forkOrigin.add(forkDir);
      const forkMid = Vector3.Center(forkOrigin, forkEnd);
      const forkLen = Vector3.Distance(forkOrigin, forkEnd);
      const fork = MeshBuilder.CreateBox("fork", {
        width: 0.06, height: 0.06, depth: forkLen,
      }, this._scene);
      fork.position = forkMid;
      fork.lookAt(forkEnd);
      fork.material = boltMat;
      fork.parent = root;
    }

    // Flash at impact
    const flash = MeshBuilder.CreateSphere("lflash", { diameter: 0.8, segments: 6 }, this._scene);
    flash.position = endPoint;
    flash.material = coreMat;
    flash.parent = root;

    const totalDuration = 0.25;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (_dt, remaining) => {
        const fade = Math.max(0, remaining / totalDuration);
        boltMat.alpha = fade * 0.9;
        coreMat.alpha = fade;
        flash.scaling.setAll(1 + (1 - fade) * 2);
      },
    });
  }

  // ══════════════════ SMOKE PUFF ══════════════════
  /**
   * Spawn an expanding smoke cloud at position. Used for ninja teleport.
   */
  spawnSmokePuff(position: Vector3, color?: Color3): void {
    const root = new TransformNode("smoke", this._scene);
    const clr = color ?? new Color3(0.4, 0.4, 0.45);

    const smokeMat = new StandardMaterial("smoke_mat", this._scene);
    smokeMat.diffuseColor = clr;
    smokeMat.emissiveColor = clr.scale(0.3);
    smokeMat.alpha = 0.7;
    smokeMat.disableLighting = true;

    // Several overlapping spheres for volume
    for (let i = 0; i < 5; i++) {
      const puff = MeshBuilder.CreateSphere("puff", { diameter: 0.5 + Math.random() * 0.3, segments: 6 }, this._scene);
      puff.position = position.clone();
      puff.position.x += (Math.random() - 0.5) * 0.4;
      puff.position.y += 0.3 + Math.random() * 0.5;
      puff.position.z += (Math.random() - 0.5) * 0.4;
      puff.material = smokeMat;
      puff.parent = root;
    }

    const totalDuration = 0.6;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (_dt, remaining) => {
        const t = 1 - remaining / totalDuration;
        const scale = 1 + t * 2;
        root.scaling.setAll(scale);
        smokeMat.alpha = Math.max(0, 0.7 * (1 - t));
        root.position.y += _dt * 1.5; // drift up
      },
    });
  }

  // ══════════════════ SHURIKEN (thrown) ══════════════════
  /**
   * Returns "shuriken" as a projectile shape identifier.
   * The actual mesh is built in projectileSystem.
   */

  // ══════════════════ TORNADO / SPIN DUST ══════════════════
  /**
   * Spawn swirling dust/wind lines around a position. Follows a unit.
   */
  spawnTornadoDust(position: Vector3): void {
    const root = new TransformNode("tornado", this._scene);
    root.position = position.clone();

    const dustMat = new StandardMaterial("dust_mat", this._scene);
    dustMat.diffuseColor = new Color3(0.7, 0.65, 0.5);
    dustMat.emissiveColor = new Color3(0.3, 0.28, 0.2);
    dustMat.alpha = 0.4;
    dustMat.disableLighting = true;

    for (let i = 0; i < 6; i++) {
      const ring = MeshBuilder.CreateTorus("ring", {
        diameter: 0.6 + i * 0.15, thickness: 0.03, tessellation: 12,
      }, this._scene);
      ring.position.y = i * 0.15;
      ring.rotation.x = (Math.random() - 0.5) * 0.3;
      ring.material = dustMat;
      ring.parent = root;
    }

    const totalDuration = 0.6;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (_dt, remaining) => {
        const fade = remaining / totalDuration;
        dustMat.alpha = fade * 0.5;
        root.rotation.y += _dt * 18;
        root.scaling.setAll(1 + (1 - fade) * 0.5);
      },
    });
  }

  // ══════════════════ IMPACT DUST ══════════════════
  /** Burst of tan dust spheres on every hit. */
  spawnImpactDust(position: Vector3): void {
    const root = new TransformNode("impactDust", this._scene);
    const mat = new StandardMaterial("idust_mat", this._scene);
    mat.diffuseColor = new Color3(0.75, 0.68, 0.5);
    mat.emissiveColor = new Color3(0.11, 0.10, 0.075);
    mat.alpha = 0.6;
    mat.disableLighting = true;

    const count = 3 + Math.floor(Math.random() * 2); // 3-4
    const velocities: Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const diam = 0.08 + Math.random() * 0.07;
      const puff = MeshBuilder.CreateSphere("dp", { diameter: diam, segments: 4 }, this._scene);
      puff.position = position.clone();
      puff.position.y += 0.3 + Math.random() * 0.3;
      puff.material = mat;
      puff.parent = root;
      velocities.push(new Vector3(
        (Math.random() - 0.5) * 0.6,
        1.5 + Math.random() * 0.5,
        (Math.random() - 0.5) * 0.6,
      ));
    }

    const totalDuration = 0.35;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (dt, remaining) => {
        const t = 1 - remaining / totalDuration;
        mat.alpha = Math.max(0, 0.6 * (1 - t));
        const children = root.getChildMeshes();
        for (let i = 0; i < children.length; i++) {
          const v = velocities[i];
          if (!v) continue;
          children[i].position.x += v.x * dt;
          children[i].position.y += v.y * dt;
          children[i].position.z += v.z * dt;
          const s = 0.5 + t * 0.7;
          children[i].scaling.setAll(s);
        }
      },
    });
  }

  // ══════════════════ HIT SPARKS ══════════════════
  /** Bright sparks that fly outward on melee hit. */
  spawnHitSparks(position: Vector3): void {
    const root = new TransformNode("hitSparks", this._scene);
    const mat = new StandardMaterial("spark_mat", this._scene);
    mat.diffuseColor = new Color3(1, 0.95, 0.7);
    mat.emissiveColor = new Color3(0.8, 0.76, 0.56);
    mat.disableLighting = true;

    const count = 5 + Math.floor(Math.random() * 2);
    const velocities: Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const spark = MeshBuilder.CreateBox("sp", { width: 0.015, height: 0.06, depth: 0.015 }, this._scene);
      spark.position = position.clone();
      spark.position.y += 0.5 + Math.random() * 0.3;
      spark.material = mat;
      spark.parent = root;
      velocities.push(new Vector3(
        (Math.random() - 0.5) * 3,
        1 + Math.random() * 3,
        (Math.random() - 0.5) * 3,
      ));
    }

    const totalDuration = 0.2;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (dt, remaining) => {
        const t = 1 - remaining / totalDuration;
        const children = root.getChildMeshes();
        for (let i = 0; i < children.length; i++) {
          const v = velocities[i];
          if (!v) continue;
          children[i].position.x += v.x * dt;
          children[i].position.y += v.y * dt;
          children[i].position.z += v.z * dt;
          v.y -= 9.8 * dt; // gravity
          const s = 1 - t;
          children[i].scaling.setAll(s);
        }
      },
    });
  }

  // ══════════════════ HIT FLASH ══════════════════
  /** Bright white pop on every hit. */
  spawnHitFlash(position: Vector3): void {
    const flash = MeshBuilder.CreateSphere("hflash", { diameter: 0.1, segments: 4 }, this._scene);
    flash.position = position.clone();
    flash.position.y += 0.5;
    const mat = new StandardMaterial("hflash_mat", this._scene);
    mat.diffuseColor = new Color3(1, 1, 1);
    mat.emissiveColor = new Color3(1, 1, 1);
    mat.disableLighting = true;

    flash.material = mat;
    const root = flash as unknown as TransformNode;

    const totalDuration = 0.15;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (_dt, remaining) => {
        const t = 1 - remaining / totalDuration;
        // Scale up quickly, then fade
        const s = t < 0.53 ? 1 + t * 6 : 4;
        flash.scaling.setAll(s);
        mat.alpha = t < 0.53 ? 1 : Math.max(0, 1 - (t - 0.53) * 2.1);
      },
    });
  }

  // ══════════════════ FIRE BURST ══════════════════
  /** Cluster of orange-red flame spheres. */
  spawnFireBurst(position: Vector3): void {
    const root = new TransformNode("fireBurst", this._scene);
    const count = 4 + Math.floor(Math.random() * 2);
    const mats: StandardMaterial[] = [];

    for (let i = 0; i < count; i++) {
      const innerT = i / (count - 1); // 0=inner, 1=outer
      const mat = new StandardMaterial(`fire_m${i}`, this._scene);
      const r = 1;
      const g = 0.55 - innerT * 0.35;
      const b = 0.08 - innerT * 0.03;
      mat.diffuseColor = new Color3(r, g, b);
      mat.emissiveColor = new Color3(r * (0.7 - innerT * 0.4), g * 0.8, b);
      mat.alpha = 0.8;
      mat.disableLighting = true;
      mats.push(mat);

      const diam = 0.15 + Math.random() * 0.15;
      const flame = MeshBuilder.CreateSphere("fl", { diameter: diam, segments: 4 }, this._scene);
      flame.position = position.clone();
      flame.position.x += (Math.random() - 0.5) * 0.3;
      flame.position.y += 0.3 + Math.random() * 0.4;
      flame.position.z += (Math.random() - 0.5) * 0.3;
      flame.material = mat;
      flame.parent = root;
    }

    const totalDuration = 0.5;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (dt, remaining) => {
        const t = 1 - remaining / totalDuration;
        for (const m of mats) m.alpha = Math.max(0, 0.8 * (1 - t));
        const s = 0.5 + t * 1.0;
        root.scaling.setAll(s);
        root.position.y += 2.0 * dt;
      },
    });
  }

  // ══════════════════ PERSISTENT SMOKE ══════════════════
  /** Dark smoke cloud that lingers after explosions. */
  spawnPersistentSmoke(position: Vector3): void {
    const root = new TransformNode("pSmoke", this._scene);
    const mat = new StandardMaterial("psmoke_mat", this._scene);
    mat.diffuseColor = new Color3(0.3, 0.3, 0.32);
    mat.emissiveColor = new Color3(0.06, 0.06, 0.064);
    mat.alpha = 0.5;
    mat.disableLighting = true;

    for (let i = 0; i < 3; i++) {
      const puff = MeshBuilder.CreateSphere("ps", { diameter: 0.4 + Math.random() * 0.2, segments: 5 }, this._scene);
      puff.position = position.clone();
      puff.position.x += (Math.random() - 0.5) * 0.3;
      puff.position.y += 0.4 + Math.random() * 0.3;
      puff.position.z += (Math.random() - 0.5) * 0.3;
      puff.material = mat;
      puff.parent = root;
    }

    const totalDuration = 0.8;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (dt, remaining) => {
        const t = 1 - remaining / totalDuration;
        mat.alpha = Math.max(0, 0.5 * (1 - t));
        const s = 1 + t * 1.5;
        root.scaling.setAll(s);
        root.position.y += 1.0 * dt;
      },
    });
  }

  // ══════════════════ GROUND SCORCH ══════════════════
  /** Flat dark disc left on the ground by explosions. */
  spawnGroundScorch(position: Vector3): void {
    const disc = MeshBuilder.CreateDisc("scorch", { radius: 0.5, tessellation: 12 }, this._scene);
    disc.position = position.clone();
    disc.position.y = 0.04;
    disc.rotation.x = Math.PI / 2;
    const mat = new StandardMaterial("scorch_mat", this._scene);
    mat.diffuseColor = new Color3(0.15, 0.12, 0.08);
    mat.emissiveColor = new Color3(0.03, 0.024, 0.016);
    mat.alpha = 0.4;
    mat.disableLighting = true;
    disc.material = mat;

    const totalDuration = 3.0;
    this._effects.push({
      root: disc as unknown as TransformNode,
      remaining: totalDuration,
      update: (_dt, remaining) => {
        mat.alpha = Math.max(0, 0.4 * (remaining / totalDuration));
      },
    });
  }

  dispose(): void {
    for (const e of this._effects) e.root.dispose();
    this._effects.length = 0;
  }
}
