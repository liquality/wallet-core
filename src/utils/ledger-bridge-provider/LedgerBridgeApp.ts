
export class LedgerBridgeApp {
  _network
  _chainId

  constructor(network, chainId) {
    this._network = network
    this._chainId = chainId
  }

  async callToBridge({ action, execMode, payload }) {
    // TODO: 
    // return callToBridge({
    //   namespace: RequestNamespace.App,
    //   network: this._network,
    //   chainId: this._chainId,
    //   action,
    //   execMode,
    //   payload
    // })
  }
}
