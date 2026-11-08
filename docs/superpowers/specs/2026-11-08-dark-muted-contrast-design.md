# Dark-mode muted text contrast (#201)

## Goal & scope

Bring dark-theme muted text up to WCAG AA (at least 4.5:1) on every surface it sits on: `--background`, `--surface` and `--muted`. The light theme stays as it is, since it already passes at 5.47:1 or better. No other tokens change.

## Approach

Raise the dark `--muted-foreground` from `oklch(0.58 0.015 240)` to `oklch(0.62 0.015 240)`. Ratios, computed with the OKLCH → sRGB → WCAG luminance formula:

| Lightness | on `--background` | on `--surface` | on `--muted` |
|---|---|---|---|
| 0.58 (today) | 4.54 | **4.32** | **4.05** |
| 0.62 (new) | 5.34 | 5.08 | 4.77 |

The foreground text is about 15:1, so muted text still reads as clearly secondary.

Rejected alternatives:
- **0.60:** it clears 4.5 on background and surface, but only reaches 4.40 on `--muted`.
- **Darkening the surfaces instead:** that changes every card on the site, which is a bigger visual change for the same gain.

## Design

- Change one line in `src/styles.css`, in the `.dark` block.
- Add a regression test, `src/lib/__tests__/theme-contrast.test.ts`. It parses the `.dark` and `:root:not(.dark)` blocks of `src/styles.css`, converts the OKLCH tokens to WCAG luminance, and asserts at least 4.5:1 for `--muted-foreground` on background, surface and muted, in both themes. A later token tweak can't silently regress it.

## Decisions made

- The new value is 0.62, the smallest step that passes on all three surfaces with some margin.
- Chroma and hue stay as they are (0.015, 240).
- The test is a unit test reading the CSS file, not a browser check, so it runs in `pnpm test` and CI.

## Testing

- **Unit:** the new contrast test fails at 0.58 (surface 4.32) and passes at 0.62.
- **QA:** dark mode at 1280 px and 390 px on /consulting and a post page. Measured contrast of a card blurb should be at least 4.5.

## Risks

None of note. It's one colour token, and the test documents the threshold.
