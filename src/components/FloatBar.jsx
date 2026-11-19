import { MAIL } from "../data/content.js";
import { Icon } from "./Icon.jsx";
import { Roll } from "./Roll.jsx";

export function FloatBar() {
  return (
    <div className="float" id="float">
      <small>Convinced?</small>
      <a className="go hv" href={MAIL}>
        <Roll>Start a project</Roll>
      </a>
      <button type="button" id="toTop" aria-label="Back to top">
        <Icon name="up" />
      </button>
    </div>
  );
}
