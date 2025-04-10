var path = require('path');

module.exports = {
	watch: false,
	target: 'electron-renderer',
	mode: 'development',
	devtool: 'inline-source-map',
	entry: {
		landing: './src/renderer/landing.ts',
		statsImporter: './src/renderer/statsImporter.tsx',
		loadTournamentStats: './src/renderer/tournamentStats.ts',
		seasonStats: './src/renderer/seasonStats.ts',
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