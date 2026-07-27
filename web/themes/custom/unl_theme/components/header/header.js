/**
 * @file
 * Funcionalidad interactiva para la cabecera de la UNL.
 */
(function (Drupal) {
  "use strict";

  Drupal.behaviors.unlHeaderMenu = {
    attach: function (context) {
      // 1. CONTROL DEL MENÚ MÓVIL GENERAL
      const menuButton = context.querySelector(".mobile-menu-button");
      const menuPanel = document.querySelector(".mobile-menu-panel");

      if (
        menuButton &&
        menuPanel &&
        !menuButton.classList.contains("js-menu-initialized")
      ) {
        menuButton.classList.add("js-menu-initialized");
        menuButton.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation(); // evita que este mismo clic dispare el listener de "fuera"
          menuButton.classList.toggle("is-active");
          menuPanel.classList.toggle("is-open");
        });

        // Cerrar el menú si se hace clic fuera del panel y del botón
        document.addEventListener("click", function (e) {
          const isOpen = menuPanel.classList.contains("is-open");
          if (!isOpen) {
            return;
          }

          const clickedInsidePanel = menuPanel.contains(e.target);
          const clickedButton = menuButton.contains(e.target);

          if (!clickedInsidePanel && !clickedButton) {
            menuButton.classList.remove("is-active");
            menuPanel.classList.remove("is-open");
          }
        });
      }

      // 2. CONTROL DE SUBMENÚS EN ESCRITORIO (solo marca la clase, el hover lo hace el CSS)
      const desktopItems = context.querySelectorAll(
        ".site-header__navigation li",
      );
      desktopItems.forEach(function (li) {
        const subMenu = li.querySelector("ul, .submenu");
        if (subMenu) {
          li.classList.add("has-children");
        }
      });

      // 3. ACORDEÓN DE SUBMENÚS EN EL PANEL MÓVIL
      const mobileItems = context.querySelectorAll(".mobile-menu-panel li");

      mobileItems.forEach(function (li) {
        const subMenu = li.querySelector(".submenu");
        if (!subMenu || li.classList.contains("js-accordion-initialized")) {
          return;
        }

        li.classList.add("has-children", "js-accordion-initialized");

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
          } else {
            subMenu.style.maxHeight = null;
          }
        });
      });
    },
  };
})(Drupal);