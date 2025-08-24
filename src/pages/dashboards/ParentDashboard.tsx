import React from 'react';
import { AttendanceCard } from '@/components/dashboards/AttendanceCard';
import { HomeworkCard } from '@/components/dashboards/HomeworkCard';
import { FeesCard } from '@/components/dashboards/FeesCard';
import { TimetableCard } from '@/components/dashboards/TimetableCard';
import { ContactCard } from '@/components/dashboards/ContactCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Calendar, FileText, Clock, Trophy, Bell } from 'lucide-react';

export default function ParentDashboard() {
  // Mock data - in real app, fetch from Supabase
  const attendanceData = [
    { date: '2024-01-15', status: 'present' as const },
    { date: '2024-01-16', status: 'present' as const },
    { date: '2024-01-17', status: 'late' as const },
    { date: '2024-01-18', status: 'present' as const },
    { date: '2024-01-19', status: 'absent' as const },
    { date: '2024-01-22', status: 'present' as const },
  ];

  const homeworkData = [
    {
      id: '1',
      title: 'Trigonometry Practice Problems',
      subject: 'Mathematics',
      dueDate: '2024-01-25',
      status: 'pending' as const,
      description: 'Complete exercises 1-15 from chapter 4'
    },
    {
      id: '2',
      title: 'Chemistry Lab Report',
      subject: 'Chemistry',
      dueDate: '2024-01-23',
      status: 'submitted' as const,
      grade: 'A-'
    },
    {
      id: '3',
      title: 'Essay on Mahatma Gandhi',
      subject: 'Social Science',
      dueDate: '2024-01-30',
      status: 'pending' as const,
      description: 'Write 500 words on World War II'
    }
  ];

  const feesData = [
    {
      id: '1',
      type: 'Tuition Fee',
      amount: 1200,
      dueDate: '2024-02-01',
      status: 'pending' as const
    },
    {
      id: '2',
      type: 'Activity Fee',
      amount: 200,
      dueDate: '2024-01-15',
      status: 'paid' as const,
      paidDate: '2024-01-10',
      receiptUrl: '/receipt-1.pdf'
    }
  ];

  const timetableData = [
    {
      id: '1',
      subject: 'Mathematics',
      teacher: 'Mr. Sharma',
      room: 'Room 101',
      startTime: '09:00',
      endTime: '10:00',
      day: 'Monday'
    },
    {
      id: '2',
      subject: 'Physics',
      teacher: 'Ms. Iyer',
      room: 'Lab 201',
      startTime: '10:15',
      endTime: '11:15',
      day: 'Monday'
    },
    {
      id: '3',
      subject: 'English',
      teacher: 'Mrs. Patel',
      room: 'Room 102',
      startTime: '11:30',
      endTime: '12:30',
      day: 'Monday'
    }
  ];

  const contactData = [
    {
      id: '1',
      name: 'Mr. Sharma',
      role: 'teacher' as const,
      subject: 'Mathematics',
      email: 'sharma@school.edu',
      phone: '+91-98765-43210',
      availability: 'Mon-Fri 2:00-4:00 PM'
    },
    {
      id: '2',
      name: 'Ms. Iyer',
      role: 'teacher' as const,
      subject: 'Physics',
      email: 'iyer@school.edu',
      phone: '+91-98765-43211',
      availability: 'Mon-Fri 1:00-3:00 PM'
    },
    {
      id: '3',
      name: 'Dr. Mehra',
      role: 'principal' as const,
      email: 'mehra@school.edu',
      phone: '+91-98765-43212',
      availability: 'By appointment'
    }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Parent Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Stay updated with your child's academic progress and school activities.
        </p>
      </div>

      {/* MVP Features Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attendance */}
        <AttendanceCard
          studentName="Aarav"
          monthlyData={attendanceData}
          percentage={87}
        />

        {/* Homework & Announcements */}
        <HomeworkCard
          studentName="Aarav"
          assignments={homeworkData}
        />

        {/* Fee Management */}
        <FeesCard
          studentName="Aarav"
          fees={feesData}
          totalDue={1200}
        />

        {/* Timetable */}
        <TimetableCard
          studentName="Aarav"
          schedule={timetableData}
          currentDay="Monday"
        />

        {/* Contact Teachers/School */}
        <div className="lg:col-span-2">
          <ContactCard
            contacts={contactData}
            studentName="Aarav"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Grade</p>
                <p className="text-xl font-bold text-school-primary">A-</p>
              </div>
              <Trophy className="h-8 w-8 text-school-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="text-xl font-bold text-success">87%</p>
              </div>
              <Calendar className="h-8 w-8 text-success opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-warning">3</p>
              </div>
              <FileText className="h-8 w-8 text-warning opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fees Due</p>
                <p className="text-xl font-bold text-destructive">$1,200</p>
              </div>
              <Bell className="h-8 w-8 text-destructive opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}