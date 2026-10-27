/**
 * @file
 * Panel lateral "Ver perfil" del componente Perfil (estilo autoridades).
 * Es el mismo panel que tenía la variante autoridades de tarjeta.js,
 * con clases y data-atributos propios (data-perfil-*) para que no
 * choque con el código viejo mientras conviven los dos.
 */
(function (Drupal, once) {
  "use strict";

  const ICONOS_REDES = {
    facebook:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',

    twitter:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.5 8.6L23 22h-6.9l-5.4-6.9L4.5 22H1.4l8-9.2L1 2h7l4.9 6.3Zm-1.2 18h1.9L7.4 3.9H5.3Z"/></svg>',

    instagram:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.3"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',

    linkedin:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56Z"/></svg>',

    youtube:
      '<svg viewBox="0 0 24 24"><rect x="1" y="4.5" width="22" height="15" rx="4" fill="currentColor"/><path d="M10 8.6v6.8l6-3.4Z" fill="#fff"/></svg>',

    orcid:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 01-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z"/></svg>',

    researchgate:
      '<svg viewBox="0 0 448 512" fill="currentColor"><path d="M0 32v448h448V32H0zm262.2 334.4c-6.6 3-33.2 6-50-14.2-9.2-10.6-25.3-33.3-42.2-63.6-8.9 0-14.7 0-21.4-.6v46.4c0 23.5 6 21.2 25.8 23.9v8.1c-6.9-.3-23.1-.8-35.6-.8-13.1 0-26.1.6-33.6.8v-8.1c15.5-2.9 22-1.3 22-23.9V225c0-22.6-6.4-21-22-23.9V193c25.8 1 53.1-.6 70.9-.6 31.7 0 55.9 14.4 55.9 45.6 0 21.1-16.7 42.2-39.2 47.5 13.6 24.2 30 45.6 42.2 58.9 7.2 7.8 17.2 14.7 27.2 14.7v7.3zm22.9-135c-23.3 0-32.2-15.7-32.2-32.2V167c0-12.2 8.8-30.4 34-30.4s30.4 17.9 30.4 17.9l-10.7 7.2s-5.5-12.5-19.7-12.5c-7.9 0-19.7 7.3-19.7 19.7v26.8c0 13.4 6.6 23.3 17.9 23.3 14.1 0 21.5-10.9 21.5-26.8h-17.9v-10.7h30.4c0 20.5 4.7 49.9-34 49.9zm-116.5 44.7c-9.4 0-13.6-.3-20-.8v-69.7c6.4-.6 15-.6 22.5-.6 23.3 0 37.2 12.2 37.2 34.5 0 21.9-15 36.6-39.7 36.6z"/></svg>',

    google_scholar:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.242 13.769 0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 100 14 7 7 0 000-14z"/></svg>',

    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  };

  /**
   * Busca URLs conocidas dentro de un texto (HTML o plano),
   * las separa del contenido y arma la lista de {tipo, url}.
   */
  function extraerEnlaces(contenidoHtml) {
    const patrones = [
      { tipo: "orcid", regex: /https?:\/\/(www\.)?orcid\.org\/[\w-]+/gi },
      { tipo: "researchgate", regex: /https?:\/\/(www\.)?researchgate\.net\/\S+/gi },
      { tipo: "linkedin", regex: /https?:\/\/(www\.)?linkedin\.com\/\S+/gi },
      { tipo: "facebook", regex: /https?:\/\/(www\.)?facebook\.com\/\S+/gi },
      { tipo: "instagram", regex: /https?:\/\/(www\.)?instagram\.com\/\S+/gi },
      { tipo: "twitter", regex: /https?:\/\/(www\.)?(twitter|x)\.com\/\S+/gi },
      { tipo: "youtube", regex: /https?:\/\/(www\.)?youtube\.com\/\S+/gi },
      { tipo: "google_scholar", regex: /https?:\/\/(www\.)?scholar\.google\.com\/\S+/gi },
    ];

    const enlaces = [];
    let textoLimpio = contenidoHtml;

    patrones.forEach(({ tipo, regex }) => {
      const coincidencias = textoLimpio.match(regex);
      if (coincidencias) {
        coincidencias.forEach((url) =>
          enlaces.push({ tipo, url: url.replace(/[.,;]+$/, "") }),
        );
        textoLimpio = textoLimpio.replace(regex, "");
      }
    });

    // Cualquier URL restante que no matcheó ninguna red conocida
    const urlGenerica = /https?:\/\/\S+/gi;
    const coincidenciasGenericas = textoLimpio.match(urlGenerica);
    if (coincidenciasGenericas) {
      coincidenciasGenericas.forEach((url) =>
        enlaces.push({ tipo: "link", url: url.replace(/[.,;]+$/, "") }),
      );
      textoLimpio = textoLimpio.replace(urlGenerica, "");
    }

    return { enlaces, textoLimpio };
  }

  /**
   * Escapa texto para meterlo dentro de HTML sin riesgo.
   */
  function escaparHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
  }

  Drupal.behaviors.perfilPanelLateral = {
    attach: function (context) {
      once("perfil-panel-lateral", "[data-perfil-toggle]", context).forEach(
        (boton, indice) => {
          const tarjeta = boton.closest(".perfil");
          const marco = boton.closest(".perfil__marco");
          if (!tarjeta || !marco) {
            return;
          }

          const info = marco.querySelector("[data-perfil-info]");
          const nombre = marco.querySelector(".perfil__nombre");
          const cargo = marco.querySelector(".perfil__cargo");
          const foto = tarjeta.querySelector(".perfil__imagen img");

          boton.addEventListener("click", () => {
            const { enlaces, textoLimpio } = extraerEnlaces(info.innerHTML);
            const idTitulo = `perfil-modal-titulo-${indice}`;

            const iconosHtml = enlaces.length
              ? `<div class="perfil-modal__redes">
      ${enlaces
        .map(
          (e) =>
            `<a href="${e.url}" class="perfil-modal__red-icono" target="_blank" rel="noopener noreferrer" aria-label="${e.tipo.replace("_", " ")}" title="${e.tipo.replace("_", " ")}">${ICONOS_REDES[e.tipo] || ""}</a>`,
        )
        .join("")}
    </div>`
              : "";

            // Foto de la misma tarjeta, solo si de verdad cargó
            // (si no hay foto o está rota, el panel se arma sin ella)
            const fotoValida = foto && foto.complete && foto.naturalWidth > 0;
            const fotoHtml = fotoValida
              ? `<img class="perfil-modal__foto" src="${foto.currentSrc || foto.src}" alt="${escaparHtml(foto.alt || "")}">`
              : "";

            const nombreTexto = nombre ? nombre.textContent.trim() : "";
            const cargoTexto = cargo ? cargo.textContent.trim() : "";

            const fondo = document.createElement("div");
            fondo.className = "perfil-modal-fondo";
            fondo.innerHTML = `
    <div class="perfil-modal" role="dialog" aria-modal="true" ${nombreTexto ? `aria-labelledby="${idTitulo}"` : 'aria-label="Perfil"'}>
      <button type="button" class="perfil-modal__cerrar" aria-label="Cerrar">×</button>
      <header class="perfil-modal__cabecera">
        ${fotoHtml}
        <div class="perfil-modal__datos">
          ${nombreTexto ? `<h4 class="perfil-modal__nombre" id="${idTitulo}">${escaparHtml(nombreTexto)}</h4>` : ""}
          ${cargoTexto ? `<p class="perfil-modal__cargo">${escaparHtml(cargoTexto)}</p>` : ""}
        </div>
      </header>
      <div class="perfil-modal__cuerpo">
        ${textoLimpio}
        ${iconosHtml}
      </div>
    </div>
  `;
            document.body.appendChild(fondo);
            document.body.style.overflow = "hidden";

            const panel = fondo.querySelector(".perfil-modal");
            const botonCerrar = fondo.querySelector(".perfil-modal__cerrar");

            // .is-open en el siguiente cuadro para que el panel
            // entre deslizándose desde la derecha
            requestAnimationFrame(() => {
              requestAnimationFrame(() => fondo.classList.add("is-open"));
            });
            botonCerrar.focus();

            let cerrado = false;
            const cerrar = () => {
              if (cerrado) return;
              cerrado = true;
              fondo.classList.remove("is-open");
              document.removeEventListener("keydown", alPresionarTecla);

              const quitar = () => {
                fondo.remove();
                document.body.style.overflow = "";
                boton.focus();
              };
              // Espera a que termine la salida; si no hay animación
              // (movimiento reducido), igual se quita a los 450 ms
              panel.addEventListener("transitionend", quitar, { once: true });
              setTimeout(() => {
                if (fondo.isConnected) quitar();
              }, 450);
            };

            // Esc cierra; Tab no se escapa del panel mientras está abierto
            const alPresionarTecla = (e) => {
              if (e.key === "Escape") {
                cerrar();
                return;
              }
              if (e.key !== "Tab") return;

              const enfocables = panel.querySelectorAll(
                'a[href], button, [tabindex]:not([tabindex="-1"])',
              );
              const primero = enfocables[0];
              const ultimo = enfocables[enfocables.length - 1];

              if (e.shiftKey && document.activeElement === primero) {
                e.preventDefault();
                ultimo.focus();
              } else if (!e.shiftKey && document.activeElement === ultimo) {
                e.preventDefault();
                primero.focus();
              }
            };

            fondo.addEventListener("click", (e) => {
              if (e.target === fondo) cerrar();
            });
            botonCerrar.addEventListener("click", cerrar);
            document.addEventListener("keydown", alPresionarTecla);
          });
        },
      );
    },
  };
})(Drupal, once);