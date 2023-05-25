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
      [-24, 0.25],
      [-12, 0.5],
      [-11, 0.5297315],
      [-10, 0.561231],
      [-9, 0.5946036],
      [-8, 0.6299605],
      [-7, 0.6674199],
      [-6, 0.7071068],
      [-5, 0.7491535],
      [-4, 0.7937005],
      [-3, 0.8408964],
      [-2, 0.8908987],
      [-1, 0.9438743],
      [0, 1],
      [1, 1.0594631],
      [2, 1.122462],
      [3, 1.1892071],
      [4, 1.259921],
      [5, 1.3348399],
      [6, 1.4142136],
      [7, 1.4983071],
      [8, 1.5874011],
      [9, 1.6817928],
      [10, 1.7817974],
      [11, 1.8877486],
      [12, 2]
    ],
    pitch432: [
      [-24, 0.2454545],
      [-12, 0.4909091],
      [-11, 0.5201001],
      [-10, 0.5510268],
      [-9, 0.5837926],
      [-8, 0.6185067],
      [-7, 0.655285],
      [-6, 0.6942503],
      [-5, 0.7355326],
      [-4, 0.7792696],
      [-3, 0.8256074],
      [-2, 0.8747006],
      [-1, 0.926713],
      [0, 0.9818182],
      [1, 1.0402001],
      [2, 1.1020536],
      [3, 1.1675852],
      [4, 1.2370134],
      [5, 1.31057],
      [6, 1.3885006],
      [7, 1.4710651],
      [8, 1.5585392],
      [9, 1.6512148],
      [10, 1.7494011],
      [11, 1.8534259],
      [12, 1.9636364]
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

// src/inject.js
var log = function(message, level = 4) {
  if (tc.settings.logLevel >= level) {
    message = `${log.caller?.name ?? "unknown"}: ${message}`;
    if (level === 2) {
      console.log("ERROR:" + message);
    } else if (level === 3) {
      console.log("WARNING:" + message);
    } else if (level === 4) {
      console.log("INFO:" + message);
    } else if (level === 5) {
      console.log("DEBUG:" + message);
    } else if (level === 6) {
      console.log("DEBUG (VERBOSE):" + message);
      console.trace();
    }
  }
};
var getKeyBindings = function(action, what = "value") {
  try {
    return tc.settings.keyBindings.find((item) => item.action === action)[what];
  } catch (e) {
    return false;
  }
};
var setKeyBindings = function(action, value) {
  tc.settings.keyBindings.find((item) => item.action === action)["value"] = value;
};
var formatSpeedIndicator = function(speed) {
  let percent = speed * 100;
  return injectTemplate({
    name: speedSet[0][0],
    percent: percent.toFixed(0) + "%",
    percent1: percent.toFixed(1) + "%",
    percent2: percent.toFixed(2) + "%",
    speed,
    speed2: Number(speed).toFixed(2),
    speed3: Number(speed).toFixed(3)
  });
};
var defineVideoController = function() {
  speedSet = tc.settings.speedSets[tc.settings.speedSetChosen];
  tc.videoController = function(target, parent) {
    if (target.vsc) {
      return target.vsc;
    }
    tc.mediaElements.push(target);
    this.video = target;
    this.parent = target.parentElement || parent;
    storedSpeed = tc.settings.playersSpeed[target.currentSrc];
    if (!tc.settings.rememberSpeed) {
      if (!storedSpeed) {
        log("Setting stored speed to 1.0; rememberSpeed is disabled", 5);
        storedSpeed = 1;
      }
      setKeyBindings("reset", getKeyBindings("fast"));
    } else {
      storedSpeed = tc.settings.lastSpeed;
      log(`Recalled stored speed due to rememberSpeed being enabled: ${storedSpeed}`, 5);
    }
    log("Explicitly setting playbackRate to: " + storedSpeed, 5);
    target.playbackRate = storedSpeed;
    this.div = this.initializeControls();
    var mediaEventAction = function(event) {
      storedSpeed = tc.settings.playersSpeed[event.target.currentSrc];
      if (!tc.settings.rememberSpeed) {
        if (!storedSpeed) {
          log("Setting stored speed to 1.0 (rememberSpeed not enabled)", 4);
          storedSpeed = 1;
        }
        log("Setting reset keybinding to fast", 5);
        setKeyBindings("reset", getKeyBindings("fast"));
      } else {
        log("Recalling stored speed; rememberSpeed is enabled_", 5);
        storedSpeed = tc.settings.lastSpeed;
      }
      log("Explicitly setting playbackRate to: " + storedSpeed, 4);
      setSpeed(event.target, storedSpeed, "explicit");
    };
    target.addEventListener("play", this.handlePlay = mediaEventAction.bind(this));
    target.addEventListener("seeked", this.handleSeek = mediaEventAction.bind(this));
    var observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && (mutation.attributeName === "src" || mutation.attributeName === "currentSrc")) {
          log("mutation of A/V element", 5);
          var controller = this.div;
          if (!mutation.target.src && !mutation.target.currentSrc) {
            controller.classList.add("vsc-nosource");
          } else {
            controller.classList.remove("vsc-nosource");
          }
        }
      });
    });
    observer.observe(target, {
      attributeFilter: ["src", "currentSrc"]
    });
  };
  tc.videoController.prototype.remove = function() {
    this.div.remove();
    this.video.removeEventListener("play", this.handlePlay);
    this.video.removeEventListener("seek", this.handleSeek);
    delete this.video.vsc;
    let idx = tc.mediaElements.indexOf(this.video);
    if (idx != -1) {
      tc.mediaElements.splice(idx, 1);
    }
  };
  tc.videoController.prototype.initializeControls = function() {
    log("Begin", 5);
    const document2 = this.video.ownerDocument;
    const rect = this.video.getBoundingClientRect();
    const offsetRect = this.video.offsetParent?.getBoundingClientRect();
    const top = Math.max(rect.top - (offsetRect?.top || 0), 33) + "px";
    const left = Math.max(rect.left - (offsetRect?.left || 0), 33) + "px";
    var wrapper = document2.createElement("div");
    wrapper.classList.add("vsc-controller");
    if (!this.video.currentSrc)
      wrapper.classList.add("vsc-nosource");
    if (tc.settings.startHidden)
      wrapper.classList.add("vsc-hidden");
    var shadow = wrapper.attachShadow({ mode: "open" });
    var shadowTemplate = `
        <style>
          @import "${chrome.runtime.getURL("shadow.css")}";
        </style>

        <div id="controller" style="top:${top}; left:${left}; opacity:${tc.settings.controllerOpacity}">
          <span data-action="drag" class="draggable">--</span>
          <span id="controls">
            <button data-action="rewind" class="rw">\xAB</button>
            <button data-action="slower">&minus;</button>
            <button data-action="faster">&plus;</button>
            <button data-action="advance" class="rw">\xBB</button>
            <button data-action="display" class="hideButton">&times;</button>
          </span>
        </div>
      `;
    shadow.innerHTML = shadowTemplate;
    shadow.querySelector(".draggable").addEventListener("mousedown", (e) => {
      runAction(e.target.dataset["action"], false, e);
      e.stopPropagation();
    }, true);
    shadow.querySelectorAll("button").forEach(function(button) {
      button.addEventListener("click", (e) => {
        runAction(e.target.dataset["action"], getKeyBindings(e.target.dataset["action"]), e);
        e.stopPropagation();
      }, true);
    });
    shadow.querySelector("#controller").addEventListener("click", (e) => e.stopPropagation(), false);
    shadow.querySelector("#controller").addEventListener("mousedown", (e) => e.stopPropagation(), false);
    this.speedIndicator = shadow.querySelector("span");
    var fragment = document2.createDocumentFragment();
    fragment.appendChild(wrapper);
    switch (true) {
      case location.hostname == "www.amazon.com":
      case location.hostname == "www.reddit.com":
      case /hbogo\./.test(location.hostname):
        this.parent.parentElement.insertBefore(fragment, this.parent);
        break;
      case location.hostname == "www.facebook.com":
        let p = this.parent.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        p.insertBefore(fragment, p.firstChild);
        break;
      case location.hostname == "tv.apple.com":
        this.parent.parentNode.insertBefore(fragment, this.parent.parentNode.firstChild);
        break;
      default:
        this.parent.insertBefore(fragment, this.parent.firstChild);
    }
    return wrapper;
  };
};
var escapeStringRegExp = function(str) {
  matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
  return str.replace(matchOperatorsRe, "\\$&");
};
var isBlacklisted = function() {
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
};
var refreshCoolDown = function() {
  log("Begin refreshCoolDown", 5);
  if (coolDown) {
    clearTimeout(coolDown);
  }
  coolDown = setTimeout(function() {
    coolDown = false;
  }, 1000);
  log("End refreshCoolDown", 5);
};
var setupListener = function() {
  function updateSpeedFromEvent(video, event) {
    if (!video.vsc)
      return;
    var src = video.currentSrc;
    var speed = Number(video.playbackRate).toFixed(7);
    var ident = `${video.className} ${video.id} ${video.name} ${video.url} ${video.offsetWidth}x${video.offsetHeight}`;
    log("Playback rate changed to " + speed + ` for: ${ident}`, 4);
    log("Updating controller with new speed", 5);
    video.vsc.speedIndicator.textContent = formatSpeedIndicator(speed);
    tc.settings.playersSpeed[src] = speed;
    let wasUs = event.detail && event.detail.origin === "videoSpeed";
    if (wasUs || !tc.settings.ifSpeedIsNormalDontSaveUnlessWeSetIt || speed != 1) {
      log("Storing lastSpeed in settings for the rememberSpeed feature", 5);
      tc.settings.lastSpeed = speed;
      log("Syncing chrome settings for lastSpeed", 5);
      chrome.storage.sync.set({ lastSpeed: speed }, function() {
        log("Speed setting saved: " + speed, 5);
      });
    } else
      log(`Speed update to ${speed} ignored due to ifSpeedIsNormalDontSaveUnlessWeSetIt`, 5);
    runAction("blink", null, null);
  }
  document.addEventListener("ratechange", function(event) {
    if (coolDown) {
      log("Speed event propagation blocked", 4);
      event.stopImmediatePropagation();
    }
    var video = event.target;
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
  }, true);
};
var initializeWhenReady = function(document2) {
  log("Begin initializeWhenReady", 5);
  if (isBlacklisted()) {
    return;
  }
  window.onload = () => {
    initializeNow(window.document);
  };
  if (document2) {
    if (document2.readyState === "complete") {
      initializeNow(document2);
    } else {
      document2.onreadystatechange = () => {
        if (document2.readyState === "complete") {
          initializeNow(document2);
        }
      };
    }
  }
  log("End initializeWhenReady", 5);
};
var inIframe = function() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};
var getShadow = function(parent) {
  let result = [];
  function getChild(parent2) {
    if (parent2.firstElementChild) {
      var child = parent2.firstElementChild;
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
};
var initializeNow = function(document2) {
  log("Begin initializeNow", 5);
  if (!tc.settings.enabled)
    return;
  if (!document2.body || document2.body.classList.contains("vsc-initialized")) {
    return;
  }
  try {
    setupListener();
  } catch {
  }
  document2.body.classList.add("vsc-initialized");
  log("initializeNow: vsc-initialized added to document body", 5);
  if (document2 === window.document) {
    defineVideoController();
  } else {
    var link = document2.createElement("link");
    link.href = chrome.runtime.getURL("inject.css");
    link.type = "text/css";
    link.rel = "stylesheet";
    document2.head.appendChild(link);
  }
  var docs = Array(document2);
  try {
    if (inIframe())
      docs.push(window.top.document);
  } catch (e) {
  }
  docs.forEach(function(doc) {
    doc.addEventListener("keydown", function(event) {
      var keyCode = event.keyCode;
      log("Processing keydown event: " + keyCode, 6);
      if (!event.getModifierState || event.getModifierState("Alt") || event.getModifierState("Control") || event.getModifierState("Fn") || event.getModifierState("Meta") || event.getModifierState("Hyper") || event.getModifierState("OS")) {
        log("Keydown event ignored due to active modifier: " + keyCode, 5);
        return;
      }
      if (event.target.nodeName === "INPUT" || event.target.nodeName === "TEXTAREA" || event.target.isContentEditable) {
        return false;
      }
      if (!tc.mediaElements.length) {
        return false;
      }
      var item = tc.settings.keyBindings.find((item2) => item2.key === keyCode);
      if (item) {
        runAction(item.action, item.value);
        if (item.force === "true") {
          event.preventDefault();
          event.stopPropagation();
        }
      }
      return false;
    }, true);
  });
  function checkForVideo(node, parent, added) {
    if (!added && document2.body.contains(node)) {
      return;
    }
    if (node.nodeName === "VIDEO" || node.nodeName === "AUDIO" && tc.settings.audioBoolean) {
      if (added) {
        node.vsc = new tc.videoController(node, parent);
      } else {
        if (node.vsc) {
          node.vsc.remove();
        }
      }
    } else if (node.children != null) {
      for (var i = 0;i < node.children.length; i++) {
        const child = node.children[i];
        checkForVideo(child, child.parentNode || parent, added);
      }
    }
  }
  var observer = new MutationObserver(function(mutations) {
    requestIdleCallback((_) => {
      mutations.forEach(function(mutation) {
        switch (mutation.type) {
          case "childList":
            mutation.addedNodes.forEach(function(node) {
              if (typeof node === "function")
                return;
              if (node === document2.documentElement) {
                log("Document was replaced, reinitializing", 5);
                initializeWhenReady(document2);
                return;
              }
              checkForVideo(node, node.parentNode || mutation.target, true);
            });
            mutation.removedNodes.forEach(function(node) {
              if (typeof node === "function")
                return;
              checkForVideo(node, node.parentNode || mutation.target, false);
            });
            break;
          case "attributes":
            if (mutation.target.attributes["aria-hidden"] && mutation.target.attributes["aria-hidden"].value == "false" || mutation.target.nodeName === "APPLE-TV-PLUS-PLAYER") {
              var flattenedNodes = getShadow(document2.body);
              var nodes = flattenedNodes.filter((x) => x.tagName == "VIDEO");
              for (let node of nodes) {
                if (node.vsc && mutation.target.nodeName === "APPLE-TV-PLUS-PLAYER")
                  continue;
                if (node.vsc)
                  node.vsc.remove();
                checkForVideo(node, node.parentNode || mutation.target, true);
              }
            }
            break;
        }
      });
    }, { timeout: 1000 });
  });
  observer.observe(document2, {
    attributeFilter: ["aria-hidden", "data-focus-method"],
    childList: true,
    subtree: true
  });
  if (tc.settings.audioBoolean) {
    var mediaTags = document2.querySelectorAll("video,audio");
  } else {
    var mediaTags = document2.querySelectorAll("video");
  }
  mediaTags.forEach(function(video) {
    video.vsc = new tc.videoController(video);
  });
  var frameTags = document2.getElementsByTagName("iframe");
  Array.prototype.forEach.call(frameTags, function(frame) {
    try {
      var childDocument = frame.contentDocument;
    } catch (e) {
      return;
    }
    initializeWhenReady(childDocument);
  });
  log("End initializeNow", 5);
};
var changeSpeed = function(video, direction = "") {
  const playbackRate = video.playbackRate.toFixed(7);
  log(`(${playbackRate})`, 4);
  for (const [idx, pair] of speedSet.entries()) {
    let [n, rate] = pair;
    rate = rate.toFixed(7);
    log("+" + idx + "=" + n + "~" + rate + "-" + playbackRate, 4);
    if (playbackRate === rate) {
      log("found at:" + idx + "=" + n + "~" + rate + "-" + playbackRate, 3);
      if (direction === "-") {
        setSpeed(video, speedSet[idx - 1][1]);
        break;
      }
      if (direction === "+") {
        setSpeed(video, speedSet[idx + 1][1]);
        break;
      }
    } else if (playbackRate < rate) {
      if (direction === "-") {
        setSpeed(video, speedSet[idx - 1][1]);
        break;
      }
      if (direction === "+") {
        setSpeed(video, speedSet[idx][1]);
        break;
      }
    }
  }
};
var setSpeed = function(video, speed) {
  speed = Number(speed).toFixed(7);
  log(" started: " + speed, 5);
  if (tc.settings.forceLastSavedSpeed) {
    video.dispatchEvent(new CustomEvent("ratechange", {
      detail: { origin: "videoSpeed", speed }
    }));
  } else {
    video.playbackRate = speed;
    log(`not forced ${speed}`);
  }
  video.vsc.speedIndicator.textContent = formatSpeedIndicator(speed);
  tc.settings.lastSpeed = speed;
  refreshCoolDown();
  log("setSpeed finished: " + speed, 5);
};
var runAction = function(action, value, e) {
  log("runAction Begin", 5);
  var mediaTags = tc.mediaElements;
  if (e) {
    var targetController = e.target.getRootNode().host;
  }
  mediaTags.forEach(function(v) {
    var controller = v.vsc.div;
    if (e && !(targetController == controller)) {
      return;
    }
    showController(controller);
    if (!v.classList.contains("vsc-cancelled")) {
      if (action === "rewind") {
        log("Rewind", 5);
        v.currentTime -= value;
      } else if (action === "advance") {
        log("Fast forward", 5);
        v.currentTime += value;
      } else if (action === "faster") {
        log("Increase speed", 5);
        changeSpeed(v, "+");
      } else if (action === "slower") {
        log("Decrease speed", 5);
        changeSpeed(v, "-");
      } else if (action === "display") {
        log("Showing controller", 5);
        controller.classList.add("vsc-manual");
        controller.classList.toggle("vsc-hidden");
      } else if (action === "blink") {
        log("Showing controller momentarily", 5);
        if (controller.classList.contains("vsc-hidden") || controller.blinkTimeOut !== undefined) {
          clearTimeout(controller.blinkTimeOut);
          controller.classList.remove("vsc-hidden");
          controller.blinkTimeOut = setTimeout(() => {
            controller.classList.add("vsc-hidden");
            controller.blinkTimeOut = undefined;
          }, value ? value : 1000);
        }
      } else if (action === "drag") {
        handleDrag(v, e);
      } else if (action === "pause") {
        pause(v);
      } else if (action === "muted") {
        muted(v);
      } else if (action === "mark") {
        setMark(v);
      } else if (action === "jump") {
        jumpToMark(v);
      }
    }
  });
  log("runAction End", 5);
};
var pause = function(v) {
  if (v.paused) {
    log("Resuming video", 5);
    v.play();
  } else {
    log("Pausing video", 5);
    v.pause();
  }
};
var muted = function(v) {
  v.muted = v.muted !== true;
};
var setMark = function(v) {
  log("Adding marker", 5);
  v.vsc.mark = v.currentTime;
};
var jumpToMark = function(v) {
  log("Recalling marker", 5);
  if (v.vsc.mark && typeof v.vsc.mark === "number") {
    v.currentTime = v.vsc.mark;
  }
};
var handleDrag = function(video, e) {
  const controller = video.vsc.div;
  const shadowController = controller.shadowRoot.querySelector("#controller");
  var parentElement = controller.parentElement;
  while (parentElement.parentNode && parentElement.parentNode.offsetHeight === parentElement.offsetHeight && parentElement.parentNode.offsetWidth === parentElement.offsetWidth) {
    parentElement = parentElement.parentNode;
  }
  video.classList.add("vcs-dragging");
  shadowController.classList.add("dragging");
  const initialMouseXY = [e.clientX, e.clientY];
  const initialControllerXY = [
    parseInt(shadowController.style.left),
    parseInt(shadowController.style.top)
  ];
  const startDragging = (e2) => {
    let style = shadowController.style;
    let dx = e2.clientX - initialMouseXY[0];
    let dy = e2.clientY - initialMouseXY[1];
    style.left = initialControllerXY[0] + dx + "px";
    style.top = initialControllerXY[1] + dy + "px";
  };
  const stopDragging = () => {
    parentElement.removeEventListener("mousemove", startDragging);
    parentElement.removeEventListener("mouseup", stopDragging);
    parentElement.removeEventListener("mouseleave", stopDragging);
    shadowController.classList.remove("dragging");
    video.classList.remove("vcs-dragging");
  };
  parentElement.addEventListener("mouseup", stopDragging);
  parentElement.addEventListener("mouseleave", stopDragging);
  parentElement.addEventListener("mousemove", startDragging);
};
var showController = function(controller) {
  log("Showing controller", 4);
  controller.classList.add("vcs-show");
  if (timer)
    clearTimeout(timer);
  timer = setTimeout(function() {
    controller.classList.remove("vcs-show");
    timer = false;
    log("Hiding controller", 5);
  }, 2000);
};
var SettingFieldsBeforeSync = new Map;
SettingFieldsBeforeSync.set("blacklist", (data) => data.replace(regStrip, ""));
var SettingFieldsSynced = Object.keys(tcDefaults);
var regEndsWithFlags = /\/(?!.*(.).*\1)[gimsuy]*$/;
var tc = {
  settings: {
    ...tcDefaults
  },
  mediaElements: []
};
var speedSet = [];
for (let field of SettingFieldsSynced) {
  if (tcDefaults[field] === undefined)
    log(`Warning a field we sync: ${field} not found on our tc.settings class likely error`, 3);
}
chrome.storage.sync.get(tc.settings, function(storage) {
  tc.settings.keyBindings = storage.keyBindings;
  if (storage.keyBindings.length == 0) {
    storage.keyBindings = [...tcDefaults.keyBindings];
    tc.settings.version = tcDefaults.version;
    let toSet = {};
    for (let _field of SettingFieldsSynced) {
      let val = tc.settings[_field];
      if (SettingFieldsBeforeSync.has(_field))
        val = SettingFieldsBeforeSync.get(_field)(val);
      toSet[_field] = val;
    }
    chrome.storage.sync.set(toSet);
  }
  for (let field of SettingFieldsSynced) {
    let origType = typeof tcDefaults[field];
    switch (origType) {
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
var strTemplate = "${name} : ${speed3}";
var injectTemplate = (obj) => strTemplate.replace(/\${(.*?)}/g, (x, g) => obj[g]);
var coolDown = false;
var timer = null;
