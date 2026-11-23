import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node', include: ['src/tests/**/*.test.ts'], coverage: { provider: 'v8', reporter: ['text','html','json-summary'], include: ['src/services/**/*.ts','src/controllers/**/*.ts','src/repositories/**/*.ts','src/app.ts'], thresholds: { lines: 60, statements: 60, functions: 60, branches: 60 } } } });
