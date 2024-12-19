import { InteractiveBrowserCredential } from '@azure/identity';
import { config } from 'mssql';

// Export configuration values
export const azureConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  tenantId: process.env.DB_TENANT,
  credentialScope: 'https://database.windows.net/.default',
  options: {
    encrypt: true, // Mandatory for Azure SQL
    trustServerCertificate: false, // Whether to trust server certificates
  },
};

// Export InteractiveBrowserCredential instance
export const credential = new InteractiveBrowserCredential({
  tenantId: azureConfig.tenantId, // Loaded from environment variables
});