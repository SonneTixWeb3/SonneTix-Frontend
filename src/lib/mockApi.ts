/**
 * Mock API Service
 *
 * Simulates backend API with realistic delays and localStorage persistence.
 * This makes it easy to migrate to real API endpoints later.
 */

import { sleep, generateId } from './utils';
import { mockUsers } from '@/data/mockUsers';
// Mock data imports removed - we start with empty data now
// import { mockEvents } from '@/data/mockEvents';
// import { mockVaults, mockInvestments } from '@/data/mockVaults';
// import { mockTickets, mockTicketSales } from '@/data/mockTickets';
import type {
  User,
  Event,
  Vault,
  Investment,
  TicketNFT,
  TicketSale,
  TicketScan,
  AttendanceNFT,
  EscrowBalance,
  SettlementDistribution,
  OrganizerStats,
  InvestorStats,
  VaultAnalytics,
  TicketType,
} from '@/types';

// Simulate API delay (200-500ms)
const API_DELAY = () => Math.random() * 300 + 200;

// LocalStorage keys
const STORAGE_KEYS = {
  USERS: 'sonnetix_users',
  EVENTS: 'sonnetix_events',
  VAULTS: 'sonnetix_vaults',
  INVESTMENTS: 'sonnetix_investments',
  TICKETS: 'sonnetix_tickets',
  SALES: 'sonnetix_sales',
  SCANS: 'sonnetix_scans',
  ATTENDANCE_NFTS: 'sonnetix_attendance_nfts',
  ESCROW: 'sonnetix_escrow',
  SETTLEMENTS: 'sonnetix_settlements',
};

// Initialize localStorage with empty data (no dummy events)
// Users can create their own events from scratch
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers)); // Keep users for login
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify([])); // Start with no events
  }
  if (!localStorage.getItem(STORAGE_KEYS.VAULTS)) {
    localStorage.setItem(STORAGE_KEYS.VAULTS, JSON.stringify([])); // Start with no vaults
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVESTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify([])); // Start with no investments
  }
  if (!localStorage.getItem(STORAGE_KEYS.TICKETS)) {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify([])); // Start with no tickets
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([])); // Start with no sales
  }
  if (!localStorage.getItem(STORAGE_KEYS.SCANS)) {
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE_NFTS)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_NFTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ESCROW)) {
    localStorage.setItem(STORAGE_KEYS.ESCROW, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTLEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.SETTLEMENTS, JSON.stringify([]));
  }
}

initializeStorage();

// ============================================================================
// USER & AUTH API
// ============================================================================

