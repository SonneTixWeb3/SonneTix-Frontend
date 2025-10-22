import { useCallback } from 'react';
import { parseUnits, formatUnits } from 'ethers';
import { useWeb3 } from '@/contexts/Web3Context';
import { CONTRACTS } from '@/config/contracts';

/**
 * Hook for interacting with smart contracts
 */
export function useContract() {
  const { getContract, account } = useWeb3();

  // ============================================================================
  // TICKET NFT OPERATIONS
  // ============================================================================

  const mintTicket = useCallback(
    async (eventId: string, quantity: number = 1) => {
      const contract = getContract('TICKET_NFT');
      if (!contract || !account) throw new Error('Wallet not connected');

      if (quantity === 1) {
        const tx = await contract.mint(account, eventId);
        return await tx.wait();
      } else {
        const tx = await contract.batchMint(account, eventId, quantity);
        return await tx.wait();
      }
    },
    [getContract, account]
  );

  const transferTicket = useCallback(
    async (ticketId: string, toAddress: string) => {
      const contract = getContract('TICKET_NFT');
      if (!contract || !account) throw new Error('Wallet not connected');

      const tx = await contract.transferFrom(account, toAddress, ticketId);
      return await tx.wait();
    },
    [getContract, account]
  );

  const getTicketOwner = useCallback(
    async (ticketId: string): Promise<string> => {
      const contract = getContract('TICKET_NFT');
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
      const contract = getContract('TICKET_VAULT');
      if (!contract) throw new Error('Wallet not connected');

      const loanAmountWei = parseUnits(loanAmount, 6); // USDC has 6 decimals
      const tx = await contract.createVault(eventId, ticketIds, loanAmountWei);
      return await tx.wait();
    },
    [getContract]
  );

  const fundVault = useCallback(
    async (vaultId: string, amount: string) => {
      const contract = getContract('TICKET_VAULT');
      if (!contract) throw new Error('Wallet not connected');

      // First approve USDC spending
      const usdcContract = getContract('USDC');
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
      const contract = getContract('TICKET_VAULT');
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
      const contract = getContract('GATE_SCANNER');
      if (!contract) throw new Error('Wallet not connected');

      const tx = await contract.scanTicket(ticketId, gateId);
      return await tx.wait();
    },
    [getContract]
  );

  const verifyTicket = useCallback(
    async (ticketId: string): Promise<boolean> => {
      const contract = getContract('GATE_SCANNER');
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
      const contract = getContract('USDC');
      if (!contract) throw new Error('Wallet not connected');

      const amountWei = parseUnits(amount, 6);
      const tx = await contract.approve(spender, amountWei);
      return await tx.wait();
    },
    [getContract]
  );

  const getUSDCAllowance = useCallback(
    async (owner: string, spender: string): Promise<string> => {
      const contract = getContract('USDC');
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
