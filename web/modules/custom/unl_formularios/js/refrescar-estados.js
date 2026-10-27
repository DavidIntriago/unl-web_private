/**
 * @file
 * Aplica los #states a los campos que llegan por AJAX (por ejemplo, una
 * tarjeta que se abre después de cargar la página).
 *
 * Drupal solo avisa a los campos dependientes cuando el desplegable CAMBIA
 * de valor. Un campo que llega después nunca recibe ese aviso, así que aquí
 * se le manda directamente el valor actual de cada desplegable del que depende.
 */
(function ($, Drupal, once) {
  "use strict";

  /**
   * Recorre la regla (objeto o lista con "or") y junta los selectores
   * de los campos de los que depende: las claves que llevan [name=...].
   */
  function juntarSelectores(regla, selectores) {
    if (Array.isArray(regla)) {
      regla.forEach((parte) => juntarSelectores(parte, selectores));
    } else if (regla && typeof regla === "object") {
      Object.entries(regla).forEach(([clave, valor]) => {
        if (clave.includes("[name=")) {
          selectores.add(clave);
        }
        juntarSelectores(valor, selectores);
      });
    }
  }

  /**
   * Manda a los dependientes el valor actual del campo, como si acabara
   * de cambiar (oldValue: null obliga a que se vuelva a evaluar).
   */
  function avisarValorActual(selector) {
    const $campo = $(selector);
    if (!$campo.length) {
      return;
    }

    // Radios: el valor es el de la opción marcada.
    const valor = $campo.is(":radio")
      ? $campo.filter(":checked").val()
      : $campo.val();

    $campo.trigger({ type: "state:value", value: valor, oldValue: null });

    // Casillas: además el estado "checked".
    if ($campo.is(":checkbox")) {
      $campo.trigger({ type: "state:checked", value: $campo.prop("checked"), oldValue: null });
    }
  }

  Drupal.behaviors.unlFormulariosRefrescarEstados = {
    attach(context) {
      // En la carga inicial Drupal ya lo hace solo.
      if (context === document) {
        return;
      }

      const selectores = new Set();

      once("unl-refrescar-estados", "[data-drupal-states]", context).forEach((elemento) => {
        try {
          juntarSelectores(JSON.parse(elemento.getAttribute("data-drupal-states")), selectores);
        } catch (error) {
          // Regla con formato inesperado: se ignora.
        }
      });

      selectores.forEach(avisarValorActual);
    },
  };
})(jQuery, Drupal, once);