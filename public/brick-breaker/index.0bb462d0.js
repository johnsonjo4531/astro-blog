window.ScoreBoard=function(e,r=5){var s,o=!0;try{var t=localStorage.getItem(`scoreboard-${e}`)}catch(e){o=!1}return s=t?JSON.parse(t):{scores:[]},Object.assign(s,{writeScore(r,t){s.isTopScore(t)&&(s.scores.push([r,t]),s.scores.sort(((e,r)=>r[1]-e[1])),o&&localStorage.setItem(`scoreboard-${e}`,JSON.stringify(s)),s.events.dispatchEvent(new Event("high-score-update")))},singleScoreStr:(e,[r,s])=>`<div class="score-entry">${escapeHtml(e)}. ${escapeHtml(r)}: ${escapeHtml(s)}</div>`,isTopScore:e=>s.scores.length<r||e>s.scores[r-1][1],render(t){t.innerHTML=`\n      <h2>${escapeHtml(e)}</h2>\n      ${s.scores.slice(0,r).map(((e,r)=>s.singleScoreStr(r+1,e))).join("\n")||"Play a game to get your high score here."}\n      ${o?"":'<h6>LocalStorage doesn\'t seem to be working in your browser are you <a href="https://stackoverflow.com/questions/32374875/localstorage-not-working-in-edge">using edge</a>?</h6>'}\n      `},reset(){s.scores=[],o&&localStorage.setItem(`scoreboard-${e}`,JSON.stringify(s)),s.events.dispatchEvent(new Event("high-score-update"))},events:document.createElement("div")}),s};
//# sourceMappingURL=index.0bb462d0.js.map
