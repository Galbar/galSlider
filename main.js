/***
Adding it to the web page:
==========================
It requires jquery 1.10.2 or later. (http://www.jquery.com)
In the head element add the following line:
<script type="text/javascript" src="galSlider/main.js"></script>

Creating the slider element:
============================
Add a div element with class "galSlider". Add any html elements into it with the class "galSlider-content".
You are done.

Customization:
==============
You may add the following attributes to the slider element (the div with class "galSlider"),
but if you are OK with their default values you don't have to add them.

galSlider-width
---------------
The width of the slider. Defaults to "700" in pixels.

galSlider-height
----------------
The height of the slider. Defaults to "200" in pixels.

galSlider-time-interval
-----------------------
The time between transitions, Defaults to "4000" in ms.

galSlider-transition
--------------------
The transition animation. Defaults to "fade".
All the posible options are: "fade", "slide-up", "slide-down", "slide-left", "slide-right"

galSlider-lock-onhover
----------------------
Sets the behavour if the mouse is over the slider. Defaults to "false".
If "true", the transition won't happen while the mouse is over the slider.
If "false", the transition will happen always.

Example:
========
<div class="galSlider" galSlider-width="500" galSlider-height="200" galSlider-time-interval="2000" galSlider-transition="slide-down" galSlider-lock-onhover="true">
  <div class="galSlider-content">
    <strong>Some</strong>, text<br>
    new line.
  </div>
  <img class="galSlider-content" src="some_image.jpg">
  <p class="galSlider-content">More text, because yes...</p>
</div>
***/

function Slider (slider, id) {
    this.id = id;
    this.self = slider;
    this.children = [];
    this.iteration = 0;
    this.transition = "fade"; // fade, slide-up, slide-down, slide-left, slide-right
    transition_values = [ "fade", "slide-up", "slide-down", "slide-left", "slide-right" ];
    this.time_interval = 4000;
    this.lock_on_hover = false;

    if (this.self.attr("galSlider-width") != undefined)
        this.self.width(this.self.attr("galSlider-width")+"px");
    else
        this.self.width(700);

    if (this.self.attr("galSlider-height") != undefined)
        this.self.height(this.self.attr("galSlider-height")+"px");
    else
        this.self.height(200);

    if (this.self.attr("galSlider-time-interval") != undefined)
        this.time_interval = parseInt(this.self.attr("galSlider-time-interval"));

    if (transition_values.indexOf(this.self.attr("galSlider-transition")) > -1)
        this.transition = this.self.attr("galSlider-transition");

    if (this.self.attr("galSlider-lock-onhover") != undefined)
        this.lock_on_hover = (this.self.attr("galSlider-lock-onhover") == "true")

    var a = [];
    $.each(this.self.children(), function (sl_cont_index, content) {
        content = $(content);
        a.push(content);
    });
    this.children = a;
    this.children[0].css("opacity", "1");
    if (this.transition == "fade") {
        this.self.children().css("transition", "opacity "+this.time_interval/4000+"s");
        this.self.children().css("-webkit-transition", "opacity "+this.time_interval/4000+"s");
        this.self.children().css("top", "0px");
        this.self.children().css("left", "0px");
    }
    else if (this.transition == "slide-right") {
        this.children[0].css("left", "0px");
        this.self.children().css("transition", "left "+this.time_interval/4000+"s");
        this.self.children().css("-webkit-transition", "left "+this.time_interval/4000+"s");
        this.children[1].css("left", -this.self.width()+"px");
        this.self.children().css("top", "0px");
    }
    else if (this.transition == "slide-left") {
        this.children[0].css("left", "0px");
        this.self.children().css("transition", "left "+this.time_interval/4000+"s");
        this.self.children().css("-webkit-transition", "left "+this.time_interval/4000+"s");
        this.children[1].css("left", this.self.width()+"px");
        this.self.children().css("top", "0px");
    }
    else if (this.transition == "slide-down") {
        this.children[0].css("top", "0px");
        this.self.children().css("transition", "top "+this.time_interval/4000+"s");
        this.self.children().css("-webkit-transition", "top "+this.time_interval/4000+"s");
        this.children[1].css("top", -this.self.height()+"px");
        this.self.children().css("left", "0px");
    }
    else if (this.transition == "slide-up") {
        this.children[0].css("top", "0px");
        this.self.children().css("transition", "top "+this.time_interval/4000+"s");
        this.self.children().css("-webkit-transition", "top "+this.time_interval/4000+"s");
        this.children[1].css("top", this.self.height()+"px");
        this.self.children().css("left", "0px");
    }
};

Slider.prototype.next = function() {
    if (this.lock_on_hover && this.self.is(":hover")) return;

    if (this.transition == "fade") {
        this.children[this.iteration%this.children.length].css("opacity", "0");
        this.iteration++;
        this.children[this.iteration%this.children.length].css("opacity", "1");
    }
    else if (this.transition == "slide-right") {
        var i = this.iteration%this.children.length;
        this.children[i].css("left", this.self.width()+"px");
        this.iteration++;
        i = this.iteration%this.children.length;
        this.children[i].css("opacity", "1");
        this.children[i].css("left", 0+"px");
        i = Math.abs((this.iteration+1)%this.children.length)
        this.children[i].css("left", -this.self.width()+"px");
        this.children[i].css("opacity", "0");
    }
    else if (this.transition == "slide-left") {
        var i = this.iteration%this.children.length;
        this.children[i].css("left", -this.self.width()+"px");
        this.iteration++;
        i = this.iteration%this.children.length;
        this.children[i].css("opacity", "1");
        this.children[i].css("left", 0+"px");
        i = Math.abs((this.iteration+1)%this.children.length)
        this.children[i].css("left", this.self.width()+"px");
        this.children[i].css("opacity", "0");
    }
    else if (this.transition == "slide-down") {
        var i = this.iteration%this.children.length;
        this.children[i].css("top", this.self.height()+"px");
        this.iteration++;
        i = this.iteration%this.children.length;
        this.children[i].css("opacity", "1");
        this.children[i].css("top", 0+"px");
        i = Math.abs((this.iteration+1)%this.children.length)
        this.children[i].css("top", -this.self.height()+"px");
        this.children[i].css("opacity", "0");
    }
    else if (this.transition == "slide-up") {
        var i = this.iteration%this.children.length;
        this.children[i].css("top", -this.self.height()+"px");
        this.iteration++;
        i = this.iteration%this.children.length;
        this.children[i].css("opacity", "1");
        this.children[i].css("top", 0+"px");
        i = Math.abs((this.iteration+1)%this.children.length)
        this.children[i].css("top", this.self.height()+"px");
        this.children[i].css("opacity", "0");
    }
};

$(function () {
    var sliders = $(".galSlider");
    var sl_objs = [];
    $.each(sliders, function (slider_index, slider) {
        slider = $(slider);
        sl_objs.push(new Slider(slider, slider_index));
        setInterval(function(){sl_objs[slider_index].next()}, sl_objs[slider_index].time_interval)
    });
});