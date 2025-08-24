import React from 'react';
import { ClassManagementCard } from '@/components/dashboards/ClassManagementCard';
import { StudentListCard } from '@/components/dashboards/StudentListCard';
import { AttendanceMarkingCard } from '@/components/dashboards/AttendanceMarkingCard';
import { AssignmentUploadCard } from '@/components/dashboards/AssignmentUploadCard';
import { TimetableCard } from '@/components/dashboards/TimetableCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, Calendar, Clock, Users, FileText } from 'lucide-react';

export default function TeacherDashboard() {
  // Mock data - in real app, fetch from Supabase
  const classesData = [
    {
      id: '1',
      name: 'Grade 10A',
      subject: 'Mathematics',
      studentCount: 42,
      schedule: 'Mon-Fri 9:00-10:00 AM',
      room: 'Room 204'
    },
    {
      id: '2',
      name: 'Grade 11B',
      subject: 'Algebra',
      studentCount: 38,
      schedule: 'Mon-Fri 11:00-12:00 PM',
      room: 'Room 204'
    },
    {
      id: '3',
      name: 'Grade 12A',
      subject: 'Calculus',
      studentCount: 35,
      schedule: 'Mon-Fri 2:00-3:00 PM',
      room: 'Room 204'
    }
  ];

  const studentsData = [
    {
      id: '1',
      name: 'Aarav Mehta',
      rollNumber: 'G10A001',
      class: 'Grade 10A',
      email: 'aarav.mehta@school.edu',
      phone: '+91-98765-43210',
      attendance: 95,
      grade: 'A'
    },
    {
      id: '2',
      name: 'Priya Singh',
      rollNumber: 'G10A002',
      class: 'Grade 10A',
      email: 'priya.singh@school.edu',
      attendance: 87,
      grade: 'B+'
    },
    {
      id: '3',
      name: 'Rohan Patel',
      rollNumber: 'G11B001',
      class: 'Grade 11B',
      email: 'rohan.patel@school.edu',
      attendance: 92,
      grade: 'A-'
    }
  ];

  const attendanceStudents = [
    {
      studentId: '1',
      studentName: 'Aarav Mehta',
      rollNumber: 'G10A001',
      status: 'not-marked' as const
    },
    {
      studentId: '2',
      studentName: 'Priya Singh',
      rollNumber: 'G10A002',
      status: 'not-marked' as const
    },
    {
      studentId: '3',
      studentName: 'Rohan Patel',
      rollNumber: 'G11B001',
      status: 'not-marked' as const
    }
  ];

  const assignmentsData = [
    {
      id: '1',
      title: 'Algebra Practice Set 1',
      subject: 'Mathematics',
      class: 'Grade 10A',
      dueDate: '2024-01-25',
      description: 'Complete exercises 1-15 from chapter 4',
      status: 'published' as const,
      submissionCount: 28
    },
    {
      id: '2',
      title: 'Calculus Integration',
      subject: 'Mathematics',
      class: 'Grade 12A',
      dueDate: '2024-01-30',
      description: 'Solve integration problems from worksheet',
      status: 'draft' as const,
      submissionCount: 0
    }
  ];

  const timetableData = [
    {
      id: '1',
      subject: 'Mathematics',
      teacher: 'You',
      room: 'Room 204',
      startTime: '09:00',
      endTime: '10:00',
      day: 'Monday'
    },
    {
      id: '2',
      subject: 'Algebra',
      teacher: 'You',
      room: 'Room 204',
      startTime: '11:00',
      endTime: '12:00',
      day: 'Monday'
    },
    {
      id: '3',
      subject: 'Calculus',
      teacher: 'You',
      room: 'Room 204',
      startTime: '14:00',
      endTime: '15:00',
      day: 'Monday'
    }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Welcome back! Here's your teaching overview for today.
        </p>
      </div>

      {/* MVP Features Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Classes and Subjects */}
        <ClassManagementCard classes={classesData} />

        {/* Students List */}
        <StudentListCard students={studentsData} />

        {/* Mark Attendance */}
        <AttendanceMarkingCard
          className="Grade 10A"
          students={attendanceStudents}
          onSaveAttendance={(attendance) => console.log('Saving attendance:', attendance)}
        />

        {/* Upload Assignments */}
        <AssignmentUploadCard
          assignments={assignmentsData}
          onCreateAssignment={(assignment) => console.log('Creating assignment:', assignment)}
        />

        {/* Timetable */}
        <div className="lg:col-span-2">
          <TimetableCard
            schedule={timetableData}
            currentDay="Monday"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-xl font-bold text-school-primary">115</p>
              </div>
              <GraduationCap className="h-8 w-8 text-school-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Classes Today</p>
                <p className="text-xl font-bold text-success">3</p>
              </div>
              <BookOpen className="h-8 w-8 text-success opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-xl font-bold text-warning">8</p>
              </div>
              <FileText className="h-8 w-8 text-warning opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Parent Meetings</p>
                <p className="text-xl font-bold text-destructive">2</p>
              </div>
              <Calendar className="h-8 w-8 text-destructive opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}