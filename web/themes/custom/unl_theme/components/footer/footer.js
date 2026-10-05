(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // MAPA
    var mapBlock = document.querySelector('.site-footer__map-block');

    if (mapBlock) {
      var link = mapBlock.querySelector('a[href]');
      var img = mapBlock.querySelector('img');

      if (link && img) {
        var wrapper = document.createElement('a');
        wrapper.href = link.getAttribute('href');
        wrapper.target = '_blank';
        wrapper.rel = 'noopener';
        wrapper.className = 'site-footer__map-link';
        wrapper.setAttribute(
          'aria-label',
          link.textContent.trim() || 'Ver ubicación en Google Maps'
        );

        wrapper.appendChild(img.cloneNode(true));

        var overlay = document.createElement('span');
        overlay.className = 'site-footer__map-overlay';
        var pin = document.createElement('span');
        pin.className = 'site-footer__map-pin';
        overlay.appendChild(pin);
        wrapper.appendChild(overlay);

        mapBlock.innerHTML = '';
        mapBlock.appendChild(wrapper);
      }
    }
    // VIDEO DE FONDO
    var videoSource = document.querySelector('.site-footer__bg-video-source');

    if (videoSource) {
      var videoLink = videoSource.querySelector('a[href]');

      if (videoLink) {
        var videoUrl = videoLink.getAttribute('href');

        var video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('aria-hidden', 'true');

        var source = document.createElement('source');
        source.src = videoUrl;

        var extension = videoUrl.split('.').pop().toLowerCase().split('?')[0];
        var mimePorExtension = {
          mp4: 'video/mp4',
          webm: 'video/webm',
          ogv: 'video/ogg',
        };
        source.type = mimePorExtension[extension] || 'video/mp4';

        video.appendChild(source);

        videoSource.innerHTML = '';
        videoSource.appendChild(video);
      }
    }
        // LOGOS DE DEPENDENCIAS
    var logosBlock = document.querySelector('.site-footer__logos');

    if (logosBlock) {
      var imagenes = logosBlock.querySelectorAll('img');

      if (imagenes.length) {
        var ventana = document.createElement('div');
        ventana.className = 'site-footer__logos-ventana';
        var pista = document.createElement('ul');
        pista.className = 'site-footer__logos-pista';

        imagenes.forEach(function (img) {
          var item = document.createElement('li');
          item.className = 'site-footer__logos-item';
          var enlaceOriginal = img.closest('a');

          if (enlaceOriginal) {
            var enlace = document.createElement('a');
            enlace.href = enlaceOriginal.getAttribute('href');
            enlace.target = '_blank';
            enlace.rel = 'noopener';
            enlace.appendChild(img.cloneNode(true));
            item.appendChild(enlace);
          } else {
            item.appendChild(img.cloneNode(true));
          }
          pista.appendChild(item);
        });

        ventana.appendChild(pista);
        logosBlock.innerHTML = '';
        logosBlock.appendChild(ventana);

        iniciarCarruselLogos(logosBlock, pista);
      }
    }
  });
    function iniciarCarruselLogos(contenedor, pista) {
    var temporizador = null;
    var moviendo = false;
    var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function visibles() {
      return parseInt(getComputedStyle(contenedor).getPropertyValue('--logos-visibles'), 10) || 4;
    }

    function hayExceso() {
      return pista.children.length > visibles();
    }

    function avanzar() {
      if (moviendo) return;
      moviendo = true;
      var gap = parseFloat(getComputedStyle(pista).columnGap) || 0;
      var paso = pista.firstElementChild.getBoundingClientRect().width + gap;
      pista.style.transform = 'translateX(-' + paso + 'px)';
    }

    // El primer logo pasa al final y la fila vuelve a 0 sin que se note
    pista.addEventListener('transitionend', function (e) {
      if (e.target !== pista) return;
      pista.style.transition = 'none';
      pista.appendChild(pista.firstElementChild);
      pista.style.transform = 'translateX(0)';
      void pista.offsetWidth;
      pista.style.transition = '';
      moviendo = false;
    });

    function detener() {
      clearInterval(temporizador);
    }

    function arrancar() {
      detener();
      if (!reducido && hayExceso()) temporizador = setInterval(avanzar, 3000);
    }

    function actualizar() {
      contenedor.classList.toggle('site-footer__logos--carrusel', hayExceso());
      if (!hayExceso()) pista.style.transform = '';
      arrancar();
    }

    contenedor.addEventListener('mouseenter', detener);
    contenedor.addEventListener('mouseleave', arrancar);
    window.addEventListener('resize', actualizar);
    actualizar();
  }
})();