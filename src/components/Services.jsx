import { BENEFITS, SVC, TAGS, pad, pvShot, siteUrl } from "../data/content.js";
import { Reveal } from "./Reveal.jsx";
import { Wireframe } from "./Wireframe.jsx";

export function Services() {
  return (
    <section className="svc" id="services">
      <div className="wrap">
        <Reveal className="svc-head">
          <div>
            <p className="eyebrow" style={{ marginBottom: 18 }}>
              Services
            </p>
            <h2>Most business websites are slow, rigid and hard to maintain.</h2>
            <p className="svc-lead">
              Template themes pile up plugins you never asked for. I build
              custom themes, plugins and React interfaces around how your
              business works, then keep them fast after launch.
            </p>
          </div>
        </Reveal>
        <div id="benefits" className="svc-stage" style={{ "--n": BENEFITS.length }}>
          <div className="svc-pin">
            <div className="svc-left">
              {BENEFITS.map(([title, copy], i) => {
                const info = SVC[i] || SVC[SVC.length - 1];
                return (
                  <div className="svc-text" style={{ "--i": i }} key={title}>
                    <div className="svc-top">
                      <span>Services</span>
                      <span>
                        <span className="num">{i + 1}</span> / {BENEFITS.length}
                      </span>
                    </div>
                    <h3>{title}</h3>
                    <div className="svc-foot">
                      <p>{copy}</p>
                      <dl className="svc-meta">
                        <div>
                          <dt>Built with</dt>
                          <dd>{info.with}</dd>
                        </div>
                        <div>
                          <dt>Live examples</dt>
                          <dd>{info.sites.slice(0, 2).join(", ")}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                );
              })}
              <div className="svc-dots" role="group" aria-label="Choose a service">
                {BENEFITS.map(([title], i) => (
                  <button
                    type="button"
                    key={title}
                    aria-label={`Show service ${i + 1}: ${title}`}
                    aria-current="false"
                  >
                    {pad(i + 1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="svc-right">
              {BENEFITS.map((benefit, i) => {
                const info = SVC[i] || SVC[SVC.length - 1];
                const urls = info.sites.map(siteUrl);
                return (
                  <div
                    className="panel"
                    style={{ "--i": i }}
                    key={benefit[0]}
                    data-sites={info.sites.join(",")}
                    data-urls={urls.join(",")}
                  >
                    <div className="rings" aria-hidden="true">
                      <i style={{ "--s": "62%" }} />
                      <i style={{ "--s": "88%" }} />
                    </div>
                    <a
                      className="pv"
                      href={urls[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${info.sites[0]} (opens in a new tab)`}
                    >
                      <span className="pv-bar" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                        <span className="pv-url">{info.sites[0]}</span>
                      </span>
                      <span className="pv-view">
                        {info.sites.map((domain, j) => (
                          <span className={`pv-site${j === 0 ? " on" : ""}`} key={domain}>
                            <span className="pv-page">
                              <Wireframe domain={domain} />
                              <img
                                data-src={pvShot(urls[j])}
                                alt={`Homepage of ${domain}`}
                                width="1000"
                                height="1300"
                              />
                            </span>
                          </span>
                        ))}
                      </span>
                      <span className="pv-shine" aria-hidden="true" />
                      <span className="pv-hint" aria-hidden="true">
                        Visit site ↗
                      </span>
                    </a>
                    <div className="pv-ctrl" role="group" aria-label="Choose a site">
                      {info.sites.map((domain, j) => (
                        <button
                          type="button"
                          key={domain}
                          aria-label={`Show ${domain}`}
                          className={j === 0 ? "on" : undefined}
                        />
                      ))}
                    </div>
                    <span className="cap">{TAGS[i] || ""}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
