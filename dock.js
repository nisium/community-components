/**
 * Nisium Dock — v1.0.2
 * Loaded on every Nisium Community Component cloneable via:
 * <script src="https://cdn.jsdelivr.net/gh/nisium/community-components@main/dock.js" defer></script>
 */
(function () {
  var JSON_URL = "https://raw.githubusercontent.com/nisium/community-components/main/components.json?v=" + Date.now();
  var initialized = false;

  function getDockElements() {
    return {
      nameEl: document.querySelector('[data-dock="name"]'),
      cloneBtn: document.querySelector('[data-dock="clone"]'),
      prevBtn: document.querySelector('[data-dock="prev"]'),
      counterEl: document.querySelector('[data-dock="counter"]'),
      nextBtn: document.querySelector('[data-dock="next"]')
    };
  }

  function hasDock(elements) {
    return elements.nameEl || elements.cloneBtn || elements.prevBtn || elements.counterEl || elements.nextBtn;
  }

  function initDock() {
    if (initialized) return;

    var elements = getDockElements();
    if (!hasDock(elements)) return;

    initialized = true;

    fetch(JSON_URL)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!Array.isArray(data) || data.length === 0) return;

        var host = window.location.hostname;
        var index = -1;

        for (var i = 0; i < data.length; i++) {
          try {
            if (new URL(data[i].url).hostname === host) {
              index = i;
              break;
            }
          } catch (e) {
            if (data[i].url.indexOf(host) !== -1) {
              index = i;
              break;
            }
          }
        }

        if (index === -1) index = 0;

        var total = data.length;
        var current = data[index];
        var prev = index > 0 ? data[index - 1] : null;
        var next = index < total - 1 ? data[index + 1] : null;

        if (elements.nameEl) elements.nameEl.textContent = current.name;
        if (elements.cloneBtn) elements.cloneBtn.href = current.clone;
        if (elements.counterEl) elements.counterEl.textContent = (index + 1) + " / " + total;

        setNav(elements.prevBtn, prev);
        setNav(elements.nextBtn, next);
      })
      .catch(function (err) {
        console.warn("Nisium Dock: Error loading JSON", err);
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

  function startDockWatcher() {
    initDock();

    var tries = 0;
    var maxTries = 40;

    var interval = setInterval(function () {
      initDock();
      tries += 1;

      if (initialized || tries >= maxTries) {
        clearInterval(interval);
      }
    }, 250);

    if (window.MutationObserver) {
      var observer = new MutationObserver(function () {
        initDock();
        if (initialized) observer.disconnect();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(function () {
        observer.disconnect();
      }, 10000);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startDockWatcher);
  } else {
    startDockWatcher();
  }
})();
