import { useState, useCallback, useEffect } from 'react';

declare global {
  interface Window {
    unisat?: any;
  }
}

export function useUnisatWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Unisat is installed
  useEffect(() => {
    if (typeof window !== 'undefined' && window.unisat) {
      setReady(true);
    } else {
      setError('Unisat Wallet not found');
    }
  }, []);

  // Attempt auto-connect on mount (optional)
  useEffect(() => {
    const autoConnect = async () => {
      if (window.unisat) {
        try {
          const accounts = await window.unisat.getAccounts();
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
            setAuthenticated(true);
            fetchWalletData(accounts[0]);
          }
        } catch {
          // silently fail on auto-connect
        }
      }
    };
    autoConnect();
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const accounts = await window.unisat.requestAccounts();
      setAddress(accounts[0]);
      setAuthenticated(true);
      fetchWalletData(accounts[0]);
    } catch (err: any) {
      setError('Failed to connect Unisat Wallet');
      setAuthenticated(false);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const logout = useCallback(() => {
    // Unisat does not support disconnecting via API, so we reset the state manually
    setAddress(null);
    setAuthenticated(false);
    setBalance(BigInt(0));
    setTransactions([]);
  }, []);

  const fetchWalletData = useCallback(async (addr: string) => {
    setLoading(true);
    try {
      const balanceInSats = await window.unisat.getBalance(); // returns { confirmed: string, unconfirmed: string }
      setBalance(BigInt(balanceInSats.confirmed)); // assuming you want just confirmed balance
      // If Unisat supports transaction history:
      if (typeof window.unisat.getTransactions === 'function') {
        const txs = await window.unisat.getTransactions();
        setTransactions(txs);
      }
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  }, []);

  const getSigner = useCallback(async () => {
    if (!window.unisat) throw new Error('Unisat not found');
    if (!authenticated || !address) throw new Error('Wallet not connected');

    return {
      signPsbt: async (psbtBase64: string) => {
        const signed = await window.unisat.signPsbt(psbtBase64);
        return signed;
      },
      signMessage: async (message: string) => {
        const signed = await window.unisat.signMessage(message);
        return signed;
      },
    };
  }, [authenticated, address]);

  return {
    address,
    connect,
    logout,
    authenticated,
    isConnecting,
    loading,
    error,
    ready,
    balance,
    transactions,
    signer: getSigner,
  };
}
