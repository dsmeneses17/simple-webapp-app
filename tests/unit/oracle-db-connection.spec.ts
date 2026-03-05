import { test, expect } from '@playwright/test';
import { OracleDBHelper } from '../../src/utils/oracle-db.helper';
import { config } from '../../src/config/env.config';

/**
 * Unit tests for OracleDBHelper Database Connection.
 * These tests verify that the database is actually running and accessible.
 * Useful for CI to confirm the database is deployed correctly.d
 */
test.describe.configure({ retries: 2 });

test.describe('Database Connection Tests', () => {
    let db: OracleDBHelper;

    test.beforeEach(async () => {
        db = new OracleDBHelper();
    });

    test.afterEach(async () => {
        await db.close();
    });

    test('should connect to Oracle Database', async () => {
        // This test verifies the database is running and credentials are correct
        await expect(db.connect()).resolves.not.toThrow();
    });

    test('should execute a simple query on database', async () => {
        await db.connect();

        // Execute a simple query to get the database version
        const result = await db.query<{ BANNER: string }>(
            "SELECT * FROM v$version WHERE BANNER LIKE 'Oracle%' AND ROWNUM = 1"
        );

        expect(result).toHaveLength(1);
        expect(result[0].BANNER).toContain('Oracle');
        console.log(`[PASS] Oracle Version: ${result[0].BANNER}`);
    });

    test('should get current date from database', async () => {
        await db.connect();

        const result = await db.query<{ CURRENT_DATE: string }>(
            'SELECT TRUNC(SYSDATE) AS CURRENT_DATE FROM DUAL'
        );

        expect(result).toHaveLength(1);
        expect(result[0].CURRENT_DATE).toBeTruthy();
        console.log(`[PASS] Database Date: ${result[0].CURRENT_DATE}`);
    });

    test('should verify connection string is properly configured', () => {
        const expectedHost = config.db.host;
        const expectedPort = config.db.port;
        const expectedService = config.db.serviceName;
        const expectedUser = config.db.user;

        expect(expectedHost).toBeTruthy();
        expect(expectedPort).toBe(1521);
        expect(expectedService).toBeTruthy();
        expect(expectedUser).toBeTruthy();

        console.log(`[PASS] Connection String: ${config.db.connectionString}`);
        console.log(`[PASS] User: ${expectedUser}`);
    });

    test('should connect and disconnect without errors', async () => {
        // Test the full lifecycle: connect -> query -> close
        await db.connect();
        const result = await db.query('SELECT 1 AS TEST_NUM FROM DUAL');
        expect(result).toHaveLength(1);
        expect(result[0].TEST_NUM).toBe(1);
        await db.close();
    });

    test('should handle multiple queries in sequence', async () => {
        await db.connect();

        // Query 1
        const result1 = await db.query<{ NUM: number }>(
            'SELECT 1 AS NUM FROM DUAL'
        );
        expect(result1[0].NUM).toBe(1);

        // Query 2
        const result2 = await db.query<{ NUM: number }>(
            'SELECT 2 AS NUM FROM DUAL'
        );
        expect(result2[0].NUM).toBe(2);

        // Query 3
        const result3 = await db.query<{ NUM: number }>(
            'SELECT 3 AS NUM FROM DUAL'
        );
        expect(result3[0].NUM).toBe(3);

        console.log('[PASS] All sequential queries executed successfully');
    });

    test('should verify database is accessible with configured credentials', async () => {
        // This test confirms that the credentials in .env match the database
        await db.connect();

        const result = await db.query<{ USERNAME: string }>(
            "SELECT USER AS USERNAME FROM DUAL"
        );

        expect(result).toHaveLength(1);
        expect(result[0].USERNAME).toBeTruthy();
        console.log(`[PASS] Connected as user: ${result[0].USERNAME}`);
    });
});
