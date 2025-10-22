/**
 * Smart Contract Configurations for Base Sepolia
 *
 * This file contains all contract addresses and ABIs for the GatePay Vault system.
 * Replace these with actual deployed contract addresses.
 */

export const CONTRACTS = {
  // Network: Base Sepolia Testnet
  CHAIN_ID: 84532,
  CHAIN_NAME: 'Base Sepolia',
  RPC_URL: 'https://sepolia.base.org',
  BLOCK_EXPLORER: 'https://sepolia.basescan.org',

  // Contract Addresses (Replace with actual deployed addresses)
  TICKET_NFT: '0x0000000000000000000000000000000000000000',
  TICKET_VAULT: '0x0000000000000000000000000000000000000000',
  ATTENDANCE_NFT: '0x0000000000000000000000000000000000000000',
  ESCROW: '0x0000000000000000000000000000000000000000',
  GATE_SCANNER: '0x0000000000000000000000000000000000000000',
  USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia USDC
};

// Simplified ABIs (Add full ABIs when contracts are deployed)
export const ABIS = {
  TicketNFT: [
    'function mint(address to, uint256 eventId) external returns (uint256)',
    'function batchMint(address to, uint256 eventId, uint256 quantity) external',
    'function ownerOf(uint256 tokenId) external view returns (address)',
    'function transferFrom(address from, address to, uint256 tokenId) external',
    'function approve(address to, uint256 tokenId) external',
    'function burnOnScan(uint256 tokenId) external',
    'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  ],

  TicketVault: [
    'function createVault(uint256 eventId, uint256[] memory ticketIds, uint256 loanAmount) external returns (uint256)',
    'function fundVault(uint256 vaultId, uint256 amount) external',
    'function disburseLoan(uint256 vaultId) external',
    'function onTicketSale(uint256 vaultId, uint256 salePrice) external',
    'function settleVault(uint256 vaultId) external',
    'function getVaultDetails(uint256 vaultId) external view returns (tuple)',
    'event VaultCreated(uint256 indexed vaultId, uint256 indexed eventId, uint256 loanAmount)',
    'event VaultFunded(uint256 indexed vaultId, address indexed investor, uint256 amount)',
    'event LoanDisbursed(uint256 indexed vaultId, uint256 amount)',
  ],

  AttendanceNFT: [
    'function mint(address organizer, uint256 scanId, string memory metadataUri) external returns (uint256)',
    'function ownerOf(uint256 tokenId) external view returns (address)',
    'event AttendanceMinted(uint256 indexed tokenId, address indexed organizer, uint256 scanId)',
  ],

  Escrow: [
    'function depositFromVault(uint256 vaultId) external payable',
    'function releaseToOrganizer(uint256 vaultId, uint256 amount) external',
    'function distributeSettlement(uint256 vaultId) external',
    'function getEscrowBalance(uint256 vaultId) external view returns (uint256)',
  ],

  GateScanner: [
    'function scanTicket(uint256 ticketId, string memory gateId) external',
    'function verifyTicket(uint256 ticketId) external view returns (bool)',
    'event TicketScanned(uint256 indexed ticketId, string gateId, address scanner, uint256 timestamp)',
  ],

  ERC20: [
    'function balanceOf(address account) external view returns (uint256)',
    'function transfer(address to, uint256 amount) external returns (bool)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) external view returns (uint256)',
    'function decimals() external view returns (uint8)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
  ],
};

/**
 * Get contract configuration by name
 */
export function getContractConfig(contractName: keyof typeof CONTRACTS) {
  return {
    address: CONTRACTS[contractName],
    abi: ABIS[contractName as keyof typeof ABIS] || [],
  };
}

/**
 * Network configuration for wallet connection
 */
export const NETWORK_CONFIG = {
  chainId: `0x${CONTRACTS.CHAIN_ID.toString(16)}`, // Hex format for MetaMask
  chainName: CONTRACTS.CHAIN_NAME,
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [CONTRACTS.RPC_URL],
  blockExplorerUrls: [CONTRACTS.BLOCK_EXPLORER],
};
