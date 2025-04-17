```
**************************************************************************
*                                                                        *
*        d888   8888888b.  8888888888 888    88888888888     d8888       *
*       d8888   888  "Y88b 888        888        888        d88888       *
*         888   888    888 888        888        888       d88P888       *
*         888   888    888 8888888    888        888      d88P 888       *
*         888   888    888 888        888        888     d88P  888       *
*         888   888    888 888        888        888    d88P   888       *
*         888   888  .d88P 888        888        888   d8888888888       *
*       8888888 8888888P"  8888888888 88888888   888  d88P     888       *
*                                                                        *
**************************************************************************
```

# Calldata Converter

[![Update and Publish Package](https://github.com/1delta-DAO/calldata-converter/actions/workflows/update-package.yml/badge.svg)](https://github.com/1delta-DAO/calldata-converter/actions/workflows/update-package.yml)

A tool that automatically converts 1delta composer-light calldata library functions into TypeScript code, with testing and validation.

## Features

- Converts Solidity calldata encoding functions to TypeScript
- Automatically generates tests to verify correctness (uses a foundry script to generate the expected outputs)
- Packages the code as an npm library ready for publishing
- Includes GitHub Actions workflow for auto-updates

## Usage

### Prerequisites

- [Bun](https://bun.sh) runtime
- [Foundry](https://book.getfoundry.sh/getting-started/installation) for Solidity testing

### Quick Start

```bash
# converter command pattern
# bun run src/cli.ts [outputDir] [--run-tests] [--test-count <count>] [--verbose]
bun install # install dependencies
bun run start # execute the converter
bun run pack # execute the converter, update the npm package directory
bun run test # run the bun tests (requires the bun run start to be executed first to generate the tests)
```
