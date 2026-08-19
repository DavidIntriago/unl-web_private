(function (Drupal, once) {
  Drupal.behaviors.sidebarMicrositioAltura = {
    attach(context) {
      once("sidebar-altura", ".sidebar-micrositio", context).forEach((sidebar) => {
        const viewport = sidebar.querySelector(".sidebar-micrositio__viewport");
        const lista = viewport ? viewport.querySelector("ul:not(.contextual-links)") : null;
        if (!viewport || !lista) return;

        const items = Array.from(lista.children).filter((el) => el.tagName === "LI");
        if (items.length === 0) return;

        const ajustarAltura = () => {
          const esMobile = window.matchMedia("(max-width: 768px)").matches;
          const visibles = Math.min(esMobile ? 3 : 6, items.length);
          const ultimo = items[visibles - 1];

          const topViewport = viewport.getBoundingClientRect().top;
          const bottomUltimo = ultimo.getBoundingClientRect().bottom;
          const altura = bottomUltimo - topViewport;

          viewport.style.height = `${Math.ceil(altura)}px`;
        };

        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(ajustarAltura);
        }

        ajustarAltura();
        window.addEventListener("load", ajustarAltura);
        window.addEventListener("resize", ajustarAltura);
        window.addEventListener("orientationchange", ajustarAltura);
      });
    },
  };
})(Drupal, once);