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

document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); 
        observer.unobserve(entry.target); 
      }
    });
  }, { 
    threshold: 0.1, 
    rootMargin: "0px 0px -50px 0px" 
  });

  document.querySelectorAll('.animar-scroll').forEach(el => {
    observer.observe(el);
  });
  
});
