import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'motion/react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set(event.clientX - rect.left)
    y.set(event.clientY - rect.top)
  }

  const border = useMotionTemplate`
    radial-gradient(500px circle at ${x}px ${y}px, rgba(142, 201, 241, 0.35), transparent 40%)
  `
  const glow = useMotionTemplate`
    radial-gradient(400px circle at ${x}px ${y}px, rgba(142, 201, 241, 0.07), transparent 50%)
  `

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-0"
        style={{ background: glow }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-10 p-[1px]"
        style={{
          background: border,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div className="relative z-20 h-full">{children}</div>
    </div>
  )
}
