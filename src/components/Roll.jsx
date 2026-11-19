export function Roll({ children }) {
  return (
    <span className="roll" data-r="1">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
