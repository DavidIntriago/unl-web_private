/**
 * @file
 * Fuerza target="_blank" + rel="noopener noreferrer" en enlaces externos y descargas de documentos.
 */
(function (Drupal, once) {
  "use strict";

  Drupal.behaviors.enlacesExternosSeguro = {
    attach: function (context) {
      const enlaces = once("enlace-externo-seguro", "a[href]", context);

      const extensionesDoc = /\.(pdf|docx?|xlsx?|pptx?|zip|rar)$/i;

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
        const esArchivoDoc = extensionesDoc.test(url.pathname);

        if (esExterno || esArchivoDoc) {
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