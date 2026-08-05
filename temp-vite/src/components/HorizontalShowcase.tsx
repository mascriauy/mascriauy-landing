import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Scan, DeviceMobile, Syringe, Sparkle } from '@phosphor-icons/react'

const slides = [
  {
    icon: Scan,
    title: 'Identificación RFID',
    body: 'Lectura de caravanas electrónicas directamente en el campo, sin errores de transcripción.',
    gradient: 'from-accent/20 to-transparent',
  },
  {
    icon: DeviceMobile,
    title: 'App móvil offline',
    body: 'Trabajá sin conexión. Los datos se guardan localmente y sincronizan cuando hay señal.',
    gradient: 'from-traza/20 to-transparent',
  },
  {
    icon: Syringe,
    title: 'Trazabilidad sanitaria',
    body: 'Calendario sanitario, tratamientos, dosis y alertas para cada animal.',
    gradient: 'from-accent/15 to-transparent',
  },
  {
    icon: Sparkle,
    title: 'Inteligencia artificial',
    body: 'Alertas predictivas y patrones que ayudan a tomar mejores decisiones de producción.',
    gradient: 'from-traza/15 to-transparent',
  },
]

export default function HorizontalShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%'])

  return (
    <section
      ref={containerRef}
      className="relative h-[300dvh] bg-bg"
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex items-center">
        <div className="px-6 lg:px-12 mb-12 absolute top-12 left-0 right-0 z-10">
          <p className="font-mono text-xs tracking-[0.18em] uppercase text-muted mb-3">
            Capacidades
          </p>
          <h2 className="font-sans text-3xl md:text-5xl font-light text-fg max-w-md">
            Cuatro pilares de trazaNet
          </h2>
        </div>

        <motion.div
          style={{ x }}
          className="flex gap-6 md:gap-10 pl-6 lg:pl-12 pt-24"
        >
          {slides.map((slide, idx) => (
            <div
              key={slide.title}
              className="relative shrink-0 w-[85vw] md:w-[60vw] lg:w-[40vw] h-[60dvh] rounded-3xl border border-border overflow-hidden bg-surface group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-60`} />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

              <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
                <div className="w-14 h-14 rounded-2xl bg-surface-muted border border-border flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <slide.icon size={28} className="text-fg" />
                </div>
                <span className="font-mono text-xs text-muted mb-2">0{idx + 1}</span>
                <h3 className="font-sans text-3xl md:text-5xl font-light text-fg mb-4">
                  {slide.title}
                </h3>
                <p className="text-muted text-base md:text-lg font-light max-w-sm">
                  {slide.body}
                </p>
              </div>
            </div>
          ))}

          <div className="shrink-0 w-[15vw]" />
        </motion.div>
      </div>
    </section>
  )
}
