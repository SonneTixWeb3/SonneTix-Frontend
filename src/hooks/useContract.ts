import { useCallback } from 'react';
import { parseUnits, formatUnits, Contract } from 'ethers';
import { useWallets } from '@privy-io/react-auth';
import { CONTRACTS, ABIS } from '@/config/contracts';
import { getEthersSigner } from '@/lib/privy-ethers';

/**
 * Hook for interacting with smart contracts (Privy-powered)
 */
export function useContract() {
  const { wallets } = useWallets();
  const primaryWallet = wallets[0];

  /**
   * Get a contract instance with the current wallet's signer
   */
  const getContract = useCallback(
    async (contractName: keyof typeof CONTRACTS): Promise<Contract | null> => {
      if (!primaryWallet) return null;

      const address = CONTRACTS[contractName];
      const abi = ABIS[contractName as keyof typeof ABIS];

      // Ensure address is a string (not a number like CHAIN_ID)
      if (!address || typeof address !== 'string' || !abi) return null;

      const signer = await getEthersSigner(primaryWallet);
      return new Contract(address, abi, signer);
    },
    [primaryWallet]
  );

  // ============================================================================
  // TICKET NFT OPERATIONS
  // ============================================================================

  const mintTicket = useCallback(
    async (eventId: string, quantity: number = 1) => {
      const contract = await getContract('TICKET_NFT');
      if (!contract || !primaryWallet) throw new Error('Wallet not connected');

      const account = primaryWallet.address;

      if (quantity === 1) {
        const tx = await contract.mint(account, eventId);
        return await tx.wait();
      } else {
        const tx = await contract.batchMint(account, eventId, quantity);
        return await tx.wait();
      }
    },
    [getContract, primaryWallet]
  );

  const transferTicket = useCallback(
    async (ticketId: string, toAddress: string) => {
      const contract = await getContract('TICKET_NFT');
      if (!contract || !primaryWallet) throw new Error('Wallet not connected');

      const account = primaryWallet.address;
      const tx = await contract.transferFrom(account, toAddress, ticketId);
      return await tx.wait();
    },
    [getContract, primaryWallet]
  );

  const getTicketOwner = useCallback(
    async (ticketId: string): Promise<string> => {
      const contract = await getContract('TICKET_NFT');
      if (!contract) throw new Error('Contract not available');

      return await contract.ownerOf(ticketId);
    },
    [getContract]
  );

  // ============================================================================
  // VAULT OPERATIONS
  // ============================================================================

  const createVault = useCallback(
    async (eventId: string, ticketIds: string[], loanAmount: string) => {
      const contract = await getContract('TICKET_VAULT');
      if (!contract) throw new Error('Wallet not connected');

      const loanAmountWei = parseUnits(loanAmount, 6); // USDC has 6 decimals
      const tx = await contract.createVault(eventId, ticketIds, loanAmountWei);
      return await tx.wait();
    },
    [getContract]
  );

  const fundVault = useCallback(
    async (vaultId: string, amount: string) => {
      const contract = await getContract('TICKET_VAULT');
      if (!contract) throw new Error('Wallet not connected');

      // First approve USDC spending
      const usdcContract = await getContract('USDC');
      if (!usdcContract) throw new Error('USDC contract not available');

      const amountWei = parseUnits(amount, 6);
      const approveTx = await usdcContract.approve(CONTRACTS.TICKET_VAULT, amountWei);
      await approveTx.wait();

      // Then fund the vault
      const tx = await contract.fundVault(vaultId, amountWei);
      return await tx.wait();
    },
    [getContract]
  );

  const getVaultDetails = useCallback(
    async (vaultId: string) => {
      const contract = await getContract('TICKET_VAULT');
      if (!contract) throw new Error('Contract not available');

      return await contract.getVaultDetails(vaultId);
    },
    [getContract]
  );

  // ============================================================================
  // GATE SCANNER OPERATIONS
  // ============================================================================

  const scanTicket = useCallback(
    async (ticketId: string, gateId: string) => {
      const contract = await getContract('GATE_SCANNER');
      if (!contract) throw new Error('Wallet not connected');

      const tx = await contract.scanTicket(ticketId, gateId);
      return await tx.wait();
    },
    [getContract]
  );

  const verifyTicket = useCallback(
    async (ticketId: string): Promise<boolean> => {
      const contract = await getContract('GATE_SCANNER');
      if (!contract) throw new Error('Contract not available');

      return await contract.verifyTicket(ticketId);
    },
    [getContract]
  );

  // ============================================================================
  // USDC OPERATIONS
  // ============================================================================

  const approveUSDC = useCallback(
    async (spender: string, amount: string) => {
      const contract = await getContract('USDC');
      if (!contract) throw new Error('Wallet not connected');

      const amountWei = parseUnits(amount, 6);
      const tx = await contract.approve(spender, amountWei);
      return await tx.wait();
    },
    [getContract]
  );

  const getUSDCAllowance = useCallback(
    async (owner: string, spender: string): Promise<string> => {
      const contract = await getContract('USDC');
      if (!contract) throw new Error('Contract not available');

      const allowance = await contract.allowance(owner, spender);
      return formatUnits(allowance, 6);
    },
    [getContract]
  );

  return {
    // Ticket NFT
    mintTicket,
    transferTicket,
    getTicketOwner,

    // Vault
    createVault,
    fundVault,
    getVaultDetails,

    // Scanner
    scanTicket,
    verifyTicket,

    // USDC
    approveUSDC,
    getUSDCAllowance,
  };
}
