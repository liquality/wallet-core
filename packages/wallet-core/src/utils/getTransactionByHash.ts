import { Client } from '@chainify/client';
import { Transaction } from '@chainify/types';
import { ChainifyErrorParser, getErrorParser } from '@liquality/error-parser';

export async function getTransactionByHash(client: Client, hash: string): Promise<Transaction<any>> {
  const parser = getErrorParser(ChainifyErrorParser);
  return (await parser.wrapAsync(async () => await client.chain.getTransactionByHash(hash), null)) as Transaction<any>;
}
