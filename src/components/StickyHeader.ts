import { observe } from "./Inview";

// get the sticky element
const header = document.querySelector(".sticky-header");

const observerTop = new IntersectionObserver(
  () => {
    return header?.classList.toggle(
      "is-sticky",
      header.getBoundingClientRect().top < 10
    );
  },
  {
    rootMargin: "-1px 0px 0px 0px",
    threshold: [1],
  }
);

const observer = new IntersectionObserver(
  ([e]) => {
    const top = e?.intersectionRect.top;
    return header?.classList.toggle("is-sticky", (top ?? 0) < 10);
  },
  {
    rootMargin: "-1px 0px 0px 0px",
    threshold: [0.01, 1],
  }
);

if (header) {
  observer.observe(header);
}

export function observeTop(selector: string) {
  const el = document.querySelector(selector);
  return el && observerTop.observe(el);
}
