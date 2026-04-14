import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { mkdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const distDir = path.join(repoRoot, 'dist');
const outputDir = path.join(repoRoot, 'visual-captures');
const profileDir = path.join(repoRoot, '.visual-chrome-profile');
const previewPort = Number(process.env.VISUAL_PREVIEW_PORT ?? 4173);
const debugPort = Number(process.env.VISUAL_DEBUG_PORT ?? 9333);
const baseUrl = `http://127.0.0.1:${previewPort}`;
const captureUrl = `${baseUrl}/?visualValidation=1&capture=${Date.now()}`;

const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/microsoft-edge',
].filter(Boolean);

class CdpClient {
  constructor(wsUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.ws = new WebSocket(wsUrl);
    this.opened = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });

    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data.toString());
      if (!message.id) return;

      const request = this.pending.get(message.id);
      if (!request) return;

      this.pending.delete(message.id);
      if (message.error) {
        request.reject(new Error(`${request.method}: ${message.error.message}`));
      } else {
        request.resolve(message.result);
      }
    });
  }

  async send(method, params = {}) {
    await this.opened;
    const id = this.nextId++;
    const payload = { id, method, params };

    const response = new Promise((resolve, reject) => {
      this.pending.set(id, { method, resolve, reject });
    });

    this.ws.send(JSON.stringify(payload));
    return response;
  }

  close() {
    this.ws.close();
  }
}

function findChrome() {
  const chromePath = chromeCandidates.find((candidate) => existsSync(candidate));
  if (!chromePath) {
    throw new Error('No Chrome or Edge executable found. Set CHROME_PATH to the browser executable.');
  }

  return chromePath;
}

async function waitForHttp(url, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) return;
    } catch {
      // Keep waiting until timeout.
    }
    await delay(250);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function contentTypeFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const types = {
    '.css': 'text/css; charset=utf-8',
    '.glb': 'model/gltf-binary',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.mp4': 'video/mp4',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.webp': 'image/webp',
  };

  return types[extension] ?? 'application/octet-stream';
}

async function startStaticServer() {
  if (!existsSync(path.join(distDir, 'index.html'))) {
    throw new Error('dist/index.html was not found. Run npm run build before npm run capture:visual.');
  }

  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? '/', baseUrl);
      let pathname = decodeURIComponent(requestUrl.pathname);

      if (pathname.startsWith('/portfolio/')) {
        pathname = pathname.slice('/portfolio'.length);
      }

      if (pathname === '/') pathname = '/index.html';

      const filePath = path.normalize(path.join(distDir, pathname));
      if (!filePath.startsWith(distDir)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
      }

      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) {
        response.writeHead(404);
        response.end('Not found');
        return;
      }

      response.writeHead(200, {
        'Content-Length': fileStat.size,
        'Content-Type': contentTypeFor(filePath),
        'Cache-Control': 'no-store',
      });
      createReadStream(filePath).pipe(response);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(previewPort, '127.0.0.1', resolve);
  });

  return server;
}

