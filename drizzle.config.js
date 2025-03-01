import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.AUTH_DRIZZLE_URL
  },
  schema: './src/drizzle/schema.js',
  out: './src/drizzle'
})
