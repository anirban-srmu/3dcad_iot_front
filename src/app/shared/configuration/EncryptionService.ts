import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private key = '1234567890123456'; // Same key used for encryption on the backend

  /**
   * Encrypts a plaintext string using AES encryption in ECB mode with PKCS#7 padding.
   * @param plaintext The text to encrypt.
   * @returns The encrypted text, Base64-encoded.
   */
  encrypt(plaintext: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        plaintext,
        CryptoJS.enc.Utf8.parse(this.key),
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      return encrypted.toString(); // Return Base64-encoded ciphertext
    } catch (error) {
      console.error('Error encrypting data:', error);
      return plaintext; // Return original if encryption fails
    }
  }

  /**
   * Decrypts a Base64-encoded ciphertext string using AES decryption in ECB mode with PKCS#7 padding.
   * @param encryptedText The Base64-encoded ciphertext.
   * @returns The decrypted plaintext string.
   */
  decrypt(encryptedText: string): string {
    try {
      const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedText); // Decode Base64
      const decrypted = CryptoJS.AES.decrypt(
        encryptedBytes.toString(CryptoJS.enc.Base64), // Pass as a Base64 string
        CryptoJS.enc.Utf8.parse(this.key),
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      return decrypted.toString(CryptoJS.enc.Utf8); // Convert decrypted bytes to a readable string
    } catch (error) {
      console.error('Error decrypting data:', error);
      return encryptedText; // Return original if decryption fails
    }
  }
}
