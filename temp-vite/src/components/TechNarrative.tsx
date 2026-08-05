import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react'
import { Scan, Cloud, Cow, ArrowRight } from '@phosphor-icons/react'

const stages = [
  {
    title: 'Todo empieza en el campo.',
    body: 'La información nace junto al animal.',
  },
  {
    title: 'Capturamos el dato en el momento exacto.',
    body: 'Peso, condición corporal, edad, sexo y más.',
  },
  {
    title: 'La información viaja y se organiza.',
    body: 'Sin perder contexto. Sin perder continuidad.',
  },
  {
    title: 'Llega a tu teléfono lista para usar.',
    body: 'Consultar, registrar y decidir.',
  },
  {
    title: 'TrazaNet conecta el recorrido completo.',
    body: 'Una sola línea. Del animal a tu decisión.',
  },
]

const dataPills = [
  { label: 'Peso', value: '418 kg' },
  { label: 'CC', value: '3.5' },
  { label: 'Edad', value: '4 años' },
  { label: 'Sexo', value: 'Hembra' },
]

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function TechNarrative() {
  const sectionRef = useRef<HTMLElement>(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [activeStage, setActiveStage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

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
    stiffness: reduceMotion ? 200 : 50,
    damping: reduceMotion ? 30 : 20,
    restDelta: 0.001,
  })

  useEffect(() => {
    return progress.on('change', (v) => {
      const idx = Math.min(stages.length - 1, Math.floor(v * stages.length))
      setActiveStage(idx)
    })
  }, [progress])

  const cowOpacity = useTransform(progress, [0, 0.12], [0, 1])
  const cowScale = useTransform(progress, [0, 0.12], [0.92, 1])

  const readerOpacity = useTransform(progress, [0.14, 0.28], [0, 1])
  const readerScale = useTransform(progress, [0.14, 0.28], [0.92, 1])

  const pillsOpacity = useTransform(progress, [0.26, 0.38], [0, 1])

  const cloudOpacity = useTransform(progress, [0.44, 0.58], [0, 1])
  const cloudScale = useTransform(progress, [0.44, 0.58], [0.92, 1])

  const phoneOpacity = useTransform(progress, [0.7, 0.84], [0, 1])
  const phoneScale = useTransform(progress, [0.7, 0.84], [0.92, 1])

  const lineProgress = useTransform(progress, [0.04, 0.88], [0, 1])
  const pulseOffset = useTransform(progress, [0.04, 0.88], [0, 1])

  const ctaOpacity = useTransform(progress, [0.88, 0.97], [0, 1])

  const pulseX = useTransform(pulseOffset, (v) => {
    if (isMobile) {
      return 50 + Math.sin(v * Math.PI * 2) * 2
    }
    return 12 + v * 80
  })
  const pulseY = useTransform(pulseOffset, (v) => {
    if (isMobile) {
      return 15 + v * 78
    }
    const t = v * 4
    if (t < 1) return 50 - 15 * Math.sin(t * Math.PI)
    if (t < 2) return 35 + 15 * Math.sin((t - 1) * Math.PI)
    if (t < 3) return 50 - 10 * Math.sin((t - 2) * Math.PI)
    return 55
  })

  return (
    <section ref={sectionRef} id="tecnologia" className="relative h-[260vh] bg-surface">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="relative w-full max-w-[1400px] h-full px-6 lg:px-12">
          {/* Section eyebrow */}
          <div className="absolute top-8 md:top-12 left-6 lg:left-12 z-20">
            <span className="font-mono text-xs tracking-[0.18em] uppercase text-muted">
              Tecnología
            </span>
          </div>

          {/* Connecting line — desktop */}
          <svg
            className="absolute inset-0 w-full h-full hidden md:block"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d="M 12 52 C 22 52, 28 36, 38 36 S 48 52, 55 52 S 68 44, 78 54 S 88 54, 93 54"
              fill="none"
              stroke="#4ade80"
              strokeWidth="0.28"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: lineProgress }}
            />
            <motion.circle
              cx={pulseX as unknown as number}
              cy={pulseY as unknown as number}
              r="0.9"
              fill="#4ade80"
              style={{ opacity: lineProgress }}
            />
          </svg>

          {/* Connecting line — mobile */}
          <svg
            className="absolute inset-0 w-full h-full md:hidden"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d="M 50 14 C 50 24, 36 30, 36 40 S 50 50, 50 60 S 64 70, 64 80 S 50 88, 50 96"
              fill="none"
              stroke="#4ade80"
              strokeWidth="0.35"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: lineProgress }}
            />
            <motion.circle
              cx={pulseX as unknown as number}
              cy={pulseY as unknown as number}
              r="1"
              fill="#4ade80"
              style={{ opacity: lineProgress }}
            />
          </svg>

          {/* Cow */}
          <motion.div
            style={{ opacity: cowOpacity, scale: cowScale }}
            className="absolute left-[30%] top-[10%] md:left-[7%] md:top-[40%] w-32 md:w-48"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-fg/10 border border-border">
              <img
                src="/images/cow-profile-reddish.png"
                alt="Vaca Angus"
                className="w-full h-40 md:h-56 object-cover object-[60%_center]"
              />
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_rgba(74,222,128,0.6)]" />
            <span className="block mt-3 text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted text-center">
              Animal
            </span>
          </motion.div>

          {/* Reader */}
          <motion.div
            style={{ opacity: readerOpacity, scale: readerScale }}
            className="absolute left-[30%] top-[30%] md:left-[33%] md:top-[34%] flex flex-col items-center"
          >
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-bg border border-border shadow-xl flex items-center justify-center">
              <Scan size={28} className="text-accent md:hidden" />
              <Scan size={36} className="text-accent hidden md:block" />
            </div>
            <span className="mt-3 text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted">
              Lector RFID
            </span>
          </motion.div>

          {/* Data pills */}
          <motion.div
            style={{ opacity: pillsOpacity }}
            className="absolute left-[52%] top-[29%] md:left-[29%] md:top-[52%] flex flex-col gap-1.5 md:gap-2"
          >
            {dataPills.map((pill) => (
              <div
                key={pill.label}
                className="flex justify-between gap-6 px-3 py-1.5 bg-surface-muted/80 backdrop-blur-sm border border-border rounded-lg text-[10px] md:text-xs font-mono shadow-sm"
              >
                <span className="text-muted">{pill.label}</span>
                <span className="text-fg font-medium">{pill.value}</span>
              </div>
            ))}
          </motion.div>

          {/* Cloud */}
          <motion.div
            style={{ opacity: cloudOpacity, scale: cloudScale }}
            className="absolute left-[30%] top-[50%] md:left-[54%] md:top-[36%] flex flex-col items-center"
          >
            <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full bg-bg border border-border shadow-xl flex items-center justify-center">
              <Cloud size={32} className="text-accent md:hidden" weight="fill" />
              <Cloud size={44} className="text-accent hidden md:block" weight="fill" />
            </div>
            <span className="mt-3 text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted">
              Nube
            </span>
          </motion.div>

          {/* Phone */}
          <motion.div
            style={{ opacity: phoneOpacity, scale: phoneScale }}
            className="absolute left-[26%] top-[70%] md:left-[75%] md:top-[32%]"
          >
            <div className="w-28 md:w-40 h-48 md:h-72 bg-fg rounded-[1.6rem] md:rounded-[2rem] p-1.5 md:p-2 shadow-2xl shadow-fg/15">
              <div className="w-full h-full bg-bg rounded-[1.3rem] md:rounded-[1.7rem] overflow-hidden flex flex-col">
                <div className="h-8 md:h-10 bg-traza flex items-center px-3">
                  <Cow size={14} className="text-bg" />
                  <span className="ml-2 text-[10px] font-mono text-bg uppercase tracking-wider">
                    UY-23841
                  </span>
                </div>
                <div className="flex-1 p-2.5 md:p-4 space-y-1.5 md:space-y-2.5">
                  {dataPills.map((p) => (
                    <div
                      key={p.label}
                      className="flex justify-between text-[9px] md:text-[11px] border-b border-border pb-1"
                    >
                      <span className="text-muted">{p.label}</span>
                      <span className="text-fg font-medium">{p.value}</span>
                    </div>
                  ))}
                  <div className="pt-0.5 md:pt-1">
                    <span className="block text-[9px] md:text-[10px] text-muted">Lote</span>
                    <span className="text-[10px] md:text-xs font-medium text-fg">Norte A</span>
                  </div>
                </div>
              </div>
            </div>
            <span className="block mt-3 text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted text-center">
              App TrazaNet
            </span>
          </motion.div>

          {/* Stage text */}
          <div className="absolute bottom-14 md:bottom-20 left-6 lg:left-12 right-6 lg:right-auto max-w-md z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: easeOutExpo }}
              >
                <h3 className="font-sans text-3xl md:text-5xl font-semibold text-fg leading-tight mb-3">
                  {stages[activeStage].title}
                </h3>
                <p className="text-muted text-base md:text-lg font-light">
                  {stages[activeStage].body}
                </p>
                {activeStage === stages.length - 1 && (
                  <div className="mt-5 flex flex-wrap gap-3 md:hidden">
                    <a
                      href="#contacto"
                      className="group inline-flex items-center gap-2 px-4 py-2 bg-accent text-bg rounded-full text-xs font-semibold"
                    >
                      Conocer TrazaNet
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    <a
                      href="#ecosystem"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-fg/20 text-fg rounded-full text-xs font-semibold"
                    >
                      Ver cómo funciona
                    </a>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Final CTAs — desktop */}
          <motion.div
            style={{ opacity: ctaOpacity }}
            className="hidden md:flex absolute bottom-16 md:bottom-20 right-6 lg:right-12 flex-col items-end gap-3 z-20"
          >
            <div className="flex flex-wrap justify-end gap-3">
              <a
                href="#contacto"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg rounded-full text-sm font-semibold transition-transform duration-150 active:scale-[0.97] hover:bg-accent-hover"
              >
                Conocer TrazaNet
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href="#ecosystem"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-fg/20 text-fg rounded-full text-sm font-semibold hover:bg-fg/5 transition-colors"
              >
                Ver cómo funciona
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
