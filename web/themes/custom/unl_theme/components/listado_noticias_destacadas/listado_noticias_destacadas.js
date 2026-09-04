/**
 * @file
 * Carrusel automático para "Noticias Destacadas".
 * Solo se mueve solo cuando el listado está en modo carrusel (≤991px);
 * en la grilla de escritorio no hace nada.
 */
(function (Drupal, once) {
  "use strict";

  Drupal.behaviors.noticiasDestacadasCarrusel = {
    attach: function (context) {
      const contenedores = once(
        "noticias-destacadas-carrusel",
        ".noticias-destacadas__grid .noticias__contenedor",
        context,
      );

      contenedores.forEach((contenedor) => {
        const mobileQuery = window.matchMedia("(max-width: 991px)");
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        );

        const intervalMs = 4000; // tiempo entre avances automáticos
        let autoplayTimer = null;
        let isPaused = false;
        let resumeTimeout = null;

        const getItems = () =>
          Array.from(contenedor.querySelectorAll(":scope > .noticias__item"));

        // Detecta cuál tarjeta está más visible ahora mismo y avanza a la
        // siguiente; si ya estaba en la última, vuelve a la primera (loop).
        const goToNext = () => {
          const items = getItems();
          if (items.length < 2) return;

          const currentScroll = contenedor.scrollLeft;
          let currentIndex = 0;
          let minDistance = Infinity;

          items.forEach((item, index) => {
            const distance = Math.abs(item.offsetLeft - currentScroll);
            if (distance < minDistance) {
              minDistance = distance;
              currentIndex = index;
            }
          });

          const nextIndex = (currentIndex + 1) % items.length;

          contenedor.scrollTo({
            left: items[nextIndex].offsetLeft,
            behavior: "smooth",
          });
        };

        const startAutoplay = () => {
          if (autoplayTimer) return;
          if (!mobileQuery.matches || prefersReducedMotion.matches) return;

          autoplayTimer = setInterval(() => {
            if (!isPaused) goToNext();
          }, intervalMs);
        };

        const stopAutoplay = () => {
          if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
          }
        };

        // Pausa mientras el usuario interactúa a mano (touch, mouse o rueda)
        // y reanuda un momento después de que suelta/termina de mover.
        const pauseTemporarily = () => {
          isPaused = true;
          clearTimeout(resumeTimeout);
          resumeTimeout = setTimeout(() => {
            isPaused = false;
          }, intervalMs);
        };

        contenedor.addEventListener("pointerdown", pauseTemporarily);
        contenedor.addEventListener("touchstart", pauseTemporarily, {
          passive: true,
        });
        contenedor.addEventListener("wheel", pauseTemporarily, {
          passive: true,
        });

        // Pausa si la pestaña queda en segundo plano (ahorra recursos)
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) {
            stopAutoplay();
          } else {
            startAutoplay();
          }
        });

        // Enciende/apaga el autoplay según se entre o salga del modo carrusel
        const handleBreakpointChange = () => {
          if (mobileQuery.matches && !prefersReducedMotion.matches) {
            startAutoplay();
          } else {
            stopAutoplay();
          }
        };

        mobileQuery.addEventListener("change", handleBreakpointChange);
        handleBreakpointChange();
      });
    },
  };
})(Drupal, once);