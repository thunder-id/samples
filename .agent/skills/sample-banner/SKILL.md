---
name: sample-banner
description: Create or update the README banner for a sample in thunder-id/samples, or the repository banner. Use when adding a new sample, renaming or re-describing one, or changing the banner design.
allowed-tools: Bash(*) Read(*) Edit(*) Write(*)
---

# Sample Banner

Every sample README, and the repository README, opens with a banner rendered from the design
in this skill. Banners are PNGs committed to `.github/assets/banners/` and referenced by absolute URL,
so they render on GitHub, on npm-style mirrors, and inside downloaded release zips alike.

## Files

| Path | What it is |
|---|---|
| `banners.json` | One entry per banner: the repository banner under `repo`, each sample under `samples` |
| `template/banner.css` | The banner design, shared by every banner |
| `scripts/render.cjs` | Builds each banner page and screenshots it to `.github/assets/banners/` |
| `assets/thunderid-mark.svg` | The ThunderID mark shown in the left logo box. Do not redraw or recolor it |
| `assets/bolt-deco.svg` | The lightning bolt watermark in the top right corner |
| `assets/check.svg`, `assets/copy.svg` | The badge and copy button icons |
| `assets/logos/*.svg` | Technology logos for the right logo box |
| `assets/logos/logos.json` | Each logo's file, its box background (`boxStyle`), and where it came from (`source`) |

The design originates from the ThunderID repo banners used across the SDK repositories, so a
sample banner matches the banner of the SDK it uses.

## Technology logos

Use a logo that is already in `assets/logos/` when the sample's technology has one. A sample
that is about a feature rather than a platform (for example `self-care/account`) uses the
logo of the framework it is built with.

To add a logo:

1. Take the official mark from the project's own brand or press page. If it has none, use
   [Simple Icons](https://simpleicons.org), pinned to a version through jsDelivr, for example
   `https://cdn.jsdelivr.net/npm/simple-icons@15.22.0/icons/<slug>.svg`. Simple Icons are
   single color, so set the `fill` to the brand color.
2. Save it as `assets/logos/<key>.svg`, sized to fit a 94px box (about 50px on its longest
   side) with explicit `width` and `height`. Prefix any `id` inside it so it cannot collide
   with another inline SVG.
3. Add `<key>` to `logos.json` with a `boxStyle` in the same pattern as the others: a dark
   gradient tinted with the brand color and a soft glow in that color. A logo that only reads
   on a light background, such as Apple's, gets a light box instead.
4. Record the exact `source` URL, and the license when it is not the project's own mark.

## Add or update a banner

1. **Edit `banners.json`.** A sample entry takes:
   - `path`: the sample directory, `<area>/<sample>`. The PNG is named after it, with the
     slash replaced: `quickstarts/react` renders to `quickstarts-react.png`.
   - `alt`: the image alt text, `ThunderID <Technology> <Quickstart|Sample>`.
   - `badge`: `QUICKSTART`, `INTEGRATION`, `PATTERN`, `SELF-CARE SAMPLE`, or `B2B SAMPLE`, matching the area.
   - `logo`: a key in `logos.json`.
   - `title`: short, with the emphasized part wrapped in `<accent>`, for example
     `React <accent>Quickstart</accent>`. It has to fit on one line at 48px.
   - `accent`: the brand color of the technology, or `#FFFFFF` for a monochrome brand.
   - `desc`: one sentence, at most two lines, saying what the sample does and which ThunderID
     package it uses.

   The install box shows `npx degit thunder-id/samples/<path> my-app`, built from `path`.

2. **Render.** From this skill's `scripts` directory:

   ```bash
   npx -y -p playwright@1.60.0 sh -c 'NODE_PATH="$(dirname "$(command -v playwright)")/.." node render.cjs quickstarts/react'
   ```

   Pass one or more sample paths, or `repo` for the repository banner. With none it renders
   every banner. Add `--html <dir>` to also write the banner pages there for a browser
   preview. If Playwright has no Chromium yet, run `npx -y playwright@1.60.0 install chromium`
   first.

   The script screenshots at a device scale factor of 2 with a transparent background, so
   every PNG is 2000 by 840 with alpha around the rounded corners.

3. **Look at every PNG you rendered.** Open it and check that the title is on one line, the
   description wraps to two lines at most, the install box does not overflow, and the logo is
   centered in its box. Fix `banners.json` or the logo and render again until it does.

4. **Reference it from the README.** The banner is the first line of the sample's
   `README.md`, followed by a blank line and the existing `#` heading:

   ```markdown
   ![ThunderID React Quickstart](https://raw.githubusercontent.com/thunder-id/samples/main/.github/assets/banners/quickstarts-react.png)
   ```

   Always use the absolute `raw.githubusercontent.com` URL on `main`, never a relative path.
   A release zip contains only the sample directory, so a relative path breaks there. The URL
   resolves once the pull request merges.

5. **Add the sample to the root `README.md` table** if it is new.

Commit the PNG, the `banners.json` entry, any new logo, and the README change together.

## Changing the design

Edit `template/banner.css` or the markup in `scripts/render.cjs`, then render every banner
with no arguments and review all of them, since every banner shares the design.

## Copy rules

- Always write `ThunderID`, never a bare `Thunder` as a short form.
- No em dashes and no double hyphens in a title or description. Use a comma or a period.
