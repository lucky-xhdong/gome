@echo off　
cd %1\dist
svn delete %2/index.html -m "delete index file"
svn delete %2/static -m "delete static file"

cd %1

svn update
npm run %3build

