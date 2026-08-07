(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var mapBlock = document.querySelector('.site-footer__map-block');
    if (!mapBlock) {
      return;
    }

    var link = mapBlock.querySelector('a[href]');
    var img = mapBlock.querySelector('img');

    if (!link || !img) {
      return;
    }

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
  });
})();