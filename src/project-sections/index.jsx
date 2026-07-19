import ProjectHero from './ProjectHero'
import ProjectBanner from './ProjectBanner'
import ProjectOpening from './ProjectOpening'
import ProjectStatement from './ProjectStatement'
import ProjectGallery from './ProjectGallery'
import ProjectLocation from './ProjectLocation'
import ProjectFeatures from './ProjectFeatures'
import ProjectOverview from './ProjectOverview'
import ProjectShowcase from './ProjectShowcase'
import ProjectServices from './ProjectServices'

// Registry: CMS section `type` → component.
// Each component is self-contained (owns its layout AND its animation), so a
// project's layout is simply the ordered list of sections it declares. To
// support a new section type, add its component here — nothing else changes.
const SECTION_COMPONENTS = {
  hero: ProjectHero,
  banner: ProjectBanner,
  statement: ProjectStatement,
  gallery: ProjectGallery,
  location: ProjectLocation,
  features: ProjectFeatures,
  overview: ProjectOverview,
  showcase: ProjectShowcase,
  services: ProjectServices,
}

// Renders an ordered list of section objects (as returned by the CMS/backend).
export function ProjectSections({ sections = [], project }) {
  const isOpening =
    sections[0]?.type === 'hero' && sections[1]?.type === 'banner'
  const rendered = sections.map((section, index) => {
    const Component = SECTION_COMPONENTS[section.type]
    if (!Component) {
      if (import.meta.env.DEV) {
        console.warn(`[ProjectSections] Unknown section type: "${section.type}"`)
      }
      return null
    }
    return (
      <Component
        key={section.id ?? `${section.type}-${index}`}
        index={index}
        project={project}
        locked={!(isOpening && index < 2)}
        {...section}
      />
    )
  })

  // When a layout opens with hero → banner, compose the pair as the opening
  // screen: hero copy on top, banner box pinned to the fold, and (on desktop)
  // the scale-into-fullscreen reveal scrubbed continuously by the page's
  // normal smooth scroll.
  if (sections[0]?.type === 'hero' && sections[1]?.type === 'banner') {
    return (
      <>
        <ProjectOpening hero={rendered[0]} banner={rendered[1]} />
        {rendered.slice(2)}
      </>
    )
  }

  return <>{rendered}</>
}

export default ProjectSections
