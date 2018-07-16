window.onload = init;

function init() {
	// Update page tab's title
	let pageTitle = document.querySelector('head > title');
	let pageHeading = document.querySelector('#articleTitle');
	pageTitle.innerHTML = pageHeading.textContent + pageTitle.innerHTML;

	// Load related articles
	loadArticles();
}

function loadArticles () {
	var query = new XMLHttpRequest();
	query.addEventListener('load', parse);
	query.open('GET', '../js/articleslist.json');
	query.send();

	function parse () {
		var list = JSON.parse(this.responseText);
		removeCurrentPage(list);
	}
}

function removeCurrentPage(articles) {
	var url = document.location.pathname;
	var currentPage = url.slice(url.lastIndexOf('/') + 1);
	var currentTopic = 'unknown';

	// Get page's topic and then remove current article from array
	for(i = 0; i < articles.length; i++) {
		if(articles[i].url + '.html' === currentPage) {
			currentTopic = articles[i].topic;
			articles.splice([i],1);
			i--;
		}
	}

	displayArticles(articles, currentTopic);
}

function displayArticles(list, topic) {
	var filteredList = list.filter(function(article) {
		return article.topic === topic;
	});

	var sortedList = filteredList.sort(function(a, b) {
		return b.hits - a.hits;
	});

	// Display articles
	var displayArea = document.querySelector('#relatedArticlesList');
	displayArea.innerHTML = '';

	for (i = 0; i < 5; i++) {
		let li = document.createElement('li');
		li.innerHTML = '<a href="' + sortedList[i].url + '.html">' + sortedList[i].title + '</a>';
		displayArea.appendChild(li);
	}
}