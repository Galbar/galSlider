////////////////////////////////////////////////////////////////
//By Galbar (Alessio Linares)                                 //
//For documentation go to http://galbar.github.io/galSlider/  //
////////////////////////////////////////////////////////////////

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
	this.is_hovered = false;
	this.timeout = undefined;
	this.autoplay = true;
	this.arrowsActive = false;
	if (elem.galSlider != undefined)
		elem.galSlider.destroy();
	elem.galSlider = this;
	elem.addEventListener("mouseover", galSlider.onMouseOver);
	elem.addEventListener("mouseout", galSlider.onMouseOut);


	this.self.classList.add("galSlider");

	if (this.self.getAttribute("galSlider-width") != undefined)
		this.self.style.width = this.self.getAttribute("galSlider-width")+"px";
	else
		this.self.style.width = 700 + "px";

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
	for (var i = 0; i < b.length; i++) {
		this.append(b[i]);
	};

	if (arrowsActive)
		this.showArrows();

	if (this.autoplay)
		this.start();
};

/**
 * @brief Some utilities
 */
galSlider.jQueryMinimumVersion = {
	p : 1,
	s : 0,
	t : 0,
	toString: function () {
		return "" + this.p + "." + this.s + "." + this.t;
	}
}

galSlider.onMouseOver = function () {
	this.galSlider.is_hovered = true;
}

galSlider.onMouseOut = function () {
	this.galSlider.is_hovered = false;
}

galSlider.reflow = function (elt) {
	elt.offsetHeight;
}

galSlider.checkjQueryVersion = function (v) {
	var s = parseInt(v.substring(0,v.indexOf(".")));
	var ret = true;
	if (s < this.jQueryMinimumVersion.p) 
		ret = false;
	v = v.substring(v.indexOf(".")+1,v.length);
	s = parseInt(v.substring(0,v.indexOf(".")));
	if (s < this.jQueryMinimumVersion.s) 
		ret = false;
	v = v.substring(v.indexOf(".")+1,v.length);
	s = parseInt(v);
	if (s < this.jQueryMinimumVersion.t) 
		ret = false;
	if (!ret)
		throw new Error("(galSlider) Uncompatible jQuery version, not binding jQuery API. Minimum version required: "
			+ galSlider.jQueryMinimumVersion.toString() + ".");
}

galSlider.checkIfNumber = function(n) {
	if (typeof n !== "number" || typeof n === "string") {
		throw new TypeError("(galSlider) Not a number");
		return false;
	}
	return true;
}

galSlider.checkIfInRange = function(i, s, f) {
	if (i < s || i >= f) {
		throw new RangeError("(galSlider) Number \""+i+"\" not in valid range. Expected number in ["+s+", "+(f-1)+").");
		return false;
	}
	return true;
}

galSlider.checkIfValidTransition = function(v, s) {
	if (s.transition_values.indexOf(v) > -1)
		return true;
	else {
		l = "";
		var first = true;
		for (var i = 0; i < s.transition_values.length; i++) {
			if (first)
				first = false;
			else
				l += ", ";
			l += "\""+s.transition_values[i]+"\"";
		}
		throw new Error("(galSlider) Invalid transition value \""+v+"\". Expected ["+l+"].");
		return false;
	}
}

galSlider.checkIfHTMLElement = function(e) {
	if (typeof HTMLElement === "object" ? e instanceof HTMLElement : //DOM2
		e && typeof e === "object" && e !== null && e.nodeType === 1 && typeof e.nodeName==="string")
		return true;

	throw new TypeError("(galSlider) Expected HTMLElement, found:\n"+JSON.stringify(e));
	return false;
}

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
		galSlider.reflow(curr);
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
		galSlider.reflow(curr);
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
		galSlider.reflow(curr);
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
		galSlider.reflow(curr);
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
		galSlider.reflow(curr);
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
	var current = this.children[this.getIndex()];
	var previous = this.children[this.getIndex(-1)];
	var next = this.children[this.getIndex(1)];
	this.animate(previous, current, next, this.transition);
	this.iteration++;
};

/**
 * @brief slide to previous slide
 */
