// routes/etch.js
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
import { Psbt } from 'bitcoinjs-lib'
import * as bitcoin from 'bitcoinjs-lib'

export const etchWithWallet = async (req, res) => {
  try {
    console.log(req.body)
    const {
      address,
      pubkey,
      utxo,
      name,
      cap,
      amount,
      symbol,
      divisibility,
      premine
    } = req.body

    // Validate essential fields
    if (
      !address ||
      !pubkey ||
      !utxo?.txid ||
      utxo.vout === undefined ||
      utxo.value === undefined ||
      !utxo.scriptPubKey
    ) {
      return res.status(400).json({
        error: 'Missing required fields (address, pubkey, or UTXO data)'
      })
    }

    if (
      !name ||
      !cap ||
      !amount ||
      !symbol ||
      divisibility === undefined ||
      !premine
    ) {
      return res.status(400).json({
        error:
          'Missing rune parameters: name, cap, amount, symbol, divisibility'
      })
    }

    const rune = Rune.fromName(name)

    const terms = new Terms(
      parseInt(amount),
      parseInt(cap),
      new Range(none(), none()),
      new Range(none(), none())
    )

    // const address2 = script_p2tr.address ?? ''
    // console.log('send coin to address', address2)

    const etching = new Etching(
      some(parseInt(divisibility)), // divisibility
      some(parseInt(premine)), // premine (fixed for now)
      some(rune),
      some(1 << 7), // spacers
      some(symbol),
      some(terms),
      true // mintable
    )

    const runestone = new Runestone([], some(etching), none(), none())
    console.log('Runestone Hex:', runestone.encipher().toString('hex'))

    const psbt = new Psbt({ network: bitcoin.networks.testnet })
    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        value: utxo.value,
        script: Buffer.from(utxo.scriptPubKey, 'hex')
      }
    })

    // Output to inscribe rune (Runestone)
    psbt.addOutput({
      script: runestone.encipher(),
      value: 0
    })

    // Output to user address (ordinals compatible)
    psbt.addOutput({
      address,
      value: 546 // dust
    })

    // Change output
    const fee = 1000
    const change = utxo.value - 546 - fee
    const changeAddress = address // or separate address

    if (change > 546) {
      psbt.addOutput({
        address: changeAddress,
        value: change
      })
    }
    console.log('PSBT Summary:', psbt, psbt.data)

    const psbtBase64 = psbt.toBase64()
    res.json({ psbt: psbtBase64 })
  } catch (err) {
    console.error(err)
    res.status(500).send({ error: err.message })
  }
}
