window.ScoreBoard = (function () {
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
  }

  var storage = localStorage.getItem('scoreboard');

  var that;
  if(storage) {
    that = JSON.parse(storage);
  } else {
    that = {
      5: [],
      10: [],
      15: [],
      20: [],
    };
  } 

  Object.assign(that, {
    writeScore (n, [name, score]) {
      if(!that.isTopScore(n, score)) {
        return;
      }
      that[n].push([name, score]);
      that[n].sort((a, b) => b[1] - a[1]);
      localStorage.setItem('scoreboard', JSON.stringify(that));
    },
    singleScoreStr (place, [name, score]) {
      return `<div class="score-entry">${escapeHtml(place)}. ${escapeHtml(name)}: ${escapeHtml(score)}</div>`;
    },
    isTopScore (n, score) {
      if(that[n].length < 5) {
        return true;
      }
      for(var i = 0; i < 5; ++i) {
        if(score > that[n][i][1]) {
          return true;
        }
      }
      return false;
    },
    render (el, n) {
      el.innerHTML = `
      <h2>${escapeHtml(n)}x${escapeHtml(n)}</h2>
      ${that[n].slice(0,5).map((x, i)=>that.singleScoreStr(i+1, x)).join('\n') || "N/A"}
      `;
    }
  });

  return that;
})();
