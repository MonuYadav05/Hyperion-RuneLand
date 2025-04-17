// 'use client';

// import React, { createContext, useContext, useCallback } from 'react';
// import { usePrivy } from '@privy-io/react-auth';
// import Web3 from 'web3';
// import { CONTRACT_ABI_MINTER } from '../contracts/abi/token_minter';
// import { CONTRACT_ADDRESS_MINTER, CONTRACT_ADDRESS_NFT_MINTER, CONTRACT_ADDRESS_SOULBOUND_MINTER } from '../contracts/contract-config';
// import { CONTRACT_ABI_NFT_MINTER } from '../contracts/abi/nft_minter';
// import { CONTRACT_ABI_SOULBOUND_MINTER } from '../contracts/abi/soulbound';

// interface BlockchainContextType {
//   mintTokens: (getSigner: () => Promise<any>) => Promise<string>;
//   mintNFTs: (getSigner: () => Promise<any>) => Promise<string>;
//   tokenURI: (tokenId: string, getSigner: () => Promise<any>) => Promise<string>;
//   mintCustomNFT: (tokenId: number, price: number, getSigner: () => Promise<any>) => Promise<any>;
//   mintSoulboundNFT: (getSigner: () => Promise<any>) => Promise<any>;
//   isLoadingTokens: boolean;
//   isLoadingNFTs: boolean;
// }

// const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

// export function BlockchainProvider({ children }: { children: React.ReactNode }) {
//   const { user } = usePrivy();
//   const [isLoadingTokens, setIsLoadingTokens] = React.useState(false);
//   const [isLoadingNFTs, setIsLoadingNFTs] = React.useState(false);

//   const mintTokens = useCallback(async (getSigner: () => Promise<any>) => {
//     if (!user?.wallet?.address) {
//       throw new Error('Wallet not connected');
//     }

//     try {
//       setIsLoadingTokens(true);
//       const web3 = await getSigner();
      
//       // Create contract instance
//       const contract = new web3.eth.Contract(
//         CONTRACT_ABI_MINTER,
//         CONTRACT_ADDRESS_MINTER
//       );

//       // Estimate gas for mint
//       const gasEstimate = await contract.methods.mint(user.wallet.address, "650")
//         .estimateGas({ from: user.wallet.address });

//       // Add 20% buffer to gas estimate
//       const gasWithBuffer = BigInt(gasEstimate) + 
//         (BigInt(gasEstimate) * BigInt(20) / BigInt(100));

//       // Call mint function with 5000 tokens (with 18 decimals)
//       const tx = await contract.methods.mint(user.wallet.address, "650")
//         .send({ 
//           from: user.wallet.address,
//           gas: gasWithBuffer.toString()
//         });

//       return tx.transactionHash;
//     } catch (error) {
//       console.error('Error in mintTokens:', error);
//       throw error;
//     } finally {
//       setIsLoadingTokens(false);
//     }
//   }, [user?.wallet?.address]);

//   const mintNFTs = useCallback(async (getSigner: () => Promise<any>) => {
//     if (!user?.wallet?.address) {
//       throw new Error('Wallet not connected');
//     }

//     try {
//       setIsLoadingNFTs(true);
//       const web3 = await getSigner();
      
//       const contract = new web3.eth.Contract(
//         CONTRACT_ABI_NFT_MINTER,
//         CONTRACT_ADDRESS_NFT_MINTER
//       );
//       console.log(contract);
//       console.log(contract.methods);
//       const gasEstimate = await contract.methods.mint("5")
//         .estimateGas({ from: user.wallet.address });

//       const gasWithBuffer = BigInt(gasEstimate) + 
//         (BigInt(gasEstimate) * BigInt(20) / BigInt(100));

//       const tx = await contract.methods.mint("5")
//         .send({ 
//           from: user.wallet.address,
//           gas: gasWithBuffer.toString()
//         });

//       return tx.transactionHash;
//     } catch (error) {
//       console.error('Error in mintNFTs:', error);
//       throw error;
//     } finally {
//       setIsLoadingNFTs(false);
//     }
//   }, [user?.wallet?.address]);

//   const tokenURI = useCallback(async (tokenId: string, getSigner: () => Promise<any>): Promise<string> => {
//     if (!user?.wallet?.address) {
//       throw new Error('Wallet not connected');
//     }

//     try {
//       const web3 = await getSigner();
//       const contract = new web3.eth.Contract(
//         CONTRACT_ABI_NFT_MINTER,
//         CONTRACT_ADDRESS_NFT_MINTER
//       );

