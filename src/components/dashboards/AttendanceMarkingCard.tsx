import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late' | 'not-marked';
}

interface AttendanceMarkingCardProps {
  classId?: string;
  className?: string;
  students: AttendanceRecord[];
  onSaveAttendance?: (attendance: AttendanceRecord[]) => void;
}

export function AttendanceMarkingCard({ 
  className = "Grade 10A", 
  students: initialStudents,
  onSaveAttendance 
}: AttendanceMarkingCardProps) {
  const [students, setStudents] = useState(initialStudents);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const updateStudentStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudents(prev => prev.map(student => 
      student.studentId === studentId ? { ...student, status } : student
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'late':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted" />;
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
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const handleSave = () => {
    onSaveAttendance?.(students);
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: 'present' as const })));
  };

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const lateCount = students.filter(s => s.status === 'late').length;

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4 text-school-primary" />
          Mark Attendance - {className}
        </CardTitle>
        <CardDescription>
          Date: {new Date(selectedDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pb-3 border-b">
            <Button
              size="sm"
              variant="outline"
              onClick={markAllPresent}
              className="flex-1 sm:flex-none"
            >
              Mark All Present
            </Button>
            <div className="flex gap-2 text-xs">
              <Badge variant="outline" className="bg-success/10 text-success">
                Present: {presentCount}
              </Badge>
              <Badge variant="outline" className="bg-destructive/10 text-destructive">
                Absent: {absentCount}
              </Badge>
              <Badge variant="outline" className="bg-warning/10 text-warning">
                Late: {lateCount}
              </Badge>
            </div>
          </div>

          {/* Student List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {students.map((student) => (
              <div
                key={student.studentId}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card gap-3"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(student.status)}
                  <div>
                    <h4 className="font-medium text-sm">{student.studentName}</h4>
                    <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs capitalize ${getStatusColor(student.status)}`}
                  >
                    {student.status === 'not-marked' ? 'Not Marked' : student.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant={student.status === 'present' ? 'default' : 'outline'}
                    onClick={() => updateStudentStatus(student.studentId, 'present')}
                    className="h-7 px-2"
                  >
                    <CheckCircle className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={student.status === 'late' ? 'default' : 'outline'}
                    onClick={() => updateStudentStatus(student.studentId, 'late')}
                    className="h-7 px-2"
                  >
                    <Clock className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant={student.status === 'absent' ? 'default' : 'outline'}
                    onClick={() => updateStudentStatus(student.studentId, 'absent')}
                    className="h-7 px-2"
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Save Button */}
          <div className="pt-3 border-t">
            <Button onClick={handleSave} className="w-full sm:w-auto">
              Save Attendance
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}