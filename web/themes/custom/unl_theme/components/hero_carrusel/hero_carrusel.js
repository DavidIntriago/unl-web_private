(function (Drupal, once) {
  Drupal.behaviors.heroCarrusel = {
    attach: function (context, settings) {
      
      const carruseles = once('hero-carrusel-init', '.hero-carrusel-contenedor', context);
      
      carruseles.forEach(carrusel => {
        const slides = carrusel.querySelectorAll('.slide-item');
        
        if (slides.length <= 1) {
          if (slides.length === 1) slides[0].classList.add('active');
          const controles = carrusel.querySelector('.carrusel-controles');
          if (controles) controles.style.display = 'none';
          return;
        }

        let slideActual = 0;
        let temporizador;
        slides[0].classList.add('active');

   
        const moverCarrusel = (direccion) => {
          slides[slideActual].classList.remove('active');
          
          slideActual = (slideActual + direccion + slides.length) % slides.length;
          
          slides[slideActual].classList.add('active');
        };

        const iniciarTemporizador = () => {
          temporizador = setInterval(() => {
            moverCarrusel(1);
          }, 5000);
        };

        const reiniciarTemporizador = () => {
          clearInterval(temporizador);
          iniciarTemporizador();
        };

        // BOTONES
        const btnNext = carrusel.querySelector('.next');
        const btnPrev = carrusel.querySelector('.prev');

        if (btnNext && btnPrev) {
          btnNext.addEventListener('click', () => {
            moverCarrusel(1);
            reiniciarTemporizador(); 
          });

          btnPrev.addEventListener('click', () => {
            moverCarrusel(-1);
            reiniciarTemporizador();
          });
        }

        // SWIPE TÁCTIL
        let touchStartX = 0;
        let touchEndX = 0;
        const UMBRAL_SWIPE = 50;

        carrusel.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carrusel.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const distancia = touchEndX - touchStartX;

          if (Math.abs(distancia) < UMBRAL_SWIPE) return; // toque muy corto, no cuenta como swipe

          if (distancia < 0) {
            moverCarrusel(1); // swipe hacia la izquierda -> siguiente
          } else {
            moverCarrusel(-1); // swipe hacia la derecha -> anterior
          }
          reiniciarTemporizador();
        }, { passive: true });

        carrusel.addEventListener('touchcancel', () => {
          touchStartX = 0;
          touchEndX = 0;
        }, { passive: true });

        iniciarTemporizador();
      });

    }
  };
})(Drupal, once);