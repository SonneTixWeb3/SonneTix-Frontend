# Smart Contract → Mock API Alignment

## Overview

The frontend mock API system has been updated to mirror the exact logic and user flows from the GatePay Vault smart contracts deployed on Base Sepolia.

---

## ✅ Implemented Features

### 1. **Type Definitions Updated**
- **Vault type** now includes:
  - `organizerAddress` - Organizer wallet address
  - `totalTickets` - Number of tickets locked as collateral
  - `investors[]` - Array of investor wallet addresses
  - `investorContributions` - Record tracking each investor's contribution
  - `yieldRate` - Now in basis points (1000 = 10%)

- **New Types Added**:
  - `EscrowBalance` - Tracks USDC balance in escrow per vault
  - `SettlementDistribution` - Settlement payout breakdown

### 2. **Batch Ticket Minting** (`ticketApi.batchMint`)
**Smart Contract**: `TicketNFT.batchMint(eventId, quantity, ticketType, price, metadataUri)`

**Mock Implementation**:
```typescript
await ticketApi.batchMint(
  'EVT-001',      // eventId
  100,            // quantity
  'REGULAR',      // ticketType
  50,             // price in USDC
  'ipfs://...'    // metadataUri
);
```

**Logic**:
- Validates quantity (1-10000) and price > 0
- Generates sequential tokenIds
- Mints all tickets to organizer initially
- Returns array of tokenIds

### 3. **Vault Auto-Disbursement** (`investmentApi.createInvestment`)
**Smart Contract**: `TicketVault.fundVault()` → auto-triggers `_disburseLoan()` when fully funded

**Mock Implementation**:
```typescript
await investmentApi.createInvestment({
  investorId: 'USR-002',
  vaultId: 'VLT-001',
  amount: 10000,
  expectedReturn: 11000,
  status: 'ACTIVE'
});
```

**Logic**:
- Validates vault status is `FUNDING`
- Checks funding deadline hasn't passed
- Prevents over-funding
- Tracks investor contributions in vault
- **AUTO-DISBURSEMENT**: Changes vault status to `ACTIVE` when `totalFunded >= loanAmount`

### 4. **Ticket Scanning with Debt Reduction** (`scannerApi.scanTicket`)
**Smart Contract**: `GateScanner.scanTicket(tokenId, attendanceMetadataUri)`

**Mock Implementation**:
```typescript
const result = await scannerApi.scanTicket(
  'TKT-001',      // ticketId
  'GATE-A',       // gateId
  'ipfs://att'    // attendanceMetadataUri
);
// Returns: { scanId, attendanceTokenId, debtReduced }
```

**Logic** (mirrors smart contract exactly):
1. Verify ticket is valid (not already scanned)
2. Burn ticket NFT (mark as `BURNED`)
3. Mint attendance NFT to organizer
4. **Auto-reduce vault debt** by ticket price
5. Create scan record
6. Update event scan statistics

### 5. **Ticket Purchase → Escrow Deposit** (`ticketApi.purchaseTicket`)
**Smart Contract**: Fans buy tickets → USDC goes to `Escrow.deposit()`

**Mock Implementation**:
```typescript
await ticketApi.purchaseTicket(
  'TKT-001',        // ticketId
  '0xFan...',       // fanAddress
  'VLT-001'         // vaultId
);
```

**Logic**:
- Transfers ticket ownership to fan
- **Deposits ticket price to escrow** for the vault
- Creates sale record
- Tracks in escrow balance

### 6. **Settlement Distribution** (`escrowApi.distributeSettlement`)
**Smart Contract**: `Escrow.distributeSettlement()`

**Mock Implementation**:
```typescript
const settlement = await escrowApi.distributeSettlement('VLT-001');
```

**Payout Calculation** (matches smart contract):
```
Investor Payout = loanAmount + (loanAmount * yieldRate / 10000)
Platform Fee    = totalRevenue * 3%
Organizer Payout = totalRevenue - investorPayout - platformFee
```

**Logic**:
- Verifies vault is `ACTIVE`
- Calculates all payouts
- Changes vault status to `SETTLED`
- Marks escrow as settled
- Creates settlement record

