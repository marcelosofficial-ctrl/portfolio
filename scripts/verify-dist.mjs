import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = new URL('../dist/', import.meta.url);
const root = fileURLToPath(dist);
let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL  ${message}`);
}

function pass(message) {
  console.log(`PASS  ${message}`);
}

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function readImageDimensions(bytes, extension) {
  if (extension === '.webp') {
    if (bytes.length < 30 || bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') return null;
    const chunk = bytes.subarray(12, 16).toString('ascii');
    if (chunk === 'VP8X') return { width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16), height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16) };
    if (chunk === 'VP8L' && bytes.length >= 25 && bytes[20] === 0x2f) {
      const b0 = bytes[21], b1 = bytes[22], b2 = bytes[23], b3 = bytes[24];
      return { width: 1 + (b0 | ((b1 & 0x3f) << 8)), height: 1 + ((b1 >> 6) | (b2 << 2) | ((b3 & 0x0f) << 10)) };
    }
    if (chunk === 'VP8 ' && bytes.length >= 30 && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) {
      return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
    }
  }
  return null;
}
function routeTarget(localPath) {
  const normalized = localPath.replace(/^\/+/, '');
  if (!normalized) return join(root, 'index.html');
  const direct = join(root, normalized);
  if (existsSync(direct) && statSync(direct).isFile()) return direct;
  if (existsSync(direct) && statSync(direct).isDirectory()) return join(direct, 'index.html');
  if (normalized.endsWith('/')) return join(root, normalized, 'index.html');
  if (!normalized.split('/').at(-1)?.includes('.')) return join(root, normalized, 'index.html');
  return direct;
}

function validateWebP(bytes) {
  if (bytes.length < 20) return 'file is too small for a WebP container';
  if (bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
    return 'invalid RIFF/WEBP signature';
  }
  const declaredSize = bytes.readUInt32LE(4) + 8;
  if (declaredSize !== bytes.length) return `RIFF length declares ${declaredSize} bytes but file contains ${bytes.length}`;

  let offset = 12;
  let imageChunkFound = false;
  while (offset + 8 <= bytes.length) {
    const type = bytes.subarray(offset, offset + 4).toString('ascii');
    const chunkSize = bytes.readUInt32LE(offset + 4);
    const payloadStart = offset + 8;
    const payloadEnd = payloadStart + chunkSize;
    if (payloadEnd > bytes.length) return `${type || 'unknown'} chunk overruns file boundary`;
    if (type === 'VP8 ' || type === 'VP8L' || type === 'VP8X') imageChunkFound = true;
    offset = payloadEnd + (chunkSize % 2);
  }
  if (offset !== bytes.length) return 'trailing or truncated bytes after final WebP chunk';
  if (!imageChunkFound) return 'no VP8/VP8L/VP8X image chunk found';
  return null;
}

function readRoute(route) {
  const file = join(root, route);
  if (!existsSync(file)) return null;
  return readFileSync(file, 'utf8');
}

function requireContent(label, html, required) {
  if (!html) return;
  for (const text of required) {
    if (!html.includes(text)) fail(`${label} is missing required content: ${text}`);
    else pass(`${label} content: ${text}`);
  }
}

function requireEasyFlixCompatibilityRoute(label, html) {
  if (!html) return;
  const noindex = /<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["'][^"']*\bnoindex\b[^"']*["'])[^>]*>/i.test(html);
  const canonical = /<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["'][^"']*\/projects\/easyflix\/["'])[^>]*>/i.test(html);
  if (!noindex) fail(`${label} is missing robots noindex`); else pass(`${label} robots noindex`);
  if (!canonical) fail(`${label} is missing canonical EasyFlix route`); else pass(`${label} canonical EasyFlix route`);
}

function requireLanguagePair(label, englishHtml, japaneseHtml, englishPath, japanesePath) {
  if (!englishHtml || !japaneseHtml) return;

  for (const [side, html] of [['English', englishHtml], ['Japanese', japaneseHtml]]) {
    for (const alternate of ['hreflang="en"', 'hreflang="ja"', 'hreflang="x-default"']) {
      if (!html.includes(alternate)) fail(`${label} ${side} page is missing language alternate: ${alternate}`);
      else pass(`${label} ${side} language alternate: ${alternate}`);
    }
    if (!html.includes('class="language-toggle"')) fail(`${label} ${side} page is missing the top-bar language toggle`);
    else pass(`${label} ${side} top-bar language toggle`);
    if (!html.includes('>ENG</span>') || !html.includes('>日本語</span>')) fail(`${label} ${side} language toggle is missing ENG / 日本語 labels`);
    else pass(`${label} ${side} language toggle labels`);
  }

  const expectedJapaneseHref = `/portfolio${japanesePath}`;
  const expectedEnglishHref = `/portfolio${englishPath}`;
  if (!englishHtml.includes(`href="${expectedJapaneseHref}"`) || !englishHtml.includes('data-language-choice="ja"')) {
    fail(`${label} English page does not switch directly to ${expectedJapaneseHref}`);
  } else pass(`${label} English → Japanese route-aware switch`);

  if (!japaneseHtml.includes(`href="${expectedEnglishHref}"`) || !japaneseHtml.includes('data-language-choice="en"')) {
    fail(`${label} Japanese page does not switch directly to ${expectedEnglishHref}`);
  } else pass(`${label} Japanese → English route-aware switch`);
}

const routes = [
  'index.html',
  'ja/index.html',
  'about/index.html',
  'ja/about/index.html',
  'contact/index.html',
  'ja/contact/index.html',
  'resume/index.html',
  'ja/resume/index.html',
  'resume/support/index.html',
  'ja/resume/support/index.html',
  'resume/software/index.html',
  'ja/resume/software/index.html',
  'projects/vektordeck/index.html', 'projects/reseller-ai/index.html',
  'projects/crashscope/index.html', 'projects/easyflix/index.html',
  'projects/revdev/index.html', 'projects/reelshelf/index.html', 'projects/media-library/index.html',
  'projects/rainmeter-clock/index.html',
  'projects/exactartifact/index.html',
  'projects/gaptrace/index.html',
  'projects/configtrace/index.html',
  'projects/forgedeck/index.html',
  'ja/projects/crashscope/index.html', 'ja/projects/easyflix/index.html',
  'ja/projects/revdev/index.html', 'ja/projects/reseller-ai/index.html',
  'ja/projects/vektordeck/index.html', 'ja/projects/rainmeter-clock/index.html',
  'ja/projects/exactartifact/index.html', 'ja/projects/gaptrace/index.html',
  'ja/projects/configtrace/index.html',
  '404.html',
];

for (const route of routes) {
  const file = join(root, route);
  if (!existsSync(file)) fail(`missing generated route: ${route}`);
  else if (statSync(file).size < 400) fail(`generated route is suspiciously small: ${route}`);
  else pass(`route ${route}`);
}

const sitemapFile = join(root, 'sitemap.xml');
if (!existsSync(sitemapFile)) {
  fail('missing sitemap.xml');
} else {
  const sitemap = readFileSync(sitemapFile, 'utf8');
  const requiredSitemapRoutes = [
    '/', '/ja/', '/about/', '/ja/about/', '/contact/', '/ja/contact/',
    '/resume/', '/ja/resume/', '/resume/software/', '/ja/resume/software/',
    '/resume/support/', '/ja/resume/support/',
    '/projects/crashscope/', '/ja/projects/crashscope/',
    '/projects/easyflix/', '/ja/projects/easyflix/',
    '/projects/revdev/', '/ja/projects/revdev/',
    '/projects/reseller-ai/', '/ja/projects/reseller-ai/',
    '/projects/vektordeck/', '/ja/projects/vektordeck/',
    '/projects/rainmeter-clock/', '/ja/projects/rainmeter-clock/',
    '/projects/exactartifact/', '/ja/projects/exactartifact/',
    '/projects/gaptrace/', '/ja/projects/gaptrace/',
    '/projects/configtrace/', '/ja/projects/configtrace/'
  ];
  for (const route of requiredSitemapRoutes) {
    const absolute = `https://marcelosofficial-ctrl.github.io/portfolio${route}`;
    if (!sitemap.includes(`<loc>${absolute}</loc>`)) fail(`sitemap missing route: ${route}`);
  }
  pass(`sitemap route coverage checked: ${requiredSitemapRoutes.length} primary routes`);
}

