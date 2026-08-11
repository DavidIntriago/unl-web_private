/**
 * @file
 * Menú lateral flotante (redes, radio, editorial...).
 *
 * Todo el abrir/cerrar lo controla la clase .is-open desde JS.
 *
 * - Escritorio (mouse con hover real): se abre solo al pasar el mouse
 *   (mouseenter/mouseleave). Además, un clic fuerza abrir/cerrar — y
 *   mientras esté cerrado "a la fuerza" no se reabre solo mientras el
 *   mouse siga encima; hay que salir y volver a entrar.
 * - Móvil/tablet (sin hover confiable): clic para abrir/cerrar, y clic
 *   afuera para cerrar.
 */
(function (Drupal, once) {
  "use strict";

  Drupal.behaviors.unlLateralMenu = {
    attach: function (context) {
      const menus = once("unl-lateral-menu", ".lateral-menu", context);

      menus.forEach((menu) => {
        const tab = menu.querySelector(".lateral-menu__tab");
        if (!tab) return;

        let closeTimeout = null;

        const openMenu = () => {
          if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
          }
          menu.classList.add("is-open");
          tab.setAttribute("aria-expanded", "true");
        };

        const closeMenu = () => {
          menu.classList.remove("is-open");
          tab.setAttribute("aria-expanded", "false");
        };

        const scheduleClose = () => {
          if (closeTimeout) clearTimeout(closeTimeout);
          closeTimeout = setTimeout(closeMenu, 250);
        };

        const hoverQuery = window.matchMedia(
          "(hover: hover) and (pointer: fine)",
        );

        // ------------------------------------------------------------------
        // Escritorio: hover abre/cierra automático, y un clic fuerza el
        // estado contrario. "lockedClosed" evita que el hover lo vuelva a
        // abrir solo mientras el mouse sigue encima tras un clic de cierre.
        // ------------------------------------------------------------------
        const setupDesktopBehavior = () => {
          let lockedClosed = false;

          menu.addEventListener("mouseenter", () => {
            if (lockedClosed) return;
            openMenu();
          });

          menu.addEventListener("mouseleave", () => {
            lockedClosed = false; // al salir, se resetea el bloqueo
            scheduleClose();
          });

          tab.addEventListener("focus", () => {
            if (lockedClosed) return;
            openMenu();
          });
          tab.addEventListener("blur", scheduleClose);

          tab.addEventListener("click", (e) => {
            e.preventDefault();

            if (menu.classList.contains("is-open")) {
              closeMenu();
              lockedClosed = true;
            } else {
              openMenu();
              lockedClosed = false;
            }
          });
        };

        // ------------------------------------------------------------------
        // Móvil/tablet: clic para alternar, clic afuera para cerrar.
        // ------------------------------------------------------------------
        const setupTouchBehavior = () => {
          tab.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (menu.classList.contains("is-open")) {
              closeMenu();
            } else {
              openMenu();
            }
          });

          // Cerrar si se toca fuera del menú
          document.addEventListener("click", (e) => {
            if (!menu.classList.contains("is-open")) return;
            if (!menu.contains(e.target)) closeMenu();
          });
        };

        if (hoverQuery.matches) {
          setupDesktopBehavior();
        } else {
          setupTouchBehavior();
        }

        // Si el dispositivo cambia de tipo en caliente (rotar tablet,
        // conectar/desconectar mouse), cerramos para evitar estados raros.
        hoverQuery.addEventListener("change", () => {
          closeMenu();
        });
      });
    },
  };
})(Drupal, once);