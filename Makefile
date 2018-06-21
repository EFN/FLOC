.PHONY: all translations

all: translations

translations:
	po4a -k 99 --keep-translations -M utf-8 po4a.cfg
	for file in $$(ls site/*/*.mdh| grep -v site/en/); do \
                perl -pi -e "s/ (\w+:.*)/\n\$$1\n.../" $$file; \
	done
