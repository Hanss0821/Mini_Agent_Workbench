import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root,
  test: {
    // The scaffold has no tests yet; remove this once core behavior is covered.
    passWithNoTests: true,
    projects: [
      {
        root,
        test: {
          name: 'web',
          environment: 'node',
          include: ['apps/web/src/**/*.{test,spec}.{ts,tsx}'],
        },
      },
      {
        root,
        test: {
          name: 'server',
          environment: 'node',
          include: ['apps/server/src/**/*.{test,spec}.ts'],
        },
      },
      {
        root,
        test: {
          name: 'contracts',
          environment: 'node',
          include: ['packages/contracts/src/**/*.{test,spec}.ts'],
        },
      },
    ],
  },
})
