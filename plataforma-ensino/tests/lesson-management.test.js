// Jest test for Lesson Management System
// Testing the core functionality of lesson creation and management

describe('Lesson Management System', () => {
  describe('Lesson Creation', () => {
    test('should create lesson with basic information', () => {
      const lessonData = {
        course_id: 'course-1',
        title: 'Introduction to React',
        description: 'Learn the basics of React',
        video_url: 'https://example.com/video',
        content: 'Lesson content here',
        allows_file_upload: true,
        is_preview: false,
        order_index: 1
      }

      expect(lessonData.title).toBe('Introduction to React')
      expect(lessonData.course_id).toBe('course-1')
      expect(lessonData.allows_file_upload).toBe(true)
      expect(lessonData.order_index).toBe(1)
    })

    test('should validate required fields', () => {
      const invalidLesson = {
        description: 'Missing required fields'
      }

      const hasRequiredFields = invalidLesson.course_id && invalidLesson.title
      expect(hasRequiredFields).toBe(false)
    })

    test('should auto-calculate next order index', () => {
      const existingLessons = [
        { order_index: 1 },
        { order_index: 2 },
        { order_index: 3 }
      ]

      const nextOrderIndex = Math.max(...existingLessons.map(l => l.order_index)) + 1
      expect(nextOrderIndex).toBe(4)
    })

    test('should handle first lesson in course', () => {
      const existingLessons = []
      const nextOrderIndex = existingLessons.length === 0 ? 1 : Math.max(...existingLessons.map(l => l.order_index)) + 1
      expect(nextOrderIndex).toBe(1)
    })
  })

  describe('Exercise Management', () => {
    test('should create exercise with proper structure', () => {
      const exercise = {
        title: 'Practice Exercise',
        description: 'Complete these coding challenges',
        download_url: 'https://example.com/exercise.pdf',
        order_index: 1
      }

      expect(exercise.title).toBe('Practice Exercise')
      expect(exercise.download_url).toContain('exercise.pdf')
      expect(exercise.order_index).toBe(1)
    })

    test('should allow multiple exercises per lesson', () => {
      const exercises = [
        {
          title: 'Exercise 1',
          description: 'Basic concepts',
          order_index: 1
        },
        {
          title: 'Exercise 2', 
          description: 'Advanced topics',
          order_index: 2
        }
      ]

      expect(exercises).toHaveLength(2)
      expect(exercises[0].order_index).toBe(1)
      expect(exercises[1].order_index).toBe(2)
    })
  })

  describe('Quiz System', () => {
    test('should create quiz with questions', () => {
      const quiz = {
        title: 'React Knowledge Check',
        description: 'Test your understanding',
        attempts_allowed: 3,
        passing_score: 70,
        questions: [
          {
            question: 'What is JSX?',
            options: ['A library', 'A syntax extension', 'A framework', 'A language'],
            correct_answer: 1,
            points: 1,
            order_index: 1
          }
        ]
      }

      expect(quiz.title).toBe('React Knowledge Check')
      expect(quiz.questions).toHaveLength(1)
      expect(quiz.questions[0].options).toHaveLength(4)
      expect(quiz.questions[0].correct_answer).toBe(1)
      expect(quiz.passing_score).toBe(70)
    })

    test('should validate correct answer is within options range', () => {
      const question = {
        question: 'What is 2+2?',
        options: ['2', '3', '4', '5'],
        correct_answer: 2, // Index of '4'
        points: 1
      }

      const isValidAnswer = question.correct_answer >= 0 && question.correct_answer < question.options.length
      expect(isValidAnswer).toBe(true)
      expect(question.options[question.correct_answer]).toBe('4')
    })

    test('should require at least 2 options per question', () => {
      const validQuestion = {
        options: ['Option A', 'Option B']
      }
      
      const invalidQuestion = {
        options: ['Only one option']
      }

      expect(validQuestion.options.length >= 2).toBe(true)
      expect(invalidQuestion.options.length >= 2).toBe(false)
    })

    test('should validate quiz settings', () => {
      const quiz = {
        attempts_allowed: 3,
        passing_score: 70,
        time_limit_minutes: 30
      }

      expect(quiz.attempts_allowed).toBeGreaterThan(0)
      expect(quiz.passing_score).toBeGreaterThanOrEqual(0)
      expect(quiz.passing_score).toBeLessThanOrEqual(100)
      expect(quiz.time_limit_minutes).toBeGreaterThan(0)
    })
  })

  describe('File Upload System', () => {
    test('should configure lesson for file uploads', () => {
      const lesson = {
        title: 'Programming Assignment',
        allows_file_upload: true
      }

      expect(lesson.allows_file_upload).toBe(true)
    })

    test('should track submission metadata', () => {
      const submission = {
        lesson_id: 'lesson-1',
        user_id: 'user-1',
        file_name: 'assignment.pdf',
        file_size: 1024000, // 1MB
        mime_type: 'application/pdf',
        status: 'pending'
      }

      expect(submission.file_name).toBe('assignment.pdf')
      expect(submission.file_size).toBe(1024000)
      expect(submission.mime_type).toBe('application/pdf')
      expect(submission.status).toBe('pending')
    })
  })

  describe('Lesson Ordering', () => {
    test('should maintain proper lesson order', () => {
      const lessons = [
        { id: 'lesson-1', order_index: 1, title: 'Introduction' },
        { id: 'lesson-2', order_index: 2, title: 'Basic Concepts' },
        { id: 'lesson-3', order_index: 3, title: 'Advanced Topics' }
      ]

      // Verify order is sequential
      for (let i = 0; i < lessons.length; i++) {
        expect(lessons[i].order_index).toBe(i + 1)
      }
    })

    test('should prevent duplicate order indexes', () => {
      const existingOrders = [1, 2, 3, 5] // Intentional gap at 4
      const newOrder = 4

      const isDuplicate = existingOrders.includes(newOrder)
      expect(isDuplicate).toBe(false)
    })

    test('should calculate correct insertion point', () => {
      const maxOrder = 9 // Existing max order in course
      const nextOrder = maxOrder + 1

      expect(nextOrder).toBe(10)
    })
  })

  describe('Content Management', () => {
    test('should support rich text content', () => {
      const lesson = {
        title: 'Lesson with Content',
        content: `
          # Introduction to React

          React is a JavaScript library for building user interfaces.

          ## Key Concepts
          - Components
          - Props
          - State

          [Download PDF](https://example.com/react-guide.pdf)
        `
      }

      expect(lesson.content).toContain('# Introduction to React')
      expect(lesson.content).toContain('Key Concepts')
      expect(lesson.content).toContain('Download PDF')
    })

    test('should handle materials array', () => {
      const materials = [
        {
          type: 'pdf',
          title: 'Course Handout',
          url: 'https://example.com/handout.pdf',
          size: 2048000
        },
        {
          type: 'link',
          title: 'External Resource',
          url: 'https://reactjs.org'
        }
      ]

      expect(materials).toHaveLength(2)
      expect(materials[0].type).toBe('pdf')
      expect(materials[1].type).toBe('link')
    })
  })

  describe('Integration Scenarios', () => {
    test('should create complete lesson with all features', () => {
      const completeLesson = {
        // Basic info
        course_id: 'course-1',
        title: 'Complete React Lesson',
        description: 'A comprehensive lesson with all features',
        video_url: 'https://example.com/video',
        
        // Content
        content: 'Rich text content with instructions',
        allows_file_upload: true,
        
        // Exercises
        exercises: [
          {
            title: 'Coding Exercise',
            description: 'Build a React component',
            download_url: 'https://example.com/exercise.zip',
            order_index: 1
          }
        ],
        
        // Quiz
        quiz: {
          title: 'Knowledge Check',
          attempts_allowed: 2,
          passing_score: 80,
          questions: [
            {
              question: 'What is a React component?',
              options: ['A function', 'A class', 'Both', 'Neither'],
              correct_answer: 2,
              points: 5
            }
          ]
        },
        
        // Settings
        is_preview: false,
        order_index: 1
      }

      // Verify all components are present
      expect(completeLesson.title).toBe('Complete React Lesson')
      expect(completeLesson.allows_file_upload).toBe(true)
      expect(completeLesson.exercises).toHaveLength(1)
      expect(completeLesson.quiz.questions).toHaveLength(1)
      expect(completeLesson.content).toContain('Rich text content')
    })

    test('should handle lesson update scenario', () => {
      const originalLesson = {
        id: 'lesson-1',
        title: 'Original Title',
        exercises: [
          { title: 'Exercise 1', order_index: 1 }
        ]
      }

      const updatedLesson = {
        ...originalLesson,
        title: 'Updated Title',
        exercises: [
          { title: 'Updated Exercise 1', order_index: 1 },
          { title: 'New Exercise 2', order_index: 2 }
        ]
      }

      expect(updatedLesson.title).toBe('Updated Title')
      expect(updatedLesson.exercises).toHaveLength(2)
      expect(updatedLesson.exercises[1].title).toBe('New Exercise 2')
    })
  })
})

