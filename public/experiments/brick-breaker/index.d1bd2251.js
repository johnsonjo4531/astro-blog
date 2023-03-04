window.AudioAsset=function(o){var e=new Audio(o.src);return e.dataset.loaded=!1,e.onload=function(){e.dataset.loaded=!0},e.restart=function(){e.currentTime=0},o.volume&&(e.volume=o.volume),e.loop=!!o.loop,e};
//# sourceMappingURL=index.d1bd2251.js.map
