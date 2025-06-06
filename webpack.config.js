var path = require('path');

module.exports = {
	watch: false,
	target: 'electron-renderer',
	mode: 'development',
	devtool: 'inline-source-map',
	entry: {
		landing: './src/renderer/landing.tsx',
		statsImporter: './src/renderer/statsImporter.tsx',
		loadTournamentStats: './src/renderer/tournamentStats.tsx',
		seasonStats: './src/renderer/seasonStats.tsx',
		cardImporter: './src/renderer/cardImporter.tsx'
	},
	output: {
		path: path.resolve(__dirname,'dist','renderer'),
		filename: '[name].js'
	},
	resolve: {
		// Add `.ts` and `.tsx` as a resolvable extension.
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			// all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
			{ test: /\.tsx?$/, loader: "ts-loader" }
		]
	}
};