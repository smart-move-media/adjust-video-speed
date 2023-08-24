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
///"ytJS" sadly cant figure out a good way to execute js https://bugs.chromium.org/p/chromium/issues/detail?id=1207006 may eventually have a solution
const SettingFieldsBeforeSync = new Map();
SettingFieldsBeforeSync.set("blacklist", (data) => data.replace(regStrip, ""));
const SettingFieldsSynced = Object.keys(tcDefaults)
const regEndsWithFlags = /\/(?!.*(.).*\1)[gimsuy]*$/;

var tc = {
  settings: {
    ...tcDefaults
  },
  // Holds a reference to all of the AUDIO/VIDEO DOM elements we've attached to
  mediaElements: []
};
let speedSetNames = []
let speedValues = {}
let storedSpeed = 1.0

for (let field of SettingFieldsSynced){
  if (tcDefaults[field] === undefined)
    log(`Warning a field we sync: ${field} not found on our tc.settings class likely error`, 3);
}

const LOG_LEVEL_ENUM = {
  2: 'ERROR',
  3: 'WARNING',
  4: 'Info',
  5: 'Debug',
  6: 'Debug-Verbose',
}
function log(msg, level=4) {
  if (tc.settings.logLevel >= level) {
    msg = `${log.caller?.name ?? "?"}: ${msg}`
    console.log(`${LOG_LEVEL_ENUM[level]}: ${msg}`)
    if (level === 6) console.trace();
  }
}

chrome.storage.sync.get(tc.settings, function (storage) {
  // update for storage
  tc.settings.keyBindings = storage.keyBindings; // Array
  if (storage.keyBindings.length == 0) {
    storage.keyBindings = [ ...tcDefaults.keyBindings];
    tc.settings.version = tcDefaults.version;
    let toSet = {};
    for (let _field of SettingFieldsSynced){
      let val = tc.settings[_field];
      if (SettingFieldsBeforeSync.has(_field))
        val = SettingFieldsBeforeSync.get(_field)(val);
      toSet[_field] = val;
    }
    chrome.storage.sync.set(toSet);
  }

  for (let field of SettingFieldsSynced) {
    let origType = typeof(tcDefaults[field]);
    switch (origType){
        case "string":
          tc.settings[field] = String(storage[field]);
          break;
        case "number":
            tc.settings[field] = Number(storage[field]);
          break;
        case "boolean":
          tc.settings[field] = Boolean(storage[field]);
          break;
        default:
          tc.settings[field] = storage[field];
          break;
    }
  }

  initializeWhenReady(document);
});

function getKeyBindingData(action, what = "value") {
  try {
    return tc.settings.keyBindings.find((item) => item.action === action)[what];
  } catch (e) {
    return false;
  }
}
function setKeyBindingValue(action, value) {
  tc.settings.keyBindings.find((item) => item.action === action)[
    "value"
  ] = value;
}

let injectTemplate =(obj)=>
  tc.settings.speedTemplate
    .replace(/\${(.*?)}/g, (x,g)=> obj[g])
function formatSpeedIndicator(
  speed = storedSpeed,
  arr = tc.settings.speedSets[tc.settings.speedSetChosen],
  idx = arr.findIndex(([num,])=> num == speed),
) {
  let name = arr?.[idx]?.[1] ?? '--'
  let percent = (speed * 100)

  return /*html*/`<span>${injectTemplate({
    action: 'drag', // RESERVED
    name: name,
    //TODO +1 number formatting
    percent: percent.toFixed(0) +'%',
    percent1: percent.toFixed(1) +'%',
    percent2: percent.toFixed(2) +'%',
    speed: speed,
    speed2: Number(speed).toFixed(2),
    speed3: Number(speed).toFixed(3),
    // speed4: Number(speed).toFixed(4),
  })}</span>`
}
let oldSpeedIndicatorSpeed = 1.0
function updateSpeedIndicator(context, speed) {
  context = context.textDisplay
  if (oldSpeedIndicatorSpeed !== speed) {
    context.classList.remove('highlight')
    oldSpeedIndicatorSpeed = speed
    context.classList.add('highlight')
    setTimeout( ()=> context.classList.remove('highlight'), 555)
  }
  // console.log('speed',speed);
  // console.log('storedSpeed', storedSpeed);
  // console.log('tc.settings.lastSpeed', tc.settings.lastSpeed);
  context.setHTML( formatSpeedIndicator(speed) );
}

