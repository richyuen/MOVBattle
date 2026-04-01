# Visual Acceptance Gallery

## Scope
This gallery is the deterministic acceptance layer for the comprehensive visual pass. The executable source of truth is [`web/src/testing/scenarios.ts`](C:/Git/MOVBattle/web/src/testing/scenarios.ts).

## Runtime Flow
- Use `window.game.runScenarioGalleryValidation("<scenario-id>")` to run the scenario, apply the gallery camera preset, suppress capture-noise UI, and return structured assertion plus capture metadata.
- Use `window.game.getGalleryManifest()` to retrieve the accumulated manifest entries for the current browser session.
- Stable artifact targets live under `web/output/gallery-validation/`.
- The manifest file path is `web/output/gallery-validation/gallery-manifest.json`.

## Required Faction Lineups
- `gallery_faction_tribal`
- `gallery_faction_farmer`
- `gallery_faction_medieval`
- `gallery_faction_ancient`
- `gallery_faction_viking`
- `gallery_faction_dynasty`
- `gallery_faction_renaissance`
- `gallery_faction_pirate`
- `gallery_faction_spooky`
- `gallery_faction_wild_west`
- `gallery_faction_legacy`
- `gallery_faction_good`
- `gallery_faction_evil`
- `gallery_faction_secret`

## Curated Cross-Faction Galleries
- `gallery_iconic_heroes_bosses`
  Covers hero and boss silhouette checks for curated high-importance units.
- `gallery_war_machines_composites`
  Covers artillery, vehicles, and multi-part/composite readability.
- `gallery_giants_colossals`
  Covers giant and colossal scale distinction.
- `gallery_state_reads`
  Covers attack and ability-state overlays in deterministic combat.

## Capture Guidance
- Faction lineup galleries should be captured in placement mode with the `faction_lineup_close` preset.
- `gallery_iconic_heroes_bosses` uses `heroes_bosses_close`.
- `gallery_war_machines_composites` uses `war_machine_wide_close`.
- `gallery_giants_colossals` uses `giants_wide_close`.
- `gallery_state_reads` uses `state_read_duel` and must be captured after its configured simulation advance so the ability overlays are visible before result UI can appear.
- Gallery capture mode hides the HUD, unit panel, result overlay, and control help during screenshots.
- Screenshot names should follow the scenario id, for example `web/output/gallery-validation/gallery_state_reads.png`.

## Acceptance Criteria
- Every faction lineup scene shows readable differentiation between units within the same faction.
- Every curated hero/boss unit exposes at least one unmistakable silhouette cue beyond body tint.
- Vehicle and composite scenes do not read as duplicated humanoids with decorative extras.
- Giant and colossal scenes preserve scale hierarchy without collapsing into the same silhouette family.
- State-read scenes visibly expose the intended bow, smoke, summon, lightning, or spectral overlays.
