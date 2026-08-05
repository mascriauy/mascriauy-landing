import { useEffect, useRef, useState } from 'react'
import {
  Scan,
  Cow,
  Syringe,
  DeviceMobile,
  Cloud,
  Sparkle,
  Plugs,
  ArrowRight,
  Link,
  Lightning,
  type Icon,
} from '@phosphor-icons/react'

interface RoadmapItem {
  id: number
  title: string
  date: string
  content: string
  category: string
  icon: Icon
  relatedIds: number[]
  status: 'completed' | 'in-progress' | 'pending'
  energy: number
}

const roadmapData: RoadmapItem[] = [
  {
    id: 1,
    title: 'Identificación',
    date: '2023',
    content: 'Lectura de caravanas electrónicas y RFID para identificar cada animal sin errores de transcripción.',
    category: 'Hardware',
    icon: Scan,
    relatedIds: [2],
    status: 'completed',
    energy: 100,
  },
  {
    id: 2,
    title: 'Gestión de stock',
    date: '2023',
    content: 'Registro completo del rodeo: ingresos, egresos, movimientos entre lotes y genealogía.',
    category: 'Core',
    icon: Cow,
    relatedIds: [1, 3],
    status: 'completed',
    energy: 95,
  },
  {
    id: 3,
    title: 'Trazabilidad sanitaria',
    date: '2024',
    content: 'Calendario sanitario, tratamientos, dosis y alertas automáticas de vacunación.',
    category: 'Salud',
    icon: Syringe,
    relatedIds: [2, 4],
    status: 'completed',
    energy: 90,
  },
  {
    id: 4,
    title: 'App móvil offline',
    date: '2024',
    content: 'Trabajo en el campo sin conexión. Sincronización automática cuando hay señal.',
    category: 'Móvil',
    icon: DeviceMobile,
    relatedIds: [3, 5],
    status: 'completed',
    energy: 85,
  },
  {
    id: 5,
    title: 'Nube y sincronización',
    date: '2025',
    content: 'Datos centralizados en Supabase con respaldo en tiempo real y acceso multiusuario.',
    category: 'Infra',
    icon: Cloud,
    relatedIds: [4, 6],
    status: 'in-progress',
    energy: 70,
  },
  {
    id: 6,
    title: 'Inteligencia artificial',
    date: '2025',
    content: 'Alertas predictivas, detección de patrones y asistente para la toma de decisiones.',
    category: 'IA',
    icon: Sparkle,
    relatedIds: [5, 7],
    status: 'in-progress',
    energy: 55,
  },
  {
    id: 7,
    title: 'Integraciones',
    date: '2026',
    content: 'Conexión con sistemas genéticos, balanzas, GPS y plataformas del sector ganadero.',
    category: 'Futuro',
    icon: Plugs,
    relatedIds: [6],
    status: 'pending',
    energy: 30,
  },
]

