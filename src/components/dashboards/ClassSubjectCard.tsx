import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Plus, Edit, Trash2, Users, Clock } from 'lucide-react';

interface ClassSubject {
  id: string;
  className: string;
  subject: string;
  teacher: string;
  teacherId: string;
  studentCount: number;
  schedule: string;
  room: string;
}

interface ClassSubjectCardProps {
  classes: ClassSubject[];
  teachers: Array<{ id: string; name: string; subject: string }>;
  onCreateClass?: (classData: Omit<ClassSubject, 'id' | 'studentCount'>) => void;
  onEditClass?: (classData: ClassSubject) => void;
  onDeleteClass?: (classId: string) => void;
}

export function ClassSubjectCard({ 
  classes, 
  teachers = [],
  onCreateClass, 
  onEditClass, 
  onDeleteClass 
}: ClassSubjectCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    className: '',
    subject: '',
    teacherId: '',
    schedule: '',
    room: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find(t => t.id === formData.teacherId);
    if (!teacher) return;

    onCreateClass?.({
      className: formData.className,
      subject: formData.subject,
      teacher: teacher.name,
      teacherId: formData.teacherId,
      schedule: formData.schedule,
      room: formData.room
    });

    setFormData({
      className: '',
      subject: '',
      teacherId: '',
      schedule: '',
      room: ''
    });
    setShowForm(false);
  };

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 
    'History', 'Geography', 'Computer Science', 'Art', 'Music',
    'Physical Education', 'Economics'
  ];

  const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0);

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-4 w-4 text-school-primary" />
          Classes & Subjects
        </CardTitle>
        <CardDescription>
          Manage class assignments and subjects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="text-center p-3 bg-school-primary/10 rounded-lg">
              <p className="text-lg font-bold text-school-primary">{classes.length}</p>
              <p className="text-xs text-muted-foreground">Total Classes</p>
            </div>
            <div className="text-center p-3 bg-school-secondary/10 rounded-lg">
              <p className="text-lg font-bold text-school-secondary">{new Set(classes.map(c => c.subject)).size}</p>
              <p className="text-xs text-muted-foreground">Subjects</p>
            </div>
            <div className="text-center p-3 bg-school-accent/10 rounded-lg">
              <p className="text-lg font-bold text-school-accent">{totalStudents}</p>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </div>
          </div>

          {/* Create Class Button */}
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          )}

          {/* Create Class Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-3 p-3 border rounded-lg bg-muted/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium">Class Name</label>
                  <Input
                    value={formData.className}
                    onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
                    placeholder="e.g., Grade 10A"
                    className="h-8"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Subject</label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium">Teacher</label>
                  <Select
                    value={formData.teacherId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, teacherId: value }))}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Assign teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name} ({teacher.subject})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium">Room</label>
                  <Input
                    value={formData.room}
                    onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                    placeholder="e.g., Room 101"
                    className="h-8"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium">Schedule</label>
                  <Input
                    value={formData.schedule}
                    onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                    placeholder="e.g., Mon-Fri 9:00-10:00 AM"
                    className="h-8"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">Create Class</Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Classes List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{classItem.className}</h4>
                    <Badge variant="outline" className="text-xs bg-school-primary/10 text-school-primary">
                      {classItem.subject}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{classItem.studentCount} students</span>
                    </div>
                    <span>•</span>
                    <span>Teacher: {classItem.teacher}</span>
                    <span>•</span>
                    <span>{classItem.room}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{classItem.schedule}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditClass?.(classItem)}
                    className="h-7 px-2"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteClass?.(classItem.id)}
                    className="h-7 px-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {classes.length === 0 && !showForm && (
            <div className="text-center py-6 text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No classes created yet</p>
              <p className="text-xs">Click "Create Class" to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}