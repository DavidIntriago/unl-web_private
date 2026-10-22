/**
 * @file
 * Malla curricular:
 * - Barra de desplazamiento propia (siempre visible, arrastrable).
 *   Solo aparece, junto con "Desliza…", si hay tarjetas que no caben.
 * - Entrada: las tarjetas corren hacia la derecha al aparecer en pantalla.
 */
(function (Drupal, once) {
  "use strict";

  /**
   * Barra propia sincronizada con el desplazamiento de la pista.
   */
  function iniciarBarra(malla) {
    const pista = malla.querySelector(".malla__pista");
    const zona = malla.querySelector(".malla__desplazamiento");
    const barra = malla.querySelector(".malla__barra");
    const pulgar = malla.querySelector(".malla__barra-pulgar");
    if (!pista || !zona || !barra || !pulgar) return;

    // Con JS se esconde la barra del navegador y se usa la propia
    malla.classList.add("malla--barra");

    const sobrante = () => pista.scrollWidth - pista.clientWidth;

    const actualizar = () => {
      const hayMas = sobrante() > 1;
      zona.hidden = !hayMas;
      if (!hayMas) return;

      // Pulgar proporcional a lo que se ve (mínimo 2rem para poder agarrarlo)
      const anchoBarra = barra.clientWidth;
      const anchoPulgar = Math.max(
        anchoBarra * (pista.clientWidth / pista.scrollWidth),
        32,
      );
      const x = (anchoBarra - anchoPulgar) * (pista.scrollLeft / sobrante());

      pulgar.style.width = `${anchoPulgar}px`;
      pulgar.style.transform = `translateX(${x}px)`;
    };

    pista.addEventListener("scroll", actualizar, { passive: true });
    new ResizeObserver(actualizar).observe(pista);
    actualizar();

    // Arrastrar el pulgar
    let arrastrando = false;
    let inicioX = 0;
    let inicioScroll = 0;

    pulgar.addEventListener("pointerdown", (e) => {
      arrastrando = true;
      inicioX = e.clientX;
      inicioScroll = pista.scrollLeft;
      pista.style.scrollSnapType = "none"; // que no "salte" mientras se arrastra
      pulgar.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    pulgar.addEventListener("pointermove", (e) => {
      if (!arrastrando) return;
      const recorrido = barra.clientWidth - pulgar.offsetWidth;
      if (recorrido <= 0) return;
      pista.scrollLeft = inicioScroll + (e.clientX - inicioX) * (sobrante() / recorrido);
    });

    const soltar = () => {
      if (!arrastrando) return;
      arrastrando = false;
      pista.style.scrollSnapType = "";
    };
    pulgar.addEventListener("pointerup", soltar);
    pulgar.addEventListener("pointercancel", soltar);

    // Clic en la barra (fuera del pulgar): salta a esa posición
    barra.addEventListener("click", (e) => {
      if (e.target !== barra) return;
      const recorrido = barra.clientWidth - pulgar.offsetWidth;
      if (recorrido <= 0) return;
      const proporcion = (e.offsetX - pulgar.offsetWidth / 2) / recorrido;
      pista.scrollTo({
        left: Math.min(Math.max(proporcion, 0), 1) * sobrante(),
        behavior: "smooth",
      });
    });
  }

  /**
   * Entrada: tarjetas escondidas a la izquierda que corren a su lugar
   * cuando la sección aparece. Al terminar, se quita el retraso escalonado.
   */
  function iniciarEntrada(malla) {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducido || !("IntersectionObserver" in window)) return;

    malla.classList.add("malla--animar");
    const total = malla.querySelectorAll(".malla__periodo").length;

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          malla.classList.add("is-visible");
          observador.disconnect();
          // 80 ms por tarjeta + 600 ms de la animación
          setTimeout(() => malla.classList.add("malla--lista"), total * 80 + 600);
        });
      },
      { threshold: 0.2 },
    );

    observador.observe(malla);
  }

  Drupal.behaviors.mallaCurricular = {
    attach(context) {
      once("malla-curricular", ".malla", context).forEach((malla) => {
        iniciarBarra(malla);
        iniciarEntrada(malla);
      });
    },
  };
})(Drupal, once);