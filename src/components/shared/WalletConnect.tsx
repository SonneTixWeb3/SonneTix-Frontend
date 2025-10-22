import React, { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from '@/components/ui';
import { formatAddress, formatCurrency } from '@/lib/utils';
import { CONTRACTS } from '@/config/contracts';
import { getEthersProvider, getWalletTypeName } from '@/lib/privy-ethers';
import { formatUnits, Contract } from 'ethers';
import { ABIS } from '@/config/contracts';

/**
 * Wallet Connect Component (Privy-powered)
 *
 * Displays connection status and allows users to:
 * - Login with email or connect external wallets (MetaMask, etc.)
 * - View wallet balances and network information
 * - Switch between multiple connected wallets
 * - Disconnect/logout
 */
export const WalletConnect: React.FC = () => {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();

  const [showDetails, setShowDetails] = useState(false);
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<number | null>(null);

  // Get the first wallet (primary wallet)
  const primaryWallet = wallets[0];

  // Load balances when wallet is connected
  useEffect(() => {
    if (primaryWallet) {
      loadBalances();
      loadChainId();
    }
  }, [primaryWallet]);

  const loadBalances = async () => {
    if (!primaryWallet) return;

    try {
      const provider = await getEthersProvider(primaryWallet);
      const address = primaryWallet.address;

      // Get ETH balance
      const ethBal = await provider.getBalance(address);
      setEthBalance(formatUnits(ethBal, 18));

      // Get USDC balance
      try {
        const signer = await provider.getSigner();
        const usdcContract = new Contract(CONTRACTS.USDC, ABIS.ERC20, signer);
        const usdcBal = await usdcContract.balanceOf(address);
        const decimals = await usdcContract.decimals();
        setUsdcBalance(formatUnits(usdcBal, decimals));
      } catch (err) {
        console.error('Failed to get USDC balance:', err);
        setUsdcBalance('0');
      }
    } catch (err) {
      console.error('Failed to load balances:', err);
    }
  };

  const loadChainId = async () => {
    if (!primaryWallet) return;

    try {
      const provider = await getEthersProvider(primaryWallet);
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));
    } catch (err) {
      console.error('Failed to load chain ID:', err);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDetails(false);
    setEthBalance('0');
    setUsdcBalance('0');
    setChainId(null);
  };

  // Show loading state while Privy initializes
  if (!ready) {
    return (
      <div className="flex items-center gap-2">
        <div className="spinner w-5 h-5"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  // Not authenticated - show login button
  if (!authenticated || !primaryWallet) {
    return (
      <Button variant="primary" onClick={login}>
        Connect Wallet
      </Button>
    );
  }

  const isCorrectNetwork = chainId === CONTRACTS.CHAIN_ID;
  const walletType = getWalletTypeName(primaryWallet);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="card px-4 py-2 hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-success-500 rounded-full"></div>
          <div className="text-left">
            <p className="font-medium text-sm text-gray-900">
              {formatAddress(primaryWallet.address)}
            </p>
            {!isCorrectNetwork && (
              <p className="text-xs text-danger-600">Wrong Network!</p>
            )}
          </div>
        </div>
      </button>

      {showDetails && (
        <div className="absolute right-0 top-full mt-2 w-80 card p-4 z-50 space-y-4 shadow-lg">
          {/* Wallet Type */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Wallet Type</p>
            <p className="font-medium text-gray-900">{walletType}</p>
          </div>

          <div className="divider"></div>

          {/* Network */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Network</p>
            <p className="font-medium text-gray-900">
              {isCorrectNetwork ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-success-500 rounded-full"></span>
                  {CONTRACTS.CHAIN_NAME}
                </span>
              ) : (
                <span className="flex items-center gap-2 text-danger-600">
                  <span className="w-2 h-2 bg-danger-500 rounded-full"></span>
                  Chain ID: {chainId}
                </span>
              )}
            </p>
          </div>

          <div className="divider"></div>

          {/* Balances */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Balances</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">ETH</span>
                <span className="font-medium text-gray-900">
                  {parseFloat(ethBalance).toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">USDC</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(parseFloat(usdcBalance))}
                </span>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadBalances}
              className="flex-1"
            >
              Refresh
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              className="flex-1"
            >
              Disconnect
            </Button>
          </div>

          {/* Explorer Link */}
          <a
            href={`${CONTRACTS.BLOCK_EXPLORER}/address/${primaryWallet.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-primary-600 hover:text-primary-700 underline"
          >
            View on Explorer →
          </a>
        </div>
      )}
    </div>
  );
};
