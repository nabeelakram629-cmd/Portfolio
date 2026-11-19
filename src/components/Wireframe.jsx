export function Wireframe({ domain }) {
  return (
    <div className="wf" aria-hidden="true">
      <i className="w-nav" />
      <b className="w-t">{domain.split(".")[0]}</b>
      <i className="w-s" />
      <i className="w-s2" />
      <i className="w-b" />
      <i className="w-h" />
      <i className="w-c1" />
      <i className="w-c2" />
      <i className="w-c3" />
      <i className="w-r1" />
      <i className="w-r2" />
      <i className="w-big" />
      <i className="w-g1" />
      <i className="w-g2" />
      <i className="w-g3" />
      <i className="w-g4" />
      <i className="w-foot" />
    </div>
  );
}
