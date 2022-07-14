import EthCrypto from 'eth-crypto';
import { io, Socket } from 'socket.io-client';
import { ActionContext, rootActionContext } from '..';

let socket: Socket;

export const updateMessages = async (
  context: ActionContext,
  { recipient, timestamp, message }: { recipient: string; timestamp: number; message: string }
): Promise<{ recipient: string; timestamp: number; message: string }> => {
  const { state, commit } = rootActionContext(context);
  const { activeWalletId, accounts, activeNetwork } = state;

  const accountData = accounts[activeWalletId]![activeNetwork].find((account) => account.chain === 'ethereum');

  const myAddress = accountData?.addresses[0];

  if (!socket) {
    console.log('in');
    socket = io('https://ca89-85-196-181-2.eu.ngrok.io/', {
      reconnectionDelayMax: 10000,
    });
  }

  // TODO: get public key
  const publicKey =
    '04e9bbafeab49c4099571c104c0fd534d9308c7bcf88d47173c5e54b28ea3ea6d85dd06129f8540126545e3f8afa10f0d93e6c1b383d1b8d3c2c05131dcdee7fe8';
  const encryptedMsg = await EthCrypto.encryptWithPublicKey(publicKey, message);
  const _message = { sender: myAddress, recipient, timestamp, message };

  socket.emit('SEND_MESSAGE', { recipient, sender: myAddress, message: encryptedMsg });
  commit.UPDATE_MESSAGES({ ..._message });

  socket.on('SEND_MESSAGE_ACK', async (payload) => {
    console.log('SEND_MESSAGE_ACK');
    if (payload.recipient === myAddress) {
      console.log('hit');

      // TODO: get private key
      const privateKey = '0x';
      const decryptedMessage = await EthCrypto.decryptWithPrivateKey(privateKey, payload.message);
      commit.UPDATE_MESSAGES({ ...payload, message: decryptedMessage });
    }
  });

  return _message;
};
