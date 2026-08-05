import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from 'motion/react'
import { ArrowRight } from '@phosphor-icons/react'

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

const nodes = [
  { id: 'genealogy', label: 'Genealogía', x: -26, y: -24 },
  { id: 'location', label: 'Ubicación', x: 30, y: -10 },
  { id: 'health', label: 'Sanidad', x: 26, y: 24 },
  { id: 'production', label: 'Producción', x: -32, y: 10 },
  { id: 'traceability', label: 'Trazabilidad', x: 0, y: 34 },
]

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveringImage, setHoveringImage] = useState(false)
  const hoverOpacity = useMotionValue(0)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const handler = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const progress = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 200 : 55,
    damping: reduceMotion ? 30 : 18,
    restDelta: 0.001,
  })

  const initialClip = isMobile
    ? 'inset(28% 12% 28% 12% round 32px)'
    : 'inset(26% 30% 26% 30% round 48px)'
  const expandedClip = isMobile
    ? 'inset(10% 4% 10% 4% round 20px)'
    : 'inset(8% 6% 8% 6% round 24px)'

  const clipPath = useTransform(
    progress,
    [0, reduceMotion ? 0.25 : 0.48],
    [initialClip, expandedClip]
  )

  const imageX = useTransform(
    mouseX,
    [-0.5, 0.5],
    [reduceMotion || isMobile ? 0 : -16, reduceMotion || isMobile ? 0 : 16]
  )
  const imageY = useTransform(
    mouseY,
    [-0.5, 0.5],
    [reduceMotion || isMobile ? 0 : -12, reduceMotion || isMobile ? 0 : 12]
  )

  const topTitleOpacity = useTransform(progress, [0, 0.32], [1, 0])
  const bottomTitleOpacity = useTransform(progress, [0.06, 0.38], [1, 0])

  const nodesOpacity = useTransform(
    [progress, hoverOpacity],
    ([p, h]) => {
      const scrollOpacity = Math.min(1, Math.max(0, ((p as number) - 0.08) / 0.2))
      return Math.max(scrollOpacity, h as number) * 0.95
    }
  )
  const nodesScale = useTransform(progress, [0.2, 0.85], [0.9, 1.3])
  const nodesPulse = useTransform(
    progress,
    [0.2, 0.5, 0.8],
    [0.6, 1, 1.15]
  )

  const finalScale = useTransform(progress, [0.65, 1], [1.08, 1])
  const finalOverlayOpacity = useTransform(progress, [0.78, 0.96], [0, 1])

  const introContentOpacity = useTransform(progress, [0, 0.22], [1, 0])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduceMotion || isMobile) return
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleImageEnter = () => {
    setHoveringImage(true)
    hoverOpacity.set(1)
  }
  const handleImageLeave = () => {
    setHoveringImage(false)
    hoverOpacity.set(0)
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[185vh]"
      onMouseMove={handleMouseMove}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-bg flex flex-col">
        {/* Ambient vignette */}
        <div className="absolute inset-0 z-[5] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,12,18,0.5)_100%)]" />

        {/* Top headline */}
        <motion.div
          style={{ opacity: topTitleOpacity }}
          className="relative z-20 flex-1 flex items-end justify-center pb-2 md:pb-4 pointer-events-none select-none px-6"
        >
          <h1 className="font-sans text-[14vw] md:text-[11vw] font-semibold leading-[0.85] tracking-tight text-fg text-center">
            CRIAR ES
          </h1>
        </motion.div>

        {/* Main image frame with scroll expansion */}
        <motion.div
          data-cursor="caravan"
          style={{ clipPath }}
          className="absolute inset-0 z-10"
          onMouseEnter={handleImageEnter}
          onMouseLeave={handleImageLeave}
        >
          <motion.div
            ref={imageRef}
            style={{ x: imageX, y: imageY, scale: finalScale }}
            className="relative w-full h-full will-change-transform"
          >
            <img
              src="/images/hero-cow-closeup.png"
              alt="Vaca Angus en el campo uruguayo"
              className="w-full h-full object-cover object-[55%_center] md:object-[50%_center] scale-110"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg/40 via-transparent to-bg/20" />
          </motion.div>

        </motion.div>

        {/* Bottom headline */}
        <motion.div
          style={{ opacity: bottomTitleOpacity }}
          className="relative z-20 flex-1 flex items-start justify-center pt-2 md:pt-4 pointer-events-none select-none px-6"
        >
          <h1 className="font-sans text-[14vw] md:text-[11vw] font-semibold leading-[0.85] tracking-tight text-sky text-center">
            DEJAR HUELLA
          </h1>
        </motion.div>

        {/* Organic nodes + traces */}
        <motion.div
          style={{ opacity: nodesOpacity, scale: nodesScale }}
          className="absolute inset-0 z-20 pointer-events-none"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {nodes.map((node) => {
              const cx = 50 + node.x
              const cy = 50 + node.y
              const qx = 50 + node.x * 0.3
              const qy = 50 + node.y * 0.3
              return (
                <g key={node.id}>
                  <motion.path
                    d={`M 50 50 Q ${qx} ${qy} ${cx} ${cy}`}
                    fill="none"
                    stroke="rgba(74,127,181,0.5)"
                    strokeWidth="0.12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: hoveringImage || isMobile ? 1 : 0.75 }}
                    transition={{ duration: 1.2, ease: easeOutExpo }}
                  />
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r="0.55"
                    fill="#4A7FB5"
                    filter="url(#glow)"
                    style={{ scale: nodesPulse }}
                  />
                  <text
                    x={cx}
                    y={cy + 2.2}
                    textAnchor="middle"
                    className="fill-fg/70"
                    style={{
                      fontSize: '1.4px',
                      fontFamily: 'IBM Plex Mono, monospace',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </motion.div>

        {/* Intro content / CTAs */}
        <motion.div
          style={{ opacity: introContentOpacity }}
          className="absolute bottom-0 inset-x-0 z-30 px-6 lg:px-12 pb-12 md:pb-20"
        >
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <p className="text-fg/60 text-lg md:text-xl max-w-md font-light leading-relaxed">
              Tecnología que respira a campo. Diseñamos herramientas intuitivas
              para la ganadería uruguaya.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#manifesto"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-fg rounded-full text-sm font-semibold transition-transform duration-150 active:scale-[0.97] hover:bg-primary-hover"
              >
                Conocer +CríaUY
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href="#ecosystem"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-fg/20 text-fg rounded-full text-sm font-semibold hover:bg-fg/5 transition-colors"
              >
                Descubrir TrazaNet
              </a>
            </div>
          </div>
        </motion.div>

        {/* Final scene overlay */}
        <motion.div
          style={{ opacity: finalOverlayOpacity }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 bg-bg/40 backdrop-blur-[2px]"
        >
          <h2 className="font-sans text-4xl md:text-6xl lg:text-7xl font-semibold text-fg leading-[1.05] mb-8 max-w-4xl">
            Tecnología que entiende el campo.
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#manifesto"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-fg rounded-full text-sm font-semibold transition-transform duration-150 active:scale-[0.97] hover:bg-primary-hover"
            >
              Conocer +CríaUY
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#ecosystem"
              className="inline-flex items-center gap-2 px-6 py-3 border border-fg/20 text-fg rounded-full text-sm font-semibold hover:bg-fg/5 transition-colors"
            >
              Descubrir TrazaNet
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
