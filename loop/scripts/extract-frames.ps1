# One-time extraction of TABS reference frames for the improvement loop.
# Output (all gitignored under reference/):
#   reference/frames/gameplay_sheet_NN.jpg  3x3 sheets of 640px frames from the 16-min gameplay video
#   reference/frames/trailer_<n>_sheet_NN.jpg  3x3 sheets, one frame per 3 s, from each trailer
#   reference/small/tabs_screenshot_NN.jpg  the 9 store screenshots at 960px wide
# Requires ffmpeg on PATH.
$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$ref = Join-Path $root "reference"
$frames = Join-Path $ref "frames"
$small = Join-Path $ref "small"
New-Item -ItemType Directory -Force $frames | Out-Null
New-Item -ItemType Directory -Force $small | Out-Null
Get-ChildItem $frames -Filter *.jpg | Remove-Item -Force
Get-ChildItem $small -Filter *.jpg | Remove-Item -Force

$gameplay = Join-Path $ref "videos\tabs_gameplay_16min_reference_720p.mp4"
# Scene changes at least 6 s apart, plus a frame every 20 s regardless, so quiet stretches are still sampled.
$select = "(gt(scene,0.3)*gte(t-prev_selected_t,6))+isnan(prev_selected_t)+gte(t-prev_selected_t,20)"
& ffmpeg -v error -y -i $gameplay -vf "select='$select',scale=640:-1,tile=3x3" -vsync vfr -q:v 4 (Join-Path $frames "gameplay_sheet_%02d.jpg")

$trailers = @(
  @{ file = "tabs_trailer_01_announcement_max.mp4"; tag = "trailer_1" },
  @{ file = "tabs_trailer_02_full_release_max.mp4"; tag = "trailer_2" },
  @{ file = "tabs_trailer_03_official_legacy_faction.mp4"; tag = "trailer_3" }
)
foreach ($t in $trailers) {
  $in = Join-Path $ref ("videos\" + $t.file)
  & ffmpeg -v error -y -i $in -vf "fps=1/3,scale=640:-1,tile=3x3" -vsync vfr -q:v 4 (Join-Path $frames ($t.tag + "_sheet_%02d.jpg"))
}

Get-ChildItem (Join-Path $ref "screenshots") -Filter *.jpg | ForEach-Object {
  & ffmpeg -v error -y -i $_.FullName -vf "scale=960:-1" -q:v 3 (Join-Path $small $_.Name)
}

Write-Output "frames:"; Get-ChildItem $frames | ForEach-Object { "  $($_.Name) $([math]::Round($_.Length/1KB)) KB" }
Write-Output "small:"; Get-ChildItem $small | ForEach-Object { "  $($_.Name) $([math]::Round($_.Length/1KB)) KB" }
