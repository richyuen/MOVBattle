import type { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import type { SSAO2RenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssao2RenderingPipeline";
import type { GlowLayer } from "@babylonjs/core/Layers/glowLayer";

export type QualityTier = "low" | "medium" | "high";

export interface GraphicsSystems {
  pipeline: DefaultRenderingPipeline;
  ssao: SSAO2RenderingPipeline;
  glowLayer: GlowLayer;
}

export function applyQualityTier(tier: QualityTier, systems: GraphicsSystems): void {
  const { pipeline, ssao, glowLayer } = systems;

  switch (tier) {
    case "low":
      pipeline.bloomEnabled = true;
      pipeline.fxaaEnabled = true;
      pipeline.imageProcessing.vignetteEnabled = false;
      ssao.totalStrength = 0; // effectively disabled
      glowLayer.intensity = 0;
      break;

    case "medium":
      pipeline.bloomEnabled = true;
      pipeline.fxaaEnabled = true;
      pipeline.imageProcessing.vignetteEnabled = true;
      ssao.totalStrength = 0.8;
      ssao.samples = 16;
      glowLayer.intensity = 0.6;
      break;

    case "high":
      pipeline.bloomEnabled = true;
      pipeline.fxaaEnabled = true;
      pipeline.imageProcessing.vignetteEnabled = true;
      ssao.totalStrength = 1.0;
      ssao.samples = 24;
      glowLayer.intensity = 0.8;
      break;
  }
}
