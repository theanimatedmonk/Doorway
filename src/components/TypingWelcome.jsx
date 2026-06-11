import { useEffect, useMemo, useState } from 'react'

const TYPING_SPEED_MS = 50
const HOLD_AFTER_TYPING_MS = 3000

function buildUnits(recipientName) {
  const parts = [
    { text: `Hello ${recipientName}👋`, bold: true },
    { text: ', Thanks for taking a look', bold: false },
  ]

  return parts.flatMap((part) =>
    [...part.text].map((char) => ({ char, bold: part.bold })),
  )
}

export default function TypingWelcome({ recipientName, onComplete }) {
  const units = useMemo(() => buildUnits(recipientName), [recipientName])
  const [index, setIndex] = useState(0)
  const typingDone = index >= units.length

  useEffect(() => {
    if (!typingDone) {
      const timer = setTimeout(() => setIndex((i) => i + 1), TYPING_SPEED_MS)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(onComplete, HOLD_AFTER_TYPING_MS)
    return () => clearTimeout(timer)
  }, [index, typingDone, onComplete, units.length])

  const visible = units.slice(0, index)
  const boldText = visible.filter((u) => u.bold).map((u) => u.char).join('')
  const regularText = visible.filter((u) => !u.bold).map((u) => u.char).join('')

  return (
    <p className="text-center text-xl leading-relaxed text-slate-900 md:text-2xl">
      {boldText && <span className="font-bold">{boldText}</span>}
      {regularText && <span className="font-normal">{regularText}</span>}
      <span className="typing-cursor ml-0.5 inline-block font-light text-slate-900">|</span>
    </p>
  )
}
