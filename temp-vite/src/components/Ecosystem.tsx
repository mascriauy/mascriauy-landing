import { motion } from 'motion/react'
import {
  Scan,
  Cloud,
  WifiSlash,
  ChartBar,
  Bell,
  TreeStructure,
  Sparkle,
  FileArrowDown,
  ArrowRight,
} from '@phosphor-icons/react'
import TiltCard from './TiltCard'

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

const features = [
  { icon: Scan, label: 'Lectura en tiempo real' },
  { icon: Cloud, label: 'Datos centralizados' },
  { icon: WifiSlash, label: 'Funcionamiento offline' },
  { icon: ChartBar, label: 'Métricas detalladas' },
  { icon: Bell, label: 'Alertas inteligentes' },
  { icon: TreeStructure, label: 'Gestión de genealogía' },
  { icon: Sparkle, label: 'Inteligencia artificial' },
  { icon: FileArrowDown, label: 'Exportación directa' },
]

export default function Ecosystem() {
  return (
    <section className="py-24 md:py-32 bg-surface overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: easeOutExpo }}
            className="lg:col-span-5"
          >
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-muted mb-4">
              Producto principal
            </p>
            <h2 className="font-sans text-6xl md:text-8xl font-bold text-traza mb-6 tracking-tighter">
              trazaNet.
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-6 font-light">
              Sistema Integral de Gestión Ganadera. Controla tu rodeo, seguimiento sanitario, movimientos y trazabilidad completa desde cualquier dispositivo.
            </p>
            <p className="text-fg/80 text-lg leading-relaxed mb-8 font-light">
              Toda la información de tu establecimiento, organizada y lista para decidir.
            </p>

            <a
              href="trazanet.html"
              className="group inline-flex items-center gap-2 text-sm font-medium text-traza hover:text-traza-light transition-colors"
            >
              Conocer trazaNet
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <TiltCard className="rounded-2xl">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-fg/10">
                <img
                  src="/field-detail.jpg"
                  alt="Campo uruguayo al atardecer"
                  className="w-full h-[360px] md:h-[520px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-traza/20 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-fg/40 to-transparent" />
              </div>
            </TiltCard>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easeOutExpo, delay: idx * 0.05 }}
              className="group flex items-center gap-3 p-4 rounded-xl bg-bg border border-border hover:border-traza/40 hover:bg-traza-bg/30 transition-all duration-300"
            >
              <feature.icon
                size={20}
                className="text-traza-light flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-sm font-medium text-fg/90">
                {feature.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
