import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const quizSubmissionSchema = z.object({
  quiz_id: z.string().uuid(),
  enrollment_id: z.string().uuid(),
  answers: z.array(z.object({
    question_id: z.string().uuid(),
    selected_answer: z.number().int().min(0),
    time_taken_seconds: z.number().min(0).optional(),
    confidence_level: z.number().min(1).max(5).optional(),
    hint_used: z.boolean().default(false)
  })),
  total_time_seconds: z.number().min(0),
  started_at: z.string(),
  completed_at: z.string().optional()
})

// POST /api/quiz/submit - Submit quiz answers and get detailed feedback
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = quizSubmissionSchema.parse(body)

    const { quiz_id, enrollment_id, answers, total_time_seconds, started_at, completed_at } = validatedData

    // Verify user has access to this quiz
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id, user_id, course_id')
      .eq('id', enrollment_id)
      .eq('user_id', user.id)
      .single()

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found or unauthorized' },
        { status: 404 }
      )
    }

    // Get quiz details and questions
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select(`
        *,
        questions:quiz_questions(*)
      `)
      .eq('id', quiz_id)
      .single()

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Check how many attempts user has made
    const { data: previousAttempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('attempt_number')
      .eq('quiz_id', quiz_id)
      .eq('user_id', user.id)
      .order('attempt_number', { ascending: false })

    if (attemptsError) {
      console.error('Error checking previous attempts:', attemptsError)
      return NextResponse.json(
        { error: 'Failed to verify quiz attempts' },
        { status: 500 }
      )
    }

    const attemptNumber = (previousAttempts?.[0]?.attempt_number || 0) + 1

    // Check if user has exceeded allowed attempts
    if (quiz.attempts_allowed && attemptNumber > quiz.attempts_allowed) {
      return NextResponse.json(
        { error: 'Maximum attempts exceeded' },
        { status: 400 }
      )
    }

    // Validate and score answers
    const questionMap = quiz.questions.reduce((acc: any, q: any) => {
      acc[q.id] = q
      return acc
    }, {})

    let totalScore = 0
    let totalPoints = 0
    const detailedResults = []

    for (const answer of answers) {
      const question = questionMap[answer.question_id]
      if (!question) {
        return NextResponse.json(
          { error: `Question ${answer.question_id} not found in quiz` },
          { status: 400 }
        )
      }

      const isCorrect = answer.selected_answer === question.correct_answer
      const pointsEarned = isCorrect ? (question.points || 1) : 0
      
      totalScore += pointsEarned
      totalPoints += (question.points || 1)

      detailedResults.push({
        question_id: answer.question_id,
        question_text: question.question,
        options: question.options,
        selected_answer: answer.selected_answer,
        correct_answer: question.correct_answer,
        is_correct: isCorrect,
        points_earned: pointsEarned,
        max_points: question.points || 1,
        explanation: question.explanation,
        time_taken_seconds: answer.time_taken_seconds,
        confidence_level: answer.confidence_level,
        hint_used: answer.hint_used
      })
    }

    // Calculate percentage and pass/fail
    const scorePercentage = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 0
    const passed = scorePercentage >= (quiz.passing_score || 70)

    // Create quiz attempt record
    const { data: quizAttempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert([{
        quiz_id,
        user_id: user.id,
        answers: JSON.stringify(answers),
        score: totalScore,
        total_points: totalPoints,
        passed,
        attempt_number: attemptNumber,
        started_at,
        completed_at: completed_at || new Date().toISOString(),
        time_spent_minutes: Math.round(total_time_seconds / 60)
      }])
      .select()
      .single()

    if (attemptError) {
      console.error('Error creating quiz attempt:', attemptError)
      return NextResponse.json(
        { error: 'Failed to save quiz attempt' },
        { status: 500 }
      )
    }

    // Create detailed quiz responses
    const quizResponses = answers.map(answer => ({
      quiz_attempt_id: quizAttempt.id,
      question_id: answer.question_id,
      user_id: user.id,
      selected_answer: answer.selected_answer,
      is_correct: questionMap[answer.question_id].correct_answer === answer.selected_answer,
      points_earned: questionMap[answer.question_id].correct_answer === answer.selected_answer ? 
        (questionMap[answer.question_id].points || 1) : 0,
      time_taken_seconds: answer.time_taken_seconds,
      response_confidence: answer.confidence_level,
      hint_used: answer.hint_used,
      feedback_shown: true
    }))

    const { error: responsesError } = await supabase
      .from('quiz_responses')
      .insert(quizResponses)

    if (responsesError) {
      console.error('Error saving quiz responses:', responsesError)
      // Don't fail the request, just log the error
    }

    // Update user's quiz performance in progress if this is associated with a lesson
    if (quiz.lesson_id) {
      await supabase
        .from('progress')
        .update({
          quiz_score: scorePercentage,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('lesson_id', quiz.lesson_id)
        .eq('enrollment_id', enrollment_id)
    }

    // Check for quiz-related achievements
    await checkQuizAchievements(supabase, user.id, scorePercentage, passed, attemptNumber)

    // Update gamification stats
    await updateGamificationStats(supabase, user.id, {
      quiz_completed: true,
      score: scorePercentage,
      points_earned: totalScore
    })

    // Prepare comprehensive response
    const response = {
      attempt: {
        id: quizAttempt.id,
        attempt_number: attemptNumber,
        score: totalScore,
        total_points: totalPoints,
        score_percentage: scorePercentage,
        passed,
        time_spent_minutes: Math.round(total_time_seconds / 60),
        completed_at: quizAttempt.completed_at
      },
      
      quiz_info: {
        title: quiz.title,
        passing_score: quiz.passing_score || 70,
        attempts_allowed: quiz.attempts_allowed,
        attempts_remaining: quiz.attempts_allowed ? Math.max(0, quiz.attempts_allowed - attemptNumber) : null
      },

      detailed_results: detailedResults,

      performance_analysis: {
        accuracy: Math.round((detailedResults.filter(r => r.is_correct).length / detailedResults.length) * 100),
        average_time_per_question: detailedResults.length > 0 ? 
          Math.round(detailedResults.reduce((sum, r) => sum + (r.time_taken_seconds || 0), 0) / detailedResults.length) : 0,
        hints_used: detailedResults.filter(r => r.hint_used).length,
        confidence_distribution: calculateConfidenceDistribution(detailedResults)
      },

      feedback: {
        overall_message: generateOverallFeedback(scorePercentage, passed, attemptNumber, quiz.passing_score),
        improvement_suggestions: generateImprovementSuggestions(detailedResults, scorePercentage),
        next_steps: generateNextSteps(passed, quiz.attempts_allowed, attemptNumber)
      },

      can_retry: quiz.attempts_allowed ? attemptNumber < quiz.attempts_allowed : true
    }

    return NextResponse.json(response)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Quiz submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions
async function checkQuizAchievements(supabase: any, userId: string, score: number, passed: boolean, attemptNumber: number) {
  try {
    // Perfect score achievement
    if (score === 100) {
      await unlockAchievement(supabase, userId, 'quiz_perfect_score')
    }

    // First time passing
    if (passed && attemptNumber === 1) {
      await unlockAchievement(supabase, userId, 'quiz_first_try_pass')
    }

    // Update user's quiz statistics for aggregate achievements
    const { data: userStats } = await supabase
      .from('quiz_attempts')
      .select('score, total_points')
      .eq('user_id', userId)

    if (userStats) {
      const averageScore = userStats.reduce((sum: number, attempt: any) => 
        sum + (attempt.score / attempt.total_points * 100), 0) / userStats.length

      // High average achievement
      if (averageScore >= 90 && userStats.length >= 10) {
        await unlockAchievement(supabase, userId, 'quiz_high_average')
      }
    }
  } catch (error) {
    console.error('Error checking quiz achievements:', error)
  }
}

async function unlockAchievement(supabase: any, userId: string, achievementType: string) {
  try {
    const { data: achievement } = await supabase
      .from('achievements')
      .select('id')
      .eq('criteria->type', achievementType)
      .single()

    if (achievement) {
      await supabase
        .from('user_achievements')
        .upsert([{
          user_id: userId,
          achievement_id: achievement.id,
          unlocked_at: new Date().toISOString()
        }], {
          onConflict: 'user_id,achievement_id'
        })
    }
  } catch (error) {
    console.error(`Error unlocking achievement ${achievementType}:`, error)
  }
}

async function updateGamificationStats(supabase: any, userId: string, data: any) {
  try {
    const xpGained = data.points_earned * 2 // 2 XP per point earned
    
    await supabase
      .from('user_gamification_stats')
      .upsert([{
        user_id: userId,
        total_xp: supabase.rpc('increment_xp', { user_id: userId, xp_amount: xpGained }),
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'user_id'
      })
  } catch (error) {
    console.error('Error updating gamification stats:', error)
  }
}

function calculateConfidenceDistribution(results: any[]) {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  
  results.forEach(result => {
    if (result.confidence_level) {
      distribution[result.confidence_level as keyof typeof distribution]++
    }
  })

  return distribution
}

function generateOverallFeedback(score: number, passed: boolean, attemptNumber: number, passingScore: number) {
  if (score === 100) {
    return "Perfeito! Você demonstrou domínio completo do conteúdo. Parabéns!"
  } else if (score >= 90) {
    return "Excelente trabalho! Você tem um ótimo entendimento do material."
  } else if (passed) {
    return `Muito bem! Você passou com ${score}% de acerto. Continue assim!`
  } else {
    return `Você obteve ${score}%, abaixo da nota necessária (${passingScore}%). Revise o conteúdo e tente novamente.`
  }
}

function generateImprovementSuggestions(results: any[], score: number) {
  const suggestions = []
  
  const incorrectAnswers = results.filter(r => !r.is_correct)
  if (incorrectAnswers.length > 0) {
    suggestions.push("Revise as explicações das questões que você errou")
  }

  const lowConfidenceAnswers = results.filter(r => r.confidence_level && r.confidence_level <= 2)
  if (lowConfidenceAnswers.length > 0) {
    suggestions.push("Estude mais profundamente os tópicos em que você tem menos confiança")
  }

  const hintsUsed = results.filter(r => r.hint_used).length
  if (hintsUsed > results.length * 0.5) {
    suggestions.push("Tente resolver as questões sem usar dicas para testar seu conhecimento")
  }

  if (score < 70) {
    suggestions.push("Releia o material da lição antes de tentar novamente")
    suggestions.push("Pratique com exercícios adicionais se disponíveis")
  }

  return suggestions
}

function generateNextSteps(passed: boolean, attemptsAllowed: number | null, attemptNumber: number) {
  if (passed) {
    return ["Parabéns! Você pode prosseguir para a próxima lição", "Continue mantendo esse nível de excelência"]
  }

  const steps = ["Revise o conteúdo da lição", "Foque nas áreas onde teve mais dificuldade"]
  
  if (attemptsAllowed) {
    const remaining = attemptsAllowed - attemptNumber
    if (remaining > 0) {
      steps.push(`Você tem mais ${remaining} tentativa(s) disponível(is)`)
    } else {
      steps.push("Você esgotou suas tentativas para este quiz")
    }
  } else {
    steps.push("Tente novamente quando se sentir preparado")
  }

  return steps
}