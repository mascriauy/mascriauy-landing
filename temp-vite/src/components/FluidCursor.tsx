import { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
  age: number
}

export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<Point[]>([])
  const mouseRef = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isFine || reduceMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()

    const onMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY }
      pointsRef.current.push({ x: event.clientX, y: event.clientY, age: 0 })
      if (pointsRef.current.length > 40) pointsRef.current.shift()
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', resize)

    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const points = pointsRef.current
      if (points.length < 2) return

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length - 1; i++) {
        const p0 = points[i]
        const p1 = points[i + 1]
        const mx = (p0.x + p1.x) / 2
        const my = (p0.y + p1.y) / 2
        ctx.quadraticCurveTo(p0.x, p0.y, mx, my)
      }

      for (let i = 0; i < points.length; i++) {
        points[i].age += 1
      }
      pointsRef.current = points.filter((p) => p.age < 40)

      const gradient = ctx.createLinearGradient(
        points[0].x,
        points[0].y,
        points[points.length - 1].x,
        points[points.length - 1].y
      )
      gradient.addColorStop(0, 'rgba(74, 222, 128, 0)')
      gradient.addColorStop(0.5, 'rgba(74, 222, 128, 0.35)')
      gradient.addColorStop(1, 'rgba(74, 222, 128, 0)')

      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[70] pointer-events-none"
      aria-hidden="true"
    />
  )
}
