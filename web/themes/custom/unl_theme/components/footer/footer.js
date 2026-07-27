(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var mapFrame = document.querySelector('.site-footer__map-frame');
    if (!mapFrame || !mapFrame.dataset.src) {
      return;
    }

    var loadMap = function () {
      if (mapFrame.src) {
        return; // ya cargado
      }
      mapFrame.src = mapFrame.dataset.src;
    };

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            loadMap();
            observer.disconnect();
          }
        });
      }, { rootMargin: '200px' });

      observer.observe(mapFrame);
    } else {
      // Fallback para navegadores sin soporte: cargar tras el evento load
      window.addEventListener('load', loadMap);
    }
  });
})();