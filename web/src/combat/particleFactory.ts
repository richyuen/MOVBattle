import {
  Scene, Vector3, Color4, Color3, Mesh, MeshBuilder,
  ParticleSystem, Texture,
  DynamicTexture,
} from "@babylonjs/core";
import type { AbstractMesh } from "@babylonjs/core";

let _particleTex: Texture | undefined;

/** Create or return a shared 32x32 radial gradient texture for all particle systems. */
function getParticleTexture(scene: Scene): Texture {
  if (_particleTex) return _particleTex;
  const dyn = new DynamicTexture("particleTex", 32, scene, false);
  const ctx = dyn.getContext();
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.6, "rgba(255,255,255,0.5)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  dyn.update();
  _particleTex = dyn;
  return dyn;
}

function c4(r: number, g: number, b: number, a = 1): Color4 {
  return new Color4(r, g, b, a);
}

// ─── Smoke ───

export function createSmoke(
  scene: Scene,
  emitter: Vector3 | AbstractMesh,
  color: Color3 = new Color3(0.4, 0.4, 0.45),
  capacity = 20,
): ParticleSystem {
  const ps = new ParticleSystem("smoke", capacity, scene);
  ps.particleTexture = getParticleTexture(scene);
  ps.emitter = emitter;

  ps.color1 = new Color4(color.r, color.g, color.b, 0.7);
  ps.color2 = new Color4(color.r * 0.8, color.g * 0.8, color.b * 0.8, 0.5);
  ps.colorDead = c4(color.r * 0.6, color.g * 0.6, color.b * 0.6, 0);

  ps.minSize = 0.15;
  ps.maxSize = 0.5;
  ps.minLifeTime = 0.3;
  ps.maxLifeTime = 0.6;
  ps.emitRate = capacity / 0.4;
  ps.gravity = new Vector3(0, 1.5, 0);
  ps.direction1 = new Vector3(-0.3, 0.5, -0.3);
  ps.direction2 = new Vector3(0.3, 1.5, 0.3);
  ps.minEmitPower = 0.3;
  ps.maxEmitPower = 0.8;
  ps.updateSpeed = 0.02;
  ps.blendMode = ParticleSystem.BLENDMODE_STANDARD;

  return ps;
}

// ─── Sparks ───

export function createSparks(
  scene: Scene,
  emitter: Vector3 | AbstractMesh,
  color: Color3 = new Color3(1, 0.95, 0.7),
  capacity = 15,
): ParticleSystem {
  const ps = new ParticleSystem("sparks", capacity, scene);
  ps.particleTexture = getParticleTexture(scene);
  ps.emitter = emitter;

  ps.color1 = c4(color.r, color.g, color.b, 1);
  ps.color2 = c4(color.r * 0.9, color.g * 0.8, color.b * 0.5, 0.8);
  ps.colorDead = c4(color.r * 0.5, color.g * 0.3, 0, 0);

  ps.minSize = 0.02;
  ps.maxSize = 0.06;
  ps.minLifeTime = 0.1;
  ps.maxLifeTime = 0.25;
  ps.emitRate = capacity / 0.15;
  ps.gravity = new Vector3(0, -9.8, 0);
  ps.direction1 = new Vector3(-3, 1, -3);
  ps.direction2 = new Vector3(3, 4, 3);
  ps.minEmitPower = 2;
  ps.maxEmitPower = 5;
  ps.updateSpeed = 0.01;
  ps.blendMode = ParticleSystem.BLENDMODE_ADD;

  return ps;
}

// ─── Fire ───

export function createFire(
  scene: Scene,
  emitter: Vector3 | AbstractMesh,
  capacity = 20,
): ParticleSystem {
  const ps = new ParticleSystem("fire", capacity, scene);
  ps.particleTexture = getParticleTexture(scene);
  ps.emitter = emitter;

  ps.color1 = c4(1, 0.6, 0.1, 0.9);
  ps.color2 = c4(1, 0.3, 0.05, 0.7);
  ps.colorDead = c4(0.3, 0.1, 0.05, 0);

  ps.minSize = 0.08;
  ps.maxSize = 0.25;
  ps.minLifeTime = 0.15;
  ps.maxLifeTime = 0.45;
  ps.emitRate = capacity / 0.35;
  ps.gravity = new Vector3(0, 2, 0);
  ps.direction1 = new Vector3(-0.3, 0.5, -0.3);
  ps.direction2 = new Vector3(0.3, 2, 0.3);
  ps.minEmitPower = 0.5;
  ps.maxEmitPower = 1.5;
  ps.updateSpeed = 0.02;
  ps.blendMode = ParticleSystem.BLENDMODE_ADD;

  return ps;
}

// ─── Dust ───

export function createDust(
  scene: Scene,
  emitter: Vector3 | AbstractMesh,
  color: Color3 = new Color3(0.75, 0.68, 0.5),
  capacity = 12,
): ParticleSystem {
  const ps = new ParticleSystem("dust", capacity, scene);
  ps.particleTexture = getParticleTexture(scene);
  ps.emitter = emitter;

  ps.color1 = c4(color.r, color.g, color.b, 0.6);
  ps.color2 = c4(color.r * 0.9, color.g * 0.9, color.b * 0.9, 0.4);
  ps.colorDead = c4(color.r * 0.7, color.g * 0.7, color.b * 0.7, 0);

  ps.minSize = 0.1;
  ps.maxSize = 0.35;
  ps.minLifeTime = 0.2;
  ps.maxLifeTime = 0.4;
  ps.emitRate = capacity / 0.3;
  ps.gravity = new Vector3(0, -2, 0);
  ps.direction1 = new Vector3(-1.5, 0.5, -1.5);
  ps.direction2 = new Vector3(1.5, 2, 1.5);
  ps.minEmitPower = 0.5;
  ps.maxEmitPower = 1.5;
  ps.updateSpeed = 0.02;
  ps.blendMode = ParticleSystem.BLENDMODE_STANDARD;

  return ps;
}

