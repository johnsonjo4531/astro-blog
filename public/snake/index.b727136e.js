window.ButtonMenu=function(e){let t=!1,n=(e,t)=>(2*t+e%t)%t,o=$$("button",e);if(!o[0])throw new Error("You need buttons inside this element for ButtonMenu to work!");let i=o.findIndex((e=>e.classList.contains("selected")));function c(e){if(e instanceof Element){const t=e;e=o.findIndex((e=>e===t))}o[i].classList.remove("selected"),i=e,o[i].classList.add("selected")}function a(e){c(n(i+e,o.length))}-1===i&&(i=0,o[i].classList.add("selected"));var d=KeyboardHandler(!0);return Events.on(o,"click",(function(e){AudioPool.playSFX("menu_click")})),Events.on(o,"mouseenter",(function(e){AudioPool.playSFX("menu_navigate")})),d.addOnceAction("ArrowUp",(()=>{a(-1),AudioPool.playSFX("menu_navigate")})),d.addOnceAction("ArrowDown",(()=>{a(1),AudioPool.playSFX("menu_navigate")})),d.addOnceAction("Enter",(()=>{setTimeout((()=>{o[i].dispatchEvent(new Event("click"))}),0)})),{shiftSelected:a,select:c,activate(){c(o[0]),t=!0,d.activate()},deactivate(){t=!1,d.deactivate()}}};
//# sourceMappingURL=index.b727136e.js.map
