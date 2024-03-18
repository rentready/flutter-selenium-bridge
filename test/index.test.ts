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

    test('should make the App Main Screen be found with enableAccessibility', async () => {
        // Arrange
        await driver.get("http://127.0.0.1:8000");

        // Act
        await bridge.enableAccessibility(60000);

        // Assert
        const labelXPath = '//flt-semantics[contains(@aria-label, "App Main Screen")]';
        let label = await driver.wait(until.elementLocated(By.xpath(labelXPath)), 30000);

        expect(label).toBeDefined();
    });

    test('should make the "Click Me" button clickable with enableAccessibility and display "You clicked me" message', async () => {
        // Arrange
        await driver.get("http://127.0.0.1:8000");

        // Act
        await bridge.enableAccessibility(60000);

        // Assert
        const clickMeButtonXPath = '//flt-semantics[contains(@aria-label, "Click Me")]';
        let clickMeButton = await driver.wait(until.elementLocated(By.xpath(clickMeButtonXPath)), 30000);

        clickMeButton.click();

        const clickedMeLabelXPath = '//flt-semantics[contains(@aria-label, "You clicked me")]';
        let clickedMeLabel = await driver.wait(until.elementLocated(By.xpath(clickedMeLabelXPath)), 30000);

        expect(clickedMeLabel).toBeDefined();
    });

    test('should activate Flutter text input for value setting"', async () => {
        // Arrange
        await driver.get("http://127.0.0.1:8000");
        await bridge.enableAccessibility(60000);

        const labelXPath = '//flt-semantics[contains(@aria-label, "App Main Screen")]';
        await driver.wait(until.elementLocated(By.xpath(labelXPath)), 30000);

        const nameInputXPath = '//flt-semantics[@id="flt-semantic-node-5"]/input';

        // Act
        let nameInput = await bridge.activateInputField(By.xpath(nameInputXPath), 30000);

        // Assert
        // Verify that the input field can receive text input by sending keys
        await nameInput.sendKeys("Daniel");

        // Further assert that the name was properly set by clicking "Say Hi" button

        const sayHiButtonXPath = '//flt-semantics[contains(@aria-label, "Say Hi")]';
        let sayHiButton = await driver.wait(until.elementLocated(By.xpath(sayHiButtonXPath)), 30000);

        sayHiButton.click();

        // and checking for presence of "Hello, Daniel" message
        const helloLabelXPath = '//flt-semantics[contains(@aria-label, "Hello, Daniel")]';
        const helloLabel = await driver.wait(until.elementLocated(By.xpath(helloLabelXPath)), 30000);

        expect(helloLabel).toBeDefined();
    });
});