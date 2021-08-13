# Table Interactive

Authoring view of the interactive:
https://models-resources.concord.org/table-interactive/index.html?mode=authoring

Actual interactive itself, requires embedding in LARA to be useful:
https://models-resources.concord.org/table-interactive/index.html

## Development

First, you need to make sure all the NPM packages required by this project are available:

```
npm install
```

Then start webpack dev server:
```
npm run start
```
and open [http://localhost:8080/](http://localhost:8080/).

Or to test it inside of LARA you'll need to run it with https:
```
npm run start:secure
```
And use the URL https://localhost:8080

## Deployment

Pushes to master will build automatically on travis, and deploy to
https://models-resources.concord.org/table-interactive/

Pushes to other branches will deploy to
https://models-resources.concord.org/table-interactive/branch/<branch-name>/

## License

[MIT](https://github.com/concord-consortium/seismic-explorer/blob/master/LICENSE)
