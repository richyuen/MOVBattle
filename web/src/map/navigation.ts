import { Vector3 } from "@babylonjs/core";
import type { HazardRegion } from "./hazards";
import { isPointInsideHazard } from "./hazards";
import type { Obstacle } from "./obstacles";
import type { PlacementZone } from "./placementValidator";

type NavigationSizeClass = "small" | "medium" | "large";

interface GridPoint {
  col: number;
  row: number;
}

interface NavBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface NavigationRoute {
  waypoints: Vector3[];
  resolvedGoal: Vector3;
  usedFallbackGoal: boolean;
}

const CLEARANCE_BY_SIZE: Record<NavigationSizeClass, number> = {
  small: 0.45,
  medium: 0.70,
  large: 1.05,
};

const NAVIGATION_MARGIN = 14;
const DEFAULT_NAV_BOUNDS: NavBounds = {
  minX: -64,
  maxX: 64,
  minZ: -54,
  maxZ: 54,
};

const NEIGHBORS: ReadonlyArray<readonly [dx: number, dz: number, cost: number]> = [
  [1, 0, 1],
  [-1, 0, 1],
  [0, 1, 1],
  [0, -1, 1],
  [1, 1, Math.SQRT2],
  [1, -1, Math.SQRT2],
  [-1, 1, Math.SQRT2],
  [-1, -1, Math.SQRT2],
];

function classifyRadius(radius: number): NavigationSizeClass {
  if (radius <= CLEARANCE_BY_SIZE.small) return "small";
  if (radius <= CLEARANCE_BY_SIZE.medium) return "medium";
  return "large";
}

function computeBounds(
  zones: readonly PlacementZone[],
  obstacles: readonly Obstacle[],
  hazards: readonly HazardRegion[],
): NavBounds {
  let minX = DEFAULT_NAV_BOUNDS.minX;
  let maxX = DEFAULT_NAV_BOUNDS.maxX;
  let minZ = DEFAULT_NAV_BOUNDS.minZ;
  let maxZ = DEFAULT_NAV_BOUNDS.maxZ;

  const expand = (left: number, right: number, top: number, bottom: number) => {
    minX = Math.min(minX, left);
    maxX = Math.max(maxX, right);
    minZ = Math.min(minZ, top);
    maxZ = Math.max(maxZ, bottom);
  };

  for (const zone of zones) {
    expand(
      zone.center.x - zone.size.x / 2,
      zone.center.x + zone.size.x / 2,
      zone.center.z - zone.size.z / 2,
      zone.center.z + zone.size.z / 2,
    );
  }

  for (const obstacle of obstacles) {
    if (obstacle.type === "box") {
      expand(
        obstacle.center.x - obstacle.halfX,
        obstacle.center.x + obstacle.halfX,
        obstacle.center.z - obstacle.halfZ,
        obstacle.center.z + obstacle.halfZ,
      );
    } else {
      expand(
        obstacle.center.x - obstacle.radius,
        obstacle.center.x + obstacle.radius,
        obstacle.center.z - obstacle.radius,
        obstacle.center.z + obstacle.radius,
      );
    }
  }

  for (const hazard of hazards) {
    if (hazard.shape === "box") {
      expand(
        hazard.center.x - hazard.halfX,
        hazard.center.x + hazard.halfX,
        hazard.center.z - hazard.halfZ,
        hazard.center.z + hazard.halfZ,
      );
    } else {
      expand(
        hazard.center.x - hazard.radius,
        hazard.center.x + hazard.radius,
        hazard.center.z - hazard.radius,
        hazard.center.z + hazard.radius,
      );
    }
  }

  return {
    minX: minX - NAVIGATION_MARGIN,
    maxX: maxX + NAVIGATION_MARGIN,
    minZ: minZ - NAVIGATION_MARGIN,
    maxZ: maxZ + NAVIGATION_MARGIN,
  };
}

function isPointBlockedByObstacle(point: Vector3, padding: number, obstacle: Obstacle): boolean {
  if (obstacle.type === "box") {
    const dx = Math.abs(point.x - obstacle.center.x);
    const dz = Math.abs(point.z - obstacle.center.z);
    return dx <= obstacle.halfX + padding && dz <= obstacle.halfZ + padding;
  }

  const dx = point.x - obstacle.center.x;
  const dz = point.z - obstacle.center.z;
  const radius = obstacle.radius + padding;
  return dx * dx + dz * dz <= radius * radius;
}

export class NavigationGrid {
  readonly cellSize: number;
  readonly bounds: NavBounds;
  readonly columns: number;
  readonly rows: number;

