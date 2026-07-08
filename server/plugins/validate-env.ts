import { assertProductionSecrets, validateEnv } from '../utils/env'

export default defineNitroPlugin(() => {
  const env = validateEnv()
  assertProductionSecrets(env)
})
