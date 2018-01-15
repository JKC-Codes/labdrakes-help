window.onload = init;

function init() {
	const topicWidget = document.querySelector('#topicWidget');
	checkIfWideScreen();
}

// Always open topic widget on desktop and disable toggle

var isWideScreen = window.matchMedia("(min-width: 37.5rem)");
var toggleState;

function checkIfWideScreen() {
	if (isWideScreen.matches) {
		saveToggleState(topicWidget);
		disableWidget(topicWidget);
		openWidget(topicWidget);
	}
	else {
		loadToggleState(topicWidget);
		enableWidget(topicWidget);
	}
}
isWideScreen.addListener(checkIfWideScreen);

function saveToggleState(id) {
	if (id.hasAttribute("open")) {
		toggleState = "isOpen";
	}
	else {
		toggleState = "isClosed";
	}
}

function loadToggleState(id) {
	if (toggleState == "isClosed") {
		id.removeAttribute("open");
	}
}

function disableWidget(id) {
	id.addEventListener('click', preventClick);
	id.setAttribute("data-disabled","");
	id.getElementsByTagName("summary")[0].setAttribute("tabindex","-1");
 }

function preventClick(evt) {
	evt.preventDefault();
}

function enableWidget(id) {
	id.removeEventListener('click', preventClick);
	id.removeAttribute("data-disabled");
	id.getElementsByTagName("summary")[0].removeAttribute("tabindex");
 }

 function openWidget(id) {
	id.open = true;
}