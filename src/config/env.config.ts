import dotenv from 'dotenv';

// Load environment variables silently
dotenv.config({ debug: false });

export const config = {
    /** URL base de la aplicación bajo test */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    /** Entorno actual */
    env: process.env.ENV || 'dev',

    /** Configuración de Oracle DB */
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 1521,
        serviceName: process.env.DB_SERVICE_NAME || 'XEPDB1',
        user: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || '',
        get connectionString() {
            return `${this.host}:${this.port}/${this.serviceName}`;
        },
    },

    /** Ruta del archivo Excel de datos de prueba */
    excelDataPath: process.env.EXCEL_DATA_PATH || './src/data/test-data.xlsx',
};
