import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Calendar, BookOpen, Plus } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  description: string;
  status: 'draft' | 'published';
  submissionCount: number;
}

interface AssignmentUploadCardProps {
  assignments: Assignment[];
  onCreateAssignment?: (assignment: Omit<Assignment, 'id' | 'submissionCount'>) => void;
}

export function AssignmentUploadCard({ assignments, onCreateAssignment }: AssignmentUploadCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    dueDate: '',
    description: '',
    status: 'draft' as 'draft' | 'published'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAssignment?.(formData);
    setFormData({
      title: '',
      subject: '',
      class: '',
      dueDate: '',
      description: '',
      status: 'draft'
    });
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-success/10 text-success border-success/20';
      case 'draft':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return '';
    }
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Upload className="h-4 w-4 text-school-primary" />
          Assignments & Notes
        </CardTitle>
        <CardDescription>
          Upload and manage class assignments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Create New Assignment Button */}
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          )}

          {/* Create Assignment Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-3 p-3 border rounded-lg bg-muted/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Assignment title"
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
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium">Class</label>
                  <Select
                    value={formData.class}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grade 10A">Grade 10A</SelectItem>
                      <SelectItem value="Grade 10B">Grade 10B</SelectItem>
                      <SelectItem value="Grade 11A">Grade 11A</SelectItem>
                      <SelectItem value="Grade 11B">Grade 11B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="h-8"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Assignment description and instructions"
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">
                  Save as Draft
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, status: 'published' }));
                    setTimeout(() => handleSubmit(new Event('submit') as any), 100);
                  }}
                >
                  Publish
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Assignments List */}
          <div className="space-y-2">
            {assignments.slice(0, 4).map((assignment) => (
              <div
                key={assignment.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm">{assignment.title}</h4>
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize ${getStatusColor(assignment.status)}`}
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{assignment.subject}</span>
                    </div>
                    <span>•</span>
                    <span>{assignment.class}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {assignment.description}
                  </p>
                  {assignment.status === 'published' && (
                    <div className="mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {assignment.submissionCount} submissions
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
                    Edit
                  </Button>
                  {assignment.status === 'draft' && (
                    <Button size="sm" className="h-7 px-3 text-xs">
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {assignments.length === 0 && !showForm && (
            <div className="text-center py-6 text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No assignments created yet</p>
              <p className="text-xs">Click "Create Assignment" to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}