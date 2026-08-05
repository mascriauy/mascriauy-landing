import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'motion/react'

export default function CursorSpotlight() {
  const [enabled, setEnabled] = useState(false)
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const springX = useSpring(cursorX, { stiffness: 80, damping: 25 })
  const springY = useSpring(cursorY, { stiffness: 80, damping: 25 })

  const background = useMotionTemplate`
    radial-gradient(600px circle at ${springX}px ${springY}px, rgba(74, 222, 128, 0.07), transparent 40%)
  `

  useEffect(() => {
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(isFine && !reduceMotion)

    if (!isFine || reduceMotion) return

    const onMove = (event: MouseEvent) => {
      cursorX.set(event.clientX)
      cursorY.set(event.clientY)
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [cursorX, cursorY])

  if (!enabled) return null

  return (
    <motion.div
      className="fixed inset-0 z-[55] pointer-events-none"
      style={{ background }}
    />
  )
}
