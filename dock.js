/**
 * Nisium Dock — v1.0.0
 * Loaded on every Nisium Community Component cloneable via:
 * <script src="https://cdn.jsdelivr.net/gh/nisium/community-components@main/dock.js" defer></script>
 */
(function () {
  var JSON_URL = "https://cdn.jsdelivr.net/gh/nisium/community-components@main/components.json";

  function initDock() {
    var nameEl = document.querySelector('[data-dock="name"]');
    var cloneBtn = document.querySelector('[data-dock="clone"]');
    var prevBtn = document.querySelector('[data-dock="prev"]');
    var counterEl = document.querySelector('[data-dock="counter"]');
    var nextBtn = document.querySelector('[data-dock="next"]');

    // No dock markup on this page — nothing to do
    if (!nameEl && !cloneBtn && !prevBtn && !counterEl && !nextBtn) return;

    fetch(JSON_URL)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!Array.isArray(data) || data.length === 0) return;

        var host = window.location.hostname;
        var index = -1;
        for (var i = 0; i < data.length; i++) {
          try {
            if (new URL(data[i].url).hostname === host) { index = i; break; }
          } catch (e) {
            if (data[i].url.indexOf(host) !== -1) { index = i; break; }
          }
        }
        if (index === -1) index = 0;

        var total = data.length;
        var current = data[index];
        var prev = index > 0 ? data[index - 1] : null;
        var next = index < total - 1 ? data[index + 1] : null;

        if (nameEl) {
          var textNode = nameEl.querySelector("*");
          if (textNode) textNode.textContent = current.name;
          else nameEl.textContent = current.name;
        }
        if (cloneBtn) cloneBtn.href = current.clone;
        if (counterEl) counterEl.textContent = (index + 1) + " / " + total;

        setNav(prevBtn, prev);
        setNav(nextBtn, next);
      })
      .catch(function (err) {
        console.warn("Nisium Dock: Error Loading JSON", err);
      });
  }

  function setNav(btn, item) {
    if (!btn) return;
    if (item) {
      btn.href = item.url;
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
    } else {
      btn.removeAttribute("href");
      btn.style.opacity = "0.25";
      btn.style.pointerEvents = "none";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDock);
  } else {
    initDock();
  }
})();
