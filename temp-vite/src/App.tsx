import { useState } from 'react'
import Intro from './components/Intro'
import CustomCursor from './components/CustomCursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import RoadmapOrbital from './components/RoadmapOrbital'
import Pillars from './components/Pillars'
import Marquee from './components/Marquee'
import Contact from './components/Contact'
import Footer from './components/Footer'

const marqueeItems = [
  'Trazabilidad',
  'Ganadería',
  'Uruguay',
  'Innovación',
  'Campo',
  'Datos',
  'trazaNet',
  'Tecnología',
]

function App() {
  const [introDone, setIntroDone] = useState(false)

  return (
    <>
      {!introDone && <Intro onComplete={() => setIntroDone(true)} />}
      <CustomCursor />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <RoadmapOrbital />
        <Pillars />
        <Marquee
          items={marqueeItems}
          className="py-14 md:py-20 bg-surface text-fg/90 border-y border-border"
          itemClassName="font-sans text-4xl md:text-6xl font-light tracking-tight"
        />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
