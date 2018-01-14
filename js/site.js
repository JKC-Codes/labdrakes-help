window.onload = init;

function init() {
	const topicWidget = document.querySelector('#topicWidget');
	checkIfWideScreen();
}

// Always open topic widget on desktop and disable toggle

var isWideScreen = window.matchMedia("(min-width: 37.5rem)");

function checkIfWideScreen() {
	if (isWideScreen.matches) {
		openWidget(topicWidget);
		disableWidget(topicWidget);
	}
	else {
		enableWidget(topicWidget);
	}
}

isWideScreen.addListener(checkIfWideScreen);

function openWidget(id) {
	id.open = true;
}

function disableWidget(id) {
	id.addEventListener('click', preventClick);
	id.setAttribute("disabled","");
 }

function preventClick(evt) {
	evt.preventDefault();
}

function enableWidget(id) {
	id.removeEventListener('click', preventClick);
	id.removeAttribute("disabled");
 }