import { JOBS } from "../data/content.js";
import { Icon } from "./Icon.jsx";
import { Reveal } from "./Reveal.jsx";

export function Experience() {
  return (
    <section className="exp" id="experience">
      <div className="wrap split">
        <div className="sticky">
          <p className="eyebrow">Experience</p>
          <h2>From developer to team lead.</h2>
          <a className="link" href="Nabeel_Akram_CV.docx" download>
            <Icon name="down" />
            Download my CV
          </a>
        </div>
        <div id="jobs">
          {JOBS.map(([when, role, company, points], i) => (
            <Reveal
              as="article"
              className="job"
              style={{ transitionDelay: `${i * 80}ms` }}
              key={role + when}
            >
              <div>
                <span className="num">{when}</span>
              </div>
              <div>
                <h3>{role}</h3>
                <p className="co">{company}</p>
                <ul>
                  {points.map((point) => (
                    <li key={point}>
                      <Icon name="check" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
