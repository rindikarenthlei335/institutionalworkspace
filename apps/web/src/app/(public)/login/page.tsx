'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input, PasswordInput } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = '/admin/dashboard';
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center">
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Portal Login</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Sign in to access your school admin or parent dashboard</p>
      </div>

      <Card>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button type="submit" variant="primary" className="w-full">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}
