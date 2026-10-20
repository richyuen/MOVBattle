import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { Plugin } from '@opencode/plugin/tui'
import type { Context } from '@opencode/plugin/tui/context'

import {
  decide,
  describe,
  GRACE_MS,
  KEY,
  type Loop,
  OFF,
  parse,
} from './logic'

const USAGE = 'Usage: /autoloop on [max] [prompt]  |  /autoloop off  |  /autoloop status'

/** A turn is executing in the loop's tracked session. */
let isRunning = false
/** The next iteration is being created. */
let isStarting = false
/** Turns started so far: a grace period ends when one starts. */
let turns = 0
/** The session the running iteration belongs to. */
let trackedSessionID: string | undefined
/** A turn that ended while `startNext` was still running. */
let pendingEnd: string | undefined
/** The agent and model the loop was started with. */
let agent: string | undefined
let model: { providerID: string; id: string; variant?: string } | undefined

/** The loop state; `persist` mirrors it into plugin storage for diagnostics. */
let loop: Loop = { ...OFF }
let persist: (next: Loop) => Promise<void> = async () => {}

let graceTimer: ReturnType<typeof setTimeout> | undefined

function toast(context: Context, message: string, variant: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
  context.ui.toast.show({ title: 'autoloop', message, variant, duration: 6000 })
}

function clearGrace(): void {
  if (graceTimer !== undefined) {
    clearTimeout(graceTimer)
    graceTimer = undefined
  }
}

async function save(next: Loop): Promise<void> {
  loop = next
  await persist(next)
}

function head(directory: string): string {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: directory,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return ''
  }
}

function hasStopFile(directory: string): boolean {
  return existsSync(join(directory, 'STOP'))
}

function currentSessionID(context: Context): string | undefined {
  const route = context.ui.router.current()
  return route.type === 'session' ? route.sessionID : undefined
}

async function stopLoop(context: Context, why: string): Promise<void> {
  clearGrace()
  await save({ ...loop, armed: false })
  isRunning = false
  toast(context, `stopped: ${why}.`, 'warning')
}

/**
 * Starts the next iteration in a fresh session, which is the OpenCode equivalent of `/clear`:
 * the prompt is the first message of a context that has no earlier turns.
 */
async function startNext(context: Context, location: { directory: string; workspaceID?: string }): Promise<void> {
  if (isStarting) return
  isStarting = true
  try {
    if (!loop.armed) return

    const next: Loop = { ...loop, count: loop.count + 1, head: head(location.directory) }
    await save(next)

    const session = await context.client.session.create({
      location,
      title: `autoloop ${next.count}`,
      agent,
      model,
      metadata: { autoloop: true, iteration: next.count },
    })

    trackedSessionID = session.id
    if (context.ui.tabs.enabled()) context.ui.tabs.focus(session.id)
    else context.ui.router.navigate({ type: 'session', sessionID: session.id })

    await context.client.session.prompt({
      sessionID: session.id,
      text: next.prompt,
      metadata: { autoloop: true, iteration: next.count },
    })

    toast(context, `iteration ${next.count} started.`, 'info')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await stopLoop(context, `the next iteration could not start (${message})`)
  } finally {
    isStarting = false
    if (pendingEnd !== undefined) {
      const sessionID = pendingEnd
      pendingEnd = undefined
      void judge(context, location, sessionID)
    }
  }
}

/**
 * A turn ended in the tracked session. The loop continues only when the turn made a commit,
 * unless a STOP file or the iteration limit says otherwise.
 */
async function judge(context: Context, location: { directory: string; workspaceID?: string }, sessionID: string): Promise<void> {
  if (sessionID !== trackedSessionID) return
  if (isStarting) {
    pendingEnd = sessionID
    return
  }
  if (!loop.armed) return

  const verdict = decide(loop, {
    background: 0,
    crons: 0,
    hasStopFile: hasStopFile(location.directory),
    head: head(location.directory),
  })

  if (verdict.act === 'stop') {
    await stopLoop(context, verdict.why)
  } else if (verdict.act === 'grace') {
    stopUnlessWoken(context, location, verdict.why)
  } else if (verdict.act === 'again') {
    await startNext(context, location)
  }
}

/**
 * A turn ended without a commit and nothing is known to be running. The loop stops for `why`
 * after `GRACE_MS` unless a turn starts first (a background task's notification, a wake-up):
 * that turn's end is then judged anew.
 */
