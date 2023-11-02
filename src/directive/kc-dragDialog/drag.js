export default {
	bind(el, binding, vnode) {
		const dialogHeaderEl = el.querySelector('.kc-modal__header');
		// 如果传值为root 表示拖动根节点
		let dragDom;
		if (binding.value === 'root') {
			el.style.left = '30%';
			if (document.body.clientHeight < 600) {
				el.style.top = '0px';
			} else {
				let top = document.body.clientHeight - 600 > 150 ? '150px' : (document.body.clientHeight - 600) + 'px';
				el.style.top = top;
			}
			dragDom = el;
		} else {
			dragDom = el.querySelector('.kc-modal');
			dragDom.style.cssText += ';top:0px;';
		}
		dialogHeaderEl.style.cssText += ';cursor:move;';

		// 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
		const getStyle = (function () {
			if (window.document.currentStyle) {
				return (dom, attr) => dom.currentStyle[attr];
			} else {
				return (dom, attr) => getComputedStyle(dom, false)[attr];
			}
		})();

		// if (binding.hasOwnProperty('value') && binding.value) {
		//   setTimeout(() => {
		//     var winHeight = document.body.clientHeight - dragDom.clientHeight - 20
		//     dragDom.style.top = winHeight + 'px'
		//     dragDom.style.left = '320px'
		//     dragDom.style.margin = '0'
		//   })
		// }

		dialogHeaderEl.onmousedown = (e) => {
			if (e.target.classList.contains('kc-icon-close') || e.target.classList.contains('del-multi-lives')) {
				return false;
			}
			// 鼠标按下，计算当前元素距离可视区的距离
			const disX = e.clientX - dialogHeaderEl.offsetLeft;
			const disY = e.clientY - dialogHeaderEl.offsetTop;

			const dragDomWidth = dragDom.offsetWidth;
			const dragDomheight = dragDom.offsetHeight;

			const screenWidth = document.body.clientWidth;
			const screenHeight = document.body.clientHeight;

			const minDragDomLeft = dragDom.offsetLeft;
			const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

			const minDragDomTop = dragDom.offsetTop;
			const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;

			// 获取到的值带px 正则匹配替换
			let styL = getStyle(dragDom, 'left');
			let styT = getStyle(dragDom, 'top');

			if (styL.includes('%')) {
				styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
				styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
			} else {
				styL = +styL.replace(/\px/g, '');
				styT = +styT.replace(/\px/g, '');
			}

			document.onmousemove = function (e) {
				e.stopPropagation();
				// 通过事件委托，计算移动的距离
				let left = e.clientX - disX;
				let top = e.clientY - disY;

				// 边界处理
				if (-(left) > minDragDomLeft) {
					left = -minDragDomLeft;
				} else if (left > maxDragDomLeft) {
					left = maxDragDomLeft;
				}

				if (-(top) > minDragDomTop) {
					top = -minDragDomTop;
				} else if (top > maxDragDomTop) {
					top = maxDragDomTop;
				}
				// 移动当前元素
				dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;

				// emit onDrag event
				vnode.child.$emit('dragDialog');
			};

			// document.ondragend = function (e) {
			//   document.onmousemove = null
			//   document.onmouseup = null
			// }

			document.onmouseup = function (e) {
				e.stopPropagation();
				document.onmousemove = null;
				document.onmouseup = null;
			};
		};

		// dialogHeaderEl.onmouseleave = (e) => {
		//   // e.stopPropagation()
		//   document.onmousemove = null
		//   document.onmouseup = null
		// }
	}
};
