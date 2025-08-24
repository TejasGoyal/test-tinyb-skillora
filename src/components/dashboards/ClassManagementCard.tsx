import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Calendar, MessageSquare } from 'lucide-react';

interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  schedule: string;
  room: string;
}

interface ClassManagementCardProps {
  classes: ClassInfo[];
}

export function ClassManagementCard({ classes }: ClassManagementCardProps) {
  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-4 w-4 text-school-primary" />
          My Classes
        </CardTitle>
        <CardDescription>
          Classes and subjects you teach
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {classes.map((classInfo) => (
            <div
              key={classInfo.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{classInfo.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {classInfo.subject}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{classInfo.studentCount} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{classInfo.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Room: {classInfo.room}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" className="h-7 px-2">
                  <Users className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" className="h-7 px-2">
                  <MessageSquare className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          
          {classes.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No classes assigned</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}