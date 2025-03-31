export interface Parameter {
  type: string;
  name: string;
}

export interface FunctionDef {
  name: string;
  params: Parameter[];
  returnType: string;
}

export interface TestInputs {
  solidityValues: string[];
  typescriptValues: string[];
}

export interface OrchestrationConfig {
  calldataLibPath: string;
  outputDir: string;
}

export interface EnumValue {
  name: string;
  value?: string;
}

export interface EnumDef {
  name: string;
  values: EnumValue[];
}

export interface ConstantDef {
  type: string;
  name: string;
  value: string;
}
