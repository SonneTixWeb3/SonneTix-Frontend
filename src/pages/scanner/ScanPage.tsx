import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Alert, Input } from '@/components/ui';
import { scannerApi } from '@/lib/mockApi';

export const ScannerPage: React.FC = () => {
  const [scanning, setScanning] = React.useState(false);
  const [ticketId, setTicketId] = React.useState('');
  const [result, setResult] = React.useState<{
    success: boolean;
    message: string;
    details?: {
      scanId: string;
      attendanceTokenId: number;
      debtReduced: number;
    }
  } | null>(null);

  const handleScan = async () => {
    if (!ticketId.trim()) {
      setResult({
        success: false,
        message: '❌ Please enter a ticket ID',
      });
      return;
    }

    setScanning(true);
    setResult(null);

    try {
      // Use real mock API with smart contract logic
      const scanResult = await scannerApi.scanTicket(ticketId, 'GATE-A');

      setResult({
        success: true,
        message: `✅ Ticket verified! Access granted.\n💰 Vault debt reduced by $${scanResult.debtReduced}`,
        details: scanResult,
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: `❌ ${error.message || 'Invalid ticket or already scanned'}`,
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="mb-2">Scan Tickets</h2>
        <p className="font-hand text-paper-600">
          Scan QR codes to verify and admit attendees
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>QR Code Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Scanner Placeholder */}
            <div className="aspect-square w-full max-w-md mx-auto border-3 border-ink rounded-lg flex items-center justify-center bg-paper-100">
              {scanning ? (
                <div className="text-center">
                  <div className="spinner-cartoon mx-auto mb-4"></div>
                  <p className="font-hand">Scanning...</p>
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-6xl mb-4">📱</p>
                  <p className="font-comic font-bold text-xl">Ready to Scan</p>
                  <p className="font-hand text-paper-600 mt-2">
                    Position QR code within the frame
                  </p>
                </div>
              )}
            </div>

            {/* Manual Entry Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ticket ID (Manual Entry)
              </label>
              <Input
                type="text"
                placeholder="Enter ticket ID (e.g., TKT-001)"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                disabled={scanning}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !scanning) {
                    handleScan();
                  }
                }}
              />
            </div>

            {/* Result */}
            {result && (
              <Alert variant={result.success ? 'success' : 'danger'}>
                <div className="whitespace-pre-line">{result.message}</div>
                {result.details && (
                  <div className="mt-2 text-xs opacity-75">
                    <div>Scan ID: {result.details.scanId}</div>
                    <div>Attendance NFT #{result.details.attendanceTokenId}</div>
                  </div>
                )}
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleScan}
                disabled={scanning || !ticketId.trim()}
                className="btn-primary flex-1"
              >
                {scanning ? 'Scanning...' : 'Scan Ticket'}
              </button>
              <button
                onClick={() => {
                  setTicketId('');
                  setResult(null);
                }}
                className="btn-outline"
                disabled={scanning}
              >
                Clear
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="font-hand text-sm text-paper-600 mb-1">Today</p>
            <p className="font-comic font-bold text-3xl">247</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="font-hand text-sm text-paper-600 mb-1">Valid</p>
            <p className="font-comic font-bold text-3xl text-green-700">245</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="font-hand text-sm text-paper-600 mb-1">Invalid</p>
            <p className="font-comic font-bold text-3xl text-red-700">2</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
