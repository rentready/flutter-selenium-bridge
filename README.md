# Flutter Selenium Bridge

## Overview
Flutter Selenium Bridge is an NPM package designed to empower developers and QA engineers with the ability to conduct comprehensive UI testing on Flutter Web applications that are compiled with the CanvasKit renderer. 

This package specifically focuses on enabling Selenium WebDriver to interact with and test the UI elements of deployed Flutter applications, which are traditionally inaccessible to automation tools due to CanvasKit's rendering approach.

While it does not aim to replace Flutter's own integration testing framework, it offers a complementary approach that is particularly useful for validating the deployed application in real-world scenarios.

## Key Features
- **Selenium WebDriver Integration:** Facilitates the integration of Selenium WebDriver, allowing for automated browser testing of Flutter Web applications.
- **CanvasKit Renderer Compatibility:** Ensures that UI elements rendered as a single canvas by the CanvasKit renderer are made accessible for Selenium-based testing.
- **Streamlined Testing Workflow:** Provides a simplified setup process, enabling developers to quickly begin writing and running Selenium tests on their Flutter applications.

## Getting Started
To get started with Flutter Selenium Bridge, follow these steps:

1. **Install the package:**
   ```sh
   npm install flutter-selenium-bridge
   ```
2. **Write your test cases:** Create a new directory called test in your project root and write your test cases using Selenium WebDriver API.
3. ***Run your tests:*** Use the following command to execute your tests:
   ```sh
   npm test
   ```

## Building the Package
Before publishing, you may want to build the package to ensure that all TypeScript files are compiled to JavaScript:

1. **Compile TypeScript to JavaScript:**
   ```sh
   npm run build
   ```
   This command will compile the TypeScript files in your src directory into JavaScript files in the dist directory.

## Publishing the Package
To publish the package to the NPM registry, follow these steps:

### 1. Log in to NPM:
   ```sh
   npm login
   ```
   Enter your NPM username, password, and email address as prompted.

### 2. Publish the package:
   ```sh
   npm publish
   ```
   This command will publish your package to the NPM registry. Make sure that the version number in your package.json is updated if you are publishing a new version.

## Ease of Adoption and Learning Curve
Flutter Selenium Bridge allows QA engineers to adopt Selenium for creating UI tests without requiring in-depth knowledge of Flutter's internals. This package simplifies the process of enabling Selenium to work with Flutter Web applications, making it accessible for teams to implement automated UI testing for their deployed applications.

## How It Works
Flutter Selenium Bridge provides the necessary tools and instructions to enable accessibility within the Flutter Web application, allowing Selenium to recognize and interact with each UI component as if they were standard HTML elements. This is achieved by addressing the challenges posed by the CanvasKit renderer and ensuring that the UI elements are testable by Selenium.

## Contributing
We welcome contributions to the Flutter Selenium Bridge project. If you have suggestions or improvements, please submit a pull request or open an issue on our [GitHub repository](https://github.com/rentready/flutter-selenium-bridge).

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.