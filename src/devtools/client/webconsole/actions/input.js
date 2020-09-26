/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { Utils: WebConsoleUtils } = require("devtools/client/webconsole/utils");
const {
  EVALUATE_EXPRESSION,
  SET_TERMINAL_INPUT,
  SET_TERMINAL_EAGER_RESULT,
} = require("devtools/client/webconsole/constants");
const { getAllPrefs } = require("devtools/client/webconsole/selectors/prefs");

const messagesActions = require("devtools/client/webconsole/actions/messages");
const { ConsoleCommand } = require("devtools/client/webconsole/types");

function evaluateExpression(expression) {
  return async ({ dispatch, webConsoleUI, hud }) => {
    if (!expression) {
      expression = hud.getInputSelection() || hud.getInputValue();
    }
    if (!expression) {
      return null;
    }

    // We use the messages action as it's doing additional transformation on the message.
    dispatch(
      messagesActions.messagesAdd([
        new ConsoleCommand({
          messageText: expression,
          timeStamp: Date.now(),
        }),
      ])
    );
    dispatch({
      type: EVALUATE_EXPRESSION,
      expression,
    });

    WebConsoleUtils.usageCount++;

    const frameActor = await webConsoleUI.getFrameActor();

    // Even if the evaluation fails,
    // we still need to pass the error response to onExpressionEvaluated.
    const onSettled = res => res;

    const response = await hud
      .evaluateJSAsync(expression, {
        frameActor,
        forConsoleMessage: true,
      })
      .then(onSettled, onSettled);

    return dispatch(onExpressionEvaluated(response));
  };
}

/**
 * The JavaScript evaluation response handler.
 *
 * @private
 * @param {Object} response
 *        The message received from the server.
 */
function onExpressionEvaluated(response) {
  return async ({ dispatch }) => {
    if (response.error) {
      console.error(`Evaluation error`, response.error, ": ", response.message);
      return;
    }

    // If the evaluation was a top-level await expression that was rejected, there will
    // be an uncaught exception reported, so we don't need to do anything.
    if (response.topLevelAwaitRejected === true) {
      return;
    }

    dispatch(messagesActions.messagesAdd([response]));
    return;
  };
}

function focusInput() {
  return ({ hud }) => {
    return hud.focusInput();
  };
}

function setInputValue(value) {
  return ({ hud }) => {
    return hud.setInputValue(value);
  };
}

function terminalInputChanged(expression) {
  return async ({ dispatch, webConsoleUI, hud, toolbox, client, getState }) => {
    const prefs = getAllPrefs(getState());
    if (!prefs.eagerEvaluation) {
      return;
    }

    // FIXME Eager evaluation is NYI
    return;
    /*
    const { terminalInput = "" } = getState().history;
    // Only re-evaluate if the expression did change.
    if (
      (!terminalInput && !expression) ||
      (typeof terminalInput === "string" &&
        typeof expression === "string" &&
        expression.trim() === terminalInput.trim())
    ) {
      return;
    }

    dispatch({
      type: SET_TERMINAL_INPUT,
      expression: expression.trim(),
    });

    // There's no need to evaluate an empty string.
    if (!expression || !expression.trim()) {
      // eslint-disable-next-line consistent-return
      return dispatch({
        type: SET_TERMINAL_EAGER_RESULT,
        expression,
        result: null,
      });
    }

    let mapped;
    ({ expression, mapped } = await getMappedExpression(hud, expression));

    const frameActor = await webConsoleUI.getFrameActor();
    const selectedThreadFront = toolbox && toolbox.getSelectedThreadFront();

    const response = await client.evaluateJSAsync(expression, {
      frameActor,
      selectedThreadFront,
      selectedNodeFront: webConsoleUI.getSelectedNodeFront(),
      mapped,
      eager: true,
    });

    // eslint-disable-next-line consistent-return
    return dispatch({
      type: SET_TERMINAL_EAGER_RESULT,
      result: getEagerEvaluationResult(response),
    });
    */
  };
}

function getEagerEvaluationResult(response) {
  const result = response.exception || response.result;
  // Don't show syntax errors results to the user.
  if ((result && result.isSyntaxError) || (result && result.type == "undefined")) {
    return null;
  }

  return result;
}

module.exports = {
  evaluateExpression,
  focusInput,
  setInputValue,
  terminalInputChanged,
};
