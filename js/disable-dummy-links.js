// Disables empty links added for demonstration purposes

window.addEventListener('load', disableLinks);

function disableLinks() {
	var dummyLinks = document.querySelectorAll('a[href="#"]');
	dummyLinks.forEach(function(link) {
		link.setAttribute('href', 'javascript:void(0)');
	})
}