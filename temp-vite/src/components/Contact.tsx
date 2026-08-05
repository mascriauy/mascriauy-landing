import { motion } from 'motion/react'
import { Envelope, ArrowRight } from '@phosphor-icons/react'
import GlassCard from './GlassCard'

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function Contact() {
  return (
    <section id="contacto" className="relative py-32 md:py-40 bg-bg text-fg overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[140px]"
          animate={{
            x: [0, 80, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-sky/10 blur-[120px]"
          animate={{
            x: [0, -60, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-12">
        <GlassCard className="rounded-3xl bg-surface/40 border border-border backdrop-blur-xl">
          <div className="p-10 md:p-20 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
              className="font-sans text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight"
            >
              Hablemos
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.05 }}
              className="text-muted text-lg md:text-xl font-light max-w-xl mx-auto mb-12"
            >
              ¿Listo para digitalizar tu establecimiento? Estamos aquí para acompañarte en la implementación.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.1 }}
              className="flex flex-col items-center gap-6"
            >
              <a
                href="mailto:hola@mascriauy.com"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-fg rounded-full font-semibold transition-transform duration-150 active:scale-[0.97] hover:bg-primary-hover"
              >
                <Envelope size={18} />
                hola@mascriauy.com
              </a>

              <a
                href="#"
                className="group inline-flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors"
              >
                Agenda una demo
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
            </motion.div>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
