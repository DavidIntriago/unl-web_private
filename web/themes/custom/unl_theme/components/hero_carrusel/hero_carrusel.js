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

        iniciarTemporizador();
      });

    }
  };
})(Drupal, once);