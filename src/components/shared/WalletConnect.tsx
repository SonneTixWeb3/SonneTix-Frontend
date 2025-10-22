import React, { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui';
import { formatAddress, formatCurrency } from '@/lib/utils';
import { CONTRACTS } from '@/config/contracts';

/**
 * Wallet Connect Button Component
 *
 * Displays connection status and allows users to connect/disconnect their wallet.
 * Shows balance and network information when connected.
 */
export const WalletConnect: React.FC = () => {
  const { isConnected, isConnecting, account, chainId, connect, disconnect, getETHBalance, getUSDCBalance, error } =
    useWeb3();
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [showDetails, setShowDetails] = useState(false);

  React.useEffect(() => {
    if (isConnected) {
      loadBalances();
    }
  }, [isConnected, account]);

  const loadBalances = async () => {
    const eth = await getETHBalance();
    const usdc = await getUSDCBalance();
    setEthBalance(eth);
    setUsdcBalance(usdc);
  };

  const isCorrectNetwork = chainId === CONTRACTS.CHAIN_ID;

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          onClick={connect}
          isLoading={isConnecting}
          className="relative"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet 🦊'}
        </Button>
        {error && (
          <p className="text-sm text-red-700 font-hand text-center">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="paper-card px-4 py-2 hover:shadow-sketch-lg transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-left">
            <p className="font-comic font-bold text-sm">
              {formatAddress(account!)}
            </p>
            {!isCorrectNetwork && (
              <p className="text-xs text-red-700 font-hand">Wrong Network!</p>
            )}
          </div>
        </div>
      </button>

      {showDetails && (
        <div className="absolute right-0 top-full mt-2 w-72 paper-card p-4 z-50 space-y-3">
          <div>
            <p className="text-xs font-hand text-paper-500 mb-1">Network</p>
            <p className="font-comic font-bold">
              {isCorrectNetwork ? CONTRACTS.CHAIN_NAME : `Chain ID: ${chainId}`}
            </p>
          </div>

          <div className="divider-sketch"></div>

          <div>
            <p className="text-xs font-hand text-paper-500 mb-2">Balances</p>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-hand">ETH</span>
                <span className="font-comic font-bold">{parseFloat(ethBalance).toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-hand">USDC</span>
                <span className="font-comic font-bold">{formatCurrency(parseFloat(usdcBalance))}</span>
              </div>
            </div>
          </div>

          <div className="divider-sketch"></div>

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
              onClick={() => {
                disconnect();
                setShowDetails(false);
              }}
              className="flex-1"
            >
              Disconnect
            </Button>
          </div>

          <a
            href={`${CONTRACTS.BLOCK_EXPLORER}/address/${account}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm font-hand text-blue-700 underline-sketch hover-wiggle"
          >
            View on Explorer →
          </a>
        </div>
      )}
    </div>
  );
};
