import * as bitcoin from 'bitcoinjs-lib'
import { initEccLib, networks } from 'bitcoinjs-lib'
import * as ecc from 'tiny-secp256k1'
import BIP32Factory from 'bip32'
import ECPairFactory from 'ecpair'
import dotenv from 'dotenv'

dotenv.config()
initEccLib(ecc)

const ECPair = ECPairFactory(ecc)
const bip32 = BIP32Factory(ecc)

export class WIFWallet {
  constructor (walletParam) {
    if (walletParam.networkType == 'mainnet') {
      this.network = networks.bitcoin
    } else {
      this.network = networks.testnet
    }

    this.ecPair = ECPair.fromWIF(walletParam.privateKey, this.network)

    const { address, output } = bitcoin.payments.p2tr({
      internalPubkey: Buffer.from(this.ecPair.publicKey.subarray(1, 33)),
      network: this.network
    })
    this.address = address
    this.output = output
    this.publicKey = this.ecPair.publicKey.toString('hex')
  }

  signPsbt (psbt, ecPair) {
    const tweakedChildNode = ecPair.tweak(
      bitcoin.crypto.taggedHash('TapTweak', ecPair.publicKey.subarray(1, 33))
    )

    for (let i = 0; i < psbt.inputCount; i++) {
      psbt.signInput(i, tweakedChildNode)
      psbt.validateSignaturesOfInput(i, () => true)
      psbt.finalizeInput(i)
    }
    return psbt
  }
}
