import {
  regStrip,
  SettingFieldsBeforeSync,
  SettingFieldsSynced,
  tcDefaults,
} from "./common"

var keyBindings = [];

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

// function inputFilterNumbersOnly(e) {
//   var char = String.fromCharCode(e.keyCode);
//   if (!/[\d\.]$/.test(char) || !/^\d+(\.\d*)?$/.test(e.target.value + char)) {
//     e.preventDefault();
//     e.stopPropagation();
//   }
// }

function inputFocus(e) {
  e.target.value = "";
}

function inputBlur(e) {
  e.target.value =
    keyCodeAliases[e.target.keyCode] || String.fromCharCode(e.target.keyCode);
}

// function updateShortcutInputText(inputId, keyCode) {
//   document.getElementById(inputId).value =
//     keyCodeAliases[keyCode] || String.fromCharCode(keyCode);
//   document.getElementById(inputId).keyCode = keyCode;
// }

// function updateCustomShortcutInputText(inputItem, keyCode) {
//   inputItem.value = keyCodeAliases[keyCode] || String.fromCharCode(keyCode);
//   inputItem.keyCode = keyCode;
// }

// List of custom actions for which customValue should be disabled

const customActionsNoValues = [
  "pause",
  "muted",
  "mark",
  "jump",
  "display",
];

// function add_shortcut() {
//   var html = `<select class="customDo">
//     <option value="slower">Decrease speed</option>
//     <option value="faster">Increase speed</option>
//     <option value="rewind">Rewind</option>
//     <option value="advance">Advance</option>
//     <option value="reset">Reset speed</option>
//     <option value="fast">Preferred speed</option>
//     <option value="muted">Mute</option>
//     <option value="pause">Pause</option>
//     <option value="mark">Set marker</option>
//     <option value="jump">Jump to marker</option>
//     <option value="display">Show/hide controller</option>
//     </select>
//     <input class="customKey" type="text" placeholder="press a key"/>
//     <input class="customValue" type="text" placeholder="value (0.10)"/>
//     <select class="customForce">
//     <option value="false">Do not disable website key bindings</option>
//     <option value="true">Disable website key bindings</option>
//     </select>
//     <button class="removeParent">X</button>`;
//   var div = document.createElement("div");
//   div.setAttribute("class", "row customs");
//   div.innerHTML = html;
//   var customs_element = document.getElementById("customs");
//   customs_element.insertBefore(
//     div,
//     customs_element.children[customs_element.childElementCount - 1]
//   );
// }

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

// // Validates settings before saving
// function validate() {
//   var valid = true;
//   var status = document.getElementById("status");
//   var blacklist = document.getElementById("blacklist");

//   blacklist.value.split("\n").forEach((match) => {
//     match = match.replace(regStrip, "");

//     if (match.startsWith("/")) {
//       try {
//         var parts = match.split("/");

//         if (parts.length < 3)
//           throw "invalid regex";

//         var flags = parts.pop();
//         var regex = parts.slice(1).join("/");

//         var regexp = new RegExp(regex, flags);
//       } catch (err) {
//         status.textContent =
//           "Error: Invalid blacklist regex: \"" + match + "\". Unable to save. Try wrapping it in foward slashes.";
//         valid = false;
//         return;
//       }
//     }
//   });
//   return valid;
// }

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
  // restore_from_settingsObj(rawJ);
  chrome.storage.sync.set(rawJ,()=>notify("Raw Options saved"));
}

function restore_json() {
  document.getElementById("rawJson").value = JSON.stringify(tcDefaults, null,'\t')
  const rawJ = JSON.parse( document.getElementById("rawJson").value);  //formatting
  chrome.storage.sync.set(rawJ,()=>notify("Options reset"));
  // });
}

// // Saves non-JSON options to chrome.storage
// function save_options() {
//   if (validate() === false) {
//     return;
//   }
//   keyBindings = [];
//   Array.from(document.querySelectorAll(".customs")).forEach((item) =>
//     createKeyBindings(item)
//   ); // Remove added shortcuts
//     let saveObj = {};
//     for (let field of SettingFieldsSynced){
//       let domElm = document.getElementById(field);
//       if (! domElm)
//         continue;
//       let origType = typeof(tcDefaults[field]);
//       let val = undefined;
//       switch (origType){
//         case "string":
//           val = String(domElm.value);
//           break;
//         case "number":
//           val = Number(domElm.value);
//           break;
//         case "boolean":
//           val = Boolean(domElm.checked);
//           break;
//         default:
//           continue;
//       }
//       if (SettingFieldsBeforeSync.has(field))
//         val = SettingFieldsBeforeSync.get(field)(val);
//       saveObj[field]=val;
//     }

