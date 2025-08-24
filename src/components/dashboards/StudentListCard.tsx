import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Mail, Phone } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  email: string;
  phone?: string;
  attendance: number;
  grade: string;
}

interface StudentListCardProps {
  students: Student[];
}

export function StudentListCard({ students }: StudentListCardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const uniqueClasses = [...new Set(students.map(s => s.class))];

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4 text-school-primary" />
          Students
        </CardTitle>
        <CardDescription>
          Manage and view your students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-40 h-9">
                <SelectValue placeholder="All classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Student List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{student.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {student.rollNumber}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>{student.class}</span>
                    <span>•</span>
                    <span>Attendance: {student.attendance}%</span>
                    <span>•</span>
                    <span>Grade: {student.grade}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3" />
                    <span className="text-xs">{student.email}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" className="h-7 px-2">
                    <Mail className="h-3 w-3" />
                  </Button>
                  {student.phone && (
                    <Button size="sm" variant="outline" className="h-7 px-2">
                      <Phone className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No students found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}