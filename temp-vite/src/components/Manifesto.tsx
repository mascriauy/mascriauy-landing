import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const statements = [
  {
    text: 'Respetamos el legado del campo uruguayo.',
    highlight: 'legado',
  },
  {
    text: 'Construimos con software que se siente natural.',
    highlight: 'natural',
  },
  {
    text: 'Potenciamos a quienes trabajan la tierra.',
    highlight: 'tierra',
  },
]

export default function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section ref={containerRef} id="manifesto" className="relative bg-bg">
      {statements.map((statement, index) => (
        <StatementCard
          key={statement.highlight}
          statement={statement}
          index={index}
          total={statements.length}
          progress={scrollYProgress}
        />
      ))}
    </section>
  )
}

interface StatementCardProps {
  statement: { text: string; highlight: string }
  index: number
  total: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}

function StatementCard({ statement, index, total, progress }: StatementCardProps) {
  const start = index / total
  const end = (index + 1) / total

  const opacity = useTransform(progress, [start, end - 0.08, end], [1, 1, 0])
  const scale = useTransform(progress, [start, end - 0.08, end], [1, 1, 0.92])

  const parts = statement.text.split(statement.highlight)

  return (
    <motion.div
      style={{ opacity, scale, zIndex: index + 1 }}
      className="sticky top-0 min-h-[100dvh] flex items-center justify-center px-6 lg:px-12 py-24"
    >
      <div className="max-w-[1100px] text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-3xl md:text-5xl lg:text-6xl leading-tight font-light text-fg text-balance"
        >
          {parts[0]}
          <span className="text-accent font-medium">{statement.highlight}</span>
          {parts[1]}
        </motion.h2>
      </div>
    </motion.div>
  )
}
