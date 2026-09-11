(function (Drupal, once) {
  "use strict";

  function inicializarCarrusel(contenedor, prefijoClase) {
    const viewport = contenedor.querySelector(`.carrusel-${prefijoClase}-viewport`);
    const track = contenedor.querySelector(`.carrusel-${prefijoClase}-track`);
    const btnPrev = contenedor.querySelector(`.carrusel-${prefijoClase}-flecha.prev`);
    const btnNext = contenedor.querySelector(`.carrusel-${prefijoClase}-flecha.next`);

    if (!viewport || !track) {
      return;
    }

    const n = track.children.length;

    if (n <= 1) {
      if (btnPrev) btnPrev.style.display = "none";
      if (btnNext) btnNext.style.display = "none";
      return;
    }

    const calcularPaso = () => {
      const estiloTrack = getComputedStyle(track);
      const gap = parseFloat(estiloTrack.columnGap || estiloTrack.gap || "0") || 0;
      return track.firstElementChild.getBoundingClientRect().width + gap;
    };

    const contarVisibles = () => {
      const anchoViewport = viewport.getBoundingClientRect().width;
      const paso = calcularPaso();
      return paso > 0 ? Math.max(Math.round(anchoViewport / paso), 1) : 1;
    };

    const peekPx = () => parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
    const posReposo = () => -(calcularPaso() - peekPx());

    let temporizador;
    let animando = false;
    let vieneDeSiguiente = false;
    const DURACION_AUTOPLAY = 5000;

    const irSiguiente = () => {
      if (animando) return;
      animando = true;
      vieneDeSiguiente = true;
      track.style.transition = "";
      track.style.transform = `translateX(${posReposo() - calcularPaso()}px)`;
    };

    const irAnterior = () => {
      if (animando) return;
      animando = true;
      vieneDeSiguiente = false;

      const paso = calcularPaso();
      const ultimo = track.lastElementChild;
      track.style.transition = "none";
      track.insertBefore(ultimo, track.firstElementChild);
      track.style.transform = `translateX(${posReposo() - paso}px)`;
      void track.offsetHeight;
      track.style.transition = "";
      track.style.transform = `translateX(${posReposo()}px)`;
    };

    track.addEventListener("transitionend", (e) => {
      if (e.target !== track || e.propertyName !== "transform") {
        return;
      }

      if (vieneDeSiguiente) {
        const primero = track.firstElementChild;
        track.style.transition = "none";
        track.appendChild(primero);
        track.style.transform = `translateX(${posReposo()}px)`;
        void track.offsetHeight;
      }

      vieneDeSiguiente = false;
      animando = false;
    });

    const iniciarAutoplay = () => {
      temporizador = setInterval(irSiguiente, DURACION_AUTOPLAY);
    };

    const reiniciarAutoplay = () => {
      clearInterval(temporizador);
      iniciarAutoplay();
    };

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        irSiguiente();
        reiniciarAutoplay();
      });
    }
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        irAnterior();
        reiniciarAutoplay();
      });
    }

    let touchStartX = 0;
    const UMBRAL_SWIPE = 40;

    viewport.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener("touchend", (e) => {
      const distancia = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(distancia) < UMBRAL_SWIPE) return;
      if (distancia < 0) {
        irSiguiente();
      } else {
        irAnterior();
      }
      reiniciarAutoplay();
    }, { passive: true });

    contenedor.addEventListener("mouseenter", () => clearInterval(temporizador));
    contenedor.addEventListener("mouseleave", iniciarAutoplay);

    if (n <= contarVisibles()) {
      if (btnPrev) btnPrev.style.display = "none";
      if (btnNext) btnNext.style.display = "none";
      return;
    }

    if (peekPx() > 0) {
      track.insertBefore(track.lastElementChild, track.firstElementChild);
      track.style.transition = "none";
      track.style.transform = `translateX(${posReposo()}px)`;
      void track.offsetHeight;
      track.style.transition = "";
    }

    iniciarAutoplay();
  }

  Drupal.behaviors.gridTarjetasCarrusel = {
    attach: function (context) {
      once("sitios-interes-carrusel-init", ".grid-tarjetas-container--sitios_interes", context)
        .forEach((contenedor) => inicializarCarrusel(contenedor, "sitios"));
    },
  };
})(Drupal, once);