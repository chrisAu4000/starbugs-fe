# Starbugs Frontend

It _does_ provide a nice development environment with live reloading JavaScript and CSS, testing with zuul and linting with eslint.

The main dependencies are:

- [budo](http://npm.im/budo) for watching and serving the app for development
- [Browserify](http://npm.im/browserify) for bundling the JavaScript
- [node-sass](http://npm.im/node-sass) for Scss
- [chokidar-cli](http://npm.im/chokidar-cli) for watching Sass files
- [tape](http://npm.im/tape) and [zuul](http://npm.im/zuul) for testing
- [Eslint](http://npm.im/eslint) with the Cycle.js plugin for linting
- [rimraf](http://npm.im/rimraf) for cleaning the project

## Usage

Just run.

```shell
npm install
```

Then you can run:

```shell
npm start
```
to start developing. This will provide a auto-reloading dev-server as well as css hotreloading.
Because of browserify and babel, development in es-2015 style and importing modules like in node is provided.

For more specific npm commands read the npm script documentation.

## npm scripts Documentation

These are all the npm scripts tasks that come with this boilerplate.

The npm commands in **bold** letters are the ones you might use the most.

| npm Command | Description |
| ----------- | ----------- |
| **`npm start`** | **Build everything, start all watch tasks and serve the index.html file.** |
| **`npm test`** | **Run browser tests in zuul.** |
| **`npm run lint`** | **Lint your files Cycle.js-style.** |
| `npm run clean` | Deletes the build folder. |
| `npm run budo` | Starts a development server, compiles and watches JavaScript and watches other assets. |
| `npm run build:js:prod` | Builds JavaScript for production with browserify and Uglify, generates external source maps. |
| `npm run build:css` | Compiles the Sass files to CSS. |
| `npm run build:css:prod` | Compiles the Sass files to CSS for production. |
| `npm run watch:scss` | Build and watch the Sass files with node-sass and chokidar. |

# License

MIT © [Kolja Kutschera, Christian Auer]
