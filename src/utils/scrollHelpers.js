const HEADER_OFFSET = 100; // matches the CSS scroll-margin

export function scrollToElement(element) {
  if (!element) return;
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - HEADER_OFFSET;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}

export function scrollToSelector(selector) {
  const el = document.querySelector(selector);
  if (el) scrollToElement(el);
}