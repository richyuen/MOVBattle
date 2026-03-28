import { ArcRotateCamera, Vector3, Scene } from "@babylonjs/core";

export class CameraController {
  readonly camera: ArcRotateCamera;
  private _scene: Scene;

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this._scene = scene;

    this.camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,   // alpha (yaw)
      Math.PI / 3.5,   // beta (pitch)
      50,              // radius (zoom)
      Vector3.Zero(),  // target
      scene,
    );

    this.camera.lowerRadiusLimit = 8;
    this.camera.upperRadiusLimit = 120;
    this.camera.lowerBetaLimit = 0.2;
    this.camera.upperBetaLimit = Math.PI / 2.2;
    this.camera.panningSensibility = 15;
    this.camera.wheelPrecision = 8;
    this.camera.angularSensibilityX = 500;
    this.camera.angularSensibilityY = 500;

    // Touch: pinch to zoom, two-finger drag to pan/rotate
    this.camera.pinchPrecision = 40;
    this.camera.useNaturalPinchZoom = true;

    // Right-click drag to rotate, middle-click to pan
    this.camera.attachControl(canvas, true);

    // Keyboard rotation (Q/E) handled via game input
  }

  rotateBy(delta: number): void {
    this.camera.alpha += delta * 0.02;
  }
}
