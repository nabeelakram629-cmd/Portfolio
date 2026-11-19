import { MAIL } from "../data/content.js";
import { Icon } from "./Icon.jsx";
import { Roll } from "./Roll.jsx";

export function Contact() {
  return (
    <section className="cta" id="contact">
      <div className="cta-blue" aria-hidden="true" />
      <div className="wrap">
        <p className="eyebrow" data-rise="">
          Contact
        </p>
        <h2 data-rise="">Tell me about your project.</h2>
        <p className="lead" data-rise="">
          Send a short brief and I will reply with next steps and an honest view
          of scope. Replying costs you nothing and commits you to nothing.
        </p>
        <a className="mail" data-rise="" href={MAIL}>
          nabeelakram629@gmail.com
        </a>
        <div className="btns" data-rise="">
          <a className="pill light big hv" href={MAIL}>
            <Roll>Start a project</Roll>
            <span className="arr">
              <Icon name="arrow" />
            </span>
          </a>
        </div>
        <div className="clist" data-rise="">
          <a className="crow" href="tel:+923099956484">
            <Icon name="phone" />
            +92 309 9956484
          </a>
          <span className="crow">
            <Icon name="pin" />
            Lahore, Pakistan
          </span>
          <a className="crow" href="Nabeel_Akram_CV.docx" download>
            <Icon name="down" />
            Download CV
          </a>
        </div>
      </div>
      <div className="marq" id="marq" data-rise="" aria-hidden="true">
        <div className="marq-track" />
      </div>
    </section>
  );
}
