export function Icon({ name }) {
  return (
    <svg className="icon">
      <use href={`#i-${name}`} />
    </svg>
  );
}
