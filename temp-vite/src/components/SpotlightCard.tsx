import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'motion/react'

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
}

export default function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set(event.clientX - rect.left)
    y.set(event.clientY - rect.top)
  }

  const background = useMotionTemplate`
    radial-gradient(450px circle at ${x}px ${y}px, rgba(74, 222, 128, 0.12), transparent 40%)
  `

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl z-0"
        style={{ background }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
