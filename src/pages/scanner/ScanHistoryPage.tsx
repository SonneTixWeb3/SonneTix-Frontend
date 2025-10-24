import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { formatDate } from '@/lib/utils';

interface ScanRecord {
  scanId: string;
  ticketId: string;
  eventName: string;
  scanTime: Date;
  status: 'VALID' | 'INVALID' | 'USED';
  seatNumber?: string;
}

export const ScanHistoryPage: React.FC = () => {
  const [scans] = React.useState<ScanRecord[]>([
    {
      scanId: 'SCAN-001',
      ticketId: 'TKT-12345',
      eventName: 'Summer Music Festival 2024',
      scanTime: new Date(),
      status: 'VALID',
      seatNumber: 'A12'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'danger' | 'warning'> = {
      'VALID': 'success',
      'INVALID': 'danger',
      'USED': 'warning'
    };
    return <Badge variant={variants[status] || 'info'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Scan History</h2>
        <p className="text-sm text-gray-600">
          View all ticket scan records
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scans.map((scan) => (
              <button
                key={scan.scanId}
                onClick={() => alert(`Scan Details\n\nEvent: ${scan.eventName}\nTicket ID: ${scan.ticketId}\nSeat: ${scan.seatNumber || 'General Admission'}\nStatus: ${scan.status}\nScanned: ${formatDate(scan.scanTime.toISOString())}\n\nDetailed scan logs coming soon!`)}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer text-left"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{scan.eventName}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Ticket #{scan.ticketId} • {scan.seatNumber ? `Seat ${scan.seatNumber}` : 'General Admission'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Scanned {formatDate(scan.scanTime.toISOString())}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(scan.status)}
                </div>
              </button>
            ))}
          </div>

          {scans.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No scans recorded yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
