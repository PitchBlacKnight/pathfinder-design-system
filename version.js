// Single source for the version labels. The Figma Cover (node 4:64) mirrors these values.
window.PF_VERSION = { product: '2.1', library: '1.8.1', date: '2026-10-06' };
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-pf-version]').forEach(function (el) {
    var v = window.PF_VERSION;
    el.textContent = 'Pathfinder ' + v.product + ' · Figma library ' + v.library + ' · ' + v.date;
  });
});
