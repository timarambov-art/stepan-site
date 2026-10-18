/* Модалка-overlay для подстраниц.
   При клике по ссылкам на внутренние страницы — открываем их в overlay с iframe.
   Прямая загрузка (поиск, закладка, ссылка извне) работает как обычная страница. */
(function () {
  'use strict';

  // Включаем режим внутри iframe: скрываем хедер и футер
  try {
    if (window.self !== window.top) {
      document.documentElement.classList.add('in-modal');
      document.addEventListener('DOMContentLoaded', function () {
        document.body.classList.add('in-modal');
      });
    }
  } catch (e) { /* cross-origin */ }

  // Страницы, которые открываются в overlay. Сайт многостраничный: все ссылки
  // ведут на реальные страницы (работают «назад», адрес в строке, шаринг),
  // поэтому список пуст и overlay не создаётся.
  // Чтобы снова включить overlay для страницы — добавьте её имя, например 'portfolio.html'.
  var MODAL_PAGES = [];

  function isModalPage(href) {
    if (!href) return false;
    if (href.startsWith('#')) return false;
    if (href.startsWith('http://') || href.startsWith('https://')) return false;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    // убираем якорь и query
    var clean = href.split('#')[0].split('?')[0];
    return MODAL_PAGES.indexOf(clean) !== -1;
  }

  // Внутри iframe модалку не создаём
  var inIframe = false;
  try { inIframe = window.self !== window.top; } catch (e) { inIframe = true; }
  if (inIframe) return;
  if (!MODAL_PAGES.length) return;

  function init() {
    var modal = document.createElement('div');
    modal.className = 'page-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML =
      '<button class="page-modal__close" aria-label="Закрыть">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>' +
      '<iframe class="page-modal__frame" title="Страница" src="about:blank"></iframe>';
    document.body.appendChild(modal);

    var iframe = modal.querySelector('.page-modal__frame');
    var closeBtn = modal.querySelector('.page-modal__close');

    function open(url) {
      iframe.src = url;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      // очистить iframe чуть позже, чтобы не мигало
      setTimeout(function () { iframe.src = 'about:blank'; }, 220);
    }

    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    // Делегирование — работает и для ссылок, появляющихся позже
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      // не перехватывать клики с модификаторами (Ctrl/Cmd/middle)
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button === 1) return;
      var href = a.getAttribute('href');
      if (!isModalPage(href)) return;
      e.preventDefault();
      open(href);
    });

    // Экспонируем API на случай ручного открытия
    window.openPageModal = open;
    window.closePageModal = close;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
