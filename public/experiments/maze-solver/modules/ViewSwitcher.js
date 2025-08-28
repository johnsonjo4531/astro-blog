window.ViewSwitcher = function (getViews) {
  var currentView = null;
  var that = {
    setView (key,...args) {
      if(Object.keys(that.views).includes(key)) {
        currentView && currentView.unrender();
        currentView = that.views[key];
        currentView.render(...args);
      } else if (Object.values(that.views).includes(key)) {
        currentView && currentView.unrender();
        currentView = key;
        currentView.render(...args);
      } else {
        throw new Error('No renderer by that name');
      }
    },
    set currentView (key) {
      that.setView(key)
    },
    get currentView () {
      return currentView
    }
  }

  Object.assign(that, {
    views: getViews(that)
  });

  return that;
}
