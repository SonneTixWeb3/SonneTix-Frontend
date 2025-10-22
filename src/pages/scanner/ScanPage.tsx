import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Alert } from '@/components/ui';

export const ScannerPage: React.FC = () => {
  const [scanning, setScanning] = React.useState(false);
  const [result, setResult] = React.useState<{ success: boolean; message: string } | null>(null);

  const handleScan = () => {
    setScanning(true);
    setResult(null);

    // Simulate scan
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setResult({
        success,
        message: success
          ? 'Ticket verified! ✅ Access granted.'
          : 'Invalid ticket or already scanned ❌',
      });
      setScanning(false);
    }, 2000);
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

            {/* Result */}
            {result && (
              <Alert variant={result.success ? 'success' : 'danger'}>
                {result.message}
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleScan}
                disabled={scanning}
                className="btn-primary flex-1"
              >
                {scanning ? 'Scanning...' : 'Start Scan'}
              </button>
              <button className="btn-outline">
                Manual Entry
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
