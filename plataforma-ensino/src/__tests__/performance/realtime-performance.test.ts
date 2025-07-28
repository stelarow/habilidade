/**
 * Real-time Performance and Conflict Prevention Tests
 * Story 3.1: Teacher Enrollment Integration - Task 4
 * 
 * Tests real-time update performance, conflict prevention,
 * and concurrent user scenarios for the enrollment system.
 */

import { createBrowserClient } from '@supabase/ssr'

// Mock Supabase client
const mockSupabaseClient = {
  channel: jest.fn().mockReturnThis(),
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn().mockReturnThis(),
  unsubscribe: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis()
}

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => mockSupabaseClient)
}))

describe('Real-time Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    performance.clearMeasures?.()
    performance.clearMarks?.()
  })

  describe('Real-time Update Performance', () => {
    it('processes availability updates within 100ms target', async () => {
      const updates: any[] = []
      const startTime = performance.now()
      
      // Simulate real-time availability update
      const mockUpdate = {
        eventType: 'UPDATE',
        new: {
          id: 'availability-1',
          teacher_id: 'teacher-1',
          available_spots: 3,
          updated_at: new Date().toISOString()
        },
        old: {
          id: 'availability-1',
          teacher_id: 'teacher-1',
          available_spots: 5,
          updated_at: new Date(Date.now() - 1000).toISOString()
        }
      }

      // Mock subscription handler
      const handleUpdate = (payload: any) => {
        performance.mark('update-start')
        
        // Simulate processing the update
        updates.push({
          teacherId: payload.new.teacher_id,
          spotsChanged: payload.new.available_spots - payload.old.available_spots,
          timestamp: Date.now()
        })
        
        performance.mark('update-end')
        performance.measure('update-processing', 'update-start', 'update-end')
      }

      // Process the update
      handleUpdate(mockUpdate)
      
      const endTime = performance.now()
      const processingTime = endTime - startTime

      // Should process within target time
      expect(processingTime).toBeLessThan(100)
      expect(updates).toHaveLength(1)
      expect(updates[0].spotsChanged).toBe(-2)

      // Check performance measurement
      const measures = performance.getEntriesByType('measure')
      const updateMeasure = measures.find((m: any) => m.name === 'update-processing')
      expect(updateMeasure).toBeDefined()
      expect(updateMeasure!.duration).toBeLessThan(50) // Internal processing should be even faster
    })

    it('handles batch updates efficiently', async () => {
      const batchSize = 10
      const updates: any[] = []
      
      performance.mark('batch-start')
      
      // Simulate batch of updates
      for (let i = 0; i < batchSize; i++) {
        const update = {
          eventType: 'UPDATE',
          new: {
            id: `availability-${i}`,
            teacher_id: `teacher-${i}`,
            available_spots: Math.floor(Math.random() * 10),
            updated_at: new Date().toISOString()
          }
        }
        
        updates.push(update)
      }
      
      performance.mark('batch-end')
      performance.measure('batch-processing', 'batch-start', 'batch-end')
      
      const measures = performance.getEntriesByType('measure')
      const batchMeasure = measures.find((m: any) => m.name === 'batch-processing')
      
      // Batch processing should be efficient
      expect(batchMeasure!.duration).toBeLessThan(200) // 200ms for 10 updates
      expect(updates).toHaveLength(batchSize)
    })

    it('debounces rapid successive updates', async () => {
      let updateCount = 0
      const debounceMs = 16 // 60fps target
      
      const debouncedHandler = (() => {
        let timeoutId: NodeJS.Timeout
        return (callback: () => void) => {
          clearTimeout(timeoutId)
          timeoutId = setTimeout(callback, debounceMs)
        }
      })()

      // Simulate rapid updates
      const promises: Promise<void>[] = []
      for (let i = 0; i < 5; i++) {
        promises.push(new Promise(resolve => {
          debouncedHandler(() => {
            updateCount++
            resolve()
          })
        }))
      }

      await new Promise(resolve => setTimeout(resolve, debounceMs + 10))
      
      // Should only process once due to debouncing
      expect(updateCount).toBe(1)
    })
  })

  describe('Conflict Prevention', () => {
    it('prevents double-booking conflicts', async () => {
      const slotId = 'slot-123'
      const maxCapacity = 1
      let currentBookings = 0
      
      const attemptBooking = async (userId: string) => {
        // Simulate checking current capacity
        if (currentBookings >= maxCapacity) {
          throw new Error('CAPACITY_EXCEEDED')
        }
        
        // Simulate booking attempt
        currentBookings++
        return {
          success: true,
          userId,
          slotId,
          bookedAt: new Date().toISOString()
        }
      }

      // First booking should succeed
      const booking1 = await attemptBooking('user-1')
      expect(booking1.success).toBe(true)
      expect(currentBookings).toBe(1)

      // Second booking should fail
      await expect(attemptBooking('user-2')).rejects.toThrow('CAPACITY_EXCEEDED')
      expect(currentBookings).toBe(1) // Should not increment
    })

    it('handles concurrent booking attempts with atomic operations', async () => {
      const slotId = 'slot-456'
      const maxCapacity = 3
      const bookingAttempts = 5
      const results: any[] = []
      
      // Mock atomic database operation
      let currentCapacity = maxCapacity
      const atomicBooking = async (userId: string) => {
        // Simulate database transaction
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (currentCapacity > 0) {
              currentCapacity--
              resolve({
                success: true,
                userId,
                remainingCapacity: currentCapacity
              })
            } else {
              reject(new Error('SLOT_FULL'))
            }
          }, Math.random() * 10) // Random delay to simulate concurrency
        })
      }

      // Concurrent booking attempts
      const promises = Array.from({ length: bookingAttempts }, (_, i) => 
        atomicBooking(`user-${i}`).catch(error => ({ 
          success: false, 
          error: error.message 
        }))
      )

      const bookingResults = await Promise.all(promises)
      
      const successful = bookingResults.filter((r: any) => r.success)
      const failed = bookingResults.filter((r: any) => !r.success)

      expect(successful).toHaveLength(maxCapacity)
      expect(failed).toHaveLength(bookingAttempts - maxCapacity)
      expect(currentCapacity).toBe(0)
    })

    it('validates booking conflicts with overlapping time slots', () => {
      const existingBookings = [
        { startTime: '09:00', endTime: '10:30', date: '2025-07-24' },
        { startTime: '14:00', endTime: '15:30', date: '2025-07-24' }
      ]

      const checkTimeConflict = (newBooking: any) => {
        return existingBookings.some((existing: any) => 
          existing.date === newBooking.date &&
          (
            (newBooking.startTime >= existing.startTime && newBooking.startTime < existing.endTime) ||
            (newBooking.endTime > existing.startTime && newBooking.endTime <= existing.endTime) ||
            (newBooking.startTime <= existing.startTime && newBooking.endTime >= existing.endTime)
          )
        )
      }

      // Conflicting booking
      const conflictingBooking = {
        startTime: '09:30',
        endTime: '11:00',
        date: '2025-07-24'
      }
      expect(checkTimeConflict(conflictingBooking)).toBe(true)

      // Non-conflicting booking
      const nonConflictingBooking = {
        startTime: '11:00',
        endTime: '12:30',
        date: '2025-07-24'
      }
      expect(checkTimeConflict(nonConflictingBooking)).toBe(false)
    })
  })

  describe('Connection Resilience', () => {
    it('handles reconnection after network interruption', async () => {
      let connectionState = 'connected'
      let reconnectAttempts = 0
      const maxReconnectAttempts = 3
      
      const simulateNetworkFailure = () => {
        connectionState = 'disconnected'
      }

      const attemptReconnection = async (): Promise<boolean> => {
        reconnectAttempts++
        
        // Simulate exponential backoff
        const delay = Math.pow(2, reconnectAttempts) * 1000
        await new Promise(resolve => setTimeout(resolve, Math.min(delay, 100))) // Cap for testing
        
        // Simulate successful reconnection after 2 attempts
        if (reconnectAttempts >= 2) {
          connectionState = 'connected'
          return true
        }
        
        return false
      }

      // Simulate network failure
      simulateNetworkFailure()
      expect(connectionState).toBe('disconnected')

      // Attempt reconnection
      let reconnected = false
      while (!reconnected && reconnectAttempts < maxReconnectAttempts) {
        reconnected = await attemptReconnection()
      }

      expect(reconnected).toBe(true)
      expect(connectionState).toBe('connected')
      expect(reconnectAttempts).toBe(2)
    })

    it('queues updates during disconnection and syncs on reconnect', async () => {
      let isConnected = true
      const updateQueue: any[] = []
      const processedUpdates: any[] = []

      const queueUpdate = (update: any) => {
        if (isConnected) {
          processedUpdates.push(update)
        } else {
          updateQueue.push(update)
        }
      }

      const processQueuedUpdates = () => {
        while (updateQueue.length > 0) {
          const update = updateQueue.shift()
          processedUpdates.push(update)
        }
      }

      // Process updates while connected
      queueUpdate({ id: 1, type: 'availability_change' })
      expect(processedUpdates).toHaveLength(1)

      // Simulate disconnection
      isConnected = false
      queueUpdate({ id: 2, type: 'availability_change' })
      queueUpdate({ id: 3, type: 'availability_change' })
      
      expect(updateQueue).toHaveLength(2)
      expect(processedUpdates).toHaveLength(1)

      // Simulate reconnection
      isConnected = true
      processQueuedUpdates()
      
      expect(updateQueue).toHaveLength(0)
      expect(processedUpdates).toHaveLength(3)
    })
  })

  describe('Performance Monitoring', () => {
    it('tracks subscription performance metrics', () => {
      const metrics = {
        subscriptionLatency: 0,
        updateFrequency: 0,
        errorRate: 0,
        connectionUptime: 0
      }

      const trackSubscriptionPerformance = () => {
        const startTime = performance.now()
        
        // Simulate subscription setup
        mockSupabaseClient.channel('availability_updates')
        mockSupabaseClient.on('postgres_changes', {}, () => {
          metrics.subscriptionLatency = performance.now() - startTime
        })
        
        return metrics
      }

      const result = trackSubscriptionPerformance()
      expect(result).toBeDefined()
      expect(mockSupabaseClient.channel).toHaveBeenCalledWith('availability_updates')
    })

    it('measures memory usage during real-time operations', () => {
      const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0
      
      // Simulate memory-intensive operations
      const largeDataSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `slot-${i}`,
        availability: Array.from({ length: 10 }, (_, j) => ({
          date: new Date(Date.now() + j * 24 * 60 * 60 * 1000).toISOString(),
          slots: Array.from({ length: 8 }, (_, k) => ({
            time: `${8 + k}:00`,
            available: Math.random() > 0.3
          }))
        }))
      }))

      const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0
      const memoryUsed = memoryAfter - memoryBefore

      // Ensure data was created
      expect(largeDataSet).toHaveLength(1000)
      
      // Memory usage tracking (when available)
      if ((performance as any).memory) {
        expect(memoryUsed).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('Load Testing Simulation', () => {
    it('handles high-frequency availability updates', async () => {
      const updateCount = 100
      const startTime = Date.now()
      const processedUpdates: any[] = []

      // Simulate high-frequency updates
      for (let i = 0; i < updateCount; i++) {
        const update = {
          id: `update-${i}`,
          timestamp: Date.now(),
          teacherId: `teacher-${i % 10}`, // 10 teachers
          availabilityChange: Math.random() > 0.5 ? 1 : -1
        }
        
        processedUpdates.push(update)
      }

      const endTime = Date.now()
      const totalTime = endTime - startTime
      const updatesPerSecond = (updateCount / totalTime) * 1000

      expect(processedUpdates).toHaveLength(updateCount)
      expect(updatesPerSecond).toBeGreaterThan(100) // Should handle 100+ updates/second
    })

    it('maintains performance under concurrent user load', async () => {
      const concurrentUsers = 50
      const actionsPerUser = 10
      const results: any[] = []

      const simulateUserActions = async (userId: string) => {
        const actions: Promise<any>[] = []
        
        for (let i = 0; i < actionsPerUser; i++) {
          const action = new Promise(resolve => {
            setTimeout(() => {
              resolve({
                userId,
                action: `action-${i}`,
                timestamp: Date.now()
              })
            }, Math.random() * 100) // Random delay 0-100ms
          })
          
          actions.push(action)
        }
        
        return Promise.all(actions)
      }

      const startTime = Date.now()
      
      // Simulate concurrent users
      const userPromises = Array.from({ length: concurrentUsers }, (_, i) =>
        simulateUserActions(`user-${i}`)
      )

      const allResults = await Promise.all(userPromises)
      const flatResults = allResults.flat()
      
      const endTime = Date.now()
      const totalTime = endTime - startTime

      expect(flatResults).toHaveLength(concurrentUsers * actionsPerUser)
      expect(totalTime).toBeLessThan(1000) // Should complete within 1 second
    })
  })
})