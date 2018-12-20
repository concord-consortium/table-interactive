# Table Interactive

Authoring view of the interactive:
https://models-resources.concord.org/table-interactive/index.html?mode=authoring

Actual interactive itself, requires embedding in LARA to be useful:
https://models-resources.concord.org/table-interactive/index.html

## Development

First, you need to make sure that webpack is installed and all the NPM packages required by this project are available:

```
npm install -g webpack
npm install
```
Then you can build the project files using:
```
webpack
```
or start webpack dev server:
```
npm install -g webpack-dev-server 
webpack-dev-server
```
and open [http://localhost:8080/](http://localhost:8080/).

## Deployment (gh-pages)

Build project using webpack and push content of the `dist` folder to the `gh-pages` branch.
It can be done automatically by `deploy.sh` script, just run:

```
./deploy.sh
```

## License 

[MIT](https://github.com/concord-consortium/seismic-explorer/blob/master/LICENSE)