export const userApi = {
  async getUserByWallet(walletAddress: string): Promise<User | null> {
    await sleep(API_DELAY());
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.find((u) => u.walletAddress.toLowerCase() === walletAddress.toLowerCase()) || null;
  },

  async createUser(userData: Omit<User, 'userId' | 'createdAt'>): Promise<User> {
    await sleep(API_DELAY());
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const newUser: User = {
      ...userData,
      userId: generateId('USR'),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },
};

// ============================================================================
// EVENT API
// ============================================================================

export const eventApi = {
  async getAllEvents(): Promise<Event[]> {
    await sleep(API_DELAY());
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  },

  async getEventById(eventId: string): Promise<Event | null> {
    await sleep(API_DELAY());
    const events: Event[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
    return events.find((e) => e.eventId === eventId) || null;
  },

  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    await sleep(API_DELAY());
    const events: Event[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
    return events.filter((e) => e.organizerId === organizerId);
  },

  async getUpcomingEvents(): Promise<Event[]> {
    await sleep(API_DELAY());
    const events: Event[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
    const now = new Date();
    return events
      .filter((e) => new Date(e.eventDate) > now && e.status === 'PUBLISHED')
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  },

  async createEvent(eventData: Omit<Event, 'eventId' | 'createdAt'>): Promise<Event> {
    await sleep(API_DELAY());
    const events: Event[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
    const newEvent: Event = {
      ...eventData,
      eventId: generateId('EVT'),
      createdAt: new Date().toISOString(),
    };
    events.push(newEvent);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return newEvent;
  },

  async updateEvent(eventId: string, updates: Partial<Event>): Promise<Event> {
    await sleep(API_DELAY());
    const events: Event[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
    const index = events.findIndex((e) => e.eventId === eventId);
    if (index === -1) throw new Error('Event not found');
    events[index] = { ...events[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return events[index];
  },

  /**
   * Get real ticket sales statistics for an event
   * @param eventId Event ID to get sales for
   * @returns Object with sold count, total tickets, and revenue
   */
  async getTicketSales(eventId: string): Promise<{ sold: number; total: number; revenue: number; soldPercentage: number }> {
    await sleep(API_DELAY());
    const sales: TicketSale[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SALES) || '[]');
    const tickets: TicketNFT[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS) || '[]');
    const event = await this.getEventById(eventId);

    if (!event) {
      return { sold: 0, total: 0, revenue: 0, soldPercentage: 0 };
    }

    // Get all tickets for this event
    const eventTickets = tickets.filter(ticket => ticket.eventId === eventId);
    const eventTicketIds = new Set(eventTickets.map(t => t.ticketId));

    // Count sales for these tickets
    const eventSales = sales.filter(sale => eventTicketIds.has(sale.ticketId));
    const sold = eventSales.length;
    const revenue = eventSales.reduce((sum, sale) => sum + sale.salePrice, 0);
    const soldPercentage = event.totalTickets > 0 ? (sold / event.totalTickets) * 100 : 0;

    return {
      sold,
      total: event.totalTickets,
      revenue,
      soldPercentage
    };
  },
};

// ============================================================================
// VAULT API
// ============================================================================

export const vaultApi = {
  async getAllVaults(): Promise<Vault[]> {
    await sleep(API_DELAY());
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULTS) || '[]');
  },

  async getVaultById(vaultId: string): Promise<Vault | null> {
    await sleep(API_DELAY());
    const vaults: Vault[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULTS) || '[]');
    return vaults.find((v) => v.vaultId === vaultId) || null;
  },

  async getVaultsByStatus(status: string): Promise<Vault[]> {
    await sleep(API_DELAY());
    const vaults: Vault[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULTS) || '[]');
    return vaults.filter((v) => v.vaultStatus === status);
  },

  async getVaultAnalytics(): Promise<VaultAnalytics[]> {
    await sleep(API_DELAY());
    const vaults: Vault[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULTS) || '[]');
    const events: Event[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');

    return vaults.map((vault) => {
      const event = events.find((e) => e.eventId === vault.eventId)!;
      const fundingProgress = (vault.totalFunded / vault.loanAmount) * 100;
      const ticketsSold = Math.floor(Math.random() * event.totalTickets * 0.6); // Mock
      const projectedROI = vault.yieldRate;
      const daysUntilEvent = Math.ceil(
        (new Date(event.eventDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        vault,
        event,
        fundingProgress,
        ticketsSold,
        projectedROI,
        daysUntilEvent,
      };
    });
  },

  async createVault(vaultData: Omit<Vault, 'vaultId' | 'createdAt'>): Promise<Vault> {
    await sleep(API_DELAY());
    const vaults: Vault[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULTS) || '[]');
    const newVault: Vault = {
      ...vaultData,
      vaultId: generateId('VLT'),
      createdAt: new Date().toISOString(),
    };
    vaults.push(newVault);
    localStorage.setItem(STORAGE_KEYS.VAULTS, JSON.stringify(vaults));
    return newVault;
  },
};

// ============================================================================
// INVESTMENT API
// ============================================================================

export const investmentApi = {
  async getInvestmentsByInvestor(investorId: string): Promise<Investment[]> {
    await sleep(API_DELAY());
    const investments: Investment[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVESTMENTS) || '[]');
    return investments.filter((i) => i.investorId === investorId);
  },

  async getInvestmentsByVault(vaultId: string): Promise<Investment[]> {
    await sleep(API_DELAY());
    const investments: Investment[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVESTMENTS) || '[]');
    return investments.filter((i) => i.vaultId === vaultId);
  },

  /**
   * Create investment (mirrors TicketVault.fundVault)
   * Includes auto-disbursement logic when vault is fully funded
   */
  async createInvestment(investmentData: Omit<Investment, 'investmentId' | 'investedAt'>): Promise<Investment> {
    await sleep(API_DELAY());

    const vaults: Vault[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULTS) || '[]');
    const vaultIndex = vaults.findIndex((v) => v.vaultId === investmentData.vaultId);
    if (vaultIndex === -1) throw new Error('Vault not found');

    const vault = vaults[vaultIndex];

    // Verify vault is in FUNDING status
    if (vault.vaultStatus !== 'FUNDING') {
      throw new Error('Vault not accepting funding');
    }

    // Check funding deadline
    if (new Date(vault.fundingDeadline) < new Date()) {
      throw new Error('Funding deadline passed');
    }

    // Check if investment exceeds loan amount
    if (vault.totalFunded + investmentData.amount > vault.loanAmount) {
      throw new Error('Investment exceeds remaining funding needed');
    }

    // Create investment record
    const investments: Investment[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVESTMENTS) || '[]');
    const newInvestment: Investment = {
      ...investmentData,
      investmentId: generateId('INV'),
      investedAt: new Date().toISOString(),
    };
    investments.push(newInvestment);
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments));

    // Update vault: track investor and contribution (mirroring smart contract)
    const investorAddress = `0x${investmentData.investorId.replace(/[^0-9]/g, '').padEnd(40, '0').substring(0, 40)}`;

    if (!vault.investors.includes(investorAddress)) {
      vaults[vaultIndex].investors.push(investorAddress);
    }

    if (!vaults[vaultIndex].investorContributions[investorAddress]) {
      vaults[vaultIndex].investorContributions[investorAddress] = 0;
    }
    vaults[vaultIndex].investorContributions[investorAddress] += investmentData.amount;

    vaults[vaultIndex].totalFunded += investmentData.amount;

    // AUTO-DISBURSEMENT: If fully funded, change status to ACTIVE (mirrors smart contract)
    if (vaults[vaultIndex].totalFunded >= vault.loanAmount) {
      vaults[vaultIndex].vaultStatus = 'ACTIVE';
      vaults[vaultIndex].totalReleased = vault.loanAmount;
      console.log(`[VAULT AUTO-DISBURSED] ${vault.vaultId} → ACTIVE (Loan: ${vault.loanAmount} disbursed to organizer)`);
    }

    localStorage.setItem(STORAGE_KEYS.VAULTS, JSON.stringify(vaults));

    return newInvestment;
  },

  async getInvestorStats(investorId: string): Promise<InvestorStats> {
    await sleep(API_DELAY());
    const investments: Investment[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVESTMENTS) || '[]');
    const userInvestments = investments.filter((i) => i.investorId === investorId);

    const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    const activeInvestments = userInvestments.filter((i) => i.status === 'ACTIVE').length;
    const totalReturns = userInvestments
      .filter((i) => i.actualReturn)
      .reduce((sum, inv) => sum + (inv.actualReturn || 0), 0);
    const averageROI =
      userInvestments.length > 0
        ? userInvestments.reduce((sum, inv) => sum + ((inv.expectedReturn - inv.amount) / inv.amount) * 100, 0) /
          userInvestments.length
        : 0;
    const portfolioValue = totalInvested + totalReturns;

    return {
      totalInvested,
      activeInvestments,
      totalReturns,
      averageROI,
      portfolioValue,
    };
  },
};

