window.ViewSwitcher=function(e){var r=null,n={setView(e,...i){if(Object.keys(n.views).includes(e))r&&r.unrender(),(r=n.views[e]).render(...i);else{if(!Object.values(n.views).includes(e))throw new Error("No renderer by that name");r&&r.unrender(),(r=e).render(...i)}},set currentView(e){n.setView(e)},get currentView(){return r}};return Object.assign(n,{views:e(n)}),n};
//# sourceMappingURL=index.091d75a4.js.map
