import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputPath = resolve(__dirname, '../types/openapi.generated.d.ts')

const spec =
  process.env.OPENAPI_SPEC_URL ??
  resolve(__dirname, '../../node-fastify-starter/openapi/openapi.json')

mkdirSync(dirname(outputPath), { recursive: true })

execFileSync(
  'pnpm',
  ['exec', 'openapi-typescript', spec, '-o', outputPath],
  { stdio: 'inherit' },
)

console.log(`OpenAPI types written to ${outputPath}`)
