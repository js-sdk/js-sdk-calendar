BABEL=./node_modules/babel-cli/bin/babel.js
BROWSERIFY=./node_modules/browserify/bin/cmd.js
MOCHA=./node_modules/mocha/bin/mocha

CFLAGS=--plugins transform-es2015-modules-umd
TEST_CFLAGS=--compilers js:babel-register --require should

ifeq ("$(DEV)", "1")
CFLAGS+= -w
endif

pre-build:
	-mkdir -p lib
	-mkdir -p dist

lib/calendar.js: src/index.js
	$(BABEL) $< -o $@

dist/calendar.js: src/index.js
	$(BABEL) $(CFLAGS) $< -o $@

dist/calendar.min.js: src/index.js
	$(BABEL) $(CFLAGS) --minified $< -o $@

examples/index.js: examples/src/index.js
	$(BROWSERIFY) $< -d -t babelify --outfile $@

compile: pre-build dist/calendar.js dist/calendar.min.js

all: compile lib/calendar.js examples/index.js

test:
	$(MOCHA) $(TEST_CFLAGS) tests/*.js

clean:
	rm -rf lib dist

clean-all: clean
	rm -rf node_modules
