import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ===== 3D ANIMATIONS =====
   Extra motion for everything UNDER the hero.
   The hero brush, ball, flask, and blue glow are not touched.

   Change the numbers below to make an effect stronger or weaker.
   Set a number to 0 to turn that effect off. */
const TILT_STRENGTH = 7; // Max card tilt, in degrees. Try 4 (quiet) or 12 (strong).
const REVEAL_ROTATE = 10; // How far a section leans back before it settles, in degrees.
const REVEAL_DISTANCE = 28; // How many pixels a section rises as it appears.
const PARALLAX_AMOUNT = 32; // How far service titles drift while you scroll, in pixels.
const GLARE_STRENGTH = 0.45; // Hover light. 0 is off, 1 is bright. Keep it under 0.6.
const ORB_FLOAT = 16; // How many pixels the contact ball bobs up and down.

const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Lean an element toward the cursor.
 * strength: max tilt in degrees. lift: pixels it rises while tilted (0 for none).
 */
function addTilt(el, strength, lift) {
  const onMove = (event) => {
    const box = el.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    const rotateY = (px - 0.5) * strength;
    const rotateX = (0.5 - py) * strength;
    el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(${lift}px)`;
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    el.style.transform = "";
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
  };
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerleave", onLeave);
  return () => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
  };
}

/**
 * Drift an element up the page as its section scrolls by.
 * amount: total travel in pixels from the start of the section to the end.
 */
function addParallax(target, trigger, amount) {
  return gsap.fromTo(
    target,
    { y: amount * 0.5 },
    {
      y: -amount * 0.5,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      },
    },
  );
}

/**
 * Play a one-time 3D entrance when a heading or the footer reaches the screen.
 */
function addReveal(el) {
  return gsap.from(el, {
    rotateX: REVEAL_ROTATE,
    y: REVEAL_DISTANCE,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    transformOrigin: "50% 100%",
    scrollTrigger: {
      trigger: el,
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });
}

/**
 * Start every 3D effect under the hero. Returns a function that removes them.
 */
export function start3d() {
  if (REDUCE) return () => {};

  gsap.registerPlugin(ScrollTrigger);

  const root = document.documentElement;
  root.style.setProperty("--d3-reveal", `${REVEAL_ROTATE}deg`);
  root.style.setProperty("--d3-distance", `${REVEAL_DISTANCE}px`);
  root.style.setProperty("--d3-glare", String(GLARE_STRENGTH));
  root.style.setProperty("--d3-float", `${ORB_FLOAT}px`);

  const cleanups = [];
  const tweens = [];

  // Mouse tilt. Cards lift a little. The photo and FAQ items only lean.
  if (FINE && TILT_STRENGTH > 0) {
    document.querySelectorAll(".card").forEach((el) => {
      cleanups.push(addTilt(el, TILT_STRENGTH, -5));
    });
    document.querySelectorAll(".step").forEach((el) => {
      cleanups.push(addTilt(el, TILT_STRENGTH, -4));
    });
    document.querySelectorAll(".faq li").forEach((el) => {
      cleanups.push(addTilt(el, TILT_STRENGTH * 0.6, 0));
    });
    document.querySelectorAll(".thumb").forEach((el) => {
      cleanups.push(addTilt(el, TILT_STRENGTH * 0.55, 0));
    });
  }

  // Service titles and the small "1 / 5" numbers drift at different speeds.
  // The panel itself is left alone so the sticky service swap still works.
  if (PARALLAX_AMOUNT > 0) {
    tweens.push(addParallax(".svc-text h3", "#services", PARALLAX_AMOUNT));
    tweens.push(addParallax(".svc-top .num", "#services", PARALLAX_AMOUNT * 1.4));
    document.querySelectorAll(".step").forEach((step) => {
      const num = step.querySelector(".num");
      if (!num) return;
      tweens.push(addParallax(num, step, PARALLAX_AMOUNT * 0.45));
    });
  }

  // These headings are not part of the existing fade-in, so they get their own.
  if (REVEAL_ROTATE > 0 || REVEAL_DISTANCE > 0) {
    // Animate the heading only. Transforming the whole sticky column
    // would stop it from sticking while you scroll.
    document.querySelectorAll("#experience .sticky h2, #skills .sticky h2").forEach((el) => {
      tweens.push(addReveal(el));
    });
    const footer = document.querySelector("footer .wrap");
    if (footer) tweens.push(addReveal(footer));
  }

  // Soft blue ball in the contact band, same palette as the hero ball.
  const contact = document.querySelector(".cta");
  let orb = null;
  let glow = null;
  if (contact) {
    glow = document.createElement("div");
    glow.className = "d3-glow";
    glow.setAttribute("aria-hidden", "true");
    orb = document.createElement("div");
    orb.className = "d3-orb";
    orb.setAttribute("aria-hidden", "true");
    contact.prepend(glow);
    contact.prepend(orb);
    if (PARALLAX_AMOUNT > 0) {
      tweens.push(addParallax(glow, contact, PARALLAX_AMOUNT * 1.5));
    }
  }

  return function stop3d() {
    cleanups.forEach((fn) => fn());
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
    orb?.remove();
    glow?.remove();
    root.style.removeProperty("--d3-reveal");
    root.style.removeProperty("--d3-distance");
    root.style.removeProperty("--d3-glare");
    root.style.removeProperty("--d3-float");
  };
}
