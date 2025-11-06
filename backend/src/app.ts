import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import routes from './routes'
import { errorHandler } from './middlewares/errorHandler'
import { notFoundHandler } from './middlewares/notFoundHandler'
import { config } from './config'

const app = express()

app.set('trust proxy', 1)

app.use(helmet())
// Avoid credentials with wildcard origin ('*') which browsers block
app.use(cors({ origin: config.corsOrigins, credentials: Array.isArray(config.corsOrigins) }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 })
app.use(limiter)

app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'))

app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }))

app.use('/api', routes)

app.use(notFoundHandler)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => errorHandler(err, req, res, next))

export { app }


