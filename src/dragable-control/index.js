(function ($) {
	'use strict';
	$(window).on("load", function () {
		let element = document.querySelector(".hkex-widgets-section")

		let draggableElements = element && element.querySelectorAll("[draggable=true]")
		let activeDragElement;
		let placeholderElement;
		let startElementRect;

		// import placeholder
		placeholderElement = document.querySelector('.tpl-placeholder');

		// Function responsible for sorting
		const _onDragOver = function (event) {
			placeholderElement.style.width = startElementRect.width + "px";
			placeholderElement.style.height = startElementRect.height + "px";
			placeholderElement.style.top = startElementRect.top + "px";
			placeholderElement.style.left = startElementRect.left + "px";

			event.preventDefault();
			event.dataTransfer.dropEffect = 'move';

			let target = closest(event.target, 'card', 'hkex-widgets');
			if (target && target !== activeDragElement) {
				let rect = target.getBoundingClientRect();
				let horizontal = event.clientY > startElementRect.top && event.clientY < startElementRect.bottom;
				let next = false;

				if (horizontal) {
					next = (event.clientX - rect.left) / (rect.right - rect.left) > .5;
				} else {
					next = !((event.clientY - rect.top) / (rect.bottom - rect.top) > .5);
				}

				// insert at new position
				element.insertBefore(activeDragElement, next && target.nextSibling || target);

				// update rect for insert poosition calculation
				startElementRect = activeDragElement.getBoundingClientRect();
			}
		}
		// handle drag event end
		const _onDragEnd = function (event) {
			event.preventDefault();

			placeholderElement.style.width = "0px";
			placeholderElement.style.height = "0px";
			placeholderElement.style.top = "0px";
			placeholderElement.style.left = "0px";

			activeDragElement.classList.remove('moving');
			element.removeEventListener('dragover', _onDragOver, false);
			element.removeEventListener('dragend', _onDragEnd, false);
		}

		element && element.addEventListener("dragstart", function (event) {
			// don't allow selection to be dragged if it is not draggable
			if (event.target.getAttribute("draggable") !== "true") {
				event.preventDefault();
				return;
			}

			activeDragElement = event.target;
			startElementRect = activeDragElement.getBoundingClientRect();

			// Limiting the movement type
			event.dataTransfer.effectAllowed = 'move';

			// Subscribing to the events at dnd
			element.addEventListener('dragover', _onDragOver, false);
			element.addEventListener('dragend', _onDragEnd, false);

			activeDragElement.classList.add('moving');
		})

		function closest(el, clazz, stopClazz) {
			if (el.classList.contains(stopClazz)) return null;

			while ((el = el.parentElement) &&
				!el.classList.contains(clazz) &&
				!el.classList.contains(stopClazz));

			return el.classList.contains(stopClazz) ? null : el;
		}

	})

}(jQuery));