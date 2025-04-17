import express from 'express'
import {
  Etching,
  EtchInscription,
  Rune,
  Runestone,
  Terms,
  Range,
  none,
  some,
  RuneId,
  Edict
} from 'runelib'
import { script, payments, Psbt, networks } from 'bitcoinjs-lib'
import * as bitcoin from 'bitcoinjs-lib'
import * as tinysecp from 'tiny-secp256k1'
import cors from 'cors'
import axios from 'axios'
import { ECPairFactory } from 'ecpair'
import * as ecc from 'tiny-secp256k1'
import runeManager from './routes/rune.js'
bitcoin.initEccLib(tinysecp)

export const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/v1', runeManager)
app.get('/', () => {
  console.log('working')
})

app.listen(8000, () => {
  console.log('server is running at 8000')
})
