// src/common.js
var regStrip = /^[\r\t\f\v ]+|[\r\t\f\v ]+$/gm;
var SettingFieldsSynced = [
  "keyBindings",
  "version",
  "rememberSpeed",
  "forceLastSavedSpeed",
  "audioBoolean",
  "startHidden",
  "lastSpeed",
  "enabled",
  "controllerOpacity",
  "logLevel",
  "blacklist",
  "ifSpeedIsNormalDontSaveUnlessWeSetIt"
];
var SettingFieldsBeforeSync = new Map;
SettingFieldsBeforeSync.set("blacklist", (data) => data.replace(regStrip, ""));
var tcDefaults = {
  version: "0.8.3",
  lastSpeed: 1,
  rememberSpeed: false,
  audioBoolean: false,
  startHidden: false,
  forceLastSavedSpeed: false,
  enabled: true,
  controllerOpacity: 0.38,
  logLevel: 3,
  defaultLogLevel: 4,
  playersSpeed: {},
  ifSpeedIsNormalDontSaveUnlessWeSetIt: false,
  keyBindings: [
    { action: "display", key: 86, value: 0, force: false, predefined: true },
    { action: "slower", key: 83, value: 0.1, force: false, predefined: true },
    { action: "faster", key: 68, value: 0.1, force: false, predefined: true },
    { action: "rewind", key: 90, value: 10, force: false, predefined: true },
    { action: "advance", key: 88, value: 10, force: false, predefined: true },
    { action: "reset", key: 82, value: 1, force: false, predefined: true },
    { action: "fast", key: 71, value: 1.8, force: false, predefined: true }
  ],
  blacklist: `www.instagram.com
    twitter.com
    imgur.com
    teams.microsoft.com
  `.replace(regStrip, ""),
  mediaElements: []
};

// src/options.js
var recordKeyPress = function(e) {
  if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 65 && e.keyCode <= 90 || keyCodeAliases[e.keyCode]) {
    e.target.value = keyCodeAliases[e.keyCode] || String.fromCharCode(e.keyCode);
    e.target.keyCode = e.keyCode;
    e.preventDefault();
    e.stopPropagation();
  } else if (e.keyCode === 8)
    e.target.value = "";
  else if (e.keyCode === 27) {
    e.target.value = "null";
    e.target.keyCode = null;
  }
};
var inputFocus = function(e) {
  e.target.value = "";
};
var inputBlur = function(e) {
  e.target.value = keyCodeAliases[e.target.keyCode] || String.fromCharCode(e.target.keyCode);
};
var notify = function(msg) {
  const status = document.getElementById("status");
  status.textContent = msg;
  setTimeout(function() {
    status.textContent = "";
  }, 2555);
};
var save_raw_options = function() {
  const rawJ = JSON.parse(document.getElementById("rawJson").value);
  chrome.storage.sync.set(rawJ, () => notify("Raw Options saved"));
};
var restore_json = function() {
  document.getElementById("rawJson").value = JSON.stringify(tcDefaults, null, "\t");
  const rawJ = JSON.parse(document.getElementById("rawJson").value);
  chrome.storage.sync.set(rawJ, () => notify("Options reset"));
};
var restore_options = function() {
  chrome.storage.sync.get(tcDefaults, restore_from_settingsObj);
};
var restore_from_settingsObj = function(storage) {
  document.getElementById("rawJson").value = JSON.stringify(storage, null, "\t");
};
var keyCodeAliases = {
  0: "null",
  null: "null",
  undefined: "null",
  32: "Space",
  37: "Left",
  38: "Up",
  39: "Right",
  40: "Down",
  96: "Num 0",
  97: "Num 1",
  98: "Num 2",
  99: "Num 3",
  100: "Num 4",
  101: "Num 5",
  102: "Num 6",
  103: "Num 7",
  104: "Num 8",
  105: "Num 9",
  106: "Num *",
  107: "Num +",
  109: "Num -",
  110: "Num .",
  111: "Num /",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  186: ";",
  188: "<",
  189: "-",
  187: "+",
  190: ">",
  191: "/",
  192: "~",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
};
var customActionsNoValues = [
  "pause",
  "muted",
  "mark",
  "jump",
  "display"
];
document.addEventListener("DOMContentLoaded", function() {
  restore_options();
  codeInput.registerTemplate("syntax-highlighted", codeInput.templates.prism(Prism, [
    new codeInput.plugins.Indent
  ]));
  document.getElementById("saveRaw").addEventListener("click", save_raw_options);
  document.getElementById("restore").addEventListener("click", restore_json);
  function eventCaller(event, className, funcName) {
    if (!event.target.classList.contains(className))
      return;
    funcName(event);
  }
  document.addEventListener("keypress", (event) => {
    eventCaller(event, "customValue", inputFilterNumbersOnly);
  });
  document.addEventListener("focus", (event) => {
    eventCaller(event, "customKey", inputFocus);
  });
  document.addEventListener("blur", (event) => {
    eventCaller(event, "customKey", inputBlur);
  });
  document.addEventListener("keydown", (event) => {
    eventCaller(event, "customKey", recordKeyPress);
  });
  document.addEventListener("click", (event) => {
    eventCaller(event, "removeParent", function() {
      event.target.parentNode.remove();
    });
  });
  document.addEventListener("change", (event) => {
    eventCaller(event, "customDo", function() {
      if (customActionsNoValues.includes(event.target.value)) {
        event.target.nextElementSibling.nextElementSibling.disabled = true;
        event.target.nextElementSibling.nextElementSibling.value = 0;
      } else
        event.target.nextElementSibling.nextElementSibling.disabled = false;
    });
  });
});
