import {
  Scene, Color3, PBRMetallicRoughnessMaterial,
} from "@babylonjs/core";

export type MatCategory = "metal" | "wood" | "cloth" | "skin" | "bone" | "stone" | "unlit";

interface CategoryDefaults {
  metallic: number;
  roughness: number;
}

const CATEGORY_DEFAULTS: Record<MatCategory, CategoryDefaults> = {
  metal:  { metallic: 0.85, roughness: 0.25 },
  wood:   { metallic: 0.0,  roughness: 0.75 },
  cloth:  { metallic: 0.0,  roughness: 0.90 },
  skin:   { metallic: 0.0,  roughness: 0.60 },
  bone:   { metallic: 0.0,  roughness: 0.50 },
  stone:  { metallic: 0.0,  roughness: 0.80 },
  unlit:  { metallic: 0.0,  roughness: 1.0  },
};

function colorKey(c: Color3): string {
  return `${(c.r * 255) | 0},${(c.g * 255) | 0},${(c.b * 255) | 0}`;
}

function cacheKey(
  category: MatCategory,
  color: Color3,
  emissive: Color3 | undefined,
  alpha: number,
  roughnessOverride: number | undefined,
  metallicOverride: number | undefined,
): string {
  const ek = emissive ? colorKey(emissive) : "0";
  const ro = roughnessOverride ?? -1;
  const mo = metallicOverride ?? -1;
  return `${category}:${colorKey(color)}:${ek}:${alpha}:${ro}:${mo}`;
}

/**
 * Centralized PBR material cache. Call `get*()` helpers instead of
 * `new StandardMaterial()` everywhere — identical requests share one instance.
 */
export class MaterialFactory {
  private _scene: Scene;
  private _cache = new Map<string, PBRMetallicRoughnessMaterial>();

  constructor(scene: Scene) {
    this._scene = scene;
  }

  /** Generic entry point — prefer the typed helpers below. */
  get(
    category: MatCategory,
    color: Color3,
    opts?: { emissive?: Color3; emissiveIntensity?: number; alpha?: number; roughness?: number; metallic?: number },
  ): PBRMetallicRoughnessMaterial {
    const emissive = opts?.emissive ?? (opts?.emissiveIntensity
      ? color.scale(opts.emissiveIntensity)
      : undefined);
    const alpha = opts?.alpha ?? 1;
    const key = cacheKey(category, color, emissive, alpha, opts?.roughness, opts?.metallic);

    let mat = this._cache.get(key);
    if (mat) return mat;

    const defaults = CATEGORY_DEFAULTS[category];
    mat = new PBRMetallicRoughnessMaterial("pbr", this._scene);
    mat.baseColor = color;
    mat.metallic = opts?.metallic ?? defaults.metallic;
    mat.roughness = opts?.roughness ?? defaults.roughness;
    if (emissive) mat.emissiveColor = emissive;
    if (alpha < 1) {
      mat.alpha = alpha;
      mat.transparencyMode = 2; // ALPHABLEND
    }
    if (category === "unlit") {
      mat.disableLighting = true;
    }

    this._cache.set(key, mat);
    return mat;
  }

  /**
   * Create a unique (non-cached) material — for per-unit body/skin materials
   * whose baseColor and emissiveColor are mutated at runtime.
   */
  createUnique(
    category: MatCategory,
    color: Color3,
    opts?: { roughness?: number; metallic?: number },
  ): PBRMetallicRoughnessMaterial {
    const defaults = CATEGORY_DEFAULTS[category];
    const mat = new PBRMetallicRoughnessMaterial("pbr_unique", this._scene);
    mat.baseColor = color;
    mat.metallic = opts?.metallic ?? defaults.metallic;
    mat.roughness = opts?.roughness ?? defaults.roughness;
    if (category === "unlit") mat.disableLighting = true;
    return mat;
  }

  // ─── Typed helpers ───

  getMetal(color: Color3, roughness?: number): PBRMetallicRoughnessMaterial {
    return this.get("metal", color, { roughness });
  }

  getWood(color: Color3): PBRMetallicRoughnessMaterial {
    return this.get("wood", color);
  }

  getCloth(color: Color3): PBRMetallicRoughnessMaterial {
    return this.get("cloth", color);
  }

  getSkin(color: Color3): PBRMetallicRoughnessMaterial {
    return this.get("skin", color);
  }

  getBone(color: Color3): PBRMetallicRoughnessMaterial {
    return this.get("bone", color);
  }

  getStone(color: Color3): PBRMetallicRoughnessMaterial {
    return this.get("stone", color);
  }

  getUnlit(color: Color3, alpha?: number): PBRMetallicRoughnessMaterial {
    return this.get("unlit", color, { alpha });
  }

  getEmissive(color: Color3, intensity: number): PBRMetallicRoughnessMaterial {
    return this.get("unlit", color, { emissiveIntensity: intensity });
  }

  /** Number of cached materials. */
  get count(): number {
    return this._cache.size;
  }

  dispose(): void {
    for (const m of this._cache.values()) m.dispose();
    this._cache.clear();
  }
}

/** Singleton — initialised once from main.ts or the first consumer. */
let _instance: MaterialFactory | undefined;

export function initMaterialFactory(scene: Scene): MaterialFactory {
  _instance = new MaterialFactory(scene);
  return _instance;
}

export function getMaterialFactory(): MaterialFactory {
  if (!_instance) throw new Error("MaterialFactory not initialised — call initMaterialFactory(scene) first");
  return _instance;
}
