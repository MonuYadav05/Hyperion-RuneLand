'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FC } from 'react';
import { motion } from 'framer-motion';
import { useUnisatWallet } from "@/hooks/useUnisatWallet";
import { useState } from 'react';
import dayjs from 'dayjs';



interface EtchRecord {
  runeId: string;
  txid: string;
  timestamp: number;
}

const Hero: FC = () => {
  const { connect: login, authenticated, logout } = useUnisatWallet();
  const router = useRouter();
  const [startEtching, setStartEtching] = useState(false);
  const [etches, setEtches] = useState<EtchRecord[]>([]);
  const [name,setName] = useState('');
  const [cap,setCap] = useState('');
  const [amount,setAmount] = useState('');
  const [symbol,setSymbol] = useState('');
  const [divisiblity,setDivisiblity] = useState('');
  const [isEtching, setIsEtching] = useState(false);
  
  const handleEtch = () => {
    setIsEtching(true);

  };

  const handleEtchingToken = () => {
    setStartEtching(true);
  };



  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1510]/50 to-[#1a1510]" />
      
      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <div className="space-y-8">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4a373] via-[#ccd5ae] to-[#e9edc9]">
              Hyperion RuneLand
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl text-[#ccd5ae] max-w-2xl mx-auto leading-relaxed"
          >
            Chainless Conquests: Where NFTs Battle Across Realms, Rarity Reigns, and Legends are SoulBound.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            {!authenticated ? (
              <Button
                onClick={login}
                className="bg-gradient-to-r from-[#d4a373] to-[#ccd5ae] text-[#1a1510] px-8 py-3 rounded-lg hover:opacity-90 transition-all hover:scale-105"
              >
                Connect Wallet
              </Button>
            ) : (
              <Button
                onClick={handleEtchingToken}
                className="bg-gradient-to-r from-[#d4a373] to-[#ccd5ae] text-[#1a1510] px-8 py-3 rounded-lg hover:opacity-90 transition-all hover:scale-105"
              >
                Start Etching Token 
              </Button>
            )}
            
            <Button
              variant="outline"
              className="border-[#d4a373] text-[#d4a373] hover:bg-[#d4a373]/10"
              onClick={() => window.open('https://docs.blockgame.com', '_blank')}
            >
              Learn More
            </Button>
          </motion.div>

          {startEtching && (
  <div className="mt-16 px-4">
    {/* Etching Form */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="max-w-4xl mx-auto bg-[#2a221b] p-8 rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-3xl font-bold text-[#e9edc9] text-center">
        🪄 Etch Your Rune Token
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <input
          type="text"
          placeholder="Token Name"
          onChange={(e) => setName(e.target.value)}
          className="bg-[#1a1510] text-[#e9edc9] border border-[#d4a373] px-4 py-2 rounded-md placeholder:text-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
        />
        <input
          type="text"
          placeholder="Supply Cap"
          onChange={(e) => setCap(e.target.value)}
          className="bg-[#1a1510] text-[#e9edc9] border border-[#d4a373] px-4 py-2 rounded-md placeholder:text-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
        />
        <input
          type="text"
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
          className="bg-[#1a1510] text-[#e9edc9] border border-[#d4a373] px-4 py-2 rounded-md placeholder:text-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
        />
        <input
          type="text"
          placeholder="Symbol"
          onChange={(e) => setSymbol(e.target.value)}
          className="bg-[#1a1510] text-[#e9edc9] border border-[#d4a373] px-4 py-2 rounded-md placeholder:text-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
        />
        <input
          type="text"
          placeholder="Divisibility"
          onChange={(e) => setDivisiblity(e.target.value)}
          className="bg-[#1a1510] text-[#e9edc9] border border-[#d4a373] px-4 py-2 rounded-md placeholder:text-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
        />
      </div>

      <div className="text-center pt-4">
        {isEtching ? (
          <Button
            variant="outline"
            className="border-[#d4a373] text-[#d4a373] hover:bg-[#d4a373]/10 px-6 py-2"
            disabled
          >
            Etching...
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleEtch}
            className="border-[#d4a373] text-[#d4a373] hover:bg-[#d4a373]/10 px-6 py-2"
          >
            Etch Token
          </Button>
        )}
      </div>
    </motion.div>

    {/* Etched Token Cards */}
    <section className="max-w-5xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {etches.map((e) => (
        <motion.div
          key={e.txid}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#2a221b] rounded-2xl p-6 shadow-md border border-[#d4a373]/30"
        >
          <h3 className="text-lg font-bold text-[#e9edc9] mb-1">
            🧿 Rune ID:
          </h3>
          <p className="text-sm text-[#fefae0] font-mono mb-3 break-words">{e.runeId}</p>

          <p className="text-sm text-[#ccd5ae] mb-3">
            ⏱️ Etched on{' '}
            <time dateTime={new Date(e.timestamp).toISOString()}>
              {dayjs(e.timestamp).format('MMMM D, YYYY h:mm A')}
            </time>
          </p>

          <p className="text-xs text-[#999] font-mono mb-4 break-all">
            {e.txid}
          </p>

          <a
            href={`https://mempool.space/testnet/tx/${e.txid}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-[#d4a373] text-[#1a1510] px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
          >
            View on Explorer
          </a>
        </motion.div>
      ))}

      {etches.length === 0 && (
        <p className="col-span-full text-center text-[#ccd5ae]">
          No etches yet — be the first!
        </p>
      )}
    </section>
  </div>
)}

        </div>
      </motion.div>

    </section>
  );
};

export default Hero;