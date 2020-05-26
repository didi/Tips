const path = require('path');

function getDirname() {
  const pathname = __dirname;
  const arr = pathname.split('/');
  arr[arr.length - 1] = 'tips-ui/public';
  return arr.join('/');
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: getDirname(),
    filename: 'tips.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: [path.resolve(__dirname, 'src')]
    }],
  },
};
