const inquirer = require('inquirer');
const LimitedInputPrompt = require('./LimitedInputPrompt');
const getFailedCommitMsg = require('./util/getFailedCommitMsg');

inquirer.registerPrompt('limitedInput', LimitedInputPrompt);

const createQuestion = async (state) => {
  state.recoveredMessage = await getFailedCommitMsg();

  if (!state.recoveredMessage) {
    return null;
  }
  const message = `Undone or failed commit message found:
-------------------------------------
${state.recoveredMessage}
-------------------------------------
  Would you like to use it?`;

  return {
    default: true,
    message,
    name: 'recover',
    type: 'confirm'
  };
};

const commitRecovery = async (state) => {
  const question = await createQuestion(state);

  if (question === null) {
    return;
  }

  const answers = await inquirer.prompt(question);

  state.answers.recover = answers.recover;
};

module.exports = commitRecovery;
