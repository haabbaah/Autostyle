var PANO_PARAMS = {
	SPEED_LIMIT: 0.2,
	DECELERATION: 3,
	CUBE_SIZE: 1024,
	BUTTON_IMAGE: "pano-button.png"
}

function normalizedAngle(angle) {
	return (angle + 180) % 360 - 180;
}

function updatePopups(sc) {

	for(var i = 0; i < sc.popupList.length; ++i) {
		var p = sc.popupList[i];

		var rpitch = normalizedAngle(sc.drag.pitch - p.pitch);
		var ryaw = normalizedAngle(p.yaw - sc.drag.yaw);

		var backface = Math.abs(rpitch) > 90 || Math.abs(ryaw) > 90;

		if(backface) {
			p.element.style.display = "none";
		} else {
			var d = sc.drag.size * 0.5 * sc.drag.scale;
			var y = d * Math.tan(rpitch * (Math.PI/180));
			var x = Math.sqrt(y * y + d * d) * Math.tan(ryaw * (Math.PI/180));
			
			p.element.style.display = null;
			p.btn.style.display = null;

			var bw = p.btn.offsetWidth;
			var bh = p.btn.offsetHeight;

			var w = p.element.offsetWidth;
			var h = p.element.offsetHeight;

			var bcx = x + (sc.offsetWidth - bw) * 0.5;
			var bcy = y + (sc.offsetHeight - bh) * 0.5;

			var cx = bcx + bw;
			var cy = bcy;

			if(cx < -w || cy < -h || bcx > sc.offsetWidth || bcy > sc.offsetHeight ) {
				p.element.style.display = "none";
				p.btn.style.display = "none";
			} else {
				p.element.style.left = cx + "px";
				p.element.style.top = cy + "px";
				p.btn.style.left = bcx + "px";
				p.btn.style.top = bcy + "px";
			}
		}
	}
}

function setupBox(scene, config) {
	var cnames = ["pano-side-left", "pano-side-front", "pano-side-right", "pano-side-back", "pano-side-top", "pano-side-bottom"];
	
	for(var k = 0; k < 6; ++k) {
		var p = document.createElement("div");
		p.className = "pano-side " + cnames[k];
		var i = new Image();
		i.src = config.images[k];
		p.appendChild(i);
		scene.appendChild(p);
	}
}

function setupPopups(sc, config) {
	sc.popupList = [];
	var popups = sc.querySelectorAll(".pano-popup");

	for(var k = 0; k < popups.length; ++k) {
		var popup = popups[k];
		var cfg = config.popups[popup.id];
		
		var btn = document.createElement("div");
		btn.className = "pano-button";
		btn.id = "pano-button-" + popup.id;
		btn.panoPopup = popup;

		var clickHandler = function() {
			this.panoPopup.classList.toggle("visible");
		};

		btn.addEventListener("click", clickHandler);
		btn.addEventListener("touchend", clickHandler);
		
		var btnImage = new Image();
		btnImage.src = PANO_PARAMS.BUTTON_IMAGE;
		
		btn.appendChild(btnImage);

		sc.appendChild(btn);

		sc.popupList.push({btn: btn, element: popup, pitch: cfg[0], yaw: cfg[1]});
	}
}

