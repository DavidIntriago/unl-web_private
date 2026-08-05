/**
 * @file
 * Carrusel para la variante "sitios_interes" de Grid Tarjetas.
 * Infinito, sin clonar tarjetas: cuando una tarjeta sale de la
 * vista, se reubica físicamente al otro extremo del carrusel y se
 * resetea la posición sin animar, dando la ilusión de loop infinito
 * usando solo los elementos reales.
 */
(function (Drupal, once) {
  "use strict";

  Drupal.behaviors.gridTarjetasCarrusel = {
    attach: function (context) {
      const contenedores = once(
        "sitios-interes-carrusel-init",
        ".grid-tarjetas-container--sitios_interes",
        context
      );

      contenedores.forEach((contenedor) => {
        const viewport = contenedor.querySelector(".carrusel-sitios-viewport");
        const track = contenedor.querySelector(".carrusel-sitios-track");
        const btnPrev = contenedor.querySelector(".carrusel-sitios-flecha.prev");
        const btnNext = contenedor.querySelector(".carrusel-sitios-flecha.next");

        if (!viewport || !track) {
          return;
        }

        const n = track.children.length;

        if (n <= 1) {
          if (btnPrev) btnPrev.style.display = "none";
          if (btnNext) btnNext.style.display = "none";
          return;
        }

        const calcularPaso = () => {
          const estiloTrack = getComputedStyle(track);
          const gap = parseFloat(estiloTrack.columnGap || estiloTrack.gap || "0") || 0;
          return track.firstElementChild.getBoundingClientRect().width + gap;
        };

        const contarVisibles = () => {
          const anchoViewport = viewport.getBoundingClientRect().width;
          const paso = calcularPaso();
          return paso > 0 ? Math.max(Math.round(anchoViewport / paso), 1) : 1;
        };

        let temporizador;
        let animando = false;
        let vieneDeSiguiente = false;
        const DURACION_AUTOPLAY = 5000;

        const irSiguiente = () => {
          if (animando) return;
          animando = true;
          vieneDeSiguiente = true;
          track.style.transition = "";
          track.style.transform = `translateX(-${calcularPaso()}px)`;
        };

        const irAnterior = () => {
          if (animando) return;
          animando = true;
          vieneDeSiguiente = false;

          const paso = calcularPaso();
          const ultimo = track.lastElementChild;
          track.style.transition = "none";
          track.insertBefore(ultimo, track.firstElementChild);
          track.style.transform = `translateX(-${paso}px)`;
          void track.offsetHeight;
          track.style.transition = "";
          track.style.transform = "translateX(0px)";
        };

        track.addEventListener("transitionend", (e) => {
          if (e.target !== track || e.propertyName !== "transform") {
            return;
          }

          if (vieneDeSiguiente) {
            // La primera tarjeta ya salió de vista: la reubicamos al
            // final y reseteamos sin animar.
            const primero = track.firstElementChild;
            track.style.transition = "none";
            track.appendChild(primero);
            track.style.transform = "translateX(0px)";
            void track.offsetHeight;
          }

          vieneDeSiguiente = false;
          animando = false;
        });

        const iniciarAutoplay = () => {
          temporizador = setInterval(irSiguiente, DURACION_AUTOPLAY);
        };

        const reiniciarAutoplay = () => {
          clearInterval(temporizador);
          iniciarAutoplay();
        };

        if (btnNext) {
          btnNext.addEventListener("click", () => {
            irSiguiente();
            reiniciarAutoplay();
          });
        }
        if (btnPrev) {
          btnPrev.addEventListener("click", () => {
            irAnterior();
            reiniciarAutoplay();
          });
        }

        // SWIPE TÁCTIL
        let touchStartX = 0;
        const UMBRAL_SWIPE = 40;

        viewport.addEventListener(
          "touchstart",
          (e) => {
            touchStartX = e.changedTouches[0].screenX;
          },
          { passive: true }
        );

        viewport.addEventListener(
          "touchend",
          (e) => {
            const distancia = e.changedTouches[0].screenX - touchStartX;
            if (Math.abs(distancia) < UMBRAL_SWIPE) return;
            if (distancia < 0) {
              irSiguiente();
            } else {
              irAnterior();
            }
            reiniciarAutoplay();
          },
          { passive: true }
        );

        // Pausamos el autoplay mientras el mouse esté sobre el carrusel
        contenedor.addEventListener("mouseenter", () => clearInterval(temporizador));
        contenedor.addEventListener("mouseleave", iniciarAutoplay);

        // Si hay menos tarjetas reales de las que caben en la vista,
        // no tiene sentido "carrusel-ear": ya se ven todas. Ocultamos
        // flechas y no arrancamos el autoplay.
        if (n <= contarVisibles()) {
          if (btnPrev) btnPrev.style.display = "none";
          if (btnNext) btnNext.style.display = "none";
          return;
        }

        iniciarAutoplay();
      });
    },
  };
})(Drupal, once);