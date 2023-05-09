
export const regStrip = /^[\r\t\f\v ]+|[\r\t\f\v ]+$/gm;
export const SettingFieldsSynced = [
  "keyBindings",
  "version",
  // "displayKeyCode",
  "rememberSpeed",
  "forceLastSavedSpeed",
  "audioBoolean",
  "startHidden",
  "lastSpeed",
  "enabled",
  "controllerOpacity",
  "logLevel",
  "blacklist",
  "ifSpeedIsNormalDontSaveUnlessWeSetIt",
  // "ytAutoEnableClosedCaptions",
  // "ytAutoDisableAutoPlay",
];
///"ytJS" sadly cant figure out a good way to execute js https://bugs.chromium.org/p/chromium/issues/detail?id=1207006 may eventually have a solution
export const SettingFieldsBeforeSync = new Map();
SettingFieldsBeforeSync.set("blacklist", (data) => data.replace(regStrip, ""));

//TODO might need this
// let syncFieldObj = {};
// for (let field of SettingFieldsSynced)
//   syncFieldObj[field] = true;

export let tcDefaults = {
  version: "0.8.3",
  lastSpeed: 1.0,
  // displayKeyCode: 86, // default: V
  rememberSpeed: false,
  audioBoolean: false,
  startHidden: false,
  forceLastSavedSpeed: false,
  enabled: true,
  controllerOpacity: 0.38,
  logLevel: 3, // warning
  defaultLogLevel: 4, //for any command that doesn't specify a log level
  speeds: {}, // empty object to hold speed for each source
  ifSpeedIsNormalDontSaveUnlessWeSetIt: false,
  // ytAutoEnableClosedCaptions: false,
  // ytAutoDisableAutoPlay: false,
  keyBindings: [
    { action: "display", key: 86, value: 0, force: false, predefined: true }, // V
    { action: "slower", key: 83, value: 0.1, force: false, predefined: true }, // S
    { action: "faster", key: 68, value: 0.1, force: false, predefined: true }, // D
    { action: "rewind", key: 90, value: 10, force: false, predefined: true }, // Z
    { action: "advance", key: 88, value: 10, force: false, predefined: true }, // X
    { action: "reset", key: 82, value: 1, force: false, predefined: true }, // R
    { action: "fast", key: 71, value: 1.8, force: false, predefined: true } // G
  ],
  blacklist: `www.instagram.com
    twitter.com
    imgur.com
    teams.microsoft.com
  `.replace(regStrip, ""),
  // Holds a reference to all of the AUDIO/VIDEO DOM elements we've attached to
  mediaElements: []
};
