/**
 * CARTA DE RODEO — primitivas de movimiento
 *
 * Vocabulario, no catálogo de efectos. Cada primitiva tiene un trabajo y una
 * magnitud definida; si algo no entra en este módulo, no debería moverse.
 *
 * REGLA DE RESTRICCIÓN — no negociable:
 *   1. Las cifras de datos NUNCA se animan con count-up. Un peso que sube solo
 *      es una mentira visual: el dato o está medido o no está.
 *   2. El peso y el ancho tipográfico NUNCA se animan en hover. El eje wdth de
 *      Archivo es composición, no interacción.
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

/* --- Easings del sistema, espejados desde style.css ------------------------ */
export const EASE = {
  instrumento: 'cubic-bezier(.16, 1, .3, 1)',
  contrapeso: 'cubic-bezier(.65, 0, .35, 1)',
  deriva: 'cubic-bezier(.22, .61, .36, 1)',
} as const

export const DUR = {
  entrada: 0.7,
  estado: 0.42,
  capa: 1.2,
} as const

/** Una sola fuente de verdad para saber si podemos mover algo. */
export const reduceMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Punteros gruesos (touch) no tienen cursor que seguir. */
const esTouch = (): boolean =>
  !window.matchMedia('(hover: hover) and (pointer: fine)').matches

/* ==========================================================================
   1. SCROLL SUAVE
   ========================================================================== */

/**
 * Lenis con lerp .085, acoplado al ticker de GSAP con el patrón oficial.
 * Un solo requestAnimationFrame: si además corriéramos un rAF propio, el scroll
 * avanzaría el doble por frame.
 * Devuelve null si el usuario pidió menos movimiento — ahí manda el scroll nativo.
 */
export function initSmoothScroll(): Lenis | null {
  if (reduceMotion()) return null

  const lenis = new Lenis({ lerp: 0.085 })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  // Los anchors internos pasan por Lenis, si no el scroll nativo pelea con él.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href')
      if (!href || href === '#') return
      const destino = document.querySelector(href)
      if (!destino) return
      e.preventDefault()
      lenis.scrollTo(destino as HTMLElement, { duration: 1.1 })
    })
  })

  return lenis
}

/* ==========================================================================
   2. ENTRADA DE TEXTO POR LÍNEAS
   ========================================================================== */

interface RevealLineasOpts {
  /** Retardo antes de la primera línea, en segundos. */
  delay?: number
  /** Si es true entra al scrollear; si es false entra ya. */
  alScrollear?: boolean
}

/**
 * Revela un bloque de texto línea por línea con un clip inferior.
 * El desplazamiento es de .14em — un asentamiento, no un vuelo de 30px.
 * SplitType necesita que el elemento ya tenga su ancho final: llamalo después
 * de que las fuentes cargaron.
 */
export function revealLineas(
  el: Element | null,
  { delay = 0, alScrollear = true }: RevealLineasOpts = {},
): void {
  if (!el) return

  if (reduceMotion()) {
    el.classList.add('reveal-lineas')
    return
  }

  el.classList.add('reveal-lineas')
  const split = new SplitType(el as HTMLElement, {
    types: 'lines',
    lineClass: 'line',
  })
  if (!split.lines?.length) return

  // Cada línea necesita su propio recorte para que el clip tenga contra qué cortar.
  split.lines.forEach((linea) => {
    linea.style.overflow = 'clip'
  })

  gsap.to(split.lines, {
    clipPath: 'inset(0% 0 0 0)',
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.07,
    delay,
    scrollTrigger: alScrollear
      ? { trigger: el as HTMLElement, start: 'top 85%', once: true }
      : undefined,
  })
}

/* ==========================================================================
   3. REVELADO DE IMAGEN
   ========================================================================== */

/**
 * Clip vertical de 0 a 100% en 800ms, con la imagen aterrizando de scale 1.06
 * a 1.00 a lo largo del 120% de su altura en viewport. El grano de la propia
 * imagen baja de .18 a .08 en el mismo tramo.
 */
export function revealImagen(el: Element | null): void {
  if (!el) return
  const nodo = el as HTMLElement

  if (reduceMotion()) {
    nodo.classList.add('reveal-imagen')
    return
  }

  nodo.classList.add('reveal-imagen')
  const interior = nodo.querySelector<HTMLElement>('img, picture, video') ?? nodo

  gsap.to(nodo, {
    clipPath: 'inset(0 0 0% 0)',
    duration: 0.8,
    ease: 'power3.inOut',
    scrollTrigger: { trigger: nodo, start: 'top 88%', once: true },
  })

  gsap.fromTo(
    interior,
    { scale: 1.06 },
    {
      scale: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: nodo,
        start: 'top bottom',
        end: '+=120%',
        scrub: true,
      },
    },
  )

  const grano = nodo.querySelector<HTMLElement>('[data-grano]')
  if (grano) {
    gsap.fromTo(
      grano,
      { opacity: 0.18 },
      {
        opacity: 0.08,
        ease: 'none',
        scrollTrigger: { trigger: nodo, start: 'top bottom', end: '+=120%', scrub: true },
      },
    )
  }
}

