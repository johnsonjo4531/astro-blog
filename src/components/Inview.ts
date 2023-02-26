export const observe = <E extends Element>(
  el: E,
  onIntersection: IntersectionObserverCallback,
  init: IntersectionObserverInit = {}
) => {
  const observer = new IntersectionObserver(onIntersection, {
    rootMargin: "-1px 0px 0px 0px",
    threshold: [0, 1],
    ...init,
  });
  return observer.observe(el);
};
