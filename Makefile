include builder/compile.mk

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

dist-all: pre-build dist/calendar.js dist/calendar.min.js

all: test dist-all examples/index.js

test:
	$(MOCHA) $(TEST_CFLAGS) tests/*.js

clean:
	rm -rf lib dist examples/index.js

clean-all: clean
	rm -rf node_modules
