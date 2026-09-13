/* ==========================================================================
   Theme toggle — switches between the default dark theme and a light
   theme by setting data-theme="light" on <html>. All colors are CSS
   custom properties (see variables.css), so this single attribute
   change repaints every page with no per-component logic needed.

   The saved preference is applied by an inline script in <head> on
   every page, before this file loads, so there is no flash of the
   wrong theme on page load. This file only wires up the button click.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';

    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    try {
      localStorage.setItem('axa-theme', next);
    } catch (err) {
      // localStorage unavailable (private browsing, etc.) — theme still
      // applies for this page view, it just won't persist across pages.
    }

    toggle.setAttribute('aria-pressed', String(next === 'light'));
  });
});
