import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Config } from './env.config';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  [x: string]: any;
  private ws: WebSocket | null = null;
  private messageSubject = new Subject<string>();
  private reconnectInterval = 5000; // in milliseconds
  private currentPath: string = '';
  websocketBaseUrl: any = Config.websocketBaseUrl;
  constructor() {}

  private connect(fullUrl: string): void {
    this.ws = new WebSocket(fullUrl);

    this.ws.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.ws.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    this.ws.onclose = () => {
      console.warn(`WebSocket closed. Reconnecting to ${fullUrl} in ${this.reconnectInterval / 1000}s...`);
      setTimeout(() => this.connect(fullUrl), this.reconnectInterval);
    };
  }

  /**
   * Initializes the WebSocket connection with the given path.
   * Example: service.initConnection('plc-status')
   */
  public initConnection(path: string): void {
    this.currentPath = path;
    const fullUrl = `${this.websocketBaseUrl}${path}`;
    this.connect(fullUrl);
  }

 public sendMessage(message: string): Observable<string> {
    return new Observable((observer: { next: (arg0: any) => void; complete: () => void; error: (arg0: string) => void; }) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(message);

        // Listen for the next message as the response
        const responseSub = this.messageSubject.subscribe({
          next: (data: any) => {
            observer.next(data);
            responseSub.unsubscribe();
            observer.complete();
          },
          error: (err: string) => observer.error(err)
        });
      } else {
        observer.error('WebSocket connection is not open.');
      }
    });
  }


  public getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.ws?.close();
  }
}
