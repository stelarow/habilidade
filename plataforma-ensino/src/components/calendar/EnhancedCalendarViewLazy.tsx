'use client';

import React from 'react';
import dynamic from 'next/dynamic';

interface CalendarData {
  id: string;
  teacherId: string;
  studentEmail: string;
  studentName?: string;
  courseName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotLabel: string;
  startDate?: string;
  endDate?: string;
}

interface EnhancedCalendarViewProps {
  teacherId?: string;
}

// Lazy load the enhanced calendar view to reduce bundle size
const EnhancedCalendarView = dynamic(
  () => import('./EnhancedCalendarView'),
  {
    loading: () => (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="w-64 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Calendar grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Days header */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
          ))}
          
          {/* Calendar slots */}
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="w-full h-16 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
        
        {/* Loading indicator */}
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading calendar...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching schedule data...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

export default EnhancedCalendarView;
export type { EnhancedCalendarViewProps, CalendarData };