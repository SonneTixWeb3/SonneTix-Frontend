import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, Contract, JsonRpcSigner, formatUnits } from 'ethers';
import { CONTRACTS, ABIS, NETWORK_CONFIG } from '@/config/contracts';

interface Web3ContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  account: string | null;
  chainId: number | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;

  // Contract helpers
  getContract: (contractName: keyof typeof CONTRACTS) => Contract | null;

  // Balance helpers
  getETHBalance: () => Promise<string>;
  getUSDCBalance: () => Promise<string>;

  // Error state
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask is installed
  const checkMetaMask = (): boolean => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to use this app');
      return false;
    }
    return true;
  };

  // Connect wallet
  const connect = async () => {
    if (!checkMetaMask()) return;

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();
      const signer = await provider.getSigner();

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      // Check if on correct network
      if (Number(network.chainId) !== CONTRACTS.CHAIN_ID) {
        await switchNetwork();
      }
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    setError(null);
  };

  // Switch to Base Sepolia network
  const switchNetwork = async () => {
    if (!checkMetaMask()) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORK_CONFIG],
          });
        } catch (addError: any) {
          console.error('Failed to add network:', addError);
          setError('Failed to add Base Sepolia network');
        }
      } else {
        console.error('Failed to switch network:', switchError);
        setError('Failed to switch to Base Sepolia network');
      }
    }
  };

  // Get contract instance
  const getContract = (contractName: keyof typeof CONTRACTS): Contract | null => {
    if (!signer) return null;

    const address = CONTRACTS[contractName];
    const abi = ABIS[contractName as keyof typeof ABIS];

    // Ensure address is a string (not a number like CHAIN_ID)
    if (!address || typeof address !== 'string' || !abi) return null;

    return new Contract(address, abi, signer);
  };

  // Get ETH balance
  const getETHBalance = async (): Promise<string> => {
    if (!provider || !account) return '0';

    try {
      const balance = await provider.getBalance(account);
      return formatUnits(balance, 18);
    } catch (err) {
      console.error('Failed to get ETH balance:', err);
      return '0';
    }
  };

  // Get USDC balance
  const getUSDCBalance = async (): Promise<string> => {
    if (!signer || !account) return '0';

    try {
      const usdcContract = new Contract(CONTRACTS.USDC, ABIS.ERC20, signer);
      const balance = await usdcContract.balanceOf(account);
      const decimals = await usdcContract.decimals();
      return formatUnits(balance, decimals);
    } catch (err) {
      console.error('Failed to get USDC balance:', err);
      return '0';
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainId: string) => {
      setChainId(parseInt(chainId, 16));
      window.location.reload(); // Recommended by MetaMask
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  // Check if already connected on mount
  useEffect(() => {
    if (!window.ethereum) return;

    const checkConnection = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);

        if (accounts.length > 0) {
          const network = await provider.getNetwork();
          const signer = await provider.getSigner();

          setProvider(provider);
          setSigner(signer);
          setAccount(accounts[0]);
          setChainId(Number(network.chainId));
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Failed to check connection:', err);
      }
    };

    checkConnection();
  }, []);

  const value: Web3ContextType = {
    isConnected,
    isConnecting,
    account,
    chainId,
    provider,
    signer,
    connect,
    disconnect,
    switchNetwork,
    getContract,
    getETHBalance,
    getUSDCBalance,
    error,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

/**
 * Hook to access Web3 context
 *
 * @example
 * ```tsx
 * const { isConnected, account, connect } = useWeb3();
 * ```
 */
export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
