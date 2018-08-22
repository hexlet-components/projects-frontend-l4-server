install: install-deps install-flow-typed

start:
	npm run nodemon -- --exec npm run babel-node -- server/bin/slack.js

install-deps:
	npm install

build:
	rm -rf dist
	npm run build
	npm run webpack -- -p --env production && babel frontend --out-dir dist --source-maps inline

test:
	npm test

check-types:
	npm run flow

lint:
	npm run eslint .

publish:
	npm publish

.PHONY: test