//       const uri = await contract.methods.tokenURI(tokenId).call();
//       console.log(`Token URI for ID ${tokenId}:`, uri);
//       return uri;
//     } catch (error) {
//       console.error(`Error fetching token URI for ID ${tokenId}:`, error);
//       throw error;
//     }
//   }, [user?.wallet?.address]);

//   const mintCustomNFT = useCallback(async (tokenId: number, price: number, getSigner: () => Promise<any>) => {
//     try {
//       if (!user?.wallet?.address) {
//         throw new Error("Wallet not connected");
//       }

//       const web3 = await getSigner();
//       const nftMinterContract = new web3.eth.Contract(
//         CONTRACT_ABI_NFT_MINTER,
//         CONTRACT_ADDRESS_NFT_MINTER
//       );

//       const contract = new web3.eth.Contract(
//         CONTRACT_ABI_MINTER,
//         CONTRACT_ADDRESS_MINTER
//       );

//       // Convert price to string and ensure it's a whole number
//       const priceString = Math.floor(price).toString();

//       // First burn the tokens
//       const gasEstimate = await contract.methods
//         .burn(user.wallet.address, priceString)
//         .estimateGas({ from: user.wallet.address });

//       const gasWithBuffer = BigInt(gasEstimate) +
//         (BigInt(gasEstimate) * BigInt(20) / BigInt(100));

//       await contract.methods
//         .burn(user.wallet.address, priceString)
//         .send({ 
//           from: user.wallet.address,
//           gas: gasWithBuffer.toString()
//         });

//       // Then mint the NFT
//       const tx = await nftMinterContract.methods.mintNFTfromID(tokenId).send({ 
//         from: user.wallet.address,
//       });
      
//       return tx;
//     } catch (error) {
//       console.error("Error minting NFT:", error);
//       throw error;
//     }
//   }, [user?.wallet?.address]);

//   const mintSoulboundNFT = async (signer: () => Promise<any>) => {
//     if (!user?.wallet?.address) {
//       console.error("No signer or address available");
//       return;
//     }

//     try {
//       // Replace with your soulbound contract address once added
//       const web3 = await signer();
//       const soulboundContract = new web3.eth.Contract(
//         CONTRACT_ABI_SOULBOUND_MINTER,
//         CONTRACT_ADDRESS_SOULBOUND_MINTER
//       );
//       const gasEstimate = await soulboundContract.methods
//       .mintNFT1(user.wallet.address)
//       .estimateGas({ from: user.wallet.address });

//     const gasWithBuffer = BigInt(gasEstimate) +
//       (BigInt(gasEstimate) * BigInt(20) / BigInt(100));

//       const tx = await soulboundContract.methods.mintNFT1(user.wallet.address).send({ 
//         from: user.wallet.address,
//         gas: gasWithBuffer.toString()
//       });
//       await tx.wait();

//       return tx;
//     } catch (error) {
//       console.error("Error minting soulbound NFT:", error);
//       throw error;
//     }
//   };

//   const value = {
//     mintTokens,
//     mintNFTs,
//     tokenURI,
//     mintCustomNFT,
//     mintSoulboundNFT,
//     isLoadingTokens,
//     isLoadingNFTs
//   };

//   return (
//     <BlockchainContext.Provider value={value}>
//       {children}
//     </BlockchainContext.Provider>
//   );
// }

// export function useBlockchain() {
//   const context = useContext(BlockchainContext);
//   if (context === undefined) {
//     throw new Error('useBlockchain must be used within a BlockchainProvider');
//   }
//   return context;
// }

// src/context/BlockchainProvider.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

interface Utxo {
  txid: string;
  vout: number;
  satoshis: number;
  scriptPk: string;
  confirmations: number;
}

interface RuneId {
  block: number;
  tx: number;
}

