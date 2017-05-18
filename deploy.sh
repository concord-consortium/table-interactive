#!/bin/bash

rm -rf dist
git clone -b gh-pages git@github.com:concord-consortium/table-interactive.git dist
webpack
cd dist
git add .
git commit -m 'Update gh-pages'
git push origin gh-pages
cd ..
