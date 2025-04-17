'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import axios from 'axios';

declare global {
  interface Window {
    unisat?: {
      requestAccounts: () => Promise<string[]>;
      getBalance: () => Promise<{ confirmed: string; unconfirmed: string }>;
      createPsbt: (opts: any) => Promise<string>;
      signPsbt: (psbtBase64: string, opts?: any) => Promise<string>;
      pushPsbt: (signedPsbt: string) => Promise<string>;
      getTransactions?: () => Promise<any[]>;
    };
  }
}

interface BlockchainContextType {
  mintTokens: (getSigner: () => Promise<any>) => Promise<string>;
  mintNFTs: (getSigner: () => Promise<any>) => Promise<string>;
  tokenURI: (tokenId: string) => Promise<string>;
  mintCustomNFT: (
    tokenId: number,
    price: number,
    getSigner: () => Promise<any>
  ) => Promise<string>;
  mintSoulboundNFT: (getSigner: () => Promise<any>) => Promise<string>;
  transferToken: (
    tokenId: string,
    to: string,
    getSigner: () => Promise<any>
  ) => Promise<string>;
  transferNft: (
    nftId: string,
    to: string,
    getSigner: () => Promise<any>
  ) => Promise<string>;
  isLoadingTokens: boolean;
  isLoadingNFTs: boolean;
  isTransferringTokens: boolean;
  isTransferringNFTs: boolean;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(
  undefined
);

export function BlockchainProvider({ children }: { children: ReactNode }) {
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const [isTransferringTokens, setIsTransferringTokens] = useState(false);
  const [isTransferringNFTs, setIsTransferringNFTs] = useState(false);

  // Helper to ensure UniSat is available
  const ensureUniSat = () => {
    if (!window.unisat) {
      throw new Error('UniSat Wallet not found');
    }
  };

  const mintTokens = useCallback(
    async (getSigner) => {
      setIsLoadingTokens(true);
      try {
        ensureUniSat();
        await getSigner(); // make sure user is connected
        const [address] = await window.unisat!.requestAccounts();
        const { data } = await axios.post('/api/mint-token', { address });
        const psbt: string = data.psbt;
        const signed = await window.unisat!.signPsbt(psbt);
        const txid = await window.unisat!.pushPsbt(signed);
        return txid;
      } finally {
        setIsLoadingTokens(false);
      }
    },
    []
  );

  const mintNFTs = useCallback(
    async (getSigner) => {
      setIsLoadingNFTs(true);
      try {
        ensureUniSat();
        await getSigner();
        const [address] = await window.unisat!.requestAccounts();
        const { data } = await axios.post('/api/mint-nft', { address });
        const psbt: string = data.psbt;
        const signed = await window.unisat!.signPsbt(psbt);
        const txid = await window.unisat!.pushPsbt(signed);
        return txid;
      } finally {
        setIsLoadingNFTs(false);
      }
    },
    []
  );

  const tokenURI = useCallback(async (tokenId: string) => {
    const { data } = await axios.get(`/api/token-uri/${tokenId}`);
    return data.uri as string;
  }, []);

  const mintCustomNFT = useCallback(
    async (tokenId, price, getSigner) => {
      setIsLoadingNFTs(true);
      try {
        ensureUniSat();
        await getSigner();
        const [address] = await window.unisat!.requestAccounts();
        const { data } = await axios.post('/api/mint-custom-nft', {
          address,
          tokenId,
          price,
        });
        const psbt: string = data.psbt;
        const signed = await window.unisat!.signPsbt(psbt);
        const txid = await window.unisat!.pushPsbt(signed);
        return txid;
      } finally {
        setIsLoadingNFTs(false);
      }
    },
    []
  );

  const mintSoulboundNFT = useCallback(
    async (getSigner) => {
      setIsLoadingNFTs(true);
      try {
        ensureUniSat();
        await getSigner();
        const [address] = await window.unisat!.requestAccounts();
        const { data } = await axios.post('/api/mint-soulbound', { address });
        const psbt: string = data.psbt;
        const signed = await window.unisat!.signPsbt(psbt);
        const txid = await window.unisat!.pushPsbt(signed);
        return txid;
      } finally {
        setIsLoadingNFTs(false);
      }
    },
    []
  );

  const transferToken = useCallback(
    async (tokenId, to, getSigner) => {
      setIsTransferringTokens(true);
      try {
        ensureUniSat();
        await getSigner();
        const [address] = await window.unisat!.requestAccounts();
        const { data } = await axios.post('/api/transfer-token', {
          address,
          to,
          tokenId,
        });
        const psbt: string = data.psbt;
        const signed = await window.unisat!.signPsbt(psbt);
        const txid = await window.unisat!.pushPsbt(signed);
        return txid;
      } finally {
        setIsTransferringTokens(false);
      }
    },
    []
  );

  const transferNft = useCallback(
    async (nftId, to, getSigner) => {
      setIsTransferringNFTs(true);
      try {
        ensureUniSat();
        await getSigner();
        const [address] = await window.unisat!.requestAccounts();
        const { data } = await axios.post('/api/transfer-nft', {
          address,
          to,
          nftId,
        });
        const psbt: string = data.psbt;
        const signed = await window.unisat!.signPsbt(psbt);
        const txid = await window.unisat!.pushPsbt(signed);
        return txid;
      } finally {
        setIsTransferringNFTs(false);
      }
    },
    []
  );

  const value: BlockchainContextType = {
    mintTokens,
    mintNFTs,
    tokenURI,
    mintCustomNFT,
    mintSoulboundNFT,
    transferToken,
    transferNft,
    isLoadingTokens,
    isLoadingNFTs,
    isTransferringTokens,
    isTransferringNFTs,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  const ctx = useContext(BlockchainContext);
  if (!ctx) {
    throw new Error('useBlockchain must be used within BlockchainProvider');
  }
  return ctx;
}
