import { motion } from 'motion/react'
import { Feather, Target, Lightning } from '@phosphor-icons/react'
import GlassCard from './GlassCard'

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

const pillars = [
  {
    icon: Feather,
    title: 'Simplicidad radical',
    body: 'Diseñamos eliminando lo superfluo. Cada función tiene un propósito claro y una ejecución intuitiva, sin curva de aprendizaje.',
    span: 'lg:col-span-7 lg:row-span-2',
    featured: true,
  },
  {
    icon: Target,
    title: 'Precisión absoluta',
    body: 'Datos confiables en tiempo real. La base sólida para tomar decisiones que definen la rentabilidad.',
    span: 'lg:col-span-5',
    featured: false,
  },
  {
    icon: Lightning,
    title: 'Innovación constante',
    body: 'Evolucionamos nuestra plataforma continuamente para anticipar las necesidades del mañana.',
    span: 'lg:col-span-5',
    featured: false,
  },
]

export default function Pillars() {
  return (
    <section id="ecosystem" className="py-24 md:py-32 bg-bg relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="mb-16 md:mb-20"
        >
          <p className="font-mono text-xs tracking-[0.18em] uppercase text-muted mb-4">
            Nuestros principios
          </p>
          <h2 className="font-sans text-4xl md:text-6xl font-light text-fg max-w-xl leading-tight">
            Tres formas de pensar el campo del futuro
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: easeOutExpo, delay: idx * 0.1 }}
              className={pillar.span}
            >
              <GlassCard
                className={`h-full rounded-2xl backdrop-blur-md transition-colors duration-300 ${
                  pillar.featured
                    ? 'bg-surface/60 border border-border'
                    : 'bg-surface/40 border border-border'
                }`}
              >
                <div className="p-8 md:p-10 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-surface-muted border border-border flex items-center justify-center mb-8">
                    <pillar.icon size={22} className="text-accent" />
                  </div>

                  <h3 className="font-sans text-2xl md:text-4xl font-semibold text-fg mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-muted text-base md:text-lg leading-relaxed font-light max-w-md">
                    {pillar.body}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
