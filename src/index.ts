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
    
        // Check the tag name of the located element
        const tagName = await element.getTagName();
    
        // If the element is a flt-semantics, find the first child input
        if (tagName.toLowerCase() === 'flt-semantics') {
            const inputChildren = await element.findElements(By.css('input'));
            if (inputChildren.length === 0) {
                // If no input children are found under flt-semantics, fail the method
                throw new Error(`No input element found as a child of flt-semantics.`);
            }
            element = inputChildren[0]; // Assuming we want the first input child    
        } else if (tagName.toLowerCase() !== 'input') {
            // If the element is neither an input nor a flt-semantics, fail the method
            throw new Error(`The located element is neither an input nor a flt-semantics element.`);
        }
        
        // Combined script to mimic focus
        const mimicFocus = `
            const textInput = arguments[0];
            // Dispatch a focus event manually
            const focusEvent = new FocusEvent('focus', {
                bubbles: false, // Focus events do not bubble
                cancelable: true
            });
            textInput.dispatchEvent(focusEvent);
        `;

        // Execute the combined script to dispatch the focus and click events
        await this.driver.executeScript(mimicFocus, element);
    
        // Introduce a delay
        await this.driver.sleep(100);

        // Check if the parent flt-semantics element has pointer-events set to none
        // That may happen, if the Flutter input has other child elements.
        const parentElement = await element.findElement(By.xpath('parent::flt-semantics'));
        let originalPointerEventsStyle = await parentElement.getCssValue('pointer-events');
        if (originalPointerEventsStyle === 'none') {
            // Temporarily set pointer-events to all
            await this.driver.executeScript("arguments[0].style.pointerEvents='all'", parentElement);
            await this.driver.sleep(100);
        }

        // Click the input element to activate it
        await element.click();
        await this.driver.sleep(100);

        // Revert pointer-events style to its original state if it was changed
        if (originalPointerEventsStyle === 'none') {
            await this.driver.executeScript("arguments[0].style.pointerEvents='none'", parentElement);
            await this.driver.sleep(100);
        }

        // Execute the combined script to dispatch the focus and click events
        // For some cases the previous click could unfocus the input in Flutter version 3.19.5
        await this.driver.executeScript(mimicFocus, element);
    
        // Introduce a delay
        await this.driver.sleep(500);
        
        return element;
    }
}

export default FlutterSeleniumBridge;