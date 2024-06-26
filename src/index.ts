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

        const tagName = await element.getTagName();
    
        // If the element is a flt-semantics, find the first child input
        if (tagName.toLowerCase() === 'flt-semantics') {
            const inputChildren = await element.findElements(By.css('input, textarea'));
            if (inputChildren.length === 0) {
                throw new Error(`No input or textarea element found as a child of flt-semantics.`);
            }
            element = inputChildren[0]; // Assuming we want the first input or textarea child    
        } else if (tagName.toLowerCase() !== 'input' && tagName.toLowerCase() !== 'textarea') {
            throw new Error(`The located element is neither an input, a textarea, nor a flt-semantics element.`);
        }
        
        if ((await element.getTagName()).toLowerCase() === 'input') {
            const mimicFocus = `
                const textInput = arguments[0];
                // Dispatch a focus event manually
                const focusEvent = new FocusEvent('focus', {
                    bubbles: false, // Focus events do not bubble
                    cancelable: true
                });
                textInput.dispatchEvent(focusEvent);
            `;
    
            await this.driver.executeScript(mimicFocus, element);
        }
    
        // Introduce a delay
        await this.driver.sleep(500);
        
        return element;
    }
}

export default FlutterSeleniumBridge;