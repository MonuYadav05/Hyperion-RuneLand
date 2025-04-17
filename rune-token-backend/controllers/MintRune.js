import { Runestone, none, some, RuneId } from 'runelib'
import { Psbt, networks } from 'bitcoinjs-lib'
import * as bitcoin from 'bitcoinjs-lib'
import * as tinysecp from 'tiny-secp256k1'
bitcoin.initEccLib(tinysecp)
import axios from 'axios'

export const mintRune = async (req, res) => {
  try {
    const { address, pubkey, utxo, etchTxId } = req.body
    if (!address || !pubkey || !utxo || !etchTxId) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    const { blockHeight, index } = await getTxIndexInBlock(etchTxId)
    const runeId = new RuneId(blockHeight, index)
    console.log(runeId)

    const runestone = new Runestone([], none(), some(runeId), some(1))

    const psbt = new Psbt({ network: networks.testnet })

    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        value: utxo.value,
        script: Buffer.from(utxo.scriptPubKey, 'hex')
      }
    })

    // Add the OP_RETURN output with the Runestone data
    psbt.addOutput({
      script: runestone.encipher(), // Add the Runestone encoding here
      value: 0 // OP_RETURN output value (no BTC value, just data)
    })

    // Add the output to the user's address (dust amount)
    psbt.addOutput({
      address,
      value: 546 // dust amount for Bitcoin transactions
    })

    // Calculate and add the change output if applicable
    const fee = 1000 // Set a fee for the transaction

    const change = utxo.value - 546 - fee
    if (change > 0) {
      psbt.addOutput({ address, value: change })
    }

    // Return the PSBT in base64 format for signing
    res.json({ psbt: psbt.toBase64() })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

async function getTxIndexInBlock (txid) {
  try {
    // Step 1: Get transaction details
    const txDetailsRes = await axios.get(
      `https://mempool.space/testnet/api/tx/${txid}`
    )
    const { status } = txDetailsRes.data

    if (!status || !status.block_height) {
      throw new Error('Transaction not yet confirmed in a block.')
    }

    const blockHeight = status.block_height
    const blockHash = status.block_hash

    // Step 2: Get txids in that block
    const blockTxsRes = await axios.get(
      `https://mempool.space/testnet/api/block/${blockHash}/txids`
    )

    const txids = blockTxsRes.data
    const index = txids.indexOf(txid)
    if (index === -1) {
      throw new Error('Transaction not found in block.')
    }

    return {
      txid,
      blockHeight,
      index
    }
  } catch (error) {
    console.error('Error fetching tx index:', error.message)
    return null
  }
}
