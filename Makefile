install: install-deps

start:
	heroku local -f Procfile.dev

start-backend:
	PORT=5555 npm start -- --verbose-watch

start-frontend:
	npx webpack serve

install-deps:
	npm ci

build:
	npm run build

lint:
	npx eslint . --ext js,jsx

publish:
	npm publish

deploy:
	git push heroku

test:
	npm test -s

.PHONY: test
