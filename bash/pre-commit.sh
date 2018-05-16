#!/bin/sh

##
#  Git Pre-COmmit hook script
#
#  Runs linters against staged JavaScript and SCSS files, and
#  rejects commit if errors are present.
#
#  Copy to .git/hooks/pre-commit (no file extension) to enable.
#
#  Requires eslint and stylelint and Bash shell (see project README.md)
##

printf "\n\nValidating staged files ... \n\n  Linting JavaScript ... \n"

exit_code=0

##
#  Lint all staged JS files and exit if errors are found.
##
staged_js=$(find ./src/**/* -name '*.js' | xargs -r git diff --cached --name-only)
if [ -n "$staged_js" ]; then
    js_errors=$(./node_modules/.bin/eslint "$staged_js")
    if [ -n "$js_errors" ]; then
        echo "$js_errors"
        printf "\n    ✖ ESLint errors abound!\n"
        exit_code=1
    else
        printf "\n    \xE2\x9C\x94 Javascript passed!\n"
    fi
else
    printf "\n    No staged JavaScript files found.\n"
fi

printf "\n  Linting SCSS files ...\n"

##
#  Lint all staged SASS (scss) files and exit if errors are found.
##
staged_scss=$(find ./src/**/* -name '*.scss' | xargs -r git diff --cached --name-only)
if [ -n "$staged_scss" ]; then
    scss_errors=$(./node_modules/.bin/stylelint $staged_scss --color)
    if [ -n "$scss_errors" ]; then
        echo "$scss_errors"
        printf "\n    ✖ Stylelint errors abound!\n"
        exit_code=1
    else
        printf "\n    \xE2\x9C\x94 SCSS passed!\n"
    fi
else
    printf "\n    No staged SCSS files found.\n"
fi

##
# Check exit code and respond accordingly
##
if [ $exit_code -eq 0 ]; then
    printf "\n\xE2\x9C\x94 Staged files committed!\n\n"
else
    printf "\n✖ Please fix errors and try again.\n\n"
fi

exit $exit_code
