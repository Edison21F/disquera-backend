// src/database/database.sql.ts
import { createPool, Pool, PoolOptions, PoolConnection } from 'mysql2/promise';

class MySQLDatabase {
  private pool: Pool;

  constructor(config: PoolOptions) {
    this.pool = createPool({
      host: config.host || 'localhost',
      port: config.port || 3306,
      user: config.user || 'root',
      password: config.password || '',
      database: config.database || 'test',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ...config
    });
  }

  public async getConnection(): Promise<PoolConnection> {
    return await this.pool.getConnection();
  }

  public async query<T = any>(sql: string, values?: any[]): Promise<T> {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.query(sql, values);
      return rows as T;
    } finally {
      connection.release();
    }
  }

  public async execute<T = any>(sql: string, values?: any[]): Promise<T> {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.execute(sql, values);
      return rows as T;
    } finally {
      connection.release();
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}

// Configuración (puedes mover esto a un archivo de configuración aparte)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'myapp_db'
};

export const db = new MySQLDatabase(dbConfig);
