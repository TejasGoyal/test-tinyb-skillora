import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AttendanceData {
  date: string;
  status: 'present' | 'absent' | 'late';
  subject?: string;
}

interface AttendanceCardProps {
  studentName?: string;
  monthlyData: AttendanceData[];
  percentage: number;
}

export function AttendanceCard({ studentName, monthlyData, percentage }: AttendanceCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-3 w-3 text-success" />;
      case 'absent':
        return <XCircle className="h-3 w-3 text-destructive" />;
      case 'late':
        return <AlertTriangle className="h-3 w-3 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-success/10 text-success border-success/20';
      case 'absent':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'late':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return '';
    }
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4 text-school-primary" />
          {studentName ? `${studentName}'s Attendance` : 'Attendance Overview'}
        </CardTitle>
        <CardDescription>
          Monthly attendance: {percentage}% present
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {monthlyData.slice(-6).map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(record.status)}
                  <span className="text-xs font-medium">
                    {new Date(record.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs capitalize ${getStatusColor(record.status)}`}
                >
                  {record.status}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-sm text-muted-foreground">This month</span>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Present: {monthlyData.filter(d => d.status === 'present').length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span>Absent: {monthlyData.filter(d => d.status === 'absent').length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>Late: {monthlyData.filter(d => d.status === 'late').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}