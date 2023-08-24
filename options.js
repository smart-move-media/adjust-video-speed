//v begin common with Options & inject
const regStrip = /^[\r\t\f\v ]+|[\r\t\f\v ]+$/gm;
let tcDefaults = {
  version: "0.10.3",
  lastSpeed: 1.0,
  recallGlobalSpeed: true,
  audioBoolean: false,
  controllerOpacity: 0.6,
  enabled: true,
  forceLastSavedSpeed: false,
  ifSpeedIsNormalDontSaveUnlessWeSetIt: false,
  startHidden: false,
  speedTemplate: '<b style="min-width:2.2em;">${speed3}</b><i class="hoverShow" style="min-width:3em;"> : ${name}</i>',
  //! ensure speeds are listed slowest to fastest
  // Max playback speed in Chrome is set to 16:
  // https://cs.chromium.org/chromium/src/third_party/blink/renderer/core/html/media/html_media_element.cc?gsn=kMinRate&l=166
  // Video min rate is 0.0625:
  // https://cs.chromium.org/chromium/src/third_party/blink/renderer/core/html/media/html_media_element.cc?gsn=kMinRate&l=165
  speedSets: {
    common: [
      [0.25, 'quarter'],
      [0.5, 'half'],
      [0.75, 'slower'],
      [0.9, 'slow'],
      [1.0, 'normal'],
      [1.1, 'fast'],
      [1.25, 'faster'],
      [1.5, 'speedy'],
      [2, 'double'],
    ],
    pitch: [
      [0.2500000, '-24 steps'],
      [0.5000000, '-12 steps'],
      [0.5297315, '-11 steps'],
      [0.5612310, '-10 steps'],
      [0.5946036, '-9 steps'],
      [0.6299605, '-8 steps'],
      [0.6674199, '-7 steps'],
      [0.7071068, '-6 steps'],
      [0.7491535, '-5 steps'],
      [0.7937005, '-4 steps'],
      [0.8408964, '-3 steps'],
      [0.8908987, '-2 steps'],
      [0.9438743, '-1 step'],
      [1.0000000, '0 (default)'],
      [1.0594631, '+1 step'],
      [1.1224620, '+2 steps'],
      [1.1892071, '+3 steps'],
      [1.2599210, '+4 steps'],
      [1.3348399, '+5 steps'],
      [1.4142136, '+6 steps'],
      [1.4983071, '+7 steps'],
      [1.5874011, '+8 steps'],
      [1.6817928, '+9 steps'],
      [1.7817974, '+10 steps'],
      [1.8877486, '+11 steps'],
      [2.0000000, '+12 steps'],
    ],
    pitch432Hz: [
      [0.2454545, '-24 steps'],
      [0.4909091, '-12 steps'],
      [0.5201001, '-11 steps'],
      [0.5510268, '-10 steps'],
      [0.5837926, '-9 steps'],
      [0.6185067, '-8 steps'],
      [0.6552850, '-7 steps'],
      [0.6942503, '-6 steps'],
      [0.7355326, '-5 steps'],
      [0.7792696, '-4 steps'],
      [0.8256074, '-3 steps'],
      [0.8747006, '-2 steps'],
      [0.9267130, '-1 step'],
      [0.9818182, '0 (default)'],
      [1.0402001, '+1 step'],
      [1.1020536, '+2 steps'],
      [1.1675852, '+3 steps'],
      [1.2370134, '+4 steps'],
      [1.3105700, '+5 steps'],
      [1.3885006, '+6 steps'],
      [1.4710651, '+7 steps'],
      [1.5585392, '+8 steps'],
      [1.6512148, '+9 steps'],
      [1.7494011, '+10 steps'],
      [1.8534259, '+11 steps'],
      [1.9636364, '+12 steps'],
    ],
  },
  speedSetChosen: "pitch",
  // keyBindings not only config keyboard letter to trigger, but also
  // assign 'value' to those actions, even if they are activiated by
  // UI <button>.   So these must be present even if you don't intend to
  // use the keyboard assignments; just change the key to an unsued key.
  //TODO activate reset & fast
  keyBindings: [
    { action: "display", key: 86, value: 0, force: false, predefined: true }, // V
    { action: "slower", key: 83, value: 0.1, force: false, predefined: true }, // S
    { action: "faster", key: 68, value: 0.1, force: false, predefined: true }, // D
    { action: "rewind", key: 90, value: 10, force: false, predefined: true }, // Z
    { action: "advance", key: 88, value: 10, force: false, predefined: true }, // X
    // { action: "reset", key: 82, value: 1, force: false, predefined: true }, // R
    // { action: "fast", key: 71, value: 1.4, force: false, predefined: true } // G
  ],
  blacklist: `www.instagram.com
  twitter.com
  imgur.com
  teams.microsoft.com
  `.replace(regStrip, ""),
  // Holds a reference to all of the AUDIO/VIDEO DOM elements we've attached to
  logLevel: 5, //3, // warning
  playersSpeed: {}, // empty object to hold speed for each source
  mediaElements: []
};
//^end common

