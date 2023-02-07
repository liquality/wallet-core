declare function encrypt(value: string, key: string): Promise<{
    encrypted: string;
    keySalt: string;
}>;
declare function decrypt(encrypted: string, key: string, keySalt: string): Promise<any>;
export { encrypt, decrypt };
