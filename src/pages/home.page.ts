import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object para la página Home de ejemplo.
 */
export class HomePage extends BasePage {
    // Locators
    readonly heading: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly navLinks: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.locator('h1');
        this.searchInput = page.locator('input[name="search"], input[placeholder*="search" i]');
        this.searchButton = page.locator('button[type="submit"], button:has-text("Search")');
        this.navLinks = page.locator('nav a');
    }

    /** Navega al Home */
    async goto(): Promise<void> {
        await this.navigate('/');
        await this.waitForLoad();
    }

    /** Obtiene el texto del heading principal */
    async getHeadingText(): Promise<string> {
        return this.getText(this.heading);
    }

    /** Realiza una búsqueda */
    async search(query: string): Promise<void> {
        await this.fill(this.searchInput, query);
        await this.click(this.searchButton);
        await this.waitForLoad();
    }

    /** Obtiene la cantidad de links de navegación */
    async getNavLinksCount(): Promise<number> {
        return this.navLinks.count();
    }
}
