import { useLenis } from './SmoothScroll'
import { useSectionSnap } from './useSectionSnap'
import HeroSustainable from './HeroSustainable'
import CardsSection from './CardsSection'
import PortfolioSlider from './PortfolioSlider'
import MissionVisionValues from './MissionVisionValues'
import ContactSection from './ContactSection'

function HomePage() {
  // The home page shares the app-wide Lenis instance (configured in home mode:
  // smoothWheel off), and layers the shared section-snap engine on top of it.
  const lenis = useLenis()
  useSectionSnap(lenis)

  return (
    <>
      <HeroSustainable />
      <CardsSection />
      <PortfolioSlider />
      <MissionVisionValues />
      <ContactSection />
    </>
  )
}

export default HomePage
