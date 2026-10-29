/**
 * GRID PERFILES — botón "Ver todos".
 *
 * En los estilos completo y corto (data-perfiles-visibles en el bloque)
 * se muestran las primeras N personas. Si hay más, las demás se marcan
 * con .grid-perfiles__extra (el CSS las esconde mientras el bloque está
 * .is-plegado) y se agrega un botón debajo para mostrarlas u ocultarlas.
 * Sin JS se ven todas, como antes.
 */
(function (Drupal, once) {
  "use strict";

  /**
   * La "celda" del grid de un perfil: Drupal mete envoltorios alrededor
   * (algunos con display: contents). Se sube hasta el elemento que de
   * verdad ocupa un lugar en el grid, para esconder ese.
   */
  function celdaDe(perfil, grid) {
    let elemento = perfil;
    while (
      elemento.parentElement &&
      elemento.parentElement !== grid &&
      getComputedStyle(elemento.parentElement).display !== "contents"
    ) {
      elemento = elemento.parentElement;
    }
    return elemento;
  }

  Drupal.behaviors.gridPerfilesVerTodos = {
    attach(context) {
      once("grid-perfiles-ver-todos", ".grid-perfiles[data-perfiles-visibles]", context).forEach((bloque) => {
        const grid = bloque.querySelector(".grid-perfiles__grid");
        if (!grid) {
          return;
        }

        const visibles = parseInt(bloque.dataset.perfilesVisibles, 10) || 6;
        const celdas = Array.from(grid.querySelectorAll(".perfil")).map((perfil) => celdaDe(perfil, grid));
        const extra = celdas.slice(visibles);
        if (!extra.length) {
          return;
        }

        extra.forEach((celda) => celda.classList.add("grid-perfiles__extra"));
        bloque.classList.add("is-plegado");

        if (!grid.id) {
          grid.id = "grid-perfiles-" + Math.random().toString(36).slice(2, 8);
        }

        const textoCerrado = Drupal.t("Ver todos (@total)", { "@total": celdas.length });
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "grid-perfiles__ver-todas";
        boton.setAttribute("aria-controls", grid.id);
        boton.setAttribute("aria-expanded", "false");
        boton.textContent = textoCerrado;

        const acciones = document.createElement("div");
        acciones.className = "grid-perfiles__acciones";
        acciones.append(boton);
        grid.after(acciones);

        const pocoMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

        boton.addEventListener("click", () => {
          const abierto = !bloque.classList.toggle("is-plegado");
          boton.setAttribute("aria-expanded", String(abierto));
          boton.textContent = abierto ? Drupal.t("Ver menos") : textoCerrado;

          if (abierto) {
            // Para teclado: el foco pasa a la primera persona que apareció
            const enlace = extra[0].querySelector("a, button");
            if (enlace) {
              enlace.focus({ preventScroll: true });
            }
          }
          else {
            // Al cerrar, vuelve al inicio de la sección
            bloque.scrollIntoView({
              behavior: pocoMovimiento.matches ? "auto" : "smooth",
              block: "start",
            });
          }
        });
      });
    },
  };
})(Drupal, once);