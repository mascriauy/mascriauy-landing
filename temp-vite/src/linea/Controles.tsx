export type Datos = { peso: number; cc: number; est: string };
export type Tocado = { peso: boolean; cc: boolean; est: boolean };

const ESTABLECIMIENTOS = ["El Mangrullo", "La Esperanza", "Santa Rosa"];

/**
 * Instrumentos de campo. No son un formulario: son las tres perillas
 * que el operario ajusta junto al animal, a pie de transecta.
 */
export default function Controles({
  datos,
  tocado,
  onPeso,
  onCc,
  onEst,
}: {
  datos: Datos;
  tocado: Tocado;
  onPeso: (v: number) => void;
  onCc: (v: number) => void;
  onEst: (v: string) => void;
}) {
  const nota = (t: boolean) =>
    t ? (
      <span className="text-sol">modificado</span>
    ) : (
      <span className="text-celeste/50">valor de campo</span>
    );

  return (
    <div className="space-y-5">
      {/* PESO */}
      <div>
        <div className="mb-1 flex items-baseline justify-between font-tecnica text-[10px] tracking-[0.1em]">
          <label htmlFor="peso" className="text-marfil/70">
            PESO
          </label>
          {nota(tocado.peso)}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-editorial text-3xl font-light text-marfil">{datos.peso}</span>
          <span className="font-tecnica text-[10px] text-celeste/60">kg</span>
        </div>
        <input
          id="peso"
          type="range"
          min={250}
          max={600}
          step={1}
          value={datos.peso}
          onChange={(e) => onPeso(Number(e.target.value))}
          className="instrumento mt-1"
          aria-label={`Peso del animal: ${datos.peso} kilogramos`}
        />
        <div className="flex justify-between font-tecnica text-[8px] text-celeste/40" aria-hidden="true">
          <span>250</span>
          <span>350</span>
          <span>450</span>
          <span>600</span>
        </div>
      </div>

      {/* CONDICIÓN CORPORAL */}
      <div>
        <div className="mb-1 flex items-baseline justify-between font-tecnica text-[10px] tracking-[0.1em]">
          <span className="text-marfil/70" id="cc-label">
            CONDICIÓN CORPORAL
          </span>
          {nota(tocado.cc)}
        </div>
        <div className="flex items-center gap-3" role="group" aria-labelledby="cc-label">
          <button
            type="button"
            onClick={() => onCc(Math.max(1, datos.cc - 0.5))}
            className="border border-marfil/25 px-2.5 py-0.5 font-tecnica text-sm text-marfil/80 transition-colors hover:border-sol hover:text-sol focus-visible:outline focus-visible:outline-1 focus-visible:outline-sol"
            aria-label="Disminuir condición corporal"
          >
            −
          </button>
          <span className="w-12 text-center font-editorial text-3xl font-light text-marfil">
            {datos.cc.toFixed(1)}
          </span>
          <button
            type="button"
            onClick={() => onCc(Math.min(5, datos.cc + 0.5))}
            className="border border-marfil/25 px-2.5 py-0.5 font-tecnica text-sm text-marfil/80 transition-colors hover:border-sol hover:text-sol focus-visible:outline focus-visible:outline-1 focus-visible:outline-sol"
            aria-label="Aumentar condición corporal"
          >
            +
          </button>
          <span className="font-tecnica text-[8px] text-celeste/40">ESC. 1–5</span>
        </div>
      </div>

      {/* ESTABLECIMIENTO */}
      <div>
        <div className="mb-1.5 flex items-baseline justify-between font-tecnica text-[10px] tracking-[0.1em]">
          <span className="text-marfil/70" id="est-label">
            ESTABLECIMIENTO
          </span>
          {nota(tocado.est)}
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="est-label">
          {ESTABLECIMIENTOS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => onEst(e)}
              aria-pressed={datos.est === e}
              className={`border px-2.5 py-1 font-tecnica text-[10px] tracking-[0.06em] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-sol ${
                datos.est === e
                  ? "border-sol text-sol"
                  : "border-marfil/20 text-marfil/60 hover:border-marfil/50 hover:text-marfil"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
