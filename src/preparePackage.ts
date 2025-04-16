import * as fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { PACKAGE_DIR, PACKAGE_SRC_DIR, OUTPUT_DIR, LIB_NAME } from "./consts";

if (!fs.existsSync(PACKAGE_SRC_DIR)) {
  fs.mkdirSync(PACKAGE_SRC_DIR, { recursive: true });
}

const indexContent = `export * from './${LIB_NAME}';\nexport * from './utils';`;
fs.writeFileSync(path.join(PACKAGE_SRC_DIR, "index.ts"), indexContent);

const utilsPath = path.resolve("./src/utils.ts");
if (fs.existsSync(utilsPath)) {
  fs.copyFileSync(utilsPath, path.join(PACKAGE_SRC_DIR, "utils.ts"));
  console.log("Successfully copied utils.ts to package directory");
} else {
  console.error("Error: utils.ts not found in src directory.");
  process.exit(1);
}

const calldataLibPath = path.join(OUTPUT_DIR, `${LIB_NAME}.ts`);
if (fs.existsSync(calldataLibPath)) {
  let content = fs.readFileSync(calldataLibPath, "utf8");
  // Update the import path for utils.ts
  content = content.replace(/from "..\/..\/src\/utils.ts"/, 'from "./utils"');

  // Write the modified file
  fs.writeFileSync(
    path.join(PACKAGE_SRC_DIR, "CalldataLib.ts"),
    "// @ts-nocheck\n" + content
  );
  console.log(
    "Successfully copied and processed CalldataLib.ts to package directory"
  );

  // Build the package
  console.log("Building package...");
  execSync("npm run build", { cwd: PACKAGE_DIR, stdio: "inherit" });

  console.log("Package is ready to be published!");
} else {
  console.error("Error: CalldataLib.ts not found. Run the converter first.");
  process.exit(1);
}