function setupPanorama(sc, config) {
	var container = document.createElement("div");
	container.className = "pano-container";

	var cam = document.createElement("div");
	cam.className = "pano-cam";

	var scene = document.createElement("div");
	scene.className = "pano-scene";

	sc.panoContainer = container;
	sc.panoScene = scene;
	sc.panoCam = cam;

	cam.appendChild(scene);
	container.appendChild(cam);
	sc.appendChild(container);

	setupBox(scene, config);

	setupPopups(sc, config);

	var panoSize = Math.max(sc.offsetWidth, sc.offsetHeight);

	sc.drag = {
		limits: {
			pitch: [-85, 85],
			scale: [1, 3]			
		},
		inertial: false,
		pitch: 0,
		yaw: 0,
		pitchSpeed: 0,
		yawSpeed: 0,
		scale: 1,
		time: 0,
		size: panoSize
	};

	if(config.start) {
		if(config.start.pos) {
			sc.drag.pitch = config.start.pos[0];
			sc.drag.yaw = config.start.pos[1];
		}
		if(config.start.scale) {
			sc.drag.scale = config.start.scale;			
		}
	}

	if(config.limits) {
		if(config.limits.pitch) {
			sc.drag.limits.pitch = config.limits.pitch;
		}

		if(config.limits.yaw) {
			sc.drag.limits.yaw = config.limits.yaw;
		}

		if(config.limits.scale) {
			sc.drag.limits.scale = config.limits.scale;
		}
	}

	setSize(sc, panoSize);
	setRotation(sc, sc.drag.pitch, sc.drag.yaw);
	setScale(sc, sc.drag.scale * PANO_PARAMS.CUBE_SIZE * 0.5);
	updatePopups(sc);

	sc.addEventListener("gestureStart", onStart);
	sc.addEventListener("gestureMove", onMove);
	sc.addEventListener("gestureScale", onScale);
	sc.addEventListener("gestureEnd", onEnd);
	window.addEventListener("resize", onResize);

	new GestureRecognizer(sc);
}

function setRotation(obj, pitch, yaw) {
	var tr = "rotateX(" + pitch + "deg) rotateY(" + yaw + "deg)";
	obj.panoScene.style.transform = tr;
	obj.panoScene.style.webkitTransform = tr;
}

function setScale(obj, scale) {
	var tr = "translateZ(" + scale + "px)";
	obj.panoCam.style.transform = tr;
	obj.panoCam.style.webkitTransform = tr;
	obj.panoContainer.style.perspective = scale + "px";
	obj.panoContainer.style.webkitPerspective = scale + "px";	
}

function setSize(obj, size) {
	var tr = "translateX(" + (obj.clientWidth - size) * 0.5 + "px)";
	tr += " translateY(" + (obj.clientHeight - size) * 0.5 + "px)";
	tr += " scale(" + (size/PANO_PARAMS.CUBE_SIZE) + ")";
	obj.panoContainer.style.transform = tr;
	obj.panoContainer.style.webkitTransform = tr;
}

function onInertialUpdate(sc) {

	if(!sc.drag.inertial) {
		return;
	}

	var ps = sc.drag.pitchSpeed, ys = sc.drag.yawSpeed;

	var w = Math.sqrt(ps*ps + ys*ys);

	var pr = Math.abs(ps) / w, yr = Math.abs(ys) / w;
	
	var t = (new Date()).getTime();
	var dt = t - sc.drag.time;
	sc.drag.time = t;

	sc.drag.pitch = normalizedAngle(sc.drag.pitch + ps * dt);
	sc.drag.yaw = normalizedAngle(sc.drag.yaw + ys * dt);

	if(sc.drag.pitch >= sc.drag.limits.pitch[1]) {
		sc.drag.pitch = sc.drag.limits.pitch[1];
		sc.drag.pitchSpeed = 0;
	} else if(sc.drag.pitch <= sc.drag.limits.pitch[0]) {
		sc.drag.pitch = sc.drag.limits.pitch[0];
		sc.drag.pitchSpeed = 0;
	}		

	if(sc.drag.limits.yaw) {
		if(sc.drag.yaw >= sc.drag.limits.yaw[1]) {
			sc.drag.yaw = sc.drag.limits.yaw[1];
			sc.drag.yawSpeed = 0;
		} else if(sc.drag.yaw <= sc.drag.limits.yaw[0]) {
			sc.drag.yaw = sc.drag.limits.yaw[0];
			sc.drag.yawSpeed = 0;
		}		
	}

	setRotation(sc, sc.drag.pitch, sc.drag.yaw);
	updatePopups(sc);

	var dw = 1e-4 * PANO_PARAMS.DECELERATION * dt;

	if(dw >= w) {
		sc.drag.inertial = false;
		sc.drag.pitchSpeed = 0;
		sc.drag.yawSpeed = 0;
	} else {
		var dps = dw * pr, dys = dw * yr;
		if(ps > 0) {
			ps -= dps;
		} else {
			ps += dps;
		}

		if(ys > 0) {
			ys -= dys;
		} else {
			ys += dys;
		}
		sc.drag.pitchSpeed = ps;
		sc.drag.yawSpeed = ys;

		window.requestAnimationFrame(function() {
			onInertialUpdate(sc);
		});
	}

}

