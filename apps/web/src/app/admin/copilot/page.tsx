import React from 'react';
import { CopilotFullPageView } from '@/features/copilot/components/CopilotFullPageView';

export const metadata = {
  title: 'AI Copilot | EduPortal Admin',
  description: 'AI Copilot for school administration in English and Mizo'
};

export default function AdminCopilotPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-gray-900">
            AI Copilot Assistant
          </h1>
          <p className="text-xs text-gray-500">
            Bilingual School Management & Administrative Intelligence (English & Mizo)
          </p>
        </div>
      </div>
      <CopilotFullPageView />
    </div>
  );
}
