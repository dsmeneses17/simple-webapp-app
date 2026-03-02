import { test, expect } from '@playwright/test';
import { BasePage } from '../../src/pages/base.page';
import { HomePage } from '../../src/pages/home.page';

/**
 * Unit tests for Page Objects.
 * Validates class structure and inheritance without needing a browser.
 */
test.describe('Page Objects - Unit Tests', () => {
    test.describe('BasePage', () => {
        test('should have the expected public API', () => {
            // Verify the prototype methods exist
            expect(typeof BasePage.prototype.navigate).toBe('function');
            expect(typeof BasePage.prototype.waitForLoad).toBe('function');
            expect(typeof BasePage.prototype.getTitle).toBe('function');
            expect(typeof BasePage.prototype.click).toBe('function');
            expect(typeof BasePage.prototype.fill).toBe('function');
            expect(typeof BasePage.prototype.getText).toBe('function');
            expect(typeof BasePage.prototype.waitForVisible).toBe('function');
            expect(typeof BasePage.prototype.screenshot).toBe('function');
        });
    });

    test.describe('HomePage', () => {
        test('should extend BasePage', () => {
            // Verify inheritance chain
            expect(HomePage.prototype).toBeInstanceOf(BasePage);
        });

        test('should have the expected public API', () => {
            expect(typeof HomePage.prototype.goto).toBe('function');
            expect(typeof HomePage.prototype.getHeadingText).toBe('function');
            expect(typeof HomePage.prototype.search).toBe('function');
            expect(typeof HomePage.prototype.getNavLinksCount).toBe('function');
        });

        test('should inherit BasePage methods', () => {
            expect(typeof HomePage.prototype.navigate).toBe('function');
            expect(typeof HomePage.prototype.waitForLoad).toBe('function');
            expect(typeof HomePage.prototype.getTitle).toBe('function');
        });
    });
});
