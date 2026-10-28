(function (Drupal, once) {
  Drupal.behaviors.iniciarOndasAudio = {
    attach: function (context, settings) {
      const formatearTiempo = function (segundos) {
        if (isNaN(segundos)) return "0:00";
        const minutos = Math.floor(segundos / 60);
        const segs = Math.floor(segundos % 60);
        return minutos + ":" + (segs < 10 ? "0" : "") + segs;
      };

      once("ondas-audio", ".audio-ondas-contenedor", context).forEach(
        function (contenedor) {
          const urlAudio = contenedor.getAttribute("data-audio-src");
          const lienzo = contenedor.querySelector(".audio-ondas-lienzo");
          const btn = contenedor.querySelector(".audio-ondas-btn");
          const iconoPlay = btn.querySelector(".icono-play");
          const iconoPausa = btn.querySelector(".icono-pausa");

          const tiempoEl = contenedor.querySelector(".audio-ondas-tiempo");
          // Color de la barra de progreso: el de la página (rojo, o el de la facultad)
          const colorPrimario =
            getComputedStyle(contenedor)
              .getPropertyValue("--color-primario")
              .trim() || "#93000b";

          const wavesurfer = WaveSurfer.create({
            container: lienzo,
            waveColor: "#d1d5db",
            progressColor: colorPrimario,
            barWidth: 3,
            barGap: 2,
            barRadius: 2,
            height: 50,
            cursorWidth: 0,
          });

          wavesurfer.load(urlAudio);

          wavesurfer.on("ready", function () {
            const duracion = wavesurfer.getDuration();
            tiempoEl.textContent = "0:00 / " + formatearTiempo(duracion);
          });

          wavesurfer.on("audioprocess", function (tiempoActual) {
            const duracion = wavesurfer.getDuration();
            tiempoEl.textContent =
              formatearTiempo(tiempoActual) + " / " + formatearTiempo(duracion);
          });

          wavesurfer.on("seek", function () {
            const tiempoActual = wavesurfer.getCurrentTime();
            const duracion = wavesurfer.getDuration();
            tiempoEl.textContent =
              formatearTiempo(tiempoActual) + " / " + formatearTiempo(duracion);
          });

          btn.addEventListener("click", function () {
            wavesurfer.playPause();
          });

          wavesurfer.on("play", function () {
            iconoPlay.style.display = "none";
            iconoPausa.style.display = "block";
          });

          wavesurfer.on("pause", function () {
            iconoPlay.style.display = "block";
            iconoPausa.style.display = "none";
          });
        },
      );
    },
  };
})(Drupal, once);
