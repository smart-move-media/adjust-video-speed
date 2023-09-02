# Adjust Video Speed

![Adjust Video Speed logo](https://raw.githubusercontent.com/smart-move-media/adjust-video-speed/master/img/adjust-video-speed.logo.svg)

### WARNING: fork in public beta 2023-09

HTML5 video provides a native API to accelerate playback of any video. This Chrome extention allows you to change the video speed in different configurations; *musical pitched* speeds (default), *common* increments, or your you can edit the preferences to own custom speed-set.


## Instructions
***Not in Chrome Store yet!***

### Manual Installation

Detailed instructions for how to [install a browser extension is at DEV.to](https://dev.to/tombyrer/installing-chrome-extension-from-raw-source-code-2m4), but here is the short version:

  1. Download/unpack [github.com/smart-move-media/adjust-video-speed](https://github.com/smart-move-media/adjust-video-speed)
  2. In Chrome, open extentions at `chrome://extensions`
      * In [Brave web browser](https://brave.com/), open extentions at `brave://extensions/`
  3. Turn on **Developer mode** switch on top-right
  4. [ **Load unpacked** ] button
  5. choose the folder where you cloned/unpacked zip

### Usage

After instalation, navigate to any page that offers HTML5 video (examples: <a href="https://rumble.com/v2bmh7d-oatmeal-cake-and-brown-sugar-glaze-old-fashioned-goodness-heirloom-recipe-t.html" target="_blank">rumble</a>, <a href="https://odysee.com/@fireship/cpu-vs-gpu-vs-tpu-vs-dpu-vs-qpu" target="_blank">odysee</a>, or this <a href="https://youtu.be/DfJrL4LEXz0" target="_blank">YouTube</a> screenshot source), you'll see the minimized controller with the speed indicator in the upper left corner:<br/>
![Adjust Video Speed UI in upper-left corner](https://raw.githubusercontent.com/smart-move-media/adjust-video-speed/master/img/0-initalizeed-location.jpg)

Now you'll see a speed indicator in top left corner. On some sites, like YouTube, Adjust Video Speed will hide with the video player hides.  The speed indicator will re-appear when you mouse over the video player so all the controlls appear.

Hover over the indicator to reveal the buttons to accelerate [**+**], slowdown [**-**], and quickly rewind [**«**] or advance [**»**] the video.  The right [**⯆**] button will open the config to change the array of speed settings.<br/>
![Adjust Video Speed UI open on hover](https://raw.githubusercontent.com/smart-move-media/adjust-video-speed/master/img/1-hover.jpg)

### Keyboard Shortcuts

- **S** - decrease playback speed
- **D** - increase playback speed
- **Z** - rewind video by 10 seconds
- **X** - advance video by 10 seconds
- **V** - hide/show the controller

This extension listens both for lower and upper case values (i.e. use `Shift-<shortcut>`) if there is other functionality assigned to the lowercase key.

### Preferences

You can customize and reassign the default shortcut keys, as well edit the steps in which you increase/decrease stpes (`speedSets`), change the displayed `speedTemplate`, & more configurations by editing the JSON:

1. In a new tab, navigate to `chrome://extensions`, `brave://extensions`, etc
2. Find "Adjust Video Speed" extension
3. Click on [ Details ] button
3. Click on `Extention Options` down
4. Edit the JSON
    - copy/paste configs if you want
    - [CTRL-s] to save, [CTRL-o] to open
5. click on [ Save from RawJSON ]


## FAQ

**[Much of code & README is from Ilya Grigorik](https://github.com/igrigorik/videospeed)**

Ilya's version featured incrementing and decrementing by a set amount.  If that is what you prefer over an array configuration, then perhaps try [his from the Chrome Store](https://chrome.google.com/webstore/detail/video-speed-controller/nffaoalbilbmmfgbnbgppjihopabppdk) (disable my version first).
Also some code added from [Mitch Capper](https://github.com/mitchcapper/videospeed)

**Science of accelerated playback**: _TL;DR: faster playback translates to better engagement and retention._

The average adult reads prose text at [250 to 300 words per minute](http://www.paperbecause.com/PIOP/files/f7/f7bb6bc5-2c4a-466f-9ae7-b483a2c0dca4.pdf) (wpm). By contrast, the average rate of speech for English speakers is ~150 wpm,
with slide presentations often closer to 100 wpm. As a result, when given the choice, some viewers [speed up video playback to ~1.3\~1.5 its recorded rate](http://research.microsoft.com/en-us/um/redmond/groups/coet/compression/chi99/paper.pdf) to compensate for the difference.

Many viewers report that [accelerated viewing keeps their attention longer](http://www.enounce.com/docs/BYUPaper020319.pdf). In fact, with a little training many end up watching videos at 2x the recorded speed. Some studies report that after being exposed to accelerated playback, [listeners become uncomfortable](http://alumni.media.mit.edu/~barons/html/avios92.html#beasleyalteredspeech) if they are forced to return to normal rate of presentation.

That said, some people with neurodivergance (concussion, ADHD, etc) or others who are multitasking may find slower videos helps with understanding.  "Adjust Video Speed" assists everyone get the speed that they prefer!

**Video controls are not showing up?** This extension is only compatible with HTML5 video players, and a few rare sites do break this.

**The speed controls are not showing up for local videos?** To enable playback of local media (e.g. File > Open File), you need to grant additional permissions to the extension.

- In a new tab, navigate to `chrome://extensions`
- Find "Adjust Video Speed" extension in the list and enable "Allow access
  to file URLs"
- Open a new tab and try opening a local file; the controls should show up.

### Development

The SVG files in the `/icons` folder are **not used** by Chrome, but for creation of the PNG files:
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
- Copyright (c) 2014 [Ilya Grigorik](https://github.com/igrigorik)
- Copyright (c) 2023 [Mitch Capper](https://github.com/mitchcapper)
- Copyright (c) 2023 [Tom Byrer](https://github.com/tomByrer)
