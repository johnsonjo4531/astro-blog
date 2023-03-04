window.Events = (function ($$) {
  function on (selector, event, cb) {
    $$(selector).forEach(function (el) {
      el.addEventListener(event, cb);
    })
  }

  function once (selector, event, cb) {
    $$(selector).forEach(function (el) {
      function listener (e) {
        cb.call(this, e);
        el.removeEventListener(event, listener)
      }
      el.addEventListener(event, listener);
    })
  }

  return {
    on,
    once
  }
})($$);
