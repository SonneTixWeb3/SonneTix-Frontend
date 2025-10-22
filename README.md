# SonneTix Frontend - GatePay Vault Platform

**Event Ticketing & Investment Platform on Base Sepolia**

A complete Web3 frontend application for the GatePay Vault ecosystem, featuring event ticket financing, NFT ticketing, investor portfolios, and gate scanning functionality.

---

## 🎯 **Features**

### **Multi-Role Dashboard System**
- **🎭 Organizer Portal** - Create events, mint NFT tickets, set up vaults, track analytics
- **💰 Investor Portal** - Browse vaults, invest in events, track ROI and portfolio
- **🎉 Fan Marketplace** - Browse events, purchase NFT tickets, manage tickets
- **📱 Gate Scanner** - Scan QR codes, verify tickets, mint attendance NFTs

### **Web3 Integration**
- MetaMask wallet connection
- Base Sepolia testnet support
- ethers.js v6 for smart contract interactions
- USDC (Base Sepolia) payment support
- Real-time balance tracking

### **Black & White Paper Cartoon Theme**
- Hand-drawn, sketch-style UI components
- Paper texture backgrounds
- Animated shadows and effects
- Fully responsive design
- Accessibility-first approach

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- MetaMask browser extension
- Base Sepolia testnet ETH and USDC (for testing)

### **Installation**

```bash
# Clone the repository
git clone https://github.com/SonneTixWeb3/SonneTix-Frontend.git
cd SonneTix-Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

### **Build for Production**

```bash
npm run build
npm run preview
```

---

## 📁 **Project Structure**

```
src/
├── components/
│   ├── ui/                     # Base UI components (Button, Card, Input, etc.)
│   ├── shared/                 # Shared components (WalletConnect, Layout, etc.)
│   ├── organizer/              # Organizer-specific components
│   ├── investor/               # Investor-specific components
│   ├── fan/                    # Fan-specific components
│   └── scanner/                # Scanner-specific components
├── pages/
│   ├── organizer/              # Organizer pages
│   ├── investor/               # Investor pages
│   ├── fan/                    # Fan pages
│   └── scanner/                # Scanner pages
├── contexts/
│   └── Web3Context.tsx         # Web3 provider and hooks
├── hooks/
│   ├── useContract.ts          # Smart contract interaction hooks
│   └── index.ts
├── lib/
│   ├── utils.ts                # Utility functions
│   ├── mockApi.ts              # Mock API service
│   └── store.ts                # Zustand global state
├── data/                       # Mock data files
│   ├── mockUsers.ts
│   ├── mockEvents.ts
│   ├── mockVaults.ts
│   └── mockTickets.ts
├── types/
│   └── index.ts                # TypeScript type definitions
├── config/
│   └── contracts.ts            # Smart contract addresses & ABIs
├── styles/
│   └── index.css               # Global styles & Tailwind
└── App.tsx                     # Main app component