const webpAssets = [
  ['profile/marcelo-profile.webp', 5000],
  ['brand/marcelo-lab.webp', 2000],
  ['brand/crashscope.webp', 2000],
  ['brand/reseller.webp', 2000],
  ['brand/vektordeck.webp', 2000],
  ['brand/reelshelf.webp', 2000],
];
const screenshotAssets = [];

for (const [asset, minimumBytes] of webpAssets) {
  const file = join(root, asset);
  if (!existsSync(file)) {
    fail(`missing critical asset: ${asset}`);
    continue;
  }
  const size = statSync(file).size;
  const bytes = readFileSync(file);
  const structureError = validateWebP(bytes);
  if (size < minimumBytes) fail(`${asset} is only ${size} bytes`);
  else if (structureError) fail(`${asset}: ${structureError}`);
  else pass(`asset ${asset} (${size} bytes)`);
}

const forbiddenLegacyAssets = [
  'brand/revdev.png',
  'brand/revdev.svg',
  'vektordeck/dashboard.webp',
  'vektordeck/intelligence-tour.webp',
  'vektordeck/evidence-tour.webp'
];
const generatedPaths = walk(root).map((file) => relative(root, file).replaceAll('\\', '/'));
for (const forbidden of forbiddenLegacyAssets) {
  if (generatedPaths.includes(forbidden)) fail(`superseded legacy asset remains: ${forbidden}`);
  else pass(`superseded legacy asset absent: ${forbidden}`);
}

