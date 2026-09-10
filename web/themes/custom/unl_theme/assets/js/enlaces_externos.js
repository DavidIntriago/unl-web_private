/**
 * @file
 * Fuerza target="_blank" + rel="noopener noreferrer" en todo enlace externo del sitio, para prevenir tabnabbing (secuestro de pestaña vía window.opener) sin depender de que cada editor lo marque manual.
 */
(function (Drupal, once) {
  "use strict";

  Drupal.behaviors.enlacesExternosSeguro = {
    attach: function (context) {
      const enlaces = once("enlace-externo-seguro", "a[href]", context);

      enlaces.forEach((enlace) => {
        const href = enlace.getAttribute("href");

        // Ignorar anclas internas, mailto, tel y hrefs vacíos
        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
          return;
        }

        let url;
        try {
          url = new URL(href, window.location.origin);
        } catch (e) {
          return; // href mal formado
        }

        const esExterno = url.hostname !== window.location.hostname;

        if (esExterno) {
          enlace.setAttribute("target", "_blank");

          const relActual = (enlace.getAttribute("rel") || "").split(" ").filter(Boolean);
          ["noopener", "noreferrer"].forEach((valor) => {
            if (!relActual.includes(valor)) {
              relActual.push(valor);
            }
          });
          enlace.setAttribute("rel", relActual.join(" "));
        }
      });
    },
  };
})(Drupal, once);