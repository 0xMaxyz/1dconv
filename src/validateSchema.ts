import Ajv from "ajv";
import type { TestInputs } from "./types";

const testInputSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      solidityValues: {
        type: "array",
        items: { type: "string" },
      },
      typescriptValues: {
        type: "array",
        items: { type: "string" },
      },
    },
    required: ["solidityValues", "typescriptValues"],
  },
};

export function validateTestInputs(inputs: unknown): inputs is TestInputs[] {
  const ajv = new Ajv();
  const validate = ajv.compile(testInputSchema);
  return validate(inputs);
}
