import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { Tag } from '@phosphor-icons/react'

export default function CustomCursor() {
  const [hovering, setHovering] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 22 })
  const springY = useSpring(y, { stiffness: 220, damping: 22 })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia('(pointer: coarse)').matches ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
      )
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHidden(false)
    }

    const onLeave = () => setHidden(true)
    const onEnter = () => setHidden(false)

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const caravan = target.closest('[data-cursor="caravan"]')
      setHovering(!!caravan)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    window.addEventListener('mouseover', onOver)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mouseover', onOver)
    }
  }, [isMobile, x, y])

  if (isMobile) return null

  return (
    <motion.div
      className="fixed top-0 left-0 z-[200] pointer-events-none"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        animate={{
          width: hovering ? 56 : 40,
          height: hovering ? 56 : 40,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-fg/60 bg-bg/10 backdrop-blur-[2px] flex items-center justify-center"
      >
        {hovering && <Tag size={18} weight="fill" className="text-fg" />}
      </motion.div>
    </motion.div>
  )
}
