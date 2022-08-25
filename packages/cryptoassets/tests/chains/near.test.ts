/* eslint-disable jest/valid-expect */
import { expect } from 'chai';
import near from '../../src/chains/mainnet/non-evm/near';

describe('Near', function () {
  it('Has correct name', () => {
    expect(near.name).to.be.equal('Near', 'Invalid chain name');
  });

  it('Has correct code', () => {
    expect(near.code).to.be.equal('NEAR', 'Invalid chain code');
  });

  it('Has correct native asset', () => {
    expect(near.nativeAsset[0].code).to.be.equal('NEAR', 'Invalid native asset');
  });

  it('Has correct fee unit', () => {
    expect(near.fees.unit).to.be.equal('TGas', 'Invalid fee unit');
  });

  it('Has correct number of confirmations', () => {
    expect(near.safeConfirmations).to.be.equal(10, 'Invalid number of confirmation');
  });

  it('Provides correct address validation', () => {
    const validAddress = ['9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c2647472', 'somewallet.near'];

    validAddress.forEach((a: string) => {
      expect(near.isValidAddress(a)).to.be.true;
    });

    const invalidAddress = ['9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c264747', 'somewallet'];
    invalidAddress.forEach((a: string) => {
      expect(near.isValidAddress(a)).to.be.false;
    });
  });

  it('Provides correct address formatting', () => {
    const address = ['9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c2647472', 'somewallet.near'];

    address.forEach((a: string, index: number) => {
      expect(near.formatAddress(a)).to.be.equal(address[index]);
    });
  });

  it('Provides correct tx validation', () => {
    const validTxHash =
      '8pRdygzR8Zk9oMYmqiyzUpqJQnFmaAnMLniexycNLavr_9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c2647472';
    expect(near.isValidTransactionHash(validTxHash)).to.be.true;

    const validTxHashInvalidSigner =
      '8pRdygzR8Zk9oMYmqiyzUpqJQnFmaAnMLniexycNLavr_9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c264747';
    expect(near.isValidTransactionHash(validTxHashInvalidSigner)).to.be.false;

    const invalidTxHashValidSigner =
      '8pRdygzR8Zk9oMYmqiyzUpqJQnFmaAnMLniexycNLa_9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c2647472';
    expect(near.isValidTransactionHash(invalidTxHashValidSigner)).to.be.false;

    const invalidTxHashInvalidSigner =
      '8pRdygzR8Zk9oMYmqiyzUpqJQnFmaAnMLniexycNLa_9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c264747';
    expect(near.isValidTransactionHash(invalidTxHashInvalidSigner)).to.be.false;
  });

  it('Provides correct tx formatting', () => {
    const txHash =
      '8pRdygzR8Zk9oMYmqiyzUpqJQnFmaAnMLniexycNLavr_9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c2647472';
    expect(near.formatTransactionHash(txHash)).to.be.equal(txHash);
  });
});
