import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Plus, Edit, Trash2, Calendar, TrendingUp } from 'lucide-react';

interface FeeStructure {
  id: string;
  feeType: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one-time';
  dueDay: number;
  applicableGrades: string[];
  status: 'active' | 'inactive';
}

interface FeeStructureCardProps {
  feeStructures: FeeStructure[];
  onCreateFee?: (fee: Omit<FeeStructure, 'id'>) => void;
  onEditFee?: (fee: FeeStructure) => void;
  onDeleteFee?: (feeId: string) => void;
}

export function FeeStructureCard({ 
  feeStructures, 
  onCreateFee, 
  onEditFee, 
  onDeleteFee 
}: FeeStructureCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    feeType: '',
    amount: '',
    frequency: 'monthly' as 'monthly' | 'quarterly' | 'annually' | 'one-time',
    dueDay: '',
    applicableGrades: [] as string[],
    status: 'active' as 'active' | 'inactive'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateFee?.({
      feeType: formData.feeType,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      dueDay: parseInt(formData.dueDay),
      applicableGrades: formData.applicableGrades,
      status: formData.status
    });

    setFormData({
      feeType: '',
      amount: '',
      frequency: 'monthly',
      dueDay: '',
      applicableGrades: [],
      status: 'active'
    });
    setShowForm(false);
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'monthly':
        return 'bg-school-primary/10 text-school-primary border-school-primary/20';
      case 'quarterly':
        return 'bg-school-secondary/10 text-school-secondary border-school-secondary/20';
      case 'annually':
        return 'bg-school-accent/10 text-school-accent border-school-accent/20';
      case 'one-time':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-success/10 text-success border-success/20'
      : 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 
                  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 
                  'Grade 11', 'Grade 12'];

  const totalRevenue = feeStructures
    .filter(f => f.status === 'active')
    .reduce((sum, fee) => {
      const multiplier = fee.frequency === 'monthly' ? 12 : 
                        fee.frequency === 'quarterly' ? 4 : 1;
      return sum + (fee.amount * multiplier * fee.applicableGrades.length * 30); // Assuming 30 students per grade
    }, 0);

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="h-4 w-4 text-school-primary" />
          Fee Structure Management
        </CardTitle>
        <CardDescription>
          Set up and manage school fee structures
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Revenue Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-success" />
                <p className="text-sm font-medium text-success">Annual Revenue</p>
              </div>
              <p className="text-lg font-bold">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 bg-school-primary/10 rounded-lg">
              <p className="text-lg font-bold text-school-primary">{feeStructures.filter(f => f.status === 'active').length}</p>
              <p className="text-xs text-muted-foreground">Active Fee Types</p>
            </div>
            <div className="text-center p-3 bg-school-secondary/10 rounded-lg">
              <p className="text-lg font-bold text-school-secondary">{feeStructures.filter(f => f.frequency === 'monthly').length}</p>
              <p className="text-xs text-muted-foreground">Monthly Fees</p>
            </div>
          </div>

          {/* Create Fee Button */}
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Fee Structure
            </Button>
          )}

          {/* Create Fee Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-3 p-3 border rounded-lg bg-muted/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium">Fee Type</label>
                  <Input
                    value={formData.feeType}
                    onChange={(e) => setFormData(prev => ({ ...prev, feeType: e.target.value }))}
                    placeholder="e.g., Tuition Fee, Lab Fee"
                    className="h-8"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Amount ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    className="h-8"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Frequency</label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value as any }))}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium">Due Day of Month</label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.dueDay}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDay: e.target.value }))}
                    placeholder="1-31"
                    className="h-8"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium">Applicable Grades</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 mt-1">
                    {grades.map(grade => (
                      <label key={grade} className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={formData.applicableGrades.includes(grade)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ 
                                ...prev, 
                                applicableGrades: [...prev.applicableGrades, grade] 
                              }));
                            } else {
                              setFormData(prev => ({ 
                                ...prev, 
                                applicableGrades: prev.applicableGrades.filter(g => g !== grade) 
                              }));
                            }
                          }}
                          className="w-3 h-3"
                        />
                        <span className="text-xs">{grade}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">Create Fee</Button>
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

          {/* Fee Structures List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {feeStructures.map((fee) => (
              <div
                key={fee.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{fee.feeType}</h4>
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize ${getFrequencyColor(fee.frequency)}`}
                    >
                      {fee.frequency}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize ${getStatusColor(fee.status)}`}
                    >
                      {fee.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-medium text-school-primary">${fee.amount}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {fee.dueDay}{fee.dueDay === 1 ? 'st' : fee.dueDay === 2 ? 'nd' : fee.dueDay === 3 ? 'rd' : 'th'} of month</span>
                    </div>
                    <span>•</span>
                    <span>{fee.applicableGrades.length} grades</span>
                  </div>
                  <div className="mt-1">
                    <p className="text-xs text-muted-foreground">
                      Applies to: {fee.applicableGrades.slice(0, 3).join(', ')}
                      {fee.applicableGrades.length > 3 && ` +${fee.applicableGrades.length - 3} more`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditFee?.(fee)}
                    className="h-7 px-2"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteFee?.(fee.id)}
                    className="h-7 px-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {feeStructures.length === 0 && !showForm && (
            <div className="text-center py-6 text-muted-foreground">
              <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No fee structures created yet</p>
              <p className="text-xs">Click "Add Fee Structure" to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}