export enum GameState {
  Placement,
  Countdown,
  Simulation,
  Result,
}

export type StateChangedCallback = (state: GameState) => void;

export class GameStateMachine {
  private _state = GameState.Placement;
  private _listeners: StateChangedCallback[] = [];

  get currentState(): GameState {
    return this._state;
  }

  setState(state: GameState): void {
    if (this._state === state) return;
    this._state = state;
    for (const cb of this._listeners) cb(state);
  }

  onStateChanged(cb: StateChangedCallback): void {
    this._listeners.push(cb);
  }

  removeListener(cb: StateChangedCallback): void {
    const idx = this._listeners.indexOf(cb);
    if (idx >= 0) this._listeners.splice(idx, 1);
  }
}
