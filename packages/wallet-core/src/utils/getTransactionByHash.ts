import { Client } from '@chainify/client';
import { Transaction } from '@chainify/types';

export async function getTransactionByHash(client: Client, hash: string): Promise<Transaction<any>> {
  return await client.chain.getTransactionByHash(hash);
}
