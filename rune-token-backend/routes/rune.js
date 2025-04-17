import { Router } from 'express'
import { etching } from '../controllers/EtchRuneToken.js'
import { mintRune } from '../controllers/MintRune.js'
import { transferRune } from '../controllers/TransferRune.js'

const router = Router()

router.get('/', (req, res) => {
  console.log('reef')
  res.json({
    message: 'sdsd'
  })
})

router.post('/etch-rune', etching)
router.post('/mint-rune', mintRune)
router.post('/transfer-rune', transferRune)
export default router
