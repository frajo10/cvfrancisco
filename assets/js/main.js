/* =========================================================
   Francisco Sarria — Portfolio
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. Idioma
     --------------------------------------------------------- */
  var LOCALES = { pt: 'pt-PT', es: 'es-ES', en: 'en-US' };
  var STORAGE_KEY = 'fs-lang';
  var currentLang = 'es';

  function detectLang() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved && window.I18N[saved]) return saved;

    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    nav = nav.toLowerCase();
    if (nav.indexOf('pt') === 0) return 'pt';
    if (nav.indexOf('es') === 0) return 'es';
    return 'en';
  }

  function setLang(lang) {
    var dict = window.I18N[lang];
    if (!dict) return;
    currentLang = lang;

    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (v != null) el.textContent = v;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n-html')];
      if (v != null) el.innerHTML = v;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length < 2) return;
        var v = dict[parts[1].trim()];
        if (v != null) el.setAttribute(parts[0].trim(), v);
      });
    });

    document.querySelectorAll('.lang button').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    renderCounters();
  }

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      setLang(b.getAttribute('data-lang'));
      closeMenu();
    });
  });

  /* ---------------------------------------------------------
     2. Contadores animados
     --------------------------------------------------------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('.num'));

  function format(value, decimals) {
    return value.toLocaleString(LOCALES[currentLang] || 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function suffixFor(el) {
    var s = el.getAttribute('data-suffix') || '';
    return currentLang === 'en' ? s.replace(/^\s+/, '') : s;
  }

  function paint(el, value) {
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    el.textContent = format(value, decimals) + suffixFor(el);
  }

  function renderCounters() {
    counters.forEach(function (el) {
      if (el.dataset.done === '1') paint(el, parseFloat(el.getAttribute('data-count')));
    });
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;

    if (reduceMotion) {
      el.dataset.done = '1';
      paint(el, target);
      return;
    }

    var duration = 1500;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      paint(el, target * eased);
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.dataset.done = '1';
        paint(el, target);
      }
    }
    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------
     3. Reveal al hacer scroll
     --------------------------------------------------------- */
  var revealables = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);

        var num = entry.target.querySelector('.num');
        if (num && num.dataset.done !== '1') runCounter(num);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });

    // Red de seguridad: si el observer no llega a dispararse (pestaña en segundo
    // plano, navegador raro), no dejamos nada invisible.
    setTimeout(function () {
      revealables.forEach(function (el) {
        if (el.classList.contains('in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add('in');
          var n = el.querySelector('.num');
          if (n && n.dataset.done !== '1') runCounter(n);
        }
      });
    }, 1400);
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
    counters.forEach(runCounter);
  }

  /* ---------------------------------------------------------
     4. Menú móvil
     --------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeMenu() {
    if (!nav.classList.contains('open')) return;
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('menu-open', open);
  });

  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------------------------------------------------------
     5. Scroll: barra de progreso, header y parallax
     --------------------------------------------------------- */
  var header = document.getElementById('header');
  var progressBar = document.querySelector('#progress span');
  var heroBg = document.getElementById('heroBg');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    header.classList.toggle('is-stuck', y > 12);

    // Arriba del todo estamos en el hero: ningún enlace debe quedar marcado.
    if (y < 240) {
      navLinks.forEach(function (a) { a.classList.remove('active'); });
    }

    if (heroBg && !reduceMotion && y < window.innerHeight * 1.4) {
      heroBg.style.transform = 'translate3d(0,' + (y * 0.14).toFixed(1) + 'px,0)';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  /* ---------------------------------------------------------
     6. Enlace activo en la navegación
     --------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------------------------------------------------------
     7. Detalles finales
     --------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  setLang(detectLang());
  onScroll();
})();
