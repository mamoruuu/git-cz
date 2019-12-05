const createState = require('./createState');
const runInteractiveQuestions = require('./runInteractiveQuestions');
const formatCommitMessage = require('./formatCommitMessage');
const commitRecovery = require('./commitRecovery');

exports.prompter = (cz, commit) => {
  const run = async () => {
    const state = createState();
    let message;

    if (state.config.tryToRecover) {
      await commitRecovery(state);
    }

    if (state.answers.recover) {
      message = state.recoveredMessage;
    } else {
      await runInteractiveQuestions(state);
      message = formatCommitMessage(state);
    }

    return commit(message);
  };

  run();
};
