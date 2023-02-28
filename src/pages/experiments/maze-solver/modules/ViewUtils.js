window.ViewUtils = (function () {
  function showUnshowRenderer (selector) {
    return {
      render () {
        Array.from(document.querySelectorAll(selector)).forEach(function (el) {
          el.classList.remove('hidden');
        });
      },
      unrender () {
        Array.from(document.querySelectorAll(selector)).forEach(function (el) {
          el.classList.add('hidden');
        });
      }
    }
  }
  
  return {
    showUnshowRenderer
  };
})();
