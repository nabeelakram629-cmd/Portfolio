import { STEPS, pad } from "../data/content.js";
import { STEP_VIS } from "../data/stepVisuals.js";
import { Reveal } from "./Reveal.jsx";

function ReplayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.6L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export function Process() {
  return (
    <section className="process" id="process">
      <div className="wrap">
        <Reveal className="sec-head">
          <div>
            <p className="eyebrow" style={{ marginBottom: 18 }}>
              How it works
            </p>
            <h2>From your first idea to a live website in three steps.</h2>
          </div>
        </Reveal>
        <ol className="steps" id="steps">
          {STEPS.map(([title, copy, label], i) => {
            const vis = STEP_VIS[i];
            return (
              <Reveal
                as="li"
                className="step"
                style={{ transitionDelay: `${i * 100}ms` }}
                key={title}
              >
                <div
                  className={vis.className}
                  data-loop={vis.loop}
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: vis.html }}
                />
                <div className="step-body">
                  <div className="step-top">
                    <span className="num">
                      {pad(i + 1)} / {label}
                    </span>
                    <button
                      type="button"
                      className="replay"
                      aria-label={`Replay animation for step ${i + 1}`}
                    >
                      <ReplayIcon />
                      Replay
                    </button>
                  </div>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
