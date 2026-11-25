// Renders the README banners listed in banners.json to .github/assets/banners/*.png.
//
//   node render.cjs [--html <dir>] [<sample path or "repo"> ...]
//
// With no names it renders every banner. --html writes the banner pages to <dir> as well,
// for previewing in a browser. Needs the playwright package; see SKILL.md for the command.

const fs = require('node:fs');
const path = require('node:path');

const skillDir = path.resolve(__dirname, '..');
const repoRoot = path.resolve(skillDir, '../../..');
const outDir = path.join(repoRoot, '.github/assets/banners');

const read = (...p) => fs.readFileSync(path.join(skillDir, ...p), 'utf8');
const css = read('template/banner.css');
const logos = JSON.parse(read('assets/logos/logos.json'));
const {repo, samples} = JSON.parse(read('banners.json'));
const svg = {
  bolt: read('assets/bolt-deco.svg'),
  mark: read('assets/thunderid-mark.svg'),
  check: read('assets/check.svg'),
  copy: read('assets/copy.svg'),
};

const hexToRgb = hex => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

const title = (text, accent) =>
  text.replace(/<accent>(.*?)<\/accent>/, `<span style="color:${accent};">$1</span>`);

const page = body => `<!doctype html>
<html><head><meta charset="utf-8"><style>${css}
html, body { background: transparent; padding: 0; }
</style></head><body>${body}</body></html>`;

const repoBanner = () => `
  <div class="banner">
    <div class="layer layer-gradient" style="background:
      radial-gradient(ellipse 85% 75% at 15% 72%, #032a2a 0%, transparent 58%),
      radial-gradient(ellipse 55% 55% at 88% 18%, #04201f 0%, transparent 50%),
      linear-gradient(160deg, #041a1c 0%, #040e1c 100%);"></div>
    <div class="layer layer-grid"></div>
    <div class="layer layer-glow" style="background:radial-gradient(ellipse 60% 48% at 50% 55%, rgba(${hexToRgb(repo.accent)},0.08) 0%, transparent 70%);"></div>
    <div class="bolt-deco">${svg.bolt}</div>
    <div class="content">
      <div class="badge" style="border-color:rgba(${hexToRgb(repo.accent)},0.32);background:rgba(${hexToRgb(repo.accent)},0.07);">${svg.check} ${repo.badge}</div>
      <div class="logo-box logo-thunder">${svg.mark}</div>
      <div class="pkg-name">${title(repo.title, repo.accent)}</div>
      <div class="pkg-desc">${repo.desc}</div>
    </div>
  </div>`;

const sampleBanner = s => {
  const logo = logos[s.logo];
  if (!logo) throw new Error(`${s.path}: unknown logo "${s.logo}"`);
  return `
  <div class="banner">
    <div class="layer layer-gradient"></div>
    <div class="layer layer-grid"></div>
    <div class="layer layer-glow"></div>
    <div class="bolt-deco">${svg.bolt}</div>
    <div class="content">
      <div class="badge">${svg.check} ${s.badge}</div>
      <div class="logos-row">
        <div class="logo-box logo-thunder">${svg.mark}</div>
        <span class="plus-sign">+</span>
        <div class="logo-box" style="${logo.boxStyle}">${read('assets/logos', logo.file)}</div>
      </div>
      <div class="pkg-name">${title(s.title, s.accent)}</div>
      <div class="pkg-desc">${s.desc}</div>
      <div class="install-box">
        <span class="install-prompt">$</span>
        <span class="install-cmd">npx degit thunder-id/samples/${s.path} my-app</span>
        <div class="copy-btn">${svg.copy}</div>
      </div>
    </div>
  </div>`;
};

const fileFor = s => `${path.basename(s.path)}.png`;

async function main() {
  const args = process.argv.slice(2);
  let htmlDir;
  const htmlFlag = args.indexOf('--html');
  if (htmlFlag !== -1) [, htmlDir] = args.splice(htmlFlag, 2);

  const all = [
    {name: 'repo', file: repo.file, html: page(repoBanner())},
    ...samples.map(s => ({name: s.path, file: fileFor(s), html: page(sampleBanner(s))})),
  ];
  const unknown = args.filter(a => !all.some(b => b.name === a));
  if (unknown.length) throw new Error(`No banner for: ${unknown.join(', ')}`);
  const targets = args.length ? all.filter(b => args.includes(b.name)) : all;

  const {chromium} = require('playwright');
  const browser = await chromium.launch();
  const context = await browser.newContext({viewport: {width: 1000, height: 420}, deviceScaleFactor: 2});
  const tab = await context.newPage();
  fs.mkdirSync(outDir, {recursive: true});
  if (htmlDir) fs.mkdirSync(htmlDir, {recursive: true});

  for (const b of targets) {
    await tab.setContent(b.html, {waitUntil: 'load'});
    const out = path.join(outDir, b.file);
    await tab.locator('.banner').screenshot({path: out, omitBackground: true});
    if (htmlDir) fs.writeFileSync(path.join(htmlDir, b.file.replace(/\.png$/, '.html')), b.html);
    console.log(path.relative(repoRoot, out));
  }
  await browser.close();
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
