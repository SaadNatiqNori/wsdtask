import HeroSustainable from './HeroSustainable'
import CardsSection from './CardsSection'
import PortfolioSlider from './PortfolioSlider'
import MissionVisionValues from './MissionVisionValues'

function HomePage() {
  return (
    <>
      <HeroSustainable />
      <CardsSection />
      <PortfolioSlider />
      {/* The navy contact footer is the final rising layer inside
          MissionVisionValues, so it is not rendered standalone here. */}
      <MissionVisionValues />
    </>
  )
}

export default HomePage
