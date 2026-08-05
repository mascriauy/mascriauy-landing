# Carta de Rodeo — sistema de diseño de +CríaUY

> Un plano catastral que se volvió software: el rigor de un instrumento de
> medición, dibujado por alguien que caminó el potrero.

La dirección tiene que sostener dos cosas a la vez. El **filo técnico** lo carga
la grilla dibujada — reglas de 1px con ticks, filos de columna, coordenadas
vivas del cursor, cifras con precisión real. La **mano** la carga la foto
anotada en duotono con grano y el fondo hueso en vez de blanco puro.

La artesanía acá no es la textura kraft: es que la grilla esté bien trazada.

---

## Estructura de la home

`index.html` es la página de la empresa, no la de un producto. +CríaUY desarrolla
tecnología para el agro en dos líneas, y trazaNet es el sistema de software —no
un sinónimo de la marca—, así que el copy nunca los usa indistintamente.

| # | Sección | Qué carga |
|---|---|---|
| 01 | `#hero` | La huella: titular partido, la foto se abre, cierre |
| 02 | `#origen` | De dónde salió, con la ficha de datos |
| 03 | `#lineas` | Índice: software y hardware enfrentados, con estado por pieza |
| 04 | `#trazanet` | Despiece de los 6 módulos del sistema |
| 05 | `#anio` | El ciclo productivo, eje trazado al scroll |
| 06 | `#hardware` | Despiece de los 3 desarrollos de máquina |
| 07 | `#medida` | Desarrollo a medida |
| 08 | `#contacto` | Cierre en tinta |

Las secciones 04 y 06 comparten el componente `.despiece`: la línea de máquinas
se lee con el mismo instrumento que la de software. En `#lineas`, el bloque
`.linea__*` es un inventario —hairline por fila y estado alineado al filo
derecho—, no una card.

---

## Qué se aplicó y qué no

Sólo `index.html` usa este sistema. `propuestas.html` y `trazanet.html` siguen
con Tailwind por CDN y el diseño anterior; no se tocaron. Si se rediseñan, hay
que migrarlas igual que a `index.html`: sacar el `<script src="cdn.tailwindcss.com">`,
el `tailwind.config` inline y Lucide, y apuntar a `/src/main.ts`.

---

## Las tres prohibiciones

1. **Cero `border-radius` > 2px y cero `box-shadow` con blur.** Los bordes son
   cortes de guillotina, no objetos flotando. Si algo necesita separarse del
   fondo, se separa con una línea (`.filo-*`) o con `.papel-sombra`.
2. **Cero íconos de librería y cero card con círculo-ícono arriba.** Todo
   pictograma se dibuja a mano en SVG con `stroke-width="1"`. Ver los nueve de
   los dos despieces de `index.html` — el de trazaNet y el de hardware.
3. **Cero gradiente de marca, glassmorphism o `backdrop-filter`.**

Y dos reglas de movimiento, en `motion.ts`:

- **Las cifras de datos nunca se animan con count-up.** Un peso que sube solo es
  una mentira visual: el dato o está medido o no está.
- **El peso y el ancho tipográfico nunca se animan en hover.** El eje `wdth` de
  Archivo es composición, no interacción.

---

## Fuentes

Van por `<link>` en el `<head>` de cada página que use el sistema:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Chivo+Mono:wght@300..700&family=Newsreader:opsz,wght@6..72,300..600&display=swap" rel="stylesheet">
```

Las tres son variables y gratuitas. El rango de `wdth` de Archivo (62–125) no es
opcional: la compresión del eje es lo que hace el trabajo tipográfico.

---

## Tokens

Definidos en `@theme` de Tailwind v4, así que además de las custom properties
existen como utilidades (`bg-papel`, `text-tinta`, `border-grafito`…).

| Token | Hex | Rol |
|---|---|---|
| `--color-tinta` | `#0F1310` | Texto principal, fondos invertidos. Negro verdoso, no slate |
| `--color-papel` | `#F4F0E6` | Fondo base |
| `--color-papel-sombra` | `#E4DDCC` | Bandas, superficies de datos |
| `--color-cota` | `#B04A2E` | Acento único: cifras críticas, estado activo |
| `--color-caravana` | `#E0A93B` | Marcador, highlight de dato vivo (y acento sobre tinta) |
| `--color-verde-ajado` | `#5C6B58` | Capa secundaria de datos |
| `--color-hidrografia` | `#2E5A6B` | Enlaces, estados de sistema |
| `--color-grafito` | `#6F6A5E` | Labels, metadatos, líneas de grilla |

Se evita deliberadamente todo verde SaaS saturado (`#22c55e` y familia) y
cualquier violeta o índigo.

**Contraste:** todos los textos del sitio cumplen WCAG AA en su fondo real. El
grafito está en `#6F6A5E` y no en un gris más claro justamente por eso: los
labels son de 12–13px. Sobre `papel-sombra` (la ficha) ni siquiera ese alcanza,
por eso `.ficha__clave` usa `color-mix(… tinta 68% …)`.

---

## Tipografía

