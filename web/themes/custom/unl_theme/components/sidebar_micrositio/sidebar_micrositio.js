(function (Drupal, once) {
  Drupal.behaviors.sidebarMicrositioSubmenu = {
    attach(context) {
      once('sidebar-submenu', '.sidebar-micrositio nav', context).forEach((viewport) => {
        const nivelPrincipal = viewport.querySelector(':scope > ul:not(.contextual-links)');
        if (!nivelPrincipal) return;

        prepararNiveles(nivelPrincipal);
      });
    },
  };

  function prepararNiveles(ul) {
    const items = Array.from(ul.children).filter((el) => el.tagName === 'LI');

    items.forEach((li) => {
      const enlace = li.querySelector(':scope > a');
      const submenu = li.querySelector(':scope > ul');

      if (!submenu || !enlace) return;

      li.classList.add('tiene-submenu');

      const estaActivo = enlace.classList.contains('is-active');
      const contieneActivo = !!submenu.querySelector('a.is-active');

      if (estaActivo || contieneActivo) {
        ul.classList.add('mostrando-submenu');
        li.classList.add('submenu-abierto');
        submenu.classList.add('is-visible');
      }

      prepararNiveles(submenu);
    });
  }
})(Drupal, once);