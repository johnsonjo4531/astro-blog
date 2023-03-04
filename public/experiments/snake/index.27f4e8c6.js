window.GameRenderer=function(t){var e=t.getContext("2d");const o="'Press Start 2P', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";var r=t.width,n=t.height;function i(t,e){a({x:t.x*r/50,y:t.y*n/50,width:r/50,height:n/50,color:e,strokeColor:"black"})}function l(t){return`${Math.min(c(t.text,t.width),function(t){return c("m",t)}(t.height))}px ${o}`}l({text:"Score: 888",width:.099*r,height:.02*r*.9});function a(t){e.save(),e.beginPath(),e.fillStyle=t.color,e.fillRect(f(t.x),f(t.y),f(t.width),f(t.height)),e.strokeStyle=t.strokeColor,e.strokeRect(f(t.x),f(t.y),f(t.width),f(t.height)),e.restore()}function h(t,e,o){if(t>e)return[e,void 0,t];var r=Math.floor((t+e)/2),n=o(r);return n<0?h(t,r-1,o):n>0?h(r+1,e,o):[r-1,r,r+1]}function c(t,r){e.save();var n=h(2,r,(n=>(e.font=`${n}px ${o}`,r-e.measureText(t).width)));return e.restore(),n[1]||n[0]}function s(t){e.save(),e.font=t.font,e.textAlign=t.align||"center",e.textBaseline=t.baseline||"middle",e.fillText(t.text,f(t.rect.x+.5*t.rect.width),f(t.rect.y+.5*t.rect.height)),e.restore()}var u=l({text:"m",width:.2*r*.9,height:.2*r*.9});function f(t){return Math.floor(t)}function d(t){t.gameOver&&AudioPool.playSFX("hit"),t.didEat&&AudioPool.playSFX("eat")}return{init:function(){},render:function(t,o){var l,h;e.clearRect(0,0,r,n),function(t){for(var e of t)i(e,"seagreen")}(t.snake),function(t){for(var e of t)i(e,"slategrey")}(t.obstacles),i(t.food,"tomato"),a({x:0,y:0,width:r,height:n/50,color:l="steelblue",strokeColor:h="transparent"}),a({x:0,y:0,width:r/50,height:n,color:l,strokeColor:h}),a({x:49*r/50,y:0,width:r/50,height:n,color:l,strokeColor:h}),a({x:0,y:49*n/50,width:r,height:n/50,color:l,strokeColor:h}),function(t){t.countdown>0&&s({text:""+t.countdown,rect:Geometry.Rectangle({x:r/2-.2*r/2,y:n/2-.2*r/2,width:.2*r,height:.2*r}),font:u})}(t),d(t)},renderSound:d,renderCircle:function(t){e.save(),e.beginPath(),e.arc(f(t.x),f(t.y),f(t.radius),0,2*Math.PI,!1),e.fillStyle=t.color,t.opacity&&(e.globalAlpha=t.opacity),e.fill(),e.restore()},get height(){return n},get width(){return r}}};
//# sourceMappingURL=index.27f4e8c6.js.map
