/**
 * CARTA DE RODEO / NOCTURNO — arranque de los documentos.
 *
 * privacidad, terminos-y-condiciones, copyright y soporte comparten el sistema
 * con la home, pero no su escena: no hay hero, ni fotos en duotono, ni cifras
 * que animar. Por eso no cargan `main.ts`.
 *
 * Tampoco se importa `initSmoothScroll` de motion.ts: esa función acopla Lenis
 * al ticker de GSAP, así que traerla arrastraría gsap + ScrollTrigger +
 * SplitType —150 kB— a una página de texto. Acá Lenis corre con su propio rAF,
 * que es todo lo que hace falta cuando no hay nada más animándose.
 *
 * No se llama a `armarEscena()` a propósito: sin `.js-motion` no hay estados
 * iniciales ocultos, y el documento se ve entero aunque el JS no cargue. En una
 * página legal eso no es una optimización, es un requisito.
 */

import './style.css'
import Lenis from 'lenis'

// Con reduced-motion manda el scroll nativo.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({ lerp: 0.085 })

  const frame = (tiempo: number): void => {
    lenis.raf(tiempo)
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}