const forbiddenRetroEvidence = [
  'Japanese PS1 title',
  'Collector edition',
  'Disc-only copy',
  'A-042',
  'A-043',
  'A-044'
];
const generatedHtmlForEvidence = generatedPaths
  .filter((file) => file.endsWith('.html'))
  .map((file) => ({ file, html: readFileSync(join(root, file), 'utf8') }));
for (const { file, html } of generatedHtmlForEvidence) {
  for (const forbidden of forbiddenRetroEvidence) {
    if (html.includes(forbidden)) fail(`${file} contains fabricated Retro evidence label: ${forbidden}`);
  }
}
if (!generatedHtmlForEvidence.some(({ html }) => forbiddenRetroEvidence.some((forbidden) => html.includes(forbidden)))) {
  pass('generated HTML contains no fabricated Retro evidence examples');
}

for (const asset of screenshotAssets) {
  const file = join(root, asset);
  if (!existsSync(file)) {
    fail('missing required 2660×1440 screenshot asset: ' + asset);
    continue;
  }
  const dimensions = readImageDimensions(readFileSync(file), '.webp');
  if (!dimensions) fail(asset + ' dimensions could not be decoded');
  else if (dimensions.width !== 2660 || dimensions.height !== 1440) fail(asset + ' is ' + dimensions.width + '×' + dimensions.height + '; required 2660×1440');
  else pass(asset + ' exact screenshot dimensions: 2660×1440');
}
const generatedHtmlForMedia = generatedPaths
  .filter((file) => file.endsWith('.html'))
  .map((file) => ({ file, html: readFileSync(join(root, file), 'utf8') }));
