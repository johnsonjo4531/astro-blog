window.Events=function(n){return{on:function(t,e,o){n(t).forEach((function(n){n.addEventListener(e,o)}))},once:function(t,e,o){n(t).forEach((function(n){n.addEventListener(e,(function t(i){o.call(this,i),n.removeEventListener(e,t)}))}))}}}($$);
//# sourceMappingURL=index.bbc15828.js.map
