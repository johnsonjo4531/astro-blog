window.GameState=function(e){var t={};function r(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e))+e}t.didEat=!1,(()=>{Object.defineProperty(t,"points",{get:()=>t.snake.length});var e=!1;Object.defineProperty(t,"paused",{get:()=>e,set(t){e=!!t}});var r=!1;Object.defineProperty(t,"ready",{get:()=>!t.paused&&r,set(e){r=!!e}})})();t.countdown=3,t.ready=!0;var n,o,a,s,i,c,d=0,u=0;function f(){var e={x:r(1,49),y:r(1,49),intersects:t=>t.x===e.x&&e.y===t.y};return t.obstacles.intersects(e)||t.snake.intersects(e)?f():e}return t.update=function(e){if(!t.ready)return;d+=e,t.countdown>0&&(t.countdown=3-Math.floor(d/1e3),t.countDown<=0&&(t.ready=!0)),t.snake.moving||(u=d),t.didEat=!1;var r=d-u;r>150&&(t.snake.makeMoves(Math.floor(r/150)),u=d)},t.snake=(n=!1,o={up:{opposite:"down",vector:{xDelta:0,yDelta:-1}},down:{opposite:"up",vector:{xDelta:0,yDelta:1}},right:{opposite:"left",vector:{xDelta:1,yDelta:0}},left:{opposite:"right",vector:{xDelta:-1,yDelta:0}}},a=null,s=[{x:24,y:24}],i=0,(c={get moving(){return n},set moving(e){n=e},set dir(e){["up","left","down","right"].indexOf(e)>-1&&(!c.dir||c.dir.opposite!=e)&&(n||(n=!0),a=e)},get dir(){return a&&o[a]},dirs:{up:"up",down:"down",left:"left",right:"right"},get parts(){return s},makeMoves(r){for(var n=0;n<r;++n){var o={x:s[0].x+c.dir.vector.xDelta,y:s[0].y+c.dir.vector.yDelta};(t.obstacles.intersects(o)||c.intersects(o)||o.x<=0||o.x>=49||o.y<=0||o.y>=49)&&(t.gameOver=!0,e.gameOver(t)),s.unshift(o),i>0?i--:s.pop(),t.food.intersects(o)&&(i+=3,t.food=f(),t.didEat=!0)}},get length(){return c.parts.length+i},intersects(e){for(const t of c)if(t.x==e.x&&t.y==e.y)return!0;return!1},*[Symbol.iterator](){yield*c.parts}}).moving=!1,c),t.obstacles=function(){for(var e=[],n=0;n<15;++n)e.push(o());function o(){var n={x:r(1,49),y:r(1,49),intersectsSnake:()=>t.snake.intersects(n),intersectsObstacle(){for(var t of e)if(t&&t.x==n.x&&t.y===n.y)return!0;return!1}};return n.intersectsSnake()||n.intersectsObstacle()?o():n}var a={obstacles:e,*[Symbol.iterator](){yield*e},intersects(e){for(var t of a)if(t.x===e.x&&t.y===e.y)return!0;return!1}};return a}(),t.food=f(),t};
//# sourceMappingURL=index.e9669204.js.map