export default function RoadmapOrbital() {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})
  const [rotationAngle, setRotationAngle] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({})
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !autoRotate) return

    const timer = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.25) % 360).toFixed(3)))
    }, 50)

    return () => clearInterval(timer)
  }, [autoRotate])

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const next: Record<number, boolean> = {}
      Object.keys(prev).forEach((key) => {
        if (parseInt(key) !== id) next[parseInt(key)] = false
      })
      next[id] = !prev[id]

      if (!prev[id]) {
        setActiveNodeId(id)
        setAutoRotate(false)
        const item = roadmapData.find((i) => i.id === id)
        const pulses: Record<number, boolean> = {}
        item?.relatedIds.forEach((relId) => {
          pulses[relId] = true
        })
        setPulseEffect(pulses)
      } else {
        setActiveNodeId(null)
        setAutoRotate(true)
        setPulseEffect({})
      }

      return next
    })
  }

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({})
      setActiveNodeId(null)
      setPulseEffect({})
      setAutoRotate(true)
    }
  }

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360
    const radius = 200
    const radian = (angle * Math.PI) / 180
    const x = radius * Math.cos(radian)
    const y = radius * Math.sin(radian)
    const zIndex = Math.round(100 + 50 * Math.cos(radian))
    const opacity = Math.max(0.4, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    return { x, y, zIndex, opacity }
  }

  const isRelatedToActive = (itemId: number) => {
    if (!activeNodeId) return false
    const active = roadmapData.find((i) => i.id === activeNodeId)
    return active?.relatedIds.includes(itemId) ?? false
  }

  const getStatusColor = (status: RoadmapItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-primary text-fg border-primary'
      case 'in-progress':
        return 'bg-accent text-bg border-accent'
      case 'pending':
        return 'bg-surface-muted text-muted border-border'
    }
  }

  return (
    <section className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-12">
        <p className="font-mono text-xs tracking-[0.18em] uppercase text-muted mb-4">
          Roadmap
        </p>
        <h2 className="font-sans text-4xl md:text-6xl font-light text-fg max-w-xl leading-tight">
          La evolución de trazaNet
        </h2>
      </div>

      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className="relative w-full h-[80dvh] md:h-[90dvh] flex items-center justify-center cursor-pointer"
      >
        <div
          ref={orbitRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-accent via-primary to-accent/50 animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-20 h-20 rounded-full border border-fg/20 animate-ping opacity-70" />
            <div
              className="absolute w-28 h-28 rounded-full border border-fg/10 animate-ping opacity-50"
              style={{ animationDelay: '0.5s' }}
            />
            <div className="w-8 h-8 rounded-full bg-fg/80 backdrop-blur-md" />
          </div>

          <div className="absolute w-80 h-80 md:w-96 md:h-96 rounded-full border border-border" />
          <div className="absolute w-[28rem] h-[28rem] md:w-[32rem] md:h-[32rem] rounded-full border border-border/50" />

          {roadmapData.map((item, index) => {
            const position = calculateNodePosition(index, roadmapData.length)
            const isExpanded = expandedItems[item.id]
            const isRelated = isRelatedToActive(item.id)
            const isPulsing = pulseEffect[item.id]
            const Icon = item.icon

            return (
              <div
                key={item.id}
                className="absolute transition-all duration-700 ease-out"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleItem(item.id)
                }}
              >
                <div
                  className={`absolute rounded-full ${isPulsing ? 'animate-pulse' : ''}`}
                  style={{
                    background: 'radial-gradient(circle, rgba(74,127,181,0.18) 0%, rgba(74,127,181,0) 70%)',
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                />

                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isExpanded ? 'bg-accent text-bg border-accent scale-150 shadow-lg shadow-accent/20' : ''}
                    ${!isExpanded && isRelated ? 'bg-primary/30 text-fg border-primary animate-pulse' : ''}
                    ${!isExpanded && !isRelated ? 'bg-surface text-fg border-border' : ''}
                  `}
                >
                  <Icon size={18} weight={isExpanded ? 'bold' : 'regular'} />
                </div>

                <div
                  className={`
                    absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300
                    ${isExpanded ? 'text-fg scale-110' : 'text-muted'}
                  `}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-72 bg-surface/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl shadow-bg/20 p-5 z-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getStatusColor(item.status)}`}>
                        {item.status === 'completed' ? 'Completo' : item.status === 'in-progress' ? 'En desarrollo' : 'Pendiente'}
                      </span>
                      <span className="text-xs font-mono text-muted">{item.date}</span>
                    </div>

                    <h3 className="font-sans text-lg font-semibold text-fg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted leading-relaxed mb-4">{item.content}</p>

                    <div className="mb-4">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="flex items-center gap-1 text-muted">
                          <Lightning size={10} />
                          Madurez
                        </span>
                        <span className="font-mono text-fg">{item.energy}%</span>
                      </div>
                      <div className="w-full h-1 bg-surface-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent to-sky"
                          style={{ width: `${item.energy}%` }}
                        />
                      </div>
                    </div>

                    {item.relatedIds.length > 0 && (
                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center gap-1 text-xs text-muted mb-2">
                          <Link size={10} />
                          <span className="uppercase tracking-wider font-medium">Conectado con</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.relatedIds.map((relatedId) => {
                            const related = roadmapData.find((i) => i.id === relatedId)
                            return (
                              <button
                                key={relatedId}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleItem(relatedId)
                                }}
                                className="group flex items-center gap-1 px-2 py-1 text-xs border border-border rounded-full bg-surface-muted hover:border-accent hover:text-fg transition-colors"
                              >
                                {related?.title}
                                <ArrowRight size={10} className="text-muted group-hover:text-accent" />
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
