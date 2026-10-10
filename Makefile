.PHONY: all translations html

all: html

translations:
	mkdir -p build
	node scripts/extract-body.mjs
	po4a -k 99 -M utf-8 po4a.cfg

html: translations scripts/build.mjs package.json package-lock.json
	node scripts/build.mjs
