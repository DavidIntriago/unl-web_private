/**
 * @file
 * Panel lateral "Ver perfil" del componente Perfil (estilo autoridades).
 * Es el mismo panel que tenía la variante autoridades de tarjeta.js,
 * con clases y data-atributos propios (data-perfil-*) para que no
 * choque con el código viejo mientras conviven los dos.
 *
 * Los íconos de redes salen de la clase global .icono-red
 * (dibujos en variables.css): aquí no hay SVGs propios.
 */
(function (Drupal, once) {
  "use strict";

  /**
   * Redes que se reconocen en la información adicional.
   * tipo   → clase .icono-red--{tipo} (ver base.css)
   * nombre → lo que leen los lectores de pantalla y el title
   */
  const REDES = [
    { tipo: "orcid", nombre: "ORCID", regex: /https?:\/\/(www\.)?orcid\.org\/[\w-]+/gi },
    { tipo: "researchgate", nombre: "ResearchGate", regex: /https?:\/\/(www\.)?researchgate\.net\/\S+/gi },
    { tipo: "google_scholar", nombre: "Google Scholar", regex: /https?:\/\/(www\.)?scholar\.google\.com\/\S+/gi },
    { tipo: "linkedin", nombre: "LinkedIn", regex: /https?:\/\/(www\.)?linkedin\.com\/\S+/gi },
    { tipo: "facebook", nombre: "Facebook", regex: /https?:\/\/(www\.)?facebook\.com\/\S+/gi },
    { tipo: "instagram", nombre: "Instagram", regex: /https?:\/\/(www\.)?instagram\.com\/\S+/gi },
    { tipo: "x", nombre: "X", regex: /https?:\/\/(www\.)?(twitter|x)\.com\/\S+/gi },
    { tipo: "youtube", nombre: "YouTube", regex: /https?:\/\/(www\.)?youtube\.com\/\S+/gi },
    { tipo: "tiktok", nombre: "TikTok", regex: /https?:\/\/(www\.)?tiktok\.com\/\S+/gi },
    { tipo: "whatsapp", nombre: "WhatsApp", regex: /https?:\/\/(www\.)?wa\.me\/\S+/gi },
  ];

  /**
   * Busca URLs conocidas dentro de un texto (HTML o plano),
   * las separa del contenido y arma la lista de {tipo, nombre, url}.
   */
  function extraerEnlaces(contenidoHtml) {
    const enlaces = [];
    let textoLimpio = contenidoHtml;

    REDES.forEach(({ tipo, nombre, regex }) => {
      const coincidencias = textoLimpio.match(regex);
      if (coincidencias) {
        coincidencias.forEach((url) =>
          enlaces.push({ tipo, nombre, url: url.replace(/[.,;]+$/, "") }),
        );
        textoLimpio = textoLimpio.replace(regex, "");
      }
    });

    // Cualquier URL restante que no es de una red conocida: ícono genérico
    const urlGenerica = /https?:\/\/\S+/gi;
    const coincidenciasGenericas = textoLimpio.match(urlGenerica);
    if (coincidenciasGenericas) {
      coincidenciasGenericas.forEach((url) =>
        enlaces.push({ tipo: "enlace", nombre: "Enlace", url: url.replace(/[.,;]+$/, "") }),
      );
      textoLimpio = textoLimpio.replace(urlGenerica, "");
    }

    return { enlaces, textoLimpio };
  }

  /**
   * Escapa texto para meterlo dentro de HTML o de un atributo sin riesgo.
   */
  function escaparHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML.replace(/"/g, "&quot;");
  }

  /**
   * Arma la fila de íconos de redes del panel.
   */
  function htmlRedes(enlaces) {
    if (!enlaces.length) {
      return "";
    }

    const iconos = enlaces
      .map(
        (e) => `
        <a href="${escaparHtml(e.url)}" class="perfil-modal__red-icono" target="_blank" rel="noopener noreferrer" aria-label="${e.nombre}" title="${e.nombre}">
          <span class="icono-red icono-red--${e.tipo}" aria-hidden="true"></span>
        </a>`,
      )
      .join("");

    return `<div class="perfil-modal__redes">${iconos}</div>`;
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
            const iconosHtml = htmlRedes(enlaces);

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