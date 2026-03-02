import { type Page, type Locator } from '@playwright/test';

/**
 * Clase base para todas las Page Objects.
 * Provee métodos comunes de interacción con la página.
 */
export class BasePage {
    constructor(protected readonly page: Page) { }

    /** Navega a una URL relativa a baseURL */
    async navigate(path: string = '/'): Promise<void> {
        await this.page.goto(path);
    }

    /** Espera a que la página esté completamente cargada */
    async waitForLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /** Obtiene el título de la página */
    async getTitle(): Promise<string> {
        return this.page.title();
    }

    /** Hace click en un elemento */
    async click(locator: Locator): Promise<void> {
        await locator.click();
    }

    /** Escribe texto en un input */
    async fill(locator: Locator, text: string): Promise<void> {
        await locator.fill(text);
    }

    /** Obtiene el texto de un elemento */
    async getText(locator: Locator): Promise<string> {
        return (await locator.textContent()) || '';
    }

    /** Espera a que un elemento sea visible */
    async waitForVisible(locator: Locator, timeout: number = 10000): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout });
    }

    /** Toma un screenshot de la página */
    async screenshot(name: string): Promise<Buffer> {
        return this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
    }
}
