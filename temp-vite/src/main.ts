/**
 * CARTA DE RODEO — arranque de la landing.
 *
 * Este archivo sólo conecta el markup con las primitivas de motion.ts.
 * Si hay que inventar un movimiento nuevo, va en motion.ts, no acá.
 */

import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  armarEscena,
  dibujarReglas,
  heroHuella,
  initCrosshair,
  initSmoothScroll,
  odometro,
  parallax,
  refrescar,
  reduceMotion,
  revealImagen,
  revealLineas,
} from './motion'

/* ==========================================================================
   NAVEGACIÓN — gana su filo al despegarse del hero
   ========================================================================== */

function initNav(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav]')
  const hero = document.getElementById('hero')
  if (!nav || !hero) return

  const observador = new IntersectionObserver(
    ([entrada]) => {
      nav.dataset.fija = entrada.isIntersecting ? 'no' : 'si'
    },
    { threshold: 0, rootMargin: '-80px 0px 0px 0px' },
  )
  observador.observe(hero)
}

/* ==========================================================================
   EJE DEL AÑO — la línea se traza con el scroll y va prendiendo las etapas
   ========================================================================== */

function initEjeAnio(): void {
  const pista = document.querySelector<HTMLElement>('[data-anio]')
  const trazo = document.querySelector<HTMLElement>('[data-anio-trazo]')
  const etapas = Array.from(document.querySelectorAll<HTMLElement>('[data-etapa]'))
  if (!pista || !trazo || !etapas.length) return

  // Sin movimiento, o en pantalla angosta: el eje está entero y todas las
  // etapas legibles desde el arranque.
  if (reduceMotion() || window.matchMedia('(max-width: 900px)').matches) {
    trazo.style.transform = 'scaleX(1)'
    etapas.forEach((e) => (e.dataset.activa = 'si'))
    return
  }

  gsap.set(trazo, { scaleX: 0 })

  ScrollTrigger.create({
    trigger: pista,
    start: 'top 72%',
    end: 'bottom 55%',
    scrub: 0.5,
    onUpdate: ({ progress }) => {
      gsap.set(trazo, { scaleX: progress })
      // Cada etapa se prende cuando el trazo la alcanza.
      const alcanzadas = Math.floor(progress * etapas.length + 0.35)
      etapas.forEach((etapa, i) => {
        etapa.dataset.activa = i < alcanzadas ? 'si' : 'no'
      })
    },
  })
}

/* ==========================================================================
   ARRANQUE
   ========================================================================== */

function arrancar(): void {
  armarEscena()
  initSmoothScroll()
  initCrosshair()
  initNav()

  // Texto por líneas. El hero entra solo; el resto espera al scroll.
  document.querySelectorAll('[data-reveal-lineas]').forEach((el) => {
    const inmediato = el.hasAttribute('data-reveal-inmediato')
    revealLineas(el, { alScrollear: !inmediato, delay: inmediato ? 0.25 : 0 })
  })

  document.querySelectorAll('[data-reveal-imagen]').forEach(revealImagen)
  document.querySelectorAll('[data-odometro]').forEach(odometro)

  // Magnitudes del sistema: fotos 12%, rótulo de margen 18% en contramovimiento.
  document.querySelectorAll('[data-parallax-foto]').forEach((el) => parallax(el, 12))
  parallax(document.querySelector('[data-rotulo]'), 18)

  document.querySelectorAll('.seccion, .hero-huella').forEach(dibujarReglas)

  heroHuella(document.querySelector('[data-huella]'))
  initEjeAnio()
}

/* SplitType mide líneas: si arranca antes de que las fuentes estén listas,
   los cortes caen donde no van. */
if (document.fonts?.ready) {
  document.fonts.ready.then(() => {
    arrancar()
    refrescar()
  })
} else {
  window.addEventListener('DOMContentLoaded', arrancar)
}

// Las alturas cambian al rotar el teléfono o al cargar imágenes tardías.
window.addEventListener('load', refrescar)
