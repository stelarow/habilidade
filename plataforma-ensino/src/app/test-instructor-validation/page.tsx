'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  full_name: string;
  role: string;
  email: string;
}

interface Instructor {
  id: string;
  user_id: string;
  specializations: string[];
  created_at: string;
}

interface ScheduleSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  instructor_id: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  details?: any;
}

export default function InstructorValidationTest() {
  const [users, setUsers] = useState<User[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [mariaEduarda, setMariaEduarda] = useState<User | null>(null);
  const [mariaInstructor, setMariaInstructor] = useState<Instructor | null>(null);
  const [testScheduleSlots, setTestScheduleSlots] = useState<ScheduleSlot[]>([]);
  const [validationLogs, setValidationLogs] = useState<string[]>([]);
  const [apiTestResult, setApiTestResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const addLog = (message: string) => {
    setValidationLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLogs = () => {
    setValidationLogs([]);
  };

  // Load initial data
  useEffect(() => {
    loadDatabaseData();
  }, []);

  const loadDatabaseData = async () => {
    setLoading(true);
    addLog('Loading database data...');

    try {
      // Load all users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, role, email')
        .order('full_name');

      if (usersError) {
        addLog(`Error loading users: ${usersError.message}`);
      } else {
        setUsers(usersData || []);
        addLog(`Loaded ${usersData?.length || 0} users`);
      }

      // Load all instructors
      const { data: instructorsData, error: instructorsError } = await supabase
        .from('instructors')
        .select('id, user_id, specializations, created_at')
        .order('created_at');

      if (instructorsError) {
        addLog(`Error loading instructors: ${instructorsError.message}`);
      } else {
        setInstructors(instructorsData || []);
        addLog(`Loaded ${instructorsData?.length || 0} instructors`);
      }

      // Find Maria Eduarda specifically
      const mariaUser = usersData?.find((user: any) => 
        user.full_name.toLowerCase().includes('maria eduarda') ||
        user.full_name.toLowerCase().includes('maria') && user.full_name.toLowerCase().includes('eduarda')
      );

      if (mariaUser) {
        setMariaEduarda(mariaUser);
        addLog(`Found Maria Eduarda: ID ${mariaUser.id}, Role: ${mariaUser.role}`);

        // Find her instructor profile
        const mariaInstructorProfile = instructorsData?.find((inst: any) => inst.user_id === mariaUser.id);
        if (mariaInstructorProfile) {
          setMariaInstructor(mariaInstructorProfile);
          addLog(`Found Maria's instructor profile: ID ${mariaInstructorProfile.id}`);
        } else {
          addLog('No instructor profile found for Maria Eduarda');
        }
      } else {
        addLog('Maria Eduarda not found in users table');
      }

    } catch (error) {
      addLog(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setLoading(false);
  };

  const generateTestScheduleSlots = () => {
    if (!mariaInstructor) {
      addLog('Cannot generate test slots - no instructor profile for Maria');
      return;
    }

    const slots: ScheduleSlot[] = [
      {
        day_of_week: 1, // Monday
        start_time: '09:00',
        end_time: '10:00',
        instructor_id: mariaInstructor.id
      },
      {
        day_of_week: 3, // Wednesday
        start_time: '14:00', 
        end_time: '15:00',
        instructor_id: mariaInstructor.id
      }
    ];

    setTestScheduleSlots(slots);
    addLog(`Generated ${slots.length} test schedule slots using instructor ID: ${mariaInstructor.id}`);
  };

  const validateInstructorIds = async (slots: ScheduleSlot[]) => {
    addLog('Starting instructor ID validation...');
    
    const instructorIds = [...new Set(slots.map(slot => slot.instructor_id))];
    addLog(`Unique instructor IDs to validate: ${instructorIds.join(', ')}`);

    try {
      const { data: validInstructors, error } = await supabase
        .from('instructors')
        .select('id, user_id')
        .in('id', instructorIds);

      if (error) {
        addLog(`Database error during validation: ${error.message}`);
        return { isValid: false, error: error.message };
      }

      addLog(`Found ${validInstructors?.length || 0} valid instructors in database`);
      
      if (validInstructors) {
        validInstructors.forEach((instructor: any) => {
          addLog(`Valid instructor: ID ${instructor.id}, User ID: ${instructor.user_id}`);
        });
      }

      const validIds = validInstructors?.map((inst: any) => inst.id) || [];
      const invalidIds = instructorIds.filter(id => !validIds.includes(id));

      if (invalidIds.length > 0) {
        addLog(`Invalid instructor IDs found: ${invalidIds.join(', ')}`);
        return { 
          isValid: false, 
          error: `Invalid instructor IDs: ${invalidIds.join(', ')}`,
          details: { validIds, invalidIds, validInstructors }
        };
      }

      addLog('All instructor IDs are valid!');
      return { 
        isValid: true, 
        details: { validIds, validInstructors }
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Validation error: ${errorMessage}`);
      return { isValid: false, error: errorMessage };
    }
  };

  const testApiValidation = async () => {
    if (testScheduleSlots.length === 0) {
      addLog('No test schedule slots available - generate them first');
      return;
    }

    addLog('Testing API validation logic...');
    const result = await validateInstructorIds(testScheduleSlots);
    setApiTestResult(result);
    
    if (result.isValid) {
      addLog('✅ API validation PASSED');
    } else {
      addLog(`❌ API validation FAILED: ${result.error}`);
    }
  };

  const simulateFormSubmission = async () => {
    if (!mariaInstructor) {
      addLog('Cannot simulate form submission - no instructor profile');
      return;
    }

    addLog('Simulating form submission...');
    
    const formData = {
      course_name: 'Test Course',
      course_description: 'Test course for validation',
      category_id: '1',
      difficulty_level: 'iniciante',
      estimated_duration: 60,
      schedule_slots: testScheduleSlots
    };

    addLog(`Form data prepared with ${formData.schedule_slots.length} schedule slots`);
    addLog(`Using instructor ID: ${mariaInstructor.id} for all slots`);

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      
      addLog(`API Response Status: ${response.status}`);
      addLog(`API Response Data: ${JSON.stringify(responseData, null, 2)}`);

      if (!response.ok) {
        addLog(`❌ Form submission FAILED: ${responseData.error || 'Unknown error'}`);
      } else {
        addLog('✅ Form submission SUCCEEDED');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`❌ Form submission ERROR: ${errorMessage}`);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Instructor Validation Test Page</CardTitle>
          <p className="text-muted-foreground">
            Comprehensive debugging for instructor validation issues
          </p>
        </CardHeader>
      </Card>

      {/* Database Verification Section */}
      <Card>
        <CardHeader>
          <CardTitle>1. Database Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={loadDatabaseData} disabled={loading}>
              {loading ? 'Loading...' : 'Reload Database Data'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">All Users ({users.length})</h3>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {users.map(user => (
                  <div key={user.id} className="text-sm mb-1">
                    <strong>{user.full_name}</strong> - {user.role} ({user.id})
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">All Instructors ({instructors.length})</h3>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {instructors.map(instructor => (
                  <div key={instructor.id} className="text-sm mb-1">
                    <strong>ID:</strong> {instructor.id} | <strong>User ID:</strong> {instructor.user_id}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {mariaEduarda && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <h3 className="font-semibold text-green-800">Maria Eduarda Found</h3>
                <div className="text-sm space-y-1">
                  <div><strong>User ID:</strong> {mariaEduarda.id}</div>
                  <div><strong>Full Name:</strong> {mariaEduarda.full_name}</div>
                  <div><strong>Role:</strong> <Badge>{mariaEduarda.role}</Badge></div>
                  <div><strong>Email:</strong> {mariaEduarda.email}</div>
                </div>
                
                {mariaInstructor ? (
                  <div className="mt-3 p-2 bg-green-100 rounded">
                    <h4 className="font-semibold text-green-800">Instructor Profile</h4>
                    <div><strong>Instructor ID:</strong> {mariaInstructor.id}</div>
                    <div><strong>User ID Link:</strong> {mariaInstructor.user_id}</div>
                    <div><strong>Specializations:</strong> {mariaInstructor.specializations.join(', ')}</div>
                  </div>
                ) : (
                  <div className="mt-3 p-2 bg-red-100 rounded">
                    <span className="text-red-800">❌ No instructor profile found</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Form Simulation Section */}
      <Card>
        <CardHeader>
          <CardTitle>2. Form Simulation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={generateTestScheduleSlots} disabled={!mariaInstructor}>
            Generate Test Schedule Slots
          </Button>

          {testScheduleSlots.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Generated Schedule Slots</h3>
              <div className="border rounded p-4 bg-gray-50">
                <pre className="text-sm">
                  {JSON.stringify(testScheduleSlots, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Testing Section */}
      <Card>
        <CardHeader>
          <CardTitle>3. API Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={testApiValidation} 
              disabled={testScheduleSlots.length === 0}
              variant="outline"
            >
              Test Validation Logic
            </Button>
            <Button 
              onClick={simulateFormSubmission} 
              disabled={testScheduleSlots.length === 0}
              variant="default"
            >
              Simulate Full Form Submission
            </Button>
          </div>

          {apiTestResult && (
            <Card className={apiTestResult.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <CardContent className="pt-4">
                <h3 className={`font-semibold ${apiTestResult.isValid ? 'text-green-800' : 'text-red-800'}`}>
                  Validation Result: {apiTestResult.isValid ? '✅ PASSED' : '❌ FAILED'}
                </h3>
                {apiTestResult.error && (
                  <div className="text-red-700 mt-2">
                    <strong>Error:</strong> {apiTestResult.error}
                  </div>
                )}
                {apiTestResult.details && (
                  <div className="mt-2">
                    <strong>Details:</strong>
                    <pre className="text-xs mt-1 bg-white p-2 rounded border">
                      {JSON.stringify(apiTestResult.details, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Live Debugging Section */}
      <Card>
        <CardHeader>
          <CardTitle>4. Live Debugging Logs</CardTitle>
          <Button onClick={clearLogs} variant="outline" size="sm">
            Clear Logs
          </Button>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {validationLogs.length === 0 ? (
              <div className="text-gray-500">No logs yet...</div>
            ) : (
              validationLogs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}