// ============================================================================
// TICKET API
// ============================================================================

export const ticketApi = {
  /**
   * Batch mint tickets (mirrors TicketNFT.batchMint)
   * @param eventId Event identifier
   * @param quantity Number of tickets to mint
   * @param ticketType Type of ticket (VIP, REGULAR, etc.)
   * @param price Price per ticket in USDC
   * @param metadataUri IPFS metadata URI
   * @returns Array of minted ticket token IDs
   */
  async batchMint(
    eventId: string,
    quantity: number,
    ticketType: TicketType,
    price: number,
    metadataUri: string
  ): Promise<number[]> {
    await sleep(API_DELAY());

    if (quantity <= 0 || quantity > 10000) {
      throw new Error('Invalid quantity (1-10000)');
    }
    if (price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const tickets: TicketNFT[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS) || '[]');

    // Get current max tokenId
    const maxTokenId = tickets.length > 0 ? Math.max(...tickets.map(t => t.tokenId)) : -1;

    const tokenIds: number[] = [];
    const newTickets: TicketNFT[] = [];

    for (let i = 0; i < quantity; i++) {
      const tokenId = maxTokenId + 1 + i;
      const newTicket: TicketNFT = {
        ticketId: generateId('TKT'),
        eventId,
        tokenId,
        nftContractAddress: '0xTicketNFTContract00000000000000000000000',
        ticketType,
        price,
        ownerAddress: '0xOrganizer0000000000000000000000000000000', // Minted to organizer initially
        status: 'AVAILABLE',
        metadataUri,
        mintedAt: new Date().toISOString(),
      };
      newTickets.push(newTicket);
      tokenIds.push(tokenId);
    }

    tickets.push(...newTickets);
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));

    return tokenIds;
  },

  async getTicketsByEvent(eventId: string): Promise<TicketNFT[]> {
    await sleep(API_DELAY());
    const tickets: TicketNFT[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS) || '[]');
    return tickets.filter((t) => t.eventId === eventId);
  },

  async getTicketsByOwner(ownerAddress: string): Promise<TicketNFT[]> {
    await sleep(API_DELAY());
    const tickets: TicketNFT[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS) || '[]');
    return tickets.filter((t) => t.ownerAddress.toLowerCase() === ownerAddress.toLowerCase());
  },

  async purchaseTicket(ticketId: string, fanAddress: string, vaultId: string): Promise<TicketSale> {
    await sleep(API_DELAY());

    // Update ticket status
    const tickets: TicketNFT[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS) || '[]');
    const ticketIndex = tickets.findIndex((t) => t.ticketId === ticketId);
    if (ticketIndex === -1) throw new Error('Ticket not found');

    const ticketPrice = tickets[ticketIndex].price;

    tickets[ticketIndex].status = 'OWNED';
    tickets[ticketIndex].ownerAddress = fanAddress;
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));

    // Deposit to escrow (mirroring Escrow.deposit)
    const escrows: any[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ESCROW) || '[]');
    let escrow = escrows.find((e) => e.vaultId === vaultId);
    if (!escrow) {
      escrow = { vaultId, balance: 0, isSettled: false };
      escrows.push(escrow);
    }
    escrow.balance += ticketPrice;
    localStorage.setItem(STORAGE_KEYS.ESCROW, JSON.stringify(escrows));

    // Create sale record
    const sales: TicketSale[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SALES) || '[]');
    const newSale: TicketSale = {
      saleId: generateId('SAL'),
      ticketId,
      fanId: 'USR-003', // Mock fan ID
      vaultId,
      salePrice: ticketPrice,
      transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      purchasedAt: new Date().toISOString(),
    };
    sales.push(newSale);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));

    return newSale;
  },

  /**
   * Simple ticket creation for demo (combines minting and immediate ownership)
   */
  async createTicket(ticketData: Omit<TicketNFT, 'ticketId' | 'tokenId' | 'nftContractAddress' | 'mintedAt'>): Promise<TicketNFT> {
    await sleep(API_DELAY());

    const tickets: TicketNFT[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS) || '[]');
    const maxTokenId = tickets.length > 0 ? Math.max(...tickets.map(t => t.tokenId)) : -1;

    const newTicket: TicketNFT = {
      ...ticketData,
      ticketId: generateId('TKT'),
      tokenId: maxTokenId + 1,
      nftContractAddress: '0xTicketNFTContract00000000000000000000000',
      mintedAt: new Date().toISOString(),
    };

    tickets.push(newTicket);
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));

    return newTicket;
  },
};

