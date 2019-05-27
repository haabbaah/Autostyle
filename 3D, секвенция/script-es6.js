class InteractiveFields {
	constructor(options) {
		this.parentFields = document.querySelector(options.parentFields);
		this.childrenFields = this.parentFields.children;
		this.fieldsClass = options.fieldsClass;
		this.parentButtons = document.querySelector(options.parentButtons);
		this.childrenButtons = this.parentButtons.children;
		this.buttonsClass = options.buttonsClass;

		this.reverse = options.reverse;

		if (this.reverse) {
			this.childrenButtons = Array.from(this.childrenButtons).reverse();
		}
		for (let k = 0; k < this.childrenButtons.length; k++) {
			this.childrenButtons[k].addEventListener('touchstart', (event) => {
				let target = event.currentTarget;
				this.changeField(target, k);
			}, false);
		}
	}


	changeField(self, index) {
		this.removeCssClass(this.childrenButtons, this.buttonsClass);
		self.classList.add(this.buttonsClass);
		this.addCssClass(this.childrenFields, this.fieldsClass);
		this.childrenFields[index].classList.remove(this.fieldsClass);
	}

	addCssClass(elemrnts, cssClass) {
		for (let k = 0; k < elemrnts.length; k++) {
			elemrnts[k].classList.add(cssClass);
		}
	}

	removeCssClass(elemrnts, cssClass) {
		for (let k = 0; k < elemrnts.length; k++) {
			elemrnts[k].classList.remove(cssClass);
		}
	}

}



class Panorama {
	constructor(options) {
		this.selector = document.querySelector(options.selector);
		this.selectorBtn = document.querySelectorAll(options.selectorBtn);
		this.btnDestroy = document.querySelectorAll('.btn-destroy');

		for (let k = 0; k < this.selectorBtn.length; k++) {
			this.selectorBtn[k].addEventListener('touchstart', (event) => {
				event.stopPropagation();
				this.showPanorama();
			}, false);
		}
		for (let k = 0; k < this.btnDestroy.length; k++) {
			this.btnDestroy[k].addEventListener('touchstart', (event) => {
				this.hidePanorama();
			}, false);
		}
	}

	hidePanorama() {
		this.selector.classList.add('d-n');
	}

	showPanorama() {
		this.selector.classList.remove('d-n');
	}
}