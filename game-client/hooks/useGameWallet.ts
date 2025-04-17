import { useState, useEffect } from 'react';
import { useUnisatWallet } from './useUnisatWallet';
import Web3 from 'web3';
import { ERC20_ABI } from '@/lib/contracts/abi/erc_20';
import { use } from 'matter';
import axios from 'axios';

const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MINTER;


export function useGameWallet() {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const { address, authenticated, signer } = useUnisatWallet();

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout;

    const fetchBalance = async () => {
      if (!address || !authenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Get web3 instance from wallet
        // axios request on https://open-api.unisat.io/v1/indexer/address/{address}/runes/balance-list
        // {
        //   "code": 0,
        //   "msg": "",
        //   "data": {
        //     "start": 1,
        //     "total": 1,
        //     "detail": [
        //       {
        //         "amount": "10000",
        //         "runeid": "2584327:44",
        //         "rune": "AAAAAAAAAAAAAB",
        //         "spacedRune": "AAAAA•AAA•AAAAA•B",
        //         "symbol": "G",
        //         "divisibility": 0
        //       }
        //     ]
        //   }
        // }
        const { data } = await axios.get(`https://open-api.unisat.io/v1/indexer/address/${address}/runes/balance-list`);
        console.log(data);
        if (mounted) {
          if(data.data.detail.length === 0){
            setBalance(0);
            return;
          }
          setBalance(data.data.detail[1].amount);
        }
        
      } catch (err) {
        if (mounted) {
          console.error('Error fetching token balance:', err);
          setBalance(999);
        
        }
      } finally {
        if (mounted) {
          setTimeout(() => {
            setIsLoading(false);

          }, 5000);
        }
      }
    };

    fetchBalance();
    
    // Refresh every 30 seconds
    intervalId = setInterval(fetchBalance, 30000);

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [address, authenticated]);

  return { balance, isLoading };
}
