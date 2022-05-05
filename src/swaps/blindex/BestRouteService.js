import { blindexConfig } from './BlindexConfig'

export class BestRouteService {
  availableLinks = []

  constructor() {
    for (const pair of blindexConfig.SWAPS) {
      this.availableLinks.push({ from: pair.token0, to: pair.token1 })
      this.availableLinks.push({ from: pair.token1, to: pair.token0 })
    }
  }

  async getBestRoute(router, amount, leftTokenAddress, rightTokenAddress) {
    const allRoutes = await this.generateRoutes(leftTokenAddress, rightTokenAddress)
    const allRoutesWithAmounts = await this.getRoutesWithAmount(router, allRoutes, amount)
    const bestRoute = await this.chooseBestRoute(allRoutesWithAmounts)
    return bestRoute
  }

  async getRoutesWithAmount(router, routes, amount) {
    const routesPrices = []
    for (const route of routes) {
      const amounts = await router.getAmountsOut(amount, route)

      routesPrices.push({
        route: route,
        finalAmount: amounts[amounts.length - 1],
        amounts: amounts
      })
    }

    return routesPrices
  }

  async generateRoutes(addressIn, addressOut) {
    const midTokens = []
    const addressInLowercase = addressIn.toLowerCase()
    const addressOutLowercase = addressOut.toLowerCase()
    for (const link1 of this.availableLinks) {
      if (link1.from.toLowerCase() === addressInLowercase) {
        for (const link2 of this.availableLinks) {
          if (
            link1.to.toLowerCase() === link2.from.toLowerCase() &&
            link2.to.toLowerCase() === addressOutLowercase
          ) {
            midTokens.push(link1.to.toLowerCase())
          }
        }
      }
    }
    const routes = [...midTokens.map((x) => [addressInLowercase, x, addressOutLowercase])]
    if (
      this.availableLinks.some(
        (link) => link.from === addressInLowercase && link.to === addressOutLowercase
      )
    ) {
      routes.push([addressInLowercase, addressOutLowercase])
    }

    return routes
  }

  async chooseBestRoute(allRoutesWithAmounts) {
    const bestPath = allRoutesWithAmounts.reduce((prev, current) => {
      const selectedRouteInfo =
        prev.finalAmount.gt(current.finalAmount) ||
        (prev.finalAmount.eq(current.finalAmount) && prev.route.length < current.route.length)
          ? prev
          : current

      return selectedRouteInfo
    })

    return bestPath
  }
}
