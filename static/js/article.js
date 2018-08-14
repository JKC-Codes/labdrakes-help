window.onload = init;

function init() {
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

// Add .html extension in testing environment
let extension = '';
if(document.domain.includes('localhost')) {
	extension = '.html';
}

function removeCurrentPage(articles) {
	let urlArray = document.location.pathname.split('/');
	let cleanArray = urlArray.filter(function(slug) {
		return slug;
	});
	let currentPage = cleanArray[cleanArray.length -1];
	let currentTopic = 'unknown';

	// Get page's topic and then remove current article from array
	for(i = 0; i < articles.length; i++) {
		if(articles[i].url + extension === currentPage) {
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
		li.innerHTML = '<a href="' + sortedList[i].url + extension + '">' + sortedList[i].title + '</a>';
		displayArea.appendChild(li);
	}
}