function setStoredSpeed(target) {
  if (tc.settings.recallGlobalSpeed) {
    storedSpeed = tc.settings.lastSpeed;
    log(`Recalled stored speed due to recallGlobalSpeed being enabled: ${storedSpeed}`, 5);
  } else {
    storedSpeed = tc.settings.playersSpeed[target.currentSrc];
    if (!storedSpeed) {
      log("Setting stored speed to 1.0; recallGlobalSpeed is disabled", 5);
      storedSpeed = 1.0;
    }
    setKeyBindingValue("reset", getKeyBindingData("fast")); // resetSpeed = fastSpeed
  }
}
function defineVideoController() {
  // refresh global settings
  speedSetNames = Object.keys(tc.settings.speedSets)
  //TODO update speedSet upone save for prefs.  This only updates on browser refresh.
  const unzip = (arr)=>
    arr.reduce( (acc, val)=> (
      val.forEach( (v, i)=>
        acc[i].push(v)), acc
      ), Array.from({
        length: Math.max(...arr.map(x => x.length))
      }).map(x => [])
    );
  for (let idx = 0; idx<speedSetNames.length; idx++) {
    [vArr,] = unzip( tc.settings.speedSets[speedSetNames[idx]] )
    speedValues[ speedSetNames[idx] ] = vArr
  }
  // Data structures
  // videoController (JS object) instances:
  //   video = AUDIO/VIDEO DOM element
  //   parent = A/V DOM element's parentElement OR
  //            (A/V elements discovered from the Mutation Observer)
  //            A/V element's parentNode OR the node whose children changed.
  //   div = Controller's DOM element (which happens to be a DIV)
  //   textDisplay = DOM element in the Controller of the speed indicator

  // added to AUDIO / VIDEO DOM elements
  //    avs = reference to the videoController
  tc.videoController = function (target, parent) {
    if (target.avs) return target.avs
    tc.mediaElements.push(target);
    this.video = target;
    this.parent = target.parentElement || parent;

    setStoredSpeed(target)
    log("Explicitly setting playbackRate to: " + storedSpeed, 5);
    target.playbackRate = storedSpeed;

    this.div = this.initializeControls();

    function mediaEventAction(event) {
      setStoredSpeed(event.target)
      // TODO: Check if explicitly setting the playback rate to 1.0 is
      // necessary when recallGlobalSpeed is disabled (this may accidentally
      // override a website's intentional initial speed setting interfering
      // with the site's default behavior)
      log("mediaEventAction~Explicitly setting playbackRate to: " + storedSpeed, 4);
      setSpeed(event.target, storedSpeed);
    };
    target.addEventListener(
      "play",
      (this.handlePlay = mediaEventAction.bind(this))
    );
    target.addEventListener(
      "seeked",
      (this.handleSeek = mediaEventAction.bind(this))
    );

    var observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "src" ||
            mutation.attributeName === "currentSrc")
        ) {
          log("mutation of A/V element", 5);
          var controller = this.div;
          if (!mutation.target.src && !mutation.target.currentSrc) {
            controller.classList.add("avs-nosource");
          } else {
            controller.classList.remove("avs-nosource");
          }
        }
      });
    });
    observer.observe(target, {
      attributeFilter: ["src", "currentSrc"]
    });
  };

  tc.videoController.prototype.remove = function () {
    this.div.remove();
    this.video.removeEventListener("play", this.handlePlay);
    this.video.removeEventListener("seek", this.handleSeek);
    delete this.video.avs;
    let idx = tc.mediaElements.indexOf(this.video);
    if (idx != -1) {
      tc.mediaElements.splice(idx, 1);
    }
  };

  tc.videoController.prototype.initializeControls = function () {
    log("Begin", 5);
    const document = this.video.ownerDocument;
    const speed = Number(this.video.playbackRate).toFixed(7);
    const rect = this.video.getBoundingClientRect();
    // getBoundingClientRect is relative to the viewport; style coordinates
    // are relative to offsetParent, so we adjust for that here. offsetParent
    // can be null if the video has `display: none` or is not yet in the DOM.
    const offsetRect = this.video.offsetParent?.getBoundingClientRect();
    const top = Math.max(rect.top - (offsetRect?.top || 0), 33) + "px"
    const left = Math.max(rect.left - (offsetRect?.left || 0), 33) + "px"
    // prevent speedDropdown from hidding behind video controls
    const height = (rect.height - 133) + "px"

    let speedList = ``
    for (let setidx = 0; setidx<speedSetNames.length; setidx++) {
      const setName = speedSetNames[setidx]
      const speedArr = tc.settings.speedSets[setName]
      for (let idx = 0; idx<speedArr.length; idx++) {
        const classNames = (tc.settings.speedSetChosen === setName) ? setName +' show' : setName
        speedList += /*html*/`<button data-action="jumpspeed" data-value="${speedArr[idx][0]}" class="${classNames}">
  ${formatSpeedIndicator( speedArr[idx][0], speedArr, idx)}
  </button>
  `
      }
    }

    var wrapper = document.createElement("div");
    wrapper.classList.add("avs-controller");
    if (!this.video.currentSrc) wrapper.classList.add("avs-nosource");
    if (tc.settings.startHidden) wrapper.classList.add("avs-hidden");

    var shadow = wrapper.attachShadow({ mode: "open" });
    var shadowTemplate = /*html*/`
<style>
  @import "${chrome.runtime.getURL("shadow.css")}";
</style>
<div id="controller"
  style="top:${top};left:${left};max-height:${height};opacity:${tc.settings.controllerOpacity}"
>
  <div id="topLine">
    <div id="textDisplay" data-action="drag">--</div>
  </div>
  <div id="controls">
    <span id="quick" class="show">
      <button data-action="rewind" class="rw">«</button>
      <button data-action="slower">&minus;</button>
      <button data-action="faster">&plus;</button>
      <button data-action="advance" class="rw">»</button>
      <button data-action="-" class="rw" style="visibility:hidden;">-</button>
      <button data-action="open config">▼</button>
    </span>
    <span id="config">
      <button data-action="speed sets" class="on" disabled>≣</button>
      <b>Speed Sets</b>
      <button data-action="close config"">▲</button>
    </span>
  </div>
  <div id="speedDropdown">
    <div id="speedSetNames">
      <button data-action="prev set" class="rw"><</button><span id="speedSetChosen">${tc.settings.speedSetChosen}</span><button data-action="next set" class="rw">></button>
    </div>
    <div id="speedList">${speedList}</div>
  </div>
</div>
 `;
    shadow.innerHTML = shadowTemplate;
    shadow
      .querySelector("[data-action='drag']")
      .addEventListener(
        "mousedown",
        (e) => {
          runAction("drag", null, e);
          e.stopPropagation();
        },
        true
      );
    shadow
      .querySelectorAll("button")
      .forEach(function (button) {
        button.addEventListener(
          "click",
          (e) => {
            runAction(
              e.currentTarget.dataset["action"],
              e.currentTarget.dataset["value"] || getKeyBindingData(e.currentTarget.dataset["action"]),
              e
            );
            e.stopPropagation();
          },
          true
        );
        button.addEventListener(
          "mouseover",
          (e) => {
            let dataset = e.currentTarget.dataset["action"]
            switch (dataset) {
              case 'jumpspeed':
                dataset = e.currentTarget.dataset["value"]
                break;
              case 'rewind':
                dataset = `rewind -${getKeyBindingData(e.currentTarget.dataset["action"])}`
                break;
              case 'advance':
                dataset = `advance +${getKeyBindingData(e.currentTarget.dataset["action"])}`
                break;
              default:
                break;
            }
            shadow.querySelector("#textDisplay").setHTML( `<b class="info">${dataset}</b>` )
          },
          true
        );
        button.addEventListener(
          "mouseout",
          (e) => {
            shadow.querySelector("#textDisplay").setHTML( formatSpeedIndicator() )
          },
          true
        );
      });
    shadow
      .querySelector("#controller")
      .addEventListener("click", (e) => e.stopPropagation(), false);
    shadow
      .querySelector("#controller")
      .addEventListener("mousedown", (e) => e.stopPropagation(), false);

    this.textDisplay = shadow.querySelector("#textDisplay");
    this.quick = shadow.querySelector("#quick");
    this.config = shadow.querySelector("#config");
    this.speedDropdown = shadow.querySelector("#speedDropdown");
    this.speedSetChosen = shadow.querySelector("#speedSetChosen");
    this.speedList = shadow.querySelector("#speedList");
    var fragment = document.createDocumentFragment();
    fragment.appendChild(wrapper);

    updateSpeedIndicator(this, speed)

    // specific website workarounds
    switch (true) {
      case location.hostname == "www.amazon.com":
      case location.hostname == "www.reddit.com":
      case /hbogo\./.test(location.hostname):
        // insert before parent to bypass overlay
        this.parent.parentElement.insertBefore(fragment, this.parent);
        break;
      case location.hostname == "www.facebook.com":
        // this is a monstrosity but new FB design does not have *any*
        // semantic handles for us to traverse the tree, and deep nesting
        // that we need to bubble up from to get controller to stack correctly
        let p = this.parent.parentElement.parentElement.parentElement
          .parentElement.parentElement.parentElement.parentElement;
        p.insertBefore(fragment, p.firstChild);
        break;
      case location.hostname == "tv.apple.com":
        // insert before parent to bypass overlay
        this.parent.parentNode.insertBefore(fragment, this.parent.parentNode.firstChild);
        break;
      default:
        // Note: when triggered via a MutationRecord, it's possible that the
        // target is not the immediate parent. This appends the controller as
        // the first element of the target, which may not be the parent.
        this.parent.insertBefore(fragment, this.parent.firstChild);
    }
    return wrapper;
  };
}

