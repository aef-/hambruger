REPORTER ?= spec

test:
	./node_modules/mocha/bin/mocha --check-leaks --colors -t 10000 --reporter $(REPORTER) tests/

.PHONY: test
