window.AudioPool=function(e,o){const u=new Map,n=new Map;var l=null,t=.5,s=.7;function r(o,n){u.set(o,e({loop:!0,volume:t,src:n}))}function a(o,u){n.set(o,e({src:u,volume:s}))}const c=o((function(e){var o=e.cloneNode();o.currentTime=0,o.volume=e.volume,o.play()}),1e3/30);var i=!1,m=t,f=s,v={addMusic:r,addAllMusic:function(...e){for(const[o,u]of e)r(o,u)},addSFX:a,addAllSFX:function(...e){for(const[o,u]of e)a(o,u)},playMusic:function(e){var o=u.get(e);o!==l&&(o?(l&&l.pause(),l=o,o.play(),o.currentTime=0):console.warn(`No music by name '${e}'.`))},playSFX:function(e){var o=n.get(e);o?c(o):console.warn(`No sound effect by name '${e}'.`)},get musicVolume(){return t},set musicVolume(e){if(e<0||e>1)throw new Error("Invalid volume value. Valid volumes are between 0 and 1 inclusive.");t=e;for(const o of u.values())o.volume=e},get sfxVolume(){return s},set sfxVolume(e){if(e<0||e>1)throw new Error("Invalid volume value. Valid volumes are between 0 and 1 inclusive.");s=e;for(const o of n.values())o.volume=e},get mute(){return i},set mute(e){i=e=!!e,e?(m=t,f=s,v.sfxVolume=0,v.musicVolume=0):(v.musicVolume=m,v.sfxVolume=f)}};return v}(AudioAsset,throttle);
//# sourceMappingURL=index.c8c7dc9c.js.map