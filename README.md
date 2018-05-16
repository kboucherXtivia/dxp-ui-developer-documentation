# UI Developer Documentation

This project is intended to house developer generated documentation for UI development tasks that developers are likely to encounter on XTVIIA Liferay development projects.

# Table of Contents

## Liferay

[Templates](./liferay/templates/README.md)

## JavaScript

### Node

* [NPM Post Install](./js/node/post-install.js) _Installs Git/Hg pre-commit hooks_

### Vanilla

* [Update Environment URLs](./js/vanilla/update-environment-urls.js) _Updates link href attributes for specific domains to support multiple downstream subdomain environments. (Where better solutions like `mod_rewrite` can't be used.)_

## Bash

### Precommit hook scripts
Enables automated JavaScript and CSS linting (via eslint and stylelint) on updated files before committing to source control.

* [Git Precommit Hook](./bash/pre-commit.sh)
* [Hg Precommit Hook](./bash/hg-precommit.sh)
