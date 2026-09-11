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
    if (!nav || !nav.classList.contains('open')) return;
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('menu-open', open);
    });

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

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

    if (progressBar) progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (header) header.classList.toggle('is-stuck', y > 12);

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
  var navLinks = nav
    ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'))
    : [];

  // Observamos todas las secciones con id, no solo las que tienen entrada en el
  // menu: asi, al entrar en una seccion sin enlace propio, no se queda encendido
  // el enlace anterior.
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
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
     7. Lightbox — sin librerías
     Los disparadores llevan data-lb="<grupo>"; los grupos se declaran
     en la propia página con <template data-lb-set="<grupo>">.
     --------------------------------------------------------- */
  var lb = null, lbItems = [], lbIndex = 0, lbTrigger = null;

  function lbBuild() {
    lb = document.createElement('div');
    lb.className = 'lb';
    lb.id = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.hidden = true;
    lb.innerHTML =
      '<button class="lb-btn-close" type="button" data-i18n-attr="aria-label:lb.close">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button class="lb-nav lb-prev" type="button" data-i18n-attr="aria-label:lb.prev">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>' +
      '<button class="lb-nav lb-next" type="button" data-i18n-attr="aria-label:lb.next">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>' +
      '<figure class="lb-fig"><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(lb);

    lb.querySelector('.lb-btn-close').addEventListener('click', lbClose);
    lb.querySelector('.lb-prev').addEventListener('click', function () { lbGo(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { lbGo(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });
  }

  function lbPaint() {
    var it = lbItems[lbIndex];
    var img = lb.querySelector('img');
    var cap = lb.querySelector('figcaption');
    var texto = (window.I18N[currentLang] || {})[it.alt] || '';
    img.src = it.src;
    img.alt = texto;
    cap.textContent = lbItems.length > 1
      ? texto + '  ·  ' + (lbIndex + 1) + ' ' + ((window.I18N[currentLang] || {})['lb.of'] || '/') + ' ' + lbItems.length
      : texto;
    var solo = lbItems.length < 2;
    lb.querySelector('.lb-prev').hidden = solo;
    lb.querySelector('.lb-next').hidden = solo;
  }

  function lbGo(paso) {
    lbIndex = (lbIndex + paso + lbItems.length) % lbItems.length;
    lbPaint();
  }

  function lbOpen(items, indice, disparador) {
    if (!lb) lbBuild();
    lbItems = items;
    lbIndex = indice || 0;
    lbTrigger = disparador || null;
    lbPaint();
    lb.hidden = false;
    document.body.classList.add('lb-open');
    lb.querySelector('.lb-btn-close').focus();
  }

  function lbClose() {
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    lb.querySelector('img').removeAttribute('src');
    document.body.classList.remove('lb-open');
    if (lbTrigger) { lbTrigger.focus(); lbTrigger = null; }
  }

  // Lee los grupos declarados en la página
  var lbSets = {};
  document.querySelectorAll('template[data-lb-set]').forEach(function (t) {
    lbSets[t.getAttribute('data-lb-set')] = Array.prototype.map.call(
      t.content.querySelectorAll('i'),
      function (n) { return { src: n.getAttribute('data-src'), alt: n.getAttribute('data-alt') }; }
    );
  });

  document.querySelectorAll('[data-lb]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var set = lbSets[btn.getAttribute('data-lb')];
      if (!set || !set.length) return;
      var i = parseInt(btn.getAttribute('data-lb-i') || '0', 10);
      lbOpen(set, i, btn);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (!lb || lb.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); lbClose(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); lbGo(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); lbGo(1); }
    else if (e.key === 'Tab') {
      // el foco no sale del diálogo mientras está abierto
      var foco = Array.prototype.filter.call(
        lb.querySelectorAll('button'), function (b) { return !b.hidden; });
      var i = foco.indexOf(document.activeElement);
      e.preventDefault();
      foco[(i + (e.shiftKey ? -1 : 1) + foco.length) % foco.length].focus();
    }
  });

  /* ---------------------------------------------------------
     8. Boton de reproduccion sobre el video
     El <video> conserva sus controles nativos; el boton solo
     cubre el poster hasta que la reproduccion empieza.
     --------------------------------------------------------- */
  document.querySelectorAll('.video-wrap').forEach(function (caja) {
    var v = caja.querySelector('video');
    var btn = caja.querySelector('.video-play');
    if (!v || !btn) return;
    btn.addEventListener('click', function () {
      var p = v.play();
      if (p && p.catch) p.catch(function () { caja.classList.remove('is-playing'); });
    });
    v.addEventListener('play', function () { caja.classList.add('is-playing'); });
    v.addEventListener('ended', function () { caja.classList.remove('is-playing'); });
  });

  /* ---------------------------------------------------------
     9. Copiar al portapapeles
     Un enlace mailto no hace nada si el sistema no tiene
     aplicacion de correo. Copiar la direccion siempre funciona.
     --------------------------------------------------------- */
  document.querySelectorAll('[data-copiar]').forEach(function (b) {
    b.addEventListener('click', function () {
      var texto = b.getAttribute('data-copiar');

      function avisar() {
        b.classList.add('copiado');
        var etiqueta = (window.I18N[currentLang] || {})['contact.copiado'];
        if (etiqueta) b.setAttribute('aria-label', etiqueta);
        setTimeout(function () {
          b.classList.remove('copiado');
          var vuelve = (window.I18N[currentLang] || {})['contact.copiar'];
          if (vuelve) b.setAttribute('aria-label', vuelve);
        }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(avisar, aPelo);
      } else {
        aPelo();
      }

      function aPelo() {
        var t = document.createElement('textarea');
        t.value = texto;
        t.setAttribute('readonly', '');
        t.style.position = 'fixed';
        t.style.opacity = '0';
        document.body.appendChild(t);
        t.select();
        try { document.execCommand('copy'); avisar(); } catch (e) { /* nada que hacer */ }
        document.body.removeChild(t);
      }
    });
  });

  /* ---------------------------------------------------------
     7. Detalles finales
     --------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  setLang(detectLang());
  onScroll();
})();
