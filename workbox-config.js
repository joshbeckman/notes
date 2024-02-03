module.exports = {
	globDirectory: '_site/',
	globPatterns: [
		'**/*.{html,css,eot,txt,woff,woff2,json,js}',
		'assets/img/*'
	],
	swDest: '_site/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};
