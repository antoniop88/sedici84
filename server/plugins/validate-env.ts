import { validateEnv } from '../utils/env'

export default defineNitroPlugin(() => {
  validateEnv()
})
