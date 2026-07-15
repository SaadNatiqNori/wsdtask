import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { SmoothScrollProvider } from './SmoothScroll'
import Navbar from './Navbar'
import Seo from './Seo'
import HomePage from './HomePage'
import ProjectsListPage from './ProjectsListPage'
import ProjectPage from './ProjectPage'
import SubsidiariesPage from './SubsidiariesPage'
import AboutPage from './AboutPage'
import ContactPage from './ContactPage'
import PrivacyPolicyPage from './PrivacyPolicyPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Seo />
                <HomePage />
              </>
            }
          />
          <Route
            path="/projects"
            element={
              <>
                <Seo
                  title="Our Projects"
                  description="Explore Alcove's portfolio of real estate developments across Erbil and the Kurdistan Region — mixed-use, residential, commercial and industrial projects."
                />
                <ProjectsListPage />
              </>
            }
          />
          {/* ProjectPage renders its own <Seo> from the loaded project data. */}
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route
            path="/subsidiaries"
            element={
              <>
                <Seo
                  title="Our Subsidiaries"
                  description="Meet the companies of the Alcove group — construction, development and specialised services working together across the Kurdistan Region."
                />
                <SubsidiariesPage />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Seo
                  title="About Us"
                  description="Get to know Alcove — an integrated real estate developer focused on sustainability, value and community in Erbil, Kurdistan Region of Iraq."
                />
                <AboutPage />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Seo
                  title="Contact Us"
                  description="Get in touch with Alcove — visit our office on Baharka Road, Erbil, or send a message about projects, sales and partnerships."
                />
                <ContactPage />
              </>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <>
                <Seo
                  title="Privacy Policy"
                  description="How Alcove collects, uses and protects the information you share with us."
                />
                <PrivacyPolicyPage />
              </>
            }
          />
        </Routes>
      </SmoothScrollProvider>
    </BrowserRouter>
  )
}

export default App
