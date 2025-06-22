import { EnvConfig } from "./config.service";

export const Config: EnvConfig = {
    BaseEndpoint: 'http://localhost:8000/api/',
    websocketBaseUrl: 'ws://localhost:8000/ws/',
  production: true ,
  enableConsoleLogs: false, // Disable logs in production

};
