import { FEATURED, WORK } from "./data/content.js";
import { getShot, useShotBudget } from "./screenshots.js";

/* ===== PRELOADER =====
   Full-screen cover until the fonts, portrait, and project screenshots are ready.
   Change the numbers below to make the wait shorter or longer. */
const MIN_TIME = 1.2; // Shortest time the first visit stays up, in seconds.
const ASSET_TIMEOUT = 10; // Seconds one screenshot may spend on all of its fallbacks together.
const MAX_TIME = 20; // Seconds before the cover leaves even if some pictures are still loading.
const CONCURRENCY = 6; // How many screenshot requests may run at the same time.
const SHORT_TIME = 0.6; // Seconds for a repeat visit in this tab.
const FADE_TIME = 0.6; // Seconds for the cover to fade away.

const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const SEEN_KEY = "na-loader-seen";

/**
 * True when this tab already finished a visit. Storage errors must not break the page.
 */
function alreadySeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch (err) {
    return false;
  }
}

/**
 * Remember that this tab has seen the site, so the next load can be short.
 */
function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch (err) {
    /* storage can be blocked */
  }
}

/**
 * Build the list of screenshot jobs. A site that is both featured and in the full list counts twice.
 */
function shotJobs() {
  const map = new Map();
  const add = (domain, url) => {
    if (!domain || !url) return;
    const row = map.get(domain) || { domain, url, count: 0 };
    row.count += 1;
    map.set(domain, row);
  };
  FEATURED.forEach((domain) => {
    const item = WORK.find((entry) => entry.domain === domain);
    if (item) add(item.domain, item.url);
  });
  WORK.forEach((item) => add(item.domain, item.url));
  return [...map.values()];
}

/**
 * Load one file and give up after ms milliseconds. Used for the portrait.
 */
function loadFile(src, ms) {
  return new Promise((resolve) => {
    const img = new Image();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(finish, ms);
    img.onload = finish;
    img.onerror = finish;
    img.src = src;
  });
}

/**
 * Wait for the fonts, but never longer than the asset timeout.
 */
function loadFonts(ms) {
  return new Promise((resolve) => {
    const timer = window.setTimeout(resolve, ms);
    const ready = document.fonts && document.fonts.ready;
    if (!ready) {
      window.clearTimeout(timer);
      resolve();
      return;
    }
    ready.then(
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      () => {
        window.clearTimeout(timer);
        resolve();
      },
    );
  });
}

/**
 * Show a finished featured screenshot on its card. A miss leaves the letter placeholder.
 */
function paintCard(domain, src) {
  if (!src) return;
  const img = document.querySelector(`#feat img[data-shot="${CSS.escape(domain)}"]`);
  if (!img || !img.isConnected) return;
  img.src = src;
  img.classList.add("ok");
}

/**
 * Run screenshot jobs CONCURRENCY at a time, then keep going after the cover is gone.
 */
function startShots(jobs, onDone) {
  let index = 0;
  let active = 0;
  const next = () => {
    while (active < CONCURRENCY && index < jobs.length) {
      const job = jobs[index];
      index += 1;
      active += 1;
      getShot(job.domain, job.url).then(
        (src) => {
          paintCard(job.domain, src);
          onDone(job.count);
        },
        () => onDone(job.count),
      ).finally(() => {
        active -= 1;
        next();
      });
    }
  };
  next();
}

/**
 * Cover the page, follow real progress, then let the hero animations start.
 * onReady runs only after the cover has been removed.
 */
