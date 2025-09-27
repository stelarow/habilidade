import { useState, useEffect } from 'react'

export function useConsoleTypewriter(lines, options = {}) {
  const {
    speed = 80,
    pauseBetweenLines = 600,
    startDelay = 1000
  } = options

  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (lines.length === 0) return

    let timeoutId

    // Delay inicial antes de começar
    if (!hasStarted) {
      timeoutId = setTimeout(() => {
        setHasStarted(true)
      }, startDelay)
      return () => clearTimeout(timeoutId)
    }

    // Se todas as linhas foram digitadas, marcar como completo
    if (currentLineIndex >= lines.length) {
      setIsComplete(true)
      return
    }

    const currentLine = lines[currentLineIndex]
    const currentLength = currentText.length

    if (currentLength < currentLine.length) {
      // Continua digitando a linha atual
      timeoutId = setTimeout(() => {
        setCurrentText(currentLine.slice(0, currentLength + 1))
      }, speed)
    } else {
      // Linha completa, pausa e vai para próxima linha
      timeoutId = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1)
        setCurrentText('')
      }, pauseBetweenLines)
    }

    return () => clearTimeout(timeoutId)
  }, [lines, speed, pauseBetweenLines, startDelay, currentLineIndex, currentText, hasStarted])

  // Constrói as linhas para exibição
  const displayLines = []

  // Adiciona todas as linhas completas
  for (let i = 0; i < currentLineIndex; i++) {
    displayLines.push(lines[i])
  }

  // Adiciona a linha atual sendo digitada (se houver)
  if (currentLineIndex < lines.length && hasStarted) {
    displayLines.push(currentText)
  }

  return {
    displayLines,
    isComplete,
    hasStarted
  }
}