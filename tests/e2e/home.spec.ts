import { test, expect } from '../fixtures';
import * as allure from 'allure-js-commons';

test.describe('Home Page Tests', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
    });

    test('should display the main heading', async ({ homePage }) => {
        await allure.parentSuite('Webapp App Simple');
        await allure.suite('Home Page');
        await allure.subSuite('Visual Elements');

        const heading = await homePage.getHeadingText();
        expect(heading).toBeTruthy();
    });

    test('should have navigation links', async ({ homePage }) => {
        await allure.parentSuite('Webapp App Simple');
        await allure.suite('Home Page');
        await allure.subSuite('Navigation');

        const count = await homePage.getNavLinksCount();
        expect(count).toBeGreaterThan(0);
    });

    test('should load the page with correct title', async ({ homePage, page }) => {
        await allure.parentSuite('Webapp App Simple');
        await allure.suite('Home Page');
        await allure.subSuite('Page Load');

        const title = await homePage.getTitle();
        expect(title).toBeTruthy();
    });
});
