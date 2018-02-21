/*
[x] hide inactive sections
[x] correct behviour when pressing enter
[] validate form before next step
[] save progress
[] change step
[] change focus
[] get related articles
[] disable form submission
*/


var allSteps;
var currentStepIndex = 0;
var currentStep;

document.addEventListener('DOMContentLoaded', init => {
	allSteps = document.querySelectorAll('#contact-form fieldset');
	currentStep = allSteps[currentStepIndex];

	initialiseForm();
}, {once:true});

function initialiseForm() {
	hideInactiveSteps();

	// Line up fieldsets horizontally
	document.querySelector('main.contact .email form').style.display = 'grid';

	// Activate buttons
	let navSections = document.querySelectorAll('main.contact .email .form-nav');

	navSections.forEach(section => {
		section.addEventListener('click', evt => {
			if(evt.target.classList.contains('next')) {
				nextStep();
			} else if(evt.target.classList.contains('previous')) {
				previousStep();
			} else if(evt.target.hasAttribute('type', 'submit')) {
				submitForm();
			}
		})
	})

	//  Dictate flow
	let form = document.querySelector('#contact-form');
	let interactiveElements = form.querySelectorAll('input, a.next, select, textarea');

	// Go to next element when enter is pressed
	form.addEventListener('keypress', evt => {

		// Check enter is pressed inside input or select element
		if((evt.target.tagName === 'INPUT' || evt.target.tagName === 'SELECT') && evt.key === 'Enter') {
			evt.preventDefault();

			// Jump to next element
			for(i=0; i < interactiveElements.length; i++) {
				if(evt.target.name === interactiveElements[i].name) {
					interactiveElements[i + 1].focus();
				}
			}
		}
	})
}

function hideInactiveSteps() {
	// Display current step only
	for(i=0; i < allSteps.length; i++) {
		if(allSteps[i] === currentStep) {
			allSteps[i].removeAttribute('style')
		} else {
			allSteps[i].style.display='none';
		}
	}
}

function nextStep() {
	console.log('next step');
}

function previousStep() {
	console.log('previous step');
}

function submitForm() {
	console.log('submit form');
}