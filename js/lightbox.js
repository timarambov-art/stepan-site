/* Лайтбокс для .gallery figure img|video — клик открывает полноэкранное фото/видео.
   Навигация: стрелки влево/вправо на клавиатуре, кнопки на экране. Esc — закрыть. */
// Разворот/сворачивание галерей
(function () {
  document.querySelectorAll('.gallery-more .btn[data-expand]').forEach(function (btn) {
    var selector = btn.getAttribute('data-expand');
    var gal = document.querySelector(selector);
    if (!gal) return;
    var openLabel = btn.getAttribute('data-open-label') || btn.textContent.trim();
    var closeLabel = btn.getAttribute('data-close-label') || 'Свернуть';
    var labelSpan = btn.querySelector('.btn-label');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = !gal.classList.contains('is-collapsed');
      if (isOpen) {
        gal.classList.add('is-collapsed');
        btn.classList.remove('is-open');
        if (labelSpan) labelSpan.textContent = openLabel;
        // прокрутить к началу секции, чтобы пользователь не "потерялся"
        var sec = gal.closest('section');
        if (sec) {
          var y = sec.getBoundingClientRect().top + window.scrollY - 20;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      } else {
        gal.classList.remove('is-collapsed');
        btn.classList.add('is-open');
        if (labelSpan) labelSpan.textContent = closeLabel;
      }
    });
  });
})();

(function () {
  'use strict';

  var galleries = document.querySelectorAll('.gallery');
  if (!galleries.length) return;

  // Собираем все медиа со всех галерей
  var items = [];
  galleries.forEach(function (gal) {
    gal.querySelectorAll('figure img, figure video').forEach(function (el) {
      items.push(el);
    });
  });
  if (!items.length) return;

  // Разметка лайтбокса
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML =
    '<button class="lb-close" aria-label="Закрыть">' +
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button>' +
    '<button class="lb-prev" aria-label="Предыдущее">' +
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 6l-6 6 6 6"/></svg>' +
    '</button>' +
    '<figure class="lb-stage"><div class="lb-media"></div><figcaption class="lb-count"></figcaption></figure>' +
    '<button class="lb-next" aria-label="Следующее">' +
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6"/></svg>' +
    '</button>';
  document.body.appendChild(lb);

  var mediaBox = lb.querySelector('.lb-media');
  var countEl = lb.querySelector('.lb-count');
  var cur = 0;

  function clearMedia() {
    while (mediaBox.firstChild) {
      var child = mediaBox.firstChild;
      if (child.tagName === 'VIDEO') { try { child.pause(); } catch (e) {} }
      mediaBox.removeChild(child);
    }
  }

  function show(i) {
    cur = (i + items.length) % items.length;
    clearMedia();
    var el = items[cur];
    var isVideo = el.tagName === 'VIDEO';
    var src = el.currentSrc || el.src || el.querySelector('source')?.src;
    if (isVideo) {
      var v = document.createElement('video');
      v.src = src;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.className = 'lb-video';
      mediaBox.appendChild(v);
    } else {
      var img = document.createElement('img');
      img.src = src;
      img.alt = el.alt || '';
      img.className = 'lb-img';
      mediaBox.appendChild(img);
    }
    countEl.textContent = (cur + 1) + ' из ' + items.length;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    clearMedia();
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach(function (el, i) {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
    });
    // Для видео заблокируем стандартные клики по controls (их всё равно нет без атрибута)
    if (el.tagName === 'VIDEO') {
      el.removeAttribute('controls');
      el.setAttribute('preload', 'metadata');
      el.setAttribute('muted', '');
      el.setAttribute('playsinline', '');
    }
  });

  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lb-stage') || e.target.classList.contains('lb-media')) close();
  });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(cur - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(cur + 1); });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(cur - 1);
    else if (e.key === 'ArrowRight') show(cur + 1);
  });

  // Свайпы на мобиле
  var touchX = null;
  lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; });
  lb.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    touchX = null;
  });
})();
