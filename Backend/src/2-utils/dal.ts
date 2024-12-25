// File: src/2-utils/dal.ts

import mysql2, { PoolOptions, QueryError } from "mysql2";
import { appConfig } from "./app-config";

class DAL {

    // MySQL connection options
    private options: PoolOptions = {
        host: appConfig.host, // MySQL host
        user: appConfig.user, // MySQL username
        password: appConfig.password, // MySQL password
        database: appConfig.database // MySQL database name
    };

    // MySQL connection pool for efficient database queries
    private readonly connection = mysql2.createPool(this.options);

    /**
     * Executes a SQL query with optional parameters.
     * @param sql - The SQL query string.
     * @param values - Optional array of parameterized values.
     * @returns A promise resolving with the query result or rejecting with an error.
     */
    public execute(sql: string, values?: any[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.connection.query(sql, values, (err: QueryError, result: any) => {
                if (err) {
                    reject(err); // Reject promise if query fails
                    return;
                }
                resolve(result); // Resolve promise with query result
            });
        });
    }
}

// Export a single instance of the DAL class
export const dal = new DAL();
