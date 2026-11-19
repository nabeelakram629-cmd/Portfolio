import { FLASK_INNER, GOO_SVG } from "../data/heroSvg.js";

export function Hero() {
  return (
    <div className="hero-wrap">
      <section className="hero" id="top">
        <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: GOO_SVG }} />
        <div className="blueglow" id="blue" />
        <canvas id="brush" aria-hidden="true" />
        <div className="hero-inner">
          <div>
            <h1>Fast websites that turn visitors into customers.</h1>
            <p className="sub">
              I build custom React, WordPress and Shopify websites for
              international businesses, and lead a WordPress team that has
              delivered 50+ sites.
            </p>
            <div className="hero-cta">
              <a
                className="btn"
                href="mailto:nabeelakram629@gmail.com?subject=New%20project%20enquiry"
              >
                Start a project &nbsp;→
              </a>
              <a className="btn ghost" href="#work">
                See the work
              </a>
            </div>
            <p className="note">Replies with next steps and a clear scope.</p>
          </div>
          <div className="scene" aria-hidden="true">
            <div className="egg" id="egg">
              <i className="pale" id="pale" />
            </div>
            <svg
              className="flask"
              id="flask"
              viewBox="0 0 480 560"
              dangerouslySetInnerHTML={{ __html: FLASK_INNER }}
            />
          </div>
        </div>
        <div className="hero-bar">
          <span className="chip">Open for new projects</span>
          <span className="chip">
            Lahore &nbsp;<b id="clock1">--:--:--</b>
          </span>
          <a className="chip" href="#about" style={{ color: "#fff", textDecoration: "none" }}>
            Scroll
          </a>
        </div>
      </section>
    </div>
  );
}
