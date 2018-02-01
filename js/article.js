window.onload = init;

function init() {
	let pageTitle = document.querySelector('head > title');
	let pageHeading = document.querySelector('#articleTitle');
	pageTitle.innerHTML = pageHeading.textContent + pageTitle.innerHTML;
}


// Need to load relevant related articles