/* ==========================================================================
   4. PARALLAX
   ========================================================================== */

/**
 * Desplazamiento ligado al scroll, expresado en porcentaje de la propia altura
 * del elemento. Magnitudes del sistema:
 *   fotos            → 12
 *   curvas de nivel  → -6
 *   rótulos mono     → 18  (contramovimiento visible, es el punto)
 */
export function parallax(el: Element | null, porcentaje: number): void {
  if (!el || reduceMotion()) return

  gsap.fromTo(
    el,
    { yPercent: -porcentaje / 2 },
    {
      yPercent: porcentaje / 2,
      ease: 'none',
      scrollTrigger: {
        trigger: (el as HTMLElement).parentElement ?? (el as HTMLElement),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    },
  )
}

/* ==========================================================================
   5. CROSSHAIR
   ========================================================================== */

/**
 * Retícula de 1px a todo el viewport siguiendo el cursor con lerp .12, más las
 * coordenadas en mono abajo a la derecha. Crea su propio DOM.
 * No existe en touch ni con reduced-motion.
 */
export function initCrosshair(): void {
  if (reduceMotion() || esTouch()) return

  const raiz = document.createElement('div')
  raiz.className = 'crosshair'
  raiz.setAttribute('aria-hidden', 'true')
  raiz.innerHTML = `
    <div class="crosshair__x"></div>
    <div class="crosshair__y"></div>
  `
  const coords = document.createElement('div')
  coords.className = 'crosshair__coords'
  coords.setAttribute('aria-hidden', 'true')

  document.body.append(raiz, coords)

  const ejeX = raiz.querySelector<HTMLElement>('.crosshair__x')!
  const ejeY = raiz.querySelector<HTMLElement>('.crosshair__y')!

  let destinoX = window.innerWidth / 2
  let destinoY = window.innerHeight / 2
  let actualX = destinoX
  let actualY = destinoY

  window.addEventListener(
    'pointermove',
    (e) => {
      destinoX = e.clientX
      destinoY = e.clientY
    },
    { passive: true },
  )

  gsap.ticker.add(() => {
    actualX += (destinoX - actualX) * 0.12
    actualY += (destinoY - actualY) * 0.12

    ejeY.style.transform = `translateX(${actualX}px)`
    ejeX.style.transform = `translateY(${actualY}px)`

    // Coordenadas en milésimas del viewport: se leen como una lectura de instrumento.
    const x = Math.round((actualX / window.innerWidth) * 1000)
    const y = Math.round((actualY / window.innerHeight) * 1000)
    coords.textContent = `X ${String(x).padStart(4, '0')}  Y ${String(y).padStart(4, '0')}`
  })
}

/* ==========================================================================
   6. DIBUJO DE REGLAS
   ========================================================================== */

/**
 * Las reglas horizontales se trazan de 0 a 100% del ancho, como si alguien las
 * estuviera dibujando. 520ms, escalonadas 60ms, easing instrumento.
 * Recibe un contenedor y dibuja todas las `.dibujar-regla` que haya adentro.
 */
export function dibujarReglas(contenedor: Element | null): void {
  if (!contenedor) return
  const reglas = contenedor.querySelectorAll<HTMLElement>('.dibujar-regla')
  if (!reglas.length) return

  if (reduceMotion()) {
    reglas.forEach((r) => (r.style.transform = 'none'))
    return
  }

  gsap.to(reglas, {
    scaleX: 1,
    duration: 0.52,
    ease: 'power3.out',
    stagger: 0.06,
    scrollTrigger: { trigger: contenedor as HTMLElement, start: 'top 85%', once: true },
  })
}

/* ==========================================================================
   7. ODÓMETRO
   ========================================================================== */

/**
 * Rota los dígitos de un número de sección como un contador mecánico: cada
 * dígito sube su propia altura, 260ms, escalonado 40ms.
 * Es para rótulos de sección (01, 02, 03…), NO para cifras de datos.
 */
export function odometro(el: Element | null): void {
  if (!el) return
  const nodo = el as HTMLElement
  const texto = nodo.textContent?.trim() ?? ''
  if (!texto) return

  if (reduceMotion()) return

  nodo.textContent = ''
  const digitos: HTMLElement[] = []

  for (const caracter of texto) {
    const caja = document.createElement('span')
    caja.style.display = 'inline-block'
    caja.style.overflow = 'clip'
    caja.style.verticalAlign = 'bottom'

    const digito = document.createElement('span')
    digito.style.display = 'inline-block'
    digito.textContent = caracter

    caja.appendChild(digito)
    nodo.appendChild(caja)
    digitos.push(digito)
  }

  gsap.from(digitos, {
    yPercent: 100,
    duration: 0.26,
    ease: 'power2.out',
    stagger: 0.04,
    scrollTrigger: { trigger: nodo, start: 'top 90%', once: true },
  })
}

/* ==========================================================================
   8. FILTRO DE DUOTONO
   ========================================================================== */

/**
 * Inyecta el filtro SVG que mapea las fotos a tinta → papel-sombra.
 * feColorMatrix a escala de grises y después una transferencia lineal por canal
 * entre los dos extremos de la paleta.
 *
 * El extremo oscuro no arranca en la tinta pura (#0F1310) sino levantado: las
 * fotos de campo tienen mucha sombra cerrada y con el negro real se vuelven
 * manchas. El punto negro sube a ~#2A2E27 y el blanco baja apenas, que es
 * exactamente el rango de una impresión en duotono sobre papel.
 */
export function injectDuotono(): void {
  if (document.getElementById('carta-filtros')) return

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.id = 'carta-filtros'
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')
  svg.style.position = 'absolute'
  svg.style.width = '0'
  svg.style.height = '0'
  svg.innerHTML = `
    <filter id="duotono-carta" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="
        .2126 .7152 .0722 0 0
        .2126 .7152 .0722 0 0
        .2126 .7152 .0722 0 0
        0 0 0 1 0"/>
      <feComponentTransfer>
        <feFuncR type="table" tableValues="0.165 0.906"/>
        <feFuncG type="table" tableValues="0.180 0.878"/>
        <feFuncB type="table" tableValues="0.153 0.812"/>
      </feComponentTransfer>
    </filter>
  `
  document.body.appendChild(svg)
}

/* ==========================================================================
   10. HERO DE HUELLA — la ventana se abre, el titular se retira
   ========================================================================== */

/**
 * El hero ocupa más alto que la pantalla y adentro lleva un panel fijo. Ese
 * tramo de scroll no desplaza la página: abre la foto.
 *
 * La foto está siempre a pantalla completa y lo que se anima es el recorte —un
 * `inset()` que arranca como ranura central y termina al ras del viewport—. No
 * es un zoom: el encuadre no se agranda ni se deforma, se corre la guillotina.
 * Por eso el titular puede estar partido arriba y abajo sin que la imagen lo
 * tape hasta que ya se retiró.
 *
 * Sin `.js-motion` —sin JS o con reduced-motion— no se llama a nada de esto:
 * el CSS deja la foto abierta y las tres capas apiladas y legibles.
 */
export function heroHuella(seccion: Element | null): void {
  if (!(seccion instanceof HTMLElement) || reduceMotion()) return

  const ventana = seccion.querySelector<HTMLElement>('[data-huella-ventana]')
  const sup = seccion.querySelector<HTMLElement>('[data-huella-sup]')
  const inf = seccion.querySelector<HTMLElement>('[data-huella-inf]')
  const intro = seccion.querySelector<HTMLElement>('[data-huella-intro]')
  const cierre = seccion.querySelector<HTMLElement>('[data-huella-cierre]')
  if (!ventana || !sup || !inf || !cierre) return

  // La ranura arranca entre los dos titulares, no detrás de ellos: por eso el
  // corte inferior es más profundo que el superior —abajo hay que dejar libre
  // la mitad de abajo del titular y la bajada—. En pantalla angosta se abre de
  // costado, que con los márgenes del escritorio quedaría una hendija.
  const angosto = window.matchMedia('(max-width: 768px)').matches
  const cerrado = angosto ? 'inset(30% 8% 40% 8%)' : 'inset(30% 30% 40% 30%)'
  const abierto = 'inset(0% 0% 0% 0%)'

  // Sin round: el sistema no admite radios, y acá el corte recto es el gesto.
  gsap.set(ventana, { clipPath: cerrado })
  gsap.set(cierre, { opacity: 0 })
  cierre.inert = true

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: seccion,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: ({ progress }) => {
        // Lo que no se ve no se tabula: si no, el foco cae en enlaces
        // invisibles de la capa que está apagada.
        cierre.inert = progress < 0.74
        if (intro) intro.inert = progress > 0.24
      },
    },
  })

  // Duración normalizada a 1 para que los tiempos se lean como fracción del
  // recorrido, y un tramo vacío que garantiza ese total.
  tl.to({}, { duration: 1 }, 0)
  tl.fromTo(ventana, { clipPath: cerrado }, { clipPath: abierto, ease: 'none', duration: 0.48 }, 0)
  tl.to(sup, { opacity: 0, ease: 'none', duration: 0.32 }, 0)
  tl.to(inf, { opacity: 0, ease: 'none', duration: 0.32 }, 0.06)
  if (intro) tl.to(intro, { opacity: 0, ease: 'none', duration: 0.22 }, 0)
  tl.fromTo(cierre, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.18 }, 0.78)
}

/* ==========================================================================
   ARRANQUE
   ========================================================================== */

/**
 * Marca el documento como capaz de animar. Los estados iniciales ocultos de
 * style.css cuelgan de `.js-motion`: sin JS, o si esto falla, la página se ve
 * entera igual.
 */
export function armarEscena(): void {
  if (!reduceMotion()) {
    document.documentElement.classList.add('js-motion')
  }
  injectDuotono()
}

/** Recalcula posiciones cuando las fuentes cambian las alturas de línea. */
export function refrescar(): void {
  ScrollTrigger.refresh()
}
