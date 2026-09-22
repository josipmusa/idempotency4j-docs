// The reveal language, shared by all three approaches: an element marked
// [data-reveal] arrives once when it enters. Siblings inside a [data-reveal-group]
// stagger by 60ms, capped at six, after which the rest arrive together.
//
// IntersectionObserver rather than ScrollTrigger: entrances are one-shot and do not
// need scroll position, and this keeps working when Lenis is off.

const STAGGER = 60;
const CAP = 6;

export function initReveal(): void {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

  if (still || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const kids = Array.from(group.querySelectorAll<HTMLElement>('[data-reveal]'));
    kids.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i, CAP) * STAGGER}ms`);
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
  );

  targets.forEach((el) => io.observe(el));
}