function escapeStringRegExp(str) {
  matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
  return str.replace(matchOperatorsRe, "\\$&");
}
function isBlacklisted() {
  blacklisted = false;
  tc.settings.blacklist.split("\n").forEach((match) => {
    match = match.replace(regStrip, "");
    if (match.length == 0) {
      return;
    }

    if (match.startsWith("/")) {
      try {
        var parts = match.split("/");

        if (regEndsWithFlags.test(match)) {
          var flags = parts.pop();
          var regex = parts.slice(1).join("/");
        } else {
          var flags = "";
          var regex = match;
        }

        var regexp = new RegExp(regex, flags);
      } catch (err) {
        return;
      }
    } else {
      var regexp = new RegExp(escapeStringRegExp(match));
    }

    if (regexp.test(location.href)) {
      blacklisted = true;
      return;
    }
  });
  return blacklisted;
}

var coolDown = false;
function refreshCoolDown() {
  log("Begin refreshCoolDown", 5);
  if (coolDown) {
    clearTimeout(coolDown);
  }
  coolDown = setTimeout(function () {
    coolDown = false;
  }, 1000);
  log("End refreshCoolDown", 5);
}

function setupListener() {
  /**
   * This function is run whenever a video speed rate change occurs.
   * It is used to update the speed that shows up in the display as well as save
   * that latest speed into the local storage.
   *
   * @param {*} video The video element to update the speed indicators for.
   */
  function updateSpeedFromEvent(video, event) {
    // It's possible to get a rate change on a VIDEO/AUDIO that doesn't have
    // a video controller attached to it.  If we do, ignore it.
    if (!video.avs)
      return;
    var speed = Number(video.playbackRate).toFixed(7);
    var ident = `${video.className} ${video.id} ${video.name} ${video.url} ${video.offsetWidth}x${video.offsetHeight}`;
    log("Playback rate changed to " + speed + ` for: ${ident}`, 4);
    //console.log(event);

    log("Updating controller with new speed", 5);
    tc.settings.playersSpeed[video.currentSrc] = speed;
    let wasUs = event.detail && event.detail.origin === "videoSpeed";
    if (wasUs || ! tc.settings.ifSpeedIsNormalDontSaveUnlessWeSetIt || speed != 1) {

      log("Storing lastSpeed in settings for the recallGlobalSpeed feature", 5);
      tc.settings.lastSpeed = speed;
      log("Syncing chrome settings for lastSpeed", 5);
      chrome.storage.sync.set({ lastSpeed: speed }, function () {
        log("Speed setting saved: " + speed, 5);
      });
    } else {
      log(`Speed update to ${speed} ignored due to ifSpeedIsNormalDontSaveUnlessWeSetIt`,5);
    }
    // show the controller for 1000ms if it's hidden.
    // runAction("blink", null, null);
    updateSpeedIndicator(video.avs, speed);
  }

  document.addEventListener(
    "ratechange",
    function (event) {
      if (coolDown) {
        log("Speed event propagation blocked", 4);
        event.stopImmediatePropagation();
      }
      var video = event.target;

      /**
       * If the last speed is forced, only update the speed based on events created by
       * video speed instead of all video speed change events.
       */
      if (tc.settings.forceLastSavedSpeed) {
        if (event.detail && event.detail.origin === "videoSpeed") {
          video.playbackRate = event.detail.speed;
          updateSpeedFromEvent(video, event);
        } else {
          video.playbackRate = tc.settings.lastSpeed;
        }
        event.stopImmediatePropagation();
      } else {
        updateSpeedFromEvent(video, event);
      }
    },
    true
  );
}

