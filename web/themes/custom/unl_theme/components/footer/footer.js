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

    // VIDEO O IMAGEN DE FONDO DEL FOOTER
    var mediaSource = document.querySelector('.site-footer__bg-video-source');

    if (mediaSource) {
      var mediaLink = mediaSource.querySelector('a[href]');

      if (mediaLink) {
        var mediaUrl = mediaLink.getAttribute('href');
        var extension = mediaUrl.split('.').pop().toLowerCase().split('?')[0];

        var extensionesVideo = ['mp4', 'webm', 'ogv'];
        var extensionesImagen = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

        if (extensionesVideo.indexOf(extension) !== -1) {
          var video = document.createElement('video');
          video.autoplay = true;
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.setAttribute('aria-hidden', 'true');

          var source = document.createElement('source');
          source.src = mediaUrl;

          var mimePorExtension = {
            mp4: 'video/mp4',
            webm: 'video/webm',
            ogv: 'video/ogg',
          };
          source.type = mimePorExtension[extension] || 'video/mp4';

          video.appendChild(source);

          mediaSource.innerHTML = '';
          mediaSource.appendChild(video);

        } else if (extensionesImagen.indexOf(extension) !== -1) {
          var mediaImg = document.createElement('img');
          mediaImg.src = mediaUrl;
          mediaImg.setAttribute('aria-hidden', 'true');
          mediaImg.alt = '';

          mediaSource.innerHTML = '';
          mediaSource.appendChild(mediaImg);
        }
      }
    }
  });
})();