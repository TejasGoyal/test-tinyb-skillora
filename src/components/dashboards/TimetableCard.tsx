import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User } from 'lucide-react';

interface TimetableEntry {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  day: string;
}

interface TimetableCardProps {
  schedule: TimetableEntry[];
  studentName?: string;
  currentDay?: string;
}

export function TimetableCard({ schedule, studentName, currentDay = 'Monday' }: TimetableCardProps) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const getScheduleForDay = (day: string) => {
    return schedule
      .filter(entry => entry.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const today = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    return schedule.find(entry => 
      entry.day === today && 
      currentTime >= entry.startTime && 
      currentTime <= entry.endTime
    );
  };

  const currentClass = getCurrentTimeSlot();

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-school-primary" />
          {studentName ? `${studentName}'s Timetable` : 'Class Timetable'}
        </CardTitle>
        <CardDescription>
          {currentClass ? `Current: ${currentClass.subject}` : 'Weekly schedule overview'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current/Next Class Highlight */}
          {currentClass && (
            <div className="p-3 rounded-lg bg-school-primary/10 border border-school-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="default" className="text-xs">
                  Current Class
                </Badge>
              </div>
              <h4 className="font-medium">{currentClass.subject}</h4>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{currentClass.teacher}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{currentClass.room}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{currentClass.startTime} - {currentClass.endTime}</span>
                </div>
              </div>
            </div>
          )}

          {/* Weekly Schedule */}
          <div className="space-y-3">
            {daysOfWeek.map((day) => {
              const daySchedule = getScheduleForDay(day);
              const isToday = day === currentDay;
              
              return (
                <div key={day} className={`rounded-lg border p-3 ${isToday ? 'bg-school-primary/5 border-school-primary/20' : 'bg-card'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className={`font-medium text-sm ${isToday ? 'text-school-primary' : ''}`}>
                      {day}
                    </h4>
                    {isToday && (
                      <Badge variant="outline" className="text-xs">
                        Today
                      </Badge>
                    )}
                  </div>
                  
                  {daySchedule.length > 0 ? (
                    <div className="grid gap-2">
                      {daySchedule.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded bg-background/50"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-xs">{entry.subject}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{entry.teacher}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{entry.room}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                            <Clock className="h-3 w-3" />
                            <span>{entry.startTime} - {entry.endTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No classes scheduled</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}