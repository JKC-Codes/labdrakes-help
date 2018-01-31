window.onload = init;

function init() {
	topicsMenu = document.querySelector('#topicsWidget');
	paginationButtons = document.querySelector('#pagination');
	currentPage = document.querySelector('#pageLow');
	totalPages = document.querySelector('#pageHigh');
	chatButton = document.querySelector('#chatButton');
	chatPopUp = document.querySelector('#chatDialogue');
	chatClose = document.querySelector('#chatClose');

	loadArticles();
	isWideScreen.addListener(toggleTopicsMenu);
	toggleTopicsMenu(isWideScreen);
	activateTopicsButtons();
	activatePaginationButtons();
	chatButton.addEventListener('click', requestLogIn);
}

var rawArticlesList;
var filteredArticles;
var currentTopic = "Popular Articles";
var topicsMenu;
var pageStart = 0;
var isWideScreen = window.matchMedia("(min-width: 37.5rem)");
var toggleState;
var paginationButtons;
var articlesToDisplay = 8;
var currentPage;
var totalPages;
var chatPopUp;
var chatClose


// Download and sort all articles

function loadArticles() {

    var queryURL = "js/articleslist.json";
	fetch(queryURL)

	.then(function (response) {
		return response.json();
	})

	.then(function (list) {
		list.sort(function(one, two) {
			var a = one.hits, b = two.hits;
			if (a > b) {
				return -1;
			}
			else if (a < b) {
				return 1;
			}
			else {
				return 0;
			}
		})

		rawArticlesList = list;
		displayArticles();
	})

	.catch(function (error) {
		console.log('Error during fetch: ' + error.message);
	});
}


// Filter and display articles

function displayArticles() {

	const articlesDisplayArea = document.querySelector('#articlesList');

	// Filter JSON list
	if (currentTopic === 'Popular Articles') {
		// Don't filter if a topic isn't selected
		filteredArticles = rawArticlesList;
	}

	else {
		// Filter by topic if one is selected
		filteredArticles = rawArticlesList.filter(rawArticlesList => rawArticlesList.topic === currentTopic);
	}

	// Ensure results don't extend beyond articles available
	let articlesCount = articlesToDisplay;

	if (pageStart < 0) {
		pageStart = 0;
	}

	else if (pageStart + articlesToDisplay > filteredArticles.length) {
		if (filteredArticles.length % articlesToDisplay !== 0) {
			articlesCount = filteredArticles.length % articlesToDisplay;
		}
		pageStart = filteredArticles.length - articlesCount;
	}

	else {
		articlesCount = articlesToDisplay;
	}

	// Display results
	articlesDisplayArea.innerHTML = "";

	for (i = 0; i < articlesCount; i++) {
		var li = document.createElement('li');

		// Create list item with article link and title
		li.innerHTML = '<a href="pages/' + filteredArticles[i + pageStart].url + '.html">' + filteredArticles[i + pageStart].title + '</a>';

		articlesDisplayArea.appendChild(li);
	}

	// Disable pagination if not enough articles
	paginationButtons.querySelectorAll('button').forEach(button => {
		button.removeAttribute('disabled', '');
	})

	if (pageStart <= 0) {
		document.querySelector('#firstPage').setAttribute('disabled', '');
		document.querySelector('#previousPage').setAttribute('disabled', '');
	}

	else if (pageStart >= (filteredArticles.length - articlesToDisplay)) {
		document.querySelector('#nextPage').setAttribute('disabled', '');
		document.querySelector('#lastPage').setAttribute('disabled', '');
	}

	// Update "page x of y" text
	currentPage.innerHTML = Math.ceil(pageStart / articlesToDisplay) + 1;
	totalPages.innerHTML = Math.ceil(filteredArticles.length / articlesToDisplay);
}


// Always open topics menu on wide screens

function toggleTopicsMenu(mq) {

	if (mq.matches) {
		// Save menu state
		if (topicsMenu.hasAttribute('open')) {
			toggleState = 'wasOpen';
		} else {
			toggleState = 'wasClosed';
		}

		// Open menu
		topicsMenu.open = true;

		// Disable summary button
		topicsMenu.addEventListener('click', disableToggle);
		topicsMenu.setAttribute('data-disabled','');
		topicsMenu.querySelector('summary').setAttribute('tabindex', '-1');
	}

	else {
		// Load menu state
		if (toggleState === 'wasClosed') {
			topicsMenu.open = false;
		}

		// Enable summary button
		topicsMenu.removeEventListener('click', disableToggle);
		topicsMenu.removeAttribute('data-disabled');
		topicsMenu.querySelector('summary').removeAttribute('tabindex');
	}
}

function disableToggle(tgt) {
	tgt.preventDefault();
}


// Change topic on button press

function activateTopicsButtons() {

	topicsMenu.addEventListener('click', evt => {
		if (evt.target.matches('button')) {
			changeTopic(evt);
		}
	})
}

function changeTopic(button) {

	const resultsHeading = document.querySelector('#articlesHeading');

	// Change topic
	currentTopic = button.target.value;

	// Display relevant articles
	pageStart = 0;
	displayArticles();

	// Change heading
	switch (currentTopic) {
		case 'account': resultsHeading.innerHTML = 'Account'; break
		case 'sports': resultsHeading.innerHTML = 'Sports'; break
		case 'casino': resultsHeading.innerHTML = 'Casino'; break
		case 'games': resultsHeading.innerHTML = 'Games'; break
		case 'exchange': resultsHeading.innerHTML = 'Exchange'; break
		case 'poker': resultsHeading.innerHTML = 'Poker'; break
		case 'bingo': resultsHeading.innerHTML = 'Bingo'; break
		case 'lotto': resultsHeading.innerHTML = 'Lotto'; break
		case 'search': resultsHeading.innerHTML = 'Search Results'; break
		default: resultsHeading.innerHTML = 'Popular Articles';
	}

	// Disable current topic button only
	topicsMenu.querySelectorAll('button').forEach(element => {
		element.removeAttribute('disabled');
	})
	button.target.setAttribute('disabled', '');

	// Close menu on mobile
	if (!isWideScreen.matches) {
		topicsMenu.open = false;
		window.scroll(0,128);
	}
}


// Pagination buttons

function activatePaginationButtons() {

	// Change page number
	paginationButtons.addEventListener('click', evt => {
		if (evt.target.matches('button')) {
			switch (evt.target.id) {
				case 'firstPage': pageStart = 0; break
				case 'previousPage': pageStart -= articlesToDisplay; break
				case 'nextPage': pageStart += articlesToDisplay; break
				case 'lastPage': pageStart = filteredArticles.length; break
			}

			displayArticles();

			// Scroll to top on mobile
			if (!isWideScreen.matches) {
				window.scroll(0,128);
			}
		}
	});
}


// Pop up log in box when chat button is pressed
function requestLogIn() {
	chatPopUp.show();
	window.addEventListener('click', closeChatPopUp);
}


// Close chat pop up
function closeChatPopUp(click) {
	if(click.target !== chatButton && (!chatDialogue.contains(click.target) || click.target === chatClose)) {
		chatPopUp.close();
		window.removeEventListener('click', closeChatPopUp);
	}
}