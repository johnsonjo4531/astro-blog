window.GameState=function(e,{onGameOver:t=(e=>{}),onScoreUpdate:r=(e=>{}),onScoreHide:i=(()=>{}),onTimeUpdate:n=(e=>{})}){var o={},s=e.matrix.length,a=e.matrix[0][0],u=e.matrix[s-1][s-1],g=!0,l=!1,m=!1,c=!0,d=function e(t,r,i=[],n=null){if(i.push(t),t===r)return i;for(var o of Object.values(t.linked))if(o&&o!==n){var s=e(o,r,[...i],t);if(s)return s}return!1}(a,u),h=!0,v=0,f=!0,p=function(e){var i=a;i.visited=!0;var n=!1;let o=0;var s={get position(){return i},set position(r){var o=Object.values(i.linked).filter((e=>!!e));new Set(o).has(r)&&((i=r).visited||(i==d[1]?s.score+=5:s.score-=n?2:1),i.visited=!0,i==d[1]?(n=!1,d.shift(),1===d.length&&(e.enabled=!1,t(e))):(d.unshift(i),n=!0))},get score(){return o},set score(e){e=Number(e),Number.isNaN(e)||(o=e,c&&r(o))}};return s.score=0,s}(o={get scoreOn(){return c},get hintOn(){return m},get shortestPathOn(){return l},get breadCrumbsOn(){return g},get player(){return p},get shortestPath(){return d},get isDirty(){return h},set isDirty(e){h=!!e},doCommand:function(e,...t){b[e](...t)},get start(){return a},get finish(){return u},get player(){return p},get maze(){return e},get time(){return v},get enabled(){return f},set enabled(e){f=!!e},set time(e){v=e,n(o)},get secondTime(){return o.time/1e3},get timeString(){var e,t=Math.floor(o.secondTime%60);return`${Math.floor(o.secondTime/60)}:${e=t,("00"+e).split("").slice(-2).join("")}`}});var b={move(e){var t=p.position;p.position=p.position.linked[e],p.position!==t&&(o.isDirty=!0)},breadCrumbsToggle(){g=!g,o.isDirty=!0},shortestPathToggle(){l=!l,o.isDirty=!0},hintToggle(){m=!m,o.isDirty=!0},scoreToggle(){(c=!c)?r(p.score):i()}};return o};
//# sourceMappingURL=index.381f7efe.js.map