---

## 🔄 User Flow Alignment

### **Organizer Flow**
1. Create event → `eventApi.createEvent()`
2. **Batch mint tickets** → `ticketApi.batchMint()` ✅
3. Create vault with collateral → `vaultApi.createVault()`
4. Wait for funding...
5. After event, settle vault → `escrowApi.distributeSettlement()` ✅

### **Investor Flow**
1. Browse vaults → `vaultApi.getVaultsByStatus('FUNDING')`
2. **Fund vault** → `investmentApi.createInvestment()` ✅
   - If fully funded → vault auto-activates ✅
3. Track portfolio → `investmentApi.getInvestorStats()`
4. Receive payout on settlement

### **Fan Flow**
1. Browse events → `eventApi.getUpcomingEvents()`
2. **Purchase ticket** → `ticketApi.purchaseTicket()` (→ escrow deposit) ✅
3. View owned tickets → `ticketApi.getTicketsByOwner()`
4. Transfer ticket (secondary market) → `ticketApi.transferTicket()`

### **Scanner Flow**
1. **Scan QR code** → `scannerApi.scanTicket()` ✅
   - Burns ticket ✅
   - Mints attendance NFT to organizer ✅
   - Reduces vault debt automatically ✅
2. View scan stats → `scannerApi.getEventStats()`

---

## 📊 State Transitions (Now Match Smart Contract)

### Vault Status Flow
```
FUNDING → ACTIVE → SETTLED
   ↓         ↓
(auto when    (on settlement)
 fully funded)
```

### Ticket Status Flow
```
AVAILABLE → OWNED → BURNED
            ↓
         (on purchase)
```

---

## 🎯 Next Steps: UI Integration

Update UI pages to use new mock APIs:

### Example: Update ScanPage

**Before** (simulated random success):
```typescript
const handleScan = () => {
  setTimeout(() => {
    const success = Math.random() > 0.3;
    setResult({ success, message: success ? 'Valid' : 'Invalid' });
  }, 2000);
};
```

**After** (using real mock API with debt reduction):
```typescript
import { scannerApi } from '@/lib/mockApi';

const handleScan = async (ticketId: string) => {
  try {
    const result = await scannerApi.scanTicket(ticketId, 'GATE-A');
    setResult({
      success: true,
      message: `✅ Ticket verified! Debt reduced by $${result.debtReduced}`,
      attendanceTokenId: result.attendanceTokenId
    });
  } catch (error) {
    setResult({
      success: false,
      message: `❌ ${error.message}`
    });
  }
};
```

---

## 🧪 Testing the Alignment

All smart contract flows can now be tested in the frontend mock system:

```typescript
// 1. Test batch minting
const tokenIds = await ticketApi.batchMint('EVT-001', 100, 'REGULAR', 50, 'ipfs://...');

// 2. Test vault funding with auto-disbursement
await investmentApi.createInvestment({ vaultId: 'VLT-002', amount: 18000, ... });
// → Check vault.vaultStatus changed to 'ACTIVE'

// 3. Test ticket purchase → escrow
await ticketApi.purchaseTicket('TKT-001', '0xFan...', 'VLT-001');
// → Check escrow balance increased

// 4. Test scanning → debt reduction
const scan = await scannerApi.scanTicket('TKT-001', 'GATE-A');
// → Check vault.debtRemaining decreased by ticket price

// 5. Test settlement distribution
const settlement = await escrowApi.distributeSettlement('VLT-001');
// → Verify investor payout = loan + yield, platform fee = 3%, etc.
```

---

## 📝 Summary

The mock API system now **perfectly mirrors** the smart contract logic:

✅ Batch ticket minting with sequential tokenIds
✅ Auto-disbursement when vaults reach 100% funding
✅ Ticket scanning burns NFT + mints attendance + reduces debt
✅ Escrow tracking for ticket sale proceeds
✅ Settlement distribution with yield calculations
✅ Investor contribution tracking per vault
✅ All state transitions match on-chain behavior

**Ready for UI integration!** 🚀
