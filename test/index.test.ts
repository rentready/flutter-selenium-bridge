import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { FlutterSeleniumBridge } from '../src/index';

describe('FlutterSeleniumBridge', () => {
    let driver: WebDriver;
    let bridge: FlutterSeleniumBridge;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        bridge = new FlutterSeleniumBridge(driver);
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('enableAccessibility should enable accessibility mode', async () => {
        // Arrange
        await driver.get("https://portal.rentready.com");

        // Act
        await bridge.enableAccessibility(60000);

        // Assert
        const loginButtonXPath = '//flt-semantics[contains(@aria-label, "Login")]';
        let loginButton;
        try {
            loginButton = await driver.wait(until.elementLocated(By.xpath(loginButtonXPath)), 30000);
        } catch (error) {
            // If the element is not found, the error will be caught here
        }

        // Assert that the login button is found
        expect(loginButton).toBeDefined();
    });

    test('should click the specified element and display "Password Required"', async () => {
        // Arrange
        await driver.get("https://portal.rentready.com");
        await bridge.enableAccessibility(60000);

        const loginButtonXPath = '//flt-semantics[contains(@aria-label, "Login")]';
        let loginButton = await driver.wait(until.elementLocated(By.xpath(loginButtonXPath)), 30000);

        // Act
        loginButton.click();

        // Assert
        let passwordRequiredElement;
        try {
            const passwordRequiredTextXPath = '//flt-semantics[contains(@aria-label, "Password Required")]';
            const passwordRequiredElement = await driver.wait(until.elementLocated(By.xpath(passwordRequiredTextXPath)), 30000);
        } catch (error) {
            // If the element is not found, the error will be caught here
        }

        // Assert that the "Password Required" text is found
        expect(passwordRequiredElement).toBeDefined();
    });
});