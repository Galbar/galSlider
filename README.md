GalSlider
=========
Adding it to your web page
-------------------------
It requires jquery 1.10.2 or later. (http://www.jquery.com)
In the head element add the following lines:
```
<link rel="stylesheet" type="text/css" href="galSlider/style.css">
<script type="text/javascript" src="galSlider/main.js"></script>
```

Creating the slider element
---------------------------
Add a div element with class "galSlider". Add any html elements into it with the class "galSlider-content".
You are done.

If you want it to have the corners rounded, add "galSlider-rounded" to its classes.

Customization
-------------
You may add the following attributes to the slider element (the div with class "galSlider"),
but if you are OK with their default values you don't have to add them.

### galSlider-width
The width of the slider. Defaults to "700" in pixels.

### galSlider-height
The height of the slider. Defaults to "200" in pixels.

### galSlider-time-interval
The time between transitions. Defaults to "4000" in ms.

### galSlider-transition
The transition animation. Defaults to "fade".
All the posible options are: "fade", "slide-up", "slide-down", "slide-left", "slide-right"

### galSlider-lock-onhover
Sets the behavour if the mouse is over the slider. Defaults to "false".
If "true", the transition won't happen while the mouse is over the slider.
If "false", the transition will happen always.

Example
-------
```
<div class="galSlider galSlider-rounded" galSlider-width="500" galSlider-height="200" galSlider-time-interval="2000" galSlider-transition="slide-down" galSlider-lock-onhover="true">
  <div class="galSlider-content">
    <strong>Some</strong>, text<br>
    new line.
  </div>
  <img class="galSlider-content" src="some_image.jpg">
  <p class="galSlider-content">More text, because yes...</p>
</div>
```