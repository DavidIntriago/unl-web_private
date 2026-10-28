/**
 * @file
 * Comportamientos globales del tema.
 * - Animación al hacer scroll (.animar-scroll).
 * - Botones "ver" y "descargar" en los archivos de los acordeones.
 */

/* =========================================================
   ANIMACIÓN AL HACER SCROLL
   Los elementos con .animar-scroll reciben .visible cuando
   entran en pantalla (una sola vez).
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  document.querySelectorAll(".animar-scroll").forEach((el) => {
    observer.observe(el);
  });
});

/* =========================================================
   BOTONES DE ARCHIVOS EN ACORDEONES
   A cada archivo le agrega un botón "Descargar" y, si es PDF,
   uno "Ver documento" que lo abre en otra pestaña.
   ========================================================= */
(function (Drupal, once) {
  "use strict";

  Drupal.behaviors.botonesAccionArchivos = {
    attach: function (context) {
      const archivos = once("botones-accion", ".acordeon-global-contenido .file", context);

      archivos.forEach((fileWrapper) => {
        const enlaceOriginal = fileWrapper.querySelector("a");
        if (!enlaceOriginal) return;

        const url = enlaceOriginal.getAttribute("href");
        const esPdf =
          fileWrapper.classList.contains("file--mime-application-pdf") ||
          url.toLowerCase().endsWith(".pdf");

        const contenedorAcciones = document.createElement("div");
        contenedorAcciones.className = "archivo-acciones";

        const iconoOjo = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        const iconoDescarga = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;

        if (esPdf) {
          const btnVer = document.createElement("a");
          btnVer.href = url;
          btnVer.target = "_blank";
          btnVer.rel = "noopener";
          btnVer.title = "Ver documento";
          btnVer.className = "btn-archivo btn-ver";
          btnVer.innerHTML = iconoOjo;
          contenedorAcciones.appendChild(btnVer);
        }

        const btnDescarga = document.createElement("a");
        btnDescarga.href = url;
        btnDescarga.setAttribute("download", "");
        btnDescarga.title = "Descargar archivo";
        btnDescarga.className = "btn-archivo btn-descarga";
        btnDescarga.innerHTML = iconoDescarga;
        contenedorAcciones.appendChild(btnDescarga);

        fileWrapper.appendChild(contenedorAcciones);
      });
    },
  };
})(Drupal, once);