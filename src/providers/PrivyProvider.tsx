import { ReactNode } from 'react';
import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { base, baseSepolia } from 'viem/chains';

/**
 * Privy Provider Wrapper
 *
 * Configures Privy for SonneTix with:
 * - Email login + External wallet support
 * - Base Sepolia network
 * - Custom branding to match modern design
 * - Embedded wallet auto-creation for email users
 */

interface PrivyProviderProps {
  children: ReactNode;
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  const appId = import.meta.env.VITE_PRIVY_APP_ID;

  if (!appId) {
    console.error('VITE_PRIVY_APP_ID is not set in environment variables');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="card p-8 max-w-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Configuration Error</h2>
          <p className="text-gray-700 mb-4">
            Privy App ID is not configured. Please set <code className="bg-gray-100 px-2 py-1 rounded">VITE_PRIVY_APP_ID</code> in your environment variables.
          </p>
          <p className="text-sm text-gray-600">
            Get your App ID from: <a href="https://dashboard.privy.io" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">https://dashboard.privy.io</a>
          </p>
        </div>
      </div>
    );
  }

  // Determine if we're on production (mainnet) or testnet
  const isProduction = import.meta.env.PROD;
  const defaultChain = isProduction ? base : baseSepolia;

  return (
    <BasePrivyProvider
      appId={appId}
      config={{
        // Appearance - Match SonneTix modern design
        appearance: {
          theme: 'light',
          accentColor: '#2563eb', // primary-600
          logo: 'https://sonnetix.izcy.tech/logo.png', // Update with actual logo URL
          landingHeader: 'Welcome to SonneTix',
          loginMessage: 'Connect your wallet or sign in with email to continue',
          walletList: ['metamask', 'coinbase_wallet', 'rainbow', 'wallet_connect'],
        },

        // Login Methods - Email + External Wallets
        loginMethods: ['email', 'wallet'],

        // Network Configuration - Base Sepolia (testnet) or Base (mainnet)
        defaultChain: defaultChain,
        supportedChains: [baseSepolia, base],

        // Wallet Connection UI
        walletConnectCloudProjectId: undefined, // Optional: Add WalletConnect Project ID
      }}
    >
      {children}
    </BasePrivyProvider>
  );
}