  private readonly _grids: Record<NavigationSizeClass, Uint8Array>;
  private readonly _cellCount: number;

  constructor(
    zones: readonly PlacementZone[],
    obstacles: readonly Obstacle[],
    hazards: readonly HazardRegion[],
    cellSize = 1.25,
  ) {
    this.cellSize = cellSize;
    this.bounds = computeBounds(zones, obstacles, hazards);
    this.columns = Math.max(1, Math.ceil((this.bounds.maxX - this.bounds.minX) / this.cellSize));
    this.rows = Math.max(1, Math.ceil((this.bounds.maxZ - this.bounds.minZ) / this.cellSize));
    this._cellCount = this.columns * this.rows;
    this._grids = {
      small: new Uint8Array(this._cellCount),
      medium: new Uint8Array(this._cellCount),
      large: new Uint8Array(this._cellCount),
    };

    (Object.keys(this._grids) as NavigationSizeClass[]).forEach((sizeClass) => {
      const padding = CLEARANCE_BY_SIZE[sizeClass] + 0.1;
      const grid = this._grids[sizeClass];
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.columns; col++) {
          const point = this._cellCenter(col, row);
          if (
            hazards.some((hazard) => isPointInsideHazard(point, hazard, padding))
            || obstacles.some((obstacle) => isPointBlockedByObstacle(point, padding, obstacle))
          ) {
            grid[this._index(col, row)] = 1;
          }
        }
      }
    });
  }

  isWalkablePosition(point: Vector3, unitRadius: number): boolean {
    const cell = this._worldToCell(point);
    if (!cell) return false;
    return this._isWalkableCell(cell.col, cell.row, classifyRadius(unitRadius));
  }

  findOpenPositionNear(
    point: Vector3,
    unitRadius: number,
    preferredDirection?: Vector3,
    maxSearchDistance = Number.POSITIVE_INFINITY,
  ): Vector3 | null {
    const cell = this._worldToCell(point);
    if (!cell) return null;
    const limitedRadius = Number.isFinite(maxSearchDistance)
      ? Math.max(0, Math.ceil(maxSearchDistance / this.cellSize))
      : undefined;
    const openCell = this._findNearestOpenCell(
      cell,
      classifyRadius(unitRadius),
      point,
      preferredDirection,
      limitedRadius,
    );
    return openCell ? this._cellCenter(openCell.col, openCell.row) : null;
  }

  findRoute(start: Vector3, goal: Vector3, unitRadius: number): NavigationRoute | null {
    const sizeClass = classifyRadius(unitRadius);
    const startCell = this._findNearestOpenCell(this._worldToCell(start), sizeClass, start);
    const goalCell = this._findNearestOpenCell(this._worldToCell(goal), sizeClass, goal);
    if (!startCell || !goalCell) return null;

    if (
      startCell.col === goalCell.col
      && startCell.row === goalCell.row
      && this._hasLineOfSight(start, goal, unitRadius)
    ) {
      return {
        waypoints: [goal.clone()],
        resolvedGoal: goal.clone(),
        usedFallbackGoal: false,
      };
    }

    const result = this._runAStar(startCell, goalCell, sizeClass);
    if (!result) return null;
    const endCell = result.reachedGoal ? goalCell : result.bestCell;
    const resolvedGoal = this._cellCenter(endCell.col, endCell.row);
    const rawPath = this._reconstructPath(result.parents, startCell, endCell);
    const waypoints = this._smoothPath(rawPath, start, goal, resolvedGoal, unitRadius);
    if (waypoints.length === 0) {
      waypoints.push(result.reachedGoal ? goal.clone() : resolvedGoal);
    }

    return {
      waypoints,
      resolvedGoal,
      usedFallbackGoal: !result.reachedGoal,
    };
  }

  private _runAStar(start: GridPoint, goal: GridPoint, sizeClass: NavigationSizeClass): {
    parents: Int32Array;
    bestCell: GridPoint;
    reachedGoal: boolean;
  } | null {
    const startIndex = this._index(start.col, start.row);
    const goalIndex = this._index(goal.col, goal.row);
    const gScore = new Float32Array(this._cellCount);
    const fScore = new Float32Array(this._cellCount);
    const parents = new Int32Array(this._cellCount);
    const openSet = new Uint8Array(this._cellCount);
    const closedSet = new Uint8Array(this._cellCount);
    const pending: number[] = [];

    gScore.fill(Number.POSITIVE_INFINITY);
    fScore.fill(Number.POSITIVE_INFINITY);
    parents.fill(-1);

    gScore[startIndex] = 0;
    fScore[startIndex] = this._heuristic(start.col, start.row, goal.col, goal.row);
    openSet[startIndex] = 1;
    pending.push(startIndex);

    let bestIndex = startIndex;
    let bestHeuristic = this._heuristic(start.col, start.row, goal.col, goal.row);

    while (pending.length > 0) {
      let currentPointer = 0;
      let currentIndex = pending[0];
      let currentScore = fScore[currentIndex];
      for (let i = 1; i < pending.length; i++) {
        const candidate = pending[i];
        if (fScore[candidate] < currentScore) {
          currentPointer = i;
          currentIndex = candidate;
          currentScore = fScore[candidate];
        }
      }

      pending.splice(currentPointer, 1);
      openSet[currentIndex] = 0;
      closedSet[currentIndex] = 1;

      if (currentIndex === goalIndex) {
        return {
          parents,
          bestCell: goal,
          reachedGoal: true,
        };
      }

      const currentCell = this._gridPointFromIndex(currentIndex);
      const currentHeuristic = this._heuristic(currentCell.col, currentCell.row, goal.col, goal.row);
      if (currentHeuristic < bestHeuristic) {
        bestHeuristic = currentHeuristic;
        bestIndex = currentIndex;
      }

      for (const [dx, dz, cost] of NEIGHBORS) {
        const nextCol = currentCell.col + dx;
        const nextRow = currentCell.row + dz;
        if (!this._isWalkableCell(nextCol, nextRow, sizeClass)) continue;
        if (dx !== 0 && dz !== 0) {
          if (!this._isWalkableCell(currentCell.col + dx, currentCell.row, sizeClass)) continue;
          if (!this._isWalkableCell(currentCell.col, currentCell.row + dz, sizeClass)) continue;
        }

        const nextIndex = this._index(nextCol, nextRow);
        if (closedSet[nextIndex] === 1) continue;

        const tentativeG = gScore[currentIndex] + cost;
        if (tentativeG >= gScore[nextIndex]) continue;

        parents[nextIndex] = currentIndex;
        gScore[nextIndex] = tentativeG;
        fScore[nextIndex] = tentativeG + this._heuristic(nextCol, nextRow, goal.col, goal.row);
        if (openSet[nextIndex] === 0) {
          openSet[nextIndex] = 1;
          pending.push(nextIndex);
        }
      }
    }

    return {
      parents,
      bestCell: this._gridPointFromIndex(bestIndex),
      reachedGoal: false,
    };
  }

  private _smoothPath(
    path: GridPoint[],
    start: Vector3,
    requestedGoal: Vector3,
    resolvedGoal: Vector3,
    unitRadius: number,
  ): Vector3[] {
    if (path.length === 0) return [];

    const points = path.map((cell) => this._cellCenter(cell.col, cell.row));
    const waypoints: Vector3[] = [];
    let anchorPoint = start;
    let anchorIndex = 0;

    while (anchorIndex < points.length) {
      let furthest = anchorIndex;
      for (let i = anchorIndex; i < points.length; i++) {
        if (!this._hasLineOfSight(anchorPoint, points[i], unitRadius)) break;
        furthest = i;
      }

      const selected = points[furthest];
      if (Vector3.DistanceSquared(anchorPoint, selected) > 0.05) {
        waypoints.push(selected);
      }
      anchorPoint = selected;
      anchorIndex = furthest + 1;
    }

    const finalGoal = this.isWalkablePosition(requestedGoal, unitRadius) && this._hasLineOfSight(anchorPoint, requestedGoal, unitRadius)
      ? requestedGoal
      : resolvedGoal;

    if (waypoints.length === 0 || Vector3.DistanceSquared(waypoints[waypoints.length - 1], finalGoal) > 0.05) {
      waypoints.push(finalGoal.clone());
    }

    return waypoints;
  }

  private _hasLineOfSight(start: Vector3, end: Vector3, unitRadius: number): boolean {
    const delta = end.subtract(start);
    delta.y = 0;
    const distance = Math.sqrt(delta.x * delta.x + delta.z * delta.z);
    const steps = Math.max(1, Math.ceil(distance / Math.max(0.3, this.cellSize * 0.55)));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const sample = new Vector3(
        start.x + delta.x * t,
        0,
        start.z + delta.z * t,
      );
      if (!this.isWalkablePosition(sample, unitRadius)) return false;
    }
    return true;
  }

  private _reconstructPath(parents: Int32Array, start: GridPoint, end: GridPoint): GridPoint[] {
    const result: GridPoint[] = [];
    const startIndex = this._index(start.col, start.row);
    let current = this._index(end.col, end.row);

    while (current !== -1 && current !== startIndex) {
      result.push(this._gridPointFromIndex(current));
      current = parents[current];
    }

    result.reverse();
    return result;
  }

  private _findNearestOpenCell(
    start: GridPoint | null,
    sizeClass: NavigationSizeClass,
    reference?: Vector3,
    preferredDirection?: Vector3,
    maxRadius?: number,
  ): GridPoint | null {
    if (!start) return null;
    if (this._isWalkableCell(start.col, start.row, sizeClass)) return start;

    const searchRadius = maxRadius ?? Math.max(this.columns, this.rows);
    let best: GridPoint | null = null;
    let bestScore = Number.POSITIVE_INFINITY;
    const preferred = preferredDirection && preferredDirection.lengthSquared() > 0.0001
      ? preferredDirection.normalize()
      : null;

    for (let radius = 1; radius <= searchRadius; radius++) {
      for (let col = start.col - radius; col <= start.col + radius; col++) {
        const top = { col, row: start.row - radius };
        const bottom = { col, row: start.row + radius };
        bestScore = this._scoreOpenCandidate(top, sizeClass, reference, preferred, bestScore, (candidate, score) => {
          best = candidate;
          bestScore = score;
        });
        bestScore = this._scoreOpenCandidate(bottom, sizeClass, reference, preferred, bestScore, (candidate, score) => {
          best = candidate;
          bestScore = score;
        });
      }
      for (let row = start.row - radius + 1; row <= start.row + radius - 1; row++) {
        const left = { col: start.col - radius, row };
        const right = { col: start.col + radius, row };
        bestScore = this._scoreOpenCandidate(left, sizeClass, reference, preferred, bestScore, (candidate, score) => {
          best = candidate;
          bestScore = score;
        });
        bestScore = this._scoreOpenCandidate(right, sizeClass, reference, preferred, bestScore, (candidate, score) => {
          best = candidate;
          bestScore = score;
        });
      }
      if (best) return best;
    }

    return null;
  }

  private _scoreOpenCandidate(
    candidate: GridPoint,
    sizeClass: NavigationSizeClass,
    reference: Vector3 | undefined,
    preferredDirection: Vector3 | null,
    currentBest: number,
    commit: (candidate: GridPoint, score: number) => void,
  ): number {
    if (!this._isWalkableCell(candidate.col, candidate.row, sizeClass)) return currentBest;

    let score = 0;
    if (reference) {
      const center = this._cellCenter(candidate.col, candidate.row);
      score = Vector3.DistanceSquared(center, reference);
      if (preferredDirection) {
        const offset = center.subtract(reference);
        offset.y = 0;
        if (offset.lengthSquared() > 0.0001) {
          score -= Vector3.Dot(offset.normalize(), preferredDirection) * this.cellSize;
        }
      }
    }

    if (score < currentBest) {
      commit(candidate, score);
      return score;
    }
    return currentBest;
  }

  private _isWalkableCell(col: number, row: number, sizeClass: NavigationSizeClass): boolean {
    if (col < 0 || col >= this.columns || row < 0 || row >= this.rows) return false;
    return this._grids[sizeClass][this._index(col, row)] === 0;
  }

  private _worldToCell(point: Vector3 | null): GridPoint | null {
    if (!point) return null;
    const col = Math.floor((point.x - this.bounds.minX) / this.cellSize);
    const row = Math.floor((point.z - this.bounds.minZ) / this.cellSize);
    if (col < 0 || col >= this.columns || row < 0 || row >= this.rows) return null;
    return { col, row };
  }

  private _cellCenter(col: number, row: number): Vector3 {
    return new Vector3(
      this.bounds.minX + col * this.cellSize + this.cellSize / 2,
      0,
      this.bounds.minZ + row * this.cellSize + this.cellSize / 2,
    );
  }

  private _gridPointFromIndex(index: number): GridPoint {
    return {
      col: index % this.columns,
      row: Math.floor(index / this.columns),
    };
  }

  private _index(col: number, row: number): number {
    return row * this.columns + col;
  }

  private _heuristic(col: number, row: number, targetCol: number, targetRow: number): number {
    const dx = Math.abs(targetCol - col);
    const dz = Math.abs(targetRow - row);
    const diagonal = Math.min(dx, dz);
    const straight = Math.max(dx, dz) - diagonal;
    return diagonal * Math.SQRT2 + straight;
  }
}
