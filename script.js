(function () {
  'use strict';

  var LANG = (document.body && document.body.getAttribute('data-lang')) || 'en';
  var STORAGE_KEY = 'umrah-checklist-' + LANG;

  var MESSAGES = {
    en: { done: 'Alhamdulillah — all steps completed. May Allah accept your Umrah.', progress: function (c, t) { return c + ' of ' + t + ' steps completed.'; } },
    hi: { done: 'अल्हम्दुलिल्लाह — सभी चरण पूरे। अल्लाह आपकी उमराह कुबूल करें।', progress: function (c, t) { return c + ' में से ' + t + ' चरण पूरे।'; } },
    ur: { done: 'الحمد للہ — سب مراحل مکمل۔ اللہ آپ کا عمرہ قبول فرمائے۔', progress: function (c, t) { return c + ' میں سے ' + t + ' مراحل مکمل۔'; } },
    hinglish: { done: 'Alhamdulillah — saare steps complete. Allah aapka Umrah qubool kare.', progress: function (c, t) { return c + ' mein se ' + t + ' steps complete.'; } }
  };

  var msg = MESSAGES[LANG] || MESSAGES.en;

  function loadChecklist() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var data = JSON.parse(raw);
      return typeof data === 'object' && data !== null ? data : {};
    } catch (e) {
      return {};
    }
  }

  function saveChecklist(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function getCheckboxes() {
    return document.querySelectorAll('.checklist input[type="checkbox"][data-step]');
  }

  function updateFromStorage() {
    var state = loadChecklist();
    getCheckboxes().forEach(function (cb) {
      var step = cb.getAttribute('data-step');
      if (step && state[step]) cb.checked = true;
    });
    updateCompletionMessage();
  }

  function updateCompletionMessage() {
    var boxes = getCheckboxes();
    var total = boxes.length;
    var checked = 0;
    boxes.forEach(function (cb) {
      if (cb.checked) checked += 1;
    });
    var msgEl = document.getElementById('completionMsg');
    if (!msgEl) return;
    if (checked === 0) {
      msgEl.textContent = '';
      return;
    }
    if (checked === total) {
      msgEl.textContent = msg.done;
      msgEl.setAttribute('aria-live', 'polite');
    } else {
      msgEl.textContent = typeof msg.progress === 'function' ? msg.progress(checked, total) : checked + ' of ' + total;
    }
  }

  function attachListeners() {
    getCheckboxes().forEach(function (cb) {
      cb.addEventListener('change', function () {
        var step = cb.getAttribute('data-step');
        if (!step) return;
        var state = loadChecklist();
        state[step] = cb.checked;
        saveChecklist(state);
        updateCompletionMessage();
      });
    });
  }

  function init() {
    if (!getCheckboxes().length) return;
    updateFromStorage();
    attachListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
