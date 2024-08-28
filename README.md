# Automated Testing with Bruno

This repository contains automated test cases that leverage the Bruno CLI for testing HTTP request methods. Follow the steps below to get started with setting up and running the tests.

## Prerequisites

- [Node.js](https://nodejs.org/) (Ensure it's installed on your system)

## Installation

First, you need to install the Bruno CLI globally:

```bash
npm install -g @usebruno/cli
```

## Running the Test Cases

The test cases are written to follow the `TestCase` interface as defined in the `main.ts` file. Before running the tests, ensure you have [ts-node](https://github.com/TypeStrong/ts-node) installed:

```bash
npm install -g ts-node
```

You can execute the `main.ts` file using the following command:

```bash
ts-node main.ts
```

## Writing Test Cases

Test cases should be written in Bruno format and stored in the `TestCases` directory. Ensure your test cases adhere to the structure expected by the Bruno CLI.

## Running Bruno

To execute the test cases with Bruno and save the results to a log file, follow these steps:

1. Change to the `TestCases` directory:

    ```bash
    cd TestCases
    ```

2. Run Bruno with an output file for logging the results:

    ```bash
    bru run --output results.json
    ```

The results of the test run will be saved in `results.json` within the `TestCases` directory.

