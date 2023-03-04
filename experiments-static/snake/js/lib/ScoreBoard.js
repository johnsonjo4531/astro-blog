/**
 * Stores scores in local storage at `scoreboard-${name}`
 * @param {String} name 
 * The name for storing in local storage
 * @param {Number} numKeep 
 * The number of top scores to keep
 */
window.ScoreBoard = function ScoreBoard (name, numKeep=5) {
  var localStorageWorking = true;
  try {
    var storage = localStorage.getItem(`scoreboard-${name}`);
  } catch (e) {
    localStorageWorking = false;
  }

  var that;
  if(storage) {
    that = JSON.parse(storage);
  } else {
    that = {
      scores: []
    };
  } 

  Object.assign(that, {
    writeScore (playerName, score) {
      if(!that.isTopScore(score)) {
        return;
      }
      that.scores.push([playerName, score]);
      that.scores.sort((a, b) => b[1] - a[1]);
      if(localStorageWorking) {
        localStorage.setItem(`scoreboard-${name}`, JSON.stringify(that));
      }
      that.events.dispatchEvent(new Event('high-score-update'));
    },
    singleScoreStr (place, [playerName, score]) {
      return `<div class="score-entry">${HTML.escape(place)}. ${HTML.escape(playerName)}: ${HTML.escape(score)}</div>`;
    },
    isTopScore (score) {
      if(that.scores.length < numKeep || score > that.scores[numKeep-1][1]) {
        return true;
      } else {
        return false;
      }
    },
    render (el) {
      var message = `<h6>LocalStorage doesn't seem to be working in your browser are you <a href="https://stackoverflow.com/questions/32374875/localstorage-not-working-in-edge">using edge</a>?</h6>`;
      el.innerHTML = `
      <h2>${HTML.escape(name)}</h2>
      ${that.scores.slice(0,numKeep).map((x, i)=>that.singleScoreStr(i+1, x)).join('\n') || "Play a game to get your high score here."}
      ${!localStorageWorking ? message : ''}
      `;
    },
    reset () {
      that.scores = [];
      if(localStorageWorking) {
        localStorage.setItem(`scoreboard-${name}`, JSON.stringify(that));
      }
      that.events.dispatchEvent(new Event('high-score-update'));
    },
    events: document.createElement('div'),
  });

  return that;
}
