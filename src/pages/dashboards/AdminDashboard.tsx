import React from 'react';
import { UserManagementCard } from '@/components/dashboards/UserManagementCard';
import { ClassSubjectCard } from '@/components/dashboards/ClassSubjectCard';
import { FeeStructureCard } from '@/components/dashboards/FeeStructureCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, UserCheck, School, TrendingUp, Calendar } from 'lucide-react';

const stats = [
  {
    title: 'Total Students',
    value: '1,248',
    description: 'Active students this year',
    icon: GraduationCap,
    trend: '+12%'
  },
  {
    title: 'Teachers',
    value: '89',
    description: 'Teaching staff',
    icon: UserCheck,
    trend: '+3%'
  },
  {
    title: 'Parents',
    value: '1,024',
    description: 'Parent accounts',
    icon: Users,
    trend: '+8%'
  },
  {
    title: 'Classes',
    value: '42',
    description: 'Active classes',
    icon: School,
    trend: '+2%'
  }
];

export default function AdminDashboard() {
  // Mock data - in real app, fetch from Supabase
  const usersData = [
    { id: '1', name: 'John Doe', email: 'john@school.edu', role: 'teacher' as const, status: 'active' as const, lastLogin: '2024-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@school.edu', role: 'parent' as const, status: 'active' as const, lastLogin: '2024-01-14' },
    { id: '3', name: 'Emma Watson', email: 'emma@school.edu', role: 'student' as const, status: 'active' as const, lastLogin: '2024-01-15' }
  ];

  const classesData = [
    { id: '1', className: 'Grade 10A', subject: 'Mathematics', teacher: 'John Doe', teacherId: '1', studentCount: 30, schedule: 'Mon-Fri 9:00-10:00', room: 'Room 101' }
  ];

  const feesData = [
    { id: '1', feeType: 'Tuition Fee', amount: 1200, frequency: 'monthly' as const, dueDay: 1, applicableGrades: ['Grade 10A'], status: 'active' as const }
  ];

  const teachersData = [
    { id: '1', name: 'John Doe', subject: 'Mathematics' }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Welcome back! Here's what's happening at your school.
        </p>
      </div>

      {/* MVP Features Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UserManagementCard users={usersData} />
        <ClassSubjectCard classes={classesData} teachers={teachersData} />
        <div className="lg:col-span-2">
          <FeeStructureCard feeStructures={feesData} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="card-professional">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 opacity-60" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}