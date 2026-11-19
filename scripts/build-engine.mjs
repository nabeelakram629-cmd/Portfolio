import fs from "fs";

const html = fs.readFileSync(
  "C:/Users/DELL/Downloads/portfolio-catalyst-style-v3.html",
  "utf8",
);
const goo = html.match(
  /<svg\s+width="0"\s+height="0"\s+style="position:\s*absolute"\s+aria-hidden="true"\s*>\s*<defs>\s*<filter\s+id="goo"[\s\S]*?<\/svg>/,
);
const flask = html.match(
  /<svg class="flask" id="flask" viewBox="0 0 480 560">([\s\S]*?)<\/svg>/,
);
if (!goo || !flask) {
  console.error("hero svg extract failed", !!goo, !!flask);
  process.exit(1);
}
fs.writeFileSync(
  "C:/Users/DELL/Nabeel Akram/src/data/heroSvg.js",
  `export const GOO_SVG = ${JSON.stringify(goo[0])};\nexport const FLASK_INNER = ${JSON.stringify(flask[1])};\n`,
);
console.log("goo", goo[0].length, "flask", flask[1].length);

const behaviorPath = "C:/Users/DELL/Nabeel Akram/src/engine/_behavior.js.txt";
let behavior = fs.readFileSync(behaviorPath, "utf8");

const revealBlock = `      const rev = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              rev.unobserve(e.target);
            }
          }),
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
      );
      document.querySelectorAll(".reveal").forEach((n) => rev.observe(n));

`;

if (!behavior.includes(revealBlock)) {
  console.error("reveal block not found");
  process.exit(1);
}
behavior = behavior.replace(revealBlock, "");

const header = `import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FAQS } from "../data/content.js";

gsap.registerPlugin(ScrollTrigger);

export function runEngine() {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;

  const ac = new AbortController();
  const observers = [];
  const intervalIds = [];
  const timeoutIds = [];
  const frames = new Set();
  let dead = false;

  const NativeIO = window.IntersectionObserver;
  const IntersectionObserver = class extends NativeIO {
    constructor(cb, opts) {
      super(cb, opts);
      observers.push(this);
    }
  };

  const requestAnimationFrame = (fn) => {
    if (dead) return 0;
    const id = window.requestAnimationFrame((t) => {
      frames.delete(id);
      if (!dead) fn(t);
    });
    frames.add(id);
    return id;
  };
  const cancelAnimationFrame = (id) => {
    frames.delete(id);
    window.cancelAnimationFrame(id);
  };
  const setInterval = (fn, ms, ...rest) => {
    const id = window.setInterval(fn, ms, ...rest);
    intervalIds.push(id);
    return id;
  };
  const setTimeout = (fn, ms, ...rest) => {
    const id = window.setTimeout(fn, ms, ...rest);
    timeoutIds.push(id);
    return id;
  };
  const clearTimeout = (id) => window.clearTimeout(id);

  const origAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    const base = typeof opts === "boolean" ? { capture: opts } : { ...(opts || {}) };
    if (!base.signal) base.signal = ac.signal;
    return origAdd.call(this, type, fn, base);
  };

  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const litWords = [...document.querySelectorAll(".lit .w")];

  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.id = "faq-ld";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  });
  document.head.appendChild(ld);

`;

const footer = `
  EventTarget.prototype.addEventListener = origAdd;

  return function cleanup() {
    dead = true;
    ac.abort();
    EventTarget.prototype.addEventListener = origAdd;
    intervalIds.forEach((id) => window.clearInterval(id));
    timeoutIds.forEach((id) => window.clearTimeout(id));
    frames.forEach((id) => window.cancelAnimationFrame(id));
    observers.forEach((o) => o.disconnect());
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.killTweensOf("*");
    document.getElementById("faq-ld")?.remove();
    document.body.style.overflow = "";
    document.body.classList.remove("bp-on");
  };
}
`;

fs.writeFileSync(
  "C:/Users/DELL/Nabeel Akram/src/engine/runEngine.js",
  header + behavior + "\n" + footer,
);
console.log("engine bytes", (header + behavior + footer).length);
