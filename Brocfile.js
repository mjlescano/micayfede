var options = require('commander')
var mergeTrees = require('broccoli-merge-trees')
var Funnel = require('broccoli-funnel')
var browserify = require('broccoli-fast-browserify')
var jade = require('broccoli-jade')
var stylus = require('broccoli-stylus-single')
var autoprefixer = require('broccoli-autoprefixer')
var assetRev = require('broccoli-asset-rev')

options.option('build').option('serve').parse(process.argv)

var app = 'app'

var js = browserify(new Funnel(app, { include: ['js/**/*.js']}), {
  browserify: {
    debug: options.serve
  },
  bundles: {
    'js/app.js': {
      transform: options.serve ? undefined : 'uglifyify',
      entryPoints: ['js/index.js']
    }
  }
})

var css = stylus(
  [new Funnel(app, { include: ['css/**/*.styl']})],
  'css/index.styl',
  'css/app.css',
  { compress: !options.serve }
)

css = autoprefixer(css)

var html = jade(new Funnel(app, { include: ['*.jade']}), {
  pretty: options.serve
})

var img = new Funnel(app, { include: ['img/**/*']})

var tree = mergeTrees([js, css, html, img])

if (!options.serve) tree = assetRev(tree)

module.exports = tree
