(function (Drupal, once) {
  Drupal.behaviors.loaderFacultad = {
    attach: function (context) {
      once('loader-facultad', '.loader-facultad', context).forEach((loader) => {

        const TIEMPO_MINIMO = 700;   // para que el logo alcance a verse
        const TIEMPO_MAXIMO = 3000;  // nunca esperar más que esto
        let abierto = false;

        const quitar = () => loader.remove();

        const abrir = () => {
          if (abierto) return;
          abierto = true;

          // performance.now() cuenta desde que empezó a cargar la página
          const espera = Math.max(0, TIEMPO_MINIMO - performance.now());

          setTimeout(() => {
            loader.classList.add('is-abriendo');

            // Cuando el panel termina de abrirse, se elimina del DOM
            const panel = loader.querySelector('.loader-facultad__panel');
            panel.addEventListener('transitionend', quitar, { once: true });

            // Respaldo por si transitionend no llega (movimiento reducido)
            setTimeout(quitar, 1500);
          }, espera);
        };

        // Se abre cuando cargó todo (imágenes incluidas), o al tiempo máximo
        if (document.readyState === 'complete') {
          abrir();
        } else {
          window.addEventListener('load', abrir, { once: true });
        }
        setTimeout(abrir, TIEMPO_MAXIMO);
      });
    }
  };
})(Drupal, once);