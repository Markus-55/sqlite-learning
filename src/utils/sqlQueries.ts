import { Database } from "sqlite3";

// Execute a query (e.g., INSERT, UPDATE, DELETE)
export async function executeQuery<T>(db: Database, sql: string, params: T[]): Promise<void> {
  try {    
    if(params && params.length > 0) {
      return new Promise((resolve, reject) => {
        db.run(sql, params, (err) => {
          if(err) reject(err);
          resolve();
        });
      });
    }

    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if(err) reject(err)
        resolve();
      });
    });
  } catch (err: any) {
    throw new Error(`execute SQL Query Error: ${err.message}`);
  }
}

// Fetch all rows for a query (e.g., SELECT)
export async function fetchAllRows(db: Database, sql: string, params?: object[]): Promise<object[]> {
  try {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err: Error, rows: object[]) => {
        if(err) reject(err);
        resolve(rows);
      });
    });
  } catch (err: any) {
    throw new Error(`fetchAll SQL Query Error: ${err.message}`);
  }
}

// Fetch single row for a query (e.g., SELECT)
export async function fetchSingleRow<T>(db: Database, sql: string, params?: string[] | number[]): Promise<T[]> {
  try {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err: Error | null, row: T[]) => {
        if(err) reject(err);
        resolve(row);
      });
    });
  } catch (err: any) {
    throw new Error(`fetchSingle SQL Query Error: ${err.message}`);
  }
}