// ─── Trail (attaches to a moving mesh) ───

export function createTrail(
  scene: Scene,
  emitter: AbstractMesh,
  color: Color3,
  capacity = 10,
): ParticleSystem {
  const ps = new ParticleSystem("trail", capacity, scene);
  ps.particleTexture = getParticleTexture(scene);
  ps.emitter = emitter;

  ps.color1 = c4(color.r, color.g, color.b, 0.8);
  ps.color2 = c4(color.r * 0.7, color.g * 0.7, color.b * 0.7, 0.4);
  ps.colorDead = c4(color.r * 0.4, color.g * 0.4, color.b * 0.4, 0);

  ps.minSize = 0.04;
  ps.maxSize = 0.12;
  ps.minLifeTime = 0.1;
  ps.maxLifeTime = 0.3;
  ps.emitRate = capacity / 0.2;
  ps.gravity = new Vector3(0, 0.5, 0);
  ps.direction1 = new Vector3(-0.1, -0.1, -0.1);
  ps.direction2 = new Vector3(0.1, 0.1, 0.1);
  ps.minEmitPower = 0.1;
  ps.maxEmitPower = 0.3;
  ps.updateSpeed = 0.02;
  ps.blendMode = ParticleSystem.BLENDMODE_ADD;

  return ps;
}

// ─── Ambient FxPreset particles ───

export interface FxParticleConfig {
  color: Color3;
  gravity: Vector3;
  speed: [number, number];
  direction1: Vector3;
  direction2: Vector3;
  size: [number, number];
  lifeTime: [number, number];
}

const FX_CONFIGS: Record<string, FxParticleConfig> = {
  frost: {
    color: new Color3(0.6, 0.9, 1.0),
    gravity: new Vector3(0, -0.5, 0),
    speed: [0.1, 0.3],
    direction1: new Vector3(-0.3, -0.2, -0.3),
    direction2: new Vector3(0.3, 0.3, 0.3),
    size: [0.03, 0.07],
    lifeTime: [0.5, 1.0],
  },
  ember: {
    color: new Color3(1.0, 0.45, 0.12),
    gravity: new Vector3(0, 1.5, 0),
    speed: [0.3, 0.8],
    direction1: new Vector3(-0.2, 0.3, -0.2),
    direction2: new Vector3(0.2, 1, 0.2),
    size: [0.02, 0.05],
    lifeTime: [0.3, 0.7],
  },
  spectral: {
    color: new Color3(0.75, 0.7, 1.0),
    gravity: new Vector3(0, 0.3, 0),
    speed: [0.1, 0.4],
    direction1: new Vector3(-0.4, -0.1, -0.4),
    direction2: new Vector3(0.4, 0.4, 0.4),
    size: [0.04, 0.09],
    lifeTime: [0.5, 1.2],
  },
  solar: {
    color: new Color3(1.0, 0.88, 0.35),
    gravity: new Vector3(0, 0.5, 0),
    speed: [0.2, 0.5],
    direction1: new Vector3(-0.3, 0, -0.3),
    direction2: new Vector3(0.3, 0.5, 0.3),
    size: [0.03, 0.06],
    lifeTime: [0.3, 0.8],
  },
  wind: {
    color: new Color3(0.75, 0.95, 1.0),
    gravity: new Vector3(1, 0, 0),
    speed: [0.8, 1.5],
    direction1: new Vector3(0.5, -0.1, -0.2),
    direction2: new Vector3(1.5, 0.2, 0.2),
    size: [0.02, 0.04],
    lifeTime: [0.15, 0.35],
  },
  royal: {
    color: new Color3(0.95, 0.78, 0.3),
    gravity: new Vector3(0, -0.3, 0),
    speed: [0.1, 0.3],
    direction1: new Vector3(-0.2, -0.1, -0.2),
    direction2: new Vector3(0.2, 0.3, 0.2),
    size: [0.02, 0.04],
    lifeTime: [0.5, 1.0],
  },
};

export function createFxAmbient(
  scene: Scene,
  emitter: AbstractMesh,
  fxPreset: string,
  capacity = 8,
): ParticleSystem | null {
  const cfg = FX_CONFIGS[fxPreset];
  if (!cfg) return null;

  const ps = new ParticleSystem(`fx_${fxPreset}`, capacity, scene);
  ps.particleTexture = getParticleTexture(scene);
  ps.emitter = emitter;

  ps.color1 = c4(cfg.color.r, cfg.color.g, cfg.color.b, 0.7);
  ps.color2 = c4(cfg.color.r * 0.8, cfg.color.g * 0.8, cfg.color.b * 0.8, 0.4);
  ps.colorDead = c4(cfg.color.r * 0.5, cfg.color.g * 0.5, cfg.color.b * 0.5, 0);

  ps.minSize = cfg.size[0];
  ps.maxSize = cfg.size[1];
  ps.minLifeTime = cfg.lifeTime[0];
  ps.maxLifeTime = cfg.lifeTime[1];
  ps.emitRate = capacity / ((cfg.lifeTime[0] + cfg.lifeTime[1]) / 2);
  ps.gravity = cfg.gravity;
  ps.direction1 = cfg.direction1;
  ps.direction2 = cfg.direction2;
  ps.minEmitPower = cfg.speed[0];
  ps.maxEmitPower = cfg.speed[1];
  ps.updateSpeed = 0.02;
  ps.blendMode = ParticleSystem.BLENDMODE_ADD;

  return ps;
}
