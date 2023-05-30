// src/common.js
var regStrip = /^[\r\t\f\v ]+|[\r\t\f\v ]+$/gm;
var tcDefaults = {
  version: "0.8.10",
  lastSpeed: 1,
  rememberSpeed: true,
  audioBoolean: false,
  controllerOpacity: 0.6,
  enabled: true,
  forceLastSavedSpeed: false,
  ifSpeedIsNormalDontSaveUnlessWeSetIt: false,
  startHidden: false,
  speedTemplate: '<b style="display:inline-block;min-width:2.5em;">${speed3}</b><i class="hoverShow" style="min-width:3.3em;">: ${name}</i>',
  speedSets: {
    common: [
      ["snail", 0.1],
      ["turtle", 0.25],
      ["half", 0.5],
      ["slower", 0.75],
      ["slow", 0.9],
      ["normal", 1],
      ["fast", 1.1],
      ["faster", 1.25],
      ["speedy", 1.5],
      ["double", 2],
      ["blazing", 3]
    ],
    pitch440: [
      ["-24", 0.25],
      ["-12", 0.5],
      ["-11", 0.5297315],
      ["-10", 0.561231],
      ["-9", 0.5946036],
      ["-8", 0.6299605],
      ["-7", 0.6674199],
      ["-6", 0.7071068],
      ["-5", 0.7491535],
      ["-4", 0.7937005],
      ["-3", 0.8408964],
      ["-2", 0.8908987],
      ["-1", 0.9438743],
      ["0", 1],
      ["+1", 1.0594631],
      ["+2", 1.122462],
      ["+3", 1.1892071],
      ["+4", 1.259921],
      ["+5", 1.3348399],
      ["+6", 1.4142136],
      ["+7", 1.4983071],
      ["+8", 1.5874011],
      ["+9", 1.6817928],
      ["+10", 1.7817974],
      ["+11", 1.8877486],
      ["+12", 2]
    ],
    pitch432: [
      ["-24", 0.2454545],
      ["-12", 0.4909091],
      ["-11", 0.5201001],
      ["-10", 0.5510268],
      ["-9", 0.5837926],
      ["-8", 0.6185067],
      ["-7", 0.655285],
      ["-6", 0.6942503],
      ["-5", 0.7355326],
      ["-4", 0.7792696],
      ["-3", 0.8256074],
      ["-2", 0.8747006],
      ["-1", 0.926713],
      ["+0", 0.9818182],
      ["+1", 1.0402001],
      ["+2", 1.1020536],
      ["+3", 1.1675852],
      ["+4", 1.2370134],
      ["+5", 1.31057],
      ["+6", 1.3885006],
      ["+7", 1.4710651],
      ["+8", 1.5585392],
      ["+9", 1.6512148],
      ["+10", 1.7494011],
      ["+11", 1.8534259],
      ["+12", 1.9636364]
    ]
  },
  speedSetChosen: "common",
  keyBindings: [
    { action: "display", key: 86, value: 0, force: false, predefined: true },
    { action: "slower", key: 83, value: 0.1, force: false, predefined: true },
    { action: "faster", key: 68, value: 0.1, force: false, predefined: true },
    { action: "rewind", key: 90, value: 10, force: false, predefined: true },
    { action: "advance", key: 88, value: 10, force: false, predefined: true }
  ],
  blacklist: `www.instagram.com
  twitter.com
  imgur.com
  teams.microsoft.com
  `.replace(regStrip, ""),
  logLevel: 5,
  playersSpeed: {},
  mediaElements: []
};
//! ensure speeds are listed slowest to fastest

// src/options.js
var recordKeyPress = function(e) {
  if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 65 && e.keyCode <= 90 || keyCodeAliases[e.keyCode]) {
    e.target.value = keyCodeAliases[e.keyCode] || String.fromCharCode(e.keyCode);
    e.target.keyCode = e.keyCode;
    e.preventDefault();
    e.stopPropagation();
  } else if (e.keyCode === 8) {
    e.target.value = "";
  } else if (e.keyCode === 27) {
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
  restore_from_settingsObj(rawJ);
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
    if (!event.target.classList.contains(className)) {
      return;
    }
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
      } else {
        event.target.nextElementSibling.nextElementSibling.disabled = false;
      }
    });
  });
});
