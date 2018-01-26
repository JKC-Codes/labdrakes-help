/*
[x]	load articles
[x]		sort articles
[x]	filter articles
[x]		display articles
[x]	open topics menu on desktop
[x]		disable summary button on desktop
[x]		prevent focus of summary button on desktop
[x]		save/load toggle state
[x]	enable buttons to change topic
[x]		filter articles
[x]		change title
[x]		disable current topic button
[x]		close menu on mobile
[x]		scroll to top on mobile
[]	enable pagination
[]		filter articles
[]		disable buttons if not enough articles
[]		scroll to top on mobile
*/


window.onload = init;

function init() {
	loadArticles();
	isWideScreen.addListener(toggleTopicsMenu);
	toggleTopicsMenu(isWideScreen);
	activateTopicsButtons();
	//activatePaginationButtons();
}

var rawArticlesList;
var currentTopic = "Popular Articles";
var relevantArticles;
var pageStart = 0;
var isWideScreen = window.matchMedia("(min-width: 37.5rem)");
var toggleState;


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

	let filteredArticles;
	const articlesDisplayArea = document.querySelector('#articlesList');

	// Filter
	if (currentTopic === 'Popular Articles') {
		// Don't filter if a topic isn't selected
		filteredArticles = rawArticlesList;
	}

	else {
		// Filter by topic if one is selected
		filteredArticles = rawArticlesList.filter(rawArticlesList => rawArticlesList.topic === currentTopic);
	}

	// Display results
	articlesDisplayArea.innerHTML = "";

	for (i = pageStart; i < pageStart + 10; i++) {
		var li = document.createElement('li');

		// Create list item with article link and title
		li.innerHTML = '<a href="pages/' + filteredArticles[i].url + '.html">' + filteredArticles[i].title + '</a>';

		articlesDisplayArea.appendChild(li);
	}
}


// Always open topics menu on wide screens

function toggleTopicsMenu(mq) {

	const topicsMenu = document.querySelector('#topicsWidget');

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

	const topicsMenu = document.querySelector('#topicsWidget');

	// Check for button press
	topicsMenu.addEventListener('click', function(evt) {
		if (evt.target.matches('button')) {
			changeTopic(evt);
		}
	})
}

function changeTopic(button) {

	const resultsHeading = document.querySelector('#articlesHeading');
	const topicsMenu = document.querySelector('#topicsWidget');

	// Change topic
	currentTopic = button.target.value;

	// Display relevant articles
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
		window.scroll(0,155);
	}
}







































/*

window.onload = init;

function init() {
	const topicsWidget = document.querySelector('#topicsWidget');
	const articlesHeading = document.querySelector('#articlesHeading');
	const articlesList = document.querySelector('#articlesList');
	toggleTopicsMenu();
	loadArticles();
	activateTopicsButtons();
	activatePaginationButtons();
}

// Always open topic widget on desktop and disable toggle

var isWideScreen = window.matchMedia("(min-width: 37.5rem)");
var toggleState;

function toggleTopicsMenu() {
	if (isWideScreen.matches) {
		saveToggleState(topicsWidget);
		disableWidget(topicsWidget);
		openWidget(topicsWidget);
	}
	else {
		loadToggleState(topicsWidget);
		enableWidget(topicsWidget);
	}
}
isWideScreen.addListener(toggleTopicsMenu);

function saveToggleState(id) {
	if (id.hasAttribute("open")) {
		toggleState = "isOpen";
	}
	else {
		toggleState = "isClosed";
	}
}

function loadToggleState(id) {
	if (toggleState === "isClosed") {
		id.removeAttribute("open");
	}
}

function disableWidget(id) {
	id.addEventListener('click', preventClick);
	id.setAttribute("data-disabled","");
	id.getElementsByTagName("summary")[0].setAttribute("tabindex","-1");
 }

function preventClick(tgt) {
	tgt.preventDefault();
}

function enableWidget(id) {
	id.removeEventListener('click', preventClick);
	id.removeAttribute("data-disabled");
	id.getElementsByTagName("summary")[0].removeAttribute("tabindex");
 }

function openWidget(id) {
	id.open = true;
}

function closeWidget(id) {
	id.open = false;
}


// Change title, disable button and load relevant articles upon button press

var currentTopic = "Popular Articles";

function activateTopicsButtons() {
	topicsWidget.addEventListener('click', function (evt) {
		if (evt.target.tagName === 'BUTTON') {
			currentTopic = evt.target.textContent;

			if(!isWideScreen.matches) {
				closeWidget(topicsWidget);
				window.scroll(0,155);
			}

			topicsWidget.querySelectorAll('button').forEach(element => {
				element.removeAttribute("disabled");
			});

			evt.target.setAttribute("disabled","");
			articlesHeading.innerHTML = currentTopic;
			loadArticles();
		}
	})
}


// Load and display relevant articles

function loadArticles() {
    var queryURL = "js/articleslist.json";
    fetch(queryURL)
    	.then(function (response) {
			return response.json();
		})
		.then(function (list) {
			filterArticles(list);
		})
		.catch(function (error) {
			console.log('Error during fetch: ' + error.message);
		});
}

function filterArticles(list) {
	if (currentTopic === "Popular Articles") {
		sortArticles(list);
	}
	else {
		var filteredList = list.filter(list => list.topic === currentTopic);
		sortArticles(filteredList);
	}
}

function sortArticles(list) {
	list.sort(function(one, two) {
		var a = one.hits, b = two.hits;
		if (a > b) {
			return -1;
		}
		if (a < b) {
			return 1;
		}
		else {
			return 0;
		}
	})
	articlesCount = list.length;
	displayArticles(list);
}

var pageStart = 0;

function displayArticles(list) {
	articlesList.innerHTML = "";
	for (i = pageStart; i < pageStart + 10; i++) {
		var li = document.createElement('li');
		var a = document.createElement('a');
		a.setAttribute('href', '/pages/' + list[i].url + '.html');
		a.innerHTML = list[i].title;
		li.appendChild(a);
		articlesList.appendChild(li);
	}
}

*/