// ============================================================================
// ORGANIZER STATS API
// ============================================================================

export const organizerApi = {
  async getOrganizerStats(organizerId: string): Promise<OrganizerStats> {
    await sleep(API_DELAY());
    const events: Event[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
    const organizerEvents = events.filter((e) => e.organizerId === organizerId);

    const totalEvents = organizerEvents.length;
    const upcomingEvents = organizerEvents.filter((e) => new Date(e.eventDate) > new Date()).length;
    const completedEvents = organizerEvents.filter((e) => e.status === 'COMPLETED').length;
    const totalTicketsSold = Math.floor(Math.random() * 50000); // Mock
    const totalRevenue = Math.floor(Math.random() * 500000); // Mock
    const vaults: Vault[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULTS) || '[]');
    const activeVaults = vaults.filter((v) => v.vaultStatus === 'ACTIVE').length;

    return {
      totalEvents,
      totalTicketsSold,
      totalRevenue,
      activeVaults,
      upcomingEvents,
      completedEvents,
    };
  },
};

// ============================================================================
// SCANNER API (Mirrors GateScanner Smart Contract)
// ============================================================================

export const scannerApi = {
  /**
   * Scan ticket at gate (mirrors GateScanner.scanTicket)
   * Steps:
   * 1. Verify ticket is valid
   * 2. Burn ticket NFT (mark as SCANNED/BURNED)
   * 3. Mint attendance NFT to organizer
   * 4. Reduce vault debt by ticket price
   * 5. Update scan statistics
   */
  async scanTicket(ticketId: string, gateId: string, attendanceMetadataUri?: string): Promise<{
    scanId: string;
    attendanceTokenId: number;
    debtReduced: number;
  }> {
    await sleep(API_DELAY());

    // 1. Verify ticket is valid
    const tickets: TicketNFT[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS) || '[]');
    const ticketIndex = tickets.findIndex((t) => t.ticketId === ticketId);
    if (ticketIndex === -1) throw new Error('Ticket not found');

    const ticket = tickets[ticketIndex];
    if (ticket.status === 'SCANNED' || ticket.status === 'BURNED') {
      throw new Error('Ticket already scanned');
    }

    // Get event to find associated vault
    const events: Event[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
    const event = events.find((e) => e.eventId === ticket.eventId);
    if (!event) throw new Error('Event not found');

    // Find vault for this event
    const vaults: Vault[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULTS) || '[]');
    const vaultIndex = vaults.findIndex((v) => v.eventId === ticket.eventId);
    if (vaultIndex === -1) throw new Error('Vault not found for event');

    const vault = vaults[vaultIndex];
    const ticketPrice = ticket.price;

    // 2. Burn ticket NFT
    tickets[ticketIndex].status = 'BURNED';
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));

    // 3. Mint attendance NFT to organizer
    const attendanceNFTs: AttendanceNFT[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE_NFTS) || '[]');
    const attendanceTokenId = attendanceNFTs.length;
    const scanTimestamp = new Date().toISOString();

    const attendanceNFT: AttendanceNFT = {
      attendanceId: generateId('ATT'),
      scanId: generateId('SCN'),
      organizerId: event.organizerId,
      tokenId: attendanceTokenId,
      nftContractAddress: '0xAttendanceNFTContract0000000000000000000',
      metadataUri: attendanceMetadataUri || `ipfs://attendance/${ticket.tokenId}`,
      mintedAt: scanTimestamp,
    };
    attendanceNFTs.push(attendanceNFT);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_NFTS, JSON.stringify(attendanceNFTs));

    // 4. Reduce vault debt automatically
    if (vault.debtRemaining >= ticketPrice) {
      vaults[vaultIndex].debtRemaining -= ticketPrice;
    } else {
      vaults[vaultIndex].debtRemaining = 0;
    }
    localStorage.setItem(STORAGE_KEYS.VAULTS, JSON.stringify(vaults));

    // 5. Create scan record
    const scans: TicketScan[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCANS) || '[]');
    const newScan: TicketScan = {
      scanId: attendanceNFT.scanId,
      ticketId,
      gateId,
      scannerAddress: '0xScanner00000000000000000000000000000000',
      scannedAt: scanTimestamp,
      transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    };
    scans.push(newScan);
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scans));

    return {
      scanId: newScan.scanId,
      attendanceTokenId,
      debtReduced: ticketPrice,
    };
  },

  /**
   * Get scan statistics for an event
   */
  async getEventStats(eventId: string): Promise<{
    totalScans: number;
    vaultId: string | null;
    organizerAddress: string | null;
  }> {
    await sleep(API_DELAY());

    const scans: TicketScan[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCANS) || '[]');
    const tickets: TicketNFT[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS) || '[]');
    const vaults: Vault[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULTS) || '[]');

    // Get all ticket IDs for this event
    const eventTicketIds = tickets.filter((t) => t.eventId === eventId).map((t) => t.ticketId);

    // Count scans for this event's tickets
    const totalScans = scans.filter((s) => eventTicketIds.includes(s.ticketId)).length;

    // Find vault for this event
    const vault = vaults.find((v) => v.eventId === eventId);

    return {
      totalScans,
      vaultId: vault?.vaultId || null,
      organizerAddress: vault?.organizerAddress || null,
    };
  },
};

