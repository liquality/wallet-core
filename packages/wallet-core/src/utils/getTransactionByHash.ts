import { Client } from '@chainify/client';
import { Transaction } from '@chainify/types';
import { ChainifyErrorParser, getParser } from '@liquality/error-parser';

export async function getTransactionByHash(client: Client, hash: string): Promise<Transaction<any>> {
  const parser = getParser(ChainifyErrorParser);
  return (await parser.wrapAync(async () => await client.chain.getTransactionByHash(hash), null)) as Transaction<any>;
}
