var e;window.ParticleSystem=(e=new Set,{create:function(i,t){let n={},o=[];n.render=function(){};var s=0;n.render=function(){for(let e=0;e<o.length;e++)t.renderCircle({x:o[e].position.x,y:o[e].position.y,radius:Math.max(0,o[e].size/2),color:i.color,opacity:i.opacity*(1-s/i.systemLifetime)})};var a=[{x:i.position.xMin,y:i.position.yMin},{x:i.position.xMax,y:i.position.yMin},{x:i.position.xMin,y:i.position.yMax},{x:i.position.xMax,y:i.position.yMax}],p=(i.speed.mean+i.speed.stdev)*(i.lifetime.mean+i.lifetime.stdev)+Math.max(...a.map((e=>r(e,i.position))));function d(e){e.speed=Math.max(0,e.maxSpeed*(1-r(e.position,i.position)/p))}function r(e,i){return Math.sqrt((e.x-i.x)**2+(e.y-i.y)**2)}n.update=function(t){(s+=t)>i.systemLifetime&&e.delete(n);let a=[];i.particlesPerUpdate;for(let e=0;e<o.length;e++)o[e].alive+=t,o[e].position.x+=t*o[e].speed*o[e].direction.x,o[e].position.y+=t*o[e].speed*o[e].direction.y,o[e].rotation+=o[e].speed/.5,d(o[e]),o[e].alive<=o[e].lifetime&&a.push(o[e]);for(let e=0;e<i.particlesPerUpdate;e++){let e=Random.nextGaussian(i.speed.mean,i.speed.stdev),t={position:{x:Random.nextRange(i.position.xMin,i.position.xMax),y:Random.nextRange(i.position.yMin,i.position.yMax)},direction:Random.nextCircleVector(),maxSpeed:e,speed:e,rotation:0,lifetime:Random.nextGaussian(i.lifetime.mean,i.lifetime.stdev),alive:0,size:Random.nextGaussian(i.size.mean,i.size.stdev),fill:i.fill,stroke:"rgb(0, 0, 0)"};d(t),a.push(t)}o=a},e.add(n)},update:function(i){for(const t of e)t.update(i)},render:function(i){for(const t of e)t.render(i)}});
//# sourceMappingURL=index.49d788b7.js.map
