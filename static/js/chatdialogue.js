var chatButton;
var chatPopUp;
var chatClose;

window.addEventListener('DOMContentLoaded', init(), {once:true});

function init() {
	chatButton = document.querySelector('#chatButton');
	chatPopUp = document.querySelector('#chatDialogue');
	chatClose = document.querySelector('#chatClose');

	chatButton.addEventListener('click', requestLogIn);
}

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