import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cubicEase } from '../easings'
import { prefersReducedMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

// Section type: "features"
// A stack of full-width groups. Each group: a big serif title on the left, and
// a list of feature rows (title + description) on the right, separated by thin
// rules. Descriptions are supplied as segments so keywords can be emphasised /
// underlined (CMS-friendly). Groups can each carry their own background.
function ProjectFeatures({ groups = [] }) {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-feat-group]').forEach((group) => {
        gsap.from(group.querySelectorAll('[data-feat-item]'), {
          opacity: 0,
          y: 36,
          duration: 1,
          ease: cubicEase,
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: 'top 78%' },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="bg-[#E6EBF0] text-[#1C1F2A]"
      style={{ fontFamily: "'Season Sans-TRIAL', sans-serif" }}
    >
      {groups.map((group, gi) => (
        <div
          key={group.title ?? gi}
          data-feat-group
          className="w-full"
          style={{ backgroundColor: group.bg ?? '#E6EBF0' }}
        >
          <div className="mx-auto max-w-[1760px] border-t border-[#1C2436]/15 px-6 py-14 md:px-14 md:py-20">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,2.55fr)] md:gap-16">
              {/* Title column */}
              <div data-feat-item>
                <h2
                  className="m-0 whitespace-pre-line text-[40px] md:text-[52px] font-normal leading-[1.05] tracking-[-0.01em] text-[#1C1F2A]"
                  style={{ fontFamily: "'Season Mix-TRIAL', serif" }}
                >
                  {group.title}
                </h2>
                {group.subtitle && (
                  <p className="m-0 mt-5 text-[15px] leading-[1.5] text-[#5A6472]">
                    {group.subtitle}
                  </p>
                )}
              </div>

              {/* Rows column */}
              <div>
                {group.rows.map((row, ri) => (
                  <div
                    key={row.feature ?? ri}
                    data-feat-item
                    className="grid grid-cols-1 gap-3 border-b border-[#1C2436]/15 py-8 first:pt-0 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-12 md:first:pt-0"
                  >
                    <h3 className="group m-0 self-start text-[24px] md:text-[34px] font-normal leading-[1.15] tracking-[-0.01em] text-[#1C1F2A]">
                      <span className="cursor-default decoration-[#5B8DBF] decoration-2 underline-offset-[10px] transition-all duration-200 group-hover:underline">
                        {row.feature}
                      </span>
                    </h3>
                    <p className="m-0 self-start text-[14px] md:text-[15px] leading-[1.5] text-[#5A6472]">
                      {row.description.map((seg, si) => {
                        const cls = [
                          seg.bold && 'font-semibold text-[#1C1F2A]',
                          seg.underline && 'underline underline-offset-2',
                        ]
                          .filter(Boolean)
                          .join(' ')
                        return (
                          <span key={si} className={cls || undefined}>
                            {seg.text}
                          </span>
                        )
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

export default ProjectFeatures
