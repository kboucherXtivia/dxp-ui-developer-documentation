/* eslint no-console: 0, prefer-destructuring: 0, prefer-template: 0 */

/*
    Installs Git and Hg pre-commit hook scripts for linting JavaScript and CSS.

    * Requires eslint and stylelint to be installed via npm in the project.
    * May need to update `hgrcPath` value
    * May need to update `hookAddedMessage` value to reflect correct location
      of this script in your project.
    * May need to update `gitPreCommitScript` and `hgPreCommitConfig` values to
      reflect correct location of these scripts in your project.
    * Various `console.log()` messages reference particular file locations that
      may need to be updated.

    The associated Bash scripts that handle the pre-commits in both environments
    can be found in the `/bash` folder of the `ui-developer-documentation` project.
 */

const fs = require('fs');
const spawn = require('child_process').spawn;

const gitPreCommitHook = './.git/hooks/pre-commit';
const gitPreCommitScript = './src/bin/pre-commit.sh';
const hgHooksHeader = '[hooks]\n';
const hgPreCommitConfig = 'precommit = sh ./src/bin/hg-precommit.sh\n';
const hgrcInfo = '# repository config (see "hg help config" for more info)\n\n';
const hgrcPath = './.hg/hgrc';
const hookAddedMssg = '\n./src/bin/post-install.js: *** Pre-Commit hook added! ***\n';
const isGitRepo = fs.existsSync('.git');
const isHgRepo = fs.existsSync('.hg');
const removeHgPrecommit = true; // Toggle this to add or remove Bash-dependent pre-commit script for Hg

// setup local linters
spawn('node', ['./node_modules/.bin/eslint', '--init']);
spawn('node', ['./node_modules/.bin/stylelint', '--init']);

// Handle both Git and Hg repos
if (isGitRepo) {
    // Copy pre-commit script to Git hooks folder
    fs.createReadStream(gitPreCommitScript)
        .pipe(fs.createWriteStream(gitPreCommitHook));
    console.log(hookAddedMssg);
}

if (isHgRepo) {
    if (removeHgPrecommit) {
        // Remove the precommit hook
        fs.stat(hgrcPath, (err/* , stat */) => {
            if (err === null) {
                fs.readFile(hgrcPath, 'utf-8', (err2, data) => {
                    if (err2) throw err2;

                    const isPreCommitHook = data.match(/^precommit[\s|=]/gm) !== null;

                    if (isPreCommitHook) {
                        let fileData = data;

                        // Remove the precommit config added by this script (if exists).
                        fileData = fileData.replace(hgPreCommitConfig, '');
                        fs.writeFile(hgrcPath, fileData);

                        console.log('\n./src/bin/post-install.js: *** Hg precommit hook removed. ***\n');
                    }
                });
            } else if (err.code === 'ENOENT') {
                // If no hgrc file, then do nothing
                console.log('\n./hg/hgrc not found, so no need to remove precommit hook.\n');
            } else {
                // If other script failure, then alert user to handle manually
                console.log('\nNPM post-install script error: ' + err.code +
                        '. \nRemove precommit hook (' + hgPreCommitConfig + ') manually in ./.hg/hgrc file.\n');
            }
        });
    } else {
        // Setup precommit hook in hg configuration file
        fs.stat(hgrcPath, (err/* , stat */) => {
            if (err === null) {
                // Check for [hooks] && ^precommit
                fs.readFile(hgrcPath, 'utf-8', (err2, data) => {
                    if (err2) throw err2;

                    const isHooks = data.match(/^\[hooks\]/gm) !== null;
                    const isPreCommitHook = data.match(/^precommit[\s|=]/gm) !== null;
                    let fileData = data;

                    if (isPreCommitHook) {
                        // If precommit hooks are present, rely on user to add this one.
                        console.log(`\n\n*** Please be sure precommit hook is configured in ./hg/hgrc [hooks] section:
                            ${hgPreCommitConfig}\n`);
                    } else if (isHooks) {
                        fileData = fileData.replace(hgHooksHeader, hgHooksHeader + hgPreCommitConfig);
                        fs.writeFile(hgrcPath, fileData);
                        console.log(hookAddedMssg);
                    } else {
                        // If neither exist, then append hooks section and precommit configuration.
                        fileData = `${fileData}\n${hgHooksHeader}${hgPreCommitConfig}`;
                        fs.writeFile(hgrcPath, fileData);
                        console.log(hookAddedMssg);
                    }
                });
            } else if (err.code === 'ENOENT') {
                // If no hgrc file, then create it and add precommit hook configuration
                fs.writeFile(hgrcPath, hgrcInfo + hgHooksHeader + hgPreCommitConfig);
                console.log(hookAddedMssg);
            } else {
                console.log(`NPM post-install script error: ${err.code}`);
            }
        });
    }
}
