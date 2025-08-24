import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Mail, Phone, User } from 'lucide-react';

interface ContactInfo {
  id: string;
  name: string;
  role: 'teacher' | 'admin' | 'principal';
  subject?: string;
  email: string;
  phone?: string;
  availability: string;
}

interface ContactCardProps {
  contacts: ContactInfo[];
  studentName?: string;
}

export function ContactCard({ contacts, studentName }: ContactCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'bg-school-primary/10 text-school-primary border-school-primary/20';
      case 'admin':
        return 'bg-school-secondary/10 text-school-secondary border-school-secondary/20';
      case 'principal':
        return 'bg-school-accent/10 text-school-accent border-school-accent/20';
      default:
        return '';
    }
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageCircle className="h-4 w-4 text-school-primary" />
          Contact School
        </CardTitle>
        <CardDescription>
          Get in touch with teachers and school staff
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium text-sm">{contact.name}</h4>
                  <Badge
                    variant="outline"
                    className={`text-xs capitalize ${getRoleColor(contact.role)}`}
                  >
                    {contact.role}
                  </Badge>
                </div>
                
                {contact.subject && (
                  <p className="text-xs text-muted-foreground mb-1">
                    Subject: {contact.subject}
                  </p>
                )}
                
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span>{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  <p className="text-xs">Available: {contact.availability}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Message
                </Button>
                <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
              </div>
            </div>
          ))}
          
          {/* Quick Contact Options */}
          <div className="pt-3 border-t">
            <h5 className="font-medium text-sm mb-2">Quick Actions</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <Phone className="h-3 w-3 mr-2" />
                School Office
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <MessageCircle className="h-3 w-3 mr-2" />
                General Inquiry
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}