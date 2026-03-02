import { test, expect } from '../fixtures';
import { ExcelHelper } from '../../src/utils/excel.helper';
import { config } from '../../src/config/env.config';
import * as allure from 'allure-js-commons';

/**
 * Ejemplo de test que lee datos desde un archivo Excel
 * y los usa como datos de prueba (data-driven testing).
 */
test.describe('Excel Data-Driven Tests', () => {
    test('should read test data from Excel file', async ({ }) => {
        await allure.parentSuite('Webapp App Simple');
        await allure.suite('Data-Driven');
        await allure.subSuite('Excel');

        // Lee datos del archivo Excel
        const data = ExcelHelper.readSheet(config.excelDataPath);

        // Verifica que hay datos
        expect(data.length).toBeGreaterThan(0);
        console.log(`[Excel] Se leyeron ${data.length} filas de datos`);
        console.table(data);
    });

    test('should list all sheet names', async ({ }) => {
        await allure.parentSuite('Webapp App Simple');
        await allure.suite('Data-Driven');
        await allure.subSuite('Excel');

        const sheets = ExcelHelper.getSheetNames(config.excelDataPath);

        expect(sheets.length).toBeGreaterThan(0);
        console.log(`[Excel] Hojas encontradas: ${sheets.join(', ')}`);
    });
});
