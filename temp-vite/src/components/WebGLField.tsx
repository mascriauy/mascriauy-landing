import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  varying float vElevation;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float dist = distance(uv, uMouse);
    float n = noise(pos.xy * 1.5 + uTime * 0.15) * 0.2;
    float wave1 = sin(pos.x * 3.0 + uTime * 0.7 + n) * 0.12;
    float wave2 = sin(pos.y * 2.5 + uTime * 0.5) * 0.10;
    float wave3 = sin((pos.x + pos.y) * 2.0 + uTime * 0.35) * 0.06;
    float mouseWave = sin(dist * 20.0 - uTime * 2.5) * exp(-dist * 4.0) * 0.18;
    float scrollWave = sin(pos.y * 4.0 + uScroll * 0.03) * 0.04;

    pos.z += wave1 + wave2 + wave3 + mouseWave + scrollWave + n;
    vElevation = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  varying float vElevation;
  varying vec2 vUv;

  void main() {
    vec3 deep = vec3(0.02, 0.016, 0.014);
    vec3 base = vec3(0.055, 0.045, 0.040);
    vec3 accent = vec3(0.769, 0.361, 0.243);
    vec3 traza = vec3(0.086, 0.627, 0.290);

    float mixFactor = smoothstep(-0.35, 0.45, vElevation);
    vec3 color = mix(deep, base, vUv.y * 0.6 + 0.4);
    color = mix(color, accent, mixFactor * 0.35);
    color = mix(color, traza, mixFactor * 0.12);

    float vignette = 1.0 - distance(vUv, vec2(0.5)) * 0.9;
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`

export default function WebGLField() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const scrollRef = useRef(0)
  const runningRef = useRef(true)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.z = 1.4

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const geometry = new THREE.PlaneGeometry(4, 3, 96, 72)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uScroll: { value: 0 },
      },
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const onMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: event.clientX / window.innerWidth,
        y: 1 - event.clientY / window.innerHeight,
      }
    }

    const onScroll = () => {
      scrollRef.current = window.scrollY
    }

    const onVisibility = () => {
      runningRef.current = document.visibilityState === 'visible'
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    const clock = new THREE.Clock()
    let animationId: number

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      if (!runningRef.current) return
      const elapsed = clock.getElapsedTime()
      material.uniforms.uTime.value = elapsed
      material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y)
      material.uniforms.uScroll.value = scrollRef.current
      renderer.render(scene, camera)
    }

    animate()

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      aria-hidden="true"
    />
  )
}
