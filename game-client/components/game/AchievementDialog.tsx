import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBlockchain } from '@/lib/context/BlockchainContext';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useUnisatWallet } from '@/hooks/useUnisatWallet';

interface AchievementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goldAmount: number;
  onGamePause: () => void;
  onGameResume: () => void;
}

export default function AchievementDialog({
  isOpen,
  onClose,
  goldAmount,
  onGamePause,
  onGameResume,
}: AchievementDialogProps) {
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();
  const { signer, setIsGoldTokenMinted, } = useUnisatWallet();
  const [txid, setTxid] = useState(null);
  // Pause game when dialog opens
  useEffect(() => {
    if (isOpen) {
      onGamePause();
    }
  }, [isOpen, onGamePause]);

  const handleClose = () => {
    onGameResume();
    onClose();
  };

  const handleMint = async () => {
    try {
      setIsMinting(true);
      if (!window.unisat) {
        alert('Please install Unisat wallet')
        return
      }

      const [address] = await window.unisat.requestAccounts()
      const pubkey = await window.unisat.getPublicKey()

      const utxos = await window.unisat.getBitcoinUtxos()
      const utxo = utxos[0]

      const etchTxId = 'e7779d90ce8e70ced6119a4d71fe831ef325e648d7ee7b4823f9973c13d57402'

      const res = await fetch('http://localhost:8000/api/v1/mint-rune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          pubkey,
          utxo: {
            txid: utxo.txid,
            vout: utxo.vout,
            value: utxo.satoshis,
            scriptPubKey: utxo.scriptPk
          },
          etchTxId
        })
      })

      const { psbt } = await res.json()

      const signedPsbt = await window.unisat.signPsbt(psbt, {
        autoFinalized: true
      })

      const Tokentxid = await window.unisat.pushPsbt(signedPsbt)
      setTxid(Tokentxid);
      console.log('Mint transaction broadcasted with txid:', Tokentxid)
      window.open(`https://mempool.space/testnet/tx/${Tokentxid}`, '_blank');
      toast({
        title: "Achievement Unlocked!",
        description: "Successfully minted your Rune Token!",
        variant: "default",
      });
      setIsGoldTokenMinted(true);
    } catch (error) {
      console.error("Error minting  Rune Token :", error);
      toast({
        title: "Error",
        description: "Failed to mint Rune Token. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Gold Master Achievement Unlocked! 🏆
          </DialogTitle>
          <div className="text-center mt-4 text-white">
            <p className="text-xl text-white">Congratulations!</p>
            <p className="text-lg mt-2 text-white">You've accumulated {goldAmount} gold!</p>
            <p className="text-sm mt-4 text-white">Claim your  Rune Token to commemorate this achievement.</p>
          </div>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative w-32 h-32">
            <Image
              src="/achievement-badge.png"
              alt="Achievement Badge"
              fill
              className="object-contain"
            />
          </div>
          <Button
            variant="default"
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={handleMint}
            disabled={isMinting}
          >
            {isMinting ? "Minting..." : "Claim Rune Token"}
          </Button>
        </div>
        {txid && (
          <div className="flex justify-center mt-12">
            <a
              href={`https://mempool.space/testnet/tx/${txid}`}
              target="_blank"
              rel="noreferrer"
              className="group bg-[#2a221b] border border-[#d4a373]/40 hover:border-[#d4a373] transition-all duration-300 rounded-2xl p-6 max-w-sm w-full shadow-lg cursor-pointer"
            >
              <h2 className="text-xl font-bold text-[#e9edc9] mb-2 group-hover:text-[#d4a373] transition">
                🪙 MonuYadavRune
              </h2>
              <p className="text-sm text-[#ccd5ae] mb-4">
                Click to view your token transaction on the mempool explorer.
              </p>
              <p className="font-mono text-xs text-[#999] break-all">
                {txid}
              </p>
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
