export interface Parameter {
  type: string;
  name: string;
}

export interface FunctionDef {
  name: string;
  params: Parameter[];
  returnType: string;
  body: string;
}

export interface LibraryDef {
  name: string;
  code: string;
}

export interface TestInputs {
  functionName: string;
  solidityValues: string[];
  typescriptValues: string[];
}

export interface ConverterConfig {
  calldataLibPath: string;
  outputDir: string;
  runTests?: boolean;
  testCount?: number;
  verbose?: boolean;
}

export interface EnumValue {
  name: string;
  value?: string;
}

export interface EnumDef {
  name: string;
  values: EnumValue[];
  library?: string;
}

export interface ConstantDef {
  type: string;
  name: string;
  value: string;
  library?: string;
}

export interface StructField {
  type: string;
  name: string;
}

export interface StructDef {
  name: string;
  fields: StructField[];
}

export interface SolidityFunction extends FunctionDef {
  visibility?: "public" | "private" | "internal" | "external";
  mutability?: "view" | "pure" | "payable" | "nonpayable";
}

export interface SolidityType {
  name: string;
  isArray: boolean;
  arraySize?: number;
  isMapping: boolean;
  keyType?: string;
  valueType?: string;
}

export interface SolidityEnum extends EnumDef {}

export interface SolidityConstant extends ConstantDef {}

export interface SolidityStruct extends StructDef {}

export interface ParsedSolidity {
  functions: FunctionDef[];
  enums: SolidityEnum[];
  constants: SolidityConstant[];
  structs: SolidityStruct[];
  imports: string[];
  libraries: LibraryDef[];
}

export interface ConverterOutput {
  output: string;
  functions: FunctionDef[];
  enums: SolidityEnum[];
  constants: SolidityConstant[];
  structs: SolidityStruct[];
  imports: string[];
  libraries: LibraryDef[];
}

export interface MergedDefinitions {
  libraries: string[];
  enums: string[];
  structs: string[];
}

export interface ParsedLibrary {
  functions: FunctionDef[];
  enums: SolidityEnum[];
  structs: SolidityStruct[];
  imports: string[];
  constants: SolidityConstant[];
  libraries: LibraryDef[];
  path: string;
  name: string;
}
