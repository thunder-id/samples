# ThunderID Samples

Ready-to-run sample apps for ThunderID. Each sample is a standalone project that depends on
the published release of its SDK, so it runs on its own once copied out of this repository.

## Layout

Samples live at `<area>/<sample>`, exactly two levels deep:

| Area | Holds | Sample name | Example |
|---|---|---|---|
| `quickstarts` | The minimal app per platform that the ThunderID docs quickstarts walk through | `quickstart-<platform>[-<variant>]` | `quickstarts/quickstart-react-b2b` |
| `integrations` | ThunderID used through a third-party library | `<library>-<platform>` | `integrations/app-auth-flutter` |
| `patterns` | An architecture that spans more than one app | `<pattern>-<platforms>` | `patterns/bff-react-express` |
| `self-service` | Apps where a signed-in user manages their own account | `<app>-<platform>` | `self-service/myaccount-react` |
| `management` | Apps where an administrator manages an organization's ThunderID resources | `<app>-<platform>` | `management/admin-react` |
| `b2b` | Apps that serve many business customers, each one an organization | `<app>-<platform>` | `b2b/wayfinder-enterprise-nextjs` |

Name a sample in lowercase kebab case, ending with the platform it is built on. The same app on
another platform is a sibling with its own suffix, such as `self-service/myaccount-vue`, never a
nested folder. Sample names are unique across areas: the banner and the release zip are named
after the sample alone (`myaccount-react.png`, `thunderid-myaccount-react-sample-v1.0.0.zip`).
An npm sample's `package.json` is named `@thunderid/<sample>-sample`, and the apps inside a
multi-app sample `@thunderid/<sample>-<app>`, such as `@thunderid/bff-react-express-client`.

Each sample is released on its own, as a source zip tagged `sample/<area>/<sample>/v<version>`.
The path is also the sample's ID outside this repository: the docs link to it, the docs'
ecosystem releases feed and the Console's sample download look it up by it, and the SDK
repositories' E2E suites copy the quickstarts by it. Renaming or moving a sample therefore
needs matching changes in thunder-id/thunderid (`docs/`) and in the SDK repositories, and a
release under the new path, since its earlier releases stay under the old tag.
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
- Add a row to its area's table under `## Samples` in the root `README.md`, in alphabetical
  order. A new area gets its own `### <Area>` heading, a one-line description, and a
  table, in the same order as the Layout table above, and a row in that Layout table.
- Add it to `.github/workflows/release.yml`, in the same pull request, so it can be released.
  The workflow has no automatic discovery, so a sample left out of it never gets a release or
  a download. Add all three, in the same order as the other samples:
  - a `sample_<area>_<sample>` boolean input under `workflow_dispatch.inputs`, with every
    hyphen turned into an underscore (`sample_self_service_myaccount_react`), described by its
    path;
  - the matching `sample_<area>_<sample>: ${{ github.event.inputs.sample_<area>_<sample> }}`
    line in the **Plan Releases** step's `env`;
  - an `add sample_<area>_<sample> '{"path":"<area>/<sample>","emoji":"…","title":"ThunderID … Sample"}'`
    line in that step's script.

  `workflow_dispatch` allows at most 25 inputs. Count them before adding one.
- Keep its manifest (`package.json`, `pubspec.yaml`, `settings.gradle.kts`, or
  `Package.swift`) at the sample root. The pull request builder finds samples by that file
  at exactly `<area>/<sample>/`. A sample made of several apps, such as a `patterns` sample
  with `client/` and `server/`, keeps a root `package.json` that lists them as npm workspaces,
  with one `package-lock.json` beside it, so CI installs, lints, and builds them together.

## Sample README structure

Every sample README uses the same sections, in this order. Copy an existing README of the same
kind (for example `quickstarts/quickstart-react/README.md` for a web app, `quickstarts/quickstart-android/README.md`
for a mobile app) and adapt it rather than starting from scratch.

1. The banner image, then a blank line. See the sample-banner skill.
2. `# <Title>`, matching the banner's alt text, such as `ThunderID React Quickstart` or
   `ThunderID Admin Sample`.
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
- To update a transitive dependency, add an `overrides` entry for it in `package.json` and
  update `package-lock.json` to match. Never change only the lockfile: `npm install` can
  resolve the old version again, for example when the lockfile is regenerated or when another
  repository adds its own overrides to the sample, as the `javascript-sdks` E2E tests do.
- npm audit has no ignore list. An advisory that has no fix and is accepted goes in
  `AUDIT_ALLOWED_GHSAS` in `.github/workflows/pr-builder.yml`, with its justification.

If the developer asks for pnpm or yarn, say that samples default to npm and why. If they still
want it, use it, and point out that CI installs every sample with `npm ci`, so the pull request
builder needs a matching change.

## Pull request labels

Every pull request carries one label that says what kind of change it is. The `🔎 PR Check / 🏷️ Check PR Labels` check fails without one, and each sample's release notes and `CHANGELOG.md` are grouped by it (see `.github/release.yml`). A sample's notes list only the pull requests that changed files under it. Pick the label from what someone running the sample would notice:

| Label | Use it for | Release notes section |
|---|---|---|
| `Type/New Feature` | Something that wasn't there before: a new sample, or a capability a sample now shows | 🚀 Features |
| `Type/Improvement` | Something that exists, made better: an SDK version bump, clearer UI or README, better configuration | ✨ Improvements |
| `Type/Bug` | A fix for a sample that behaved wrongly or didn't build | 🐛 Bug Fixes |
| `skip-changelog` | A change nobody running a sample sees: CI and release tooling, banners, agent instructions | Left out |

- When a change breaks how people get or run a sample, also add `breaking change`, and fill in the pull request's Breaking Changes section. Examples are a renamed or moved sample, or a changed configuration variable. It is listed under ⚠️ Breaking Changes.
- When a change mixes kinds, pick the label that matters most to someone using the sample.
- Add the label when raising the pull request (`gh pr create --label "Type/Bug"`), or later with `gh pr edit <number> --add-label "Type/Bug"`.
- If the check ran before the label was added, re-running it fails again, because it replays the original event. Remove and re-add the label to start a fresh run.

## Rules

- Always write `ThunderID`. Never use a bare `thunder`, `Thunder`, or `THUNDER` as a short
  form of the product name. Package names and identifiers such as `@thunderid/react` and
  `thunderid_flutter` are fine.
- No em dashes and no double hyphens in READMEs or UI copy. Use a comma or a period.
- Keep changes focused on the task. Do not refactor unrelated samples.
- Commit messages are short imperative sentences without conventional commit prefixes.
