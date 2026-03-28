export class BudgetSystem {
  private _remaining: [number, number];
  private _maxUnitsPerTeam: number;

  constructor(teamABudget: number, teamBBudget: number, maxUnitsPerTeam: number) {
    this._remaining = [Math.max(0, teamABudget), Math.max(0, teamBBudget)];
    this._maxUnitsPerTeam = Math.max(1, maxUnitsPerTeam);
  }

  getRemaining(team: number): number {
    return this._remaining[team];
  }

  canAfford(team: number, cost: number): boolean {
    return cost >= 0 && this._remaining[team] >= cost;
  }

  canAddUnit(team: number, existingCount: number): boolean {
    return existingCount >= 0 && existingCount < this._maxUnitsPerTeam;
  }

  trySpend(team: number, cost: number): boolean {
    if (!this.canAfford(team, cost)) return false;
    this._remaining[team] -= cost;
    return true;
  }

  refund(team: number, amount: number): void {
    if (amount <= 0) return;
    this._remaining[team] += amount;
  }
}
