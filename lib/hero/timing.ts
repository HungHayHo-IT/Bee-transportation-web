/**
 * When each caption is on screen, as a fraction of the hero's progress: 0 is
 * the opening frame, 1 the resting frame. The engine plays that value through
 * on its own, and the ← → keys stop at the middle of each band, so a band is
 * also where a caption is "at".
 *
 * These are timings, not copy, so they live here rather than in the
 * dictionaries — the same bands apply in every language.
 *
 * The 17.04s of footage is spent by 0.92 (STAGE_FADE_FROM in engine.ts), which
 * puts the clip boundaries at 0.270 (v1|v2), 0.486 (v2|v3), 0.704 (v3|v4) and
 * 0.92 (last frame). Past that the video dissolves into the K3c backdrop,
 * which is why the closing caption runs on past 1.0 — it has to stay fully
 * opaque at the resting state, where the call to action is.
 *
 * Re-derive these if a clip is re-cut or the fade band moves.
 */
export const CAPTION_BANDS = [
  { from: -0.06, to: 0.15 }, // v1 — the truck pulls into the warehouse
  { from: 0.19, to: 0.33 }, // v1 → v2 — it stops, the doors start to open
  { from: 0.37, to: 0.48 }, // v2 — cargo bay fully open
  { from: 0.52, to: 0.68 }, // v3 — matter dissolves into wireframe
  { from: 0.73, to: 1.06 }, // v4 — light streams converge; resting state
] as const;
