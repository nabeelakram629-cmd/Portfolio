/* ===== SCREENSHOTS =====
   Loads real project screenshots for the work cards and the hover preview.
   A slow or missing image never blocks the page. */

const cache = new Map();
const settled = new Map();
let budgetMs = 10000;

/**
 * Set how many seconds one screenshot may spend on every fallback together.
 * The preloader passes ASSET_TIMEOUT so both stay in step.
 */
export function useShotBudget(seconds) {
  budgetMs = Math.max(1, seconds) * 1000;
}

/**
 * The saved result for a domain: a picture address, null if it failed, or undefined if it is still loading.
 */
export function cachedShot(domain) {
  if (!settled.has(domain)) return undefined;
  return settled.get(domain);
}

/**
 * Load one address and accept it only when the picture is wide enough to be a real screenshot.
 * ms is how many milliseconds to wait before giving up.
 */
export function tryImage(src, ms = 12000) {
  return new Promise((resolve) => {
    if (ms <= 0) {
      resolve(false);
      return;
    }
    const img = new Image();
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      resolve(ok);
    };
    const timer = window.setTimeout(() => finish(false), ms);
    img.onload = () => finish(img.naturalWidth >= 500);
    img.onerror = () => finish(false);
    img.src = src;
  });
}

/**
 * Pause between WordPress screenshot tries. ms is the wait in milliseconds.
 */
function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/**
 * thum.io's "please pay" picture is sent with no-store. A real screenshot is cached.
 * ms is the time left in the shared 10 second budget.
 */
async function thumOk(src, ms) {
  if (ms <= 0) return false;
  const started = performance.now();
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), ms);
  let skip = false;
  try {
    const res = await fetch(src, { signal: controller.signal });
    const cacheHeader = (res.headers.get("cache-control") || "").toLowerCase();
    if (!res.ok || cacheHeader.includes("no-store")) skip = true;
  } catch (err) {
    skip = false;
  } finally {
    window.clearTimeout(timer);
  }
  if (skip) return false;
  const left = ms - (performance.now() - started);
  if (left <= 0) return false;
  return tryImage(src, left);
}

/**
 * Try the local file, then thum.io, then WordPress, and stop when the shared time budget runs out.
 */
async function findShot(domain, url) {
  const deadline = performance.now() + budgetMs;
  const left = () => deadline - performance.now();
  let src = null;
  try {
    const local = `screens/${domain}.jpg`;
    if (left() > 0 && (await tryImage(local, Math.min(4000, left())))) {
      src = local;
      return src;
    }

    const thumb = `https://image.thum.io/get/width/800/crop/600/${url}`;
    if (left() > 0 && (await thumOk(thumb, left()))) {
      src = thumb;
      return src;
    }

    for (let n = 1; n <= 3; n += 1) {
      if (left() <= 0) break;
      const remote = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=800&h=600&t=${n}`;
      if (await tryImage(remote, left())) {
        src = remote;
        return src;
      }
      if (n < 3 && left() > 0) await wait(Math.min(2500, left()));
    }
    return null;
  } finally {
    settled.set(domain, src);
  }
}

/**
 * Return the screenshot for a domain. The same domain is only requested once.
 */
export function getShot(domain, url) {
  if (!cache.has(domain)) cache.set(domain, findShot(domain, url));
  return cache.get(domain);
}

/**
 * Put a working screenshot on an image. If none loads, the letter placeholder stays.
 */
export function showShot(img, domain, url) {
  return getShot(domain, url).then((src) => {
    if (!src || !img.isConnected) return;
    img.src = src;
    img.classList.add("ok");
  });
}

/**
 * Start each featured card only when it is within 400px of the screen.
 */
export function watchFeatured() {
  const images = document.querySelectorAll("#feat img[data-shot]");
  if (!images.length) return function stopShots() {};
  const seen = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        seen.unobserve(img);
        showShot(img, img.dataset.shot, img.dataset.url);
      });
    },
    { rootMargin: "400px" },
  );
  images.forEach((img) => seen.observe(img));
  return function stopShots() {
    seen.disconnect();
  };
}
