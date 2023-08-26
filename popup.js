document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#config").addEventListener("click", function () {
    window.open(chrome.runtime.getURL("options.html"));
  });

  document.querySelector("#about").addEventListener("click", function () {
    window.open("https://github.com/smart-move-media/adjust-video-speed");
  });

  document.querySelector("#feedback").addEventListener("click", function () {
    window.open("https://github.com/smart-move-media/adjust-video-speed/issues");
  });

  document.querySelector("#enable").addEventListener("click", function () {
    toggleEnabled(true, settingsSavedReloadMessage);
  });

  document.querySelector("#disable").addEventListener("click", function () {
    toggleEnabled(false, settingsSavedReloadMessage);
  });

  chrome.storage.sync.get({ enabled: true }, function (storage) {
    toggleEnabledUI(storage.enabled);
  });

  function toggleEnabled(enabled, callback) {
    chrome.storage.sync.set(
      {
        enabled: enabled
      },
      function () {
        toggleEnabledUI(enabled);
        if (callback) callback(enabled);
      }
    );
  }

  function toggleEnabledUI(enabled) {
    document.querySelector("#enable").classList.toggle("hide", enabled);
    document.querySelector("#disable").classList.toggle("hide", !enabled);

    const suffix = `${enabled ? "" : "_disabled"}.png`;
    if (chrome && chrome["browserAction"] && chrome.browserAction["setIcon"]) {
    chrome.browserAction.setIcon({
      path: {
        "16": "icons/icon16" + suffix,
        "32": "icons/icon32" + suffix,
        "48": "icons/icon48" + suffix
      }
    });
  }
  }

  function settingsSavedReloadMessage(enabled) {
    setStatusMessage(
      `${enabled ? "Enabled" : "Disabled"}. Reload page to see changes`
    );
  }

  function setStatusMessage(str) {
    const status_element = document.querySelector("#status");
    status_element.classList.toggle("hide", false);
    status_element.innerText = str;
  }
});
