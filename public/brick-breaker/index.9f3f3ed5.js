window.Modal=function(e){var n,t,r=document.createElement("div");r.classList.add("modal-view");var o=new Promise(((e,r)=>{n=e,t=r}));return e.postRender=e.postRender||(()=>{}),Promise.resolve(e.render(r,n,t)).then((function(){return(e.insertTo||document.body).appendChild(r),e.postRender(r)})).then((function(){return o})).then((function(e){return r.parentElement.removeChild(r),e}),(function(e){throw r.parentElement.removeChild(r),e}))};
//# sourceMappingURL=index.9f3f3ed5.js.map
