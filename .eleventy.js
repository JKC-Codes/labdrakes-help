module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("css/");
	eleventyConfig.addPassthroughCopy("img/");
	eleventyConfig.addPassthroughCopy("js/");
  return {
    dir: {
			output: "docs/",
			includes: "layout"
		},
		passthroughFileCopy: true,
		pathPrefix: "/labdrakes-help"
  };
};