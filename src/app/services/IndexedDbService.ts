import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface Alarm {
  code: string;  // This will store "1", "2", etc. from your data
  message: string;
}

interface AppDB extends DBSchema {
  alarms: {
    key: string;  // The alarm code (e.g., "1", "2")
    value: Alarm; // The alarm object
  };
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbName = 'AlarmDB';
  private dbPromise: Promise<IDBPDatabase<AppDB>>;

  constructor() {
    this.dbPromise = this.initializeDB();
  }

  private async initializeDB(): Promise<IDBPDatabase<AppDB>> {
    return openDB<AppDB>(this.dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('alarms')) {
          db.createObjectStore('alarms', {
            keyPath: 'code'  // Use 'code' as the primary key
          });
        }
      },
      terminated() {
        console.warn('DB connection terminated');
      }
    });
  }

  // Save a single alarm
  async saveAlarm(code: string, message: string): Promise<void> {
    const db = await this.dbPromise;
    await db.put('alarms', { code, message });
  }

  // Save multiple alarms from your object format
  async saveAlarms(alarmData: {[code: string]: string}): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction('alarms', 'readwrite');
    
    for (const [code, message] of Object.entries(alarmData)) {
      tx.store.put({ code, message });
    }
    
    await tx.done;
  }

  async getAlarm(code: string): Promise<string | undefined> {
    const db = await this.dbPromise;
    const alarm = await db.get('alarms', code);
    console.log(alarm,"alarm");
    return alarm?.message;
  }

  async getAllAlarms(): Promise<{[code: string]: string}> {
    const db = await this.dbPromise;
    const allAlarms = await db.getAll('alarms');
    
    return allAlarms.reduce((acc, alarm) => {
      acc[alarm.code] = alarm.message;
      return acc;
    }, {} as {[code: string]: string});
  }

  async deleteAlarm(code: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('alarms', code);
  }

  async clearAlarms(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('alarms');
  }
}