'use client';

import { useState } from 'react';
import CalendarView from '@/components/calendar/CalendarView';
import { testCalendarAPIEndpoint } from '@/utils/testCalendarAPI';

export default function TestCalendarDebugPage() {
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState(true);

  const runClientTest = async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      const logMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logs.push(logMessage);
      originalLog(...args);
    };

    console.error = (...args) => {
      const logMessage = 'ERROR: ' + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logs.push(logMessage);
      originalError(...args);
    };

    await testCalendarAPIEndpoint();

    console.log = originalLog;
    console.error = originalError;

    setApiLogs(logs);
  };

  const runServerTest = async (type: 'api' | 'schema' = 'api') => {
    try {
      const response = await fetch(`/api/test-calendar?type=${type}`);
      const data = await response.json();
      if (data.logs) {
        setApiLogs(data.logs);
      } else {
        setApiLogs(['Error: ' + JSON.stringify(data)]);
      }
    } catch (error) {
      setApiLogs(['Failed to run server test: ' + String(error)]);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Calendar Debug Test</h1>
      
      <div className="mb-6 space-x-4">
        <button
          onClick={runClientTest}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Run Client-Side Test
        </button>
        <button
          onClick={() => runServerTest('api')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Run API Test (Server)
        </button>
        <button
          onClick={() => runServerTest('schema')}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Check DB Schema
        </button>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          {showCalendar ? 'Hide' : 'Show'} Calendar
        </button>
        <button
          onClick={() => setApiLogs([])}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear Logs
        </button>
      </div>

      {apiLogs.length > 0 && (
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">API Test Logs:</h2>
          <pre className="text-xs overflow-auto max-h-96 bg-white p-2 rounded">
            {apiLogs.join('\n')}
          </pre>
        </div>
      )}

      {showCalendar && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Calendar Component:</h2>
          <CalendarView />
        </div>
      )}
    </div>
  );
}