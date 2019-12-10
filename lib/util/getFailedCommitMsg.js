/* eslint-disable newline-after-var */
const fs = require('fs');
const {spawn} = require('child_process');
const getGitRootDir = require('./getGitRootDir');

const getCommitEditMsgFile = () => {
  try {
    return fs.readFileSync(`${getGitRootDir()}/.git/COMMIT_EDITMSG`, {
      encoding: 'utf8'
    });
  } catch (error) {
    return '';
  }
};

const getLastCommit = (commitMsg) => new Promise((resolve) => {
  let foundCommit = '';

  process.chdir(getGitRootDir());
  // eslint-disable-next-line max-len
  const gettingCommit = spawn('git', ['log', '-1', '--all', '--pretty=format:%B', `--grep="${commitMsg}"`]);

  gettingCommit.stdout.on('data', (data) => {
    if (data) {
      foundCommit += data;
    }
  });
  gettingCommit.on('close', (code) => resolve(code > 0 ? '' : foundCommit));
});

const getFailedCommitMsg = async () => {
  const commitEditMsg = getCommitEditMsgFile();
  if (!commitEditMsg) {
    return '';
  }
  const lastCommit = await getLastCommit(commitEditMsg);
  if (commitEditMsg === lastCommit) {
    return '';
  }

  return commitEditMsg;
};

module.exports = getFailedCommitMsg;
