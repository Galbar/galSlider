////////////////////////////////////////////////////////////////
//By Galbar (Alessio Linares)                                 //
//For documentation go to http://galbar.github.io/galSlider/  //
////////////////////////////////////////////////////////////////

/**
 * @brief Some utilities
 */
var galSliderTools = {
	jQueryMinimumVersion: {
		p : 1,
		s : 10,
		t : 2
	},
	isHover: function (e) {
		return (e.parentElement.querySelector(':hover') === e);
	},
	reflow: function (elt) {
		console.log(elt.offsetHeight);
	},
	checkjQueryVersion: function (v) {
		var s = parseInt(v.substring(0,v.indexOf(".")));
		if (s < this.jQueryMinimumVersion.p)
			return false;
		v = v.substring(v.indexOf(".")+1,v.length);
		s = parseInt(v.substring(0,v.indexOf(".")));
		if (s < this.jQueryMinimumVersion.s)
			return false;
		v = v.substring(v.indexOf(".")+1,v.length);
		s = parseInt(v);
		if (s < this.jQueryMinimumVersion.t)
			return false;
		return true
	}
};

/**
 * @brief galSlider class constructor
 * @param elem  HTML element to build galSlider
 */
function galSlider (elem) {
	this.self = elem;
	this.children = [];
	this.iteration = 0;
	this.transition = "fade"; // fade, slide-up, slide-down, slide-left, slide-right, random
	this.transition_values = [ "fade", "slide-up", "slide-down", "slide-left", "slide-right", "random"];
	this.time_interval = 4000;
	this.lock_on_hover = false;
	this.timeout = undefined;
	this.autoplay = true;
	this.arrowsActive = false;
	if (elem.galSlider != undefined)
		elem.galSlider.destroy();
	elem.galSlider = this;

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
		arrowsActive = (this.self.getAttribute("galSlider-show-arrows") == "true");

	var b = this.self.getElementsByClassName("galSlider-content");
	var a = [];
	for (var i = 0; i < b.length; i++) {
		if (i == 0) {
			b[i].style.opacity = "1";
			b[i].style.zIndex = "1";
		}
		else {
			b[i].style.opacity = "0";
			b[i].style.zIndex = "0";
		}
		b[i].style.top = "0px";
		b[i].style.left = "0px";
		b[i].classList.add("transition");
		a.push(b[i]);
	};
	this.children = a;

	if (arrowsActive)
		this.showArrows();

	if (this.autoplay)
		this.start();
};

/**
 * @brief Destroy the galSlider instance
 */
galSlider.prototype.destroy = function() {
	this.stop();
	this.hideArrows();
	var childs = this.self.getElementsByClassName("galSlider-content");
	for (var i = childs.length - 1; i >= 0; i--) {
		childs[i].classList.remove("transition");
	};
	this.self.classList.remove("galSlider");
	this.self.galSlider = undefined;
};

/**
 * @brief given a transition name, return its reverse transition
 * @return reverse transition of name
 */
