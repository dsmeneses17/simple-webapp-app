import oracledb from 'oracledb';
import { config } from '../config/env.config';

/**
 * Utilidad para conectar y ejecutar queries contra Oracle Database.
 */
export class OracleDBHelper {
    private connection: oracledb.Connection | null = null;

    /** Abre una conexión a Oracle DB */
    async connect(): Promise<void> {
        this.connection = await oracledb.getConnection({
            user: config.db.user,
            password: config.db.password,
            connectionString: config.db.connectionString,
        });
        console.log('[OracleDBHelper] Conexión establecida');
    }

    /** Ejecuta una consulta SQL y retorna los resultados */
    async query<T = any>(sql: string, params: oracledb.BindParameters = {}): Promise<T[]> {
        if (!this.connection) {
            throw new Error('No hay conexión activa. Llama a connect() primero.');
        }
        const result = await this.connection.execute(sql, params, {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
        });
        return (result.rows as T[]) || [];
    }

    /** Ejecuta un INSERT/UPDATE/DELETE y hace commit */
    async execute(sql: string, params: oracledb.BindParameters = {}): Promise<oracledb.Result<unknown>> {
        if (!this.connection) {
            throw new Error('No hay conexión activa. Llama a connect() primero.');
        }
        const result = await this.connection.execute(sql, params, { autoCommit: true });
        return result;
    }

    /** Cierra la conexión */
    async close(): Promise<void> {
        if (this.connection) {
            await this.connection.close();
            this.connection = null;
            console.log('[OracleDBHelper] Conexión cerrada');
        }
    }
}
