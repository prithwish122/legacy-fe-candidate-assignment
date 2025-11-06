import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform((v) => (v ? Number(v) : 4000)).optional(),
  CORS_ORIGIN: z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment variables', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

const env = parsed.data

const corsOrigins = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',').map((s) => s.trim()) : '*'

export const config = {
  nodeEnv: env.NODE_ENV,
  port: (env.PORT as unknown as number) || 4000,
  corsOrigins,
}


