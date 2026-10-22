# ThunderID Samples

Ready-to-run sample apps for ThunderID. Each sample is a standalone project that depends on
the published release of its SDK, so it runs on its own once copied out of this repository.

## Layout

Samples live at `<area>/<sample>`:

| Area | Holds |
|---|---|
| `quickstarts` | The minimal app per platform that the ThunderID docs quickstarts walk through |
| `integrations` | ThunderID used through a third-party library, such as Better Auth or flutter_appauth |
| `self-care` | Apps built on ThunderID's self-service features |
| `b2b` | Apps where an administrator manages an organization's ThunderID resources |

Each sample is released on its own, as a source zip tagged `sample/<area>/<sample>/v<version>`.
`.github/workflows/release.yml` builds the release and `pr-builder.yml` builds every sample
on a pull request.

## Where to look next

| Working on… | Read |
|---|---|
| Adding a sample, or creating or updating a README banner | [.agent/skills/sample-banner/SKILL.md](.agent/skills/sample-banner/SKILL.md) |

## Adding a sample

- Put it under the area it belongs to and give it a `README.md` that follows the structure
  below. Follow the sample-banner skill to render its banner.
- Depend on the published SDK release, never a workspace or local path.
- Add a row to the table in the root `README.md`.
- Add it to `.github/workflows/release.yml`, in the same pull request, so it can be released.
  The workflow has no automatic discovery, so a sample left out of it never gets a release or
  a download. Add all three, in the same order as the other samples:
  - a `sample_<name>` boolean input under `workflow_dispatch.inputs`, described by its path;
  - the matching `sample_<name>: ${{ github.event.inputs.sample_<name> }}` line in the
    **Plan Releases** step's `env`;
  - an `add sample_<name> '{"path":"<area>/<sample>","emoji":"…","title":"ThunderID … Sample"}'`
    line in that step's script.

  `workflow_dispatch` allows at most 25 inputs. Count them before adding one.
- Keep its manifest (`package.json`, `pubspec.yaml`, `settings.gradle.kts`, or
  `Package.swift`) at the sample root. The pull request builder finds samples by that file
  at exactly `<area>/<sample>/`.

## Sample README structure

Every sample README uses the same sections, in this order. Copy an existing README of the same
kind (for example `quickstarts/react/README.md` for a web app, `quickstarts/android/README.md`
for a mobile app) and adapt it rather than starting from scratch.

1. The banner image, then a blank line. See the sample-banner skill.
2. `# <Title>`, matching the banner's alt text, such as `ThunderID React Quickstart` or
   `ThunderID Manage Sample`.
3. An intro of one or two paragraphs: what the app does, and the SDK or package it uses, linked.
   A short list or table of what it shows can follow.
4. `## Prerequisites`: the runtime and tools with minimum versions, then a running ThunderID
   server, with `https://localhost:8090` as the default.
5. `## Get the sample`: the releases link filtered to the sample
   (`https://github.com/thunder-id/samples/releases?q=sample%2F<area>%2F<sample>&expanded=true`)
   and `npx degit thunder-id/samples/<area>/<sample> my-app`.
6. `## Configure`: creating the application in the Console, named by its Console template
   (**React**, **Next.js**, **JavaScript**, and so on), then copying the config template and a
   table of every variable it holds.
7. `## Run`: the commands, then the URL to open or what to expect.
8. Optional sections specific to the sample, such as `## How it works`, `## Where things are`,
   or a feature walkthrough.
9. `## Learn more`: the docs quickstart guide and the SDK reference on thunderid.dev.
10. `## License`: `Apache License 2.0. See [LICENSE](https://github.com/thunder-id/samples/blob/main/LICENSE).`

Write in plain, direct sentences. Link only to pages that exist; check thunderid.dev links
before adding them.

## Package manager

JavaScript samples use npm, so that a developer who copies one out needs nothing beyond Node.js.

- Commit `package-lock.json`. Do not add a `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `yarn.lock`,
  or a `packageManager` field.
- Write npm commands in READMEs and in-app hints: `npm install`, `npm run dev`, `npm start`.
- Use the npm equivalents of pnpm settings: `overrides` in `package.json` for a pinned transitive
  version, and `allowScripts` (written with `npm approve-scripts` and `npm deny-scripts`) for
  install scripts.
- npm audit has no ignore list. An advisory that has no fix and is accepted goes in
  `AUDIT_ALLOWED_GHSAS` in `.github/workflows/pr-builder.yml`, with its justification.

If the developer asks for pnpm or yarn, say that samples default to npm and why. If they still
want it, use it, and point out that CI installs every sample with `npm ci`, so the pull request
builder needs a matching change.

## Rules

- Always write `ThunderID`. Never use a bare `thunder`, `Thunder`, or `THUNDER` as a short
  form of the product name. Package names and identifiers such as `@thunderid/react` and
  `thunderid_flutter` are fine.
- No em dashes and no double hyphens in READMEs or UI copy. Use a comma or a period.
- Keep changes focused on the task. Do not refactor unrelated samples.
- Commit messages are short imperative sentences without conventional commit prefixes.
