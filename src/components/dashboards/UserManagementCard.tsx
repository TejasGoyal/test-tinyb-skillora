import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Plus, Edit, Trash2, Mail, Shield } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'parent' | 'student';
  status: 'active' | 'inactive';
  lastLogin: string;
}

interface UserManagementCardProps {
  users: User[];
  onAddUser?: (user: Omit<User, 'id' | 'lastLogin'>) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
}

export function UserManagementCard({ users, onAddUser, onEditUser, onDeleteUser }: UserManagementCardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student' as 'admin' | 'teacher' | 'parent' | 'student',
    status: 'active' as 'active' | 'inactive'
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'teacher':
        return 'bg-school-primary/10 text-school-primary border-school-primary/20';
      case 'parent':
        return 'bg-school-secondary/10 text-school-secondary border-school-secondary/20';
      case 'student':
        return 'bg-school-accent/10 text-school-accent border-school-accent/20';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-success/10 text-success border-success/20'
      : 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser?.(newUser);
    setNewUser({ name: '', email: '', role: 'student', status: 'active' });
    setShowAddForm(false);
  };

  const roleStats = {
    admin: users.filter(u => u.role === 'admin').length,
    teacher: users.filter(u => u.role === 'teacher').length,
    parent: users.filter(u => u.role === 'parent').length,
    student: users.filter(u => u.role === 'student').length,
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4 text-school-primary" />
          User Management
        </CardTitle>
        <CardDescription>
          Manage students, parents, teachers and administrators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="text-center p-2 bg-muted/20 rounded">
              <p className="text-lg font-bold text-destructive">{roleStats.admin}</p>
              <p className="text-xs text-muted-foreground">Admins</p>
            </div>
            <div className="text-center p-2 bg-muted/20 rounded">
              <p className="text-lg font-bold text-school-primary">{roleStats.teacher}</p>
              <p className="text-xs text-muted-foreground">Teachers</p>
            </div>
            <div className="text-center p-2 bg-muted/20 rounded">
              <p className="text-lg font-bold text-school-secondary">{roleStats.parent}</p>
              <p className="text-xs text-muted-foreground">Parents</p>
            </div>
            <div className="text-center p-2 bg-muted/20 rounded">
              <p className="text-lg font-bold text-school-accent">{roleStats.student}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-32 h-9">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => setShowAddForm(true)} className="h-9">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Add User Form */}
          {showAddForm && (
            <form onSubmit={handleAddUser} className="space-y-3 p-3 border rounded-lg bg-muted/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={newUser.status}
                  onValueChange={(value) => setNewUser(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">Add User</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Users List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredUsers.slice(0, 8).map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{user.name}</h4>
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize ${getRoleColor(user.role)}`}
                    >
                      {user.role}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize ${getStatusColor(user.status)}`}
                    >
                      {user.status}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span>{user.email}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditUser?.(user)}
                    className="h-7 px-2"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2"
                  >
                    <Shield className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteUser?.(user.id)}
                    className="h-7 px-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No users found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}