// ============================================================================
// ESCROW & SETTLEMENT API (Mirrors Escrow Smart Contract)
// ============================================================================

export const escrowApi = {
  /**
   * Get escrow balance for a vault
   */
  async getBalance(vaultId: string): Promise<EscrowBalance> {
    await sleep(API_DELAY());
    const escrows: EscrowBalance[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ESCROW) || '[]');
    const escrow = escrows.find((e) => e.vaultId === vaultId);
    if (!escrow) {
      return { vaultId, balance: 0, isSettled: false };
    }
    return escrow;
  },

  /**
   * Distribute settlement after event (mirrors Escrow.distributeSettlement)
   * Formula:
   * - Investor Payout = loanAmount + (loanAmount * yieldRate / 10000)
   * - Platform Fee = totalRevenue * 3%
   * - Organizer Payout = totalRevenue - investorPayout - platformFee
   */
  async distributeSettlement(vaultId: string): Promise<SettlementDistribution> {
    await sleep(API_DELAY());

    const vaults: Vault[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULTS) || '[]');
    const vaultIndex = vaults.findIndex((v) => v.vaultId === vaultId);
    if (vaultIndex === -1) throw new Error('Vault not found');

    const vault = vaults[vaultIndex];

    if (vault.vaultStatus !== 'ACTIVE') {
      throw new Error('Vault must be ACTIVE to settle');
    }

    // Get escrow balance
    const escrows: EscrowBalance[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ESCROW) || '[]');
    const escrowIndex = escrows.findIndex((e) => e.vaultId === vaultId);
    if (escrowIndex === -1 || escrows[escrowIndex].isSettled) {
      throw new Error('Escrow already settled or not found');
    }

    const totalRevenue = escrows[escrowIndex].balance;

    // Calculate investor payout (principal + yield)
    const investorPayout = vault.loanAmount + ((vault.loanAmount * vault.yieldRate) / 10000);

    // Calculate platform fee (3%)
    const platformFee = (totalRevenue * 300) / 10000;

    // Calculate organizer payout (remainder)
    let organizerPayout = 0;
    if (totalRevenue > investorPayout + platformFee) {
      organizerPayout = totalRevenue - investorPayout - platformFee;
    }

    // Update vault status
    vaults[vaultIndex].vaultStatus = 'SETTLED';
    vaults[vaultIndex].debtRemaining = 0;
    localStorage.setItem(STORAGE_KEYS.VAULTS, JSON.stringify(vaults));

    // Mark escrow as settled
    escrows[escrowIndex].isSettled = true;
    escrows[escrowIndex].balance = 0;
    localStorage.setItem(STORAGE_KEYS.ESCROW, JSON.stringify(escrows));

    // Create settlement record
    const settlements: SettlementDistribution[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTLEMENTS) || '[]');
    const settlement: SettlementDistribution = {
      vaultId,
      totalRevenue,
      investorPayout,
      platformFee,
      organizerPayout,
      distributedAt: new Date().toISOString(),
    };
    settlements.push(settlement);
    localStorage.setItem(STORAGE_KEYS.SETTLEMENTS, JSON.stringify(settlements));

    console.log(`[SETTLEMENT DISTRIBUTED] ${vaultId}:`, {
      totalRevenue,
      investorPayout,
      platformFee,
      organizerPayout,
    });

    return settlement;
  },

  /**
   * Get all settlements
   */
  async getAllSettlements(): Promise<SettlementDistribution[]> {
    await sleep(API_DELAY());
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTLEMENTS) || '[]');
  },

  /**
   * Get settlement for specific vault
   */
  async getSettlement(vaultId: string): Promise<SettlementDistribution | null> {
    await sleep(API_DELAY());
    const settlements: SettlementDistribution[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTLEMENTS) || '[]');
    return settlements.find((s) => s.vaultId === vaultId) || null;
  },
};

