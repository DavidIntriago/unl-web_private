(function () {
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('#admin-login-toggle');
    if (!toggle) {
      return;
    }
    e.preventDefault();
    var fields = document.getElementById('admin-login-fields');
    if (fields) {
      fields.classList.toggle('is-visible');
    }
  });
})();