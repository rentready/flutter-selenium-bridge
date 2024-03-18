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
    // Set up your test environment, such as navigating to a test page
    await driver.get("https://portal.rentready.com");

    // Call the method you want to test
    await bridge.enableAccessibility(60000);

    // Use an XPath selector to locate the login button
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
});