let keyBindings = [];
const keyCodeAliases = {
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
function recordKeyPress(e) {
  if (
    (e.keyCode >= 48 && e.keyCode <= 57) || // Numbers 0-9
    (e.keyCode >= 65 && e.keyCode <= 90) || // Letters A-Z
    keyCodeAliases[e.keyCode] // Other character keys
  ) {
    e.target.value =
      keyCodeAliases[e.keyCode] || String.fromCharCode(e.keyCode);
    e.target.keyCode = e.keyCode;

    e.preventDefault();
    e.stopPropagation();
  } else if (e.keyCode === 8) {
    // Clear input when backspace pressed
    e.target.value = "";
  } else if (e.keyCode === 27) {
    // When esc clicked, clear input
    e.target.value = "null";
    e.target.keyCode = null;
  }
}

// List of custom actions for which customValue should be disabled
const customActionsNoValues = [
  "pause",
  "muted",
  "mark",
  "jump",
  "display",
];
function createKeyBindings(item) {
  const action = item.querySelector(".customDo").value;
  const key = item.querySelector(".customKey").keyCode;
  const value = Number(item.querySelector(".customValue").value);
  const force = item.querySelector(".customForce").value;
  const predefined = !!item.id; //item.id ? true : false;

  keyBindings.push({
    action: action,
    key: key,
    value: value,
    force: force,
    predefined: predefined
  });
}

function inputFocus(e) {
  e.target.value = "";
}
function inputBlur(e) {
  e.target.value =
    keyCodeAliases[e.target.keyCode] || String.fromCharCode(e.target.keyCode);
}

function notify(msg) {
  // Update status to let user know options were saved.
  const status = document.getElementById("status");
  status.textContent = msg;
  setTimeout(function () {
    status.textContent = "";
  }, 2555);
}

function save_raw_options() {
  const rawJ = JSON.parse( document.getElementById("rawJson").value);
  restore_from_settingsObj(rawJ);
  chrome.storage.sync.set(rawJ,()=>notify("Raw Options saved"));
}
function restore_json() {
  document.getElementById("rawJson").value = JSON.stringify(tcDefaults, null,'\t')
  const rawJ = JSON.parse( document.getElementById("rawJson").value);  //formatting
  chrome.storage.sync.set(rawJ,()=>notify("Options reset"));
  // });
}
function restore_options() {
  chrome.storage.sync.get(tcDefaults, restore_from_settingsObj);
}
// Restores options from chrome.storage
function restore_from_settingsObj(storage) {
    document.getElementById("rawJson").value = JSON.stringify(storage, null,'\t');
}

document.addEventListener("DOMContentLoaded", function () {
  restore_options();
  codeInput.registerTemplate("syntax-highlighted", codeInput.templates.prism(Prism, [
    new codeInput.plugins.Indent() //Automatically indent next line after hitting enter
  ]));

  document.getElementById("saveRaw").addEventListener("click", save_raw_options);
  document
    .getElementById("restore")
    .addEventListener("click", restore_json);

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
    eventCaller(event, "removeParent", function () {
      event.target.parentNode.remove();
    });
  });
  document.addEventListener("change", (event) => {
    eventCaller(event, "customDo", function () {
      if (customActionsNoValues.includes(event.target.value)) {
        event.target.nextElementSibling.nextElementSibling.disabled = true;
        event.target.nextElementSibling.nextElementSibling.value = 0;
      } else {
        event.target.nextElementSibling.nextElementSibling.disabled = false;
      }
    });
  });
});