for (const { file, html } of generatedHtmlForMedia) {
  for (const stale of ['2047×1151', '2048×1108', '2048×1152', '1000×565', '900×509', 'home.jpg', 'library.jpg', 'details.jpg', 'details.webp']) {
    if (html.includes(stale)) fail(file + ' contains stale screenshot reference: ' + stale);
  }
}
pass('generated HTML contains no superseded screenshot dimensions or EasyFlix legacy media references');
const qr = join(root, 'portfolio-qr.svg');
if (!existsSync(qr)) fail('missing portfolio QR code');
else {
  const qrText = readFileSync(qr, 'utf8');
  if (!qrText.includes('<svg')) fail('portfolio QR is not valid SVG text');
  else if (!qrText.includes('viewBox="0 0 41 41"')) fail('portfolio QR is missing the verified four-module quiet-zone geometry');
  else if (!/fill=["']#(?:fff|ffffff)["']/i.test(qrText)) fail('portfolio QR is missing its explicit white scan background');
  else pass('portfolio QR scan-safe SVG geometry');
}

const home = readRoute('index.html');
requireContent('homepage', home, [
  'Software &amp; Systems Developer',
  'Software / QA Résumé',
  'VektorDeck 1.0',
  '266/266',
  '0.2365%',
  '1.2.0 RELEASED',
  '219 TESTS',
  '1.4.0 publicly released',
  'EasyFlix',
  'RevDev',
  'ACTIVE DEVELOPMENT',
  'Software engineering, QA / automation and technical systems roles.'
]);

const japaneseHome = readRoute('ja/index.html');
requireContent('Japanese homepage', japaneseHome, [
  '<html lang="ja">',
  'ソフトウェアと',
  '現場の不便や複雑さを、信頼して使えるソフトウェアに変える。',
  '実際の課題から生まれたプロジェクト。',
  '現在、公開の連絡窓口はLinkedInにまとめています。',
  '日本語ケーススタディ ↗',
  'class="language-toggle"'
]);

const about = readRoute('about/index.html');
requireContent('about page', about, [
  'I build useful systems, then make them trustworthy.',
  'Software / QA résumé',
  'CrashScope 1.3 development / 1.2.0 released',
  'VektorDeck 1.0',
  'EasyFlix 1.4 released'
]);

const japaneseAbout = readRoute('ja/about/index.html');
requireContent('Japanese about page', japaneseAbout, [
  '<html lang="ja">',
  '実用的な仕組みをつくり、信頼して使えるところまで仕上げる。',
  '現場経験からソフトウェアへ。',
  '5言語でのコミュニケーション',
  'CrashScope 1.3 development / 1.2.0 released',
  'EasyFlix 1.4 released',
  '219件の自動テスト',
  'ソフトウェア / QA 職務プロフィール'
]);

const contact = readRoute('contact/index.html');
requireContent('contact page', contact, [
  'Let’s talk about useful work.',
  'LINKEDIN · CURRENT ROUTE',
  'Software / QA résumé'
]);

const japaneseContact = readRoute('ja/contact/index.html');
requireContent('Japanese contact page', japaneseContact, [
  '<html lang="ja">',
  'まずは、取り組みたいことを聞かせてください。',
  '現在の公開連絡窓口はLinkedInです。',
  '採用・転職について',
  '職務プロフィールを見る'
]);

const resume = readRoute('resume/index.html');
requireContent('general resume', resume, [
  'Alma', 'VektorDeck', 'CrashScope', 'EasyFlix', 'RevDev', '750+', '1,800+',
  'Software / QA', 'QA / automation', '266/266 automated .NET tests', '0.2365% average Agent CPU'
]);

const japaneseResume = readRoute('ja/resume/index.html');
requireContent('Japanese career profile', japaneseResume, [
  '<html lang="ja">',
  'Professional profile · 職務プロフィール',
  '4,000時間以上',
  '266/266件の自動.NETテスト',
  'RevDev',
  '海外のタイムゾーンや勤務時間にも柔軟に対応'
]);

const supportResume = readRoute('resume/support/index.html');
const japaneseSupportResume = readRoute('ja/resume/support/index.html');
requireContent('Japanese support profile', japaneseSupportResume, [
  '<html lang="ja">',
  'リモートテクニカルサポート · オペレーション · カスタマー対応',
  '問題の切り分け',
  'コーヒー部門マネージャー / カフェ運営',
  '4,000時間以上'
]);

const softwareResume = readRoute('resume/software/index.html');
requireContent('software resume', softwareResume, [
  'Software Engineering · QA · Technical Systems',
  '266/266 automated .NET tests',
  '0.2365% average Agent CPU',
  '94.58 MB peak working set',
  '219 / 219',
  'zero build warnings',
  'VektorDeck 1.0',
  'Retro Game Vision',
  'EasyFlix',
  'RevDev'
]);

const japaneseSoftwareResume = readRoute('ja/resume/software/index.html');
requireContent('Japanese software profile', japaneseSoftwareResume, [
  '<html lang="ja">',
  'ソフトウェア開発 · QA · テクニカルシステム',
  '英文PDFをダウンロード',
  '266/266件の自動.NETテスト',
  'localhost限定',
  '219件のテスト',
  'EasyFlix · 1.4 released',
  'RevDev · ACTIVE DEVELOPMENT'
]);

requireLanguagePair('homepage', home, japaneseHome, '/', '/ja/');
requireLanguagePair('about', about, japaneseAbout, '/about/', '/ja/about/');
requireLanguagePair('contact', contact, japaneseContact, '/contact/', '/ja/contact/');
requireLanguagePair('general career profile', resume, japaneseResume, '/resume/', '/ja/resume/');
requireLanguagePair('support career profile', supportResume, japaneseSupportResume, '/resume/support/', '/ja/resume/support/');
requireLanguagePair('software career profile', softwareResume, japaneseSoftwareResume, '/resume/software/', '/ja/resume/software/');

const easyflix = readRoute('projects/easyflix/index.html');
const revdev = readRoute('projects/revdev/index.html');
const reelshelf = readRoute('projects/reelshelf/index.html');
const mediaLibrary = readRoute('projects/media-library/index.html');
requireContent('EasyFlix case study', easyflix, [
  'EasyFlix', '1.4.0 RELEASED', 'WPF', '.NET 10', 'legally acquired',
  '219 / 219', 'Add Media Center', 'Save AI Handoff', '2,193',
  'PUBLIC RELEASE',
  'LOCAL-FIRST', 'Continue Watching', 'Sync Metadata',
  'INSTALLER + PORTABLE WIN-X64', '2,301', '108 entries',
  'The final capture stays real.', '2660×1440 REQUIRED', 'NO UPSCALING'
]);

requireContent('RevDev case study', revdev, [
  'RevDev', 'ACTIVE DEVELOPMENT', '.NET 8', 'WPF', 'Dev Relay',
  '5 PROVIDERS', 'HOSTED_DENY', 'Durable continuity', 'Tool hub',
  'Real final-state captures only.'
]);
requireContent('ReelShelf compatibility route', reelshelf, ['ReelShelf became', '/projects/easyflix/']);
requireEasyFlixCompatibilityRoute('ReelShelf compatibility route', reelshelf);
requireContent('Media Library compatibility route', mediaLibrary, ['EasyFlix', '1.4', '/projects/easyflix/']);
requireEasyFlixCompatibilityRoute('Media Library compatibility route', mediaLibrary);
const crashscope = readRoute('projects/crashscope/index.html');
requireContent('CrashScope case study', crashscope, [
  '1.2.0 RELEASED',
  '266/266 PASS',
  'WPF / WebView2',
  '0.2365%',
  '91.71 MB',
  '94.58 MB',
  '34.76 MB',
  'ConfigTrace 1.0.1',
  'TWO-PC VALIDATED',
  'LOCALHOST',
  'Download 1.2.0',
  '5cd5821800b2e5f2c4ace319a6921267414465129c704b8e50c83b1a1a932b04',
  'a37c012293a1c5e5aa94c823f1898a85ef0bc896b5b3cf03d870e8191050a12e'
]);

const configtrace = readRoute('projects/configtrace/index.html');
requireContent('ConfigTrace case study', configtrace, [
  '1.0.1',
  '4.96 MB',
  '4.99 MB',
  '0.91 MB',
  'NOT FOUND',
  'b629c970',
  'Download 1.0.1'
]);
const identityPages = [
  ['homepage', home],
  ['Japanese homepage', japaneseHome],
  ['about page', about],
  ['Japanese about page', japaneseAbout],
  ['general resume', resume],
  ['Japanese career profile', japaneseResume],
  ['support resume', supportResume],
  ['Japanese support profile', japaneseSupportResume],
  ['software resume', softwareResume],
  ['Japanese software profile', japaneseSoftwareResume],
];
for (const [label, html] of identityPages) {
  if (!html) continue;
  if (/\bJunior\b/i.test(html)) fail(`${label} still contains stale "Junior" self-labeling`);
  else pass(`${label} has no stale Junior self-label`);
}

/* Privacy guard: LinkedIn is the deliberate public contact route. Until a separate
   public email is configured, generated pages must contain no literal email address
   and no mailto links. */
const generatedHtml = walk(root).filter((file) => file.endsWith('.html'));
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const mailtoPattern = /mailto:/i;
for (const htmlFile of generatedHtml) {
  const html = readFileSync(htmlFile, 'utf8');
  const page = relative(root, htmlFile).replaceAll('\\', '/');
  if (emailPattern.test(html)) fail(`${page} contains a literal email address while no public email is configured`);
  if (mailtoPattern.test(html)) fail(`${page} contains a mailto link while no public email is configured`);
}
if (!generatedHtml.some((file) => emailPattern.test(readFileSync(file, 'utf8')))) pass('generated HTML contains no literal email addresses');
if (!generatedHtml.some((file) => mailtoPattern.test(readFileSync(file, 'utf8')))) pass('generated HTML contains no mailto links');

if (home) {
  for (const requiredMeta of [
    '<link rel="canonical"',
    'property="og:title"',
    'property="og:description"',
    'property="og:image"',
    'name="twitter:card"',
    'application/ld+json',
    'Software and Systems Developer',
    'QA automation',
    'Release engineering'
  ]) {
    if (!home.includes(requiredMeta)) fail(`homepage metadata is missing: ${requiredMeta}`);
    else pass(`homepage metadata: ${requiredMeta}`);
  }
}

let checkedLinks = 0;
for (const htmlFile of generatedHtml) {
  const html = readFileSync(htmlFile, 'utf8');
  const page = relative(root, htmlFile).replaceAll('\\', '/');

  const references = html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g);
  for (const match of references) {
    const raw = match[1];
    if (!raw || raw.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(raw)) continue;
    const clean = raw.split('#')[0].split('?')[0];
    if (!clean) continue;

    let target;
    if (clean === '/portfolio' || clean === '/portfolio/') target = join(root, 'index.html');
    else if (clean.startsWith('/portfolio/')) target = routeTarget(clean.slice('/portfolio/'.length));
    else if (clean.startsWith('/')) target = routeTarget(clean.slice(1));
    else {
      const absolute = resolve(dirname(htmlFile), clean);
      if (existsSync(absolute) && statSync(absolute).isDirectory()) target = join(absolute, 'index.html');
      else target = absolute;
    }

    checkedLinks += 1;
    if (!existsSync(target)) fail(`${page} references missing local target: ${raw}`);
  }
}
if (checkedLinks > 0) pass(`${checkedLinks} generated local href/src references resolved`);

if (failures) {
  console.error(`\nPortfolio verification failed with ${failures} issue(s).`);
  process.exit(1);
}
console.log('\nPortfolio verification passed.');