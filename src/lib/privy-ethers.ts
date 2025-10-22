/**
 * Privy + Ethers Integration Utilities
 *
 * Provides helper functions to convert Privy wallets into ethers providers and signers
 * for interacting with smart contracts.
 */

import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { ConnectedWallet } from '@privy-io/react-auth';

/**
 * Get an ethers BrowserProvider from a Privy wallet
 *
 * @param wallet - The Privy ConnectedWallet
 * @returns ethers BrowserProvider instance
 */
export async function getEthersProvider(wallet: ConnectedWallet): Promise<BrowserProvider> {
  const provider = await wallet.getEthereumProvider();
  return new BrowserProvider(provider);
}

/**
 * Get an ethers Signer from a Privy wallet
 *
 * @param wallet - The Privy ConnectedWallet
 * @returns ethers JsonRpcSigner instance
 */
export async function getEthersSigner(wallet: ConnectedWallet): Promise<JsonRpcSigner> {
  const provider = await getEthersProvider(wallet);
  return provider.getSigner();
}

/**
 * Get wallet address from a Privy wallet
 *
 * @param wallet - The Privy ConnectedWallet
 * @returns Wallet address as string
 */
export function getWalletAddress(wallet: ConnectedWallet): string {
  return wallet.address;
}

/**
 * Check if wallet is an embedded wallet (created by Privy)
 *
 * @param wallet - The Privy ConnectedWallet
 * @returns true if embedded wallet, false if external
 */
export function isEmbeddedWallet(wallet: ConnectedWallet): boolean {
  return wallet.walletClientType === 'privy';
}

/**
 * Get human-readable wallet type name
 *
 * @param wallet - The Privy ConnectedWallet
 * @returns Wallet type name (e.g., "MetaMask", "Embedded Wallet")
 */
export function getWalletTypeName(wallet: ConnectedWallet): string {
  if (isEmbeddedWallet(wallet)) {
    return 'Embedded Wallet';
  }

  const typeMap: Record<string, string> = {
    'metamask': 'MetaMask',
    'coinbase_wallet': 'Coinbase Wallet',
    'rainbow': 'Rainbow',
    'wallet_connect': 'WalletConnect',
    'phantom': 'Phantom',
  };

  return typeMap[wallet.walletClientType] || wallet.walletClientType;
}
