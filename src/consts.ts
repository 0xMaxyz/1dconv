import path from "path";

export const BASE_REPO_URL =
  "https://github.com/1delta-DAO/contracts-delegation/raw/refs/heads/composer-compact/";
export const CALLDATA_LIB_PATH = "test/light/utils/CalldataLib.sol";
export const CALLDATA_LIB_URL = `${BASE_REPO_URL}${CALLDATA_LIB_PATH}`;

export const DATA_DIR = "./data";
export const INPUT_DIR = path.join(DATA_DIR, "input");
export const OUTPUT_DIR = path.join(DATA_DIR, "output");
export const HARDCODED_FUNCTIONS = [
  "generateAmountBitmap",
  "setOverrideAmount",
  "getMorphoCollateral",
  "getMorphoLoanAsset",
];

export const LIB_NAME = path.basename(CALLDATA_LIB_PATH, ".sol");

export const COMBINED_LIB_FILE = "lib.sol";

export const TEST_INPUTS_FILE = "test-inputs.json";

export const FUNCTION_REGEX = /(\w+)\((.*)\)/;
