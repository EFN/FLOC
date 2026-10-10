.PHONY: all translations html

all: html

translations:
	mkdir -p build
	po4a --no-update -k 99 --keep-translations -M utf-8 po4a.cfg

html: translations scripts/build.mjs package.json package-lock.json
	node scripts/build.mjs
