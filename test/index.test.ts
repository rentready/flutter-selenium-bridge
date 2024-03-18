import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { FlutterSeleniumBridge } from '../src/index';
import chrome from 'selenium-webdriver/chrome';

describe('FlutterSeleniumBridge', () => {
    let driver: WebDriver;
    let bridge: FlutterSeleniumBridge;

    beforeAll(async () => {
        const options = new chrome.Options();
        // Check if running in CI environment
        if (process.env.CI) {
            options.addArguments('--headless'); // Run in headless mode in CI
        }
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        bridge = new FlutterSeleniumBridge(driver);
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('should make the login button be found with enableAccessibility', async () => {
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

    test('should make the login button clickable with enableAccessibility and display required messages', async () => {
        // Arrange
        await driver.get("https://portal.rentready.com");

        // Act
        await bridge.enableAccessibility(60000);

        // Assert
        const loginButtonXPath = '//flt-semantics[contains(@aria-label, "Login")]';
        let loginButton = await driver.wait(until.elementLocated(By.xpath(loginButtonXPath)), 30000);

        loginButton.click();

        let emailRequiredElement;
        let passwordRequiredElement;
        try {
            const passwordRequiredTextXPath = '//flt-semantics[contains(@aria-label, "Email Required")]';
            passwordRequiredElement = await driver.wait(until.elementLocated(By.xpath(passwordRequiredTextXPath)), 30000);
            const emailRequiredTextXPath = '//flt-semantics[contains(@aria-label, "Password Required")]';
            emailRequiredElement = await driver.wait(until.elementLocated(By.xpath(emailRequiredTextXPath)), 30000);
        } catch (error) {
            // If the element is not found, the error will be caught here
        }

        // Assert that the "Password Required" text is found
        expect(emailRequiredElement).toBeDefined();
        expect(passwordRequiredElement).toBeDefined();
    });

    test('should activate Flutter email input for value setting"', async () => {
        // Arrange
        await driver.get("https://portal.rentready.com");
        await bridge.enableAccessibility(60000);

        const emailInputXPath = '//flt-semantics[@id="flt-semantic-node-7"]/input';

        // Act
        let emailInput = await bridge.activateInputField(By.xpath(emailInputXPath), 30000);

        // Assert
        // Verify that the input field can receive text input by sending keys
        emailInput.sendKeys("netleon@ya.ru");

        // Further assert that the email was properly set by attempting to proceed with login
        // and checking for the absence of "Email Required" and presence of "Password Required" messages

        const loginButtonXPath = '//flt-semantics[contains(@aria-label, "Login")]';
        let loginButton = await driver.wait(until.elementLocated(By.xpath(loginButtonXPath)), 30000);
        loginButton.click();

        let emailRequiredElement;
        let passwordRequiredElement;
        try {
            const passwordRequiredTextXPath = '//flt-semantics[contains(@aria-label, "Password Required")]';
            passwordRequiredElement = await driver.wait(until.elementLocated(By.xpath(passwordRequiredTextXPath)), 30000);
            const emailRequiredTextXPath = '//flt-semantics[contains(@aria-label, "Email Required")]';
            emailRequiredElement = await driver.wait(until.elementLocated(By.xpath(emailRequiredTextXPath)), 3000);
        } catch (error) {
            // If an element is not found, the error will be caught here
        }

        expect(emailRequiredElement).not.toBeDefined();
        expect(passwordRequiredElement).toBeDefined();
    });
});