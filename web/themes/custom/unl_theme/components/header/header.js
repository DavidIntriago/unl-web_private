/**
 * @file
 * Funcionalidad interactiva para la cabecera de la UNL.
 */
(function (Drupal, once) {
  "use strict";

  Drupal.behaviors.unlHeaderMenu = {
    attach: function (context) {
      // ========================================================================
      // 1. OCULTAR HEADER AL BAJAR / MOSTRAR AL SUBIR
      // ========================================================================
      const headers = once("unl-header-scroll", ".site-header", context);

      headers.forEach((header) => {
        let lastScrollY = window.scrollY;
        const scrollThreshold = 100;

        window.addEventListener(
          "scroll",
          () => {
            const currentScrollY = window.scrollY;
            const menuPanel = document.querySelector(".mobile-menu-panel");
            const isMobileMenuOpen =
              menuPanel && menuPanel.classList.contains("is-open");

            // No ocultar si el menú móvil está abierto o si estamos en la cima de la página
            if (isMobileMenuOpen) return;

            if (
              currentScrollY > lastScrollY &&
              currentScrollY > scrollThreshold
            ) {
              header.classList.add("is-hidden");
            } else {
              header.classList.remove("is-hidden");
            }

            lastScrollY = currentScrollY;
          },
          { passive: true },
        );
      });

      // ========================================================================
      // 2. CONTROL DEL MENÚ MÓVIL GENERAL
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
        });

        // Cerrar el menú si se hace clic fuera del panel y del botón
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
      });

      // ========================================================================
      // 3. CONTROL DE SUBMENÚS EN ESCRITORIO
      // ========================================================================
      const desktopItems = once(
        "unl-desktop-menu-items",
        ".site-header__navigation li",
        context,
      );

      desktopItems.forEach((li) => {
        const subMenu = li.querySelector("ul, .submenu");
        if (subMenu) {
          li.classList.add("has-children");
        }
      });

      // ========================================================================
      // 4. ACORDEÓN DE SUBMENÚS EN EL PANEL MÓVIL (MULTINIVEL)
      // ========================================================================
      const mobileItems = once(
        "unl-mobile-submenu-items",
        ".mobile-menu-panel li",
        context,
      );

      mobileItems.forEach((li) => {
        const subMenu = li.querySelector(":scope > .submenu, :scope > ul");
        if (!subMenu) return;

        li.classList.add("has-children");

        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.className = "submenu-toggle";
        toggleButton.setAttribute("aria-expanded", "false");
        toggleButton.setAttribute("aria-label", "Mostrar submenú");
        toggleButton.innerHTML = '<span class="submenu-toggle__icon"></span>';

        li.appendChild(toggleButton);

        const parentLink = li.querySelector(":scope > a, :scope > span");
        if (
          parentLink &&
          (!parentLink.getAttribute("href") || parentLink.tagName === "SPAN")
        ) {
          parentLink.style.cursor = "pointer";
          parentLink.addEventListener("click", function (e) {
            e.preventDefault();
            toggleButton.click();
          });
        }

        toggleButton.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          const isOpen = li.classList.toggle("is-submenu-open");
          toggleButton.setAttribute("aria-expanded", isOpen ? "true" : "false");

          if (isOpen) {
            subMenu.style.maxHeight = subMenu.scrollHeight + "px";

            let parentSubmenu = li.parentElement.closest(".submenu");
            while (parentSubmenu) {
              parentSubmenu.style.maxHeight =
                parentSubmenu.scrollHeight + subMenu.scrollHeight + "px";
              parentSubmenu = parentSubmenu.parentElement.closest(".submenu");
            }
          } else {
            subMenu.style.maxHeight = null;
          }
        });
      });
    },
  };
})(Drupal, once);
