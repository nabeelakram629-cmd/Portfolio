import { SKILLS } from "../data/content.js";
import { Reveal } from "./Reveal.jsx";

export function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="wrap split">
        <div className="sticky">
          <p className="eyebrow">Skills</p>
          <h2>The stack I use to ship.</h2>
        </div>
        <div>
          <div id="skillList">
            {SKILLS.map(([group, items], i) => (
              <Reveal className="skill" style={{ transitionDelay: `${i * 60}ms` }} key={group}>
                <h3>{group}</h3>
                <div className="tags">
                  {items.map((item) => (
                    <span className="tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
          <div className="edu">
            <Reveal>
              <h3>Education</h3>
              <div className="eitem">
                <p className="t">Bachelor of Science in Information Technology</p>
                <p className="s">University of Sahiwal</p>
                <p className="s">
                  <span className="num">Sep 2019 to Jun 2023</span> &nbsp;CGPA 3.20 out of
                  4.00
                </p>
              </div>
              <div className="eitem">
                <p className="t">Intermediate in Computer Science</p>
                <p className="s">Degree College, Mian Channu</p>
                <p className="s">
                  <span className="num">2016 to 2018</span> &nbsp;Computer Science,
                  Mathematics, Physics
                </p>
              </div>
            </Reveal>
            <Reveal style={{ transitionDelay: "100ms" }}>
              <h3>Achievements</h3>
              <div className="eitem">
                <p className="t">Team Lead Recognition</p>
                <p className="s">Awarded for outstanding leadership and project delivery.</p>
              </div>
              <div className="eitem">
                <p className="t">Consistent delivery</p>
                <p className="s">Met project deadlines and team targets.</p>
              </div>
              <div className="eitem">
                <p className="t">Languages</p>
                <p className="s">English and Urdu.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
