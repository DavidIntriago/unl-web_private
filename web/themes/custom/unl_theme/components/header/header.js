/**
 * @file
 * Funcionalidad interactiva para la cabecera de la UNL.
 */
(function (Drupal, once) {
  "use strict";

  Drupal.behaviors.unlHeaderMenu = {
    attach: function (context) {
      // ========================================================================
      // 1. OCULTAR HEADER AL BAJAR / MOSTRAR AL SUBIR (ESCRITORIO Y MÓVIL)
      // ========================================================================
      const headers = once("unl-header-scroll", ".site-header", context);

      headers.forEach((header) => {
        let lastScrollY = window.scrollY;
        const scrollThreshold = 60; // Umbral mínimo de scroll en píxeles

        window.addEventListener(
          "scroll",
          () => {
            const currentScrollY = window.scrollY;
            const menuPanel = document.querySelector(".mobile-menu-panel");

            // Si bajamos scroll superando el umbral -> Ocultar Header
            if (
              currentScrollY > lastScrollY &&
              currentScrollY > scrollThreshold
            ) {
              header.classList.add("is-hidden");

              // Si el panel móvil estaba abierto, se cierra al ocultar la cabecera
              if (menuPanel && menuPanel.classList.contains("is-open")) {
                menuPanel.classList.remove("is-open");
                const menuButton = document.querySelector(
                  ".mobile-menu-button",
                );
                if (menuButton) menuButton.classList.remove("is-active");
              }
            } else if (currentScrollY < lastScrollY) {
              // Si subimos scroll -> Mostrar Header
              header.classList.remove("is-hidden");
            }

            // Si estamos arriba del todo, siempre visible
            if (currentScrollY <= 0) {
              header.classList.remove("is-hidden");
            }

            lastScrollY = currentScrollY;
          },
          { passive: true },
        );
      });

      // ========================================================================
      // 2. CONTROL DEL BOTÓN HAMBURGUESA MÓVIL
      // ========================================================================
      const menuButtons = once(
        "unl-header-mobile-toggle",
        ".mobile-menu-button",
        context,
      );

      menuButtons.forEach((menuButton) => {
        const menuPanel = document.querySelector(".mobile-menu-panel");
        if (!menuPanel) return;

        menuButton.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          menuButton.classList.toggle("is-active");
          menuPanel.classList.toggle("is-open");

          // Reiniciar siempre los acordeones (abrir o cerrar el panel):
          // así el menú móvil nunca recuerda qué submenú quedó abierto
          // de la vez anterior, y siempre arranca todo colapsado.
          menuPanel.querySelectorAll(".is-submenu-open").forEach((openLi) => {
            openLi.classList.remove("is-submenu-open");
          });
          menuPanel.querySelectorAll(".submenu-toggle").forEach((btn) => {
            btn.setAttribute("aria-expanded", "false");
          });
        });

        // Cerrar si se hace clic fuera del menú
        document.addEventListener("click", function (e) {
          const isOpen = menuPanel.classList.contains("is-open");
          if (!isOpen) return;

          const clickedInsidePanel = menuPanel.contains(e.target);
          const clickedButton = menuButton.contains(e.target);

          if (!clickedInsidePanel && !clickedButton) {
            menuButton.classList.remove("is-active");
            menuPanel.classList.remove("is-open");
          }
        });

        // Cerrar el menú móvil si la ventana crece más allá del
        // breakpoint móvil (1000px, mismo valor que en header.css),
        // para que no quede abierto al pasar a vista de escritorio.
        const mobileBreakpoint = window.matchMedia("(max-width: 1000px)");
        const closeMobileMenuOnDesktop = () => {
          if (!mobileBreakpoint.matches) {
            menuButton.classList.remove("is-active");
            menuPanel.classList.remove("is-open");
          }
        };
        window.addEventListener("resize", closeMobileMenuOnDesktop);
      });

      // ========================================================================
      // 3. CONTROL DE SUBMENÚS EN ESCRITORIO
      // ========================================================================
      const desktopItems = once(
        "unl-desktop-menu-items",
        ".site-header__navigation li",
        context,
      );

      // Lista raíz del menú. OJO: no usamos ">" (hijo directo de <nav>)
      // porque Drupal suele envolver el <ul> del menú en un <div> del
      // bloque (a veces con un <h2> de título antes). Como en el HTML
      // el <ul> de primer nivel siempre aparece ANTES que cualquier
      // <ul> anidado dentro de sus <li>, el primer <ul> que encuentre
      // el selector (sin ">") es siempre el de nivel 1.
      const topLevelList = document.querySelector(
        ".site-header__navigation ul",
      );

      desktopItems.forEach((li) => {
        // :scope > asegura que solo cuente un submenú que sea HIJO DIRECTO,
        // no cualquier <ul> anidado en niveles más profundos.
        const subMenu = li.querySelector(":scope > ul, :scope > .submenu");
        if (subMenu) {
          li.classList.add("has-children");

          // Si el <li> pertenece al primer nivel (hijo directo de la lista
          // raíz), lo marcamos para que el CSS le apague el desplegable rojo
          // genérico: sus hijos se muestran solo vía la franja blanca (subbar).
          if (topLevelList && li.parentElement === topLevelList) {
            li.classList.add("is-top-level");
          }
        }
      });

      // ========================================================================
      // 4. ACORDEÓN EN MÓVIL (EL PADRE ABRE HIJOS SIN REDIRIGIR)
      // ========================================================================
      const mobileItems = once(
        "unl-mobile-submenu-items",
        ".mobile-menu-panel li",
        context,
      );

      // Colapsa un <li> y, además, cualquier submenú que haya quedado
      // abierto adentro suyo (para que al reabrirlo no aparezca ya
      // expandido en un nivel más profundo).
      const collapseAccordionItem = (targetLi) => {
        targetLi.classList.remove("is-submenu-open");

        const ownToggle = targetLi.querySelector(":scope > .submenu-toggle");
        if (ownToggle) ownToggle.setAttribute("aria-expanded", "false");

        targetLi.querySelectorAll(".is-submenu-open").forEach((nestedLi) => {
          nestedLi.classList.remove("is-submenu-open");
        });
        targetLi.querySelectorAll(".submenu-toggle").forEach((nestedToggle) => {
          nestedToggle.setAttribute("aria-expanded", "false");
        });
      };

      mobileItems.forEach((li) => {
        const subMenu = li.querySelector(":scope > .submenu, :scope > ul");
        if (!subMenu) return;

        li.classList.add("has-children");

        // Botón con ícono de flecha
        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.className = "submenu-toggle";
        toggleButton.setAttribute("aria-expanded", "false");
        toggleButton.setAttribute("aria-label", "Desplegar submenú");
        toggleButton.innerHTML = '<span class="submenu-toggle__icon"></span>';

        li.appendChild(toggleButton);

        // Función unificada para desplegar/contraer
        const toggleAccordion = function (e) {
          e.preventDefault(); // Previene la navegación a la página del padre
          e.stopPropagation();

          const willOpen = !li.classList.contains("is-submenu-open");

          // Si se va a abrir, cerrar antes cualquier hermano del mismo
          // nivel (mismo <ul> padre) que haya quedado abierto.
          if (willOpen && li.parentElement) {
            li.parentElement
              .querySelectorAll(":scope > li.is-submenu-open")
              .forEach((siblingLi) => {
                if (siblingLi !== li) {
                  collapseAccordionItem(siblingLi);
                }
              });
          }

          li.classList.toggle("is-submenu-open", willOpen);
          toggleButton.setAttribute(
            "aria-expanded",
            willOpen ? "true" : "false",
          );
        };

        // Asignar el clic tanto al texto del enlace/padre como al botón flecha
        const parentLink = li.querySelector(":scope > a, :scope > span");
        if (parentLink) {
          parentLink.style.cursor = "pointer";
          parentLink.addEventListener("click", toggleAccordion);
        }

        toggleButton.addEventListener("click", toggleAccordion);
      });

      // ========================================================================
      // 5. FRANJA DE SUBMENÚS (nivel 2) SEGÚN HOVER/CLIC DEL NIVEL 1
      //    Paginación real: si un ítem no cabe completo en el ancho
      //    disponible, se oculta por completo (display:none) en vez de
      //    cortarse a la mitad. Las flechas avanzan/retroceden de página.
      // ========================================================================
      const subbar = document.querySelector(".site-header__subbar");
      const subbarContainer = document.querySelector(
        ".site-header__subbar-container",
      );
      const subbarViewport = document.querySelector(
        ".site-header__subbar-viewport",
      );
      const subbarInner = document.querySelector(".site-header__subbar-inner");
      const arrowLeft = document.querySelector(
        ".site-header__subbar-arrow--left",
      );
      const arrowRight = document.querySelector(
        ".site-header__subbar-arrow--right",
      );

      // Determina si un <a> tiene una página real a donde ir
      // (Drupal pone href="" en los ítems padre sin enlace propio)
      const hasRealLink = (link) => {
        if (!link) return false;
        const href = link.getAttribute("href");
        return (
          !!href &&
          href !== "#" &&
          !href.trim().toLowerCase().startsWith("javascript:")
        );
      };

      if (
        subbar &&
        subbarContainer &&
        subbarViewport &&
        subbarInner &&
        topLevelList
      ) {
        const topLevelItems = topLevelList.querySelectorAll(
          ":scope > li.has-children",
        );

        let closeTimeout = null;
        let currentLi = null;
        let openedByClick = false; // clave para no auto-cerrar tras un hover

        // --- Estado de la "cinta" ---
        // Los ítems SIEMPRE están todos en el DOM y visibles (nunca se
        // ocultan con display:none). Lo que cambia es cuánto se traslada
        // la cinta (transform) y cuánto mide el visor (viewport) que la
        // recorta — así nunca se puede ver un ítem cortado a la mitad:
        // o entra completo dentro del visor, o queda 100% fuera de él.
        let items = []; // wrappers .site-header__subbar-item, en orden
        let itemOffsets = []; // posición izquierda natural de cada ítem (px)
        let itemWidths = []; // ancho natural de cada ítem (px)
        let pageStartIndex = 0;
        let pageEndIndex = 0;

        // Ancho máximo utilizable para el contenido, reservando siempre el
        // espacio de ambas flechas (se muestren o no) para que el cálculo
        // no cambie según su visibilidad y no haya "saltos".
        const getMaxAvailableWidth = () => {
          const styles = getComputedStyle(subbarContainer);
          const paddingLeft = parseFloat(styles.paddingLeft) || 0;
          const paddingRight = parseFloat(styles.paddingRight) || 0;
          const reservedForArrows = 44 * 2; // ancho del botón (el ícono interno creció a 40px, pero el botón sigue siendo 44px)
          return (
            subbarContainer.clientWidth -
            paddingLeft -
            paddingRight -
            reservedForArrows
          );
        };

        // Mide la posición/ancho natural de cada ítem (independiente del
        // transform actual, ya que transform no afecta el layout)
        const measureItems = () => {
          itemOffsets = items.map((item) => item.offsetLeft);
          itemWidths = items.map((item) => item.getBoundingClientRect().width);
        };

        // Desde startIndex hacia adelante, ¿cuántos ítems completos entran
        // en maxWidth?
        const computeForwardPage = (startIndex, maxWidth) => {
          if (startIndex >= items.length) return startIndex;
          const startOffset = itemOffsets[startIndex];
          let end = startIndex;
          while (end < items.length) {
            const reach = itemOffsets[end] + itemWidths[end] - startOffset;
            if (reach > maxWidth && end > startIndex) break;
            end++;
          }
          return end;
        };

        // Hacia atrás desde endIndex (exclusivo), ¿desde qué índice entran
        // ítems completos hasta endIndex?
        const computeBackwardPage = (endIndex, maxWidth) => {
          if (endIndex <= 0) return 0;
          const endReach = itemOffsets[endIndex - 1] + itemWidths[endIndex - 1];
          let start = endIndex;
          while (start > 0) {
            const reach = endReach - itemOffsets[start - 1];
            if (reach > maxWidth && start < endIndex) break;
            start--;
          }
          return start;
        };

        // Traslada la cinta y ajusta el ancho del visor para mostrar
        // exactamente los ítems [start, end) — ni más, ni un pixel de
        // ninguno extra.
        const applyPage = (start, end, animate) => {
          const startOffset = end > start ? itemOffsets[start] : 0;
          const width =
            end > start
              ? itemOffsets[end - 1] + itemWidths[end - 1] - startOffset
              : 0;

          if (!animate) {
            subbarInner.classList.add("is-no-transition");
          } else {
            // Promueve la cinta a su propia capa de GPU SOLO mientras dura
            // esta animación (evita que el texto se vea pixelado el resto
            // del tiempo, que es lo que pasa si will-change queda fijo).
            subbarInner.classList.add("is-animating");
            clearTimeout(subbarInner._animCleanupTimeout);
            subbarInner._animCleanupTimeout = setTimeout(() => {
              subbarInner.classList.remove("is-animating");
            }, 340); // un poco más que la duración de la transición (320ms)
          }

          subbarViewport.style.width = width + "px";
          subbarInner.style.transform = `translateX(${-startOffset}px)`;

          if (!animate) {
            // Fuerza el reflow para que el navegador aplique la posición
            // ya, sin animar, y luego reactiva las transiciones normales
            // para los próximos cambios (clic en flechas).
            void subbarInner.offsetWidth;
            subbarInner.classList.remove("is-no-transition");
          }

          pageStartIndex = start;
          pageEndIndex = end;

          const isPaginated = start > 0 || end < items.length;
          subbarContainer.classList.toggle("is-paginated", isPaginated);

          arrowRight.classList.toggle("is-visible", end < items.length);
          arrowLeft.classList.toggle("is-visible", start > 0);
        };

        // Mide todos los ítems y muestra la primera página que entra
        // completa, sin animación (se usa solo al abrir el menú)
        const layoutFirstPage = () => {
          if (!items.length) return;

          requestAnimationFrame(() => {
            measureItems();
            const maxWidth = getMaxAvailableWidth();
            const end = computeForwardPage(0, maxWidth);
            applyPage(0, end, false);
          });
        };

        // Avanzar: primero mira hasta dónde alcanza hacia adelante desde
        // el final actual, y LUEGO rellena hacia atrás desde ese punto —
        // así la ventana siempre queda llena (reutiliza ítems que ya
        // estaban visibles si hace falta, como "D" en ABCD -> DEFG), en
        // vez de saltar a un bloque fijo no relacionado con lo anterior.
        const goNext = () => {
          if (!items.length || pageEndIndex >= items.length) return;
          const maxWidth = getMaxAvailableWidth();
          const forwardReach = computeForwardPage(pageEndIndex, maxWidth);
          const newStart = computeBackwardPage(forwardReach, maxWidth);
          applyPage(newStart, forwardReach, true);
        };

        // Retroceder: el espejo exacto de goNext — mira hasta dónde
        // alcanza hacia atrás, y rellena hacia adelante desde ahí.
        const goPrev = () => {
          if (!items.length || pageStartIndex <= 0) return;
          const maxWidth = getMaxAvailableWidth();
          const backwardReach = computeBackwardPage(pageStartIndex, maxWidth);
          const newEnd = computeForwardPage(backwardReach, maxWidth);
          applyPage(backwardReach, newEnd, true);
        };

        const fillSubbar = (li, viaClick = false) => {
          if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
          }

          const level2Items = li.querySelectorAll(
            ":scope > ul > li, :scope > .submenu > .submenu-list > li",
          );

          if (!level2Items.length) {
            subbar.classList.remove("is-open");
            subbarInner.innerHTML = "";
            currentLi = null;
            items = [];
            itemOffsets = [];
            itemWidths = [];
            return;
          }

          currentLi = li;
          openedByClick = viaClick;
          subbarInner.innerHTML = "";
          items = [];
          itemOffsets = [];
          itemWidths = [];
          pageStartIndex = 0;
          pageEndIndex = 0;

          level2Items.forEach((level2Li) => {
            const link = level2Li.querySelector(":scope > a");
            if (!link) return;

            const wrapper = document.createElement("div");
            wrapper.className = "site-header__subbar-item";

            const linkClone = link.cloneNode(true);
            wrapper.appendChild(linkClone);

            const level3Items = level2Li.querySelectorAll(
              ":scope > ul > li > a, :scope > .submenu > .submenu-list > li > a",
            );

            if (level3Items.length) {
              wrapper.classList.add("has-flyout");

              const flyout = document.createElement("div");
              flyout.className = "site-header__subbar-flyout";
              level3Items.forEach((level3Link) => {
                flyout.appendChild(level3Link.cloneNode(true));
              });
              wrapper.appendChild(flyout);

              // Si el padre de nivel 2 no tiene página propia,
              // el clic/touch abre y cierra el flyout (nivel 3)
              if (!hasRealLink(linkClone)) {
                linkClone.addEventListener("click", (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  wrapper.classList.toggle("is-open");
                });
              }
            }

            subbarInner.appendChild(wrapper);
            items.push(wrapper);
          });

          subbar.classList.add("is-open");
          layoutFirstPage();
        };

        const closeSubbar = () => {
          currentLi = null;
          openedByClick = false;
          subbar.classList.remove("is-open");
          subbarInner.innerHTML = "";
          subbarInner.style.transform = "";
          subbarViewport.style.width = "";
          items = [];
          itemOffsets = [];
          itemWidths = [];
        };

        const scheduleClose = () => {
          if (closeTimeout) clearTimeout(closeTimeout);
          closeTimeout = setTimeout(closeSubbar, 500); // más margen para llegar a la flecha
        };

        const cancelClose = () => {
          if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
          }
        };

        topLevelItems.forEach((li) => {
          li.addEventListener("mouseenter", () => fillSubbar(li, false));
          li.addEventListener("mouseleave", scheduleClose);

          const directLink = li.querySelector(":scope > a");
          if (!directLink) return;

          if (hasRealLink(directLink)) {
            // Tiene página propia: el touch solo abre la franja
            directLink.addEventListener(
              "touchstart",
              () => fillSubbar(li, false),
              { passive: true },
            );
          } else {
            // No tiene página propia: el clic/touch alterna abrir/cerrar
            directLink.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();

              // Solo cierra si YA estaba abierto por un clic previo (no por hover)
              if (
                currentLi === li &&
                subbar.classList.contains("is-open") &&
                openedByClick
              ) {
                closeSubbar();
              } else {
                fillSubbar(li, true);
              }
            });
          }
        });

        subbar.addEventListener("mouseenter", cancelClose);
        subbar.addEventListener("mouseleave", scheduleClose);

        if (arrowLeft) arrowLeft.addEventListener("click", goPrev);
        if (arrowRight) arrowRight.addEventListener("click", goNext);

        // Si la ventana cambia de tamaño, recalculamos desde la primera página
        window.addEventListener("resize", () => {
          if (subbar.classList.contains("is-open")) layoutFirstPage();
        });

        // Si las fuentes web terminan de cargar después, el ancho de los
        // textos puede cambiar: recalculamos para que la paginación sea exacta
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => {
            if (subbar.classList.contains("is-open")) layoutFirstPage();
          });
        }

        // Cerrar todo si se hace clic fuera del menú de primer nivel y de la franja
        document.addEventListener("click", (e) => {
          if (!subbar.classList.contains("is-open")) return;

          const clickedInsideSubbar = subbar.contains(e.target);
          const clickedInsideCurrentLi =
            currentLi && currentLi.contains(e.target);

          if (!clickedInsideSubbar && !clickedInsideCurrentLi) {
            closeSubbar();
          }
        });
      }
    },
  };
})(Drupal, once);