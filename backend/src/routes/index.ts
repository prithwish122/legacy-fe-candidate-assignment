import { Router } from 'express'
import verifyRouter from './verify'

const router = Router()

router.use(verifyRouter)

export default router


