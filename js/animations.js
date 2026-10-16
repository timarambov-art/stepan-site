/* Промальп Серов — motion polish в духе Emil Kowalski.
   Scroll reveal на [data-animate], stagger, hero ready, count-up чисел,
   магнитный hover для .card--featured. Уважает prefers-reduced-motion. */
(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Scroll reveal ----------
  var nodes = document.querySelectorAll('[data-animate]');
  if (nodes.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('is-visible');
    } else {
      var groups = new Map();
      nodes.forEach(function (el) {
        var parent = el.closest('.grid, .hero__body, .hero__call, .btn-row, .cta-block, .steps, .footer__grid, .photo-bento, .services-bento, .stats, .gallery, .faq, .badges, .split') || el.parentNode;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(el);
      });
      groups.forEach(function (list) {
        list.forEach(function (el, idx) {
          var delay = Math.min(idx * 70, 420);
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
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 });

      nodes.forEach(function (n) { io.observe(n); });

      setTimeout(function () {
        nodes.forEach(function (n) {
          if (!n.classList.contains('is-visible')) n.classList.add('is-visible');
        });
      }, 1500);
    }
  }

  // ---------- Hero ready (bullets stagger) ----------
  var hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(function () {
      setTimeout(function () { hero.classList.add('is-ready'); }, 80);
    });
  }

  // ---------- Count-up чисел в .stat strong ----------
  if (!reduced && 'IntersectionObserver' in window) {
    var stats = document.querySelectorAll('.stat');
    if (stats.length) {
      var countIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var strong = el.querySelector('strong');
          if (!strong) { countIO.unobserve(el); return; }
          var raw = strong.textContent || '';
          var m = raw.match(/(\d+)/);
          if (!m) { el.classList.add('is-counted'); countIO.unobserve(el); return; }
          var target = parseInt(m[1], 10);
          if (target < 2) { el.classList.add('is-counted'); countIO.unobserve(el); return; }
          var suffix = strong.innerHTML.replace(/^\s*\d+/, '');
          var dur = 900, start = performance.now();
          function tick(now) {
            var p = Math.min(1, (now - start) / dur);
            var eased = 1 - Math.pow(1 - p, 3);
            var val = Math.round(target * eased);
            strong.innerHTML = val + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.classList.add('is-counted');
          }
          requestAnimationFrame(tick);
          countIO.unobserve(el);
        });
      }, { threshold: 0.5 });
      stats.forEach(function (s) { countIO.observe(s); });
    }
  }

  // ---------- Магнитный hover для .card--featured ----------
  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var mag = document.querySelectorAll('.card--featured');
    mag.forEach(function (el) {
      var rect = null;
      el.addEventListener('mouseenter', function () { rect = el.getBoundingClientRect(); });
      el.addEventListener('mousemove', function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        var y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        el.style.transform = 'translate(' + (x * 6).toFixed(2) + 'px, ' + (y * 6 - 4).toFixed(2) + 'px) scale(1.015)';
      });
      el.addEventListener('mouseleave', function () {
        rect = null;
        el.style.transform = '';
      });
    });
  }
})();
