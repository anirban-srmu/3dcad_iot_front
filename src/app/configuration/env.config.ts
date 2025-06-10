import { EnvConfig } from "./config.service";

export const Config: EnvConfig = { 
    BaseEndpoint: 'http://192.168.2.44:8000/api/',
    websocketBaseUrl: 'ws://localhost:8000/ws/',
  production: true ,
  enableConsoleLogs: false, // Disable logs in production

};