function initializeWhenReady(document) {
  log("Begin initializeWhenReady", 5);
  if (isBlacklisted()) {
    return;
  }
  window.onload = () => {
    initializeNow(window.document);
  };
  if (document) {
    if (document.readyState === "complete") {
      initializeNow(document);
    } else {
      document.onreadystatechange = () => {
        if (document.readyState === "complete") {
          initializeNow(document);
        }
      };
    }
  }
  log("End initializeWhenReady", 5);
}
function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
function getShadow(parent) {
  let result = [];
  function getChild(parent) {
    if (parent.firstElementChild) {
      var child = parent.firstElementChild;
      do {
        result.push(child);
        getChild(child);
        if (child.shadowRoot) {
          result.push(getShadow(child.shadowRoot));
        }
        child = child.nextElementSibling;
      } while (child);
    }
  }
  getChild(parent);
  return result.flat(Infinity);
}

function initializeNow(document) {
  log("Begin initializeNow", 5);
  if (!tc.settings.enabled) return;
  // enforce init-once due to redundant callers
  if (!document.body || document.body.classList.contains("avs-initialized")) {
    return;
  }
  try {
    setupListener();
  } catch {
    // no operation
  }
  document.body.classList.add("avs-initialized");
  log("initializeNow: avs-initialized added to document body", 5);

  if (document === window.document) {
    defineVideoController();
  } else {
    var link = document.createElement("link");
    link.href = chrome.runtime.getURL("inject.css");
    link.type = "text/css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  var docs = Array(document);
  try {
    if (inIframe()) docs.push(window.top.document);
  } catch (e) {}

  docs.forEach(function (doc) {
    doc.addEventListener(
      "keydown",
      function (event) {
        var keyCode = event.keyCode;
        log("Processing keydown event: " + keyCode, 6);

        // Ignore if following modifier is active.
        if (
          !event.getModifierState ||
          event.getModifierState("Alt") ||
          event.getModifierState("Control") ||
          event.getModifierState("Fn") ||
          event.getModifierState("Meta") ||
          event.getModifierState("Hyper") ||
          event.getModifierState("OS")
        ) {
          log("Keydown event ignored due to active modifier: " + keyCode, 5);
          return;
        }

        // Ignore keydown event if typing in an input box
        if (
          event.target.nodeName === "INPUT" ||
          event.target.nodeName === "TEXTAREA" ||
          event.target.isContentEditable
        ) {
          return false;
        }

        // Ignore keydown event if typing in a page without avs
        if (!tc.mediaElements.length) {
          return false;
        }

        var item = tc.settings.keyBindings.find((item) => item.key === keyCode);
        if (item) {
          runAction(item.action, item.value);
          if (item.force === "true") {
            // disable websites key bindings
            event.preventDefault();
            event.stopPropagation();
          }
        }

        return false;
      },
      true
    );
  });

  function checkForVideo(node, parent, added) {
    // Only proceed with supposed removal if node is missing from DOM
    if (!added && document.body.contains(node)) {
      return;
    }
    if (
      node.nodeName === "VIDEO" ||
      (node.nodeName === "AUDIO" && tc.settings.audioBoolean)
    ) {
      if (added) {
        node.avs = new tc.videoController(node, parent);
      } else {
        if (node.avs) {
          node.avs.remove();
        }
      }
    } else if (node.children != undefined) {
      for (var i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        checkForVideo(child, child.parentNode || parent, added);
      }
    }
  }

  var observer = new MutationObserver(function (mutations) {
    // Process the DOM nodes lazily
    requestIdleCallback(
      (_) => {
        mutations.forEach(function (mutation) {
          switch (mutation.type) {
            case "childList":
              mutation.addedNodes.forEach(function (node) {
                if (typeof node === "function") return;
                if (node === document.documentElement) {
                  // This happens on sites that use document.write, e.g. watch.sling.com
                  // When the document gets replaced, we lose all event handlers, so we need to reinitialize
                  log("Document was replaced, reinitializing", 5);
                  initializeWhenReady(document);
                  return;
                }
                checkForVideo(node, node.parentNode || mutation.target, true);
              });
              mutation.removedNodes.forEach(function (node) {
                if (typeof node === "function") return;
                checkForVideo(node, node.parentNode || mutation.target, false);
              });
              break;
            case "attributes":
              if (
                (mutation.target.attributes["aria-hidden"] &&
                mutation.target.attributes["aria-hidden"].value == "false")
                || mutation.target.nodeName === 'APPLE-TV-PLUS-PLAYER'
              ) {
                var flattenedNodes = getShadow(document.body);
                var nodes = flattenedNodes.filter(
                  (x) => x.tagName == "VIDEO"
                );
                for (let node of nodes) {
                  // only add avs the first time for the apple-tv case (the attribute change is triggered every time you click the avs)
                  if (node.avs && mutation.target.nodeName === 'APPLE-TV-PLUS-PLAYER')
                    continue;
                  if (node.avs)
                    node.avs.remove();
                  checkForVideo(node, node.parentNode || mutation.target, true);
                }
              }
              break;
          }
        });
      },
      { timeout: 1000 }
    );
  });
  observer.observe(document, {
    attributeFilter: ["aria-hidden", "data-focus-method"],
    childList: true,
    subtree: true
  });

  if (tc.settings.audioBoolean) {
    var mediaTags = document.querySelectorAll("video,audio");
  } else {
    var mediaTags = document.querySelectorAll("video");
  }

  mediaTags.forEach(function (video) {
    video.avs = new tc.videoController(video);
  });

  var frameTags = document.getElementsByTagName("iframe");
  Array.prototype.forEach.call(frameTags, function (frame) {
    // Ignore frames we don't have permission to access (different origin).
    try {
      var childDocument = frame.contentDocument;
    } catch (e) {
      return;
    }
    initializeWhenReady(childDocument);
  });
  log("End initializeNow", 5);

  // if ( window.location.hostname.endsWith("youtube.com") )
  //   setTimeout(YTComAfterLoaded,1000);
    //eval(tc.settings.ytJS);

}

function switchSpeedSet(video, step=0) { //0 acts like refresh speedbuttons
  const oldresult = tc.settings.speedSetChosen
  let idx = speedSetNames.indexOf(tc.settings.speedSetChosen) + step
  const speedSetCount = speedSetNames.length - 1
  idx = (idx<0) ? speedSetCount : (idx>speedSetCount) ? 0 : idx;
  const result = speedSetNames[idx]

  tc.settings.speedSetChosen = result
  chrome.storage.sync.set({ speedSetChosen: result }, function () {
    log("Speed setting saved: " + speed, 5);
  });
  log(idx +':'+ result, 4)
  video.avs.speedSetChosen.textContent = result
  // hide & show buttons
  let sl = [...video.avs.speedList.getElementsByClassName(oldresult)]
  sl.forEach(el => el.classList.remove('show'))
  sl = [...video.avs.speedList.getElementsByClassName(result)]
  sl.forEach(el => el.classList.add('show'))
}

function changeSpeed(video, direction='') {
  const playbackRate = video.playbackRate.toFixed(7)
  const speedValuesCurrent = speedValues[tc.settings.speedSetChosen]
  log(`(${playbackRate})`, 4)
  for (let idx = 0; idx<speedValuesCurrent.length; idx++) {
    const rate = speedValuesCurrent[idx].toFixed(7)
    log('+'+ idx +'='+ rate +'-'+ playbackRate, 4)
    if (playbackRate > rate) continue
    if (direction === '-') {
      setSpeed(video, speedValuesCurrent[ Math.max(idx-1, 0) ]);
      break;
    } else if (direction === '+') {
      if (playbackRate === rate) idx += 1
      // if playbackRate < rate keep idx
      setSpeed(video, speedValuesCurrent[ Math.min(idx, speedValuesCurrent.length-1) ]);
      break;
    }
  }
}
function setSpeed(video, speed) {
  // Video min rate is 0.0625:
  // https://cs.chromium.org/chromium/src/third_party/blink/renderer/core/html/media/html_media_element.cc?gsn=kMinRate&l=165
  // Maximum playback speed in Chrome is set to 16:
  // https://cs.chromium.org/chromium/src/third_party/blink/renderer/core/html/media/html_media_element.cc?gsn=kMinRate&l=166
  speed = Math.max(Math.min(speed,16),0.0625).toFixed(7);
  log(" started: " + speed, 5);
  if (tc.settings.forceLastSavedSpeed) {
    video.dispatchEvent(
      new CustomEvent("ratechange", {
        detail: { origin: "videoSpeed", speed: speed }
      })
    );
  } else {
    video.playbackRate = speed;
    log(`not forced ${speed}`)
  }
  tc.settings.lastSpeed = speed;
  updateSpeedIndicator(video.avs, speed);
  setStoredSpeed(video)
  refreshCoolDown();
  log("setSpeed finished: " + speed, 5);
}

function runAction(action, value, e) {
  log("Begin:"+action, 4);
  let mediaTags = tc.mediaElements;
  // Get the controller that was used if called from a button press event e
  if (e) {
    var targetController = e.target.getRootNode().host;
  }

  mediaTags.forEach(function (v) {
    const controller = v.avs.div;
    // Don't change video speed if the video has a different controller
    if (e && !(targetController == controller)) return;
    // showController(controller);
    if (v.classList.contains("avs-cancelled")) return

    switch (action){
      case "rewind":
        log("Rewind", 5);
        v.currentTime -= value;
        break
      case "advance":
        log("Fast forward", 5);
        v.currentTime += value;
        break
      case "faster":
        log("Increase speed", 5);
        changeSpeed(v, '+')
        break
      case "slower":
        log("Decrease speed", 5);
        changeSpeed(v, '-')
        break
      // case "reset":
      //   log("Reset speed", 5);
      //   resetSpeed(v, 1.0);
      //   break
      case "open config":
        log("open config", 5);
        v.avs.speedDropdown.classList.add("show");
        v.avs.quick.classList.remove("show");
        v.avs.config.classList.add("show");
        //TODO unshow when avs-hidden
        break
      case "close config":
        log("close config", 5);
        v.avs.speedDropdown.classList.remove("show");
        v.avs.config.classList.remove("show");
        v.avs.quick.classList.add("show");
        //TODO unshow when avs-hidden
        break
      case "next set":
        log("next set", 5);
        switchSpeedSet(v, 1)
        break
      case "prev set":
        log("prev set", 5);
        switchSpeedSet(v, -1)
        break
      case "jumpspeed":
        log("jump speed:"+value, 5);
        v.avs.quick.classList.add("show");
        v.avs.config.classList.remove("show");
        v.avs.speedDropdown.classList.remove("show");
        setSpeed(v, value)
        break
        //TODO unshow when avs-hidden
      case "display":
        log("Showing controller", 5);
        controller.classList.add("avs-manual");
        controller.classList.toggle("avs-hidden");
        break
      // case "blink":
      //   log("Showing controller momentarily", 5);
      //   // if avs is hidden, show it briefly to give the use visual feedback that the action is excuted.
      //   if (
      //     controller.classList.contains("avs-hidden") ||
      //     controller.blinkTimeOut !== undefined
      //   ) {
      //     clearTimeout(controller.blinkTimeOut);
      //     controller.classList.remove("avs-hidden");
      //     controller.blinkTimeOut = setTimeout(
      //       () => {
      //         controller.classList.add("avs-hidden");
      //         controller.blinkTimeOut = undefined;
      //       },
      //       value ? value : 1000
      //     );
      //   }
      //   break
      case "drag":
        handleDrag(v, e);
        break
      // case "fast":
      //   resetSpeed(v, value);
      //   break
      case "pause":
        pause(v);
        break
      case "muted":
        muted(v);
        break
      case "mark":
        setMark(v);
        break
      case "jump":
        jumpToMark(v);
        break
      default:
        log('unkonwn action', 3)
      }
    });
  log("End", 5);
}

function pause(v) {
  if (v.paused) {
    log("Resuming video", 5);
    v.play();
  } else {
    log("Pausing video", 5);
    v.pause();
  }
}

// function resetSpeed(v, target) {
//   if (v.playbackRate === target) {
//     if (v.playbackRate === getKeyBindingData("reset")) {
//       if (target !== 1.0) {
//         log("Resetting playback speed to 1.0", 4);
//         setSpeed(v, 1.0);
//       } else {
//         log('Toggling playback speed to "fast" speed', 4);
//         setSpeed(v, getKeyBindingData("fast"));
//       }
//     } else {
//       log('Toggling playback speed to "reset" speed', 4);
//       setSpeed(v, getKeyBindingData("reset"));
//     }
//   } else {
//     log('Toggling playback speed to "reset" speed', 4);
//     setKeyBindingValue("reset", v.playbackRate);
//     setSpeed(v, target);
//   }
// }

function muted(v) {
  v.muted = v.muted !== true;
}

function setMark(v) {
  log("Adding marker", 5);
  v.avs.mark = v.currentTime;
}
function jumpToMark(v) {
  log("Recalling marker", 5);
  if (v.avs.mark && typeof v.avs.mark === "number") {
    v.currentTime = v.avs.mark;
  }
}

function handleDrag(video, e) {
  const controller = video.avs.div;
  const shadowController = controller.shadowRoot.querySelector("#controller");

  // Find nearest parent of same size as video parent.
  var parentElement = controller.parentElement;
  while (
    parentElement.parentNode &&
    parentElement.parentNode.offsetHeight === parentElement.offsetHeight &&
    parentElement.parentNode.offsetWidth === parentElement.offsetWidth
  ) {
    parentElement = parentElement.parentNode;
  }

  video.classList.add("vcs-dragging");
  shadowController.classList.add("dragging");

  const initialMouseXY = [e.clientX, e.clientY];
  const initialControllerXY = [
    parseInt(shadowController.style.left),
    parseInt(shadowController.style.top)
  ];
  const startDragging = (e) => {
    let style = shadowController.style;
    let dx = e.clientX - initialMouseXY[0];
    let dy = e.clientY - initialMouseXY[1];
    style.left = initialControllerXY[0] + dx + "px";
    style.top = initialControllerXY[1] + dy + "px";
  };
  const stopDragging = () => {
    log("stopping drag", 5);
    parentElement.removeEventListener("mousemove", startDragging);
    parentElement.removeEventListener("mouseup", stopDragging);
    parentElement.removeEventListener("mouseleave", stopDragging);

    shadowController.classList.remove("dragging");
    video.classList.remove("vcs-dragging");
  };

  parentElement.addEventListener("mouseup", stopDragging);
  parentElement.addEventListener("mouseleave", stopDragging);
  parentElement.addEventListener("mousemove", startDragging);
}
