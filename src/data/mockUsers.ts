import { User, Organizer } from '@/types';

export const mockUsers: User[] = [
  {
    userId: 'USR-001',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    email: 'organizer@sonnetix.com',
    role: 'ORGANIZER',
    kycStatus: 'APPROVED',
    createdAt: '2024-01-15T10:00:00Z',
    isActive: true,
  },
  {
    userId: 'USR-002',
    walletAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    email: 'investor1@sonnetix.com',
    role: 'INVESTOR',
    kycStatus: 'APPROVED',
    createdAt: '2024-02-10T14:30:00Z',
    isActive: true,
  },
  {
    userId: 'USR-003',
    walletAddress: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    email: 'fan@sonnetix.com',
    role: 'FAN',
    kycStatus: 'PENDING',
    createdAt: '2024-03-05T09:15:00Z',
    isActive: true,
  },
  {
    userId: 'USR-004',
    walletAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
    email: 'scanner@sonnetix.com',
    role: 'SCANNER',
    kycStatus: 'APPROVED',
    createdAt: '2024-02-20T16:45:00Z',
    isActive: true,
  },
];

export const mockOrganizers: Organizer[] = [
  {
    organizerId: 'ORG-001',
    userId: 'USR-001',
    companyName: 'EventPro Indonesia',
    reputationScore: 85,
    totalEvents: 12,
    successfulEvents: 11,
    successRate: 91.67,
    isVerified: true,
  },
];
