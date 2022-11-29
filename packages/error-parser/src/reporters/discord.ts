import { LiqualityError } from '../LiqualityErrors/LiqualityError';
import { HttpClient } from '@chainify/client';
import { LiqualityErrorJSON } from '../types';

export const reportToDiscord = async (error: LiqualityError | LiqualityErrorJSON) => {
  const messages = prepareErrorForDiscord(error);
  const htttpClient = new HttpClient({});
  messages.forEach((message) => {
    htttpClient
      .nodePost(`${process.env.VUE_APP_DISCORD_WEBHOOK}`, {
        content: message,
        username: 'Error Parser',
      })
      .catch(ignoreError);
  });
};

function ignoreError(e: any) {
  return e;
}

function prepareErrorForDiscord(error: LiqualityError | LiqualityErrorJSON) {
  const header = `**New Error From Error Parser** \n
  ID: ${error.data.errorId} \n
  Name: ${error.name} \n
  Source: ${error.source} \n
  Developer Message: ${JSON.stringify(error.devMsg)} \n`;

  const footer = `Data: ${JSON.stringify(error.data)} \n
  Stack: ${error.stack} \n`;

  const DISCORD_CHARACTER_LIMIT = 1900; // ought to be 2000 but using 1900 just to be safe.
  const maxLengthForRawError = DISCORD_CHARACTER_LIMIT - (header.length + footer.length);
  const rawErrorString = JSON.stringify(error.rawError);

  let start = 0;
  let end = maxLengthForRawError;
  const splittedRawError = [];

  if (rawErrorString.length > maxLengthForRawError) {
    while (start !== end) {
      splittedRawError.push(rawErrorString.substring(start, end));
      start = end;
      if (end + maxLengthForRawError > rawErrorString.length) end = rawErrorString.length;
      else end += maxLengthForRawError;
    }
  }

  if (splittedRawError.length === 0) {
    return [
      `${header}
        Raw Error: ${JSON.stringify(error.rawError)} \n
        ${footer}`,
    ];
  } else {
    const messages: Array<string> = [];

    splittedRawError.forEach((errorPart, index) => {
      messages.push(`
        ${header}
        Raw Error (${index + 1} of ${splittedRawError.length}): ${JSON.stringify(errorPart)} \n
        ${footer}`);
    });

    return messages;
  }
}
