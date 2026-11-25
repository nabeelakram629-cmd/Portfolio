export function Peek() {
  return (
    <div className="peek" id="peek" aria-hidden="true">
      <img alt="" width="800" height="600" decoding="async" />
      <span className="peek-line" hidden>
        <i />
      </span>
      <span className="peek-name" hidden />
    </div>
  );
}
