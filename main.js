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
All the posible values are: "fade", "slide-up", "slide-down", "slide-left", "slide-right", "random"

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

.galSlider("transition", transitionName)
----------------------------------------
Change the transition animation.
All the posible values are: "fade", "slide-up", "slide-down", "slide-left", "slide-right", "random"

.galSlider("timeInterval", value)
---------------------------------
Set time between slides to value miliseconds.

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
var galSlider = {
	isHover: function (e) {
		return (e.parentElement.querySelector(':hover') === e);
	},
	reflow: function (elt){
		console.log(elt.offsetHeight);
	}
}
function Slider (slider) {
	this.self = slider;
	this.children = [];
	this.iteration = 0;
	this.transition = "fade"; // fade, slide-up, slide-down, slide-left, slide-right, random
	this.transition_values = [ "fade", "slide-up", "slide-down", "slide-left", "slide-right", "random"];
	this.time_interval = 4000;
	this.lock_on_hover = false;
	this.timeout = undefined;
	this.autoplay = true;
	var showArrows = false;

	this.self.classList.add("galSlider");

	if (this.self.getAttribute("galSlider-width") != undefined)
		this.self.style.width = this.self.getAttribute("galSlider-width")+"px";
	else
		this.self.width(700);

	if (this.self.getAttribute("galSlider-height") != undefined)
		this.self.style.height = this.self.getAttribute("galSlider-height")+"px";
	else
		this.self.style.height = 200 + "px";

	if (this.self.getAttribute("galSlider-time-interval") != undefined)
		this.time_interval = parseInt(this.self.getAttribute("galSlider-time-interval"));

	if (this.transition_values.indexOf(this.self.getAttribute("galSlider-transition")) > -1)
		this.transition = this.self.getAttribute("galSlider-transition");

	if (this.self.getAttribute("galSlider-lock-onhover") != undefined)
		this.lock_on_hover = (this.self.getAttribute("galSlider-lock-onhover") == "true");

	if (this.self.getAttribute("galSlider-autoplay") != undefined)
		this.autoplay = (this.self.getAttribute("galSlider-autoplay") == "true");

	if (this.self.getAttribute("galSlider-show-arrows") != undefined)
		showArrows = (this.self.getAttribute("galSlider-show-arrows") == "true");

	var b = this.self.getElementsByClassName("galSlider-content");
	var a = [];
	for (var i = 0; i < b.length; i++) {
		b[i].style.top = "0px";
		b[i].style.left = "0px";
		b[i].style.zIndex = "0";
		b[i].style.opacity = "0";
		b[i].classList.add("transition");
		a.push(b[i]);
	};
	this.children = a;
	this.children[0].style.opacity = "1";

	if (this.autoplay)
		this.start();

	if (showArrows)
		this.createArrows();
};

Slider.prototype.destroy = function() {
	this.stop();
	this.destroyArrows();
	var childs = this.self.getElementsByClassName("galSlider-content");
	for (var i = childs.length - 1; i >= 0; i--) {
		childs[i].classList.remove("transition");
	};
	this.self.classList.remove("galSlider");
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
	else if (name == "random")
		return "random";
};

Slider.prototype.createArrows = function() {
	this.destroyArrows();
	var elem = document.createElement("div");
	elem.className = "galSlider-arrow-left";
	var span = document.createElement("span");
	elem.appendChild(span);
	this.self.appendChild(elem);
	var self = this;
	elem.addEventListener("click", function(){self.previous()});
	elem = document.createElement("div");
	elem.className = "galSlider-arrow-right";
	span = document.createElement("span");
	elem.appendChild(span);
	this.self.appendChild(elem);
	elem.addEventListener("click", function(){self.next()});
};

Slider.prototype.destroyArrows = function() {
	if (this.showArrows) {
		this.self.removeChild(this.self.getElementsByClassName("galSlider-arrow-left")[0]);
		this.self.removeChild(this.self.getElementsByClassName("galSlider-arrow-right")[0]);
	}
};

