import { useLayoutEffect, useRef } from "react";

export function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useRef(null);
  const classes = className.split(/\s+/).includes("reveal")
    ? className
    : `${className} reveal`.trim();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      el.dataset.revealed === "1" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.classList.add("in");
      el.dataset.revealed = "1";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          entry.target.dataset.revealed = "1";
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  });

  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
}
