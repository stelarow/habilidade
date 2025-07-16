import { renderHook, act } from '@testing-library/react'
import { useScrollBehavior } from '@/hooks/useScrollBehavior'

// Mock window.scrollY
Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
})

// Mock addEventListener and removeEventListener
const mockAddEventListener = jest.fn()
const mockRemoveEventListener = jest.fn()
Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: mockAddEventListener,
})
Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: mockRemoveEventListener,
})

describe('useScrollBehavior', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.scrollY = 0
  })

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useScrollBehavior())
    
    expect(result.current.scrollY).toBe(0)
    expect(result.current.scrollDirection).toBe(null)
    expect(result.current.isScrolled).toBe(false)
  })

  it('should detect scroll state when scrolled past threshold', () => {
    const { result } = renderHook(() => useScrollBehavior(10))
    
    // Simulate scroll past threshold
    window.scrollY = 15
    
    // Get the scroll handler that was registered
    const scrollHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'scroll'
    )?.[1]
    
    act(() => {
      scrollHandler?.()
    })
    
    expect(result.current.isScrolled).toBe(true)
  })

  it('should detect scroll direction', () => {
    const { result } = renderHook(() => useScrollBehavior(5))
    
    // Get the scroll handler
    const scrollHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'scroll'
    )?.[1]
    
    // Simulate scrolling down
    window.scrollY = 20
    act(() => {
      scrollHandler?.()
    })
    
    // Simulate scrolling up
    window.scrollY = 10
    act(() => {
      scrollHandler?.()
    })
    
    expect(result.current.scrollDirection).toBe('up')
  })

  it('should clean up event listener on unmount', () => {
    const { unmount } = renderHook(() => useScrollBehavior())
    
    unmount()
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    )
  })
})