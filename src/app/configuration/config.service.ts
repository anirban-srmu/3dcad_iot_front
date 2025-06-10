export interface EnvConfig{
    BaseEndpoint?: string,
    websocketBaseUrl?: string,
    production: boolean; // Add this line
    enableConsoleLogs:boolean;
}
