// web/themes/custom/unl_theme/components/hero_carrusel/hero_carrusel.js

(function (Drupal, once) {
  Drupal.behaviors.heroCarrusel = {
    attach: function (context, settings) {
      
      const carruseles = once('hero-carrusel-init', '.hero-carrusel-contenedor', context);
      
      carruseles.forEach(carrusel => {
        const slides = carrusel.querySelectorAll('.slide-item');
        
        if (slides.length <= 1) {
          if (slides.length === 1) slides[0].classList.add('active');
          // Ocultar botones si solo hay 1 diapositiva
          const controles = carrusel.querySelector('.carrusel-controles');
          if (controles) controles.style.display = 'none';
          return;
        }

        let slideActual = 0;
        let temporizador;
        slides[0].classList.add('active');

        // Función maestra para cambiar de diapositiva
        // direccion: 1 (siguiente) o -1 (anterior)
        const moverCarrusel = (direccion) => {
          slides[slideActual].classList.remove('active');
          
          // La fórmula matemática con módulo asegura que el índice dé la vuelta correctamente (incluso hacia atrás)
          slideActual = (slideActual + direccion + slides.length) % slides.length;
          
          slides[slideActual].classList.add('active');
        };

        // Control del auto-play
        const iniciarTemporizador = () => {
          temporizador = setInterval(() => {
            moverCarrusel(1);
          }, 5000);
        };

        const reiniciarTemporizador = () => {
          clearInterval(temporizador);
          iniciarTemporizador();
        };

        // Eventos de los botones
        const btnNext = carrusel.querySelector('.next');
        const btnPrev = carrusel.querySelector('.prev');

        if (btnNext && btnPrev) {
          btnNext.addEventListener('click', () => {
            moverCarrusel(1);
            reiniciarTemporizador(); // Reiniciamos para que no cambie de golpe tras el clic
          });

          btnPrev.addEventListener('click', () => {
            moverCarrusel(-1);
            reiniciarTemporizador();
          });
        }

        // Arrancamos el motor
        iniciarTemporizador();
      });

    }
  };
})(Drupal, once);