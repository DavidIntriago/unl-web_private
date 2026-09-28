((Drupal, once) => {
  Drupal.behaviors.notificacionFlotante = {
    attach: function (context) {
      once('close-alert', '.js-close-alert', context).forEach(button => { 
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const container = button.closest('.unl-alert__container');
          if (container) {
            container.classList.add('is-closing');
            setTimeout(() => {
              container.remove(); 
            }, 300); 
          }
        });
      });
    }
  };
})(Drupal, once);