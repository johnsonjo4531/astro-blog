window.Geometry=function(){function t(e){var r={get x(){return i.x+i.width/2},get y(){return i.y+i.height/2}},i={height:e.height,width:e.width,x:e.x,y:e.y,get top(){return i.y},get left(){return i.x},get right(){return i.x+i.width},get bottom(){return i.y+i.height},get center(){return r},intersectsRect(e){const r=i,n=.5*(r.width+e.width),h=.5*(r.height+e.height),u=r.center.x-e.center.x,g=r.center.y-e.center.y;if(Math.abs(u)<=n&&Math.abs(g)<=h){const e=n*g,r=h*u;return e>r?e>-r?t.intersectDir.bottom:t.intersectDir.left:e>-r?t.intersectDir.right:t.intersectDir.top}return!1}};return i}return t.intersectDir={left:"left",right:"right",bottom:"bottom",top:"top"},{Rectangle:t,Circle:function(e){let r={radius:e.radius,x:e.x,y:e.y,get boundingRect(){return t({width:2*r.radius,height:2*r.radius,x:r.x-r.radius,y:r.y-r.radius})}};return r}}}();
//# sourceMappingURL=index.0cb56d9c.js.map