function stopUnlessWoken(context: Context, location: { directory: string; workspaceID?: string }, why: string): void {
  const seen = turns
  clearGrace()
  toast(context, `${why}; stops in ${Math.round(GRACE_MS / 1000)} s unless the session wakes.`, 'warning')
  graceTimer = setTimeout(() => {
    graceTimer = undefined
    void (async () => {
      if (turns !== seen || isRunning || isStarting) return
      if (!loop.armed) return
      // A commit made without a turn (by hand, in the grace period) is an iteration done too.
      if (loop.head !== '' && head(location.directory) !== loop.head) await startNext(context, location)
      else await stopLoop(context, why)
    })()
  }, GRACE_MS)
}

export default Plugin.define({
  id: 'autoloop.cli',
  async setup(context) {
    const location = context.location ?? context.data.location.default()
    const [, setStored] = context.storage.store<Loop>(KEY, { initial: OFF })
    persist = async next => {
      await setStored(draft => {
        Object.assign(draft, next)
      })
    }

    // A new TUI session starts with the loop off: an armed flag left in storage by a TUI that
    // was closed must not start clearing the next one.
    loop = { ...OFF }
    await persist(loop)

    const captureSelection = () => {
      const activeID = currentSessionID(context)
      const info = activeID === undefined ? undefined : context.data.session.get(activeID)
      const selected = context.ui.model.current()
      agent = info?.agent
      model = info?.model ?? (selected === undefined
        ? undefined
        : { providerID: selected.providerID, id: selected.modelID, variant: selected.variant })
    }

    context.keymap.layer(() => ({
      mode: 'global',
      commands: [
        {
          id: 'autoloop',
          title: 'Autoloop',
          description: 'Run a prompt again and again, each time in a fresh context',
          group: 'Autoloop',
          palette: true,
          slash: { name: 'autoloop', arguments: true },
          run: (input?: string) => {
            const ask = parse(input ?? '')
            if (ask.verb === 'unknown') {
              toast(context, `"${ask.word}" is not a subcommand. ${USAGE}`, 'error')
              return
            }
            if (ask.verb === 'status') {
              toast(context, `${describe(loop)} ${USAGE}`, 'info')
              return
            }
            if (ask.verb === 'off') {
              clearGrace()
              void save({ ...loop, armed: false })
              toast(context, loop.armed ? 'off. The running turn, if any, finishes and nothing follows it.' : 'was already off.', 'info')
              return
            }
            captureSelection()
            void (async () => {
              await save({ armed: true, prompt: ask.prompt, count: 0, max: ask.max, head: '' })
              if (!isRunning) {
                const activeID = currentSessionID(context)
                if (activeID !== undefined && context.data.session.status(activeID) === 'running') {
                  // The current turn finishes first; its end starts iteration 1.
                  trackedSessionID = activeID
                  isRunning = true
                  toast(context, `on: waiting for the running turn to finish, then "${ask.prompt}".`, 'success')
                  return
                }
                await startNext(context, location)
              }
            })()
          },
        },
      ],
      bindings: ['autoloop'],
    }))

    const unsubscribe: Array<() => void> = []

    unsubscribe.push(context.data.on('session.execution.started', event => {
      if (event.data.sessionID !== trackedSessionID) return
      turns++
      isRunning = true
      clearGrace()
    }))

    unsubscribe.push(context.data.on('session.execution.succeeded', event => {
      if (event.data.sessionID !== trackedSessionID) return
      isRunning = false
      void judge(context, location, event.data.sessionID)
    }))

    unsubscribe.push(context.data.on('session.execution.failed', event => {
      if (event.data.sessionID !== trackedSessionID) return
      isRunning = false
      void stopLoop(context, `iteration ${loop.count} failed (${event.data.error.message})`)
    }))

    unsubscribe.push(context.data.on('session.execution.interrupted', event => {
      if (event.data.sessionID !== trackedSessionID) return
      isRunning = false
      void stopLoop(context, `iteration ${loop.count} was interrupted (${event.data.reason})`)
    }))

    // A prompt the person types is theirs to have answered and read: the loop goes off instead of
    // clearing the answer away. The loop's own prompts carry `autoloop` metadata.
    unsubscribe.push(context.data.on('session.inbox.enqueued', event => {
      const item = event.data.item
      if (item.type !== 'user') return
      if (item.payload.metadata?.autoloop === true) return
      if (item.payload.text.trim().startsWith('/autoloop')) return
      if (!loop.armed) return
      void stopLoop(context, 'you sent a prompt (/autoloop on starts it again)')
    }))

    return () => {
      clearGrace()
      for (const off of unsubscribe) off()
    }
  },
})
