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

  dispose(): void {
    for (const e of this._effects) e.root.dispose();
    this._effects.length = 0;
  }
}
