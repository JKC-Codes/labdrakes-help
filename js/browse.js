window.onload = init;

function init() {
	const topicsWidget = document.querySelector('#topicsWidget');
	const articlesHeading = document.querySelector('#articlesHeading');
	const articlesList = document.querySelector('#articlesList');
	toggleTopicsMenu();
	activateTopicsButtons();
	loadArticles();
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


// Change title, disable button and load relevant articles upon topic button press

var currentTopic = "Popular Articles";

function activateTopicsButtons() {
	topicsWidget.addEventListener('click', function (evt) {
		if (evt.target.tagName === 'BUTTON') {
			currentTopic = evt.target.textContent;
			if(!isWideScreen.matches) {
				closeWidget(topicsWidget);
				location.replace('#topicsWidget');
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
    var queryURL = "/js/articleslist.json";
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
	displayArticles(list);
}

function displayArticles(list) {
	articlesList.innerHTML = "";
	list.forEach(function (currentItem) {
		var li = document.createElement('li');
		li.innerHTML = '<a href="/pages/' + currentItem.url + '.html">' + currentItem.title + '</a>';
		articlesList.appendChild(li);
	});
}