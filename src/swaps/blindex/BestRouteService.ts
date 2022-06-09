import { blindexConfig } from './BlindexConfig'
import * as ethers from 'ethers'

export class BestRouteService {
  availableLinks: { from:string, to:string }[] = []

  constructor() {
    for (const pair of blindexConfig.SWAPS) {
      this.availableLinks.push({ from: pair.token0, to: pair.token1 });
      this.availableLinks.push({ from: pair.token1, to: pair.token0 });
    }
  }

  public async getBestRoute(router: any, amount: ethers.BigNumber, leftTokenAddress: string, rightTokenAddress: string) {
    const allRoutes = await this.generateRoutes(leftTokenAddress, rightTokenAddress);
    const allRoutesWithAmounts = await this.getRoutesWithAmount(router, allRoutes, amount);
    const bestRoute = await this.chooseBestRoute(allRoutesWithAmounts);
    return bestRoute;
  }

  private async getRoutesWithAmount(router: any, routes: string[][], amount: ethers.BigNumber) {
    const routesPrices = [];
    for (const route of routes) {
      const amounts = await router.getAmountsOut(amount, route);

      routesPrices.push({
        route: route,
        finalAmount: amounts[amounts.length - 1],
        amounts: amounts
      });
    }

    return routesPrices;
  }

  private async generateRoutes(addressIn: string, addressOut: string) {
    const midTokens = [];
    const addressInLowercase = addressIn.toLowerCase();
    const addressOutLowercase = addressOut.toLowerCase();
    for (const link1 of this.availableLinks) {
      if (link1.from.toLowerCase() === addressInLowercase) {
        for (const link2 of this.availableLinks) {
          if (
            link1.to.toLowerCase() === link2.from.toLowerCase() &&
            link2.to.toLowerCase() === addressOutLowercase
          ) {
            midTokens.push(link1.to.toLowerCase());
          }
        }
      }
    }
    const routes = [...midTokens.map((x) => [addressInLowercase, x, addressOutLowercase])];
    if (this.availableLinks.some((link) => link.from.toLowerCase() === addressInLowercase && link.to.toLowerCase() === addressOutLowercase)) {
      routes.push([addressInLowercase, addressOutLowercase]);
    }

    return routes;
  }

  private async chooseBestRoute(allRoutesWithAmounts: { route: string[]; finalAmount: ethers.BigNumber; amounts: ethers.BigNumber[] }[]) {
    const bestPath = allRoutesWithAmounts.reduce((prev, current) => {
      const selectedRouteInfo =
        prev.finalAmount.gt(current.finalAmount) ||
        (prev.finalAmount.eq(current.finalAmount) && prev.route.length < current.route.length)
          ? prev
          : current;

      return selectedRouteInfo;
    });

    return bestPath;
  }
}
