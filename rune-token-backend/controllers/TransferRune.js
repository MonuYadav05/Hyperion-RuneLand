import { Runestone, none, some, RuneId, Edict } from 'runelib'
import { payments, Psbt, networks } from 'bitcoinjs-lib'
import * as bitcoin from 'bitcoinjs-lib'
import * as tinysecp from 'tiny-secp256k1'
bitcoin.initEccLib(tinysecp)

export const transferRune = async (req, res) => {
  try {
    const {
      utxos,
      pubkey, // full 33-byte hex pubkey
      runeId, // { block: number, tx: number }
      receiverAddress,
      changeAddress,
      changeOrdAddress
    } = req.body

    // const runeId = new RuneId(runeIdData.blockHeight, runeIdData.index)
    const xOnlyPubkey = Buffer.from(pubkey, 'hex').slice(1)
    const network = networks.testnet
    const psbt = new Psbt({ network })
    const p2tr = payments.p2tr({ pubkey: xOnlyPubkey, network })

    console.log('Address:', p2tr.address)
    console.log(utxos)
    for (let i = 0; i < utxos.length; i++) {
      const utxo = utxos[i]
      console.log(utxo.satoshis)
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: Buffer.from(utxo.scriptPk, 'hex'),
          value: utxo.satoshis
        }
      })
    }

    // Rune transfer
    const edict = new Edict(new RuneId(runeId.block, runeId.tx), 100n, 1)

    const edicts = [edict]
    const runestone = new Runestone(edicts, none(), none(), some(2)) // change rune at output 2

    // Outputs
    psbt.addOutput({
      script: runestone.encipher(),
      value: 0
    })

    // 1st rune receiver
    psbt.addOutput({
      address: changeOrdAddress, // output index 1
      value: 546
    })

    // 2nd rune change
    psbt.addOutput({
      address: receiverAddress, // output index 2
      value: 546
    })

    const totalInput = utxos.reduce((sum, utxo) => sum + utxo.satoshis, 0)
    const fee = 1000
    const change = totalInput - fee - 546 * 2

    if (change < 0) throw new Error('Not enough balance to cover fee')

    psbt.addOutput({
      address: changeAddress,
      value: change
    })

    res.json({ psbt: psbt.toBase64() })
  } catch (err) {
    console.error('Transfer Rune Error:', err)
    res.status(500).json({ error: err.message })
  }
}
