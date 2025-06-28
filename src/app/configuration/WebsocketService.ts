import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Config } from './env.config';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  private connections: Map<string, WebSocket> = new Map();
  private messageSubjects: Map<string, Subject<string>> = new Map();
  private responseSubjects: Map<string, Subject<string>> = new Map();
  private reconnectIntervals: Map<string, any> = new Map();
  private reconnectDelay = 5000; // in milliseconds
  websocketBaseUrl: any = Config.websocketBaseUrl;

  constructor() {}

  private connect(connectionId: string, path: string): void {
    const fullUrl = `${this.websocketBaseUrl}${path}`;
    
    // Close existing connection if it exists
    this.closeConnection(connectionId);

    const ws = new WebSocket(fullUrl);
    this.connections.set(connectionId, ws);

    // Initialize subjects if they don't exist
    if (!this.messageSubjects.has(connectionId)) {
      this.messageSubjects.set(connectionId, new Subject<string>());
      this.responseSubjects.set(connectionId, new Subject<string>());
    }

    ws.onmessage = (event) => {
      const data = event.data;
      this.messageSubjects.get(connectionId)?.next(data);
      this.responseSubjects.get(connectionId)?.next(data);
    };

    ws.onerror = (event) => {
      console.error(`WebSocket error (${connectionId}):`, event);
    };

    ws.onclose = () => {
      console.warn(`WebSocket closed (${connectionId}). Reconnecting in ${this.reconnectDelay / 1000}s...`);
      this.clearReconnectTimer(connectionId);
      const timer = setTimeout(() => this.connect(connectionId, path), this.reconnectDelay);
      this.reconnectIntervals.set(connectionId, timer);
    };
  }

  public initConnection(path: string): void {
    const connectionId = path; // or generate a unique ID if needed
    this.connect(connectionId, path);
  }

  public sendMessage(connectionId: string, message: string): Observable<string> {
    return new Observable(observer => {
      const ws = this.connections.get(connectionId);
      
      if (ws && ws.readyState === WebSocket.OPEN) {
        const sub = this.responseSubjects.get(connectionId)?.subscribe({
          next: (response) => {
            observer.next(response);
            sub?.unsubscribe();
            observer.complete();
          },
          error: (err) => observer.error(err)
        });
        
        ws.send(message);
      } else {
        observer.error(`WebSocket connection ${connectionId} is not open.`);
      }
    });
  }

  public closeConnection(connectionId: string): void {
    this.clearReconnectTimer(connectionId);
    
    const ws = this.connections.get(connectionId);
    if (ws) {
      ws.onclose = null; // Prevent automatic reconnection
      ws.close();
      this.connections.delete(connectionId);
    }
    
    // Complete and clean up subjects
    this.messageSubjects.get(connectionId)?.complete();
    this.responseSubjects.get(connectionId)?.complete();
    this.messageSubjects.delete(connectionId);
    this.responseSubjects.delete(connectionId);
  }

  public getMessages(connectionId: string): Observable<string> {
    if (!this.messageSubjects.has(connectionId)) {
      this.messageSubjects.set(connectionId, new Subject<string>());
    }
    return this.messageSubjects.get(connectionId)!.asObservable();
  }

  private clearReconnectTimer(connectionId: string): void {
    const timer = this.reconnectIntervals.get(connectionId);
    if (timer) {
      clearTimeout(timer);
      this.reconnectIntervals.delete(connectionId);
    }
  }

  ngOnDestroy(): void {
    // Close all connections and clean up
    Array.from(this.connections.keys()).forEach(id => this.closeConnection(id));
    this.connections.clear();
    this.messageSubjects.clear();
    this.responseSubjects.clear();
    this.reconnectIntervals.clear();
  }
}