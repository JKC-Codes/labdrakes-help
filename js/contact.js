/*
[x] hide inactive sections
[] validate form before next step
[] save progress
[] change page
[] get related articles
[] disable form submission
*/

document.addEventListener('DOMContentLoaded', init => {
	form = document.querySelector('#contact-form');
	currentPage = getComputedStyle(form).getPropertyValue('--current-step');
	allPages = form.querySelectorAll('fieldset');

	hideInactiveSections();
});

var form = document.querySelector('#contact-form');
var currentPage = getComputedStyle(form).getPropertyValue('--current-step');
var allPages = form.querySelectorAll('fieldset');

function hideInactiveSections() {
	for (let i = 0; i < allPages.length; i++) {
		if (i == currentPage) {
			allPages[i].removeAttribute('data-hidden');
		} else {
			allPages[i].setAttribute('data-hidden', 'true');
		}
	}
}