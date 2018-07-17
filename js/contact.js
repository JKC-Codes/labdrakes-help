var form;
var currentStepIndex = 0;
var allSteps;
var invalidFields = [];
var errorDialogue;
var editableFields = [];
var downloadedArticles;

document.addEventListener('DOMContentLoaded', function() {
	form = document.querySelector('#contact-form');
	allSteps = document.querySelectorAll('#contact-form fieldset');
	errorDialogue = document.querySelector('#emailErrors');

	hideInactiveSteps();

	// Line up fieldsets horizontally
	form.style.display = 'grid';

	// Activate click listeners
	document.addEventListener('click', function(evt) {
		// Listen for next step
		if(evt.target.classList.contains('next')) {
			evt.preventDefault();
			nextStep();
		} else {
			closeWarning(evt);
		}

		// Listen for previous step
		if(evt.target.classList.contains('previous')) {
			evt.preventDefault();
			previousStep();
		}
	})

	// Go to next element when field completed
	let interactiveElements = form.querySelectorAll('input, a.next, select, textarea');

	form.addEventListener('change', function(evt) {
		for(i=0; i < interactiveElements.length; i++) {
			if(evt.target.name === interactiveElements[i].name) {
				interactiveElements[i + 1].focus();
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

		editableFields.forEach(function(field) {
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

	// Listen for form submission
	form.addEventListener('submit', function(evt) {
		// Prevent form submission since there is no server
		evt.preventDefault();

		// Add email address to success page
		let emailField = document.querySelector('#input-email');
		let successText = document.querySelector('#customers-email');
		successText.textContent = emailField.value;

		// Change page to success page
		currentStepIndex += 1;
		stepTransition('forward');

		// Clear form
		form.reset();
		sessionStorage.removeItem('savedForm');
	})
}, {once:true});

function hideInactiveSteps() {
	// Display current step only
	for(i=0; i < allSteps.length; i++) {
		if(allSteps[i] === allSteps[currentStepIndex]) {
			allSteps[i].style.display = 'block';
		} else {
			allSteps[i].style.display = 'none';
		}
	}
}

function nextStep() {
	let currentStep = allSteps[currentStepIndex];
	let requiredFields = currentStep.querySelectorAll('[required]');

	// Reset invalid fields list
	invalidFields = [];

	// Ensure fields are valid
	for(i = 0; i < requiredFields.length; i++) {
		if(!requiredFields[i].validity.valid) {
			invalidFields.push(requiredFields[i])
		}
	}

	// Change step if all fields are valid
	if(!invalidFields[0]) {
		currentStepIndex += 1;
		getRelevantArticles();
		stepTransition('forward');
		return;
	}

	// Update error warning text
	let textArea = errorDialogue.querySelector('ul');

	textArea.innerHTML = '';
	invalidFields.forEach(function(field) {
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
	stepTransition('backward');
}

function stepTransition(direction) {
	let enteringStep = allSteps[currentStepIndex];
	let leavingStep;
	let slideDirection = 'normal';

	// Display next/previous step
	enteringStep.style.display = 'block';

	// Set animation slide direction
	if(direction === 'forward') {
		form.style.animationDirection = 'normal';
		leavingStep = allSteps[currentStepIndex -1];
	} else if(direction === 'backward') {
		form.style.animationDirection = 'reverse';
		leavingStep = allSteps[currentStepIndex +1];
	}

	// Apply animation
	form.classList.add('sliding');
	enteringStep.classList.add('fade-in');
	leavingStep.classList.add('fade-out');

	// Remove animation once complete
	let selector = document.querySelector('main.contact .email form.sliding');
	let delayInSeconds = window.getComputedStyle(selector).getPropertyValue('animation-duration');
	let delay = delayInSeconds.slice(0,-1) * 1000;

	window.setTimeout( function() {
		form.classList.remove('sliding');
		enteringStep.classList.remove('fade-in');
		leavingStep.classList.remove('fade-out');
		hideInactiveSteps();
	}, delay);
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
window.addEventListener('beforeunload', function() {
	let formFields = new Object();

	editableFields.forEach(function(field) {
		// Ignore empty fields
		if(field.value === '') {
			return;
		}

		// Add form values to list
		formFields[field.name] = field.value;
	})

	// Save field values
	sessionStorage.setItem('savedForm', JSON.stringify(formFields));
})

// Display relevant articles
function getRelevantArticles() {
	if(currentStepIndex === 1 && !downloadedArticles) {
		downloadArticles();
	} else if(currentStepIndex === 2) {
		displayArticles();
	}
}

function downloadArticles() {
	var query = new XMLHttpRequest();
	query.addEventListener('load', parse);
	query.open('GET', '../js/articleslist.json');
	query.send();

	function parse () {
		var list = JSON.parse(this.responseText);
		downloadedArticles = list.sort(function(a,b) {
			return b.hits - a.hits;
		})
	}
}

function displayArticles() {
	let selectedTopic = document.querySelector('#input-topic');
	let displayArea = document.querySelector('#related-articles-list');

	// Filter articles by topic
	let filteredList = downloadedArticles.filter(function(article) {
		return article.topic === selectedTopic.value;
	});

	// Display articles
	displayArea.innerHTML = '';

	for (i = 0; i < 5; i++) {
		let li = document.createElement('li');
		li.innerHTML = '<a href="' + filteredList[i].url + '.html">' + filteredList[i].title + '</a>';
		displayArea.appendChild(li);
	}
}