galSlider.prototype.reverseTransition = function(name) {
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

/**
 * @brief Display built-in galSlider navigation arrows
 */
galSlider.prototype.showArrows = function() {
	this.hideArrows();
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
	this.arrowsActive = true;
};

/**
 * @brief Hide built-in galSlider navigation arrows
 */
galSlider.prototype.hideArrows = function() {
	if (this.arrowsActive) {
		this.self.removeChild(this.self.getElementsByClassName("galSlider-arrow-left")[0]);
		this.self.removeChild(this.self.getElementsByClassName("galSlider-arrow-right")[0]);
		this.arrowsActive = false;
	}
};

/**
 * @brief Run the animation from curr to next using transition
 * 
 * @param prev previous slide
 * @param curr current slide
 * @param next next slide
 * @param transition transition to animate with
 */
galSlider.prototype.animate = function(prev, curr, next, transition) {
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
	next.style.opacity = "1";

	if (transition == "random") {
		transition = this.transition_values[Math.floor((Math.random() * 100) % (this.transition_values.length-1))];
	}
	if (this.children.length < 2) return;
	if (transition == "fade") {
		curr.style.opacity = "1";
		prev.style.opacity = "0";
		next.style.opacity = "0";
		galSliderTools.reflow(curr);
		prev.classList.remove("no-transition");
		curr.classList.remove("no-transition");
		next.classList.remove("no-transition");
		prev.style.opacity = "0";
		curr.style.opacity = "0";
		next.style.opacity = "1";
	}
	else if (transition == "slide-right") {
		prev.style.left = this.self.style.width;
		curr.style.left = "0px";
		next.style.left = '-' + this.self.style.width;
		galSliderTools.reflow(curr);
		prev.classList.remove("no-transition");
		curr.classList.remove("no-transition");
		next.classList.remove("no-transition");
		curr.style.left = this.self.style.width;
		next.style.left = "0px";
	}
	else if (transition == "slide-left") {
		prev.style.left = '-' + this.self.style.width;
		curr.style.left = "0px";
		next.style.left = this.self.style.width;
		galSliderTools.reflow(curr);
		prev.classList.remove("no-transition");
		curr.classList.remove("no-transition");
		next.classList.remove("no-transition");
		curr.style.left = '-' + this.self.style.width;
		next.style.left = "0px";
	}
	else if (transition == "slide-down") {
		prev.style.top = this.self.style.height;
		curr.style.top = "0px";
		next.style.top = '-' + this.self.style.height;
		galSliderTools.reflow(curr);
		prev.classList.remove("no-transition");
		curr.classList.remove("no-transition");
		next.classList.remove("no-transition");
		curr.style.top = this.self.style.height;
		next.style.top = "0px";
	}
	else if (transition == "slide-up") {
		prev.style.top = '-' + this.self.style.height;
		curr.style.top = "0px";
		next.style.top = this.self.style.height;
		galSliderTools.reflow(curr);
		prev.classList.remove("no-transition");
		curr.classList.remove("no-transition");
		next.classList.remove("no-transition");
		curr.style.top = '-' + this.self.style.height;
		next.style.top = "0px";
	}
};

/**
 * @brief slide to next slide
 */
galSlider.prototype.next = function() {
	var current = this.children[Math.abs(this.iteration%this.children.length)];
	var previous = this.children[Math.abs((this.iteration+this.children.length-1)%this.children.length)];
	var next = this.children[Math.abs((this.iteration+1)%this.children.length)];
	this.animate(previous, current, next, this.transition);
	this.iteration++;
};

/**
 * @brief slide to previous slide
 */
galSlider.prototype.previous = function() {
	var current = this.children[Math.abs(this.iteration%this.children.length)];
	var previous = this.children[Math.abs((this.iteration+1)%this.children.length)];
	var next = this.children[Math.abs((this.iteration+this.children.length-1)%this.children.length)];
	this.animate(previous, current, next, this.reverseTransition(this.transition));
	this.iteration += this.children.length-1;
};

/**
 * @brief Get the current slide index
 * @return current slide index
 */
galSlider.prototype.getIndex = function() {
	return this.iteration % this.children.length;
};

/**
 * @brief Go to slide with index b
 * @param  b index of slide to go to
 */
galSlider.prototype.gotTo = function(b) {
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

/**
 * @brief Set new animation transition
 * 
 * @param b name of transition
 */
galSlider.prototype.setTransition = function (b) {
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

/**
 * @brief Set new time between slides
 * 
 * @param b time in miliseconds
 */
galSlider.prototype.setInterval = function (b) {
	if (typeof b !== "number" || typeof b === "string") {
		throw new TypeError("(galSlider) Not a number");
	}
	this.time_interval = b;
	if (this.autoplay) {
		this.start();
	}
};

/**
 * @brief Begin autoplay
 */
galSlider.prototype.start = function() {
	this.stop();
	var self = this;
	this.timeout = setTimeout(function(){if (self.lock_on_hover && galSliderTools.isHover(self.self)) return;self.next()}, this.time_interval);
	this.autoplay = true;
};

/**
 * @brief End autoplay
 */
galSlider.prototype.stop = function() {
	clearTimeout(this.timeout);
	this.autoplay = false;
};

if (window.jQuery && galSliderTools.checkjQueryVersion(jQuery.fn.jquery)) {
	(function(jQuery) {
		jQuery.fn.galSlider = function(a,b) {
			jQuery.each(jQuery(this), function (slider_index, elem) {
				var s = elem.galSlider;
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
				else if (a == "showArrows") {
					s.showArrows();
				}
				else if (a == "hideArrows") {
					s.hideArrows();
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
					new galSlider(elem);
					jQuery(slider).addClass("galSlider");
				}
			});
			return jQuery(this);
		}
	})(jQuery);
}

(function () {
	var elems = document.getElementsByClassName("galSlider");
	for (var i = elems.length - 1; i >= 0; i--) {
		new galSlider(elems[i]);
	};
})();
