import { isAddress } from '@ethersproject/address';
import { EthereumJsWalletProvider } from '@liquality/ethereum-js-wallet-provider';
import { MessageTypes, signTypedData, SignTypedDataVersion, TypedDataV1, TypedMessage } from '@metamask/eth-sig-util';

export interface SignTypedMessageType<V extends SignTypedDataVersion, T extends MessageTypes> {
  privateKey: Buffer;
  data: V extends 'V1' ? TypedDataV1 : TypedMessage<T>;
  version: SignTypedDataVersion;
  from: string;
}

const methodToVersion: Record<string, SignTypedDataVersion> = {
  eth_signTypedData: SignTypedDataVersion.V1,
  eth_signTypedData_v3: SignTypedDataVersion.V3,
  eth_signTypedData_v4: SignTypedDataVersion.V4,
};

// move to Chainify when integrated
export async function signTypedMessage(this: EthereumJsWalletProvider, payload: any): Promise<string> {
  const hdKey = await this.client.getMethod('hdKey')();
  const privateKey = hdKey.privateKey;

  const method = payload.method;
  const first = payload.params[0];
  const second = payload.params[1];

  const msgParams = { privateKey, version: methodToVersion[method] } as SignTypedMessageType<
    SignTypedDataVersion,
    MessageTypes
  >;

  try {
    if (isAddress(first)) {
      msgParams.from = first;
      msgParams.data = JSON.parse(second);
    } else {
      msgParams.from = second;
      msgParams.data = JSON.parse(first);
    }
  } catch (err) {
    throw new Error(`Invalid JSON: ${err}`);
  }

  const extraParams = payload.params[2] || {};

  if (msgParams.from === undefined) {
    throw new Error(`Undefined address - from address required to sign typed data.`);
  }

  if (msgParams.data === undefined) {
    throw new Error(`Undefined data - message required to sign typed data.`);
  }

  const sig = signTypedData({ ...msgParams, ...extraParams });
  return sig;
}
