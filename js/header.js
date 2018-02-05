document.querySelector('header.site').innerHTML = `
<div class="return dark row">
	<a href="https://jkc.codes" rel="noopener">Return to labdrakes.com</a>
</div>

<h1 class="a11y">Labdrakes Help</h1>

<div class="main row">
	<a href="../index.html">
		<picture>
			<source media="(min-width: 37.5rem)" srcset="../img/logo-wide.png">
			<img class="logo" src="../img/logo-narrow.png" alt="Home page">
		</picture>
	</a>
	<form id="site-search">
		<label for="site-search-bar" class="a11y">Search the site:</label>
		<input type="search" id="site-search-bar" placeholder="How can we help?" required>
		<button type="submit" form="site-search"><span class="text">Search</span></button>
	</form>
</div>
`;