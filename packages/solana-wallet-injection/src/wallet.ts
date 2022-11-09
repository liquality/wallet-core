/* eslint-disable no-console */
import { Liquality, LiqualityEvent } from '@liquality/solana-wallet-standard/src/window';
import { PublicKey, Transaction, VersionedTransaction, SendOptions, Connection, Message } from '@solana/web3.js';
import { SolanaParser, ParsedInstruction } from '@debridge-finance/solana-transaction-parser';
import { Idl } from '@project-serum/anchor';
import { COMMON_REQUEST_MAP } from './types';
import { BigNumber } from '@chainify/types';

/**
 * @dev users are paying a fixed fee of 5000 lamports per transaction/signature
 */
const DEFAULT_FEE = '0.000005';

export class LiqualitySolanaWallet implements Liquality {
  public publicKey: PublicKey | null;
  public isConnected: boolean;
  private window: Window;
  private _connection: Connection;

  public get connection(): Connection {
    return this._connection;
  }
  public set connection(value: Connection) {
    this._connection = value;
  }
  private solanaParser = new SolanaParser([]);

  constructor(window: Window) {
    this.window = window;
    this.connection = new Connection(
      'https://red-sleek-rain.solana-mainnet.discover.quiknode.pro/fc112deb1e0228d09d0d8c12b8de5a601d251d80'
    );
  }

  public async connect(
    _options?: { onlyIfTrusted?: boolean | undefined } | undefined
  ): Promise<{ publicKey: PublicKey }> {
    const { accepted } = await this.enable();

    if (!accepted) {
      throw new Error('User rejected');
    }

    const addresses = await this.callMethod(COMMON_REQUEST_MAP.wallet_getAddresses);
    const [{ publicKey }] = addresses;
    this.publicKey = new PublicKey(publicKey);
    this.isConnected = true;

    console.debug(`Public Key`, this.publicKey);
    console.debug(`Public Key Decoded`, this.publicKey.toBase58());
    console.log('Is Connected: ', this.isConnected);
    return { publicKey };
  }

  public async disconnect(): Promise<void> {
    this.publicKey = null;
    this.isConnected = false;
  }

  public async signAndSendTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T,
    options?: SendOptions | undefined
  ): Promise<{ signature: string }> {
    console.debug('signAndSendTransaction');
    const signedRawTx = (await this.signTransaction(transaction)).serialize();
    console.debug('signAndSendTransaction: signedRawTx', signedRawTx);
    const signature = await this.connection.sendRawTransaction(signedRawTx, options);
    console.debug('signAndSendTransaction: signature', signature);
    return { signature };
  }

  public async signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
    console.debug('signTransaction');
    const instructions = this.getTransactionDetails(transaction);
    const signer = await this.callMethod(COMMON_REQUEST_MAP.wallet_getSigner, {
      transaction,
      instructions,
      fee: DEFAULT_FEE,
    });

    transaction.sign([signer] as any);

    return transaction;
  }

  public async signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]> {
    console.debug('signAllTransactions');
    const instructions: ParsedInstruction<Idl, string>[] = [];

    for (const t of transactions) {
      const _instructions = this.getTransactionDetails(t);
      instructions.push(..._instructions);
    }

    const signer = await this.callMethod(COMMON_REQUEST_MAP.wallet_getSigner, {
      transactions,
      instructions,
      fee: new BigNumber(transactions.length).multipliedBy(DEFAULT_FEE).toString(),
    });

    for (const t of transactions) {
      t.sign([signer] as any);
    }

    return transactions;
  }

  public async signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }> {
    console.debug('signMessage', message);
    console.debug('signMessage: string', message.toString());
    return this.callMethod(COMMON_REQUEST_MAP.wallet_signMessage, message.toString());
  }

  public on<E extends keyof LiqualityEvent>(_event: E, _listener: LiqualityEvent[E], _context?: any): void {
    console.debug('on', _event);
  }

  public off<E extends keyof LiqualityEvent>(_event: E, _listener: LiqualityEvent[E], _context?: any): void {
    console.debug('off', _event);
  }

  private getTransactionDetails<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): ParsedInstruction<Idl, string>[] {
    console.debug('getTransactionDetails', transaction);

    let instructions: ParsedInstruction<Idl, string>[] = [];

    // Legacy Transaction
    if (transaction instanceof Transaction) {
      instructions = transaction.instructions.reduce((result, instruction) => {
        const parsed = this.solanaParser.parseInstruction(instruction);
        result.push(parsed);
        return result;
      }, [] as ParsedInstruction<Idl, string>[]);
    }
    // VersionedTransaction
    else {
      if (transaction.message instanceof Message) {
        instructions = this.solanaParser.parseTransactionData(transaction.message);
      }
    }

    console.debug(`transaction: `, transaction);
    console.debug(`instructions: `, instructions);

    return instructions;
  }

  private async enable() {
    return await this.window.providerManager.enable('solana');
  }

  private callMethod(method: string, ...args: any) {
    const func = this.window.providerManager.getProviderFor('SOL').getMethod(method);
    return func(...args);
  }
}
