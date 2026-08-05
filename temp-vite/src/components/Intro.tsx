import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface IntroProps {
  onComplete: () => void
}

export default function Intro({ onComplete }: IntroProps) {
  const [phase, setPhase] = useState<'enter' | 'settle' | 'exit'>('enter')

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      onComplete()
      return
    }

    const settleTimer = setTimeout(() => setPhase('settle'), 1200)
    const exitTimer = setTimeout(() => setPhase('exit'), 2200)
    const doneTimer = setTimeout(onComplete, 3000)

    return () => {
      clearTimeout(settleTimer)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
          <div className="relative overflow-hidden">
            <motion.span
              className="block font-sans text-5xl md:text-7xl font-bold tracking-tight"
              initial={{ y: '100%' }}
              animate={{
                y: phase === 'enter' ? '0%' : phase === 'settle' ? '0%' : '-100%',
              }}
              transition={{ duration: 0.8, ease: easeOutExpo }}
            >
              <span className="text-accent">+</span>
              <span className="text-fg">Cría</span>
              <span className="text-sky">UY</span>
            </motion.span>
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-accent"
              initial={{ width: '0%' }}
              animate={{ width: phase === 'enter' ? '0%' : '100%' }}
              transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.2 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
