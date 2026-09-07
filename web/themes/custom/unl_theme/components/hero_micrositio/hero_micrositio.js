(function (Drupal, once) {
  Drupal.behaviors.heroMicrositio = {
    attach: function (context, settings) {

      const heroes = once('hero-micrositio-init', '.hero-micrositio', context);

      heroes.forEach(hero => {
        const slides = hero.querySelectorAll('.slide-item');

        if (slides.length <= 1) {
          if (slides.length === 1) slides[0].classList.add('active');
          const controles = hero.querySelector('.carrusel-controles');
          if (controles) controles.style.display = 'none';
          return;
        }

        let slideActual = 0;
        let temporizador;
        slides[0].classList.add('active');

        const controles = hero.querySelector('.carrusel-controles');
        let indicadores = [];

        if (controles) {
          slides.forEach((slide, indice) => {
            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'carrusel-indicador';
            boton.setAttribute('role', 'tab');
            boton.setAttribute('aria-label', 'Ir a la diapositiva ' + (indice + 1) + ' de ' + slides.length);
            boton.addEventListener('click', () => {
              irADiapositiva(indice);
              reiniciarTemporizador();
            });
            controles.appendChild(boton);
            indicadores.push(boton);
          });
          indicadores[0].classList.add('active');
        }

        const actualizarIndicadores = () => {
          indicadores.forEach((indicador, indice) => {
            indicador.classList.toggle('active', indice === slideActual);
            indicador.setAttribute('aria-selected', indice === slideActual ? 'true' : 'false');
          });
        };

        const moverCarrusel = (direccion) => {
          slides[slideActual].classList.remove('active');
          slideActual = (slideActual + direccion + slides.length) % slides.length;
          slides[slideActual].classList.add('active');
          actualizarIndicadores();
        };

        const irADiapositiva = (indice) => {
          if (indice === slideActual) return;
          slides[slideActual].classList.remove('active');
          slideActual = indice;
          slides[slideActual].classList.add('active');
          actualizarIndicadores();
        };

        const iniciarTemporizador = () => {
          temporizador = setInterval(() => moverCarrusel(1), 5000);
        };

        const reiniciarTemporizador = () => {
          clearInterval(temporizador);
          iniciarTemporizador();
        };

        let touchStartX = 0;
        let touchEndX = 0;
        const UMBRAL_SWIPE = 50;

        hero.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        hero.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const distancia = touchEndX - touchStartX;
          if (Math.abs(distancia) < UMBRAL_SWIPE) return;
          distancia < 0 ? moverCarrusel(1) : moverCarrusel(-1);
          reiniciarTemporizador();
        }, { passive: true });

        hero.addEventListener('touchcancel', () => {
          touchStartX = 0;
          touchEndX = 0;
        }, { passive: true });

        iniciarTemporizador();
      });

    }
  };
})(Drupal, once);