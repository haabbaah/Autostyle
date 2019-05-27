window.onload = function () {

	/* 
		function animateCSS(element, animationName, wow, delay, speed, callback) {
			var node = document.querySelectorAll(element);

			for (var k = 0; k < node.length; k++) {
				node[k].classList.add('animated', animationName, wow, delay, speed);
			}

			function handleAnimationEnd() {
				for (var k = 0; k < node.length; k++) {
					node[k].classList.remove('animated', animationName);
					node[k].removeEventListener('animationend', handleAnimationEnd);
				}

				if (typeof callback === 'function') callback();
			}

			for (var l = 0; l < node.length; l++) {
				node[l].addEventListener('animationend', handleAnimationEnd);
			}

		}
*/





	//Автоматическое добавление data-size
/* 	$(".zooming a").attr("data-size", function (index, value) {
		let next = $(this).children();
		if (value) {
			return;
		} else {
			let imageNaturalWidth = next.prop('naturalWidth');
			let imageNaturalHeight = next.prop('naturalHeight');
			return imageNaturalWidth + "x" + imageNaturalHeight;
		}
	}); */
	//Автоматическое добавление data-size end



	//Автоматическое добавление html-кода для плагина 
	let body = document.querySelector('body');
	body.insertAdjacentHTML('afterBegin', '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__counter"></div><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>');
	//Автоматическое добавление html-кода для плагина end




	//Кнопка подсказки

	class BtnTips {
		constructor(options) {
			this.selector = document.querySelectorAll(options.selector + ' img');
			this.tips1 = document.querySelectorAll('.tip-1');
			this.tips2 = document.querySelectorAll('.tip-2');
			this.tips3 = document.querySelectorAll('.tip-3');
			this.tips4 = document.querySelectorAll('.tip-4');
			this.tips5 = document.querySelectorAll('.tip-5');

			this.reloadSelectors = options.reloadSelectors;

			this.body = document.querySelector('body');
			this.allTips = [];
			this.flag = true;



			for (let k = 0; k < this.selector.length; k++) {
				this.selector[k].addEventListener('touchstart', (event) => {
					if (this.flag) {
						this.createTips();
						this.flag = false;
					} else {
						this.destroyTips();
						this.flag = true;
					}
				}, false);
			}

			window.addEventListener('resize', (event) => { //обновление при изменении размеров
				this.reloadTips();
			}, false);


			for (let k = 0; k < this.reloadSelectors.length; k++) {
				let
					selector = document.querySelectorAll(this.reloadSelectors[k]);
				for (let s = 0; s < selector.length; s++) {
					selector[s].addEventListener('touchstart', (event) => {
						this.reloadTips();
					}, false);
				}
			}

		}


		reloadTips() {
			if (!this.flag) {
				this.destroyTips();
				setTimeout(() => {
					this.createTips();
				}, 0);
			}
		}

		destroyTips() {
			this.allTips.forEach(function (item) {
				item.remove();
			});
		}

		createTips() {
			//TODO 
			for (let k = 0; k < this.tips1.length; k++) {
				let cords = this.getCoords(this.tips1[k]);
				if ((cords.width ||
						cords.height) === 0) {
					continue;
				}
				let img = this.createTip(1);
				img.style.top = (cords.top + cords.height / 2) + 'px';
				img.style.left = (cords.left + cords.width / 2) + 'px';
				this.body.appendChild(img);
				this.allTips.push(img);
			}
			for (let k = 0; k < this.tips2.length; k++) {
				let cords = this.getCoords(this.tips2[k]);
				if ((cords.width ||
						cords.height) === 0) {
					continue;
				}
				let img = this.createTip(2);
				img.style.top = (cords.top + cords.height / 2) + 'px';
				img.style.left = (cords.left + cords.width / 2) + 'px';
				this.body.appendChild(img);
				this.allTips.push(img);
			}
			for (let k = 0; k < this.tips3.length; k++) {
				let cords = this.getCoords(this.tips3[k]);
				if ((cords.width ||
						cords.height) === 0) {
					continue;
				}
				let img = this.createTip(3);
				img.style.top = (cords.top + cords.height / 2) + 'px';
				img.style.left = (cords.left + cords.width / 2) + 'px';
				this.body.appendChild(img);
				this.allTips.push(img);
			}
			for (let k = 0; k < this.tips4.length; k++) {
				let cords = this.getCoords(this.tips4[k]);
				if ((cords.width ||
						cords.height) === 0) {
					continue;
				}
				let img = this.createTip(4);
				img.style.top = (cords.top + cords.height / 2) + 'px';
				img.style.left = (cords.left + cords.width / 2) + 'px';
				this.body.appendChild(img);
				this.allTips.push(img);
			}
			for (let k = 0; k < this.tips5.length; k++) {
				let cords = this.getCoords(this.tips5[k]);
				if ((cords.width ||
						cords.height) === 0) {
					continue;
				}
				let img = this.createTip(5);
				img.style.top = (cords.top + cords.height / 2) + 'px';
				img.style.left = (cords.left + cords.width / 2) + 'px';
				this.body.appendChild(img);
				this.allTips.push(img);
			}
		}
		createTip(num) {
			let img = document.createElement('img');
			img.className = 'tip-img tip-img-' + num;
			img.src = '../shares/img/tips/' +
				num + '.png';
			return img;
		}
	/* 	createTipField() {
			let img = document.createElement('div');
			img.className = 'tip-img tip-img-' + num;
			img.src = 'tips/' + num + '.png';
			return img;
		} */
		getCoords(elem) {
			let
				box = elem.getBoundingClientRect();
			return {
				top: box.top + pageYOffset,
				left: box.left + pageXOffset,
				width: box.width,
				height: box.height
			};
		}
	}




	let btn = new BtnTips({
		selector: '.tip-btn',
		reloadSelectors: ['.btn-item']
	});

	//Кнопка подсказки end



};