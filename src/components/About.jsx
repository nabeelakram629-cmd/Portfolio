import { ABOUT_LIT, splitWords } from "../data/content.js";
import { Icon } from "./Icon.jsx";
import { Reveal } from "./Reveal.jsx";
import { Roll } from "./Roll.jsx";

export function About() {
  const words = splitWords(ABOUT_LIT);
  return (
    <section className="about" id="about">
      <div className="about-pin">
        <div className="wrap">
          <div className="about-grid">
            <Reveal>
              <div className="thumb">
                <img
                  src="portrait.jpeg"
                  width="800"
                  height="1000"
                  alt="Portrait of Nabeel Akram"
                  decoding="async"
                />
              </div>
            </Reveal>
            <div className="about-copy">
              <p className="eyebrow">About</p>
              <p className="lit" id="aboutLit">
                {words.map((word, i) => (
                  <span className="w" key={`${word}-${i}`}>
                    {word}{" "}
                  </span>
                ))}
              </p>
              <div className="btns">
                <a className="pill line hv" href="#services">
                  <Roll>What I do</Roll>
                  <Icon name="arrow" />
                </a>
                <a className="pill line hv" href="Nabeel_Akram_CV.docx" download>
                  <Roll>Download CV</Roll>
                  <Icon name="down" />
                </a>
              </div>
              <div className="tags">
                <span className="tag">React.js</span>
                <span className="tag">WordPress</span>
                <span className="tag">Shopify</span>
                <span className="tag">WooCommerce</span>
                <span className="tag">PHP</span>
              </div>
            </div>
            <p className="about-note">
              2.5+ years of experience. Custom development, performance
              optimization and scalable architecture, with AI assisted tools to
              move faster.
            </p>
          </div>
          <div className="stats">
            <div className="stat">
              <span className="num" data-count="50" data-suffix="+">
                0
              </span>
              <span className="l">Websites delivered</span>
            </div>
            <div className="stat">
              <span className="num" data-count="2.5" data-dec="1" data-suffix="+">
                0
              </span>
              <span className="l">Years building</span>
            </div>
            <div className="stat">
              <span className="num" data-count="3" data-suffix="">
                0
              </span>
              <span className="l">Roles, one team lead</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
