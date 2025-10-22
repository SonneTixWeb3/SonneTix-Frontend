// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export type UserRole = 'ORGANIZER' | 'INVESTOR' | 'FAN' | 'SCANNER';

export type KYCStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  userId: string;
  walletAddress: string;
  email: string;
  role: UserRole;
  kycStatus: KYCStatus;
  createdAt: string;
  isActive: boolean;
}

// ============================================================================
// ORGANIZER TYPES
// ============================================================================

export interface Organizer {
  organizerId: string;
  userId: string;
  companyName: string;
  reputationScore: number;
  totalEvents: number;
  successfulEvents: number;
  successRate: number;
  isVerified: boolean;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type EventCategory =
  | 'CONCERT'
  | 'CONFERENCE'
  | 'SPORTS'
  | 'FESTIVAL'
  | 'EXHIBITION'
  | 'THEATER'
  | 'OTHER';

export interface Event {
  eventId: string;
  organizerId: string;
  eventName: string;
  description: string;
  venue: string;
  eventDate: string;
  category: EventCategory;
  ipCertificateHash: string;
  totalTickets: number;
  ticketPrice: number;
  status: EventStatus;
  createdAt: string;
  posterUrl?: string;
}

// ============================================================================
// VAULT TYPES
// ============================================================================

export type VaultStatus =
  | 'FUNDING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'DEFAULTED'
  | 'SETTLED';

export interface Vault {
  vaultId: string;
  eventId: string;
  smartContractAddress: string;
  loanAmount: number;
  ltvRatio: number;
  yieldRate: number;
  riskScore: number;
  vaultStatus: VaultStatus;
  totalFunded: number;
  totalReleased: number;
  debtRemaining: number;
  fundingDeadline: string;
  createdAt: string;
}

// ============================================================================
// INVESTMENT TYPES
// ============================================================================

export type InvestmentStatus =
  | 'PENDING'
  | 'FUNDED'
  | 'ACTIVE'
  | 'PAID'
  | 'DEFAULTED';

export interface Investment {
  investmentId: string;
  investorId: string;
  vaultId: string;
  amount: number;
  expectedReturn: number;
  status: InvestmentStatus;
  investedAt: string;
  paidoutAt?: string;
  actualReturn?: number;
}

// ============================================================================
// TICKET NFT TYPES
// ============================================================================

export type TicketType = 'VIP' | 'REGULAR' | 'EARLY_BIRD' | 'STUDENT';

export type TicketStatus =
  | 'AVAILABLE'
  | 'LOCKED'
  | 'OWNED'
  | 'LISTED'
  | 'SCANNED'
  | 'BURNED';

export interface TicketNFT {
  ticketId: string;
  eventId: string;
  tokenId: number;
  nftContractAddress: string;
  ticketType: TicketType;
  price: number;
  ownerAddress: string;
  status: TicketStatus;
  metadataUri: string;
  mintedAt: string;
}

// ============================================================================
// TICKET SALE TYPES
// ============================================================================

export interface TicketSale {
  saleId: string;
  ticketId: string;
  fanId: string;
  vaultId: string;
  salePrice: number;
  transactionHash: string;
  purchasedAt: string;
}

// ============================================================================
// TICKET SCAN TYPES
// ============================================================================

export interface TicketScan {
  scanId: string;
  ticketId: string;
  gateId: string;
  scannerAddress: string;
  scannedAt: string;
  transactionHash: string;
}

// ============================================================================
// ATTENDANCE NFT TYPES
// ============================================================================

export interface AttendanceNFT {
  attendanceId: string;
  scanId: string;
  organizerId: string;
  tokenId: number;
  nftContractAddress: string;
  metadataUri: string;
  mintedAt: string;
}

// ============================================================================
// MILESTONE TYPES
// ============================================================================

export interface Milestone {
  milestoneId: string;
  vaultId: string;
  description: string;
  percentage: number;
  proofHash: string;
  isCompleted: boolean;
  isVerified: boolean;
  completedAt?: string;
}

// ============================================================================
// TRANSACTION LOG TYPES
// ============================================================================

export type TransactionType =
  | 'INVESTMENT'
  | 'DISBURSEMENT'
  | 'TICKET_SALE'
  | 'SETTLEMENT'
  | 'REFUND';

export type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export interface TransactionLog {
  txId: string;
  vaultId: string;
  txHash: string;
  txType: TransactionType;
  amount: number;
  fromAddress: string;
  toAddress: string;
  status: TransactionStatus;
  timestamp: string;
}

// ============================================================================
// IP CERTIFICATE TYPES
// ============================================================================

export type IPCertificateStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface IPCertificate {
  certId: string;
  eventId: string;
  contentHash: string;
  djkiStatus: IPCertificateStatus;
  nftTokenId?: string;
  issuedAt: string;
}

// ============================================================================
// ANALYTICS & DASHBOARD TYPES
// ============================================================================

export interface OrganizerStats {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  activeVaults: number;
  upcomingEvents: number;
  completedEvents: number;
}

export interface InvestorStats {
  totalInvested: number;
  activeInvestments: number;
  totalReturns: number;
  averageROI: number;
  portfolioValue: number;
}

export interface VaultAnalytics {
  vault: Vault;
  event: Event;
  fundingProgress: number;
  ticketsSold: number;
  projectedROI: number;
  daysUntilEvent: number;
}
