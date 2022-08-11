import { expect } from 'chai'
import { chains, chainToTokenAddressMap } from '../../src'

describe('Avalanche chain tests', function () {
  const avalanche = chains.avalanche
  const erc20Assets = chainToTokenAddressMap.avalanche

  it('Has correct name', () => {
    expect(avalanche.name).to.be.equal('Avalanche', 'Invalid chain name')
  })

  it('Has correct code', () => {
    expect(avalanche.code).to.be.equal('AVALANCHE', 'Invalid chain code')
  })

  it('Has correct native asset', () => {
    expect(avalanche.nativeAsset).to.be.equal('AVAX', 'Invalid native asset')
  })

  it('Has correct fee unit', () => {
    expect(avalanche.fees.unit).to.be.equal('gwei', 'Invalid fee unit')
  })

  it('Has correct number of confirmations', () => {
    expect(avalanche.safeConfirmations).to.be.equal(5, 'Invalid number of confirmation')
  })

  it('Provides correct address validation', () => {
    const validAddress = [
      '0xB27515Ef1B667493eAfc48DA244a1fD7549eaeB6',
      '0xd3ff7ba8d4E2d4D075172938D60a2fCd7d299aC1',
      '0x39912D83acb4A373321387300f4FBE88Aa5d6F14',
      '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      '0x60aE616a2155Ee3d9A68541Ba4544862310933d4'
    ]

    validAddress.forEach((a: string) => {
      expect(avalanche.isValidAddress(a)).to.be.true
    })

    const invalidAddress = ['9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c264747', 'somewallet']
    invalidAddress.forEach((a: string) => {
      expect(avalanche.isValidAddress(a)).to.be.false
    })
  })

  it('Provides correct address formatting', () => {
    const address = [
      '0xB27515Ef1B667493eAfc48DA244a1fD7549eaeB6',
      '0xd3ff7ba8d4E2d4D075172938D60a2fCd7d299aC1',
      '0x39912D83acb4A373321387300f4FBE88Aa5d6F14',
      '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      '0x60aE616a2155Ee3d9A68541Ba4544862310933d4'
    ]

    address.forEach((a: string, index: number) => {
      expect(avalanche.formatAddress(a)).to.be.equal(address[index])
    })
  })

  it('Provides correct tx validation', () => {
    const validTxHash = '0xb4ec649426ba04cd0407d5929288ff3d59d8baca9b810cf4147620bab6dadba3'
    expect(avalanche.isValidTransactionHash(validTxHash)).to.be.true
    
    const validTxHashWithout0x = 'b4ec649426ba04cd0407d5929288ff3d59d8baca9b810cf4147620bab6dadba3'
    expect(avalanche.isValidTransactionHash(validTxHashWithout0x)).to.be.true

    const validTxHashInvalidSigner =
      '8pRdygzR8Zk9oMYmqiyzUpqJQnFmaAnMLniexycNLavr_9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c264747'
    expect(avalanche.isValidTransactionHash(validTxHashInvalidSigner)).to.be.false

    const invalidTxHashValidSigner =
      '8pRdygzR8Zk9oMYmqiyzUpqJQnFmaAnMLniexycNLa_9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c2647472'
    expect(avalanche.isValidTransactionHash(invalidTxHashValidSigner)).to.be.false

    const invalidTxHashInvalidSigner =
      '8pRdygzR8Zk9oMYmqiyzUpqJQnFmaAnMLniexycNLa_9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c264747'
    expect(avalanche.isValidTransactionHash(invalidTxHashInvalidSigner)).to.be.false
  })

  it('Provides correct Transaction Hash formatting', () => {
    const txHash = '0x1ecb618078b4418c3b74254f7c8cfc7301deafd5c70177be4581d9625cfba53c'
    expect(avalanche.formatTransactionHash(txHash)).to.be.equal(txHash)
  })

  it('should validate avalanche erc20Assets', () => {
    const sizeOfErc20Assets = Object.keys(erc20Assets).length
    expect(sizeOfErc20Assets).to.be.gt(2)
    for (let i = 0; i < sizeOfErc20Assets; i++) {
      expect(`${Object.values(erc20Assets)[i].chain}`).to.be.equal('avalanche')
      expect(`${Object.values(erc20Assets)[i].name}`).not.to.be.null
      expect(`${Object.values(erc20Assets)[i].decimals}`).oneOf(['6', '8'])
      expect(`${Object.values(erc20Assets)[i].code}`).not.to.be.null
      expect(`${Object.values(erc20Assets)[i].contractAddress}`).not.to.be.null
      expect(`${Object.values(erc20Assets)[i].type}`).to.be.equal('erc20')
    }
  })
})
