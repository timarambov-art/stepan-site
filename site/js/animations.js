/* Промальп Серов — scroll reveal на [data-animate] через IntersectionObserver.
   Уважает prefers-reduced-motion. Срабатывает один раз. Со staggered-задержкой
   у соседей в одном контейнере. */
(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nodes = document.querySelectorAll('[data-animate]');
  if (!nodes.length) return;

  if (reduced || !('IntersectionObserver' in window)) {
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('is-visible');
    return;
  }

  // Групповой stagger: индекс внутри ближайшего общего контейнера-"сетки".
  var groups = new Map();
  nodes.forEach(function (el) {
    var parent = el.closest('.grid, .hero__body, .hero__call, .btn-row, .cta-block, .steps, .footer__grid') || el.parentNode;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach(function (list) {
    list.forEach(function (el, idx) {
      var delay = Math.min(idx * 60, 360);
      el.style.transitionDelay = delay + 'ms';
    });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  nodes.forEach(function (n) { io.observe(n); });
})();
