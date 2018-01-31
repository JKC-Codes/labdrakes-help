	chatPopUp = document.querySelector('#chatDialogue');
	chatButton = document.querySelector('#chatButton');
	chatClose = document.querySelector('#chatClose');

window.onload = init;

function init() {
	let pageTitle = document.querySelector('head > title');
	let pageHeading = document.querySelector('#articleTitle');
	pageTitle.innerHTML = pageHeading.textContent + pageTitle.innerHTML;

	chatButton = document.querySelector('#chatButton');
	chatPopUp = document.querySelector('#chatDialogue');
	chatClose = document.querySelector('#chatClose');
	chatButton.addEventListener('click', requestLogIn);
}


// Need to load relevant related articles




// Pop up log in box when chat button is pressed
function requestLogIn() {
	chatPopUp.show();
	window.addEventListener('click', closeChatPopUp);
}


// Close chat pop up
function closeChatPopUp(click) {
	if(click.target !== chatButton && (!chatPopUp.contains(click.target) || click.target === chatClose)) {
		chatPopUp.close();
		window.removeEventListener('click', closeChatPopUp);
	}
}