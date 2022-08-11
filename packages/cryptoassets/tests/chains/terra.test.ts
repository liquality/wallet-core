import { expect } from 'chai'
import { chains, chainToTokenAddressMap } from '../../src'

describe('Terra chain tests', function () {
  const terra = chains.terra
  const erc20Assets = chainToTokenAddressMap.terra

  it('Has correct name', () => {
    expect(terra.name).to.be.equal('Terra', 'Invalid chain name')
  })

  it('Has correct code', () => {
    expect(terra.code).to.be.equal('LUNA', 'Invalid chain code')
  })

  it('Has correct native asset', () => {
    expect(terra.nativeAsset).to.be.equal('LUNA', 'Invalid native asset')
  })

  it('Has correct fee unit', () => {
    expect(terra.fees.unit).to.be.equal('LUNA', 'Invalid fee unit')
  })

  it('Has correct number of confirmations', () => {
    expect(terra.safeConfirmations).to.be.equal(1, 'Invalid number of confirmation')
  })

  it('Provides correct address validation', () => {
    const validAddress = [
      'terra1au6q7dj5yvfafyfma5zj9cfk0glm2w76k7436x',
      'terra1fex9f78reuwhfsnc8sun6mz8rl9zwqh03fhwf3'
    ]

    validAddress.forEach((a: string) => {
      expect(terra.isValidAddress(a)).to.be.true
    })

    const invalidAddress = ['9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c264747', 'somewallet']
    invalidAddress.forEach((a: string) => {
      expect(terra.isValidAddress(a)).to.be.false
    })
  })

  it('Provides correct address formatting', () => {
    const address = ['terra1au6q7dj5yvfafyfma5zj9cfk0glm2w76k7436x', 'terra1fex9f78reuwhfsnc8sun6mz8rl9zwqh03fhwf3']

    address.forEach((a: string, index: number) => {
      expect(terra.formatAddress(a)).to.be.equal(address[index])
    })
  })

  it('Provides correct tx validation', () => {
    const validTxHash = '3B2555E2FFCF27E9D7E47E09762C948FAD37111BC75F5BCAE6ED14B48FDC14F4'
    expect(terra.isValidTransactionHash(validTxHash)).to.be.true

    const validTxHashInvalidSigner =
      '8pRdygzR8Zk9oMYmqiyzUpqJQnFmaAnMLniexycNLavr_9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c264747'
    expect(terra.isValidTransactionHash(validTxHashInvalidSigner)).to.be.false

    const invalidTxHashValidSigner =
      '8pRdygzR8Zk9oMYmqiyzUpqJQnFmaAnMLniexycNLavr_9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c264747'
    expect(terra.isValidTransactionHash(invalidTxHashValidSigner)).to.be.false

    const invalidTxHashInvalidSigner =
      '8pRdygzR8Zk9oMYmqiyzUpqJQnFmaAnMLniexycNLavr_9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c264747'
    expect(terra.isValidTransactionHash(invalidTxHashInvalidSigner)).to.be.false
  })

  it('Provides correct Transaction Hash formatting', () => {
    const txHash = '3B2555E2FFCF27E9D7E47E09762C948FAD37111BC75F5BCAE6ED14B48FDC14F4'
    expect(terra.formatTransactionHash(txHash)).to.be.equal(txHash)
  })

  it('should validate terra erc20Assets', () => {
    const sizeOfErc20Assets = Object.keys(erc20Assets).length
    expect(sizeOfErc20Assets).to.be.gt(2)
    for (let i = 0; i < sizeOfErc20Assets; i++) {
      expect(`${Object.values(erc20Assets)[i].chain}`).to.be.equal('terra')
      expect(`${Object.values(erc20Assets)[i].name}`).not.to.be.null
      expect(`${Object.values(erc20Assets)[i].decimals}`).oneOf(['0', '2', '6', '8'])
      expect(`${Object.values(erc20Assets)[i].code}`).not.to.be.null
      expect(`${Object.values(erc20Assets)[i].contractAddress}`).not.to.be.null
      expect(`${Object.values(erc20Assets)[i].type}`).to.be.equal('erc20')
    }
  })
})