interface BlockchainContextType {
  // Bitcoin / UTXO
  getUtxos: () => Promise<Utxo[]>;
  getRuneBalance: (address: string) => Promise<any[]>;
  sendBitcoin: (to: string, amountBtc: number) => Promise<string>;
  // Runes / inscriptions
  etchRune: () => Promise<string>;
  mintRune: () => Promise<string>;
  transferRune: (runeId: RuneId, receiver: string) => Promise<string>;
  // Loading flags
  isLoadingUtxos: boolean;
  isLoadingSend: boolean;
  isLoadingEtch: boolean;
  isLoadingMint: boolean;
  isLoadingTransfer: boolean;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoadingUtxos, setIsLoadingUtxos] = useState(false);
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [isLoadingEtch, setIsLoadingEtch] = useState(false);
  const [isLoadingMint, setIsLoadingMint] = useState(false);
  const [isLoadingTransfer, setIsLoadingTransfer] = useState(false);

  // 1️⃣ Get raw UTXOs from Unisat
  const getUtxos = useCallback(async (): Promise<Utxo[]> => {
    if (!window.unisat) throw new Error('UniSat wallet not found');
    setIsLoadingUtxos(true);
    try {
      const utxos: Utxo[] = await window.unisat.getBitcoinUtxos();
      return utxos;
    } finally {
      setIsLoadingUtxos(false);
    }
  }, []);

  // 2️⃣ Fetch Runes balances via Hiro API
  const getRuneBalance = useCallback(async (address: string) => {
    const res = await axios.get(`https://api.hiro.so/runes/v1/addresses/${address}/balances`);
    return res.data.balances;
  }, []);

  // 3️⃣ Simple BTC transfer
  const sendBitcoin = useCallback(async (to: string, amountBtc: number) => {
    if (!window.unisat) throw new Error('UniSat wallet not found');
    setIsLoadingSend(true);
    try {
      // amount in BTC (e.g. 0.0001)
      const txid: string = await window.unisat.sendBitcoin(to, amountBtc);
      return txid;
    } finally {
      setIsLoadingSend(false);
    }
  }, []);

  // 4️⃣ “Etch” a new Rune via your backend PSBT endpoint
  const etchRune = useCallback(async () => {
    if (!window.unisat) throw new Error('UniSat wallet not found');
    setIsLoadingEtch(true);
    try {
      const [address] = await window.unisat.requestAccounts();
      const pubkey = await window.unisat.getPublicKey();
      const utxos = await window.unisat.getBitcoinUtxos();
      const utxo = utxos[0];

      const res = await fetch('http://localhost:8000/etch-psbt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          pubkey,
          utxo: {
            txid: utxo.txid,
            vout: utxo.vout,
            value: utxo.satoshis,
            scriptPubKey: utxo.scriptPk,
          },
        }),
      });
      const { psbt } = await res.json();
      const signed = await window.unisat.signPsbt(psbt, { autoFinalized: true });
      const txid = await window.unisat.pushPsbt(signed);
      return txid;
    } finally {
      setIsLoadingEtch(false);
    }
  }, []);

  // 5️⃣ “Mint” a Rune (after etching) via your backend
  const mintRune = useCallback(async () => {
    if (!window.unisat) throw new Error('UniSat wallet not found');
    setIsLoadingMint(true);
    try {
      const [address] = await window.unisat.requestAccounts();
      const pubkey = await window.unisat.getPublicKey();
      const utxos = await window.unisat.getBitcoinUtxos();
      const utxo = utxos[0];
      const etchTxId = 'YOUR_ETCH_TXID_HERE'; // or fetch/stash it from etchRune()

      const res = await fetch('http://localhost:8000/mint-rune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          pubkey,
          utxo: {
            txid: utxo.txid,
            vout: utxo.vout,
            value: utxo.satoshis,
            scriptPubKey: utxo.scriptPk,
          },
          etchTxId,
        }),
      });
      const { psbt } = await res.json();
      const signed = await window.unisat.signPsbt(psbt, { autoFinalized: true });
      const txid = await window.unisat.pushPsbt(signed);
      return txid;
    } finally {
      setIsLoadingMint(false);
    }
  }, []);

  // 6️⃣ Transfer an existing Rune (PSBT via backend + Unisat sign/push)
  const transferRune = useCallback(
    async (runeId: RuneId, receiver: string) => {
      if (!window.unisat) throw new Error('UniSat wallet not found');
      setIsLoadingTransfer(true);
      try {
        const utxos = await window.unisat.getBitcoinUtxos();
        const [address] = await window.unisat.requestAccounts();
        const pubkey = await window.unisat.getPublicKey();

        const res = await fetch('http://localhost:8000/transfer-rune', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            utxos,
            pubkey,
            runeId,
            receiverAddress: receiver,
            changeOrdAddress: address,
            changeAddress: address,
          }),
        });
        const { psbt } = await res.json();
        const signed = await window.unisat.signPsbt(psbt, { autoFinalized: true });
        const txid = await window.unisat.pushPsbt(signed);
        return txid;
      } finally {
        setIsLoadingTransfer(false);
      }
    },
    []
  );

  const value: BlockchainContextType = {
    getUtxos,
    getRuneBalance,
    sendBitcoin,
    etchRune,
    mintRune,
    transferRune,
    isLoadingUtxos,
    isLoadingSend,
    isLoadingEtch,
    isLoadingMint,
    isLoadingTransfer,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

export function useBlockchain(): BlockchainContextType {
  const ctx = useContext(BlockchainContext);
  if (!ctx) throw new Error('useBlockchain must be inside BlockchainProvider');
  return ctx;
}



