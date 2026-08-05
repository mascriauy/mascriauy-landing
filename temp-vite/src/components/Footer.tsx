export default function Footer() {
  return (
    <footer className="py-8 bg-bg text-muted border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <a href="index.html" className="font-sans font-bold text-xl tracking-tight">
          <span className="text-accent">+</span>
          <span className="text-fg">Cría</span>
          <span className="text-sky">UY</span>
        </a>

        <div className="flex flex-wrap justify-center gap-6">
          <a href="privacidad.html" className="hover:text-fg transition-colors">
            Privacidad
          </a>
          <a href="terminos-y-condiciones.html" className="hover:text-fg transition-colors">
            Términos y Condiciones
          </a>
          <a href="#" className="hover:text-fg transition-colors">
            Instagram
          </a>
          <a href="#" className="hover:text-fg transition-colors">
            LinkedIn
          </a>
        </div>

        <p className="text-xs">
          © 2026 +CríaUY. Montevideo, Uruguay.
        </p>
      </div>
    </footer>
  )
}
