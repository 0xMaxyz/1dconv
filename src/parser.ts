import * as fs from "fs";
import type {
  ParsedSolidity,
  SolidityFunction,
  SolidityEnum,
  SolidityConstant,
  SolidityStruct,
  StructField,
  FunctionDef,
  Parameter,
} from "./types";
import * as path from "path";
import { convertToTS } from "./conv";

export function parseEnums(content: string): SolidityEnum[] {
  const enumRegex = /enum\s+(\w+)\s*{([^}]*)}/g;
  const enums: SolidityEnum[] = [];
  let match;

  while ((match = enumRegex.exec(content)) !== null) {
    const [_, name, values] = match;
    if (name && values) {
      const parsedValues = values
        .split(",")
        .map((value) => value.trim())
        .filter((value) => value && !value.startsWith("//"))
        .map((value) => ({ name: value }));

      enums.push({ name, values: parsedValues });
    }
  }

  return enums;
}

function parseStructs(content: string): SolidityStruct[] {
  const structRegex = /struct\s+(\w+)\s*{([^}]*)}/g;
  const structs: SolidityStruct[] = [];
  let match;
  while ((match = structRegex.exec(content)) !== null) {
    const [_, name, fields] = match;
    if (name && fields) {
      const parsedFields: StructField[] = fields
        .split("\n")
        .map((field) => field.trim())
        .filter((field) => field && !field.startsWith("//"))
        .map((field) => {
          const parts = field.split(" ").filter((p) => p);
          if (parts.length === 2) {
            const [type, name] = parts;
            if (!type || !name) {
              throw new Error(`Invalid struct field format: ${field}`);
            }
            return { type, name };
          }
          throw new Error(`Invalid struct field format: ${field}`);
        });

      structs.push({ name, fields: parsedFields });
    }
  }

  return structs;
}

function parseConstants(content: string): SolidityConstant[] {
  const constantRegex = /(\w+)\s+constant\s+(\w+)\s*=\s*([^;]+);/g;
  const constants: SolidityConstant[] = [];
  let match;
  while ((match = constantRegex.exec(content)) !== null) {
    const [_, type, name, value] = match;
    if (type && name && value) {
      constants.push({ type, name, value: value.trim() });
    }
  }
  return constants;
}

/**
 * Parses all functions from Solidity code
 * @param solidityCode - Complete Solidity code as a string
 * @returns An array of FunctionDef objects
 */
export function parseFunctions(solidityCode: string): FunctionDef[] {
  const functions: FunctionDef[] = [];

  // Match function definitions with their bodies
  // This regex accounts for nested braces within the function body
  const functionRegex =
    /function\s+(\w+)\s*\(([^)]*)\)\s*(internal|external|public|private)?\s*(pure|view|payable)?\s*(?:returns\s*\(([^)]*)\))?\s*{([^{}]*(?:{[^{}]*(?:{[^{}]*}[^{}]*)*}[^{}]*)*)}/g;

  let match;
  while ((match = functionRegex.exec(solidityCode)) !== null) {
    const [_, name, paramsStr, _visibility, _mutability, returnTypeStr, body] =
      match;

    // Parse parameters
    const params: Parameter[] = paramsStr!
      .split(",")
      .filter((param) => param.trim())
      .map((param) => {
        const paramParts = param.trim().split(/\s+/);

        // Handle complex types with spaces (like "bytes memory")
        if (paramParts.length > 2) {
          const paramName = paramParts.pop() || "";
          const paramType = paramParts.join(" ");
          return { type: paramType, name: paramName };
        } else if (paramParts.length === 2) {
          const [type, name] = paramParts;
          return { type, name } as Parameter;
        }

        throw new Error(`Invalid parameter format: ${param}`);
      });

    // Extract return type (removing "memory" if present)
    let returnType = returnTypeStr ? returnTypeStr.trim() : "";
    if (returnType.includes(" ")) {
      returnType = returnType.split(/\s+/)[0]; // Take just the type, not modifiers like "memory"
    }

    // Clean up the body (remove all whitespace including newlines, spaces, and tabs)
    const cleanBody = body
      .replace(/\/\/.*$/gm, "") // Remove comments
      .replace(/\s+/g, "") // Remove all whitespace (spaces, tabs, newlines)
      .trim();

    functions.push({
      name,
      params,
      returnType,
      body: cleanBody,
    });
  }

  return functions;
}

function parseLibraries(content: string): string[] {
  const libraryRegex = /library\s+(\w+)\s*{([^}]*)}/g;
  const libraries: string[] = [];
  let match;
  while ((match = libraryRegex.exec(content)) !== null) {
    if (match[1]) {
      libraries.push(match[0]);
    }
  }
  return libraries;
}

function parseImports(content: string): string[] {
  const importRegex = /import\s+["'](.+?)["'];/g;
  const imports: string[] = [];

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    if (match[1]) {
      imports.push(match[1]);
    }
  }

  return imports;
}
/**
 * Parses a Solidity file and returns its components.
 * @param content - The Solidity code to parse.
 * @returns Parsed Solidity components including functions, enums, constants, and structs.
 */
export function parseSolidity(
  content: string,
  debug: boolean = false
): ParsedSolidity {
  // Parse structs
  const structs = parseStructs(content);

  // Parse enums
  const enums = parseEnums(content);

  // Parse constants
  const constants = parseConstants(content);

  // Parse functions
  const functions = parseFunctions(content);

  // Parse imports
  const imports = parseImports(content);

  // Parse libraries
  const libraries = parseLibraries(content);

  return {
    functions,
    enums,
    constants,
    structs,
    imports,
    libraries,
  };
}

function combineContent(
  filePath: string,
  processedFiles: Set<string> = new Set(),
  debug: boolean = false
): string {
  if (processedFiles.has(filePath)) {
    return ""; // Skip if already processed to avoid circular imports
  }
  processedFiles.add(filePath);

  // Read the current file content
  let content = fs.readFileSync(filePath, "utf8");
  const imports = parseImports(content);

  // Process all imports recursively
  if (imports) {
    for (const importPath of imports) {
      const resolvedPath = path.resolve(
        path.dirname(filePath),
        path.basename(importPath)
      );
      // Recursively get the content of this import and its imports
      const importedContent = combineContent(
        resolvedPath,
        processedFiles,
        debug
      );
      // Append the imported content
      content += "\n" + importedContent;
    }
  }

  // Remove import statements from this content
  return content.replace(/import\s+["'](.+?)["'];/g, "");
}

export function processImports(
  filePath: string,
  outputDir: string,
  debug: boolean = false
): void {
  // Combine to one file
  const combinedContent = combineContent(filePath, new Set(), debug);

  // Convert the combined content to TypeScript
  const tsCode = convertToTS(combinedContent);

  // Save the combined TypeScript file
  const outputFileName = path.basename(filePath, ".sol") + ".ts";
  const outputPath = path.join(outputDir, outputFileName);
  fs.writeFileSync(outputPath, tsCode);
}
