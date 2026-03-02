import { test, expect } from '../fixtures';
import * as allure from 'allure-js-commons';

/**
 * Ejemplo de test que usa la fixture de Oracle DB
 * para validar datos contra la base de datos.
 */
test.describe('Database Validation Tests', () => {
    test('should connect and query the database', async ({ db }) => {
        await allure.parentSuite('Webapp App Simple');
        await allure.suite('Database');
        await allure.subSuite('Oracle');

        // Ejemplo: consultar la fecha actual del servidor Oracle
        const result = await db.query<{ CURRENT_DATE: string }>(
            'SELECT SYSDATE AS CURRENT_DATE FROM DUAL',
        );

        expect(result).toHaveLength(1);
        expect(result[0].CURRENT_DATE).toBeTruthy();
        console.log(`[DB] Fecha del servidor: ${result[0].CURRENT_DATE}`);
    });
});