galSlider.prototype.previous = function() {
	var new_index = this.getIndex(-1);
	var current = this.children[this.getIndex()];
	var previous = this.children[this.getIndex(1)];
	var next = this.children[new_index];
	this.animate(previous, current, next, this.reverseTransition(this.transition));
	this.iteration = new_index;
};

/**
 * @brief Get the current slide index
 * 
 * @param  d if defined it's the current index + d (converted to valid index)
 * @return   current slide index
 */
galSlider.prototype.getIndex = function(d) {
	if (d == undefined)
		d = 0;
	var i = (this.iteration + d) % this.children.length;
	while (i < 0)
		i += this.children.length;
	return i;
};

/**
 * @brief Go to slide with index b
 * @param  b index of slide to go to
 */
galSlider.prototype.goTo = function(b) {
	if (galSlider.checkIfNumber(b) && galSlider.checkIfInRange(b, 0, this.children.length)) {
		if (this.autoplay) {
			this.start();
		}
		next = this.children[b];
		curr = this.children[this.getIndex()];
		prev = this.children[this.getIndex(-1)];
		this.animate(prev, curr, next, this.transition);
		this.iteration = b;
	}
};

/**
 * @brief Set new animation transition
 * 
 * @param b name of transition
 */
galSlider.prototype.setTransition = function (b) {
	if (galSlider.checkIfValidTransition(b, this))
		this.transition = b;
};

/**
 * @brief Set new time between slides
 * 
 * @param b time in miliseconds
 */
galSlider.prototype.setInterval = function (b) {
	if (galSlider.checkIfNumber(b)) {
		this.time_interval = b;
		if (this.autoplay) {
			this.start();
		}
	}
};

/**
 * @brief Begin autoplay
 */
galSlider.prototype.start = function() {
	if (this.autoplay)
		this.stop();
	this.autoplay = true;
	var self = this;
	this.timeout = setTimeout(function e() {
		if (self.lock_on_hover && self.is_hovered)
			setTimeout(e, self.time_interval);
		else self.next();
	}, this.time_interval);
};

/**
 * @brief End autoplay
 */
galSlider.prototype.stop = function() {
	clearTimeout(this.timeout);
	this.autoplay = false;
};

/**
 * @brief insert new slide at the end
 */
galSlider.prototype.append = function(e) {
	if (galSlider.checkIfHTMLElement(e)) {
		if (this.children.length == 0) {
			e.style.opacity = "1";
			e.style.zIndex = "1";
		}
		else {
			e.style.opacity = "0";
			e.style.zIndex = "0";
		}
		e.classList.add("galSlider-content");
		e.style.top = "0px";
		e.style.left = "0px";
		e.classList.add("transition");
		if (e.parentElement != this.self)
			this.self.appendChild(e);
		this.children.push(e);
	}
};

/**
 * @brief insert new slide at position indicated
 */
galSlider.prototype.insertAt = function(e, i) {
	if (galSlider.checkIfNumber(i) &&
		galSlider.checkIfInRange(i, 0, this.children.length) &&
		galSlider.checkIfHTMLElement(e)) {
		if (this.children.length == 0) {
			e.style.opacity = "1";
			e.style.zIndex = "1";
		}
		else {
			e.style.opacity = "0";
			e.style.zIndex = "0";
		}
		e.classList.add("galSlider-content");
		e.style.top = "0px";
		e.style.left = "0px";
		e.classList.add("transition");
		if (e.parentElement != this.self)
			this.self.appendChild(e);
		this.children.splice(i, 0, e);
	}
};

/**
 * @brief remove slide with index i
 *
 *  @param i index of slide to remove
 *  @return  HTML element being removed
 */
galSlider.prototype.remove = function(i) {
	if (galSlider.checkIfNumber(i) &&
		galSlider.checkIfInRange(i, 0, this.children.length)) {
		var ret = this.children[i];
		if (i == this.getIndex())
			this.next();
		this.children.splice(i, 1);
		this.self.removeChild(ret);
		return ret;
	}
};

if (galSlider.checkjQueryVersion(jQuery.fn.jquery)) {
	(function(jQuery) {
		galSlider = function(a,b,c) {
			this.each(function () {
				var s = this.galSlider;
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
				else if (a == "append") {
					s.append(b);
				}
				else if (a == "insertAt") {
					s.insertAt(b, c);
				}
				else if (a == "remove") {
					s.remove(b);
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
