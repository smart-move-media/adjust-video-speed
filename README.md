# Adjust Video Speed
\
![Player](./img/adjust-video-speed.logo.svg)

### WARNING: fork in public beta 2023-09

HTML5 video provides a native API to accelerate playback of any video. This Chrome extention allows you to change the video speed in different configurations; musical pitch, more fine-grained defaults, or your own custom array.


~~~## _[Install Chrome Extension](https://github.com/smart-move-media/adjust-video-speed)
~~~

## Usage
**Not in Chrome Store yet!**

### Manual Installation

  1. Go to repo at [github.com/smart-move-media/adjust-video-speed](https://github.com/smart-move-media/adjust-video-speed)
  2. Download repo:
      * Click on green [<> Code] button near top-middle
      * bottom of dropdown, choose "Download ZIP"
      * unpack zip
  3. In Chrome open extentions at [chrome://extensions/](chrome://extensions/)
      * In [Brave web browser](https://brave.com/) open extentions at [brave://extensions/](brave://extensions/)
  4. Turn on **Developer mode** switch on top-right
  5. ( Load unpacked ) button
  6. open where you cloned/unpacked zip to install

\*\* Once the extension is installed, simply navigate to any page that offers HTML5 video ([example](http://www.youtube.com/watch?v=E9FxNzv1Tr8)), and you'll see a speed indicator in top left corner. Hover over the indicator to reveal the
controls to accelerate, slowdown, and quickly rewind or advance the video. Or, even better, use your keyboard:

- **S** - decrease playback speed.
- **D** - increase playback speed.
- **R** - reset playback speed to 1.0x.
- **Z** - rewind video by 10 seconds.
- **X** - advance video by 10 seconds.
- **G** - toggle between current and user configurable preferred speed.
- **V** - show/hide the controller.

This extension listens both for lower and upper case values (i.e. you can use `Shift-<shortcut>`) if there is other functionality assigned to the lowercase key.

You can customize and reassign the default shortcut keys in the extensions settings page as well as add additional shortcut keys to match your preferences by editing the JSON.

## Configuration

1. In a new tab, navigate to `chrome://extensions`
2. Find "Adjust Video Speed" extension
3. Click on `Extention Options` down in the details
4. Edit the JSON
    - copy/paste configs if you want
    - [CTRL-s] to save, [CTRL-o] to open

## FAQ

**[Much of code & README is from Ilya Grigorik](https://github.com/igrigorik/videospeed)**

His version featured incrementing and decrementing by a set amount.  If that is what you prefer over an array configuration, then perhaps try his from the Chrome store (disable my version first).
Also some code added from [Mitch Capper](https://github.com/mitchcapper/videospeed)

**Science of accelerated playback**: _TL;DR: faster playback translates to better engagement and retention._

The average adult reads prose text at [250 to 300 words per minute](http://www.paperbecause.com/PIOP/files/f7/f7bb6bc5-2c4a-466f-9ae7-b483a2c0dca4.pdf) (wpm). By contrast, the average rate of speech for English speakers is ~150 wpm,
with slide presentations often closer to 100 wpm. As a result, when given the choice, many viewers [speed up video playback to ~1.3\~1.5 its recorded rate](http://research.microsoft.com/en-us/um/redmond/groups/coet/compression/chi99/paper.pdf) to compensate for the difference.

Many viewers report that [accelerated viewing keeps their attention longer](http://www.enounce.com/docs/BYUPaper020319.pdf): faster delivery keeps the viewer more engaged with the content. In fact, with a little training many end up watching videos at 2x the recorded speed. Some studies report that after being exposed to accelerated playback, [listeners become uncomfortable](http://alumni.media.mit.edu/~barons/html/avios92.html#beasleyalteredspeech) if they are forced to return to normal rate of presentation.

**Video controls are not showing up?** This extension is only compatible with HTML5 video.

**The speed controls are not showing up for local videos?** To enable playback of local media (e.g. File > Open File), you need to grant additional permissions to the extension.

- In a new tab, navigate to `chrome://extensions`
- Find "Adjust Video Speed" extension in the list and enable "Allow access
  to file URLs"
- Open a new tab and try opening a local file; the controls should show up.

### Development

The SVG files in the `/icons` folder are **not used** by Chrome, but are used to create the PNG files:
```bash
  inkscape -w 16 -h 16 -o icon16.png icon128.svg
  inkscape -w 32 -h 32 -o icon32.png icon128.svg
  inkscape -w 48 -h 48 -o icon48.png icon128.svg
  inkscape -w 128 -h 128 -o icon128.png icon128.svg
  inkscape -w 16 -h 16 -o icon16_disabled.png icon128_disabled.svg
  inkscape -w 32 -h 32 -o icon32_disabled.png icon128_disabled.svg
  inkscape -w 48 -h 48 -o icon48_disabled.png icon128_disabled.svg
  wait
  optipng *.png
```

### ToDo

  * fix disabled mode for icons
  * highlight chosen button
  * scroll only the speedList buttons, & keep top contolls fixed
    + most CSS in `shadow.css`, but `inspect.js` has `id="controller"` & `buildSpeedDropdown()`
  * return prefs UI

### License

(MIT License)
- Copyright (c) 2014 Ilya Grigorik
- Copyright (c) 2023 Mitch Capper
- Copyright (c) 2023 Tom Byrer
