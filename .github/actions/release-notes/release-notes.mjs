// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// Writes the release notes and the CHANGELOG entry for one sample. GitHub generates the notes,
// grouping the pull requests by their `Type/*` label as configured in .github/release.yml (the same
// format as the thunder-id/thunderid releases), but it knows nothing about samples: it lists every
// pull request merged since the previous tag, whatever sample it changed. So this asks GitHub for
// the notes since the sample's previous tag (`sample/<path>/v*`), keeps only the pull requests that
// changed files under the sample's directory, and drops the sections that end up empty.
//
// Usage: node release-notes.mjs <sample-path> <version> <out-file>
// Runs before the sample is tagged, against the branch being released (GITHUB_REF_NAME). Writes the
// GitHub release body to <out-file> and adds the same notes, under a `## <version>` heading, to the
// top of <sample-path>/CHANGELOG.md. Needs `gh`, authenticated through GH_TOKEN, and the samples'
// tags in the local clone.

import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const [samplePath, version, outFile] = process.argv.slice(2);
if (!samplePath || !version || !outFile) {
  console.error('Usage: node release-notes.mjs <sample-path> <version> <out-file>');
  process.exit(1);
}

const repo = process.env.GITHUB_REPOSITORY;
const target = process.env.GITHUB_REF_NAME;
const dir = samplePath.replace(/\/+$/, '');
const tag = `sample/${dir}/v${version}`;
const PR_LINK = /\/pull\/(\d+)\s*$/;

function gh(...args) {
  return execFileSync('gh', args, {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
}

function git(...args) {
  return execFileSync('git', args, {encoding: 'utf8'}).trim();
}

// The sample's newest tag other than the one being released, or none for its first release.
const previous = git('tag', '--list', `sample/${dir}/v*`, '--sort=-v:refname')
  .split('\n')
  .find((t) => t && t !== tag);

function touches(pr) {
  const files = gh('api', '--paginate', `repos/${repo}/pulls/${pr}/files`, '--jq', '.[].filename');
  return files.split('\n').some((file) => file.startsWith(`${dir}/`));
}

// Keeps the lines that link a pull request changing the sample, and the headings that still have
// lines under them. Other lines, such as the "Full Changelog" link, are kept as they are.
function filterNotes(body) {
  const kept = body.split('\n').filter((line) => {
    const pr = line.startsWith('* ') && line.match(PR_LINK);
    return !pr || touches(pr[1]);
  });

  const out = [];
  for (let i = 0; i < kept.length; i += 1) {
    const line = kept[i];
    if (/^#{2,3} /.test(line)) {
      // A heading stays only if a list item follows it before the next heading of the same or a
      // higher level.
      const level = line.match(/^#+/)[0].length;
      let hasItems = false;
      for (let j = i + 1; j < kept.length; j += 1) {
        const next = kept[j].match(/^(#+) /);
        if (next && next[1].length <= level) break;
        if (kept[j].startsWith('* ')) {
          hasItems = true;
          break;
        }
      }
      if (!hasItems) continue;
    }
    out.push(line);
  }
  return out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// The CHANGELOG entry is the release notes under the version's heading, without the top-level
// "What's Changed" heading and the "New Contributors" section.
function changelogEntry(notes) {
  const lines = [];
  let skip = false;
  for (const line of notes.split('\n')) {
    if (/^## What.s Changed/.test(line)) continue;
    if (/^## New Contributors/.test(line)) {
      skip = true;
      continue;
    }
    if (line.startsWith('**Full Changelog**')) skip = false;
    if (!skip) lines.push(line);
  }
  return `## ${version}\n\n${lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`;
}

// The generator comment GitHub puts at the top is dropped along the way.
const args = ['api', `repos/${repo}/releases/generate-notes`, '-f', `tag_name=${tag}`, '--jq', '.body'];
if (target) args.push('-f', `target_commitish=${target}`);
if (previous) args.push('-f', `previous_tag_name=${previous}`);

let notes = filterNotes(
  gh(...args)
    .split('\n')
    .filter((line) => !line.startsWith('<!--'))
    .join('\n'),
);
// On a first release GitHub compares against some other sample's tag, so that link is dropped.
if (!previous) notes = notes.replace(/^\*\*Full Changelog\*\*.*$/m, '').trim();
if (!notes.includes('* ')) {
  notes = `No changes to this sample${previous ? ` since ${previous}` : ''}.\n\n${notes}`.trim();
}

writeFileSync(outFile, `${notes}\n`);
const changelog = join(dir, 'CHANGELOG.md');
const existing = existsSync(changelog) ? readFileSync(changelog, 'utf8') : '';
const entry = changelogEntry(notes);
writeFileSync(changelog, existing ? `${entry}\n${existing}` : entry);
console.log(`${tag} (since ${previous ?? 'the first release'}):\n${notes}`);
