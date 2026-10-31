import { SITE } from './config';

/**
 * When embedded in an iframe, report the page height to the parent so it can resize the frame.
 * Messages go only to the configured parent origin (SITE.embedParentOrigin); nothing is sent otherwise.
 */
export function setupEmbedResize(): void {
  const target = SITE.embedParentOrigin;
  if (!target || window.parent === window) return;
  let last = 0;
  const send = () => {
    const height = Math.ceil(document.documentElement.scrollHeight);
    if (height === last) return;
    last = height;
    window.parent.postMessage({ type: 'emt-sales:height', height }, target);
  };
  new ResizeObserver(send).observe(document.documentElement);
  window.addEventListener('load', send);
  send();
}
