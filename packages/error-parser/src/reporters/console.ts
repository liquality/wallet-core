import { LiqualityErrorJSON } from '../types';
import { LiqualityError } from '../LiqualityErrors/LiqualityError';

export function reportToConsole(error: LiqualityError | LiqualityErrorJSON) {
  console.error(prepareErrorForConsole(error));
}

function prepareErrorForConsole(error: LiqualityError | LiqualityErrorJSON) {
  return `New Error From Error Parser \n
          ID: ${error.data.errorId} \n
          Name: ${error.name} \n
          Developer Message: ${JSON.stringify(error.devMsg)} \n
          Raw Error: ${JSON.stringify(error.rawError)} \n
          Data: ${JSON.stringify(error.data)} \n
          Stack: ${error.stack} \n`;
}
