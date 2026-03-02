import { test, expect } from '@playwright/test';
import { config } from '../../src/config/env.config';

test.describe('Environment Config - Unit Tests', () => {
    test('should have a valid baseURL', () => {
        expect(config.baseURL).toBeTruthy();
        expect(config.baseURL).toMatch(/^https?:\/\//);
    });

    test('should have a valid env value', () => {
        expect(config.env).toBeTruthy();
        expect(['dev', 'staging', 'production', 'test']).toContain(config.env);
    });

    test('should have db config with all required properties', () => {
        expect(config.db).toBeDefined();
        expect(config.db).toHaveProperty('host');
        expect(config.db).toHaveProperty('port');
        expect(config.db).toHaveProperty('serviceName');
        expect(config.db).toHaveProperty('user');
        expect(config.db).toHaveProperty('password');
    });

    test('should have a numeric db port', () => {
        expect(typeof config.db.port).toBe('number');
        expect(config.db.port).toBeGreaterThan(0);
        expect(config.db.port).toBeLessThanOrEqual(65535);
    });

    test('should generate a valid connectionString', () => {
        const connStr = config.db.connectionString;
        expect(connStr).toBeTruthy();
        expect(connStr).toContain(':');
        expect(connStr).toContain('/');
        // Should match pattern host:port/serviceName
        expect(connStr).toMatch(/^.+:\d+\/.+$/);
    });

    test('should have a valid excelDataPath', () => {
        expect(config.excelDataPath).toBeTruthy();
        expect(config.excelDataPath).toMatch(/\.xlsx$/);
    });
});
