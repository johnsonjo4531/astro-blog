window.Geometry=function(){function t(t,e){return{x:t,y:e}}function e(t,e){var n=r(t.a,t.b).lineIntersection(e),i=Math.min(t.a.x,t.b.x),o=Math.max(t.a.x,t.b.x),u=Math.min(t.a.y,t.b.y),g=Math.max(t.a.y,t.b.y);return!!(n&&n.x>=i&&n.x<=o&&n.y>=u&&n.y<=g)&&n}function n(n,r){const i={a:n,b:r,lineIntersection:t=>e(i,t),get angle(){var t=i.b.y-i.a.y,e=i.b.x-i.a.x;return Math.atan2(t,e)},lineSegmentIntersection(e){const[n,r]=[i.a.x,i.a.y],[o,u]=[i.b.x,i.b.y],[g,a]=[e.a.x,e.a.y],[h,c]=[e.b.x,e.b.y];let b,l,x,y,s,f;if(b=o-n,l=u-r,x=h-g,y=c-a,s=(-l*(n-g)+b*(r-a))/(-x*l+b*y),f=(x*(r-a)-y*(n-g))/(-x*l+b*y),s>=0&&s<=1&&f>=0&&f<=1){return t({x:n+f*b,y:r+f*l})}return!1}};return i}function r(r,i){const o={a:r,b:i,get A(){return o.b.y-o.a.y},get B(){return o.a.x-o.b.x},get C(){return o.A*o.a.x+o.B*o.a.y},lineIntersection(e){const[n,r,i]=[o.A,o.B,o.C],[u,g,a]=[e.A,e.B,e.C],h=n*g-u*r;return 0==h?null:t((g*i-r*a)/h,(n*a-u*i)/h)},lineSegmentIntersection:t=>e(t,o),lineWithinRect(t){var e=null,r=null,i=function(t){let e=t.length;for(;e>0;){let n=Math.floor(Math.random()*e);e--;let r=t[e];t[e]=t[n],t[n]=r}return t}([t.boundingLeft,t.boundingRight,t.boundingBottom,t.boundingTop]);for(var u of i){let t=o.lineSegmentIntersection(u);if(t){if(e&&!r){r=t;break}e||(e=t)}}return e&&r?n(e,r):null}};return o}function i(e){var r={get x(){return o.x+o.width/2},get y(){return o.y+o.height/2}},o={height:e.height,width:e.width,x:e.x,y:e.y,get top(){return o.y},get left(){return o.x},get right(){return o.x+o.width},get bottom(){return o.y+o.height},get center(){return r},get boundingLeft(){return n(t(o.left,o.top),t(o.left,o.bottom))},get boundingRight(){return n(t(o.right,o.top),t(o.right,o.bottom))},get boundingBottom(){return n(t(o.left,o.bottom),t(o.right,o.bottom))},get boundingTop(){return n(t(o.left,o.top),t(o.right,o.top))},containsPoint:t=>o.left<=t.x&&o.right>=t.x&&o.top<=t.y&&o.bottom>=t.y,intersectsRect(t){const e=o,n=.5*(e.width+t.width),r=.5*(e.height+t.height),u=e.center.x-t.center.x,g=e.center.y-t.center.y;if(Math.abs(u)<=n&&Math.abs(g)<=r){const t=n*g,e=r*u;return t>e?t>-e?i.intersectDir.bottom:i.intersectDir.left:t>-e?i.intersectDir.right:i.intersectDir.top}return!1}};return o}return i.intersectDir={left:"left",right:"right",bottom:"bottom",top:"top"},{Rectangle:i,Circle:function(t){let e={radius:t.radius,x:t.x,y:t.y,get boundingRect(){return i({width:2*e.radius,height:2*e.radius,x:e.x-e.radius,y:e.y-e.radius})}};return e},LineSegment:n,Point:t,Line:r}}();
//# sourceMappingURL=index.8d9b1fc9.js.map
