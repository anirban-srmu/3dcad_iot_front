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

public sendMessage(message: any): void {
  if (this.ws?.readyState === WebSocket.OPEN) {
    this.ws.send(message);
  } else {
    console.warn('WebSocket is not open. Cannot send message.');
  }
}

  public getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.ws?.close();
  }
}
