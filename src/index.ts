import { By, Locator, until, WebDriver, WebElement } from 'selenium-webdriver';

export class FlutterSeleniumBridge {
    private driver: WebDriver;

    constructor(driver: WebDriver) {
        this.driver = driver;
    }

    public async enableAccessibility(timeout: number = 30000): Promise<void> {
        const glassPaneSelector = 'flt-glass-pane';
        const enableAccessibilitySelector = '[aria-label="Enable accessibility"]';
        let success = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!success && attempts < maxAttempts) {
            try {
                await this.driver.wait(until.elementLocated(By.css(glassPaneSelector)), timeout);
                const glassPane = await this.driver.findElement(By.css(glassPaneSelector));
                const shadowRoot = await this.driver.executeScript('return arguments[0].shadowRoot', glassPane) as WebElement;
                const enableAccessibilityButton = await shadowRoot.findElement(By.css(enableAccessibilitySelector));

                await this.driver.wait(until.elementIsVisible(enableAccessibilityButton), 3000);
                await this.driver.wait(until.elementIsEnabled(enableAccessibilityButton), 3000);

                await this.driver.executeScript('arguments[0].click();', enableAccessibilityButton);
                success = true;
            } catch (error) {
                console.error(error);
                console.log('Attempt to click on "EnableAccessibility" button failed. Retrying...');
                await this.driver.sleep(3000);
                attempts++;
            }
        }

        if (!success) {
            throw new Error('Unable to click on "EnableAccessibility" button after multiple attempts.');
        }
    }

    public async activateInputField(locator: Locator, timeout: number = 30000): Promise<WebElement> {
        let element = await this.driver.wait(until.elementLocated(locator), timeout);

        // Mimic focus on a field
        const mimicFocusOnAnInput = `
            const element = arguments[0];
            const textInput = element;//element.querySelector('input');
            if (textInput) {
                // Dispatch a focus event manually
                const focusEvent = new FocusEvent('focus', {
                    bubbles: false, // Focus events do not bubble
                    cancelable: true
                });
                textInput.dispatchEvent(focusEvent);
            }
        `;

        // Execute the script to dispatch the focus event
        await this.driver.executeScript(mimicFocusOnAnInput, element);

        // Introduce a delay
        await this.driver.sleep(100);

        return element;
    }
}

export default FlutterSeleniumBridge;