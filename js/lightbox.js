/* Простой лайтбокс для .gallery figure img — клик открывает полноэкранное фото.
   Навигация: стрелки влево/вправо на клавиатуре, кнопки на экране. Esc — закрыть. */
(function () {
  'use strict';

  var galleries = document.querySelectorAll('.gallery');
  if (!galleries.length) return;

  // Собираем все фото со всех галерей на странице в один список
  var items = [];
  galleries.forEach(function (gal) {
    gal.querySelectorAll('figure img').forEach(function (img) {
      items.push(img);
    });
  });
  if (!items.length) return;

  // Создаём разметку лайтбокса один раз
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
    '<figure class="lb-stage"><img class="lb-img" alt=""><figcaption class="lb-count"></figcaption></figure>' +
    '<button class="lb-next" aria-label="Следующее">' +
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6"/></svg>' +
    '</button>';
  document.body.appendChild(lb);

  var imgEl = lb.querySelector('.lb-img');
  var countEl = lb.querySelector('.lb-count');
  var cur = 0;

  function show(i) {
    cur = (i + items.length) % items.length;
    imgEl.src = items[cur].src;
    imgEl.alt = items[cur].alt || '';
    countEl.textContent = (cur + 1) + ' из ' + items.length;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach(function (img, i) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
    });
  });

  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lb-stage')) close();
  });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(cur - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(cur + 1); });

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