```

---

## 🎨 **Tech Stack**

### **Frontend Framework**
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### **Web3 & Blockchain**
- **ethers.js v6** - Ethereum library
- **Base Sepolia** - Layer 2 testnet
- **MetaMask** - Wallet integration

### **State Management**
- **Zustand** - Global state management
- **React Context** - Web3 provider

### **UI & Styling**
- **TailwindCSS** - Utility-first CSS
- **Radix UI** - Headless component primitives
- **Custom Cartoon Theme** - Hand-drawn aesthetic

### **Development**
- **Mock API** - localStorage-based fake backend
- **Hot Module Replacement** - Fast development
- **TypeScript** - Full type safety

---

## 🔌 **Web3 Integration**

### **Connecting Wallet**

The app automatically detects MetaMask. Click "Connect Wallet" in the header to connect.

### **Network Configuration**
- **Network**: Base Sepolia Testnet
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Block Explorer**: https://sepolia.basescan.org

### **Getting Test Tokens**
1. Get Base Sepolia ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Get USDC from Base Sepolia USDC faucet

### **Smart Contracts**
Contract addresses are configured in `src/config/contracts.ts`. Update these with your deployed contract addresses.

---

## 💾 **Mock Data System**

The app uses a complete mock API layer for development without a backend:

- **Data Storage**: localStorage
- **API Delay**: Simulated network delay (200-500ms)
- **Persistence**: Data persists across page reloads
- **Reset**: Clear browser localStorage to reset data

### **Mock API Endpoints**

All API calls are in `src/lib/mockApi.ts`:
- `userApi` - User authentication and management
- `eventApi` - Event CRUD operations
- `vaultApi` - Vault management and analytics
- `investmentApi` - Investment tracking and stats
- `ticketApi` - Ticket purchasing and ownership
- `organizerApi` - Organizer statistics

---

## 🎭 **Role-Based Features**

### **Organizer Role**
- Create and manage events
- Mint NFT tickets in batches
- Create vaults for event financing
- Track ticket sales and revenue
- View vault performance
- Manage event status

### **Investor Role**
- Browse available vaults
- View risk scores and projected returns
- Invest in event vaults (USDC)
- Track portfolio performance
- View investment history
- Monitor ROI and payouts

### **Fan Role**
- Browse upcoming events
- Purchase NFT tickets (USDC)
- View owned tickets with QR codes
- Transfer tickets (secondary market)
- Access ticket metadata

### **Scanner Role**
- Scan ticket QR codes at gates
- Verify ticket authenticity on-chain
- Burn tickets on successful scan
- Mint attendance NFTs to organizers
- Track daily scan statistics

---

## 🎨 **Component Library**

### **Base UI Components**
All components use the cartoon paper theme and are fully documented:

- `<Button>` - Primary, secondary, outline, danger variants
- `<Card>` - Paper card with sketch shadows
- `<Input>` / `<Textarea>` / `<Select>` - Form inputs
- `<Badge>` - Status badges
- `<Alert>` - Notifications and messages
- `<Spinner>` - Loading indicators
- `<Dialog>` - Modal dialogs
- `<Tabs>` - Tabbed interfaces
- `<Separator>` - Dividers

See [COMPONENTS.md](./COMPONENTS.md) for full API documentation.

---

## 🛠️ **Development Guide**

### **Adding a New Page**

1. Create page component in `src/pages/{role}/`
2. Import in `App.tsx`
3. Add to navigation in `Layout.tsx`

### **Adding a New Smart Contract**

1. Add address to `src/config/contracts.ts`:
   ```typescript
   export const CONTRACTS = {
     MY_CONTRACT: '0x...',
   };
   ```

2. Add ABI to `src/config/contracts.ts`:
   ```typescript
   export const ABIS = {
     MyContract: [/* ABI array */],
   };
   ```

3. Use in components:
   ```typescript
   const { getContract } = useWeb3();
   const myContract = getContract('MY_CONTRACT');
   ```

### **Creating Custom Components**

Follow the cartoon theme guidelines:
- Use `btn-cartoon` for buttons
- Use `paper-card` for containers
- Use `font-comic` for headers
- Use `font-hand` for body text
- Add `shadow-sketch` for depth

---

## 📚 **Documentation**

- **[COMPONENTS.md](./COMPONENTS.md)** - UI Component API Reference
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical Architecture
- **[MIGRATION.md](./MIGRATION.md)** - Backend Integration Guide

---

## 🔄 **Migration to Real Backend**

This frontend is designed to easily migrate from mock data to a real backend:

1. Replace `mockApi.ts` imports with real API client
2. Update API base URL in environment variables
3. Remove localStorage persistence
4. Add authentication tokens

See [MIGRATION.md](./MIGRATION.md) for detailed instructions.

---

## 🌐 **Environment Variables**

Create a `.env` file:

```env
# Network Configuration
VITE_CHAIN_ID=84532
VITE_RPC_URL=https://sepolia.base.org
VITE_BLOCK_EXPLORER=https://sepolia.basescan.org

# Contract Addresses (update with your deployments)
VITE_TICKET_NFT_ADDRESS=0x...
VITE_VAULT_ADDRESS=0x...
VITE_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e

# API Configuration (for future backend)
# VITE_API_BASE_URL=https://api.sonnetix.com
```

---

## 🧪 **Testing**

```bash
# Run type checking
npm run build

# Run linter
npm run lint
```

---

## 📱 **Browser Support**

- Chrome/Edge (recommended for MetaMask)
- Firefox
- Brave
- Mobile browsers with MetaMask mobile app

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 **License**

MIT License - see LICENSE file for details

---

## 🙏 **Acknowledgments**

- Built with [React](https://react.dev/)
- Powered by [ethers.js](https://docs.ethers.org/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Components from [Radix UI](https://www.radix-ui.com/)
- Deployed on [Base](https://base.org/)

---

## 📞 **Support**

- GitHub Issues: [Report Bug](https://github.com/SonneTixWeb3/SonneTix-Frontend/issues)
- Documentation: [Full Docs](./docs/)
- Email: support@sonnetix.com

---

**Built with ❤️ for the Web3 community**
