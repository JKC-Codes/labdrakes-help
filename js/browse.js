window.onload = init;

function init() {
	const topicsWidget = document.querySelector('#topicsWidget');
	const articlesHeading = document.querySelector('#articlesHeading');
	toggleTopicsMenu();
	activateTopicsButtons();
}

// Always open topic widget on desktop and disable toggle

var isWideScreen = window.matchMedia("(min-width: 37.5rem)");
var toggleState;

function toggleTopicsMenu() {
	if (isWideScreen.matches) {
		saveToggleState(topicsWidget);
		disableWidget(topicsWidget);
		openWidget(topicsWidget);
	}
	else {
		loadToggleState(topicsWidget);
		enableWidget(topicsWidget);
	}
}
isWideScreen.addListener(toggleTopicsMenu);

function saveToggleState(id) {
	if (id.hasAttribute("open")) {
		toggleState = "isOpen";
	}
	else {
		toggleState = "isClosed";
	}
}

function loadToggleState(id) {
	if (toggleState === "isClosed") {
		id.removeAttribute("open");
	}
}

function disableWidget(id) {
	id.addEventListener('click', preventClick);
	id.setAttribute("data-disabled","");
	id.getElementsByTagName("summary")[0].setAttribute("tabindex","-1");
 }

function preventClick(tgt) {
	tgt.preventDefault();
}

function enableWidget(id) {
	id.removeEventListener('click', preventClick);
	id.removeAttribute("data-disabled");
	id.getElementsByTagName("summary")[0].removeAttribute("tabindex");
 }

function openWidget(id) {
	id.open = true;
}

function closeWidget(id) {
	id.open = false;
}


// Change title and load relevant articles upon topic button press

var currentTopic = "Popular Articles";

function activateTopicsButtons() {
	topicsWidget.addEventListener('click', function (evt) {
		if (evt.target.tagName === 'BUTTON') {
			currentTopic = evt.target.textContent;
			if(!isWideScreen.matches) {
				closeWidget(topicsWidget);
				document.location.replace('#articlesHeading');
			}
			topicsWidget.querySelectorAll('button').forEach(element => {
				element.removeAttribute("disabled");
			});
			evt.target.setAttribute("disabled","");
			articlesHeading.innerHTML = currentTopic;
			loadArticles();
		}
	})
}

function loadArticles(){
	console.log('todo load articles');
}