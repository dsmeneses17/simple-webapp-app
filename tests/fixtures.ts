import { test as base } from '@playwright/test';
import { HomePage } from '../src/pages/home.page';
import { OracleDBHelper } from '../src/utils/oracle-db.helper';

/**
 * Fixtures personalizados para extender los tests de Playwright.
 */
type CustomFixtures = {
    homePage: HomePage;
    db: OracleDBHelper;
};

export const test = base.extend<CustomFixtures>({
    /** Fixture: HomePage ya inicializada */
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    /** Fixture: conexión a Oracle DB (se conecta/desconecta automáticamente) */
    db: async ({ }, use) => {
        const db = new OracleDBHelper();
        await db.connect();
        await use(db);
        await db.close();
    },
});

export { expect } from '@playwright/test';
