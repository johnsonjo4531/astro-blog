window.Events=function(n){return{on:function(t,e,o){n(t).forEach((function(n){n.addEventListener(e,o)}))},once:function(t,e,o){n(t).forEach((function(n){n.addEventListener(e,(function t(i){o.call(this,i),n.removeEventListener(e,t)}))}))}}}($$);
//# sourceMappingURL=index.687d5b55.js.map
