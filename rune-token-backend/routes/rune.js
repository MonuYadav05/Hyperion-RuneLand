import { Router } from 'express'
import { etching } from '../controllers/EtchRuneToken.js'
import { mintRune } from '../controllers/MintRune.js'
import { transferRune } from '../controllers/TransferRune.js'
import { etchWithWallet } from '../controllers/EtchWithWallet.js'

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
router.post('/etch-psbt', etchWithWallet)
export default router
