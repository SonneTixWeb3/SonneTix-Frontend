import { TicketNFT, TicketSale, TicketScan, AttendanceNFT } from '@/types';

export const mockTickets: TicketNFT[] = [
  {
    ticketId: 'TKT-001',
    eventId: 'EVT-001',
    tokenId: 1001,
    nftContractAddress: '0x1234567890123456789012345678901234567890',
    ticketType: 'REGULAR',
    price: 50,
    ownerAddress: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    status: 'OWNED',
    metadataUri: 'ipfs://QmXYZ123.../1001.json',
    mintedAt: '2024-09-15T10:30:00Z',
  },
  {
    ticketId: 'TKT-002',
    eventId: 'EVT-001',
    tokenId: 1002,
    nftContractAddress: '0x1234567890123456789012345678901234567890',
    ticketType: 'VIP',
    price: 100,
    ownerAddress: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    status: 'OWNED',
    metadataUri: 'ipfs://QmXYZ123.../1002.json',
    mintedAt: '2024-09-15T10:31:00Z',
  },
  {
    ticketId: 'TKT-003',
    eventId: 'EVT-002',
    tokenId: 2001,
    nftContractAddress: '0x1234567890123456789012345678901234567890',
    ticketType: 'REGULAR',
    price: 75,
    ownerAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    status: 'LOCKED',
    metadataUri: 'ipfs://QmXYZ123.../2001.json',
    mintedAt: '2024-09-20T15:00:00Z',
  },
];

export const mockTicketSales: TicketSale[] = [
  {
    saleId: 'SAL-001',
    ticketId: 'TKT-001',
    fanId: 'USR-003',
    vaultId: 'VLT-001',
    salePrice: 50,
    transactionHash: '0xabc123def456...',
    purchasedAt: '2024-10-01T14:00:00Z',
  },
  {
    saleId: 'SAL-002',
    ticketId: 'TKT-002',
    fanId: 'USR-003',
    vaultId: 'VLT-001',
    salePrice: 100,
    transactionHash: '0xdef456ghi789...',
    purchasedAt: '2024-10-01T14:05:00Z',
  },
];

export const mockTicketScans: TicketScan[] = [
  {
    scanId: 'SCN-001',
    ticketId: 'TKT-001',
    gateId: 'GATE-A-01',
    scannerAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
    scannedAt: '2024-12-15T18:30:00Z',
    transactionHash: '0xscan123...',
  },
];

export const mockAttendanceNFTs: AttendanceNFT[] = [
  {
    attendanceId: 'ATT-001',
    scanId: 'SCN-001',
    organizerId: 'ORG-001',
    tokenId: 5001,
    nftContractAddress: '0x5678901234567890123456789012345678901234',
    metadataUri: 'ipfs://QmABC789.../5001.json',
    mintedAt: '2024-12-15T18:30:05Z',
  },
];
