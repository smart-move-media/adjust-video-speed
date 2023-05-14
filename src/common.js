export const regStrip = /^[\r\t\f\v ]+|[\r\t\f\v ]+$/gm;
export let tcDefaults = {
  version: "0.8.8",
  lastSpeed: 1.0,
  rememberSpeed: true,
  audioBoolean: false,
  controllerOpacity: 0.38,
  enabled: true,
  forceLastSavedSpeed: false,
  ifSpeedIsNormalDontSaveUnlessWeSetIt: false,
  startHidden: false,
  speedSets: {
    common: {
      'snail': 0.1,
      'turtle': 0.25,
      'half': 0.5,
      'slower': 0.75,
      'slow': 0.9,
      'normal': 1.0,
      'fast': 1.1,
      'faster': 1.25,
      'speedy': 1.5,
      'double': 2,
      'blazing': 3,
    },
  },
  speedSetChosen: "common",
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
  logLevel: 5, //3, // warning
  playersSpeed: {}, // empty object to hold speed for each source
  mediaElements: []
};
