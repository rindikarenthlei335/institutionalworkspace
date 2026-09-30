import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PortalProfilePage() {
  return (
    <div className="space-y-4">
      <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">Parent Profile</h2>
      <Card className="space-y-3">
        <div className="text-xs space-y-1">
          <p><strong>Parent Name:</strong> Priya Sharma</p>
          <p><strong>Phone:</strong> +91 98765 11111</p>
          <p><strong>Email:</strong> priya.sharma@example.com</p>
          <p><strong>Student:</strong> Aarav Sharma (Class VIII-A)</p>
        </div>
        <Button variant="secondary" size="sm" className="w-full">Sign Out</Button>
      </Card>
    </div>
  );
}
