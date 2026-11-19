import { TAGLINE, splitWords } from "../data/content.js";

export function Tagline() {
  const words = splitWords(TAGLINE);
  return (
    <section className="tagline" aria-label="Core promise">
      <div className="wrap">
        <p className="lit" id="tag">
          {words.map((word, i) => (
            <span className="w" key={`${word}-${i}`}>
              {word}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
