window.PromptScreen = function PromptScreen (promptMessageHTML) {
  return Modal({
    render (el, res, rej) {
      el.innerHTML = `
      <div class="prompt-screen">
        ${promptMessageHTML}
        <input type="text" class="prompt-input"/>
        <div class="row">
          <button class="prompt-submit selected">Submit</button>
          <button class="prompt-cancel">Cancel</button>
        </div>
        <h6>For keyboard users: hit 'Enter' to submit and 'Escape' to cancel</h6>
      </div>
      `;
      $('.prompt-input', el)[0].focus();
      var events = new Set();
      function removeAllEvents () {
        for(const event of events) {
          event.removeAll();
        }
      }
      events.add(Events.onceKey([document.body], 'Enter', () => {
        const input = ($('.prompt-input', el)[0] || {}).value;
        removeAllEvents();
        res(input);
      }));
      events.add(Events.onceKey([document.body], 'Escape', () => {
        // don't provide a name user doesn't want their score kept
        removeAllEvents();
        res('');
      }));
      events.add(Events.once($('.prompt-submit', el), 'click', () => {
        const input = ($('.prompt-input', el)[0] || {}).value;
        removeAllEvents();
        res(input);
      }));
      events.add(Events.once($('.prompt-cancel', el), 'click', () => {
        // don't provide a name user doesn't want their score kept
        removeAllEvents();
        res('');
      }));
    },
    postRender (view) {
      $('.prompt-input', view)[0].focus();
    },
  })
}