async function startBrowser() {
  await rm(profileDir, { recursive: true, force: true });
  await mkdir(profileDir, { recursive: true });

  const chromePath = findChrome();
  const chrome = spawn(
    chromePath,
    [
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${profileDir}`,
      '--new-window',
      '--window-size=1440,900',
      '--force-device-scale-factor=1',
      '--disable-background-networking',
      '--disable-extensions',
      '--disable-sync',
      '--enable-gpu-rasterization',
      '--ignore-gpu-blocklist',
      '--autoplay-policy=no-user-gesture-required',
      'about:blank',
    ],
    {
      stdio: 'ignore',
      windowsHide: false,
    },
  );

  await waitForHttp(`http://127.0.0.1:${debugPort}/json/version`, 10000);
  return chrome;
}

async function createPage(url) {
  const response = await fetch(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(url)}`, {
    method: 'PUT',
  });

  if (!response.ok) {
    throw new Error(`Could not create browser target: ${response.status} ${response.statusText}`);
  }

  const target = await response.json();
  const client = new CdpClient(target.webSocketDebuggerUrl);
  await client.opened;
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send('Page.navigate', { url });
  return client;
}

async function evaluate(client, expression) {
  const response = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.text ?? 'Runtime evaluation failed');
  }

  return response.result.value;
}

async function waitForValue(client, label, expression, predicate, timeoutMs = 20000) {
  const startedAt = Date.now();
  let lastValue;

  while (Date.now() - startedAt < timeoutMs) {
    lastValue = await evaluate(client, expression);
    if (predicate(lastValue)) return lastValue;
    await delay(250);
  }

  throw new Error(`Timed out waiting for ${label}. Last value: ${JSON.stringify(lastValue)}`);
}

async function forceFrames(client, frameCount = 8) {
  await evaluate(
    client,
    `new Promise((resolve) => {
      let frames = ${frameCount};
      const tick = () => {
        frames -= 1;
        if (frames <= 0) {
          resolve(true);
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    })`,
  );
}

const heroCanvasStateExpression = `(() => {
  const canvas = document.querySelector('.hero-canvas canvas');
  const state = {
    canvasExists: Boolean(canvas),
    modelLoaded: window.__portfolioHeroModelLoaded === true || document.documentElement.dataset.heroModelLoaded === 'true',
    hasContext: false,
    width: 0,
    height: 0,
    ok: false,
  };

  if (!canvas) return state;

  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  state.hasContext = Boolean(gl);
  if (!gl) return state;

  state.width = gl.drawingBufferWidth;
  state.height = gl.drawingBufferHeight;
  state.ok = state.canvasExists && state.modelLoaded && state.hasContext && state.width > 0 && state.height > 0;
  return state;
})()`;

function animationsSettledExpression(selector) {
  return `(() => {
    const root = document.querySelector(${JSON.stringify(selector)});
    if (!root) return false;

    return Array.from(root.querySelectorAll('[style]')).every((element) => {
      const style = getComputedStyle(element);
      const filter = style.filter;
      const opacity = Number.parseFloat(style.opacity);
      const transform = style.transform;
      const filterSettled = filter === 'none' || filter === 'blur(0px)';
      const opacitySettled = Number.isNaN(opacity) || opacity > 0.98;
      const transformSettled = transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)';

      return filterSettled && opacitySettled && transformSettled;
    });
  })()`;
}

function paethPredictor(left, up, upLeft) {
  const estimate = left + up - upLeft;
  const leftDistance = Math.abs(estimate - left);
  const upDistance = Math.abs(estimate - up);
  const upLeftDistance = Math.abs(estimate - upLeft);

  if (leftDistance <= upDistance && leftDistance <= upLeftDistance) return left;
  if (upDistance <= upLeftDistance) return up;
  return upLeft;
}

function decodePng(buffer) {
  const signature = '89504e470d0a1a0a';
  if (buffer.subarray(0, 8).toString('hex') !== signature) {
    throw new Error('Screenshot is not a PNG file.');
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const chunk = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === 'IHDR') {
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      bitDepth = chunk[8];
      colorType = chunk[9];
    }

    if (type === 'IDAT') idatChunks.push(chunk);
    if (type === 'IEND') break;
  }

  if (bitDepth !== 8 || ![2, 6].includes(colorType)) {
    throw new Error(`Unsupported PNG format: bitDepth=${bitDepth}, colorType=${colorType}`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const bytesPerPixel = channels;
  const rowLength = width * channels;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  const scanlines = Buffer.alloc(height * rowLength);
  let sourceOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[sourceOffset];
    sourceOffset += 1;
    const rowSource = inflated.subarray(sourceOffset, sourceOffset + rowLength);
    sourceOffset += rowLength;

    const rowOffset = y * rowLength;
    const previousRowOffset = (y - 1) * rowLength;

    for (let x = 0; x < rowLength; x += 1) {
      const raw = rowSource[x];
      const left = x >= bytesPerPixel ? scanlines[rowOffset + x - bytesPerPixel] : 0;
      const up = y > 0 ? scanlines[previousRowOffset + x] : 0;
      const upLeft = y > 0 && x >= bytesPerPixel ? scanlines[previousRowOffset + x - bytesPerPixel] : 0;

      let value = raw;
      if (filter === 1) value = raw + left;
      if (filter === 2) value = raw + up;
      if (filter === 3) value = raw + Math.floor((left + up) / 2);
      if (filter === 4) value = raw + paethPredictor(left, up, upLeft);

      scanlines[rowOffset + x] = value & 255;
    }
  }

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0, j = 0; i < scanlines.length; i += channels, j += 4) {
    rgba[j] = scanlines[i];
    rgba[j + 1] = scanlines[i + 1];
    rgba[j + 2] = scanlines[i + 2];
    rgba[j + 3] = channels === 4 ? scanlines[i + 3] : 255;
  }

  return { width, height, rgba };
}

function analyzeHeroScreenshot(buffer) {
  const { width, height, rgba } = decodePng(buffer);
  const xStart = Math.round(width * 0.28);
  const xEnd = Math.round(width * 0.91);
  const yStart = Math.round(height * 0.1);
  const yEnd = Math.round(height * 0.76);
  let samples = 0;
  let brightPixels = 0;

  for (let y = yStart; y < yEnd; y += 2) {
    for (let x = xStart; x < xEnd; x += 2) {
      const offset = (y * width + x) * 4;
      const red = rgba[offset];
      const green = rgba[offset + 1];
      const blue = rgba[offset + 2];
      const alpha = rgba[offset + 3];
      const brightness = red + green + blue;

      samples += 1;
      if (alpha > 220 && brightness > 330) brightPixels += 1;
    }
  }

  const brightRatio = brightPixels / Math.max(samples, 1);

  return {
    width,
    height,
    samples,
    brightPixels,
    brightRatio,
    visible: brightRatio > 0.018,
  };
}

async function capturePng(client, filePath) {
  const response = await client.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  });

  const buffer = Buffer.from(response.data, 'base64');
  await writeFile(filePath, buffer);
  return buffer;
}

async function captureHeroWhenModelIsVisible(client, heroPath) {
  const startedAt = Date.now();
  let lastAnalysis;

  while (Date.now() - startedAt < 20000) {
    await forceFrames(client);
    const buffer = await capturePng(client, heroPath);
    lastAnalysis = analyzeHeroScreenshot(buffer);

    if (lastAnalysis.visible) return lastAnalysis;
    await delay(500);
  }

  throw new Error(`Hero screenshot did not show enough 3D signal. Last analysis: ${JSON.stringify(lastAnalysis)}`);
}

async function waitForSectionVisible(client, selector) {
  await waitForValue(
    client,
    `${selector} section visible`,
    `(() => {
      const section = document.querySelector(${JSON.stringify(selector)});
      if (!section) return false;
      const rect = section.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08;
    })()`,
    Boolean,
    8000,
  );
}

async function waitForSectionImages(client, selector) {
  await waitForValue(
    client,
    `${selector} images loaded`,
    `(() => {
      const section = document.querySelector(${JSON.stringify(selector)});
      if (!section) return false;
      return Array.from(section.querySelectorAll('img')).every((image) => image.complete && image.naturalWidth > 0);
    })()`,
    Boolean,
    8000,
  );
}

async function captureSection(client, selector, filePath, viewportOffset = 0, requireImages = true) {
  await evaluate(
    client,
    `(() => {
      const section = document.querySelector(${JSON.stringify(selector)});
      if (!section) return false;
      const top = section.getBoundingClientRect().top + window.scrollY + window.innerHeight * ${viewportOffset};
      window.scrollTo({ top, behavior: 'auto' });
      return true;
    })()`,
  );
  await waitForSectionVisible(client, selector);
  if (requireImages) {
    await waitForSectionImages(client, selector);
  }
  await delay(700);
  await forceFrames(client, 8);
  return capturePng(client, filePath);
}

async function runResponsiveChecks(client) {
  const viewports = [
    { name: 'desktop', width: 1440, height: 900, mobile: false },
    { name: 'laptop', width: 1280, height: 800, mobile: false },
    { name: 'tablet', width: 834, height: 1112, mobile: true },
    { name: 'mobile', width: 390, height: 844, mobile: true },
  ];
  const checks = [];

  for (const viewport of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
    });
    await client.send('Page.navigate', {
      url: `${captureUrl}&responsive=${viewport.name}`,
    });
    await waitForValue(client, `${viewport.name} document ready`, 'document.readyState', (value) => value === 'complete', 15000);
    await evaluate(client, `document.querySelector('#perfil')?.scrollIntoView({ block: 'center' }); true`);
    await waitForSectionVisible(client, '#perfil');
    await forceFrames(client, 4);
    const layout = await evaluate(
      client,
      `(() => {
        const profileCards = Array.from(document.querySelectorAll('#perfil .profile-card'));
        const projects = document.querySelector('#trabajos');
        const projectRect = projects ? projects.getBoundingClientRect() : null;
        const overflow = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
        return {
          viewport: ${JSON.stringify(viewport.name)},
          width: window.innerWidth,
          height: window.innerHeight,
          overflow,
          profileCards: profileCards.length,
          minProfileCardHeight: profileCards.reduce((min, card) => Math.min(min, card.getBoundingClientRect().height), Infinity),
          projectsPresent: Boolean(projects),
          projectsTop: projectRect ? Math.round(projectRect.top) : null,
          ok: overflow <= 2 && profileCards.length === 4 && Boolean(projects),
        };
      })()`,
    );
    checks.push(layout);
  }

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    throw new Error(`Responsive checks failed: ${JSON.stringify(failed)}`);
  }

  return checks;
}

async function main() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  let staticServer;
  let browserProcess;
  let client;

  try {
    staticServer = await startStaticServer();
    await waitForHttp(baseUrl, 15000);
    browserProcess = await startBrowser();
    client = await createPage(captureUrl);

    await waitForValue(client, 'document ready', 'document.readyState', (value) => value === 'complete', 15000);
    const heroState = await waitForValue(client, 'visible non-empty WebGL hero canvas', heroCanvasStateExpression, (value) => value.ok);
    await waitForValue(client, 'hero reveal animations settled', animationsSettledExpression('#intro'), Boolean, 8000);

    const heroPath = path.join(outputDir, 'hero-3d.png');
    const heroAnalysis = await captureHeroWhenModelIsVisible(client, heroPath);

    const profileIntroPath = path.join(outputDir, 'profile-intro.png');
    await captureSection(client, '#perfil', profileIntroPath, 0, false);
    await captureSection(client, '#perfil', path.join(outputDir, 'profile.png'), 0.9);
    await captureSection(client, '#trabajos', path.join(outputDir, 'projects.png'), 0.52, false);
    const reelPath = path.join(outputDir, 'reel.png');
    await captureSection(client, '#reel', reelPath, 0, false);
    const responsiveChecks = await runResponsiveChecks(client);

    console.log(JSON.stringify(
      {
        ok: true,
        hero3dVisible: true,
        heroCanvas: heroState,
        heroScreenshotAnalysis: heroAnalysis,
        screenshots: {
          hero: heroPath,
          profileIntro: profileIntroPath,
          profile: path.join(outputDir, 'profile.png'),
          projects: path.join(outputDir, 'projects.png'),
          reel: reelPath,
        },
        responsiveChecks,
      },
      null,
      2,
    ));
  } catch (error) {
    if (client) {
      await capturePng(client, path.join(outputDir, 'hero-diagnostic.png')).catch(() => {});
    }
    throw error;
  } finally {
    client?.close();
    browserProcess?.kill();
    staticServer?.close();
    await delay(300);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
