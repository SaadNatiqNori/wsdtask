import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './Navbar'
import HomePage from './HomePage'
import ProjectPage from './ProjectPage'
import SubsidiariesPage from './SubsidiariesPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="/subsidiaries" element={<SubsidiariesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
