import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import Controles from "./Controles";
import type { Datos, Tocado } from "./Controles";

const METROS = 900;

/**
 * LA TRANSECTA — +CríaUY
 * La página no se scrollea: se camina. 900 metros en línea recta sobre
 * el horizonte de la pampa. Lo único vertical de toda la experiencia es
 * el momento en que el dato se despega del animal y sube a la nube.
 */
export default function Transecta() {
  const reduced = useReducedMotion();
  const [M, setM] = useState(() => (window.innerWidth < 1024 ? 7 : 12)); // px por metro
  const worldRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const phoneTopRef = useRef<HTMLDivElement>(null);
  const pathARef = useRef<SVGPathElement>(null);
  const pathBRef = useRef<SVGPathElement>(null);
  const pulseARef = useRef<SVGCircleElement>(null);
  const pulseBRef = useRef<SVGCircleElement>(null);

  const [paths, setPaths] = useState({ a: "", b: "" });
  const [datos, setDatos] = useState<Datos>({ peso: 412, cc: 3.5, est: "El Mangrullo" });
  const [tocado, setTocado] = useState<Tocado>({ peso: false, cc: false, est: false });

  const at = (m: number) => `calc(50vw + ${m * M}px)`;

  const { scrollXProgress: p } = useScroll({ container: worldRef, axis: "x" });
  const m2p = (m: number) => m / METROS;

  /* ——— Coreografía: todo ocurre cuando el retículo cruza cada metro ——— */
  const ringS = useTransform(p, [m2p(356), m2p(378)], [0.4, 2.6]);
  const ringO = useTransform(p, [m2p(356), m2p(364), m2p(380)], [0, 0.9, 0]);
  const lpA = useTransform(p, [m2p(380), m2p(412)], [0, 1]); // asciende: caravana → nube
  const lpB = useTransform(p, [m2p(426), m2p(447)], [0, 1]); // desciende: nube → teléfono
  const cloudO = useTransform(p, [m2p(368), m2p(400)], [0.15, 1]);
  const r1 = useTransform(p, [m2p(412), m2p(417)], [0, 1]);
  const r2 = useTransform(p, [m2p(417), m2p(422)], [0, 1]);
  const r3 = useTransform(p, [m2p(422), m2p(427)], [0, 1]);
  const phoneO = useTransform(p, [m2p(447), m2p(462)], [0, 1]);
  const flash = useTransform(p, [m2p(452), m2p(458), m2p(468)], [0, 0.9, 0]);
  const hintO = useTransform(p, [0, m2p(10)], [1, 0]);
  const metroTxt = useTransform(
    p,
    (v) => `m ${String(Math.min(METROS, Math.round(v * METROS))).padStart(3, "0")}`
  );

  /* Pulsos de datos sobre la línea de ascenso/descenso */
  useMotionValueEvent(p, "change", (v) => {
    const place = (
      pathEl: SVGPathElement | null,
      dot: SVGCircleElement | null,
      fromM: number,
      toM: number
    ) => {
      if (!pathEl || !dot || !pathEl.getAttribute("d")) return;
      const from = m2p(fromM);
      const to = m2p(toM);
      if (v <= from || v >= to) {
        dot.setAttribute("opacity", "0");
        return;
      }
      const pt = pathEl.getPointAtLength(pathEl.getTotalLength() * ((v - from) / (to - from)));
      dot.setAttribute("cx", `${pt.x}`);
      dot.setAttribute("cy", `${pt.y}`);
      dot.setAttribute("opacity", "1");
    };
    place(pathARef.current, pulseARef.current, 382, 410);
    place(pathBRef.current, pulseBRef.current, 428, 446);
  });

  /* Escala + medición de anclas para el ascenso vertical */
  useEffect(() => {
    const onResize = () => {
      setM(window.innerWidth < 1024 ? 7 : 12);
      measure();
    };
    const measure = () => {
      const region = regionRef.current;
      if (!region || !tagRef.current || !cloudRef.current || !phoneTopRef.current) return;
      const rr = region.getBoundingClientRect();
      const c = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - rr.left, y: r.top + r.height / 2 - rr.top };
      };
      const a = c(tagRef.current); // caravana
      const n = c(cloudRef.current); // base de la nube
      const t = c(phoneTopRef.current); // parte superior del teléfono
      setPaths({
        a: `M ${a.x} ${a.y} C ${a.x + 30} ${(a.y + n.y) / 2} ${n.x - 26} ${n.y + 30} ${n.x} ${n.y}`,
        b: `M ${n.x + 18} ${n.y} C ${n.x + 40} ${(n.y + t.y) / 2} ${t.x - 20} ${t.y - 34} ${t.x} ${t.y}`,
      });
    };
    measure();
    const t1 = window.setTimeout(measure, 500);
    window.addEventListener("resize", onResize);
    window.addEventListener("load", measure);
    return () => {
      window.clearTimeout(t1);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", measure);
    };
  }, [M]);

  /* Caminar: la rueda vertical mueve el mundo en horizontal, con inercia */
  useEffect(() => {
    const el = worldRef.current;
    if (!el) return;
    let target = el.scrollLeft;
    let raf = 0;
    const max = () => el.scrollWidth - el.clientWidth;
    const tick = () => {
      const diff = target - el.scrollLeft;
      if (Math.abs(diff) > 0.5) {
        el.scrollLeft += diff * (reduced ? 1 : 0.14);
        raf = requestAnimationFrame(tick);
      } else {
        el.scrollLeft = target;
        raf = 0;
      }
    };
    const go = (d: number) => {
      target = Math.max(0, Math.min(max(), target + d));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      go(d * 1.4);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(220);
      else if (e.key === "ArrowLeft") go(-220);
      else if (e.key === "Home") go(-max());
      else if (e.key === "End") go(max());
      else return;
      e.preventDefault();
    };
    const onScroll = () => {
      if (!raf) target = el.scrollLeft; // sincroniza con swipe táctil nativo
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll);
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const setPeso = (v: number) => {
    setDatos((d) => ({ ...d, peso: v }));
    setTocado((t) => ({ ...t, peso: true }));
  };
  const setCc = (v: number) => {
    setDatos((d) => ({ ...d, cc: v }));
    setTocado((t) => ({ ...t, cc: true }));
  };
  const setEst = (v: string) => {
    setDatos((d) => ({ ...d, est: v }));
    setTocado((t) => ({ ...t, est: true }));
  };

  const filasNube = [
    { label: "PESO", valor: `${datos.peso} kg`, op: reduced ? 1 : r1 },
    { label: "COND. CORPORAL", valor: datos.cc.toFixed(1), op: reduced ? 1 : r2 },
    { label: "ESTABLECIMIENTO", valor: datos.est, op: reduced ? 1 : r3 },
  ];

  return (
    <main className="h-screen overflow-hidden bg-tinta font-grotesca text-marfil">
      {/* ————— EL MUNDO: 900 metros de transecta ————— */}
      <div
        ref={worldRef}
        className="h-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Transecta: 900 metros de campo. Usá la rueda, las flechas o deslizá para caminar."
      >
        <div className="relative h-full" style={{ width: `calc(100vw + ${METROS * M}px)` }}>
          {/* Tierra */}
          <div className="absolute inset-x-0 bottom-0 top-[55%] bg-[#0A0D12]" aria-hidden="true" />

          {/* El horizonte: nace en m 0 y muere en m 860 */}
          <div
            aria-hidden="true"
            className="absolute top-[55%] h-[2px] bg-celeste/80"
            style={{ left: "50vw", width: 860 * M }}
          />
          {/* Regla: ticks cada 5 m */}
          <div
            aria-hidden="true"
            className="absolute h-2"
            style={{
              left: "50vw",
              width: 860 * M,
              top: "calc(55% - 3px)",
              background: `repeating-linear-gradient(to right, rgba(142,201,241,0.35) 0 1px, transparent 1px ${5 * M}px)`,
            }}
          />
          {/* Numeración cada 100 m */}
          {[0, 100, 200, 300, 400, 500, 600, 700, 800].map((m) => (
            <span
              key={m}
              aria-hidden="true"
              className="absolute -translate-x-1/2 font-tecnica text-[9px] tracking-[0.1em] text-celeste/40"
              style={{ left: at(m), top: "calc(55% + 12px)" }}
            >
              {String(m).padStart(3, "0")}
            </span>
          ))}

          {/* ——— m 0: origen ——— */}
          <div className="absolute" style={{ left: at(2), bottom: "calc(45% + 14px)" }}>
            <p className="font-editorial text-2xl font-light text-marfil">+CríaUY</p>
          </div>
          <div
            className="absolute font-tecnica text-[9px] leading-relaxed tracking-[0.1em] text-celeste/50"
            style={{ left: at(2), top: "calc(55% + 26px)" }}
          >
            34°54′S 56°10′W
            <br />
            MONTEVIDEO · URUGUAY
          </div>
          <motion.p
            style={{ opacity: hintO, left: at(2) }}
            className="absolute top-[62%] font-tecnica text-[10px] tracking-[0.2em] text-sol"
          >
            CAMINÁ →
          </motion.p>

          {/* El sol: un solo punto amarillo, bajo, que queda atrás */}
          <div
            aria-hidden="true"
            className="absolute h-3 w-3 rounded-full bg-sol"
            style={{ left: at(90), top: "30%" }}
          />

          {/* ——— El titular es una distancia: se lee caminando ——— */}
          <p
            className="absolute whitespace-nowrap font-editorial font-light leading-none text-marfil"
            style={{ left: at(40), bottom: "45%", fontSize: "clamp(3rem, 15vh, 11rem)" }}
          >
            EL CAMPO
          </p>
          <p
            className="absolute whitespace-nowrap font-editorial font-light leading-none text-marfil"
            style={{ left: at(118), bottom: "45%", fontSize: "clamp(3rem, 15vh, 11rem)" }}
          >
            COBRA
          </p>
          <p
            className="absolute whitespace-nowrap font-editorial font-light italic leading-none text-celeste"
            style={{ left: at(178), bottom: "45%", fontSize: "clamp(3rem, 15vh, 11rem)" }}
          >
            VIDA.
          </p>

          {/* ——— Anotaciones de campo ——— */}
          <div className="absolute" style={{ left: at(238), bottom: "45%" }}>
            <div className="w-[190px]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="/images/field-detail.jpg"
                  alt="Textura del campo observada de cerca"
                  className="duotono h-full w-full object-cover"
                />
                <div className="duotono-tinte absolute inset-0" aria-hidden="true" />
              </div>
            </div>
          </div>
          <p
            className="absolute font-tecnica text-[9px] tracking-[0.12em] text-marfil/50"
            style={{ left: at(238), top: "calc(55% + 26px)" }}
          >
            OBSERVAMOS ANTES DE CONSTRUIR.
          </p>
          <div className="absolute" style={{ left: at(300), top: "calc(55% + 26px)" }}>
            <div className="mb-2 h-3 w-px bg-sol/70" aria-hidden="true" />
            <p className="font-tecnica text-[9px] tracking-[0.12em] text-marfil/50">
              ACÁ, NINGUNA HERRAMIENTA CALZABA.
            </p>
          </div>

          {/* ——— m 340: EL ANIMAL, parado sobre el horizonte ——— */}
          <div className="absolute" style={{ left: at(340), bottom: "45%" }}>
            <div className="relative" style={{ width: "min(560px, 78vw)" }}>
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src="/images/cow-profile-reddish.png"
                  alt="Animal Angus de perfil completo, parado sobre la línea del horizonte"
                  className="duotono h-full w-full object-cover"
                />
                <div className="duotono-tinte absolute inset-0" aria-hidden="true" />
                <div className="duotono-luz absolute inset-0" aria-hidden="true" />
              </div>
              {/* Caravana: el punto exacto donde el dato abandona el cuerpo */}
              <div ref={tagRef} className="absolute h-0 w-0" style={{ left: "69.7%", top: "20.7%" }}>
                <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-sol" aria-hidden="true" />
              </div>
              <motion.span
                style={{ scale: reduced ? 0 : ringS, opacity: reduced ? 0 : ringO, left: "69.7%", top: "20.7%" }}
                className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sol"
                aria-hidden="true"
              />
              <p className="absolute -bottom-6 left-0 font-tecnica text-[9px] tracking-[0.1em] text-celeste/50">
                CARAVANA 042 · ANGUS
              </p>
            </div>
          </div>

          {/* Lector RFID, parado sobre la línea */}
          <div className="absolute" style={{ left: at(392), bottom: "45%" }}>
            <svg viewBox="0 0 80 90" className="w-[54px]" fill="none" aria-hidden="true">
              <g stroke="#8EC9F1" strokeWidth="1.5" strokeLinecap="round">
                <rect x="26" y="34" width="28" height="48" rx="4" />
                <rect x="31" y="41" width="18" height="11" rx="1" />
                <circle cx="40" cy="64" r="4.5" />
                <line x1="36" y1="76" x2="44" y2="76" />
                <path d="M20 26 a18 18 0 0 1 14 -14" />
                <path d="M14 32 a28 28 0 0 1 22 -22" opacity="0.6" />
                <path d="M8 38 a38 38 0 0 1 30 -30" opacity="0.3" />
              </g>
              <circle cx="40" cy="45" r="1.6" fill="#F0C542" />
            </svg>
            <p className="mt-1 font-tecnica text-[8px] tracking-[0.1em] text-celeste/50">
              RFID 134.2 kHz
            </p>
          </div>

          {/* Instrumentos: a pie de transecta, sobre la tierra */}
          <div className="absolute w-[290px]" style={{ left: at(418), top: "calc(55% + 5vh)" }}>
            <Controles datos={datos} tocado={tocado} onPeso={setPeso} onCc={setCc} onEst={setEst} />
          </div>

          {/* ——— LA NUBE: lo único que habita el cielo ——— */}
          <motion.div
            style={{ opacity: reduced ? 1 : cloudO, left: at(402) }}
            className="absolute top-[9%] w-[150px]"
          >
            <svg viewBox="0 0 120 70" className="w-full" fill="none" aria-hidden="true">
              <path
                d="M28 56 H92 a16 16 0 0 0 2 -31.9 A24 24 0 0 0 48 14 a20 20 0 0 0 -20 24 A15 15 0 0 0 28 56 Z"
                stroke="#8EC9F1"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <div ref={cloudRef} className="mx-auto h-0 w-0" aria-hidden="true" />
            <div className="mt-3 space-y-1 border-t border-marfil/15 pt-2" aria-live="polite">
              {filasNube.map((f) => (
                <motion.p
                  key={f.label}
                  style={{ opacity: f.op }}
                  className="flex justify-between font-tecnica text-[9px] tracking-[0.06em]"
                >
                  <span className="text-marfil/55">{f.label}</span>
                  <span className="text-celeste">{f.valor}</span>
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* ——— EL TELÉFONO: la decisión, también parada sobre la línea ——— */}
          <div className="absolute" style={{ left: at(468), bottom: "45%" }}>
            <div ref={phoneTopRef} className="absolute -top-1 left-1/2 h-0 w-0" aria-hidden="true" />
            <motion.div style={{ opacity: flash }} className="absolute -inset-2 rounded-[1.6rem] border-2 border-verde" aria-hidden="true" />
            <div className="w-[108px] rounded-[1.4rem] border border-marfil/25 bg-tinta p-3">
              <motion.div style={{ opacity: reduced ? 1 : phoneO }} aria-live="polite">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-verde" aria-hidden="true" />
                  <span className="font-tecnica text-[11px] text-verde">trazaNet</span>
                </div>
                <div className="h-px w-full bg-marfil/15" aria-hidden="true" />
                <div className="mt-2 space-y-1 font-tecnica text-[8px] leading-relaxed text-marfil/85">
                  <p>ANIMAL — 042</p>
                  <p>PESO — {datos.peso} kg</p>
                  <p>CONDICIÓN — {datos.cc.toFixed(1)}</p>
                  <p>EST. — {datos.est}</p>
                </div>
                <p className="mt-2 font-tecnica text-[7px] tracking-[0.08em] text-verde/70">
                  ● SINCRONIZADO · AHORA
                </p>
              </motion.div>
            </div>
          </div>

          {/* ——— LO ÚNICO VERTICAL DE LA PÁGINA: el dato sube y baja ——— */}
          <div
            ref={regionRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 h-full"
            style={{ left: at(330), width: 170 * M }}
          >
            <svg className="h-full w-full overflow-visible">
              <motion.path
                ref={pathARef}
                d={paths.a}
                fill="none"
                stroke="#8EC9F1"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ pathLength: reduced ? 1 : lpA }}
              />
              <motion.path
                ref={pathBRef}
                d={paths.b}
                fill="none"
                stroke="#8EC9F1"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ pathLength: reduced ? 1 : lpB }}
              />
              <circle ref={pulseARef} r="4" fill="#F0C542" opacity="0" />
              <circle ref={pulseBRef} r="4" fill="#F0C542" opacity="0" />
            </svg>
          </div>

          {/* ——— m 505: la moraleja, caminada ——— */}
          <p
            className="absolute whitespace-nowrap font-editorial font-light italic leading-none text-marfil/85"
            style={{ left: at(505), bottom: "45%", fontSize: "clamp(1.6rem, 6vh, 4rem)" }}
          >
            El animal. El dato. La decisión.
          </p>

          {/* ——— m 600: la prueba ——— */}
          <div className="absolute" style={{ left: at(600), bottom: "45%" }}>
            <div className="relative aspect-[16/10] overflow-hidden" style={{ width: "min(480px, 70vw)" }}>
              <img
                src="/images/cow-field-herd.png"
                alt="Rodeo Angus pastando al atardecer en la pampa uruguaya"
                className="duotono h-full w-full object-cover"
              />
              <div className="duotono-tinte absolute inset-0" aria-hidden="true" />
            </div>
          </div>
          <p
            className="absolute font-tecnica text-[9px] tracking-[0.12em] text-marfil/50"
            style={{ left: at(600), top: "calc(55% + 26px)" }}
          >
            PROBADO DONDE TIENE QUE FUNCIONAR.
          </p>
          <div className="absolute" style={{ left: at(700), top: "calc(55% + 26px)" }}>
            <div className="mb-2 h-3 w-px bg-sol/70" aria-hidden="true" />
            <p className="font-tecnica text-[9px] tracking-[0.12em] text-marfil/50">HECHO A MEDIDA.</p>
          </div>
          <p
            className="absolute font-tecnica text-[9px] tracking-[0.12em] text-marfil/50"
            style={{ left: at(760), top: "calc(55% + 26px)" }}
          >
            CONSTRUIDO DESDE ADENTRO DEL PROBLEMA.
          </p>

          {/* ——— m 860: la línea termina en la firma ——— */}
          <div aria-hidden="true">
            <div
              className="absolute h-[2px] w-6 bg-celeste"
              style={{ left: `calc(${at(860)} - 12px)`, top: "calc(55% - 1px)" }}
            />
            <div
              className="absolute h-6 w-[2px] bg-celeste"
              style={{ left: `calc(${at(860)} - 1px)`, top: "calc(55% - 12px)" }}
            />
          </div>
          <p
            className="absolute whitespace-nowrap font-editorial font-light leading-none text-marfil"
            style={{ left: at(868), bottom: "calc(45% + 10px)", fontSize: "clamp(2.2rem, 8vh, 5rem)" }}
          >
            +Cría<em className="italic text-celeste">UY</em>
          </p>
          <div
            className="absolute font-tecnica text-[10px] leading-loose tracking-[0.14em]"
            style={{ left: at(868), top: "calc(55% + 20px)" }}
          >
            <p className="text-marfil/60">HECHO A MEDIDA EN URUGUAY</p>
            <a
              href="mailto:hola@mascriauy.com"
              className="text-celeste underline decoration-sol/60 underline-offset-4 transition-colors hover:text-sol focus-visible:outline focus-visible:outline-1 focus-visible:outline-sol"
            >
              conversemos → hola@mascriauy.com
            </a>
            <p className="mt-6 text-[8px] text-celeste/40">FIN DE LA TRANSECTA — 900 M</p>
          </div>
        </div>
      </div>

      {/* ————— HUD: el observador ————— */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <p className="absolute left-6 top-6 font-tecnica text-[10px] tracking-[0.12em] text-marfil/50">
          +CríaUY
        </p>
        <p className="absolute right-6 top-6 font-tecnica text-[9px] tracking-[0.12em] text-celeste/40">
          LA TRANSECTA
        </p>
        {/* Retículo del observador: vos estás acá, el campo se mueve */}
        <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2">
          <div className="mx-auto h-4 w-[2px] bg-sol" />
        </div>
        <motion.p className="absolute left-1/2 top-[58%] -translate-x-1/2 font-tecnica text-[10px] tracking-[0.14em] text-sol">
          {metroTxt}
        </motion.p>
      </div>
      <p className="sr-only">
        Recorrido horizontal de 900 metros. Al caminar vas a encontrar, en orden: el titular, un
        animal con sus datos configurables, la captura RFID, la nube que procesa, el teléfono con
        TrazaNet, la prueba de campo y los datos de contacto de +CríaUY.
      </p>
    </main>
  );
}