//   // chrome.storage.sync.remove([
//   //   "resetSpeed",
//   //   "speedStep",
//   //   "fastSpeed",
//   //   "rewindTime",
//   //   "advanceTime",
//   //   "resetKeyCode",
//   //   "slowerKeyCode",
//   //   "fasterKeyCode",
//   //   "rewindKeyCode",
//   //   "advanceKeyCode",
//   //   "fastKeyCode"
//   // ]);

//   document.getElementById("rawJson").value = JSON.stringify(saveObj, null,'\t');
//   chrome.storage.sync.set(
//     saveObj,
//     function () {
//       // Update status to let user know options were saved.
//       var status = document.getElementById("status");
//       status.textContent = "Options saved";
//       setTimeout(function () {
//         status.textContent = "";
//       }, 1000);
//     }
//   );
// }
function restore_options() {
  chrome.storage.sync.get(tcDefaults, restore_from_settingsObj);
}

// Restores options from chrome.storage
function restore_from_settingsObj(storage) {
    // for (let field of SettingFieldsSynced){
    //   let domElm = document.getElementById(field);
    //   if (! domElm)
    //     continue;
    //   let origType = typeof(tcDefaults[field]);
    //   let val = storage[field];
    //   switch (origType){
    //       case "string":
    //       case "number":
    //         domElm.value = val;
    //         break;
    //       case "boolean":
    //         domElm.checked = val;
    //         break;
    //       default:
    //         continue;
    //     }
    // }

    document.getElementById("rawJson").value = JSON.stringify(storage, null,'\t');
    // // ensure that there is a "display" binding for upgrades from versions that had it as a separate binding
    // if (storage.keyBindings.filter((x) => x.action == "display").length == 0) {
    //   storage.keyBindings.push({
    //     action: "display",
    //     value: 0,
    //     force: false,
    //     predefined: true
    //   });
    // }
    // // restore keyboard shortcuts UI
    // for (let i in storage.keyBindings) {
    //   var item = storage.keyBindings[i];
    //   if (item.predefined) {
    //     //do predefined ones because their value needed for overlay
    //     // document.querySelector("#" + item["action"] + " .customDo").value = item["action"];
    //     // if (item["action"] == "display" && typeof item["key"] === "undefined") {
    //     //   item["key"] = storage.displayKeyCode || tcDefaults.displayKeyCode; // V
    //     // }

    //     // if (customActionsNoValues.includes(item["action"])) outdated
    //     //   document.querySelector(
    //     //     "#" + item["action"] + " .customValue"
    //     //   ).disabled = true;

    //     updateCustomShortcutInputText(
    //       document.querySelector("#" + item["action"] + " .customKey"),
    //       item["key"]
    //     );
    //     document.querySelector("#" + item["action"] + " .customValue").value =
    //       item["value"];
    //     document.querySelector("#" + item["action"] + " .customForce").value =
    //       item["force"];
    //   } else {
    //     // new ones
    //     add_shortcut();
    //     const dom = document.querySelector(".customs:last-of-type");
    //     dom.querySelector(".customDo").value = item["action"];

    //     // if (customActionsNoValues.includes(item["action"]))
    //     //   dom.querySelector(".customValue").disabled = true;

    //     updateCustomShortcutInputText(
    //       dom.querySelector(".customKey"),
    //       item["key"]
    //     );
    //     dom.querySelector(".customValue").value = item["value"];
    //     dom.querySelector(".customForce").value = item["force"];
    //   }
    // }
}

// function restore_defaults() {
//   chrome.storage.sync.set(tcDefaults, function () {
//     restore_options();
//     document
//       .querySelectorAll(".removeParent")
//       .forEach((button) => button.click()); // Remove added shortcuts
//     // Update status to let user know options were saved.
//     var status = document.getElementById("status");
//     status.textContent = "Default options restored";
//     setTimeout(function () {
//       status.textContent = "";
//     }, 1000);
//   });
// }

// function show_experimental() {
//   document
//     .querySelectorAll(".customForce")
//     .forEach((item) => (item.style.display = "inline-block"));
// }

document.addEventListener("DOMContentLoaded", function () {
  restore_options();
  codeInput.registerTemplate("syntax-highlighted", codeInput.templates.prism(Prism, [
    new codeInput.plugins.Indent() //Automatically indent next line after hitting enter
  ]));

  document.getElementById("saveRaw").addEventListener("click", save_raw_options);
  // document.getElementById("save").addEventListener("click", save_options);
  // document.getElementById("add").addEventListener("click", add_shortcut);
  document
    .getElementById("restore")
    // .addEventListener("click", restore_defaults);
    .addEventListener("click", restore_json);
    // document
  //   .getElementById("experimental")
  //   .addEventListener("click", show_experimental);

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