function onStart(ev) {

	switch(ev.gesture) {
		case "move": {
			this.drag.inertial = false;
			this.drag.time = (new Date()).getTime();
			this.drag.pitchSpeed = 0;
			this.drag.yawSpeed = 0;
			break;
		}
	}
}

function onMove(ev) {

	var dx = ev.dx, dy = ev.dy;

	var t = (new Date()).getTime();
	var dt = t - this.drag.time;

	var scale = 90 / (this.drag.size * this.drag.scale);

	var pitch = this.drag.pitch + dy * scale;
	var yaw = this.drag.yaw - dx * scale;

	if(pitch >= this.drag.limits.pitch[1]) {
		pitch = this.drag.limits.pitch[1];
	} else if(pitch <= this.drag.limits.pitch[0]) {
		pitch = this.drag.limits.pitch[0];				
	}

	if(this.drag.limits.yaw) {
		if(yaw >= this.drag.limits.yaw[1]) {
			yaw = this.drag.limits.yaw[1];
		} else if(yaw <= this.drag.limits.yaw[0]) {
			yaw = this.drag.limits.yaw[0];				
		}
	}

	var ps = (pitch - this.drag.pitch) / dt;
	var ys = (yaw - this.drag.yaw) / dt;

	ps = isNaN(ps) ? 0 : ps;
	ys = isNaN(ys) ? 0 : ys;

	ps = ps < -PANO_PARAMS.SPEED_LIMIT ? -PANO_PARAMS.SPEED_LIMIT : (ps > PANO_PARAMS.SPEED_LIMIT ? PANO_PARAMS.SPEED_LIMIT : ps);
	ys = ys < -PANO_PARAMS.SPEED_LIMIT ? -PANO_PARAMS.SPEED_LIMIT : (ys > PANO_PARAMS.SPEED_LIMIT ? PANO_PARAMS.SPEED_LIMIT : ys);
	
	this.drag.pitchSpeed = ps;
	this.drag.yawSpeed = ys;

	pitch = normalizedAngle(pitch);
	yaw = normalizedAngle(yaw);

	this.drag.pitch = pitch;
	this.drag.yaw = yaw;
	this.drag.time = t;

	var sc = this;
	window.requestAnimationFrame(function() {
		setRotation(sc, pitch, yaw);
		updatePopups(sc);
	});
}

function onScale(ev) {

	var w2 = ev.wx * ev.wx + ev.wy * ev.wy;
	var s2 = (ev.wx + ev.dx) * (ev.wx + ev.dx) + (ev.wy + ev.dy) * (ev.wy + ev.dy);
	var s = w2 > 0 ? Math.sqrt(s2 / w2) : 1;

	scale = this.drag.scale * s;

	scale = scale < this.drag.limits.scale[0] ? this.drag.limits.scale[0] :
		(scale > this.drag.limits.scale[1] ? this.drag.limits.scale[1] : scale);

	this.drag.scale = scale;

	var p = scale * PANO_PARAMS.CUBE_SIZE * 0.5;

	var sc = this;
	window.requestAnimationFrame(function() {
		setScale(sc, p);
		updatePopups(sc);
	});
}

function onEnd(ev) {
	switch(ev.gesture) {
		case "move": {
			this.drag.inertial = true;
			var sc = this;
			window.requestAnimationFrame(function() {
				onInertialUpdate(sc);
			});
			break;
		}
		case "scale": {
			break;
		}
	}
}

function onResize(ev) {
	var scenes = document.querySelectorAll(".haab-panorama");
	for(var i = 0; i < scenes.length; ++i) {
		var sc = scenes[i];
		var size = Math.max(sc.offsetWidth, sc.offsetHeight);
		setSize(sc, size);
		updatePopups(sc);
		sc.drag.size = size;
	}
}

window.addEventListener("load", function() {
	var scenes = document.querySelectorAll(".haab-panorama");
	for(var i = 0; i < scenes.length; ++i) {
		setupPanorama(scenes[i], HAAB_PANORAMA_CONFIG[scenes[i].id]);
	}
});
