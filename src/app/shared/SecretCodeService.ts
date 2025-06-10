import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SecretCodeService {
  private ressecretCode: any | null = null;
  private reqsecretCode: any | null = null;

  setREQSecretCode(code: any): void {
    this.reqsecretCode = code;
  }
  setRESSecretCode(code: any): void {
    this.ressecretCode = code;
  }

  getRESSecretCode(): any | null {
    return this.ressecretCode;
  }
  getREQSecretCode(): any | null {
    return this.reqsecretCode;
  }
  clearSecretCode(): void {
    this.reqsecretCode = null;
    this.ressecretCode = null;
  }
}
