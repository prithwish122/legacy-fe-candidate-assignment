import { Router } from 'express'
import { verifySignatureController } from '../controllers/verifyController'

const router = Router()

router.post('/verify-signature', verifySignatureController)

export default router