| Clase | Fuente | Uso |
|---|---|---|
| `.t-display` | Archivo, `wdth 70` | Titulares de hero y contacto |
| `.t-section` | Archivo, `wdth 85` | Títulos de sección |
| `.t-rotulo` | Archivo, `wdth 62`, 700 | Marca, rótulo de chapa |
| `.t-senal` | Archivo, `wdth 115` | Nombres de módulo, señalética |
| `.t-body` | Newsreader | Texto corrido |
| `.t-label` | Chivo Mono, uppercase, `.14em` | Labels y metadatos |
| `.dato` | Chivo Mono, tabular + slashed zero | Cifras |

Escala en `:root`: `--t-display`, `--t-section`, `--t-body`, `--t-label`.

El mono se usa para **narrar** (`rodeo — 1.240 cab. · últ. registro 06:14`), no
para decorar botones con estética de terminal.

---

## Composición

> **Todo bloque nace sobre una línea horizontal visible de 1px y se alinea al
> filo de una columna. Nada centrado, nada flotando.**
>
> Test: borrá las líneas. Si el bloque no se mueve de lugar percibido, la línea
> era decorativa y no cumple.

- `.carta` — grilla de 12 columnas, canaletas asimétricas (72px izq / 32px der).
  El margen ancho es el izquierdo porque ahí vive el rótulo vertical; el derecho
  es angosto para que los titulares tengan poco donde frenar antes de irse.
- `.c-{desde}-{hasta}` — filos de columna. **Si usás una combinación nueva hay
  que definirla**: sin la clase, el elemento cae en auto-placement de una
  columna y el bloque se rompe sin avisar.
- `.sangra-der` / `.sangra-izq` — la imagen se va al borde del viewport.
- `.regla`, `.regla--ticks` — reglas con ticks cada 1/12. El `::after` no lleva
  `background-size`: el gradiente ya se resuelve contra su propio ancho, y
  ponerlo dividiría el paso dos veces y saldría un rayado.
- `.filo-t/b/l/r` — hairlines de `color-mix(in oklab, tinta 22%, transparent)`.

Texto e imagen nunca comparten caja: la imagen sangra, el texto se retrae al
filo. La tensión es el espacio entre ambos.

---

## Materialidad

- `.grano` — SVG estático en data-URI tileado a 160px, `mix-blend-mode: multiply`,
  `opacity .07`. **Nunca un filtro SVG vivo**: repintaría cada frame.
- `.duotono` — usa `filter: url(#duotono-carta)`, que inyecta `injectDuotono()`.
  El punto negro está levantado a ~`#2A2E27` a propósito: las fotos de campo
  tienen mucha sombra cerrada y con el negro real se vuelven manchas.
- `.semitono` — trama de impresión a 45° cada 6px al 4%.
- `.anotacion` — nota de cuaderno sobre la foto, con `.anotacion__guia`.

---

## Movimiento

Easings, en CSS y exportados desde `motion.ts`:

| Nombre | Curva | Duración | Para qué |
|---|---|---|---|
| `instrumento` | `cubic-bezier(.16,1,.3,1)` | 700ms | Entradas |
| `contrapeso` | `cubic-bezier(.65,0,.35,1)` | 420ms | Hover y estados |
| `deriva` | `cubic-bezier(.22,.61,.36,1)` | 1200ms | Capas de scroll |

Primitivas de `motion.ts` — todas degradan solas con `prefers-reduced-motion`:

| Función | Qué hace |
|---|---|
| `initSmoothScroll()` | Lenis `lerp .085` acoplado al ticker de GSAP. Un solo rAF. Devuelve `null` con reduced-motion |
| `revealLineas(el, opts)` | Entrada por líneas: clip inferior + `.14em` de asentamiento, stagger 70ms |
| `revealImagen(el)` | Clip vertical 800ms + `scale(1.06 → 1)` sobre 120% de altura |
| `parallax(el, %)` | Magnitudes del sistema: fotos **12**, curvas de nivel **−6**, rótulos mono **18** |
| `initCrosshair()` | Retícula 1px `lerp .12` + coordenadas. Off en touch y reduced-motion |
| `dibujarReglas(cont)` | Traza las `.dibujar-regla` de 0→100%, 520ms, stagger 60ms |
| `odometro(el)` | Dígitos rotando, 260ms, stagger 40ms. Sólo para números de sección |
| `injectDuotono()` | Inyecta el filtro SVG |
| `heroHuella(seccion)` | Hero de dos tiempos: el `inset()` de la ventana se abre con el scroll, los dos titulares se retiran y entra el cierre. Sólo se llama con `.js-motion` |
| `armarEscena()` | Marca `.js-motion` en `<html>` e inyecta el duotono |

Los estados iniciales ocultos cuelgan de `.js-motion`. **Sin JS, o si algo falla,
la página se ve entera igual** — verificado: 0 elementos ocultos con
`prefers-reduced-motion: reduce`.

Markup: se conectan por atributos — `data-reveal-lineas`,
`data-reveal-inmediato`, `data-reveal-imagen`, `data-odometro`,
`data-parallax-foto`, `data-anio` / `data-anio-trazo` / `data-etapa`.

---

## Build

```bash
npm install --include=dev   # NODE_ENV=production en el entorno poda las devDeps
npm run dev
npm run build               # tsc && vite build
```

Dependencias del sistema: `gsap`, `lenis`, `split-type`.
