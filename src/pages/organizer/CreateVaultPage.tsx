import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { eventApi, vaultApi } from '@/lib/mockApi';
import { useAppStore } from '@/lib/store';
import { Event } from '@/types';

interface CreateVaultPageProps {
  eventId: string;
  onNavigate?: (path: string) => void;
}

export const CreateVaultPage: React.FC<CreateVaultPageProps> = ({ eventId, onNavigate }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);

  // Form data
  const [collateralTickets, setCollateralTickets] = useState(0);
  const [requestedLoan, setRequestedLoan] = useState(0);
  const currentUserId = useAppStore((state) => state.currentUserId);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const eventData = await eventApi.getEventById(eventId);
      setEvent(eventData);
    } catch (error) {
      console.error('Failed to load event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !event) {
    return <div className="flex items-center justify-center h-64"><div className="spinner-cartoon"></div></div>;
  }

  // Calculate metrics
  const collateralValue = collateralTickets * event.ticketPrice;
  const maxLoan = collateralValue * 0.7; // 70% LTV max
  const ltv = requestedLoan > 0 ? (requestedLoan / collateralValue) * 100 : 0;
  const yieldRate = ltv > 60 ? 15 : ltv > 40 ? 10 : 5; // Risk-based yield
  const riskScore = ltv > 60 ? 80 : ltv > 40 ? 50 : 20; // Numeric risk score
  const riskLabel = ltv > 60 ? 'HIGH' : ltv > 40 ? 'MEDIUM' : 'LOW';

  const handleDeployVault = async () => {
    setIsDeploying(true);

    try {
      // Mock vault deployment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create vault in mockApi - need to provide all required fields
      const fundingDeadline = new Date();
      fundingDeadline.setDate(fundingDeadline.getDate() + 30); // 30 days to fund

      const newVault = await vaultApi.createVault({
        eventId: event.eventId,
        organizerAddress: currentUserId!,
        smartContractAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
        loanAmount: requestedLoan,
        ltvRatio: ltv,
        yieldRate: yieldRate * 100, // Convert to basis points
        riskScore,
        vaultStatus: 'FUNDING',
        totalFunded: 0,
        totalReleased: 0,
        debtRemaining: requestedLoan,
        totalTickets: collateralTickets,
        fundingDeadline: fundingDeadline.toISOString(),
        investors: [],
        investorContributions: {},
      });

      console.log('Vault deployed:', newVault);

      // Navigate to vaults page
      onNavigate?.('/organizer/vaults');
    } catch (error) {
      console.error('Failed to deploy vault:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  const canProceedStep1 = collateralTickets > 0 && collateralTickets <= event.totalTickets;
  const canProceedStep2 = requestedLoan > 0 && requestedLoan <= maxLoan;
  const canDeploy = canProceedStep1 && canProceedStep2;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Create Vault for Event</h2>
          <p className="text-sm text-gray-600">
            Secure funding by collateralizing your event tickets
          </p>
        </div>
        <button
          onClick={() => onNavigate?.('/organizer/events')}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>

      {/* Event Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{event.eventName}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {event.totalTickets} tickets @ {formatCurrency(event.ticketPrice)} each
              </p>
            </div>
            <Badge>{event.category}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg border-3 border-ink p-6">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step === currentStep
                      ? 'bg-blue-600 text-white scale-110 shadow-lg'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                <span className="text-xs mt-2 font-medium">
                  {step === 1 && 'Collateral'}
                  {step === 2 && 'Loan Amount'}
                  {step === 3 && 'Review'}
                  {step === 4 && 'Deploy'}
                </span>
              </div>
              {step < 4 && (
                <div
                  className={`w-16 h-1 mx-2 mt-[-20px] ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {/* Step 1: Select Collateral */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-xl mb-2">Select Collateral Tickets</h3>
                <p className="text-gray-600 text-sm">
                  Choose how many tickets you want to use as collateral for the vault
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Number of Tickets to Collateralize
                </label>

                {/* Number Input Field */}
                <div className="mb-4">
                  <input
                    type="number"
                    min="0"
                    max={event.totalTickets}
                    value={collateralTickets}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setCollateralTickets(Math.min(Math.max(0, value), event.totalTickets));
                    }}
                    className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-semibold text-center"
                    placeholder="Enter number of tickets"
                  />
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="0"
                  max={event.totalTickets}
                  value={collateralTickets}
                  onChange={(e) => setCollateralTickets(parseInt(e.target.value))}
                  className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>0</span>
                  <span className="font-bold text-blue-700 text-xl">{collateralTickets}</span>
                  <span>{event.totalTickets}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Collateral Tickets</div>
                  <div className="text-2xl font-bold text-gray-900">{collateralTickets}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Ticket Price</div>
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(event.ticketPrice)}</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-xs text-green-700 mb-1">Collateral Value</div>
                  <div className="text-2xl font-bold text-green-900">{formatCurrency(collateralValue)}</div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedStep1}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Set Loan Amount →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Request Loan */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-xl mb-2">Request Loan Amount</h3>
                <p className="text-gray-600 text-sm">
                  Specify how much funding you need (max 70% LTV)
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Loan Amount (USDC)
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxLoan}
                  step="100"
                  value={requestedLoan}
                  onChange={(e) => setRequestedLoan(parseFloat(e.target.value))}
                  className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{formatCurrency(0)}</span>
                  <span className="font-bold text-purple-700 text-xl">{formatCurrency(requestedLoan)}</span>
                  <span>{formatCurrency(maxLoan)}</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-yellow-800 text-sm">Auto-calculated LTV</div>
                    <div className="text-yellow-700 text-xs mt-1">
                      Your current LTV is {ltv.toFixed(1)}%. Maximum allowed is 70%.
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Collateral Value</div>
                  <div className="text-xl font-bold text-gray-900">{formatCurrency(collateralValue)}</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-xs text-purple-700 mb-1">Requested Loan</div>
                  <div className="text-xl font-bold text-purple-900">{formatCurrency(requestedLoan)}</div>
                </div>
                <div className={`rounded-lg p-4 border ${
                  ltv > 70 ? 'bg-red-50 border-red-200' : ltv > 60 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
                }`}>
                  <div className={`text-xs mb-1 ${ltv > 70 ? 'text-red-700' : ltv > 60 ? 'text-orange-700' : 'text-green-700'}`}>
                    Loan-to-Value
                  </div>
                  <div className={`text-xl font-bold ${ltv > 70 ? 'text-red-900' : ltv > 60 ? 'text-orange-900' : 'text-green-900'}`}>
                    {ltv.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-4">
                <button onClick={() => setCurrentStep(1)} className="btn-outline">
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!canProceedStep2}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Review Terms →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review Terms */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-xl mb-2">Review Vault Terms</h3>
                <p className="text-gray-600 text-sm">
                  Review the terms before deploying your vault contract
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Collateral Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tickets</span>
                      <span className="font-semibold">{collateralTickets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ticket Price</span>
                      <span className="font-semibold">{formatCurrency(event.ticketPrice)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium">Total Value</span>
                      <span className="font-bold text-green-600">{formatCurrency(collateralValue)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Loan Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Loan Amount</span>
                      <span className="font-semibold">{formatCurrency(requestedLoan)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">LTV Ratio</span>
                      <span className="font-semibold">{ltv.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium">Yield Rate</span>
                      <span className="font-bold text-purple-600">{yieldRate}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Assessment */}
              <div className={`rounded-lg p-4 border-2 ${
                riskLabel === 'HIGH' ? 'bg-red-50 border-red-300' :
                riskLabel === 'MEDIUM' ? 'bg-yellow-50 border-yellow-300' :
                'bg-green-50 border-green-300'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold">Risk Assessment</h4>
                  <Badge variant={riskLabel === 'HIGH' ? 'default' : riskLabel === 'MEDIUM' ? 'default' : 'success'}>
                    {riskLabel} RISK
                  </Badge>
                </div>
                <div className="text-sm text-gray-700 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">•</span>
                    <span>
                      <strong>Yield Rate:</strong> {yieldRate}% annual return for investors
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">•</span>
                    <span>
                      <strong>Repayment:</strong> Due after event completion and ticket sales settlement
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">•</span>
                    <span>
                      <strong>Collateral:</strong> {collateralTickets} tickets locked until vault settlement
                    </span>
                  </div>
                </div>
              </div>

              {/* Vault Contract Info */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-bold mb-2 text-sm">Vault Contract Details</h4>
                <div className="text-xs space-y-1 font-mono text-gray-600">
                  <div>Network: Base Sepolia (Testnet)</div>
                  <div>Smart Contract: TicketVault.sol</div>
                  <div>Collateral Token: TicketNFT (ERC-721)</div>
                  <div>Loan Currency: USDC (Base Sepolia)</div>
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-4">
                <button onClick={() => setCurrentStep(2)} className="btn-outline">
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  disabled={!canDeploy}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Deploy →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Deploy */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2">Deploy Vault Contract</h3>
                <p className="text-gray-600 text-sm">
                  Ready to deploy your vault on Base Sepolia
                </p>
              </div>

              {!isDeploying ? (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-primary rounded-lg p-6">
                    <div className="flex items-center justify-center mb-4">
                      <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-center text-lg mb-2">Vault Summary</h4>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Collateral</div>
                        <div className="font-bold text-lg">{collateralTickets} Tickets</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Loan Amount</div>
                        <div className="font-bold text-lg">{formatCurrency(requestedLoan)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">LTV Ratio</div>
                        <div className="font-bold text-lg">{ltv.toFixed(1)}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Yield Rate</div>
                        <div className="font-bold text-lg">{yieldRate}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm text-blue-800">
                        <strong>What happens next?</strong>
                        <ul className="mt-2 space-y-1 list-disc list-inside">
                          <li>Vault contract will be deployed to Base Sepolia</li>
                          <li>Your tickets will be locked as collateral (NFTs minted)</li>
                          <li>Vault enters FUNDING status for investors to contribute</li>
                          <li>Once fully funded, loan amount is transferred to you</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between gap-3 pt-4">
                    <button onClick={() => setCurrentStep(3)} className="btn-outline">
                      ← Back to Review
                    </button>
                    <button onClick={handleDeployVault} className="btn-primary">
                      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Deploy Vault Contract
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="spinner-cartoon mb-4"></div>
                  <h4 className="font-bold text-lg mb-2">Deploying Vault...</h4>
                  <p className="text-gray-600 text-sm">Please wait while we deploy your vault contract on Base Sepolia</p>
                  <div className="mt-6 space-y-2 text-sm text-gray-500">
                    <div>✓ Minting collateral NFTs...</div>
                    <div>✓ Deploying TicketVault contract...</div>
                    <div>⏳ Setting vault parameters...</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
