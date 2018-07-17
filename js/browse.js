window.onload = init;

function init() {
	topicsMenu = document.querySelector('#topicsWidget');
	paginationButtons = document.querySelector('#pagination');
	currentPage = document.querySelector('#pageLow');
	totalPages = document.querySelector('#pageHigh');

	loadArticles();
	isWideScreen.addListener(toggleTopicsMenu);
	topicsMenu.open = false;
	toggleTopicsMenu(isWideScreen);
	activateTopicsButtons();
	activatePaginationButtons();
}

var rawArticlesList;
var filteredArticles;
var currentTopic = "popular articles";
var topicsMenu;
var pageStart = 0;
var isWideScreen = window.matchMedia("(min-width: 37.5rem)");
var toggleState;
var paginationButtons;
var articlesToDisplay = 8;
var currentPage;
var totalPages;


// Download and sort all articles

function loadArticles () {
	var query = new XMLHttpRequest();
	query.addEventListener('load', sortList);
	query.open('GET', 'js/articleslist.json');
	query.send();

	function sortList () {
		var response = JSON.parse(this.responseText);
		rawArticlesList = response.sort(function(one, two) {
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
		displayArticles();
	}
}


// Filter and display articles

function displayArticles() {

	const articlesDisplayArea = document.querySelector('#articlesList');

	// Filter JSON list
	if (currentTopic === 'popular articles') {
		// Don't filter if a topic isn't selected
		filteredArticles = rawArticlesList;
	}

	else {
		// Filter by topic if one is selected
		filteredArticles = rawArticlesList.filter(function(list) {
			return list.topic == currentTopic;
		});
	}

	// Filter if search triggered
	let searchURL = document.location.search;
	let searchString = searchURL.substring(searchURL.indexOf('=')+1);

	if(searchString !== '') {
		let searchTerms = searchString.split('+');

		filteredArticles.forEach(function(article) {
			let relevance = 0;
			searchTerms.forEach(function(word) {
				if(RegExp(word, 'i').test(article.title)) {
					relevance++;
				}
			})
			article.searchRelevance = relevance;
		});

		filteredArticles = filteredArticles.filter(function(article) {
			return article.searchRelevance > 0;
		});

		filteredArticles.sort(function(a,b) {
			return b.searchRelevance - a.searchRelevance;
		});

		document.querySelector('#articlesHeading').innerHTML = 'Search Results';
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
		if (filteredArticles.length === 0) {
			articlesDisplayArea.innerHTML = '<li><p>No articles found</p></li>';
			break;
		}

		var li = document.createElement('li');

		// Create list item with article link and title
		li.innerHTML = '<a href="pages/' + filteredArticles[i + pageStart].url + '.html">' + filteredArticles[i + pageStart].title + '</a>';

		articlesDisplayArea.appendChild(li);
	}

	// Disable pagination if not enough articles
	var buttons = paginationButtons.querySelectorAll('button');
	for(i = 0 ; i < buttons.length; i++) {
		buttons[i].removeAttribute('disabled', '');
	}

	if (pageStart <= 0) {
		document.querySelector('#firstPage').setAttribute('disabled', '');
		document.querySelector('#previousPage').setAttribute('disabled', '');
	}

	if (pageStart >= (filteredArticles.length - articlesToDisplay)) {
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

	topicsMenu.addEventListener('click', function(evt) {
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
		case 'popular articles': resultsHeading.innerHTML = 'Popular Articles'; break
		default: resultsHeading.innerHTML = 'Search Results';
	}

	// Modify heading for searches
	if (document.location.search) {
		resultsHeading.innerHTML = 'Search Results In ' + resultsHeading.innerHTML;
	}


	// Disable current topic button only
	var elements = topicsMenu.querySelectorAll('button');
	for(i = 0; i < elements.length; i++) {
		elements[i].removeAttribute('disabled');
	}
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
	paginationButtons.addEventListener('click', function(evt) {
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

// Matches polyfill
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector;
}