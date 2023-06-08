# Adjust Video Speed

### WARNING: fork under construction 2023-05

HTML5 video provides a native API to accelerate playback of any video. The
problem is many players either hide or limit this functionality. For the best
results, playback speed adjustments should be easy and frequent to match the pace
and content being covered: we don't read at a fixed speed, and similarly, we
need an easy way to accelerate the video, slow it down, and quickly rewind the
last point to listen to it a few more times.

![Player](https://cloud.githubusercontent.com/assets/2400185/24076745/5723e6ae-0c41-11e7-820c-1d8e814a2888.png)

~~~## _[Install Chrome Extension](https://github.com/smart-move-media/adjust-video-speed)
~~~

**Not in Chrome Store yet!**

### Manual Installation

  1. Go to repo at [github.com/smart-move-media/adjust-video-speed](https://github.com/smart-move-media/adjust-video-speed)
  2. Clone repo
    * If you don't know how to clone:
    * Click on [<> Code] button in top-middle
    * bottom of dropdown, choose "Download ZIP"
  3. In Chrome/Brave/Edge open extentions at [brave://extensions/](brave://extensions/)
  4. Turn on **Developer mode** switch
  5. ( Load unpacked ) button
  6. open where you cloned/unpacked zip
  
## Usage

\*\* Once the extension is installed simply navigate to any page that offers
HTML5 video ([example](http://www.youtube.com/watch?v=E9FxNzv1Tr8)), and you'll
see a speed indicator in top left corner. Hover over the indicator to reveal the
controls to accelerate, slowdown, and quickly rewind or advance the video. Or,
even better, simply use your keyboard:

- **S** - decrease playback speed.
- **D** - increase playback speed.
- **R** - reset playback speed to 1.0x.
- **Z** - rewind video by 10 seconds.
- **X** - advance video by 10 seconds.
- **G** - toggle between current and user configurable preferred speed.
- **V** - show/hide the controller.

You can customize and reassign the default shortcut keys in the extensions
settings page as well as add additional shortcut keys to match your
preferences. As an example, you can assign multiple "preferred speed" shortcuts with different values, allowing you to quickly toggle between your most frequently used speeds. To add a new shortcut, open extension settings
and edit the JSON.

Unfortunately, some sites may assign other functionality to one of the shortcut keys - this is inevitable. As a workaround, the extension
listens both for lower and upper case values (i.e. you can use
`Shift-<shortcut>`) if there is other functionality assigned to the lowercase
key. This is not a perfect solution since some sites may listen to both, but it works
most of the time.

## Configuration

1. In a new tab, navigate to `chrome://extensions`
2. Find "Adjust Video Speed" extension
3. Click on `Extention Options` down in the details
4. Edit the JSON
    - copy/paste configs if you want
    - [CTRL-s] to save, [CTRL-o] to open

## FAQ

**Science of accelerated playback**: _TL;DR: faster playback translates to better engagement and retention._

The average adult reads prose text at
[250 to 300 words per minute](http://www.paperbecause.com/PIOP/files/f7/f7bb6bc5-2c4a-466f-9ae7-b483a2c0dca4.pdf)
(wpm). By contrast, the average rate of speech for English speakers is ~150 wpm,
with slide presentations often closer to 100 wpm. As a result, when given the
choice, many viewers
[speed up video playback to ~1.3\~1.5 its recorded rate](http://research.microsoft.com/en-us/um/redmond/groups/coet/compression/chi99/paper.pdf)
to compensate for the difference.

Many viewers report that
[accelerated viewing keeps their attention longer](http://www.enounce.com/docs/BYUPaper020319.pdf):
faster delivery keeps the viewer more engaged with the content. In fact, with a
little training many end up watching videos at 2x+ the recorded speed. Some
studies report that after being exposed to accelerated playback,
[listeners become uncomfortable](http://alumni.media.mit.edu/~barons/html/avios92.html#beasleyalteredspeech)
if they are forced to return to normal rate of presentation.

**Video controls are not showing up?** This extension is only compatible
with HTML5 video.

**The speed controls are not showing up for local videos?** To enable playback
of local media (e.g. File > Open File), you need to grant additional permissions
to the extension.

- In a new tab, navigate to `chrome://extensions`
- Find "Adjust Video Speed" extension in the list and enable "Allow access
  to file URLs"
- Open a new tab and try opening a local file; the controls should show up.

### Contributing

Install [Bun](https://bun.sh/) for the builder.
If you want to edit the `inject.js` & `options.js`, do so only in `./src`
`npm build`

#### ToDo:

  * scroll only the speedList buttons, & keep top contolls fixed
    + most CSS in `shadow.css`, but `inspect.js` has `id="controller"` & `buildSpeedDropdown()`
  * return prefs UI

### License

(MIT License)
- Copyright (c) 2014 Ilya Grigorik
- Copyright (c) 2023 Mitch Capper
- Copyright (c) 2023 Tom Byrer
