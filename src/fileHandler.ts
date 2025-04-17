import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import { parseImports as pI } from "./parser";
import { BASE_REPO_URL, INPUT_DIR } from "./consts";
import { LibCache } from "./libCache";
import type { ParsedLibrary } from "./types";

export interface FileHandlerConfig {
  mainFile: string;
  baseRepoUrl?: string;
  inputDir?: string;
  verbose?: boolean;
}

async function downloadFile(
  url: string,
  outputPath: string,
  verbose: boolean
): Promise<void> {
  try {
    const response = await axios.get(url);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, response.data);
    if (verbose) {
      console.log(`✅ ${outputPath}`);
    }
  } catch (error) {
    console.error(`❌ ${url}`);
    throw error;
  }
}

function convertImportToGitUrl(
  importPath: string,
  baseRepoUrl: string
): string {
  // Remove relative path (../)
  const normalizedPath = importPath
    .replace(/^\.\.\/+/g, "")
    .replace(/\\/g, "/");
  return `${baseRepoUrl}/${normalizedPath}`;
}

async function processImports(
  filePath: string,
  baseRepoUrl: string,
  inputDir: string,
  verbose: boolean
): Promise<void> {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const parsedImports = pI(fileContent);

  const libName = path.basename(filePath);

  // Process and download imports
  for (const importPath of parsedImports) {
    const importName = path.basename(importPath);
    const gitUrl = convertImportToGitUrl(importPath, baseRepoUrl);
    const localPath = path.join(inputDir, importName);

    await downloadFile(gitUrl, localPath, verbose);

    // Recursively process imports in the downloaded file
    await processImports(localPath, baseRepoUrl, inputDir, verbose);
  }
}

export async function handleFiles(config: FileHandlerConfig): Promise<void> {
  const {
    mainFile,
    baseRepoUrl = BASE_REPO_URL,
    inputDir = INPUT_DIR,
    verbose = false,
  } = config;

  // Create input directory if it doesn't exist
  fs.mkdirSync(inputDir, { recursive: true });

  // Download the main file
  const mainFileName = path.basename(mainFile);
  const localMainPath = path.join(inputDir, mainFileName);
  await downloadFile(mainFile, localMainPath, verbose);

  // Process imports recursively
  await processImports(localMainPath, baseRepoUrl, inputDir, verbose);

  await modifyImportsAndComments(inputDir, verbose);
}

async function modifyImportsAndComments(inputDir: string, verbose: boolean) {
  const files = fs.readdirSync(inputDir);
  if (files) {
    files.forEach((file) => {
      const filePath = path.join(inputDir, file);
      if (file.endsWith(".sol")) {
        let content = fs.readFileSync(filePath, "utf-8");

        // Convert import statements to relative paths
        content = content.replace(
          /import\s+(?:{[^}]+}\s+from\s+)?["']([^"']+\/)?([^\/"']+)["'];/g,
          (match, _, fileName) => {
            const ifNamed = match.match(/import\s+({[^}]+})\s+from\s+/);
            if (ifNamed) {
              return `import ${ifNamed[1]} from "./${fileName}";`;
            }
            return `import "./${fileName}";`;
          }
        );

        // Remove block comments
        content = content.replace(/\/\*[\s\S]*?\*\//g, "");
        // Remove line comments
        content = content.replace(/\/\/.*$/gm, "");

        // Write the modified content back to the file
        fs.writeFileSync(filePath, content);
        if (verbose) {
          console.log(`✅ ${filePath}`);
        }
      }
    });
  }
}
