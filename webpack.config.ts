var webpack = require('webpack');
var path = require('path');
var clone = require('js.clone');
var webpackMerge = require('webpack-merge');

//loaders
var cssLoader = require("css-loader");
var lessLoader = require("less-loader");
var styleLoader = require("style-loader");
var fileLoader = require("file-loader");
var urlLoader = require("url-loader");

//plugins
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var uglifyJS = require('webpack-uglify-js-plugin');



export var commonPlugins = [
  new webpack.ContextReplacementPlugin(
    // The (\\|\/) piece accounts for path separators in *nix and Windows
    /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
    root('./src'),
    {
      // your Angular Async Route paths relative to this root directory
    }
  ),
  // Loader options
  new webpack.LoaderOptionsPlugin({}),

  //Compiled .less file
  new ExtractTextPlugin({
    filename: '[name].css',
    allChunks: true
  }),

  // minify JS
  new webpack.optimize.UglifyJsPlugin({
    compressor: { warnings: false }
  }),

  //provide third pary plugins
  new webpack.ProvidePlugin({
    moment: "moment-timezone",
    jQuery: "jquery",
    'jquery': "jquery",
    Fuse: "fuse.js",
    highcharts: "highcharts",
    'ng2-sharebuttons': 'ng2-sharebuttons.umd.js'
  }),

  //takes source files in node_modules and copies them into directory for use.
  new CopyWebpackPlugin([
    // {from: './node_modules/moment/min/moment.min.js', to:  root('src/lib/moment.min.js')},
    // {from: './node_modules/jquery/dist/jquery.min.js', to:  root('src/lib/jquery.min.js')},
    // {from: './node_modules/fuse.js/src/fuse.min.js', to:  root('src/lib/fuse.min.js')},
    // {from: './node_modules/moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js', to: root('src/lib/moment-timezone-with-data-2010-2020.min.js')},
    // {from: './node_modules/highcharts/highcharts.js', to: root('src/lib/highcharts.js')}
  ])
]; //commonPlugins

export var commonConfig = {
  // https://webpack.github.io/docs/configuration.html#devtool
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.json', '.less'],
    modules: [ root('node_modules') ]
  },
  output: {
    publicPath: '',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      // TypeScript
      { test: /\.ts$/,   use: ['awesome-typescript-loader', 'angular2-template-loader'] },
      { test: /\.html$/, use: 'raw-loader' },
      { test: /\.json$/, use: 'json-loader' },
      { test: /\.less$/, loader: ExtractTextPlugin.extract({ loader: "css-loader?minimize!less-loader?minimizecss" }) },
      { test: /\.(png|jpg|ttf|eot|woff|woff2)$/, loader: 'file-loader' },
      { test: /\.(woff|ttf|eot|svg)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/, loader: "url-loader" }
    ]
  }
}; //commonConfig

// Client.
export var clientPlugins = [];

export var clientConfig = {
  target: 'web',
  entry: './src/client',
  output: {
    path: root('dist/client')
  },
  node: {
    global: true,
    crypto: 'empty',
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  }
}; //clientConfig


// Server.
export var serverPlugins = [];

export var serverConfig = {
  target: 'node',
  entry: [
    './src/server', // use the entry file of the node server if everything is ts rather than es5
  ],
  output: {
    filename: 'index.js',
    path: root('dist/server'),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      { test: /@angular(\\|\/)material/, use: "imports-loader?window=>global" }
    ]
  },
  externals: includeClientPackages(
    /@angularclass|@angular|angular2-|ng2-|ng-|@ng-|angular-|@ngrx|ngrx-|@angular2|ionic|@ionic|-angular2|-ng2|-ng|moment|moment-timezone-with-data|ng2-sharebuttons/
  ),
  node: {
    time: true,
    global: true,
    crypto: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false
  }
}; //serverConfig

export default [
  // Client
  webpackMerge(clone(commonConfig), clientConfig, { plugins: clientPlugins.concat(commonPlugins) }),
  // Server
  webpackMerge(clone(commonConfig), serverConfig, { plugins: serverPlugins.concat(commonPlugins) })
];

// Helpers
export function includeClientPackages(packages, localModule?: string[]) {
  return function(context, request, cb) {
    if (localModule instanceof RegExp && localModule.test(request)) {
      return cb();
    }
    if (packages instanceof RegExp && packages.test(request)) {
      return cb();
    }
    if (Array.isArray(packages) && packages.indexOf(request) !== -1) {
      return cb();
    }
    if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
      return cb(null, 'commonjs ' + request);
    }
    return cb();
  };
}

export function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