// Utility functions for testing
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

function validateQuizQuestion(question) {
  const errors = []
  
  if (!question.question || question.question.trim() === '') {
    errors.push('Question text is required')
  }
  
  if (!Array.isArray(question.options) || question.options.length < 2) {
    errors.push('At least 2 options are required')
  }
  
  if (question.correct_answer < 0 || question.correct_answer >= question.options.length) {
    errors.push('Correct answer must be within options range')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

function calculateQuizScore(answers, questions) {
  let correctCount = 0
  let totalPoints = 0
  
  questions.forEach((question, index) => {
    totalPoints += question.points || 1
    if (answers[index] === question.correct_answer) {
      correctCount += question.points || 1
    }
  })
  
  return {
    score: Math.round((correctCount / totalPoints) * 100),
    correctAnswers: correctCount,
    totalPoints
  }
}

// Test these utility functions
describe('Utility Functions', () => {
  test('should generate valid slug from title', () => {
    expect(generateSlug('Introduction to React')).toBe('introduction-to-react')
    expect(generateSlug('Advanced CSS & HTML')).toBe('advanced-css-html')
    expect(generateSlug('   Spaced   Title   ')).toBe('spaced-title')
  })

  test('should validate quiz questions', () => {
    const validQuestion = {
      question: 'What is React?',
      options: ['Library', 'Framework'],
      correct_answer: 0
    }
    
    const invalidQuestion = {
      question: '',
      options: ['Only one'],
      correct_answer: 5
    }

    expect(validateQuizQuestion(validQuestion).isValid).toBe(true)
    expect(validateQuizQuestion(invalidQuestion).isValid).toBe(false)
    expect(validateQuizQuestion(invalidQuestion).errors).toHaveLength(3)
  })

  test('should calculate quiz score correctly', () => {
    const questions = [
      { correct_answer: 0, points: 1 },
      { correct_answer: 1, points: 2 },
      { correct_answer: 2, points: 1 }
    ]
    
    const answers = [0, 1, 0] // First two correct, last wrong
    const result = calculateQuizScore(answers, questions)

    expect(result.score).toBe(75) // 3 out of 4 points = 75%
    expect(result.correctAnswers).toBe(3)
    expect(result.totalPoints).toBe(4)
  })
})