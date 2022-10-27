import { LiqualityError } from '../LiqualityErrors/LiqualityError';
import { HttpClient } from '@chainify/client';
import { LiqualityErrorJSON } from '../types';

export const reportToDiscord = async (error: LiqualityError | LiqualityErrorJSON) => {
  new HttpClient({})
    .nodePost(`${process.env.VUE_APP_DISCORD_WEBHOOK}`, {
      content: prepareErrorForDiscord(error),
      username: 'Error Parser',
    })
    .catch(ignoreError);
};

function ignoreError(e: any) {
  return e;
}

function prepareErrorForDiscord(error: LiqualityError | LiqualityErrorJSON) {
  return `**New Error From Error Parser** \n
          ID: ${error.data.errorId} \n
          Name: ${error.name} \n
          Developer Message: ${JSON.stringify(error.devMsg)} \n
          Raw Error: ${JSON.stringify(error.rawError)} \n
          Data: ${JSON.stringify(error.data)} \n
          Stack: ${error.stack} \n`;
}
