(function () {
  'use strict';

  const CWS_REVIEW_URL =
    'https://chromewebstore.google.com/detail/fggjheojicnhkljaoaigpnobhgojinip/reviews';
  const EXTENSION_ID = 'fggjheojicnhkljaoaigpnobhgojinip';

  const rateBtn = document.getElementById('rateBtn');
  const dismissBtn = document.getElementById('dismissBtn');
  const exportsPill = document.getElementById('exportsPill');
  const exportCountEl = document.getElementById('exportCount');

  // ---------- Show dynamic export count if passed via URL ----------
  // Extension opens: https://your-domain.com/rate?exports=2
  const params = new URLSearchParams(window.location.search);
  const exports = parseInt(params.get('exports'), 10);
  if (Number.isFinite(exports) && exports > 0) {
    exportCountEl.textContent = exports;
    exportsPill.hidden = false;
  }

  // ---------- Notify the extension that the user rated ----------
  function notifyExtensionRated() {
    // externally_connectable messaging (if the extension allows this origin)
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage(
          EXTENSION_ID,
          { type: 'USER_RATED', source: 'rate-page', timestamp: Date.now() },
          () => { /* ignore lastError */ void chrome.runtime.lastError; }
        );
      }
    } catch (_) { /* no-op */ }

    // Fallback: localStorage flag (extension can read via content script
    // injected on your domain if needed)
    try {
      localStorage.setItem('gtw_user_rated', '1');
      localStorage.setItem('gtw_user_rated_at', String(Date.now()));
    } catch (_) { /* no-op */ }
  }

  // ---------- Rate button ----------
  rateBtn.addEventListener('click', () => {
    notifyExtensionRated();
    // Open CWS in a new tab so current tab can show "thanks" before closing
    window.open(CWS_REVIEW_URL, '_blank', 'noopener');
    showThanks();
  });

  // ---------- Dismiss button ----------
  dismissBtn.addEventListener('click', () => {
    // Try to close; if blocked by browser policy, show graceful fallback
    window.close();
    setTimeout(() => {
      // If we're still here, the browser blocked window.close()
      document.body.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;' +
        'height:100vh;color:#8a97ad;font-family:Inter,sans-serif;' +
        'background:#050d1a;text-align:center;padding:20px;">' +
        'You can close this tab now. Thanks! 💙</div>';
    }, 200);
  });

  // ---------- Thanks state ----------
  function showThanks() {
    const card = document.querySelector('.rate-card');
    card.classList.add('thanks');
    card.innerHTML = `
      <div class="card-header">
        <img src="assets/icon.png" alt="" class="card-icon" />
        <div class="eyebrow">THANK YOU</div>
      </div>
      <h1>You're awesome! 💛</h1>
      <p class="rate-description">
        Your rating means the world to us. We're opening the Chrome Web Store
        in a new tab — just pick your stars and you're done.
      </p>
      <div class="rate-actions">
        <button class="btn-rate" onclick="window.open('${CWS_REVIEW_URL}','_blank','noopener')">
          <span class="star">★</span>
          Open Chrome Web Store again
        </button>
      </div>
      <p class="rate-footnote">You can safely close this tab.</p>
    `;
  }
})();
