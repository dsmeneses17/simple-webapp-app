import { test, expect } from '@playwright/test';
import { ExcelHelper } from '../../src/utils/excel.helper';
import * as path from 'path';
import * as fs from 'fs';

const TEST_EXCEL_PATH = path.resolve(__dirname, '../../src/data/test-data.xlsx');

test.describe('ExcelHelper - Unit Tests', () => {
    test.beforeAll(() => {
        // Verify test file exists before running tests
        expect(fs.existsSync(TEST_EXCEL_PATH)).toBe(true);
    });

    test.describe('readSheet', () => {
        test('should read the first sheet by default', () => {
            const data = ExcelHelper.readSheet(TEST_EXCEL_PATH);
            expect(data).toBeInstanceOf(Array);
            expect(data.length).toBeGreaterThan(0);
        });

        test('should read a specific sheet by name', () => {
            const data = ExcelHelper.readSheet(TEST_EXCEL_PATH, 'Users');
            expect(data).toBeInstanceOf(Array);
            expect(data.length).toBe(3);
        });

        test('should return objects with expected keys from Users sheet', () => {
            const data = ExcelHelper.readSheet<{ id: number; name: string; email: string; role: string }>(
                TEST_EXCEL_PATH,
                'Users',
            );

            const first = data[0];
            expect(first).toHaveProperty('id');
            expect(first).toHaveProperty('name');
            expect(first).toHaveProperty('email');
            expect(first).toHaveProperty('role');
        });

        test('should read Config sheet with key-value pairs', () => {
            const data = ExcelHelper.readSheet<{ key: string; value: string }>(
                TEST_EXCEL_PATH,
                'Config',
            );

            expect(data.length).toBe(3);
            const keys = data.map((row) => row.key);
            expect(keys).toContain('timeout');
            expect(keys).toContain('retries');
            expect(keys).toContain('env');
        });

        test('should throw error for non-existent file', () => {
            expect(() => {
                ExcelHelper.readSheet('/non/existent/file.xlsx');
            }).toThrow('Archivo Excel no encontrado');
        });

        test('should throw error for non-existent sheet name', () => {
            expect(() => {
                ExcelHelper.readSheet(TEST_EXCEL_PATH, 'NonExistentSheet');
            }).toThrow('no encontrada');
        });
    });

    test.describe('getSheetNames', () => {
        test('should return all sheet names', () => {
            const sheets = ExcelHelper.getSheetNames(TEST_EXCEL_PATH);
            expect(sheets).toBeInstanceOf(Array);
            expect(sheets.length).toBe(2);
            expect(sheets).toContain('Users');
            expect(sheets).toContain('Config');
        });
    });

    test.describe('readAllSheets', () => {
        test('should return a map of all sheets', () => {
            const allData = ExcelHelper.readAllSheets(TEST_EXCEL_PATH);
            expect(allData).toHaveProperty('Users');
            expect(allData).toHaveProperty('Config');
        });

        test('should have correct row counts per sheet', () => {
            const allData = ExcelHelper.readAllSheets(TEST_EXCEL_PATH);
            expect(allData['Users'].length).toBe(3);
            expect(allData['Config'].length).toBe(3);
        });

        test('should have correct data types in Users sheet', () => {
            const allData = ExcelHelper.readAllSheets<{ id: number; name: string }>(TEST_EXCEL_PATH);
            const users = allData['Users'];

            expect(typeof users[0].id).toBe('number');
            expect(typeof users[0].name).toBe('string');
        });
    });
});
