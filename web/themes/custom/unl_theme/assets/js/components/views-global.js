(function (Drupal) {
  'use strict';

  Drupal.behaviors.sliderConveniosAutoplay = {
    attach: function (context, settings) {
      const tracks = context.querySelectorAll('.slider-unl .item-list ul');
      
      tracks.forEach(track => {
        if (track.hasAttribute('data-slider-procesado')) return;
        track.setAttribute('data-slider-procesado', 'true');

        let intervalo;
        const tiempoEspera = 2500; // 2 segundos
        
        const moverSlider = () => {
          const tarjeta = track.querySelector('li');
          if (!tarjeta) return;
          
          const desplazamiento = tarjeta.offsetWidth + 40; 
          
          if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            track.scrollBy({ left: desplazamiento, behavior: 'smooth' });
          }
        };

        intervalo = setInterval(moverSlider, tiempoEspera);

        track.addEventListener('mouseenter', () => clearInterval(intervalo));
        track.addEventListener('mouseleave', () => intervalo = setInterval(moverSlider, tiempoEspera));
        track.addEventListener('touchstart', () => clearInterval(intervalo), { passive: true });
        track.addEventListener('touchend', () => intervalo = setInterval(moverSlider, tiempoEspera), { passive: true });
      });
    }
  };
})(Drupal);