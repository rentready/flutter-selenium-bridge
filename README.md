# Flutter Selenium Bridge

## Overview
Flutter Selenium Bridge is an NPM package designed to empower developers and QA engineers with the ability to conduct comprehensive UI testing on Flutter Web applications that are compiled with the CanvasKit renderer. 

This package specifically focuses on enabling Selenium WebDriver to interact with and test the UI elements of deployed Flutter applications, which are traditionally inaccessible to automation tools due to CanvasKit's rendering approach.

While it does not aim to replace Flutter's own integration testing framework, it offers a complementary approach that is particularly useful for validating the deployed application in real-world scenarios.

## Key Features
- **Selenium WebDriver Integration:** Facilitates the integration of Selenium WebDriver, allowing for automated browser testing of Flutter Web applications.
- **CanvasKit Renderer Compatibility:** Ensures that UI elements rendered as a single canvas by the CanvasKit renderer are made accessible for Selenium-based testing.
- **Streamlined Testing Workflow:** Provides a simplified setup process, enabling developers to quickly begin writing and running Selenium tests on their Flutter applications.

## Installation
To install Flutter Selenium Bridge, run the following command:

1. **Install the package:**
   ```sh
   npm install flutter-selenium-bridge --save-dev
   ```

## Usage
After installation, you can import FlutterSeleniumBridge in your test files and use it to interact with your Flutter Web application:

   ```javascript

   const { FlutterSeleniumBridge } = require('flutter-selenium-bridge');
   // Or, if using ES6 imports
   import { FlutterSeleniumBridge } from 'flutter-selenium-bridge';

   // Your test code here
   ```

### Enabling Accessibility
To interact with UI components rendered by Flutter's CanvasKit renderer, you need to enable accessibility first. This allows Selenium to recognize and interact with the components as if they were standard HTML elements.

```javascript
const { Builder } = require('selenium-webdriver');
const { FlutterSeleniumBridge } = require('flutter-selenium-bridge');

(async () => {

  const driver = await new Builder()
    .forBrowser('chrome')
    .build();

  const bridge = new FlutterSeleniumBridge(driver);
  await driver.get('http://127.0.0.1:8000'); // Replace with your Flutter Web app URL
  await bridge.enableAccessibility();
})();
```

### Activating Input Fields
If you need to set values in input fields within your Flutter Web application, use the activateInputField method before. This method ensures that the input field is ready to receive text input.

```javascript


(async () => {
  // ... (after initializing driver and bridge, and navigating to your web app)
  const nameInputXPath = '//flt-semantics[@id="flt-semantic-node-5"]/input';
  const nameInput = await bridge.activateInputField(By.xpath(nameInputXPath));
  await nameInput.sendKeys('Your Name');
})();
```

### Interacting with Elements
Once accessibility is enabled, you can interact with elements on the page using standard Selenium methods.

```javascript
(async () => {
  // ... (after enabling accessibility)
  const buttonXPath = '//flt-semantics[contains(@aria-label, "Click Me")]';
  const clickMeButton = await driver.findElement(By.xpath(buttonXPath));
  await clickMeButton.click();

  // Verify that the expected response appears
  const responseXPath = '//flt-semantics[contains(@aria-label, "You clicked me")]';
  const responseLabel = await driver.findElement(By.xpath(responseXPath));
  // ... (assertions or further interactions)
})();
```

Remember to replace the XPath selectors with those that match the elements in your specific Flutter Web application.

## Ease of Adoption and Learning Curve
Flutter Selenium Bridge allows QA engineers to adopt Selenium for creating UI tests without requiring in-depth knowledge of Flutter's internals. This package simplifies the process of enabling Selenium to work with Flutter Web applications, making it accessible for teams to implement automated UI testing for their deployed applications.

## How It Works
Flutter Selenium Bridge provides the necessary tools and instructions to enable accessibility within the Flutter Web application, allowing Selenium to recognize and interact with each UI component as if they were standard HTML elements. This is achieved by addressing the challenges posed by the CanvasKit renderer and ensuring that the UI elements are testable by Selenium.

## Contributing
We welcome contributions to the Flutter Selenium Bridge project. If you have suggestions or improvements, please submit a pull request or open an issue on our [GitHub repository](https://github.com/rentready/flutter-selenium-bridge).

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.