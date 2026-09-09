/**
 * @file
 * Anima los números de la variante "contador" (0 -> valor final)
 * la primera vez que entran en pantalla, y controla el modal
 * "ver más" de la variante "autoridades".
 */
(function (Drupal, once) {
  "use strict";

  Drupal.behaviors.tarjetaContadorAnimado = {
    attach: function (context) {
      const numeros = once(
        "tarjeta-contador-animado",
        ".tarjeta-contador__numero",
        context,
      );

      if (!numeros.length) {
        return;
      }

      const DURACION = 1600;

      const animarNumero = (el) => {
        const textoOriginal = el.textContent.trim();
        const match = textoOriginal.match(/^(\D*)([\d.,]+)(\D*)$/);
        if (!match) {
          return;
        }

        const [, prefijo, numeroTexto, sufijo] = match;
        const valorFinal = parseInt(numeroTexto.replace(/\D/g, ""), 10);

        if (Number.isNaN(valorFinal)) {
          return;
        }

        const formatear = (n) => n.toLocaleString("es-ES");

        const prefiereMenosMovimiento = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefiereMenosMovimiento) {
          el.textContent = `${prefijo}${formatear(valorFinal)}${sufijo}`;
          return;
        }

        const inicio = performance.now();

        const paso = (ahora) => {
          const progreso = Math.min((ahora - inicio) / DURACION, 1);
          const progresoSuavizado = 1 - Math.pow(1 - progreso, 3);
          const valorActual = Math.floor(progresoSuavizado * valorFinal);

          el.textContent = `${prefijo}${formatear(valorActual)}${sufijo}`;

          if (progreso < 1) {
            requestAnimationFrame(paso);
          } else {
            el.textContent = `${prefijo}${formatear(valorFinal)}${sufijo}`;
          }
        };

        requestAnimationFrame(paso);
      };

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                animarNumero(entry.target);
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.4 },
        );

        numeros.forEach((el) => observer.observe(el));
      } else {
        numeros.forEach(animarNumero);
      }
    },
  };

  Drupal.behaviors.tarjetaAutoridadDescripcion = {
    attach: function (context) {
      once(
        "tarjeta-autoridad-descripcion",
        "[data-info-toggle]",
        context,
      ).forEach((boton) => {
        const marco = boton.closest(".tarjeta-autoridad__marco");
        const info = marco.querySelector("[data-info-contenido]");
        const nombre = marco.querySelector(".tarjeta-autoridad__nombre");

        boton.addEventListener("click", () => {
          const fondo = document.createElement("div");
          fondo.className = "tarjeta-autoridad-modal-fondo";
          fondo.innerHTML = `
          <div class="tarjeta-autoridad-modal">
            <button type="button" class="tarjeta-autoridad-modal__cerrar" aria-label="Cerrar">×</button>
            ${nombre ? `<h4 class="tarjeta-autoridad-modal__nombre">${nombre.textContent}</h4>` : ""}
            ${info.innerHTML}
          </div>
        `;
          document.body.appendChild(fondo);
          document.body.style.overflow = "hidden";

          const cerrar = () => {
            fondo.remove();
            document.body.style.overflow = "";
            document.removeEventListener("keydown", alPresionarEsc);
          };

          const alPresionarEsc = (e) => {
            if (e.key === "Escape") cerrar();
          };

          fondo.addEventListener("click", (e) => {
            if (e.target === fondo) cerrar();
          });
          fondo
            .querySelector(".tarjeta-autoridad-modal__cerrar")
            .addEventListener("click", cerrar);
          document.addEventListener("keydown", alPresionarEsc);
        });
      });
    },
  };
})(Drupal, once);
