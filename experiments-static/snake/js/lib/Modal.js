window.Modal = function Modal (spec) {
  var view = document.createElement('div');
  view.classList.add("modal-view");
  var resolve, reject;
  var promiseModalView = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  spec.postRender = spec.postRender || (()=>{});
  return Promise.resolve(spec.render(view, resolve, reject)).then(function () {
    (spec.insertTo || document.body).appendChild(view);
    return spec.postRender(view);
  }).then(function () {
    return promiseModalView;
  }).then(function (input) {
    view.parentElement.removeChild(view);
    return input;
  }, function (error) {
    view.parentElement.removeChild(view);
    throw error;
  });
}
