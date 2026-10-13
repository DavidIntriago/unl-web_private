(function (Drupal, once) {
  Drupal.behaviors.listadoCarreras = {
    attach: function (context) {
      once('listado-carreras', '.listado-carreras', context).forEach((seccion) => {
        const boton = seccion.querySelector('.listado-carreras__ver-todas');
        if (!boton) return;

        const visibles = parseInt(seccion.dataset.carrerasVisibles, 10) || 5;
        const total = seccion.querySelectorAll('.tarjeta-carrera').length;

        // Si caben todas, el botón sobra
        if (total <= visibles) {
          boton.remove();
          return;
        }

        boton.addEventListener('click', () => {
          const abrir = !seccion.classList.contains('is-expandido');
          seccion.classList.toggle('is-expandido', abrir);
          boton.setAttribute('aria-expanded', String(abrir));
          boton.textContent = abrir ? 'Ver menos' : 'Ver toda la oferta';

          // Al cerrar, vuelve al inicio de la sección para no quedar perdido abajo
          if (!abrir) {
            seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }
  };
})(Drupal, once);