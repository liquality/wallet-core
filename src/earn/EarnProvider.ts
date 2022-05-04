export abstract class EarnProvider {
  /**
   * Get APY
   */
  public abstract getApy(): Promise<string>;

  /**
   * Get deposited amount
   */
  public abstract getDepositedAmount(): Promise<number>;

  /**
   * Make a deposit
   */
  public abstract deposit(amount: string): Promise<any>;

  /**
   * Make a withdraw
   */
  public abstract withdraw(amount: string): Promise<any>;
}
