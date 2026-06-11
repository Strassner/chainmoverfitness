import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LandingPage from './LandingPage.jsx'
import { EarlyWarningPage, MetabolicStressPage, HighRiskPage } from './BucketPage.jsx'
import PostCallPage from './PostCallPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/chainmoverfitness">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<App />} />
        <Route path="/early" element={<EarlyWarningPage />} />
        <Route path="/stress" element={<MetabolicStressPage />} />
        <Route path="/high" element={<HighRiskPage />} />
        <Route path="/booked" element={<PostCallPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
