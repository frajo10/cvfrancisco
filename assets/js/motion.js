/* =========================================================
   MOVIMIENTO
   Sin librerías. Todo se apaga solo si el sistema pide
   menos movimiento o si el dispositivo no tiene puntero fino.

   1. Escena del hero (profundidad + campo animado)
   2. Inclinación 3D de tarjetas y paneles
   3. Cifras que cuentan al aparecer
   4. Barras y gráficos que se dibujan
   5. Transición entre páginas
   ========================================================= */
(function () {
  'use strict';

  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var anchoAmplio = window.matchMedia('(min-width: 861px)').matches;

  function suave(t) { return 1 - Math.pow(1 - t, 3); }

  /* ---------------------------------------------------------
     1. Escena del hero
     Un campo de puntos a la deriva, muy tenue, que se acerca
     al cursor. Se detiene cuando el hero sale de pantalla o
     la pestaña pasa a segundo plano.
     --------------------------------------------------------- */
  function escenaHero() {
    var hero = document.querySelector('.hero');
    if (!hero || quieto) return;

    var lienzo = document.createElement('canvas');
    lienzo.className = 'hero-canvas';
    lienzo.setAttribute('aria-hidden', 'true');
    hero.insertBefore(lienzo, hero.firstChild);

    var ctx = lienzo.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var an = 0, al = 0, puntos = [], corriendo = false, visible = true, rafId = null;
    var raton = { x: -9999, y: -9999 };

    function medir() {
      var c = hero.getBoundingClientRect();
      an = c.width; al = c.height;
      lienzo.width = Math.round(an * dpr);
      lienzo.height = Math.round(al * dpr);
      lienzo.style.width = an + 'px';
      lienzo.style.height = al + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function sembrar() {
      // densidad moderada: la escena debe respirar, no llenarse
      var n = Math.round(Math.min(130, Math.max(48, (an * al) / 13000)));
      puntos = [];
      for (var i = 0; i < n; i++) {
        puntos.push({
          x: Math.random() * an,
          y: Math.random() * al,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          r: Math.random() * 1.6 + 0.7,
          a: Math.random() * 0.42 + 0.18
        });
      }
    }

    function pintar() {
      ctx.clearRect(0, 0, an, al);

      // halo que acompaña al cursor
      if (raton.x > -9000) {
        var halo = ctx.createRadialGradient(raton.x, raton.y, 0, raton.x, raton.y, 260);
        halo.addColorStop(0, 'rgba(255,198,51,.09)');
        halo.addColorStop(1, 'rgba(255,198,51,0)');
        ctx.fillStyle = halo;
        ctx.fillRect(raton.x - 260, raton.y - 260, 520, 520);
      }

      for (var i = 0; i < puntos.length; i++) {
        var p = puntos[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = an + 20; else if (p.x > an + 20) p.x = -20;
        if (p.y < -20) p.y = al + 20; else if (p.y > al + 20) p.y = -20;

        // los puntos cercanos al cursor se encienden
        var dx = p.x - raton.x, dy = p.y - raton.y;
        var d2 = dx * dx + dy * dy;
        var cerca = d2 < 42000 ? 1 - d2 / 42000 : 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + cerca * 1.4, 0, 6.2832);
        ctx.fillStyle = 'rgba(255,198,51,' + (p.a + cerca * 0.5).toFixed(3) + ')';
        ctx.fill();

        // hilos solo entre vecinos, y solo cerca del cursor
        if (cerca > 0.08) {
          for (var j = i + 1; j < puntos.length; j++) {
            var q = puntos[j];
            var ex = p.x - q.x, ey = p.y - q.y;
            var e2 = ex * ex + ey * ey;
            if (e2 < 19000) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = 'rgba(255,198,51,' + (cerca * (1 - e2 / 19000) * 0.3).toFixed(3) + ')';
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        }
      }
      rafId = requestAnimationFrame(pintar);
    }

    function arrancar() {
      if (corriendo || !visible) return;
      corriendo = true;
      rafId = requestAnimationFrame(pintar);
    }
    function parar() {
      corriendo = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    medir(); sembrar(); arrancar();

    var remedir;
    window.addEventListener('resize', function () {
      clearTimeout(remedir);
      remedir = setTimeout(function () { medir(); sembrar(); }, 180);
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        visible = e[0].isIntersecting;
        if (visible) arrancar(); else parar();
      }, { threshold: 0 }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) parar(); else arrancar();
    });

    if (punteroFino) {
      hero.addEventListener('pointermove', function (e) {
        var c = hero.getBoundingClientRect();
        raton.x = e.clientX - c.left;
        raton.y = e.clientY - c.top;
      });
      hero.addEventListener('pointerleave', function () {
        raton.x = -9999; raton.y = -9999;
      });
    }
  }

  /* ---------------------------------------------------------
     Profundidad del hero: cada capa se desplaza a distinta
     velocidad segun donde este el cursor.
     --------------------------------------------------------- */
  function profundidadHero() {
    var hero = document.querySelector('.hero');
    if (!hero || quieto || !punteroFino || !anchoAmplio) return;

    var objetivoX = 0, objetivoY = 0, actualX = 0, actualY = 0, animando = false;

    function paso() {
      actualX += (objetivoX - actualX) * 0.07;
      actualY += (objetivoY - actualY) * 0.07;
      hero.style.setProperty('--mx', actualX.toFixed(4));
      hero.style.setProperty('--my', actualY.toFixed(4));
      if (Math.abs(objetivoX - actualX) > 0.0005 || Math.abs(objetivoY - actualY) > 0.0005) {
        requestAnimationFrame(paso);
      } else {
        animando = false;
      }
    }

    hero.addEventListener('pointermove', function (e) {
      var c = hero.getBoundingClientRect();
      objetivoX = (e.clientX - c.left) / c.width - 0.5;
      objetivoY = (e.clientY - c.top) / c.height - 0.5;
      if (!animando) { animando = true; requestAnimationFrame(paso); }
    });
    hero.addEventListener('pointerleave', function () {
      objetivoX = 0; objetivoY = 0;
      if (!animando) { animando = true; requestAnimationFrame(paso); }
    });
    hero.classList.add('hero--vivo');
  }

  /* ---------------------------------------------------------
     2. Inclinacion 3D
     El elemento gira unos pocos grados siguiendo al cursor.
     Solo con raton: en tactil no aporta y estorba.
     --------------------------------------------------------- */
  function inclinacion() {
    if (quieto || !punteroFino) return;
    var piezas = document.querySelectorAll('[data-tilt]');
    if (!piezas.length) return;

    piezas.forEach(function (el) {
      var maximo = parseFloat(el.getAttribute('data-tilt')) || 6;
      var pendiente = null;

      function aplicar(e) {
        var c = el.getBoundingClientRect();
        var px = (e.clientX - c.left) / c.width - 0.5;
        var py = (e.clientY - c.top) / c.height - 0.5;
        if (pendiente) cancelAnimationFrame(pendiente);
        pendiente = requestAnimationFrame(function () {
          el.style.setProperty('--rx', (-py * maximo).toFixed(2) + 'deg');
          el.style.setProperty('--ry', (px * maximo).toFixed(2) + 'deg');
          el.style.setProperty('--gx', ((px + 0.5) * 100).toFixed(1) + '%');
          el.style.setProperty('--gy', ((py + 0.5) * 100).toFixed(1) + '%');
        });
      }

      el.addEventListener('pointerenter', function () { el.classList.add('tilt-on'); });
      el.addEventListener('pointermove', aplicar);
      el.addEventListener('pointerleave', function () {
        el.classList.remove('tilt-on');
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------------------------------------------------------
     3. Cifras que cuentan
     Se anima el numero que ya esta escrito, sea cual sea el
     idioma: se respetan el prefijo, el sufijo y el separador.
     --------------------------------------------------------- */
  function separadorDecimal() {
    return (document.documentElement.lang || 'es') === 'en' ? '.' : ',';
  }
  function separadorMiles() {
    return separadorDecimal() === ',' ? '.' : ',';
  }

  function leerCifra(texto) {
    var m = texto.match(/^([^\d]*)([\d., \s]*\d)(.*)$/);
    if (!m) return null;
    var dec = separadorDecimal(), mil = separadorMiles();
    var crudo = m[2].replace(/[\s ]/g, '');
    var partes = crudo.split(dec);
    var decimales = partes.length > 1 ? partes[partes.length - 1].length : 0;
    var limpio = crudo.split(mil).join('').split(dec).join('.');
    var valor = parseFloat(limpio);
    if (isNaN(valor)) return null;
    return { antes: m[1], valor: valor, decimales: decimales, despues: m[3] };
  }

  function escribirCifra(el, dato, valor) {
    var lang = document.documentElement.lang || 'es';
    var mapa = { es: 'es-ES', pt: 'pt-PT', en: 'en-US' };
    var n = valor.toLocaleString(mapa[lang] || 'es-ES', {
      minimumFractionDigits: dato.decimales,
      maximumFractionDigits: dato.decimales
    });
    el.textContent = dato.antes + n + dato.despues;
  }

  function contar(el) {
    if (el.dataset.contando === '1' || el.dataset.contado === '1') return;
    var dato = leerCifra(el.textContent.trim());
    if (!dato) return;
    if (quieto) { el.dataset.contado = '1'; return; }

    el.dataset.contando = '1';
    var inicio = null, duracion = 1400;

    function paso(ts) {
      if (inicio === null) inicio = ts;
      var p = Math.min((ts - inicio) / duracion, 1);
      escribirCifra(el, dato, dato.valor * suave(p));
      if (p < 1) {
        requestAnimationFrame(paso);
      } else {
        escribirCifra(el, dato, dato.valor);
        el.dataset.contando = '0';
        el.dataset.contado = '1';
      }
    }
    requestAnimationFrame(paso);
  }

  function cifras() {
    // las de la portada ya las anima main.js con data-count
    var piezas = document.querySelectorAll('.case-kpi b, [data-contar]');
    if (!piezas.length) return;

    if (!('IntersectionObserver' in window) || quieto) {
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        contar(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    piezas.forEach(function (el) { obs.observe(el); });
  }

  /* ---------------------------------------------------------
     4. Barras que se dibujan
     Cualquier elemento con data-barra="0-100" crece hasta ese
     porcentaje la primera vez que entra en pantalla.
     --------------------------------------------------------- */
  function barras() {
    var piezas = document.querySelectorAll('[data-barra]');
    if (!piezas.length) return;

    function dibujar(el) {
      var pct = parseFloat(el.getAttribute('data-barra')) || 0;
      el.style.setProperty('--barra', pct + '%');
      el.classList.add('barra-lista');
    }

    if (quieto || !('IntersectionObserver' in window)) {
      piezas.forEach(dibujar);
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var retardo = parseInt(el.getAttribute('data-barra-d') || '0', 10);
        setTimeout(function () { dibujar(el); }, retardo);
        obs.unobserve(el);
      });
    }, { threshold: 0.25 });
    piezas.forEach(function (el) { obs.observe(el); });
  }

  /* ---------------------------------------------------------
     5. Transicion entre paginas
     Usa la API nativa del navegador. Donde no exista, la
     navegacion es la de siempre.
     --------------------------------------------------------- */
  function transicionEntrePaginas() {
    if (quieto || !document.startViewTransition) return;

    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      var destino;
      try { destino = new URL(a.href, location.href); } catch (err) { return; }
      if (destino.origin !== location.origin) return;
      if (!/\.html?$/.test(destino.pathname) && destino.pathname !== '/') return;
      if (destino.pathname === location.pathname) return;   // anclas de la misma pagina

      e.preventDefault();
      document.startViewTransition(function () {
        location.href = destino.href;
      });
    });
  }

  /* --------------------------------------------------------- */
  function iniciar() {
    escenaHero();
    profundidadHero();
    inclinacion();
    cifras();
    barras();
    transicionEntrePaginas();
    document.documentElement.classList.add('motion-lista');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
