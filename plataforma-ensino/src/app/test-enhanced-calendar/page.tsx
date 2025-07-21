'use client';

import EnhancedCalendarView from '@/components/calendar/EnhancedCalendarView';
import { BlurFade } from '@/components/ui/blur-fade';

export default function TestEnhancedCalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8">
        <BlurFade delay={0.1}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Enhanced Calendar View
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Testing the new Magic UI enhanced calendar interface with animations and modern design
            </p>
          </div>
        </BlurFade>

        <EnhancedCalendarView />
      </div>
    </div>
  );
}