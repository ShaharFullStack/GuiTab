const { AlphaTabWebPackPlugin } = require('@coderline/alphatab/webpack');
const path = require('path');

module.exports = {
    // Keep existing webpack configuration
    plugins: [
        new AlphaTabWebPackPlugin()
    ],
    resolve: {
        fallback: {
            "fs": false,
            "path": false
        }
    }
};