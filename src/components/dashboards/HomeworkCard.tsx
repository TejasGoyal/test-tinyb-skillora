import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Download, ExternalLink } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
  description?: string;
  attachmentUrl?: string;
}

interface HomeworkCardProps {
  assignments: Assignment[];
  studentName?: string;
}

export function HomeworkCard({ assignments, studentName }: HomeworkCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'submitted':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'graded':
        return 'bg-success/10 text-success border-success/20';
      default:
        return '';
    }
  };

  const sortedAssignments = assignments.sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-school-primary" />
          {studentName ? `${studentName}'s Homework` : 'Homework & Assignments'}
        </CardTitle>
        <CardDescription>
          {assignments.filter(a => a.status === 'pending').length} pending assignments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedAssignments.slice(0, 5).map((assignment) => (
            <div
              key={assignment.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{assignment.title}</h4>
                  <Badge
                    variant="outline"
                    className={`text-xs capitalize flex-shrink-0 ${getStatusColor(assignment.status)}`}
                  >
                    {assignment.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{assignment.subject}</p>
                {assignment.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{assignment.description}</p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </div>
                {assignment.grade && (
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-xs">
                      Grade: {assignment.grade}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {assignment.attachmentUrl && (
                  <Button size="sm" variant="outline" className="h-7 px-2">
                    <Download className="h-3 w-3" />
                  </Button>
                )}
                <Button size="sm" variant="outline" className="h-7 px-2">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          
          {assignments.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No assignments found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}