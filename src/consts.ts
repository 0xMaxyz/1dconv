import path from "path";

export const BASE_REPO_URL =
  "https://github.com/1delta-DAO/contracts-delegation/raw/refs/heads/main/";
export const CALLDATA_LIB_PATH = "test/composer/utils/CalldataLib.sol";
export const CALLDATA_LIB_URL = `${BASE_REPO_URL}${CALLDATA_LIB_PATH}`;

export const DATA_DIR = "./data";
export const INPUT_DIR = path.join(DATA_DIR, "input");
export const OUTPUT_DIR = path.join(DATA_DIR, "output");
export const HARDCODED_FUNCTIONS = [
  "generateAmountBitmap",
  "getMorphoCollateral",
  "getMorphoLoanAsset",
];

export const LIB_NAME = path.basename(CALLDATA_LIB_PATH, ".sol");

export const TEST_INPUTS_FILE = "test-inputs.json";

export const FUNCTION_REGEX = /(\w+)\((.*)\)/;

export const PACKAGE_DIR = path.resolve("calldatalib-package");
export const PACKAGE_SRC_DIR = path.join(PACKAGE_DIR, "src");
