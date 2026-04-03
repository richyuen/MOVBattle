# Visual Acceptance Gallery

## Scope
This gallery is the deterministic acceptance layer for the comprehensive visual pass. The executable source of truth is [`web/src/testing/scenarios.ts`](C:/Git/MOVBattle/web/src/testing/scenarios.ts).
The bespoke target definitions for the current tranche live in [`web/BESPOKE_VISUAL_TARGETS.md`](C:/Git/MOVBattle/web/BESPOKE_VISUAL_TARGETS.md).
Per-unit locked references live in [`web/TABS_REFERENCE_MATRIX.md`](C:/Git/MOVBattle/web/TABS_REFERENCE_MATRIX.md), and per-unit status tracking lives in [`web/TABS_VISUAL_TRACKER.md`](C:/Git/MOVBattle/web/TABS_VISUAL_TRACKER.md).

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
- `gallery_vehicle_close_reads`
  Covers close-read chassis distinction for the heaviest vehicles and shrines.
- `gallery_exposed_crew_mounts`
  Covers rider, crew, mount, and carried-structure readability.
- `gallery_giants_colossals`
  Covers giant and colossal scale distinction.
- `gallery_silhouette_heroes`
  Covers hero and boss differentiation when silhouette matters more than ornament.
- `gallery_state_reads`
  Covers attack and ability-state overlays in deterministic combat.

## Pairwise Galleries
- `gallery_pair_wild_west_gunslinger_vs_quick_draw`
- `gallery_pair_legacy_boxer_vs_super_boxer`
- `gallery_pair_good_chronomancer_vs_divine_arbiter`
- `gallery_pair_secret_vlad_vs_blackbeard`
- `gallery_pair_secret_sensei_vs_shogun`
- `gallery_pair_secret_witch_vs_necromancer`
- `gallery_pair_ancient_zeus_vs_legacy_thor`
- `gallery_pair_legacy_tank_vs_renaissance_da_vinci_tank`
- `gallery_pair_farmer_wheelbarrow_vs_secret_wheelbarrow_dragon`
- `gallery_pair_pirate_captain_vs_secret_blackbeard`
- `gallery_pair_spooky_vampire_vs_secret_vlad`
- `gallery_pair_dynasty_samurai_vs_secret_shogun`
- `gallery_pair_renaissance_musketeer_vs_wild_west_deadeye`
- `gallery_pair_legacy_wizard_vs_good_divine_arbiter`
- `gallery_pair_spooky_reaper_vs_evil_void_monarch`
- `gallery_pair_secret_artemis_vs_secret_ullr`
- `gallery_pair_legacy_banner_bearer_vs_flag_bearer`

## Capture Guidance
- Faction lineup galleries should be captured in placement mode with the `faction_lineup_close` preset.
- `gallery_iconic_heroes_bosses` uses `heroes_bosses_close`.
- `gallery_war_machines_composites` uses `war_machine_wide_close`.
- `gallery_vehicle_close_reads` uses `vehicle_detail_close`.
- `gallery_exposed_crew_mounts` uses `crew_mount_readability`.
- `gallery_giants_colossals` uses `giants_wide_close`.
- `gallery_silhouette_heroes` uses `silhouette_lineup`.
- `gallery_state_reads` uses `state_read_duel` and must be captured after its configured simulation advance so the ability overlays are visible before result UI can appear.
- Pairwise galleries use `heroes_bosses_close` unless a scenario overrides it.
- Gallery capture mode hides the HUD, unit panel, result overlay, and control help during screenshots.
- Screenshot names should follow the scenario id, for example `web/output/gallery-validation/gallery_state_reads.png`.
- Every gallery manifest entry records `reviewModes` and `reviewOrder`; default acceptance now expects `default`, `silhouette`, then `grayscale` review in that order even when a single runtime capture is used for the deterministic pass.

## Acceptance Criteria
- Every faction lineup scene shows readable differentiation between units within the same faction.
- Every curated hero/boss unit exposes at least one unmistakable silhouette cue beyond body tint.
- Vehicle and composite scenes do not read as duplicated humanoids with decorative extras.
- Giant and colossal scenes preserve scale hierarchy without collapsing into the same silhouette family.
- State-read scenes visibly expose the intended bow, smoke, summon, lightning, or spectral overlays.
- Pairwise scenes must make the compared units read as intentionally different even when color is ignored.
