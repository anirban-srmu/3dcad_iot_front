import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NonceService {
  private nonceSubject = new BehaviorSubject<string | null>(null);
  nonce$ = this.nonceSubject.asObservable();

  setNonce(nonce: string) {
    this.nonceSubject.next(nonce);
   // sessionStorage.setItem('nonce', nonce); // Update session storage as well
  }
}
