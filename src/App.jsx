import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './Navbar'
import HomePage from './HomePage'
import ProjectsListPage from './ProjectsListPage'
import ProjectPage from './ProjectPage'
import SubsidiariesPage from './SubsidiariesPage'
import AboutPage from './AboutPage'
import ContactPage from './ContactPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsListPage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="/subsidiaries" element={<SubsidiariesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
