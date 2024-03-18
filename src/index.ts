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

    public async fillField(selector: string, value: string): Promise<void> {
        // Mimic focus on a field
        const mimicFocusOnAnInput = `
            const selector = arguments[0];
            const value = arguments[1];
            const semanticNode = document.querySelector(selector);
            if (semanticNode) {
                const textInput = semanticNode.querySelector('input');
                if (textInput) {
                // Dispatch a focus event manually
                const focusEvent = new FocusEvent('focus', {
                    bubbles: false, // Focus events do not bubble
                    cancelable: true
                });
                textInput.dispatchEvent(focusEvent);
                }
            }
            `;

        // Execute the script to dispatch the focus event
        await this.driver.executeScript(mimicFocusOnAnInput, selector, value);

        // Introduce a delay
        await this.driver.sleep(100); // Adjust the delay as needed

        // Define a script to set the value and dispatch input and change events
        const setValueScript = `
            const selector = arguments[0];
            const value = arguments[1];
            const semanticNode = document.querySelector(selector);
            if (semanticNode) {
                const textInput = semanticNode.querySelector('input');
                if (textInput) {
                // Set the value of the input element
                textInput.value = value;

                // Dispatch input event to ensure any bindings are updated
                const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                textInput.dispatchEvent(inputEvent);

                // Optionally, dispatch a change event if needed
                const changeEvent = new Event('change', { bubbles: true });
                textInput.dispatchEvent(changeEvent);
                }
            }
            `;

        // Execute the script to set the value and dispatch events
        await this.driver.executeScript(setValueScript, selector, value);
    }

    public async clickElement(selector: string): Promise<void> {
        // Execute the script to click the element
        const script = `
            const selector = arguments[0];
            const element = document.querySelector(selector);
            if (element) {
                element.click();
            } else {
                throw new Error('Element with selector ' + selector + ' not found.');
            }
            `;
        await this.driver.executeScript(script, selector);
    }

    public async waitForTextToBePresent(expectedText: string, timeout: number): Promise<void> {
        let isTextPresent = false;
        const startTime = Date.now();
        const regex = new RegExp(expectedText.split(' ').join('[\\s\\S]*'), 'i'); // Create a regex that ignores whitespace and line breaks

        // Polling for the presence of text within the specified timeout
        while (!isTextPresent && (Date.now() - startTime) < timeout) {
            const pageSource = await this.driver.getPageSource();
            if (regex.test(pageSource)) {
                isTextPresent = true;
            } else {
                await this.driver.sleep(1000); // Wait for 1 second before checking again
            }
        }

        if (!isTextPresent) {
            throw new Error(`Text "${expectedText}" not found within ${timeout} milliseconds.`);
        }
    }
}

export default FlutterSeleniumBridge;