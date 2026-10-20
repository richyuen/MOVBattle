/** What the loop keeps in plugin storage under `KEY`; the TUI mirrors it there for diagnostics. */
export type Loop = {
  /** On: a finished turn is followed by a fresh session and the prompt again. */
  armed: boolean
  /** The prompt each iteration is given. */
  prompt: string
  /** Iterations started so far. */
  count: number
  /** Stop after this many iterations; 0 for no limit. */
  max: number
  /** The commit HEAD was at when the running iteration started ('' outside a git repository). */
  head: string
}

export const KEY = 'loop'
export const DEFAULT_PROMPT = 'continue'
export const OFF: Loop = { armed: false, prompt: DEFAULT_PROMPT, count: 0, max: 0, head: '' }

/** `/autoloop` arguments: `on [max] [prompt…]`, `off`, `status` (also when empty). */
export type Ask =
  | { verb: 'on'; max: number; prompt: string }
  | { verb: 'off' }
  | { verb: 'status' }
  | { verb: 'unknown'; word: string }

export function parse(args: string): Ask {
  const words = args.trim().split(/\s+/).filter(w => w !== '')
  const verb = words[0] ?? 'status'
  if (verb === 'off' || verb === 'status') return { verb }
  if (verb !== 'on') return { verb: 'unknown', word: verb }
  let rest = words.slice(1)
  let max = 0
  if (rest[0] !== undefined && /^\d+$/.test(rest[0])) {
    max = Number(rest[0])
    rest = rest.slice(1)
  }
  return { verb: 'on', max, prompt: rest.length > 0 ? rest.join(' ') : DEFAULT_PROMPT }
}

/** What the end of a turn finds. */
export type Facts = {
  /** Background work still in flight: the session will be woken by it. */
  background: number
  /** Scheduled wake-ups of the session. */
  crons: number
  /** A file named STOP in the working directory. */
  hasStopFile: boolean
  /** HEAD now ('' outside a git repository). */
  head: string
}

export type Verdict =
  | { act: 'wait'; why: string }
  | { act: 'stop'; why: string }
  /** Stop for `why`, unless a turn starts within `GRACE_MS`: the iteration was not over. */
  | { act: 'grace'; why: string }
  | { act: 'again' }

/**
 * How long a turn that ended without a commit is given before the loop stops. A background task
 * that ended just before the turn did is no longer counted as running, and its notification
 * starts the turn that finishes the iteration: stopping at once switched the loop off under it.
 */
export const GRACE_MS = 60_000

/** Whether a finished turn is followed by the next iteration. */
export function decide(loop: Loop, facts: Facts): Verdict {
  if (facts.background > 0) return { act: 'wait', why: `${facts.background} background task(s) still running` }
  if (facts.crons > 0) return { act: 'wait', why: `${facts.crons} scheduled wake-up(s) pending` }
  if (facts.hasStopFile) return { act: 'stop', why: 'a STOP file is in the working directory' }
  if (loop.head !== '' && facts.head === loop.head) return { act: 'grace', why: `iteration ${loop.count} ended without a new commit` }
  if (loop.max > 0 && loop.count >= loop.max) return { act: 'stop', why: `${loop.max} iteration(s) done` }
  return { act: 'again' }
}

export function describe(loop: Loop): string {
  if (!loop.armed) return 'autoloop is off.'
  const limit = loop.max > 0 ? ` of ${loop.max}` : ''
  return `autoloop is on: iteration ${loop.count}${limit}, prompt "${loop.prompt}".`
}
