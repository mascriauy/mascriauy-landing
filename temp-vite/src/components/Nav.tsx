import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { List, X } from '@phosphor-icons/react'

const links = [
  { label: 'Inicio', href: 'index.html' },
  { label: 'Tecnologías', href: 'propuestas.html' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-bg/80 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-12 h-[72px] flex items-center justify-between">
        <a
          href="index.html"
          className="font-sans font-bold text-xl tracking-tight transition-colors duration-300"
        >
          <span className="text-accent">+</span>
          <span className="text-fg">Cría</span>
          <span className="text-sky">UY</span>
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="relative group py-1 text-fg/70 hover:text-fg transition-colors duration-200"
              >
                {link.label}
                <span className="absolute left-0 -bottom-0.5 w-0 h-[1.5px] bg-accent transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden p-2 text-fg"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-[72px] inset-x-0 bg-surface border-b border-border px-6 py-6"
          >
            <ul className="flex flex-col gap-4 text-lg font-semibold text-fg">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
