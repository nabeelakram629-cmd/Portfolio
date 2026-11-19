import { useState } from "react";
import {
  FEATURED,
  FILTERS,
  WORK,
  shotUrl,
} from "../data/content.js";
import { Icon } from "./Icon.jsx";
import { Reveal } from "./Reveal.jsx";
import { Roll } from "./Roll.jsx";

const pad = (n) => String(n).padStart(2, "0");

export function Work() {
  const [filter, setFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const list = WORK.filter((item) => filter === "All" || item.cat === filter);
  const shown = showAll ? list : list.slice(0, 10);

  return (
    <section className="work" id="work">
      <div className="wrap">
        <Reveal className="work-head">
          <div>
            <p className="eyebrow" style={{ marginBottom: 18 }}>
              Selected work
            </p>
            <h2 id="workTitle">{WORK.length} live websites you can visit today</h2>
          </div>
          <p>
            WordPress, Shopify, custom PHP and React sites built for
            international clients. Open any of them to see the work first hand.
          </p>
        </Reveal>
        <div className="feat" id="feat">
          {FEATURED.map((domain, i) => {
            const item = WORK.find((entry) => entry.domain === domain);
            return (
              <Reveal
                as="a"
                className="card"
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${item.domain} (opens in a new tab)`}
                key={domain}
              >
                <div className="top">
                  <span>{item.cat}</span>
                  <Icon name="ne" />
                </div>
                <div className="shot">
                  <div className="ph">
                    <div>
                      <b>{item.domain[0].toUpperCase()}</b>
                      {item.domain}
                    </div>
                  </div>
                  <img
                    src={shotUrl(item.url)}
                    alt={`Screenshot of ${item.domain}`}
                    loading="lazy"
                    width="800"
                    height="600"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <h3>{item.domain}</h3>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="idx-head">
          <h3>All projects</h3>
          <div className="filters" id="filters" role="tablist" aria-label="Filter projects">
            {FILTERS.map((name) => {
              const count =
                name === "All" ? WORK.length : WORK.filter((item) => item.cat === name).length;
              const on = name === filter;
              return (
                <button
                  key={name}
                  className={`fchip${on ? " on" : ""}`}
                  role="tab"
                  aria-selected={on}
                  data-f={name}
                  onClick={() => {
                    setFilter(name);
                    setShowAll(false);
                  }}
                >
                  {name}
                  <span className="num">{count}</span>
                </button>
              );
            })}
          </div>
        </Reveal>
        <ul className="idx" id="idx">
          {shown.map((item, i) => (
            <li key={item.domain}>
              <a
                className="row"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                data-url={item.url}
                aria-label={`Visit ${item.domain} (opens in a new tab)`}
              >
                <span className="num">{pad(i + 1)}</span>
                <span className="t">{item.domain}</span>
                <span className="c">{item.cat}</span>
                <span className="go">
                  <Icon name="ne" />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className="more" id="more">
          {!showAll && list.length > 10 ? (
            <button className="pill ghost hv" id="showAll" type="button" onClick={() => setShowAll(true)}>
              <Roll>{`Show all ${list.length} sites`}</Roll>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
