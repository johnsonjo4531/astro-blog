window.ViewSwitcher=function(e){var n={addView:i,addViews:function(...e){for(var n of e)i(n)},loadView:r};function i(e){n.views.get(e)||($$(`[data-view-transition="${e.name}"`).forEach((e=>{e.addEventListener("click",(function(e){r(this.dataset.viewTransition)}))})),e.init(),n.views.set(e.name,e))}function t(e,n){return Object.assign(e,{name:n})}function r(i,...r){let a=n.views.get(i);if(a)n.currentView&&($$(`[data-view="${n.currentView.name}"]`).forEach((e=>{e.classList.add("hidden")})),n.currentView.unrender()),$$(`[data-view="${a.name}"]`).forEach((e=>{e.classList.remove("hidden")})),n.events.dispatchEvent(t(new Event("view-loading"),a.name)),a.render(...r),n.previousView=n.currentView,n.currentView=a,n.events.dispatchEvent(t(new Event("view-loaded"),a.name));else{if(!e)throw new Error(errMsg);try{e.loadView(i)}catch(e){const n=`No such view, '${i}', to load`;if(e.message!==n)throw new Error(n)}}}return $$("[data-view]").forEach((e=>{e.classList.add("hidden")})),n.views=new Map,n.events=document.createElement("div"),n.previousView=null,n.currentView=null,n};
//# sourceMappingURL=index.ab98ef62.js.map