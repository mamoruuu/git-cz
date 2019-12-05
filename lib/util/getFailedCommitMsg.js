/* eslint-disable newline-after-var */
const fs = require('fs');
const {spawn} = require('child_process');
const getGitRootDir = require('./getGitRootDir');

const getLastCommit = () => new Promise((resolve) => {
  let commit = '';

  process.chdir(getGitRootDir());
  // eslint-disable-next-line max-len
  const gettingCommit = spawn('git', ['log', '-1', '--all', '--pretty=format:%B']);

  gettingCommit.stdout.on('data', (data) => {
    if (data) {
      commit += data;
    }
  });
  gettingCommit.on('close', (code) => resolve(code > 0 ? '' : commit));
});

const getCommitEditMsgFile = () => {
  try {
    return fs.readFileSync(`${getGitRootDir()}/.git/COMMIT_EDITMSG`, {
      encoding: 'utf8'
    });
  } catch (error) {
    return '';
  }
};

const getFailedCommitMsg = async () => {
  const commitEditMsg = getCommitEditMsgFile();
  const lastCommit = await getLastCommit();
  if (!commitEditMsg || !lastCommit) {
    return '';
  }

  return commitEditMsg === lastCommit ? '' : commitEditMsg;
};

module.exports = getFailedCommitMsg;
