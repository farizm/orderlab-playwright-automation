export function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required but was not provided`);
  }

  return value;
}

export function optionalEnv(name: string): string | undefined {
  const value = process.env[name];

  return value || undefined;
}
