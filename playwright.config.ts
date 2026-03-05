import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

export default defineConfig({
    // Directorio de tests
    testDir: './tests',

    // Ejecución en paralelo
    fullyParallel: true,

    // Fallar el build si hay test.only en CI
    forbidOnly: !!process.env.CI,

    // Reintentos: 2 en CI, 0 en local
    retries: process.env.CI ? 2 : 0,

    // Workers: 1 en CI, automático en local
    workers: process.env.CI ? 1 : undefined,

    // Reporter: Allure + lista en consola (quiet mode)
    reporter: [
        ['list', { printSteps: true }],
        ['allure-playwright', { outputFolder: 'allure-results' }],
    ],

    // Configuración compartida para todos los tests
    use: {
        // URL base de la aplicación
        baseURL: process.env.BASE_URL || 'http://localhost:3000',

        // Capturar traza en primer reintento
        trace: 'on-first-retry',

        // Capturar screenshot al fallar
        screenshot: 'only-on-failure',

        // Capturar video en primer reintento
        video: 'on-first-retry',
    },

    // Proyectos (navegadores)
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],

    // Auto-start the web server before E2E tests
    webServer: {
        command: 'npx tsx src/server/app.ts',
        port: 3000,
        reuseExistingServer: true,
        timeout: 10_000,
    },
});