// ============================================================================
// SYSTEM UTILITIES - RESET & CLEAR
// ============================================================================

/**
 * Initialize storage with completely empty data (no mock data)
 * Perfect for starting fresh without any dummy data
 */
function initializeEmptyStorage() {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers)); // Keep users for login
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify([])); // Empty events
  localStorage.setItem(STORAGE_KEYS.VAULTS, JSON.stringify([])); // Empty vaults
  localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify([])); // Empty investments
  localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify([])); // Empty tickets
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([])); // Empty sales
  localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify([])); // Empty scans
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE_NFTS, JSON.stringify([])); // Empty attendance NFTs
  localStorage.setItem(STORAGE_KEYS.ESCROW, JSON.stringify([])); // Empty escrow
  localStorage.setItem(STORAGE_KEYS.SETTLEMENTS, JSON.stringify([])); // Empty settlements
}

/**
 * Reset all demo data to completely fresh state (no dummy data)
 * Clears all localStorage data and initializes with empty arrays
 */
export function resetAllDemoData() {
  // Clear all Sonnetix data keys
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });

  // Also clear the Zustand persist store
  localStorage.removeItem('sonnetix-app-storage');

  // Initialize with empty data (no mock events/vaults/etc)
  initializeEmptyStorage();

  console.log('✅ All demo data has been reset to completely fresh state (no dummy data)');
}

/**
 * Clear ALL localStorage data (including third-party)
 * WARNING: This will clear everything in localStorage
 */
export function clearAllLocalStorage() {
  localStorage.clear();

  // Re-initialize mock data
  initializeStorage();

  console.log('✅ All localStorage has been cleared and reinitialized');
}

/**
 * Get current data statistics
 */
export function getDataStats() {
  return {
    users: JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]').length,
    events: JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]').length,
    vaults: JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULTS) || '[]').length,
    investments: JSON.parse(localStorage.getItem(STORAGE_KEYS.INVESTMENTS) || '[]').length,
    tickets: JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS) || '[]').length,
    sales: JSON.parse(localStorage.getItem(STORAGE_KEYS.SALES) || '[]').length,
    scans: JSON.parse(localStorage.getItem(STORAGE_KEYS.SCANS) || '[]').length,
  };
}
