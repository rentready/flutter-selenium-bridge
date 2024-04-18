import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
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

    beforeEach(async () => {
        const port = '8080';
        await driver.get(`http://127.0.0.1:${port}`);
    });

    test('should make the App Main Screen be found with enableAccessibility', async () => {
        // Arrange
        // Act
        await bridge.enableAccessibility(60000);

        // Assert
        const labelXPath = '//flt-semantics[contains(@aria-label, "App Main Screen")]';
        let label = await driver.wait(until.elementLocated(By.xpath(labelXPath)), 30000);

        expect(label).toBeDefined();
    });

    test('should make the "Click Me" button clickable with enableAccessibility and display "You clicked me" message', async () => {
        // Arrange
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

    test('should throw an error if element is neither input nor flt-semantics', async () => {
        // Arrange
        await bridge.enableAccessibility(60000);
    
        // This XPath should locate an element that is neither an input nor a flt-semantics
        const nonInputXPath = '//flt-glass-pane';
    
        // Act and Assert
        await expect(bridge.activateInputField(By.xpath(nonInputXPath), 1000))
            .rejects
            .toThrow('The located element is neither an input nor a flt-semantics element.');
    });

    test('should throw an error if no input element found', async () => {
        // Arrange
        await bridge.enableAccessibility(60000);
    
        // This XPath should locate an element that is neither an input nor a flt-semantics
        const nonInputXPath = '//flt-semantics[contains(@aria-label, "Click Me")]'; // A button "Click Me"
    
        // Act and Assert
        await expect(bridge.activateInputField(By.xpath(nonInputXPath), 5000))
            .rejects
            .toThrow('No input element found as a child of flt-semantics.');
    });

    test('should activate direct input for value setting', async () => {
        // Arrange
        await bridge.enableAccessibility(60000);

        const labelXPath = '//flt-semantics[contains(@aria-label, "App Main Screen")]';
        await driver.wait(until.elementLocated(By.xpath(labelXPath)), 30000);

        const nameInputXPath = '//input[contains(@aria-label, "Your name")]';

        // Act
        let nameInput = await bridge.activateInputField(By.xpath(nameInputXPath), 30000);

        // Assert
        await assertThatInputActivated(nameInput, "Say Hi");
    });

    test('should activate input within flt-semantics for value setting', async () => {
        // Arrange
        await bridge.enableAccessibility(60000);

        const nameInputXPath = '//flt-semantics[@id="flt-semantic-node-5"]';

        // Act
        let nameInput = await bridge.activateInputField(By.xpath(nameInputXPath), 30000);

        // Assert
        await assertThatInputActivated(nameInput, "Say Hi");
    });

    test('should activate input within flt-semantics and which has other elements for value setting', async () => {
        // Arrange
        await bridge.enableAccessibility(60000);

        const passwordInputXPath = '//input[contains(@aria-label, "Password")]';

        // Act
        let passwordInput = await bridge.activateInputField(By.xpath(passwordInputXPath), 30000);

        // Assert
        await assertThatInputActivated(passwordInput, "Say Password");
    });

    // To assert that a field was activated, we send text, and assert that it is visible by Flutter logic
    // That logic on button click changes the caption to contain the text "Daniel"
    async function assertThatInputActivated(inputElement: WebElement, buttonLabel: string): Promise<void> {

        // Send the specified text to the input element
        await inputElement.sendKeys("Daniel");
    
        // Find and click the "Say Hi" button
        const buttonXPath = `//flt-semantics[contains(@aria-label, "${buttonLabel}")]`;
        let buttonButton = await driver.wait(until.elementLocated(By.xpath(buttonXPath)), 30000);
        await buttonButton.click();
    
        // Check for the presence of the expected "Hello, ..." message
        const labelXPath = `//flt-semantics[contains(@aria-label, "Daniel")]`;
        const label = await driver.wait(until.elementLocated(By.xpath(labelXPath)), 30000);
    
        // Assert that the hello label is defined, indicating the input was activated and the text was set
        expect(label).toBeDefined();
    }
});