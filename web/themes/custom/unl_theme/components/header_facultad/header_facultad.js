(function (Drupal, once) {
  Drupal.behaviors.menuFacultad = {
    attach: function (context) {
      once('menu-facultad', '.menu-facultad', context).forEach((menu) => {
        const nav = menu.closest('.header-facultad__nav');
        const botones = [...menu.querySelectorAll('button.menu-facultad__enlace')];
        const conMouse = window.matchMedia('(hover: hover) and (pointer: fine)');
        let temporizadorCierre;

        // Alto real de la fila (cambia si los enlaces ocupan dos líneas)
        const medirFila = () => {
          nav.style.setProperty('--alto-fila', menu.offsetHeight + 'px');
        };

        // Franja blanca detrás de los enlaces
        const mostrarFila = () => {
          clearTimeout(temporizadorCierre);
          medirFila();
          nav.classList.add('is-fila-blanca');
        };

        // Cierra los paneles pero deja la franja
        const cerrarPaneles = () => {
          nav.classList.remove('is-cambiando');
          botones.forEach((b) => {
            b.setAttribute('aria-expanded', 'false');
            b.parentElement.classList.remove('is-abierto');
          });
          nav.classList.remove('is-menu-abierto');
        };

        // Cierra todo, franja incluida
        const cerrarTodo = () => {
          cerrarPaneles();
          nav.classList.remove('is-fila-blanca');
        };

        const abrir = (boton) => {
          mostrarFila();
          // Si ya había un panel abierto, el cambio entre secciones es directo
          nav.classList.toggle('is-cambiando', nav.classList.contains('is-menu-abierto'));
          botones.forEach((b) => {
            const esEste = b === boton;
            b.setAttribute('aria-expanded', String(esEste));
            b.parentElement.classList.toggle('is-abierto', esEste);
          });
          nav.classList.add('is-menu-abierto');
        };

        botones.forEach((boton) => {
          // Con mouse, el clic solo abre; en celular, el toque abre y cierra
          boton.addEventListener('click', () => {
            if (!conMouse.matches && boton.getAttribute('aria-expanded') === 'true') {
              cerrarTodo();
            } else {
              abrir(boton);
            }
          });

          boton.parentElement.addEventListener('mouseenter', () => {
            if (conMouse.matches) abrir(boton);
          });
        });

        // Enlace sin hijos: cierra el panel, la franja se queda
        menu.querySelectorAll('a.menu-facultad__enlace').forEach((enlace) => {
          enlace.parentElement.addEventListener('mouseenter', () => {
            if (conMouse.matches) cerrarPaneles();
          });
        });

        // Entrar a la fila muestra la franja; salir cierra todo con una pausa corta
        nav.addEventListener('mouseenter', () => {
          if (conMouse.matches) mostrarFila();
        });
        nav.addEventListener('mouseleave', () => {
          if (conMouse.matches) temporizadorCierre = setTimeout(cerrarTodo, 150);
        });

        // Teclado: con Tab dentro del menú también aparece la franja
        nav.addEventListener('focusin', mostrarFila);
        nav.addEventListener('focusout', (e) => {
          if (!nav.contains(e.relatedTarget)) cerrarTodo();
        });

        // Escape o clic fuera: cierra todo
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') cerrarTodo();
        });
        document.addEventListener('click', (e) => {
          if (!nav.contains(e.target)) cerrarTodo();
        });
      });
    }
  };
})(Drupal, once);