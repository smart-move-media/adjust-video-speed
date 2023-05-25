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
  // ensure speeds are listed slowest to fastest
  speedSets: {
    common: [
      ['snail', 0.1],
      ['turtle', 0.25],
      ['half', 0.5],
      ['slower', 0.75],
      ['slow', 0.9],
      ['normal', 1.0],
      ['fast', 1.1],
      ['faster', 1.25],
      ['speedy', 1.5],
      ['double', 2],
      ['blazing', 3],
    ],
    pitch440: [
      ['-24', 0.2500000],
      ['-12', 0.5000000],
      ['-11', 0.5297315],
      ['-10', 0.5612310],
      ['-9', 0.5946036],
      ['-8', 0.6299605],
      ['-7', 0.6674199],
      ['-6', 0.7071068],
      ['-5', 0.7491535],
      ['-4', 0.7937005],
      ['-3', 0.8408964],
      ['-2', 0.8908987],
      ['-1', 0.9438743],
      ['0', 1.0000000],
      ['+1', 1.0594631],
      ['+2', 1.1224620],
      ['+3', 1.1892071],
      ['+4', 1.2599210],
      ['+5', 1.3348399],
      ['+6', 1.4142136],
      ['+7', 1.4983071],
      ['+8', 1.5874011],
      ['+9', 1.6817928],
      ['+10', 1.7817974],
      ['+11', 1.8877486],
      ['+12', 2.0000000],
    ],
    pitch432: [
      ['-24', 0.2454545],
      ['-12', 0.4909091],
      ['-11', 0.5201001],
      ['-10', 0.5510268],
      ['-9', 0.5837926],
      ['-8', 0.6185067],
      ['-7', 0.6552850],
      ['-6', 0.6942503],
      ['-5', 0.7355326],
      ['-4', 0.7792696],
      ['-3', 0.8256074],
      ['-2', 0.8747006],
      ['-1', 0.9267130],
      ['+0', 0.9818182],
      ['+1', 1.0402001],
      ['+2', 1.1020536],
      ['+3', 1.1675852],
      ['+4', 1.2370134],
      ['+5', 1.3105700],
      ['+6', 1.3885006],
      ['+7', 1.4710651],
      ['+8', 1.5585392],
      ['+9', 1.6512148],
      ['+10', 1.7494011],
      ['+11', 1.8534259],
      ['+12', 1.9636364],
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
