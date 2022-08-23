declare module 'bitcoin-address-validation' {
  export function validate(address: string, network?: string): boolean;
  export = validate;
}
