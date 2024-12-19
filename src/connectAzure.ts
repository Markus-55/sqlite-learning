import { credential, azureConfig } from './config/config.js';
import sql from 'mssql';

export default async function connectToDatabase() {
  try {
    // Get the access token for Azure SQL
    const token = await credential.getToken(azureConfig.credentialScope);
 
    // SQL Database configuration using the imported config
    const dbConfig: sql.config = {
      server: azureConfig.server as string,
      database: azureConfig.database as string,
      options: azureConfig.options,
      authentication: {
        type: 'azure-active-directory-access-token',
        options: {
          token: token.token,
        },
      },
    };
 
    // Establish connection to SQL Database
    const pool = await sql.connect(dbConfig);
    console.log('Connected to SQL Server using MFA!');
 
    return pool; // Return the pool object to use in your controller
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

/* 
! Production Code:
import dotenv from 'dotenv';
import sql from 'mssql';

 
dotenv.config({ path: './config.env' });
const server = process.env.AZURE_SQL_SQL_1677A_SERVER.toString();
const database = process.env.AZURE_SQL_SQL_1677A_DATABASE;
const port = parseInt(process.env.AZURE_SQL_SQL_1677A_PORT);
const user = process.env.SQL_DB_ADMIN;
const password = process.env.SQL_PASSWORD;
 
export default async function connectToDatabase() {
  try {
    const dbConfig = {
      server,
      port,
      database,
      user: user,
      password: password,
    };
 
    // Establish connection to SQL Database
    console.log('Connecting to:', dbConfig);
 
    let sqlConnectionString = process.env.SQL_CONNECTION_STRING;
 
    const pool = await sql.connect(dbConfig);
 
    console.log('Got the pool');
 
    pool.connect((err) => {
      console.log(err);
    });
 
    console.log('Connected to SQL Server using MFA!');
 
    return pool; // Return the pool object to use in your controller
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

*/