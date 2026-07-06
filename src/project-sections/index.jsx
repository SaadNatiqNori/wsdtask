import ProjectHero from './ProjectHero'
import ProjectBanner from './ProjectBanner'
import ProjectStatement from './ProjectStatement'
import ProjectGallery from './ProjectGallery'
import ProjectLocation from './ProjectLocation'
import ProjectFeatures from './ProjectFeatures'

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
}

// Renders an ordered list of section objects (as returned by the CMS/backend).
export function ProjectSections({ sections = [], project }) {
  return (
    <>
      {sections.map((section, index) => {
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
            {...section}
          />
        )
      })}
    </>
  )
}

export default ProjectSections
