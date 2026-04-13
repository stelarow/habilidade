import { useEffect, useState } from 'react';

export default function useTypewriter(words, typingSpeed = 120, pause = 2000) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index % words.length];

    let timer;

    timer = isDeleting ? setTimeout(() => {
        setText(currentWord.slice(0, Math.max(0, text.length - 1)));
      }, typingSpeed / 2) : setTimeout(() => {
        setText(currentWord.slice(0, Math.max(0, text.length + 1)));
      }, typingSpeed);

    if (!isDeleting && text === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setIndex((previous) => previous + 1);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, index, words, typingSpeed, pause]);

  return text;
} 