import { expect, test } from 'bun:test'

import { decide, DEFAULT_PROMPT, type Facts, type Loop, parse } from './logic'

const LOOP: Loop = { armed: true, prompt: 'continue', count: 3, max: 0, head: 'aaa' }
const QUIET: Facts = { background: 0, crons: 0, hasStopFile: false, head: 'bbb' }

test('the arguments of /autoloop', () => {
  expect(parse('')).toEqual({ verb: 'status' })
  expect(parse(' off ')).toEqual({ verb: 'off' })
  expect(parse('on')).toEqual({ verb: 'on', max: 0, prompt: DEFAULT_PROMPT })
  expect(parse('on 5')).toEqual({ verb: 'on', max: 5, prompt: DEFAULT_PROMPT })
  expect(parse('on 5 do the  next task')).toEqual({ verb: 'on', max: 5, prompt: 'do the next task' })
  expect(parse('on next')).toEqual({ verb: 'on', max: 0, prompt: 'next' })
  expect(parse('go')).toEqual({ verb: 'unknown', word: 'go' })
})

test('a turn that ended with a new commit is followed by the next iteration', () => {
  expect(decide(LOOP, QUIET)).toEqual({ act: 'again' })
  // The first iteration's start has no commit to compare with outside a repository.
  expect(decide({ ...LOOP, head: '' }, { ...QUIET, head: '' })).toEqual({ act: 'again' })
})

test('a turn with background work or a wake-up pending is waited for, not cleared', () => {
  expect(decide(LOOP, { ...QUIET, background: 1 }).act).toBe('wait')
  expect(decide(LOOP, { ...QUIET, crons: 1 }).act).toBe('wait')
  // Waiting comes before every reason to stop: the turn is not over.
  expect(decide(LOOP, { ...QUIET, background: 1, hasStopFile: true, head: 'aaa' }).act).toBe('wait')
})

test('the loop stops on a STOP file and its limit; a turn without a commit gets a grace period', () => {
  expect(decide(LOOP, { ...QUIET, hasStopFile: true }).act).toBe('stop')
  expect(decide(LOOP, { ...QUIET, head: 'aaa' })).toEqual({ act: 'grace', why: 'iteration 3 ended without a new commit' })
  // A STOP file stops at once, commit or none.
  expect(decide(LOOP, { ...QUIET, hasStopFile: true, head: 'aaa' }).act).toBe('stop')
  expect(decide({ ...LOOP, max: 3 }, QUIET).act).toBe('stop')
  expect(decide({ ...LOOP, max: 4 }, QUIET).act).toBe('again')
})
