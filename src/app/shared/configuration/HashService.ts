import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class HashService {

  private secretKey: string = '12345677888'; // This should be kept secure

  constructor() {}

  /**
   * Encrypt the input text
   * @param text The text to encrypt
   * @returns The encrypted text (Base64 encoded)
   */
  encrypt(text: any): string {
    const encrypted = CryptoJS.AES.encrypt(text, this.secretKey).toString();
    return encrypted;
  }

  /**
   * Decrypt the encrypted text
   * @param encryptedText The encrypted text to decrypt
   * @returns The decrypted (original) text
   */
  decrypt(encryptedText: any): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
}
