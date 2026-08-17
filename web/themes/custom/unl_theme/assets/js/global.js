(function (Drupal, once) {
  "use strict";

  Drupal.behaviors.fondoDecorativo = {
    attach: function (context) {
      const inicio = once("fondo-decorativo-init", "body", context);
      if (!inicio.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      let solicitado = false;

      document.addEventListener("mousemove", (e) => {
        if (solicitado) return;
        solicitado = true;

        requestAnimationFrame(() => {
          const mx = e.clientX / window.innerWidth;
          const my = e.clientY / window.innerHeight;
          document.documentElement.style.setProperty("--mx", mx.toFixed(3));
          document.documentElement.style.setProperty("--my", my.toFixed(3));
          solicitado = false;
        });
      });
    },
  };
})(Drupal, once);
