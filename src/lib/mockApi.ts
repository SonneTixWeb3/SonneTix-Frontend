/**
 * Mock API Service
 *
 * Simulates backend API with realistic delays and localStorage persistence.
 * This makes it easy to migrate to real API endpoints later.
 */

import { sleep, generateId } from './utils';
import { mockUsers } from '@/data/mockUsers';
import { mockEvents } from '@/data/mockEvents';
import { mockVaults, mockInvestments } from '@/data/mockVaults';
import { mockTickets, mockTicketSales } from '@/data/mockTickets';
import type {
  User,
  Event,
  Vault,
  Investment,
  TicketNFT,
  TicketSale,
  OrganizerStats,
  InvestorStats,
  VaultAnalytics,
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
};

// Initialize localStorage with mock data
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(mockEvents));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VAULTS)) {
    localStorage.setItem(STORAGE_KEYS.VAULTS, JSON.stringify(mockVaults));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVESTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(mockInvestments));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TICKETS)) {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(mockTickets));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(mockTicketSales));
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

  async createInvestment(investmentData: Omit<Investment, 'investmentId' | 'investedAt'>): Promise<Investment> {
    await sleep(API_DELAY());
    const investments: Investment[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVESTMENTS) || '[]');
    const newInvestment: Investment = {
      ...investmentData,
      investmentId: generateId('INV'),
      investedAt: new Date().toISOString(),
    };
    investments.push(newInvestment);
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments));

    // Update vault total funded
    const vaults: Vault[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.VAULTS) || '[]');
    const vaultIndex = vaults.findIndex((v) => v.vaultId === investmentData.vaultId);
    if (vaultIndex !== -1) {
      vaults[vaultIndex].totalFunded += investmentData.amount;
      localStorage.setItem(STORAGE_KEYS.VAULTS, JSON.stringify(vaults));
    }

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

    tickets[ticketIndex].status = 'OWNED';
    tickets[ticketIndex].ownerAddress = fanAddress;
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));

    // Create sale record
    const sales: TicketSale[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SALES) || '[]');
    const newSale: TicketSale = {
      saleId: generateId('SAL'),
      ticketId,
      fanId: 'USR-003', // Mock fan ID
      vaultId,
      salePrice: tickets[ticketIndex].price,
      transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      purchasedAt: new Date().toISOString(),
    };
    sales.push(newSale);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));

    return newSale;
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
    const activeVaults = mockVaults.filter((v) => v.vaultStatus === 'ACTIVE').length;

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