Slider.prototype.animate = function(prev, curr, next, transition) {
	if (this.autoplay) {
		this.start();
	}
	curr.style.zIndex = "0";
	next.style.zIndex = "1";
	prev.classList.add("no-transition");
	curr.classList.add("no-transition");
	next.classList.add("no-transition");
	prev.style.left = "0px";
	prev.style.top = "0px";
	prev.style.opacity = "1";
	curr.style.left = "0px";
	curr.style.top = "0px";
	curr.style.opacity = "1";
	next.style.left = "0px";
	next.style.top = "0px";
	next.style.opacity = "1"
	galSlider.reflow(curr)
	prev.classList.remove("no-transition");
	curr.classList.remove("no-transition");
	next.classList.remove("no-transition");

	if (transition == "random") {
		transition = this.transition_values[Math.floor((Math.random() * 100) % (this.transition_values.length-1))];
	}
	if (this.children.length < 2) return;
	if (transition == "fade") {
		prev.classList.add("no-transition");
		curr.classList.add("no-transition");
		next.classList.add("no-transition");
		curr.style.opacity = "1";
		prev.style.opacity = "0";
		next.style.opacity = "0";
		galSlider.reflow(curr);
		prev.classList.remove("no-transition");
		curr.classList.remove("no-transition");
		next.classList.remove("no-transition");
		prev.style.opacity = "0";
		curr.style.opacity = "0";
		next.style.opacity = "1";
	}
	else if (transition == "slide-right") {
		prev.classList.add("no-transition");
		curr.classList.add("no-transition");
		next.classList.add("no-transition");
		prev.style.left = this.self.style.width;
		curr.style.left = "0px";
		next.style.left = -this.self.style.width;
		galSlider.reflow(curr);
		prev.classList.remove("no-transition");
		curr.classList.remove("no-transition");
		next.classList.remove("no-transition");
		curr.style.left = this.self.style.width;
		next.style.left = "0px";
	}
	else if (transition == "slide-left") {
		prev.classList.add("no-transition");
		curr.classList.add("no-transition");
		next.classList.add("no-transition");
		prev.style.left = -this.self.style.width;
		curr.style.left = "0px";
		next.style.left = this.self.style.width;
		galSlider.reflow(curr);
		prev.classList.remove("no-transition");
		curr.classList.remove("no-transition");
		next.classList.remove("no-transition");
		curr.style.left = -this.self.style.width;
		next.style.left = "0px";
	}
	else if (transition == "slide-down") {
		prev.classList.add("no-transition");
		curr.classList.add("no-transition");
		next.classList.add("no-transition");
		prev.style.top = this.self.style.height;
		curr.style.top = "0px";
		next.style.top = -this.self.style.height;
		galSlider.reflow(curr);
		prev.classList.remove("no-transition");
		curr.classList.remove("no-transition");
		next.classList.remove("no-transition");
		curr.style.top = this.self.style.height;
		next.style.top = "0px";
	}
	else if (transition == "slide-up") {
		prev.classList.add("no-transition");
		curr.classList.add("no-transition");
		next.classList.add("no-transition");
		prev.style.top = -this.self.style.height;
		curr.style.top = "0px";
		next.style.top = this.self.style.height;
		galSlider.reflow(curr);
		prev.classList.remove("no-transition");
		curr.classList.remove("no-transition");
		next.classList.remove("no-transition");
		curr.style.top = -this.self.style.height;
		next.style.top = "0px";
	}
};

Slider.prototype.next = function() {
	var current = this.children[Math.abs(this.iteration%this.children.length)];
	var previous = this.children[Math.abs((this.iteration+this.children.length-1)%this.children.length)];
	var next = this.children[Math.abs((this.iteration+1)%this.children.length)];
	this.animate(previous, current, next, this.transition);
	this.iteration++;
};

Slider.prototype.previous = function() {
	var current = this.children[Math.abs(this.iteration%this.children.length)];
	var previous = this.children[Math.abs((this.iteration+1)%this.children.length)];
	var next = this.children[Math.abs((this.iteration+this.children.length-1)%this.children.length)];
	this.animate(previous, current, next, this.reverseTransition(this.transition));
	this.iteration += this.children.length-1;
};

Slider.prototype.getIndex = function() {
	return this.iteration % this.children.length;
};

Slider.prototype.gotTo = function(b) {
	if (typeof b !== 'number') {
		throw new TypeError("(galSlider) Not a number.");
	}
	if (b < 0 || b >= this.children.length) {
		throw new RangeError("(galSlider) Invalid slide index \""+b+"\". Expected number between "+0+" and "+(this.children.length-1)+".");
	}
	if (this.autoplay) {
		this.start();
	}
	if (this.iteration%this.children.length != b) {
		next = this.children[b];
		curr = this.children[this.iteration%this.children.length];
		prev = this.children[(this.iteration+this.children.length-1)%this.children.length]
		this.animate(prev, curr, next, this.transition);
		this.iteration += this.children.length-(this.iteration%this.children.length)+b;
	}
};

Slider.prototype.setTransition = function (b) {
	if (this.transition_values.indexOf(b) > -1)
		this.transition = b;
	else {
		s = "";
		var first = true;
		for (var i = 0; i < this.transition_values.length; i++) {
			if (first)
				first = false;
			else
				s += ", ";
			s += "\""+this.transition_values[i]+"\"";
		}
		throw new Error("(galSlider) Invalid transition value \""+b+"\". Expected ["+s+"].");
	}
};

Slider.prototype.setInterval = function (b) {
	if (typeof b !== "number" || typeof b === "string") {
		throw new TypeError("(galSlider) Not a number");
	}
	this.time_interval = b;
	if (this.autoplay) {
		this.start();
	}
};

Slider.prototype.start = function() {
	this.stop();
	var self = this;
	this.timeout = setTimeout(function(){if (self.lock_on_hover && galSlider.isHover(self.self)) return;self.next()}, this.time_interval);
	this.autoplay = true;
};

Slider.prototype.stop = function() {
	clearTimeout(this.timeout);
	this.autoplay = false;
};

if (window.jQuery) {
	(function(jQuery) {
		jQuery.fn.galSlider = function(a,b) {
			jQuery.each(jQuery(this), function (slider_index, slider) {
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
					if (typeof b !== "function") {
						throw new TypeError("(galSlider) Callback must be a function.");
					}
					b(s.getIndex());
				}
				else if (a == "goTo") {
					s.gotTo(b);
				}
				else if (a == "transition") {
					s.setTransition(b);
				}
				else if (a == "timeInterval") {
					s.setInterval(b);
				}
				else if (a == undefined) {
					if (s != undefined) {
						s.destroy();
					}
					s = new Slider(slider);
					jQuery(slider).addClass("galSlider");
				}
				slider.slider = s;
			});
			return jQuery(this);
		}
	})(jQuery);
}

(function () {
	var elems = document.getElementsByClassName("galSlider");
	for (var i = elems.length - 1; i >= 0; i--) {
		elems[i].slider = new Slider(elems[i]);
	};
})();
