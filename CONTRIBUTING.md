# Contributing to Flutter Selenium Bridge

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