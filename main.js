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
<div class="galSlider" galSlider-width="500" galSlider-height="200" galSlider-time-interval="2000" galSlider-transition="slide-down" galSlider-lock-onhover="true">
	<div class="galSlider-content">
		<strong>Some</strong>, text<br>
		new line.
	</div>
	<img class="galSlider-content" src="some_image.jpg">
	<p class="galSlider-content">More text, because yes...</p>
</div>
***/

function Slider (slider) {
	this.self = slider;
	this.children = [];
	this.iteration = 0;
	this.transition = "fade"; // fade, slide-up, slide-down, slide-left, slide-right
	var transition_values = [ "fade", "slide-up", "slide-down", "slide-left", "slide-right" ];
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

	if (transition_values.indexOf(this.self.attr("galSlider-transition")) > -1)
		this.transition = this.self.attr("galSlider-transition");

	if (this.self.attr("galSlider-lock-onhover") != undefined)
		this.lock_on_hover = (this.self.attr("galSlider-lock-onhover") == "true")

	if (this.self.attr("galSlider-autoplay") != undefined)
		this.autoplay = (this.self.attr("galSlider-autoplay") == "true")

	if (this.self.attr("galSlider-show-arrows") != undefined)
		showArrows = (this.self.attr("galSlider-show-arrows") == "true")

	var b = this.self.children(".galSlider-content");
	var a = [];
	$.each(b, function (sl_cont_index, content) {
		content = $(content);
		a.push(content);
	});
	this.children = a;
	this.children[0].css("opacity", "1");
	if (this.transition == "fade") {
		b.addClass("transition-opacity")
		b.css("top", "0px");
		b.css("left", "0px");
	}
	else if (this.transition == "slide-right") {
		this.children[1%this.children.length].css("left", -this.self.width()+"px");
		this.children[this.children.length-1].css("left", this.self.width()+"px");
		this.children[0].css("left", "0px");
		b.addClass("transition-left")
		b.css("top", "0px");
	}
	else if (this.transition == "slide-left") {
		this.children[1%this.children.length].css("left", this.self.width()+"px");
		this.children[this.children.length-1].css("left", -this.self.width()+"px");
		this.children[0].css("left", "0px");
		b.addClass("transition-left")
		b.css("top", "0px");
	}
	else if (this.transition == "slide-down") {
		this.children[1%this.children.length].css("top", -this.self.height()+"px");
		this.children[this.children.length-1].css("top", this.self.height()+"px");
		this.children[0].css("top", "0px");
		b.addClass("transition-top")
		b.css("left", "0px");
	}
	else if (this.transition == "slide-up") {
		this.children[1%this.children.length].css("top", this.self.height()+"px");
		this.children[this.children.length-1].css("top", -this.self.height()+"px");
		this.children[0].css("top", "0px");
		b.addClass("transition-top")
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
};

Slider.prototype.createArrows = function() {
	this.destroyArrows();
	var elem = document.createElement("div");
	elem.className = "galSlider-arrow-left";
	var span = document.createElement("span");
	elem.appendChild(span);
	this.self.append(elem);
	elem = document.createElement("div");
	elem.className = "galSlider-arrow-right";
	span = document.createElement("span");
	elem.appendChild(span);
	this.self.append(elem);
	this.self.children(".galSlider-arrow-left").click(function(){
		$(this).parent(".galSlider")[0].slider.previous();
	});

	this.self.children(".galSlider-arrow-right").click(function(){
		$(this).parent(".galSlider")[0].slider.next();
	});
};

Slider.prototype.destroyArrows = function() {
	this.self.children(".galSlider-arrow-left").remove();
	this.self.children(".galSlider-arrow-right").remove();
};

Slider.prototype.animate = function() {
	if (this.lock_on_hover && this.self.is(":hover")) return;
	this.next();
}

Slider.prototype.next = function() {
	if (this.children.length < 2) return;
	if (this.transition == "fade") {
		this.children[Math.abs(this.iteration%this.children.length)].css("opacity", "0");
		this.iteration++;
		this.children[Math.abs(this.iteration%this.children.length)].css("opacity", "1");
		this.children[Math.abs(this.iteration%this.children.length)].css("z-index", this.iteration);
	}
	else if (this.transition == "slide-right") {
		var i = Math.abs(this.iteration%this.children.length);
		this.children[i].css("left", this.self.width()+"px");
		this.iteration++;
		i = Math.abs(this.iteration%this.children.length);
		this.children[i].removeClass("transition-left");
		this.children[i].css("left", -this.self.width()+"px");
		this.children[i].addClass("transition-left");
		this.children[i].css("opacity", "1");
		this.children[i].css("z-index", this.iteration);
		this.children[i].css("left", 0+"px");
		i = Math.abs((this.iteration+1)%this.children.length)
		this.children[i].css("left", -this.self.width()+"px");
	}
	else if (this.transition == "slide-left") {
		var i = Math.abs(this.iteration%this.children.length);
		this.children[i].css("left", -this.self.width()+"px");
		this.iteration++;
		i = Math.abs(this.iteration%this.children.length);
		this.children[i].removeClass("transition-left");
		this.children[i].css("left", this.self.width()+"px");
		this.children[i].addClass("transition-left");
		this.children[i].css("opacity", "1");
		this.children[i].css("z-index", this.iteration);
		this.children[i].css("left", 0+"px");
		i = Math.abs((this.iteration+1)%this.children.length)
		this.children[i].css("left", this.self.width()+"px");
	}
	else if (this.transition == "slide-down") {
		var i = Math.abs(this.iteration%this.children.length);
		this.children[i].css("top", this.self.height()+"px");
		this.iteration++;
		i = Math.abs(this.iteration%this.children.length);
		this.children[i].removeClass("transition-top");
		this.children[i].css("top", -this.self.height()+"px");
		this.children[i].addClass("transition-top");
		this.children[i].css("opacity", "1");
		this.children[i].css("z-index", this.iteration);
		this.children[i].css("top", 0+"px");
		i = Math.abs((this.iteration+1)%this.children.length)
		this.children[i].css("top", -this.self.height()+"px");
	}
	else if (this.transition == "slide-up") {
		var i = Math.abs(this.iteration%this.children.length);
		this.children[i].css("top", -this.self.height()+"px");
		this.iteration++;
		i = Math.abs(this.iteration%this.children.length);
		this.children[i].removeClass("transition-top");
		this.children[i].css("top", this.self.height()+"px");
		this.children[i].addClass("transition-top");
		this.children[i].css("opacity", "1");
		this.children[i].css("z-index", this.iteration);
		this.children[i].css("top", 0+"px");
		i = Math.abs((this.iteration+1)%this.children.length)
		this.children[i].css("top", this.self.height()+"px");
	}
	if (this.autoplay) {
		this.stop();
		this.start();
	}
};

Slider.prototype.previous = function() {
	this.iteration += this.children.length-2;
	this.next();
};

Slider.prototype.start = function() {
	this.stop();
	var self = this;
	this.interval = setInterval(function(){self.animate()}, this.time_interval);
	this.autoplay = true;
};

Slider.prototype.stop = function() {
	clearInterval(this.interval);
	this.autoplay = false;
};

(function($) {
	$.fn.galSlider = function(a) {
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