export function startPageAnimations(onReady) {
  const seen = alreadySeen();
  useShotBudget(ASSET_TIMEOUT);

  const screen = document.createElement("div");
  screen.className = "loader";
  screen.setAttribute("aria-hidden", "true");
  screen.innerHTML = `
    <div class="loader-orb">
      <div class="loader-orb-float">
        <i class="loader-glow"></i>
        <i class="loader-ball"></i>
      </div>
    </div>
    <p class="loader-status">Loading fonts</p>
    <div class="loader-count"><b>000</b><span>%</span></div>
    <div class="loader-bar"><span></span></div>
  `;
  document.body.appendChild(screen);
  document.documentElement.classList.add("is-loading");
  if (REDUCE) screen.classList.add("is-still");

  const countEl = screen.querySelector(".loader-count b");
  const barEl = screen.querySelector(".loader-bar span");
  const statusEl = screen.querySelector(".loader-status");
  const jobs = shotJobs();
  const total = 2 + jobs.reduce((sum, job) => sum + job.count, 0);

  let dead = false;
  let opened = false;
  let leaving = false;
  let siteStarted = false;
  let finished = 0;
  let shown = 0;
  let ceiling = 0;
  let raf = 0;
  const startedAt = performance.now();

  const failsafe = window.setTimeout(() => {
    if (!leaving) beginExit();
  }, MAX_TIME * 1000);
  const backup = window.setTimeout(finishPage, (MAX_TIME + FADE_TIME + 0.4) * 1000);

  try {
    const assetMs = ASSET_TIMEOUT * 1000;
    loadFonts(assetMs).then(() => bump(1));
    loadFile("portrait.jpeg", assetMs).then(() => bump(1));
    startShots(jobs, bump);
    raf = window.requestAnimationFrame(tick);
  } catch (err) {
    beginExit();
  }

  // Add finished assets. amount is 1, or 2 when one download covers a featured card and the list.
  function bump(amount) {
    finished += amount;
    if (finished > total) finished = total;
  }

  // Ease the number toward the real progress. It never moves backward, and it holds at 99.
  function tick() {
    if (opened || leaving) return;
    const seconds = (performance.now() - startedAt) / 1000;
    const allDone = finished >= total;
    const real = total === 0 ? 100 : (finished / total) * 100;
    let goal = 0;
    if (seen) goal = 100;
    else if (seconds >= MAX_TIME || (allDone && seconds >= MIN_TIME)) goal = 100;
    else goal = Math.min(99, real);
    if (goal > ceiling) ceiling = goal;
    shown += (ceiling - shown) * 0.14;
    if (ceiling - shown < 0.2) shown = ceiling;
    paint(shown);
    const canLeave = seen
      ? seconds >= SHORT_TIME && shown >= 99
      : seconds >= MAX_TIME || (allDone && seconds >= MIN_TIME && shown >= 99.5);
    if (canLeave && shown >= 99) {
      beginExit();
      return;
    }
    raf = window.requestAnimationFrame(tick);
  }

  // Draw the digits, the bar, and the status line from one 0 to 100 number.
  function paint(value) {
    const safe = Math.max(0, Math.min(100, Math.round(value)));
    countEl.textContent = String(safe).padStart(3, "0");
    const scale = Math.max(0, Math.min(1, value / 100));
    barEl.style.transform = `scaleX(${scale})`;
    statusEl.textContent = phrase(safe);
  }

  // Pick the status line from how far along the load is.
  function phrase(value) {
    if (value >= 75) return "Almost ready";
    if (value >= 25) return "Preparing projects";
    return "Loading fonts";
  }

  // Fade the cover, then take it off the page.
  function beginExit() {
    if (leaving || opened) return;
    leaving = true;
    window.cancelAnimationFrame(raf);
    paint(100);
    screen.style.transition = `opacity ${FADE_TIME}s linear`;
    screen.style.opacity = "0";
    window.setTimeout(finishPage, FADE_TIME * 1000);
  }

  // Remove the cover, unlock scrolling, then start the hero.
  function finishPage() {
    if (opened) return;
    opened = true;
    window.clearTimeout(failsafe);
    window.clearTimeout(backup);
    window.cancelAnimationFrame(raf);
    screen.remove();
    document.documentElement.classList.remove("is-loading");
    if (dead || siteStarted) return;
    markSeen();
    siteStarted = true;
    if (onReady) onReady();
  }

  return function stopPageAnimations() {
    dead = true;
    finishPage();
  };
}
