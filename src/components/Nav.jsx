import { MAIL, NAV, pad } from "../data/content.js";
import { Icon } from "./Icon.jsx";
import { Roll } from "./Roll.jsx";

export function Nav() {
  return (
    <>
      <header className="nav-wrap" id="nav">
        <a href="#top" className="brand" aria-label="Nabeel Akram, back to top">
          <span className="mark">NA</span>
          <span>
            <b>Nabeel Akram</b>
            <small>Full stack developer</small>
          </span>
        </a>
        <div className="navr">
          <a className="pill dark hv hide-sm" href={MAIL}>
            <Roll>Start a project</Roll>
          </a>
          <button className="bp hide-sm" id="bp" type="button" aria-pressed="false">
            Blueprint mode<span className="sw" />
          </button>
          <button
            className="menu-btn"
            id="toggle"
            type="button"
            aria-expanded="false"
            aria-controls="menu"
          >
            <span id="menuLbl">Menu</span>
            <span className="bars" id="bars">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>
      <div className="menu" id="menu" aria-hidden="true">
        <ul id="menuList">
          {NAV.map(([id, label], i) => (
            <li key={id} style={{ transitionDelay: `${Math.min(i * 60, 400)}ms` }}>
              <a className="ml" href={`#${id}`} tabIndex={-1}>
                <span className="num">{pad(i + 1)}</span>
                {label}
              </a>
            </li>
          ))}
          <li style={{ transitionDelay: "450ms", marginTop: 24 }}>
            <a className="pill light big hv" href={MAIL} tabIndex={-1}>
              <Roll>Start a project</Roll>
              <span className="arr">
                <Icon name="arrow" />
              </span>
            </a>
          </li>
        </ul>
        <p className="mfoot">
          nabeelakram629@gmail.com &nbsp;·&nbsp; Lahore, Pakistan
        </p>
      </div>
    </>
  );
}
