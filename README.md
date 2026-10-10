# Free Libre Open Collaboration

Free Libre Open Campaigning is a wordplay on Free Libre Open Source Software (FLOSS) it is a set of principles to obey by in order to better collaborate on projects across countries. These principles are not limited to campaigning, and can be used for any project where you would like to develop once and run many, another word is Free Libre Open Collaboration.

# An example on how to do multilanguage campaigns

We try to eat our own dogfood and explain how to do a multilingual campaign. This project serves as an example of that.

# Live project

* [English](https://floc.tech)
* [Norwegian](https://floc.no)

# Build output

English source lives in `src/index.mdh`; build tooling lives in `scripts/`.
Run `make` to derive the Norwegian MDH from its PO catalogue, then execute
Strapdown during the Node build. The
resulting static HTML variants are `html/index.html.en` and
`html/index.html.no`; these names are for the future Apache language map.
`html/` contains only published output. `src/` and `translate/` contain source
material, while the intermediate `build/` directory is not published.
