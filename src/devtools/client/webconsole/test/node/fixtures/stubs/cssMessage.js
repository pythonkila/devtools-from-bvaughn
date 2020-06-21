/* Any copyright is dedicated to the Public Domain.
  http://creativecommons.org/publicdomain/zero/1.0/ */
/* eslint-disable max-len */

"use strict";

/*
 * THIS FILE IS AUTOGENERATED. DO NOT MODIFY BY HAND. RUN TESTS IN FIXTURES/ TO UPDATE.
 */

const {
  parsePacketsWithFronts,
} = require("chrome://mochitests/content/browser/devtools/client/webconsole/test/browser/stub-generator-helpers");
const { prepareMessage } = require("devtools/client/webconsole/utils/messages");
const { ConsoleMessage, NetworkEventMessage } = require("devtools/client/webconsole/types");

const rawPackets = new Map();
rawPackets.set(`Unknown property ‘such-unknown-property’.  Declaration dropped.`, {
  pageError: {
    errorMessage: "Unknown property ‘such-unknown-property’.  Declaration dropped.",
    errorMessageName: "",
    sourceName:
      "http://example.com/browser/devtools/client/webconsole/test/browser/stub-generators/test-css-message.html",
    sourceId: null,
    lineText: "",
    lineNumber: 3,
    columnNumber: 27,
    category: "CSS Parser",
    innerWindowID: 8589934593,
    timeStamp: 1572867894874,
    warning: true,
    error: false,
    exception: false,
    strict: false,
    info: false,
    private: false,
    stacktrace: null,
    notes: null,
    chromeContext: false,
    cssSelectors: "p",
  },
  type: "pageError",
});

rawPackets.set(`Error in parsing value for ‘padding-top’.  Declaration dropped.`, {
  pageError: {
    errorMessage: "Error in parsing value for ‘padding-top’.  Declaration dropped.",
    errorMessageName: "",
    sourceName:
      "http://example.com/browser/devtools/client/webconsole/test/browser/stub-generators/test-css-message.html",
    sourceId: null,
    lineText: "",
    lineNumber: 3,
    columnNumber: 18,
    category: "CSS Parser",
    innerWindowID: 8589934593,
    timeStamp: 1572867895090,
    warning: true,
    error: false,
    exception: false,
    strict: false,
    info: false,
    private: false,
    stacktrace: null,
    notes: null,
    chromeContext: false,
    cssSelectors: "p",
  },
  type: "pageError",
});

const stubPackets = parsePacketsWithFronts(rawPackets);

const stubPreparedMessages = new Map();
for (const [key, packet] of Array.from(stubPackets.entries())) {
  const transformedPacket = prepareMessage(packet, {
    getNextId: () => "1",
  });
  const message = ConsoleMessage(transformedPacket);
  stubPreparedMessages.set(key, message);
}

module.exports = {
  rawPackets,
  stubPreparedMessages,
  stubPackets,
};
