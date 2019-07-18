$(document).ready(function(){
	applySmoothScroll();
	collapseNavbarXS();
	startMouseGame();
	//startTouchGame();
});


function collapseNavbarXS() {
	$('.navbar li a').click(function(event) {
		$('.navbar-collapse').removeClass('in').addClass('collapse');
	});
}


function applySmoothScroll () {
	$("#my-navbar a").on('click', function(event) {
		if (this.hash !== "") {
			event.preventDefault();

			var hash = this.hash;

			$('html, body').animate({
				scrollTop: $(hash).offset().top
			}, 800, function(){
				window.location.hash = hash;
			});
		}
	});
}



function startMouseGame() {

	let isDragging = false;
	let activeDroppable = null;
	let dropTarget = document.getElementById("animal-pen");
	var found = {bird:false, hams:false, ele:false, snake:false, pig:false, sheep:false};

	document.addEventListener('mousedown', function(event) {

		let dragElement = event.target.closest('.draggable');
		let dragElementName = $(dragElement).attr('id');

		if (!dragElement) return;

		event.preventDefault();

		dragElement.ondragstart = function() {
			return false;
		};

		let coords, shiftX, shiftY;	  
		startDrag(dragElement, event.clientX, event.clientY);
		
		
		function checkFoundAll() {
			var animals = [ "bird", "hams", "ele", "snake", "pig", "sheep" ];
			var i;
			for (i = 0; i < animals.length; i++) {
				if (found[animals[i]] == false) return;
			}
			alert("You found all the animals!");
		}
		
		
		function getDropElement(event) {
			// Get element at draggable's new coordinates
			dragElement.hidden = true;
			let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
			dragElement.hidden = false;

			return elemBelow.closest('.droppable');
		}

		function onMouseUp(event) {
			finishDrag();
			
			if (activeDroppable == dropTarget) activeDroppable.style.boxShadow = '';
			
			let dropElement = getDropElement(event);
			
			// If draggable over droppable, change position of draggable
			if (dropElement != dropTarget) {
				dragElement.style.position = 'absolute';
				if (found[dragElementName] == true) found[dragElementName] = false;
			} else {
				found[dragElementName] = true;
				dragElement.style.top = parseInt(dragElement.style.top) - pageYOffset + 'px';
				dragElement.style.position = 'fixed';
			}

			checkFoundAll();
		};


		function onMouseMove(event) {
			moveAt(event.clientX, event.clientY);
			
			let dropElement = getDropElement(event);
			
			// If draggable over droppable, change format of droppable
			if (activeDroppable != dropElement) {
				if (activeDroppable) {
					activeDroppable.style.boxShadow = '';
				}
				activeDroppable = dropElement;
				if (activeDroppable) {
					activeDroppable.style.boxShadow = '0 0 30px 5px #F0D048';
				}
			}
		}


		function startDrag(element, clientX, clientY) {
			if(isDragging) {
				return;
			}
			isDragging = true;

			document.addEventListener('mousemove', onMouseMove);
			element.addEventListener('mouseup', onMouseUp);

			shiftX = clientX - element.getBoundingClientRect().left;
			shiftY = clientY - element.getBoundingClientRect().top;

			element.style.position = 'fixed';

			moveAt(clientX, clientY);
		};

		
		function finishDrag() {
			if(!isDragging) {
				return;
			}
			isDragging = false;
			
			// Fix the element in the document
			dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
			dragElement.style.position = 'absolute';

			document.removeEventListener('mousemove', onMouseMove);
			dragElement.removeEventListener('mouseup', onMouseUp);
		}


		function moveAt(clientX, clientY) {
			// Get window-relative coordinates
			let newX = clientX - shiftX;
			let newY = clientY - shiftY;

			let newBottom = newY + dragElement.offsetHeight;

			// If new coords are below the window, scroll down
			if (newBottom > document.documentElement.clientHeight) {
				// Get window-relative coordinate of document end
				let docBottom = document.documentElement.getBoundingClientRect().bottom;

				// Scroll doc down 10px or to docBottom
				let scrollY = Math.min(docBottom - newBottom, 10);
				if (scrollY < 0) scrollY = 0;

				window.scrollBy(0, scrollY);

				// Limit the new Y by the maximally possible (right at the bottom of the document)
				newY = Math.min(newY, document.documentElement.clientHeight - dragElement.offsetHeight);
			}

			// If the new coords are above the window, scroll up
			if (newY < 0) {
				let scrollY = Math.min(-newY, 10);
				if (scrollY < 0) scrollY = 0;

				window.scrollBy(0, -scrollY);
				newY = Math.max(newY, 0);
			}

			// Limit the new X within the window boundaries
			if (newX < 0) newX = 0;
			if (newX > document.documentElement.clientWidth - dragElement.offsetWidth) {
				newX = document.documentElement.clientWidth - dragElement.offsetWidth;
			}

			dragElement.style.left = newX + 'px';
			dragElement.style.top = newY + 'px';
		}
	});
}