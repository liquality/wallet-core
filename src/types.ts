import { RootState } from './store/types';

export interface ParsedCipherText {
  ct: string;
  iv: string;
  s: string;
}

export interface Notification {
  title: string;
  message: string;
  iconUrl: string;
}

export interface WalletOptions {
  initialState?: RootState;
  crypto: {
    pbkdf2(
      password: string,
      salt: string,
      iterations: number,
      length: number,
      digest: string
    ): Promise<string>;
    encrypt(value: string, key: string): any;
    decrypt(value: any, key: string): any;
  };
  createNotification(notification: Notification);
}
