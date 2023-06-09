export const regStrip = /^[\r\t\f\v ]+|[\r\t\f\v ]+$/gm;
export let tcDefaults = {
  version: "0.8.10",
  lastSpeed: 1.0,
  rememberSpeed: true,
  audioBoolean: false,
  controllerOpacity: 0.6,
  enabled: true,
  forceLastSavedSpeed: false,
  ifSpeedIsNormalDontSaveUnlessWeSetIt: false,
  startHidden: false,
  speedTemplate: '<b style="display:inline-block;min-width:2.5em;">${speed3}</b><i class="hoverShow" style="min-width:3.3em;">: ${name}</i>',
  //! ensure speeds are listed slowest to fastest
  // Max playback speed in Chrome is set to 16:
  // https://cs.chromium.org/chromium/src/third_party/blink/renderer/core/html/media/html_media_element.cc?gsn=kMinRate&l=166
  // Video min rate is 0.0625:
  // https://cs.chromium.org/chromium/src/third_party/blink/renderer/core/html/media/html_media_element.cc?gsn=kMinRate&l=165
  speedSets: {
    common: [
      // [0.1, 'snail'],
      [0.25, 'turtle'],
      [0.5, 'half'],
      [0.75, 'slower'],
      [0.9, 'slow'],
      [1.0, 'normal'],
      [1.1, 'fast'],
      [1.25, 'faster'],
      [1.5, 'speedy'],
      [2, 'double'],
      // [3, 'blazing'],
    ],
    pitch: [
      // [0.2500000, '-24'],
      [0.5000000, '-12'],
      [0.5297315, '-11'],
      [0.5612310, '-10'],
      [0.5946036, '-9'],
      [0.6299605, '-8'],
      [0.6674199, '-7'],
      [0.7071068, '-6'],
      [0.7491535, '-5'],
      [0.7937005, '-4'],
      [0.8408964, '-3'],
      [0.8908987, '-2'],
      [0.9438743, '-1'],
      [1.0000000, '0'],
      [1.0594631, '+1'],
      [1.1224620, '+2'],
      [1.1892071, '+3'],
      [1.2599210, '+4'],
      [1.3348399, '+5'],
      [1.4142136, '+6'],
      [1.4983071, '+7'],
      [1.5874011, '+8'],
      [1.6817928, '+9'],
      [1.7817974, '+10'],
      [1.8877486, '+11'],
      [2.0000000, '+12'],
    ],
    pitch432Hz: [
      // [0.2454545, '-24'],
      [0.4909091, '-12'],
      [0.5201001, '-11'],
      [0.5510268, '-10'],
      [0.5837926, '-9'],
      [0.6185067, '-8'],
      [0.6552850, '-7'],
      [0.6942503, '-6'],
      [0.7355326, '-5'],
      [0.7792696, '-4'],
      [0.8256074, '-3'],
      [0.8747006, '-2'],
      [0.9267130, '-1'],
      [0.9818182, '0'],
      [1.0402001, '+1'],
      [1.1020536, '+2'],
      [1.1675852, '+3'],
      [1.2370134, '+4'],
      [1.3105700, '+5'],
      [1.3885006, '+6'],
      [1.4710651, '+7'],
      [1.5585392, '+8'],
      [1.6512148, '+9'],
      [1.7494011, '+10'],
      [1.8534259, '+11'],
      [1.9636364, '+12'],
    ],
  },
  speedSetChosen: "common",
  keyBindings: [
    { action: "display", key: 86, value: 0, force: false, predefined: true }, // V
    { action: "slower", key: 83, value: 0.1, force: false, predefined: true }, // S
    { action: "faster", key: 68, value: 0.1, force: false, predefined: true }, // D
    { action: "rewind", key: 90, value: 10, force: false, predefined: true }, // Z
    { action: "advance", key: 88, value: 10, force: false, predefined: true }, // X
    // { action: "reset", key: 82, value: 1, force: false, predefined: true }, // R
    // { action: "fast", key: 71, value: 1.8, force: false, predefined: true } // G
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
