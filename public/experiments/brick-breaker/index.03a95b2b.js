function t(t,e,n,r){Object.defineProperty(t,e,{get:n,set:r,enumerable:!0,configurable:!0})}var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},r={},o=e.parcelRequire8bbe;null==o&&((o=function(t){if(t in n)return n[t].exports;if(t in r){var e=r[t];delete r[t];var o={id:t,exports:{}};return n[t]=o,e.call(o.exports,o,o.exports),o.exports}var i=new Error("Cannot find module '"+t+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(t,e){r[t]=e},e.parcelRequire8bbe=o),o.register("27Lyk",(function(e,n){var r,o;t(e.exports,"register",(()=>r),(t=>r=t)),t(e.exports,"resolve",(()=>o),(t=>o=t));var i={};r=function(t){for(var e=Object.keys(t),n=0;n<e.length;n++)i[e[n]]=t[e[n]]},o=function(t){var e=i[t];if(null==e)throw new Error("Could not resolve bundle with id "+t);return e}})),o("27Lyk").register(JSON.parse('{"kbGLj":"index.03a95b2b.js","7otfU":"congruent_pentagon.f93d2ac8.png"}'));var i;i=new URL("../"+o("27Lyk").resolve("7otfU"),import.meta.url).toString(),window.GameRenderer=function(t){let e=t;var n=t.getContext("2d");(t=document.createElement("canvas")).width=e.width,t.height=e.height;var r=t.getContext("2d");const o=r.createRadialGradient(0,0,Math.sqrt(Math.pow(t.width,2)+Math.pow(t.height,2)),0,0,0);o.addColorStop(1,"rgba(255,255,255,0)"),o.addColorStop(0,"rgba(0,0,0,0.5)");var a=ImageAsset(new URL(i));const l="'Press Start 2P', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";var c=t.width,d=t.height,u=t.width/250;let h=null;function f(t){return`${Math.min(p(t.text,t.width),function(t){return p("m",t)}(t.height))}px ${l}`}var s=f({text:"Score: 888",width:27*u,height:4.5*u});function g(t){r.save(),r.beginPath(),r.fillStyle=t.color,r.fillRect(b(t.x),b(t.y),b(t.width),b(t.height)),r.restore()}function w(t,e,n){if(t>e)return[e,void 0,t];var r=Math.floor((t+e)/2),o=n(r);return o<0?w(t,r-1,n):o>0?w(r+1,e,n):[r-1,r,r+1]}function p(t,e){r.save();var n=w(2,e,(n=>(r.font=`${n}px ${l}`,e-r.measureText(t).width)));return r.restore(),n[1]||n[0]}function v(t){r.save(),r.font=t.font,r.textAlign=t.align||"center",r.textBaseline=t.baseline||"middle",r.fillText(t.text,b(t.rect.x+.5*t.rect.width),b(t.rect.y+.5*t.rect.height)),r.restore()}var y=f({text:"m",width:45*u,height:45*u});function b(t){return Math.floor(t)}function x(t){r.save(),r.beginPath(),r.arc(b(t.x),b(t.y),b(t.radius),0,2*Math.PI,!1),r.fillStyle=t.color,t.opacity&&(r.globalAlpha=t.opacity),r.fill(),r.restore()}return{init:function(){},render:function(e,i){r.clearRect(0,0,c,d),function(){if(!a.dataset.loaded)return;r.save();var e=r.createPattern(a,"repeat");r.fillStyle=e,r.fillRect(0,0,t.width,t.height),r.restore()}(),g(e.paddle),function(t){for(var e=0;e<t.bricks.length;++e)for(var n=0;n<t.bricks[e].length;++n){g(t.bricks[e][n])}}(e),ParticleSystem.render(i),function(t){for(var e of t.balls)x(e)}(e),r.save(),r.fillStyle=o,r.fillRect(0,0,t.width,t.height),r.restore(),function(t){t.countdown>0&&v({text:""+t.countdown,rect:Geometry.Rectangle({x:t.width/2-50*t.unit/2,y:t.height/2-50*t.unit/2,width:50*t.unit,height:50*t.unit}),font:y})}(e),function(t){v({text:`Score: ${t.points}`,rect:Geometry.Rectangle({width:30*u,height:5*u,x:t.width-30*u,y:t.height-5*u}),font:s})}(e),function(t){for(var e=0;e<t.paddlesLeft;++e){var n=Geometry.Rectangle({width:10*t.unit,height:2*t.unit,x:10,y:t.height-10*(e+1)-(e+1)*(2*t.unit)});n.color=t.paddle.color,g(n)}}(e),n.drawImage(t,0,0,t.width,t.height)},renderSound:function(t){h!=t.countdown&&(0===t.countdown?AudioPool.playSFX("menu_navigate"):AudioPool.playSFX("menu_click"),h=t.countdown);for(const e of t.balls)(e&&e.paddleContact||e.wallContact)&&AudioPool.playSFX("paddle_hit"),e.brickContact&&AudioPool.playSFX("brick_hit")},renderCircle:x,get unit(){return u},get height(){return d},get width(){return c}}};
//# sourceMappingURL=index.03a95b2b.js.map
