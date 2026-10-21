# Minera Testing Documentation

## Overview

This project now includes a comprehensive unit testing framework to ensure stability and reliability, especially after updating multiple dependencies.

## Testing Framework

The project uses [Jest](https://jestjs.io/) as the testing framework, which provides:
- Fast and reliable test execution
- Built-in assertions and mocking capabilities
- Simple configuration and setup
- Excellent error reporting

## Running Tests

### Via npm
```bash
npm test
```

### Via Grunt
```bash
grunt test
```

The `grunt test` command will:
1. Run JSHint linting on the JavaScript code
2. Execute all Jest unit tests

## Test Structure

Tests are located in the `test/` directory:
- `test/minera.test.js` - Unit tests for core Minera functions

## What's Tested

The current test suite covers core utility functions from `assets/js/minera.js`:

### convertHashrate()
- Handles zero/null/undefined inputs correctly
- Converts hash rates to appropriate units (Kh/s, Mh/s, Gh/s, Th/s, Ph/s)
- Handles both numeric and string inputs
- Formats output correctly with 2 decimal places

### convertMS()
- Converts milliseconds to time objects with days, hours, minutes, seconds
- Handles zero input
- Correctly processes complex time periods

### getExaColor()
- Returns correct hex color codes for predefined color names
- Handles unknown/null inputs with default color

### changeDonationWorth() logic
- Tests the donation calculation algorithm
- Verifies period formatting (minutes vs hours)
- Handles zero donation time correctly

### loadScript()
- Basic validation of function parameters

## Test Coverage

The tests focus on the most critical utility functions that:
- Handle mathematical calculations (hash rate conversions, time calculations)
- Process user inputs and data formatting
- Are used throughout the application

## Benefits for Stability

Adding these tests provides several benefits:
1. **Regression Prevention**: Changes to core functions will be caught immediately
2. **Dependency Safety**: With 300+ files changed in the bower update, tests ensure core functionality still works
3. **Development Confidence**: Developers can refactor knowing tests will catch breaking changes
4. **Documentation**: Tests serve as living documentation of expected behavior

## Future Test Additions

Consider adding tests for:
- AJAX request handlers
- DOM manipulation functions
- Mining configuration validation
- Network status monitoring
- Error handling scenarios

## Integration with CI/CD

The test suite is designed to integrate easily with continuous integration systems:
- Returns proper exit codes (0 for success, non-zero for failure)
- Provides clear output for debugging
- Fast execution (typically under 1 second)