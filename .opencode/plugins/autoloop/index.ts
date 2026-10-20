import { Plugin } from '@opencode/plugin'

/**
 * The autoloop itself lives in `tui.ts`: it drives the terminal session and registers
 * `/autoloop`. This entrypoint only makes the directory a discoverable plugin.
 */
export default Plugin.define({
  id: 'autoloop',
  setup() {},
})
