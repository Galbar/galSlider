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

galSlider-autoplay
------------------
Sets if the slider animation starts automatically or not. Defaults to "true".
If "true", the animation will start when the page is loaded.
If "false", the animation won't start automatically.

galSlider-show-arrows
---------------------
Sets if the slider arrows will be shown. Defaults to "false".
If "true", arrows will be shown.
If "false", arrows won't be shown.

Example:
========
<div class="galSlider" galSlider-width="500" galSlider-height="200" galSlider-time-interval="2000" galSlider-transition="random" galSlider-lock-onhover="true">
	<div class="galSlider-content">
		<strong>Some</strong>, text<br>
		new line.
	</div>
	<img class="galSlider-content" src="some_image.jpg">
	<p class="galSlider-content">More text, because yes...</p>
</div>

API Documentation
=================
.galSlider()
------------
Initializes the slider. If it is already initialized, destroys it and creates it again.

.galSlider("start")
-------------------
Sets the slider autoplay to true.

.galSlider("stop")
------------------
Sets the slider autoplay to false.

.galSlider("next")
------------------
Plays the animation to show the next slide.

.galSlider("previous")
----------------------
Plays the animation to show the previous slide.

.galSlider("addArrows")
-----------------------
Shows the arrows for passing the slides.

.galSlider("removeArrows")
--------------------------
Removes the arrows for passing the slides.

.galSlider("index", callback(slideNumber))
------------------------------------------
slideNumber is the current slide number.

.galSlider("goTo", slideNumber)
-------------------------------
Jumps the slider to the slide with number slideNumber.

.galSlider("destroy")
---------------------
Destroys the slider.

## Example
Using the slider from the previous example.
$("#mySlider").galSlider("stop"); // Stops the slider animation
$("#mySlider").galSlider("addArrows"); // Adds the arrows to the slider

or

// Does the same than the two lines before
$("#mySlider").galSlider("stop").galSlider("addArrows");

***/

function Slider (slider) {
	this.self = slider;
	this.children = [];
	this.iteration = 0;
	this.transition = "fade"; // fade, slide-up, slide-down, slide-left, slide-right
	this.transition_values = [ "fade", "slide-up", "slide-down", "slide-left", "slide-right"];
	this.time_interval = 4000;
	this.lock_on_hover = false;
	this.interval = undefined;
	this.autoplay = true;
	var showArrows = false;

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

	if (this.transition_values.indexOf(this.self.attr("galSlider-transition")) > -1)
		this.transition = this.self.attr("galSlider-transition");

	if (this.self.attr("galSlider-lock-onhover") != undefined)
		this.lock_on_hover = (this.self.attr("galSlider-lock-onhover") == "true");

	if (this.self.attr("galSlider-autoplay") != undefined)
		this.autoplay = (this.self.attr("galSlider-autoplay") == "true");

	if (this.self.attr("galSlider-show-arrows") != undefined)
		showArrows = (this.self.attr("galSlider-show-arrows") == "true");

	var b = this.self.children(".galSlider-content");
	var a = [];
	$.each(b, function (sl_cont_index, content) {
		content = $(content);
		a.push(content);
	});
	this.children = a;
	if (this.transition == "fade") {
		b.addClass('no-transition');
		b.css("opacity", "0")
		this.children[0].css("opacity", "1");
		b[0].offsetHeight;
		b.removeClass('no-transition');
		b.addClass("transition-opacity");
		b.css("top", "0px");
		b.css("left", "0px");
	}
	else if (this.transition == "slide-right") {
		b.css("left", -this.self.width()+"px");
		this.children[0].css("left", "0px");
		b.addClass("transition-left");
		b.css("top", "0px");
	}
	else if (this.transition == "slide-left") {
		b.css("left", this.self.width()+"px");
		this.children[0].css("left", "0px");
		b.addClass("transition-left");
		b.css("top", "0px");
	}
	else if (this.transition == "slide-down") {
		b.css("top", -this.self.height()+"px");
		this.children[0].css("top", "0px");
		b.addClass("transition-top");
		b.css("left", "0px");
	}
	else if (this.transition == "slide-up") {
		b.css("top", this.self.height()+"px");
		this.children[0].css("top", "0px");
		b.addClass("transition-top");
		b.css("left", "0px");
	}

	if (this.autoplay)
		this.start();

	if (showArrows)
		this.createArrows();
};

Slider.prototype.destroy = function() {
	this.stop();
	this.destroyArrows();
	this.self.removeClass("galSlider");
	this.self.children("galSlider-content").removeClass("transition-top");
	this.self.children("galSlider-content").removeClass("transition-left");
	this.self.children("galSlider-content").css("z-index", "0");
};

Slider.prototype.reverseTransition = function(name) {
	if (name == undefined)
		name = this.transition;
	if (name == "fade")
		return "fade";
	else if (name == "slide-down")
		return "slide-up";
	else if (name == "slide-up")
		return "slide-down";
	else if (name == "slide-right")
		return "slide-left";
	else if (name == "slide-left")
		return "slide-right";
};

