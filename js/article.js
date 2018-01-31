window.onload = init;

function init() {
	pageTitle = document.querySelector('head > title');
	pageHeading = document.querySelector('#articleTitle');
	relatedArticles = document.querySelector('#relatedArticlesList');
	chatButton = document.querySelector('#chatButton');
	chatPopUp = document.querySelector('#chatDialogue');

	pageTitle.innerHTML = pageHeading.textContent + pageTitle.innerHTML;
	chatButton.addEventListener('click', requestLogIn);
}





// Pop up log in box when chat button is pressed
function requestLogIn() {
	chatPopUp.show();
	chatClose.addEventListener('click', closeChatPopUp);
}


// Close chat pop up
function closeChatPopUp() {
	chatPopUp.close();
	chatClose.removeEventListener('click', closeChatPopUp);
}