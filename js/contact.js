/*
[x] hide inactive sections
[x] correct behviour when pressing enter
[x] validate form before next step
[x] change step
[] get related articles
[] save progress
[x] disable form submission
*/


var currentStepIndex = 0;
var invalidFields = [];
var errorDialogue;
var editableFields = [];

document.addEventListener('DOMContentLoaded', () => {
	errorDialogue = document.querySelector('#emailErrors');

	hideInactiveSteps();

	// Line up fieldsets horizontally
	document.querySelector('main.contact .email form').style.display = 'grid';

	// Activate click listeners
	document.addEventListener('click', evt => {
		// Listen for next step
		if(evt.target.classList.contains('next')) {
			nextStep();
		} else {
			closeWarning(evt);
		}

		// Listen for previous step
		if(evt.target.classList.contains('previous')) {
			previousStep();
		}
	})

	//  Dictate flow
	let form = document.querySelector('#contact-form');
	let interactiveElements = form.querySelectorAll('input, a.next, select, textarea');

	// Go to next element when enter is pressed
	form.addEventListener('keypress', evt => {

		// Check enter is pressed inside input or select element
		if((evt.target.tagName === 'INPUT' || evt.target.tagName === 'SELECT') && evt.key === 'Enter') {

			// Jump to next element
			evt.preventDefault();
			for(i=0; i < interactiveElements.length; i++) {
				if(evt.target.name === interactiveElements[i].name) {
					interactiveElements[i + 1].focus();
				}
			}
		}
	})

	// Get user editable fields
	for(i=0; i<form.length; i++) {
		if(form[i].hasAttribute('name')) {
			editableFields.push(form[i]);
		}
	}

	// Load previously saved fields
	if(sessionStorage.getItem('savedForm')) {
		let savedForm = JSON.parse(sessionStorage.getItem('savedForm'));

		editableFields.forEach(field => {
			switch(field.name) {
				case 'name':
					if(savedForm.name) {
						field.value = savedForm.name
					}; break
				case 'email':
					if(savedForm.email) {
						field.value = savedForm.email
					}; break
				case 'username':
					if(savedForm.username) {
						field.value = savedForm.username
					}; break
				case 'topic':
					if(savedForm.topic) {
						field.value = savedForm.topic
					}; break
				case 'query':
					if(savedForm.query) {
						field.value = savedForm.query
				}; break
			}
		})
	}

	// Prevent form submission since there is no server
	form.addEventListener('submit', evt => {
		evt.preventDefault();
		currentStepIndex += 1;
		hideInactiveSteps();
	})
}, {once:true});

function hideInactiveSteps() {
	// Display current step only
	let allSteps = document.querySelectorAll('#contact-form fieldset');
	for(i=0; i < allSteps.length; i++) {
		if(allSteps[i] === allSteps[currentStepIndex]) {
			allSteps[i].removeAttribute('style')
		} else {
			allSteps[i].style.display='none';
		}
	}
}

function nextStep() {
	let currentStep = document.querySelectorAll('#contact-form fieldset')[currentStepIndex];
	let requiredFields = currentStep.querySelectorAll('[required]');

	// Reset invalid fields list
	invalidFields = [];

	// Ensure fields are valid
	requiredFields.forEach(field => {
		if(!field.validity.valid) {
			invalidFields.push(field)
		}
	})

	// Change step if all fields are valid
	if(!invalidFields[0]) {
		currentStepIndex += 1;
		hideInactiveSteps();
		return;
	}

	// Update error warning text
	let textArea = errorDialogue.querySelector('ul');

	textArea.innerHTML = '';
	invalidFields.forEach(field => {
		let li = document.createElement('li');

		li.innerHTML = field.name + ' — ' + field.validationMessage;
		textArea.appendChild(li);
	})

	// Display error warning
	errorDialogue.show();
}

function previousStep() {
	// Change step
	currentStepIndex -= 1;
	hideInactiveSteps();
}

// Close invalid fields warning
function closeWarning(evt) {
	if(errorDialogue.hasAttribute('open')) {
		errorDialogue.close();

		// Force focus on an invalid element
		for(i=0; i<invalidFields.length; i++) {
			if(evt.target === invalidFields[i]) {
				return;
			}
		}
		invalidFields[0].focus();
	}
}

// Save form progress before leaving page

// let testForm = {
// 	name: 'a',
// 	email: 'b@b.b',
// 	username: 'c',
// 	topic: '',
// 	query: ''
// }

// sessionStorage.setItem('savedForm', JSON.stringify(testForm));

// window.addEventListener('beforeunload', ()=> {
// 	sessionStorage.setItem('savedForm', JSON.stringify(formFields));
// })