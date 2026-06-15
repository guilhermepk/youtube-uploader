import { ValidationError } from "class-validator";

export function extractConstraints(errors: ValidationError[]): string[] {
  const messages: string[] = [];
  for (const err of errors) {
    if (err.constraints) {
      messages.push(...Object.values(err.constraints));
    }
    if (err.children && err.children.length > 0) {
      messages.push(...extractConstraints(err.children));
    }
  }
  return messages;
}