import { IoChevronDownOutline } from 'react-icons/io5'
import logo from './assets/Logo.svg'

function App() {
  return (
    <main className="min-h-screen bg-[#161b2b] px-8 pb-12 pt-5 text-[#d6deea]">
      <header className="mb-[clamp(2rem,6vw,4.5rem)] flex justify-center">
        <nav
          className="flex w-full max-w-[480px] items-center gap-6 rounded-[8px] border border-white/10 bg-[rgba(20,25,41,0.42)] px-[0.7rem] py-[0.45rem] backdrop-blur-[2px]"
          aria-label="Main navigation"
        >
          <a href="#" className="no-underline">
            <img src={logo} alt="Alcove" className="h-[1.2rem] w-auto" />
          </a>

          <ul className="ml-[0.55rem] hidden list-none items-center gap-6 p-0 md:flex">
            <li>
              <a
                href="#"
                className="inline-flex items-center gap-[0.3rem] whitespace-nowrap font-['Akkurat_Mono',monospace] text-[10px] font-medium leading-none text-[#d5dee9] no-underline"
              >
                ABOUT
              </a>
            </li>
            <li>
              <a
                href="#"
                className="inline-flex items-center gap-[0.3rem] whitespace-nowrap font-['Akkurat_Mono',monospace] text-[10px] font-medium leading-none text-[#d5dee9] no-underline"
              >
                SUBSIDIARIES{' '}
                <IoChevronDownOutline
                  className="translate-y-[0.5px] text-[0.9em] leading-none"
                  aria-hidden="true"
                />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="inline-flex items-center gap-[0.3rem] whitespace-nowrap font-['Akkurat_Mono',monospace] text-[10px] font-medium leading-none text-[#d5dee9] no-underline"
              >
                PROJECTS{' '}
                <IoChevronDownOutline
                  className="translate-y-[0.5px] text-[0.9em] leading-none"
                  aria-hidden="true"
                />
              </a>
            </li>
          </ul>

          <a
            href="#"
            className="ml-auto whitespace-nowrap rounded-full bg-[#cfd7e1] px-3 py-[0.65rem] font-['Akkurat_Mono',monospace] text-[10px] font-medium leading-none tracking-[0] text-[#191f2f] no-underline md:px-4"
          >
            CONTACT
          </a>
        </nav>
      </header>

      <section className="mx-auto max-w-[1300px]" aria-label="Company introduction">
        <p className="m-0 animate-slide-up text-[clamp(2rem,8vw,58px)] font-normal not-italic leading-[120%] tracking-[-0.01em] md:text-[58px]">
          Alcove is a forward-thinking company specializing in real estate{' '}
          <span className="text-[#ECD898]" style={{ fontFamily: "'Season Mix-TRIAL', serif" }}>Development</span> management of{' '}
          <span className="text-[#ECD898]" style={{ fontFamily: "'Season Mix-TRIAL', serif" }}>Properties</span> and{' '}
          <span className="text-[#ECD898]" style={{ fontFamily: "'Season Mix-TRIAL', serif" }}>Construction</span> services in Erbil, Kurdistan Region. With a
          commitment to building modern, sustainable, and innovative spaces, Alcove is shaping
          the future of urban living in the region.
        </p>
      </section>
    </main>
  )
}

export default App
