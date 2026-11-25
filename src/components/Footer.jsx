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
          <a
            className="flink"
            href="https://www.linkedin.com/in/nabeel-akram-6b21921aa/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M4.7 3.3a2.2 2.2 0 1 0 .1 4.4 2.2 2.2 0 0 0-.1-4.4zM3 8.8h3.4V21H3V8.8zM9.3 8.8h3.3v1.7h.1c.5-.9 1.6-1.9 3.3-1.9 3.5 0 4.2 2.3 4.2 5.3V21h-3.4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9.3V8.8z"
              />
            </svg>
            LinkedIn
          </a>
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
