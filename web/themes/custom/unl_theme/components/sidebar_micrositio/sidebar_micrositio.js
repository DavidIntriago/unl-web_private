(function (Drupal, once) {
  Drupal.behaviors.sidebarMicrositioAltura = {
    attach(context) {
      once("sidebar-altura", ".sidebar-micrositio", context).forEach((sidebar) => {
        const viewport = sidebar.querySelector(".sidebar-micrositio__viewport");
        const lista = viewport ? viewport.querySelector("ul:not(.contextual-links)") : null;
        if (!viewport || !lista) return;

        const items = Array.from(lista.querySelectorAll("li"));
        if (items.length === 0) return;

        const ajustarAltura = () => {
          const esMobile = window.matchMedia("(max-width: 768px)").matches;
          const visibles = Math.min(esMobile ? 3 : 6, items.length);
          const ultimo = items[visibles - 1];
          const altura = ultimo.offsetTop + ultimo.offsetHeight;
          viewport.style.height = `${altura}px`;
        };

        // Espera a que las fuentes reales (Inter) terminen de cargar
        // antes de medir, para no calcular con la fuente de respaldo.
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(ajustarAltura);
        }

        ajustarAltura(); // cálculo inicial, por si acaso
        window.addEventListener("resize", ajustarAltura);
        window.addEventListener("orientationchange", ajustarAltura);
      });
    },
  };
})(Drupal, once);