/*
[x] hide inactive sections
[] validate form before next step
[] save progress
[x] change page
[] get related articles
[] disable form submission
*/

document.addEventListener('DOMContentLoaded', init => {
	form = document.querySelector('#contact-form');

	hideInactiveSteps();
	activateFormButtons();
}, {once:true});

var form;
var currentStepIndex = 0;

function hideInactiveSteps() {
	let allSteps = form.querySelectorAll('fieldset');
	let currentStep = allSteps[currentStepIndex];

	allSteps.forEach( step => {
		if (step === currentStep) {
			step.removeAttribute('data-hidden')
		} else {
			step.setAttribute('data-hidden', 'true')
		}
	})
}

function activateFormButtons() {
	let emailSection = document.querySelector('.email')

	emailSection.addEventListener('click', evt => {
		if (evt.target.matches('a')) {
			if (evt.target.className === 'button') {
				nextStep();
			} else if (evt.target.className === 'secondary-nav') {
				previousStep();
			}
		}
	})
}

function nextStep() {
	currentStepIndex += 1;
	hideInactiveSteps()
	form.style.setProperty('--current-step', currentStepIndex);
}

function previousStep() {
	currentStepIndex -= 1;
	hideInactiveSteps()
	form.style.setProperty('--current-step', currentStepIndex);
}