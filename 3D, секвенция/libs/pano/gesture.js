function GestureRecognizer(target) {

	this.target = target;
	this.x = 0;
	this.y = 0;
	this.wx = 0;
	this.wy = 0;
	this.touches = [];
	this.gestureMove = false;
	this.gestureScale = false;
	this.mouseDown = false;
	this.wheelTimer = null;

	this.findTouch = function(touch) {
		for(var i = 0; i < this.touches.length; ++i) {
			if(touch.identifier == this.touches[i].identifier) {
				return i;
			}
		}
		return -1;
	}
	
	this.centerOfTouches = function() {
		var x = 0, y = 0;
		if(this.touches.length == 0) {
			return null;
		}
		for(var i = 0; i < this.touches.length; ++i) {
			x += this.touches[i].pageX;
			y += this.touches[i].pageY;
		}
		return { x: x/this.touches.length, y: y/this.touches.length };
	}

	this.spreadOfTouches = function() {
		if(this.touches.length == 0) {
			return null;
		}
		var xmin = this.touches[0].pageX, ymin = this.touches[0].pageY;
		var	xmax = xmin, ymax = ymin;

		for(var i = 1; i < this.touches.length; ++i) {
			var x = this.touches[i].pageX, y = this.touches[i].pageY;
			if(x < xmin) {
				xmin = x;
			} else if(x > xmax) {
				xmax = x;
			}
			if(y < ymin) {
				ymin = y;
			} else if(y > ymax) {
				ymax = y;
			}
		}

		return {x: xmax - xmin, y: ymax - ymin};
	}

	this.onTouchStart = function(ev) {
	
		ev.preventDefault();		

		for(var i = 0; i < ev.changedTouches.length; ++i) {
			var touch = ev.changedTouches[i];
			var idx = this.findTouch(touch);
			if(idx < 0) {
				this.touches.push(touch);
			} else {
				this.touches[idx] = touch;
			}
		}
		var c = this.centerOfTouches();
		this.x = c.x;
		this.y = c.y;
		var w = this.spreadOfTouches();
		this.wx = w.x;
		this.wy = w.y;
	}

	this.onTouchEnd = function(ev) {

		ev.preventDefault();

		for(var i = 0; i < ev.changedTouches.length; ++i) {
			var touch = ev.changedTouches[i];
			var idx = this.findTouch(touch);
			if(idx >= 0) {
				this.touches.splice(idx, 1);
			}
		}
		if(this.touches.length < 2) {
			if(this.gestureScale) {
				this.gestureScale = false;
				var event = new UIEvent("gestureEnd");
				event.gesture = "scale";
				this.target.dispatchEvent(event);
			}
		} else {
			var w = this.spreadOfTouches();
			this.wx = w.x;
			this.wy = w.y;			
		}
		if(this.touches.length == 0) {
			if(this.gestureMove) {
				this.gestureMove = false;
				var event = new UIEvent("gestureEnd");
				event.gesture = "move";
				this.target.dispatchEvent(event);
			}
		} else {
			var c = this.centerOfTouches();
			this.x = c.x;
			this.y = c.y;
		}
	}

	this.onTouchMove = function(ev) {

		ev.preventDefault();

		for(var i = 0; i < ev.changedTouches.length; ++i) {
			var touch = ev.changedTouches[i];
			var idx = this.findTouch(touch);
			if(idx >= 0) {
				this.touches[idx] = touch;
			}
		}
		
		var c = this.centerOfTouches();
		var w = this.spreadOfTouches();

		if(c.x != this.x || c.y != this.y) {
			// move event
			var event;
			if(this.gestureMove) {
				var event = new UIEvent("gestureMove");
			} else {
				this.gestureMove = true;
				event = new UIEvent("gestureStart");
				event.x = this.x;
				event.y = this.y;
				event.gesture = "move";
			}

			event.dx = c.x - this.x;
			event.dy = c.y - this.y;

			this.x = c.x;
			this.y = c.y;

			this.target.dispatchEvent(event);
		}
 
		if(this.touches.length > 1 && (w.x != this.wx || w.y != this.wy)) {
			// scale event
			var event;
			if(this.gestureScale) {
				var event = new UIEvent("gestureScale");
			} else {
				this.gestureScale = true;
				event = new UIEvent("gestureStart");
				event.x = c.x;
				event.y = c.y;
				event.gesture = "scale";
			}

			event.dx = w.x - this.wx;
			event.dy = w.y - this.wy;
			event.wx = w.x;
			event.wy = w.y;

			this.wx = w.x;
			this.wy = w.y;

			this.target.dispatchEvent(event);
		}

	}

	this.onMouseDown = function(ev) {
		
		ev.preventDefault();
		
		this.mouseDown = true;
		
		this.x = ev.pageX;
		this.y = ev.pageY;
	}

	this.onMouseUp = function(ev) {

		ev.preventDefault();
		
		if(this.mouseDown) {
			this.mouseDown = false;
			
			if(this.gestureMove) {
				var event = new UIEvent("gestureEnd");
				event.gesture = "move";
				this.target.dispatchEvent(event);
			}
		}
	}

	this.onMouseLeave = function(ev) {
		this.onMouseUp(ev);
	}

	this.onMouseMove = function(ev) {

		ev.preventDefault();

		if(this.mouseDown) {
			if(ev.pageX != this.x || ev.pageY != this.y) {
				var event;
				if(this.gestureMove) {
					var event = new UIEvent("gestureMove");
				} else {
					this.gestureMove = true;
					event = new UIEvent("gestureStart");
					event.x = this.x;
					event.y = this.y;
					event.gesture = "move";
				}

				event.dx = ev.pageX - this.x;
				event.dy = ev.pageY - this.y;

				this.x = ev.pageX;
				this.y = ev.pageY;

				this.target.dispatchEvent(event);
			}
		}
	}

	this.onMouseWheelTimeout = function() {
		this.wheelTimer = null;
		var event = new Event("gestureEnd");
		event.gesture = "scale";
		this.target.dispatchEvent(event);
	}

	this.onMouseWheel = function(ev) {
		
		ev.preventDefault();

		var d = -ev.deltaY;

		if(ev.wheelDeltaY === undefined) {
			d *= 40;
		}

		if(this.wheelTimer) {
			clearTimeout(this.wheelTimer);
			event = new UIEvent("gestureScale");
		} else {
			var event = new UIEvent("gestureStart");
			event.x = ev.pageX;
			event.y = ev.pageY;
			event.gesture = "scale";
		}

		event.dx = 0;
		event.dy = d;
		event.wx = 0;
		event.wy = 2000;

		this.target.dispatchEvent(event);

		var gr = this;
		this.wheelTimer = setTimeout(function() {
			gr.onMouseWheelTimeout();
		}, 250);


	}

	var gr = this;

	target.addEventListener("touchstart", function(ev) { gr.onTouchStart(ev); });
	target.addEventListener("touchend", function(ev) { gr.onTouchEnd(ev); });
	target.addEventListener("touchcancel", function(ev) { gr.onTouchEnd(ev); });
	target.addEventListener("touchmove", function(ev) { gr.onTouchMove(ev); });

	target.addEventListener("mousedown", function(ev) { gr.onMouseDown(ev); });
	target.addEventListener("mouseup", function(ev) { gr.onMouseUp(ev); });
	target.addEventListener("mouseleave", function(ev) { gr.onMouseLeave(ev); });
	target.addEventListener("mousemove", function(ev) { gr.onMouseMove(ev); });
	target.addEventListener("wheel", function(ev) { gr.onMouseWheel(ev); });
	target.addEventListener("mousewheel", function(ev) { gr.onMouseWheel(ev); });

}