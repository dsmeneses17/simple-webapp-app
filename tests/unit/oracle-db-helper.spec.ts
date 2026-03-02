import { test, expect } from '@playwright/test';
import { OracleDBHelper } from '../../src/utils/oracle-db.helper';

/**
 * Unit tests for OracleDBHelper.
 * These tests validate the class behavior WITHOUT a real DB connection.
 * They verify error handling and structural correctness.
 */
test.describe('OracleDBHelper - Unit Tests', () => {
    test('should create an instance', () => {
        const db = new OracleDBHelper();
        expect(db).toBeInstanceOf(OracleDBHelper);
    });

    test('query should throw error when not connected', async () => {
        const db = new OracleDBHelper();
        await expect(db.query('SELECT 1 FROM DUAL')).rejects.toThrow(
            'No hay conexión activa',
        );
    });

    test('execute should throw error when not connected', async () => {
        const db = new OracleDBHelper();
        await expect(db.execute('INSERT INTO test VALUES (1)')).rejects.toThrow(
            'No hay conexión activa',
        );
    });

    test('close should not throw when not connected', async () => {
        const db = new OracleDBHelper();
        // close() on a non-connected instance should be safe (no-op)
        await expect(db.close()).resolves.not.toThrow();
    });

    test('should have the expected public API', () => {
        const db = new OracleDBHelper();
        expect(typeof db.connect).toBe('function');
        expect(typeof db.query).toBe('function');
        expect(typeof db.execute).toBe('function');
        expect(typeof db.close).toBe('function');
    });
});
