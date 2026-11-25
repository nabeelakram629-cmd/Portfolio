import { NAV } from "../data/content.js";
import { Roll } from "./Roll.jsx";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <nav className="fnav" aria-label="Footer" id="fnav">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="fbar">
          <span>© 2026 Nabeel Akram</span>
          <span className="tag2">
            Designed with care in Lahore &nbsp;
            <span className="num" id="clock2" />
          </span>
          <a className="link hv" style={{ margin: 0, fontSize: 14 }} href="#top">
            <svg className="icon" style={{ width: 16, height: 16 }}>
              <use href="#i-up" />
            </svg>
            <Roll>Back to top</Roll>
          </a>
        </div>
      </div>
    </footer>
  );
}
