import gsap from "gsap";
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

/* =================== MENU, NAV, SCROLL =================== */
      const menu = $("#menu"),
        toggle = $("#toggle"),
        nav = $("#nav");
      function setMenu(open) {
        menu.classList.toggle("open", open);
        $("#bars").classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open);
        menu.setAttribute("aria-hidden", !open);
        $("#menuLbl").textContent = open ? "Close" : "Menu";
        menu.querySelectorAll("a").forEach((a) => (a.tabIndex = open ? 0 : -1));
        document.body.style.overflow = open ? "hidden" : "";
        if (open) nav.classList.remove("hide");
      }
      toggle.onclick = () => setMenu(!menu.classList.contains("open"));
      menu
        .querySelectorAll("a")
        .forEach((a) => a.addEventListener("click", () => setMenu(false)));
      addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
      $("#toTop").onclick = () =>
        scrollTo({ top: 0, behavior: REDUCE ? "auto" : "smooth" });
      $("#bp").onclick = (e) => {
        const on = document.body.classList.toggle("bp-on");
        e.currentTarget.setAttribute("aria-pressed", on);
      };

      /* one throttled scroll handler: lit words, nav hide/show, floating pill */
      let tick = 0,
        lastY = scrollY;
      const flt = $("#float");
      function onScroll() {
        tick = 0;
        const y = scrollY,
          line = innerHeight * 0.78;
        litWords.forEach((w) =>
          w.classList.toggle(
            "on",
            REDUCE || w.getBoundingClientRect().top < line,
          ),
        );
        if (!menu.classList.contains("open"))
          nav.classList.toggle("hide", y > lastY && y > 200);
        lastY = y;
        const cta = $("#contact").getBoundingClientRect();
        flt.classList.toggle(
          "on",
          y > innerHeight * 0.7 && cta.top > innerHeight * 0.4,
        );
      }
      addEventListener(
        "scroll",
        () => {
          if (!tick) tick = requestAnimationFrame(onScroll);
        },
        { passive: true },
      );
      addEventListener("resize", onScroll);
      onScroll();

      /* live Lahore clock */
      const fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const clk = () => {
        const t = fmt.format(new Date());
        $("#clock1").textContent = t;
        $("#clock2").textContent = t + " PKT";
      };
      clk();
      setInterval(clk, 1000);

      /* hover preview for the project index */
      (() => {
        if (!FINE) return;
        const peek = $("#peek"),
          img = peek.querySelector("img");
        let tx = 0,
          ty = 0,
          x = 0,
          y = 0,
          raf = 0;
        const loop = () => {
          x += (tx - x) * 0.18;
          y += (ty - y) * 0.18;
          peek.style.transform = `translate3d(${x}px,${y}px,0)`;
          raf = peek.classList.contains("on") ? requestAnimationFrame(loop) : 0;
        };
        const idx = $("#idx");
        idx.addEventListener("pointerover", (e) => {
          const r = e.target.closest(".row");
          if (!r) return;
          img.onerror = () => img.removeAttribute("src");
          img.src = shotUrl(r.dataset.url);
          peek.classList.add("on");
          if (!raf) raf = requestAnimationFrame(loop);
        });
        idx.addEventListener("pointerleave", () => peek.classList.remove("on"));
        idx.addEventListener("pointermove", (e) => {
          tx = Math.min(e.clientX + 24, innerWidth - 344);
          ty = Math.min(e.clientY - 120, innerHeight - 264);
        });
      })();

      /* =====================================================================
         SCROLL ENGINE (vanilla): pinned About, Services stage, footer reveal.
         Every effect is a function of scroll progress, smoothed by a shared
         rAF lerp, so it plays forward and backward identically.
         ===================================================================== */
      const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
      const ease3 = (t) => 1 - Math.pow(1 - t, 3);
      const eio = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const TR = [];
      let trRaf = 0;
      function trFrame() {
        trRaf = 0;
        let busy = false;
        for (const o of TR) {
          const t = o.target();
          if (o.v === null) {
            o.v = t;
            o.apply(t);
            continue;
          }
          const d = t - o.v;
          if (Math.abs(d) > 0.0005 && !REDUCE) {
            o.v += d * 0.14;
            o.apply(o.v);
            busy = true;
          } else if (o.v !== t) {
            o.v = t;
            o.apply(t);
          }
        }
        if (busy) trRaf = requestAnimationFrame(trFrame);
      }
      const kick = () => {
        if (!trRaf) trRaf = requestAnimationFrame(trFrame);
      };
      const track = (target, apply) => TR.push({ v: null, target, apply });
      addEventListener("scroll", kick, { passive: true });
      addEventListener("resize", kick);
      addEventListener("load", kick);

      /* ---------- 1) ABOUT: pinned, words gray -> black, "2.5+" note slides in ---------- */
      (() => {
        const sec = $("#about"),
          note = $(".about-note"),
          words = [...$("#aboutLit").querySelectorAll(".w")],
          mq = matchMedia("(min-width: 900px) and (min-height: 760px)");
        words.forEach((w) => {
          const i = litWords.indexOf(w);
          if (i > -1) litWords.splice(i, 1);
          w.style.transition = "none";
        });
        const n = words.length;
        track(
          () => {
            const r = sec.getBoundingClientRect();
            if (mq.matches)
              return clamp(-r.top / Math.max(1, r.height - innerHeight));
            const q = $("#aboutLit").getBoundingClientRect();
            return clamp((innerHeight * 0.88 - q.top) / (innerHeight * 0.5));
          },
          (p) => {
            const pinned = mq.matches;
            const a = REDUCE ? 1 : pinned ? clamp((p - 0.04) / 0.66) : p;
            words.forEach((w, i) => {
              const t = clamp((a * (n + 4) - i) / 4);
              w.style.color = `rgba(16,16,16,${(0.16 + 0.84 * t).toFixed(3)})`;
            });
            const e = REDUCE ? 1 : ease3(pinned ? clamp((p - 0.4) / 0.42) : p);
            const dx = pinned ? 170 : Math.min(40, innerWidth * 0.08);
            note.style.opacity = e.toFixed(3);
            note.style.transform = `translate3d(${((1 - e) * dx).toFixed(1)}px,0,0)`;
          },
        );
        mq.addEventListener?.("change", kick);
      })();

      /* ---------- 2) COUNTERS: run on every re-entry ---------- */
      (() => {
        const run = new WeakMap();
        const fmt = (n, to, k) => {
          const dec = +(n.dataset.dec || 0),
            suf = n.dataset.suffix || "";
          n.textContent = (to * k).toFixed(dec) + (k >= 1 ? suf : "");
        };
        const io = new IntersectionObserver(
          (es) =>
            es.forEach((e) => {
              const n = e.target,
                to = +n.dataset.count;
              if (e.intersectionRatio >= 0.6) {
                if (run.has(n)) return;
                if (REDUCE) {
                  run.set(n, 0);
                  fmt(n, to, 1);
                  return;
                }
                const t0 = performance.now();
                const st = { raf: 0 };
                run.set(n, st);
                const step = (t) => {
                  const p = Math.min((t - t0) / 1400, 1);
                  fmt(n, to, 1 - Math.pow(1 - p, 4));
                  if (p < 1) st.raf = requestAnimationFrame(step);
                };
                st.raf = requestAnimationFrame(step);
              } else if (!e.isIntersecting || e.intersectionRatio === 0) {
                const st = run.get(n);
                if (st && st.raf) cancelAnimationFrame(st.raf);
                run.delete(n);
                fmt(n, to, 0);
              }
            }),
          { threshold: [0, 0.6] },
        );
        document.querySelectorAll("[data-count]").forEach((n) => io.observe(n));
      })();

      /* ---------- 3+4) SERVICES: sticky stage, content + website preview per service ---------- */
      (() => {
        const stage = $("#benefits"),
          texts = [...stage.querySelectorAll(".svc-text")],
          panels = [...stage.querySelectorAll(".panel")],
          dots = [...stage.querySelectorAll(".svc-dots button")],
          mq = matchMedia("(min-width: 900px) and (min-height: 700px)"),
          N = texts.length;
        /* waypoints: [zoom, x, y] as fractions of the scrollable range */
        const WP = [
          [1, 0, 0],
          [1, 0, 1],
          [1, 0, 0],
          [1.7, 0, 0.12],
          [1.7, 1, 0.12],
          [1.7, 1, 0.7],
          [1.7, 0, 0.7],
        ];
        const LEG = [5200, 2800, 1700, 3200, 2200, 3200, 1800],
          PAUSE = 350;
        const PS = panels.map((el, pi) => {
          const sites = [...el.querySelectorAll(".pv-site")].map((s) => ({
            el: s,
            page: s.querySelector(".pv-page"),
            img: s.querySelector("img"),
            ph: 0,
            loaded: false,
          }));
          return {
            el,
            pv: el.querySelector(".pv"),
            view: el.querySelector(".pv-view"),
            url: el.querySelector(".pv-url"),
            ctrl: [...el.querySelectorAll(".pv-ctrl button")],
            sites,
            cur: 0,
            leg: 0,
            t: -400,
            hover: false,
            vw: 0,
            vh: 0,
            loadedAll: false,
            domains: el.dataset.sites.split(","),
            urls: el.dataset.urls.split(","),
          };
        });
        const measure = (P) => {
          P.vw = P.view.clientWidth;
          P.vh = P.view.clientHeight;
          P.sites.forEach((s) => (s.ph = s.page.offsetHeight));
        };
        function paint(P) {
          const s = P.sites[P.cur];
          if (!P.vw) measure(P);
          let z, x, y;
          if (REDUCE) {
            z = 1;
            x = 0;
            y = 0;
          } else {
            const a = WP[P.leg],
              b = WP[(P.leg + 1) % WP.length];
            const k = eio(clamp(P.t / LEG[P.leg]));
            z = a[0] + (b[0] - a[0]) * k;
            x = a[1] + (b[1] - a[1]) * k;
            y = a[2] + (b[2] - a[2]) * k;
          }
          const sw = P.vw * z,
            sh = s.ph * z;
          s.page.style.transform = `translate3d(${(-x * Math.max(0, sw - P.vw)).toFixed(1)}px,${(-y * Math.max(0, sh - P.vh)).toFixed(1)}px,0) scale(${z.toFixed(4)})`;
        }
        function showSite(P, i) {
          P.cur = (i + P.sites.length) % P.sites.length;
          P.leg = 0;
          P.t = -400;
          P.sites.forEach((s, j) => s.el.classList.toggle("on", j === P.cur));
          P.ctrl.forEach((b, j) => {
            b.classList.toggle("on", j === P.cur);
            b.setAttribute("aria-current", j === P.cur);
          });
          P.url.textContent = P.domains[P.cur];
          P.pv.href = P.urls[P.cur];
          P.pv.setAttribute(
            "aria-label",
            `Visit ${P.domains[P.cur]} (opens in a new tab)`,
          );
          paint(P);
        }
        function loadPanel(P) {
          if (P.loadedAll) return;
          P.loadedAll = true;
          P.sites.forEach((s) => {
            const im = s.img;
            if (!im || !im.dataset.src) return;
            im.onload = () => {
              if (im.naturalWidth < 40) return;
              s.loaded = true;
              s.page.classList.add("ok");
              measure(P);
              paint(P);
            };
            im.onerror = () => im.remove();
            im.src = im.dataset.src;
          });
          measure(P);
        }
        PS.forEach((P, pi) => {
          showSite(P, 0);
          P.ctrl.forEach((b, j) => (b.onclick = () => showSite(P, j)));
          const pv = P.pv;
          if (FINE) {
            pv.addEventListener("pointerenter", () => {
              P.hover = true;
              pv.classList.add("hov");
            });
            pv.addEventListener(
              "pointermove",
              (e) => {
                const r = pv.getBoundingClientRect(),
                  px = (e.clientX - r.left) / r.width,
                  py = (e.clientY - r.top) / r.height;
                pv.style.setProperty("--ry", ((px - 0.5) * 9).toFixed(2) + "deg");
                pv.style.setProperty("--rx", ((0.5 - py) * 7).toFixed(2) + "deg");
                pv.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
                pv.style.setProperty("--my", (py * 100).toFixed(1) + "%");
              },
              { passive: true },
            );
            pv.addEventListener("pointerleave", () => {
              P.hover = false;
              pv.classList.remove("hov");
              pv.style.setProperty("--rx", "0deg");
              pv.style.setProperty("--ry", "0deg");
            });
          }
          pv.addEventListener("focus", () => {
            P.hover = true;
            pv.classList.add("hov");
          });
          pv.addEventListener("blur", () => {
            P.hover = false;
            pv.classList.remove("hov");
          });
        });
        addEventListener("resize", () => PS.forEach(measure));

        /* shared preview loop: only panels that are on screen and active */
        const playing = new Set();
        let praf = 0,
          last = 0;
        function ploop(now) {
          praf = 0;
          const dt = Math.min(now - last, 64);
          last = now;
          playing.forEach((P) => {
            if (P.hover || REDUCE) return;
            P.t += dt;
            if (P.t >= LEG[P.leg] + PAUSE) {
              P.t = 0;
              P.leg++;
              if (P.leg >= WP.length) {
                if (P.sites.length > 1) showSite(P, P.cur + 1);
                else P.leg = 0;
              }
            }
            paint(P);
          });
          if (playing.size && !document.hidden) praf = requestAnimationFrame(ploop);
        }
        const wake = () => {
          if (!praf && playing.size) {
            last = performance.now();
            praf = requestAnimationFrame(ploop);
          }
        };
        document.addEventListener("visibilitychange", wake);

        let active = -1,
          stageVis = false;
        const mobileVis = new Set();
        function syncPlaying() {
          playing.clear();
          if (mq.matches) {
            if (stageVis && active > -1) playing.add(PS[active]);
          } else mobileVis.forEach((P) => playing.add(P));
          wake();
        }
        function setActive(i) {
          active = i;
          texts.forEach((t, j) => {
            t.classList.toggle("is-active", j === i);
            t.classList.toggle("is-before", j < i);
            t.setAttribute("aria-hidden", j === i ? "false" : "true");
          });
          panels.forEach((p, j) => {
            p.classList.toggle("is-active", j === i);
            p.classList.toggle("is-before", j < i);
          });
          dots.forEach((d, j) =>
            d.setAttribute("aria-current", j === i ? "true" : "false"),
          );
          if (i > -1) {
            loadPanel(PS[i]);
            if (PS[i + 1]) loadPanel(PS[i + 1]);
          }
          syncPlaying();
        }
        function clearDesktop() {
          active = -1;
          [...texts, ...panels].forEach((e) =>
            e.classList.remove("is-active", "is-before"),
          );
          texts.forEach((t) => t.removeAttribute("aria-hidden"));
        }
        track(
          () => {
            if (!mq.matches) return 0;
            const r = stage.getBoundingClientRect();
            return clamp(-r.top / Math.max(1, r.height - innerHeight));
          },
          (v) => {
            if (!mq.matches) {
              if (active > -1) {
                clearDesktop();
                syncPlaying();
              }
              return;
            }
            const i = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
            if (i !== active) setActive(i);
          },
        );
        new IntersectionObserver(
          (es) => {
            stageVis = es[0].isIntersecting;
            syncPlaying();
          },
          { threshold: 0 },
        ).observe(stage);
        const mio = new IntersectionObserver(
          (es) => {
            es.forEach((e) => {
              const P = PS[panels.indexOf(e.target)];
              if (e.isIntersecting) {
                mobileVis.add(P);
                loadPanel(P);
              } else mobileVis.delete(P);
            });
            if (!mq.matches) syncPlaying();
          },
          { threshold: 0.25 },
        );
        panels.forEach((p) => mio.observe(p));
        mq.addEventListener?.("change", () => {
          clearDesktop();
          PS.forEach((P) => {
            P.vw = 0;
          });
          kick();
          syncPlaying();
        });
        dots.forEach((d, i) => {
          d.onclick = () => {
            const r = stage.getBoundingClientRect(),
              top = scrollY + r.top,
              range = r.height - innerHeight;
            scrollTo({
              top: top + ((i + 0.5) / N) * range,
              behavior: REDUCE ? "auto" : "smooth",
            });
          };
        });
      })();

      /* ---------- 5) FOOTER: blue circle reveal, content rises, name marquee ---------- */
      (() => {
        const cta = $("#contact"),
          blue = $(".cta-blue"),
          rise = [...cta.querySelectorAll("[data-rise]")];
        track(
          () => {
            if (REDUCE) return 1;
            const r = cta.getBoundingClientRect(),
              vh = innerHeight,
              start = vh * 0.92,
              end = vh - Math.min(r.height * 0.92, vh * 0.9);
            return clamp((start - r.top) / Math.max(1, start - end));
          },
          (p) => {
            blue.style.clipPath = `circle(${(Math.pow(p, 0.85) * 72).toFixed(2)}% at 50% 50%)`;
            rise.forEach((el, i) => {
              const q = clamp((p - 0.12 - i * 0.07) / 0.45),
                e = ease3(q);
              el.style.opacity = e.toFixed(3);
              el.style.transform = `translate3d(0,${((1 - e) * 70).toFixed(1)}px,0)`;
            });
          },
        );

        const m = $("#marq"),
          tr = $(".marq-track", m),
          unit = '<span>Nabeel Akram</span><i aria-hidden="true"></i>';
        let period = 1,
          x = 0,
          mult = 1,
          goal = 1,
          vis = false,
          mraf = 0,
          mlast = 0;
        function build() {
          tr.innerHTML = unit;
          const w1 = tr.getBoundingClientRect().width || 1,
            k = Math.max(1, Math.ceil((innerWidth * 1.1) / w1)),
            half = unit.repeat(k);
          tr.innerHTML = half + half;
          period = w1 * k;
          x = x % period;
        }
        build();
        document.fonts?.ready.then(build);
        addEventListener("resize", build);
        function mloop(now) {
          mraf = 0;
          const dt = Math.min(now - mlast, 64);
          mlast = now;
          mult += (goal - mult) * (1 - Math.exp(-dt / 180));
          x -= ((Math.max(50, innerWidth * 0.045) * mult * dt) / 1000);
          if (x <= -period) x += period;
          tr.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
          if (vis && !document.hidden) mraf = requestAnimationFrame(mloop);
        }
        const mwake = () => {
          if (!REDUCE && vis && !mraf) {
            mlast = performance.now();
            mraf = requestAnimationFrame(mloop);
          }
        };
        new IntersectionObserver(
          (es) => {
            vis = es[0].isIntersecting;
            mwake();
          },
          { threshold: 0 },
        ).observe(m);
        document.addEventListener("visibilitychange", mwake);
        m.addEventListener("pointerenter", () => (goal = 10));
        m.addEventListener("pointerleave", () => (goal = 1));
        m.addEventListener("pointerdown", () => (goal = 10));
        addEventListener("pointerup", () => (goal = m.matches(":hover") ? 10 : 1));
        addEventListener("pointercancel", () => (goal = 1));
      })();

      /* ---------- WORKFLOW CARDS: timeline-driven visuals (play in view, replay on demand) ---------- */
      (() => {
        const vs = [...document.querySelectorAll(".vis")];
        vs.forEach((v) => {
          const ev = [];
          v.querySelectorAll("*").forEach((el) => {
            [...el.attributes].forEach((a) => {
              const m = /^data-(at|off)(\d*)$/.exec(a.name);
              if (m) ev.push({ t: +a.value, el, add: m[1] === "at", cls: "on" + m[2] });
            });
          });
          ev.sort((a, b) => a.t - b.t);
          const loop = +v.dataset.loop || 12000;
          let timers = [],
            running = false;
          const counter = (el) => {
            const to = +el.dataset.to,
              t0 = performance.now();
            const st = (t) => {
              const k = Math.min((t - t0) / 1100, 1);
              el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
              if (k < 1) requestAnimationFrame(st);
            };
            REDUCE ? (el.textContent = to) : requestAnimationFrame(st);
          };
          const apply = (e) => {
            e.el.classList.toggle(e.cls, e.add);
            if (e.add && e.cls === "on" && e.el.dataset.to) counter(e.el);
          };
          const clear = () => {
            v.classList.add("nt");
            ev.forEach((e) => {
              e.el.classList.remove("on", "on2", "on3");
              if (e.el.dataset.to) e.el.textContent = "0";
            });
            void v.offsetWidth;
            requestAnimationFrame(() => v.classList.remove("nt"));
          };
          const stop = () => {
            timers.forEach(clearTimeout);
            timers = [];
            running = false;
          };
          const play = () => {
            stop();
            clear();
            v.classList.remove("reset");
            running = true;
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                if (!running) return;
                ev.forEach((e) => timers.push(setTimeout(() => apply(e), e.t)));
                timers.push(
                  setTimeout(() => {
                    v.classList.add("reset");
                    timers.push(
                      setTimeout(() => {
                        if (running) play();
                      }, 600),
                    );
                  }, loop),
                );
              }),
            );
          };
          const finish = () => {
            stop();
            clear();
            ev.forEach(apply);
          };
          v._play = play;
          v._stop = stop;
          const btn = v.closest(".step").querySelector(".replay");
          if (btn)
            btn.onclick = () => {
              REDUCE ? finish() : play();
            };
          v.addEventListener("click", () => (REDUCE ? finish() : play()));
          new IntersectionObserver(
            (es) => {
              if (es[0].isIntersecting) {
                if (REDUCE) finish();
                else if (!running) play();
              } else if (!REDUCE) {
                stop();
                clear();
              }
            },
            { threshold: 0.45 },
          ).observe(v);
        });
      })();

      kick();

      (() => {
        const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
        const hero = document.getElementById("top");

        /* ---------- 1 + 3) BRUSH: liquid / bubble trail ---------- */
        if (FINE && !REDUCE) {
          const cv = document.getElementById("brush"),
            ctx = cv.getContext("2d");
          let W = 0,
            H = 0,
            pts = [],
            last = null,
            running = false,
            prev = 0;
          const size = () => {
            W = hero.offsetWidth;
            H = hero.offsetHeight;
            cv.width = W;
            cv.height = H;
          };
          size();
          addEventListener("resize", size);

          const add = (x, y, sp) =>
            pts.push({
              x,
              y,
              t: 0,
              life: 800 + Math.random() * 600,
              r: 34 + Math.random() * 26 + Math.min(sp, 40) * 0.5, // bubble size
              vx: (Math.random() - 0.5) * 0.5,
              vy: -0.1 - Math.random() * 0.3,
            });
          const draw = (now) => {
            const dt = Math.min(now - prev, 50);
            prev = now;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = "#fff";
            pts = pts.filter((p) => (p.t += dt) < p.life);
            for (const p of pts) {
              const k = 1 - p.t / p.life;
              p.x += p.vx;
              p.y += p.vy;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.r * Math.pow(k, 0.6), 0, 6.2832);
              ctx.fill();
            }
            if (pts.length) requestAnimationFrame(draw);
            else running = false;
          };
          hero.addEventListener("pointermove", (e) => {
            const b = hero.getBoundingClientRect(),
              k = W / b.width;
            const x = (e.clientX - b.left) * k,
              y = (e.clientY - b.top) * k;
            if (last) {
              const dx = x - last.x,
                dy = y - last.y,
                d = Math.hypot(dx, dy),
                n = Math.max(1, Math.ceil(d / 20));
              for (let i = 1; i <= n; i++)
                add(last.x + (dx * i) / n, last.y + (dy * i) / n, d);
            } else add(x, y, 0);
            last = { x, y };
            if (!running) {
              running = true;
              prev = performance.now();
              requestAnimationFrame(draw);
            }
          });
          hero.addEventListener("pointerleave", () => {
            last = null;
          });
        }

        /* ---------- 2) FLOAT + JAR + SECTION SHRINK (GSAP) ---------- */
        if (window.gsap && window.ScrollTrigger && !REDUCE) {
          gsap.registerPlugin(ScrollTrigger);

          // ball upar neeche hilti rehti hai
          const egg = document.getElementById("egg"),
            flask = document.getElementById("flask"),
            scene = document.querySelector(".scene");
          gsap.to(egg, {
            yPercent: -6,
            duration: 2.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });

          // positions (px) - resize par khud recalculate hote hain
          const M = () => ({
            sh: scene.offsetHeight,
            d: egg.offsetWidth,
            u: flask.offsetWidth / 480,
          });
          const flaskStart = () => {
            const { sh, d, u } = M();
            return 0.06 * sh + 1.25 * d - 60 * u;
          }; // flask neeche chhupi hui
          const flaskEnd = () => {
            const { sh, u } = M();
            return 0.1 * sh - 60 * u;
          }; // flask upar uthta hai
          const eggDrop = () => {
            const { sh, u } = M();
            return 0.1 * sh + 25 * u - 0.06 * sh;
          }; // ball neeche flask mein

          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "+=650",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(
              flask,
              { y: flaskStart, opacity: 0 },
              { y: flaskEnd, opacity: 1 },
              0,
            )
            .fromTo(egg, { y: 0 }, { y: eggDrop }, 0)
            .to("#pale", { opacity: 1 }, 0) // ball ka color light blue
            .to("#blue", { opacity: 1 }, 0); // background blue glow

          // poora section upar jaata hua, left/right se thoda sa chhota
          gsap.to(hero, {
            scale: 0.94,
            borderRadius: 44,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        }

        /* clock */
        const f = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Karachi",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const c = document.getElementById("clock1");
        const t = () => (c.textContent = f.format(new Date()));
        t();
        setInterval(t, 1000);
      })();

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
