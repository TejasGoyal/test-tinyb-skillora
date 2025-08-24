import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Download, Receipt, AlertCircle } from 'lucide-react';

interface FeeRecord {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  receiptUrl?: string;
}

interface FeesCardProps {
  fees: FeeRecord[];
  studentName?: string;
  totalDue: number;
}

export function FeesCard({ fees, studentName, totalDue }: FeesCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'overdue':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <Receipt className="h-3 w-3 text-success" />;
      case 'pending':
        return <DollarSign className="h-3 w-3 text-warning" />;
      case 'overdue':
        return <AlertCircle className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  const sortedFees = fees.sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="h-4 w-4 text-school-primary" />
          {studentName ? `${studentName}'s Fees` : 'Fee Management'}
        </CardTitle>
        <CardDescription>
          {totalDue > 0 ? `$${totalDue} due` : 'All fees up to date'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {totalDue > 0 && (
            <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span className="font-medium text-sm">Outstanding Balance</span>
              </div>
              <p className="text-lg font-bold text-warning">${totalDue}</p>
              <Button size="sm" className="mt-2">
                Pay Now
              </Button>
            </div>
          )}
          
          {sortedFees.slice(0, 6).map((fee) => (
            <div
              key={fee.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(fee.status)}
                  <h4 className="font-medium text-sm">{fee.type}</h4>
                  <Badge
                    variant="outline"
                    className={`text-xs capitalize ${getStatusColor(fee.status)}`}
                  >
                    {fee.status}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                  <span>Amount: ${fee.amount}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Due: {new Date(fee.dueDate).toLocaleDateString()}</span>
                  {fee.paidDate && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span>Paid: {new Date(fee.paidDate).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {fee.receiptUrl && (
                  <Button size="sm" variant="outline" className="h-7 px-2">
                    <Download className="h-3 w-3" />
                  </Button>
                )}
                {fee.status === 'pending' && (
                  <Button size="sm" className="h-7 px-3 text-xs">
                    Pay
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {fees.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No fee records found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}