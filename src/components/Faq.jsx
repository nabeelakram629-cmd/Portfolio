import { useState } from "react";
import { FAQS } from "../data/content.js";
import { Icon } from "./Icon.jsx";
import { Reveal } from "./Reveal.jsx";

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="faq-sec" id="faq">
      <div className="wrap">
        <Reveal className="sec-head">
          <div>
            <p className="eyebrow" style={{ marginBottom: 18 }}>
              FAQ
            </p>
            <h2>Questions clients ask before they hire me.</h2>
          </div>
        </Reveal>
        <ul className="faq" id="faqList">
          {FAQS.map(([question, answer], i) => {
            const expanded = open === i;
            return (
              <li key={question}>
                <h3>
                  <button
                    className="q"
                    type="button"
                    id={`q${i}`}
                    aria-expanded={expanded}
                    aria-controls={`a${i}`}
                    onClick={() => setOpen(expanded ? -1 : i)}
                  >
                    <span>{question}</span>
                    <Icon name="plus" />
                  </button>
                </h3>
                <div
                  className="a"
                  id={`a${i}`}
                  role="region"
                  aria-labelledby={`q${i}`}
                  hidden={!expanded}
                >
                  <p>{answer}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
