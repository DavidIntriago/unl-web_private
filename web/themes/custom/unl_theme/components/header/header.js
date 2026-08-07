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
                const menuButton = document.querySelector(".mobile-menu-button");
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
          { passive: true }
        );
      });

      // ========================================================================
      // 2. CONTROL DEL BOTÓN HAMBURGUESA MÓVIL
      // ========================================================================
      const menuButtons = once(
        "unl-header-mobile-toggle",
        ".mobile-menu-button",
        context
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
        context
      );

      // Lista raíz del menú. OJO: no usamos ">" (hijo directo de <nav>)
      // porque Drupal suele envolver el <ul> del menú en un <div> del
      // bloque (a veces con un <h2> de título antes). Como en el HTML
      // el <ul> de primer nivel siempre aparece ANTES que cualquier
      // <ul> anidado dentro de sus <li>, el primer <ul> que encuentre
      // el selector (sin ">") es siempre el de nivel 1.
      const topLevelList = document.querySelector(".site-header__navigation ul");

      desktopItems.forEach((li) => {
        // :scope > asegura que solo cuente un submenú que sea HIJO DIRECTO,
        // no cualquier <ul> anidado en niveles más profundos.
        const subMenu = li.querySelector(":scope > ul, :scope > .submenu");
        if (subMenu) {
          li.classList.add("has-children");

          // Si el <li> pertenece al primer nivel (hijo directo de la lista raíz),
          // lo marcamos como disparador de mega menú.
          if (topLevelList && li.parentElement === topLevelList) {
            li.classList.add("has-mega-menu");
          }
        }
      });

      // ========================================================================
      // 4. ACORDEÓN EN MÓVIL (EL PADRE ABRE HIJOS SIN REDIRIGIR)
      // ========================================================================
      const mobileItems = once(
        "unl-mobile-submenu-items",
        ".mobile-menu-panel li",
        context
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
          toggleButton.setAttribute("aria-expanded", willOpen ? "true" : "false");
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
      // 5. FRANJA DE SUBMENÚS (nivel 2) SEGÚN EL ITEM DEL NIVEL 1 EN HOVER
      // ========================================================================
      const subbar = document.querySelector(".site-header__subbar");
      const subbarInner = document.querySelector(".site-header__subbar-inner");

      if (subbar && subbarInner && topLevelList) {
        const topLevelItems = topLevelList.querySelectorAll(
          ":scope > li.has-children"
        );

        let closeTimeout = null;

        const fillSubbar = (li) => {
          if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
          }

          const level2Items = li.querySelectorAll(
            ":scope > ul > li, :scope > .submenu > .submenu-list > li"
          );

          if (!level2Items.length) {
            subbar.classList.remove("is-open");
            subbarInner.innerHTML = "";
            return;
          }

          subbarInner.innerHTML = "";

          level2Items.forEach((level2Li) => {
            const link = level2Li.querySelector(":scope > a");
            if (!link) return;

            const wrapper = document.createElement("div");
            wrapper.className = "site-header__subbar-item";

            const linkClone = link.cloneNode(true);
            wrapper.appendChild(linkClone);

            // Si este item de nivel 2 tiene hijos (nivel 3), armamos su mini-dropdown
            const level3Items = level2Li.querySelectorAll(
              ":scope > ul > li > a, :scope > .submenu > .submenu-list > li > a"
            );

            if (level3Items.length) {
              wrapper.classList.add("has-flyout");

              const flyout = document.createElement("div");
              flyout.className = "site-header__subbar-flyout";

              level3Items.forEach((level3Link) => {
                flyout.appendChild(level3Link.cloneNode(true));
              });

              wrapper.appendChild(flyout);
            }

            subbarInner.appendChild(wrapper);
          });

          subbar.classList.add("is-open");
        };

        const scheduleClose = () => {
          if (closeTimeout) clearTimeout(closeTimeout);
          closeTimeout = setTimeout(() => {
            subbar.classList.remove("is-open");
            subbarInner.innerHTML = "";
          }, 300); // 300ms de margen para cruzar hacia la franja
        };

        const cancelClose = () => {
          if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
          }
        };

        topLevelItems.forEach((li) => {
          li.addEventListener("mouseenter", () => fillSubbar(li));
          li.addEventListener("mouseleave", scheduleClose);

          const directLink = li.querySelector(":scope > a");
          if (directLink) {
            directLink.addEventListener("touchstart", () => fillSubbar(li), {
              passive: true,
            });
          }
        });

        // La franja blanca en sí también cancela el cierre mientras el
        // mouse esté sobre ella, y lo reprograma al salir de ella.
        subbar.addEventListener("mouseenter", cancelClose);
        subbar.addEventListener("mouseleave", scheduleClose);
      }
    },
  };
})(Drupal, once);