Slider.prototype.createArrows = function() {
	this.destroyArrows();
	var elem = document.createElement("div");
	elem.className = "galSlider-arrow-left";
	var span = document.createElement("span");
	elem.appendChild(span);
	this.self.append(elem);
	$(elem).click(function(){
		$(this).parent(".galSlider")[0].slider.previous();
	});
	elem = document.createElement("div");
	elem.className = "galSlider-arrow-right";
	span = document.createElement("span");
	elem.appendChild(span);
	this.self.append(elem);
	$(elem).click(function(){
		$(this).parent(".galSlider")[0].slider.next();
	});
};

Slider.prototype.destroyArrows = function() {
	this.self.children(".galSlider-arrow-left").remove();
	this.self.children(".galSlider-arrow-right").remove();
};

Slider.prototype.animate = function(prev, curr, next, transition) {
	if (this.autoplay) {
		this.stop();
		this.start();
	}
	if (this.children.length < 2) return;
	if (transition == "fade") {
		prev.css("opacity", "0");
		curr.css("opacity", "0");
		next.css("opacity", "1");
	}
	else if (transition == "slide-right") {
		prev.addClass("no-transition");
		curr.addClass("no-transition");
		next.addClass("no-transition");
		prev.css("left", this.self.width()+"px");
		curr.css("left", "0px");
		next.css("left", -this.self.width()+"px");
		curr[0].offsetHeight;
		prev.removeClass("no-transition");
		curr.removeClass("no-transition");
		next.removeClass("no-transition");
		curr.css("left", this.self.width()+"px");
		next.css("left", "0px");
	}
	else if (transition == "slide-left") {
		prev.addClass("no-transition");
		curr.addClass("no-transition");
		next.addClass("no-transition");
		prev.css("left", -this.self.width()+"px");
		curr.css("left", "0px");
		next.css("left", this.self.width()+"px");
		curr[0].offsetHeight;
		prev.removeClass("no-transition");
		curr.removeClass("no-transition");
		next.removeClass("no-transition");
		curr.css("left", -this.self.width()+"px");
		next.css("left", "0px");
	}
	else if (transition == "slide-down") {
		prev.addClass("no-transition");
		curr.addClass("no-transition");
		next.addClass("no-transition");
		prev.css("top", this.self.height()+"px");
		curr.css("top", "0px");
		next.css("top", -this.self.height()+"px");
		curr[0].offsetHeight;
		prev.removeClass("no-transition");
		curr.removeClass("no-transition");
		next.removeClass("no-transition");
		curr.css("top", this.self.height()+"px");
		next.css("top", "0px");
	}
	else if (transition == "slide-up") {
		prev.addClass("no-transition");
		curr.addClass("no-transition");
		next.addClass("no-transition");
		prev.css("top", -this.self.height()+"px");
		curr.css("top", "0px");
		next.css("top", this.self.height()+"px");
		curr[0].offsetHeight;
		prev.removeClass("no-transition");
		curr.removeClass("no-transition");
		next.removeClass("no-transition");
		curr.css("top", -this.self.height()+"px");
		next.css("top", "0px");
	}
};

Slider.prototype.next = function() {
	var current = this.children[Math.abs(this.iteration%this.children.length)];
	var previous = this.children[Math.abs((this.iteration+this.children.length-1)%this.children.length)];
	var next = this.children[Math.abs((this.iteration+1)%this.children.length)];
	this.animate(previous, current, next, this.transition);
	this.iteration++;
}

Slider.prototype.previous = function() {
	var current = this.children[Math.abs(this.iteration%this.children.length)];
	var previous = this.children[Math.abs((this.iteration+1)%this.children.length)];
	var next = this.children[Math.abs((this.iteration+this.children.length-1)%this.children.length)];
	this.animate(previous, current, next, this.reverseTransition(this.transition));
	this.iteration += this.children.length-1;
};

Slider.prototype.start = function() {
	this.stop();
	var self = this;
	this.interval = setInterval(function(){if (self.lock_on_hover && self.self.is(":hover")) return;self.next()}, this.time_interval);
	this.autoplay = true;
};

Slider.prototype.stop = function() {
	clearInterval(this.interval);
	this.autoplay = false;
};

(function($) {
	$.fn.galSlider = function(a,b,c,d) {
		$.each($(this), function (slider_index, slider) {
			var s = slider.slider;
			if (a == "start") {
				s.start();
			}
			else if (a == "stop") {
				s.stop();
			}
			else if (a == "next") {
				s.next();
			}
			else if (a == "previous") {
				s.previous();
			}
			else if (a == "addArrows") {
				s.createArrows();
			}
			else if (a == "removeArrows") {
				s.destroyArrows();
			}
			else if (a == "destroy") {
				s.destroy();
			}
			else if (a == "index") {
				b(s.iteration%s.children.length);
			}
			else if (a == "goTo") {
				if (s.iteration%s.children.length != b) {
					next = s.children[b];
					curr = s.children[s.iteration%s.children.length];
					prev = s.children[(s.iteration+s.children.length-1)%s.children.length]
					s.animate(prev, curr, next, s.transition);
					s.iteration += s.children.length-(s.iteration%s.children.length)+b;
				}
			}
			else if (a == undefined) {
				if (s != undefined) {
					s.destroy();
				}
				s = new Slider($(slider));
				$(slider).addClass("galSlider");
			}
			slider.slider = s;
		});
		return $(this);
	}
})(jQuery);

$(function () {
	$(".galSlider").galSlider();
});
